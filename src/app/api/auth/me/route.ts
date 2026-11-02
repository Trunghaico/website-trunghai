import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, createSessionToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("trunghai_admin_session")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.id,
        username: payload.username,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("trunghai_admin_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Phiên đăng nhập không hợp lệ" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Họ và tên không được để trống" }, { status: 400 });
    }

    const trimmedName = name.trim();
    await db.updateUserProfile(payload.username, trimmedName);

    // Refresh session token with updated name
    const newToken = await createSessionToken({
      id: payload.id,
      username: payload.username,
      name: trimmedName,
      role: payload.role,
    });

    cookieStore.set("trunghai_admin_session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin thành công!",
      user: {
        id: payload.id,
        username: payload.username,
        name: trimmedName,
        role: payload.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật thông tin" },
      { status: 500 }
    );
  }
}

