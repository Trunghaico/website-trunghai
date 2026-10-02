import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { JobPosting } from "@/types";

export async function GET() {
  try {
    const jobs = await db.getJobs();
    return NextResponse.json(jobs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: JobPosting = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Tiêu đề tuyển dụng không được để trống" }, { status: 400 });
    }

    if (!body.id) {
      body.id = "job-" + Date.now();
    }

    const saved = await db.saveJob(body);
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
      return NextResponse.json({ error: "Missing job id" }, { status: 400 });
    }
    const success = await db.deleteJob(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
