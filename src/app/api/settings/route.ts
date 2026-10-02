import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CompanySettings } from "@/types";

export async function GET() {
  try {
    const settings = await db.getSettings();
    return NextResponse.json(settings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Partial<CompanySettings> = await req.json();
    const updated = await db.updateSettings(body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
