import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/supabase-db";
import { getSupabase } from "@/lib/supabase";
import fs from "fs";

const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];
const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "products");

function sanitizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-");
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "缺少文件" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json({ error: `不支持的格式 ${ext}，允许：${ALLOWED_EXT.join(" ")}` }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "文件过大（上限 10MB）" }, { status: 400 });
    }

    // 生成文件名
    let filename: string;
    const replacePath = formData.get("replacePath");
    if (typeof replacePath === "string" && replacePath.startsWith("/images/products/") && !replacePath.includes("..")) {
      filename = path.basename(replacePath);
    } else {
      const base = sanitizeName(path.basename(file.name, ext)) || "upload";
      filename = `${base}-${Date.now()}${ext}`;
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 优先上传到 Supabase Storage（线上持久化）
    const sb = getSupabase();
    if (sb) {
      const contentType = file.type || "application/octet-stream";
      const publicUrl = await uploadImage(buffer, filename, contentType);
      return NextResponse.json({ ok: true, url: publicUrl });
    }

    // 降级：写入本地文件系统（本地开发用）
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
    return NextResponse.json({ ok: true, url: `/images/products/${filename}` });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "上传失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
