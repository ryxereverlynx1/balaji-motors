import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import os from "os";
import crypto from "crypto";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function validateImageMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === "image/webp") {
    const riff = buffer.toString("ascii", 0, 4);
    const webp = buffer.toString("ascii", 8, 12);
    return riff === "RIFF" && webp === "WEBP";
  }

  if (mimeType === "image/avif") {
    const ftyp = buffer.toString("ascii", 4, 8);
    return ftyp === "ftyp";
  }

  return true;
}

function getUploadDirectory(): string {
  if (process.env.VERCEL) {
    const tmpUploads = path.join("/tmp", "uploads", "products");
    if (!fs.existsSync(tmpUploads)) {
      try {
        fs.mkdirSync(tmpUploads, { recursive: true });
      } catch {}
    }
    return tmpUploads;
  }

  const localUploads = path.join(process.cwd(), "public", "uploads", "products");
  if (!fs.existsSync(localUploads)) {
    try {
      fs.mkdirSync(localUploads, { recursive: true });
    } catch {
      const fallback = path.join(process.env.TEMP || process.env.TMP || os.tmpdir(), "uploads", "products");
      if (!fs.existsSync(fallback)) {
        fs.mkdirSync(fallback, { recursive: true });
      }
      return fallback;
    }
  }
  return localUploads;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image file exceeds maximum allowed size of 5 MB." },
        { status: 400 }
      );
    }

    const mimeType = file.type.toLowerCase().trim();
    if (!ALLOWED_MIME_TYPES[mimeType]) {
      return NextResponse.json(
        { error: "Invalid image format. Only JPEG, PNG, WebP, and AVIF images are allowed." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validateImageMagicBytes(buffer, mimeType)) {
      return NextResponse.json(
        { error: "File contents do not match the expected image signature." },
        { status: 400 }
      );
    }

    const ext = ALLOWED_MIME_TYPES[mimeType];
    const safeFilename = `prod_${Date.now()}_${crypto.randomBytes(6).toString("hex")}.${ext}`;

    const uploadDir = getUploadDirectory();
    const targetFilePath = path.join(uploadDir, safeFilename);

    const relativeCheck = path.relative(uploadDir, targetFilePath);
    if (relativeCheck.startsWith("..") || path.isAbsolute(relativeCheck)) {
      return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
    }

    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/uploads/products/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      size: file.size,
      mimeType,
    });
  } catch {
    return NextResponse.json({ error: "Failed to process image upload." }, { status: 500 });
  }
}