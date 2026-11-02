import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCloudinaryUsage, deleteFromCloudinary } from "@/lib/cloudinary";

export const revalidate = 0;

export async function GET() {
  try {
    const settings = await db.getSettings();
    const usage = await getCloudinaryUsage({
      cloudName: settings.cloudinaryCloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: settings.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY,
      apiSecret: settings.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET,
      quotaGb: settings.cloudinaryQuotaGb || 25,
    });
    return NextResponse.json(usage);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch Cloudinary usage" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKey, apiSecret, cloudName, quotaGb } = body;

    const toUpdate: Record<string, any> = {};
    if (apiKey !== undefined) toUpdate.cloudinaryApiKey = apiKey;
    if (apiSecret !== undefined) toUpdate.cloudinaryApiSecret = apiSecret;
    if (cloudName !== undefined) toUpdate.cloudinaryCloudName = cloudName;
    if (quotaGb !== undefined) toUpdate.cloudinaryQuotaGb = Number(quotaGb) || 25;

    await db.updateSettings(toUpdate);

    const usage = await getCloudinaryUsage({
      cloudName,
      apiKey,
      apiSecret,
      quotaGb: Number(quotaGb) || 25,
    });

    return NextResponse.json({
      success: true,
      message: "Đã cập nhật cấu hình Cloudinary thành công!",
      usage,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi lưu cấu hình Cloudinary" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "Thiếu tham số url cần xóa" }, { status: 400 });
    }

    const res = await deleteFromCloudinary(url);
    if (res.success) {
      return NextResponse.json({ success: true, message: "Đã xóa ảnh khỏi Cloudinary để giải phóng dung lượng" });
    } else {
      return NextResponse.json({ error: res.error || "Không thể xóa ảnh trên Cloudinary" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi khi xóa ảnh Cloudinary" }, { status: 500 });
  }
}
