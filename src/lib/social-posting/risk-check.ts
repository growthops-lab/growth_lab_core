import { SocialPostCheckStatus } from "@prisma/client";

const affiliateDomains = [
  "px.a8.net",
  "a8.net",
  "afi-b.com",
  "t.afi-b.com",
  "accesstrade.net",
  "valuecommerce.com",
  "ck.jp.ap.valuecommerce.com",
];
const shortDomains = ["bit.ly", "tinyurl.com", "x.gd", "is.gd", "00m.in"];

function hostOf(url: string) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function checkSocialPostRisk(text: string, linkUrl?: string | null) {
  const reasons = new Set<string>();
  const urls = [...text.matchAll(/https?:\/\/[^\s)]+/gi)].map(
    (match) => match[0],
  );
  if (linkUrl) urls.push(linkUrl);

  for (const url of urls) {
    const host = hostOf(url);
    if (
      affiliateDomains.some(
        (domain) => host === domain || host.endsWith(`.${domain}`),
      )
    ) {
      reasons.add("Direct affiliate link is blocked for X posts.");
    }
    if (
      shortDomains.some(
        (domain) => host === domain || host.endsWith(`.${domain}`),
      )
    ) {
      reasons.add("Short URL requires manual review.");
    }
  }

  if (text.length > 280) reasons.add("X post text exceeds 280 characters.");

  const reasonList = [...reasons];
  const hasBlocked = reasonList.some(
    (reason) => reason.includes("blocked") || reason.includes("exceeds"),
  );
  const hasWarning = reasonList.length > 0;
  return {
    status: hasBlocked
      ? SocialPostCheckStatus.BLOCKED
      : hasWarning
        ? SocialPostCheckStatus.WARNING
        : SocialPostCheckStatus.PASSED,
    reasons: reasonList,
  };
}
