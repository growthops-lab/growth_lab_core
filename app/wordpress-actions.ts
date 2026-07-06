"use server";

import {
  ApprovalDecision,
  DuplicateCheckStatus,
  Platform,
  PostStatus,
  PostType,
  RequestType,
  WordPressConnectionStatus,
  WordPressLocalStatus
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { checkPostLinks, persistPostLinkCheck } from "@/lib/link-check";
import { prisma } from "@/lib/prisma";
import { getSetting, parseBoolean, parseCsv } from "@/lib/settings";
import { connectionStatusForResult, logWordPressResult, WordPressClient } from "@/src/lib/wordpress/client";
import { canEncryptWordPressSecrets, encryptApplicationPassword } from "@/src/lib/wordpress/encryption";
import { WordPressConfigError } from "@/src/lib/wordpress/errors";
import { buildApiBaseUrl, buildEditUrl, createSlug, nextSlugCandidate } from "@/src/lib/wordpress/slug";
import { markdownToSafeHtml } from "@/src/lib/wordpress/sanitize";
import type {
  WordPressApiResult,
  WordPressPostResponse,
  WordPressStatus,
  WordPressTermResponse
} from "@/src/lib/wordpress/types";

const siteSchema = z.object({
  mediaId: z.string().min(1),
  siteName: z.string().trim().min(1),
  siteUrl: z.string().trim().url(),
  apiBaseUrl: z.string().trim().url().optional().or(z.literal("")),
  username: z.string().trim().min(1),
  applicationPassword: z.string().optional(),
  mockMode: z.coerce.boolean().default(false),
  defaultStatus: z.string().trim().default("draft"),
  allowPublish: z.coerce.boolean().default(false),
  autoAddAllowedDomain: z.coerce.boolean().default(false),
  notes: z.string().trim().optional()
});

const postSchema = z.object({
  wordpressSiteId: z.string().min(1),
  title: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().optional(),
  contentMarkdown: z.string().trim().min(1),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  focusKeyword: z.string().trim().optional()
});

function isHttps(url: string) {
  return new URL(url).protocol === "https:";
}

async function addAllowedDomain(siteUrl: string) {
  const hostname = new URL(siteUrl).hostname;
  const current = await getSetting("ALLOWED_LINK_DOMAINS");
  const domains = parseCsv(current);
  if (domains.includes(hostname)) return null;

  await prisma.setting.upsert({
    where: { key: "ALLOWED_LINK_DOMAINS" },
    update: { value: [...domains, hostname].join(",") },
    create: { key: "ALLOWED_LINK_DOMAINS", value: [...domains, hostname].join(",") }
  });
  return hostname;
}

function mapWordPressStatus(raw: string): WordPressStatus {
  const allowed = ["draft", "pending", "private", "publish"] as const;
  return allowed.includes(raw as WordPressStatus) ? (raw as WordPressStatus) : "draft";
}

async function uniqueLocalSlug(wordpressSiteId: string, slug: string) {
  let candidate = slug;
  for (let index = 0; index < 20; index += 1) {
    const existing = await prisma.wordPressPost.findFirst({
      where: { wordpressSiteId, slug: candidate },
      select: { id: true }
    });
    if (!existing) return candidate;
    candidate = nextSlugCandidate(candidate);
  }
  throw new Error("slug候補を生成できませんでした。別のslugを指定してください。");
}

function resultFromError<T>(
  error: unknown,
  endpoint: string,
  method: string,
  mockMode: boolean
): WordPressApiResult<T> {
  return {
    ok: false,
    endpoint,
    method,
    mockMode,
    error: error instanceof Error ? error.message : "WordPress operation failed"
  };
}

export async function createWordPressSite(formData: FormData) {
  const data = siteSchema.parse(Object.fromEntries(formData));
  const mockMode = data.mockMode || process.env.WORDPRESS_MOCK_MODE !== "false";
  const applicationPassword = String(data.applicationPassword ?? "").trim();

  if (!mockMode && !canEncryptWordPressSecrets()) {
    throw new WordPressConfigError("WORDPRESS_ENCRYPTION_KEYが未設定のため、実WordPress接続は登録できません。");
  }
  if (!mockMode && !applicationPassword) {
    throw new Error("実WordPress接続ではApplication Passwordが必須です。");
  }
  const encryptedPassword =
    applicationPassword && canEncryptWordPressSecrets() ? encryptApplicationPassword(applicationPassword) : null;

  const site = await prisma.wordPressSite.create({
    data: {
      mediaId: data.mediaId,
      siteName: data.siteName,
      siteUrl: data.siteUrl,
      apiBaseUrl: data.apiBaseUrl || buildApiBaseUrl(data.siteUrl),
      username: data.username,
      applicationPasswordEncrypted: encryptedPassword,
      applicationPasswordMasked: encryptedPassword ? "********" : "未登録",
      mockMode,
      connectionStatus: WordPressConnectionStatus.NOT_CONNECTED,
      defaultStatus: mapWordPressStatus(data.defaultStatus),
      allowPublish: data.allowPublish && parseBoolean(process.env.WORDPRESS_ALLOW_PUBLISH ?? "false"),
      autoAddAllowedDomain: data.autoAddAllowedDomain,
      notes: [
        data.notes,
        isHttps(data.siteUrl) ? null : "HTTP URLです。本番運用ではHTTPSを推奨します。"
      ]
        .filter(Boolean)
        .join("\n")
    }
  });

  if (site.autoAddAllowedDomain) {
    const addedDomain = await addAllowedDomain(site.siteUrl);
    if (addedDomain) {
      await logWordPressResult({
        siteId: site.id,
        action: "allowed_domain_added",
        requestType: RequestType.SYSTEM,
        result: {
          ok: true,
          endpoint: "settings/ALLOWED_LINK_DOMAINS",
          method: "UPDATE",
          mockMode,
          data: { domain: addedDomain }
        },
        responseSummary: addedDomain
      });
    }
  }

  revalidatePath("/");
}

export async function testWordPressConnection(formData: FormData) {
  const siteId = z.string().min(1).parse(formData.get("wordpressSiteId"));
  const site = await prisma.wordPressSite.findUniqueOrThrow({ where: { id: siteId } });
  const client = new WordPressClient(site);
  const result = await client.testConnection().catch((error) =>
    resultFromError(error, `${site.apiBaseUrl}/users/me`, "GET", site.mockMode || process.env.WORDPRESS_MOCK_MODE !== "false")
  );

  await prisma.wordPressSite.update({
    where: { id: site.id },
    data: {
      connectionStatus: connectionStatusForResult(result),
      lastConnectedAt: result.ok ? new Date() : null,
      lastError: result.error ?? null
    }
  });
  await logWordPressResult({
    siteId: site.id,
    action: "connection_test",
    result,
    requestType: RequestType.WP_CONNECTION_TEST
  });
  revalidatePath("/");
}

export async function createMockWordPressArticle(formData: FormData) {
  const wordpressSiteId = z.string().min(1).parse(formData.get("wordpressSiteId"));
  const prompt = String(formData.get("aiPrompt") ?? "").trim();
  const site = await prisma.wordPressSite.findUniqueOrThrow({
    where: { id: wordpressSiteId },
    include: { media: true }
  });
  const title = `${site.media.niche}の始め方と失敗しない選び方`;
  const slug = await uniqueLocalSlug(site.id, createSlug(`${site.media.niche}-beginner-guide`));
  const contentMarkdown = [
    `## ${site.media.niche}を始める前に確認したいこと`,
    `${site.media.niche}で成果を出すには、目的に合う選択肢を整理することが大切です。`,
    "",
    "## 比較するときのポイント",
    "- 費用",
    "- 導入しやすさ",
    "- 継続しやすさ",
    "",
    "## 注意点",
    "短期的な成果だけでなく、継続運用できるかを確認しましょう。"
  ].join("\n");

  await prisma.wordPressPost.create({
    data: {
      mediaId: site.mediaId,
      wordpressSiteId: site.id,
      title,
      slug,
      excerpt: `${site.media.niche}初心者向けに、選び方と注意点を整理します。`,
      contentMarkdown,
      contentHtml: markdownToSafeHtml(contentMarkdown),
      seoTitle: `${site.media.niche}おすすめ比較｜初心者向けの選び方`,
      seoDescription: `${site.media.niche}を始めたい方向けに、比較ポイントと注意点をわかりやすく解説します。`,
      focusKeyword: `${site.media.niche} 初心者`,
      aiPrompt: prompt || `Generate WordPress draft for ${site.media.name}`,
      aiModel: process.env.AI_MOCK_MODE === "false" ? "openai-future" : "mock"
    }
  });
  revalidatePath("/");
}

export async function createWordPressPost(formData: FormData) {
  const data = postSchema.parse(Object.fromEntries(formData));
  const site = await prisma.wordPressSite.findUniqueOrThrow({ where: { id: data.wordpressSiteId } });
  const slug = await uniqueLocalSlug(site.id, createSlug(data.slug || data.title));
  await prisma.wordPressPost.create({
    data: {
      mediaId: site.mediaId,
      wordpressSiteId: site.id,
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      contentMarkdown: data.contentMarkdown,
      contentHtml: markdownToSafeHtml(data.contentMarkdown),
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.excerpt || null,
      focusKeyword: data.focusKeyword || null
    }
  });
  revalidatePath("/");
}

export async function approveWordPressPost(formData: FormData) {
  const postId = z.string().min(1).parse(formData.get("wordpressPostId"));
  await prisma.wordPressPost.update({
    where: { id: postId },
    data: {
      approvalStatus: ApprovalDecision.APPROVED,
      approvedBy: "local-admin",
      approvedAt: new Date(),
      localStatus: WordPressLocalStatus.READY_TO_SYNC,
      lastError: null
    }
  });
  revalidatePath("/");
}

export async function checkWordPressSlug(formData: FormData) {
  const postId = z.string().min(1).parse(formData.get("wordpressPostId"));
  const post = await prisma.wordPressPost.findUniqueOrThrow({
    where: { id: postId },
    include: { wordpressSite: true }
  });
  const localDuplicate = await prisma.wordPressPost.findFirst({
    where: {
      id: { not: post.id },
      wordpressSiteId: post.wordpressSiteId,
      slug: post.slug
    }
  });

  if (localDuplicate) {
    await prisma.wordPressPost.update({
      where: { id: post.id },
      data: {
        duplicateCheckStatus: DuplicateCheckStatus.DUPLICATE_FOUND,
        duplicateCheckResult: `ローカル重複があります。候補: ${nextSlugCandidate(post.slug)}`
      }
    });
    revalidatePath("/");
    return;
  }

  const client = new WordPressClient(post.wordpressSite);
  const result = await client.findPostBySlug(post.slug).catch((error) =>
    resultFromError<WordPressPostResponse[]>(
      error,
      `${post.wordpressSite.apiBaseUrl}/posts?slug=${post.slug}`,
      "GET",
      post.wordpressSite.mockMode || process.env.WORDPRESS_MOCK_MODE !== "false"
    )
  );
  const duplicateFound = Boolean(result.data && Array.isArray(result.data) && result.data.length > 0);
  await prisma.wordPressPost.update({
    where: { id: post.id },
    data: {
      duplicateCheckStatus: duplicateFound ? DuplicateCheckStatus.DUPLICATE_FOUND : DuplicateCheckStatus.UNIQUE,
      duplicateCheckResult: duplicateFound ? `WordPress側に同slugの記事があります。候補: ${nextSlugCandidate(post.slug)}` : "unique",
      lastError: result.ok ? null : result.error
    }
  });
  await logWordPressResult({
    siteId: post.wordpressSiteId,
    postId: post.id,
    action: "duplicate_check",
    result,
    requestType: RequestType.WP_POST_DUPLICATE_CHECK
  });
  revalidatePath("/");
}

export async function syncWordPressDraft(formData: FormData) {
  const postId = z.string().min(1).parse(formData.get("wordpressPostId"));
  const post = await prisma.wordPressPost.findUniqueOrThrow({
    where: { id: postId },
    include: { wordpressSite: true }
  });

  if (post.approvalStatus !== ApprovalDecision.APPROVED && post.localStatus !== WordPressLocalStatus.READY_TO_SYNC) {
    throw new Error("承認済み、または同期準備済みの記事だけWordPressへ同期できます。");
  }
  if (!post.wordpressPostId && post.duplicateCheckStatus !== DuplicateCheckStatus.UNIQUE) {
    throw new Error("新規作成前にslug重複確認を行い、uniqueにしてください。");
  }

  const status = mapWordPressStatus(post.wordpressSite.defaultStatus);
  if (status === "publish" && !post.wordpressSite.allowPublish) {
    throw new Error("Phase 2ではpublishが無効です。draftとして同期してください。");
  }

  await prisma.wordPressPost.update({
    where: { id: post.id },
    data: { localStatus: WordPressLocalStatus.SYNCING, lastError: null }
  });

  const client = new WordPressClient(post.wordpressSite);
  const payload = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.contentHtml,
    status,
    categories: Array.isArray(post.categoryIds) ? (post.categoryIds as number[]) : undefined,
    tags: Array.isArray(post.tagIds) ? (post.tagIds as number[]) : undefined
  };
  const result = await client.createOrUpdatePost(payload, post.wordpressPostId).catch((error) =>
    resultFromError<WordPressPostResponse>(
      error,
      `${post.wordpressSite.apiBaseUrl}/posts${post.wordpressPostId ? `/${post.wordpressPostId}` : ""}`,
      "POST",
      post.wordpressSite.mockMode || process.env.WORDPRESS_MOCK_MODE !== "false"
    )
  );

  if (result.ok && result.data) {
    await prisma.wordPressPost.update({
      where: { id: post.id },
      data: {
        status: result.data.status,
        localStatus: result.data.status === "publish" ? WordPressLocalStatus.PUBLISHED : WordPressLocalStatus.SYNCED_DRAFT,
        wordpressPostId: String(result.data.id),
        wordpressPostUrl: result.data.link,
        wordpressEditUrl: buildEditUrl(post.wordpressSite.siteUrl, result.data.id),
        lastSyncedAt: new Date(),
        lastError: null
      }
    });
  } else {
    await prisma.wordPressPost.update({
      where: { id: post.id },
      data: { localStatus: WordPressLocalStatus.FAILED, lastError: result.error ?? "WordPress sync failed" }
    });
  }

  await logWordPressResult({
    siteId: post.wordpressSiteId,
    postId: post.id,
    action: post.wordpressPostId ? "post_update" : "post_create",
    result,
    requestType: result.mockMode ? RequestType.WP_MOCK_POST_CREATE : post.wordpressPostId ? RequestType.WP_POST_UPDATE : RequestType.WP_POST_CREATE,
    requestSummary: JSON.stringify({ title: post.title, slug: post.slug, status }),
    responseSummary: result.data ? JSON.stringify({ id: result.data.id, link: result.data.link }) : undefined
  });
  revalidatePath("/");
}

export async function syncWordPressTerms(formData: FormData) {
  const siteId = z.string().min(1).parse(formData.get("wordpressSiteId"));
  const kind = z.enum(["categories", "tags"]).parse(formData.get("kind"));
  const site = await prisma.wordPressSite.findUniqueOrThrow({ where: { id: siteId } });
  const client = new WordPressClient(site);
  const result = await client.syncTerms(kind).catch((error) =>
    resultFromError<WordPressTermResponse[]>(
      error,
      `${site.apiBaseUrl}/${kind}?per_page=100`,
      "GET",
      site.mockMode || process.env.WORDPRESS_MOCK_MODE !== "false"
    )
  );

  if (result.ok && result.data) {
    if (kind === "categories") {
      await Promise.all(
        result.data.map((term) =>
          prisma.wordPressCategory.upsert({
            where: {
              wordpressSiteId_wordpressCategoryId: {
                wordpressSiteId: site.id,
                wordpressCategoryId: term.id
              }
            },
            update: { name: term.name, slug: term.slug, description: term.description, count: term.count ?? 0 },
            create: {
              wordpressSiteId: site.id,
              wordpressCategoryId: term.id,
              name: term.name,
              slug: term.slug,
              description: term.description,
              count: term.count ?? 0
            }
          })
        )
      );
    } else {
      await Promise.all(
        result.data.map((term) =>
          prisma.wordPressTag.upsert({
            where: {
              wordpressSiteId_wordpressTagId: {
                wordpressSiteId: site.id,
                wordpressTagId: term.id
              }
            },
            update: { name: term.name, slug: term.slug, description: term.description, count: term.count ?? 0 },
            create: {
              wordpressSiteId: site.id,
              wordpressTagId: term.id,
              name: term.name,
              slug: term.slug,
              description: term.description,
              count: term.count ?? 0
            }
          })
        )
      );
    }
  }

  await logWordPressResult({
    siteId: site.id,
    action: kind === "categories" ? "category_sync" : "tag_sync",
    result,
    requestType: kind === "categories" ? RequestType.WP_CATEGORY_SYNC : RequestType.WP_TAG_SYNC,
    responseSummary: result.data ? `${result.data.length} terms` : undefined
  });
  revalidatePath("/");
}

export async function createXPostFromWordPressPost(formData: FormData) {
  const wordpressPostId = z.string().min(1).parse(formData.get("wordpressPostId"));
  const socialAccountId = z.string().min(1).parse(formData.get("socialAccountId"));
  const [wordpressPost, account] = await Promise.all([
    prisma.wordPressPost.findUniqueOrThrow({ where: { id: wordpressPostId }, include: { media: true } }),
    prisma.socialAccount.findUniqueOrThrow({ where: { id: socialAccountId } })
  ]);

  if (!wordpressPost.wordpressPostUrl) {
    throw new Error("WordPress URLが未保存の記事からはX投稿を作成できません。");
  }
  if (account.mediaId !== wordpressPost.mediaId || account.platform !== Platform.X) {
    throw new Error("記事と同じメディアに紐づくXアカウントを選択してください。");
  }

  const body = `${wordpressPost.title}を記事にまとめました。要点と注意点を確認できます。`;
  const linkCheck = await checkPostLinks({
    body,
    destinationUrl: wordpressPost.wordpressPostUrl,
    linkUrl: wordpressPost.wordpressPostUrl
  });

  const post = await prisma.post.create({
    data: {
      mediaId: wordpressPost.mediaId,
      socialAccountId: account.id,
      platform: Platform.X,
      postType: PostType.TEXT_WITH_LINK,
      title: `WP記事誘導: ${wordpressPost.title}`,
      body,
      destinationUrl: wordpressPost.wordpressPostUrl,
      linkUrl: wordpressPost.wordpressPostUrl,
      status: PostStatus.DRAFT,
      approvalStatus: null,
      linkCheckStatus: linkCheck.status,
      linkCheckReason: linkCheck.reason,
      detectedUrls: linkCheck.detectedUrls,
      checkedAt: new Date(),
      complianceNotes: "WordPress記事URLへの誘導。広告リンク直接掲載なし。"
    }
  });
  await persistPostLinkCheck(post.id, linkCheck);
  revalidatePath("/");
}
