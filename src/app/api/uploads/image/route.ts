import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { writeFile, unlink } from "fs/promises";
import sharp from "sharp";
import {
  sanitizeFolderPath,
  generateUniqueFilename,
  isValidImageMime,
  ensureDir,
  getImagePath,
  getImageUrl,
  urlToPath,
} from "@/lib/image-utils";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const MAX_WIDTH = 1920;

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folderParam = (formData.get("folder") || "").toString();

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate MIME type
    if (!isValidImageMime(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${
            MAX_FILE_SIZE / 1024 / 1024
          }MB.`,
        },
        { status: 400 }
      );
    }

    // Sanitize folder path
    const folder = sanitizeFolderPath(folderParam);

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process image with sharp
    let processedBuffer: Buffer = buffer;
    let finalMime = file.type;
    let extension = "jpg";
    let width = 0;
    let height = 0;

    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      width = metadata.width || 0;
      height = metadata.height || 0;

      // Convert to WebP and resize if needed (except for GIFs)
      if (file.type !== "image/gif") {
        image.webp({ quality: 85 });
        finalMime = "image/webp";
        extension = "webp";

        // Resize if width exceeds MAX_WIDTH
        if (width > MAX_WIDTH) {
          image.resize(MAX_WIDTH, null, {
            withoutEnlargement: true,
            fit: "inside",
          });
          width = MAX_WIDTH;
          height = Math.round((height * MAX_WIDTH) / (metadata.width || 1));
        }

        processedBuffer = Buffer.from(await image.toBuffer());
      } else {
        extension = "gif";
      }
    } catch (error) {
      console.error("Image processing error:", error);
      // Fallback: use original buffer
      extension = file.type.split("/")[1] || "jpg";
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name, extension);

    // Get full path and ensure directory exists
    const filePath = getImagePath(folder, filename);
    const dirPath = getImagePath(folder, "");
    await ensureDir(dirPath);

    // Write file
    await writeFile(filePath, processedBuffer);

    // Generate public URL
    const publicUrl = getImageUrl(folder, filename);

    return NextResponse.json({
      ok: true,
      file: {
        name: filename,
        size: processedBuffer.length,
        mime: finalMime,
        path: filePath,
        url: publicUrl,
        width,
        height,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Convert URL to file path
    const filePath = urlToPath(url);

    if (!filePath) {
      return NextResponse.json(
        { error: "Invalid URL. Must be from IMAGE_BASE_URL domain." },
        { status: 400 }
      );
    }

    // Delete file
    try {
      await unlink(filePath);
      return NextResponse.json({
        ok: true,
        message: "File deleted successfully",
      });
    } catch (error) {
      console.error("File deletion error:", error);
      return NextResponse.json(
        { error: "File not found or could not be deleted" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
