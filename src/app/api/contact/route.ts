import { NextResponse, type NextRequest } from "next/server";
import type { ContactFormData } from "@/types";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Partial<ContactFormData> | null;
  const name = body?.name?.toString?.().trim?.() ?? "";
  const email = body?.email?.toString?.().trim?.() ?? "";
  const message = body?.message?.toString?.().trim?.() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  // Placeholder endpoint: connect to an email provider later.
  return NextResponse.json({ ok: true }, { status: 200 });
}
