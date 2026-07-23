import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { EducationModel } from "@/models/Education";
import { education as staticEducation } from "@/data/education";

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ ok: true, data: staticEducation }, { status: 200 });
    }

    let items = await EducationModel.find().sort({ createdAt: -1 }).lean();
    if (!items || items.length === 0) {
      await EducationModel.insertMany(staticEducation);
      items = await EducationModel.find().sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ ok: true, data: items }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/admin/education error:", error);
    return NextResponse.json({ ok: true, data: staticEducation }, { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json(); // array of education items
    const db = await connectDB();

    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Database not connected. Please configure MONGODB_URI." },
        { status: 503 }
      );
    }

    await EducationModel.deleteMany({});
    const created = await EducationModel.insertMany(body);

    return NextResponse.json({ ok: true, data: created }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update education.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
