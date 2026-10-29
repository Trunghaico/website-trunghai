import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NewsPost } from "@/types";
import { deleteMultipleFromCloudinary, extractCloudinaryUrlsFromHtml } from "@/lib/cloudinary";

export async function GET() {
  try {
    const news = await db.getNews();
    return NextResponse.json(news);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: NewsPost = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Tiêu đề không được để trống" }, { status: 400 });
    }

    if (!body.id) {
      body.id = "news-" + Date.now();
    }
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (!body.date) {
      const today = new Date();
      body.date = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;
    }

    if (body.published === undefined) {
      body.published = true;
    }

    const saved = await db.saveNews(body);
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
      return NextResponse.json({ error: "Missing news id" }, { status: 400 });
    }

    // 1. Quét và hủy các ảnh trên Cloudinary nếu có (không làm gián đoạn việc xóa bài viết nếu Cloudinary lỗi)
    try {
      const allNews = await db.getNews();
      const targetPost = allNews.find((n) => n.id === id || n.slug === id);

      if (targetPost) {
        const urlsToDelete: string[] = [];

        // Ảnh thumbnail đại diện
        if (targetPost.thumbnail && targetPost.thumbnail.includes("res.cloudinary.com")) {
          urlsToDelete.push(targetPost.thumbnail);
        }

        // Các hình ảnh chèn trong nội dung HTML bài viết
        if (targetPost.content) {
          const contentUrls = extractCloudinaryUrlsFromHtml(targetPost.content);
          urlsToDelete.push(...contentUrls);
        }

        if (urlsToDelete.length > 0) {
          await deleteMultipleFromCloudinary(urlsToDelete);
        }
      }
    } catch (imgErr) {
      console.warn("Cloudinary cleanup warning, proceeding with post deletion:", imgErr);
    }

    // 2. Xóa bản ghi bài viết trong cơ sở dữ liệu
    const success = await db.deleteNews(id);
    return NextResponse.json({ success: Boolean(success) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
