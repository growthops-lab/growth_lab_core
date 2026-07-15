import { ApiEventType, PostStatus } from "@prisma/client";
import {
  approvePost,
  createMedia,
  createMockAiPost,
  createSocialAccount,
  createXPost,
  recheckPostLinks,
  rejectPost,
  resetRateLimit,
  schedulePost,
  submitDraftForApproval,
} from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { DAILY_POST_SLOTS, nextDailySlot } from "@/lib/schedule";
import { getSettings, parseBoolean } from "@/lib/settings";
import {
  approveWordPressPost,
  checkWordPressSlug,
  createMockWordPressArticle,
  createWordPressPost,
  createWordPressSite,
  createXPostFromWordPressPost,
  syncWordPressDraft,
  syncWordPressTerms,
  testWordPressConnection,
} from "@/app/wordpress-actions";
import {
  approveCreativeAsset,
  connectCanvaMock,
  createCanvaTemplate,
  generateMockAsset,
  rejectCreativeAsset,
  runAssetRiskCheck,
  setWordPressFeaturedAsset,
  setXPostAsset,
} from "@/app/canva-actions";
import {
  attachProgramToMedia,
  calculateMediaGrowthScore,
  createAffiliateLink,
  createAffiliateNetwork,
  createAffiliatePlacement,
  createAffiliateProgram,
  createGrowthStrategyBoardReport,
  createRevenueEvent,
  importRevenueCsv,
} from "@/app/affiliate-actions";
import {
  connectGoogleMock,
  createGA4Property,
  createSearchConsoleProperty,
  importGA4Csv,
  importSearchConsoleCsv,
  runSeoAnalysis,
  updateSeoRecommendationStatus,
} from "@/app/seo-actions";
import {
  createGoogleSyncJob,
  disconnectGoogleConnection,
  pauseGoogleSyncJob,
  refreshGoogleConnectionStatus,
  resumeGoogleSyncJob,
  runGoogleSyncJobAction,
  startGoogleOAuth,
  testGA4PropertyConnection,
  testSearchConsolePropertyConnection,
} from "@/app/google-actions";
import {
  acknowledgeAlertIncident,
  dismissNotification,
  markNotificationRead,
  pauseScheduledTask,
  resolveAlertIncident,
  resumeScheduledTask,
  runAlertDetectionAction,
  runFreshnessCheckAction,
  runOperationsHealthCheckAction,
  runScheduledTaskAction,
} from "@/app/operations-actions";
import {
  applyRewriteToWordPressDraftAction,
  createContentChangeSetAction,
  createImprovementTaskFromAlert,
  createImprovementTaskFromGrowthRecommendation,
  createImprovementTaskFromSeoRecommendation,
  createManualImprovementTask,
  createRewriteDraftAction,
  createSeoImpactMeasurementAction,
  decideRewriteApprovalAction,
  requestRewriteApprovalAction,
  updateContentChangeSetStatus,
} from "@/app/article-improvement-actions";
import {
  approveSocialQueueAction,
  connectXMockAction,
  createSocialPerformanceAction,
  enqueueSocialPostAction,
  executeSocialQueueAction,
  runSocialSafetyCheckAction,
} from "@/app/social-actions";
import {
  attachCampaignItemAction,
  calculateCampaignGrowthScoreAction,
  calculateCampaignRoiAction,
  createBusinessInsightAction,
  createCampaignAction,
  detectCalendarConflictsAction,
  exportReportAction,
  generateCampaignReportAction,
} from "@/app/campaign-actions";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "稼働中",
  APPROVED: "承認済み",
  BLOCKED: "ブロック",
  CANCELLED: "取消",
  DISCONNECTED: "未接続",
  DRAFT: "下書き",
  DRY_RUN: "モック",
  ERROR: "エラー",
  FAILED: "失敗",
  NOT_CHECKED: "未確認",
  PAUSED: "停止中",
  PENDING_APPROVAL: "承認待ち",
  PLANNING: "計画中",
  POST_STOPPED: "投稿停止",
  PUBLISHED: "公開済み",
  RATE_LIMIT: "レート制限",
  RATE_LIMITED: "制限中",
  REJECTED: "却下",
  REQUEST: "リクエスト",
  SAFE: "安全",
  SCHEDULED: "予約中",
  STOPPED_RATE_LIMIT: "API停止",
  WARNING: "警告",
  CONNECTED: "接続済み",
  MOCK_CONNECTED: "モック接続",
  NOT_CONNECTED: "未接続",
  DISABLED: "無効",
  DRAFT_LOCAL: "ローカル下書き",
  READY_TO_SYNC: "同期準備OK",
  SYNCING: "同期中",
  SYNCED_DRAFT: "WP下書き同期済み",
  PENDING_REVIEW: "レビュー待ち",
  ARCHIVED: "アーカイブ",
  UNIQUE: "重複なし",
  DUPLICATE_FOUND: "重複あり",
};

function formatDate(date?: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatCurrency(value?: number | string | null) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function statusBadge(status: string) {
  const danger = [
    "FAILED",
    "REJECTED",
    "STOPPED_RATE_LIMIT",
    "RATE_LIMITED",
    "DISCONNECTED",
    "BLOCKED",
  ];
  const warn = [
    "PENDING_APPROVAL",
    "SCHEDULED",
    "PAUSED",
    "NOT_CHECKED",
    "WARNING",
  ];
  const className = danger.includes(status)
    ? "badge danger"
    : warn.includes(status)
      ? "badge warn"
      : "badge";
  return <span className={className}>{STATUS_LABELS[status] ?? status}</span>;
}

export default async function Home() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [media, accounts, posts, logs, linkChecks, settings, stats] =
    await Promise.all([
      prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.socialAccount.findMany({
        include: { media: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.findMany({
        include: { media: true, socialAccount: true },
        orderBy: { updatedAt: "desc" },
        take: 50,
      }),
      prisma.apiUsageLog.findMany({
        include: { socialAccount: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.linkCheck.findMany({
        orderBy: { checkedAt: "desc" },
        take: 20,
      }),
      getSettings(),
      Promise.all([
        prisma.media.count(),
        prisma.socialAccount.count(),
        prisma.post.count({ where: { status: PostStatus.PENDING_APPROVAL } }),
        prisma.post.count({ where: { status: PostStatus.SCHEDULED } }),
        prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
        prisma.apiUsageLog.count({
          where: { eventType: ApiEventType.POST_STOPPED },
        }),
        prisma.post.count({ where: { status: PostStatus.BLOCKED } }),
        prisma.post.count({ where: { status: PostStatus.FAILED } }),
        prisma.post.count({
          where: {
            scheduledAt: { gte: todayStart },
            status: PostStatus.SCHEDULED,
          },
        }),
        prisma.apiUsageLog.count(),
        prisma.wordPressSite.count(),
        prisma.wordPressSite.count({
          where: { connectionStatus: "CONNECTED" },
        }),
        prisma.wordPressSite.count({
          where: { connectionStatus: "MOCK_CONNECTED" },
        }),
        prisma.wordPressPost.count({ where: { status: "draft" } }),
        prisma.wordPressPost.count({ where: { localStatus: "SYNCED_DRAFT" } }),
        prisma.wordPressPost.count({ where: { localStatus: "PUBLISHED" } }),
        prisma.wordPressPost.count({ where: { localStatus: "FAILED" } }),
        prisma.wordPressPost.count({
          where: { duplicateCheckStatus: "DUPLICATE_FOUND" },
        }),
      ]),
    ]);
  const [wordpressSites, wordpressPosts, wordpressLogs] = await Promise.all([
    prisma.wordPressSite.findMany({
      include: { media: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.wordPressPost.findMany({
      include: { media: true, wordpressSite: true },
      orderBy: { updatedAt: "desc" },
      take: 30,
    }),
    prisma.wordPressSyncLog.findMany({
      include: { wordpressSite: true, wordpressPost: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);
  const [
    canvaConnections,
    canvaTemplates,
    creativeAssets,
    canvaLogs,
    imageStats,
  ] = await Promise.all([
    prisma.canvaConnection.findMany({
      include: { media: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.canvaBrandTemplate.findMany({
      include: { media: true, canvaConnection: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.creativeAsset.findMany({
      include: { media: true },
      orderBy: { updatedAt: "desc" },
      take: 30,
    }),
    prisma.canvaSyncLog.findMany({
      include: { canvaConnection: true, canvaDesignJob: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    Promise.all([
      prisma.canvaConnection.count(),
      prisma.canvaConnection.count({
        where: { connectionStatus: "MOCK_CONNECTED" },
      }),
      prisma.canvaBrandTemplate.count(),
      prisma.creativeAsset.count(),
      prisma.creativeAsset.count({
        where: { approvalStatus: "PENDING_APPROVAL" },
      }),
      prisma.creativeAsset.count({ where: { riskCheckStatus: "BLOCKED" } }),
      prisma.creativeAsset.count({ where: { madeWithAi: true } }),
      prisma.wordPressPost.count({ where: { creativeAssetId: null } }),
      prisma.wordPressPost.count({ where: { creativeAssetId: { not: null } } }),
      prisma.post.count({ where: { creativeAssetId: { not: null } } }),
      prisma.canvaSyncLog.count({ where: { success: false } }),
    ]),
  ]);
  const [
    affiliateNetworks,
    affiliatePrograms,
    programMediaSites,
    affiliateLinks,
    affiliatePlacements,
    revenueEvents,
    importBatches,
    growthSnapshots,
    growthRecommendations,
    gsbReports,
    phase4Stats,
  ] = await Promise.all([
    prisma.affiliateNetwork.findMany({
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.affiliateProgram.findMany({
      include: { affiliateNetwork: true },
      orderBy: { updatedAt: "desc" },
      take: 30,
    }),
    prisma.affiliateProgramMediaSite.findMany({
      include: { media: true, affiliateProgram: true },
      orderBy: { updatedAt: "desc" },
      take: 30,
    }),
    prisma.affiliateLink.findMany({
      include: {
        media: true,
        affiliateProgram: { include: { affiliateNetwork: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 30,
    }),
    prisma.affiliatePlacement.findMany({
      include: { media: true, affiliateLink: true, wordpressPost: true },
      orderBy: { updatedAt: "desc" },
      take: 30,
    }),
    prisma.revenueEvent.findMany({
      include: {
        media: true,
        affiliateNetwork: true,
        affiliateProgram: true,
        wordpressPost: true,
        post: true,
      },
      orderBy: { eventDate: "desc" },
      take: 40,
    }),
    prisma.revenueImportBatch.findMany({
      include: { errors: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.growthScoreSnapshot.findMany({
      include: { media: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.growthRecommendation.findMany({
      include: { media: true },
      orderBy: [{ status: "asc" }, { priority: "asc" }],
      take: 20,
    }),
    prisma.growthStrategyBoardReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    Promise.all([
      prisma.affiliateProgram.count(),
      prisma.affiliateProgram.count({
        where: { status: { in: ["APPROVED", "ACTIVE"] } },
      }),
      prisma.affiliateLink.count(),
      prisma.revenueEvent.count(),
      prisma.revenueEvent.aggregate({
        _sum: {
          estimatedReward: true,
          pendingReward: true,
          approvedReward: true,
        },
      }),
      prisma.operatingCost.aggregate({ _sum: { amount: true } }),
      prisma.growthScoreSnapshot.count(),
      prisma.growthScoreSnapshot.count({
        where: { dataConfidence: "INSUFFICIENT" },
      }),
      prisma.growthRecommendation.count({ where: { type: "IMPROVE" } }),
      prisma.growthRecommendation.count({
        where: { type: { in: ["PAUSE", "STOP"] } },
      }),
    ]),
  ]);
  const [
    googleConnections,
    ga4Properties,
    searchConsoleProperties,
    ga4PageMetrics,
    searchConsoleQueryPages,
    seoSnapshots,
    seoOpportunities,
    seoRecommendations,
    seoImportBatches,
    googleSyncJobs,
    googleSyncRuns,
    googleApiQuotaLogs,
    googleApiErrorLogs,
    phase5Stats,
  ] = await Promise.all([
    prisma.googleConnection.findMany({
      include: { media: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.gA4Property.findMany({
      include: { media: true, googleConnection: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.searchConsoleProperty.findMany({
      include: { media: true, googleConnection: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.gA4PageMetricDaily.findMany({
      include: { media: true, wordpressPost: true },
      orderBy: { date: "desc" },
      take: 20,
    }),
    prisma.searchConsoleQueryPageDaily.findMany({
      include: { media: true, wordpressPost: true },
      orderBy: { date: "desc" },
      take: 30,
    }),
    prisma.seoAnalysisSnapshot.findMany({
      include: { media: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.seoOpportunity.findMany({
      include: { media: true, wordpressPost: true, seoKeyword: true },
      orderBy: [{ status: "asc" }, { priority: "asc" }, { createdAt: "desc" }],
      take: 30,
    }),
    prisma.seoRecommendation.findMany({
      include: { media: true, wordpressPost: true, seoOpportunity: true },
      orderBy: [
        { approvalStatus: "asc" },
        { priority: "asc" },
        { createdAt: "desc" },
      ],
      take: 30,
    }),
    prisma.seoImportBatch.findMany({
      include: { media: true, errors: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.googleSyncJob.findMany({
      include: { media: true, googleConnection: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.googleSyncRun.findMany({
      include: { media: true, googleSyncJob: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.googleApiQuotaLog.findMany({
      include: { media: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.googleApiErrorLog.findMany({
      include: { media: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    Promise.all([
      prisma.googleConnection.count(),
      prisma.gA4PageMetricDaily.count(),
      prisma.searchConsoleQueryPageDaily.count(),
      prisma.searchConsoleQueryPageDaily.aggregate({
        _sum: { clicks: true, impressions: true },
      }),
      prisma.seoOpportunity.count({
        where: { status: { in: ["NEW", "IN_PROGRESS"] } },
      }),
      prisma.seoRecommendation.count({
        where: { approvalStatus: "PENDING_APPROVAL" },
      }),
      prisma.seoRecommendation.count({ where: { approvalStatus: "APPROVED" } }),
      prisma.seoImportBatch.count({ where: { status: "FAILED" } }),
      prisma.googleSyncRun.count({ where: { status: "SUCCESS" } }),
      prisma.googleSyncRun.count({ where: { status: "FAILED" } }),
      prisma.googleSyncRun.count({ where: { status: "RATE_LIMITED" } }),
      prisma.googleApiErrorLog.count(),
    ]),
  ]);
  const [
    scheduledTasks,
    scheduledTaskRuns,
    dataFreshnessStatuses,
    alertIncidents,
    notificationEvents,
    notificationDeliveries,
    operationsHealthSnapshots,
    weeklyOperationsReports,
    operationSettings,
    operationsStats,
  ] = await Promise.all([
    prisma.scheduledTask.findMany({
      include: { media: true },
      orderBy: [{ enabled: "desc" }, { nextRunAt: "asc" }],
      take: 30,
    }),
    prisma.scheduledTaskRun.findMany({
      include: { scheduledTask: true, media: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.dataFreshnessStatus.findMany({
      include: { media: true },
      orderBy: [{ status: "desc" }, { checkedAt: "desc" }],
      take: 40,
    }),
    prisma.alertIncident.findMany({
      include: { alertRule: true, media: true },
      orderBy: [{ status: "asc" }, { detectedAt: "desc" }],
      take: 30,
    }),
    prisma.notificationEvent.findMany({
      include: { media: true, alertIncident: true, scheduledTaskRun: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.notificationDelivery.findMany({
      include: { notificationChannel: true, notificationEvent: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.operationsHealthSnapshot.findMany({
      orderBy: { checkedAt: "desc" },
      take: 10,
    }),
    prisma.weeklyOperationsReport.findMany({
      include: { media: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.operationSetting.findMany({ orderBy: { key: "asc" }, take: 80 }),
    Promise.all([
      prisma.scheduledTask.count(),
      prisma.scheduledTask.count({ where: { enabled: true } }),
      prisma.scheduledTaskRun.count({ where: { status: "FAILED" } }),
      prisma.dataFreshnessStatus.count({
        where: { status: { in: ["WARNING", "CRITICAL", "UNKNOWN"] } },
      }),
      prisma.alertIncident.count({ where: { status: "OPEN" } }),
      prisma.notificationEvent.count({ where: { status: "UNREAD" } }),
      prisma.operationsHealthSnapshot.count(),
    ]),
  ]);
  const [
    articleImprovementTasks,
    rewriteDrafts,
    contentChangeSets,
    rewriteRiskChecks,
    wordpressSafetyChecks,
    wordpressDraftUpdates,
    seoImpactMeasurements,
    improvementExecutionLogs,
    phase8Stats,
  ] = await Promise.all([
    prisma.articleImprovementTask.findMany({
      include: {
        media: true,
        wordpressPost: true,
        seoRecommendation: true,
        alertIncident: true,
        growthRecommendation: true,
      },
      orderBy: [{ status: "asc" }, { priority: "asc" }, { updatedAt: "desc" }],
      take: 30,
    }),
    prisma.rewriteDraft.findMany({
      include: {
        articleImprovementTask: true,
        wordpressPost: true,
        suggestions: true,
        contentChangeSets: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 30,
    }),
    prisma.contentChangeSet.findMany({
      include: { rewriteDraft: true, articleImprovementTask: true },
      orderBy: { updatedAt: "desc" },
      take: 30,
    }),
    prisma.rewriteRiskCheck.findMany({
      include: { rewriteDraft: true },
      orderBy: { checkedAt: "desc" },
      take: 20,
    }),
    prisma.wordPressRewriteSafetyCheck.findMany({
      include: { rewriteDraft: true },
      orderBy: { checkedAt: "desc" },
      take: 20,
    }),
    prisma.wordPressDraftUpdate.findMany({
      include: { rewriteDraft: true, wordpressPost: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.seoImpactMeasurement.findMany({
      include: {
        articleImprovementTask: true,
        media: true,
        wordpressPost: true,
      },
      orderBy: { measuredAt: "desc" },
      take: 20,
    }),
    prisma.improvementExecutionLog.findMany({
      include: { articleImprovementTask: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    Promise.all([
      prisma.articleImprovementTask.count({
        where: {
          status: {
            in: ["BACKLOG", "DRAFTING", "DIFF_REVIEW", "PENDING_APPROVAL"],
          },
        },
      }),
      prisma.articleImprovementTask.count({
        where: {
          priority: "HIGH",
          status: { notIn: ["DONE", "REJECTED", "DISMISSED"] },
        },
      }),
      prisma.rewriteDraft.count({ where: { draftStatus: "PENDING_APPROVAL" } }),
      prisma.rewriteDraft.count({
        where: { draftStatus: "STALE_AFTER_CHANGE" },
      }),
      prisma.wordPressDraftUpdate.count({ where: { status: "MOCK_UPDATED" } }),
      prisma.wordPressDraftUpdate.count({ where: { status: "BLOCKED" } }),
      prisma.articleImprovementTask.count({ where: { status: "MEASURING" } }),
      prisma.articleImprovementTask.count({ where: { status: "DONE" } }),
      prisma.seoImpactMeasurement.count({
        where: { status: "INSUFFICIENT_DATA" },
      }),
    ]),
  ]);

  const [
    socialApiConnections,
    socialPostQueues,
    socialPostExecutions,
    socialSafetyChecks,
    socialRateLimitLogs,
    socialPerformanceSnapshots,
    socialPostAttributions,
    socialImprovementSuggestions,
    socialGrowthScoreSnapshots,
    socialManualReviews,
    phase9Stats,
  ] = await Promise.all([
    prisma.socialApiConnection.findMany({
      include: { media: true, socialAccount: true },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.socialPostQueue.findMany({
      include: { media: true, socialAccount: true, wordpressPost: true },
      orderBy: [
        { queueStatus: "asc" },
        { scheduledAt: "asc" },
        { createdAt: "desc" },
      ],
      take: 30,
    }),
    prisma.socialPostExecution.findMany({
      include: { socialPostQueue: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.socialPostSafetyCheck.findMany({
      include: { socialPostQueue: true },
      orderBy: { checkedAt: "desc" },
      take: 20,
    }),
    prisma.socialPostRateLimitLog.findMany({
      include: { socialPostQueue: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.socialPostPerformanceSnapshot.findMany({
      include: { media: true, socialAccount: true, socialPostQueue: true },
      orderBy: { snapshotDate: "desc" },
      take: 20,
    }),
    prisma.socialPostAttribution.findMany({
      include: { media: true, wordpressPost: true, socialPostQueue: true },
      orderBy: { date: "desc" },
      take: 20,
    }),
    prisma.socialImprovementSuggestion.findMany({
      include: { media: true, socialAccount: true, socialPostQueue: true },
      orderBy: [{ status: "asc" }, { priority: "asc" }],
      take: 20,
    }),
    prisma.socialGrowthScoreSnapshot.findMany({
      include: { media: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.socialPostManualReview.findMany({
      include: {
        socialPostQueue: { include: { media: true, socialAccount: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    Promise.all([
      prisma.socialApiConnection.count(),
      prisma.socialApiConnection.count({
        where: { connectionStatus: "MOCK_CONNECTED" },
      }),
      prisma.socialPostQueue.count({
        where: { queueStatus: { in: ["READY", "SCHEDULED"] } },
      }),
      prisma.socialPostQueue.count({ where: { queueStatus: "POSTED" } }),
      prisma.socialPostQueue.count({ where: { queueStatus: "MANUAL_REVIEW" } }),
      prisma.socialPostSafetyCheck.count({ where: { status: "BLOCKED" } }),
      prisma.socialPostPerformanceSnapshot.count(),
      prisma.socialImprovementSuggestion.count({
        where: { status: "PROPOSED" },
      }),
    ]),
  ]);

  const [
    campaigns,
    campaignItems,
    campaignRoiSnapshots,
    campaignGrowthScores,
    campaignRisks,
    campaignRecommendations,
    contentCalendarEvents,
    contentCalendarConflicts,
    generatedReports,
    reportExports,
    businessInsights,
    phase10Stats,
  ] = await Promise.all([
    prisma.campaign.findMany({
      include: { media: true },
      orderBy: [{ status: "asc" }, { periodStart: "desc" }],
      take: 20,
    }),
    prisma.campaignItem.findMany({
      include: { campaign: { include: { media: true } } },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.campaignRoiSnapshot.findMany({
      include: { campaign: true, media: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.campaignGrowthScoreSnapshot.findMany({
      include: { campaign: true, media: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.campaignRisk.findMany({
      include: { campaign: { include: { media: true } } },
      orderBy: [{ status: "asc" }, { severity: "desc" }, { createdAt: "desc" }],
      take: 20,
    }),
    prisma.campaignRecommendation.findMany({
      include: { campaign: { include: { media: true } } },
      orderBy: [{ status: "asc" }, { priority: "asc" }],
      take: 20,
    }),
    prisma.contentCalendarEvent.findMany({
      include: { campaign: true, media: true },
      orderBy: { scheduledAt: "asc" },
      take: 30,
    }),
    prisma.contentCalendarConflict.findMany({
      include: { campaign: true, calendarEvent: true },
      orderBy: [{ status: "asc" }, { detectedAt: "desc" }],
      take: 20,
    }),
    prisma.generatedReport.findMany({
      include: { campaign: true, media: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.reportExport.findMany({
      include: { generatedReport: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.businessInsight.findMany({
      include: { campaign: true, media: true },
      orderBy: [{ status: "asc" }, { priority: "asc" }],
      take: 20,
    }),
    Promise.all([
      prisma.campaign.count({
        where: { status: { in: ["PLANNING", "ACTIVE"] } },
      }),
      prisma.campaignRoiSnapshot.aggregate({
        _sum: { approvedRevenue: true, pendingRevenue: true, actualCost: true },
      }),
      prisma.campaignRisk.count({ where: { status: "OPEN" } }),
      prisma.contentCalendarConflict.count({ where: { status: "OPEN" } }),
      prisma.generatedReport.count({ where: { status: "DRAFT" } }),
      prisma.generatedReport.count({ where: { status: "READY_FOR_REVIEW" } }),
      prisma.campaignRecommendation.count({
        where: { status: "PROPOSED", priority: { lte: 20 } },
      }),
      prisma.businessInsight.count({ where: { status: "PROPOSED" } }),
    ]),
  ]);

  const [
    mediaCount,
    accountCount,
    pendingCount,
    scheduledCount,
    publishedCount,
    stoppedCount,
    blockedCount,
    failedCount,
    todayScheduledCount,
    apiLogCount,
    wordpressSiteCount,
    wordpressConnectedCount,
    wordpressMockConnectedCount,
    wordpressDraftCount,
    wordpressSyncedDraftCount,
    wordpressPublishedCount,
    wordpressFailedCount,
    wordpressDuplicateCount,
  ] = stats;
  const [
    canvaConnectionCount,
    canvaMockConnectionCount,
    canvaTemplateCount,
    creativeAssetCount,
    pendingAssetCount,
    blockedAssetCount,
    madeWithAiAssetCount,
    wordpressWithoutImageCount,
    wordpressWithImageCount,
    xPostWithImageCount,
    canvaErrorCount,
  ] = imageStats;
  const [
    affiliateProgramCount,
    approvedAffiliateProgramCount,
    affiliateLinkCount,
    revenueEventCount,
    revenueSums,
    costSums,
    growthSnapshotCount,
    insufficientGrowthCount,
    improveRecommendationCount,
    pauseRecommendationCount,
  ] = phase4Stats;
  const estimatedRevenueTotal = Number(revenueSums._sum.estimatedReward ?? 0);
  const pendingRevenueTotal = Number(revenueSums._sum.pendingReward ?? 0);
  const approvedRevenueTotal = Number(revenueSums._sum.approvedReward ?? 0);
  const operatingCostTotal = Number(costSums._sum.amount ?? 0);
  const profitTotal = approvedRevenueTotal - operatingCostTotal;
  const [
    googleConnectionCount,
    ga4PageMetricCount,
    searchConsoleQueryPageCount,
    searchConsoleSums,
    openSeoOpportunityCount,
    pendingSeoRecommendationCount,
    approvedSeoRecommendationCount,
    failedSeoImportBatchCount,
    successfulGoogleSyncRunCount,
    failedGoogleSyncRunCount,
    rateLimitedGoogleSyncRunCount,
    googleApiErrorCount,
  ] = phase5Stats;
  const seoClicksTotal = Number(searchConsoleSums._sum.clicks ?? 0);
  const seoImpressionsTotal = Number(searchConsoleSums._sum.impressions ?? 0);
  const defaultMedia = media[0];
  const defaultAccount = accounts[0];
  const defaultGoogleConnection =
    googleConnections.find(
      (connection) => connection.mediaId === defaultMedia?.id,
    ) ?? googleConnections[0];
  const defaultGA4Property =
    ga4Properties.find((property) => property.mediaId === defaultMedia?.id) ??
    ga4Properties[0];
  const defaultSearchConsoleProperty =
    searchConsoleProperties.find(
      (property) => property.mediaId === defaultMedia?.id,
    ) ?? searchConsoleProperties[0];
  const nextSlot = nextDailySlot();
  const mockMode = process.env.X_MOCK_MODE !== "false";
  const aiMockMode = process.env.AI_MOCK_MODE !== "false";
  const autoPostingEnabled = parseBoolean(settings.AUTO_POSTING_ENABLED);
  const [
    scheduledTaskCount,
    enabledScheduledTaskCount,
    failedScheduledTaskRunCount,
    staleFreshnessCount,
    openAlertCount,
    unreadNotificationCount,
    operationsHealthSnapshotCount,
  ] = operationsStats;
  const [
    openImprovementTaskCount,
    highPriorityImprovementTaskCount,
    pendingRewriteApprovalCount,
    staleRewriteApprovalCount,
    wordpressDraftUpdateCount,
    blockedWordPressUpdateCount,
    measuringImprovementTaskCount,
    completedImprovementTaskCount,
    insufficientImpactMeasurementCount,
  ] = phase8Stats;
  const [
    socialApiConnectionCount,
    socialMockConnectionCount,
    socialReadyQueueCount,
    socialPostedQueueCount,
    socialManualReviewCount,
    socialBlockedSafetyCount,
    socialPerformanceSnapshotCount,
    socialProposedSuggestionCount,
  ] = phase9Stats;
  const [
    activeCampaignCount,
    campaignRevenueSums,
    openCampaignRiskCount,
    openCalendarConflictCount,
    reportDraftCount,
    reportReadyCount,
    highPriorityCampaignRecommendationCount,
    proposedBusinessInsightCount,
  ] = phase10Stats;
  const campaignApprovedRevenueTotal = Number(
    campaignRevenueSums._sum.approvedRevenue ?? 0,
  );
  const campaignPendingRevenueTotal = Number(
    campaignRevenueSums._sum.pendingRevenue ?? 0,
  );
  const campaignActualCostTotal = Number(
    campaignRevenueSums._sum.actualCost ?? 0,
  );
  const campaignRoiApprovedTotal =
    campaignActualCostTotal > 0
      ? (campaignApprovedRevenueTotal - campaignActualCostTotal) /
        campaignActualCostTotal
      : 0;

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">Growth Lab Core Phase 1</div>
          <h1>Affiliate Media Platform</h1>
          <p className="copy">
            複数メディアとSNSアカウントを管理し、AI生成、下書き、人間承認、リンクチェック、予約投稿、履歴確認までを
            ローカルMVPで運用します。Xは広告リンク直貼りではなく、登録メディアへの集客導線として扱います。
          </p>
        </div>
        <div className="notice">
          予約スロット: {DAILY_POST_SLOTS.join(" / ")}
          <br />
          次回候補: {formatDate(nextSlot)}
          <br />
          Mock: {mockMode ? "ON" : "OFF"} / AI Mock: {aiMockMode ? "ON" : "OFF"}{" "}
          / Auto: {autoPostingEnabled ? "ON" : "OFF"}
        </div>
      </header>

      <section className="grid stats" aria-label="Dashboard stats">
        <div className="stat">
          <span className="muted">メディア</span>
          <strong>{mediaCount}</strong>
        </div>
        <div className="stat">
          <span className="muted">SNSアカウント</span>
          <strong>{accountCount}</strong>
        </div>
        <div className="stat">
          <span className="muted">本日予約 / 承認待ち</span>
          <strong>
            {todayScheduledCount} / {pendingCount}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">公開 / ブロック / 失敗</span>
          <strong>
            {publishedCount} / {blockedCount} / {failedCount}
          </strong>
        </div>
      </section>

      <section className="grid stats" aria-label="Operations stats">
        <div className="stat">
          <span className="muted">予約中</span>
          <strong>{scheduledCount}</strong>
        </div>
        <div className="stat">
          <span className="muted">APIログ</span>
          <strong>{apiLogCount}</strong>
        </div>
        <div className="stat">
          <span className="muted">API停止</span>
          <strong>{stoppedCount}</strong>
        </div>
        <div className="stat">
          <span className="muted">自動投稿</span>
          <strong>{autoPostingEnabled ? "ON" : "OFF"}</strong>
        </div>
      </section>

      <section className="grid stats" aria-label="WordPress stats">
        <div className="stat">
          <span className="muted">WordPressサイト</span>
          <strong>{wordpressSiteCount}</strong>
        </div>
        <div className="stat">
          <span className="muted">接続 / モック</span>
          <strong>
            {wordpressConnectedCount} / {wordpressMockConnectedCount}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">WP下書き / 同期済み</span>
          <strong>
            {wordpressDraftCount} / {wordpressSyncedDraftCount}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">公開 / 失敗 / slug重複</span>
          <strong>
            {wordpressPublishedCount} / {wordpressFailedCount} /{" "}
            {wordpressDuplicateCount}
          </strong>
        </div>
      </section>

      <section className="grid stats" aria-label="Canva and image stats">
        <div className="stat">
          <span className="muted">Canva connections / mock</span>
          <strong>
            {canvaConnectionCount} / {canvaMockConnectionCount}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">Templates / Assets</span>
          <strong>
            {canvaTemplateCount} / {creativeAssetCount}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">Pending / Blocked / AI</span>
          <strong>
            {pendingAssetCount} / {blockedAssetCount} / {madeWithAiAssetCount}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">
            WP image none/done / X image / Canva errors
          </span>
          <strong>
            {wordpressWithoutImageCount} / {wordpressWithImageCount} /{" "}
            {xPostWithImageCount} / {canvaErrorCount}
          </strong>
        </div>
      </section>

      <section
        className="grid stats"
        aria-label="Affiliate revenue and growth stats"
      >
        <div className="stat">
          <span className="muted">Affiliate programs / approved</span>
          <strong>
            {affiliateProgramCount} / {approvedAffiliateProgramCount}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">Links / Revenue events</span>
          <strong>
            {affiliateLinkCount} / {revenueEventCount}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">Estimated / Pending / Approved</span>
          <strong>{formatCurrency(estimatedRevenueTotal)}</strong>
          <small>
            {formatCurrency(pendingRevenueTotal)} /{" "}
            {formatCurrency(approvedRevenueTotal)}
          </small>
        </div>
        <div className="stat">
          <span className="muted">Profit / Growth snapshots / Risk</span>
          <strong>{formatCurrency(profitTotal)}</strong>
          <small>
            {growthSnapshotCount} snapshots / insufficient{" "}
            {insufficientGrowthCount} / improve {improveRecommendationCount} /
            pause {pauseRecommendationCount}
          </small>
        </div>
      </section>

      <section className="grid stats" aria-label="Google data and SEO stats">
        <div className="stat">
          <span className="muted">Google mock connections</span>
          <strong>{googleConnectionCount}</strong>
        </div>
        <div className="stat">
          <span className="muted">GA4 page rows / GSC query-page rows</span>
          <strong>
            {ga4PageMetricCount} / {searchConsoleQueryPageCount}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">GSC clicks / impressions</span>
          <strong>
            {seoClicksTotal} / {seoImpressionsTotal}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">
            SEO open / review / approved / import errors
          </span>
          <strong>
            {openSeoOpportunityCount} / {pendingSeoRecommendationCount} /{" "}
            {approvedSeoRecommendationCount} / {failedSeoImportBatchCount}
          </strong>
        </div>
      </section>

      <section className="grid stats" aria-label="Google API sync stats">
        <div className="stat">
          <span className="muted">Google sync jobs / runs</span>
          <strong>
            {googleSyncJobs.length} / {googleSyncRuns.length}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">Sync success / failed / rate limited</span>
          <strong>
            {successfulGoogleSyncRunCount} / {failedGoogleSyncRunCount} /{" "}
            {rateLimitedGoogleSyncRunCount}
          </strong>
        </div>
        <div className="stat">
          <span className="muted">Google API quota logs</span>
          <strong>{googleApiQuotaLogs.length}</strong>
        </div>
        <div className="stat">
          <span className="muted">Google API errors</span>
          <strong>{googleApiErrorCount}</strong>
        </div>
      </section>

      <section className="layout">
        <aside className="stack">
          <div className="panel">
            <h2>メディア追加</h2>
            <form action={createMedia} className="form">
              <div className="field">
                <label htmlFor="media-name">名前</label>
                <input
                  className="input"
                  id="media-name"
                  name="name"
                  placeholder="例: SaaS比較ラボ"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="media-niche">ジャンル</label>
                <input
                  className="input"
                  id="media-niche"
                  name="niche"
                  placeholder="例: 業務効率化SaaS"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="media-url">WordPress URL</label>
                <input
                  className="input"
                  id="media-url"
                  name="wordpressUrl"
                  type="url"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="note-url">note URL</label>
                <input
                  className="input"
                  id="note-url"
                  name="noteUrl"
                  type="url"
                />
              </div>
              <div className="field">
                <label htmlFor="blogger-url">Blogger URL</label>
                <input
                  className="input"
                  id="blogger-url"
                  name="bloggerUrl"
                  type="url"
                />
              </div>
              <div className="field">
                <label htmlFor="instagram-url">Instagram URL</label>
                <input
                  className="input"
                  id="instagram-url"
                  name="instagramUrl"
                  type="url"
                />
              </div>
              <div className="field">
                <label htmlFor="pinterest-url">Pinterest URL</label>
                <input
                  className="input"
                  id="pinterest-url"
                  name="pinterestUrl"
                  type="url"
                />
              </div>
              <div className="field">
                <label htmlFor="media-notes">メモ</label>
                <textarea className="textarea" id="media-notes" name="notes" />
              </div>
              <button className="button" type="submit">
                追加
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Xアカウント追加</h2>
            <form action={createSocialAccount} className="form">
              <div className="field">
                <label htmlFor="account-media">メディア</label>
                <select
                  className="select"
                  id="account-media"
                  name="mediaId"
                  defaultValue={defaultMedia?.id}
                  required
                >
                  {media.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="handle">Xハンドル</label>
                <input
                  className="input"
                  id="handle"
                  name="handle"
                  placeholder="@example"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="displayName">表示名</label>
                <input
                  className="input"
                  id="displayName"
                  name="displayName"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="accountUrl">アカウントURL</label>
                <input
                  className="input"
                  id="accountUrl"
                  name="accountUrl"
                  type="url"
                  placeholder="https://x.com/example"
                />
              </div>
              <label className="field">
                <span>自動投稿ON</span>
                <input
                  type="checkbox"
                  name="autoPostingEnabled"
                  defaultChecked
                />
              </label>
              <div className="button-row">
                <input
                  className="input"
                  name="dailyLimit"
                  type="number"
                  min="1"
                  defaultValue="50"
                  aria-label="日次上限"
                />
                <input
                  className="input"
                  name="windowLimit"
                  type="number"
                  min="1"
                  defaultValue="6"
                  aria-label="短時間上限"
                />
                <input
                  className="input"
                  name="windowMinutes"
                  type="number"
                  min="1"
                  defaultValue="15"
                  aria-label="短時間分数"
                />
              </div>
              <button
                className="button"
                type="submit"
                disabled={media.length === 0}
              >
                追加
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>X投稿作成</h2>
            <form action={createXPost} className="form">
              <SharedSelectors
                media={media}
                accounts={accounts}
                defaultMediaId={defaultMedia?.id}
                defaultAccountId={defaultAccount?.id}
              />
              <div className="field">
                <label htmlFor="title">管理用タイトル</label>
                <input className="input" id="title" name="title" required />
              </div>
              <div className="field">
                <label htmlFor="body">投稿本文</label>
                <textarea
                  className="textarea"
                  id="body"
                  name="body"
                  maxLength={260}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="destinationUrl">誘導先URL</label>
                <input
                  className="input"
                  id="destinationUrl"
                  name="destinationUrl"
                  type="url"
                  defaultValue={defaultMedia?.wordpressUrl}
                  required
                />
              </div>
              <button
                className="button"
                type="submit"
                disabled={media.length === 0 || accounts.length === 0}
              >
                承認待ちに追加
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>AIモック生成</h2>
            <form action={createMockAiPost} className="form">
              <SharedSelectors
                media={media}
                accounts={accounts}
                defaultMediaId={defaultMedia?.id}
                defaultAccountId={defaultAccount?.id}
                prefix="ai"
              />
              <div className="field">
                <label htmlFor="aiPrompt">AIプロンプト</label>
                <textarea
                  className="textarea"
                  id="aiPrompt"
                  name="aiPrompt"
                  placeholder="例: 初心者向けに比較記事へ誘導する投稿"
                />
              </div>
              <button
                className="button"
                type="submit"
                disabled={media.length === 0 || accounts.length === 0}
              >
                下書き生成
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>WordPressサイト追加</h2>
            <form action={createWordPressSite} className="form">
              <div className="field">
                <label htmlFor="wp-media">メディア</label>
                <select
                  className="select"
                  id="wp-media"
                  name="mediaId"
                  defaultValue={defaultMedia?.id}
                  required
                >
                  {media.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="siteName">サイト名</label>
                <input
                  className="input"
                  id="siteName"
                  name="siteName"
                  placeholder="例: AI副業ラボ WordPress"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="siteUrl">サイトURL</label>
                <input
                  className="input"
                  id="siteUrl"
                  name="siteUrl"
                  type="url"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="apiBaseUrl">API Base URL</label>
                <input
                  className="input"
                  id="apiBaseUrl"
                  name="apiBaseUrl"
                  type="url"
                  placeholder="空なら自動生成"
                />
              </div>
              <div className="field">
                <label htmlFor="username">WordPressユーザー名</label>
                <input
                  className="input"
                  id="username"
                  name="username"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="applicationPassword">
                  Application Password
                </label>
                <input
                  className="input"
                  id="applicationPassword"
                  name="applicationPassword"
                  type="password"
                  placeholder="Mockでは空でも可"
                />
              </div>
              <div className="button-row">
                <label>
                  <input type="checkbox" name="mockMode" defaultChecked /> Mock
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="autoAddAllowedDomain"
                    defaultChecked
                  />{" "}
                  許可ドメイン追加
                </label>
                <input type="hidden" name="defaultStatus" value="draft" />
              </div>
              <button
                className="button"
                type="submit"
                disabled={media.length === 0}
              >
                登録
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>WordPress記事作成</h2>
            <form action={createWordPressPost} className="form">
              <WordPressSiteSelect sites={wordpressSites} />
              <div className="field">
                <label htmlFor="wp-title">タイトル</label>
                <input className="input" id="wp-title" name="title" required />
              </div>
              <div className="field">
                <label htmlFor="wp-slug">slug</label>
                <input
                  className="input"
                  id="wp-slug"
                  name="slug"
                  placeholder="空なら自動生成"
                />
              </div>
              <div className="field">
                <label htmlFor="wp-excerpt">抜粋</label>
                <textarea className="textarea" id="wp-excerpt" name="excerpt" />
              </div>
              <div className="field">
                <label htmlFor="contentMarkdown">本文Markdown</label>
                <textarea
                  className="textarea"
                  id="contentMarkdown"
                  name="contentMarkdown"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="seoTitle">SEOタイトル</label>
                <input className="input" id="seoTitle" name="seoTitle" />
              </div>
              <div className="field">
                <label htmlFor="seoDescription">SEOディスクリプション</label>
                <textarea
                  className="textarea"
                  id="seoDescription"
                  name="seoDescription"
                />
              </div>
              <div className="field">
                <label htmlFor="focusKeyword">フォーカスキーワード</label>
                <input
                  className="input"
                  id="focusKeyword"
                  name="focusKeyword"
                />
              </div>
              <button
                className="button"
                type="submit"
                disabled={wordpressSites.length === 0}
              >
                記事下書き作成
              </button>
            </form>
            <form action={createMockWordPressArticle} className="form">
              <WordPressSiteSelect sites={wordpressSites} prefix="mock-wp" />
              <div className="field">
                <label htmlFor="wpAiPrompt">AI記事プロンプト</label>
                <textarea
                  className="textarea"
                  id="wpAiPrompt"
                  name="aiPrompt"
                  placeholder="例: 初心者向けAI副業ツール比較記事"
                />
              </div>
              <button
                className="button secondary"
                type="submit"
                disabled={wordpressSites.length === 0}
              >
                AIモック記事生成
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Canva mock connection</h2>
            <form action={connectCanvaMock} className="form">
              <div className="field">
                <label htmlFor="canva-media">Media</label>
                <select
                  className="select"
                  id="canva-media"
                  name="mediaId"
                  defaultValue={defaultMedia?.id}
                  required
                >
                  {media.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="connectionName">Connection name</label>
                <input
                  className="input"
                  id="connectionName"
                  name="connectionName"
                  defaultValue="Canva Mock"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="canvaUserEmail">Mock email</label>
                <input
                  className="input"
                  id="canvaUserEmail"
                  name="canvaUserEmail"
                  type="email"
                  placeholder="mock-canva@growth-lab.local"
                />
              </div>
              <button
                className="button"
                type="submit"
                disabled={media.length === 0}
              >
                Connect mock
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Canva template</h2>
            <form action={createCanvaTemplate} className="form">
              <div className="field">
                <label htmlFor="template-media">Media</label>
                <select
                  className="select"
                  id="template-media"
                  name="mediaId"
                  defaultValue={defaultMedia?.id}
                  required
                >
                  {media.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="template-connection">Connection</label>
                <select
                  className="select"
                  id="template-connection"
                  name="canvaConnectionId"
                  defaultValue={canvaConnections[0]?.id ?? ""}
                >
                  <option value="">None</option>
                  {canvaConnections.map((connection) => (
                    <option key={connection.id} value={connection.id}>
                      {connection.connectionName} / {connection.media.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="templateName">Template name</label>
                <input
                  className="input"
                  id="templateName"
                  name="templateName"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="canvaTemplateId">Canva template ID</label>
                <input
                  className="input"
                  id="canvaTemplateId"
                  name="canvaTemplateId"
                  defaultValue="mock-template"
                  required
                />
              </div>
              <div className="button-row">
                <select
                  className="select"
                  name="templateType"
                  defaultValue="WORDPRESS_FEATURED_IMAGE"
                >
                  <option value="WORDPRESS_FEATURED_IMAGE">WP featured</option>
                  <option value="X_POST_IMAGE">X image</option>
                </select>
                <input
                  className="input"
                  name="width"
                  type="number"
                  min="1"
                  defaultValue="1200"
                  aria-label="width"
                />
                <input
                  className="input"
                  name="height"
                  type="number"
                  min="1"
                  defaultValue="630"
                  aria-label="height"
                />
              </div>
              <input
                type="hidden"
                name="autofillFields"
                value='{"title":"TITLE","subtitle":"SUBTITLE","siteName":"SITE_NAME"}'
              />
              <input type="hidden" name="requiredFields" value='["title"]' />
              <button
                className="button"
                type="submit"
                disabled={media.length === 0}
              >
                Add template
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Generate mock image</h2>
            <form action={generateMockAsset} className="form">
              <div className="field">
                <label htmlFor="asset-media">Media</label>
                <select
                  className="select"
                  id="asset-media"
                  name="mediaId"
                  defaultValue={defaultMedia?.id}
                  required
                >
                  {media.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="asset-template">Template</label>
                <select
                  className="select"
                  id="asset-template"
                  name="canvaBrandTemplateId"
                  defaultValue={canvaTemplates[0]?.id ?? ""}
                >
                  <option value="">Auto select</option>
                  {canvaTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.templateName} / {template.media.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="asset-title">Title</label>
                <input
                  className="input"
                  id="asset-title"
                  name="title"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="asset-subtitle">Subtitle</label>
                <input className="input" id="asset-subtitle" name="subtitle" />
              </div>
              <div className="field">
                <label htmlFor="assetType">Asset type</label>
                <select
                  className="select"
                  id="assetType"
                  name="assetType"
                  defaultValue="FEATURED_IMAGE"
                >
                  <option value="FEATURED_IMAGE">WP featured</option>
                  <option value="X_POST_IMAGE">X image</option>
                </select>
              </div>
              <button
                className="button"
                type="submit"
                disabled={media.length === 0}
              >
                Generate SVG
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Affiliate network</h2>
            <form action={createAffiliateNetwork} className="form">
              <div className="field">
                <label htmlFor="affiliate-network-name">Name</label>
                <input
                  className="input"
                  id="affiliate-network-name"
                  name="name"
                  placeholder="A8.net"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="affiliate-network-slug">Slug</label>
                <input
                  className="input"
                  id="affiliate-network-slug"
                  name="slug"
                  placeholder="a8-net"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="affiliate-network-url">Website URL</label>
                <input
                  className="input"
                  id="affiliate-network-url"
                  name="websiteUrl"
                  type="url"
                />
              </div>
              <button className="button" type="submit">
                Save network
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Affiliate program</h2>
            <form action={createAffiliateProgram} className="form">
              <div className="field">
                <label htmlFor="program-network">Network</label>
                <select
                  className="select"
                  id="program-network"
                  name="affiliateNetworkId"
                  defaultValue={affiliateNetworks[0]?.id}
                  required
                >
                  {affiliateNetworks.map((network) => (
                    <option key={network.id} value={network.id}>
                      {network.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="program-name">Program name</label>
                <input
                  className="input"
                  id="program-name"
                  name="programName"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="advertiser-name">Advertiser</label>
                <input
                  className="input"
                  id="advertiser-name"
                  name="advertiserName"
                />
              </div>
              <div className="button-row">
                <select
                  className="select"
                  name="rewardType"
                  defaultValue="FIXED"
                >
                  <option value="FIXED">Fixed</option>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="LEAD">Lead</option>
                  <option value="SUBSCRIPTION">Subscription</option>
                </select>
                <input
                  className="input"
                  name="rewardAmount"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Reward JPY"
                />
              </div>
              <div className="button-row">
                <select
                  className="select"
                  name="riskLevel"
                  defaultValue="MEDIUM"
                >
                  <option value="LOW">Low risk</option>
                  <option value="MEDIUM">Medium risk</option>
                  <option value="HIGH">High risk</option>
                  <option value="CRITICAL">Critical risk</option>
                </select>
                <select
                  className="select"
                  name="status"
                  defaultValue="APPROVED"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="APPROVED">Approved</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PAUSED">Paused</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="complianceNotes">Compliance notes</label>
                <textarea
                  className="textarea"
                  id="complianceNotes"
                  name="complianceNotes"
                  placeholder="Do not post direct affiliate links to X."
                />
              </div>
              <button
                className="button"
                type="submit"
                disabled={affiliateNetworks.length === 0}
              >
                Save program
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Media program link</h2>
            <form action={attachProgramToMedia} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="affiliate-media"
              />
              <div className="field">
                <label htmlFor="affiliate-program-media">Program</label>
                <select
                  className="select"
                  id="affiliate-program-media"
                  name="affiliateProgramId"
                  defaultValue={affiliatePrograms[0]?.id}
                  required
                >
                  {affiliatePrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.programName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="button-row">
                <select
                  className="select"
                  name="applicationStatus"
                  defaultValue="APPROVED"
                >
                  <option value="NOT_APPLIED">Not applied</option>
                  <option value="APPLYING">Applying</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="PAUSED">Paused</option>
                </select>
                <input
                  className="input"
                  type="number"
                  min="1"
                  max="100"
                  name="priority"
                  defaultValue="50"
                  aria-label="priority"
                />
              </div>
              <button
                className="button"
                type="submit"
                disabled={media.length === 0 || affiliatePrograms.length === 0}
              >
                Attach
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Affiliate link</h2>
            <form action={createAffiliateLink} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="affiliate-link-media"
              />
              <div className="field">
                <label htmlFor="affiliate-link-program">Program</label>
                <select
                  className="select"
                  id="affiliate-link-program"
                  name="affiliateProgramId"
                  defaultValue={affiliatePrograms[0]?.id}
                  required
                >
                  {affiliatePrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.programName}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className="input"
                name="name"
                placeholder="Main CTA link"
                required
              />
              <input
                className="input"
                name="destinationUrl"
                type="url"
                placeholder="Advertiser landing page"
                required
              />
              <input
                className="input"
                name="affiliateUrl"
                type="url"
                placeholder="Affiliate URL for WordPress only"
                required
              />
              <input
                className="input"
                name="trackingId"
                placeholder="tracking id"
              />
              <button
                className="button"
                type="submit"
                disabled={affiliatePrograms.length === 0}
              >
                Save link
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Revenue event</h2>
            <form action={createRevenueEvent} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="revenue-media"
              />
              <select
                className="select"
                name="affiliateNetworkId"
                defaultValue={affiliateNetworks[0]?.id}
                required
              >
                {affiliateNetworks.map((network) => (
                  <option key={network.id} value={network.id}>
                    {network.name}
                  </option>
                ))}
              </select>
              <select
                className="select"
                name="affiliateProgramId"
                defaultValue={affiliatePrograms[0]?.id}
              >
                <option value="">No program</option>
                {affiliatePrograms.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.programName}
                  </option>
                ))}
              </select>
              <select
                className="select"
                name="affiliateLinkId"
                defaultValue={affiliateLinks[0]?.id}
              >
                <option value="">No link</option>
                {affiliateLinks.map((link) => (
                  <option key={link.id} value={link.id}>
                    {link.name}
                  </option>
                ))}
              </select>
              <div className="button-row">
                <input
                  className="input"
                  name="eventDate"
                  type="date"
                  required
                />
                <select className="select" name="status" defaultValue="PENDING">
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="ADJUSTED">Adjusted</option>
                </select>
              </div>
              <input
                className="input"
                name="reward"
                type="number"
                min="0"
                step="1"
                placeholder="Reward JPY"
                required
              />
              <input
                className="input"
                name="orderId"
                placeholder="Order ID is hashed before save"
              />
              <button
                className="button"
                type="submit"
                disabled={affiliateNetworks.length === 0}
              >
                Save revenue
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Revenue CSV import</h2>
            <form action={importRevenueCsv} className="form">
              <input
                className="input"
                name="fileName"
                defaultValue="manual-paste.csv"
              />
              <textarea
                className="textarea"
                name="csvText"
                placeholder="event_date,network_slug,program_name,media_name,status,reward,currency,order_id&#10;2026-07-01,a8-net,Program,Media,approved,1000,JPY,order-1"
                required
              />
              <button className="button" type="submit">
                Import CSV
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Growth Score</h2>
            <form action={calculateMediaGrowthScore} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="growth-score-media"
              />
              <input
                className="input"
                type="number"
                min="7"
                max="365"
                name="periodDays"
                defaultValue="30"
              />
              <button
                className="button"
                type="submit"
                disabled={media.length === 0}
              >
                Calculate
              </button>
            </form>
            <form action={createGrowthStrategyBoardReport} className="form">
              <button className="button secondary" type="submit">
                Create Strategy Board report
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>Google mock connection</h2>
            <form action={connectGoogleMock} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="google-connect"
              />
              <input
                className="input"
                name="connectionName"
                placeholder="Google Analytics/Search Console Mock"
                required
              />
              <input
                className="input"
                name="googleAccountEmail"
                type="email"
                placeholder="mock-google@growth-lab.local"
              />
              <button
                className="button"
                type="submit"
                disabled={media.length === 0}
              >
                Connect mock
              </button>
            </form>
            <form action={startGoogleOAuth} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="google-oauth"
              />
              <button
                className="button secondary"
                type="submit"
                disabled={media.length === 0}
              >
                Start Google OAuth
              </button>
            </form>
            {defaultGoogleConnection && (
              <div className="button-row">
                <form action={refreshGoogleConnectionStatus}>
                  <input
                    type="hidden"
                    name="googleConnectionId"
                    value={defaultGoogleConnection.id}
                  />
                  <button className="button secondary" type="submit">
                    Refresh token
                  </button>
                </form>
                <form action={disconnectGoogleConnection}>
                  <input
                    type="hidden"
                    name="googleConnectionId"
                    value={defaultGoogleConnection.id}
                  />
                  <button className="button secondary" type="submit">
                    Disconnect
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="panel">
            <h2>GA4 property</h2>
            <form action={createGA4Property} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="ga4-property-media"
              />
              <select
                className="select"
                name="googleConnectionId"
                defaultValue={defaultGoogleConnection?.id}
                required
              >
                {googleConnections.map((connection) => (
                  <option key={connection.id} value={connection.id}>
                    {connection.media.name} / {connection.connectionName}
                  </option>
                ))}
              </select>
              <input
                className="input"
                name="propertyName"
                placeholder="Growth Lab GA4"
                required
              />
              <input
                className="input"
                name="propertyId"
                placeholder="properties/123456789"
                required
              />
              <input
                className="input"
                name="defaultUrl"
                type="url"
                placeholder={
                  defaultMedia?.wordpressUrl ?? "https://example.com"
                }
              />
              <button
                className="button"
                type="submit"
                disabled={media.length === 0 || googleConnections.length === 0}
              >
                Save GA4 property
              </button>
            </form>
            {defaultGA4Property && (
              <form action={testGA4PropertyConnection} className="form">
                <input
                  type="hidden"
                  name="ga4PropertyId"
                  value={defaultGA4Property.id}
                />
                <button className="button secondary" type="submit">
                  Test GA4 property
                </button>
              </form>
            )}
          </div>

          <div className="panel">
            <h2>Search Console property</h2>
            <form action={createSearchConsoleProperty} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="gsc-property-media"
              />
              <select
                className="select"
                name="googleConnectionId"
                defaultValue={defaultGoogleConnection?.id}
                required
              >
                {googleConnections.map((connection) => (
                  <option key={connection.id} value={connection.id}>
                    {connection.media.name} / {connection.connectionName}
                  </option>
                ))}
              </select>
              <input
                className="input"
                name="siteUrl"
                type="url"
                placeholder={
                  defaultMedia?.wordpressUrl ?? "https://example.com"
                }
                required
              />
              <select
                className="select"
                name="propertyType"
                defaultValue="URL_PREFIX"
              >
                <option value="URL_PREFIX">URL prefix</option>
                <option value="DOMAIN">Domain</option>
              </select>
              <button
                className="button"
                type="submit"
                disabled={media.length === 0 || googleConnections.length === 0}
              >
                Save GSC property
              </button>
            </form>
            {defaultSearchConsoleProperty && (
              <form
                action={testSearchConsolePropertyConnection}
                className="form"
              >
                <input
                  type="hidden"
                  name="searchConsolePropertyId"
                  value={defaultSearchConsoleProperty.id}
                />
                <button className="button secondary" type="submit">
                  Test Search Console property
                </button>
              </form>
            )}
          </div>

          <div className="panel">
            <h2>Google sync job</h2>
            <form action={createGoogleSyncJob} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="google-sync-media"
              />
              <select
                className="select"
                name="googleConnectionId"
                defaultValue={defaultGoogleConnection?.id}
              >
                <option value="">No connection</option>
                {googleConnections.map((connection) => (
                  <option key={connection.id} value={connection.id}>
                    {connection.media.name} / {connection.connectionName}
                  </option>
                ))}
              </select>
              <input
                className="input"
                name="jobName"
                placeholder="GA4 page daily sync"
                required
              />
              <select
                className="select"
                name="jobType"
                defaultValue="GA4_PAGE_DAILY"
              >
                <option value="GA4_SITE_DAILY">GA4 site daily</option>
                <option value="GA4_PAGE_DAILY">GA4 page daily</option>
                <option value="GSC_QUERY_DAILY">GSC query daily</option>
                <option value="GSC_PAGE_DAILY">GSC page daily</option>
                <option value="GSC_QUERY_PAGE_DAILY">
                  GSC query-page daily
                </option>
              </select>
              <select
                className="select"
                name="targetPropertyId"
                defaultValue={
                  defaultGA4Property?.id ?? defaultSearchConsoleProperty?.id
                }
                required
              >
                {ga4Properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    GA4 / {property.media.name} / {property.propertyName}
                  </option>
                ))}
                {searchConsoleProperties.map((property) => (
                  <option key={property.id} value={property.id}>
                    GSC / {property.media.name} / {property.siteUrl}
                  </option>
                ))}
              </select>
              <div className="button-row">
                <input
                  className="input"
                  name="defaultDays"
                  type="number"
                  min="1"
                  max="365"
                  defaultValue="28"
                />
                <input
                  className="input"
                  name="maxDays"
                  type="number"
                  min="1"
                  max="365"
                  defaultValue="90"
                />
              </div>
              <button
                className="button"
                type="submit"
                disabled={media.length === 0}
              >
                Create sync job
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>SEO imports</h2>
            <form action={importGA4Csv} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="ga4-import-media"
              />
              <select
                className="select"
                name="ga4PropertyId"
                defaultValue={defaultGA4Property?.id}
                required
              >
                {ga4Properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.media.name} / {property.propertyName}
                  </option>
                ))}
              </select>
              <textarea
                className="textarea"
                name="csvText"
                rows={5}
                placeholder="date,page_path,page_title,sessions,users,views,conversions,affiliate_clicks"
                required
              />
              <button
                className="button"
                type="submit"
                disabled={media.length === 0 || ga4Properties.length === 0}
              >
                Import GA4 CSV
              </button>
            </form>
            <form action={importSearchConsoleCsv} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="gsc-import-media"
              />
              <select
                className="select"
                name="searchConsolePropertyId"
                defaultValue={defaultSearchConsoleProperty?.id}
                required
              >
                {searchConsoleProperties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.media.name} / {property.siteUrl}
                  </option>
                ))}
              </select>
              <textarea
                className="textarea"
                name="csvText"
                rows={5}
                placeholder="date,query,page,clicks,impressions,ctr,position,country,device,search_type"
                required
              />
              <button
                className="button"
                type="submit"
                disabled={
                  media.length === 0 || searchConsoleProperties.length === 0
                }
              >
                Import GSC CSV
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>SEO analysis</h2>
            <form action={runSeoAnalysis} className="form">
              <SharedMediaSelect
                media={media}
                defaultMediaId={defaultMedia?.id}
                prefix="seo-analysis-media"
              />
              <input
                className="input"
                name="periodDays"
                type="number"
                min="7"
                max="180"
                defaultValue="28"
              />
              <button
                className="button"
                type="submit"
                disabled={media.length === 0}
              >
                Run analysis
              </button>
            </form>
          </div>
        </aside>

        <div className="tabs">
          <section className="panel">
            <h2>投稿ワークフロー</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>状態</th>
                    <th>投稿</th>
                    <th>メディア / アカウント</th>
                    <th>予定・公開</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>{statusBadge(post.status)}</td>
                      <td>
                        <strong>{post.title}</strong>
                        <p className="muted">{post.body}</p>
                        <small>
                          リンク: {statusBadge(post.linkCheckStatus)}{" "}
                          {post.linkCheckReason}
                        </small>
                      </td>
                      <td>
                        {post.media.name}
                        <br />
                        <span className="muted">
                          {post.socialAccount.handle}
                        </span>
                      </td>
                      <td>
                        予約: {formatDate(post.scheduledAt)}
                        <br />
                        公開: {formatDate(post.publishedAt)}
                      </td>
                      <td>
                        <div className="button-row">
                          {(post.status === PostStatus.DRAFT ||
                            post.status === PostStatus.REJECTED) && (
                            <form action={submitDraftForApproval}>
                              <input
                                type="hidden"
                                name="postId"
                                value={post.id}
                              />
                              <button className="button" type="submit">
                                承認待ちへ
                              </button>
                            </form>
                          )}
                          <form action={recheckPostLinks}>
                            <input
                              type="hidden"
                              name="postId"
                              value={post.id}
                            />
                            <button className="button secondary" type="submit">
                              再チェック
                            </button>
                          </form>
                          {post.status === PostStatus.PENDING_APPROVAL && (
                            <>
                              <form action={approvePost}>
                                <input
                                  type="hidden"
                                  name="postId"
                                  value={post.id}
                                />
                                <button className="button" type="submit">
                                  承認
                                </button>
                              </form>
                              <form action={rejectPost}>
                                <input
                                  type="hidden"
                                  name="postId"
                                  value={post.id}
                                />
                                <button className="button danger" type="submit">
                                  却下
                                </button>
                              </form>
                            </>
                          )}
                        </div>
                        {post.status === PostStatus.APPROVED && (
                          <form action={schedulePost} className="form">
                            <input
                              type="hidden"
                              name="postId"
                              value={post.id}
                            />
                            <input
                              className="input"
                              type="datetime-local"
                              name="scheduledAt"
                            />
                            <button className="button secondary" type="submit">
                              予約
                            </button>
                          </form>
                        )}
                        {post.failureReason && (
                          <small className="muted">{post.failureReason}</small>
                        )}
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={5}>投稿はまだありません。</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2>SNSアカウント管理</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>状態</th>
                    <th>アカウント</th>
                    <th>メディア</th>
                    <th>API制限</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td>{statusBadge(account.status)}</td>
                      <td>
                        <strong>{account.displayName}</strong>
                        <br />
                        <span className="muted">
                          {account.handle} / 自動投稿{" "}
                          {account.autoPostingEnabled ? "ON" : "OFF"}
                        </span>
                      </td>
                      <td>{account.media.name}</td>
                      <td>
                        日次 {account.dailyLimit} / {account.windowMinutes}分{" "}
                        {account.windowLimit}
                        <br />
                        <small>
                          {account.apiStopReason ??
                            account.lastError ??
                            "公式APIのみ使用"}
                        </small>
                      </td>
                      <td>
                        {account.status === "RATE_LIMITED" && (
                          <form action={resetRateLimit}>
                            <input
                              type="hidden"
                              name="socialAccountId"
                              value={account.id}
                            />
                            <button className="button warning" type="submit">
                              制限解除
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2>WordPress Sites</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>状態</th>
                    <th>サイト</th>
                    <th>API</th>
                    <th>認証</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {wordpressSites.map((site) => (
                    <tr key={site.id}>
                      <td>{statusBadge(site.connectionStatus)}</td>
                      <td>
                        <strong>{site.siteName}</strong>
                        <br />
                        <span className="muted">{site.media.name}</span>
                        <br />
                        <a href={site.siteUrl} target="_blank" rel="noreferrer">
                          {site.siteUrl}
                        </a>
                        {!site.siteUrl.startsWith("https://") && (
                          <small className="badge warn">HTTP警告</small>
                        )}
                      </td>
                      <td>
                        {site.apiBaseUrl}
                        <br />
                        <small>
                          Mock: {site.mockMode ? "ON" : "OFF"} / default:{" "}
                          {site.defaultStatus}
                        </small>
                      </td>
                      <td>
                        {site.username}
                        <br />
                        <small>{site.applicationPasswordMasked}</small>
                        {site.lastError && (
                          <small className="muted">{site.lastError}</small>
                        )}
                      </td>
                      <td>
                        <div className="button-row">
                          <form action={testWordPressConnection}>
                            <input
                              type="hidden"
                              name="wordpressSiteId"
                              value={site.id}
                            />
                            <button className="button" type="submit">
                              接続テスト
                            </button>
                          </form>
                          <form action={syncWordPressTerms}>
                            <input
                              type="hidden"
                              name="wordpressSiteId"
                              value={site.id}
                            />
                            <input
                              type="hidden"
                              name="kind"
                              value="categories"
                            />
                            <button className="button secondary" type="submit">
                              カテゴリ同期
                            </button>
                          </form>
                          <form action={syncWordPressTerms}>
                            <input
                              type="hidden"
                              name="wordpressSiteId"
                              value={site.id}
                            />
                            <input type="hidden" name="kind" value="tags" />
                            <button className="button secondary" type="submit">
                              タグ同期
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {wordpressSites.length === 0 && (
                    <tr>
                      <td colSpan={5}>WordPressサイトはまだありません。</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2>WordPress Posts</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>状態</th>
                    <th>記事</th>
                    <th>SEO</th>
                    <th>WordPress</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {wordpressPosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        {statusBadge(post.localStatus)}
                        <br />
                        {statusBadge(post.duplicateCheckStatus)}
                      </td>
                      <td>
                        <strong>{post.title}</strong>
                        <br />
                        <span className="muted">
                          {post.media.name} / {post.wordpressSite.siteName}
                        </span>
                        <br />
                        <small>slug: {post.slug}</small>
                      </td>
                      <td>
                        {post.seoTitle ?? "-"}
                        <br />
                        <small>{post.focusKeyword ?? "-"}</small>
                      </td>
                      <td>
                        ID: {post.wordpressPostId ?? "-"}
                        <br />
                        {post.wordpressPostUrl ? (
                          <a
                            href={post.wordpressPostUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {post.wordpressPostUrl}
                          </a>
                        ) : (
                          "-"
                        )}
                        <br />
                        <small>
                          {post.lastError ??
                            `同期: ${formatDate(post.lastSyncedAt)}`}
                        </small>
                      </td>
                      <td>
                        <div className="button-row">
                          <form action={approveWordPressPost}>
                            <input
                              type="hidden"
                              name="wordpressPostId"
                              value={post.id}
                            />
                            <button className="button" type="submit">
                              同期許可
                            </button>
                          </form>
                          <form action={checkWordPressSlug}>
                            <input
                              type="hidden"
                              name="wordpressPostId"
                              value={post.id}
                            />
                            <button className="button secondary" type="submit">
                              slug確認
                            </button>
                          </form>
                          <form action={syncWordPressDraft}>
                            <input
                              type="hidden"
                              name="wordpressPostId"
                              value={post.id}
                            />
                            <button className="button secondary" type="submit">
                              draft同期
                            </button>
                          </form>
                          {post.wordpressPostUrl && (
                            <form action={createXPostFromWordPressPost}>
                              <input
                                type="hidden"
                                name="wordpressPostId"
                                value={post.id}
                              />
                              <select
                                className="select"
                                name="socialAccountId"
                                defaultValue={
                                  accounts.find(
                                    (account) =>
                                      account.mediaId === post.mediaId,
                                  )?.id
                                }
                                required
                              >
                                {accounts
                                  .filter(
                                    (account) =>
                                      account.mediaId === post.mediaId,
                                  )
                                  .map((account) => (
                                    <option key={account.id} value={account.id}>
                                      {account.handle}
                                    </option>
                                  ))}
                              </select>
                              <button className="button" type="submit">
                                X投稿案
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {wordpressPosts.length === 0 && (
                    <tr>
                      <td colSpan={5}>WordPress記事はまだありません。</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2>Creative Assets</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Asset</th>
                    <th>Status</th>
                    <th>Usage</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creativeAssets.map((asset) => {
                    const wpPost = wordpressPosts.find(
                      (post) => post.mediaId === asset.mediaId,
                    );
                    const xPost = posts.find(
                      (post) => post.mediaId === asset.mediaId,
                    );
                    const usable =
                      asset.approvalStatus === "APPROVED" &&
                      asset.riskCheckStatus === "SAFE";
                    return (
                      <tr key={asset.id}>
                        <td>
                          {asset.publicUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className="thumb"
                              src={asset.publicUrl}
                              alt={asset.altText ?? asset.title}
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          <strong>{asset.title}</strong>
                          <br />
                          <span className="muted">{asset.media.name}</span>
                          <br />
                          <small>
                            {asset.assetType} / {asset.source} / AI:{" "}
                            {asset.madeWithAi ? "yes" : "no"}
                          </small>
                          <br />
                          {asset.publicUrl ? (
                            <a
                              href={asset.publicUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {asset.publicUrl}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {statusBadge(asset.approvalStatus)}
                          <br />
                          {statusBadge(asset.riskCheckStatus)}
                          <br />
                          <small>{asset.riskCheckReason ?? "-"}</small>
                        </td>
                        <td>
                          WP media: {asset.wordpressMediaId ?? "-"}
                          <br />
                          <small>
                            {asset.width ?? "-"} x {asset.height ?? "-"}
                          </small>
                        </td>
                        <td>
                          <div className="button-row">
                            <form action={runAssetRiskCheck}>
                              <input
                                type="hidden"
                                name="creativeAssetId"
                                value={asset.id}
                              />
                              <button
                                className="button secondary"
                                type="submit"
                              >
                                Risk check
                              </button>
                            </form>
                            {asset.riskCheckStatus === "SAFE" &&
                              asset.approvalStatus !== "APPROVED" && (
                                <form action={approveCreativeAsset}>
                                  <input
                                    type="hidden"
                                    name="creativeAssetId"
                                    value={asset.id}
                                  />
                                  <button className="button" type="submit">
                                    Approve
                                  </button>
                                </form>
                              )}
                            {asset.approvalStatus !== "REJECTED" && (
                              <form action={rejectCreativeAsset}>
                                <input
                                  type="hidden"
                                  name="creativeAssetId"
                                  value={asset.id}
                                />
                                <button className="button danger" type="submit">
                                  Reject
                                </button>
                              </form>
                            )}
                          </div>
                          {usable && (
                            <div className="button-row">
                              {wpPost && (
                                <form action={setWordPressFeaturedAsset}>
                                  <input
                                    type="hidden"
                                    name="creativeAssetId"
                                    value={asset.id}
                                  />
                                  <select
                                    className="select"
                                    name="wordpressPostId"
                                    defaultValue={wpPost.id}
                                  >
                                    {wordpressPosts
                                      .filter(
                                        (post) =>
                                          post.mediaId === asset.mediaId,
                                      )
                                      .map((post) => (
                                        <option key={post.id} value={post.id}>
                                          {post.title}
                                        </option>
                                      ))}
                                  </select>
                                  <button
                                    className="button secondary"
                                    type="submit"
                                  >
                                    Set WP image
                                  </button>
                                </form>
                              )}
                              {xPost && (
                                <form action={setXPostAsset}>
                                  <input
                                    type="hidden"
                                    name="creativeAssetId"
                                    value={asset.id}
                                  />
                                  <select
                                    className="select"
                                    name="postId"
                                    defaultValue={xPost.id}
                                  >
                                    {posts
                                      .filter(
                                        (post) =>
                                          post.mediaId === asset.mediaId,
                                      )
                                      .map((post) => (
                                        <option key={post.id} value={post.id}>
                                          {post.title}
                                        </option>
                                      ))}
                                  </select>
                                  <button
                                    className="button secondary"
                                    type="submit"
                                  >
                                    Set X image
                                  </button>
                                </form>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {creativeAssets.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        Creative assets are not generated yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <LogTable
            title="Canva Sync Logs"
            rows={canvaLogs.map((log) => [
              formatDate(log.createdAt),
              log.canvaConnection?.connectionName ?? "-",
              log.action,
              log.method,
              log.statusCode ?? "-",
              log.success ? "success" : "failed",
              log.errorMessage ?? (log.mockMode ? "mock" : "-"),
            ])}
          />

          <section className="panel">
            <h2>Affiliate Programs</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Program</th>
                    <th>Reward / Risk</th>
                    <th>Media Links</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliatePrograms.map((program) => (
                    <tr key={program.id}>
                      <td>{statusBadge(program.status)}</td>
                      <td>
                        <strong>{program.programName}</strong>
                        <br />
                        <span className="muted">
                          {program.affiliateNetwork.name} /{" "}
                          {program.advertiserName ?? "-"}
                        </span>
                        <br />
                        <small>
                          {program.complianceNotes ??
                            "WordPress placement only"}
                        </small>
                      </td>
                      <td>
                        {program.rewardAmount
                          ? formatCurrency(String(program.rewardAmount))
                          : program.rewardRate
                            ? `${program.rewardRate}%`
                            : "-"}
                        <br />
                        {statusBadge(program.riskLevel)}
                      </td>
                      <td>
                        {programMediaSites
                          .filter(
                            (item) => item.affiliateProgramId === program.id,
                          )
                          .map(
                            (item) =>
                              `${item.media.name}: ${item.applicationStatus}`,
                          )
                          .join(" / ") || "-"}
                      </td>
                    </tr>
                  ))}
                  {affiliatePrograms.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        Affiliate programs are not registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2>Affiliate Links & Placements</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Link</th>
                    <th>Program / Media</th>
                    <th>Placements</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliateLinks.map((link) => (
                    <tr key={link.id}>
                      <td>{statusBadge(link.status)}</td>
                      <td>
                        <strong>{link.name}</strong>
                        <br />
                        <span className="muted">{link.affiliateUrlMasked}</span>
                        <br />
                        <small>tracking: {link.trackingId ?? "-"}</small>
                      </td>
                      <td>
                        {link.affiliateProgram.programName}
                        <br />
                        <span className="muted">{link.media.name}</span>
                      </td>
                      <td>
                        {affiliatePlacements
                          .filter(
                            (placement) =>
                              placement.affiliateLinkId === link.id,
                          )
                          .map(
                            (placement) =>
                              `${placement.wordpressPost?.title ?? "site"} / ${placement.position}`,
                          )
                          .join(" / ") || "-"}
                        <form
                          action={createAffiliatePlacement}
                          className="button-row"
                        >
                          <input
                            type="hidden"
                            name="affiliateLinkId"
                            value={link.id}
                          />
                          <select
                            className="select"
                            name="wordpressPostId"
                            defaultValue=""
                          >
                            <option value="">No WP post</option>
                            {wordpressPosts
                              .filter((post) => post.mediaId === link.mediaId)
                              .map((post) => (
                                <option key={post.id} value={post.id}>
                                  {post.title}
                                </option>
                              ))}
                          </select>
                          <select
                            className="select"
                            name="placementType"
                            defaultValue="ARTICLE_TEXT"
                          >
                            <option value="ARTICLE_TEXT">Text</option>
                            <option value="BUTTON">Button</option>
                            <option value="CTA_BOX">CTA</option>
                            <option value="COMPARISON_TABLE">Table</option>
                          </select>
                          <select
                            className="select"
                            name="position"
                            defaultValue="MIDDLE"
                          >
                            <option value="INTRO">Intro</option>
                            <option value="MIDDLE">Middle</option>
                            <option value="CONCLUSION">Conclusion</option>
                          </select>
                          <button className="button secondary" type="submit">
                            Add placement
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {affiliateLinks.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        Affiliate links are not registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2>Revenue Events</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Date / Source</th>
                    <th>Media / Program</th>
                    <th>Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{statusBadge(event.status)}</td>
                      <td>
                        {formatDate(event.eventDate)}
                        <br />
                        <span className="muted">
                          {event.source} / {event.dataConfidence}
                        </span>
                      </td>
                      <td>
                        {event.media.name}
                        <br />
                        <span className="muted">
                          {event.affiliateNetwork.name} /{" "}
                          {event.affiliateProgram?.programName ?? "-"}
                        </span>
                      </td>
                      <td>
                        estimated{" "}
                        {formatCurrency(String(event.estimatedReward))}
                        <br />
                        pending {formatCurrency(String(event.pendingReward))} /
                        approved {formatCurrency(String(event.approvedReward))}
                      </td>
                    </tr>
                  ))}
                  {revenueEvents.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        Revenue events are not registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2>Growth Score & Strategy Board</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Score</th>
                    <th>Media</th>
                    <th>Recommendation</th>
                    <th>Confidence / Warnings</th>
                  </tr>
                </thead>
                <tbody>
                  {growthSnapshots.map((snapshot) => (
                    <tr key={snapshot.id}>
                      <td>
                        <strong>{snapshot.totalScore}</strong> / 100
                      </td>
                      <td>
                        {snapshot.media.name}
                        <br />
                        <span className="muted">
                          {formatDate(snapshot.periodStart)} -{" "}
                          {formatDate(snapshot.periodEnd)}
                        </span>
                      </td>
                      <td>{statusBadge(snapshot.recommendation)}</td>
                      <td>
                        {statusBadge(snapshot.dataConfidence)}
                        <br />
                        <small>
                          {Array.isArray(snapshot.dataWarnings)
                            ? snapshot.dataWarnings.join(" / ")
                            : "-"}
                        </small>
                      </td>
                    </tr>
                  ))}
                  {growthSnapshots.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        Growth Score snapshots are not calculated yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <h3>Recommendations</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {growthRecommendations.map((recommendation) => (
                    <tr key={recommendation.id}>
                      <td>{statusBadge(recommendation.type)}</td>
                      <td>
                        <strong>{recommendation.title}</strong>
                        <br />
                        <span className="muted">
                          {recommendation.media.name}
                        </span>
                      </td>
                      <td>{recommendation.description}</td>
                      <td>
                        {recommendation.riskNotes ?? "Human review required"}
                      </td>
                    </tr>
                  ))}
                  {growthRecommendations.length === 0 && (
                    <tr>
                      <td>Recommendations are not created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <h3>Strategy Board Reports</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {gsbReports.map((report) => (
                    <tr key={report.id}>
                      <td>{formatDate(report.createdAt)}</td>
                      <td>
                        approved{" "}
                        {formatCurrency(String(report.totalApprovedRevenue))}
                      </td>
                      <td>cost {formatCurrency(String(report.totalCost))}</td>
                      <td>
                        profit {formatCurrency(String(report.totalProfit))}
                      </td>
                    </tr>
                  ))}
                  {gsbReports.length === 0 && (
                    <tr>
                      <td>Strategy Board reports are not created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2>Google Data</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Media</th>
                    <th>Name / URL</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {googleConnections.map((connection) => (
                    <tr key={connection.id}>
                      <td>Connection</td>
                      <td>{connection.media.name}</td>
                      <td>
                        <strong>{connection.connectionName}</strong>
                        <br />
                        <span className="muted">
                          {connection.googleAccountEmail ?? "mock account"}
                        </span>
                        <br />
                        <small>
                          refresh token{" "}
                          {connection.refreshTokenAvailable
                            ? "available"
                            : "missing"}{" "}
                          / expires {formatDate(connection.tokenExpiresAt)}
                        </small>
                      </td>
                      <td>{statusBadge(connection.connectionStatus)}</td>
                    </tr>
                  ))}
                  {ga4Properties.map((property) => (
                    <tr key={property.id}>
                      <td>GA4</td>
                      <td>{property.media.name}</td>
                      <td>
                        <strong>{property.propertyName}</strong>
                        <br />
                        <span className="muted">
                          {property.propertyId} / {property.defaultUrl ?? "-"}
                        </span>
                      </td>
                      <td>{statusBadge(property.connectionStatus)}</td>
                    </tr>
                  ))}
                  {searchConsoleProperties.map((property) => (
                    <tr key={property.id}>
                      <td>Search Console</td>
                      <td>{property.media.name}</td>
                      <td>
                        <strong>{property.siteUrl}</strong>
                        <br />
                        <span className="muted">{property.propertyType}</span>
                      </td>
                      <td>{statusBadge(property.connectionStatus)}</td>
                    </tr>
                  ))}
                  {googleConnections.length +
                    ga4Properties.length +
                    searchConsoleProperties.length ===
                    0 && (
                    <tr>
                      <td colSpan={4}>
                        Google data connections are not registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <h3>Sync Jobs</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {googleSyncJobs.map((job) => (
                    <tr key={job.id}>
                      <td>{statusBadge(job.status)}</td>
                      <td>
                        <strong>{job.jobName}</strong>
                        <br />
                        <span className="muted">
                          {job.media.name} / {job.jobType} / {job.syncSource}
                        </span>
                      </td>
                      <td>
                        days {job.defaultDays} / max {job.maxDays}
                        <br />
                        <small>
                          last {formatDate(job.lastRunAt)} / next{" "}
                          {formatDate(job.nextRunAt)}
                        </small>
                      </td>
                      <td>
                        <div className="button-row">
                          <form action={runGoogleSyncJobAction}>
                            <input
                              type="hidden"
                              name="googleSyncJobId"
                              value={job.id}
                            />
                            <button className="button secondary" type="submit">
                              Run
                            </button>
                          </form>
                          <form
                            action={
                              job.status === "PAUSED"
                                ? resumeGoogleSyncJob
                                : pauseGoogleSyncJob
                            }
                          >
                            <input
                              type="hidden"
                              name="googleSyncJobId"
                              value={job.id}
                            />
                            <button className="button secondary" type="submit">
                              {job.status === "PAUSED" ? "Resume" : "Pause"}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {googleSyncJobs.length === 0 && (
                    <tr>
                      <td>Google sync jobs are not registered yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <h3>Sync Runs</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {googleSyncRuns.map((run) => (
                    <tr key={run.id}>
                      <td>{statusBadge(run.status)}</td>
                      <td>
                        {run.googleSyncJob?.jobName ?? "-"}
                        <br />
                        <span className="muted">
                          {run.media.name} / {run.runType}
                        </span>
                      </td>
                      <td>
                        {formatDate(run.periodStart)} -{" "}
                        {formatDate(run.periodEnd)}
                        <br />
                        <small>
                          saved {run.savedRows} / failed {run.failedRows} /
                          calls {run.apiCalls}
                        </small>
                      </td>
                      <td>{run.errorSummary ?? "-"}</td>
                    </tr>
                  ))}
                  {googleSyncRuns.length === 0 && (
                    <tr>
                      <td>Google sync runs are not recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <h3>API Quota / Errors</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {googleApiQuotaLogs.map((log) => (
                    <tr key={log.id}>
                      <td>Quota</td>
                      <td>{formatDate(log.createdAt)}</td>
                      <td>
                        {log.apiName} / {log.quotaCategory}
                      </td>
                      <td>{log.endpoint}</td>
                      <td>
                        tokens {log.tokensConsumed} / remaining{" "}
                        {log.quotaRemaining ?? "-"}
                      </td>
                    </tr>
                  ))}
                  {googleApiErrorLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{statusBadge("ERROR")}</td>
                      <td>{formatDate(log.createdAt)}</td>
                      <td>
                        {log.apiName} / {log.actionRequired}
                      </td>
                      <td>{log.endpoint}</td>
                      <td>{log.errorMessage}</td>
                    </tr>
                  ))}
                  {googleApiQuotaLogs.length + googleApiErrorLogs.length ===
                    0 && (
                    <tr>
                      <td>
                        Google API quota and error logs are not recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <h3>Latest page metrics</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {ga4PageMetrics.map((metric) => (
                    <tr key={metric.id}>
                      <td>GA4</td>
                      <td>{formatDate(metric.date)}</td>
                      <td>{metric.media.name}</td>
                      <td>
                        <strong>{metric.pageTitle ?? metric.pagePath}</strong>
                        <br />
                        <span className="muted">
                          sessions {metric.sessions} / views {metric.views} / cv{" "}
                          {metric.conversions}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {searchConsoleQueryPages.map((metric) => (
                    <tr key={metric.id}>
                      <td>GSC</td>
                      <td>{formatDate(metric.date)}</td>
                      <td>{metric.media.name}</td>
                      <td>
                        <strong>{metric.query}</strong>
                        <br />
                        <span className="muted">
                          clicks {metric.clicks} / impressions{" "}
                          {metric.impressions} / position{" "}
                          {metric.position.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {ga4PageMetrics.length + searchConsoleQueryPages.length ===
                    0 && (
                    <tr>
                      <td>GA4/GSC metrics are not imported yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <h2>SEO Analysis</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Score</th>
                    <th>Media / Period</th>
                    <th>Traffic</th>
                    <th>Opportunities</th>
                  </tr>
                </thead>
                <tbody>
                  {seoSnapshots.map((snapshot) => (
                    <tr key={snapshot.id}>
                      <td>
                        <strong>
                          {Math.max(0, 100 - snapshot.opportunityCount * 8)}
                        </strong>{" "}
                        / 100
                      </td>
                      <td>
                        {snapshot.media.name}
                        <br />
                        <span className="muted">
                          {formatDate(snapshot.periodStart)} -{" "}
                          {formatDate(snapshot.periodEnd)}
                        </span>
                      </td>
                      <td>
                        clicks {snapshot.totalClicks} / impressions{" "}
                        {snapshot.totalImpressions}
                        <br />
                        <span className="muted">
                          organic sessions {snapshot.organicSessions}
                        </span>
                      </td>
                      <td>
                        ctr {Number(snapshot.averageCtr).toFixed(3)} / pos{" "}
                        {Number(snapshot.averagePosition).toFixed(1)}
                        <br />
                        <small>{snapshot.summary ?? "-"}</small>
                      </td>
                    </tr>
                  ))}
                  {seoSnapshots.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        SEO analysis snapshots are not calculated yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <h3>Opportunities</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {seoOpportunities.map((opportunity) => (
                    <tr key={opportunity.id}>
                      <td>{statusBadge(opportunity.priority)}</td>
                      <td>
                        <strong>{opportunity.title}</strong>
                        <br />
                        <span className="muted">
                          {opportunity.media.name} /{" "}
                          {opportunity.seoKeyword?.keyword ?? "-"}
                        </span>
                      </td>
                      <td>{opportunity.description}</td>
                      <td>{statusBadge(opportunity.status)}</td>
                    </tr>
                  ))}
                  {seoOpportunities.length === 0 && (
                    <tr>
                      <td>SEO opportunities are not created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <h3>Recommendations</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {seoRecommendations.map((recommendation) => (
                    <tr key={recommendation.id}>
                      <td>{statusBadge(recommendation.approvalStatus)}</td>
                      <td>
                        <strong>{recommendation.title}</strong>
                        <br />
                        <span className="muted">
                          {recommendation.media.name} /{" "}
                          {recommendation.recommendationType}
                        </span>
                      </td>
                      <td>
                        {recommendation.afterSuggestion ??
                          recommendation.description}
                        <br />
                        <small>
                          {recommendation.reason ??
                            "Human review required before content changes."}
                        </small>
                      </td>
                      <td>
                        <form
                          action={updateSeoRecommendationStatus}
                          className="button-row"
                        >
                          <input
                            type="hidden"
                            name="seoRecommendationId"
                            value={recommendation.id}
                          />
                          <button
                            className="button secondary"
                            name="approvalStatus"
                            value="APPROVED"
                            type="submit"
                          >
                            Approve
                          </button>
                          <button
                            className="button secondary"
                            name="approvalStatus"
                            value="REJECTED"
                            type="submit"
                          >
                            Reject
                          </button>
                          <button
                            className="button secondary"
                            name="approvalStatus"
                            value="DONE"
                            type="submit"
                          >
                            Done
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {seoRecommendations.length === 0 && (
                    <tr>
                      <td>SEO recommendations are not created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <LogTable
            title="SEO Import Batches"
            rows={seoImportBatches.map((batch) => [
              formatDate(batch.createdAt),
              batch.media.name,
              batch.importType,
              statusBadge(batch.status),
              `success ${batch.successRows}`,
              `failed ${batch.failedRows}`,
              batch.errorSummary ?? "-",
            ])}
          />

          <LogTable
            title="Revenue CSV Import Batches"
            rows={importBatches.map((batch) => [
              formatDate(batch.createdAt),
              batch.fileName,
              statusBadge(batch.status),
              `success ${batch.successRows}`,
              `failed ${batch.failedRows}`,
              `warnings ${batch.warningRows}`,
              batch.errorSummary ?? "-",
            ])}
          />

          <LogTable
            title="WordPress Sync Logs"
            rows={wordpressLogs.map((log) => [
              formatDate(log.createdAt),
              log.wordpressSite.siteName,
              log.wordpressPost?.title ?? "-",
              log.action,
              log.method,
              log.statusCode ?? "-",
              log.success ? "success" : "failed",
              log.errorMessage ?? (log.mockMode ? "mock" : "-"),
            ])}
          />

          <LogTable
            title="API使用量ログ"
            rows={logs.map((log) => [
              formatDate(log.createdAt),
              statusBadge(log.eventType),
              log.socialAccount?.handle ?? "WordPress",
              log.endpoint,
              log.message ?? "-",
            ])}
          />
          <LogTable
            title="リンクチェック履歴"
            rows={linkChecks.map((check) => [
              formatDate(check.checkedAt),
              statusBadge(check.status),
              check.url,
              check.reason ?? "-",
            ])}
          />

          <section className="panel">
            <h2>Article Improvement</h2>
            <div className="grid stats">
              <div className="stat-card">
                <span className="muted">Open / high priority</span>
                <strong>
                  {openImprovementTaskCount} /{" "}
                  {highPriorityImprovementTaskCount}
                </strong>
                <small>article improvement tasks</small>
              </div>
              <div className="stat-card">
                <span className="muted">Pending / stale approvals</span>
                <strong>
                  {pendingRewriteApprovalCount} / {staleRewriteApprovalCount}
                </strong>
                <small>rewrite drafts</small>
              </div>
              <div className="stat-card">
                <span className="muted">WP draft updates</span>
                <strong>
                  {wordpressDraftUpdateCount} / {blockedWordPressUpdateCount}
                </strong>
                <small>mock updated / blocked</small>
              </div>
              <div className="stat-card">
                <span className="muted">Measuring / done</span>
                <strong>
                  {measuringImprovementTaskCount} /{" "}
                  {completedImprovementTaskCount}
                </strong>
                <small>insufficient {insufficientImpactMeasurementCount}</small>
              </div>
            </div>
            <div className="grid two">
              <form action={createManualImprovementTask} className="form">
                <h3>Manual Task</h3>
                <SharedMediaSelect
                  media={media}
                  defaultMediaId={defaultMedia?.id}
                  prefix="improvement"
                />
                <div className="field">
                  <label htmlFor="improvement-wp-post">WordPress post</label>
                  <select
                    className="select"
                    id="improvement-wp-post"
                    name="wordpressPostId"
                    defaultValue={wordpressPosts[0]?.id}
                  >
                    {wordpressPosts.map((post) => (
                      <option key={post.id} value={post.id}>
                        {post.title} / {post.media.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  className="input"
                  name="taskTitle"
                  placeholder="Task title"
                  required
                />
                <select
                  className="select"
                  name="taskType"
                  defaultValue="REWRITE_TITLE"
                >
                  <option value="REWRITE_TITLE">Rewrite title</option>
                  <option value="REWRITE_META_DESCRIPTION">
                    Rewrite meta description
                  </option>
                  <option value="ADD_H2_SECTION">Add H2 section</option>
                  <option value="ADD_FAQ_SECTION">Add FAQ</option>
                  <option value="IMPROVE_CTA">Improve CTA</option>
                  <option value="COMPREHENSIVE_REWRITE">
                    Comprehensive rewrite
                  </option>
                </select>
                <select
                  className="select"
                  name="priority"
                  defaultValue="MEDIUM"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                  <option value="MONITOR">Monitor</option>
                </select>
                <input
                  className="input"
                  name="targetKeyword"
                  placeholder="Target keyword"
                />
                <textarea
                  className="textarea"
                  name="reason"
                  placeholder="Reason"
                  required
                />
                <input
                  className="input"
                  name="expectedImpact"
                  placeholder="Expected impact"
                />
                <button className="button" type="submit">
                  Create improvement task
                </button>
              </form>
              <div className="notice">
                <h3>Source Shortcuts</h3>
                <div className="button-row">
                  {seoRecommendations[0] && (
                    <form action={createImprovementTaskFromSeoRecommendation}>
                      <input
                        type="hidden"
                        name="seoRecommendationId"
                        value={seoRecommendations[0].id}
                      />
                      <button className="button secondary" type="submit">
                        From SEO recommendation
                      </button>
                    </form>
                  )}
                  {alertIncidents[0] && (
                    <form action={createImprovementTaskFromAlert}>
                      <input
                        type="hidden"
                        name="alertIncidentId"
                        value={alertIncidents[0].id}
                      />
                      <button className="button secondary" type="submit">
                        From alert
                      </button>
                    </form>
                  )}
                  {growthRecommendations[0] && (
                    <form
                      action={createImprovementTaskFromGrowthRecommendation}
                    >
                      <input
                        type="hidden"
                        name="growthRecommendationId"
                        value={growthRecommendations[0].id}
                      />
                      <button className="button secondary" type="submit">
                        From Growth recommendation
                      </button>
                    </form>
                  )}
                </div>
                <p className="muted">
                  WordPress published posts are never directly updated. Phase 8
                  creates reviewable drafts and mock draft update records by
                  default.
                </p>
              </div>
            </div>

            <h3>Improvement Tasks</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {articleImprovementTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{statusBadge(task.priority)}</td>
                      <td>{statusBadge(task.status)}</td>
                      <td>
                        <strong>{task.taskTitle}</strong>
                        <br />
                        <span className="muted">
                          {task.media.name} /{" "}
                          {task.wordpressPost?.title ?? "no post linked"}
                        </span>
                      </td>
                      <td>{task.reason}</td>
                      <td>
                        <div className="button-row">
                          <form action={createRewriteDraftAction}>
                            <input
                              type="hidden"
                              name="articleImprovementTaskId"
                              value={task.id}
                            />
                            <button className="button secondary" type="submit">
                              Draft
                            </button>
                          </form>
                          <form action={createSeoImpactMeasurementAction}>
                            <input
                              type="hidden"
                              name="articleImprovementTaskId"
                              value={task.id}
                            />
                            <button className="button secondary" type="submit">
                              Measure
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {articleImprovementTasks.length === 0 && (
                    <tr>
                      <td>No article improvement tasks yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <h3>Rewrite Drafts</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {rewriteDrafts.map((draft) => (
                    <tr key={draft.id}>
                      <td>{statusBadge(draft.draftStatus)}</td>
                      <td>
                        <strong>{draft.draftTitle}</strong>
                        <br />
                        <span className="muted">
                          v{draft.version} approved{" "}
                          {draft.approvedVersion ?? "-"}
                        </span>
                      </td>
                      <td>{draft.summary ?? "-"}</td>
                      <td>
                        <div className="button-row">
                          <form action={createContentChangeSetAction}>
                            <input
                              type="hidden"
                              name="rewriteDraftId"
                              value={draft.id}
                            />
                            <button className="button secondary" type="submit">
                              Diff
                            </button>
                          </form>
                          <form action={requestRewriteApprovalAction}>
                            <input
                              type="hidden"
                              name="rewriteDraftId"
                              value={draft.id}
                            />
                            <button className="button secondary" type="submit">
                              Request approval
                            </button>
                          </form>
                          <form action={decideRewriteApprovalAction}>
                            <input
                              type="hidden"
                              name="rewriteDraftId"
                              value={draft.id}
                            />
                            <button
                              className="button secondary"
                              name="decision"
                              value="APPROVED"
                              type="submit"
                            >
                              Approve
                            </button>
                          </form>
                          <form action={decideRewriteApprovalAction}>
                            <input
                              type="hidden"
                              name="rewriteDraftId"
                              value={draft.id}
                            />
                            <button
                              className="button secondary"
                              name="decision"
                              value="CHANGES_REQUESTED"
                              type="submit"
                            >
                              Changes
                            </button>
                          </form>
                          <form action={applyRewriteToWordPressDraftAction}>
                            <input
                              type="hidden"
                              name="rewriteDraftId"
                              value={draft.id}
                            />
                            <input
                              type="hidden"
                              name="updateMode"
                              value="CREATE_NEW_DRAFT"
                            />
                            <button className="button secondary" type="submit">
                              Mock WP draft
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rewriteDrafts.length === 0 && (
                    <tr>
                      <td>No rewrite drafts yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <h3>Before / After Changes</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {contentChangeSets.map((change) => (
                    <tr key={change.id}>
                      <td>{statusBadge(change.status)}</td>
                      <td>
                        {change.targetField}
                        <br />
                        <span className="muted">v{change.version}</span>
                      </td>
                      <td>{change.diffSummary}</td>
                      <td>
                        <small>
                          Before: {(change.beforeValue ?? "-").slice(0, 120)}
                        </small>
                        <br />
                        <small>
                          After: {(change.afterValue ?? "-").slice(0, 120)}
                        </small>
                      </td>
                      <td>
                        <div className="button-row">
                          <form action={updateContentChangeSetStatus}>
                            <input
                              type="hidden"
                              name="contentChangeSetId"
                              value={change.id}
                            />
                            <button
                              className="button secondary"
                              name="status"
                              value="ACCEPTED"
                              type="submit"
                            >
                              Accept
                            </button>
                          </form>
                          <form action={updateContentChangeSetStatus}>
                            <input
                              type="hidden"
                              name="contentChangeSetId"
                              value={change.id}
                            />
                            <button
                              className="button secondary"
                              name="status"
                              value="REJECTED"
                              type="submit"
                            >
                              Reject
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {contentChangeSets.length === 0 && (
                    <tr>
                      <td>No content change sets yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <LogTable
              title="Rewrite Risk Checks"
              rows={rewriteRiskChecks.map((risk) => [
                formatDate(risk.checkedAt),
                statusBadge(risk.status),
                risk.rewriteDraft.draftTitle,
                risk.maxRiskLevel,
                `critical ${risk.criticalCount} / high ${risk.highCount}`,
              ])}
            />
            <LogTable
              title="WordPress Rewrite Safety Checks"
              rows={wordpressSafetyChecks.map((check) => [
                formatDate(check.checkedAt),
                statusBadge(check.status),
                check.rewriteDraft.draftTitle,
                check.updateMode,
                check.reason ?? "-",
              ])}
            />
            <LogTable
              title="WordPress Draft Updates"
              rows={wordpressDraftUpdates.map((update) => [
                formatDate(update.createdAt),
                statusBadge(update.status),
                update.rewriteDraft.draftTitle,
                update.mockMode ? "mock" : "real",
                update.responseSummary ?? update.errorMessage ?? "-",
              ])}
            />
            <LogTable
              title="SEO Impact Measurements"
              rows={seoImpactMeasurements.map((measurement) => [
                formatDate(measurement.measuredAt),
                statusBadge(measurement.status),
                measurement.media.name,
                measurement.verdict,
                `clicks ${measurement.beforeClicks} -> ${measurement.afterClicks}`,
                measurement.summary ?? "-",
              ])}
            />
            <LogTable
              title="Improvement Execution Logs"
              rows={improvementExecutionLogs.map((log) => [
                formatDate(log.createdAt),
                log.eventType,
                log.articleImprovementTask?.taskTitle ?? "-",
                log.message,
              ])}
            />
          </section>

          <section className="panel">
            <h2>SNS API / Posting</h2>
            <div className="grid stats">
              <div className="stat-card">
                <span className="muted">API connections</span>
                <strong>
                  {socialMockConnectionCount} / {socialApiConnectionCount}
                </strong>
                <small>mock / total</small>
              </div>
              <div className="stat-card">
                <span className="muted">Ready queues</span>
                <strong>{socialReadyQueueCount}</strong>
                <small>ready or scheduled</small>
              </div>
              <div className="stat-card">
                <span className="muted">Posted queues</span>
                <strong>{socialPostedQueueCount}</strong>
                <small>mock posted by default</small>
              </div>
              <div className="stat-card">
                <span className="muted">Manual review</span>
                <strong>{socialManualReviewCount}</strong>
                <small>unknown or blocked</small>
              </div>
              <div className="stat-card">
                <span className="muted">Blocked checks</span>
                <strong>{socialBlockedSafetyCount}</strong>
                <small>safety gate blocks</small>
              </div>
              <div className="stat-card">
                <span className="muted">Performance</span>
                <strong>{socialPerformanceSnapshotCount}</strong>
                <small>snapshots</small>
              </div>
              <div className="stat-card">
                <span className="muted">Suggestions</span>
                <strong>{socialProposedSuggestionCount}</strong>
                <small>human-reviewed only</small>
              </div>
            </div>

            <div className="split">
              <form action={connectXMockAction} className="card-form">
                <h3>Connect X Mock API</h3>
                <SharedSelectors
                  media={media}
                  accounts={accounts}
                  defaultMediaId={media[0]?.id}
                  defaultAccountId={accounts[0]?.id}
                  prefix="social-api"
                />
                <button className="button" type="submit">
                  Connect mock
                </button>
              </form>
              <form action={enqueueSocialPostAction} className="card-form">
                <h3>Create SNS Queue</h3>
                <SharedSelectors
                  media={media}
                  accounts={accounts}
                  defaultMediaId={media[0]?.id}
                  defaultAccountId={accounts[0]?.id}
                  prefix="social-queue"
                />
                <div className="field">
                  <label htmlFor="social-text">Post text</label>
                  <textarea
                    id="social-text"
                    name="postText"
                    rows={4}
                    defaultValue="記事の要点をWordPressに整理しました。Xは集客用として使います。"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="social-link">WordPress URL</label>
                  <input
                    id="social-link"
                    name="linkUrl"
                    defaultValue={media[0]?.wordpressUrl ?? ""}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="social-scheduled">Scheduled at</label>
                  <input
                    id="social-scheduled"
                    name="scheduledAt"
                    type="datetime-local"
                  />
                </div>
                <button className="button" type="submit">
                  Queue post
                </button>
              </form>
            </div>

            <h3>SNS API Connections</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {socialApiConnections.map((connection) => (
                    <tr key={connection.id}>
                      <td>{statusBadge(connection.connectionStatus)}</td>
                      <td>
                        <strong>{connection.accountHandle}</strong>
                        <br />
                        <span className="muted">
                          {connection.media.name} / {connection.platform}
                        </span>
                      </td>
                      <td>
                        {connection.mockMode ? "mock" : "real"}
                        <br />
                        <span className="muted">
                          {formatDate(connection.lastConnectedAt)}
                        </span>
                      </td>
                      <td>{connection.lastError ?? "-"}</td>
                    </tr>
                  ))}
                  {socialApiConnections.length === 0 && (
                    <tr>
                      <td>No SNS API connections yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <h3>SNS Post Queue</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {socialPostQueues.map((queue) => (
                    <tr key={queue.id}>
                      <td>
                        {statusBadge(queue.queueStatus)}
                        <br />
                        {statusBadge(queue.approvalStatus)}
                      </td>
                      <td>
                        <strong>{queue.socialAccount.handle}</strong>
                        <br />
                        <span className="muted">
                          {queue.media.name} / {formatDate(queue.scheduledAt)}
                        </span>
                      </td>
                      <td>
                        {queue.postText}
                        <br />
                        <span className="muted">{queue.linkUrl ?? "-"}</span>
                      </td>
                      <td>
                        {statusBadge(queue.linkCheckStatus)}{" "}
                        {statusBadge(queue.riskCheckStatus)}{" "}
                        {statusBadge(queue.dedupCheckStatus)}
                      </td>
                      <td>
                        <div className="button-row">
                          <form action={approveSocialQueueAction}>
                            <input
                              type="hidden"
                              name="queueId"
                              value={queue.id}
                            />
                            <button className="button secondary" type="submit">
                              Approve
                            </button>
                          </form>
                          <form action={runSocialSafetyCheckAction}>
                            <input
                              type="hidden"
                              name="queueId"
                              value={queue.id}
                            />
                            <button className="button secondary" type="submit">
                              Safety
                            </button>
                          </form>
                          <form action={executeSocialQueueAction}>
                            <input
                              type="hidden"
                              name="queueId"
                              value={queue.id}
                            />
                            <button className="button secondary" type="submit">
                              Execute
                            </button>
                          </form>
                          <form action={createSocialPerformanceAction}>
                            <input
                              type="hidden"
                              name="queueId"
                              value={queue.id}
                            />
                            <button className="button secondary" type="submit">
                              Measure
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {socialPostQueues.length === 0 && (
                    <tr>
                      <td>No SNS post queues yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <LogTable
              title="SNS Executions"
              rows={socialPostExecutions.map((execution) => [
                formatDate(execution.createdAt),
                statusBadge(execution.status),
                execution.socialPostQueue?.postText.slice(0, 80) ?? "-",
                execution.responseSummary ?? execution.errorMessage ?? "-",
              ])}
            />
            <LogTable
              title="SNS Safety Checks"
              rows={socialSafetyChecks.map((check) => [
                formatDate(check.checkedAt),
                statusBadge(check.status),
                statusBadge(check.riskCheckStatus),
                Array.isArray(check.reasons) ? check.reasons.join(" / ") : "-",
              ])}
            />
            <LogTable
              title="SNS Rate Limits"
              rows={socialRateLimitLogs.map((log) => [
                formatDate(log.createdAt),
                statusBadge(log.status),
                log.endpoint,
                `${log.remaining ?? "-"} / ${log.limit ?? "-"}`,
                formatDate(log.resetAt),
              ])}
            />
            <LogTable
              title="SNS Performance"
              rows={socialPerformanceSnapshots.map((snapshot) => [
                formatDate(snapshot.snapshotDate),
                snapshot.media.name,
                `${snapshot.impressions} imp`,
                `${snapshot.engagements} engagements`,
                `${snapshot.urlClicks} clicks`,
                snapshot.source,
              ])}
            />
            <LogTable
              title="SNS Attribution"
              rows={socialPostAttributions.map((attribution) => [
                formatDate(attribution.date),
                attribution.media.name,
                `${attribution.sessions} sessions`,
                `${attribution.conversions} CV`,
                formatCurrency(attribution.approvedRevenue.toString()),
                attribution.source,
              ])}
            />
            <LogTable
              title="SNS Improvements and Scores"
              rows={[
                ...socialImprovementSuggestions.map((suggestion) => [
                  statusBadge(suggestion.status),
                  suggestion.media.name,
                  suggestion.title,
                  suggestion.description,
                ]),
                ...socialGrowthScoreSnapshots.map((score) => [
                  formatDate(score.createdAt),
                  score.media.name,
                  `score ${score.totalScore}`,
                  score.recommendation,
                ]),
              ]}
            />
            <LogTable
              title="SNS Manual Reviews"
              rows={socialManualReviews.map((review) => [
                formatDate(review.createdAt),
                statusBadge(review.status),
                review.socialPostQueue.media.name,
                review.reason,
                review.resolution ?? "-",
              ])}
            />
          </section>

          <section className="panel">
            <h2>Campaign Management</h2>
            <div className="grid stats">
              <div className="stat-card">
                <span className="muted">Active campaigns</span>
                <strong>{activeCampaignCount}</strong>
                <small>planning / active</small>
              </div>
              <div className="stat-card">
                <span className="muted">Approved revenue</span>
                <strong>{formatCurrency(campaignApprovedRevenueTotal)}</strong>
                <small>campaign attribution</small>
              </div>
              <div className="stat-card">
                <span className="muted">Pending revenue</span>
                <strong>{formatCurrency(campaignPendingRevenueTotal)}</strong>
                <small>shown separately</small>
              </div>
              <div className="stat-card">
                <span className="muted">Actual cost</span>
                <strong>{formatCurrency(campaignActualCostTotal)}</strong>
                <small>manual / mock / csv</small>
              </div>
              <div className="stat-card">
                <span className="muted">Approved ROI</span>
                <strong>{campaignRoiApprovedTotal.toFixed(2)}</strong>
                <small>aggregate view</small>
              </div>
              <div className="stat-card">
                <span className="muted">Risks / conflicts</span>
                <strong>
                  {openCampaignRiskCount} / {openCalendarConflictCount}
                </strong>
                <small>open</small>
              </div>
              <div className="stat-card">
                <span className="muted">Reports</span>
                <strong>
                  {reportReadyCount} / {reportDraftCount}
                </strong>
                <small>ready / draft</small>
              </div>
              <div className="stat-card">
                <span className="muted">Insights / priority</span>
                <strong>
                  {proposedBusinessInsightCount} /{" "}
                  {highPriorityCampaignRecommendationCount}
                </strong>
                <small>insights / recommendations</small>
              </div>
            </div>

            <div className="split">
              <form action={createCampaignAction} className="card-form">
                <h3>Create Campaign</h3>
                <SharedMediaSelect
                  media={media}
                  defaultMediaId={media[0]?.id}
                  prefix="campaign"
                />
                <div className="field">
                  <label htmlFor="campaign-name">Campaign name</label>
                  <input
                    id="campaign-name"
                    name="campaignName"
                    defaultValue="Growth Campaign"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="campaign-code">Campaign code</label>
                  <input
                    id="campaign-code"
                    name="campaignCode"
                    defaultValue={`campaign-${Date.now()}`}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="campaign-type">Type</label>
                  <select
                    className="select"
                    id="campaign-type"
                    name="campaignType"
                    defaultValue="MULTI_CHANNEL"
                  >
                    <option value="MULTI_CHANNEL">MULTI_CHANNEL</option>
                    <option value="SEO_GROWTH">SEO_GROWTH</option>
                    <option value="SNS_GROWTH">SNS_GROWTH</option>
                    <option value="AFFILIATE_REVENUE">AFFILIATE_REVENUE</option>
                    <option value="CONTENT_REFRESH">CONTENT_REFRESH</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="campaign-start">Period start</label>
                  <input id="campaign-start" name="periodStart" type="date" />
                </div>
                <div className="field">
                  <label htmlFor="campaign-end">Period end</label>
                  <input id="campaign-end" name="periodEnd" type="date" />
                </div>
                <div className="field">
                  <label htmlFor="campaign-goal">Primary goal</label>
                  <input
                    id="campaign-goal"
                    name="primaryGoal"
                    defaultValue="Improve approved revenue and ROI"
                  />
                </div>
                <button className="button" type="submit">
                  Create campaign
                </button>
              </form>
              <form action={attachCampaignItemAction} className="card-form">
                <h3>Attach Campaign Item</h3>
                <div className="field">
                  <label htmlFor="campaign-item-campaign">Campaign</label>
                  <select
                    className="select"
                    id="campaign-item-campaign"
                    name="campaignId"
                    defaultValue={campaigns[0]?.id}
                  >
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.campaignName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="campaign-item-type">Item type</label>
                  <select
                    className="select"
                    id="campaign-item-type"
                    name="itemType"
                    defaultValue="SOCIAL_POST_QUEUE"
                  >
                    <option value="WORDPRESS_POST">WORDPRESS_POST</option>
                    <option value="SOCIAL_POST_QUEUE">SOCIAL_POST_QUEUE</option>
                    <option value="CREATIVE_ASSET">CREATIVE_ASSET</option>
                    <option value="REVENUE_EVENT">REVENUE_EVENT</option>
                    <option value="ARTICLE_IMPROVEMENT_TASK">
                      ARTICLE_IMPROVEMENT_TASK
                    </option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="campaign-item-id">Item ID</label>
                  <input
                    id="campaign-item-id"
                    name="itemId"
                    defaultValue={
                      socialPostQueues[0]?.id ?? wordpressPosts[0]?.id ?? ""
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="campaign-item-title">Title</label>
                  <input
                    id="campaign-item-title"
                    name="itemTitle"
                    defaultValue="Manual campaign item"
                  />
                </div>
                <div className="field">
                  <label htmlFor="campaign-allocation">Allocation rate</label>
                  <input
                    id="campaign-allocation"
                    name="allocationRate"
                    type="number"
                    min="0.01"
                    max="1"
                    step="0.01"
                    defaultValue="1"
                  />
                </div>
                <button className="button" type="submit">
                  Attach item
                </button>
              </form>
            </div>

            <h3>Campaigns</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td>{statusBadge(campaign.status)}</td>
                      <td>
                        <strong>{campaign.campaignName}</strong>
                        <br />
                        <span className="muted">
                          {campaign.media.name} / {campaign.campaignCode}
                        </span>
                      </td>
                      <td>
                        {campaign.campaignType}
                        <br />
                        <span className="muted">
                          {formatDate(campaign.periodStart)} -{" "}
                          {formatDate(campaign.periodEnd)}
                        </span>
                      </td>
                      <td>{campaign.primaryGoal ?? "-"}</td>
                      <td>
                        <div className="button-row">
                          <form action={calculateCampaignRoiAction}>
                            <input
                              type="hidden"
                              name="campaignId"
                              value={campaign.id}
                            />
                            <button className="button secondary" type="submit">
                              ROI
                            </button>
                          </form>
                          <form action={calculateCampaignGrowthScoreAction}>
                            <input
                              type="hidden"
                              name="campaignId"
                              value={campaign.id}
                            />
                            <button className="button secondary" type="submit">
                              Score
                            </button>
                          </form>
                          <form action={detectCalendarConflictsAction}>
                            <input
                              type="hidden"
                              name="campaignId"
                              value={campaign.id}
                            />
                            <button className="button secondary" type="submit">
                              Conflicts
                            </button>
                          </form>
                          <form action={generateCampaignReportAction}>
                            <input
                              type="hidden"
                              name="campaignId"
                              value={campaign.id}
                            />
                            <button className="button secondary" type="submit">
                              Report
                            </button>
                          </form>
                          <form action={createBusinessInsightAction}>
                            <input
                              type="hidden"
                              name="campaignId"
                              value={campaign.id}
                            />
                            <button className="button secondary" type="submit">
                              Insight
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {campaigns.length === 0 && (
                    <tr>
                      <td>No campaigns yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <LogTable
              title="Campaign Items"
              rows={campaignItems.map((item) => [
                formatDate(item.createdAt),
                item.campaign.media.name,
                item.campaign.campaignName,
                item.itemType,
                item.itemTitle ?? item.itemId,
                `allocation ${item.allocationRate}`,
              ])}
            />
            <LogTable
              title="Campaign ROI"
              rows={campaignRoiSnapshots.map((snapshot) => [
                formatDate(snapshot.createdAt),
                snapshot.media.name,
                snapshot.campaign.campaignName,
                `approved ${formatCurrency(snapshot.approvedRevenue.toString())}`,
                `pending ${formatCurrency(snapshot.pendingRevenue.toString())}`,
                `roi ${snapshot.roiApproved.toFixed(2)}`,
                snapshot.dataConfidence,
              ])}
            />
            <LogTable
              title="Campaign Growth Scores"
              rows={campaignGrowthScores.map((score) => [
                formatDate(score.createdAt),
                score.media.name,
                score.campaign.campaignName,
                `score ${score.totalScore}`,
                score.dataConfidence,
                score.reasoning ?? "-",
              ])}
            />
            <LogTable
              title="Campaign Risks and Recommendations"
              rows={[
                ...campaignRisks.map((risk) => [
                  formatDate(risk.createdAt),
                  statusBadge(risk.status),
                  risk.campaign.media.name,
                  risk.title,
                  risk.description,
                ]),
                ...campaignRecommendations.map((recommendation) => [
                  formatDate(recommendation.createdAt),
                  statusBadge(recommendation.status),
                  recommendation.campaign.media.name,
                  recommendation.title,
                  recommendation.description,
                ]),
              ]}
            />
            <LogTable
              title="Content Calendar"
              rows={contentCalendarEvents.map((event) => [
                formatDate(event.scheduledAt),
                statusBadge(event.status),
                event.media.name,
                event.eventType,
                event.title,
                event.campaign?.campaignName ?? "-",
              ])}
            />
            <LogTable
              title="Calendar Conflicts"
              rows={contentCalendarConflicts.map((conflict) => [
                formatDate(conflict.detectedAt),
                statusBadge(conflict.status),
                conflict.conflictType,
                conflict.campaign?.campaignName ?? "-",
                conflict.description,
              ])}
            />
            <h3>Generated Reports</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {generatedReports.map((report) => (
                    <tr key={report.id}>
                      <td>{statusBadge(report.status)}</td>
                      <td>
                        <strong>{report.title}</strong>
                        <br />
                        <span className="muted">
                          {report.reportType} / {formatDate(report.createdAt)}
                        </span>
                      </td>
                      <td>{report.summary}</td>
                      <td>
                        <div className="button-row">
                          <form action={exportReportAction}>
                            <input
                              type="hidden"
                              name="reportId"
                              value={report.id}
                            />
                            <input
                              type="hidden"
                              name="format"
                              value="MARKDOWN"
                            />
                            <button className="button secondary" type="submit">
                              MD
                            </button>
                          </form>
                          <form action={exportReportAction}>
                            <input
                              type="hidden"
                              name="reportId"
                              value={report.id}
                            />
                            <input type="hidden" name="format" value="CSV" />
                            <button className="button secondary" type="submit">
                              CSV
                            </button>
                          </form>
                          <form action={exportReportAction}>
                            <input
                              type="hidden"
                              name="reportId"
                              value={report.id}
                            />
                            <input type="hidden" name="format" value="JSON" />
                            <button className="button secondary" type="submit">
                              JSON
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {generatedReports.length === 0 && (
                    <tr>
                      <td>No reports generated yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <LogTable
              title="Report Exports and Business Insights"
              rows={[
                ...reportExports.map((exported) => [
                  formatDate(exported.createdAt),
                  statusBadge(exported.status),
                  exported.exportFormat,
                  exported.filePath ?? "-",
                  exported.generatedReport.title,
                ]),
                ...businessInsights.map((insight) => [
                  formatDate(insight.createdAt),
                  statusBadge(insight.status),
                  insight.insightType,
                  insight.title,
                  insight.summary,
                ]),
              ]}
            />
          </section>

          <section className="panel">
            <h2>Operations</h2>
            <div className="grid stats">
              <div className="stat-card">
                <span className="muted">Scheduled tasks</span>
                <strong>
                  {enabledScheduledTaskCount} / {scheduledTaskCount}
                </strong>
                <small>enabled / total</small>
              </div>
              <div className="stat-card">
                <span className="muted">Failed runs</span>
                <strong>{failedScheduledTaskRunCount}</strong>
                <small>all recorded failures</small>
              </div>
              <div className="stat-card">
                <span className="muted">Freshness warnings</span>
                <strong>{staleFreshnessCount}</strong>
                <small>warning, critical, unknown</small>
              </div>
              <div className="stat-card">
                <span className="muted">Alerts / notifications</span>
                <strong>
                  {openAlertCount} / {unreadNotificationCount}
                </strong>
                <small>open / unread</small>
              </div>
              <div className="stat-card">
                <span className="muted">Health snapshots</span>
                <strong>{operationsHealthSnapshotCount}</strong>
                <small>local checks</small>
              </div>
            </div>
            <div className="button-row">
              <form action={runFreshnessCheckAction}>
                <button className="button secondary" type="submit">
                  Run freshness check
                </button>
              </form>
              <form action={runAlertDetectionAction}>
                <button className="button secondary" type="submit">
                  Run alert detection
                </button>
              </form>
              <form action={runOperationsHealthCheckAction}>
                <button className="button secondary" type="submit">
                  Run health check
                </button>
              </form>
            </div>
            <h3>Scheduled Tasks</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {scheduledTasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        {statusBadge(task.enabled ? task.status : "DISABLED")}
                      </td>
                      <td>
                        <strong>{task.taskName}</strong>
                        <br />
                        <span className="muted">
                          {task.taskType} / {task.dryRun ? "dry-run" : "active"}
                        </span>
                      </td>
                      <td>
                        {task.cronExpression}
                        <br />
                        <span className="muted">
                          next {formatDate(task.nextRunAt)}
                        </span>
                      </td>
                      <td>
                        <div className="button-row">
                          <form action={runScheduledTaskAction}>
                            <input
                              type="hidden"
                              name="scheduledTaskId"
                              value={task.id}
                            />
                            <button className="button secondary" type="submit">
                              Run
                            </button>
                          </form>
                          <form
                            action={
                              task.enabled
                                ? pauseScheduledTask
                                : resumeScheduledTask
                            }
                          >
                            <input
                              type="hidden"
                              name="scheduledTaskId"
                              value={task.id}
                            />
                            <button className="button secondary" type="submit">
                              {task.enabled ? "Pause" : "Resume"}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {scheduledTasks.length === 0 && (
                    <tr>
                      <td>Scheduled tasks are not seeded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <LogTable
              title="Operations Task Runs"
              rows={scheduledTaskRuns.map((run) => [
                formatDate(run.createdAt),
                statusBadge(run.status),
                run.scheduledTask?.taskName ?? "-",
                run.summary ?? run.errorMessage ?? "-",
              ])}
            />
            <LogTable
              title="Data Freshness"
              rows={dataFreshnessStatuses.map((freshness) => [
                statusBadge(freshness.status),
                freshness.media?.name ?? "Global",
                freshness.source,
                formatDate(freshness.lastDataAt),
                freshness.message ?? "-",
              ])}
            />
            <h3>Alerts</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {alertIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td>{statusBadge(incident.severity)}</td>
                      <td>{statusBadge(incident.status)}</td>
                      <td>
                        <strong>{incident.title}</strong>
                        <br />
                        <span className="muted">
                          {incident.media?.name ?? "Global"} /{" "}
                          {incident.alertRule.ruleName}
                        </span>
                      </td>
                      <td>{incident.message}</td>
                      <td>
                        <div className="button-row">
                          <form action={acknowledgeAlertIncident}>
                            <input
                              type="hidden"
                              name="alertIncidentId"
                              value={incident.id}
                            />
                            <button className="button secondary" type="submit">
                              Ack
                            </button>
                          </form>
                          <form action={resolveAlertIncident}>
                            <input
                              type="hidden"
                              name="alertIncidentId"
                              value={incident.id}
                            />
                            <button className="button secondary" type="submit">
                              Resolve
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {alertIncidents.length === 0 && (
                    <tr>
                      <td>Alerts are clear.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <h3>Notifications</h3>
            <div className="table-wrap">
              <table>
                <tbody>
                  {notificationEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{statusBadge(event.priority)}</td>
                      <td>{statusBadge(event.status)}</td>
                      <td>
                        <strong>{event.title}</strong>
                        <br />
                        <span className="muted">
                          {event.type} / {formatDate(event.createdAt)}
                        </span>
                      </td>
                      <td>{event.message}</td>
                      <td>
                        <div className="button-row">
                          <form action={markNotificationRead}>
                            <input
                              type="hidden"
                              name="notificationEventId"
                              value={event.id}
                            />
                            <button className="button secondary" type="submit">
                              Read
                            </button>
                          </form>
                          <form action={dismissNotification}>
                            <input
                              type="hidden"
                              name="notificationEventId"
                              value={event.id}
                            />
                            <button className="button secondary" type="submit">
                              Dismiss
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {notificationEvents.length === 0 && (
                    <tr>
                      <td>Notifications are empty.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <LogTable
              title="Operations Health and Reports"
              rows={[
                ...operationsHealthSnapshots.map((snapshot) => [
                  formatDate(snapshot.checkedAt),
                  statusBadge(snapshot.status),
                  snapshot.summary ?? "-",
                ]),
                ...weeklyOperationsReports.map((report) => [
                  formatDate(report.createdAt),
                  statusBadge(report.status),
                  report.summary,
                ]),
              ]}
            />
            <LogTable
              title="Notification Deliveries"
              rows={notificationDeliveries.map((delivery) => [
                formatDate(delivery.createdAt),
                delivery.notificationChannel.name,
                statusBadge(delivery.status),
                delivery.notificationEvent.title,
              ])}
            />
            <LogTable
              title="Operation Settings"
              rows={operationSettings.map((setting) => [
                setting.key,
                setting.isSecret ? "********" : setting.value,
              ])}
            />
          </section>

          <section className="panel">
            <h2>Settings</h2>
            <div className="table-wrap">
              <table>
                <tbody>
                  {Object.entries(settings).map(([key, value]) => (
                    <tr key={key}>
                      <th>{key}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function SharedSelectors({
  media,
  accounts,
  defaultMediaId,
  defaultAccountId,
  prefix = "post",
}: {
  media: Array<{ id: string; name: string }>;
  accounts: Array<{ id: string; handle: string; media: { name: string } }>;
  defaultMediaId?: string;
  defaultAccountId?: string;
  prefix?: string;
}) {
  return (
    <>
      <div className="field">
        <label htmlFor={`${prefix}-media`}>メディア</label>
        <select
          className="select"
          id={`${prefix}-media`}
          name="mediaId"
          defaultValue={defaultMediaId}
          required
        >
          {media.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${prefix}-account`}>Xアカウント</label>
        <select
          className="select"
          id={`${prefix}-account`}
          name="socialAccountId"
          defaultValue={defaultAccountId}
          required
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.handle} / {account.media.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function SharedMediaSelect({
  media,
  defaultMediaId,
  prefix,
}: {
  media: Array<{ id: string; name: string }>;
  defaultMediaId?: string;
  prefix: string;
}) {
  return (
    <div className="field">
      <label htmlFor={`${prefix}-media`}>Media</label>
      <select
        className="select"
        id={`${prefix}-media`}
        name="mediaId"
        defaultValue={defaultMediaId}
        required
      >
        {media.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function WordPressSiteSelect({
  sites,
  prefix = "wp",
}: {
  sites: Array<{ id: string; siteName: string; media: { name: string } }>;
  prefix?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={`${prefix}-site`}>WordPressサイト</label>
      <select
        className="select"
        id={`${prefix}-site`}
        name="wordpressSiteId"
        defaultValue={sites[0]?.id}
        required
      >
        {sites.map((site) => (
          <option key={site.id} value={site.id}>
            {site.siteName} / {site.media.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function LogTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="table-wrap">
        <table>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td>履歴はまだありません。</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
