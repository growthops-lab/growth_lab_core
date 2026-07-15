export const OPERATION_DEFAULT_SETTINGS = {
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
};

export type OperationSettingKey = keyof typeof OPERATION_DEFAULT_SETTINGS;

export function operationFlag(key: OperationSettingKey) {
  return OPERATION_DEFAULT_SETTINGS[key].toLowerCase() === "true";
}

export function operationNumber(key: OperationSettingKey) {
  return Number(OPERATION_DEFAULT_SETTINGS[key]);
}

export function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function parseCronNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

export function nextCronApproximation(
  cronExpression: string,
  from = new Date(),
) {
  const parts = cronExpression.trim().split(/\s+/);
  if (parts.length !== 5) return addMinutes(from, 60);

  const [minutePart, hourPart, , , weekdayPart] = parts;
  const base = new Date(from);
  base.setSeconds(0, 0);

  if (minutePart.startsWith("*/") && hourPart === "*") {
    const step = Math.max(1, parseCronNumber(minutePart.slice(2), 60));
    const next = new Date(base);
    const remainder = next.getMinutes() % step;
    next.setMinutes(
      next.getMinutes() + (remainder === 0 ? step : step - remainder),
    );
    return next;
  }

  const minute =
    minutePart === "*" ? base.getMinutes() + 1 : parseCronNumber(minutePart, 0);
  if (hourPart === "*") {
    const next = new Date(base);
    next.setMinutes(minute, 0, 0);
    if (next <= from) next.setHours(next.getHours() + 1);
    return next;
  }

  const hour = parseCronNumber(hourPart, 0);
  if (weekdayPart !== "*") {
    const targetWeekday = parseCronNumber(weekdayPart, base.getDay()) % 7;
    for (let daysAhead = 0; daysAhead <= 7; daysAhead += 1) {
      const next = new Date(base);
      next.setDate(base.getDate() + daysAhead);
      next.setHours(hour, minute, 0, 0);
      if (next.getDay() === targetWeekday && next > from) return next;
    }
  }
  const next = new Date(base);
  next.setHours(hour, minute, 0, 0);
  if (next <= from) next.setDate(next.getDate() + 1);
  return next;
}
