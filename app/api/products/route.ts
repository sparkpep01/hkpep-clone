import { NextRequest, NextResponse } from "next/server";
import { readProducts, upsertProduct } from "@/lib/supabase-db";
import { Product } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await readProducts());
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  try {
    const product: Product = await request.json();
    if (!product.name || !product.slug || !product.image || !product.category) {
      return NextResponse.json({ error: "缺少必填字段（name/slug/image/category）" }, { status: 400 });
    }
    if (!/^[a-z0-9-]+$/.test(product.slug)) {
      return NextResponse.json({ error: "slug 只能包含小写字母、数字和连字符" }, { status: 400 });
    }
    const existing = await readProducts();
    if (existing.some((p) => p.slug === product.slug)) {
      return NextResponse.json({ error: "该 slug 已存在" }, { status: 409 });
    }
    const products = await upsertProduct(product);
    return NextResponse.json({ ok: true, count: products.length }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
}
