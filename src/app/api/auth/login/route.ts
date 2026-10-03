import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { createSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, remember } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu" },
        { status: 400 }
      );
    }

    const trimmedUsername = String(username).trim();
    const user = await db.verifyCredentials(trimmedUsername, String(password));

    if (!user) {
      return NextResponse.json(
        { error: "Tên đăng nhập hoặc mật khẩu không chính xác" },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });

    const cookieStore = await cookies();
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days or 7 days

    cookieStore.set("trunghai_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi máy chủ trong quá trình xử lý đăng nhập" },
      { status: 500 }
    );
  }
}
