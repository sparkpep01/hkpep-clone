import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteImage } from "@/lib/supabase-db";

// DELETE /api/images/[id]?path=xxx — 删除存储桶中的图片
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const filepath = request.nextUrl.searchParams.get("path");
  if (!filepath) {
    return NextResponse.json({ error: "缺少 path 参数" }, { status: 400 });
  }

  // 安全检查：防止路径遍历
  if (filepath.includes("..")) {
    return NextResponse.json({ error: "非法路径" }, { status: 400 });
  }

  const ok = await deleteImage(filepath);
  if (!ok) {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
