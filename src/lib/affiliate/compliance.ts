import { checkPostLinks } from "@/lib/link-check";

export async function assertAffiliateLinkNotForX(affiliateUrl: string) {
  const result = await checkPostLinks({
    body: affiliateUrl,
    destinationUrl: affiliateUrl,
    linkUrl: affiliateUrl,
  });
  if (result.status === "BLOCKED") {
    return {
      allowedInWordPress: true,
      allowedInX: false,
      reason:
        result.reason ?? "Direct affiliate links must not be used in X posts.",
    };
  }
  return {
    allowedInWordPress: true,
    allowedInX: false,
    reason:
      "Affiliate links are managed for WordPress placements only. X should drive traffic to WordPress.",
  };
}
