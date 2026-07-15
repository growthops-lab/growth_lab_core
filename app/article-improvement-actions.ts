"use server";

import {
  ArticleImprovementPriority,
  ArticleImprovementTaskType,
  ImprovementSourceType,
  RewriteApprovalDecision,
  WordPressRewriteUpdateMode,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createArticleImprovementTask,
  createTaskFromSeoRecommendation,
} from "@/src/lib/article-improvement/tasks";
import {
  createContentChangeSet,
  createRewriteDraft,
  markChangeSetStatus,
} from "@/src/lib/rewrite/draft";
import {
  applyRewriteToWordPressDraft,
  decideRewriteApproval,
  requestRewriteApproval,
} from "@/src/lib/rewrite/workflow";
import { createSeoImpactMeasurement } from "@/src/lib/impact-measurement/seo";

export async function createManualImprovementTask(formData: FormData) {
  const mediaId = z.string().min(1).parse(formData.get("mediaId"));
  const wordpressPostId =
    String(formData.get("wordpressPostId") ?? "").trim() || null;
  await createArticleImprovementTask(prisma, {
    mediaId,
    wordpressPostId,
    taskTitle: z.string().trim().min(1).parse(formData.get("taskTitle")),
    taskType: z
      .nativeEnum(ArticleImprovementTaskType)
      .parse(formData.get("taskType")),
    priority: z
      .nativeEnum(ArticleImprovementPriority)
      .parse(formData.get("priority")),
    sourceType: ImprovementSourceType.MANUAL,
    reason: z.string().trim().min(1).parse(formData.get("reason")),
    expectedImpact: String(formData.get("expectedImpact") ?? "").trim() || null,
    targetKeyword: String(formData.get("targetKeyword") ?? "").trim() || null,
    targetUrl: String(formData.get("targetUrl") ?? "").trim() || null,
  });
  revalidatePath("/");
}

export async function createImprovementTaskFromSeoRecommendation(
  formData: FormData,
) {
  const seoRecommendationId = z
    .string()
    .min(1)
    .parse(formData.get("seoRecommendationId"));
  await createTaskFromSeoRecommendation(prisma, seoRecommendationId);
  revalidatePath("/");
}

export async function createImprovementTaskFromAlert(formData: FormData) {
  const alertIncidentId = z
    .string()
    .min(1)
    .parse(formData.get("alertIncidentId"));
  const alert = await prisma.alertIncident.findUniqueOrThrow({
    where: { id: alertIncidentId },
  });
  if (!alert.mediaId)
    throw new Error("Alert incident is not linked to a media site.");
  await createArticleImprovementTask(prisma, {
    mediaId: alert.mediaId,
    taskTitle: `Resolve alert: ${alert.title}`,
    taskType: ArticleImprovementTaskType.COMPREHENSIVE_REWRITE,
    priority:
      alert.severity === "CRITICAL"
        ? ArticleImprovementPriority.HIGH
        : ArticleImprovementPriority.MEDIUM,
    sourceType: ImprovementSourceType.ALERT_INCIDENT,
    sourceId: alert.id,
    alertIncidentId: alert.id,
    reason: alert.message,
    expectedImpact: "Resolve content or data issue connected to this alert.",
  });
  revalidatePath("/");
}

export async function createImprovementTaskFromGrowthRecommendation(
  formData: FormData,
) {
  const growthRecommendationId = z
    .string()
    .min(1)
    .parse(formData.get("growthRecommendationId"));
  const recommendation = await prisma.growthRecommendation.findUniqueOrThrow({
    where: { id: growthRecommendationId },
  });
  await createArticleImprovementTask(prisma, {
    mediaId: recommendation.mediaId,
    taskTitle: recommendation.title,
    taskType: ArticleImprovementTaskType.COMPREHENSIVE_REWRITE,
    priority:
      recommendation.priority >= 70
        ? ArticleImprovementPriority.HIGH
        : ArticleImprovementPriority.MEDIUM,
    sourceType: ImprovementSourceType.GROWTH_RECOMMENDATION,
    sourceId: recommendation.id,
    growthRecommendationId: recommendation.id,
    reason: recommendation.description,
    expectedImpact:
      "Improve Growth Score after human-reviewed article changes.",
  });
  revalidatePath("/");
}

export async function createRewriteDraftAction(formData: FormData) {
  const taskId = z
    .string()
    .min(1)
    .parse(formData.get("articleImprovementTaskId"));
  await createRewriteDraft(prisma, taskId);
  revalidatePath("/");
}

export async function createContentChangeSetAction(formData: FormData) {
  const rewriteDraftId = z
    .string()
    .min(1)
    .parse(formData.get("rewriteDraftId"));
  await createContentChangeSet(prisma, rewriteDraftId);
  revalidatePath("/");
}

export async function updateContentChangeSetStatus(formData: FormData) {
  const contentChangeSetId = z
    .string()
    .min(1)
    .parse(formData.get("contentChangeSetId"));
  const status = z.enum(["ACCEPTED", "REJECTED"]).parse(formData.get("status"));
  await markChangeSetStatus(prisma, contentChangeSetId, status);
  revalidatePath("/");
}

export async function requestRewriteApprovalAction(formData: FormData) {
  const rewriteDraftId = z
    .string()
    .min(1)
    .parse(formData.get("rewriteDraftId"));
  await requestRewriteApproval(prisma, rewriteDraftId);
  revalidatePath("/");
}

export async function decideRewriteApprovalAction(formData: FormData) {
  const rewriteDraftId = z
    .string()
    .min(1)
    .parse(formData.get("rewriteDraftId"));
  const decision = z
    .nativeEnum(RewriteApprovalDecision)
    .parse(formData.get("decision"));
  await decideRewriteApproval(prisma, {
    rewriteDraftId,
    decision,
    comment: String(formData.get("comment") ?? "").trim() || undefined,
  });
  revalidatePath("/");
}

export async function applyRewriteToWordPressDraftAction(formData: FormData) {
  const rewriteDraftId = z
    .string()
    .min(1)
    .parse(formData.get("rewriteDraftId"));
  const updateMode = z
    .nativeEnum(WordPressRewriteUpdateMode)
    .parse(formData.get("updateMode") ?? "CREATE_NEW_DRAFT");
  await applyRewriteToWordPressDraft(prisma, { rewriteDraftId, updateMode });
  revalidatePath("/");
}

export async function createSeoImpactMeasurementAction(formData: FormData) {
  const taskId = z
    .string()
    .min(1)
    .parse(formData.get("articleImprovementTaskId"));
  await createSeoImpactMeasurement(prisma, taskId);
  revalidatePath("/");
}
