import { validateApprovalGateTransition } from "./validation";
import type {
  ApprovalGateAuditEvent,
  ApprovalGateState,
  ApprovalGateTransitionRequest,
  ApprovalGateTransitionResult,
  ApprovalReviewChecks,
} from "./types";

function uncheckedReviewChecks(): ApprovalReviewChecks {
  return {
    terms: "NOT_CHECKED",
    disclosure: "NOT_CHECKED",
    prohibitedExpression: "NOT_CHECKED",
  };
}

export function transitionApprovalGate(
  currentState: ApprovalGateState,
  request: ApprovalGateTransitionRequest,
): ApprovalGateTransitionResult {
  const validation = validateApprovalGateTransition(currentState, request);
  if (!validation.ok) {
    return {
      ok: false,
      nextState: currentState,
      error: validation.error,
    };
  }

  const nextReviewChecks =
    request.toStatus === "REVIEW_REQUIRED"
      ? uncheckedReviewChecks()
      : request.toStatus === "APPROVED"
        ? (request.reviewChecks ?? currentState.reviewChecks)
        : currentState.reviewChecks;

  const nextState: ApprovalGateState = {
    status: request.toStatus,
    recordVersion: currentState.recordVersion + 1,
    reviewChecks: nextReviewChecks,
    humanOwnerDecisionRequired:
      request.toStatus === "APPROVED"
        ? false
        : currentState.humanOwnerDecisionRequired,
    processedTransitionRequestIds: [
      ...currentState.processedTransitionRequestIds,
      request.transitionRequestId,
    ],
  };

  const auditEvent: ApprovalGateAuditEvent = {
    eventType: "APPROVAL_GATE_TRANSITION",
    transitionRequestId: request.transitionRequestId,
    fromStatus: request.fromStatus,
    toStatus: request.toStatus,
    actorRole: request.actorRole,
    recordVersion: nextState.recordVersion,
    ...(request.contentReference
      ? { contentReference: request.contentReference }
      : {}),
    ...(request.reviewReference
      ? { reviewReference: request.reviewReference }
      : {}),
    ...(request.evidenceReference
      ? { evidenceReference: request.evidenceReference }
      : {}),
    ...(request.publishRequestReference
      ? { publishRequestReference: request.publishRequestReference }
      : {}),
    ...(request.archiveReference
      ? { archiveReference: request.archiveReference }
      : {}),
    ...(validation.authorizationSubjectReference
      ? {
          authorizationSubjectReference:
            validation.authorizationSubjectReference,
        }
      : {}),
  };

  return { ok: true, nextState, auditEvent };
}
