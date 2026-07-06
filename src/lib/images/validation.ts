const allowedMimeTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);

export function assertAllowedImage(input: { mimeType?: string | null; fileSize?: number | null; mock?: boolean }) {
  if (input.mimeType && !allowedMimeTypes.has(input.mimeType)) {
    throw new Error(`Unsupported image MIME type: ${input.mimeType}`);
  }
  if (input.mimeType === "image/svg+xml" && !input.mock) {
    throw new Error("SVG is only allowed for local mock image generation in Phase 3.");
  }
  const maxMb = Number(process.env.IMAGE_MAX_FILE_SIZE_MB ?? 10);
  const maxBytes = maxMb * 1024 * 1024;
  if (input.fileSize && input.fileSize > maxBytes) {
    throw new Error(`Image file is larger than ${maxMb}MB.`);
  }
}

export function isSafeImageUrl(url: string) {
  if (url.startsWith("/generated-images/")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
