-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('X', 'WORDPRESS', 'CANVA', 'AFFILIATE', 'ANALYTICS', 'GROWTH_SCORE', 'OPERATIONS', 'SCHEDULER', 'ALERTS', 'NOTIFICATIONS', 'REPORTS', 'ARTICLE_IMPROVEMENT', 'REWRITE', 'IMPACT_MEASUREMENT', 'SOCIAL_API', 'SOCIAL_POSTING', 'SOCIAL_ANALYTICS', 'CAMPAIGN', 'CONTENT_CALENDAR', 'REPORT', 'BUSINESS_INSIGHT', 'INSTAGRAM', 'PINTEREST', 'THREADS', 'YOUTUBE', 'TIKTOK');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PLANNING', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'RATE_LIMITED', 'PAUSED', 'DISCONNECTED');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'CANCELLED', 'BLOCKED', 'STOPPED_RATE_LIMIT');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('TEXT', 'TEXT_WITH_LINK', 'IMAGE', 'IMAGE_WITH_LINK', 'THREAD');

-- CreateEnum
CREATE TYPE "LinkCheckStatus" AS ENUM ('NOT_CHECKED', 'SAFE', 'WARNING', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ApprovalDecision" AS ENUM ('APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ApiEventType" AS ENUM ('REQUEST', 'RATE_LIMIT', 'ERROR', 'POST_STOPPED', 'DRY_RUN');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('POST_CREATE', 'POST_METRICS', 'AUTH', 'MEDIA_UPLOAD', 'MOCK_POST_CREATE', 'LINK_CHECK', 'SYSTEM', 'WP_CONNECTION_TEST', 'WP_POST_DUPLICATE_CHECK', 'WP_POST_CREATE', 'WP_POST_UPDATE', 'WP_CATEGORY_SYNC', 'WP_TAG_SYNC', 'WP_MEDIA_MOCK_UPLOAD', 'WP_MOCK_POST_CREATE', 'CANVA_OAUTH_START', 'CANVA_OAUTH_CALLBACK', 'CANVA_TEMPLATE_LIST', 'CANVA_AUTOFILL_CREATE', 'CANVA_EXPORT_CREATE', 'CANVA_EXPORT_STATUS', 'CANVA_MOCK_AUTOFILL', 'CANVA_MOCK_EXPORT', 'WP_MEDIA_UPLOAD', 'WP_FEATURED_MEDIA_UPDATE', 'X_MEDIA_UPLOAD', 'X_POST_CREATE_WITH_MEDIA', 'AFFILIATE_MANUAL_PROGRAM_CREATE', 'AFFILIATE_CSV_IMPORT', 'AFFILIATE_REVENUE_MANUAL_CREATE', 'GROWTH_SCORE_CALCULATE', 'GSB_REPORT_CREATE', 'ANALYTICS_MOCK_IMPORT', 'GOOGLE_MOCK_CONNECT', 'GA4_PROPERTY_CREATE', 'GA4_CSV_IMPORT', 'GA4_MOCK_IMPORT', 'SEARCH_CONSOLE_PROPERTY_CREATE', 'SEARCH_CONSOLE_CSV_IMPORT', 'SEARCH_CONSOLE_MOCK_IMPORT', 'SEO_ANALYSIS_RUN', 'SEO_RECOMMENDATION_CREATE', 'GOOGLE_OAUTH_START', 'GOOGLE_OAUTH_CALLBACK', 'GOOGLE_TOKEN_REFRESH', 'GOOGLE_CONNECTION_TEST', 'GA4_API_SYNC', 'GA4_API_TEST', 'SEARCH_CONSOLE_API_SYNC', 'SEARCH_CONSOLE_API_TEST', 'GOOGLE_SYNC_JOB_RUN', 'SCHEDULED_TASK_RUN', 'SCHEDULED_TASK_DRY_RUN', 'DATA_FRESHNESS_CHECK', 'SEO_DROP_DETECTION', 'REVENUE_DROP_DETECTION', 'SOCIAL_DROP_DETECTION', 'GROWTH_SCORE_RECALC', 'GSB_WEEKLY_REPORT_CREATE', 'NOTIFICATION_CREATE', 'NOTIFICATION_SEND', 'ALERT_DETECTION_RUN', 'OPERATIONS_HEALTH_CHECK', 'IMPROVEMENT_TASK_CREATE', 'REWRITE_DRAFT_CREATE', 'CONTENT_DIFF_CREATE', 'REWRITE_RISK_CHECK', 'REWRITE_APPROVAL', 'REWRITE_APPROVAL_STALE', 'WORDPRESS_SAFETY_CHECK', 'WORDPRESS_DRAFT_MOCK_UPDATE', 'WORDPRESS_DRAFT_UPDATE', 'IMPACT_MEASUREMENT_CREATE', 'IMPACT_MEASUREMENT_CALCULATE', 'X_OAUTH_START', 'X_OAUTH_CALLBACK', 'X_TOKEN_REFRESH', 'X_CONNECTION_TEST', 'X_CREATE_POST', 'X_MOCK_POST', 'SOCIAL_SAFETY_CHECK', 'SOCIAL_POST_QUEUE_EXECUTE', 'SOCIAL_POST_MANUAL_REVIEW', 'SOCIAL_PERFORMANCE_SYNC', 'SOCIAL_ATTRIBUTION_CALCULATE', 'SOCIAL_IMPROVEMENT_SUGGESTION_CREATE', 'CAMPAIGN_CREATE', 'CAMPAIGN_ITEM_ATTACH', 'CAMPAIGN_ITEM_DUPLICATE_BLOCK', 'CAMPAIGN_ROI_CALCULATE', 'CAMPAIGN_GROWTH_SCORE_CALCULATE', 'CAMPAIGN_RECOMMENDATION_CREATE', 'CAMPAIGN_RISK_CREATE', 'CALENDAR_EVENT_CREATE', 'CALENDAR_CONFLICT_DETECT', 'REPORT_GENERATE', 'REPORT_EXPORT', 'BUSINESS_INSIGHT_CREATE');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('SEO_GROWTH', 'SNS_GROWTH', 'AFFILIATE_REVENUE', 'PRODUCT_LAUNCH', 'SEASONAL_CAMPAIGN', 'CONTENT_REFRESH', 'BRAND_AWARENESS', 'CONVERSION_IMPROVEMENT', 'MULTI_CHANNEL');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CampaignObjectiveType" AS ENUM ('ORGANIC_SESSIONS', 'SEARCH_CLICKS', 'SNS_URL_CLICKS', 'AFFILIATE_CLICKS', 'CONVERSIONS', 'APPROVED_REVENUE', 'PENDING_REVENUE', 'GROSS_PROFIT', 'ROI', 'ARTICLE_COUNT', 'POST_COUNT', 'GROWTH_SCORE');

-- CreateEnum
CREATE TYPE "CampaignObjectiveStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED', 'MISSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CampaignTargetType" AS ENUM ('MEDIA', 'NICHE', 'AUDIENCE', 'KEYWORD', 'PLATFORM', 'CHANNEL');

-- CreateEnum
CREATE TYPE "CampaignItemType" AS ENUM ('WORDPRESS_POST', 'POST', 'SOCIAL_POST_QUEUE', 'SOCIAL_POST_EXECUTION', 'CREATIVE_ASSET', 'AFFILIATE_PROGRAM', 'AFFILIATE_LINK', 'REVENUE_EVENT', 'ARTICLE_IMPROVEMENT_TASK', 'SEO_IMPACT_MEASUREMENT', 'SOCIAL_ATTRIBUTION', 'SOCIAL_PERFORMANCE', 'GROWTH_SCORE_SNAPSHOT', 'GSB_REPORT', 'ALERT_INCIDENT', 'NOTIFICATION_EVENT', 'API_USAGE_LOG', 'OPERATING_COST');

-- CreateEnum
CREATE TYPE "CampaignItemStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'READY', 'PUBLISHED', 'MEASURED', 'BLOCKED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CampaignBudgetType" AS ENUM ('CONTENT', 'CREATIVE', 'TOOL', 'OUTSOURCING', 'AD', 'OTHER');

-- CreateEnum
CREATE TYPE "CampaignCostSource" AS ENUM ('MANUAL', 'CSV', 'MOCK');

-- CreateEnum
CREATE TYPE "AttributionSourceType" AS ENUM ('REVENUE_EVENT', 'SOCIAL_POST_ATTRIBUTION', 'MANUAL', 'MOCK');

-- CreateEnum
CREATE TYPE "CampaignRecommendationType" AS ENUM ('IMPROVE_CTA', 'ADD_ARTICLE', 'RESHARE_SOCIAL', 'FIX_TRACKING', 'REDUCE_COST', 'REVIEW_LOW_ROI', 'RESOLVE_CALENDAR_CONFLICT', 'GENERATE_REPORT');

-- CreateEnum
CREATE TYPE "CampaignRecommendationStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'DONE', 'DISMISSED');

-- CreateEnum
CREATE TYPE "CampaignRiskType" AS ENUM ('OVER_BUDGET', 'LOW_ROI', 'DATA_INSUFFICIENT', 'REPORT_OVERDUE', 'CONTENT_DELAYED', 'TRACKING_MISSING', 'DOUBLE_COUNT_WARNING', 'CALENDAR_CONFLICT');

-- CreateEnum
CREATE TYPE "CampaignRiskSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CampaignRiskStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "CampaignMilestoneStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'DONE', 'DELAYED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CalendarEventType" AS ENUM ('WORDPRESS_PUBLISH', 'SNS_POST', 'CREATIVE_DUE', 'ARTICLE_IMPROVEMENT', 'CAMPAIGN_MILESTONE', 'REPORT_DUE');

-- CreateEnum
CREATE TYPE "CalendarEventStatus" AS ENUM ('PLANNED', 'READY', 'BLOCKED', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CalendarConflictType" AS ENUM ('TOO_MANY_POSTS_SAME_DAY', 'TOO_MANY_CAMPAIGNS_OVERLAP', 'MISSING_APPROVAL', 'MISSING_CREATIVE', 'MISSING_LINK_CHECK', 'MISSING_TRACKING');

-- CreateEnum
CREATE TYPE "CalendarConflictStatus" AS ENUM ('OPEN', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('CAMPAIGN_SUMMARY', 'CAMPAIGN_ROI', 'WEEKLY_OPERATIONS', 'MONTHLY_OPERATIONS', 'GROWTH_STRATEGY_BOARD', 'EXECUTIVE_SUMMARY');

-- CreateEnum
CREATE TYPE "ReportPeriod" AS ENUM ('WEEKLY', 'MONTHLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "GeneratedReportStatus" AS ENUM ('DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'EXPORTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReportExportFormat" AS ENUM ('MARKDOWN', 'CSV', 'JSON');

-- CreateEnum
CREATE TYPE "ReportExportStatus" AS ENUM ('MOCK_EXPORTED', 'EXPORTED', 'FAILED');

-- CreateEnum
CREATE TYPE "BusinessInsightType" AS ENUM ('HIGH_ROI_CAMPAIGN', 'LOW_ROI_CAMPAIGN', 'PENDING_REVENUE_GAP', 'TRACKING_ISSUE', 'CALENDAR_CONFLICT', 'REPORT_OVERDUE', 'GROWTH_OPPORTUNITY');

-- CreateEnum
CREATE TYPE "BusinessInsightStatus" AS ENUM ('PROPOSED', 'REVIEWED', 'CONVERTED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "SocialApiConnectionStatus" AS ENUM ('NOT_CONNECTED', 'MOCK_CONNECTED', 'CONNECTED', 'EXPIRED', 'FAILED', 'DISABLED', 'REVOKED', 'INSUFFICIENT_SCOPE', 'MISSING_REFRESH_TOKEN');

-- CreateEnum
CREATE TYPE "SocialPostQueueStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'READY', 'PROCESSING', 'POSTED', 'FAILED', 'BLOCKED', 'RATE_LIMITED', 'MANUAL_REVIEW', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SocialPostApprovalStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SocialPostCheckStatus" AS ENUM ('NOT_CHECKED', 'PASSED', 'WARNING', 'FAILED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SocialPostExecutionStatus" AS ENUM ('STARTED', 'MOCK_POSTED', 'POSTED', 'FAILED', 'RATE_LIMITED', 'UNKNOWN', 'MANUAL_REVIEW', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SocialMediaUploadStatus" AS ENUM ('QUEUED', 'MOCK_UPLOADED', 'UPLOADED', 'FAILED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "SocialRateLimitStatus" AS ENUM ('OK', 'WARNING', 'RATE_LIMITED', 'COOLDOWN');

-- CreateEnum
CREATE TYPE "SocialPostSourceType" AS ENUM ('WORDPRESS_POST', 'SEO_RECOMMENDATION', 'GROWTH_RECOMMENDATION', 'ARTICLE_IMPROVEMENT', 'MANUAL');

-- CreateEnum
CREATE TYPE "SocialPerformanceSource" AS ENUM ('API', 'CSV', 'MANUAL', 'MOCK');

-- CreateEnum
CREATE TYPE "SocialImprovementSuggestionType" AS ENUM ('REPOST_WITH_NEW_HOOK', 'IMPROVE_TIME', 'ADD_IMAGE', 'IMPROVE_CTA', 'REWRITE_TEXT', 'LINK_TO_UPDATED_ARTICLE', 'PAUSE_TOPIC');

-- CreateEnum
CREATE TYPE "SocialImprovementSuggestionStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'DONE', 'DISMISSED');

-- CreateEnum
CREATE TYPE "SocialManualReviewStatus" AS ENUM ('OPEN', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ArticleImprovementTaskType" AS ENUM ('REWRITE_TITLE', 'REWRITE_META_DESCRIPTION', 'ADD_H2_SECTION', 'ADD_FAQ_SECTION', 'REWRITE_BODY', 'ADD_INTERNAL_LINKS', 'IMPROVE_CTA', 'IMPROVE_AFFILIATE_PLACEMENT', 'UPDATE_OUTDATED_CONTENT', 'COMPREHENSIVE_REWRITE');

-- CreateEnum
CREATE TYPE "ArticleImprovementPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'MONITOR');

-- CreateEnum
CREATE TYPE "ArticleImprovementStatus" AS ENUM ('BACKLOG', 'DRAFTING', 'DIFF_REVIEW', 'PENDING_APPROVAL', 'APPROVED', 'WORDPRESS_DRAFT_UPDATED', 'MEASURING', 'DONE', 'REJECTED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ImprovementSourceType" AS ENUM ('SEO_OPPORTUNITY', 'SEO_RECOMMENDATION', 'ALERT_INCIDENT', 'GROWTH_RECOMMENDATION', 'MANUAL');

-- CreateEnum
CREATE TYPE "ArticleRevisionSnapshotType" AS ENUM ('BEFORE', 'AFTER_DRAFT', 'AFTER_APPROVED', 'AFTER_WORDPRESS_UPDATE');

-- CreateEnum
CREATE TYPE "RewriteMode" AS ENUM ('TITLE_ONLY', 'META_ONLY', 'SECTION_ADDITION', 'INTERNAL_LINKS', 'CTA_ONLY', 'PARTIAL_REWRITE', 'FULL_REWRITE');

-- CreateEnum
CREATE TYPE "RewriteDraftStatus" AS ENUM ('DRAFT', 'DIFF_READY', 'PENDING_APPROVAL', 'APPROVED', 'STALE_AFTER_CHANGE', 'CHANGES_REQUESTED', 'REJECTED', 'APPLIED_TO_WORDPRESS_DRAFT', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RewriteSuggestionType" AS ENUM ('TITLE', 'META_DESCRIPTION', 'H2', 'H3', 'PARAGRAPH', 'FAQ', 'INTERNAL_LINK', 'CTA', 'AFFILIATE_BOX', 'COMPARISON_TABLE');

-- CreateEnum
CREATE TYPE "RewriteTargetField" AS ENUM ('TITLE', 'META_DESCRIPTION', 'CONTENT_HTML', 'CONTENT_TEXT', 'EXCERPT');

-- CreateEnum
CREATE TYPE "RewriteRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RewriteSuggestionStatus" AS ENUM ('PROPOSED', 'ACCEPTED', 'REJECTED', 'EDITED');

-- CreateEnum
CREATE TYPE "ContentChangeType" AS ENUM ('REPLACE', 'INSERT', 'DELETE', 'MOVE', 'METADATA_UPDATE');

-- CreateEnum
CREATE TYPE "ContentChangeStatus" AS ENUM ('PROPOSED', 'ACCEPTED', 'REJECTED', 'APPLIED');

-- CreateEnum
CREATE TYPE "RewriteApprovalDecision" AS ENUM ('APPROVED', 'REJECTED', 'CHANGES_REQUESTED');

-- CreateEnum
CREATE TYPE "RewriteRiskCheckStatus" AS ENUM ('PASSED', 'WARNING', 'BLOCKED');

-- CreateEnum
CREATE TYPE "WordPressRewriteUpdateMode" AS ENUM ('CREATE_NEW_DRAFT', 'UPDATE_EXISTING_DRAFT');

-- CreateEnum
CREATE TYPE "WordPressRewriteSafetyStatus" AS ENUM ('PASSED', 'FAILED', 'CONFLICT_DETECTED');

-- CreateEnum
CREATE TYPE "WordPressDraftUpdateStatus" AS ENUM ('MOCK_UPDATED', 'UPDATED', 'BLOCKED', 'FAILED');

-- CreateEnum
CREATE TYPE "ImprovementExecutionEventType" AS ENUM ('TASK_CREATED', 'SNAPSHOT_CREATED', 'DRAFT_CREATED', 'DIFF_CREATED', 'RISK_CHECKED', 'APPROVAL_REQUESTED', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'SAFETY_CHECKED', 'WORDPRESS_DRAFT_UPDATED', 'MEASUREMENT_CREATED', 'STATUS_CHANGED');

-- CreateEnum
CREATE TYPE "SeoImpactStatus" AS ENUM ('PENDING', 'MEASURING', 'COMPLETED', 'INSUFFICIENT_DATA');

-- CreateEnum
CREATE TYPE "SeoImpactVerdict" AS ENUM ('IMPROVED', 'DECLINED', 'MIXED', 'NO_CHANGE', 'INSUFFICIENT_DATA');

-- CreateEnum
CREATE TYPE "OperationSettingValueType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON');

-- CreateEnum
CREATE TYPE "ScheduledTaskType" AS ENUM ('GA4_SYNC', 'GSC_QUERY_SYNC', 'GSC_PAGE_SYNC', 'GSC_QUERY_PAGE_SYNC', 'GROWTH_SCORE_RECALC', 'GSB_WEEKLY_REPORT', 'DATA_FRESHNESS_CHECK', 'SEO_DROP_DETECTION', 'REVENUE_DROP_DETECTION', 'SOCIAL_DROP_DETECTION', 'API_ERROR_SPIKE', 'HEALTH_CHECK');

-- CreateEnum
CREATE TYPE "ScheduledTaskStatus" AS ENUM ('ACTIVE', 'PAUSED', 'DISABLED', 'NEVER_RUN', 'SUCCESS', 'SUCCESS_WITH_WARNINGS', 'FAILED', 'SKIPPED', 'RATE_LIMITED', 'LOCKED', 'DRY_RUN');

-- CreateEnum
CREATE TYPE "ScheduledTaskRunType" AS ENUM ('SCHEDULED', 'MANUAL', 'RETRY', 'MOCK', 'DRY_RUN');

-- CreateEnum
CREATE TYPE "ScheduledTaskRunStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCESS', 'SUCCESS_WITH_WARNINGS', 'FAILED', 'SKIPPED', 'CANCELLED', 'RATE_LIMITED', 'LOCKED', 'STALE_RECOVERED', 'DRY_RUN');

-- CreateEnum
CREATE TYPE "DataFreshnessSource" AS ENUM ('GA4', 'SEARCH_CONSOLE', 'REVENUE', 'SOCIAL_POSTS', 'WORDPRESS', 'GROWTH_SCORE');

-- CreateEnum
CREATE TYPE "DataFreshnessPriority" AS ENUM ('API', 'CSV', 'MANUAL', 'MOCK');

-- CreateEnum
CREATE TYPE "FreshnessStatus" AS ENUM ('FRESH', 'WARNING', 'CRITICAL', 'UNKNOWN', 'DISABLED');

-- CreateEnum
CREATE TYPE "AlertRuleType" AS ENUM ('DATA_FRESHNESS', 'SEO_CLICKS_DROP', 'SEO_IMPRESSIONS_DROP', 'SEO_POSITION_DROP', 'REVENUE_DROP', 'SOCIAL_IMPRESSIONS_DROP', 'API_ERROR_SPIKE', 'SYNC_FAILURE', 'QUOTA_WARNING', 'GROWTH_SCORE_DROP');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertIncidentStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ALERT', 'TASK_RUN', 'DATA_FRESHNESS', 'HEALTH_REPORT', 'WEEKLY_REPORT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'DISMISSED');

-- CreateEnum
CREATE TYPE "NotificationChannelType" AS ENUM ('IN_APP', 'MOCK', 'EMAIL', 'SLACK');

-- CreateEnum
CREATE TYPE "NotificationChannelStatus" AS ENUM ('ENABLED', 'DISABLED', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationDeliveryStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED', 'SKIPPED', 'MOCK_SENT');

-- CreateEnum
CREATE TYPE "OperationsHealthStatus" AS ENUM ('HEALTHY', 'WARNING', 'CRITICAL', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "WordPressConnectionStatus" AS ENUM ('NOT_CONNECTED', 'MOCK_CONNECTED', 'CONNECTED', 'FAILED', 'DISABLED');

-- CreateEnum
CREATE TYPE "WordPressLocalStatus" AS ENUM ('DRAFT_LOCAL', 'READY_TO_SYNC', 'SYNCING', 'SYNCED_DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DuplicateCheckStatus" AS ENUM ('NOT_CHECKED', 'UNIQUE', 'DUPLICATE_FOUND', 'FAILED');

-- CreateEnum
CREATE TYPE "WordPressMediaUploadStatus" AS ENUM ('NOT_UPLOADED', 'MOCK_UPLOADED', 'UPLOADED', 'FAILED');

-- CreateEnum
CREATE TYPE "CanvaConnectionStatus" AS ENUM ('NOT_CONNECTED', 'MOCK_CONNECTED', 'CONNECTED', 'EXPIRED', 'FAILED', 'DISABLED');

-- CreateEnum
CREATE TYPE "CanvaTemplateType" AS ENUM ('WORDPRESS_FEATURED_IMAGE', 'X_POST_IMAGE', 'INSTAGRAM_SQUARE', 'INSTAGRAM_STORY', 'PINTEREST_PIN', 'BLOG_OGP');

-- CreateEnum
CREATE TYPE "CanvaTemplateStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CanvaJobType" AS ENUM ('FEATURED_IMAGE', 'X_POST_IMAGE', 'INSTAGRAM_IMAGE', 'PINTEREST_PIN', 'OGP_IMAGE');

-- CreateEnum
CREATE TYPE "CanvaJobStatus" AS ENUM ('DRAFT', 'QUEUED', 'PROCESSING', 'GENERATED', 'EXPORTING', 'EXPORTED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CanvaExportStatus" AS ENUM ('QUEUED', 'PROCESSING', 'EXPORTED', 'FAILED');

-- CreateEnum
CREATE TYPE "CreativeAssetSource" AS ENUM ('CANVA', 'AI_MOCK', 'UPLOAD', 'WORDPRESS', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "CreativeAssetType" AS ENUM ('FEATURED_IMAGE', 'X_POST_IMAGE', 'INSTAGRAM_IMAGE', 'PINTEREST_PIN', 'OGP_IMAGE', 'GENERAL');

-- CreateEnum
CREATE TYPE "AssetApprovalStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "AssetUsageType" AS ENUM ('WORDPRESS_FEATURED_IMAGE', 'X_POST_IMAGE', 'INSTAGRAM_POST_IMAGE', 'PINTEREST_PIN_IMAGE', 'OGP_IMAGE');

-- CreateEnum
CREATE TYPE "MediaUploadStatus" AS ENUM ('NOT_UPLOADED', 'UPLOADED_MOCK', 'UPLOADED', 'FAILED');

-- CreateEnum
CREATE TYPE "AffiliateEntityStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AffiliateProgramStatus" AS ENUM ('DRAFT', 'APPLYING', 'APPROVED', 'REJECTED', 'ACTIVE', 'PAUSED', 'ENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AffiliateRewardType" AS ENUM ('FIXED', 'PERCENTAGE', 'LEAD', 'INSTALL', 'SUBSCRIPTION', 'OTHER');

-- CreateEnum
CREATE TYPE "AffiliateRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AffiliateApplicationStatus" AS ENUM ('NOT_APPLIED', 'APPLYING', 'APPROVED', 'REJECTED', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "AffiliateLinkType" AS ENUM ('TEXT', 'BANNER', 'BUTTON', 'PRODUCT', 'DEEP_LINK');

-- CreateEnum
CREATE TYPE "AffiliatePlacementType" AS ENUM ('ARTICLE_TEXT', 'BUTTON', 'BANNER', 'COMPARISON_TABLE', 'PRODUCT_CARD', 'CTA_BOX', 'SIDEBAR', 'FOOTER');

-- CreateEnum
CREATE TYPE "AffiliatePlacementPosition" AS ENUM ('INTRO', 'MIDDLE', 'AFTER_H2_1', 'AFTER_H2_2', 'CONCLUSION');

-- CreateEnum
CREATE TYPE "RevenueStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'ADJUSTED');

-- CreateEnum
CREATE TYPE "RevenueSource" AS ENUM ('MANUAL', 'CSV', 'MOCK', 'API_FUTURE');

-- CreateEnum
CREATE TYPE "DataConfidence" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'INSUFFICIENT');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PREVIEWED', 'IMPORTED', 'PARTIAL', 'FAILED');

-- CreateEnum
CREATE TYPE "GrowthRecommendationType" AS ENUM ('SCALE', 'MAINTAIN', 'IMPROVE', 'PAUSE', 'STOP', 'RESEARCH_MORE');

-- CreateEnum
CREATE TYPE "GrowthRecommendationStatus" AS ENUM ('PROPOSED', 'APPROVED', 'REJECTED', 'DONE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OperatingCostCategory" AS ENUM ('CONTENT', 'DESIGN', 'TOOL', 'ADS', 'OUTSOURCING', 'OTHER');

-- CreateEnum
CREATE TYPE "GoogleConnectionStatus" AS ENUM ('NOT_CONNECTED', 'MOCK_CONNECTED', 'CONNECTED', 'EXPIRED', 'FAILED', 'DISABLED', 'REVOKED', 'INSUFFICIENT_SCOPE', 'MISSING_REFRESH_TOKEN');

-- CreateEnum
CREATE TYPE "GooglePropertyStatus" AS ENUM ('NOT_CONNECTED', 'MOCK_CONNECTED', 'CONNECTED', 'FAILED', 'DISABLED');

-- CreateEnum
CREATE TYPE "SearchConsolePropertyType" AS ENUM ('URL_PREFIX', 'DOMAIN');

-- CreateEnum
CREATE TYPE "SeoDataSource" AS ENUM ('MANUAL', 'CSV', 'MOCK', 'GA4_API', 'SEARCH_CONSOLE_API', 'GA4_API_FUTURE', 'SEARCH_CONSOLE_API_FUTURE');

-- CreateEnum
CREATE TYPE "GoogleSyncJobType" AS ENUM ('GA4_SITE_DAILY', 'GA4_PAGE_DAILY', 'GSC_QUERY_DAILY', 'GSC_PAGE_DAILY', 'GSC_QUERY_PAGE_DAILY');

-- CreateEnum
CREATE TYPE "GoogleSyncSource" AS ENUM ('GA4', 'SEARCH_CONSOLE');

-- CreateEnum
CREATE TYPE "GoogleSyncDateRangeType" AS ENUM ('LAST_N_DAYS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "GoogleSyncJobStatus" AS ENUM ('ACTIVE', 'PAUSED', 'DISABLED', 'FAILED');

-- CreateEnum
CREATE TYPE "GoogleSyncRunType" AS ENUM ('MANUAL', 'SCHEDULED', 'RETRY', 'MOCK');

-- CreateEnum
CREATE TYPE "GoogleSyncRunStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCESS', 'SUCCESS_WITH_WARNINGS', 'FAILED', 'CANCELLED', 'RATE_LIMITED', 'AUTH_FAILED', 'PERMISSION_FAILED');

-- CreateEnum
CREATE TYPE "GoogleApiName" AS ENUM ('GA4', 'SEARCH_CONSOLE', 'GOOGLE_OAUTH');

-- CreateEnum
CREATE TYPE "GoogleQuotaCategory" AS ENUM ('GA4_CORE', 'GA4_REALTIME', 'GA4_FUNNEL', 'SEARCH_CONSOLE_SEARCH_ANALYTICS', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "GoogleApiActionRequired" AS ENUM ('NONE', 'REAUTHORIZE', 'REDUCE_DATE_RANGE', 'WAIT_AND_RETRY', 'CHECK_PROPERTY_PERMISSION', 'ENABLE_API', 'CHECK_PROPERTY_ID', 'CHECK_SITE_URL');

-- CreateEnum
CREATE TYPE "SearchType" AS ENUM ('WEB', 'IMAGE', 'VIDEO', 'NEWS', 'DISCOVER', 'GOOGLE_NEWS');

-- CreateEnum
CREATE TYPE "SearchDevice" AS ENUM ('DESKTOP', 'MOBILE', 'TABLET', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SeoKeywordIntent" AS ENUM ('INFORMATIONAL', 'COMMERCIAL', 'TRANSACTIONAL', 'NAVIGATIONAL', 'LOCAL', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SeoKeywordStatus" AS ENUM ('NEW', 'TARGETING', 'RANKING', 'IMPROVING', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SeoPageKeywordRole" AS ENUM ('PRIMARY', 'SECONDARY', 'RELATED', 'LONG_TAIL');

-- CreateEnum
CREATE TYPE "SeoOpportunityType" AS ENUM ('HIGH_IMPRESSION_LOW_CTR', 'NEAR_TOP_10', 'NEAR_TOP_3', 'DECLINING_CLICKS', 'DECLINING_POSITION', 'CONTENT_GAP', 'MISSING_INTERNAL_LINKS', 'OUTDATED_CONTENT', 'NO_AFFILIATE_CTA', 'LOW_CONVERSION_ARTICLE');

-- CreateEnum
CREATE TYPE "SeoPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "SeoOpportunityStatus" AS ENUM ('NEW', 'REVIEWING', 'APPROVED', 'IN_PROGRESS', 'DONE', 'DISMISSED');

-- CreateEnum
CREATE TYPE "SeoRecommendationType" AS ENUM ('REWRITE_TITLE', 'REWRITE_META_DESCRIPTION', 'ADD_H2_SECTION', 'ADD_FAQ_SECTION', 'IMPROVE_INTRO', 'ADD_INTERNAL_LINKS', 'ADD_AFFILIATE_CTA', 'UPDATE_OUTDATED_INFO', 'EXPAND_COMPARISON_TABLE', 'IMPROVE_SCHEMA_MARKUP_FUTURE');

-- CreateEnum
CREATE TYPE "SeoApprovalStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'DONE');

-- CreateEnum
CREATE TYPE "SeoActionStatus" AS ENUM ('TODO', 'DOING', 'DONE', 'SKIPPED');

-- CreateEnum
CREATE TYPE "SeoImportSource" AS ENUM ('GA4', 'SEARCH_CONSOLE', 'MANUAL', 'MOCK');

-- CreateEnum
CREATE TYPE "SeoImportType" AS ENUM ('GA4_PAGES_CSV', 'GA4_TRAFFIC_CSV', 'GSC_QUERIES_CSV', 'GSC_PAGES_CSV', 'GSC_QUERY_PAGE_CSV', 'GENERIC_CSV', 'MOCK');

-- CreateEnum
CREATE TYPE "SeoImportStatus" AS ENUM ('UPLOADED', 'PREVIEWED', 'PROCESSING', 'COMPLETED', 'COMPLETED_WITH_WARNINGS', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "wordpressUrl" TEXT NOT NULL,
    "noteUrl" TEXT,
    "bloggerUrl" TEXT,
    "instagramUrl" TEXT,
    "pinterestUrl" TEXT,
    "growthScore" INTEGER NOT NULL DEFAULT 0,
    "status" "MediaStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "accountUrl" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "apiConnected" BOOLEAN NOT NULL DEFAULT false,
    "officialApiOnly" BOOLEAN NOT NULL DEFAULT true,
    "autoPostingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "dailyLimit" INTEGER NOT NULL DEFAULT 50,
    "windowLimit" INTEGER NOT NULL DEFAULT 6,
    "windowMinutes" INTEGER NOT NULL DEFAULT 15,
    "defaultPostTimes" TEXT NOT NULL DEFAULT '08:00,12:30,20:00',
    "apiStopFlag" BOOLEAN NOT NULL DEFAULT false,
    "apiStopReason" TEXT,
    "nextAllowedPostAt" TIMESTAMP(3),
    "lastPostedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "postType" "PostType" NOT NULL DEFAULT 'TEXT_WITH_LINK',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "destinationUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "imageUrl" TEXT,
    "creativeAssetId" TEXT,
    "mediaUploadStatus" "MediaUploadStatus" NOT NULL DEFAULT 'NOT_UPLOADED',
    "externalMediaId" TEXT,
    "mediaUploadError" TEXT,
    "madeWithAi" BOOLEAN NOT NULL DEFAULT false,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "approvalStatus" "ApprovalDecision",
    "linkCheckStatus" "LinkCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "linkCheckReason" TEXT,
    "detectedUrls" JSONB,
    "checkedAt" TIMESTAMP(3),
    "aiGenerated" BOOLEAN NOT NULL DEFAULT true,
    "aiPrompt" TEXT,
    "aiResult" TEXT,
    "complianceNotes" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "externalPostId" TEXT,
    "externalPostUrl" TEXT,
    "failureReason" TEXT,
    "lastError" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lockedAt" TIMESTAMP(3),
    "processingStartedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostApproval" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "reviewer" TEXT NOT NULL,
    "decision" "ApprovalDecision" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiUsageLog" (
    "id" TEXT NOT NULL,
    "socialAccountId" TEXT,
    "postId" TEXT,
    "platform" "Platform" NOT NULL,
    "eventType" "ApiEventType" NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'POST',
    "statusCode" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "requestCount" INTEGER NOT NULL DEFAULT 1,
    "requestType" "RequestType" NOT NULL DEFAULT 'SYSTEM',
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "costEstimate" DECIMAL(12,6),
    "rateLimitLimit" INTEGER,
    "remaining" INTEGER,
    "resetAt" TIMESTAMP(3),
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkCheck" (
    "id" TEXT NOT NULL,
    "postId" TEXT,
    "url" TEXT NOT NULL,
    "status" "LinkCheckStatus" NOT NULL,
    "reason" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "PlatformCredential" (
    "id" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "credentialLabel" TEXT NOT NULL,
    "encryptedValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPressSite" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "siteUrl" TEXT NOT NULL,
    "apiBaseUrl" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "applicationPasswordEncrypted" TEXT,
    "applicationPasswordMasked" TEXT NOT NULL DEFAULT '********',
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "connectionStatus" "WordPressConnectionStatus" NOT NULL DEFAULT 'NOT_CONNECTED',
    "lastConnectedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "defaultStatus" TEXT NOT NULL DEFAULT 'draft',
    "allowPublish" BOOLEAN NOT NULL DEFAULT false,
    "autoAddAllowedDomain" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordPressSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPressPost" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressSiteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "contentMarkdown" TEXT NOT NULL,
    "contentHtml" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "localStatus" "WordPressLocalStatus" NOT NULL DEFAULT 'DRAFT_LOCAL',
    "wordpressPostId" TEXT,
    "wordpressPostUrl" TEXT,
    "wordpressEditUrl" TEXT,
    "featuredMediaId" TEXT,
    "creativeAssetId" TEXT,
    "categoryIds" JSONB,
    "tagIds" JSONB,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "focusKeyword" TEXT,
    "aiPrompt" TEXT,
    "aiModel" TEXT,
    "approvalStatus" "ApprovalDecision",
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "scheduledPublishAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "duplicateCheckStatus" "DuplicateCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "duplicateCheckResult" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordPressPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPressMedia" (
    "id" TEXT NOT NULL,
    "wordpressSiteId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "localFileUrl" TEXT,
    "sourceImageUrl" TEXT,
    "creativeAssetId" TEXT,
    "wordpressMediaId" TEXT,
    "wordpressMediaUrl" TEXT,
    "altText" TEXT,
    "caption" TEXT,
    "description" TEXT,
    "uploadStatus" "WordPressMediaUploadStatus" NOT NULL DEFAULT 'NOT_UPLOADED',
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordPressMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPressCategory" (
    "id" TEXT NOT NULL,
    "wordpressSiteId" TEXT NOT NULL,
    "wordpressCategoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordPressCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPressTag" (
    "id" TEXT NOT NULL,
    "wordpressSiteId" TEXT NOT NULL,
    "wordpressTagId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordPressTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPressSyncLog" (
    "id" TEXT NOT NULL,
    "wordpressSiteId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "action" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "requestPayloadSummary" TEXT,
    "responsePayloadSummary" TEXT,
    "errorMessage" TEXT,
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordPressSyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvaConnection" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "connectionName" TEXT NOT NULL,
    "canvaUserId" TEXT,
    "canvaUserEmail" TEXT,
    "accessTokenEncrypted" TEXT,
    "refreshTokenEncrypted" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "scopes" TEXT,
    "connectionStatus" "CanvaConnectionStatus" NOT NULL DEFAULT 'NOT_CONNECTED',
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "lastConnectedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanvaConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvaBrandTemplate" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "canvaConnectionId" TEXT,
    "templateName" TEXT NOT NULL,
    "canvaTemplateId" TEXT NOT NULL,
    "templateType" "CanvaTemplateType" NOT NULL,
    "platform" "Platform" NOT NULL,
    "aspectRatio" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "autofillFields" JSONB,
    "requiredFields" JSONB,
    "optionalFields" JSONB,
    "status" "CanvaTemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanvaBrandTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvaDesignJob" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "canvaConnectionId" TEXT,
    "canvaBrandTemplateId" TEXT,
    "wordpressPostId" TEXT,
    "postId" TEXT,
    "jobType" "CanvaJobType" NOT NULL,
    "inputData" JSONB,
    "prompt" TEXT,
    "status" "CanvaJobStatus" NOT NULL DEFAULT 'DRAFT',
    "canvaDesignId" TEXT,
    "canvaDesignUrl" TEXT,
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanvaDesignJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvaExport" (
    "id" TEXT NOT NULL,
    "canvaDesignJobId" TEXT NOT NULL,
    "exportFormat" TEXT NOT NULL DEFAULT 'png',
    "exportStatus" "CanvaExportStatus" NOT NULL DEFAULT 'QUEUED',
    "canvaExportJobId" TEXT,
    "downloadUrl" TEXT,
    "localFileUrl" TEXT,
    "publicUrl" TEXT,
    "fileSize" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" TEXT,
    "expiresAt" TIMESTAMP(3),
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanvaExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreativeAsset" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "source" "CreativeAssetSource" NOT NULL DEFAULT 'AI_MOCK',
    "assetType" "CreativeAssetType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "altText" TEXT,
    "localFileUrl" TEXT,
    "publicUrl" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "canvaDesignJobId" TEXT,
    "canvaExportId" TEXT,
    "wordpressMediaId" TEXT,
    "approvalStatus" "AssetApprovalStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "riskCheckStatus" "LinkCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "riskCheckReason" TEXT,
    "madeWithAi" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreativeAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreativeAssetUsage" (
    "id" TEXT NOT NULL,
    "creativeAssetId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "postId" TEXT,
    "usageType" "AssetUsageType" NOT NULL,
    "platform" "Platform" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreativeAssetUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageApproval" (
    "id" TEXT NOT NULL,
    "creativeAssetId" TEXT NOT NULL,
    "status" "AssetApprovalStatus" NOT NULL,
    "reviewer" TEXT NOT NULL,
    "comment" TEXT,
    "riskNotes" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvaSyncLog" (
    "id" TEXT NOT NULL,
    "canvaConnectionId" TEXT,
    "canvaDesignJobId" TEXT,
    "action" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "requestPayloadSummary" TEXT,
    "responsePayloadSummary" TEXT,
    "errorMessage" TEXT,
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CanvaSyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateNetwork" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "loginUrl" TEXT,
    "status" "AffiliateEntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateNetwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateProgram" (
    "id" TEXT NOT NULL,
    "affiliateNetworkId" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "advertiserName" TEXT,
    "genre" TEXT,
    "category" TEXT,
    "programUrl" TEXT,
    "rewardType" "AffiliateRewardType" NOT NULL DEFAULT 'FIXED',
    "rewardAmount" DECIMAL(14,2),
    "rewardRate" DECIMAL(8,4),
    "currency" TEXT NOT NULL DEFAULT 'JPY',
    "approvalRate" DECIMAL(6,4),
    "epc" DECIMAL(14,4),
    "cookieDurationDays" INTEGER,
    "conversionCondition" TEXT,
    "prohibitedTerms" JSONB,
    "allowedMediaTypes" JSONB,
    "complianceNotes" TEXT,
    "riskLevel" "AffiliateRiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "status" "AffiliateProgramStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateProgramMediaSite" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "affiliateProgramId" TEXT NOT NULL,
    "applicationStatus" "AffiliateApplicationStatus" NOT NULL DEFAULT 'NOT_APPLIED',
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "mainProgram" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateProgramMediaSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateLink" (
    "id" TEXT NOT NULL,
    "affiliateProgramId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "destinationUrl" TEXT NOT NULL,
    "affiliateUrl" TEXT NOT NULL,
    "affiliateUrlMasked" TEXT NOT NULL,
    "trackingId" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "linkType" "AffiliateLinkType" NOT NULL DEFAULT 'TEXT',
    "status" "AffiliateEntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliatePlacement" (
    "id" TEXT NOT NULL,
    "affiliateLinkId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "placementType" "AffiliatePlacementType" NOT NULL DEFAULT 'ARTICLE_TEXT',
    "placementLabel" TEXT,
    "position" "AffiliatePlacementPosition" NOT NULL DEFAULT 'MIDDLE',
    "status" "AffiliateEntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliatePlacement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueEvent" (
    "id" TEXT NOT NULL,
    "affiliateNetworkId" TEXT NOT NULL,
    "affiliateProgramId" TEXT,
    "affiliateLinkId" TEXT,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "postId" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "clickIdHash" TEXT,
    "orderIdHash" TEXT,
    "conversionType" TEXT,
    "status" "RevenueStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedReward" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "pendingReward" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "approvedReward" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "rejectedReward" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "adjustedReward" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'JPY',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "memo" TEXT,
    "source" "RevenueSource" NOT NULL DEFAULT 'MANUAL',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'MEDIUM',
    "importBatchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevenueEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueImportBatch" (
    "id" TEXT NOT NULL,
    "affiliateNetworkId" TEXT,
    "fileName" TEXT NOT NULL,
    "importType" TEXT NOT NULL DEFAULT 'csv',
    "status" "ImportStatus" NOT NULL DEFAULT 'PREVIEWED',
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "successRows" INTEGER NOT NULL DEFAULT 0,
    "failedRows" INTEGER NOT NULL DEFAULT 0,
    "warningRows" INTEGER NOT NULL DEFAULT 0,
    "duplicateRows" INTEGER NOT NULL DEFAULT 0,
    "errorSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevenueImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueImportRowError" (
    "id" TEXT NOT NULL,
    "importBatchId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'error',
    "message" TEXT NOT NULL,
    "rawRow" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevenueImportRowError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrafficMetricDaily" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "metricDate" TIMESTAMP(3) NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "linkClicks" INTEGER NOT NULL DEFAULT 0,
    "articleSessions" INTEGER NOT NULL DEFAULT 0,
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "pageviews" INTEGER NOT NULL DEFAULT 0,
    "users" INTEGER NOT NULL DEFAULT 0,
    "source" "RevenueSource" NOT NULL DEFAULT 'MOCK',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrafficMetricDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPerformanceDaily" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "metricDate" TIMESTAMP(3) NOT NULL,
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "pageviews" INTEGER NOT NULL DEFAULT 0,
    "affiliateClicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "estimatedRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "approvedRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "source" "RevenueSource" NOT NULL DEFAULT 'MOCK',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPerformanceDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPostPerformanceDaily" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "metricDate" TIMESTAMP(3) NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "linkClicks" INTEGER NOT NULL DEFAULT 0,
    "articleSessions" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "estimatedRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "approvedRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "source" "RevenueSource" NOT NULL DEFAULT 'MOCK',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialPostPerformanceDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatingCost" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "costDate" TIMESTAMP(3) NOT NULL,
    "category" "OperatingCostCategory" NOT NULL DEFAULT 'OTHER',
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'JPY',
    "description" TEXT,
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'HIGH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperatingCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthScoreSnapshot" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "trafficScore" INTEGER NOT NULL DEFAULT 0,
    "revenueScore" INTEGER NOT NULL DEFAULT 0,
    "conversionScore" INTEGER NOT NULL DEFAULT 0,
    "contentScore" INTEGER NOT NULL DEFAULT 0,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "recommendation" "GrowthRecommendationType" NOT NULL DEFAULT 'RESEARCH_MORE',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'INSUFFICIENT',
    "dataWarnings" JSONB,
    "reasoning" TEXT,
    "requiresHumanReview" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthScoreSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthScoreRule" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 10,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowthScoreRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthRecommendation" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "snapshotId" TEXT,
    "type" "GrowthRecommendationType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "status" "GrowthRecommendationStatus" NOT NULL DEFAULT 'PROPOSED',
    "riskNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowthRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthStrategyBoardReport" (
    "id" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "totalEstimatedRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalPendingRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalApprovedRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalProfit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "topMedia" JSONB,
    "improveMedia" JSONB,
    "pauseMedia" JSONB,
    "insufficientMedia" JSONB,
    "riskWarnings" JSONB,
    "nextActions" JSONB,
    "requiresHumanReview" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthStrategyBoardReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleConnection" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "connectionName" TEXT NOT NULL,
    "googleAccountEmail" TEXT,
    "accessTokenEncrypted" TEXT,
    "refreshTokenEncrypted" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "scopes" TEXT,
    "connectionStatus" "GoogleConnectionStatus" NOT NULL DEFAULT 'NOT_CONNECTED',
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "lastConnectedAt" TIMESTAMP(3),
    "lastTokenRefreshAt" TIMESTAMP(3),
    "refreshTokenAvailable" BOOLEAN NOT NULL DEFAULT false,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GA4Property" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "googleConnectionId" TEXT,
    "propertyName" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "propertyDisplayName" TEXT,
    "defaultUrl" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Tokyo',
    "currency" TEXT NOT NULL DEFAULT 'JPY',
    "connectionStatus" "GooglePropertyStatus" NOT NULL DEFAULT 'NOT_CONNECTED',
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3),
    "lastSuccessfulSyncAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GA4Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchConsoleProperty" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "googleConnectionId" TEXT,
    "siteUrl" TEXT NOT NULL,
    "propertyType" "SearchConsolePropertyType" NOT NULL DEFAULT 'URL_PREFIX',
    "connectionStatus" "GooglePropertyStatus" NOT NULL DEFAULT 'NOT_CONNECTED',
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3),
    "lastSuccessfulSyncAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchConsoleProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GA4MetricDaily" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "ga4PropertyId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "users" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "pageviews" INTEGER NOT NULL DEFAULT 0,
    "screenPageViews" INTEGER NOT NULL DEFAULT 0,
    "engagedSessions" INTEGER NOT NULL DEFAULT 0,
    "averageSessionDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "engagementRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "source" "SeoDataSource" NOT NULL DEFAULT 'MOCK',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GA4MetricDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GA4PageMetricDaily" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "ga4PropertyId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "pagePath" TEXT NOT NULL,
    "pageTitle" TEXT,
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "users" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "screenPageViews" INTEGER NOT NULL DEFAULT 0,
    "engagedSessions" INTEGER NOT NULL DEFAULT 0,
    "averageEngagementTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "entrances" INTEGER NOT NULL DEFAULT 0,
    "exits" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "affiliateClicks" INTEGER NOT NULL DEFAULT 0,
    "source" "SeoDataSource" NOT NULL DEFAULT 'MOCK',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GA4PageMetricDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchConsoleQueryDaily" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "searchConsolePropertyId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "query" TEXT NOT NULL,
    "searchType" "SearchType" NOT NULL DEFAULT 'WEB',
    "country" TEXT,
    "device" "SearchDevice" NOT NULL DEFAULT 'UNKNOWN',
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" "SeoDataSource" NOT NULL DEFAULT 'MOCK',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchConsoleQueryDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchConsolePageDaily" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "searchConsolePropertyId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "searchType" "SearchType" NOT NULL DEFAULT 'WEB',
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" "SeoDataSource" NOT NULL DEFAULT 'MOCK',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchConsolePageDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchConsoleQueryPageDaily" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "searchConsolePropertyId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "query" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "searchType" "SearchType" NOT NULL DEFAULT 'WEB',
    "country" TEXT,
    "device" "SearchDevice" NOT NULL DEFAULT 'UNKNOWN',
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" "SeoDataSource" NOT NULL DEFAULT 'MOCK',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchConsoleQueryPageDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoKeyword" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "normalizedKeyword" TEXT NOT NULL,
    "intent" "SeoKeywordIntent" NOT NULL DEFAULT 'UNKNOWN',
    "topic" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 50,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "status" "SeoKeywordStatus" NOT NULL DEFAULT 'NEW',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoPageKeyword" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT NOT NULL,
    "seoKeywordId" TEXT NOT NULL,
    "role" "SeoPageKeywordRole" NOT NULL DEFAULT 'PRIMARY',
    "targetPosition" DOUBLE PRECISION,
    "currentPosition" DOUBLE PRECISION,
    "currentClicks" INTEGER NOT NULL DEFAULT 0,
    "currentImpressions" INTEGER NOT NULL DEFAULT 0,
    "currentCtr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoPageKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoOpportunity" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "seoKeywordId" TEXT,
    "opportunityType" "SeoOpportunityType" NOT NULL,
    "priority" "SeoPriority" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evidence" JSONB,
    "expectedImpact" TEXT,
    "status" "SeoOpportunityStatus" NOT NULL DEFAULT 'NEW',
    "opportunityScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoRecommendation" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "seoOpportunityId" TEXT,
    "recommendationType" "SeoRecommendationType" NOT NULL,
    "priority" "SeoPriority" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "beforeValue" TEXT,
    "afterSuggestion" TEXT,
    "reason" TEXT,
    "requiresHumanReview" BOOLEAN NOT NULL DEFAULT true,
    "approvalStatus" "SeoApprovalStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoRecommendationAction" (
    "id" TEXT NOT NULL,
    "seoRecommendationId" TEXT NOT NULL,
    "actionOrder" INTEGER NOT NULL DEFAULT 1,
    "actionText" TEXT NOT NULL,
    "status" "SeoActionStatus" NOT NULL DEFAULT 'TODO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoRecommendationAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoAnalysisSnapshot" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "totalImpressions" INTEGER NOT NULL DEFAULT 0,
    "averageCtr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averagePosition" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "organicSessions" INTEGER NOT NULL DEFAULT 0,
    "topQueries" JSONB,
    "topPages" JSONB,
    "decliningPages" JSONB,
    "opportunityCount" INTEGER NOT NULL DEFAULT 0,
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'INSUFFICIENT',
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoAnalysisSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoImportBatch" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "importSource" "SeoImportSource" NOT NULL,
    "fileName" TEXT NOT NULL,
    "importType" "SeoImportType" NOT NULL,
    "status" "SeoImportStatus" NOT NULL DEFAULT 'UPLOADED',
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "successRows" INTEGER NOT NULL DEFAULT 0,
    "failedRows" INTEGER NOT NULL DEFAULT 0,
    "warningRows" INTEGER NOT NULL DEFAULT 0,
    "duplicateRows" INTEGER NOT NULL DEFAULT 0,
    "errorSummary" TEXT,
    "importedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoImportRowError" (
    "id" TEXT NOT NULL,
    "seoImportBatchId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'error',
    "fieldName" TEXT,
    "rawValue" TEXT,
    "errorMessage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeoImportRowError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleSyncJob" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "googleConnectionId" TEXT,
    "jobName" TEXT NOT NULL,
    "jobType" "GoogleSyncJobType" NOT NULL,
    "targetPropertyId" TEXT,
    "syncSource" "GoogleSyncSource" NOT NULL,
    "dateRangeType" "GoogleSyncDateRangeType" NOT NULL DEFAULT 'LAST_N_DAYS',
    "defaultDays" INTEGER NOT NULL DEFAULT 28,
    "maxDays" INTEGER NOT NULL DEFAULT 90,
    "status" "GoogleSyncJobStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleSyncJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleSyncRun" (
    "id" TEXT NOT NULL,
    "googleSyncJobId" TEXT,
    "mediaId" TEXT NOT NULL,
    "googleConnectionId" TEXT,
    "runType" "GoogleSyncRunType" NOT NULL DEFAULT 'MANUAL',
    "status" "GoogleSyncRunStatus" NOT NULL DEFAULT 'QUEUED',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "requestedRows" INTEGER NOT NULL DEFAULT 0,
    "savedRows" INTEGER NOT NULL DEFAULT 0,
    "skippedRows" INTEGER NOT NULL DEFAULT 0,
    "failedRows" INTEGER NOT NULL DEFAULT 0,
    "apiCalls" INTEGER NOT NULL DEFAULT 0,
    "quotaConsumed" INTEGER NOT NULL DEFAULT 0,
    "errorSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleSyncRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleApiQuotaLog" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "googleConnectionId" TEXT,
    "apiName" "GoogleApiName" NOT NULL,
    "propertyId" TEXT,
    "endpoint" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL,
    "quotaCategory" "GoogleQuotaCategory" NOT NULL DEFAULT 'UNKNOWN',
    "tokensConsumed" INTEGER NOT NULL DEFAULT 0,
    "quotaRemaining" INTEGER,
    "statusCode" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoogleApiQuotaLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleApiErrorLog" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "googleConnectionId" TEXT,
    "apiName" "GoogleApiName" NOT NULL,
    "endpoint" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL,
    "statusCode" INTEGER,
    "errorCode" TEXT,
    "errorMessage" TEXT NOT NULL,
    "retryable" BOOLEAN NOT NULL DEFAULT false,
    "actionRequired" "GoogleApiActionRequired" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoogleApiErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueType" "OperationSettingValueType" NOT NULL DEFAULT 'STRING',
    "description" TEXT,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperationSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "ScheduledTask" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "taskKey" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "taskType" "ScheduledTaskType" NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Tokyo',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "dryRun" BOOLEAN NOT NULL DEFAULT true,
    "status" "ScheduledTaskStatus" NOT NULL DEFAULT 'NEVER_RUN',
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "lastSuccessAt" TIMESTAMP(3),
    "lastError" TEXT,
    "maxRetries" INTEGER NOT NULL DEFAULT 2,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledTaskRun" (
    "id" TEXT NOT NULL,
    "scheduledTaskId" TEXT,
    "mediaId" TEXT,
    "runType" "ScheduledTaskRunType" NOT NULL DEFAULT 'MANUAL',
    "status" "ScheduledTaskRunStatus" NOT NULL DEFAULT 'QUEUED',
    "startedAt" TIMESTAMP(3),
    "heartbeatAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "rowsRead" INTEGER NOT NULL DEFAULT 0,
    "rowsWritten" INTEGER NOT NULL DEFAULT 0,
    "warningCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledTaskRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskLease" (
    "id" TEXT NOT NULL,
    "scheduledTaskId" TEXT NOT NULL,
    "leaseKey" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "heartbeatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskLease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataFreshnessStatus" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "source" "DataFreshnessSource" NOT NULL,
    "priority" "DataFreshnessPriority" NOT NULL DEFAULT 'MOCK',
    "status" "FreshnessStatus" NOT NULL DEFAULT 'UNKNOWN',
    "lastDataAt" TIMESTAMP(3),
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warningAfterHours" INTEGER NOT NULL DEFAULT 48,
    "criticalAfterHours" INTEGER NOT NULL DEFAULT 96,
    "staleHours" INTEGER,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataFreshnessStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertRule" (
    "id" TEXT NOT NULL,
    "ruleKey" TEXT NOT NULL,
    "ruleName" TEXT NOT NULL,
    "ruleType" "AlertRuleType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'WARNING',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "thresholdValue" DOUBLE PRECISION,
    "lookbackDays" INTEGER NOT NULL DEFAULT 7,
    "compareDays" INTEGER NOT NULL DEFAULT 7,
    "dedupWindowHours" INTEGER NOT NULL DEFAULT 24,
    "cooldownHours" INTEGER NOT NULL DEFAULT 24,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertIncident" (
    "id" TEXT NOT NULL,
    "alertRuleId" TEXT NOT NULL,
    "mediaId" TEXT,
    "severity" "AlertSeverity" NOT NULL,
    "status" "AlertIncidentStatus" NOT NULL DEFAULT 'OPEN',
    "dedupKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    "cooldownUntil" TIMESTAMP(3),
    "evidence" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationChannel" (
    "id" TEXT NOT NULL,
    "channelKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channelType" "NotificationChannelType" NOT NULL,
    "status" "NotificationChannelStatus" NOT NULL DEFAULT 'ENABLED',
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationEvent" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "alertIncidentId" TEXT,
    "scheduledTaskRunId" TEXT,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "dedupKey" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),

    CONSTRAINT "NotificationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDelivery" (
    "id" TEXT NOT NULL,
    "notificationEventId" TEXT NOT NULL,
    "notificationChannelId" TEXT NOT NULL,
    "status" "NotificationDeliveryStatus" NOT NULL DEFAULT 'QUEUED',
    "attemptedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "providerMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationsHealthSnapshot" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "status" "OperationsHealthStatus" NOT NULL DEFAULT 'UNKNOWN',
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledTasksOk" BOOLEAN NOT NULL DEFAULT true,
    "freshnessOk" BOOLEAN NOT NULL DEFAULT true,
    "apiQuotaOk" BOOLEAN NOT NULL DEFAULT true,
    "openAlerts" INTEGER NOT NULL DEFAULT 0,
    "failedRuns" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperationsHealthSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyOperationsReport" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" "OperationsHealthStatus" NOT NULL DEFAULT 'UNKNOWN',
    "taskRunCount" INTEGER NOT NULL DEFAULT 0,
    "failedRunCount" INTEGER NOT NULL DEFAULT 0,
    "openAlertCount" INTEGER NOT NULL DEFAULT 0,
    "criticalAlertCount" INTEGER NOT NULL DEFAULT 0,
    "notificationCount" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT NOT NULL,
    "recommendations" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyOperationsReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleImprovementTask" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "seoOpportunityId" TEXT,
    "seoRecommendationId" TEXT,
    "alertIncidentId" TEXT,
    "growthRecommendationId" TEXT,
    "taskTitle" TEXT NOT NULL,
    "taskType" "ArticleImprovementTaskType" NOT NULL,
    "priority" "ArticleImprovementPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "ArticleImprovementStatus" NOT NULL DEFAULT 'BACKLOG',
    "sourceType" "ImprovementSourceType" NOT NULL DEFAULT 'MANUAL',
    "sourceId" TEXT,
    "targetKeyword" TEXT,
    "targetUrl" TEXT,
    "reason" TEXT NOT NULL,
    "expectedImpact" TEXT,
    "assignedTo" TEXT,
    "dueDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL DEFAULT 'local-admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleImprovementTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImprovementTaskSource" (
    "id" TEXT NOT NULL,
    "articleImprovementTaskId" TEXT NOT NULL,
    "sourceType" "ImprovementSourceType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImprovementTaskSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleRevisionSnapshot" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT NOT NULL,
    "articleImprovementTaskId" TEXT,
    "snapshotType" "ArticleRevisionSnapshotType" NOT NULL,
    "wordpressPostStatus" TEXT,
    "wordpressRevisionId" TEXT,
    "wordpressModifiedGmt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "excerpt" TEXT,
    "contentHtml" TEXT NOT NULL,
    "contentText" TEXT,
    "metaDescription" TEXT,
    "canonicalUrl" TEXT,
    "contentHash" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleRevisionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewriteDraft" (
    "id" TEXT NOT NULL,
    "articleImprovementTaskId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT NOT NULL,
    "draftTitle" TEXT NOT NULL,
    "draftStatus" "RewriteDraftStatus" NOT NULL DEFAULT 'DRAFT',
    "rewriteMode" "RewriteMode" NOT NULL DEFAULT 'PARTIAL_REWRITE',
    "version" INTEGER NOT NULL DEFAULT 1,
    "baseSnapshotId" TEXT,
    "approvedVersion" INTEGER,
    "summary" TEXT,
    "createdBy" TEXT NOT NULL DEFAULT 'local-admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewriteDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewriteSuggestion" (
    "id" TEXT NOT NULL,
    "rewriteDraftId" TEXT NOT NULL,
    "suggestionType" "RewriteSuggestionType" NOT NULL,
    "targetField" "RewriteTargetField" NOT NULL,
    "targetSelector" TEXT,
    "beforeText" TEXT,
    "afterText" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "evidence" JSONB,
    "riskLevel" "RewriteRiskLevel" NOT NULL DEFAULT 'LOW',
    "status" "RewriteSuggestionStatus" NOT NULL DEFAULT 'PROPOSED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewriteSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentChangeSet" (
    "id" TEXT NOT NULL,
    "rewriteDraftId" TEXT NOT NULL,
    "articleImprovementTaskId" TEXT NOT NULL,
    "changeType" "ContentChangeType" NOT NULL,
    "targetField" "RewriteTargetField" NOT NULL,
    "beforeValue" TEXT,
    "afterValue" TEXT,
    "beforeHash" TEXT,
    "afterHash" TEXT,
    "diffSummary" TEXT NOT NULL,
    "diffJson" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "ContentChangeStatus" NOT NULL DEFAULT 'PROPOSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentChangeSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewriteApproval" (
    "id" TEXT NOT NULL,
    "articleImprovementTaskId" TEXT NOT NULL,
    "rewriteDraftId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "reviewer" TEXT NOT NULL DEFAULT 'local-admin',
    "decision" "RewriteApprovalDecision" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewriteApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewriteRiskCheck" (
    "id" TEXT NOT NULL,
    "rewriteDraftId" TEXT NOT NULL,
    "status" "RewriteRiskCheckStatus" NOT NULL DEFAULT 'PASSED',
    "maxRiskLevel" "RewriteRiskLevel" NOT NULL DEFAULT 'LOW',
    "criticalCount" INTEGER NOT NULL DEFAULT 0,
    "highCount" INTEGER NOT NULL DEFAULT 0,
    "warningCount" INTEGER NOT NULL DEFAULT 0,
    "findings" JSONB,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewriteRiskCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPressRewriteSafetyCheck" (
    "id" TEXT NOT NULL,
    "rewriteDraftId" TEXT NOT NULL,
    "status" "WordPressRewriteSafetyStatus" NOT NULL,
    "updateMode" "WordPressRewriteUpdateMode" NOT NULL DEFAULT 'CREATE_NEW_DRAFT',
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "wordpressModifiedGmt" TIMESTAMP(3),
    "expectedVersion" INTEGER,
    "approvedVersion" INTEGER,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordPressRewriteSafetyCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPressDraftUpdate" (
    "id" TEXT NOT NULL,
    "rewriteDraftId" TEXT NOT NULL,
    "wordpressPostId" TEXT NOT NULL,
    "updateMode" "WordPressRewriteUpdateMode" NOT NULL DEFAULT 'CREATE_NEW_DRAFT',
    "status" "WordPressDraftUpdateStatus" NOT NULL,
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "wordpressDraftId" TEXT,
    "wordpressDraftUrl" TEXT,
    "safetyCheckId" TEXT,
    "requestSummary" TEXT,
    "responseSummary" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordPressDraftUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImprovementExecutionLog" (
    "id" TEXT NOT NULL,
    "articleImprovementTaskId" TEXT,
    "rewriteDraftId" TEXT,
    "eventType" "ImprovementExecutionEventType" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImprovementExecutionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoImpactMeasurement" (
    "id" TEXT NOT NULL,
    "articleImprovementTaskId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "status" "SeoImpactStatus" NOT NULL DEFAULT 'PENDING',
    "verdict" "SeoImpactVerdict" NOT NULL DEFAULT 'INSUFFICIENT_DATA',
    "beforeStart" TIMESTAMP(3) NOT NULL,
    "beforeEnd" TIMESTAMP(3) NOT NULL,
    "afterStart" TIMESTAMP(3) NOT NULL,
    "afterEnd" TIMESTAMP(3) NOT NULL,
    "beforeClicks" INTEGER NOT NULL DEFAULT 0,
    "afterClicks" INTEGER NOT NULL DEFAULT 0,
    "beforeImpressions" INTEGER NOT NULL DEFAULT 0,
    "afterImpressions" INTEGER NOT NULL DEFAULT 0,
    "beforeCtr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "afterCtr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "beforeAveragePosition" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "afterAveragePosition" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "beforeOrganicSessions" INTEGER NOT NULL DEFAULT 0,
    "afterOrganicSessions" INTEGER NOT NULL DEFAULT 0,
    "beforeAffiliateClicks" INTEGER NOT NULL DEFAULT 0,
    "afterAffiliateClicks" INTEGER NOT NULL DEFAULT 0,
    "beforeConversions" INTEGER NOT NULL DEFAULT 0,
    "afterConversions" INTEGER NOT NULL DEFAULT 0,
    "beforeApprovedRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "afterApprovedRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'INSUFFICIENT',
    "summary" TEXT,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoImpactMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialApiConnection" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "socialAccountId" TEXT,
    "platform" "Platform" NOT NULL,
    "connectionName" TEXT NOT NULL,
    "accountHandle" TEXT NOT NULL,
    "accountDisplayName" TEXT,
    "platformUserId" TEXT,
    "connectionStatus" "SocialApiConnectionStatus" NOT NULL DEFAULT 'NOT_CONNECTED',
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "lastConnectedAt" TIMESTAMP(3),
    "lastTokenRefreshAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialApiConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialApiToken" (
    "id" TEXT NOT NULL,
    "socialApiConnectionId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "accessTokenEncrypted" TEXT,
    "refreshTokenEncrypted" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "scopes" TEXT,
    "refreshTokenAvailable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialApiToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPostQueue" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "postId" TEXT,
    "wordpressPostId" TEXT,
    "creativeAssetId" TEXT,
    "socialApiConnectionId" TEXT,
    "platform" "Platform" NOT NULL,
    "sourceType" "SocialPostSourceType" NOT NULL DEFAULT 'MANUAL',
    "sourceId" TEXT,
    "queueStatus" "SocialPostQueueStatus" NOT NULL DEFAULT 'DRAFT',
    "approvalStatus" "SocialPostApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "linkCheckStatus" "SocialPostCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "riskCheckStatus" "SocialPostCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "dedupCheckStatus" "SocialPostCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "rateLimitStatus" "SocialRateLimitStatus" NOT NULL DEFAULT 'OK',
    "manualReviewStatus" "SocialManualReviewStatus",
    "postText" TEXT NOT NULL,
    "linkUrl" TEXT,
    "destinationUrl" TEXT,
    "imageUrl" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "queuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    "processingStartedAt" TIMESTAMP(3),
    "requestIdempotencyKey" TEXT NOT NULL,
    "madeWithAi" BOOLEAN NOT NULL DEFAULT true,
    "paidPartnership" BOOLEAN NOT NULL DEFAULT false,
    "utmCampaign" TEXT,
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "nextRetryAt" TIMESTAMP(3),
    "platformPostId" TEXT,
    "platformPostUrl" TEXT,
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialPostQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPostExecution" (
    "id" TEXT NOT NULL,
    "socialPostQueueId" TEXT NOT NULL,
    "socialApiConnectionId" TEXT,
    "status" "SocialPostExecutionStatus" NOT NULL DEFAULT 'STARTED',
    "platform" "Platform" NOT NULL,
    "requestIdempotencyKey" TEXT NOT NULL,
    "platformPostId" TEXT,
    "platformPostUrl" TEXT,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'POST',
    "httpStatus" INTEGER,
    "responseSummary" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "rateLimitResetAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "mockMode" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialPostExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaUpload" (
    "id" TEXT NOT NULL,
    "socialPostQueueId" TEXT,
    "creativeAssetId" TEXT,
    "platform" "Platform" NOT NULL,
    "uploadStatus" "SocialMediaUploadStatus" NOT NULL DEFAULT 'QUEUED',
    "mediaIdOnPlatform" TEXT,
    "mediaKey" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "expiresAfterSecs" INTEGER,
    "madeWithAi" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialMediaUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPostSafetyCheck" (
    "id" TEXT NOT NULL,
    "socialPostQueueId" TEXT NOT NULL,
    "status" "SocialPostCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "linkCheckStatus" "SocialPostCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "riskCheckStatus" "SocialPostCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "dedupCheckStatus" "SocialPostCheckStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "rateLimitStatus" "SocialRateLimitStatus" NOT NULL DEFAULT 'OK',
    "approvalStatus" "SocialPostApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "manualReviewRequired" BOOLEAN NOT NULL DEFAULT false,
    "reasons" JSONB,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialPostSafetyCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPostRateLimitLog" (
    "id" TEXT NOT NULL,
    "socialApiConnectionId" TEXT,
    "socialPostQueueId" TEXT,
    "platform" "Platform" NOT NULL,
    "endpoint" TEXT NOT NULL,
    "limit" INTEGER,
    "remaining" INTEGER,
    "resetAt" TIMESTAMP(3),
    "status" "SocialRateLimitStatus" NOT NULL DEFAULT 'OK',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialPostRateLimitLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPostRetryLog" (
    "id" TEXT NOT NULL,
    "socialPostQueueId" TEXT NOT NULL,
    "socialPostExecutionId" TEXT,
    "attempt" INTEGER NOT NULL,
    "retryAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialPostRetryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPostPerformanceSnapshot" (
    "id" TEXT NOT NULL,
    "socialPostQueueId" TEXT,
    "postId" TEXT,
    "socialAccountId" TEXT,
    "mediaId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "platformPostId" TEXT,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "engagements" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "reposts" INTEGER NOT NULL DEFAULT 0,
    "replies" INTEGER NOT NULL DEFAULT 0,
    "urlClicks" INTEGER NOT NULL DEFAULT 0,
    "engagementRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" "SocialPerformanceSource" NOT NULL DEFAULT 'MOCK',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'INSUFFICIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialPostPerformanceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPostAttribution" (
    "id" TEXT NOT NULL,
    "socialPostQueueId" TEXT,
    "mediaId" TEXT NOT NULL,
    "wordpressPostId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "approvedRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "source" "SocialPerformanceSource" NOT NULL DEFAULT 'MOCK',
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'INSUFFICIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialPostAttribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPostTemplate" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "platform" "Platform" NOT NULL,
    "templateName" TEXT NOT NULL,
    "templateText" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialPostTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialImprovementSuggestion" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "socialAccountId" TEXT,
    "socialPostQueueId" TEXT,
    "suggestionType" "SocialImprovementSuggestionType" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expectedImpact" TEXT,
    "status" "SocialImprovementSuggestionStatus" NOT NULL DEFAULT 'PROPOSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialImprovementSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialGrowthScoreSnapshot" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "postingScore" INTEGER NOT NULL DEFAULT 0,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    "trafficScore" INTEGER NOT NULL DEFAULT 0,
    "conversionScore" INTEGER NOT NULL DEFAULT 0,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "recommendation" TEXT NOT NULL,
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'INSUFFICIENT',
    "reasoning" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialGrowthScoreSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPostLock" (
    "id" TEXT NOT NULL,
    "socialPostQueueId" TEXT NOT NULL,
    "lockKey" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "heartbeatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "SocialPostLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPostManualReview" (
    "id" TEXT NOT NULL,
    "socialPostQueueId" TEXT NOT NULL,
    "status" "SocialManualReviewStatus" NOT NULL DEFAULT 'OPEN',
    "reason" TEXT NOT NULL,
    "resolution" TEXT,
    "reviewer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "SocialPostManualReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "campaignName" TEXT NOT NULL,
    "campaignCode" TEXT NOT NULL,
    "campaignType" "CampaignType" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'PLANNING',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "owner" TEXT,
    "description" TEXT,
    "primaryGoal" TEXT,
    "targetAudience" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'JPY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignObjective" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "objectiveType" "CampaignObjectiveType" NOT NULL,
    "objectiveName" TEXT NOT NULL,
    "targetValue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currentValue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "status" "CampaignObjectiveStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignTarget" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "targetType" "CampaignTargetType" NOT NULL,
    "targetValue" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignItem" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "itemType" "CampaignItemType" NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemTitle" TEXT,
    "allocationRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "status" "CampaignItemStatus" NOT NULL DEFAULT 'PLANNED',
    "plannedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignBudget" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "budgetType" "CampaignBudgetType" NOT NULL,
    "plannedAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'JPY',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignBudget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignCost" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "costType" "CampaignBudgetType" NOT NULL,
    "actualAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'JPY',
    "costDate" TIMESTAMP(3) NOT NULL,
    "source" "CampaignCostSource" NOT NULL DEFAULT 'MANUAL',
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignRevenueAttribution" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "sourceType" "AttributionSourceType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "allocationRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "pendingRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "approvedRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "conversionCount" INTEGER NOT NULL DEFAULT 0,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'LOW',
    "doubleCountProtected" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignRevenueAttribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignRoiSnapshot" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "pendingRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "approvedRevenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "plannedCost" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "actualCost" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "profitPending" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "profitApproved" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "roiPending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "roiApproved" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'LOW',
    "calculationKey" TEXT NOT NULL,
    "dataSource" TEXT NOT NULL DEFAULT 'local',
    "warnings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignRoiSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignGrowthScoreSnapshot" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "contentScore" INTEGER NOT NULL DEFAULT 0,
    "seoScore" INTEGER NOT NULL DEFAULT 0,
    "snsScore" INTEGER NOT NULL DEFAULT 0,
    "revenueScore" INTEGER NOT NULL DEFAULT 0,
    "roiScore" INTEGER NOT NULL DEFAULT 0,
    "executionScore" INTEGER NOT NULL DEFAULT 0,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "dataConfidence" "DataConfidence" NOT NULL DEFAULT 'LOW',
    "reasoning" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignGrowthScoreSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignRecommendation" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "recommendationType" "CampaignRecommendationType" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expectedImpact" TEXT,
    "status" "CampaignRecommendationStatus" NOT NULL DEFAULT 'PROPOSED',
    "requiresHumanReview" BOOLEAN NOT NULL DEFAULT true,
    "sourceInsightId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignRisk" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "riskType" "CampaignRiskType" NOT NULL,
    "severity" "CampaignRiskSeverity" NOT NULL DEFAULT 'WARNING',
    "status" "CampaignRiskStatus" NOT NULL DEFAULT 'OPEN',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignMilestone" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "status" "CampaignMilestoneStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentCalendarEvent" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT,
    "mediaId" TEXT NOT NULL,
    "eventType" "CalendarEventType" NOT NULL,
    "status" "CalendarEventStatus" NOT NULL DEFAULT 'PLANNED',
    "title" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "itemType" "CampaignItemType",
    "itemId" TEXT,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "approvalStatus" TEXT,
    "linkCheckStatus" TEXT,
    "hasCreative" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentCalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentCalendarConflict" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT,
    "calendarEventId" TEXT,
    "conflictType" "CalendarConflictType" NOT NULL,
    "status" "CalendarConflictStatus" NOT NULL DEFAULT 'OPEN',
    "severity" "CampaignRiskSeverity" NOT NULL DEFAULT 'WARNING',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentCalendarConflict_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportTemplate" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "reportType" "ReportType" NOT NULL,
    "templateName" TEXT NOT NULL,
    "sectionOrder" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportSchedule" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "campaignId" TEXT,
    "reportTemplateId" TEXT,
    "reportType" "ReportType" NOT NULL,
    "period" "ReportPeriod" NOT NULL DEFAULT 'WEEKLY',
    "cronExpression" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedReport" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "campaignId" TEXT,
    "reportTemplateId" TEXT,
    "reportType" "ReportType" NOT NULL,
    "status" "GeneratedReportStatus" NOT NULL DEFAULT 'DRAFT',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "dataJson" JSONB,
    "sourceSummaryJson" JSONB,
    "dataSource" TEXT NOT NULL DEFAULT 'local',
    "generationKey" TEXT NOT NULL,
    "requiresHumanReview" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportSection" (
    "id" TEXT NOT NULL,
    "generatedReportId" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "sectionOrder" INTEGER NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "dataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportExport" (
    "id" TEXT NOT NULL,
    "generatedReportId" TEXT NOT NULL,
    "exportFormat" "ReportExportFormat" NOT NULL,
    "status" "ReportExportStatus" NOT NULL DEFAULT 'MOCK_EXPORTED',
    "filePath" TEXT,
    "downloadUrl" TEXT,
    "contentPreview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessInsight" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT,
    "campaignId" TEXT,
    "insightType" "BusinessInsightType" NOT NULL,
    "status" "BusinessInsightStatus" NOT NULL DEFAULT 'PROPOSED',
    "priority" INTEGER NOT NULL DEFAULT 50,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "evidenceJson" JSONB,
    "recommendation" TEXT,
    "requiresHumanReview" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialAccount_platform_handle_key" ON "SocialAccount"("platform", "handle");

-- CreateIndex
CREATE INDEX "Post_status_scheduledAt_idx" ON "Post"("status", "scheduledAt");

-- CreateIndex
CREATE INDEX "Post_linkCheckStatus_checkedAt_idx" ON "Post"("linkCheckStatus", "checkedAt");

-- CreateIndex
CREATE INDEX "Post_lockedAt_idx" ON "Post"("lockedAt");

-- CreateIndex
CREATE INDEX "ApiUsageLog_platform_eventType_createdAt_idx" ON "ApiUsageLog"("platform", "eventType", "createdAt");

-- CreateIndex
CREATE INDEX "ApiUsageLog_socialAccountId_createdAt_idx" ON "ApiUsageLog"("socialAccountId", "createdAt");

-- CreateIndex
CREATE INDEX "LinkCheck_status_checkedAt_idx" ON "LinkCheck"("status", "checkedAt");

-- CreateIndex
CREATE INDEX "LinkCheck_url_idx" ON "LinkCheck"("url");

-- CreateIndex
CREATE INDEX "PlatformCredential_platform_idx" ON "PlatformCredential"("platform");

-- CreateIndex
CREATE INDEX "PlatformCredential_socialAccountId_idx" ON "PlatformCredential"("socialAccountId");

-- CreateIndex
CREATE INDEX "WordPressSite_connectionStatus_idx" ON "WordPressSite"("connectionStatus");

-- CreateIndex
CREATE UNIQUE INDEX "WordPressSite_mediaId_siteUrl_key" ON "WordPressSite"("mediaId", "siteUrl");

-- CreateIndex
CREATE INDEX "WordPressPost_localStatus_updatedAt_idx" ON "WordPressPost"("localStatus", "updatedAt");

-- CreateIndex
CREATE INDEX "WordPressPost_duplicateCheckStatus_idx" ON "WordPressPost"("duplicateCheckStatus");

-- CreateIndex
CREATE UNIQUE INDEX "WordPressPost_wordpressSiteId_slug_key" ON "WordPressPost"("wordpressSiteId", "slug");

-- CreateIndex
CREATE INDEX "WordPressCategory_slug_idx" ON "WordPressCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WordPressCategory_wordpressSiteId_wordpressCategoryId_key" ON "WordPressCategory"("wordpressSiteId", "wordpressCategoryId");

-- CreateIndex
CREATE INDEX "WordPressTag_slug_idx" ON "WordPressTag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WordPressTag_wordpressSiteId_wordpressTagId_key" ON "WordPressTag"("wordpressSiteId", "wordpressTagId");

-- CreateIndex
CREATE INDEX "WordPressSyncLog_wordpressSiteId_createdAt_idx" ON "WordPressSyncLog"("wordpressSiteId", "createdAt");

-- CreateIndex
CREATE INDEX "WordPressSyncLog_action_success_createdAt_idx" ON "WordPressSyncLog"("action", "success", "createdAt");

-- CreateIndex
CREATE INDEX "CanvaConnection_mediaId_connectionStatus_idx" ON "CanvaConnection"("mediaId", "connectionStatus");

-- CreateIndex
CREATE INDEX "CanvaBrandTemplate_mediaId_templateType_status_idx" ON "CanvaBrandTemplate"("mediaId", "templateType", "status");

-- CreateIndex
CREATE INDEX "CanvaDesignJob_mediaId_status_createdAt_idx" ON "CanvaDesignJob"("mediaId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "CreativeAsset_mediaId_assetType_approvalStatus_idx" ON "CreativeAsset"("mediaId", "assetType", "approvalStatus");

-- CreateIndex
CREATE INDEX "CreativeAsset_riskCheckStatus_idx" ON "CreativeAsset"("riskCheckStatus");

-- CreateIndex
CREATE INDEX "CreativeAssetUsage_creativeAssetId_usageType_idx" ON "CreativeAssetUsage"("creativeAssetId", "usageType");

-- CreateIndex
CREATE INDEX "CanvaSyncLog_action_success_createdAt_idx" ON "CanvaSyncLog"("action", "success", "createdAt");

-- CreateIndex
CREATE INDEX "CanvaSyncLog_canvaConnectionId_createdAt_idx" ON "CanvaSyncLog"("canvaConnectionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateNetwork_slug_key" ON "AffiliateNetwork"("slug");

-- CreateIndex
CREATE INDEX "AffiliateNetwork_status_idx" ON "AffiliateNetwork"("status");

-- CreateIndex
CREATE INDEX "AffiliateProgram_affiliateNetworkId_status_idx" ON "AffiliateProgram"("affiliateNetworkId", "status");

-- CreateIndex
CREATE INDEX "AffiliateProgram_riskLevel_idx" ON "AffiliateProgram"("riskLevel");

-- CreateIndex
CREATE INDEX "AffiliateProgramMediaSite_applicationStatus_priority_idx" ON "AffiliateProgramMediaSite"("applicationStatus", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateProgramMediaSite_mediaId_affiliateProgramId_key" ON "AffiliateProgramMediaSite"("mediaId", "affiliateProgramId");

-- CreateIndex
CREATE INDEX "AffiliateLink_mediaId_status_idx" ON "AffiliateLink"("mediaId", "status");

-- CreateIndex
CREATE INDEX "AffiliateLink_affiliateProgramId_idx" ON "AffiliateLink"("affiliateProgramId");

-- CreateIndex
CREATE INDEX "AffiliatePlacement_mediaId_status_idx" ON "AffiliatePlacement"("mediaId", "status");

-- CreateIndex
CREATE INDEX "AffiliatePlacement_wordpressPostId_idx" ON "AffiliatePlacement"("wordpressPostId");

-- CreateIndex
CREATE INDEX "RevenueEvent_mediaId_eventDate_idx" ON "RevenueEvent"("mediaId", "eventDate");

-- CreateIndex
CREATE INDEX "RevenueEvent_status_eventDate_idx" ON "RevenueEvent"("status", "eventDate");

-- CreateIndex
CREATE INDEX "RevenueEvent_orderIdHash_idx" ON "RevenueEvent"("orderIdHash");

-- CreateIndex
CREATE INDEX "RevenueImportRowError_importBatchId_severity_idx" ON "RevenueImportRowError"("importBatchId", "severity");

-- CreateIndex
CREATE INDEX "TrafficMetricDaily_metricDate_idx" ON "TrafficMetricDaily"("metricDate");

-- CreateIndex
CREATE UNIQUE INDEX "TrafficMetricDaily_mediaId_metricDate_key" ON "TrafficMetricDaily"("mediaId", "metricDate");

-- CreateIndex
CREATE INDEX "ContentPerformanceDaily_mediaId_metricDate_idx" ON "ContentPerformanceDaily"("mediaId", "metricDate");

-- CreateIndex
CREATE INDEX "ContentPerformanceDaily_wordpressPostId_metricDate_idx" ON "ContentPerformanceDaily"("wordpressPostId", "metricDate");

-- CreateIndex
CREATE UNIQUE INDEX "SocialPostPerformanceDaily_postId_metricDate_key" ON "SocialPostPerformanceDaily"("postId", "metricDate");

-- CreateIndex
CREATE INDEX "OperatingCost_mediaId_costDate_idx" ON "OperatingCost"("mediaId", "costDate");

-- CreateIndex
CREATE INDEX "GrowthScoreSnapshot_mediaId_periodEnd_idx" ON "GrowthScoreSnapshot"("mediaId", "periodEnd");

-- CreateIndex
CREATE INDEX "GrowthScoreSnapshot_totalScore_idx" ON "GrowthScoreSnapshot"("totalScore");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthScoreRule_key_key" ON "GrowthScoreRule"("key");

-- CreateIndex
CREATE INDEX "GrowthRecommendation_mediaId_status_priority_idx" ON "GrowthRecommendation"("mediaId", "status", "priority");

-- CreateIndex
CREATE INDEX "GoogleConnection_mediaId_connectionStatus_idx" ON "GoogleConnection"("mediaId", "connectionStatus");

-- CreateIndex
CREATE UNIQUE INDEX "GA4Property_mediaId_propertyId_key" ON "GA4Property"("mediaId", "propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "SearchConsoleProperty_mediaId_siteUrl_key" ON "SearchConsoleProperty"("mediaId", "siteUrl");

-- CreateIndex
CREATE UNIQUE INDEX "GA4MetricDaily_mediaId_ga4PropertyId_date_source_key" ON "GA4MetricDaily"("mediaId", "ga4PropertyId", "date", "source");

-- CreateIndex
CREATE INDEX "GA4PageMetricDaily_mediaId_date_idx" ON "GA4PageMetricDaily"("mediaId", "date");

-- CreateIndex
CREATE INDEX "GA4PageMetricDaily_wordpressPostId_date_idx" ON "GA4PageMetricDaily"("wordpressPostId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "GA4PageMetricDaily_mediaId_ga4PropertyId_date_pagePath_sour_key" ON "GA4PageMetricDaily"("mediaId", "ga4PropertyId", "date", "pagePath", "source");

-- CreateIndex
CREATE INDEX "SearchConsoleQueryDaily_mediaId_date_idx" ON "SearchConsoleQueryDaily"("mediaId", "date");

-- CreateIndex
CREATE INDEX "SearchConsoleQueryDaily_query_idx" ON "SearchConsoleQueryDaily"("query");

-- CreateIndex
CREATE UNIQUE INDEX "SearchConsoleQueryDaily_mediaId_searchConsolePropertyId_dat_key" ON "SearchConsoleQueryDaily"("mediaId", "searchConsolePropertyId", "date", "query", "searchType", "country", "device", "source");

-- CreateIndex
CREATE INDEX "SearchConsolePageDaily_mediaId_date_idx" ON "SearchConsolePageDaily"("mediaId", "date");

-- CreateIndex
CREATE INDEX "SearchConsolePageDaily_wordpressPostId_date_idx" ON "SearchConsolePageDaily"("wordpressPostId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SearchConsolePageDaily_mediaId_searchConsolePropertyId_date_key" ON "SearchConsolePageDaily"("mediaId", "searchConsolePropertyId", "date", "pageUrl", "searchType", "source");

-- CreateIndex
CREATE INDEX "SearchConsoleQueryPageDaily_mediaId_date_idx" ON "SearchConsoleQueryPageDaily"("mediaId", "date");

-- CreateIndex
CREATE INDEX "SearchConsoleQueryPageDaily_query_idx" ON "SearchConsoleQueryPageDaily"("query");

-- CreateIndex
CREATE INDEX "SearchConsoleQueryPageDaily_wordpressPostId_date_idx" ON "SearchConsoleQueryPageDaily"("wordpressPostId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SearchConsoleQueryPageDaily_mediaId_searchConsolePropertyId_key" ON "SearchConsoleQueryPageDaily"("mediaId", "searchConsolePropertyId", "date", "query", "pageUrl", "searchType", "country", "device", "source");

-- CreateIndex
CREATE INDEX "SeoKeyword_priority_idx" ON "SeoKeyword"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "SeoKeyword_mediaId_normalizedKeyword_key" ON "SeoKeyword"("mediaId", "normalizedKeyword");

-- CreateIndex
CREATE UNIQUE INDEX "SeoPageKeyword_wordpressPostId_seoKeywordId_key" ON "SeoPageKeyword"("wordpressPostId", "seoKeywordId");

-- CreateIndex
CREATE INDEX "SeoOpportunity_mediaId_priority_status_idx" ON "SeoOpportunity"("mediaId", "priority", "status");

-- CreateIndex
CREATE INDEX "SeoOpportunity_wordpressPostId_idx" ON "SeoOpportunity"("wordpressPostId");

-- CreateIndex
CREATE INDEX "SeoRecommendation_mediaId_approvalStatus_priority_idx" ON "SeoRecommendation"("mediaId", "approvalStatus", "priority");

-- CreateIndex
CREATE INDEX "SeoRecommendation_wordpressPostId_idx" ON "SeoRecommendation"("wordpressPostId");

-- CreateIndex
CREATE INDEX "SeoAnalysisSnapshot_mediaId_periodEnd_idx" ON "SeoAnalysisSnapshot"("mediaId", "periodEnd");

-- CreateIndex
CREATE INDEX "SeoImportRowError_seoImportBatchId_severity_idx" ON "SeoImportRowError"("seoImportBatchId", "severity");

-- CreateIndex
CREATE INDEX "GoogleSyncJob_mediaId_jobType_status_idx" ON "GoogleSyncJob"("mediaId", "jobType", "status");

-- CreateIndex
CREATE INDEX "GoogleSyncRun_mediaId_status_startedAt_idx" ON "GoogleSyncRun"("mediaId", "status", "startedAt");

-- CreateIndex
CREATE INDEX "GoogleSyncRun_googleSyncJobId_status_idx" ON "GoogleSyncRun"("googleSyncJobId", "status");

-- CreateIndex
CREATE INDEX "GoogleApiQuotaLog_apiName_createdAt_idx" ON "GoogleApiQuotaLog"("apiName", "createdAt");

-- CreateIndex
CREATE INDEX "GoogleApiQuotaLog_mediaId_apiName_createdAt_idx" ON "GoogleApiQuotaLog"("mediaId", "apiName", "createdAt");

-- CreateIndex
CREATE INDEX "GoogleApiErrorLog_apiName_createdAt_idx" ON "GoogleApiErrorLog"("apiName", "createdAt");

-- CreateIndex
CREATE INDEX "GoogleApiErrorLog_mediaId_actionRequired_createdAt_idx" ON "GoogleApiErrorLog"("mediaId", "actionRequired", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledTask_taskKey_key" ON "ScheduledTask"("taskKey");

-- CreateIndex
CREATE INDEX "ScheduledTask_enabled_nextRunAt_idx" ON "ScheduledTask"("enabled", "nextRunAt");

-- CreateIndex
CREATE INDEX "ScheduledTask_taskType_status_idx" ON "ScheduledTask"("taskType", "status");

-- CreateIndex
CREATE INDEX "ScheduledTaskRun_status_startedAt_idx" ON "ScheduledTaskRun"("status", "startedAt");

-- CreateIndex
CREATE INDEX "ScheduledTaskRun_scheduledTaskId_createdAt_idx" ON "ScheduledTaskRun"("scheduledTaskId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TaskLease_leaseKey_key" ON "TaskLease"("leaseKey");

-- CreateIndex
CREATE INDEX "TaskLease_expiresAt_releasedAt_idx" ON "TaskLease"("expiresAt", "releasedAt");

-- CreateIndex
CREATE INDEX "DataFreshnessStatus_status_checkedAt_idx" ON "DataFreshnessStatus"("status", "checkedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DataFreshnessStatus_mediaId_source_key" ON "DataFreshnessStatus"("mediaId", "source");

-- CreateIndex
CREATE UNIQUE INDEX "AlertRule_ruleKey_key" ON "AlertRule"("ruleKey");

-- CreateIndex
CREATE INDEX "AlertIncident_status_severity_detectedAt_idx" ON "AlertIncident"("status", "severity", "detectedAt");

-- CreateIndex
CREATE INDEX "AlertIncident_mediaId_status_idx" ON "AlertIncident"("mediaId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AlertIncident_dedupKey_key" ON "AlertIncident"("dedupKey");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationChannel_channelKey_key" ON "NotificationChannel"("channelKey");

-- CreateIndex
CREATE INDEX "NotificationEvent_status_priority_createdAt_idx" ON "NotificationEvent"("status", "priority", "createdAt");

-- CreateIndex
CREATE INDEX "NotificationEvent_dedupKey_idx" ON "NotificationEvent"("dedupKey");

-- CreateIndex
CREATE INDEX "NotificationDelivery_status_attemptedAt_idx" ON "NotificationDelivery"("status", "attemptedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationDelivery_notificationEventId_notificationChanne_key" ON "NotificationDelivery"("notificationEventId", "notificationChannelId");

-- CreateIndex
CREATE INDEX "OperationsHealthSnapshot_status_checkedAt_idx" ON "OperationsHealthSnapshot"("status", "checkedAt");

-- CreateIndex
CREATE INDEX "WeeklyOperationsReport_periodEnd_status_idx" ON "WeeklyOperationsReport"("periodEnd", "status");

-- CreateIndex
CREATE INDEX "ArticleImprovementTask_mediaId_status_priority_idx" ON "ArticleImprovementTask"("mediaId", "status", "priority");

-- CreateIndex
CREATE INDEX "ArticleImprovementTask_sourceType_sourceId_idx" ON "ArticleImprovementTask"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "ArticleImprovementTask_wordpressPostId_status_idx" ON "ArticleImprovementTask"("wordpressPostId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ImprovementTaskSource_articleImprovementTaskId_sourceType_s_key" ON "ImprovementTaskSource"("articleImprovementTaskId", "sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "ArticleRevisionSnapshot_wordpressPostId_snapshotType_captur_idx" ON "ArticleRevisionSnapshot"("wordpressPostId", "snapshotType", "capturedAt");

-- CreateIndex
CREATE INDEX "ArticleRevisionSnapshot_articleImprovementTaskId_idx" ON "ArticleRevisionSnapshot"("articleImprovementTaskId");

-- CreateIndex
CREATE INDEX "RewriteDraft_articleImprovementTaskId_draftStatus_idx" ON "RewriteDraft"("articleImprovementTaskId", "draftStatus");

-- CreateIndex
CREATE INDEX "RewriteDraft_wordpressPostId_version_idx" ON "RewriteDraft"("wordpressPostId", "version");

-- CreateIndex
CREATE INDEX "RewriteSuggestion_rewriteDraftId_status_riskLevel_idx" ON "RewriteSuggestion"("rewriteDraftId", "status", "riskLevel");

-- CreateIndex
CREATE INDEX "ContentChangeSet_rewriteDraftId_version_status_idx" ON "ContentChangeSet"("rewriteDraftId", "version", "status");

-- CreateIndex
CREATE INDEX "RewriteApproval_rewriteDraftId_version_idx" ON "RewriteApproval"("rewriteDraftId", "version");

-- CreateIndex
CREATE INDEX "RewriteRiskCheck_rewriteDraftId_status_checkedAt_idx" ON "RewriteRiskCheck"("rewriteDraftId", "status", "checkedAt");

-- CreateIndex
CREATE INDEX "WordPressRewriteSafetyCheck_rewriteDraftId_status_checkedAt_idx" ON "WordPressRewriteSafetyCheck"("rewriteDraftId", "status", "checkedAt");

-- CreateIndex
CREATE INDEX "WordPressDraftUpdate_rewriteDraftId_status_idx" ON "WordPressDraftUpdate"("rewriteDraftId", "status");

-- CreateIndex
CREATE INDEX "ImprovementExecutionLog_articleImprovementTaskId_createdAt_idx" ON "ImprovementExecutionLog"("articleImprovementTaskId", "createdAt");

-- CreateIndex
CREATE INDEX "ImprovementExecutionLog_eventType_createdAt_idx" ON "ImprovementExecutionLog"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "SeoImpactMeasurement_status_verdict_measuredAt_idx" ON "SeoImpactMeasurement"("status", "verdict", "measuredAt");

-- CreateIndex
CREATE INDEX "SeoImpactMeasurement_mediaId_measuredAt_idx" ON "SeoImpactMeasurement"("mediaId", "measuredAt");

-- CreateIndex
CREATE INDEX "SocialApiConnection_platform_connectionStatus_idx" ON "SocialApiConnection"("platform", "connectionStatus");

-- CreateIndex
CREATE INDEX "SocialApiConnection_mediaId_platform_idx" ON "SocialApiConnection"("mediaId", "platform");

-- CreateIndex
CREATE INDEX "SocialApiToken_platform_tokenExpiresAt_idx" ON "SocialApiToken"("platform", "tokenExpiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "SocialPostQueue_requestIdempotencyKey_key" ON "SocialPostQueue"("requestIdempotencyKey");

-- CreateIndex
CREATE INDEX "SocialPostQueue_queueStatus_scheduledAt_idx" ON "SocialPostQueue"("queueStatus", "scheduledAt");

-- CreateIndex
CREATE INDEX "SocialPostQueue_mediaId_platform_idx" ON "SocialPostQueue"("mediaId", "platform");

-- CreateIndex
CREATE INDEX "SocialPostQueue_socialAccountId_queueStatus_idx" ON "SocialPostQueue"("socialAccountId", "queueStatus");

-- CreateIndex
CREATE INDEX "SocialPostExecution_platform_status_createdAt_idx" ON "SocialPostExecution"("platform", "status", "createdAt");

-- CreateIndex
CREATE INDEX "SocialPostExecution_socialPostQueueId_createdAt_idx" ON "SocialPostExecution"("socialPostQueueId", "createdAt");

-- CreateIndex
CREATE INDEX "SocialMediaUpload_platform_uploadStatus_idx" ON "SocialMediaUpload"("platform", "uploadStatus");

-- CreateIndex
CREATE INDEX "SocialPostSafetyCheck_status_checkedAt_idx" ON "SocialPostSafetyCheck"("status", "checkedAt");

-- CreateIndex
CREATE INDEX "SocialPostRateLimitLog_platform_status_createdAt_idx" ON "SocialPostRateLimitLog"("platform", "status", "createdAt");

-- CreateIndex
CREATE INDEX "SocialPostRetryLog_socialPostQueueId_retryAt_idx" ON "SocialPostRetryLog"("socialPostQueueId", "retryAt");

-- CreateIndex
CREATE INDEX "SocialPostPerformanceSnapshot_mediaId_snapshotDate_idx" ON "SocialPostPerformanceSnapshot"("mediaId", "snapshotDate");

-- CreateIndex
CREATE INDEX "SocialPostPerformanceSnapshot_platform_source_idx" ON "SocialPostPerformanceSnapshot"("platform", "source");

-- CreateIndex
CREATE INDEX "SocialPostAttribution_mediaId_date_idx" ON "SocialPostAttribution"("mediaId", "date");

-- CreateIndex
CREATE INDEX "SocialPostTemplate_platform_enabled_idx" ON "SocialPostTemplate"("platform", "enabled");

-- CreateIndex
CREATE INDEX "SocialImprovementSuggestion_mediaId_status_priority_idx" ON "SocialImprovementSuggestion"("mediaId", "status", "priority");

-- CreateIndex
CREATE INDEX "SocialGrowthScoreSnapshot_mediaId_periodEnd_idx" ON "SocialGrowthScoreSnapshot"("mediaId", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "SocialPostLock_lockKey_key" ON "SocialPostLock"("lockKey");

-- CreateIndex
CREATE INDEX "SocialPostLock_expiresAt_releasedAt_idx" ON "SocialPostLock"("expiresAt", "releasedAt");

-- CreateIndex
CREATE INDEX "SocialPostManualReview_status_createdAt_idx" ON "SocialPostManualReview"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_campaignCode_key" ON "Campaign"("campaignCode");

-- CreateIndex
CREATE INDEX "Campaign_mediaId_status_periodStart_idx" ON "Campaign"("mediaId", "status", "periodStart");

-- CreateIndex
CREATE INDEX "Campaign_periodStart_periodEnd_idx" ON "Campaign"("periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "CampaignObjective_campaignId_objectiveType_status_idx" ON "CampaignObjective"("campaignId", "objectiveType", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignTarget_campaignId_targetType_targetValue_key" ON "CampaignTarget"("campaignId", "targetType", "targetValue");

-- CreateIndex
CREATE INDEX "CampaignItem_itemType_itemId_idx" ON "CampaignItem"("itemType", "itemId");

-- CreateIndex
CREATE INDEX "CampaignItem_campaignId_status_idx" ON "CampaignItem"("campaignId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignItem_campaignId_itemType_itemId_key" ON "CampaignItem"("campaignId", "itemType", "itemId");

-- CreateIndex
CREATE INDEX "CampaignBudget_campaignId_budgetType_idx" ON "CampaignBudget"("campaignId", "budgetType");

-- CreateIndex
CREATE INDEX "CampaignCost_campaignId_costDate_idx" ON "CampaignCost"("campaignId", "costDate");

-- CreateIndex
CREATE INDEX "CampaignRevenueAttribution_sourceType_sourceId_idx" ON "CampaignRevenueAttribution"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "CampaignRevenueAttribution_campaignId_eventDate_idx" ON "CampaignRevenueAttribution"("campaignId", "eventDate");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignRevenueAttribution_campaignId_sourceType_sourceId_key" ON "CampaignRevenueAttribution"("campaignId", "sourceType", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignRoiSnapshot_calculationKey_key" ON "CampaignRoiSnapshot"("calculationKey");

-- CreateIndex
CREATE INDEX "CampaignRoiSnapshot_campaignId_periodEnd_idx" ON "CampaignRoiSnapshot"("campaignId", "periodEnd");

-- CreateIndex
CREATE INDEX "CampaignGrowthScoreSnapshot_campaignId_periodEnd_idx" ON "CampaignGrowthScoreSnapshot"("campaignId", "periodEnd");

-- CreateIndex
CREATE INDEX "CampaignRecommendation_campaignId_status_priority_idx" ON "CampaignRecommendation"("campaignId", "status", "priority");

-- CreateIndex
CREATE INDEX "CampaignRisk_campaignId_status_severity_idx" ON "CampaignRisk"("campaignId", "status", "severity");

-- CreateIndex
CREATE INDEX "CampaignMilestone_campaignId_dueAt_status_idx" ON "CampaignMilestone"("campaignId", "dueAt", "status");

-- CreateIndex
CREATE INDEX "ContentCalendarEvent_scheduledAt_eventType_idx" ON "ContentCalendarEvent"("scheduledAt", "eventType");

-- CreateIndex
CREATE INDEX "ContentCalendarEvent_campaignId_scheduledAt_idx" ON "ContentCalendarEvent"("campaignId", "scheduledAt");

-- CreateIndex
CREATE INDEX "ContentCalendarConflict_status_conflictType_detectedAt_idx" ON "ContentCalendarConflict"("status", "conflictType", "detectedAt");

-- CreateIndex
CREATE INDEX "ContentCalendarConflict_campaignId_status_idx" ON "ContentCalendarConflict"("campaignId", "status");

-- CreateIndex
CREATE INDEX "ReportTemplate_reportType_enabled_idx" ON "ReportTemplate"("reportType", "enabled");

-- CreateIndex
CREATE INDEX "ReportSchedule_enabled_nextRunAt_idx" ON "ReportSchedule"("enabled", "nextRunAt");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedReport_generationKey_key" ON "GeneratedReport"("generationKey");

-- CreateIndex
CREATE INDEX "GeneratedReport_reportType_status_createdAt_idx" ON "GeneratedReport"("reportType", "status", "createdAt");

-- CreateIndex
CREATE INDEX "GeneratedReport_campaignId_periodEnd_idx" ON "GeneratedReport"("campaignId", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "ReportSection_generatedReportId_sectionKey_key" ON "ReportSection"("generatedReportId", "sectionKey");

-- CreateIndex
CREATE UNIQUE INDEX "ReportExport_generatedReportId_exportFormat_key" ON "ReportExport"("generatedReportId", "exportFormat");

-- CreateIndex
CREATE INDEX "BusinessInsight_status_priority_createdAt_idx" ON "BusinessInsight"("status", "priority", "createdAt");

-- CreateIndex
CREATE INDEX "BusinessInsight_campaignId_insightType_idx" ON "BusinessInsight"("campaignId", "insightType");

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_creativeAssetId_fkey" FOREIGN KEY ("creativeAssetId") REFERENCES "CreativeAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostApproval" ADD CONSTRAINT "PostApproval_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiUsageLog" ADD CONSTRAINT "ApiUsageLog_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiUsageLog" ADD CONSTRAINT "ApiUsageLog_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkCheck" ADD CONSTRAINT "LinkCheck_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformCredential" ADD CONSTRAINT "PlatformCredential_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressSite" ADD CONSTRAINT "WordPressSite_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressPost" ADD CONSTRAINT "WordPressPost_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressPost" ADD CONSTRAINT "WordPressPost_wordpressSiteId_fkey" FOREIGN KEY ("wordpressSiteId") REFERENCES "WordPressSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressPost" ADD CONSTRAINT "WordPressPost_creativeAssetId_fkey" FOREIGN KEY ("creativeAssetId") REFERENCES "CreativeAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressMedia" ADD CONSTRAINT "WordPressMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressMedia" ADD CONSTRAINT "WordPressMedia_wordpressSiteId_fkey" FOREIGN KEY ("wordpressSiteId") REFERENCES "WordPressSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressMedia" ADD CONSTRAINT "WordPressMedia_creativeAssetId_fkey" FOREIGN KEY ("creativeAssetId") REFERENCES "CreativeAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressCategory" ADD CONSTRAINT "WordPressCategory_wordpressSiteId_fkey" FOREIGN KEY ("wordpressSiteId") REFERENCES "WordPressSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressTag" ADD CONSTRAINT "WordPressTag_wordpressSiteId_fkey" FOREIGN KEY ("wordpressSiteId") REFERENCES "WordPressSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressSyncLog" ADD CONSTRAINT "WordPressSyncLog_wordpressSiteId_fkey" FOREIGN KEY ("wordpressSiteId") REFERENCES "WordPressSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressSyncLog" ADD CONSTRAINT "WordPressSyncLog_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaConnection" ADD CONSTRAINT "CanvaConnection_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaBrandTemplate" ADD CONSTRAINT "CanvaBrandTemplate_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaBrandTemplate" ADD CONSTRAINT "CanvaBrandTemplate_canvaConnectionId_fkey" FOREIGN KEY ("canvaConnectionId") REFERENCES "CanvaConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaDesignJob" ADD CONSTRAINT "CanvaDesignJob_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaDesignJob" ADD CONSTRAINT "CanvaDesignJob_canvaConnectionId_fkey" FOREIGN KEY ("canvaConnectionId") REFERENCES "CanvaConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaDesignJob" ADD CONSTRAINT "CanvaDesignJob_canvaBrandTemplateId_fkey" FOREIGN KEY ("canvaBrandTemplateId") REFERENCES "CanvaBrandTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaDesignJob" ADD CONSTRAINT "CanvaDesignJob_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaDesignJob" ADD CONSTRAINT "CanvaDesignJob_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaExport" ADD CONSTRAINT "CanvaExport_canvaDesignJobId_fkey" FOREIGN KEY ("canvaDesignJobId") REFERENCES "CanvaDesignJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreativeAsset" ADD CONSTRAINT "CreativeAsset_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreativeAsset" ADD CONSTRAINT "CreativeAsset_canvaDesignJobId_fkey" FOREIGN KEY ("canvaDesignJobId") REFERENCES "CanvaDesignJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreativeAsset" ADD CONSTRAINT "CreativeAsset_canvaExportId_fkey" FOREIGN KEY ("canvaExportId") REFERENCES "CanvaExport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreativeAsset" ADD CONSTRAINT "CreativeAsset_wordpressMediaId_fkey" FOREIGN KEY ("wordpressMediaId") REFERENCES "WordPressMedia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreativeAssetUsage" ADD CONSTRAINT "CreativeAssetUsage_creativeAssetId_fkey" FOREIGN KEY ("creativeAssetId") REFERENCES "CreativeAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreativeAssetUsage" ADD CONSTRAINT "CreativeAssetUsage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreativeAssetUsage" ADD CONSTRAINT "CreativeAssetUsage_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreativeAssetUsage" ADD CONSTRAINT "CreativeAssetUsage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageApproval" ADD CONSTRAINT "ImageApproval_creativeAssetId_fkey" FOREIGN KEY ("creativeAssetId") REFERENCES "CreativeAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaSyncLog" ADD CONSTRAINT "CanvaSyncLog_canvaConnectionId_fkey" FOREIGN KEY ("canvaConnectionId") REFERENCES "CanvaConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaSyncLog" ADD CONSTRAINT "CanvaSyncLog_canvaDesignJobId_fkey" FOREIGN KEY ("canvaDesignJobId") REFERENCES "CanvaDesignJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateProgram" ADD CONSTRAINT "AffiliateProgram_affiliateNetworkId_fkey" FOREIGN KEY ("affiliateNetworkId") REFERENCES "AffiliateNetwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateProgramMediaSite" ADD CONSTRAINT "AffiliateProgramMediaSite_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateProgramMediaSite" ADD CONSTRAINT "AffiliateProgramMediaSite_affiliateProgramId_fkey" FOREIGN KEY ("affiliateProgramId") REFERENCES "AffiliateProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_affiliateProgramId_fkey" FOREIGN KEY ("affiliateProgramId") REFERENCES "AffiliateProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliatePlacement" ADD CONSTRAINT "AffiliatePlacement_affiliateLinkId_fkey" FOREIGN KEY ("affiliateLinkId") REFERENCES "AffiliateLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliatePlacement" ADD CONSTRAINT "AffiliatePlacement_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliatePlacement" ADD CONSTRAINT "AffiliatePlacement_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueEvent" ADD CONSTRAINT "RevenueEvent_affiliateNetworkId_fkey" FOREIGN KEY ("affiliateNetworkId") REFERENCES "AffiliateNetwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueEvent" ADD CONSTRAINT "RevenueEvent_affiliateProgramId_fkey" FOREIGN KEY ("affiliateProgramId") REFERENCES "AffiliateProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueEvent" ADD CONSTRAINT "RevenueEvent_affiliateLinkId_fkey" FOREIGN KEY ("affiliateLinkId") REFERENCES "AffiliateLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueEvent" ADD CONSTRAINT "RevenueEvent_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueEvent" ADD CONSTRAINT "RevenueEvent_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueEvent" ADD CONSTRAINT "RevenueEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueEvent" ADD CONSTRAINT "RevenueEvent_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "RevenueImportBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueImportBatch" ADD CONSTRAINT "RevenueImportBatch_affiliateNetworkId_fkey" FOREIGN KEY ("affiliateNetworkId") REFERENCES "AffiliateNetwork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueImportRowError" ADD CONSTRAINT "RevenueImportRowError_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "RevenueImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrafficMetricDaily" ADD CONSTRAINT "TrafficMetricDaily_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPerformanceDaily" ADD CONSTRAINT "ContentPerformanceDaily_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPerformanceDaily" ADD CONSTRAINT "ContentPerformanceDaily_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostPerformanceDaily" ADD CONSTRAINT "SocialPostPerformanceDaily_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatingCost" ADD CONSTRAINT "OperatingCost_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthScoreSnapshot" ADD CONSTRAINT "GrowthScoreSnapshot_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthRecommendation" ADD CONSTRAINT "GrowthRecommendation_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleConnection" ADD CONSTRAINT "GoogleConnection_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GA4Property" ADD CONSTRAINT "GA4Property_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GA4Property" ADD CONSTRAINT "GA4Property_googleConnectionId_fkey" FOREIGN KEY ("googleConnectionId") REFERENCES "GoogleConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchConsoleProperty" ADD CONSTRAINT "SearchConsoleProperty_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchConsoleProperty" ADD CONSTRAINT "SearchConsoleProperty_googleConnectionId_fkey" FOREIGN KEY ("googleConnectionId") REFERENCES "GoogleConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GA4MetricDaily" ADD CONSTRAINT "GA4MetricDaily_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GA4MetricDaily" ADD CONSTRAINT "GA4MetricDaily_ga4PropertyId_fkey" FOREIGN KEY ("ga4PropertyId") REFERENCES "GA4Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GA4PageMetricDaily" ADD CONSTRAINT "GA4PageMetricDaily_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GA4PageMetricDaily" ADD CONSTRAINT "GA4PageMetricDaily_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GA4PageMetricDaily" ADD CONSTRAINT "GA4PageMetricDaily_ga4PropertyId_fkey" FOREIGN KEY ("ga4PropertyId") REFERENCES "GA4Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchConsoleQueryDaily" ADD CONSTRAINT "SearchConsoleQueryDaily_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchConsoleQueryDaily" ADD CONSTRAINT "SearchConsoleQueryDaily_searchConsolePropertyId_fkey" FOREIGN KEY ("searchConsolePropertyId") REFERENCES "SearchConsoleProperty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchConsolePageDaily" ADD CONSTRAINT "SearchConsolePageDaily_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchConsolePageDaily" ADD CONSTRAINT "SearchConsolePageDaily_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchConsolePageDaily" ADD CONSTRAINT "SearchConsolePageDaily_searchConsolePropertyId_fkey" FOREIGN KEY ("searchConsolePropertyId") REFERENCES "SearchConsoleProperty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchConsoleQueryPageDaily" ADD CONSTRAINT "SearchConsoleQueryPageDaily_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchConsoleQueryPageDaily" ADD CONSTRAINT "SearchConsoleQueryPageDaily_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchConsoleQueryPageDaily" ADD CONSTRAINT "SearchConsoleQueryPageDaily_searchConsolePropertyId_fkey" FOREIGN KEY ("searchConsolePropertyId") REFERENCES "SearchConsoleProperty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoKeyword" ADD CONSTRAINT "SeoKeyword_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoPageKeyword" ADD CONSTRAINT "SeoPageKeyword_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoPageKeyword" ADD CONSTRAINT "SeoPageKeyword_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoPageKeyword" ADD CONSTRAINT "SeoPageKeyword_seoKeywordId_fkey" FOREIGN KEY ("seoKeywordId") REFERENCES "SeoKeyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoOpportunity" ADD CONSTRAINT "SeoOpportunity_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoOpportunity" ADD CONSTRAINT "SeoOpportunity_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoOpportunity" ADD CONSTRAINT "SeoOpportunity_seoKeywordId_fkey" FOREIGN KEY ("seoKeywordId") REFERENCES "SeoKeyword"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoRecommendation" ADD CONSTRAINT "SeoRecommendation_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoRecommendation" ADD CONSTRAINT "SeoRecommendation_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoRecommendation" ADD CONSTRAINT "SeoRecommendation_seoOpportunityId_fkey" FOREIGN KEY ("seoOpportunityId") REFERENCES "SeoOpportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoRecommendationAction" ADD CONSTRAINT "SeoRecommendationAction_seoRecommendationId_fkey" FOREIGN KEY ("seoRecommendationId") REFERENCES "SeoRecommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoAnalysisSnapshot" ADD CONSTRAINT "SeoAnalysisSnapshot_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoImportBatch" ADD CONSTRAINT "SeoImportBatch_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoImportRowError" ADD CONSTRAINT "SeoImportRowError_seoImportBatchId_fkey" FOREIGN KEY ("seoImportBatchId") REFERENCES "SeoImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleSyncJob" ADD CONSTRAINT "GoogleSyncJob_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleSyncJob" ADD CONSTRAINT "GoogleSyncJob_googleConnectionId_fkey" FOREIGN KEY ("googleConnectionId") REFERENCES "GoogleConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleSyncRun" ADD CONSTRAINT "GoogleSyncRun_googleSyncJobId_fkey" FOREIGN KEY ("googleSyncJobId") REFERENCES "GoogleSyncJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleSyncRun" ADD CONSTRAINT "GoogleSyncRun_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleSyncRun" ADD CONSTRAINT "GoogleSyncRun_googleConnectionId_fkey" FOREIGN KEY ("googleConnectionId") REFERENCES "GoogleConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleApiQuotaLog" ADD CONSTRAINT "GoogleApiQuotaLog_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleApiQuotaLog" ADD CONSTRAINT "GoogleApiQuotaLog_googleConnectionId_fkey" FOREIGN KEY ("googleConnectionId") REFERENCES "GoogleConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleApiErrorLog" ADD CONSTRAINT "GoogleApiErrorLog_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleApiErrorLog" ADD CONSTRAINT "GoogleApiErrorLog_googleConnectionId_fkey" FOREIGN KEY ("googleConnectionId") REFERENCES "GoogleConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledTask" ADD CONSTRAINT "ScheduledTask_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledTaskRun" ADD CONSTRAINT "ScheduledTaskRun_scheduledTaskId_fkey" FOREIGN KEY ("scheduledTaskId") REFERENCES "ScheduledTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledTaskRun" ADD CONSTRAINT "ScheduledTaskRun_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLease" ADD CONSTRAINT "TaskLease_scheduledTaskId_fkey" FOREIGN KEY ("scheduledTaskId") REFERENCES "ScheduledTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFreshnessStatus" ADD CONSTRAINT "DataFreshnessStatus_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertIncident" ADD CONSTRAINT "AlertIncident_alertRuleId_fkey" FOREIGN KEY ("alertRuleId") REFERENCES "AlertRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertIncident" ADD CONSTRAINT "AlertIncident_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationEvent" ADD CONSTRAINT "NotificationEvent_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationEvent" ADD CONSTRAINT "NotificationEvent_alertIncidentId_fkey" FOREIGN KEY ("alertIncidentId") REFERENCES "AlertIncident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationEvent" ADD CONSTRAINT "NotificationEvent_scheduledTaskRunId_fkey" FOREIGN KEY ("scheduledTaskRunId") REFERENCES "ScheduledTaskRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_notificationEventId_fkey" FOREIGN KEY ("notificationEventId") REFERENCES "NotificationEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_notificationChannelId_fkey" FOREIGN KEY ("notificationChannelId") REFERENCES "NotificationChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationsHealthSnapshot" ADD CONSTRAINT "OperationsHealthSnapshot_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyOperationsReport" ADD CONSTRAINT "WeeklyOperationsReport_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImprovementTask" ADD CONSTRAINT "ArticleImprovementTask_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImprovementTask" ADD CONSTRAINT "ArticleImprovementTask_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImprovementTask" ADD CONSTRAINT "ArticleImprovementTask_seoOpportunityId_fkey" FOREIGN KEY ("seoOpportunityId") REFERENCES "SeoOpportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImprovementTask" ADD CONSTRAINT "ArticleImprovementTask_seoRecommendationId_fkey" FOREIGN KEY ("seoRecommendationId") REFERENCES "SeoRecommendation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImprovementTask" ADD CONSTRAINT "ArticleImprovementTask_alertIncidentId_fkey" FOREIGN KEY ("alertIncidentId") REFERENCES "AlertIncident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImprovementTask" ADD CONSTRAINT "ArticleImprovementTask_growthRecommendationId_fkey" FOREIGN KEY ("growthRecommendationId") REFERENCES "GrowthRecommendation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImprovementTaskSource" ADD CONSTRAINT "ImprovementTaskSource_articleImprovementTaskId_fkey" FOREIGN KEY ("articleImprovementTaskId") REFERENCES "ArticleImprovementTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRevisionSnapshot" ADD CONSTRAINT "ArticleRevisionSnapshot_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRevisionSnapshot" ADD CONSTRAINT "ArticleRevisionSnapshot_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleRevisionSnapshot" ADD CONSTRAINT "ArticleRevisionSnapshot_articleImprovementTaskId_fkey" FOREIGN KEY ("articleImprovementTaskId") REFERENCES "ArticleImprovementTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewriteDraft" ADD CONSTRAINT "RewriteDraft_articleImprovementTaskId_fkey" FOREIGN KEY ("articleImprovementTaskId") REFERENCES "ArticleImprovementTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewriteDraft" ADD CONSTRAINT "RewriteDraft_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewriteDraft" ADD CONSTRAINT "RewriteDraft_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewriteDraft" ADD CONSTRAINT "RewriteDraft_baseSnapshotId_fkey" FOREIGN KEY ("baseSnapshotId") REFERENCES "ArticleRevisionSnapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewriteSuggestion" ADD CONSTRAINT "RewriteSuggestion_rewriteDraftId_fkey" FOREIGN KEY ("rewriteDraftId") REFERENCES "RewriteDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentChangeSet" ADD CONSTRAINT "ContentChangeSet_rewriteDraftId_fkey" FOREIGN KEY ("rewriteDraftId") REFERENCES "RewriteDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentChangeSet" ADD CONSTRAINT "ContentChangeSet_articleImprovementTaskId_fkey" FOREIGN KEY ("articleImprovementTaskId") REFERENCES "ArticleImprovementTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewriteApproval" ADD CONSTRAINT "RewriteApproval_articleImprovementTaskId_fkey" FOREIGN KEY ("articleImprovementTaskId") REFERENCES "ArticleImprovementTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewriteApproval" ADD CONSTRAINT "RewriteApproval_rewriteDraftId_fkey" FOREIGN KEY ("rewriteDraftId") REFERENCES "RewriteDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewriteRiskCheck" ADD CONSTRAINT "RewriteRiskCheck_rewriteDraftId_fkey" FOREIGN KEY ("rewriteDraftId") REFERENCES "RewriteDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressRewriteSafetyCheck" ADD CONSTRAINT "WordPressRewriteSafetyCheck_rewriteDraftId_fkey" FOREIGN KEY ("rewriteDraftId") REFERENCES "RewriteDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressDraftUpdate" ADD CONSTRAINT "WordPressDraftUpdate_rewriteDraftId_fkey" FOREIGN KEY ("rewriteDraftId") REFERENCES "RewriteDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressDraftUpdate" ADD CONSTRAINT "WordPressDraftUpdate_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImprovementExecutionLog" ADD CONSTRAINT "ImprovementExecutionLog_articleImprovementTaskId_fkey" FOREIGN KEY ("articleImprovementTaskId") REFERENCES "ArticleImprovementTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoImpactMeasurement" ADD CONSTRAINT "SeoImpactMeasurement_articleImprovementTaskId_fkey" FOREIGN KEY ("articleImprovementTaskId") REFERENCES "ArticleImprovementTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoImpactMeasurement" ADD CONSTRAINT "SeoImpactMeasurement_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoImpactMeasurement" ADD CONSTRAINT "SeoImpactMeasurement_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialApiConnection" ADD CONSTRAINT "SocialApiConnection_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialApiConnection" ADD CONSTRAINT "SocialApiConnection_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialApiToken" ADD CONSTRAINT "SocialApiToken_socialApiConnectionId_fkey" FOREIGN KEY ("socialApiConnectionId") REFERENCES "SocialApiConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostQueue" ADD CONSTRAINT "SocialPostQueue_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostQueue" ADD CONSTRAINT "SocialPostQueue_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostQueue" ADD CONSTRAINT "SocialPostQueue_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostQueue" ADD CONSTRAINT "SocialPostQueue_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostQueue" ADD CONSTRAINT "SocialPostQueue_creativeAssetId_fkey" FOREIGN KEY ("creativeAssetId") REFERENCES "CreativeAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostQueue" ADD CONSTRAINT "SocialPostQueue_socialApiConnectionId_fkey" FOREIGN KEY ("socialApiConnectionId") REFERENCES "SocialApiConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostExecution" ADD CONSTRAINT "SocialPostExecution_socialPostQueueId_fkey" FOREIGN KEY ("socialPostQueueId") REFERENCES "SocialPostQueue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostExecution" ADD CONSTRAINT "SocialPostExecution_socialApiConnectionId_fkey" FOREIGN KEY ("socialApiConnectionId") REFERENCES "SocialApiConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaUpload" ADD CONSTRAINT "SocialMediaUpload_socialPostQueueId_fkey" FOREIGN KEY ("socialPostQueueId") REFERENCES "SocialPostQueue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaUpload" ADD CONSTRAINT "SocialMediaUpload_creativeAssetId_fkey" FOREIGN KEY ("creativeAssetId") REFERENCES "CreativeAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostSafetyCheck" ADD CONSTRAINT "SocialPostSafetyCheck_socialPostQueueId_fkey" FOREIGN KEY ("socialPostQueueId") REFERENCES "SocialPostQueue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostRateLimitLog" ADD CONSTRAINT "SocialPostRateLimitLog_socialApiConnectionId_fkey" FOREIGN KEY ("socialApiConnectionId") REFERENCES "SocialApiConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostRateLimitLog" ADD CONSTRAINT "SocialPostRateLimitLog_socialPostQueueId_fkey" FOREIGN KEY ("socialPostQueueId") REFERENCES "SocialPostQueue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostRetryLog" ADD CONSTRAINT "SocialPostRetryLog_socialPostQueueId_fkey" FOREIGN KEY ("socialPostQueueId") REFERENCES "SocialPostQueue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostRetryLog" ADD CONSTRAINT "SocialPostRetryLog_socialPostExecutionId_fkey" FOREIGN KEY ("socialPostExecutionId") REFERENCES "SocialPostExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostPerformanceSnapshot" ADD CONSTRAINT "SocialPostPerformanceSnapshot_socialPostQueueId_fkey" FOREIGN KEY ("socialPostQueueId") REFERENCES "SocialPostQueue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostPerformanceSnapshot" ADD CONSTRAINT "SocialPostPerformanceSnapshot_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostPerformanceSnapshot" ADD CONSTRAINT "SocialPostPerformanceSnapshot_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostPerformanceSnapshot" ADD CONSTRAINT "SocialPostPerformanceSnapshot_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostAttribution" ADD CONSTRAINT "SocialPostAttribution_socialPostQueueId_fkey" FOREIGN KEY ("socialPostQueueId") REFERENCES "SocialPostQueue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostAttribution" ADD CONSTRAINT "SocialPostAttribution_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostAttribution" ADD CONSTRAINT "SocialPostAttribution_wordpressPostId_fkey" FOREIGN KEY ("wordpressPostId") REFERENCES "WordPressPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostTemplate" ADD CONSTRAINT "SocialPostTemplate_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialImprovementSuggestion" ADD CONSTRAINT "SocialImprovementSuggestion_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialImprovementSuggestion" ADD CONSTRAINT "SocialImprovementSuggestion_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialImprovementSuggestion" ADD CONSTRAINT "SocialImprovementSuggestion_socialPostQueueId_fkey" FOREIGN KEY ("socialPostQueueId") REFERENCES "SocialPostQueue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialGrowthScoreSnapshot" ADD CONSTRAINT "SocialGrowthScoreSnapshot_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostLock" ADD CONSTRAINT "SocialPostLock_socialPostQueueId_fkey" FOREIGN KEY ("socialPostQueueId") REFERENCES "SocialPostQueue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialPostManualReview" ADD CONSTRAINT "SocialPostManualReview_socialPostQueueId_fkey" FOREIGN KEY ("socialPostQueueId") REFERENCES "SocialPostQueue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignObjective" ADD CONSTRAINT "CampaignObjective_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignTarget" ADD CONSTRAINT "CampaignTarget_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignItem" ADD CONSTRAINT "CampaignItem_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignBudget" ADD CONSTRAINT "CampaignBudget_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignBudget" ADD CONSTRAINT "CampaignBudget_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignCost" ADD CONSTRAINT "CampaignCost_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignCost" ADD CONSTRAINT "CampaignCost_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRevenueAttribution" ADD CONSTRAINT "CampaignRevenueAttribution_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRevenueAttribution" ADD CONSTRAINT "CampaignRevenueAttribution_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRoiSnapshot" ADD CONSTRAINT "CampaignRoiSnapshot_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRoiSnapshot" ADD CONSTRAINT "CampaignRoiSnapshot_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignGrowthScoreSnapshot" ADD CONSTRAINT "CampaignGrowthScoreSnapshot_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignGrowthScoreSnapshot" ADD CONSTRAINT "CampaignGrowthScoreSnapshot_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRecommendation" ADD CONSTRAINT "CampaignRecommendation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignRisk" ADD CONSTRAINT "CampaignRisk_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignMilestone" ADD CONSTRAINT "CampaignMilestone_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCalendarEvent" ADD CONSTRAINT "ContentCalendarEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCalendarEvent" ADD CONSTRAINT "ContentCalendarEvent_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCalendarConflict" ADD CONSTRAINT "ContentCalendarConflict_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentCalendarConflict" ADD CONSTRAINT "ContentCalendarConflict_calendarEventId_fkey" FOREIGN KEY ("calendarEventId") REFERENCES "ContentCalendarEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTemplate" ADD CONSTRAINT "ReportTemplate_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSchedule" ADD CONSTRAINT "ReportSchedule_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSchedule" ADD CONSTRAINT "ReportSchedule_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSchedule" ADD CONSTRAINT "ReportSchedule_reportTemplateId_fkey" FOREIGN KEY ("reportTemplateId") REFERENCES "ReportTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedReport" ADD CONSTRAINT "GeneratedReport_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedReport" ADD CONSTRAINT "GeneratedReport_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedReport" ADD CONSTRAINT "GeneratedReport_reportTemplateId_fkey" FOREIGN KEY ("reportTemplateId") REFERENCES "ReportTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSection" ADD CONSTRAINT "ReportSection_generatedReportId_fkey" FOREIGN KEY ("generatedReportId") REFERENCES "GeneratedReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportExport" ADD CONSTRAINT "ReportExport_generatedReportId_fkey" FOREIGN KEY ("generatedReportId") REFERENCES "GeneratedReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessInsight" ADD CONSTRAINT "BusinessInsight_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessInsight" ADD CONSTRAINT "BusinessInsight_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
