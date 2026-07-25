import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { AboutConfigModel } from "@/models/AboutConfig";
import type { AboutConfig } from "@/types";

const DEFAULT_ABOUT: AboutConfig = {
  title: "A little about me",
  subtitle:
    "I like building interfaces that feel effortless—clean visuals, solid structure, and small details that make people smile.",
  cards: [
    {
      heading: "My journey",
      paragraphs: [
        "I started programming out of curiosity—wanting to understand how websites work behind the scenes. Over time, that curiosity became a habit: building small projects, breaking things, fixing them, and learning the \"why\" behind good code and good design.",
        "Today I enjoy crafting modern web apps where performance and accessibility are non-negotiable, and where UI polish comes from careful spacing, typography, and interaction design—not visual noise.",
      ],
    },
    {
      heading: "What I love working on",
      paragraphs: [
        "I'm happiest when I'm building reusable components, designing clean layouts, and turning complex requirements into simple user flows. I especially like React + Next.js, Tailwind for fast iteration, and motion that feels natural and purposeful.",
        "My goal is to grow into a developer who can own features end-to-end—from UX thinking and system design down to clean implementation and testing. Outside programming, I enjoy learning new tools, exploring design inspiration, and taking breaks with music, reading, or a good walk.",
      ],
    },
  ],
};

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ ok: true, data: DEFAULT_ABOUT }, { status: 200 });

    let doc = await AboutConfigModel.findOne().lean();
    if (!doc) {
      doc = await AboutConfigModel.create(DEFAULT_ABOUT);
    }
    return NextResponse.json({ ok: true, data: doc }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: true, data: DEFAULT_ABOUT }, { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: AboutConfig = await req.json();
    const db = await connectDB();

    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Database not connected. Please configure MONGODB_URI." },
        { status: 503 }
      );
    }

    const doc = await AboutConfigModel.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true, data: doc }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save About config.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
