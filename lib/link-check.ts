import { LinkCheckStatus, PostStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSettings, parseBoolean, parseCsv } from "@/lib/settings";

const fallbackBlockedDomains = [
  "px.a8.net",
  "a8.net",
  "afi-b.com",
  "t.afi-b.com",
  "accesstrade.net",
  "valuecommerce.com",
  "ck.jp.ap.valuecommerce.com",
  "bit.ly",
  "tinyurl.com",
  "x.gd",
  "is.gd",
  "00m.in",
];

const fallbackAllowedDomains = [
  "example.com",
  "note.com",
  "blogspot.com",
  "instagram.com",
  "pinterest.com",
  "youtube.com",
];

export type LinkCheckResult = {
  status: LinkCheckStatus;
  reason: string;
  detectedUrls: string[];
};

function hostnameMatches(hostname: string, domain: string) {
  const normalizedHostname = hostname.toLowerCase();
  const normalizedDomain = domain.toLowerCase();
  return (
    normalizedHostname === normalizedDomain ||
    normalizedHostname.endsWith(`.${normalizedDomain}`)
  );
}

export function extractUrls(text: string) {
  return [...text.matchAll(/https?:\/\/[^\s<>"']+/gi)].map((match) =>
    match[0].replace(/[),.。、]+$/g, ""),
  );
}

function classifyUrl(
  rawUrl: string,
  blockedDomains: string[],
  allowedDomains: string[],
) {
  try {
    const url = new URL(rawUrl);
    if (
      blockedDomains.some((domain) => hostnameMatches(url.hostname, domain))
    ) {
      return {
        status: LinkCheckStatus.BLOCKED,
        reason: `${url.hostname} はPhase 1のブロック対象ドメインです。`,
      };
    }
    if (
      allowedDomains.some((domain) => hostnameMatches(url.hostname, domain))
    ) {
      return {
        status: LinkCheckStatus.SAFE,
        reason: `${url.hostname} は許可ドメインです。`,
      };
    }
    return {
      status: LinkCheckStatus.WARNING,
      reason: `${url.hostname} は許可ドメインに登録されていません。`,
    };
  } catch {
    return { status: LinkCheckStatus.BLOCKED, reason: "URL形式が不正です。" };
  }
}

function hostnameFromUrl(rawUrl?: string | null) {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl).hostname;
  } catch {
    return null;
  }
}

async function getRegisteredMediaDomains() {
  const [media, wordpressSites] = await Promise.all([
    prisma.media.findMany({
      select: {
        wordpressUrl: true,
        noteUrl: true,
        bloggerUrl: true,
        instagramUrl: true,
        pinterestUrl: true,
      },
    }),
    prisma.wordPressSite.findMany({
      select: { siteUrl: true },
    }),
  ]);

  const mediaDomains = media
    .flatMap((item) => [
      item.wordpressUrl,
      item.noteUrl,
      item.bloggerUrl,
      item.instagramUrl,
      item.pinterestUrl,
    ])
    .map(hostnameFromUrl)
    .filter(Boolean) as string[];

  const wordpressDomains = wordpressSites
    .map((site) => hostnameFromUrl(site.siteUrl))
    .filter(Boolean) as string[];
  return [...new Set([...mediaDomains, ...wordpressDomains])];
}

export async function checkPostLinks(input: {
  body: string;
  linkUrl?: string | null;
  destinationUrl?: string | null;
}): Promise<LinkCheckResult> {
  const settings = await getSettings();
  const blockAffiliateDirectLinks = parseBoolean(
    settings.BLOCK_AFFILIATE_DIRECT_LINKS,
  );
  const blockedDomains = blockAffiliateDirectLinks
    ? parseCsv(
        settings.BLOCKED_LINK_DOMAINS || fallbackBlockedDomains.join(","),
      )
    : [];
  const allowedDomains = [
    ...parseCsv(
      settings.ALLOWED_LINK_DOMAINS || fallbackAllowedDomains.join(","),
    ),
    ...(await getRegisteredMediaDomains()),
  ];
  const detectedUrls = [
    ...new Set(
      [...extractUrls(input.body), input.linkUrl, input.destinationUrl].filter(
        Boolean,
      ) as string[],
    ),
  ];

  if (detectedUrls.length === 0) {
    return {
      status: LinkCheckStatus.SAFE,
      reason: "投稿内にURLはありません。",
      detectedUrls,
    };
  }

  const classified = detectedUrls.map((url) =>
    classifyUrl(url, blockedDomains, allowedDomains),
  );
  const blockedReasons = classified
    .filter((result) => result.status === LinkCheckStatus.BLOCKED)
    .map((result) => result.reason);
  const warningReasons = classified
    .filter((result) => result.status === LinkCheckStatus.WARNING)
    .map((result) => result.reason);

  if (blockedReasons.length > 0) {
    return {
      status: LinkCheckStatus.BLOCKED,
      reason: [...new Set(blockedReasons)].join(" "),
      detectedUrls,
    };
  }

  if (warningReasons.length > 0) {
    return {
      status: LinkCheckStatus.WARNING,
      reason: [...new Set(warningReasons)].join(" "),
      detectedUrls,
    };
  }

  return {
    status: LinkCheckStatus.SAFE,
    reason: "すべてのURLが許可ドメインです。",
    detectedUrls,
  };
}

export async function persistPostLinkCheck(
  postId: string,
  result: LinkCheckResult,
) {
  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      linkCheckStatus: result.status,
      linkCheckReason: result.reason,
      detectedUrls: result.detectedUrls,
      checkedAt: new Date(),
      status:
        result.status === LinkCheckStatus.BLOCKED
          ? PostStatus.BLOCKED
          : undefined,
      failureReason:
        result.status === LinkCheckStatus.BLOCKED ? result.reason : undefined,
    },
  });

  if (result.detectedUrls.length > 0) {
    await prisma.linkCheck.createMany({
      data: result.detectedUrls.map((url) => ({
        postId,
        url,
        status: result.status,
        reason: result.reason,
      })),
    });
  }

  return post;
}

export async function recheckAndRestorePost(postId: string) {
  const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });
  const result = await checkPostLinks({
    body: post.body,
    destinationUrl: post.destinationUrl,
    linkUrl: post.linkUrl,
  });
  await persistPostLinkCheck(post.id, result);

  if (
    post.status === PostStatus.BLOCKED &&
    result.status === LinkCheckStatus.SAFE
  ) {
    await prisma.post.update({
      where: { id: post.id },
      data: {
        status: PostStatus.DRAFT,
        failureReason: null,
        lastError: null,
      },
    });
  }

  return result;
}
