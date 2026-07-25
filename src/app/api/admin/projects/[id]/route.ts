import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ProjectModel } from "@/models/Project";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = await connectDB();

    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Database not connected. Please configure MONGODB_URI." },
        { status: 503 }
      );
    }

    const updated = await ProjectModel.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: updated }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update project.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const db = await connectDB();

    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Database not connected. Please configure MONGODB_URI." },
        { status: 503 }
      );
    }

    const deleted = await ProjectModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Project deleted successfully." }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete project.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const db = await connectDB();

    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Database not connected. Please configure MONGODB_URI." },
        { status: 503 }
      );
    }

    const project = await ProjectModel.findById(id);
    if (!project) {
      return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
    }

    project.pinned = !project.pinned;
    await project.save();

    return NextResponse.json({ ok: true, data: project }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to toggle pin.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
