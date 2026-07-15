import {
  ApiEventType,
  ArticleImprovementStatus,
  ArticleRevisionSnapshotType,
  ContentChangeStatus,
  ContentChangeType,
  ImprovementExecutionEventType,
  Platform,
  RequestType,
  RewriteDraftStatus,
  RewriteMode,
  RewriteSuggestionStatus,
  RewriteSuggestionType,
  RewriteTargetField,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";
import { createHash } from "node:crypto";
import { buildContentDiff, contentHash } from "@/src/lib/content-diff/diff";
import { htmlToText, sanitizeHtml } from "@/src/lib/content-diff/sanitize";
import { logImprovementEvent } from "@/src/lib/article-improvement/tasks";
import { runRewriteRiskCheck } from "@/src/lib/rewrite/risk-check";

function shortHash(value: string) {
  return createHash("sha1").update(value).digest("hex").slice(0, 10);
}

function mockRewrite(input: {
  title: string;
  seoDescription?: string | null;
  contentHtml: string;
  taskTitle: string;
}) {
  const safeContent = sanitizeHtml(input.contentHtml);
  const title = input.title.includes("2026")
    ? input.title
    : `${input.title} 2026 update`;
  const meta = input.seoDescription
    ? `${input.seoDescription.slice(0, 120)} Review the latest comparison points before deciding.`
    : `${input.title} key points, cautions, and next actions for readers.`;
  const content = `${safeContent}
<h2>Review points before deciding</h2>
<p>This section was added as a mock rewrite draft for human review. Confirm claims, affiliate placement, and reader intent before applying to WordPress draft.</p>
<h2>FAQ</h2>
<p><strong>Q.</strong> What should readers check first?<br><strong>A.</strong> Compare current needs, cost, risk notes, and official information.</p>`;
  return { title, meta, content: sanitizeHtml(content) };
}

export async function createBeforeSnapshot(
  prisma: PrismaClient,
  taskId: string,
) {
  const task = await prisma.articleImprovementTask.findUniqueOrThrow({
    where: { id: taskId },
  });
  if (!task.wordpressPostId)
    throw new Error(
      "Article improvement task must be linked to a WordPress post.",
    );
  const post = await prisma.wordPressPost.findUniqueOrThrow({
    where: { id: task.wordpressPostId },
    include: { wordpressSite: true },
  });
  const existing = await prisma.articleRevisionSnapshot.findFirst({
    where: {
      articleImprovementTaskId: task.id,
      snapshotType: ArticleRevisionSnapshotType.BEFORE,
    },
    orderBy: { capturedAt: "desc" },
  });
  if (existing) return existing;
  const safeHtml = sanitizeHtml(post.contentHtml);
  const snapshot = await prisma.articleRevisionSnapshot.create({
    data: {
      mediaId: post.mediaId,
      wordpressPostId: post.id,
      articleImprovementTaskId: task.id,
      snapshotType: ArticleRevisionSnapshotType.BEFORE,
      wordpressPostStatus: post.status,
      wordpressModifiedGmt: post.lastSyncedAt,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      contentHtml: safeHtml,
      contentText: htmlToText(safeHtml),
      metaDescription: post.seoDescription,
      canonicalUrl: post.wordpressPostUrl,
      contentHash: contentHash(safeHtml),
    },
  });
  await logImprovementEvent(prisma, {
    articleImprovementTaskId: task.id,
    eventType: ImprovementExecutionEventType.SNAPSHOT_CREATED,
    message: "Before snapshot captured.",
  });
  return snapshot;
}

export async function createRewriteDraft(prisma: PrismaClient, taskId: string) {
  const task = await prisma.articleImprovementTask.findUniqueOrThrow({
    where: { id: taskId },
  });
  if (!task.wordpressPostId)
    throw new Error(
      "Article improvement task must be linked to a WordPress post.",
    );
  const post = await prisma.wordPressPost.findUniqueOrThrow({
    where: { id: task.wordpressPostId },
  });
  const baseSnapshot = await createBeforeSnapshot(prisma, task.id);
  const latest = await prisma.rewriteDraft.findFirst({
    where: { articleImprovementTaskId: task.id },
    orderBy: { version: "desc" },
  });
  const version = (latest?.version ?? 0) + 1;
  const rewritten = mockRewrite({
    title: post.title,
    seoDescription: post.seoDescription,
    contentHtml: post.contentHtml,
    taskTitle: task.taskTitle,
  });
  const draft = await prisma.rewriteDraft.create({
    data: {
      articleImprovementTaskId: task.id,
      mediaId: task.mediaId,
      wordpressPostId: post.id,
      draftTitle: `${task.taskTitle} v${version}`,
      draftStatus: RewriteDraftStatus.DRAFT,
      rewriteMode: RewriteMode.PARTIAL_REWRITE,
      version,
      baseSnapshotId: baseSnapshot.id,
      summary: "Mock rewrite draft created for human review.",
    },
  });
  const suggestions = [
    {
      rewriteDraftId: draft.id,
      suggestionType: RewriteSuggestionType.TITLE,
      targetField: RewriteTargetField.TITLE,
      beforeText: post.title,
      afterText: rewritten.title,
      reason: "Improve clarity and freshness signal.",
      version,
    },
    {
      rewriteDraftId: draft.id,
      suggestionType: RewriteSuggestionType.META_DESCRIPTION,
      targetField: RewriteTargetField.META_DESCRIPTION,
      beforeText: post.seoDescription,
      afterText: rewritten.meta,
      reason: "Make the search snippet more actionable.",
      version,
    },
    {
      rewriteDraftId: draft.id,
      suggestionType: RewriteSuggestionType.H2,
      targetField: RewriteTargetField.CONTENT_HTML,
      beforeText: null,
      afterText: "<h2>Review points before deciding</h2>",
      reason: "Add an intent-matching section for comparison readers.",
      version,
    },
    {
      rewriteDraftId: draft.id,
      suggestionType: RewriteSuggestionType.FAQ,
      targetField: RewriteTargetField.CONTENT_HTML,
      beforeText: null,
      afterText: "<h2>FAQ</h2>",
      reason: "Add FAQ coverage for long-tail search intent.",
      version,
    },
  ];
  await prisma.rewriteSuggestion.createMany({ data: suggestions });
  await runRewriteRiskCheck(prisma, {
    rewriteDraftId: draft.id,
    title: rewritten.title,
    contentHtml: rewritten.content,
    suggestions,
  });
  await prisma.articleImprovementTask.update({
    where: { id: task.id },
    data: { status: ArticleImprovementStatus.DRAFTING },
  });
  await logImprovementEvent(prisma, {
    articleImprovementTaskId: task.id,
    rewriteDraftId: draft.id,
    eventType: ImprovementExecutionEventType.DRAFT_CREATED,
    message: "Rewrite draft and suggestions created.",
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.REWRITE,
      eventType: ApiEventType.DRY_RUN,
      requestType: RequestType.REWRITE_DRAFT_CREATE,
      endpoint: "rewrite/drafts",
      method: "CREATE",
      success: true,
      mockMode: true,
      message: draft.draftTitle,
    },
  });
  return draft;
}

export async function createContentChangeSet(
  prisma: PrismaClient,
  rewriteDraftId: string,
) {
  const draft = await prisma.rewriteDraft.findUniqueOrThrow({
    where: { id: rewriteDraftId },
    include: {
      baseSnapshot: true,
      suggestions: true,
      articleImprovementTask: true,
      wordpressPost: true,
    },
  });
  if (!draft.baseSnapshot) throw new Error("Before snapshot is required.");
  const titleSuggestion = draft.suggestions.find(
    (item) =>
      item.targetField === RewriteTargetField.TITLE &&
      item.status !== RewriteSuggestionStatus.REJECTED,
  );
  const metaSuggestion = draft.suggestions.find(
    (item) =>
      item.targetField === RewriteTargetField.META_DESCRIPTION &&
      item.status !== RewriteSuggestionStatus.REJECTED,
  );
  const htmlAdditions = draft.suggestions.filter(
    (item) =>
      item.targetField === RewriteTargetField.CONTENT_HTML &&
      item.status !== RewriteSuggestionStatus.REJECTED,
  );
  const afterHtml = sanitizeHtml(
    `${draft.baseSnapshot.contentHtml}\n${htmlAdditions.map((item) => item.afterText).join("\n")}`,
  );
  const diff = buildContentDiff(draft.baseSnapshot.contentHtml, afterHtml);
  const data = [
    {
      rewriteDraftId: draft.id,
      articleImprovementTaskId: draft.articleImprovementTaskId,
      changeType: ContentChangeType.METADATA_UPDATE,
      targetField: RewriteTargetField.TITLE,
      beforeValue: draft.baseSnapshot.title,
      afterValue: titleSuggestion?.afterText ?? draft.baseSnapshot.title,
      beforeHash: shortHash(draft.baseSnapshot.title),
      afterHash: shortHash(
        titleSuggestion?.afterText ?? draft.baseSnapshot.title,
      ),
      diffSummary: "Title update proposed.",
      version: draft.version,
    },
    {
      rewriteDraftId: draft.id,
      articleImprovementTaskId: draft.articleImprovementTaskId,
      changeType: ContentChangeType.METADATA_UPDATE,
      targetField: RewriteTargetField.META_DESCRIPTION,
      beforeValue: draft.baseSnapshot.metaDescription,
      afterValue:
        metaSuggestion?.afterText ?? draft.baseSnapshot.metaDescription,
      beforeHash: shortHash(draft.baseSnapshot.metaDescription ?? ""),
      afterHash: shortHash(
        metaSuggestion?.afterText ?? draft.baseSnapshot.metaDescription ?? "",
      ),
      diffSummary: "Meta description update proposed.",
      version: draft.version,
    },
    {
      rewriteDraftId: draft.id,
      articleImprovementTaskId: draft.articleImprovementTaskId,
      changeType: ContentChangeType.INSERT,
      targetField: RewriteTargetField.CONTENT_HTML,
      beforeValue: draft.baseSnapshot.contentHtml,
      afterValue: afterHtml,
      beforeHash: diff.beforeHash,
      afterHash: diff.afterHash,
      diffSummary: `${diff.diff.summary}${diff.blockWarnings.length ? ` Warnings: ${diff.blockWarnings.join(" ")}` : ""}`,
      diffJson: {
        diff: diff.diff,
        blockWarnings: diff.blockWarnings,
      } as Prisma.InputJsonValue,
      version: draft.version,
    },
  ];
  await prisma.contentChangeSet.deleteMany({
    where: {
      rewriteDraftId: draft.id,
      version: draft.version,
      status: ContentChangeStatus.PROPOSED,
    },
  });
  await prisma.contentChangeSet.createMany({ data });
  await prisma.rewriteDraft.update({
    where: { id: draft.id },
    data: { draftStatus: RewriteDraftStatus.DIFF_READY },
  });
  await prisma.articleImprovementTask.update({
    where: { id: draft.articleImprovementTaskId },
    data: { status: ArticleImprovementStatus.DIFF_REVIEW },
  });
  await logImprovementEvent(prisma, {
    articleImprovementTaskId: draft.articleImprovementTaskId,
    rewriteDraftId: draft.id,
    eventType: ImprovementExecutionEventType.DIFF_CREATED,
    message: "Content change set created.",
  });
  await prisma.apiUsageLog.create({
    data: {
      platform: Platform.REWRITE,
      eventType: ApiEventType.REQUEST,
      requestType: RequestType.CONTENT_DIFF_CREATE,
      endpoint: "content-diff",
      method: "CREATE",
      success: true,
      mockMode: true,
      message: `Content changes for ${draft.draftTitle}`,
    },
  });
  return draft.id;
}

export async function markChangeSetStatus(
  prisma: PrismaClient,
  contentChangeSetId: string,
  status: ContentChangeStatus,
) {
  const changeSet = await prisma.contentChangeSet.update({
    where: { id: contentChangeSetId },
    data: { status },
  });
  if (status !== ContentChangeStatus.PROPOSED) {
    const draft = await prisma.rewriteDraft.findUniqueOrThrow({
      where: { id: changeSet.rewriteDraftId },
    });
    if (
      draft.draftStatus === RewriteDraftStatus.APPROVED &&
      process.env.REWRITE_REQUIRE_REAPPROVAL_ON_CHANGE !== "false"
    ) {
      await prisma.rewriteDraft.update({
        where: { id: draft.id },
        data: { draftStatus: RewriteDraftStatus.STALE_AFTER_CHANGE },
      });
      await prisma.articleImprovementTask.update({
        where: { id: draft.articleImprovementTaskId },
        data: { status: ArticleImprovementStatus.PENDING_APPROVAL },
      });
    }
  }
  return changeSet;
}
