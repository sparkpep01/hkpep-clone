import { NextRequest, NextResponse } from "next/server";
import { findProduct, upsertProduct, deleteProduct } from "@/lib/supabase-db";
import { Product } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) {
    return NextResponse.json({ error: "产品不存在" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { slug } = await params;
  if (!(await findProduct(slug))) {
    return NextResponse.json({ error: "产品不存在" }, { status: 404 });
  }
  try {
    const product: Product = await request.json();
    if (product.slug !== slug) {
      return NextResponse.json({ error: "slug 不匹配，不允许在此修改 slug" }, { status: 400 });
    }
    if (!product.name || !product.image || !product.category) {
      return NextResponse.json({ error: "缺少必填字段（name/image/category）" }, { status: 400 });
    }
    await upsertProduct(product);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { slug } = await params;
  if (!(await deleteProduct(slug))) {
    return NextResponse.json({ error: "产品不存在" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
