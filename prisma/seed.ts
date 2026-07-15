import {
  ApiEventType,
  ArticleImprovementPriority,
  ArticleImprovementStatus,
  ArticleImprovementTaskType,
  ArticleRevisionSnapshotType,
  AffiliateApplicationStatus,
  AffiliateProgramStatus,
  AffiliateRewardType,
  AffiliateRiskLevel,
  AssetApprovalStatus,
  CanvaConnectionStatus,
  CanvaTemplateType,
  CreativeAssetSource,
  CreativeAssetType,
  DataConfidence,
  GoogleConnectionStatus,
  GoogleApiActionRequired,
  GoogleApiName,
  GooglePropertyStatus,
  GoogleQuotaCategory,
  GoogleSyncJobStatus,
  GoogleSyncJobType,
  GoogleSyncRunStatus,
  GoogleSyncRunType,
  GoogleSyncSource,
  GrowthRecommendationType,
  ImprovementExecutionEventType,
  ImprovementSourceType,
  LinkCheckStatus,
  NotificationChannelStatus,
  NotificationChannelType,
  OperationSettingValueType,
  OperatingCostCategory,
  Platform,
  PostStatus,
  PrismaClient,
  RequestType,
  RevenueSource,
  RevenueStatus,
  SearchConsolePropertyType,
  SearchDevice,
  SearchType,
  SeoApprovalStatus,
  SeoDataSource,
  SeoImportSource,
  SeoImportStatus,
  SeoImportType,
  SeoKeywordIntent,
  SeoKeywordStatus,
  SeoOpportunityStatus,
  SeoOpportunityType,
  SeoPageKeywordRole,
  SeoPriority,
  SeoRecommendationType,
  ScheduledTaskStatus,
  ScheduledTaskType,
  SeoImpactStatus,
  SeoImpactVerdict,
  SocialApiConnectionStatus,
  SocialImprovementSuggestionStatus,
  SocialImprovementSuggestionType,
  SocialManualReviewStatus,
  SocialMediaUploadStatus,
  SocialPerformanceSource,
  SocialPostApprovalStatus,
  SocialPostCheckStatus,
  SocialPostExecutionStatus,
  SocialPostQueueStatus,
  SocialPostSourceType,
  SocialRateLimitStatus,
  RewriteDraftStatus,
  RewriteMode,
  RewriteRiskCheckStatus,
  RewriteRiskLevel,
  RewriteSuggestionStatus,
  RewriteSuggestionType,
  RewriteTargetField,
  ContentChangeStatus,
  ContentChangeType,
  AttributionSourceType,
  BusinessInsightStatus,
  BusinessInsightType,
  CalendarConflictStatus,
  CalendarConflictType,
  CalendarEventStatus,
  CalendarEventType,
  CampaignBudgetType,
  CampaignCostSource,
  CampaignItemStatus,
  CampaignItemType,
  CampaignObjectiveStatus,
  CampaignObjectiveType,
  CampaignRecommendationStatus,
  CampaignRecommendationType,
  CampaignRiskSeverity,
  CampaignRiskStatus,
  CampaignRiskType,
  CampaignStatus,
  CampaignTargetType,
  CampaignType,
  GeneratedReportStatus,
  ReportExportFormat,
  ReportExportStatus,
  ReportPeriod,
  ReportType,
  WordPressDraftUpdateStatus,
  WordPressRewriteSafetyStatus,
  WordPressRewriteUpdateMode,
  WordPressConnectionStatus,
  WordPressLocalStatus,
} from "@prisma/client";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { hashIdentifier } from "../src/lib/affiliate/hash";

const prisma = new PrismaClient();

const defaultSettings = {
  AUTO_POSTING_ENABLED: process.env.AUTO_POSTING_ENABLED ?? "true",
  DEFAULT_POST_TIMES: process.env.DEFAULT_POST_TIMES ?? "08:00,12:30,20:00",
  API_MONTHLY_LIMIT: process.env.API_MONTHLY_LIMIT ?? "10000",
  API_WARNING_THRESHOLD: process.env.API_WARNING_THRESHOLD ?? "0.8",
  BLOCK_AFFILIATE_DIRECT_LINKS:
    process.env.BLOCK_AFFILIATE_DIRECT_LINKS ?? "true",
  ALLOWED_LINK_DOMAINS:
    process.env.ALLOWED_LINK_DOMAINS ??
    "example.com,note.com,blogspot.com,instagram.com,pinterest.com,youtube.com",
  BLOCKED_LINK_DOMAINS:
    process.env.BLOCKED_LINK_DOMAINS ??
    "px.a8.net,a8.net,afi-b.com,t.afi-b.com,accesstrade.net,valuecommerce.com,ck.jp.ap.valuecommerce.com,bit.ly,tinyurl.com,x.gd,is.gd,00m.in",
  WORDPRESS_MOCK_MODE: process.env.WORDPRESS_MOCK_MODE ?? "true",
  WORDPRESS_DEFAULT_STATUS: process.env.WORDPRESS_DEFAULT_STATUS ?? "draft",
  WORDPRESS_REQUEST_TIMEOUT_MS:
    process.env.WORDPRESS_REQUEST_TIMEOUT_MS ?? "15000",
  WORDPRESS_ALLOWED_STATUSES:
    process.env.WORDPRESS_ALLOWED_STATUSES ?? "draft,pending,private,publish",
  WORDPRESS_DEFAULT_AUTHOR: process.env.WORDPRESS_DEFAULT_AUTHOR ?? "",
  WORDPRESS_ALLOW_PUBLISH: process.env.WORDPRESS_ALLOW_PUBLISH ?? "false",
  WORDPRESS_REQUIRE_CONFIRM_FOR_PUBLISH:
    process.env.WORDPRESS_REQUIRE_CONFIRM_FOR_PUBLISH ?? "true",
  WORDPRESS_REQUIRE_CONFIRM_FOR_PUBLISHED_UPDATE:
    process.env.WORDPRESS_REQUIRE_CONFIRM_FOR_PUBLISHED_UPDATE ?? "true",
  WORDPRESS_AUTO_ADD_ALLOWED_DOMAIN:
    process.env.WORDPRESS_AUTO_ADD_ALLOWED_DOMAIN ?? "true",
  CANVA_MOCK_MODE: process.env.CANVA_MOCK_MODE ?? "true",
  CANVA_REQUEST_TIMEOUT_MS: process.env.CANVA_REQUEST_TIMEOUT_MS ?? "20000",
  CANVA_DEFAULT_EXPORT_FORMAT: process.env.CANVA_DEFAULT_EXPORT_FORMAT ?? "png",
  CANVA_USE_AUTOFILL: process.env.CANVA_USE_AUTOFILL ?? "true",
  IMAGE_STORAGE_MODE: process.env.IMAGE_STORAGE_MODE ?? "local",
  IMAGE_STORAGE_DIR:
    process.env.IMAGE_STORAGE_DIR ?? "./public/generated-images",
  IMAGE_PUBLIC_BASE_URL:
    process.env.IMAGE_PUBLIC_BASE_URL ?? "/generated-images",
  IMAGE_MOCK_MODE: process.env.IMAGE_MOCK_MODE ?? "true",
  IMAGE_MAX_FILE_SIZE_MB: process.env.IMAGE_MAX_FILE_SIZE_MB ?? "10",
  WORDPRESS_ENABLE_MEDIA_UPLOAD:
    process.env.WORDPRESS_ENABLE_MEDIA_UPLOAD ?? "false",
  WORDPRESS_MEDIA_MOCK_MODE: process.env.WORDPRESS_MEDIA_MOCK_MODE ?? "true",
  WORDPRESS_FEATURED_MEDIA_UPDATE_ENABLED:
    process.env.WORDPRESS_FEATURED_MEDIA_UPDATE_ENABLED ?? "false",
  X_MEDIA_UPLOAD_ENABLED: process.env.X_MEDIA_UPLOAD_ENABLED ?? "false",
  X_MEDIA_MOCK_MODE: process.env.X_MEDIA_MOCK_MODE ?? "true",
  X_MEDIA_MAX_FILE_SIZE_MB: process.env.X_MEDIA_MAX_FILE_SIZE_MB ?? "5",
  AFFILIATE_MOCK_MODE: process.env.AFFILIATE_MOCK_MODE ?? "true",
  AFFILIATE_CSV_IMPORT_ENABLED:
    process.env.AFFILIATE_CSV_IMPORT_ENABLED ?? "true",
  AFFILIATE_SCRAPING_ENABLED: process.env.AFFILIATE_SCRAPING_ENABLED ?? "false",
  AFFILIATE_DIRECT_X_LINK_BLOCK:
    process.env.AFFILIATE_DIRECT_X_LINK_BLOCK ?? "true",
  AFFILIATE_MASK_LINKS_IN_UI: process.env.AFFILIATE_MASK_LINKS_IN_UI ?? "true",
  GROWTH_SCORE_ENABLED: process.env.GROWTH_SCORE_ENABLED ?? "true",
  GROWTH_SCORE_DEFAULT_PERIOD_DAYS:
    process.env.GROWTH_SCORE_DEFAULT_PERIOD_DAYS ?? "30",
  GROWTH_SCORE_MIN_DATA_DAYS: process.env.GROWTH_SCORE_MIN_DATA_DAYS ?? "7",
  GROWTH_SCORE_REQUIRE_HUMAN_REVIEW:
    process.env.GROWTH_SCORE_REQUIRE_HUMAN_REVIEW ?? "true",
  REVENUE_DEFAULT_CURRENCY: process.env.REVENUE_DEFAULT_CURRENCY ?? "JPY",
  REVENUE_ESTIMATION_MODE: process.env.REVENUE_ESTIMATION_MODE ?? "manual",
  REVENUE_HASH_ORDER_IDS: process.env.REVENUE_HASH_ORDER_IDS ?? "true",
  GA4_MOCK_MODE: process.env.GA4_MOCK_MODE ?? "true",
  GA4_API_ENABLED: process.env.GA4_API_ENABLED ?? "false",
  GA4_CSV_IMPORT_ENABLED: process.env.GA4_CSV_IMPORT_ENABLED ?? "true",
  GA4_REQUEST_TIMEOUT_MS: process.env.GA4_REQUEST_TIMEOUT_MS ?? "20000",
  GOOGLE_SEARCH_CONSOLE_MOCK_MODE:
    process.env.GOOGLE_SEARCH_CONSOLE_MOCK_MODE ?? "true",
  GOOGLE_SEARCH_CONSOLE_API_ENABLED:
    process.env.GOOGLE_SEARCH_CONSOLE_API_ENABLED ?? "false",
  GOOGLE_SEARCH_CONSOLE_CSV_IMPORT_ENABLED:
    process.env.GOOGLE_SEARCH_CONSOLE_CSV_IMPORT_ENABLED ?? "true",
  GOOGLE_SEARCH_CONSOLE_REQUEST_TIMEOUT_MS:
    process.env.GOOGLE_SEARCH_CONSOLE_REQUEST_TIMEOUT_MS ?? "20000",
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
  GOOGLE_OAUTH_REDIRECT_URI:
    process.env.GOOGLE_OAUTH_REDIRECT_URI ??
    "http://localhost:3000/api/google/oauth/callback",
  GOOGLE_TOKEN_ENCRYPTION_KEY: process.env.GOOGLE_TOKEN_ENCRYPTION_KEY ?? "",
  SEO_ANALYSIS_ENABLED: process.env.SEO_ANALYSIS_ENABLED ?? "true",
  SEO_DEFAULT_PERIOD_DAYS: process.env.SEO_DEFAULT_PERIOD_DAYS ?? "28",
  SEO_MIN_DATA_DAYS: process.env.SEO_MIN_DATA_DAYS ?? "7",
  SEO_IMPROVEMENT_MOCK_MODE: process.env.SEO_IMPROVEMENT_MOCK_MODE ?? "true",
  SEO_REQUIRE_HUMAN_REVIEW: process.env.SEO_REQUIRE_HUMAN_REVIEW ?? "true",
  SEO_CSV_IMPORT_ENABLED: process.env.SEO_CSV_IMPORT_ENABLED ?? "true",
  SEO_POSITION_WARNING_THRESHOLD:
    process.env.SEO_POSITION_WARNING_THRESHOLD ?? "20",
  SEO_CTR_LOW_THRESHOLD: process.env.SEO_CTR_LOW_THRESHOLD ?? "0.02",
  SEO_HIGH_IMPRESSION_THRESHOLD:
    process.env.SEO_HIGH_IMPRESSION_THRESHOLD ?? "1000",
  GOOGLE_API_REAL_CONNECTION_ENABLED:
    process.env.GOOGLE_API_REAL_CONNECTION_ENABLED ?? "false",
  GOOGLE_OAUTH_SCOPES:
    process.env.GOOGLE_OAUTH_SCOPES ??
    "https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly",
  GA4_SYNC_ENABLED: process.env.GA4_SYNC_ENABLED ?? "false",
  GA4_DEFAULT_SYNC_DAYS: process.env.GA4_DEFAULT_SYNC_DAYS ?? "28",
  GA4_MAX_SYNC_DAYS: process.env.GA4_MAX_SYNC_DAYS ?? "90",
  GA4_MAX_ROWS_PER_REQUEST: process.env.GA4_MAX_ROWS_PER_REQUEST ?? "10000",
  GA4_ABSOLUTE_MAX_ROWS_PER_REQUEST:
    process.env.GA4_ABSOLUTE_MAX_ROWS_PER_REQUEST ?? "250000",
  GA4_RETURN_PROPERTY_QUOTA: process.env.GA4_RETURN_PROPERTY_QUOTA ?? "true",
  GOOGLE_SEARCH_CONSOLE_SYNC_ENABLED:
    process.env.GOOGLE_SEARCH_CONSOLE_SYNC_ENABLED ?? "false",
  GOOGLE_SEARCH_CONSOLE_DEFAULT_SYNC_DAYS:
    process.env.GOOGLE_SEARCH_CONSOLE_DEFAULT_SYNC_DAYS ?? "28",
  GOOGLE_SEARCH_CONSOLE_MAX_SYNC_DAYS:
    process.env.GOOGLE_SEARCH_CONSOLE_MAX_SYNC_DAYS ?? "90",
  GOOGLE_SEARCH_CONSOLE_ROW_LIMIT:
    process.env.GOOGLE_SEARCH_CONSOLE_ROW_LIMIT ?? "25000",
  GOOGLE_SEARCH_CONSOLE_MAX_PAGES_PER_SYNC:
    process.env.GOOGLE_SEARCH_CONSOLE_MAX_PAGES_PER_SYNC ?? "10",
  GOOGLE_API_RETRY_ENABLED: process.env.GOOGLE_API_RETRY_ENABLED ?? "true",
  GOOGLE_API_MAX_RETRIES: process.env.GOOGLE_API_MAX_RETRIES ?? "2",
  GOOGLE_API_RETRY_BASE_DELAY_MS:
    process.env.GOOGLE_API_RETRY_BASE_DELAY_MS ?? "2000",
  GOOGLE_API_SYNC_LOCK_MINUTES:
    process.env.GOOGLE_API_SYNC_LOCK_MINUTES ?? "15",
  GOOGLE_API_LOG_PAYLOAD: process.env.GOOGLE_API_LOG_PAYLOAD ?? "false",
  GOOGLE_API_LOG_RESPONSE_SUMMARY:
    process.env.GOOGLE_API_LOG_RESPONSE_SUMMARY ?? "true",
  OPERATIONS_AUTOMATION_ENABLED:
    process.env.OPERATIONS_AUTOMATION_ENABLED ?? "false",
  OPERATIONS_DRY_RUN_MODE: process.env.OPERATIONS_DRY_RUN_MODE ?? "true",
  SCHEDULED_SYNC_ENABLED: process.env.SCHEDULED_SYNC_ENABLED ?? "false",
  SCHEDULED_SYNC_MOCK_MODE: process.env.SCHEDULED_SYNC_MOCK_MODE ?? "true",
  SYNC_WORKER_ENABLED: process.env.SYNC_WORKER_ENABLED ?? "true",
  SYNC_WORKER_INTERVAL_SECONDS:
    process.env.SYNC_WORKER_INTERVAL_SECONDS ?? "60",
  SYNC_MAX_JOBS_PER_TICK: process.env.SYNC_MAX_JOBS_PER_TICK ?? "3",
  SYNC_JOB_TIMEOUT_MINUTES: process.env.SYNC_JOB_TIMEOUT_MINUTES ?? "30",
  SYNC_STALE_LOCK_MINUTES: process.env.SYNC_STALE_LOCK_MINUTES ?? "30",
  SYNC_LEASE_HEARTBEAT_SECONDS:
    process.env.SYNC_LEASE_HEARTBEAT_SECONDS ?? "30",
  SYNC_MAX_RETRY_ATTEMPTS: process.env.SYNC_MAX_RETRY_ATTEMPTS ?? "2",
  SYNC_RETRY_BASE_DELAY_SECONDS:
    process.env.SYNC_RETRY_BASE_DELAY_SECONDS ?? "300",
  GA4_SCHEDULED_SYNC_ENABLED: process.env.GA4_SCHEDULED_SYNC_ENABLED ?? "false",
  GA4_SCHEDULED_SYNC_CRON: process.env.GA4_SCHEDULED_SYNC_CRON ?? "0 3 * * *",
  GA4_SCHEDULED_SYNC_DEFAULT_DAYS:
    process.env.GA4_SCHEDULED_SYNC_DEFAULT_DAYS ?? "7",
  GA4_MIN_QUOTA_REMAINING_TOKENS:
    process.env.GA4_MIN_QUOTA_REMAINING_TOKENS ?? "100",
  GSC_SCHEDULED_SYNC_ENABLED: process.env.GSC_SCHEDULED_SYNC_ENABLED ?? "false",
  GSC_SCHEDULED_SYNC_CRON: process.env.GSC_SCHEDULED_SYNC_CRON ?? "30 3 * * *",
  GSC_SCHEDULED_SYNC_DEFAULT_DAYS:
    process.env.GSC_SCHEDULED_SYNC_DEFAULT_DAYS ?? "7",
  GSC_QUERY_PAGE_SYNC_ENABLED:
    process.env.GSC_QUERY_PAGE_SYNC_ENABLED ?? "false",
  GROWTH_SCORE_AUTO_RECALC_ENABLED:
    process.env.GROWTH_SCORE_AUTO_RECALC_ENABLED ?? "false",
  GROWTH_SCORE_RECALC_CRON: process.env.GROWTH_SCORE_RECALC_CRON ?? "0 5 * * *",
  GSB_WEEKLY_REPORT_ENABLED: process.env.GSB_WEEKLY_REPORT_ENABLED ?? "false",
  GSB_WEEKLY_REPORT_CRON: process.env.GSB_WEEKLY_REPORT_CRON ?? "0 8 * * 1",
  ALERT_DETECTION_ENABLED: process.env.ALERT_DETECTION_ENABLED ?? "true",
  ALERT_DETECTION_MOCK_MODE: process.env.ALERT_DETECTION_MOCK_MODE ?? "true",
  ALERT_DETECTION_CRON: process.env.ALERT_DETECTION_CRON ?? "0 6 * * *",
  ALERT_DEDUP_WINDOW_HOURS: process.env.ALERT_DEDUP_WINDOW_HOURS ?? "24",
  ALERT_DEFAULT_COOLDOWN_HOURS:
    process.env.ALERT_DEFAULT_COOLDOWN_HOURS ?? "24",
  DATA_FRESHNESS_WARNING_HOURS:
    process.env.DATA_FRESHNESS_WARNING_HOURS ?? "48",
  DATA_FRESHNESS_CRITICAL_HOURS:
    process.env.DATA_FRESHNESS_CRITICAL_HOURS ?? "96",
  SEO_CLICKS_DROP_THRESHOLD_PERCENT:
    process.env.SEO_CLICKS_DROP_THRESHOLD_PERCENT ?? "30",
  SEO_IMPRESSIONS_DROP_THRESHOLD_PERCENT:
    process.env.SEO_IMPRESSIONS_DROP_THRESHOLD_PERCENT ?? "30",
  REVENUE_DROP_THRESHOLD_PERCENT:
    process.env.REVENUE_DROP_THRESHOLD_PERCENT ?? "40",
  SOCIAL_IMPRESSIONS_DROP_THRESHOLD_PERCENT:
    process.env.SOCIAL_IMPRESSIONS_DROP_THRESHOLD_PERCENT ?? "40",
  API_ERROR_SPIKE_THRESHOLD: process.env.API_ERROR_SPIKE_THRESHOLD ?? "5",
  NOTIFICATION_CENTER_ENABLED:
    process.env.NOTIFICATION_CENTER_ENABLED ?? "true",
  NOTIFICATION_MOCK_MODE: process.env.NOTIFICATION_MOCK_MODE ?? "true",
  EMAIL_NOTIFICATION_ENABLED: process.env.EMAIL_NOTIFICATION_ENABLED ?? "false",
  SLACK_NOTIFICATION_ENABLED: process.env.SLACK_NOTIFICATION_ENABLED ?? "false",
  ARTICLE_IMPROVEMENT_ENABLED:
    process.env.ARTICLE_IMPROVEMENT_ENABLED ?? "true",
  ARTICLE_IMPROVEMENT_MOCK_MODE:
    process.env.ARTICLE_IMPROVEMENT_MOCK_MODE ?? "true",
  REWRITE_DRAFT_ENABLED: process.env.REWRITE_DRAFT_ENABLED ?? "true",
  REWRITE_DRAFT_MOCK_MODE: process.env.REWRITE_DRAFT_MOCK_MODE ?? "true",
  REWRITE_REQUIRE_HUMAN_APPROVAL:
    process.env.REWRITE_REQUIRE_HUMAN_APPROVAL ?? "true",
  REWRITE_REQUIRE_REAPPROVAL_ON_CHANGE:
    process.env.REWRITE_REQUIRE_REAPPROVAL_ON_CHANGE ?? "true",
  WORDPRESS_REWRITE_DRAFT_UPDATE_ENABLED:
    process.env.WORDPRESS_REWRITE_DRAFT_UPDATE_ENABLED ?? "false",
  WORDPRESS_PUBLISHED_POST_DIRECT_UPDATE_ENABLED:
    process.env.WORDPRESS_PUBLISHED_POST_DIRECT_UPDATE_ENABLED ?? "false",
  WORDPRESS_REWRITE_CREATE_NEW_DRAFT_ENABLED:
    process.env.WORDPRESS_REWRITE_CREATE_NEW_DRAFT_ENABLED ?? "true",
  WORDPRESS_REWRITE_UPDATE_EXISTING_DRAFT_ENABLED:
    process.env.WORDPRESS_REWRITE_UPDATE_EXISTING_DRAFT_ENABLED ?? "true",
  WORDPRESS_REWRITE_DEFAULT_MODE:
    process.env.WORDPRESS_REWRITE_DEFAULT_MODE ?? "create_new_draft",
  WORDPRESS_REWRITE_REQUEST_TIMEOUT_MS:
    process.env.WORDPRESS_REWRITE_REQUEST_TIMEOUT_MS ?? "20000",
  WORDPRESS_REWRITE_REQUIRE_MODIFIED_CHECK:
    process.env.WORDPRESS_REWRITE_REQUIRE_MODIFIED_CHECK ?? "true",
  CONTENT_DIFF_ENABLED: process.env.CONTENT_DIFF_ENABLED ?? "true",
  CONTENT_DIFF_MAX_CONTENT_LENGTH:
    process.env.CONTENT_DIFF_MAX_CONTENT_LENGTH ?? "120000",
  CONTENT_SNAPSHOT_ENABLED: process.env.CONTENT_SNAPSHOT_ENABLED ?? "true",
  CONTENT_SANITIZE_HTML_ENABLED:
    process.env.CONTENT_SANITIZE_HTML_ENABLED ?? "true",
  CONTENT_BLOCK_STRUCTURE_WARNING_ENABLED:
    process.env.CONTENT_BLOCK_STRUCTURE_WARNING_ENABLED ?? "true",
  SEO_IMPACT_MEASUREMENT_ENABLED:
    process.env.SEO_IMPACT_MEASUREMENT_ENABLED ?? "true",
  SEO_IMPACT_DEFAULT_DAYS_BEFORE:
    process.env.SEO_IMPACT_DEFAULT_DAYS_BEFORE ?? "28",
  SEO_IMPACT_DEFAULT_DAYS_AFTER:
    process.env.SEO_IMPACT_DEFAULT_DAYS_AFTER ?? "28",
  SEO_IMPACT_MIN_DAYS_AFTER: process.env.SEO_IMPACT_MIN_DAYS_AFTER ?? "7",
  SEO_IMPACT_MIN_CLICKS: process.env.SEO_IMPACT_MIN_CLICKS ?? "20",
  SEO_IMPACT_MIN_IMPRESSIONS: process.env.SEO_IMPACT_MIN_IMPRESSIONS ?? "500",
  IMPROVEMENT_TASK_AUTO_CREATE_ENABLED:
    process.env.IMPROVEMENT_TASK_AUTO_CREATE_ENABLED ?? "false",
  IMPROVEMENT_TASK_REQUIRE_APPROVAL:
    process.env.IMPROVEMENT_TASK_REQUIRE_APPROVAL ?? "true",
  REWRITE_RISK_CHECK_ENABLED: process.env.REWRITE_RISK_CHECK_ENABLED ?? "true",
  REWRITE_HIGH_RISK_KEYWORDS_ENABLED:
    process.env.REWRITE_HIGH_RISK_KEYWORDS_ENABLED ?? "true",
  REWRITE_CRITICAL_RISK_BLOCKS_WORDPRESS_UPDATE:
    process.env.REWRITE_CRITICAL_RISK_BLOCKS_WORDPRESS_UPDATE ?? "true",
  SNS_REAL_POSTING_ENABLED: process.env.SNS_REAL_POSTING_ENABLED ?? "false",
  SNS_POSTING_MOCK_MODE: process.env.SNS_POSTING_MOCK_MODE ?? "true",
  SNS_REQUIRE_HUMAN_APPROVAL: process.env.SNS_REQUIRE_HUMAN_APPROVAL ?? "true",
  SNS_REQUIRE_LINK_CHECK: process.env.SNS_REQUIRE_LINK_CHECK ?? "true",
  SNS_REQUIRE_RISK_CHECK: process.env.SNS_REQUIRE_RISK_CHECK ?? "true",
  SNS_PREVENT_DIRECT_AFFILIATE_LINK:
    process.env.SNS_PREVENT_DIRECT_AFFILIATE_LINK ?? "true",
  SNS_MANUAL_REVIEW_ON_UNKNOWN_STATUS:
    process.env.SNS_MANUAL_REVIEW_ON_UNKNOWN_STATUS ?? "true",
  SNS_POST_WORKER_ENABLED: process.env.SNS_POST_WORKER_ENABLED ?? "false",
  SNS_POST_WORKER_INTERVAL_SECONDS:
    process.env.SNS_POST_WORKER_INTERVAL_SECONDS ?? "60",
  SNS_POST_WORKER_MAX_PER_TICK: process.env.SNS_POST_WORKER_MAX_PER_TICK ?? "3",
  SNS_DEDUP_WINDOW_DAYS: process.env.SNS_DEDUP_WINDOW_DAYS ?? "14",
  SNS_RETRY_MAX_ATTEMPTS: process.env.SNS_RETRY_MAX_ATTEMPTS ?? "2",
  SNS_RETRY_BASE_DELAY_SECONDS:
    process.env.SNS_RETRY_BASE_DELAY_SECONDS ?? "300",
  SNS_PERFORMANCE_SYNC_ENABLED:
    process.env.SNS_PERFORMANCE_SYNC_ENABLED ?? "false",
  SNS_GROWTH_SCORE_ENABLED: process.env.SNS_GROWTH_SCORE_ENABLED ?? "true",
  X_API_ENABLED: process.env.X_API_ENABLED ?? "false",
  X_POSTING_ENABLED: process.env.X_POSTING_ENABLED ?? "false",
  X_MOCK_MODE: process.env.X_MOCK_MODE ?? "true",
  X_OAUTH_CLIENT_ID: process.env.X_OAUTH_CLIENT_ID ?? "",
  X_OAUTH_CLIENT_SECRET: process.env.X_OAUTH_CLIENT_SECRET ?? "",
  X_OAUTH_REDIRECT_URI:
    process.env.X_OAUTH_REDIRECT_URI ??
    "http://127.0.0.1:3000/api/x/oauth/callback",
  X_TOKEN_ENCRYPTION_KEY: process.env.X_TOKEN_ENCRYPTION_KEY ?? "",
  X_OAUTH_SCOPES:
    process.env.X_OAUTH_SCOPES ??
    "tweet.read tweet.write users.read offline.access media.write",
  X_MEDIA_SIMPLE_UPLOAD_ENABLED:
    process.env.X_MEDIA_SIMPLE_UPLOAD_ENABLED ?? "true",
  X_MEDIA_CHUNKED_UPLOAD_ENABLED:
    process.env.X_MEDIA_CHUNKED_UPLOAD_ENABLED ?? "false",
  X_MEDIA_ALLOWED_IMAGE_TYPES:
    process.env.X_MEDIA_ALLOWED_IMAGE_TYPES ??
    "image/jpeg,image/png,image/gif,image/webp",
  X_POST_DEFAULT_MADE_WITH_AI:
    process.env.X_POST_DEFAULT_MADE_WITH_AI ?? "false",
  X_POST_PAID_PARTNERSHIP_ENABLED:
    process.env.X_POST_PAID_PARTNERSHIP_ENABLED ?? "false",
  X_RATE_LIMIT_STOP_ON_429: process.env.X_RATE_LIMIT_STOP_ON_429 ?? "true",
  CAMPAIGN_MANAGEMENT_ENABLED:
    process.env.CAMPAIGN_MANAGEMENT_ENABLED ?? "true",
  CAMPAIGN_MANAGEMENT_MOCK_MODE:
    process.env.CAMPAIGN_MANAGEMENT_MOCK_MODE ?? "true",
  CONTENT_CALENDAR_ADVANCED_ENABLED:
    process.env.CONTENT_CALENDAR_ADVANCED_ENABLED ?? "true",
  CONTENT_CALENDAR_MOCK_MODE: process.env.CONTENT_CALENDAR_MOCK_MODE ?? "true",
  CONTENT_CALENDAR_CONFLICT_DETECTION_ENABLED:
    process.env.CONTENT_CALENDAR_CONFLICT_DETECTION_ENABLED ?? "true",
  CONTENT_CALENDAR_MAX_SOCIAL_POSTS_PER_DAY:
    process.env.CONTENT_CALENDAR_MAX_SOCIAL_POSTS_PER_DAY ?? "3",
  CONTENT_CALENDAR_MAX_CAMPAIGNS_OVERLAP:
    process.env.CONTENT_CALENDAR_MAX_CAMPAIGNS_OVERLAP ?? "3",
  CAMPAIGN_ROI_ENABLED: process.env.CAMPAIGN_ROI_ENABLED ?? "true",
  CAMPAIGN_ROI_DEFAULT_PERIOD_DAYS:
    process.env.CAMPAIGN_ROI_DEFAULT_PERIOD_DAYS ?? "28",
  CAMPAIGN_ROI_MIN_DATA_DAYS: process.env.CAMPAIGN_ROI_MIN_DATA_DAYS ?? "7",
  CAMPAIGN_ROI_DEFAULT_CURRENCY:
    process.env.CAMPAIGN_ROI_DEFAULT_CURRENCY ?? "JPY",
  CAMPAIGN_ROI_REQUIRE_APPROVED_REVENUE_VIEW:
    process.env.CAMPAIGN_ROI_REQUIRE_APPROVED_REVENUE_VIEW ?? "true",
  CAMPAIGN_ROI_ALLOW_PENDING_VIEW:
    process.env.CAMPAIGN_ROI_ALLOW_PENDING_VIEW ?? "true",
  CAMPAIGN_ROI_PREVENT_DOUBLE_COUNT:
    process.env.CAMPAIGN_ROI_PREVENT_DOUBLE_COUNT ?? "true",
  CAMPAIGN_ATTRIBUTION_ENABLED:
    process.env.CAMPAIGN_ATTRIBUTION_ENABLED ?? "true",
  CAMPAIGN_ATTRIBUTION_DEFAULT_METHOD:
    process.env.CAMPAIGN_ATTRIBUTION_DEFAULT_METHOD ?? "direct",
  CAMPAIGN_ATTRIBUTION_ALLOW_ALLOCATION_RATE:
    process.env.CAMPAIGN_ATTRIBUTION_ALLOW_ALLOCATION_RATE ?? "true",
  CAMPAIGN_GROWTH_SCORE_ENABLED:
    process.env.CAMPAIGN_GROWTH_SCORE_ENABLED ?? "true",
  CAMPAIGN_RECOMMENDATION_ENABLED:
    process.env.CAMPAIGN_RECOMMENDATION_ENABLED ?? "true",
  CAMPAIGN_REQUIRE_HUMAN_REVIEW:
    process.env.CAMPAIGN_REQUIRE_HUMAN_REVIEW ?? "true",
  REPORT_GENERATION_ENABLED: process.env.REPORT_GENERATION_ENABLED ?? "true",
  REPORT_GENERATION_MOCK_MODE:
    process.env.REPORT_GENERATION_MOCK_MODE ?? "true",
  REPORT_AUTO_GENERATION_ENABLED:
    process.env.REPORT_AUTO_GENERATION_ENABLED ?? "false",
  REPORT_DEFAULT_PERIOD: process.env.REPORT_DEFAULT_PERIOD ?? "weekly",
  REPORT_REQUIRE_HUMAN_REVIEW:
    process.env.REPORT_REQUIRE_HUMAN_REVIEW ?? "true",
  REPORT_IDEMPOTENCY_ENABLED: process.env.REPORT_IDEMPOTENCY_ENABLED ?? "true",
  REPORT_EXPORT_ENABLED: process.env.REPORT_EXPORT_ENABLED ?? "true",
  REPORT_EXPORT_MOCK_MODE: process.env.REPORT_EXPORT_MOCK_MODE ?? "true",
  REPORT_EXPORT_FORMATS:
    process.env.REPORT_EXPORT_FORMATS ?? "markdown,csv,json",
  REPORT_EXTERNAL_SEND_ENABLED:
    process.env.REPORT_EXTERNAL_SEND_ENABLED ?? "false",
  CAMPAIGN_ALERTS_ENABLED: process.env.CAMPAIGN_ALERTS_ENABLED ?? "true",
  CAMPAIGN_RISK_CHECK_ENABLED:
    process.env.CAMPAIGN_RISK_CHECK_ENABLED ?? "true",
  CAMPAIGN_COST_TRACKING_ENABLED:
    process.env.CAMPAIGN_COST_TRACKING_ENABLED ?? "true",
  CAMPAIGN_WORKLOAD_TRACKING_ENABLED:
    process.env.CAMPAIGN_WORKLOAD_TRACKING_ENABLED ?? "true",
  BUSINESS_INSIGHT_ENABLED: process.env.BUSINESS_INSIGHT_ENABLED ?? "true",
  BUSINESS_INSIGHT_REQUIRE_HUMAN_REVIEW:
    process.env.BUSINESS_INSIGHT_REQUIRE_HUMAN_REVIEW ?? "true",
};

const mediaSeeds = [
  {
    id: "seed-media-ai-side-business",
    name: "AI副業ラボ",
    niche: "AI副業",
    wordpressUrl: "https://example.com/ai-side-business",
    noteUrl: "https://note.com/growth_lab_ai",
    growthScore: 82,
  },
  {
    id: "seed-media-gadget",
    name: "ガジェット比較ナビ",
    niche: "ガジェット比較",
    wordpressUrl: "https://example.com/gadget",
    bloggerUrl: "https://growth-lab-gadget.blogspot.com",
    growthScore: 76,
  },
  {
    id: "seed-media-pet-health",
    name: "ペット健康メディア",
    niche: "ペット健康",
    wordpressUrl: "https://example.com/pet-health",
    instagramUrl: "https://instagram.com/growth_lab_pet",
    growthScore: 69,
  },
  {
    id: "seed-media-minimal-life",
    name: "節約生活ラボ",
    niche: "節約生活",
    wordpressUrl: "https://example.com/minimal-life",
    pinterestUrl: "https://pinterest.com/growth_lab_minimal",
    growthScore: 73,
  },
];

async function seedSettings() {
  await Promise.all(
    Object.entries(defaultSettings).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );
}

async function seedMockImage(
  filename: string,
  title: string,
  width: number,
  height: number,
) {
  const dir = path.resolve(process.cwd(), "public/generated-images");
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#0f766e"/>
  <rect x="72" y="72" width="${width - 144}" height="${height - 144}" rx="24" fill="#ffffff"/>
  <text x="120" y="${Math.round(height * 0.42)}" fill="#111827" font-family="Arial, sans-serif" font-size="54" font-weight="800">${title}</text>
  <text x="120" y="${Math.round(height * 0.57)}" fill="#2563eb" font-family="Arial, sans-serif" font-size="30" font-weight="700">Growth Lab Core mock image</text>
</svg>`;
  await writeFile(filePath, svg, "utf8");
  return stat(filePath);
}

async function seedPhase4() {
  const networkSeeds = [
    { name: "A8.net", slug: "a8-net", websiteUrl: "https://www.a8.net/" },
    { name: "afb", slug: "afb", websiteUrl: "https://www.afi-b.com/" },
    {
      name: "ValueCommerce",
      slug: "valuecommerce",
      websiteUrl: "https://www.valuecommerce.ne.jp/",
    },
    {
      name: "AccessTrade",
      slug: "accesstrade",
      websiteUrl: "https://www.accesstrade.ne.jp/",
    },
  ];

  for (const networkSeed of networkSeeds) {
    await prisma.affiliateNetwork.upsert({
      where: { slug: networkSeed.slug },
      update: networkSeed,
      create: networkSeed,
    });
  }

  const networks = await prisma.affiliateNetwork.findMany();
  const a8 =
    networks.find((network) => network.slug === "a8-net") ?? networks[0];
  const afb = networks.find((network) => network.slug === "afb") ?? networks[0];
  const media = await prisma.media.findMany({ orderBy: { createdAt: "asc" } });
  if (!a8 || media.length === 0) return;

  const programSeeds = [
    {
      id: "seed-program-ai-tools",
      network: a8,
      programName: "AI tools comparison program",
      genre: "AI",
      rewardAmount: 1800,
      riskLevel: AffiliateRiskLevel.MEDIUM,
    },
    {
      id: "seed-program-gadget-ec",
      network: a8,
      programName: "Gadget EC program",
      genre: "Gadget",
      rewardAmount: 900,
      riskLevel: AffiliateRiskLevel.LOW,
    },
    {
      id: "seed-program-pet-food",
      network: afb,
      programName: "Pet food subscription program",
      genre: "Pet",
      rewardAmount: 2400,
      riskLevel: AffiliateRiskLevel.MEDIUM,
    },
    {
      id: "seed-program-minimal-service",
      network: a8,
      programName: "Minimal life service program",
      genre: "Lifestyle",
      rewardAmount: 1200,
      riskLevel: AffiliateRiskLevel.LOW,
    },
  ];

  const programs = [];
  for (const programSeed of programSeeds) {
    programs.push(
      await prisma.affiliateProgram.upsert({
        where: { id: programSeed.id },
        update: {
          programName: programSeed.programName,
          genre: programSeed.genre,
          rewardAmount: programSeed.rewardAmount,
          riskLevel: programSeed.riskLevel,
          status: AffiliateProgramStatus.APPROVED,
        },
        create: {
          id: programSeed.id,
          affiliateNetworkId: programSeed.network.id,
          programName: programSeed.programName,
          advertiserName: programSeed.programName.replace(" program", ""),
          genre: programSeed.genre,
          category: programSeed.genre,
          rewardType: AffiliateRewardType.FIXED,
          rewardAmount: programSeed.rewardAmount,
          currency: "JPY",
          approvalRate: 0.72,
          epc: 120,
          cookieDurationDays: 30,
          conversionCondition: "Mock conversion condition for local analysis.",
          allowedMediaTypes: [
            "wordpress",
            "note",
            "blogger",
            "instagram",
            "pinterest",
          ],
          complianceNotes:
            "Use affiliate links inside WordPress only. X must link to WordPress articles.",
          riskLevel: programSeed.riskLevel,
          status: AffiliateProgramStatus.APPROVED,
        },
      }),
    );
  }

  for (const [index, mediaItem] of media.entries()) {
    const program = programs[index % programs.length];
    await prisma.affiliateProgramMediaSite.upsert({
      where: {
        mediaId_affiliateProgramId: {
          mediaId: mediaItem.id,
          affiliateProgramId: program.id,
        },
      },
      update: { applicationStatus: AffiliateApplicationStatus.APPROVED },
      create: {
        mediaId: mediaItem.id,
        affiliateProgramId: program.id,
        applicationStatus: AffiliateApplicationStatus.APPROVED,
        approvedAt: new Date(),
        mainProgram: true,
        priority: 20 + index,
      },
    });

    const link = await prisma.affiliateLink.upsert({
      where: { id: `seed-affiliate-link-${mediaItem.id}` },
      update: {},
      create: {
        id: `seed-affiliate-link-${mediaItem.id}`,
        affiliateProgramId: program.id,
        mediaId: mediaItem.id,
        name: `${mediaItem.name} main WordPress CTA`,
        destinationUrl: mediaItem.wordpressUrl,
        affiliateUrl: `https://px.a8.net/mock/${mediaItem.id}`,
        affiliateUrlMasked: "https://px.a8.net/***",
        trackingId: `gl_${mediaItem.id.replace("seed-media-", "")}`,
        utmSource: "wordpress",
        utmMedium: "affiliate",
        utmCampaign: "phase4_mock",
        linkType: "BUTTON",
        memo: "Seed link for WordPress placement only. Never use directly in X posts.",
      },
    });

    const wpPost = await prisma.wordPressPost.findFirst({
      where: { mediaId: mediaItem.id },
    });
    if (wpPost) {
      await prisma.affiliatePlacement.upsert({
        where: { id: `seed-placement-${wpPost.id}` },
        update: {},
        create: {
          id: `seed-placement-${wpPost.id}`,
          affiliateLinkId: link.id,
          mediaId: mediaItem.id,
          wordpressPostId: wpPost.id,
          placementType: "CTA_BOX",
          placementLabel: "Main CTA",
          position: "CONCLUSION",
        },
      });
    }

    const approvedCount = index === 3 ? 0 : index + 1;
    const pendingCount = index + 1;
    const rejectedCount = index === 0 ? 1 : 0;
    for (
      let count = 0;
      count < approvedCount + pendingCount + rejectedCount;
      count += 1
    ) {
      const status =
        count < approvedCount
          ? RevenueStatus.APPROVED
          : count < approvedCount + pendingCount
            ? RevenueStatus.PENDING
            : RevenueStatus.REJECTED;
      const reward = Number(program.rewardAmount ?? 1000);
      await prisma.revenueEvent.upsert({
        where: { id: `seed-revenue-${mediaItem.id}-${count}` },
        update: {},
        create: {
          id: `seed-revenue-${mediaItem.id}-${count}`,
          affiliateNetworkId: program.affiliateNetworkId,
          affiliateProgramId: program.id,
          affiliateLinkId: link.id,
          mediaId: mediaItem.id,
          wordpressPostId: wpPost?.id,
          eventDate: new Date(Date.now() - count * 24 * 60 * 60 * 1000),
          orderIdHash: hashIdentifier(`seed-order-${mediaItem.id}-${count}`),
          conversionType: "sale",
          status,
          estimatedReward: reward,
          pendingReward: status === RevenueStatus.PENDING ? reward : 0,
          approvedReward: status === RevenueStatus.APPROVED ? reward : 0,
          rejectedReward: status === RevenueStatus.REJECTED ? reward : 0,
          currency: "JPY",
          source: RevenueSource.MOCK,
          dataConfidence: DataConfidence.MEDIUM,
        },
      });
    }

    for (let day = 0; day < 30; day += 1) {
      const metricDate = new Date();
      metricDate.setHours(0, 0, 0, 0);
      metricDate.setDate(metricDate.getDate() - day);
      await prisma.trafficMetricDaily.upsert({
        where: { mediaId_metricDate: { mediaId: mediaItem.id, metricDate } },
        update: {},
        create: {
          mediaId: mediaItem.id,
          metricDate,
          impressions: 500 + index * 180 + day * 9,
          linkClicks: 24 + index * 8 + (day % 7),
          articleSessions: 90 + index * 20 + day,
          sessions: 120 + index * 30 + day,
          pageviews: 180 + index * 40 + day * 2,
          users: 80 + index * 16 + day,
          source: RevenueSource.MOCK,
          dataConfidence: DataConfidence.MEDIUM,
        },
      });
    }

    await prisma.operatingCost.upsert({
      where: { id: `seed-cost-${mediaItem.id}` },
      update: {},
      create: {
        id: `seed-cost-${mediaItem.id}`,
        mediaId: mediaItem.id,
        costDate: new Date(),
        category: OperatingCostCategory.TOOL,
        amount: 1000 + index * 500,
        description: "Mock monthly tool/content cost",
        dataConfidence: DataConfidence.MEDIUM,
      },
    });

    await prisma.growthScoreSnapshot.upsert({
      where: { id: `seed-growth-score-${mediaItem.id}` },
      update: {},
      create: {
        id: `seed-growth-score-${mediaItem.id}`,
        mediaId: mediaItem.id,
        periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        trafficScore: 50 + index * 8,
        revenueScore: 35 + approvedCount * 12,
        conversionScore: 40 + approvedCount * 10,
        contentScore: 55,
        riskScore: rejectedCount > 0 ? 45 : 78,
        totalScore: Math.min(85, 52 + index * 7 + approvedCount * 4),
        recommendation:
          index === 0
            ? GrowthRecommendationType.IMPROVE
            : GrowthRecommendationType.MAINTAIN,
        dataConfidence: DataConfidence.MEDIUM,
        dataWarnings: ["Seed score is for human review only."],
        reasoning: "Seeded Phase 4 Growth Score snapshot.",
        requiresHumanReview: true,
      },
    });
  }
}

async function seedPhase5() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "asc" } });
  if (media.length === 0) return;

  for (const [index, mediaItem] of media.entries()) {
    const connection = await prisma.googleConnection.upsert({
      where: { id: `seed-google-connection-${mediaItem.id}` },
      update: {
        connectionStatus: GoogleConnectionStatus.MOCK_CONNECTED,
        mockMode: true,
        lastConnectedAt: new Date(),
      },
      create: {
        id: `seed-google-connection-${mediaItem.id}`,
        mediaId: mediaItem.id,
        connectionName: `${mediaItem.name} Google Mock`,
        googleAccountEmail: `${mediaItem.id.replace("seed-media-", "")}@growth-lab.local`,
        scopes: "analytics.readonly webmasters.readonly",
        connectionStatus: GoogleConnectionStatus.MOCK_CONNECTED,
        mockMode: true,
        lastConnectedAt: new Date(),
      },
    });

    const ga4Property = await prisma.gA4Property.upsert({
      where: {
        mediaId_propertyId: {
          mediaId: mediaItem.id,
          propertyId: `properties/${900000 + index}`,
        },
      },
      update: {
        googleConnectionId: connection.id,
        connectionStatus: GooglePropertyStatus.MOCK_CONNECTED,
        mockMode: true,
      },
      create: {
        mediaId: mediaItem.id,
        googleConnectionId: connection.id,
        propertyName: `${mediaItem.name} GA4 Mock`,
        propertyId: `properties/${900000 + index}`,
        propertyDisplayName: `${mediaItem.name} GA4 Mock`,
        defaultUrl: mediaItem.wordpressUrl,
        connectionStatus: GooglePropertyStatus.MOCK_CONNECTED,
        mockMode: true,
      },
    });

    const searchConsoleProperty = await prisma.searchConsoleProperty.upsert({
      where: {
        mediaId_siteUrl: {
          mediaId: mediaItem.id,
          siteUrl: mediaItem.wordpressUrl,
        },
      },
      update: {
        googleConnectionId: connection.id,
        connectionStatus: GooglePropertyStatus.MOCK_CONNECTED,
        mockMode: true,
      },
      create: {
        mediaId: mediaItem.id,
        googleConnectionId: connection.id,
        siteUrl: mediaItem.wordpressUrl,
        propertyType: SearchConsolePropertyType.URL_PREFIX,
        connectionStatus: GooglePropertyStatus.MOCK_CONNECTED,
        mockMode: true,
      },
    });

    const wpPost =
      (await prisma.wordPressPost.findFirst({
        where: { mediaId: mediaItem.id },
        orderBy: { createdAt: "asc" },
      })) ?? null;
    const pagePath = wpPost ? `/${wpPost.slug}/` : "/";
    const pageUrl =
      wpPost?.wordpressPostUrl ??
      `${mediaItem.wordpressUrl.replace(/\/$/, "")}${pagePath}`;
    const query = `${mediaItem.niche} comparison`;
    const normalizedKeyword = query.toLowerCase();

    const keyword = await prisma.seoKeyword.upsert({
      where: {
        mediaId_normalizedKeyword: { mediaId: mediaItem.id, normalizedKeyword },
      },
      update: {
        keyword: query,
        priority: 80 - index * 5,
        status: SeoKeywordStatus.RANKING,
      },
      create: {
        mediaId: mediaItem.id,
        keyword: query,
        normalizedKeyword,
        intent: SeoKeywordIntent.COMMERCIAL,
        topic: mediaItem.niche,
        difficulty: 45 + index * 5,
        priority: 80 - index * 5,
        status: SeoKeywordStatus.RANKING,
        memo: "Seed keyword from Phase 5 mock Search Console data.",
      },
    });

    if (wpPost) {
      await prisma.seoPageKeyword.upsert({
        where: {
          wordpressPostId_seoKeywordId: {
            wordpressPostId: wpPost.id,
            seoKeywordId: keyword.id,
          },
        },
        update: {
          role: SeoPageKeywordRole.PRIMARY,
          currentPosition: 11 + index,
          currentClicks: 40 + index * 8,
          currentImpressions: 2200 + index * 400,
          currentCtr: 0.018 + index * 0.004,
        },
        create: {
          mediaId: mediaItem.id,
          wordpressPostId: wpPost.id,
          seoKeywordId: keyword.id,
          role: SeoPageKeywordRole.PRIMARY,
          targetPosition: 6,
          currentPosition: 11 + index,
          currentClicks: 40 + index * 8,
          currentImpressions: 2200 + index * 400,
          currentCtr: 0.018 + index * 0.004,
          priority: 85,
        },
      });
    }

    let totalClicks = 0;
    let totalImpressions = 0;
    let totalSessions = 0;
    for (let day = 0; day < 28; day += 1) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - day);
      const impressions = 120 + index * 30 + day * 4;
      const clicks = Math.max(
        1,
        Math.round(impressions * (0.018 + index * 0.004)),
      );
      const sessions = 36 + index * 9 + day;
      totalClicks += clicks;
      totalImpressions += impressions;
      totalSessions += sessions;

      await prisma.gA4MetricDaily.upsert({
        where: {
          mediaId_ga4PropertyId_date_source: {
            mediaId: mediaItem.id,
            ga4PropertyId: ga4Property.id,
            date,
            source: SeoDataSource.MOCK,
          },
        },
        update: {
          sessions,
          users: Math.round(sessions * 0.72),
          pageviews: sessions * 2,
          conversions: index + (day % 3 === 0 ? 1 : 0),
        },
        create: {
          mediaId: mediaItem.id,
          ga4PropertyId: ga4Property.id,
          date,
          sessions,
          users: Math.round(sessions * 0.72),
          activeUsers: Math.round(sessions * 0.68),
          newUsers: Math.round(sessions * 0.3),
          pageviews: sessions * 2,
          screenPageViews: sessions * 2,
          engagedSessions: Math.round(sessions * 0.62),
          averageSessionDuration: 92 + index * 8,
          engagementRate: 0.62,
          bounceRate: 0.38,
          conversions: index + (day % 3 === 0 ? 1 : 0),
          totalRevenue: 1200 + index * 250,
          source: SeoDataSource.MOCK,
          dataConfidence: DataConfidence.MEDIUM,
        },
      });

      await prisma.gA4PageMetricDaily.upsert({
        where: { id: `seed-ga4-page-${mediaItem.id}-${day}` },
        update: {
          sessions,
          users: Math.round(sessions * 0.72),
          views: sessions * 2,
          conversions: index + (day % 5 === 0 ? 1 : 0),
          affiliateClicks: 3 + index + (day % 4),
        },
        create: {
          id: `seed-ga4-page-${mediaItem.id}-${day}`,
          mediaId: mediaItem.id,
          wordpressPostId: wpPost?.id,
          ga4PropertyId: ga4Property.id,
          date,
          pagePath,
          pageTitle: wpPost?.title ?? `${mediaItem.name} top page`,
          sessions,
          users: Math.round(sessions * 0.72),
          activeUsers: Math.round(sessions * 0.68),
          views: sessions * 2,
          screenPageViews: sessions * 2,
          engagedSessions: Math.round(sessions * 0.62),
          averageEngagementTime: 74 + index * 6,
          conversions: index + (day % 5 === 0 ? 1 : 0),
          affiliateClicks: 3 + index + (day % 4),
          source: SeoDataSource.MOCK,
          dataConfidence: DataConfidence.MEDIUM,
        },
      });

      await prisma.searchConsoleQueryDaily.upsert({
        where: { id: `seed-gsc-query-${mediaItem.id}-${day}` },
        update: {
          clicks,
          impressions,
          ctr: clicks / impressions,
          position: 11 + index + day / 50,
        },
        create: {
          id: `seed-gsc-query-${mediaItem.id}-${day}`,
          mediaId: mediaItem.id,
          searchConsolePropertyId: searchConsoleProperty.id,
          date,
          query,
          searchType: SearchType.WEB,
          country: "jpn",
          device: SearchDevice.DESKTOP,
          clicks,
          impressions,
          ctr: clicks / impressions,
          position: 11 + index + day / 50,
          source: SeoDataSource.MOCK,
          dataConfidence: DataConfidence.MEDIUM,
        },
      });

      await prisma.searchConsolePageDaily.upsert({
        where: { id: `seed-gsc-page-${mediaItem.id}-${day}` },
        update: {
          clicks,
          impressions,
          ctr: clicks / impressions,
          position: 11 + index + day / 50,
        },
        create: {
          id: `seed-gsc-page-${mediaItem.id}-${day}`,
          mediaId: mediaItem.id,
          wordpressPostId: wpPost?.id,
          searchConsolePropertyId: searchConsoleProperty.id,
          date,
          pageUrl,
          searchType: SearchType.WEB,
          clicks,
          impressions,
          ctr: clicks / impressions,
          position: 11 + index + day / 50,
          source: SeoDataSource.MOCK,
          dataConfidence: DataConfidence.MEDIUM,
        },
      });

      await prisma.searchConsoleQueryPageDaily.upsert({
        where: { id: `seed-gsc-query-page-${mediaItem.id}-${day}` },
        update: {
          clicks,
          impressions,
          ctr: clicks / impressions,
          position: 11 + index + day / 50,
        },
        create: {
          id: `seed-gsc-query-page-${mediaItem.id}-${day}`,
          mediaId: mediaItem.id,
          wordpressPostId: wpPost?.id,
          searchConsolePropertyId: searchConsoleProperty.id,
          date,
          query,
          pageUrl,
          searchType: SearchType.WEB,
          country: "jpn",
          device: SearchDevice.DESKTOP,
          clicks,
          impressions,
          ctr: clicks / impressions,
          position: 11 + index + day / 50,
          source: SeoDataSource.MOCK,
          dataConfidence: DataConfidence.MEDIUM,
        },
      });
    }

    const opportunity = await prisma.seoOpportunity.upsert({
      where: { id: `seed-seo-opportunity-${mediaItem.id}` },
      update: {
        priority: SeoPriority.HIGH,
        status: SeoOpportunityStatus.NEW,
        opportunityScore: 82 - index * 4,
      },
      create: {
        id: `seed-seo-opportunity-${mediaItem.id}`,
        mediaId: mediaItem.id,
        wordpressPostId: wpPost?.id,
        seoKeywordId: keyword.id,
        opportunityType: SeoOpportunityType.HIGH_IMPRESSION_LOW_CTR,
        priority: SeoPriority.HIGH,
        title: "Improve title and lead for high-impression query",
        description:
          "Search Console mock data shows impressions are high, but CTR is still low.",
        evidence: {
          query,
          totalClicks,
          totalImpressions,
          ctr: totalClicks / totalImpressions,
        },
        expectedImpact:
          "Higher CTR and more WordPress sessions after human-reviewed edits.",
        status: SeoOpportunityStatus.NEW,
        opportunityScore: 82 - index * 4,
      },
    });

    await prisma.seoRecommendation.upsert({
      where: { id: `seed-seo-recommendation-${mediaItem.id}` },
      update: {
        approvalStatus: SeoApprovalStatus.PENDING_APPROVAL,
        priority: SeoPriority.HIGH,
      },
      create: {
        id: `seed-seo-recommendation-${mediaItem.id}`,
        mediaId: mediaItem.id,
        wordpressPostId: wpPost?.id,
        seoOpportunityId: opportunity.id,
        recommendationType: SeoRecommendationType.REWRITE_TITLE,
        priority: SeoPriority.HIGH,
        title: "Rewrite SEO title after review",
        description:
          "Adjust the title so it answers the commercial search intent more directly.",
        beforeValue: wpPost?.seoTitle ?? wpPost?.title ?? mediaItem.name,
        afterSuggestion: `${mediaItem.niche} comparison: reviewed choices and caveats`,
        reason:
          "Mock Search Console data indicates high impressions with low CTR.",
        requiresHumanReview: true,
        approvalStatus: SeoApprovalStatus.PENDING_APPROVAL,
      },
    });

    await prisma.seoAnalysisSnapshot.upsert({
      where: { id: `seed-seo-snapshot-${mediaItem.id}` },
      update: {
        totalClicks,
        totalImpressions,
        organicSessions: totalSessions,
        opportunityCount: 1,
      },
      create: {
        id: `seed-seo-snapshot-${mediaItem.id}`,
        mediaId: mediaItem.id,
        periodStart: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        totalClicks,
        totalImpressions,
        averageCtr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
        averagePosition: 11 + index,
        organicSessions: totalSessions,
        topQueries: [
          { query, clicks: totalClicks, impressions: totalImpressions },
        ],
        topPages: [{ pageUrl, sessions: totalSessions }],
        opportunityCount: 1,
        dataConfidence: DataConfidence.MEDIUM,
        summary:
          "Seeded Phase 5 mock SEO snapshot. Human review is required before applying recommendations.",
      },
    });

    await prisma.seoImportBatch.upsert({
      where: { id: `seed-seo-import-${mediaItem.id}` },
      update: {
        status: SeoImportStatus.COMPLETED,
        totalRows: 56,
        successRows: 56,
        failedRows: 0,
      },
      create: {
        id: `seed-seo-import-${mediaItem.id}`,
        mediaId: mediaItem.id,
        importSource: SeoImportSource.MOCK,
        fileName: "phase5-seed-mock.csv",
        importType: SeoImportType.MOCK,
        status: SeoImportStatus.COMPLETED,
        totalRows: 56,
        successRows: 56,
        failedRows: 0,
        warningRows: 0,
        importedBy: "seed",
      },
    });

    const ga4Job = await prisma.googleSyncJob.upsert({
      where: { id: `seed-google-sync-job-ga4-${mediaItem.id}` },
      update: {
        googleConnectionId: connection.id,
        targetPropertyId: ga4Property.id,
        status: GoogleSyncJobStatus.ACTIVE,
      },
      create: {
        id: `seed-google-sync-job-ga4-${mediaItem.id}`,
        mediaId: mediaItem.id,
        googleConnectionId: connection.id,
        jobName: `${mediaItem.name} GA4 page daily sync`,
        jobType: GoogleSyncJobType.GA4_PAGE_DAILY,
        targetPropertyId: ga4Property.id,
        syncSource: GoogleSyncSource.GA4,
        defaultDays: 28,
        maxDays: 90,
        status: GoogleSyncJobStatus.ACTIVE,
      },
    });

    const gscJob = await prisma.googleSyncJob.upsert({
      where: { id: `seed-google-sync-job-gsc-${mediaItem.id}` },
      update: {
        googleConnectionId: connection.id,
        targetPropertyId: searchConsoleProperty.id,
        status: GoogleSyncJobStatus.ACTIVE,
      },
      create: {
        id: `seed-google-sync-job-gsc-${mediaItem.id}`,
        mediaId: mediaItem.id,
        googleConnectionId: connection.id,
        jobName: `${mediaItem.name} Search Console query-page sync`,
        jobType: GoogleSyncJobType.GSC_QUERY_PAGE_DAILY,
        targetPropertyId: searchConsoleProperty.id,
        syncSource: GoogleSyncSource.SEARCH_CONSOLE,
        defaultDays: 28,
        maxDays: 90,
        status: GoogleSyncJobStatus.ACTIVE,
      },
    });

    await prisma.googleSyncRun.upsert({
      where: { id: `seed-google-sync-run-ga4-${mediaItem.id}` },
      update: {
        status: GoogleSyncRunStatus.SUCCESS,
        savedRows: 28,
        apiCalls: 1,
      },
      create: {
        id: `seed-google-sync-run-ga4-${mediaItem.id}`,
        googleSyncJobId: ga4Job.id,
        mediaId: mediaItem.id,
        googleConnectionId: connection.id,
        runType: GoogleSyncRunType.MOCK,
        status: GoogleSyncRunStatus.SUCCESS,
        periodStart: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        startedAt: new Date(),
        finishedAt: new Date(),
        requestedRows: 28,
        savedRows: 28,
        apiCalls: 1,
        quotaConsumed: 1,
      },
    });

    await prisma.googleSyncRun.upsert({
      where: { id: `seed-google-sync-run-gsc-${mediaItem.id}` },
      update: {
        status: GoogleSyncRunStatus.SUCCESS,
        savedRows: 28,
        apiCalls: 1,
      },
      create: {
        id: `seed-google-sync-run-gsc-${mediaItem.id}`,
        googleSyncJobId: gscJob.id,
        mediaId: mediaItem.id,
        googleConnectionId: connection.id,
        runType: GoogleSyncRunType.MOCK,
        status: GoogleSyncRunStatus.SUCCESS,
        periodStart: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        startedAt: new Date(),
        finishedAt: new Date(),
        requestedRows: 28,
        savedRows: 28,
        apiCalls: 1,
        quotaConsumed: 1,
      },
    });

    await prisma.googleApiQuotaLog.upsert({
      where: { id: `seed-google-quota-ga4-${mediaItem.id}` },
      update: { success: true },
      create: {
        id: `seed-google-quota-ga4-${mediaItem.id}`,
        mediaId: mediaItem.id,
        googleConnectionId: connection.id,
        apiName: GoogleApiName.GA4,
        propertyId: ga4Property.propertyId,
        endpoint: "mock/analyticsdata/runReport",
        requestType: RequestType.GA4_MOCK_IMPORT,
        quotaCategory: GoogleQuotaCategory.GA4_CORE,
        tokensConsumed: 1,
        quotaRemaining: 9999,
        statusCode: 200,
        success: true,
      },
    });

    await prisma.googleApiErrorLog.upsert({
      where: { id: `seed-google-error-disabled-${mediaItem.id}` },
      update: {},
      create: {
        id: `seed-google-error-disabled-${mediaItem.id}`,
        mediaId: mediaItem.id,
        googleConnectionId: connection.id,
        apiName: GoogleApiName.GOOGLE_OAUTH,
        endpoint: "local/google-real-connection",
        requestType: RequestType.GOOGLE_CONNECTION_TEST,
        errorMessage:
          "Seed note: real Google API connection is disabled by default.",
        retryable: false,
        actionRequired: GoogleApiActionRequired.REAUTHORIZE,
      },
    });
  }
}

async function seedPhase7() {
  for (const [key, value] of Object.entries(defaultSettings).filter(
    ([key]) =>
      key.startsWith("OPERATIONS_") ||
      key.startsWith("SCHEDULED_") ||
      key.startsWith("SYNC_") ||
      key.startsWith("GA4_SCHEDULED_") ||
      key.startsWith("GSC_") ||
      key.startsWith("ALERT_") ||
      key.startsWith("DATA_FRESHNESS_") ||
      key.startsWith("NOTIFICATION_") ||
      key.endsWith("_DROP_THRESHOLD_PERCENT") ||
      key === "API_ERROR_SPIKE_THRESHOLD" ||
      key === "GROWTH_SCORE_AUTO_RECALC_ENABLED" ||
      key === "GROWTH_SCORE_RECALC_CRON" ||
      key === "GSB_WEEKLY_REPORT_ENABLED" ||
      key === "GSB_WEEKLY_REPORT_CRON",
  )) {
    await prisma.operationSetting.upsert({
      where: { key },
      update: {
        value,
        valueType:
          value === "true" || value === "false"
            ? OperationSettingValueType.BOOLEAN
            : Number.isFinite(Number(value))
              ? OperationSettingValueType.NUMBER
              : OperationSettingValueType.STRING,
      },
      create: {
        key,
        value,
        valueType:
          value === "true" || value === "false"
            ? OperationSettingValueType.BOOLEAN
            : Number.isFinite(Number(value))
              ? OperationSettingValueType.NUMBER
              : OperationSettingValueType.STRING,
        description: "Phase 7 operations setting",
      },
    });
  }

  const taskSeeds = [
    [
      "ga4-daily-sync",
      "GA4 Daily Sync",
      ScheduledTaskType.GA4_SYNC,
      defaultSettings.GA4_SCHEDULED_SYNC_CRON,
      false,
      true,
    ],
    [
      "gsc-query-daily-sync",
      "GSC Query Daily Sync",
      ScheduledTaskType.GSC_QUERY_SYNC,
      defaultSettings.GSC_SCHEDULED_SYNC_CRON,
      false,
      true,
    ],
    [
      "gsc-page-daily-sync",
      "GSC Page Daily Sync",
      ScheduledTaskType.GSC_PAGE_SYNC,
      "35 3 * * *",
      false,
      true,
    ],
    [
      "gsc-query-page-daily-sync",
      "GSC Query Page Daily Sync",
      ScheduledTaskType.GSC_QUERY_PAGE_SYNC,
      "40 3 * * *",
      false,
      true,
    ],
    [
      "data-freshness-check",
      "Data Freshness Check",
      ScheduledTaskType.DATA_FRESHNESS_CHECK,
      "0 6 * * *",
      true,
      false,
    ],
    [
      "seo-drop-detection",
      "SEO Drop Detection",
      ScheduledTaskType.SEO_DROP_DETECTION,
      defaultSettings.ALERT_DETECTION_CRON,
      true,
      false,
    ],
    [
      "revenue-drop-detection",
      "Revenue Drop Detection",
      ScheduledTaskType.REVENUE_DROP_DETECTION,
      "10 6 * * *",
      true,
      false,
    ],
    [
      "social-drop-detection",
      "Social Drop Detection",
      ScheduledTaskType.SOCIAL_DROP_DETECTION,
      "20 6 * * *",
      true,
      false,
    ],
    [
      "api-error-spike",
      "API Error Spike",
      ScheduledTaskType.API_ERROR_SPIKE,
      "30 6 * * *",
      true,
      false,
    ],
    [
      "growth-score-recalc",
      "Growth Score Recalc",
      ScheduledTaskType.GROWTH_SCORE_RECALC,
      defaultSettings.GROWTH_SCORE_RECALC_CRON,
      false,
      true,
    ],
    [
      "gsb-weekly-report",
      "GSB Weekly Report",
      ScheduledTaskType.GSB_WEEKLY_REPORT,
      defaultSettings.GSB_WEEKLY_REPORT_CRON,
      false,
      true,
    ],
    [
      "operations-health-check",
      "Health Check",
      ScheduledTaskType.HEALTH_CHECK,
      "*/30 * * * *",
      true,
      false,
    ],
  ] as const;

  const nextRunAt = new Date(Date.now() + 60 * 60 * 1000);
  for (const [
    taskKey,
    taskName,
    taskType,
    cronExpression,
    enabled,
    dryRun,
  ] of taskSeeds) {
    await prisma.scheduledTask.upsert({
      where: { taskKey },
      update: {
        taskName,
        taskType,
        cronExpression,
        enabled,
        dryRun,
        status: enabled
          ? ScheduledTaskStatus.ACTIVE
          : ScheduledTaskStatus.DISABLED,
        nextRunAt,
      },
      create: {
        taskKey,
        taskName,
        taskType,
        cronExpression,
        enabled,
        dryRun,
        status: enabled
          ? ScheduledTaskStatus.ACTIVE
          : ScheduledTaskStatus.DISABLED,
        nextRunAt,
        metadata: { seeded: true, phase: 7 },
      },
    });
  }

  const channels = [
    [
      "in-app",
      "In-app notification center",
      NotificationChannelType.IN_APP,
      NotificationChannelStatus.ENABLED,
      true,
    ],
    [
      "mock-outbox",
      "Mock outbox",
      NotificationChannelType.MOCK,
      NotificationChannelStatus.ENABLED,
      true,
    ],
    [
      "email-disabled",
      "Email notification disabled",
      NotificationChannelType.EMAIL,
      NotificationChannelStatus.DISABLED,
      true,
    ],
    [
      "slack-disabled",
      "Slack notification disabled",
      NotificationChannelType.SLACK,
      NotificationChannelStatus.DISABLED,
      true,
    ],
  ] as const;
  for (const [channelKey, name, channelType, status, mockMode] of channels) {
    await prisma.notificationChannel.upsert({
      where: { channelKey },
      update: { name, channelType, status, mockMode },
      create: { channelKey, name, channelType, status, mockMode },
    });
  }

  const alertRules = [
    [
      "data-freshness",
      "Data freshness warning",
      "DATA_FRESHNESS",
      "WARNING",
      null,
    ],
    [
      "api-error-spike",
      "API error spike",
      "API_ERROR_SPIKE",
      "CRITICAL",
      Number(defaultSettings.API_ERROR_SPIKE_THRESHOLD),
    ],
    ["sync-failure", "Scheduled sync failure", "SYNC_FAILURE", "WARNING", null],
    [
      "seo-clicks-drop",
      "SEO clicks drop",
      "SEO_CLICKS_DROP",
      "WARNING",
      Number(defaultSettings.SEO_CLICKS_DROP_THRESHOLD_PERCENT),
    ],
    [
      "seo-impressions-drop",
      "SEO impressions drop",
      "SEO_IMPRESSIONS_DROP",
      "WARNING",
      Number(defaultSettings.SEO_IMPRESSIONS_DROP_THRESHOLD_PERCENT),
    ],
    [
      "revenue-drop",
      "Revenue drop",
      "REVENUE_DROP",
      "CRITICAL",
      Number(defaultSettings.REVENUE_DROP_THRESHOLD_PERCENT),
    ],
    [
      "social-drop",
      "Social impressions drop",
      "SOCIAL_IMPRESSIONS_DROP",
      "WARNING",
      Number(defaultSettings.SOCIAL_IMPRESSIONS_DROP_THRESHOLD_PERCENT),
    ],
  ] as const;
  for (const [
    ruleKey,
    ruleName,
    ruleType,
    severity,
    thresholdValue,
  ] of alertRules) {
    await prisma.alertRule.upsert({
      where: { ruleKey },
      update: { ruleName, ruleType, severity, thresholdValue, enabled: true },
      create: {
        ruleKey,
        ruleName,
        ruleType,
        severity,
        thresholdValue,
        enabled: true,
      },
    });
  }

  await prisma.operationsHealthSnapshot.create({
    data: {
      status: "HEALTHY",
      summary:
        "Phase 7 seed health snapshot. Automation is disabled by default.",
      details: { automationEnabled: false, dryRunMode: true },
    },
  });
}

async function seedPhase8() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "asc" } });
  if (media.length === 0) return;

  for (const [index, mediaItem] of media.entries()) {
    const wpPost = await prisma.wordPressPost.findFirst({
      where: { mediaId: mediaItem.id },
      orderBy: { createdAt: "asc" },
    });
    const seoRecommendation = await prisma.seoRecommendation.findFirst({
      where: { mediaId: mediaItem.id },
      orderBy: { createdAt: "asc" },
    });
    const growthRecommendation = await prisma.growthRecommendation.findFirst({
      where: { mediaId: mediaItem.id },
      orderBy: { createdAt: "asc" },
    });
    const title =
      index === 0
        ? "CTR improvement: title rewrite task"
        : index === 1
          ? "CTA and affiliate placement improvement task"
          : index === 2
            ? "Add H2 section and FAQ task"
            : "Measurement-protected improvement task";
    const task = await prisma.articleImprovementTask.upsert({
      where: { id: `seed-improvement-task-${mediaItem.id}` },
      update: {
        taskTitle: title,
        wordpressPostId: wpPost?.id,
        status:
          index === 3
            ? ArticleImprovementStatus.MEASURING
            : ArticleImprovementStatus.PENDING_APPROVAL,
      },
      create: {
        id: `seed-improvement-task-${mediaItem.id}`,
        mediaId: mediaItem.id,
        wordpressPostId: wpPost?.id,
        seoRecommendationId: seoRecommendation?.id,
        growthRecommendationId: growthRecommendation?.id,
        taskTitle: title,
        taskType:
          index === 0
            ? ArticleImprovementTaskType.REWRITE_TITLE
            : index === 1
              ? ArticleImprovementTaskType.IMPROVE_AFFILIATE_PLACEMENT
              : index === 2
                ? ArticleImprovementTaskType.ADD_FAQ_SECTION
                : ArticleImprovementTaskType.COMPREHENSIVE_REWRITE,
        priority:
          index === 0
            ? ArticleImprovementPriority.HIGH
            : index === 3
              ? ArticleImprovementPriority.MONITOR
              : ArticleImprovementPriority.MEDIUM,
        status:
          index === 3
            ? ArticleImprovementStatus.MEASURING
            : ArticleImprovementStatus.PENDING_APPROVAL,
        sourceType: seoRecommendation
          ? ImprovementSourceType.SEO_RECOMMENDATION
          : ImprovementSourceType.MANUAL,
        sourceId: seoRecommendation?.id,
        targetKeyword: mediaItem.niche,
        targetUrl: wpPost?.wordpressPostUrl ?? mediaItem.wordpressUrl,
        reason: "Seeded Phase 8 workflow item for article improvement review.",
        expectedImpact:
          "Improve SEO clarity, reader action, and measurable article performance.",
      },
    });

    if (seoRecommendation) {
      await prisma.improvementTaskSource.upsert({
        where: {
          articleImprovementTaskId_sourceType_sourceId: {
            articleImprovementTaskId: task.id,
            sourceType: ImprovementSourceType.SEO_RECOMMENDATION,
            sourceId: seoRecommendation.id,
          },
        },
        update: {},
        create: {
          articleImprovementTaskId: task.id,
          sourceType: ImprovementSourceType.SEO_RECOMMENDATION,
          sourceId: seoRecommendation.id,
        },
      });
    }
    if (!wpPost) continue;

    const safeHtml = wpPost.contentHtml.replace(
      /<script[\s\S]*?<\/script>/gi,
      "",
    );
    const snapshot = await prisma.articleRevisionSnapshot.upsert({
      where: { id: `seed-revision-before-${mediaItem.id}` },
      update: { contentHtml: safeHtml },
      create: {
        id: `seed-revision-before-${mediaItem.id}`,
        mediaId: mediaItem.id,
        wordpressPostId: wpPost.id,
        articleImprovementTaskId: task.id,
        snapshotType: ArticleRevisionSnapshotType.BEFORE,
        wordpressPostStatus: wpPost.status,
        wordpressModifiedGmt: wpPost.lastSyncedAt,
        title: wpPost.title,
        slug: wpPost.slug,
        excerpt: wpPost.excerpt,
        contentHtml: safeHtml,
        contentText: safeHtml.replace(/<[^>]+>/g, " "),
        metaDescription: wpPost.seoDescription,
        canonicalUrl: wpPost.wordpressPostUrl,
        contentHash: hashIdentifier(safeHtml) ?? "empty",
      },
    });

    const draft = await prisma.rewriteDraft.upsert({
      where: { id: `seed-rewrite-draft-${mediaItem.id}` },
      update: {
        draftStatus: RewriteDraftStatus.PENDING_APPROVAL,
        approvedVersion: null,
      },
      create: {
        id: `seed-rewrite-draft-${mediaItem.id}`,
        articleImprovementTaskId: task.id,
        mediaId: mediaItem.id,
        wordpressPostId: wpPost.id,
        draftTitle: `${title} draft`,
        draftStatus: RewriteDraftStatus.PENDING_APPROVAL,
        rewriteMode: RewriteMode.PARTIAL_REWRITE,
        version: 1,
        baseSnapshotId: snapshot.id,
        summary:
          "Seed mock rewrite draft. Human approval is required before WordPress draft update.",
      },
    });

    await prisma.rewriteSuggestion.upsert({
      where: { id: `seed-rewrite-suggestion-title-${mediaItem.id}` },
      update: { status: RewriteSuggestionStatus.PROPOSED },
      create: {
        id: `seed-rewrite-suggestion-title-${mediaItem.id}`,
        rewriteDraftId: draft.id,
        suggestionType: RewriteSuggestionType.TITLE,
        targetField: RewriteTargetField.TITLE,
        beforeText: wpPost.title,
        afterText: `${wpPost.title} - reviewed comparison and cautions`,
        reason: "Improve CTR while keeping the claim reviewable.",
        riskLevel: RewriteRiskLevel.LOW,
        status: RewriteSuggestionStatus.PROPOSED,
        version: 1,
      },
    });

    await prisma.contentChangeSet.upsert({
      where: { id: `seed-content-change-${mediaItem.id}` },
      update: { status: ContentChangeStatus.PROPOSED },
      create: {
        id: `seed-content-change-${mediaItem.id}`,
        rewriteDraftId: draft.id,
        articleImprovementTaskId: task.id,
        changeType: ContentChangeType.INSERT,
        targetField: RewriteTargetField.CONTENT_HTML,
        beforeValue: safeHtml,
        afterValue: `${safeHtml}<h2>Review checklist</h2><p>Confirm cost, risk, and official details before acting.</p>`,
        beforeHash: hashIdentifier(safeHtml) ?? "empty-before",
        afterHash: hashIdentifier(`${safeHtml}after`) ?? "empty-after",
        diffSummary: "Seed diff: add review checklist section.",
        diffJson: { added: ["Review checklist"], removed: [] },
        version: 1,
        status: ContentChangeStatus.PROPOSED,
      },
    });

    await prisma.rewriteApproval.upsert({
      where: { id: `seed-rewrite-approval-${mediaItem.id}` },
      update: {},
      create: {
        id: `seed-rewrite-approval-${mediaItem.id}`,
        articleImprovementTaskId: task.id,
        rewriteDraftId: draft.id,
        version: 1,
        decision: "CHANGES_REQUESTED",
        comment: "Seed review history. Approval is intentionally not final.",
      },
    });

    const riskStatus =
      index === 1
        ? RewriteRiskCheckStatus.WARNING
        : RewriteRiskCheckStatus.PASSED;
    await prisma.rewriteRiskCheck.upsert({
      where: { id: `seed-rewrite-risk-${mediaItem.id}` },
      update: { status: riskStatus },
      create: {
        id: `seed-rewrite-risk-${mediaItem.id}`,
        rewriteDraftId: draft.id,
        status: riskStatus,
        maxRiskLevel:
          index === 1 ? RewriteRiskLevel.MEDIUM : RewriteRiskLevel.LOW,
        warningCount: index === 1 ? 1 : 0,
        findings:
          index === 1
            ? [
                {
                  level: "MEDIUM",
                  message: "Affiliate placement requires human review.",
                },
              ]
            : [],
      },
    });

    const safetyStatus =
      index === 0
        ? WordPressRewriteSafetyStatus.FAILED
        : WordPressRewriteSafetyStatus.PASSED;
    const safety = await prisma.wordPressRewriteSafetyCheck.upsert({
      where: { id: `seed-wordpress-safety-${mediaItem.id}` },
      update: { status: safetyStatus },
      create: {
        id: `seed-wordpress-safety-${mediaItem.id}`,
        rewriteDraftId: draft.id,
        status: safetyStatus,
        updateMode: WordPressRewriteUpdateMode.CREATE_NEW_DRAFT,
        wordpressModifiedGmt: wpPost.lastSyncedAt,
        expectedVersion: 1,
        approvedVersion: null,
        reason:
          safetyStatus === WordPressRewriteSafetyStatus.FAILED
            ? "Seed: not approved yet, WordPress update blocked."
            : "Seed: mock update is allowed after approval.",
      },
    });

    await prisma.wordPressDraftUpdate.upsert({
      where: { id: `seed-wordpress-draft-update-${mediaItem.id}` },
      update: {},
      create: {
        id: `seed-wordpress-draft-update-${mediaItem.id}`,
        rewriteDraftId: draft.id,
        wordpressPostId: wpPost.id,
        updateMode: WordPressRewriteUpdateMode.CREATE_NEW_DRAFT,
        status:
          safetyStatus === WordPressRewriteSafetyStatus.FAILED
            ? WordPressDraftUpdateStatus.BLOCKED
            : WordPressDraftUpdateStatus.MOCK_UPDATED,
        mockMode: true,
        wordpressDraftId: `mock-seed-${mediaItem.id}`,
        wordpressDraftUrl: wpPost.wordpressPostUrl,
        safetyCheckId: safety.id,
        requestSummary: "Seed mock update. No published post was modified.",
        responseSummary: "Seed mock WordPress draft update record.",
      },
    });

    await prisma.seoImpactMeasurement.upsert({
      where: { id: `seed-seo-impact-${mediaItem.id}` },
      update: {},
      create: {
        id: `seed-seo-impact-${mediaItem.id}`,
        articleImprovementTaskId: task.id,
        mediaId: mediaItem.id,
        wordpressPostId: wpPost.id,
        status:
          index === 3
            ? SeoImpactStatus.INSUFFICIENT_DATA
            : SeoImpactStatus.PENDING,
        verdict: SeoImpactVerdict.INSUFFICIENT_DATA,
        beforeStart: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000),
        beforeEnd: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
        afterStart: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        afterEnd: new Date(),
        beforeClicks: 18 + index,
        afterClicks: index === 3 ? 3 : 22 + index,
        beforeImpressions: 420 + index * 50,
        afterImpressions: index === 3 ? 80 : 520 + index * 60,
        beforeCtr: 0.04,
        afterCtr: 0.045,
        beforeAveragePosition: 14,
        afterAveragePosition: 12,
        dataConfidence:
          index === 3 ? DataConfidence.INSUFFICIENT : DataConfidence.LOW,
        summary:
          index === 3
            ? "Seed measurement is protected because data is insufficient."
            : "Seed impact measurement placeholder.",
      },
    });

    await prisma.improvementExecutionLog.upsert({
      where: { id: `seed-improvement-log-${mediaItem.id}` },
      update: {},
      create: {
        id: `seed-improvement-log-${mediaItem.id}`,
        articleImprovementTaskId: task.id,
        rewriteDraftId: draft.id,
        eventType: ImprovementExecutionEventType.TASK_CREATED,
        message: "Seed Phase 8 article improvement workflow created.",
      },
    });
  }
}

async function seedPhase9() {
  const socialAccounts = await prisma.socialAccount.findMany({
    where: { platform: Platform.X },
    include: { media: true },
    take: 6,
  });

  for (const [index, account] of socialAccounts.entries()) {
    const connection = await prisma.socialApiConnection.upsert({
      where: { id: `seed-social-api-connection-${account.id}` },
      update: {},
      create: {
        id: `seed-social-api-connection-${account.id}`,
        mediaId: account.mediaId,
        socialAccountId: account.id,
        platform: Platform.X,
        connectionName: `${account.handle} X mock connection`,
        accountHandle: account.handle,
        accountDisplayName: account.displayName,
        platformUserId: `mock-user-${index + 1}`,
        connectionStatus: SocialApiConnectionStatus.MOCK_CONNECTED,
        mockMode: true,
        lastConnectedAt: new Date(),
      },
    });

    await prisma.socialApiToken.upsert({
      where: { id: `seed-social-api-token-${account.id}` },
      update: {},
      create: {
        id: `seed-social-api-token-${account.id}`,
        socialApiConnectionId: connection.id,
        platform: Platform.X,
        scopes: defaultSettings.X_OAUTH_SCOPES,
        refreshTokenAvailable: false,
      },
    });

    await prisma.socialPostTemplate.upsert({
      where: { id: `seed-social-template-${account.mediaId}` },
      update: {},
      create: {
        id: `seed-social-template-${account.mediaId}`,
        mediaId: account.mediaId,
        platform: Platform.X,
        templateName: "Article traffic template",
        templateText: "{hook}\n\n詳しくは記事で確認: {url}",
      },
    });

    const wordpressPost = await prisma.wordPressPost.findFirst({
      where: { mediaId: account.mediaId },
    });
    const creativeAsset = await prisma.creativeAsset.findFirst({
      where: { mediaId: account.mediaId },
    });
    const scheduledAt = new Date(Date.now() + (index + 1) * 60 * 60 * 1000);
    const isBlockedSeed = index === 2;
    const isPostedSeed = index === 1;
    const queueId = `seed-social-queue-${account.id}`;
    const linkUrl = isBlockedSeed
      ? "https://px.a8.net/example"
      : account.media.wordpressUrl;
    const queue = await prisma.socialPostQueue.upsert({
      where: { id: queueId },
      update: {},
      create: {
        id: queueId,
        mediaId: account.mediaId,
        socialAccountId: account.id,
        wordpressPostId: wordpressPost?.id,
        creativeAssetId: creativeAsset?.id,
        socialApiConnectionId: connection.id,
        platform: Platform.X,
        sourceType: wordpressPost
          ? SocialPostSourceType.WORDPRESS_POST
          : SocialPostSourceType.MANUAL,
        sourceId: wordpressPost?.id,
        queueStatus: isBlockedSeed
          ? SocialPostQueueStatus.MANUAL_REVIEW
          : isPostedSeed
            ? SocialPostQueueStatus.POSTED
            : SocialPostQueueStatus.SCHEDULED,
        approvalStatus: isBlockedSeed
          ? SocialPostApprovalStatus.PENDING
          : SocialPostApprovalStatus.APPROVED,
        linkCheckStatus: isBlockedSeed
          ? SocialPostCheckStatus.BLOCKED
          : SocialPostCheckStatus.PASSED,
        riskCheckStatus: isBlockedSeed
          ? SocialPostCheckStatus.BLOCKED
          : SocialPostCheckStatus.PASSED,
        dedupCheckStatus: SocialPostCheckStatus.PASSED,
        rateLimitStatus: SocialRateLimitStatus.OK,
        manualReviewStatus: isBlockedSeed
          ? SocialManualReviewStatus.OPEN
          : null,
        postText: isBlockedSeed
          ? "A8 direct affiliate URL is intentionally blocked in Phase 9 seed. https://px.a8.net/example"
          : `${account.media.niche}の比較ポイントを記事に整理しました。Xは集客用としてWordPressへ送客します。`,
        linkUrl,
        destinationUrl: linkUrl,
        imageUrl: creativeAsset?.publicUrl,
        scheduledAt: isPostedSeed ? null : scheduledAt,
        requestIdempotencyKey: `seed-phase9-${account.id}`,
        platformPostId: isPostedSeed ? `mock-x-seed-${index}` : null,
        platformPostUrl: isPostedSeed
          ? `https://x.com/mock/status/mock-x-seed-${index}`
          : null,
        postedAt: isPostedSeed
          ? new Date(Date.now() - 24 * 60 * 60 * 1000)
          : null,
        madeWithAi: false,
        paidPartnership: false,
        utmCampaign: "growth_lab_phase9",
        failureReason: isBlockedSeed
          ? "Direct affiliate links are blocked for X."
          : null,
      },
    });

    await prisma.socialPostSafetyCheck.upsert({
      where: { id: `seed-social-safety-${account.id}` },
      update: {},
      create: {
        id: `seed-social-safety-${account.id}`,
        socialPostQueueId: queue.id,
        status: isBlockedSeed
          ? SocialPostCheckStatus.BLOCKED
          : SocialPostCheckStatus.PASSED,
        linkCheckStatus: isBlockedSeed
          ? SocialPostCheckStatus.BLOCKED
          : SocialPostCheckStatus.PASSED,
        riskCheckStatus: isBlockedSeed
          ? SocialPostCheckStatus.BLOCKED
          : SocialPostCheckStatus.PASSED,
        dedupCheckStatus: SocialPostCheckStatus.PASSED,
        rateLimitStatus: SocialRateLimitStatus.OK,
        approvalStatus: isBlockedSeed
          ? SocialPostApprovalStatus.PENDING
          : SocialPostApprovalStatus.APPROVED,
        manualReviewRequired: isBlockedSeed,
        reasons: isBlockedSeed
          ? ["Direct affiliate links are blocked for X posts."]
          : ["Seed safety gate passed."],
      },
    });

    if (isPostedSeed) {
      await prisma.socialPostExecution.upsert({
        where: { id: `seed-social-execution-${account.id}` },
        update: {},
        create: {
          id: `seed-social-execution-${account.id}`,
          socialPostQueueId: queue.id,
          socialApiConnectionId: connection.id,
          status: SocialPostExecutionStatus.MOCK_POSTED,
          platform: Platform.X,
          requestIdempotencyKey: queue.requestIdempotencyKey,
          platformPostId: queue.platformPostId,
          platformPostUrl: queue.platformPostUrl,
          endpoint: "/2/tweets",
          httpStatus: 200,
          responseSummary: "Seed mock post execution.",
          finishedAt: new Date(),
          mockMode: true,
        },
      });
    }

    await prisma.socialMediaUpload.upsert({
      where: { id: `seed-social-media-upload-${account.id}` },
      update: {},
      create: {
        id: `seed-social-media-upload-${account.id}`,
        socialPostQueueId: queue.id,
        creativeAssetId: creativeAsset?.id,
        platform: Platform.X,
        uploadStatus: creativeAsset
          ? SocialMediaUploadStatus.MOCK_UPLOADED
          : SocialMediaUploadStatus.QUEUED,
        mediaIdOnPlatform: creativeAsset ? `mock-media-${index + 1}` : null,
        mimeType: creativeAsset?.mimeType,
        fileSize: creativeAsset?.fileSize,
        madeWithAi: creativeAsset?.madeWithAi ?? true,
      },
    });

    await prisma.socialPostRateLimitLog.upsert({
      where: { id: `seed-social-rate-${account.id}` },
      update: {},
      create: {
        id: `seed-social-rate-${account.id}`,
        socialApiConnectionId: connection.id,
        socialPostQueueId: queue.id,
        platform: Platform.X,
        endpoint: "/2/tweets",
        limit: 50,
        remaining: 49 - index,
        resetAt: new Date(Date.now() + 15 * 60 * 1000),
        status: SocialRateLimitStatus.OK,
      },
    });

    await prisma.socialPostPerformanceSnapshot.upsert({
      where: { id: `seed-social-performance-${account.id}` },
      update: {},
      create: {
        id: `seed-social-performance-${account.id}`,
        socialPostQueueId: queue.id,
        socialAccountId: account.id,
        mediaId: account.mediaId,
        platform: Platform.X,
        platformPostId: queue.platformPostId,
        snapshotDate: new Date(),
        impressions: 400 + index * 120,
        engagements: 22 + index * 4,
        likes: 14 + index * 3,
        reposts: 3 + index,
        replies: 2,
        urlClicks: 7 + index,
        engagementRate: 0.05,
        source: SocialPerformanceSource.MOCK,
        dataConfidence: DataConfidence.INSUFFICIENT,
      },
    });

    await prisma.socialPostAttribution.upsert({
      where: { id: `seed-social-attribution-${account.id}` },
      update: {},
      create: {
        id: `seed-social-attribution-${account.id}`,
        socialPostQueueId: queue.id,
        mediaId: account.mediaId,
        wordpressPostId: wordpressPost?.id,
        date: new Date(),
        sessions: 10 + index,
        conversions: index === 0 ? 0 : 1,
        approvedRevenue: index === 0 ? 0 : 500,
        source: SocialPerformanceSource.MOCK,
        dataConfidence: DataConfidence.INSUFFICIENT,
      },
    });

    await prisma.socialImprovementSuggestion.upsert({
      where: { id: `seed-social-suggestion-${account.id}` },
      update: {},
      create: {
        id: `seed-social-suggestion-${account.id}`,
        mediaId: account.mediaId,
        socialAccountId: account.id,
        socialPostQueueId: queue.id,
        suggestionType: isBlockedSeed
          ? SocialImprovementSuggestionType.LINK_TO_UPDATED_ARTICLE
          : SocialImprovementSuggestionType.IMPROVE_CTA,
        priority: isBlockedSeed ? 10 : 40,
        title: isBlockedSeed
          ? "Replace direct affiliate URL with WordPress article URL"
          : "Improve social CTA",
        description: isBlockedSeed
          ? "X投稿にはA8等の直接広告リンクを載せず、WordPress記事へ送客してください。"
          : "クリック率改善のため、記事で得られる具体的な便益を冒頭に出す案です。",
        expectedImpact: "Manual review required before queueing.",
        status: SocialImprovementSuggestionStatus.PROPOSED,
      },
    });

    await prisma.socialGrowthScoreSnapshot.upsert({
      where: { id: `seed-social-growth-score-${account.mediaId}` },
      update: {},
      create: {
        id: `seed-social-growth-score-${account.mediaId}`,
        mediaId: account.mediaId,
        periodStart: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        postingScore: 12,
        engagementScore: 10,
        trafficScore: 8,
        conversionScore: 5,
        riskScore: isBlockedSeed ? 5 : 18,
        totalScore: isBlockedSeed ? 40 : 53,
        recommendation:
          "Improve hooks and keep human approval. Do not increase posting automatically.",
        dataConfidence: DataConfidence.INSUFFICIENT,
        reasoning: "Seed uses mock SNS metrics only.",
      },
    });

    if (isBlockedSeed) {
      await prisma.socialPostManualReview.upsert({
        where: { id: `seed-social-manual-review-${account.id}` },
        update: {},
        create: {
          id: `seed-social-manual-review-${account.id}`,
          socialPostQueueId: queue.id,
          status: SocialManualReviewStatus.OPEN,
          reason: "Direct affiliate URL detected in X post.",
          reviewer: null,
        },
      });
    }
  }

  await prisma.apiUsageLog.upsert({
    where: { id: "seed-phase9-api-log" },
    update: {},
    create: {
      id: "seed-phase9-api-log",
      platform: Platform.SOCIAL_POSTING,
      eventType: ApiEventType.DRY_RUN,
      endpoint: "/2/tweets",
      requestType: RequestType.SOCIAL_POST_QUEUE_EXECUTE,
      mockMode: true,
      message: "Phase 9 seed created mock SNS queue and analytics data.",
    },
  });
}

async function seedPhase10() {
  const mediaList = await prisma.media.findMany({ take: 4 });
  for (const [index, media] of mediaList.entries()) {
    const periodStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const periodEnd = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
    const campaign = await prisma.campaign.upsert({
      where: { campaignCode: `phase10-${media.id}` },
      update: {},
      create: {
        id: `seed-campaign-${media.id}`,
        mediaId: media.id,
        campaignName: `${media.name} Phase 10 Campaign`,
        campaignCode: `phase10-${media.id}`,
        campaignType:
          index === 0
            ? CampaignType.SEO_GROWTH
            : index === 1
              ? CampaignType.CONVERSION_IMPROVEMENT
              : index === 2
                ? CampaignType.CONTENT_REFRESH
                : CampaignType.SNS_GROWTH,
        status: index === 3 ? CampaignStatus.ACTIVE : CampaignStatus.PLANNING,
        periodStart,
        periodEnd,
        owner: "local-admin",
        description: "Seeded Phase 10 cross-channel campaign.",
        primaryGoal:
          "Improve revenue, traffic, and campaign-level ROI without automatic budget changes.",
        targetAudience: media.niche,
        currency: defaultSettings.CAMPAIGN_ROI_DEFAULT_CURRENCY,
      },
    });

    await prisma.campaignObjective.upsert({
      where: { id: `seed-campaign-objective-${media.id}` },
      update: {},
      create: {
        id: `seed-campaign-objective-${media.id}`,
        campaignId: campaign.id,
        objectiveType:
          index === 0
            ? CampaignObjectiveType.SEARCH_CLICKS
            : CampaignObjectiveType.APPROVED_REVENUE,
        objectiveName:
          index === 0 ? "Search clicks growth" : "Approved revenue growth",
        targetValue: index === 0 ? 1200 : 50000,
        currentValue: index === 0 ? 420 : 18000,
        unit: index === 0 ? "clicks" : "JPY",
        priority: 20,
        status: CampaignObjectiveStatus.IN_PROGRESS,
      },
    });

    await prisma.campaignTarget.upsert({
      where: {
        campaignId_targetType_targetValue: {
          campaignId: campaign.id,
          targetType: CampaignTargetType.NICHE,
          targetValue: media.niche,
        },
      },
      update: {},
      create: {
        campaignId: campaign.id,
        targetType: CampaignTargetType.NICHE,
        targetValue: media.niche,
        description: "Seed target niche.",
      },
    });

    const wordpressPost = await prisma.wordPressPost.findFirst({
      where: { mediaId: media.id },
    });
    const socialQueue = await prisma.socialPostQueue.findFirst({
      where: { mediaId: media.id },
    });
    const creativeAsset = await prisma.creativeAsset.findFirst({
      where: { mediaId: media.id },
    });
    const revenueEvent = await prisma.revenueEvent.findFirst({
      where: { mediaId: media.id },
    });

    const items = [
      wordpressPost && {
        id: wordpressPost.id,
        type: CampaignItemType.WORDPRESS_POST,
        title: wordpressPost.title,
      },
      socialQueue && {
        id: socialQueue.id,
        type: CampaignItemType.SOCIAL_POST_QUEUE,
        title: socialQueue.postText.slice(0, 60),
      },
      creativeAsset && {
        id: creativeAsset.id,
        type: CampaignItemType.CREATIVE_ASSET,
        title: creativeAsset.title,
      },
      revenueEvent && {
        id: revenueEvent.id,
        type: CampaignItemType.REVENUE_EVENT,
        title: "Revenue event attribution source",
      },
    ].filter(Boolean) as Array<{
      id: string;
      type: CampaignItemType;
      title: string;
    }>;

    for (const item of items) {
      await prisma.campaignItem.upsert({
        where: {
          campaignId_itemType_itemId: {
            campaignId: campaign.id,
            itemType: item.type,
            itemId: item.id,
          },
        },
        update: {},
        create: {
          campaignId: campaign.id,
          itemType: item.type,
          itemId: item.id,
          itemTitle: item.title,
          allocationRate:
            item.type === CampaignItemType.REVENUE_EVENT ? 0.5 : 1,
          status:
            item.type === CampaignItemType.REVENUE_EVENT
              ? CampaignItemStatus.MEASURED
              : CampaignItemStatus.PLANNED,
          plannedAt: periodStart,
        },
      });
    }

    await prisma.campaignBudget.upsert({
      where: { id: `seed-campaign-budget-${media.id}` },
      update: {},
      create: {
        id: `seed-campaign-budget-${media.id}`,
        campaignId: campaign.id,
        mediaId: media.id,
        budgetType: CampaignBudgetType.CONTENT,
        plannedAmount: index === 1 ? 80000 : 30000,
        currency: campaign.currency,
        memo: "Seed Phase 10 planned cost.",
      },
    });

    await prisma.campaignCost.upsert({
      where: { id: `seed-campaign-cost-${media.id}` },
      update: {},
      create: {
        id: `seed-campaign-cost-${media.id}`,
        campaignId: campaign.id,
        mediaId: media.id,
        costType: CampaignBudgetType.CONTENT,
        actualAmount: index === 1 ? 70000 : index === 2 ? 0 : 18000,
        currency: campaign.currency,
        costDate: new Date(),
        source: CampaignCostSource.MOCK,
        memo:
          index === 2
            ? "Seed: missing actual cost creates low confidence."
            : "Seed Phase 10 actual cost.",
      },
    });

    await prisma.campaignRevenueAttribution.upsert({
      where: {
        campaignId_sourceType_sourceId: {
          campaignId: campaign.id,
          sourceType: AttributionSourceType.MOCK,
          sourceId: `seed-revenue-${media.id}`,
        },
      },
      update: {},
      create: {
        campaignId: campaign.id,
        mediaId: media.id,
        sourceType: AttributionSourceType.MOCK,
        sourceId: `seed-revenue-${media.id}`,
        allocationRate: index === 1 ? 0.4 : 1,
        pendingRevenue: index === 2 ? 45000 : 12000 + index * 10000,
        approvedRevenue:
          index === 1 ? 12000 : index === 2 ? 3000 : 16000 + index * 12000,
        conversionCount: index + 1,
        eventDate: new Date(),
        dataConfidence: DataConfidence.LOW,
        notes: "Seed attribution prevents double counting by source key.",
      },
    });

    const actualCost = index === 1 ? 70000 : index === 2 ? 0 : 18000;
    const pendingRevenue = index === 2 ? 45000 : 12000 + index * 10000;
    const approvedRevenue =
      index === 1 ? 12000 : index === 2 ? 3000 : 16000 + index * 12000;
    const costBase = actualCost || (index === 1 ? 80000 : 30000);
    await prisma.campaignRoiSnapshot.upsert({
      where: { calculationKey: `seed-roi-${media.id}` },
      update: {},
      create: {
        campaignId: campaign.id,
        mediaId: media.id,
        periodStart,
        periodEnd,
        pendingRevenue,
        approvedRevenue,
        plannedCost: index === 1 ? 80000 : 30000,
        actualCost,
        profitPending: pendingRevenue - costBase,
        profitApproved: approvedRevenue - costBase,
        roiPending: costBase > 0 ? (pendingRevenue - costBase) / costBase : 0,
        roiApproved: costBase > 0 ? (approvedRevenue - costBase) / costBase : 0,
        dataConfidence:
          actualCost > 0 ? DataConfidence.LOW : DataConfidence.INSUFFICIENT,
        calculationKey: `seed-roi-${media.id}`,
        warnings:
          actualCost === 0
            ? ["actual_cost_missing"]
            : index === 1
              ? ["low_roi"]
              : [],
      },
    });

    await prisma.campaignGrowthScoreSnapshot.upsert({
      where: { id: `seed-campaign-growth-${media.id}` },
      update: {},
      create: {
        id: `seed-campaign-growth-${media.id}`,
        campaignId: campaign.id,
        mediaId: media.id,
        periodStart,
        periodEnd,
        contentScore: 14,
        seoScore: 12,
        snsScore: 10,
        revenueScore: index === 1 ? 5 : 15,
        roiScore: index === 1 ? 3 : 14,
        executionScore: 10,
        riskScore: index === 1 ? 8 : 16,
        totalScore: index === 1 ? 62 : 91,
        dataConfidence: DataConfidence.LOW,
        reasoning:
          "Seed campaign growth score is advisory and requires human review.",
      },
    });

    await prisma.campaignRisk.upsert({
      where: { id: `seed-campaign-risk-${media.id}` },
      update: {},
      create: {
        id: `seed-campaign-risk-${media.id}`,
        campaignId: campaign.id,
        riskType:
          index === 1
            ? CampaignRiskType.LOW_ROI
            : index === 2
              ? CampaignRiskType.DATA_INSUFFICIENT
              : CampaignRiskType.REPORT_OVERDUE,
        severity:
          index === 1
            ? CampaignRiskSeverity.CRITICAL
            : CampaignRiskSeverity.WARNING,
        status: CampaignRiskStatus.OPEN,
        title:
          index === 1 ? "Low ROI requires review" : "Campaign needs review",
        description:
          "Seed Phase 10 risk. It does not pause or alter the campaign automatically.",
      },
    });

    await prisma.campaignRecommendation.upsert({
      where: { id: `seed-campaign-recommendation-${media.id}` },
      update: {},
      create: {
        id: `seed-campaign-recommendation-${media.id}`,
        campaignId: campaign.id,
        recommendationType:
          index === 1
            ? CampaignRecommendationType.REVIEW_LOW_ROI
            : CampaignRecommendationType.IMPROVE_CTA,
        priority: index === 1 ? 10 : 40,
        title:
          index === 1
            ? "Review low ROI campaign before continuing"
            : "Improve CTA and content alignment",
        description:
          "Seed recommendation requires human review before task conversion.",
        expectedImpact: "Better campaign ROI after manual review.",
        status: CampaignRecommendationStatus.PROPOSED,
        requiresHumanReview: true,
      },
    });

    await prisma.campaignMilestone.upsert({
      where: { id: `seed-campaign-milestone-${media.id}` },
      update: {},
      create: {
        id: `seed-campaign-milestone-${media.id}`,
        campaignId: campaign.id,
        title: "Review campaign report",
        dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: index === 3 ? "IN_PROGRESS" : "NOT_STARTED",
        description: "Seed milestone.",
      },
    });

    const calendarEvent = await prisma.contentCalendarEvent.upsert({
      where: { id: `seed-calendar-event-${media.id}` },
      update: {},
      create: {
        id: `seed-calendar-event-${media.id}`,
        campaignId: campaign.id,
        mediaId: media.id,
        eventType:
          index === 3
            ? CalendarEventType.SNS_POST
            : CalendarEventType.WORDPRESS_PUBLISH,
        status: CalendarEventStatus.PLANNED,
        title: `${campaign.campaignName} content slot`,
        scheduledAt: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000),
        itemType: wordpressPost
          ? CampaignItemType.WORDPRESS_POST
          : CampaignItemType.SOCIAL_POST_QUEUE,
        itemId: wordpressPost?.id ?? socialQueue?.id,
        requiresApproval: true,
        approvalStatus: index === 0 ? "APPROVED" : "PENDING",
        linkCheckStatus: index === 0 ? "PASSED" : "NOT_CHECKED",
        hasCreative: Boolean(creativeAsset) && index !== 2,
        notes: "Seed Phase 10 calendar event.",
      },
    });

    if (index !== 0) {
      await prisma.contentCalendarConflict.upsert({
        where: { id: `seed-calendar-conflict-${media.id}` },
        update: {},
        create: {
          id: `seed-calendar-conflict-${media.id}`,
          campaignId: campaign.id,
          calendarEventId: calendarEvent.id,
          conflictType:
            index === 2
              ? CalendarConflictType.MISSING_CREATIVE
              : CalendarConflictType.MISSING_APPROVAL,
          status: CalendarConflictStatus.OPEN,
          severity: CampaignRiskSeverity.WARNING,
          title: "Seed calendar conflict",
          description: "Approval or creative is missing before execution.",
        },
      });
    }

    const template = await prisma.reportTemplate.upsert({
      where: { id: `seed-report-template-${media.id}` },
      update: {},
      create: {
        id: `seed-report-template-${media.id}`,
        mediaId: media.id,
        reportType: ReportType.CAMPAIGN_SUMMARY,
        templateName: "Campaign summary template",
        sectionOrder: ["summary", "kpi", "roi", "risks", "recommendations"],
      },
    });

    await prisma.reportSchedule.upsert({
      where: { id: `seed-report-schedule-${media.id}` },
      update: {},
      create: {
        id: `seed-report-schedule-${media.id}`,
        mediaId: media.id,
        campaignId: campaign.id,
        reportTemplateId: template.id,
        reportType: ReportType.CAMPAIGN_SUMMARY,
        period: ReportPeriod.WEEKLY,
        cronExpression: "0 9 * * 1",
        enabled: false,
        nextRunAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const report = await prisma.generatedReport.upsert({
      where: { generationKey: `seed-report-${media.id}` },
      update: {},
      create: {
        mediaId: media.id,
        campaignId: campaign.id,
        reportTemplateId: template.id,
        reportType: ReportType.CAMPAIGN_SUMMARY,
        status: GeneratedReportStatus.READY_FOR_REVIEW,
        periodStart,
        periodEnd,
        title: `${campaign.campaignName} report`,
        summary: "Seed report ready for human review.",
        contentMarkdown: `# ${campaign.campaignName}\n\nPending revenue and approved revenue are shown separately.\n`,
        dataJson: { campaignCode: campaign.campaignCode, data_source: "seed" },
        sourceSummaryJson: { periodStart, periodEnd, data_source: "seed" },
        dataSource: "seed",
        generationKey: `seed-report-${media.id}`,
        requiresHumanReview: true,
      },
    });

    await prisma.reportSection.upsert({
      where: {
        generatedReportId_sectionKey: {
          generatedReportId: report.id,
          sectionKey: "summary",
        },
      },
      update: {},
      create: {
        generatedReportId: report.id,
        sectionKey: "summary",
        sectionTitle: "Summary",
        sectionOrder: 1,
        contentMarkdown: "Seed campaign summary section.",
        dataJson: { safe: true },
      },
    });

    await prisma.reportExport.upsert({
      where: {
        generatedReportId_exportFormat: {
          generatedReportId: report.id,
          exportFormat: ReportExportFormat.MARKDOWN,
        },
      },
      update: {},
      create: {
        generatedReportId: report.id,
        exportFormat: ReportExportFormat.MARKDOWN,
        status: ReportExportStatus.MOCK_EXPORTED,
        filePath: `/mock-exports/${report.id}.markdown`,
        downloadUrl: `/mock-exports/${report.id}.markdown`,
        contentPreview: "# Mock campaign report",
      },
    });

    const insight = await prisma.businessInsight.upsert({
      where: { id: `seed-business-insight-${media.id}` },
      update: {},
      create: {
        id: `seed-business-insight-${media.id}`,
        mediaId: media.id,
        campaignId: campaign.id,
        insightType:
          index === 1
            ? BusinessInsightType.LOW_ROI_CAMPAIGN
            : index === 2
              ? BusinessInsightType.PENDING_REVENUE_GAP
              : BusinessInsightType.GROWTH_OPPORTUNITY,
        status: BusinessInsightStatus.PROPOSED,
        priority: index === 1 ? 10 : 40,
        title:
          index === 1
            ? "Low ROI campaign review"
            : "Campaign improvement opportunity",
        summary:
          "Seed business insight. Human review is required before action.",
        evidenceJson: { campaignCode: campaign.campaignCode },
        recommendation:
          "Convert to recommendation or task only after approval.",
        requiresHumanReview: true,
      },
    });

    await prisma.campaignRecommendation.updateMany({
      where: { id: `seed-campaign-recommendation-${media.id}` },
      data: { sourceInsightId: insight.id },
    });
  }

  await prisma.apiUsageLog.upsert({
    where: { id: "seed-phase10-api-log" },
    update: {},
    create: {
      id: "seed-phase10-api-log",
      platform: Platform.CAMPAIGN,
      eventType: ApiEventType.DRY_RUN,
      endpoint: "phase10.seed",
      requestType: RequestType.CAMPAIGN_CREATE,
      mockMode: true,
      message:
        "Phase 10 campaign, calendar, ROI, report, and insight seed created.",
    },
  });
}

async function main() {
  await seedSettings();

  for (const item of mediaSeeds) {
    const media = await prisma.media.upsert({
      where: { id: item.id },
      update: item,
      create: {
        ...item,
        notes: "Xでは広告リンクを直接載せず、登録メディアへ誘導する。",
      },
    });

    const account = await prisma.socialAccount.upsert({
      where: {
        platform_handle: {
          platform: Platform.X,
          handle: `@${media.id.replace("seed-media-", "")}_x`,
        },
      },
      update: {},
      create: {
        mediaId: media.id,
        platform: Platform.X,
        handle: `@${media.id.replace("seed-media-", "")}_x`,
        displayName: `${media.name}_X`,
        accountUrl: `https://x.com/${media.id.replace("seed-media-", "")}_x`,
        dailyLimit: Number(process.env.X_DAILY_POST_LIMIT ?? 50),
        windowLimit: Number(process.env.X_POST_WINDOW_LIMIT ?? 6),
        windowMinutes: Number(process.env.X_POST_WINDOW_MINUTES ?? 15),
        defaultPostTimes: process.env.DEFAULT_POST_TIMES ?? "08:00,12:30,20:00",
        autoPostingEnabled: true,
      },
    });

    const existingPosts = await prisma.post.count({
      where: { mediaId: media.id },
    });
    if (existingPosts === 0) {
      const scheduledAt = new Date();
      scheduledAt.setMinutes(scheduledAt.getMinutes() - 5);

      await prisma.post.createMany({
        data: [
          {
            mediaId: media.id,
            socialAccountId: account.id,
            platform: Platform.X,
            title: "承認待ち投稿",
            body: `${media.niche}で最初に確認したい選び方を整理しました。詳しくは記事で確認できます。`,
            destinationUrl: media.wordpressUrl,
            linkUrl: media.wordpressUrl,
            status: PostStatus.PENDING_APPROVAL,
            linkCheckStatus: LinkCheckStatus.SAFE,
            linkCheckReason: "登録済みメディアURLです。",
            detectedUrls: [media.wordpressUrl],
            checkedAt: new Date(),
            complianceNotes: "広告リンクをXに直接掲載しない。",
          },
          {
            mediaId: media.id,
            socialAccountId: account.id,
            platform: Platform.X,
            title: "予約済み投稿",
            body: `${media.niche}の比較ポイントを3つに分けてまとめました。`,
            destinationUrl: media.wordpressUrl,
            linkUrl: media.wordpressUrl,
            status: PostStatus.SCHEDULED,
            linkCheckStatus: LinkCheckStatus.SAFE,
            linkCheckReason: "登録済みメディアURLです。",
            detectedUrls: [media.wordpressUrl],
            checkedAt: new Date(),
            scheduledAt,
            complianceNotes: "承認済み、リンクチェック済み。",
          },
          {
            mediaId: media.id,
            socialAccountId: account.id,
            platform: Platform.X,
            title: "リンクブロック投稿",
            body: "この投稿には直接広告リンクが含まれています https://px.a8.net/example",
            destinationUrl: "https://px.a8.net/example",
            linkUrl: "https://px.a8.net/example",
            status: PostStatus.BLOCKED,
            linkCheckStatus: LinkCheckStatus.BLOCKED,
            linkCheckReason: "px.a8.net はPhase 1のブロック対象ドメインです。",
            detectedUrls: ["https://px.a8.net/example"],
            checkedAt: new Date(),
            failureReason: "直接広告リンクのためブロック。",
          },
        ],
      });

      await prisma.apiUsageLog.create({
        data: {
          socialAccountId: account.id,
          platform: Platform.X,
          eventType: ApiEventType.DRY_RUN,
          requestType: RequestType.MOCK_POST_CREATE,
          endpoint: "/2/tweets",
          method: "POST",
          statusCode: 200,
          success: true,
          mockMode: true,
          message: "seed: モック投稿ログ",
        },
      });
    }

    if (media.id === "seed-media-ai-side-business") {
      const site = await prisma.wordPressSite.upsert({
        where: {
          mediaId_siteUrl: {
            mediaId: media.id,
            siteUrl: "https://example.com",
          },
        },
        update: {
          connectionStatus: WordPressConnectionStatus.MOCK_CONNECTED,
          lastConnectedAt: new Date(),
        },
        create: {
          mediaId: media.id,
          siteName: "AI副業ラボ WordPress",
          siteUrl: "https://example.com",
          apiBaseUrl: "https://example.com/wp-json/wp/v2",
          username: "growth_lab_demo",
          mockMode: true,
          connectionStatus: WordPressConnectionStatus.MOCK_CONNECTED,
          lastConnectedAt: new Date(),
          defaultStatus: "draft",
          allowPublish: false,
          autoAddAllowedDomain: true,
        },
      });

      await prisma.wordPressPost.upsert({
        where: {
          wordpressSiteId_slug: {
            wordpressSiteId: site.id,
            slug: "ai-sidejob-tools-for-beginners",
          },
        },
        update: {},
        create: {
          mediaId: media.id,
          wordpressSiteId: site.id,
          title: "初心者向けAI副業ツールの選び方",
          slug: "ai-sidejob-tools-for-beginners",
          excerpt:
            "AI副業を始めたい初心者向けに、ツール選びの基準を整理します。",
          contentMarkdown:
            "## AI副業ツールを選ぶ前に確認したいこと\nAI副業を始める際は、目的に合ったツールを選ぶことが重要です。\n\n## 比較ポイント\n- 費用\n- 学習しやすさ\n- 継続しやすさ",
          contentHtml:
            "<h2>AI副業ツールを選ぶ前に確認したいこと</h2><p>AI副業を始める際は、目的に合ったツールを選ぶことが重要です。</p><h2>比較ポイント</h2><ul><li>費用</li><li>学習しやすさ</li><li>継続しやすさ</li></ul>",
          status: "draft",
          localStatus: WordPressLocalStatus.DRAFT_LOCAL,
          seoTitle: "AI副業ツールおすすめ比較｜初心者が失敗しない選び方",
          seoDescription:
            "AI副業を始めたい初心者向けに、ツール選びの基準、注意点、比較ポイントを解説します。",
          focusKeyword: "AI副業ツール 初心者",
        },
      });

      const categories = ["AI副業", "比較", "初心者向け"];
      await Promise.all(
        categories.map((name, index) =>
          prisma.wordPressCategory.upsert({
            where: {
              wordpressSiteId_wordpressCategoryId: {
                wordpressSiteId: site.id,
                wordpressCategoryId: index + 1,
              },
            },
            update: { name, slug: `cat-${index + 1}` },
            create: {
              wordpressSiteId: site.id,
              wordpressCategoryId: index + 1,
              name,
              slug: `cat-${index + 1}`,
            },
          }),
        ),
      );

      const tags = ["ChatGPT", "AIツール", "副業"];
      await Promise.all(
        tags.map((name, index) =>
          prisma.wordPressTag.upsert({
            where: {
              wordpressSiteId_wordpressTagId: {
                wordpressSiteId: site.id,
                wordpressTagId: index + 1,
              },
            },
            update: { name, slug: `tag-${index + 1}` },
            create: {
              wordpressSiteId: site.id,
              wordpressTagId: index + 1,
              name,
              slug: `tag-${index + 1}`,
            },
          }),
        ),
      );

      const canvaConnection = await prisma.canvaConnection.upsert({
        where: { id: "seed-canva-connection-ai-side-business" },
        update: {
          connectionStatus: CanvaConnectionStatus.MOCK_CONNECTED,
          lastConnectedAt: new Date(),
        },
        create: {
          id: "seed-canva-connection-ai-side-business",
          mediaId: media.id,
          connectionName: "AI side business Canva Mock",
          canvaUserId: "mock-canva-user",
          canvaUserEmail: "mock-canva@growth-lab.local",
          scopes: process.env.CANVA_OAUTH_SCOPES ?? "",
          connectionStatus: CanvaConnectionStatus.MOCK_CONNECTED,
          mockMode: true,
          lastConnectedAt: new Date(),
        },
      });

      await prisma.canvaBrandTemplate.upsert({
        where: { id: "seed-canva-template-featured-ai-side-business" },
        update: {},
        create: {
          id: "seed-canva-template-featured-ai-side-business",
          mediaId: media.id,
          canvaConnectionId: canvaConnection.id,
          templateName: "AI side business featured image 1200x630",
          canvaTemplateId: "mock-template-featured-ai-side-business",
          templateType: CanvaTemplateType.WORDPRESS_FEATURED_IMAGE,
          platform: Platform.WORDPRESS,
          aspectRatio: "1200:630",
          width: 1200,
          height: 630,
          autofillFields: {
            title: "TITLE",
            subtitle: "SUBTITLE",
            siteName: "SITE_NAME",
          },
          requiredFields: ["title"],
          optionalFields: ["subtitle", "siteName"],
          memo: "Phase 3 mock template",
        },
      });

      await prisma.canvaBrandTemplate.upsert({
        where: { id: "seed-canva-template-x-ai-side-business" },
        update: {},
        create: {
          id: "seed-canva-template-x-ai-side-business",
          mediaId: media.id,
          canvaConnectionId: canvaConnection.id,
          templateName: "AI side business X post image 1600x900",
          canvaTemplateId: "mock-template-x-ai-side-business",
          templateType: CanvaTemplateType.X_POST_IMAGE,
          platform: Platform.X,
          aspectRatio: "1600:900",
          width: 1600,
          height: 900,
          autofillFields: {
            title: "TITLE",
            subtitle: "SUBTITLE",
            siteName: "SITE_NAME",
          },
          requiredFields: ["title"],
          optionalFields: ["subtitle", "siteName"],
          memo: "Phase 3 mock template",
        },
      });

      const fileInfo = await seedMockImage(
        "seed-featured-ai-side-business.svg",
        "AI Tool Guide",
        1200,
        630,
      );
      await prisma.creativeAsset.upsert({
        where: { id: "seed-creative-asset-featured-ai-side-business" },
        update: {},
        create: {
          id: "seed-creative-asset-featured-ai-side-business",
          mediaId: media.id,
          source: CreativeAssetSource.AI_MOCK,
          assetType: CreativeAssetType.FEATURED_IMAGE,
          title: "AI Tool Guide featured image",
          description: "Seeded Phase 3 mock featured image.",
          altText: "AI Tool Guide featured image - Growth Lab Core",
          localFileUrl: "/generated-images/seed-featured-ai-side-business.svg",
          publicUrl: "/generated-images/seed-featured-ai-side-business.svg",
          mimeType: "image/svg+xml",
          fileSize: fileInfo.size,
          width: 1200,
          height: 630,
          approvalStatus: AssetApprovalStatus.PENDING_APPROVAL,
          riskCheckStatus: LinkCheckStatus.NOT_CHECKED,
          madeWithAi: true,
        },
      });
    }
  }

  await seedPhase4();
  await seedPhase5();
  await seedPhase7();
  await seedPhase8();
  await seedPhase9();
  await seedPhase10();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
