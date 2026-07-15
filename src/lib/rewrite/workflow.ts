import {
  ApiEventType,
  ArticleImprovementStatus,
  ImprovementExecutionEventType,
  NotificationType,
  Platform,
  RequestType,
  RewriteApprovalDecision,
  RewriteDraftStatus,
  WordPressDraftUpdateStatus,
  WordPressRewriteUpdateMode,
  type PrismaClient,
} from "@prisma/client";
import { createNotification } from "@/src/lib/notifications/center";
import { logImprovementEvent } from "@/src/lib/article-improvement/tasks";
import { runWordPressRewriteSafetyCheck } from "@/src/lib/wordpress/safety-gate";

export async function requestRewriteApproval(
  prisma: PrismaClient,
  rewriteDraftId: string,
) {
  const draft = await prisma.rewriteDraft.findUniqueOrThrow({
    where: { id: rewriteDraftId },
  });
  await prisma.rewriteDraft.update({
    where: { id: draft.id },
    data: { draftStatus: RewriteDraftStatus.PENDING_APPROVAL },
  });
  await prisma.articleImprovementTask.update({
    where: { id: draft.articleImprovementTaskId },
    data: { status: ArticleImprovementStatus.PENDING_APPROVAL },
  });
  await createNotification(prisma, {
    mediaId: draft.mediaId,
    scheduledTaskRunId: null,
    type: NotificationType.SYSTEM,
    title: "Rewrite draft pending approval",
    message: draft.draftTitle,
    priority: "WARNING",
    dedupKey: `rewrite-approval:${draft.id}:${draft.version}`,
  });
}

export async function decideRewriteApproval(
  prisma: PrismaClient,
  input: {
    rewriteDraftId: string;
    decision: RewriteApprovalDecision;
    comment?: string;
  },
) {
  const draft = await prisma.rewriteDraft.findUniqueOrThrow({
    where: { id: input.rewriteDraftId },
  });
  await prisma.rewriteApproval.create({
    data: {
      articleImprovementTaskId: draft.articleImprovementTaskId,
      rewriteDraftId: draft.id,
      version: draft.version,
      decision: input.decision,
      comment: input.comment,
    },
  });
  const draftStatus =
    input.decision === RewriteApprovalDecision.APPROVED
      ? RewriteDraftStatus.APPROVED
      : input.decision === RewriteApprovalDecision.CHANGES_REQUESTED
        ? RewriteDraftStatus.CHANGES_REQUESTED
        : RewriteDraftStatus.REJECTED;
  const taskStatus =
    input.decision === RewriteApprovalDecision.APPROVED
      ? ArticleImprovementStatus.APPROVED
      : input.decision === RewriteApprovalDecision.CHANGES_REQUESTED
        ? ArticleImprovementStatus.DRAFTING
        : ArticleImprovementStatus.REJECTED;
  await prisma.rewriteDraft.update({
    where: { id: draft.id },
    data: {
      draftStatus,
      approvedVersion:
        input.decision === RewriteApprovalDecision.APPROVED
          ? draft.version
          : draft.approvedVersion,
    },
  });
  await prisma.articleImprovementTask.update({
    where: { id: draft.articleImprovementTaskId },
    data: { status: taskStatus },
  });
  await logImprovementEvent(prisma, {
    articleImprovementTaskId: draft.articleImprovementTaskId,
    rewriteDraftId: draft.id,
    eventType:
      input.decision === RewriteApprovalDecision.APPROVED
        ? ImprovementExecutionEventType.APPROVED
        : input.decision === RewriteApprovalDecision.REJECTED
          ? ImprovementExecutionEventType.REJECTED
          : ImprovementExecutionEventType.CHANGES_REQUESTED,
    message: `Rewrite approval decision: ${input.decision}`,
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.REWRITE,
      eventType: ApiEventType.REQUEST,
      requestType: RequestType.REWRITE_APPROVAL,
      endpoint: "rewrite/approval",
      method: input.decision,
      success: true,
      mockMode: true,
      message: draft.draftTitle,
    },
  });
}

export async function applyRewriteToWordPressDraft(
  prisma: PrismaClient,
  input: { rewriteDraftId: string; updateMode?: WordPressRewriteUpdateMode },
) {
  const draft = await prisma.rewriteDraft.findUniqueOrThrow({
    where: { id: input.rewriteDraftId },
    include: { contentChangeSets: true, wordpressPost: true },
  });
  const safety = await runWordPressRewriteSafetyCheck(prisma, {
    rewriteDraftId: draft.id,
    updateMode: input.updateMode ?? WordPressRewriteUpdateMode.CREATE_NEW_DRAFT,
  });
  if (safety.status !== "PASSED") {
    await prisma.wordPressDraftUpdate.create({
      data: {
        rewriteDraftId: draft.id,
        wordpressPostId: draft.wordpressPostId,
        updateMode: safety.updateMode,
        status: WordPressDraftUpdateStatus.BLOCKED,
        mockMode: true,
        safetyCheckId: safety.id,
        errorMessage: safety.reason,
      },
    });
    await createNotification(prisma, {
      mediaId: draft.mediaId,
      type: NotificationType.SYSTEM,
      title: "WordPress draft update blocked",
      message: safety.reason ?? "Safety check failed.",
      priority: "CRITICAL",
      dedupKey: `wordpress-update-blocked:${draft.id}:${draft.version}`,
    });
    return safety.id;
  }
  const update = await prisma.wordPressDraftUpdate.create({
    data: {
      rewriteDraftId: draft.id,
      wordpressPostId: draft.wordpressPostId,
      updateMode: safety.updateMode,
      status: WordPressDraftUpdateStatus.MOCK_UPDATED,
      mockMode: true,
      wordpressDraftId: `mock-rewrite-${draft.id}`,
      wordpressDraftUrl:
        draft.wordpressPost.wordpressPostUrl ??
        draft.wordpressPost.wordpressEditUrl,
      safetyCheckId: safety.id,
      requestSummary:
        "Mock create_new_draft/update_existing_draft only. No published post was updated.",
      responseSummary: "Mock WordPress draft update completed.",
    },
  });
  await prisma.rewriteDraft.update({
    where: { id: draft.id },
    data: { draftStatus: RewriteDraftStatus.APPLIED_TO_WORDPRESS_DRAFT },
  });
  await prisma.articleImprovementTask.update({
    where: { id: draft.articleImprovementTaskId },
    data: { status: ArticleImprovementStatus.WORDPRESS_DRAFT_UPDATED },
  });
  await logImprovementEvent(prisma, {
    articleImprovementTaskId: draft.articleImprovementTaskId,
    rewriteDraftId: draft.id,
    eventType: ImprovementExecutionEventType.WORDPRESS_DRAFT_UPDATED,
    message: "Mock WordPress draft update completed.",
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.WORDPRESS,
      eventType: ApiEventType.DRY_RUN,
      requestType: RequestType.WORDPRESS_DRAFT_MOCK_UPDATE,
      endpoint: "wordpress/rewrite-draft",
      method: safety.updateMode,
      success: true,
      mockMode: true,
      message: update.responseSummary,
    },
  });
  return update.id;
}
