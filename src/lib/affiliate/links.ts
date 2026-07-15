export function maskAffiliateUrl(url: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}/***`;
  } catch {
    return "***";
  }
}

export function buildTrackingId(input: {
  mediaSlug?: string | null;
  programSlug?: string | null;
  suffix?: string;
}) {
  return [
    input.mediaSlug ?? "media",
    input.programSlug ?? "program",
    input.suffix ?? "default",
  ]
    .join("_")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .slice(0, 80);
}
