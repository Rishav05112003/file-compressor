import { NextRequest, NextResponse } from "next/server";
import { deflate } from "@/lib/core/deflate";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const compressed = deflate(text);

    return new NextResponse(compressed, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.name.replace(
          ".txt",
          "-deflated.txt"
        )}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Compression failed" }, { status: 500 });
  }
}
