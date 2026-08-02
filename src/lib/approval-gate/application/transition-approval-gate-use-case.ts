import { findForbiddenKeys, isSafeApprovalReference } from "../sanitize";
import { transitionApprovalGate } from "../transitions";
import type {
  ApprovalActorRole,
  ApprovalDecisionCategory,
  ApprovalGateStatus,
  ApprovalGateTransitionRequest,
  ApprovalReviewCheckStatus,
  ApprovalReviewChecks,
  AutomationAllowedStatus,
  PublishMode,
  TrustedAuthorizationContext,
  TrustedAuthorizationStatus,
} from "../types";
import type { ApprovalGateStore } from "./approval-gate-store";
import type {
  TransitionApprovalGateCommand,
  TransitionApprovalGateResult,
} from "./types";

const COMMAND_KEYS = new Set(["approvalGateId", "request", "actor"]);

const REQUEST_KEYS = new Set([
  "fromStatus",
  "toStatus",
  "expectedRecordVersion",
  "transitionRequestId",
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
]);

const ACTOR_KEYS = new Set(["actorRole", "authorizationContext"]);

const AUTHORIZATION_CONTEXT_KEYS = new Set([
  "trustStatus",
  "subjectReference",
  "permissions",
]);

const REVIEW_CHECK_KEYS = new Set([
  "terms",
  "disclosure",
  "prohibitedExpression",
]);

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

function cloneReviewChecks(value: unknown): ApprovalReviewChecks {
  if (!isPlainRecord(value)) {
    return value as ApprovalReviewChecks;
  }

  return {
    terms: value.terms as ApprovalReviewCheckStatus,
    disclosure: value.disclosure as ApprovalReviewCheckStatus,
    prohibitedExpression:
      value.prohibitedExpression as ApprovalReviewCheckStatus,
  };
}

function cloneAuthorizationContext(
  value: unknown,
): TrustedAuthorizationContext {
  if (!isPlainRecord(value)) {
    return value as TrustedAuthorizationContext;
  }

  const permissions = Array.isArray(value.permissions)
    ? [...value.permissions]
    : value.permissions;

  return {
    trustStatus: value.trustStatus as TrustedAuthorizationStatus,
    subjectReference: value.subjectReference as string,
    permissions: permissions as TrustedAuthorizationContext["permissions"],
  };
}

function buildCoreRequest(
  rawRequest: Record<string, unknown>,
  rawActor: Record<string, unknown>,
): ApprovalGateTransitionRequest {
  const request: ApprovalGateTransitionRequest = {
    fromStatus: rawRequest.fromStatus as ApprovalGateStatus,
    toStatus: rawRequest.toStatus as ApprovalGateStatus,
    expectedRecordVersion: rawRequest.expectedRecordVersion as number,
    transitionRequestId: rawRequest.transitionRequestId as string,
    actorRole: rawActor.actorRole as ApprovalActorRole,
  };

  if (rawRequest.decisionCategory !== undefined) {
    request.decisionCategory =
      rawRequest.decisionCategory as ApprovalDecisionCategory;
  }
  if (rawRequest.decisionReason !== undefined) {
    request.decisionReason = rawRequest.decisionReason as string;
  }
  if (rawRequest.blockedReason !== undefined) {
    request.blockedReason = rawRequest.blockedReason as string;
  }
  if (rawRequest.deferredItems !== undefined) {
    request.deferredItems = Array.isArray(rawRequest.deferredItems)
      ? ([...rawRequest.deferredItems] as string[])
      : (rawRequest.deferredItems as readonly string[]);
  }
  if (rawRequest.contentReference !== undefined) {
    request.contentReference = rawRequest.contentReference as string;
  }
  if (rawRequest.reviewReference !== undefined) {
    request.reviewReference = rawRequest.reviewReference as string;
  }
  if (rawRequest.evidenceReference !== undefined) {
    request.evidenceReference = rawRequest.evidenceReference as string;
  }
  if (rawRequest.reviewChecks !== undefined) {
    request.reviewChecks = cloneReviewChecks(rawRequest.reviewChecks);
  }
  if (rawRequest.publishMode !== undefined) {
    request.publishMode = rawRequest.publishMode as PublishMode;
  }
  if (rawRequest.automationAllowedStatus !== undefined) {
    request.automationAllowedStatus =
      rawRequest.automationAllowedStatus as AutomationAllowedStatus;
  }
  if (rawRequest.publishedAt !== undefined) {
    request.publishedAt = rawRequest.publishedAt as string;
  }
  if (rawRequest.publishRequestReference !== undefined) {
    request.publishRequestReference =
      rawRequest.publishRequestReference as string;
  }
  if (rawRequest.archiveReference !== undefined) {
    request.archiveReference = rawRequest.archiveReference as string;
  }
  if (rawActor.authorizationContext !== undefined) {
    request.authorizationContext = cloneAuthorizationContext(
      rawActor.authorizationContext,
    );
  }

  return request;
}

function hasValidEnvelope(
  value: unknown,
): value is TransitionApprovalGateCommand {
  if (
    !isPlainRecord(value) ||
    !hasOnlyAllowedKeys(value, COMMAND_KEYS) ||
    !isPlainRecord(value.request) ||
    !hasOnlyAllowedKeys(value.request, REQUEST_KEYS) ||
    !isPlainRecord(value.actor) ||
    !hasOnlyAllowedKeys(value.actor, ACTOR_KEYS)
  ) {
    return false;
  }

  if (
    isPlainRecord(value.actor.authorizationContext) &&
    !hasOnlyAllowedKeys(
      value.actor.authorizationContext,
      AUTHORIZATION_CONTEXT_KEYS,
    )
  ) {
    return false;
  }

  if (
    isPlainRecord(value.request.reviewChecks) &&
    !hasOnlyAllowedKeys(value.request.reviewChecks, REVIEW_CHECK_KEYS)
  ) {
    return false;
  }

  return true;
}

export class TransitionApprovalGateUseCase {
  constructor(private readonly store: ApprovalGateStore) {}

  async execute(command: unknown): Promise<TransitionApprovalGateResult> {
    if (findForbiddenKeys(command).length > 0 || !hasValidEnvelope(command)) {
      return { ok: false, kind: "INVALID_INPUT" };
    }

    if (!isSafeApprovalReference(command.approvalGateId)) {
      return { ok: false, kind: "INVALID_INPUT" };
    }

    let aggregate;
    try {
      aggregate = await this.store.read(command.approvalGateId);
    } catch {
      return { ok: false, kind: "PERSISTENCE_FAILURE" };
    }

    if (aggregate === null) {
      return { ok: false, kind: "NOT_FOUND" };
    }

    const rawRequest = command.request as unknown as Record<string, unknown>;
    const rawActor = command.actor as unknown as Record<string, unknown>;
    const request = buildCoreRequest(rawRequest, rawActor);
    const transition = transitionApprovalGate(aggregate.state, request);

    if (!transition.ok) {
      if (transition.error.code === "DUPLICATE_TRANSITION_REQUEST_ID") {
        return { ok: false, kind: "DUPLICATE_REQUEST" };
      }

      return {
        ok: false,
        kind: "CORE_REJECTED",
        error: transition.error,
      };
    }

    try {
      const committed = await this.store.commitTransition({
        approvalGateId: command.approvalGateId,
        expectedRecordVersion: aggregate.state.recordVersion,
        transitionRequestId: request.transitionRequestId,
        nextState: transition.nextState,
        auditEvent: transition.auditEvent,
      });

      switch (committed.kind) {
        case "COMMITTED":
          return {
            ok: true,
            aggregate: committed.aggregate,
            auditEvent: transition.auditEvent,
          };
        case "NOT_FOUND":
          return { ok: false, kind: "NOT_FOUND" };
        case "VERSION_CONFLICT":
          return { ok: false, kind: "VERSION_CONFLICT" };
        case "DUPLICATE_REQUEST":
          return { ok: false, kind: "DUPLICATE_REQUEST" };
        case "PERSISTENCE_FAILURE":
          return { ok: false, kind: "PERSISTENCE_FAILURE" };
      }
    } catch {
      return { ok: false, kind: "PERSISTENCE_FAILURE" };
    }
  }
}
