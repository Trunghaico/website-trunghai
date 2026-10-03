import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("trunghai_admin_session");

    return NextResponse.json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng xuất" },
      { status: 500 }
    );
  }
}
