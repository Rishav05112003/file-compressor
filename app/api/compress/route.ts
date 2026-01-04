import { NextRequest, NextResponse } from "next/server";
import { deflate } from "@/lib/core/deflate"; 

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Read input text
    const text = await file.text();

    // 2. Compress (returns Uint8Array)
    const compressedBytes = deflate(text);

    // 3. Encode Binary to Base64 String
    // This makes it safe to save as a .txt file without data loss
    const base64String = Buffer.from(compressedBytes).toString('base64');

    // 4. Return as a .txt file
    return new NextResponse(base64String, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": 'attachment; filename="compressed.txt"',
      },
    });

  } catch (error: any) {
    console.error("Compression API Error:", error);
    return NextResponse.json(
      { error: error.message || "Compression failed" },
      { status: 500 }
    );
  }
}