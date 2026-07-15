export function appendSocialUtm(
  url: string | null | undefined,
  campaign = "growth_lab_social",
) {
  if (!url) return url ?? null;
  const parsed = new URL(url);
  parsed.searchParams.set("utm_source", "x");
  parsed.searchParams.set("utm_medium", "social");
  parsed.searchParams.set("utm_campaign", campaign);
  return parsed.toString();
}
