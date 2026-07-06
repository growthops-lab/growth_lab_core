import { randomUUID } from "node:crypto";
import { CreativeAssetType } from "@prisma/client";

function escapeSvg(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function mockImageDimensions(assetType: CreativeAssetType) {
  if (assetType === CreativeAssetType.X_POST_IMAGE) {
    return { width: 1600, height: 900, aspectRatio: "16:9" };
  }
  return { width: 1200, height: 630, aspectRatio: "1.91:1" };
}

export function buildMockSvg(input: {
  title: string;
  subtitle?: string | null;
  siteName?: string | null;
  assetType: CreativeAssetType;
}) {
  const { width, height } = mockImageDimensions(input.assetType);
  const title = escapeSvg(input.title.slice(0, 80));
  const subtitle = escapeSvg((input.subtitle ?? "Growth Lab generated visual").slice(0, 120));
  const siteName = escapeSvg(input.siteName ?? "Growth Lab Core");
  const label = input.assetType === CreativeAssetType.X_POST_IMAGE ? "X Post Image" : "WordPress Featured Image";

  return {
    filename: `mock-${input.assetType.toLowerCase().replaceAll("_", "-")}-${randomUUID().slice(0, 8)}.svg`,
    width,
    height,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="54%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="${Math.round(width * 0.055)}" y="${Math.round(height * 0.1)}" width="${Math.round(width * 0.89)}" height="${Math.round(height * 0.8)}" rx="28" fill="rgba(255,255,255,0.93)"/>
  <text x="${Math.round(width * 0.1)}" y="${Math.round(height * 0.23)}" fill="#0f172a" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.03)}" font-weight="700">${label}</text>
  <text x="${Math.round(width * 0.1)}" y="${Math.round(height * 0.48)}" fill="#111827" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.052)}" font-weight="800">${title}</text>
  <text x="${Math.round(width * 0.1)}" y="${Math.round(height * 0.61)}" fill="#334155" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.025)}">${subtitle}</text>
  <text x="${Math.round(width * 0.1)}" y="${Math.round(height * 0.78)}" fill="#0f766e" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.025)}" font-weight="700">${siteName}</text>
</svg>`
  };
}
