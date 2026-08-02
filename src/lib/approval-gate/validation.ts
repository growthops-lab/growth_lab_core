import {
  APPROVAL_ACTOR_ROLES,
  APPROVAL_DECISION_CATEGORIES,
  APPROVAL_GATE_PERMISSIONS,
  APPROVAL_GATE_STATUSES,
  APPROVAL_REVIEW_CHECK_STATUSES,
  AUTOMATION_ALLOWED_STATUSES,
  PUBLISH_MODES,
  TRUSTED_AUTHORIZATION_STATUSES,
  type ApprovalGateError,
  type ApprovalGateErrorCode,
  type ApprovalGateState,
  type ApprovalGateStatus,
  type ApprovalGateTransitionRequest,
  type ApprovalGateValidationResult,
  type ApprovalReviewChecks,
} from "./types";
import { findForbiddenKeys, isSafeApprovalReference } from "./sanitize";

const ALLOWED_TARGET_STATUSES: Record<
  ApprovalGateStatus,
  readonly ApprovalGateStatus[]
> = {
  DRAFT: ["REVIEW_REQUIRED", "ARCHIVED"],
  REVIEW_REQUIRED: ["APPROVED", "BLOCKED", "DEFERRED"],
  APPROVED: ["PUBLISHED", "ARCHIVED"],
  BLOCKED: ["REVIEW_REQUIRED", "DEFERRED", "ARCHIVED"],
  DEFERRED: ["REVIEW_REQUIRED", "ARCHIVED"],
  PUBLISHED: ["REVIEW_REQUIRED", "ARCHIVED"],
  ARCHIVED: ["REVIEW_REQUIRED"],
};

const ALLOWED_REQUEST_KEYS = new Set([
  "fromStatus",
  "toStatus",
  "expectedRecordVersion",
  "transitionRequestId",
  "actorRole",
  "decisionCategory",
  "decisionReason",
  "blockedReason",
  "deferredItems",
  "contentReference",
  "reviewReference",
  "evidenceReference",
  "reviewChecks",
  "publishMode",
  "automationAllowedStatus",
  "publishedAt",
  "publishRequestReference",
  "archiveReference",
  "authorizationContext",
]);

const ALLOWED_AUTHORIZATION_CONTEXT_KEYS = new Set([
  "trustStatus",
  "subjectReference",
  "permissions",
]);

const ALLOWED_REVIEW_CHECK_KEYS = new Set([
  "terms",
  "disclosure",
  "prohibitedExpression",
]);

const ERROR_MESSAGES: Record<ApprovalGateErrorCode, string> = {
  FROM_STATUS_MISMATCH:
    "The requested source status does not match the current status.",
  INVALID_STATUS_TRANSITION: "The requested status transition is not allowed.",
  MISSING_DECISION_REASON: "A decision reason is required for this transition.",
  MISSING_BLOCKED_REASON: "A blocked reason is required for this transition.",
  MISSING_DEFERRED_ITEMS:
    "At least one deferred item is required for this transition.",
  MISSING_REVIEW_ID: "A review reference is required for approval.",
  MISSING_EVIDENCE_REFERENCE: "An evidence reference is required for approval.",
  HUMAN_OWNER_DECISION_REQUIRED: "A Human Owner decision is required.",
  SYSTEM_CANNOT_APPROVE: "System actors cannot approve a publication.",
  REVIEW_CHECK_INCOMPLETE:
    "All required review checks must pass or be not applicable.",
  AUTOMATION_NOT_ALLOWED:
    "Automation is not allowed for this publication transition.",
  MISSING_PUBLISH_REFERENCE:
    "A publication timestamp or publication request reference is required.",
  FORBIDDEN_FIELD_DETECTED:
    "Forbidden field names are not allowed in transition input.",
  INVALID_INPUT: "The transition input is invalid.",
  STALE_RECORD_VERSION:
    "The transition request was created for a different record version.",
  DUPLICATE_TRANSITION_REQUEST_ID:
    "The transition request identifier has already been processed.",
  INVALID_REFERENCE: "A reference must use the approved identifier format.",
  UNTRUSTED_AUTHORIZATION_CONTEXT:
    "A verified upstream authorization context is required.",
  MISSING_AUTHORIZATION_SUBJECT_REFERENCE:
    "A verified authorization subject reference is required.",
  MISSING_HUMAN_OWNER_PERMISSION:
    "The required Human Owner decision permission is missing.",
};

function error(
  code: ApprovalGateErrorCode,
  forbiddenKeys?: readonly string[],
): ApprovalGateError {
  return {
    code,
    message: ERROR_MESSAGES[code],
    ...(forbiddenKeys && forbiddenKeys.length > 0 ? { forbiddenKeys } : {}),
  };
}

function includes<T extends readonly string[]>(
  values: T,
  value: unknown,
): boolean {
  return typeof value === "string" && values.includes(value);
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasOnlyAllowedKeys(
  value: Record<string, unknown>,
  allowedKeys: ReadonlySet<string>,
): boolean {
  return Object.keys(value).every((key) => allowedKeys.has(key));
}

function hasDeferredItems(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => isNonBlankString(item))
  );
}

function hasValidReviewChecks(value: unknown): value is ApprovalReviewChecks {
  if (
    !isPlainRecord(value) ||
    !hasOnlyAllowedKeys(value, ALLOWED_REVIEW_CHECK_KEYS)
  ) {
    return false;
  }

  return (
    includes(APPROVAL_REVIEW_CHECK_STATUSES, value.terms) &&
    includes(APPROVAL_REVIEW_CHECK_STATUSES, value.disclosure) &&
    includes(APPROVAL_REVIEW_CHECK_STATUSES, value.prohibitedExpression)
  );
}

function reviewChecksAreApproved(checks: ApprovalReviewChecks): boolean {
  return Object.values(checks).every(
    (status) => status === "PASS" || status === "NOT_APPLICABLE",
  );
}

function hasValidPublishedAt(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 40 &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)
  );
}

function hasValidRequestReferences(
  request: ApprovalGateTransitionRequest,
): boolean {
  return [
    request.transitionRequestId,
    request.contentReference,
    request.reviewReference,
    request.evidenceReference,
    request.publishRequestReference,
    request.archiveReference,
  ].every(
    (reference) =>
      reference === undefined || isSafeApprovalReference(reference),
  );
}

function validateAuthorizationContext(
  context: unknown,
): ApprovalGateValidationResult {
  if (
    !isPlainRecord(context) ||
    !hasOnlyAllowedKeys(context, ALLOWED_AUTHORIZATION_CONTEXT_KEYS)
  ) {
    return validationError("UNTRUSTED_AUTHORIZATION_CONTEXT");
  }

  if (
    !includes(TRUSTED_AUTHORIZATION_STATUSES, context.trustStatus) ||
    context.trustStatus !== "VERIFIED_UPSTREAM"
  ) {
    return validationError("UNTRUSTED_AUTHORIZATION_CONTEXT");
  }

  if (!isSafeApprovalReference(context.subjectReference)) {
    return validationError("MISSING_AUTHORIZATION_SUBJECT_REFERENCE");
  }

  if (
    !Array.isArray(context.permissions) ||
    !context.permissions.every((permission) =>
      includes(APPROVAL_GATE_PERMISSIONS, permission),
    ) ||
    !context.permissions.includes("APPROVAL_GATE_HUMAN_OWNER_DECIDE")
  ) {
    return validationError("MISSING_HUMAN_OWNER_PERMISSION");
  }

  return {
    ok: true,
    authorizationSubjectReference: context.subjectReference,
  };
}

function hasValidStateShape(state: ApprovalGateState): boolean {
  return (
    includes(APPROVAL_GATE_STATUSES, state.status) &&
    Number.isInteger(state.recordVersion) &&
    state.recordVersion >= 0 &&
    typeof state.humanOwnerDecisionRequired === "boolean" &&
    Array.isArray(state.processedTransitionRequestIds) &&
    state.processedTransitionRequestIds.every(isSafeApprovalReference) &&
    hasValidReviewChecks(state.reviewChecks)
  );
}

function requestHasValidEnumValues(
  request: ApprovalGateTransitionRequest,
): boolean {
  return (
    includes(APPROVAL_GATE_STATUSES, request.fromStatus) &&
    includes(APPROVAL_GATE_STATUSES, request.toStatus) &&
    includes(APPROVAL_ACTOR_ROLES, request.actorRole) &&
    (request.decisionCategory === undefined ||
      includes(APPROVAL_DECISION_CATEGORIES, request.decisionCategory)) &&
    (request.publishMode === undefined ||
      includes(PUBLISH_MODES, request.publishMode)) &&
    (request.automationAllowedStatus === undefined ||
      includes(AUTOMATION_ALLOWED_STATUSES, request.automationAllowedStatus))
  );
}

function requestUsesOnlySafeReferenceValues(
  request: ApprovalGateTransitionRequest,
): boolean {
  return (
    hasValidRequestReferences(request) &&
    (request.publishedAt === undefined ||
      hasValidPublishedAt(request.publishedAt))
  );
}

function validationError(
  code: ApprovalGateErrorCode,
): ApprovalGateValidationResult {
  return { ok: false, error: error(code) };
}

export function getAllowedTargetStatuses(
  fromStatus: ApprovalGateStatus,
): readonly ApprovalGateStatus[] {
  if (!includes(APPROVAL_GATE_STATUSES, fromStatus)) {
    return [];
  }

  return ALLOWED_TARGET_STATUSES[fromStatus];
}

export function validateApprovalGateTransition(
  currentState: ApprovalGateState,
  request: ApprovalGateTransitionRequest,
): ApprovalGateValidationResult {
  if (!isPlainRecord(currentState) || !isPlainRecord(request)) {
    return validationError("INVALID_INPUT");
  }

  const forbiddenKeys = findForbiddenKeys(request);
  if (forbiddenKeys.length > 0) {
    return {
      ok: false,
      error: error("FORBIDDEN_FIELD_DETECTED", forbiddenKeys),
    };
  }

  if (!hasOnlyAllowedKeys(request, ALLOWED_REQUEST_KEYS)) {
    return validationError("INVALID_INPUT");
  }

  if (
    !hasValidStateShape(currentState) ||
    !requestHasValidEnumValues(request)
  ) {
    return validationError("INVALID_INPUT");
  }

  if (!requestUsesOnlySafeReferenceValues(request)) {
    return validationError("INVALID_REFERENCE");
  }

  let validatedAuthorizationSubjectReference: string | undefined;
  if (request.authorizationContext !== undefined) {
    const authorization = validateAuthorizationContext(
      request.authorizationContext,
    );
    if (!authorization.ok) {
      return authorization;
    }

    if (request.actorRole !== "HUMAN_OWNER") {
      return validationError("INVALID_INPUT");
    }

    validatedAuthorizationSubjectReference =
      authorization.authorizationSubjectReference;
  }

  if (request.fromStatus !== currentState.status) {
    return validationError("FROM_STATUS_MISMATCH");
  }

  if (!Number.isInteger(request.expectedRecordVersion)) {
    return validationError("INVALID_INPUT");
  }

  if (request.expectedRecordVersion !== currentState.recordVersion) {
    return validationError("STALE_RECORD_VERSION");
  }

  if (
    currentState.processedTransitionRequestIds.includes(
      request.transitionRequestId,
    )
  ) {
    return validationError("DUPLICATE_TRANSITION_REQUEST_ID");
  }

  if (
    !getAllowedTargetStatuses(currentState.status).includes(request.toStatus)
  ) {
    return validationError("INVALID_STATUS_TRANSITION");
  }

  if (
    request.toStatus === "BLOCKED" &&
    !isNonBlankString(request.blockedReason)
  ) {
    return validationError("MISSING_BLOCKED_REASON");
  }

  if (
    request.toStatus === "DEFERRED" &&
    !hasDeferredItems(request.deferredItems)
  ) {
    return validationError("MISSING_DEFERRED_ITEMS");
  }

  if (
    ["BLOCKED", "DEFERRED"].includes(request.toStatus) &&
    !isNonBlankString(request.decisionReason)
  ) {
    return validationError("MISSING_DECISION_REASON");
  }

  if (
    request.toStatus === "REVIEW_REQUIRED" &&
    currentState.status === "ARCHIVED" &&
    !isNonBlankString(request.decisionReason)
  ) {
    return validationError("MISSING_DECISION_REASON");
  }

  if (request.toStatus === "APPROVED") {
    if (request.actorRole === "SYSTEM") {
      return validationError("SYSTEM_CANNOT_APPROVE");
    }

    if (request.reviewReference === undefined) {
      return validationError("MISSING_REVIEW_ID");
    }

    if (request.evidenceReference === undefined) {
      return validationError("MISSING_EVIDENCE_REFERENCE");
    }

    if (!isNonBlankString(request.decisionReason)) {
      return validationError("MISSING_DECISION_REASON");
    }

    if (!hasValidReviewChecks(request.reviewChecks)) {
      return validationError("INVALID_INPUT");
    }

    if (!reviewChecksAreApproved(request.reviewChecks)) {
      return validationError("REVIEW_CHECK_INCOMPLETE");
    }

    if (request.decisionCategory === "APPROVED_WITH_MANUAL_REVIEW") {
      return validationError("INVALID_INPUT");
    }

    if (
      currentState.humanOwnerDecisionRequired &&
      request.actorRole !== "HUMAN_OWNER"
    ) {
      return validationError("HUMAN_OWNER_DECISION_REQUIRED");
    }

    if (
      currentState.humanOwnerDecisionRequired &&
      validatedAuthorizationSubjectReference === undefined
    ) {
      return validationError("UNTRUSTED_AUTHORIZATION_CONTEXT");
    }

    if (request.decisionCategory === "REQUIRES_HUMAN_OWNER_DECISION") {
      return validationError("HUMAN_OWNER_DECISION_REQUIRED");
    }
  }

  if (request.toStatus === "PUBLISHED") {
    if (currentState.humanOwnerDecisionRequired) {
      return validationError("HUMAN_OWNER_DECISION_REQUIRED");
    }

    if (
      request.publishedAt === undefined &&
      request.publishRequestReference === undefined
    ) {
      return validationError("MISSING_PUBLISH_REFERENCE");
    }

    if (!reviewChecksAreApproved(currentState.reviewChecks)) {
      return validationError("REVIEW_CHECK_INCOMPLETE");
    }

    if (request.automationAllowedStatus === "UNKNOWN") {
      return validationError("AUTOMATION_NOT_ALLOWED");
    }

    if (request.publishMode === "AUTOMATED") {
      if (request.automationAllowedStatus !== "ALLOWED") {
        return validationError("AUTOMATION_NOT_ALLOWED");
      }
    } else if (
      request.publishMode !== "MANUAL" ||
      !["NOT_APPLICABLE", "ALLOWED"].includes(
        request.automationAllowedStatus ?? "",
      )
    ) {
      return validationError("AUTOMATION_NOT_ALLOWED");
    }
  }

  const usedAuthorizationSubjectReference =
    request.toStatus === "APPROVED" && currentState.humanOwnerDecisionRequired
      ? validatedAuthorizationSubjectReference
      : undefined;

  return {
    ok: true,
    ...(usedAuthorizationSubjectReference
      ? {
          authorizationSubjectReference: usedAuthorizationSubjectReference,
        }
      : {}),
  };
}
