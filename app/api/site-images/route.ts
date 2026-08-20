import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getSiteImages,
  upsertSiteImage,
  deleteSiteImage,
  uploadSiteImage,
} from "@/lib/supabase-db";
import path from "path";

const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];

function sanitizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-");
}

// GET /api/site-images?section=xxx — 公开接口，返回站点图片
// 不需要登录，因为前端组件需要读取
export async function GET(request: NextRequest) {
  const section = request.nextUrl.searchParams.get("section") || undefined;
  const images = await getSiteImages(section);
  return NextResponse.json(images);
}

// PUT /api/site-images — 更新某个位置的图片（需要登录）
// body: { section, slot, url, label? }
export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section, slot, url, label } = body;

    if (!section || slot === undefined || !url) {
      return NextResponse.json(
        { error: "缺少 section / slot / url" },
        { status: 400 }
      );
    }

    const ok = await upsertSiteImage(
      String(section),
      Number(slot),
      String(url),
      label ? String(label) : undefined
    );

    if (!ok) {
      return NextResponse.json({ error: "保存失败" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "保存失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/site-images — 上传图片到 site-images 存储桶（需要登录）
// formData: file, section, slot, label?
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const section = formData.get("section") as string;
    const slot = parseInt(formData.get("slot") as string, 10);
    const label = (formData.get("label") as string) || undefined;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "缺少文件" }, { status: 400 });
    }

    if (!section || isNaN(slot)) {
      return NextResponse.json(
        { error: "缺少 section / slot" },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json(
        { error: `不支持的格式 ${ext}` },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "文件过大（上限 10MB）" }, { status: 400 });
    }

    // 生成文件路径：section/slot-timestamp.ext
    const base = sanitizeName(path.basename(file.name, ext)) || "image";
    const filename = `${section}/${base}-${Date.now()}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "application/octet-stream";

    const publicUrl = await uploadSiteImage(buffer, filename, contentType);

    // 同时更新数据库记录
    const ok = await upsertSiteImage(section, slot, publicUrl, label);

    if (!ok) {
      return NextResponse.json(
        { error: "图片已上传但数据库更新失败" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "上传失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/site-images — 删除某个位置的图片记录（需要登录）
// body: { section, slot }
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section, slot } = body;

    if (!section || slot === undefined) {
      return NextResponse.json(
        { error: "缺少 section / slot" },
        { status: 400 }
      );
    }

    const ok = await deleteSiteImage(String(section), Number(slot));

    if (!ok) {
      return NextResponse.json({ error: "删除失败" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "删除失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
