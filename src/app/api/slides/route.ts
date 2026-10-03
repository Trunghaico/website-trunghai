import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { HeroSlide } from "@/types";
import { deleteMultipleFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    const slides = await db.getSlides();
    return NextResponse.json(slides);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Cập nhật thứ tự toàn bộ slides nếu nhận mảng reorder
    if (body.reorder && Array.isArray(body.reorder)) {
      for (let i = 0; i < body.reorder.length; i++) {
        const item: HeroSlide = body.reorder[i];
        await db.saveSlide({ ...item, orderIndex: i });
      }
      const updated = await db.getSlides();
      return NextResponse.json(updated);
    }

    // 2. Cập nhật thời gian chuyển slide nếu có interval
    if (typeof body.slideInterval === "number") {
      await db.updateSettings({ slideInterval: body.slideInterval });
      if (!body.title && !body.image) {
        return NextResponse.json({ success: true, slideInterval: body.slideInterval });
      }
    }

    // 3. Thêm hoặc sửa một slide
    const slide: HeroSlide = body;
    if (!slide.image) {
      return NextResponse.json({ error: "Vui lòng chọn hình ảnh cho slide" }, { status: 400 });
    }

    if (!slide.id) {
      slide.id = "slide-" + Date.now();
    }

    slide.title = slide.title ? slide.title.trim() : "";
    slide.subtitle = slide.subtitle ? slide.subtitle.trim() : "";
    slide.tag = slide.tag ? slide.tag.trim() : "";

    const saved = await db.saveSlide(slide);
    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing slide id" }, { status: 400 });
    }

    // 1. Quét tìm ảnh trên Cloudinary để tự động xóa hủy ảnh trên CDN
    const allSlides = await db.getSlides();
    const targetSlide = allSlides.find((s) => s.id === id);

    if (targetSlide && targetSlide.image && targetSlide.image.includes("res.cloudinary.com")) {
      await deleteMultipleFromCloudinary([targetSlide.image]);
    }

    // 2. Xóa bản ghi slide trong DB
    const success = await db.deleteSlide(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
