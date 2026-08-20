import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSessionToken, isAuthenticated, COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ authed: await isAuthenticated() });
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!checkPassword(password)) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, createSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 3600,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}
