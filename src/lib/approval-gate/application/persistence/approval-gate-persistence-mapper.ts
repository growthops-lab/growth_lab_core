import {
  ApprovalGateActorRole as PrismaApprovalGateActorRole,
  ApprovalGateAuditEventType as PrismaApprovalGateAuditEventType,
  ApprovalGateRecordStatus as PrismaApprovalGateRecordStatus,
  ApprovalGateReviewCheckStatus as PrismaApprovalGateReviewCheckStatus,
} from "@prisma/client";

import type {
  ApprovalActorRole,
  ApprovalGateAuditEvent,
  ApprovalGateState,
  ApprovalGateStatus,
  ApprovalReviewCheckStatus,
} from "../../types";
import type { ApprovalGateAggregate } from "../types";

export interface ApprovalGateAuditLinkPersistenceRow {
  approvalGateId: string;
  transitionRequestId: string;
}

export interface ApprovalGateProcessedTransitionPersistenceRow {
  id: string;
  approvalGateId: string;
  transitionRequestId: string;
  createdAt: Date;
  auditEvent: ApprovalGateAuditLinkPersistenceRow | null;
}

export interface ApprovalGatePersistenceRow {
  approvalGateId: string;
  status: PrismaApprovalGateRecordStatus;
  recordVersion: number;
  reviewTerms: PrismaApprovalGateReviewCheckStatus;
  reviewDisclosure: PrismaApprovalGateReviewCheckStatus;
  reviewProhibitedExpression: PrismaApprovalGateReviewCheckStatus;
  humanOwnerDecisionRequired: boolean;
  processedTransitions: readonly ApprovalGateProcessedTransitionPersistenceRow[];
}

export interface ApprovalGateRecordWriteData {
  status: PrismaApprovalGateRecordStatus;
  recordVersion: number;
  reviewTerms: PrismaApprovalGateReviewCheckStatus;
  reviewDisclosure: PrismaApprovalGateReviewCheckStatus;
  reviewProhibitedExpression: PrismaApprovalGateReviewCheckStatus;
  humanOwnerDecisionRequired: boolean;
}

export interface ApprovalGateAuditWriteData {
  eventType: PrismaApprovalGateAuditEventType;
  fromStatus: PrismaApprovalGateRecordStatus;
  toStatus: PrismaApprovalGateRecordStatus;
  actorRole: PrismaApprovalGateActorRole;
  recordVersion: number;
  contentReference?: string;
  reviewReference?: string;
  evidenceReference?: string;
  publishRequestReference?: string;
  archiveReference?: string;
  authorizationSubjectReference?: string;
}

function mapStatusFromPrisma(
  value: PrismaApprovalGateRecordStatus,
): ApprovalGateStatus {
  switch (value) {
    case PrismaApprovalGateRecordStatus.DRAFT:
      return "DRAFT";
    case PrismaApprovalGateRecordStatus.REVIEW_REQUIRED:
      return "REVIEW_REQUIRED";
    case PrismaApprovalGateRecordStatus.APPROVED:
      return "APPROVED";
    case PrismaApprovalGateRecordStatus.BLOCKED:
      return "BLOCKED";
    case PrismaApprovalGateRecordStatus.DEFERRED:
      return "DEFERRED";
    case PrismaApprovalGateRecordStatus.PUBLISHED:
      return "PUBLISHED";
    case PrismaApprovalGateRecordStatus.ARCHIVED:
      return "ARCHIVED";
  }

  throw new Error("Invalid persisted Approval Gate status.");
}

function mapStatusToPrisma(
  value: ApprovalGateStatus,
): PrismaApprovalGateRecordStatus {
  switch (value) {
    case "DRAFT":
      return PrismaApprovalGateRecordStatus.DRAFT;
    case "REVIEW_REQUIRED":
      return PrismaApprovalGateRecordStatus.REVIEW_REQUIRED;
    case "APPROVED":
      return PrismaApprovalGateRecordStatus.APPROVED;
    case "BLOCKED":
      return PrismaApprovalGateRecordStatus.BLOCKED;
    case "DEFERRED":
      return PrismaApprovalGateRecordStatus.DEFERRED;
    case "PUBLISHED":
      return PrismaApprovalGateRecordStatus.PUBLISHED;
    case "ARCHIVED":
      return PrismaApprovalGateRecordStatus.ARCHIVED;
  }
}

function mapReviewCheckFromPrisma(
  value: PrismaApprovalGateReviewCheckStatus,
): ApprovalReviewCheckStatus {
  switch (value) {
    case PrismaApprovalGateReviewCheckStatus.NOT_CHECKED:
      return "NOT_CHECKED";
    case PrismaApprovalGateReviewCheckStatus.PASS:
      return "PASS";
    case PrismaApprovalGateReviewCheckStatus.WARNING:
      return "WARNING";
    case PrismaApprovalGateReviewCheckStatus.BLOCKED:
      return "BLOCKED";
    case PrismaApprovalGateReviewCheckStatus.DEFERRED:
      return "DEFERRED";
    case PrismaApprovalGateReviewCheckStatus.NOT_APPLICABLE:
      return "NOT_APPLICABLE";
    case PrismaApprovalGateReviewCheckStatus.UNKNOWN:
      return "UNKNOWN";
  }

  throw new Error("Invalid persisted Approval Gate review check status.");
}

function mapReviewCheckToPrisma(
  value: ApprovalReviewCheckStatus,
): PrismaApprovalGateReviewCheckStatus {
  switch (value) {
    case "NOT_CHECKED":
      return PrismaApprovalGateReviewCheckStatus.NOT_CHECKED;
    case "PASS":
      return PrismaApprovalGateReviewCheckStatus.PASS;
    case "WARNING":
      return PrismaApprovalGateReviewCheckStatus.WARNING;
    case "BLOCKED":
      return PrismaApprovalGateReviewCheckStatus.BLOCKED;
    case "DEFERRED":
      return PrismaApprovalGateReviewCheckStatus.DEFERRED;
    case "NOT_APPLICABLE":
      return PrismaApprovalGateReviewCheckStatus.NOT_APPLICABLE;
    case "UNKNOWN":
      return PrismaApprovalGateReviewCheckStatus.UNKNOWN;
  }
}

function mapActorRoleToPrisma(
  value: ApprovalActorRole,
): PrismaApprovalGateActorRole {
  switch (value) {
    case "HUMAN_OWNER":
      return PrismaApprovalGateActorRole.HUMAN_OWNER;
    case "REVIEWER":
      return PrismaApprovalGateActorRole.REVIEWER;
    case "SYSTEM":
      return PrismaApprovalGateActorRole.SYSTEM;
  }
}

function cloneOptionalAuditFields(
  event: ApprovalGateAuditEvent,
): Pick<
  ApprovalGateAuditWriteData,
  | "contentReference"
  | "reviewReference"
  | "evidenceReference"
  | "publishRequestReference"
  | "archiveReference"
  | "authorizationSubjectReference"
> {
  return {
    ...(event.contentReference !== undefined
      ? { contentReference: event.contentReference }
      : {}),
    ...(event.reviewReference !== undefined
      ? { reviewReference: event.reviewReference }
      : {}),
    ...(event.evidenceReference !== undefined
      ? { evidenceReference: event.evidenceReference }
      : {}),
    ...(event.publishRequestReference !== undefined
      ? { publishRequestReference: event.publishRequestReference }
      : {}),
    ...(event.archiveReference !== undefined
      ? { archiveReference: event.archiveReference }
      : {}),
    ...(event.authorizationSubjectReference !== undefined
      ? {
          authorizationSubjectReference: event.authorizationSubjectReference,
        }
      : {}),
  };
}

export function mapApprovalGatePersistenceRow(
  row: ApprovalGatePersistenceRow,
): ApprovalGateAggregate {
  const orderedTransitions = [...row.processedTransitions].sort(
    (left, right) => {
      const createdAtDelta =
        left.createdAt.getTime() - right.createdAt.getTime();
      return createdAtDelta !== 0
        ? createdAtDelta
        : left.id.localeCompare(right.id);
    },
  );

  for (const transition of orderedTransitions) {
    if (
      transition.approvalGateId !== row.approvalGateId ||
      transition.auditEvent === null ||
      transition.auditEvent.approvalGateId !== row.approvalGateId ||
      transition.auditEvent.transitionRequestId !==
        transition.transitionRequestId
    ) {
      throw new Error("Invalid Approval Gate persistence relation.");
    }
  }

  return {
    approvalGateId: row.approvalGateId,
    state: {
      status: mapStatusFromPrisma(row.status),
      recordVersion: row.recordVersion,
      reviewChecks: {
        terms: mapReviewCheckFromPrisma(row.reviewTerms),
        disclosure: mapReviewCheckFromPrisma(row.reviewDisclosure),
        prohibitedExpression: mapReviewCheckFromPrisma(
          row.reviewProhibitedExpression,
        ),
      },
      humanOwnerDecisionRequired: row.humanOwnerDecisionRequired,
      processedTransitionRequestIds: orderedTransitions.map(
        (transition) => transition.transitionRequestId,
      ),
    },
  };
}

export function mapApprovalGateStateToRecordData(
  state: ApprovalGateState,
): ApprovalGateRecordWriteData {
  return {
    status: mapStatusToPrisma(state.status),
    recordVersion: state.recordVersion,
    reviewTerms: mapReviewCheckToPrisma(state.reviewChecks.terms),
    reviewDisclosure: mapReviewCheckToPrisma(state.reviewChecks.disclosure),
    reviewProhibitedExpression: mapReviewCheckToPrisma(
      state.reviewChecks.prohibitedExpression,
    ),
    humanOwnerDecisionRequired: state.humanOwnerDecisionRequired,
  };
}

export function mapApprovalGateAuditEventToRecordData(
  event: ApprovalGateAuditEvent,
): ApprovalGateAuditWriteData {
  return {
    eventType: PrismaApprovalGateAuditEventType.APPROVAL_GATE_TRANSITION,
    fromStatus: mapStatusToPrisma(event.fromStatus),
    toStatus: mapStatusToPrisma(event.toStatus),
    actorRole: mapActorRoleToPrisma(event.actorRole),
    recordVersion: event.recordVersion,
    ...cloneOptionalAuditFields(event),
  };
}
