import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listImages, uploadImage } from "@/lib/supabase-db";
import { getSupabase } from "@/lib/supabase";
import path from "path";

const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];

function sanitizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-");
}

// GET /api/images?folder=xxx — 列出存储桶中的图片
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const folder = request.nextUrl.searchParams.get("folder") || undefined;
  const images = await listImages(folder);
  return NextResponse.json(images);
}

// POST /api/images — 上传图片到存储桶
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "缺少文件" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json(
        { error: `不支持的格式 ${ext}，允许：${ALLOWED_EXT.join(" ")}` },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "文件过大（上限 10MB）" }, { status: 400 });
    }

    const sb = getSupabase();
    if (!sb) {
      return NextResponse.json({ error: "Supabase 未配置" }, { status: 500 });
    }

    // 生成文件路径
    const base = sanitizeName(path.basename(file.name, ext)) || "upload";
    const filename = `${base}-${Date.now()}${ext}`;
    const fullPath = folder ? `${folder}/${filename}` : filename;

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "application/octet-stream";

    const publicUrl = await uploadImage(buffer, fullPath, contentType);

    return NextResponse.json({ ok: true, url: publicUrl, name: fullPath });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "上传失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
