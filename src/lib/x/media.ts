import {
  ApiEventType,
  CreativeAssetType,
  MediaUploadStatus,
  Platform,
  RequestType,
  type CreativeAsset,
  type Post,
} from "@prisma/client";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { assertAssetUsable } from "@/src/lib/images/risk-check";

export async function attachXMediaMock(input: {
  post: Post;
  asset: CreativeAsset;
}) {
  assertAssetUsable(input.asset);
  if (input.asset.assetType !== CreativeAssetType.X_POST_IMAGE) {
    throw new Error("Only X_POST_IMAGE assets can be used as X post images.");
  }

  const mockMode =
    process.env.X_MEDIA_MOCK_MODE !== "false" ||
    process.env.X_MEDIA_UPLOAD_ENABLED !== "true";
  if (!mockMode) {
    throw new Error("Real X media upload is not enabled for Phase 3.");
  }

  const maxBytes =
    Number(process.env.X_MEDIA_MAX_FILE_SIZE_MB ?? 5) * 1024 * 1024;
  if (input.asset.fileSize && input.asset.fileSize > maxBytes) {
    throw new Error("Image is larger than the configured X media limit.");
  }

  const mockMediaId = `mock_x_media_${randomUUID().slice(0, 8)}`;
  await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: input.post.id },
      data: {
        creativeAssetId: input.asset.id,
        imageUrl: input.asset.publicUrl,
        postType: input.post.destinationUrl ? "IMAGE_WITH_LINK" : "IMAGE",
        mediaUploadStatus: MediaUploadStatus.UPLOADED_MOCK,
        externalMediaId: mockMediaId,
        mediaUploadError: null,
        madeWithAi: input.asset.madeWithAi,
      },
    });

    const existingUsage = await tx.creativeAssetUsage.findFirst({
      where: {
        creativeAssetId: input.asset.id,
        postId: input.post.id,
        usageType: "X_POST_IMAGE",
      },
      select: { id: true },
    });
    if (!existingUsage) {
      await tx.creativeAssetUsage.create({
        data: {
          creativeAssetId: input.asset.id,
          mediaId: input.post.mediaId,
          postId: input.post.id,
          usageType: "X_POST_IMAGE",
          platform: Platform.X,
        },
      });
    }

    await tx.apiUsageLog.create({
      data: {
        socialAccountId: input.post.socialAccountId,
        postId: input.post.id,
        platform: Platform.X,
        eventType: ApiEventType.REQUEST,
        requestType: RequestType.X_MEDIA_UPLOAD,
        endpoint: "/2/media/upload",
        method: "POST",
        statusCode: 200,
        success: true,
        mockMode: true,
        message: `mock X media upload: ${mockMediaId}`,
      },
    });
  });

  return mockMediaId;
}
