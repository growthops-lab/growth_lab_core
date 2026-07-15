import {
  ApiEventType,
  ArticleImprovementPriority,
  ArticleImprovementStatus,
  ArticleImprovementTaskType,
  ImprovementExecutionEventType,
  ImprovementSourceType,
  NotificationType,
  Platform,
  RequestType,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";
import { createNotification } from "@/src/lib/notifications/center";

type CreateTaskInput = {
  mediaId: string;
  wordpressPostId?: string | null;
  taskTitle: string;
  taskType: ArticleImprovementTaskType;
  priority?: ArticleImprovementPriority;
  sourceType: ImprovementSourceType;
  sourceId?: string | null;
  targetKeyword?: string | null;
  targetUrl?: string | null;
  reason: string;
  expectedImpact?: string | null;
  createdBy?: string;
  seoOpportunityId?: string | null;
  seoRecommendationId?: string | null;
  alertIncidentId?: string | null;
  growthRecommendationId?: string | null;
};

export async function logImprovementEvent(
  prisma: PrismaClient,
  input: {
    articleImprovementTaskId?: string;
    rewriteDraftId?: string;
    eventType: ImprovementExecutionEventType;
    message: string;
    metadata?: Prisma.InputJsonValue;
  },
) {
  return prisma.improvementExecutionLog.create({
    data: {
      articleImprovementTaskId: input.articleImprovementTaskId,
      rewriteDraftId: input.rewriteDraftId,
      eventType: input.eventType,
      message: input.message,
      metadata: input.metadata,
    },
  });
}

export async function createArticleImprovementTask(
  prisma: PrismaClient,
  input: CreateTaskInput,
) {
  const task = await prisma.articleImprovementTask.create({
    data: {
      mediaId: input.mediaId,
      wordpressPostId: input.wordpressPostId,
      taskTitle: input.taskTitle,
      taskType: input.taskType,
      priority: input.priority ?? ArticleImprovementPriority.MEDIUM,
      status: ArticleImprovementStatus.BACKLOG,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      targetKeyword: input.targetKeyword,
      targetUrl: input.targetUrl,
      reason: input.reason,
      expectedImpact: input.expectedImpact,
      createdBy: input.createdBy ?? "local-admin",
      seoOpportunityId: input.seoOpportunityId,
      seoRecommendationId: input.seoRecommendationId,
      alertIncidentId: input.alertIncidentId,
      growthRecommendationId: input.growthRecommendationId,
    },
  });
  if (input.sourceId) {
    await prisma.improvementTaskSource.upsert({
      where: {
        articleImprovementTaskId_sourceType_sourceId: {
          articleImprovementTaskId: task.id,
          sourceType: input.sourceType,
          sourceId: input.sourceId,
        },
      },
      update: {},
      create: {
        articleImprovementTaskId: task.id,
        sourceType: input.sourceType,
        sourceId: input.sourceId,
      },
    });
  }
  await logImprovementEvent(prisma, {
    articleImprovementTaskId: task.id,
    eventType: ImprovementExecutionEventType.TASK_CREATED,
    message: `Improvement task created from ${input.sourceType}.`,
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.ARTICLE_IMPROVEMENT,
      eventType: ApiEventType.REQUEST,
      requestType: RequestType.IMPROVEMENT_TASK_CREATE,
      endpoint: "article-improvement/tasks",
      method: "CREATE",
      success: true,
      mockMode: true,
      message: task.taskTitle,
    },
  });
  if (task.priority === ArticleImprovementPriority.HIGH) {
    await createNotification(prisma, {
      mediaId: task.mediaId,
      type: NotificationType.SYSTEM,
      title: "High priority article improvement task",
      message: task.taskTitle,
      priority: "WARNING",
      dedupKey: `article-improvement-task:${task.id}`,
    });
  }
  return task;
}

export async function createTaskFromSeoRecommendation(
  prisma: PrismaClient,
  seoRecommendationId: string,
) {
  const recommendation = await prisma.seoRecommendation.findUniqueOrThrow({
    where: { id: seoRecommendationId },
    include: { seoOpportunity: true, wordpressPost: true },
  });
  const typeMap: Partial<Record<string, ArticleImprovementTaskType>> = {
    REWRITE_TITLE: ArticleImprovementTaskType.REWRITE_TITLE,
    REWRITE_META_DESCRIPTION:
      ArticleImprovementTaskType.REWRITE_META_DESCRIPTION,
    ADD_H2_SECTION: ArticleImprovementTaskType.ADD_H2_SECTION,
    ADD_FAQ_SECTION: ArticleImprovementTaskType.ADD_FAQ_SECTION,
    ADD_INTERNAL_LINKS: ArticleImprovementTaskType.ADD_INTERNAL_LINKS,
    ADD_AFFILIATE_CTA: ArticleImprovementTaskType.IMPROVE_CTA,
    UPDATE_OUTDATED_INFO: ArticleImprovementTaskType.UPDATE_OUTDATED_CONTENT,
  };
  return createArticleImprovementTask(prisma, {
    mediaId: recommendation.mediaId,
    wordpressPostId: recommendation.wordpressPostId,
    taskTitle: recommendation.title,
    taskType:
      typeMap[recommendation.recommendationType] ??
      ArticleImprovementTaskType.COMPREHENSIVE_REWRITE,
    priority:
      recommendation.priority === "HIGH"
        ? ArticleImprovementPriority.HIGH
        : recommendation.priority === "LOW"
          ? ArticleImprovementPriority.LOW
          : ArticleImprovementPriority.MEDIUM,
    sourceType: ImprovementSourceType.SEO_RECOMMENDATION,
    sourceId: recommendation.id,
    seoRecommendationId: recommendation.id,
    targetKeyword: recommendation.seoOpportunity?.title,
    targetUrl: recommendation.wordpressPost?.wordpressPostUrl ?? null,
    reason: recommendation.reason ?? recommendation.description,
    expectedImpact: "Improve SEO performance after human-reviewed rewrite.",
  });
}
