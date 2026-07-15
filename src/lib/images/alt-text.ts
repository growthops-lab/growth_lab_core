export function buildAltText(input: {
  title: string;
  siteName?: string | null;
  assetType?: string;
}) {
  const suffix =
    process.env.WORDPRESS_DEFAULT_IMAGE_ALT_SUFFIX ?? "featured image";
  const parts = [input.title.trim(), input.siteName?.trim(), suffix].filter(
    Boolean,
  );
  return parts.join(" - ").slice(0, 160);
}
