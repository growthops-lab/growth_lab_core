"use server";

import {
  AffiliateApplicationStatus,
  AffiliateLinkType,
  AffiliatePlacementPosition,
  AffiliatePlacementType,
  AffiliateProgramStatus,
  AffiliateRewardType,
  AffiliateRiskLevel,
  ApiEventType,
  DataConfidence,
  GrowthRecommendationStatus,
  Platform,
  RequestType,
  RevenueSource,
  RevenueStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { maskAffiliateUrl } from "@/src/lib/affiliate/links";
import { hashIdentifier } from "@/src/lib/affiliate/hash";
import {
  parseRevenueCsv,
  normalizeRevenueStatus,
  rewardColumns,
} from "@/src/lib/affiliate/csv";
import { summarizeRevenue } from "@/src/lib/affiliate/revenue";
import { calculateGrowthScore } from "@/src/lib/growth-score/calculate";
import { recommendationTitle } from "@/src/lib/growth-score/recommendation";

const networkSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  websiteUrl: z.string().trim().url().optional().or(z.literal("")),
  loginUrl: z.string().trim().url().optional().or(z.literal("")),
  memo: z.string().trim().optional(),
});

const programSchema = z.object({
  affiliateNetworkId: z.string().min(1),
  programName: z.string().trim().min(1),
  advertiserName: z.string().trim().optional(),
  genre: z.string().trim().optional(),
  category: z.string().trim().optional(),
  programUrl: z.string().trim().url().optional().or(z.literal("")),
  rewardType: z
    .nativeEnum(AffiliateRewardType)
    .default(AffiliateRewardType.FIXED),
  rewardAmount: z.coerce.number().nonnegative().optional(),
  rewardRate: z.coerce.number().nonnegative().optional(),
  currency: z.string().trim().default("JPY"),
  approvalRate: z.coerce.number().min(0).max(1).optional(),
  epc: z.coerce.number().nonnegative().optional(),
  cookieDurationDays: z.coerce.number().int().nonnegative().optional(),
  conversionCondition: z.string().trim().optional(),
  complianceNotes: z.string().trim().optional(),
  riskLevel: z
    .nativeEnum(AffiliateRiskLevel)
    .default(AffiliateRiskLevel.MEDIUM),
  status: z
    .nativeEnum(AffiliateProgramStatus)
    .default(AffiliateProgramStatus.DRAFT),
  memo: z.string().trim().optional(),
});

const linkSchema = z.object({
  affiliateProgramId: z.string().min(1),
  mediaId: z.string().min(1),
  name: z.string().trim().min(1),
  destinationUrl: z.string().trim().url(),
  affiliateUrl: z.string().trim().url(),
  trackingId: z.string().trim().optional(),
  utmSource: z.string().trim().optional(),
  utmMedium: z.string().trim().optional(),
  utmCampaign: z.string().trim().optional(),
  utmContent: z.string().trim().optional(),
  linkType: z.nativeEnum(AffiliateLinkType).default(AffiliateLinkType.TEXT),
  memo: z.string().trim().optional(),
});

const optionalNumber = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined ? undefined : value,
  z.coerce.number().nonnegative().optional(),
);
const optionalRatio = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined ? undefined : value,
  z.coerce.number().min(0).max(1).optional(),
);

const strictProgramSchema = programSchema.extend({
  rewardAmount: optionalNumber,
  rewardRate: optionalNumber,
  approvalRate: optionalRatio,
  epc: optionalNumber,
  cookieDurationDays: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined ? undefined : value,
    z.coerce.number().int().nonnegative().optional(),
  ),
});

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeSlug(value: string) {
  const slug = slugify(value);
  if (!slug)
    throw new Error("Slug must include at least one ASCII letter or number.");
  return slug;
}

function monthRange() {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

async function assertProgramUsableForMedia(input: {
  affiliateProgramId: string;
  mediaId: string;
}) {
  const relation = await prisma.affiliateProgramMediaSite.findUnique({
    where: {
      mediaId_affiliateProgramId: {
        mediaId: input.mediaId,
        affiliateProgramId: input.affiliateProgramId,
      },
    },
    include: { affiliateProgram: true },
  });
  if (
    !relation ||
    relation.applicationStatus !== AffiliateApplicationStatus.APPROVED
  ) {
    throw new Error("Affiliate program must be approved for this media.");
  }
  if (
    relation.affiliateProgram.status !== AffiliateProgramStatus.APPROVED &&
    relation.affiliateProgram.status !== AffiliateProgramStatus.ACTIVE
  ) {
    throw new Error("Affiliate program must be approved or active before use.");
  }
  return relation;
}

async function validateRevenueReferences(input: {
  affiliateNetworkId: string;
  mediaId: string;
  affiliateProgramId?: string | null;
  affiliateLinkId?: string | null;
  wordpressPostId?: string | null;
  postId?: string | null;
}) {
  let affiliateProgramId = input.affiliateProgramId || null;
  if (affiliateProgramId) {
    const relation = await assertProgramUsableForMedia({
      affiliateProgramId,
      mediaId: input.mediaId,
    });
    if (
      relation.affiliateProgram.affiliateNetworkId !== input.affiliateNetworkId
    ) {
      throw new Error("Affiliate program belongs to a different network.");
    }
  }

  if (input.affiliateLinkId) {
    const link = await prisma.affiliateLink.findUniqueOrThrow({
      where: { id: input.affiliateLinkId },
      include: { affiliateProgram: true },
    });
    if (link.mediaId !== input.mediaId)
      throw new Error("Affiliate link belongs to a different media.");
    if (link.affiliateProgram.affiliateNetworkId !== input.affiliateNetworkId) {
      throw new Error("Affiliate link belongs to a different network.");
    }
    if (affiliateProgramId && link.affiliateProgramId !== affiliateProgramId) {
      throw new Error("Affiliate link belongs to a different program.");
    }
    affiliateProgramId = link.affiliateProgramId;
  }

  if (input.wordpressPostId) {
    const wordpressPost = await prisma.wordPressPost.findUniqueOrThrow({
      where: { id: input.wordpressPostId },
    });
    if (wordpressPost.mediaId !== input.mediaId)
      throw new Error("WordPress post belongs to a different media.");
  }
  if (input.postId) {
    const post = await prisma.post.findUniqueOrThrow({
      where: { id: input.postId },
    });
    if (post.mediaId !== input.mediaId)
      throw new Error("X post belongs to a different media.");
  }
  return { affiliateProgramId };
}

export async function createAffiliateNetwork(formData: FormData) {
  const data = networkSchema.parse(Object.fromEntries(formData));
  const slug = normalizeSlug(data.slug);
  await prisma.affiliateNetwork.upsert({
    where: { slug },
    update: {
      name: data.name,
      websiteUrl: data.websiteUrl || null,
      loginUrl: data.loginUrl || null,
      memo: data.memo,
    },
    create: {
      name: data.name,
      slug,
      websiteUrl: data.websiteUrl || null,
      loginUrl: data.loginUrl || null,
      memo: data.memo,
    },
  });
  revalidatePath("/");
}

export async function createAffiliateProgram(formData: FormData) {
  const data = strictProgramSchema.parse(Object.fromEntries(formData));
  await prisma.affiliateProgram.create({
    data: {
      affiliateNetworkId: data.affiliateNetworkId,
      programName: data.programName,
      advertiserName: data.advertiserName || null,
      genre: data.genre || null,
      category: data.category || null,
      programUrl: data.programUrl || null,
      rewardType: data.rewardType,
      rewardAmount: data.rewardAmount,
      rewardRate: data.rewardRate,
      currency: data.currency || "JPY",
      approvalRate: data.approvalRate,
      epc: data.epc,
      cookieDurationDays: data.cookieDurationDays,
      conversionCondition: data.conversionCondition || null,
      allowedMediaTypes: [
        "wordpress",
        "note",
        "blogger",
        "instagram",
        "pinterest",
      ],
      complianceNotes:
        data.complianceNotes ||
        "Do not post direct affiliate links to X. Use WordPress placements.",
      riskLevel: data.riskLevel,
      status: data.status,
      memo: data.memo || null,
    },
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.AFFILIATE,
      eventType: ApiEventType.REQUEST,
      requestType: RequestType.AFFILIATE_MANUAL_PROGRAM_CREATE,
      endpoint: "local/affiliate-program",
      method: "CREATE",
      mockMode: true,
      message: "manual affiliate program created",
    },
  });
  revalidatePath("/");
}

export async function attachProgramToMedia(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const affiliateProgramId = z
    .string()
    .min(1)
    .parse(formData.get("affiliateProgramId"));
  const applicationStatus = z
    .nativeEnum(AffiliateApplicationStatus)
    .parse(formData.get("applicationStatus") ?? "APPROVED");
  await prisma.affiliateProgramMediaSite.upsert({
    where: { mediaId_affiliateProgramId: { mediaId, affiliateProgramId } },
    update: {
      applicationStatus,
      approvedAt:
        applicationStatus === AffiliateApplicationStatus.APPROVED
          ? new Date()
          : undefined,
    },
    create: {
      mediaId,
      affiliateProgramId,
      applicationStatus,
      approvedAt:
        applicationStatus === AffiliateApplicationStatus.APPROVED
          ? new Date()
          : null,
      mainProgram: Boolean(formData.get("mainProgram")),
      priority: Number(formData.get("priority") ?? 50),
    },
  });
  revalidatePath("/");
}

export async function createAffiliateLink(formData: FormData) {
  const data = linkSchema.parse(Object.fromEntries(formData));
  await assertProgramUsableForMedia({
    affiliateProgramId: data.affiliateProgramId,
    mediaId: data.mediaId,
  });
  await prisma.affiliateLink.create({
    data: {
      ...data,
      affiliateUrlMasked: maskAffiliateUrl(data.affiliateUrl),
      trackingId: data.trackingId || null,
      utmSource: data.utmSource || "wordpress",
      utmMedium: data.utmMedium || "affiliate",
      utmCampaign: data.utmCampaign || null,
      utmContent: data.utmContent || null,
      memo:
        data.memo || "WordPress placement only. Never use directly in X posts.",
    },
  });
  revalidatePath("/");
}

export async function createAffiliatePlacement(formData: FormData) {
  const affiliateLinkId = z
    .string()
    .min(1)
    .parse(formData.get("affiliateLinkId"));
  const wordpressPostId =
    String(formData.get("wordpressPostId") ?? "").trim() || null;
  const link = await prisma.affiliateLink.findUniqueOrThrow({
    where: { id: affiliateLinkId },
  });
  if (link.status !== "ACTIVE") {
    throw new Error("Only active affiliate links can be placed.");
  }
  if (wordpressPostId) {
    const post = await prisma.wordPressPost.findUniqueOrThrow({
      where: { id: wordpressPostId },
    });
    if (post.mediaId !== link.mediaId)
      throw new Error(
        "Placement post and affiliate link must belong to the same media.",
      );
  }
  await prisma.affiliatePlacement.create({
    data: {
      affiliateLinkId,
      mediaId: link.mediaId,
      wordpressPostId,
      placementType: z
        .nativeEnum(AffiliatePlacementType)
        .parse(formData.get("placementType") ?? "ARTICLE_TEXT"),
      placementLabel:
        String(formData.get("placementLabel") ?? "").trim() || null,
      position: z
        .nativeEnum(AffiliatePlacementPosition)
        .parse(formData.get("position") ?? "MIDDLE"),
    },
  });
  revalidatePath("/");
}

export async function createRevenueEvent(formData: FormData) {
  const affiliateNetworkId = z
    .string()
    .min(1)
    .parse(formData.get("affiliateNetworkId"));
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const status = z
    .nativeEnum(RevenueStatus)
    .parse(formData.get("status") ?? "PENDING");
  const reward = z.coerce.number().nonnegative().parse(formData.get("reward"));
  const eventDate = new Date(String(formData.get("eventDate") ?? ""));
  if (Number.isNaN(eventDate.getTime())) throw new Error("Invalid event date.");
  const rewards = rewardColumns(status, reward);
  const affiliateProgramId =
    String(formData.get("affiliateProgramId") ?? "").trim() || null;
  const affiliateLinkId =
    String(formData.get("affiliateLinkId") ?? "").trim() || null;
  const wordpressPostId =
    String(formData.get("wordpressPostId") ?? "").trim() || null;
  const postId = String(formData.get("postId") ?? "").trim() || null;
  const validated = await validateRevenueReferences({
    affiliateNetworkId,
    mediaId,
    affiliateProgramId,
    affiliateLinkId,
    wordpressPostId,
    postId,
  });
  const orderIdHash = hashIdentifier(String(formData.get("orderId") ?? ""));
  if (orderIdHash) {
    const duplicate = await prisma.revenueEvent.findFirst({
      where: { affiliateNetworkId, eventDate, orderIdHash },
      select: { id: true },
    });
    if (duplicate) {
      throw new Error(
        "Duplicate order hash detected for this network and event date.",
      );
    }
  }
  await prisma.revenueEvent.create({
    data: {
      affiliateNetworkId,
      affiliateProgramId: validated.affiliateProgramId,
      affiliateLinkId,
      mediaId,
      wordpressPostId,
      postId,
      eventDate,
      orderIdHash,
      clickIdHash: hashIdentifier(String(formData.get("clickId") ?? "")),
      conversionType: String(formData.get("conversionType") ?? "sale"),
      status,
      ...rewards,
      currency: String(
        formData.get("currency") ??
          process.env.REVENUE_DEFAULT_CURRENCY ??
          "JPY",
      ),
      memo: String(formData.get("memo") ?? "").trim() || null,
      source: RevenueSource.MANUAL,
      dataConfidence: DataConfidence.HIGH,
    },
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.AFFILIATE,
      eventType: ApiEventType.REQUEST,
      requestType: RequestType.AFFILIATE_REVENUE_MANUAL_CREATE,
      endpoint: "local/revenue-event",
      method: "CREATE",
      mockMode: true,
      message: "manual revenue event created",
    },
  });
  revalidatePath("/");
}

export async function importRevenueCsv(formData: FormData) {
  const csvText = z.string().min(1).parse(formData.get("csvText"));
  const fileName = String(formData.get("fileName") ?? "manual-paste.csv");
  const parsed = parseRevenueCsv(csvText);
  const batch = await prisma.revenueImportBatch.create({
    data: { fileName, totalRows: parsed.rows.length, status: "PREVIEWED" },
  });
  let successRows = 0;
  let failedRows = 0;
  let warningRows = 0;
  const networks = await prisma.affiliateNetwork.findMany();
  const media = await prisma.media.findMany();
  const programs = await prisma.affiliateProgram.findMany();

  for (const [index, row] of parsed.rows.entries()) {
    const rowNumber = index + 2;
    const network = networks.find(
      (item) => item.slug === slugify(row.network_slug),
    );
    const mediaItem = media.find(
      (item) => item.name === row.media_name || item.id === row.media_name,
    );
    const program = programs.find(
      (item) =>
        item.programName === row.program_name &&
        item.affiliateNetworkId === network?.id,
    );
    const eventDate = new Date(row.event_date);
    const reward = Number(row.reward);
    if (
      !network ||
      !mediaItem ||
      !program ||
      Number.isNaN(eventDate.getTime()) ||
      Number.isNaN(reward)
    ) {
      failedRows += 1;
      await prisma.revenueImportRowError.create({
        data: {
          importBatchId: batch.id,
          rowNumber,
          message: "Invalid network/media/program/date/reward.",
          rawRow: row,
        },
      });
      continue;
    }
    const relation = await prisma.affiliateProgramMediaSite.findUnique({
      where: {
        mediaId_affiliateProgramId: {
          mediaId: mediaItem.id,
          affiliateProgramId: program.id,
        },
      },
    });
    if (
      !relation ||
      relation.applicationStatus !== AffiliateApplicationStatus.APPROVED
    ) {
      failedRows += 1;
      await prisma.revenueImportRowError.create({
        data: {
          importBatchId: batch.id,
          rowNumber,
          message: "Program is not approved for this media.",
          rawRow: row,
        },
      });
      continue;
    }
    const status = normalizeRevenueStatus(row.status);
    const orderIdHash = hashIdentifier(row.order_id);
    if (!orderIdHash) {
      warningRows += 1;
      await prisma.revenueImportRowError.create({
        data: {
          importBatchId: batch.id,
          rowNumber,
          severity: "warning",
          message:
            "order_id is empty; duplicate detection is weak for this row.",
          rawRow: row,
        },
      });
    }
    const duplicate = orderIdHash
      ? await prisma.revenueEvent.findFirst({
          where: { affiliateNetworkId: network.id, eventDate, orderIdHash },
        })
      : null;
    if (duplicate) {
      warningRows += 1;
      await prisma.revenueImportRowError.create({
        data: {
          importBatchId: batch.id,
          rowNumber,
          severity: "warning",
          message: "Duplicate order hash skipped.",
          rawRow: row,
        },
      });
      continue;
    }
    await prisma.revenueEvent.create({
      data: {
        affiliateNetworkId: network.id,
        affiliateProgramId: program.id,
        mediaId: mediaItem.id,
        eventDate,
        orderIdHash,
        clickIdHash: hashIdentifier(row.click_id),
        status,
        ...rewardColumns(status, reward),
        currency: row.currency || "JPY",
        memo: row.memo || null,
        source: RevenueSource.CSV,
        dataConfidence: DataConfidence.MEDIUM,
        importBatchId: batch.id,
      },
    });
    successRows += 1;
  }
  await prisma.revenueImportBatch.update({
    where: { id: batch.id },
    data: {
      status: failedRows > 0 ? "PARTIAL" : "IMPORTED",
      successRows,
      failedRows,
      warningRows,
      duplicateRows: warningRows,
      errorSummary:
        failedRows || warningRows
          ? `${failedRows} failed, ${warningRows} warnings`
          : null,
    },
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.AFFILIATE,
      eventType: failedRows > 0 ? ApiEventType.ERROR : ApiEventType.REQUEST,
      requestType: RequestType.AFFILIATE_CSV_IMPORT,
      endpoint: "local/revenue-csv",
      method: "IMPORT",
      success: failedRows === 0,
      mockMode: true,
      message: `csv import: ${successRows} success, ${failedRows} failed, ${warningRows} warning`,
    },
  });
  revalidatePath("/");
}

export async function calculateMediaGrowthScore(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const periodDays = Number(
    formData.get("periodDays") ??
      process.env.GROWTH_SCORE_DEFAULT_PERIOD_DAYS ??
      30,
  );
  const end = new Date();
  const start = new Date(end.getTime() - periodDays * 24 * 60 * 60 * 1000);
  const result = await calculateGrowthScore(prisma, { mediaId, start, end });
  const snapshot = await prisma.growthScoreSnapshot.create({
    data: {
      mediaId,
      periodStart: start,
      periodEnd: end,
      trafficScore: result.trafficScore,
      revenueScore: result.revenueScore,
      conversionScore: result.conversionScore,
      contentScore: result.contentScore,
      riskScore: result.riskScore,
      totalScore: result.totalScore,
      recommendation: result.recommendation,
      dataConfidence: result.dataConfidence,
      dataWarnings: result.dataWarnings,
      reasoning: result.reasoning,
      requiresHumanReview:
        process.env.GROWTH_SCORE_REQUIRE_HUMAN_REVIEW !== "false",
    },
  });
  await prisma.growthRecommendation.create({
    data: {
      mediaId,
      snapshotId: snapshot.id,
      type: result.recommendation,
      title: recommendationTitle(result.recommendation),
      description: result.reasoning,
      priority: Math.max(1, 100 - result.totalScore),
      status: GrowthRecommendationStatus.PROPOSED,
      riskNotes: result.dataWarnings.join(" / ") || null,
    },
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.GROWTH_SCORE,
      eventType: ApiEventType.REQUEST,
      requestType: RequestType.GROWTH_SCORE_CALCULATE,
      endpoint: "local/growth-score",
      method: "CALCULATE",
      mockMode: true,
      message: `growth score calculated: ${result.totalScore}`,
    },
  });
  revalidatePath("/");
}

export async function createGrowthStrategyBoardReport() {
  const { start, end } = monthRange();
  const media = await prisma.media.findMany();
  const [totalSummary, summaries] = await Promise.all([
    summarizeRevenue(prisma, { start, end }),
    Promise.all(
      media.map((item) =>
        summarizeRevenue(prisma, { mediaId: item.id, start, end }),
      ),
    ),
  ]);
  const ranked = media
    .map((item, index) => ({
      id: item.id,
      name: item.name,
      approvedRevenue: summaries[index].approvedRevenue,
      profit: summaries[index].profit,
    }))
    .sort((a, b) => b.profit - a.profit);
  await prisma.growthStrategyBoardReport.create({
    data: {
      periodStart: start,
      periodEnd: end,
      totalEstimatedRevenue: totalSummary.estimatedRevenue,
      totalPendingRevenue: totalSummary.pendingRevenue,
      totalApprovedRevenue: totalSummary.approvedRevenue,
      totalCost: totalSummary.operatingCost,
      totalProfit: totalSummary.profit,
      topMedia: ranked.slice(0, 3),
      improveMedia: ranked.slice(-3),
      insufficientMedia: media.filter(
        (_, index) =>
          summaries[index].dataConfidence === DataConfidence.INSUFFICIENT,
      ),
      riskWarnings: [
        "Human review required before scale/pause/stop decisions.",
      ],
      nextActions: [
        "Review top Growth Score media.",
        "Confirm approved revenue before scaling.",
        "Register missing operating costs.",
      ],
    },
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.GROWTH_SCORE,
      eventType: ApiEventType.REQUEST,
      requestType: RequestType.GSB_REPORT_CREATE,
      endpoint: "local/growth-strategy-board",
      method: "CREATE",
      mockMode: true,
      message: "growth strategy board report created",
    },
  });
  revalidatePath("/");
}
