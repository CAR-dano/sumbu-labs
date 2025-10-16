import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// GET /api/uploads/projects/filename.png - Serve uploaded files
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filepath = join(process.cwd(), "public", "uploads", ...path);

    if (!existsSync(filepath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const file = await readFile(filepath);
    const ext = path[path.length - 1].split(".").pop()?.toLowerCase();

    const contentTypes: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
    };

    const contentType = contentTypes[ext || ""] || "application/octet-stream";

    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
