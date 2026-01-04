import { NextRequest, NextResponse } from "next/server";
import { inflate } from "@/lib/core/inflate";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Read the uploaded file as Text (since it's base64 encoded)
    const base64Content = await file.text();

    // 2. Decode Base64 back to Binary (Uint8Array)
    // We clean the string just in case there are newlines/spaces
    const cleanBase64 = base64Content.replace(/\s/g, '');
    const binaryBuffer = Buffer.from(cleanBase64, 'base64');
    const uint8Array = new Uint8Array(binaryBuffer);

    console.log(`[API] Decoding ${uint8Array.length} bytes...`);

    // 3. Decompress (Inflate)
    const restoredString = inflate(uint8Array);

    if (!restoredString) {
        throw new Error("Decompression produced empty result");
    }

    // 4. Return original text
    return new NextResponse(restoredString, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": 'attachment; filename="restored.txt"',
      },
    });

  } catch (error: any) {
    console.error("Decompression API Error:", error);
    return NextResponse.json(
      { error: error.message || "Decompression failed" },
      { status: 500 }
    );
  }
}