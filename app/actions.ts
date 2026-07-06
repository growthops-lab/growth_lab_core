"use server";

import { revalidatePath } from "next/cache";
import {
  AccountStatus,
  ApiEventType,
  ApprovalDecision,
  LinkCheckStatus,
  MediaStatus,
  Platform,
  PostStatus
} from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildComplianceNotes } from "@/lib/compliance";
import { checkPostLinks, persistPostLinkCheck, recheckAndRestorePost } from "@/lib/link-check";
import { nextDailySlot } from "@/lib/schedule";

const mediaSchema = z.object({
  name: z.string().trim().min(1),
  niche: z.string().trim().min(1),
  wordpressUrl: z.string().trim().url(),
  noteUrl: z.string().trim().url().optional().or(z.literal("")),
  bloggerUrl: z.string().trim().url().optional().or(z.literal("")),
  instagramUrl: z.string().trim().url().optional().or(z.literal("")),
  pinterestUrl: z.string().trim().url().optional().or(z.literal("")),
  notes: z.string().trim().optional()
});

const accountSchema = z.object({
  mediaId: z.string().min(1),
  handle: z.string().trim().min(1),
  displayName: z.string().trim().min(1),
  accountUrl: z.string().trim().url().optional().or(z.literal("")),
  autoPostingEnabled: z.coerce.boolean().default(false),
  dailyLimit: z.coerce.number().int().positive().default(50),
  windowLimit: z.coerce.number().int().positive().default(6),
  windowMinutes: z.coerce.number().int().positive().default(15)
});

const postSchema = z.object({
  mediaId: z.string().min(1),
  socialAccountId: z.string().min(1),
  title: z.string().trim().min(1),
  body: z.string().trim().min(1).max(260),
  destinationUrl: z.string().trim().url()
});

function normalizeHandle(handle: string) {
  return handle.startsWith("@") ? handle : `@${handle}`;
}

function parseScheduleInput(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return nextDailySlot();

  const scheduledAt = new Date(raw);
  if (Number.isNaN(scheduledAt.getTime())) {
    throw new Error("有効な予約日時を入力してください。");
  }
  if (scheduledAt <= new Date()) {
    throw new Error("予約日時は現在時刻より後にしてください。");
  }

  return scheduledAt;
}

export async function createMedia(formData: FormData) {
  const data = mediaSchema.parse(Object.fromEntries(formData));
  await prisma.media.create({
    data: {
      ...data,
      noteUrl: data.noteUrl || null,
      bloggerUrl: data.bloggerUrl || null,
      instagramUrl: data.instagramUrl || null,
      pinterestUrl: data.pinterestUrl || null
    }
  });
  revalidatePath("/");
}

export async function createSocialAccount(formData: FormData) {
  const data = accountSchema.parse(Object.fromEntries(formData));
  const media = await prisma.media.findUniqueOrThrow({ where: { id: data.mediaId } });
  if (media.status !== MediaStatus.ACTIVE) {
    throw new Error("有効なメディアにだけSNSアカウントを追加できます。");
  }

  await prisma.socialAccount.create({
    data: {
      ...data,
      accountUrl: data.accountUrl || null,
      handle: normalizeHandle(data.handle),
      platform: Platform.X,
      officialApiOnly: true
    }
  });
  revalidatePath("/");
}

export async function createMockAiPost(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const socialAccountId = z.string().min(1).parse(formData.get("socialAccountId"));
  const prompt = String(formData.get("aiPrompt") ?? "").trim();
  const [media, account] = await Promise.all([
    prisma.media.findUniqueOrThrow({ where: { id: mediaId } }),
    prisma.socialAccount.findUniqueOrThrow({ where: { id: socialAccountId } })
  ]);

  if (account.mediaId !== media.id || account.platform !== Platform.X) {
    throw new Error("選択したXアカウントとメディアの組み合わせが一致しません。");
  }
  if (media.status !== MediaStatus.ACTIVE || account.status !== AccountStatus.ACTIVE) {
    throw new Error("稼働中のメディアとアクティブなXアカウントだけAI下書きを作成できます。");
  }
  if (process.env.AI_MOCK_MODE === "false" && !process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEYが未設定です。Phase 1ではAI_MOCK_MODE=trueを推奨します。");
  }

  const body = `${media.niche}で迷いやすいポイントを整理しました。判断基準と注意点を記事で確認できます。`;
  const linkCheck = await checkPostLinks({
    body,
    destinationUrl: media.wordpressUrl,
    linkUrl: media.wordpressUrl
  });

  const post = await prisma.post.create({
    data: {
      mediaId: media.id,
      socialAccountId: account.id,
      platform: Platform.X,
      title: `AIモック生成: ${media.name}`,
      body,
      destinationUrl: media.wordpressUrl,
      linkUrl: media.wordpressUrl,
      status: linkCheck.status === LinkCheckStatus.BLOCKED ? PostStatus.BLOCKED : PostStatus.DRAFT,
      aiGenerated: true,
      aiPrompt: prompt || `Create X post for ${media.name}`,
      aiResult: body,
      linkCheckStatus: linkCheck.status,
      linkCheckReason: linkCheck.reason,
      detectedUrls: linkCheck.detectedUrls,
      checkedAt: new Date(),
      complianceNotes: buildComplianceNotes(media.wordpressUrl),
      failureReason: linkCheck.status === LinkCheckStatus.BLOCKED ? linkCheck.reason : null
    }
  });
  await persistPostLinkCheck(post.id, linkCheck);
  revalidatePath("/");
}

export async function submitDraftForApproval(formData: FormData) {
  const postId = z.string().min(1).parse(formData.get("postId"));
  const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });
  if (post.status !== PostStatus.DRAFT && post.status !== PostStatus.REJECTED) {
    throw new Error("下書きまたは差し戻し投稿だけ承認待ちにできます。");
  }

  const linkCheck = await checkPostLinks({
    body: post.body,
    destinationUrl: post.destinationUrl,
    linkUrl: post.linkUrl
  });
  await persistPostLinkCheck(post.id, linkCheck);
  if (linkCheck.status === LinkCheckStatus.BLOCKED) {
    throw new Error(`リンクチェックがブロックされました: ${linkCheck.reason}`);
  }

  await prisma.post.update({
    where: { id: post.id },
    data: { status: PostStatus.PENDING_APPROVAL, approvalStatus: null, failureReason: null, lastError: null }
  });
  revalidatePath("/");
}

export async function recheckPostLinks(formData: FormData) {
  const postId = z.string().min(1).parse(formData.get("postId"));
  await recheckAndRestorePost(postId);
  revalidatePath("/");
}

export async function createXPost(formData: FormData) {
  const data = postSchema.parse(Object.fromEntries(formData));
  const [media, account] = await Promise.all([
    prisma.media.findUniqueOrThrow({ where: { id: data.mediaId } }),
    prisma.socialAccount.findUniqueOrThrow({ where: { id: data.socialAccountId } })
  ]);

  if (media.status !== MediaStatus.ACTIVE) {
    throw new Error("停止中またはアーカイブ済みのメディアでは投稿を作成できません。");
  }
  if (account.platform !== Platform.X || account.mediaId !== data.mediaId) {
    throw new Error("選択したXアカウントとメディアの組み合わせが一致しません。");
  }
  if (account.status !== AccountStatus.ACTIVE) {
    throw new Error("アクティブなXアカウントだけ投稿を作成できます。");
  }

  const linkCheck = await checkPostLinks({
    body: data.body,
    destinationUrl: data.destinationUrl,
    linkUrl: data.destinationUrl
  });

  const post = await prisma.post.create({
    data: {
      ...data,
      linkUrl: data.destinationUrl,
      platform: Platform.X,
      status: linkCheck.status === LinkCheckStatus.BLOCKED ? PostStatus.BLOCKED : PostStatus.PENDING_APPROVAL,
      aiGenerated: true,
      linkCheckStatus: linkCheck.status,
      linkCheckReason: linkCheck.reason,
      detectedUrls: linkCheck.detectedUrls,
      checkedAt: new Date(),
      complianceNotes: buildComplianceNotes(data.destinationUrl),
      failureReason: linkCheck.status === LinkCheckStatus.BLOCKED ? linkCheck.reason : null
    }
  });
  await persistPostLinkCheck(post.id, linkCheck);
  revalidatePath("/");
}

export async function approvePost(formData: FormData) {
  const postId = z.string().min(1).parse(formData.get("postId"));
  const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });
  if (post.status !== PostStatus.PENDING_APPROVAL) {
    throw new Error("承認待ちの投稿だけ承認できます。");
  }
  const linkCheck = await checkPostLinks({
    body: post.body,
    destinationUrl: post.destinationUrl,
    linkUrl: post.linkUrl
  });
  await persistPostLinkCheck(post.id, linkCheck);
  if (linkCheck.status !== LinkCheckStatus.SAFE) {
    throw new Error(`リンクチェックが安全ではないため承認できません: ${linkCheck.reason}`);
  }

  await prisma.$transaction([
    prisma.postApproval.create({
      data: {
        postId,
        reviewer: "local-admin",
        decision: ApprovalDecision.APPROVED,
        comment: String(formData.get("comment") ?? "")
      }
    }),
    prisma.post.update({
      where: { id: postId },
      data: { status: PostStatus.APPROVED, approvalStatus: ApprovalDecision.APPROVED, failureReason: null }
    })
  ]);
  revalidatePath("/");
}

export async function rejectPost(formData: FormData) {
  const postId = z.string().min(1).parse(formData.get("postId"));
  const comment = String(formData.get("comment") ?? "修正が必要です。");
  const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });
  if (post.status !== PostStatus.PENDING_APPROVAL) {
    throw new Error("承認待ちの投稿だけ却下できます。");
  }

  await prisma.$transaction([
    prisma.postApproval.create({
      data: {
        postId,
        reviewer: "local-admin",
        decision: ApprovalDecision.REJECTED,
        comment
      }
    }),
    prisma.post.update({
      where: { id: postId },
      data: { status: PostStatus.REJECTED, approvalStatus: ApprovalDecision.REJECTED, failureReason: comment }
    })
  ]);
  revalidatePath("/");
}

export async function schedulePost(formData: FormData) {
  const postId = z.string().min(1).parse(formData.get("postId"));
  const scheduledAt = parseScheduleInput(formData.get("scheduledAt"));

  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    include: { socialAccount: true, media: true }
  });
  if (post.status !== PostStatus.APPROVED) {
    throw new Error("承認済み投稿だけが予約できます。");
  }
  if (post.media.status !== MediaStatus.ACTIVE) {
    throw new Error("停止中またはアーカイブ済みのメディアでは予約できません。");
  }
  if (post.socialAccount.status !== AccountStatus.ACTIVE) {
    throw new Error("アクティブなXアカウントだけ予約できます。");
  }
  const linkCheck = await checkPostLinks({
    body: post.body,
    destinationUrl: post.destinationUrl,
    linkUrl: post.linkUrl
  });
  await persistPostLinkCheck(post.id, linkCheck);
  if (linkCheck.status !== LinkCheckStatus.SAFE) {
    throw new Error(`リンクチェックが安全ではないため予約できません: ${linkCheck.reason}`);
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      status: PostStatus.SCHEDULED,
      scheduledAt
    }
  });
  revalidatePath("/");
}

export async function resetRateLimit(formData: FormData) {
  const socialAccountId = z.string().min(1).parse(formData.get("socialAccountId"));
  await prisma.$transaction([
    prisma.socialAccount.update({
      where: { id: socialAccountId },
      data: {
        status: AccountStatus.ACTIVE,
        apiStopFlag: false,
        apiStopReason: null,
        nextAllowedPostAt: null,
        lastError: null
      }
    }),
    prisma.apiUsageLog.create({
      data: {
        socialAccountId,
        platform: Platform.X,
        eventType: ApiEventType.REQUEST,
        endpoint: "local/reset-rate-limit",
        message: "ローカル管理者がレート制限状態を解除しました。"
      }
    })
  ]);
  revalidatePath("/");
}
