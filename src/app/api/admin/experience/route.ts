import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ExperienceModel } from "@/models/Experience";
import { experience as staticExperience } from "@/data/experience";

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ ok: true, data: staticExperience }, { status: 200 });
    }

    let items = await ExperienceModel.find().sort({ createdAt: -1 }).lean();
    if (!items || items.length === 0 && staticExperience.length > 0) {
      await ExperienceModel.insertMany(staticExperience);
      items = await ExperienceModel.find().sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ ok: true, data: items }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/admin/experience error:", error);
    return NextResponse.json({ ok: true, data: staticExperience }, { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await connectDB();

    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Database not connected. Please configure MONGODB_URI." },
        { status: 503 }
      );
    }

    await ExperienceModel.deleteMany({});
    const created = await ExperienceModel.insertMany(body);

    return NextResponse.json({ ok: true, data: created }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update experience.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
