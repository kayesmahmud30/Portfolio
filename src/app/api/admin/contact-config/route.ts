import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactConfigModel } from "@/models/ContactConfig";

const defaultContact = {
  email: "mahmudkayes30@gmail.com",
  phone: "+8801931835697",
  whatsapp: "+8801931835697",
};

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ ok: true, data: defaultContact }, { status: 200 });
    }

    let config = await ContactConfigModel.findOne().lean();
    if (!config) {
      config = await ContactConfigModel.create(defaultContact);
    }

    return NextResponse.json({ ok: true, data: config }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/admin/contact-config error:", error);
    return NextResponse.json({ ok: true, data: defaultContact }, { status: 200 });
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

    const updated = await ContactConfigModel.findOneAndUpdate({}, body, {
      upsert: true,
      new: true,
    });

    return NextResponse.json({ ok: true, data: updated }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update contact config.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
