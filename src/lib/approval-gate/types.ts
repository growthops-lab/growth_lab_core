export const APPROVAL_GATE_STATUSES = [
  "DRAFT",
  "REVIEW_REQUIRED",
  "APPROVED",
  "BLOCKED",
  "DEFERRED",
  "PUBLISHED",
  "ARCHIVED",
] as const;

export type ApprovalGateStatus = (typeof APPROVAL_GATE_STATUSES)[number];

export const APPROVAL_ACTOR_ROLES = [
  "HUMAN_OWNER",
  "REVIEWER",
  "SYSTEM",
] as const;

export type ApprovalActorRole = (typeof APPROVAL_ACTOR_ROLES)[number];

export const TRUSTED_AUTHORIZATION_STATUSES = [
  "VERIFIED_UPSTREAM",
  "UNVERIFIED",
  "UNKNOWN",
] as const;

export type TrustedAuthorizationStatus =
  (typeof TRUSTED_AUTHORIZATION_STATUSES)[number];

export const APPROVAL_GATE_PERMISSIONS = [
  "APPROVAL_GATE_HUMAN_OWNER_DECIDE",
] as const;

export type ApprovalGatePermission = (typeof APPROVAL_GATE_PERMISSIONS)[number];

/**
 * The Application Layer authenticates and authorizes this context before the
 * pure Approval Gate Core receives it. The Core never creates this context.
 */
export interface TrustedAuthorizationContext {
  trustStatus: TrustedAuthorizationStatus;
  subjectReference: string;
  permissions: readonly ApprovalGatePermission[];
}

export const APPROVAL_DECISION_CATEGORIES = [
  "APPROVED_FOR_MVP_PUBLISHING",
  "APPROVED_WITH_MANUAL_REVIEW",
  "BLOCKED_MISSING_EVIDENCE",
  "BLOCKED_TERMS_UNCERTAINTY",
  "DEFERRED_LATER_SPECIFICATION",
  "REQUIRES_HUMAN_OWNER_DECISION",
  "REQUIRES_OFFICIAL_SOURCE_CONFIRMATION",
] as const;

export type ApprovalDecisionCategory =
  (typeof APPROVAL_DECISION_CATEGORIES)[number];

export const APPROVAL_REVIEW_CHECK_STATUSES = [
  "NOT_CHECKED",
  "PASS",
  "WARNING",
  "BLOCKED",
  "DEFERRED",
  "NOT_APPLICABLE",
  "UNKNOWN",
] as const;

export type ApprovalReviewCheckStatus =
  (typeof APPROVAL_REVIEW_CHECK_STATUSES)[number];

export const PUBLISH_MODES = ["MANUAL", "AUTOMATED"] as const;

export type PublishMode = (typeof PUBLISH_MODES)[number];

export const AUTOMATION_ALLOWED_STATUSES = [
  "ALLOWED",
  "NOT_ALLOWED",
  "DEFERRED",
  "UNKNOWN",
  "NOT_APPLICABLE",
] as const;

export type AutomationAllowedStatus =
  (typeof AUTOMATION_ALLOWED_STATUSES)[number];

export interface ApprovalReviewChecks {
  terms: ApprovalReviewCheckStatus;
  disclosure: ApprovalReviewCheckStatus;
  prohibitedExpression: ApprovalReviewCheckStatus;
}

export interface ApprovalGateState {
  status: ApprovalGateStatus;
  recordVersion: number;
  reviewChecks: ApprovalReviewChecks;
  humanOwnerDecisionRequired: boolean;
  processedTransitionRequestIds: readonly string[];
}

export interface ApprovalGateTransitionRequest {
  fromStatus: ApprovalGateStatus;
  toStatus: ApprovalGateStatus;
  expectedRecordVersion: number;
  transitionRequestId: string;
  actorRole: ApprovalActorRole;
  decisionCategory?: ApprovalDecisionCategory;
  decisionReason?: string;
  blockedReason?: string;
  deferredItems?: readonly string[];
  contentReference?: string;
  reviewReference?: string;
  evidenceReference?: string;
  reviewChecks?: ApprovalReviewChecks;
  publishMode?: PublishMode;
  automationAllowedStatus?: AutomationAllowedStatus;
  publishedAt?: string;
  publishRequestReference?: string;
  archiveReference?: string;
  authorizationContext?: TrustedAuthorizationContext;
}

export const APPROVAL_GATE_ERROR_CODES = [
  "FROM_STATUS_MISMATCH",
  "INVALID_STATUS_TRANSITION",
  "MISSING_DECISION_REASON",
  "MISSING_BLOCKED_REASON",
  "MISSING_DEFERRED_ITEMS",
  "MISSING_REVIEW_ID",
  "MISSING_EVIDENCE_REFERENCE",
  "HUMAN_OWNER_DECISION_REQUIRED",
  "SYSTEM_CANNOT_APPROVE",
  "REVIEW_CHECK_INCOMPLETE",
  "AUTOMATION_NOT_ALLOWED",
  "MISSING_PUBLISH_REFERENCE",
  "FORBIDDEN_FIELD_DETECTED",
  "INVALID_INPUT",
  "STALE_RECORD_VERSION",
  "DUPLICATE_TRANSITION_REQUEST_ID",
  "INVALID_REFERENCE",
  "UNTRUSTED_AUTHORIZATION_CONTEXT",
  "MISSING_AUTHORIZATION_SUBJECT_REFERENCE",
  "MISSING_HUMAN_OWNER_PERMISSION",
] as const;

export type ApprovalGateErrorCode = (typeof APPROVAL_GATE_ERROR_CODES)[number];

export interface ApprovalGateError {
  code: ApprovalGateErrorCode;
  message: string;
  forbiddenKeys?: readonly string[];
}

export interface ApprovalGateAuditEvent {
  eventType: "APPROVAL_GATE_TRANSITION";
  transitionRequestId: string;
  fromStatus: ApprovalGateStatus;
  toStatus: ApprovalGateStatus;
  actorRole: ApprovalActorRole;
  recordVersion: number;
  contentReference?: string;
  reviewReference?: string;
  evidenceReference?: string;
  publishRequestReference?: string;
  archiveReference?: string;
  authorizationSubjectReference?: string;
}

export type ApprovalGateTransitionResult =
  | {
      ok: true;
      nextState: ApprovalGateState;
      auditEvent: ApprovalGateAuditEvent;
    }
  | {
      ok: false;
      nextState: ApprovalGateState;
      error: ApprovalGateError;
    };

export type ApprovalGateValidationResult =
  | {
      ok: true;
      authorizationSubjectReference?: string;
    }
  | {
      ok: false;
      error: ApprovalGateError;
    };
