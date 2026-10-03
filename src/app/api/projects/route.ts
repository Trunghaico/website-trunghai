import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Project } from "@/types";
import { deleteMultipleFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    const projects = await db.getProjects();
    return NextResponse.json(projects);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Project = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Tiêu đề không được để trống" }, { status: 400 });
    }

    if (!body.id) {
      body.id = "proj-" + Date.now();
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

    const saved = await db.saveProject(body);
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
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }

    // 1. Tìm dự án để quét các ảnh trên Cloudinary cần hủy (Thumbnail + Gallery)
    const project = await db.getProjectById(id);
    if (project) {
      const urlsToDelete: string[] = [];

      if (project.thumbnail && project.thumbnail.includes("res.cloudinary.com")) {
        urlsToDelete.push(project.thumbnail);
      }
      if (Array.isArray(project.gallery)) {
        project.gallery.forEach((img) => {
          if (img && img.includes("res.cloudinary.com")) {
            urlsToDelete.push(img);
          }
        });
      }

      if (urlsToDelete.length > 0) {
        await deleteMultipleFromCloudinary(urlsToDelete);
      }
    }

    // 2. Xóa bản ghi dự án trong cơ sở dữ liệu
    const success = await db.deleteProject(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
