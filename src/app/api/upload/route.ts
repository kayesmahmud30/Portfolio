import { NextResponse, type NextRequest } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "No image file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // If Cloudinary credentials are demo placeholders, return Data URL for seamless offline preview
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName || cloudName === "demo_cloud_name") {
      const mime = file.type || "image/png";
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mime};base64,${base64}`;
      return NextResponse.json({ ok: true, url: dataUrl }, { status: 200 });
    }

    const imageUrl = await uploadImageToCloudinary(buffer, "portfolio_uploads");
    return NextResponse.json({ ok: true, url: imageUrl }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload image.";
    console.error("Upload route error:", error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
