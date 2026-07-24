import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ProjectModel } from "@/models/Project";
import { projects as staticProjects } from "@/data/projects";

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ ok: true, data: staticProjects }, { status: 200 });
    }

    const items = await ProjectModel.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: items || [] }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/admin/projects error:", error);
    return NextResponse.json({ ok: true, data: staticProjects }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await connectDB();

    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Database not connected. Please configure MONGODB_URI." },
        { status: 503 }
      );
    }

    const created = await ProjectModel.create(body);
    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create project.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
