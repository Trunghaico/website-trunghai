import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Partner } from "@/types";
import { deleteMultipleFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    const partners = await db.getPartners();
    return NextResponse.json(partners);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Cập nhật thứ tự toàn bộ partners nếu nhận mảng reorder
    if (body.reorder && Array.isArray(body.reorder)) {
      for (let i = 0; i < body.reorder.length; i++) {
        const item: Partner = body.reorder[i];
        await db.savePartner({ ...item, orderIndex: i });
      }
      const updated = await db.getPartners();
      return NextResponse.json(updated);
    }

    // 2. Thêm hoặc cập nhật một đối tác
    const partner: Partner = body;
    if (!partner.name || !partner.name.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập tên đối tác" }, { status: 400 });
    }

    if (!partner.logo || !partner.logo.trim()) {
      return NextResponse.json({ error: "Vui lòng tải lên logo đối tác" }, { status: 400 });
    }

    if (!partner.id) {
      partner.id = "partner-" + Date.now();
    }

    partner.name = partner.name.trim();
    partner.website = partner.website ? partner.website.trim() : "";
    partner.orderIndex = typeof partner.orderIndex === "number" ? partner.orderIndex : 0;
    partner.active = partner.active !== false;

    const saved = await db.savePartner(partner);
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
      return NextResponse.json({ error: "Thiếu ID đối tác" }, { status: 400 });
    }

    // Quét tìm ảnh trên Cloudinary để tự động xóa hủy ảnh trên CDN nếu có
    const allPartners = await db.getPartners();
    const target = allPartners.find((p) => p.id === id);

    if (target && target.logo && target.logo.includes("res.cloudinary.com")) {
      await deleteMultipleFromCloudinary([target.logo]);
    }

    const success = await db.deletePartner(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
