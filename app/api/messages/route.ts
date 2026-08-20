import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createMessage, getMessages, deleteMessage } from "@/lib/supabase-db";

// POST /api/messages — 公开接口，用户提交留言（Send Us a Message 表单）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "请填写所有字段" }, { status: 400 });
    }
    if (name.length > 200 || email.length > 200 || subject.length > 500 || message.length > 5000) {
      return NextResponse.json({ error: "内容过长" }, { status: 400 });
    }

    const ok = await createMessage({ name, email, subject, message });
    if (!ok) {
      return NextResponse.json({ error: "提交失败，请稍后再试" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
}

// GET /api/messages — 获取所有留言（需要登录）
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const messages = await getMessages();
  return NextResponse.json(messages);
}

// DELETE /api/messages?id=123 — 删除留言（需要登录）
export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "缺少 id" }, { status: 400 });
  }

  const ok = await deleteMessage(id);
  if (!ok) {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
