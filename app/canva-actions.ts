"use server";

import {
  AssetApprovalStatus,
  CanvaConnectionStatus,
  CanvaJobStatus,
  CanvaJobType,
  CanvaTemplateType,
  CreativeAssetType,
  LinkCheckStatus,
  Platform,
  RequestType
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { mockCanvaConnection } from "@/src/lib/canva/mock";
import { createMockCanvaAutofill } from "@/src/lib/canva/autofill";
import { createMockCanvaExport } from "@/src/lib/canva/export";
import { logCanvaResult } from "@/src/lib/canva/client";
import { buildAltText } from "@/src/lib/images/alt-text";
import { buildMockSvg } from "@/src/lib/images/mock";
import { evaluateImageRisk } from "@/src/lib/images/risk-check";
import { saveGeneratedImage } from "@/src/lib/images/storage";
import { assertAllowedImage } from "@/src/lib/images/validation";
import { attachFeaturedImageMock } from "@/src/lib/wordpress/media";
import { attachXMediaMock } from "@/src/lib/x/media";

const connectionSchema = z.object({
  mediaId: z.string().min(1),
  connectionName: z.string().trim().min(1),
  canvaUserEmail: z.string().trim().email().optional().or(z.literal(""))
});

const templateSchema = z.object({
  mediaId: z.string().min(1),
  canvaConnectionId: z.string().optional().or(z.literal("")),
  templateName: z.string().trim().min(1),
  canvaTemplateId: z.string().trim().min(1),
  templateType: z.nativeEnum(CanvaTemplateType),
  width: z.coerce.number().int().positive(),
  height: z.coerce.number().int().positive(),
  autofillFields: z.string().trim().optional(),
  requiredFields: z.string().trim().optional(),
  optionalFields: z.string().trim().optional(),
  memo: z.string().trim().optional()
});

function platformForTemplate(type: CanvaTemplateType) {
  return type === CanvaTemplateType.X_POST_IMAGE ? Platform.X : Platform.WORDPRESS;
}

function jobTypeForAsset(assetType: CreativeAssetType) {
  return assetType === CreativeAssetType.X_POST_IMAGE ? CanvaJobType.X_POST_IMAGE : CanvaJobType.FEATURED_IMAGE;
}

function safeJson(raw?: string) {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export async function connectCanvaMock(formData: FormData) {
  const data = connectionSchema.parse(Object.fromEntries(formData));
  const mock = mockCanvaConnection(data.canvaUserEmail || undefined);
  const connection = await prisma.canvaConnection.create({
    data: {
      mediaId: data.mediaId,
      connectionName: data.connectionName,
      canvaUserId: mock.canvaUserId,
      canvaUserEmail: mock.canvaUserEmail,
      scopes: mock.scopes,
      connectionStatus: CanvaConnectionStatus.MOCK_CONNECTED,
      mockMode: true,
      lastConnectedAt: new Date()
    }
  });

  await logCanvaResult({
    connectionId: connection.id,
    action: "mock_connect",
    requestType: RequestType.CANVA_OAUTH_CALLBACK,
    result: {
      ok: true,
      endpoint: "/api/canva/mock-connect",
      method: "POST",
      mockMode: true,
      statusCode: 200,
      data: { canvaUserId: mock.canvaUserId }
    },
    responseSummary: mock.canvaUserEmail
  });
  revalidatePath("/");
}

export async function createCanvaTemplate(formData: FormData) {
  const data = templateSchema.parse(Object.fromEntries(formData));
  if (data.canvaConnectionId) {
    const connection = await prisma.canvaConnection.findUniqueOrThrow({
      where: { id: data.canvaConnectionId },
      select: { mediaId: true }
    });
    if (connection.mediaId !== data.mediaId) {
      throw new Error("Canva connection and template must belong to the same media site.");
    }
  }
  await prisma.canvaBrandTemplate.create({
    data: {
      mediaId: data.mediaId,
      canvaConnectionId: data.canvaConnectionId || null,
      templateName: data.templateName,
      canvaTemplateId: data.canvaTemplateId,
      templateType: data.templateType,
      platform: platformForTemplate(data.templateType),
      aspectRatio: `${data.width}:${data.height}`,
      width: data.width,
      height: data.height,
      autofillFields: safeJson(data.autofillFields),
      requiredFields: safeJson(data.requiredFields),
      optionalFields: safeJson(data.optionalFields),
      memo: data.memo
    }
  });
  revalidatePath("/");
}

export async function generateMockAsset(formData: FormData) {
  const title = z.string().trim().min(1).parse(formData.get("title"));
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const assetType = z.nativeEnum(CreativeAssetType).parse(formData.get("assetType"));
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const canvaBrandTemplateId = String(formData.get("canvaBrandTemplateId") ?? "").trim() || null;
  const wordpressPostId = String(formData.get("wordpressPostId") ?? "").trim() || null;
  const postId = String(formData.get("postId") ?? "").trim() || null;

  const [media, template] = await Promise.all([
    prisma.media.findUniqueOrThrow({ where: { id: mediaId } }),
    canvaBrandTemplateId
      ? prisma.canvaBrandTemplate.findUnique({ where: { id: canvaBrandTemplateId } })
      : prisma.canvaBrandTemplate.findFirst({
          where: {
            mediaId,
            templateType:
              assetType === CreativeAssetType.X_POST_IMAGE
                ? CanvaTemplateType.X_POST_IMAGE
                : CanvaTemplateType.WORDPRESS_FEATURED_IMAGE
          },
          orderBy: { createdAt: "desc" }
        })
  ]);
  if (canvaBrandTemplateId && !template) {
    throw new Error("Selected Canva template was not found.");
  }
  if (template && template.mediaId !== mediaId) {
    throw new Error("Selected Canva template belongs to a different media site.");
  }
  if (
    template &&
    ((assetType === CreativeAssetType.X_POST_IMAGE && template.templateType !== CanvaTemplateType.X_POST_IMAGE) ||
      (assetType === CreativeAssetType.FEATURED_IMAGE &&
        template.templateType !== CanvaTemplateType.WORDPRESS_FEATURED_IMAGE))
  ) {
    throw new Error("Selected Canva template type does not match the requested asset type.");
  }

  const designJob = await prisma.canvaDesignJob.create({
    data: {
      mediaId,
      canvaConnectionId: template?.canvaConnectionId ?? null,
      canvaBrandTemplateId: template?.id ?? null,
      wordpressPostId,
      postId,
      jobType: jobTypeForAsset(assetType),
      inputData: { title, subtitle, siteName: media.name },
      prompt: String(formData.get("prompt") ?? "").trim() || null,
      status: CanvaJobStatus.PROCESSING,
      mockMode: true
    }
  });

  const autofill = await createMockCanvaAutofill({
    templateId: template?.canvaTemplateId ?? `mock-template-${assetType.toLowerCase()}`,
    connectionId: template?.canvaConnectionId,
    designJobId: designJob.id,
    payloadSummary: JSON.stringify({ title, subtitle })
  });
  if (!autofill.ok || !autofill.data) {
    await prisma.canvaDesignJob.update({
      where: { id: designJob.id },
      data: { status: CanvaJobStatus.FAILED, lastError: autofill.error ?? "Canva mock autofill failed" }
    });
    revalidatePath("/");
    return;
  }

  const exported = await createMockCanvaExport({
    designId: autofill.data.designId,
    connectionId: template?.canvaConnectionId,
    designJobId: designJob.id
  });
  if (!exported.ok || !exported.data) {
    await prisma.canvaDesignJob.update({
      where: { id: designJob.id },
      data: { status: CanvaJobStatus.FAILED, lastError: exported.error ?? "Canva mock export failed" }
    });
    revalidatePath("/");
    return;
  }
  const svg = buildMockSvg({ title, subtitle, siteName: media.name, assetType });
  const stored = await saveGeneratedImage(svg.filename, svg.svg);
  assertAllowedImage({ mimeType: "image/svg+xml", fileSize: stored.fileSize, mock: true });

  const canvaExport = await prisma.canvaExport.create({
    data: {
      canvaDesignJobId: designJob.id,
      exportFormat: "svg",
      exportStatus: "EXPORTED",
      canvaExportJobId: exported.data?.exportJobId,
      downloadUrl: exported.data?.downloadUrl,
      localFileUrl: stored.localFileUrl,
      publicUrl: stored.publicUrl,
      fileSize: stored.fileSize,
      width: svg.width,
      height: svg.height,
      mimeType: "image/svg+xml",
      mockMode: true
    }
  });

  await prisma.$transaction([
    prisma.canvaDesignJob.update({
      where: { id: designJob.id },
      data: {
        status: CanvaJobStatus.EXPORTED,
        canvaDesignId: autofill.data.designId,
        canvaDesignUrl: autofill.data.designUrl
      }
    }),
    prisma.creativeAsset.create({
      data: {
        mediaId,
        source: "AI_MOCK",
        assetType,
        title,
        description: subtitle || null,
        altText: buildAltText({ title, siteName: media.name, assetType }),
        localFileUrl: stored.localFileUrl,
        publicUrl: stored.publicUrl,
        mimeType: "image/svg+xml",
        fileSize: stored.fileSize,
        width: svg.width,
        height: svg.height,
        canvaDesignJobId: designJob.id,
        canvaExportId: canvaExport.id,
        approvalStatus: AssetApprovalStatus.PENDING_APPROVAL,
        riskCheckStatus: LinkCheckStatus.NOT_CHECKED,
        madeWithAi: true
      }
    })
  ]);
  revalidatePath("/");
}

export async function runAssetRiskCheck(formData: FormData) {
  const creativeAssetId = z.string().min(1).parse(formData.get("creativeAssetId"));
  const asset = await prisma.creativeAsset.findUniqueOrThrow({ where: { id: creativeAssetId } });
  const result = evaluateImageRisk(asset);
  await prisma.creativeAsset.update({
    where: { id: asset.id },
    data: {
      riskCheckStatus: result.status,
      riskCheckReason: result.reason,
      approvalStatus: result.status === LinkCheckStatus.BLOCKED ? AssetApprovalStatus.BLOCKED : asset.approvalStatus
    }
  });
  revalidatePath("/");
}

export async function approveCreativeAsset(formData: FormData) {
  const creativeAssetId = z.string().min(1).parse(formData.get("creativeAssetId"));
  const asset = await prisma.creativeAsset.findUniqueOrThrow({ where: { id: creativeAssetId } });
  if (asset.riskCheckStatus !== LinkCheckStatus.SAFE) {
    throw new Error("Run a safe image risk check before approval.");
  }
  await prisma.$transaction([
    prisma.creativeAsset.update({
      where: { id: creativeAssetId },
      data: {
        approvalStatus: AssetApprovalStatus.APPROVED,
        approvedBy: "local-admin",
        approvedAt: new Date()
      }
    }),
    prisma.imageApproval.create({
      data: {
        creativeAssetId,
        status: AssetApprovalStatus.APPROVED,
        reviewer: "local-admin",
        approvedAt: new Date(),
        riskNotes: asset.riskCheckReason
      }
    })
  ]);
  revalidatePath("/");
}

export async function rejectCreativeAsset(formData: FormData) {
  const creativeAssetId = z.string().min(1).parse(formData.get("creativeAssetId"));
  const comment = String(formData.get("comment") ?? "Rejected locally").trim();
  await prisma.$transaction([
    prisma.creativeAsset.update({
      where: { id: creativeAssetId },
      data: { approvalStatus: AssetApprovalStatus.REJECTED }
    }),
    prisma.imageApproval.create({
      data: {
        creativeAssetId,
        status: AssetApprovalStatus.REJECTED,
        reviewer: "local-admin",
        comment
      }
    })
  ]);
  revalidatePath("/");
}

export async function setWordPressFeaturedAsset(formData: FormData) {
  const wordpressPostId = z.string().min(1).parse(formData.get("wordpressPostId"));
  const creativeAssetId = z.string().min(1).parse(formData.get("creativeAssetId"));
  const [post, asset] = await Promise.all([
    prisma.wordPressPost.findUniqueOrThrow({ where: { id: wordpressPostId }, include: { wordpressSite: true } }),
    prisma.creativeAsset.findUniqueOrThrow({ where: { id: creativeAssetId } })
  ]);
  if (asset.mediaId !== post.mediaId) {
    throw new Error("The selected image belongs to a different media site.");
  }
  if (asset.assetType !== CreativeAssetType.FEATURED_IMAGE) {
    throw new Error("Only FEATURED_IMAGE assets can be used as WordPress featured images.");
  }
  await attachFeaturedImageMock({ site: post.wordpressSite, post, asset });
  revalidatePath("/");
}

export async function setXPostAsset(formData: FormData) {
  const postId = z.string().min(1).parse(formData.get("postId"));
  const creativeAssetId = z.string().min(1).parse(formData.get("creativeAssetId"));
  const [post, asset] = await Promise.all([
    prisma.post.findUniqueOrThrow({ where: { id: postId } }),
    prisma.creativeAsset.findUniqueOrThrow({ where: { id: creativeAssetId } })
  ]);
  if (asset.mediaId !== post.mediaId) {
    throw new Error("The selected image belongs to a different media site.");
  }
  if (asset.assetType !== CreativeAssetType.X_POST_IMAGE) {
    throw new Error("Only X_POST_IMAGE assets can be used as X post images.");
  }
  await attachXMediaMock({ post, asset });
  revalidatePath("/");
}
