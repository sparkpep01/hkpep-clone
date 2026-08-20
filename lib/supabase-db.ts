import { getSupabase } from "./supabase";
import {
  readProducts as readProductsFile,
  writeProducts as writeProductsFile,
  Product,
} from "./db";

/**
 * 数据库访问层
 *
 * 优先使用 Supabase（线上持久化），降级到 JSON 文件（本地开发）。
 * 对外接口与 lib/db.ts 完全一致，API 路由无需感知底层差异。
 */

const TABLE = "products";

// ─── 读取 ─────────────────────────────────────────────

export async function readProducts(): Promise<Product[]> {
  const sb = getSupabase();
  if (!sb) return readProductsFile();

  const { data, error } = await sb.from(TABLE).select("*").order("name");
  if (error) {
    console.error("[supabase] readProducts error:", error.message);
    return readProductsFile();
  }
  return (data || []).map(rowToProduct);
}

export async function findProduct(slug: string): Promise<Product | undefined> {
  const sb = getSupabase();
  if (!sb) return readProductsFile().find((p) => p.slug === slug);

  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return undefined;
  return rowToProduct(data);
}

// ─── 写入 ─────────────────────────────────────────────

export async function upsertProduct(product: Product): Promise<Product[]> {
  const sb = getSupabase();
  if (!sb) {
    writeProductsFile(upsertToFile(product));
    return readProductsFile();
  }

  const row = productToRow(product);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await sb.from(TABLE).upsert(row as any, { onConflict: "slug" });
  if (error) throw new Error(`upsertProduct: ${error.message}`);

  return readProducts();
}

export async function deleteProduct(slug: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) {
    const ok = deleteFromFile(slug);
    return ok;
  }

  const { error, count } = await sb
    .from(TABLE)
    .delete({ count: "exact" })
    .eq("slug", slug);

  if (error) throw new Error(`deleteProduct: ${error.message}`);
  return (count ?? 0) > 0;
}

// ─── 图片上传到 Supabase Storage ──────────────────────

const BUCKET = "product-images";

export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const sb = getSupabase();
  if (!sb) {
    throw new Error("Supabase not configured — cannot upload image");
  }

  const { error } = await sb.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType,
      upsert: true, // 覆盖同名文件
    });

  if (error) throw new Error(`uploadImage: ${error.message}`);

  const { data: urlData } = sb.storage
    .from(BUCKET)
    .getPublicUrl(filename);

  return urlData.publicUrl;
}

// ─── 图片列表 / 删除 ──────────────────────────────────

export interface StorageImage {
  name: string;
  url: string;
  size: number;
  contentType: string;
  updatedAt: string;
}

export async function listImages(folder?: string): Promise<StorageImage[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb.storage
    .from(BUCKET)
    .list(folder || "", {
      sortBy: { column: "name", order: "asc" },
    });

  if (error) {
    console.error("[supabase] listImages error:", error.message);
    return [];
  }

  if (!data) return [];

  return data
    .filter((item) => item.metadata !== null) // 只返回文件，不返回文件夹
    .map((item) => {
      const fullPath = folder ? `${folder}/${item.name}` : item.name;
      const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(fullPath);
      return {
        name: item.name,
        url: urlData.publicUrl,
        size: item.metadata?.size ?? 0,
        contentType: item.metadata?.mimetype ?? "application/octet-stream",
        updatedAt: item.updated_at ?? "",
      };
    });
}

export async function deleteImage(filepath: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.storage.from(BUCKET).remove([filepath]);

  if (error) {
    console.error("[supabase] deleteImage error:", error.message);
    return false;
  }
  return true;
}

// ─── 站点图片管理（site_images 表）─────────────────────

export interface SiteImage {
  section: string;
  slot: number;
  url: string;
  label: string | null;
}

const SITE_TABLE = "site_images";
const SITE_BUCKET = "site-images";

export async function getSiteImages(section?: string): Promise<SiteImage[]> {
  const sb = getSupabase();
  if (!sb) return [];

  let query = sb.from(SITE_TABLE).select("*").order("sort_order", { ascending: true });
  if (section) query = query.eq("section", section);

  const { data, error } = await query;
  if (error) {
    console.error("[supabase] getSiteImages error:", error.message);
    return [];
  }

  return (data || []).map((row) => ({
    section: String(row.section),
    slot: Number(row.slot),
    url: String(row.url),
    label: (row.label as string) || null,
  }));
}

export async function upsertSiteImage(
  section: string,
  slot: number,
  url: string,
  label?: string
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await sb.from(SITE_TABLE).upsert(
    {
      section,
      slot,
      url,
      label: label || null,
      sort_order: slot,
    } as any,
    { onConflict: "section,slot" }
  );

  if (error) {
    console.error("[supabase] upsertSiteImage error:", error.message);
    return false;
  }
  return true;
}

export async function deleteSiteImage(section: string, slot: number): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb
    .from(SITE_TABLE)
    .delete()
    .eq("section", section)
    .eq("slot", slot);

  if (error) {
    console.error("[supabase] deleteSiteImage error:", error.message);
    return false;
  }
  return true;
}

export async function uploadSiteImage(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");

  const { error } = await sb.storage
    .from(SITE_BUCKET)
    .upload(filename, buffer, { contentType, upsert: true });

  if (error) throw new Error(`uploadSiteImage: ${error.message}`);

  const { data: urlData } = sb.storage.from(SITE_BUCKET).getPublicUrl(filename);
  return urlData.publicUrl;
}

// ─── 用户留言（messages 表）──────────────────────────

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const MSG_TABLE = "messages";

export async function createMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error } = await sb.from(MSG_TABLE).insert({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
  });

  if (error) {
    console.error("[supabase] createMessage error:", error.message);
    return false;
  }
  return true;
}

export async function getMessages(): Promise<ContactMessage[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from(MSG_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase] getMessages error:", error.message);
    return [];
  }

  return (data || []).map((row) => ({
    id: Number(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    subject: String(row.subject ?? ""),
    message: String(row.message ?? ""),
    createdAt: String(row.created_at ?? ""),
  }));
}

export async function deleteMessage(id: number): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;

  const { error, count } = await sb
    .from(MSG_TABLE)
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    console.error("[supabase] deleteMessage error:", error.message);
    return false;
  }
  return (count ?? 0) > 0;
}

// ─── 行 ↔ Product 映射 ────────────────────────────────

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    image: String(row.image ?? ""),
    hoverImage: (row.hover_image as string) || undefined,
    category: String(row.category ?? ""),
    price: row.price != null ? Number(row.price) : undefined,
    description: (row.description as string) || undefined,
    spec: (row.spec as string) || undefined,
    purity: (row.purity as string) || undefined,
    form: (row.form as string) || undefined,
    storage: (row.storage as string) || undefined,
  };
}

function productToRow(p: Product): Record<string, string | number | null> {
  return {
    name: p.name,
    slug: p.slug,
    image: p.image,
    hover_image: p.hoverImage || null,
    category: p.category,
    price: p.price ?? 0,
    description: p.description || null,
    spec: p.spec || null,
    purity: p.purity || null,
    form: p.form || null,
    storage: p.storage || null,
  };
}

// ─── 文件降级辅助 ─────────────────────────────────────

function upsertToFile(product: Product): Product[] {
  const products = readProductsFile();
  const idx = products.findIndex((p) => p.slug === product.slug);
  if (idx >= 0) products[idx] = product;
  else products.push(product);
  return products;
}

function deleteFromFile(slug: string): boolean {
  const products = readProductsFile();
  const next = products.filter((p) => p.slug !== slug);
  if (next.length === products.length) return false;
  writeProductsFile(next);
  return true;
}
