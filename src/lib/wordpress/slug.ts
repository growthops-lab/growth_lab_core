export function createSlug(input: string) {
  const normalized = input
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return normalized || `post-${Date.now()}`;
}

export function nextSlugCandidate(slug: string) {
  const match = slug.match(/^(.*?)-(\d+)$/);
  if (!match) return `${slug}-2`;
  return `${match[1]}-${Number(match[2]) + 1}`;
}

export function buildApiBaseUrl(siteUrl: string) {
  const url = new URL(siteUrl);
  return `${url.origin.replace(/\/$/, "")}/wp-json/wp/v2`;
}

export function buildEditUrl(siteUrl: string, postId: string | number) {
  const url = new URL(siteUrl);
  return `${url.origin}/wp-admin/post.php?post=${postId}&action=edit`;
}
