import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { SkillGroupModel } from "@/models/SkillGroup";
import { skillGroups as staticSkillGroups } from "@/data/skills";

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ ok: true, data: staticSkillGroups }, { status: 200 });
    }

    const items = await SkillGroupModel.find().lean();
    return NextResponse.json({ ok: true, data: items || [] }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/admin/skills error:", error);
    return NextResponse.json({ ok: true, data: staticSkillGroups }, { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json(); // expected array of SkillGroup
    const db = await connectDB();

    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Database not connected. Please configure MONGODB_URI." },
        { status: 503 }
      );
    }

    await SkillGroupModel.deleteMany({});
    let created: unknown[] = [];
    if (Array.isArray(body) && body.length > 0) {
      created = await SkillGroupModel.insertMany(body);
    }

    return NextResponse.json({ ok: true, data: created }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update skill groups.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
