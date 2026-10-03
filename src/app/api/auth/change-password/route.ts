import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, verifyPassword, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("trunghai_admin_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới" },
        { status: 400 }
      );
    }

    if (String(newPassword).length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu mới phải có tối thiểu 6 ký tự" },
        { status: 400 }
      );
    }

    const user = await db.getUserByUsername(payload.username);
    if (!user) {
      return NextResponse.json({ error: "Người dùng không tồn tại" }, { status: 404 });
    }

    const isMatch = await verifyPassword(String(currentPassword), user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Mật khẩu hiện tại không chính xác" },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(String(newPassword));
    await db.updatePassword(user.username, newHash);

    return NextResponse.json({
      success: true,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đổi mật khẩu" },
      { status: 500 }
    );
  }
}
