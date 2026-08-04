import {
  ApprovalGateActorRole,
  ApprovalGateAuditEventType,
  ApprovalGateRecordStatus,
  ApprovalGateReviewCheckStatus,
} from "@prisma/client";
import { describe, expect, it } from "vitest";

import type {
  ApprovalActorRole,
  ApprovalGateAuditEvent,
  ApprovalGateState,
  ApprovalGateStatus,
  ApprovalReviewCheckStatus,
} from "../../types";
import {
  mapApprovalGateAuditEventToRecordData,
  mapApprovalGatePersistenceRow,
  mapApprovalGateStateToRecordData,
  type ApprovalGatePersistenceRow,
} from "./approval-gate-persistence-mapper";

const statusCases = [
  [ApprovalGateRecordStatus.DRAFT, "DRAFT"],
  [ApprovalGateRecordStatus.REVIEW_REQUIRED, "REVIEW_REQUIRED"],
  [ApprovalGateRecordStatus.APPROVED, "APPROVED"],
  [ApprovalGateRecordStatus.BLOCKED, "BLOCKED"],
  [ApprovalGateRecordStatus.DEFERRED, "DEFERRED"],
  [ApprovalGateRecordStatus.PUBLISHED, "PUBLISHED"],
  [ApprovalGateRecordStatus.ARCHIVED, "ARCHIVED"],
] as const satisfies readonly (readonly [
  ApprovalGateRecordStatus,
  ApprovalGateStatus,
])[];

const reviewCheckCases = [
  [ApprovalGateReviewCheckStatus.NOT_CHECKED, "NOT_CHECKED"],
  [ApprovalGateReviewCheckStatus.PASS, "PASS"],
  [ApprovalGateReviewCheckStatus.WARNING, "WARNING"],
  [ApprovalGateReviewCheckStatus.BLOCKED, "BLOCKED"],
  [ApprovalGateReviewCheckStatus.DEFERRED, "DEFERRED"],
  [ApprovalGateReviewCheckStatus.NOT_APPLICABLE, "NOT_APPLICABLE"],
  [ApprovalGateReviewCheckStatus.UNKNOWN, "UNKNOWN"],
] as const satisfies readonly (readonly [
  ApprovalGateReviewCheckStatus,
  ApprovalReviewCheckStatus,
])[];

const actorRoleCases = [
  [ApprovalGateActorRole.HUMAN_OWNER, "HUMAN_OWNER"],
  [ApprovalGateActorRole.REVIEWER, "REVIEWER"],
  [ApprovalGateActorRole.SYSTEM, "SYSTEM"],
] as const satisfies readonly (readonly [
  ApprovalGateActorRole,
  ApprovalActorRole,
])[];

function state(overrides: Partial<ApprovalGateState> = {}): ApprovalGateState {
  return {
    status: "APPROVED",
    recordVersion: 3,
    reviewChecks: {
      terms: "PASS",
      disclosure: "WARNING",
      prohibitedExpression: "NOT_APPLICABLE",
    },
    humanOwnerDecisionRequired: true,
    processedTransitionRequestIds: ["TR-2", "TR-1"],
    ...overrides,
  };
}

function persistenceRow(
  overrides: Partial<ApprovalGatePersistenceRow> = {},
): ApprovalGatePersistenceRow {
  return {
    approvalGateId: "AG-1",
    status: ApprovalGateRecordStatus.APPROVED,
    recordVersion: 3,
    reviewTerms: ApprovalGateReviewCheckStatus.PASS,
    reviewDisclosure: ApprovalGateReviewCheckStatus.WARNING,
    reviewProhibitedExpression: ApprovalGateReviewCheckStatus.NOT_APPLICABLE,
    humanOwnerDecisionRequired: true,
    processedTransitions: [
      {
        id: "b",
        approvalGateId: "AG-1",
        transitionRequestId: "TR-2",
        createdAt: new Date("2026-08-03T00:00:01.000Z"),
        auditEvent: {
          approvalGateId: "AG-1",
          transitionRequestId: "TR-2",
        },
      },
      {
        id: "a",
        approvalGateId: "AG-1",
        transitionRequestId: "TR-1",
        createdAt: new Date("2026-08-03T00:00:00.000Z"),
        auditEvent: {
          approvalGateId: "AG-1",
          transitionRequestId: "TR-1",
        },
      },
    ],
    ...overrides,
  };
}

function auditEvent(
  actorRole: ApprovalActorRole = "HUMAN_OWNER",
): ApprovalGateAuditEvent {
  return {
    eventType: "APPROVAL_GATE_TRANSITION",
    transitionRequestId: "TR-1",
    fromStatus: "REVIEW_REQUIRED",
    toStatus: "APPROVED",
    actorRole,
    recordVersion: 3,
  };
}

describe("approval-gate-persistence-mapper", () => {
  it("restores every state field and orders processed request IDs", () => {
    const aggregate = mapApprovalGatePersistenceRow(persistenceRow());

    expect(aggregate).toEqual({
      approvalGateId: "AG-1",
      state: {
        ...state(),
        processedTransitionRequestIds: ["TR-1", "TR-2"],
      },
    });
  });

  it.each(statusCases)(
    "maps persisted status %s exhaustively",
    (prismaStatus, coreStatus) => {
      const aggregate = mapApprovalGatePersistenceRow(
        persistenceRow({
          status: prismaStatus,
          processedTransitions: [],
        }),
      );

      expect(aggregate.state.status).toBe(coreStatus);
      expect(
        mapApprovalGateStateToRecordData(
          state({
            status: coreStatus,
            processedTransitionRequestIds: [],
          }),
        ).status,
      ).toBe(prismaStatus);
    },
  );

  it.each(reviewCheckCases)(
    "maps persisted review check %s exhaustively",
    (prismaStatus, coreStatus) => {
      const aggregate = mapApprovalGatePersistenceRow(
        persistenceRow({
          reviewTerms: prismaStatus,
          reviewDisclosure: prismaStatus,
          reviewProhibitedExpression: prismaStatus,
          processedTransitions: [],
        }),
      );

      expect(aggregate.state.reviewChecks).toEqual({
        terms: coreStatus,
        disclosure: coreStatus,
        prohibitedExpression: coreStatus,
      });

      const record = mapApprovalGateStateToRecordData(
        state({
          reviewChecks: {
            terms: coreStatus,
            disclosure: coreStatus,
            prohibitedExpression: coreStatus,
          },
          processedTransitionRequestIds: [],
        }),
      );
      expect(record.reviewTerms).toBe(prismaStatus);
      expect(record.reviewDisclosure).toBe(prismaStatus);
      expect(record.reviewProhibitedExpression).toBe(prismaStatus);
    },
  );

  it.each(actorRoleCases)(
    "maps actor role %s exhaustively",
    (prismaRole, coreRole) => {
      expect(
        mapApprovalGateAuditEventToRecordData(auditEvent(coreRole)).actorRole,
      ).toBe(prismaRole);
    },
  );

  it("maps all optional audit references and no arbitrary fields", () => {
    const event: ApprovalGateAuditEvent = {
      ...auditEvent(),
      contentReference: "CNT-1",
      reviewReference: "REV-1",
      evidenceReference: "EVD-1",
      publishRequestReference: "PUB-1",
      archiveReference: "ARC-1",
      authorizationSubjectReference: "USR-1",
    };

    expect(mapApprovalGateAuditEventToRecordData(event)).toEqual({
      eventType: ApprovalGateAuditEventType.APPROVAL_GATE_TRANSITION,
      fromStatus: ApprovalGateRecordStatus.REVIEW_REQUIRED,
      toStatus: ApprovalGateRecordStatus.APPROVED,
      actorRole: ApprovalGateActorRole.HUMAN_OWNER,
      recordVersion: 3,
      contentReference: "CNT-1",
      reviewReference: "REV-1",
      evidenceReference: "EVD-1",
      publishRequestReference: "PUB-1",
      archiveReference: "ARC-1",
      authorizationSubjectReference: "USR-1",
    });
  });

  it("rejects a missing audit relation", () => {
    expect(() =>
      mapApprovalGatePersistenceRow(
        persistenceRow({
          processedTransitions: [
            {
              id: "a",
              approvalGateId: "AG-1",
              transitionRequestId: "TR-1",
              createdAt: new Date("2026-08-03T00:00:00.000Z"),
              auditEvent: null,
            },
          ],
        }),
      ),
    ).toThrow("Invalid Approval Gate persistence relation.");
  });

  it("rejects a processed row linked to another Gate", () => {
    expect(() =>
      mapApprovalGatePersistenceRow(
        persistenceRow({
          processedTransitions: [
            {
              id: "a",
              approvalGateId: "AG-OTHER",
              transitionRequestId: "TR-1",
              createdAt: new Date("2026-08-03T00:00:00.000Z"),
              auditEvent: {
                approvalGateId: "AG-1",
                transitionRequestId: "TR-1",
              },
            },
          ],
        }),
      ),
    ).toThrow("Invalid Approval Gate persistence relation.");
  });

  it("rejects an audit row linked to another Gate", () => {
    expect(() =>
      mapApprovalGatePersistenceRow(
        persistenceRow({
          processedTransitions: [
            {
              id: "a",
              approvalGateId: "AG-1",
              transitionRequestId: "TR-1",
              createdAt: new Date("2026-08-03T00:00:00.000Z"),
              auditEvent: {
                approvalGateId: "AG-OTHER",
                transitionRequestId: "TR-1",
              },
            },
          ],
        }),
      ),
    ).toThrow("Invalid Approval Gate persistence relation.");
  });

  it("rejects an audit row linked to another request", () => {
    expect(() =>
      mapApprovalGatePersistenceRow(
        persistenceRow({
          processedTransitions: [
            {
              id: "a",
              approvalGateId: "AG-1",
              transitionRequestId: "TR-1",
              createdAt: new Date("2026-08-03T00:00:00.000Z"),
              auditEvent: {
                approvalGateId: "AG-1",
                transitionRequestId: "TR-OTHER",
              },
            },
          ],
        }),
      ),
    ).toThrow("Invalid Approval Gate persistence relation.");
  });

  it("returns a clone that is not mutated by later source changes", () => {
    const row = persistenceRow();
    const aggregate = mapApprovalGatePersistenceRow(row);

    (
      row.processedTransitions[0] as {
        transitionRequestId: string;
      }
    ).transitionRequestId = "TR-MUTATED";

    expect(aggregate.state.processedTransitionRequestIds).toEqual([
      "TR-1",
      "TR-2",
    ]);
  });
});
