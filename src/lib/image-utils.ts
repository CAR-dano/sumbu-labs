import { mkdir } from "fs/promises";
import { join } from "path";

/**
 * Slugify a string to make it URL-safe
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Sanitize folder path to prevent path traversal
 */
export function sanitizeFolderPath(folder: string): string {
  if (!folder) return "";

  return folder
    .replace(/\.\./g, "") // Remove ..
    .replace(/^\/+/, "") // Remove leading slashes
    .replace(/\/+$/, "") // Remove trailing slashes
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-\/]/g, "") // Only allow alphanumeric, dash, underscore, slash
    .replace(/\/+/g, "/"); // Replace multiple slashes with single slash
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMime(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return mimeMap[mimeType] || "jpg";
}

/**
 * Ensure directory exists, create if not
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

/**
 * Validate image MIME type
 */
export function isValidImageMime(mimeType: string): boolean {
  const validMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  return validMimes.includes(mimeType);
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(
  originalName: string,
  extension: string
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const baseName = slugify(originalName.replace(/\.[^/.]+$/, "")).substring(
    0,
    50
  );

  return `${timestamp}-${randomString}-${baseName}.${extension}`;
}

/**
 * Get the full file system path for an image
 */
export function getImagePath(folder: string, filename: string): string {
  const imageRoot = process.env.IMAGE_ROOT || "/var/www/sumbu-labs/images";
  return join(imageRoot, folder, filename);
}

/**
 * Get the public URL for an image
 */
export function getImageUrl(folder: string, filename: string): string {
  const imageBaseUrl = process.env.IMAGE_BASE_URL || "https://sumbu.xyz/images";
  const parts = [imageBaseUrl, folder, filename].filter(Boolean);
  return parts.join("/");
}

/**
 * Convert URL to file system path
 */
export function urlToPath(url: string): string | null {
  const imageBaseUrl = process.env.IMAGE_BASE_URL || "https://sumbu.xyz/images";
  const imageRoot = process.env.IMAGE_ROOT || "/var/www/sumbu-labs/images";

  if (!url.startsWith(imageBaseUrl)) {
    return null;
  }

  const relativePath = url.substring(imageBaseUrl.length).replace(/^\/+/, "");
  return join(imageRoot, relativePath);
}
