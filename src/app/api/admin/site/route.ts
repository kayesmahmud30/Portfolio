import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { SiteConfigModel } from "@/models/SiteConfig";
import { site as staticSite } from "@/data/site";

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ ok: true, data: staticSite }, { status: 200 });
    }

    let siteData = await SiteConfigModel.findOne().lean();
    if (!siteData) {
      siteData = await SiteConfigModel.create(staticSite);
    }

    return NextResponse.json({ ok: true, data: siteData }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/admin/site error:", error);
    return NextResponse.json({ ok: true, data: staticSite }, { status: 200 });
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

    const updated = await SiteConfigModel.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json({ ok: true, data: updated }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update site info.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
