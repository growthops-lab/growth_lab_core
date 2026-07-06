import {
  WordPressRewriteSafetyStatus,
  WordPressRewriteUpdateMode,
  type Prisma,
  type PrismaClient
} from "@prisma/client";

export async function runWordPressRewriteSafetyCheck(
  prisma: PrismaClient,
  input: { rewriteDraftId: string; updateMode?: WordPressRewriteUpdateMode }
) {
  const draft = await prisma.rewriteDraft.findUniqueOrThrow({
    where: { id: input.rewriteDraftId },
    include: { baseSnapshot: true, riskChecks: { orderBy: { checkedAt: "desc" }, take: 1 }, wordpressPost: true }
  });
  const latestRisk = draft.riskChecks[0];
  const updateMode = input.updateMode ?? WordPressRewriteUpdateMode.CREATE_NEW_DRAFT;
  let status: WordPressRewriteSafetyStatus = WordPressRewriteSafetyStatus.PASSED;
  const reasons: string[] = [];
  const fail = (reason: string) => {
    if (status === WordPressRewriteSafetyStatus.PASSED) status = WordPressRewriteSafetyStatus.FAILED;
    reasons.push(reason);
  };
  if (draft.draftStatus !== "APPROVED") {
    fail("Rewrite draft is not approved.");
  }
  if (draft.approvedVersion !== draft.version) {
    fail("Approved version does not match current draft version.");
  }
  if (latestRisk?.status === "BLOCKED" || latestRisk?.maxRiskLevel === "CRITICAL") {
    fail("Critical rewrite risk is still open.");
  }
  if (draft.wordpressPost.status === "publish" || draft.wordpressPost.localStatus === "PUBLISHED") {
    fail("Published posts are not directly updated in Phase 8.");
  }
  if (updateMode === WordPressRewriteUpdateMode.CREATE_NEW_DRAFT && process.env.WORDPRESS_REWRITE_CREATE_NEW_DRAFT_ENABLED === "false") {
    fail("Create-new-draft rewrite mode is disabled.");
  }
  if (updateMode === WordPressRewriteUpdateMode.UPDATE_EXISTING_DRAFT && process.env.WORDPRESS_REWRITE_UPDATE_EXISTING_DRAFT_ENABLED === "false") {
    fail("Update-existing-draft rewrite mode is disabled.");
  }
  if (updateMode === WordPressRewriteUpdateMode.UPDATE_EXISTING_DRAFT && !["draft", "pending"].includes(draft.wordpressPost.status)) {
    fail("Existing WordPress update is allowed only for draft or pending posts.");
  }
  if (
    process.env.WORDPRESS_REWRITE_REQUIRE_MODIFIED_CHECK !== "false" &&
    draft.baseSnapshot?.wordpressModifiedGmt &&
    draft.wordpressPost.lastSyncedAt &&
    draft.baseSnapshot.wordpressModifiedGmt.getTime() !== draft.wordpressPost.lastSyncedAt.getTime()
  ) {
    status = WordPressRewriteSafetyStatus.CONFLICT_DETECTED;
    reasons.push("WordPress modified timestamp changed after the before snapshot.");
  }
  return prisma.wordPressRewriteSafetyCheck.create({
    data: {
      rewriteDraftId: draft.id,
      status,
      updateMode,
      wordpressModifiedGmt: draft.wordpressPost.lastSyncedAt,
      expectedVersion: draft.version,
      approvedVersion: draft.approvedVersion,
      reason: reasons.join(" "),
      details: {
        latestRiskStatus: latestRisk?.status,
        postStatus: draft.wordpressPost.status,
        snapshotModifiedGmt: draft.baseSnapshot?.wordpressModifiedGmt?.toISOString(),
        currentModifiedGmt: draft.wordpressPost.lastSyncedAt?.toISOString()
      } as Prisma.InputJsonValue
    }
  });
}
