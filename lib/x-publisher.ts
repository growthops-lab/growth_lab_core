import {
  AccountStatus,
  ApiEventType,
  CreativeAssetType,
  LinkCheckStatus,
  MediaUploadStatus,
  MediaStatus,
  Platform,
  PostStatus,
  RequestType
} from "@prisma/client";
import { randomUUID } from "crypto";
import { checkPostLinks, persistPostLinkCheck } from "@/lib/link-check";
import { prisma } from "@/lib/prisma";
import { getSettings, parseBoolean } from "@/lib/settings";
import { assertAssetUsable } from "@/src/lib/images/risk-check";
import { attachXMediaMock } from "@/src/lib/x/media";

type PublishResult = {
  ok: boolean;
  externalPostId?: string;
  reason?: string;
};

const LOCK_TIMEOUT_MINUTES = 15;
const POST_CREATE_REQUEST_TYPES = [
  RequestType.POST_CREATE,
  RequestType.MOCK_POST_CREATE,
  RequestType.X_POST_CREATE_WITH_MEDIA
];

async function checkLimits(socialAccountId: string) {
  const account = await prisma.socialAccount.findUniqueOrThrow({
    where: { id: socialAccountId },
    include: { media: true }
  });
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const windowStart = new Date(now.getTime() - account.windowMinutes * 60 * 1000);

  if (account.media.status !== MediaStatus.ACTIVE) {
    return { allowed: false, blocked: true, rateLimited: false, reason: "メディアが停止中またはアーカイブ済みです。" };
  }
  if (account.status === AccountStatus.RATE_LIMITED) {
    return { allowed: false, blocked: false, rateLimited: true, reason: "アカウントがレート制限状態です。" };
  }
  if (account.status !== AccountStatus.ACTIVE) {
    return { allowed: false, blocked: true, rateLimited: false, reason: "アカウントがアクティブではありません。" };
  }
  if (!account.autoPostingEnabled) {
    return { allowed: false, blocked: true, rateLimited: false, reason: "このアカウントの自動投稿がOFFです。" };
  }
  if (account.apiStopFlag) {
    return { allowed: false, blocked: false, rateLimited: true, reason: account.apiStopReason ?? "API停止フラグがONです。" };
  }
  if (account.nextAllowedPostAt && account.nextAllowedPostAt > now) {
    return { allowed: false, blocked: false, rateLimited: true, reason: "次回投稿可能時刻に達していません。" };
  }

  const [dailyCount, windowCount] = await Promise.all([
    prisma.apiUsageLog.count({
      where: {
        socialAccountId,
        platform: Platform.X,
        requestType: { in: POST_CREATE_REQUEST_TYPES },
        createdAt: { gte: startOfDay }
      }
    }),
    prisma.apiUsageLog.count({
      where: {
        socialAccountId,
        platform: Platform.X,
        requestType: { in: POST_CREATE_REQUEST_TYPES },
        createdAt: { gte: windowStart }
      }
    })
  ]);

  if (dailyCount >= account.dailyLimit) {
    return { allowed: false, blocked: false, rateLimited: true, reason: "X APIの日次上限に到達しました。" };
  }
  if (windowCount >= account.windowLimit) {
    return { allowed: false, blocked: false, rateLimited: true, reason: "X APIの短時間レート制限に到達しました。" };
  }
  return { allowed: true, blocked: false, rateLimited: false, reason: null };
}

export async function publishPostToX(postId: string): Promise<PublishResult> {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    include: { socialAccount: true, creativeAsset: true }
  });

  if (post.status !== PostStatus.SCHEDULED) {
    return { ok: false, reason: "予約済みの投稿だけが公開対象です。" };
  }
  const settings = await getSettings();
  if (!parseBoolean(settings.AUTO_POSTING_ENABLED)) {
    return { ok: false, reason: "システム全体の自動投稿がOFFです。" };
  }

  const staleLockCutoff = new Date(Date.now() - LOCK_TIMEOUT_MINUTES * 60 * 1000);
  if (post.lockedAt && post.lockedAt > staleLockCutoff) {
    return { ok: false, reason: "この投稿は処理中です。" };
  }

  const lockedPost = await prisma.post.updateMany({
    where: {
      id: post.id,
      status: PostStatus.SCHEDULED,
      OR: [{ lockedAt: null }, { lockedAt: { lt: staleLockCutoff } }]
    },
    data: { lockedAt: new Date(), processingStartedAt: new Date() }
  });

  if (lockedPost.count === 0) {
    return { ok: false, reason: "この投稿は別プロセスで処理中です。" };
  }

  const linkCheck = await checkPostLinks({
    body: post.body,
    destinationUrl: post.destinationUrl,
    linkUrl: post.linkUrl
  });
  await persistPostLinkCheck(post.id, linkCheck);
  if (linkCheck.status !== LinkCheckStatus.SAFE) {
    await prisma.post.update({
      where: { id: post.id },
      data: {
        status: PostStatus.BLOCKED,
        lockedAt: null,
        lastError: linkCheck.reason,
        failureReason: linkCheck.reason
      }
    });
    await prisma.apiUsageLog.create({
      data: {
        socialAccountId: post.socialAccountId,
        postId: post.id,
        platform: Platform.X,
        eventType: ApiEventType.POST_STOPPED,
        requestType: RequestType.LINK_CHECK,
        endpoint: "local/link-check",
        method: "CHECK",
        success: false,
        mockMode: process.env.X_MOCK_MODE !== "false",
        message: linkCheck.reason
      }
    });
    return { ok: false, reason: linkCheck.reason };
  }

  const limit = await checkLimits(post.socialAccountId);
  if (!limit.allowed) {
    const shouldMarkRateLimited = limit.rateLimited;
    const nextStatus = shouldMarkRateLimited
      ? PostStatus.STOPPED_RATE_LIMIT
      : limit.blocked
        ? PostStatus.BLOCKED
        : PostStatus.FAILED;
    await prisma.$transaction([
      prisma.post.update({
        where: { id: post.id },
        data: {
          status: nextStatus,
          failureReason: limit.reason,
          lastError: limit.reason,
          lockedAt: null,
          retryCount: limit.blocked ? undefined : { increment: 1 }
        }
      }),
      prisma.socialAccount.update({
        where: { id: post.socialAccountId },
        data: {
          status: shouldMarkRateLimited ? AccountStatus.RATE_LIMITED : post.socialAccount.status,
          apiStopFlag: shouldMarkRateLimited,
          apiStopReason: shouldMarkRateLimited ? limit.reason : undefined,
          nextAllowedPostAt: shouldMarkRateLimited ? new Date(Date.now() + 60 * 60 * 1000) : undefined,
          lastError: limit.reason
        }
      }),
      prisma.apiUsageLog.create({
        data: {
          socialAccountId: post.socialAccountId,
          postId: post.id,
          platform: Platform.X,
          eventType: ApiEventType.POST_STOPPED,
          requestType: RequestType.POST_CREATE,
          endpoint: "/2/tweets",
          success: false,
          mockMode: process.env.X_MOCK_MODE !== "false",
          message: limit.reason
        }
      })
    ]);
    return { ok: false, reason: limit.reason ?? "API上限により停止しました。" };
  }

  if (post.creativeAssetId && post.creativeAsset) {
    try {
      assertAssetUsable(post.creativeAsset);
      if (post.creativeAsset.assetType !== CreativeAssetType.X_POST_IMAGE) {
        throw new Error("Only X_POST_IMAGE assets can be used as X post images.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "X image is not usable.";
      await prisma.$transaction([
        prisma.post.update({
          where: { id: post.id },
          data: {
            status: PostStatus.BLOCKED,
            lockedAt: null,
            mediaUploadError: message,
            failureReason: message,
            lastError: message
          }
        }),
        prisma.apiUsageLog.create({
          data: {
            socialAccountId: post.socialAccountId,
            postId: post.id,
            platform: Platform.X,
            eventType: ApiEventType.POST_STOPPED,
            requestType: RequestType.X_MEDIA_UPLOAD,
            endpoint: "local/image-risk-check",
            method: "CHECK",
            success: false,
            mockMode: process.env.X_MOCK_MODE !== "false",
            message
          }
        })
      ]);
      return { ok: false, reason: message };
    }

    if (post.mediaUploadStatus === MediaUploadStatus.FAILED) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          status: PostStatus.FAILED,
          lockedAt: null,
          failureReason: post.mediaUploadError ?? "X media upload failed.",
          lastError: post.mediaUploadError ?? "X media upload failed."
        }
      });
      return { ok: false, reason: post.mediaUploadError ?? "X media upload failed." };
    }

    if (post.mediaUploadStatus !== MediaUploadStatus.UPLOADED_MOCK && post.mediaUploadStatus !== MediaUploadStatus.UPLOADED) {
      try {
        await attachXMediaMock({ post, asset: post.creativeAsset });
      } catch (error) {
        const message = error instanceof Error ? error.message : "X media upload failed.";
        await prisma.post.update({
          where: { id: post.id },
          data: {
            status: PostStatus.FAILED,
            mediaUploadStatus: MediaUploadStatus.FAILED,
            mediaUploadError: message,
            failureReason: message,
            lastError: message,
            lockedAt: null
          }
        });
        return { ok: false, reason: message };
      }
    }
  }

  const mockMode = process.env.X_MOCK_MODE !== "false";
  if (mockMode) {
    const externalPostId = `mock_x_post_${randomUUID()}`;
    await prisma.$transaction([
      prisma.post.update({
        where: { id: post.id },
        data: {
          status: PostStatus.PUBLISHED,
          publishedAt: new Date(),
          externalPostId,
          externalPostUrl: `https://x.com/mock/status/${externalPostId}`,
          failureReason: null,
          lastError: null,
          lockedAt: null
        }
      }),
      prisma.socialAccount.update({
        where: { id: post.socialAccountId },
        data: { lastPostedAt: new Date(), lastError: null }
      }),
      prisma.apiUsageLog.create({
        data: {
          socialAccountId: post.socialAccountId,
          postId: post.id,
          platform: Platform.X,
          eventType: ApiEventType.DRY_RUN,
          requestType: post.creativeAssetId ? RequestType.X_POST_CREATE_WITH_MEDIA : RequestType.MOCK_POST_CREATE,
          endpoint: "/2/tweets",
          method: "POST",
          statusCode: 200,
          success: true,
          mockMode: true,
          message: "X_MOCK_MODE=true のためモック投稿成功として記録しました。"
        }
      })
    ]);
    return { ok: true, externalPostId };
  }

  await prisma.apiUsageLog.create({
    data: {
      socialAccountId: post.socialAccountId,
      postId: post.id,
      platform: Platform.X,
      eventType: ApiEventType.ERROR,
      requestType: RequestType.POST_CREATE,
      endpoint: "/2/tweets",
      method: "POST",
      success: false,
      mockMode: false,
      message: "公式X APIクライアントは未設定です。認証情報と実装を追加してください。"
    }
  });
  await prisma.post.update({
    where: { id: post.id },
    data: {
      status: PostStatus.FAILED,
      failureReason: "公式X APIクライアント未設定",
      lastError: "公式X APIクライアント未設定",
      lockedAt: null,
      retryCount: { increment: 1 }
    }
  });
  return { ok: false, reason: "公式X APIクライアント未設定" };
}

export async function publishDuePosts() {
  const duePosts = await prisma.post.findMany({
    where: {
      status: PostStatus.SCHEDULED,
      scheduledAt: { lte: new Date() },
      platform: Platform.X
    },
    orderBy: { scheduledAt: "asc" },
    take: 20
  });

  const results = [];
  for (const post of duePosts) {
    results.push({ postId: post.id, ...(await publishPostToX(post.id)) });
  }
  return results;
}
