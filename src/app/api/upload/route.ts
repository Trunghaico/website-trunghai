import { NextResponse } from "next/server";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const directUrl = formData.get("url") as string | null;

    if (directUrl) {
      return NextResponse.json({ url: directUrl });
    }

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file tải lên" }, { status: 400 });
    }

    // Convert file to base64 buffer for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mime = file.type || "image/jpeg";
    const base64Data = `data:${mime};base64,${buffer.toString("base64")}`;

    if (isCloudinaryConfigured()) {
      const secureUrl = await uploadToCloudinary(base64Data);
      return NextResponse.json({ url: secureUrl });
    } else {
      // In local dev without Cloudinary credentials, return the base64 or fallback
      return NextResponse.json({
        url: base64Data,
        message: "Chạy chế độ preview (Chưa cấu hình Cloudinary Cloud Name trong .env)",
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
