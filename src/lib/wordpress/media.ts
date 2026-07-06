import {
  ApiEventType,
  CreativeAssetType,
  Platform,
  RequestType,
  WordPressMediaUploadStatus,
  type CreativeAsset,
  type WordPressPost,
  type WordPressSite
} from "@prisma/client";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { assertAssetUsable } from "@/src/lib/images/risk-check";

export async function attachFeaturedImageMock(input: {
  site: WordPressSite;
  post: WordPressPost;
  asset: CreativeAsset;
}) {
  assertAssetUsable(input.asset);
  if (input.asset.assetType !== CreativeAssetType.FEATURED_IMAGE) {
    throw new Error("Only FEATURED_IMAGE assets can be used as WordPress featured images.");
  }

  const mockMode = process.env.WORDPRESS_MEDIA_MOCK_MODE !== "false" || process.env.WORDPRESS_ENABLE_MEDIA_UPLOAD !== "true";
  if (!mockMode) {
    throw new Error("Real WordPress media upload is not enabled for Phase 3.");
  }

  const mockMediaId = `mock_wp_media_${randomUUID().slice(0, 8)}`;
  const wordpressMedia = await prisma.$transaction(async (tx) => {
    const createdMedia = await tx.wordPressMedia.create({
      data: {
        wordpressSiteId: input.site.id,
        mediaId: input.post.mediaId,
        creativeAssetId: input.asset.id,
        localFileUrl: input.asset.localFileUrl,
        sourceImageUrl: input.asset.publicUrl,
        wordpressMediaId: mockMediaId,
        wordpressMediaUrl: `${input.site.siteUrl.replace(/\/$/, "")}/wp-content/uploads/${mockMediaId}.svg`,
        altText: input.asset.altText,
        uploadStatus: WordPressMediaUploadStatus.MOCK_UPLOADED
      }
    });

    const existingUsage = await tx.creativeAssetUsage.findFirst({
      where: {
        creativeAssetId: input.asset.id,
        wordpressPostId: input.post.id,
        usageType: "WORDPRESS_FEATURED_IMAGE"
      },
      select: { id: true }
    });

    await tx.creativeAsset.update({
      where: { id: input.asset.id },
      data: { wordpressMediaId: createdMedia.id }
    });
    await tx.wordPressPost.update({
      where: { id: input.post.id },
      data: {
        creativeAssetId: input.asset.id,
        featuredMediaId: mockMediaId
      }
    });
    if (!existingUsage) {
      await tx.creativeAssetUsage.create({
        data: {
          creativeAssetId: input.asset.id,
          mediaId: input.post.mediaId,
          wordpressPostId: input.post.id,
          usageType: "WORDPRESS_FEATURED_IMAGE",
          platform: Platform.WORDPRESS
        }
      });
    }
    await tx.wordPressSyncLog.create({
      data: {
        wordpressSiteId: input.site.id,
        wordpressPostId: input.post.id,
        action: "wp_media_mock_upload",
        endpoint: "/wp/v2/media",
        method: "POST",
        statusCode: 200,
        success: true,
        responsePayloadSummary: JSON.stringify({ wordpressMediaId: mockMediaId }),
        mockMode: true
      }
    });
    await tx.apiUsageLog.create({
      data: {
        platform: Platform.WORDPRESS,
        eventType: ApiEventType.REQUEST,
        requestType: RequestType.WP_MEDIA_UPLOAD,
        endpoint: "/wp/v2/media",
        method: "POST",
        statusCode: 200,
        success: true,
        mockMode: true,
        message: `mock WordPress media upload: ${mockMediaId}`
      }
    });

    return createdMedia;
  });

  return wordpressMedia;
}
