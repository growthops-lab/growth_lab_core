import {
  ApprovalGateActorRole,
  ApprovalGateAuditEventType,
  ApprovalGateRecordStatus,
  ApprovalGateReviewCheckStatus,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import type {
  CommitApprovalGateTransitionInput,
  CommitApprovalGateTransitionResult,
} from "../approval-gate-store";
import { PrismaApprovalGateStore } from "./prisma-approval-gate-store";

const APPROVAL_GATE_ID = "AG-1";
const TRANSITION_REQUEST_ID = "TR-1";

function input(): CommitApprovalGateTransitionInput {
  return {
    approvalGateId: APPROVAL_GATE_ID,
    expectedRecordVersion: 0,
    transitionRequestId: TRANSITION_REQUEST_ID,
    nextState: {
      status: "REVIEW_REQUIRED",
      recordVersion: 1,
      reviewChecks: {
        terms: "NOT_CHECKED",
        disclosure: "NOT_CHECKED",
        prohibitedExpression: "NOT_CHECKED",
      },
      humanOwnerDecisionRequired: false,
      processedTransitionRequestIds: [TRANSITION_REQUEST_ID],
    },
    auditEvent: {
      eventType: "APPROVAL_GATE_TRANSITION",
      transitionRequestId: TRANSITION_REQUEST_ID,
      fromStatus: "DRAFT",
      toStatus: "REVIEW_REQUIRED",
      actorRole: "REVIEWER",
      recordVersion: 1,
    },
  };
}

function persistedRow() {
  return {
    approvalGateId: APPROVAL_GATE_ID,
    status: ApprovalGateRecordStatus.REVIEW_REQUIRED,
    recordVersion: 1,
    reviewTerms: ApprovalGateReviewCheckStatus.NOT_CHECKED,
    reviewDisclosure: ApprovalGateReviewCheckStatus.NOT_CHECKED,
    reviewProhibitedExpression: ApprovalGateReviewCheckStatus.NOT_CHECKED,
    humanOwnerDecisionRequired: false,
    processedTransitions: [
      {
        id: "row-1",
        approvalGateId: APPROVAL_GATE_ID,
        transitionRequestId: TRANSITION_REQUEST_ID,
        createdAt: new Date("2026-08-03T00:00:00.000Z"),
        auditEvent: {
          approvalGateId: APPROVAL_GATE_ID,
          transitionRequestId: TRANSITION_REQUEST_ID,
        },
      },
    ],
  };
}

function transaction(
  overrides: {
    duplicate?: object | null;
    gate?: object | null;
    updateCount?: number;
    duplicateAfterCas?: object | null;
    gateAfterCas?: object | null;
    finalRow?: ReturnType<typeof persistedRow> | null;
    processedCreateError?: unknown;
    auditCreateError?: unknown;
  } = {},
) {
  const duplicateValues = [
    overrides.duplicate ?? null,
    overrides.duplicateAfterCas ?? null,
  ];

  const initialGate =
    "gate" in overrides
      ? overrides.gate
      : {
          approvalGateId: APPROVAL_GATE_ID,
          status: ApprovalGateRecordStatus.DRAFT,
          recordVersion: 0,
        };
  const updateCount = overrides.updateCount ?? 1;
  const secondGate =
    updateCount === 0
      ? "gateAfterCas" in overrides
        ? overrides.gateAfterCas
        : { approvalGateId: APPROVAL_GATE_ID }
      : "finalRow" in overrides
        ? overrides.finalRow
        : persistedRow();
  const gateValues = [initialGate, secondGate];

  return {
    approvalGateProcessedTransition: {
      findUnique: vi.fn(async () => duplicateValues.shift() ?? null),
      create: vi.fn(async () => {
        if (overrides.processedCreateError !== undefined) {
          throw overrides.processedCreateError;
        }
        return { id: "processed-1" };
      }),
    },
    approvalGateRecord: {
      findUnique: vi.fn(async () => gateValues.shift() ?? null),
      updateMany: vi.fn(async () => ({
        count: overrides.updateCount ?? 1,
      })),
    },
    approvalGateAuditEventRecord: {
      create: vi.fn(async () => {
        if (overrides.auditCreateError !== undefined) {
          throw overrides.auditCreateError;
        }
        return { id: "audit-1" };
      }),
    },
  } as unknown as Prisma.TransactionClient;
}

function clientForTransaction(
  tx: Prisma.TransactionClient,
  transactionErrors: readonly unknown[] = [],
): PrismaClient {
  const errors = [...transactionErrors];

  return {
    $transaction: vi.fn(
      async (callback: (value: Prisma.TransactionClient) => unknown) => {
        const nextError = errors.shift();
        if (nextError !== undefined) {
          throw nextError;
        }
        return callback(tx);
      },
    ),
  } as unknown as PrismaClient;
}

function rollbackAwareAuditFailureClient(error: unknown) {
  const durable: {
    recordVersion: number;
    status: ApprovalGateRecordStatus;
    processed: string[];
    audits: string[];
  } = {
    recordVersion: 0,
    status: ApprovalGateRecordStatus.DRAFT,
    processed: [],
    audits: [],
  };

  const snapshot = () => ({
    recordVersion: durable.recordVersion,
    status: durable.status,
    processed: [...durable.processed],
    audits: [...durable.audits],
  });

  const prisma = {
    $transaction: vi.fn(
      async (callback: (value: Prisma.TransactionClient) => unknown) => {
        const working = snapshot();
        let recordReadCount = 0;

        const tx = {
          approvalGateProcessedTransition: {
            findUnique: vi.fn(async () => null),
            create: vi.fn(async () => {
              working.processed.push(TRANSITION_REQUEST_ID);
              return { id: "processed-1" };
            }),
          },
          approvalGateRecord: {
            findUnique: vi.fn(async () => {
              recordReadCount += 1;
              if (recordReadCount === 1) {
                return {
                  approvalGateId: APPROVAL_GATE_ID,
                  status: working.status,
                  recordVersion: working.recordVersion,
                };
              }
              return persistedRow();
            }),
            updateMany: vi.fn(async () => {
              working.recordVersion = 1;
              working.status = ApprovalGateRecordStatus.REVIEW_REQUIRED;
              return { count: 1 };
            }),
          },
          approvalGateAuditEventRecord: {
            create: vi.fn(async () => {
              throw error;
            }),
          },
        } as unknown as Prisma.TransactionClient;

        try {
          const result = await callback(tx);
          durable.recordVersion = working.recordVersion;
          durable.status = working.status;
          durable.processed = [...working.processed];
          durable.audits = [...working.audits];
          return result;
        } catch (transactionError) {
          throw transactionError;
        }
      },
    ),
  } as unknown as PrismaClient;

  return { prisma, snapshot };
}

describe("PrismaApprovalGateStore", () => {
  it("returns null when read does not find a Gate", async () => {
    const prisma = {
      approvalGateRecord: {
        findUnique: vi.fn(async () => null),
      },
    } as unknown as PrismaClient;

    await expect(
      new PrismaApprovalGateStore(prisma).read(APPROVAL_GATE_ID),
    ).resolves.toBeNull();
  });

  it("commits state, processed request, and audit in one transaction", async () => {
    const tx = transaction();
    const store = new PrismaApprovalGateStore(clientForTransaction(tx));

    const result = await store.commitTransition(input());

    expect(result.kind).toBe("COMMITTED");
    expect(tx.approvalGateRecord.updateMany).toHaveBeenCalledTimes(1);
    expect(tx.approvalGateProcessedTransition.create).toHaveBeenCalledTimes(1);
    expect(tx.approvalGateAuditEventRecord.create).toHaveBeenCalledTimes(1);
  });

  it("prioritizes a duplicate request before version checks", async () => {
    const tx = transaction({ duplicate: { id: "existing" } });
    const store = new PrismaApprovalGateStore(clientForTransaction(tx));

    await expect(store.commitTransition(input())).resolves.toEqual({
      kind: "DUPLICATE_REQUEST",
    });
    expect(tx.approvalGateRecord.updateMany).not.toHaveBeenCalled();
  });

  it("prioritizes a duplicate discovered after a failed CAS", async () => {
    const tx = transaction({
      updateCount: 0,
      duplicateAfterCas: { id: "existing" },
    });
    const store = new PrismaApprovalGateStore(clientForTransaction(tx));

    await expect(store.commitTransition(input())).resolves.toEqual({
      kind: "DUPLICATE_REQUEST",
    });
  });

  it("returns VERSION_CONFLICT when CAS fails and the Gate remains", async () => {
    const tx = transaction({ updateCount: 0 });
    const store = new PrismaApprovalGateStore(clientForTransaction(tx));

    await expect(store.commitTransition(input())).resolves.toEqual({
      kind: "VERSION_CONFLICT",
    });
  });

  it("returns NOT_FOUND when CAS fails and the Gate was removed", async () => {
    const tx = transaction({
      updateCount: 0,
      gateAfterCas: null,
    });
    const store = new PrismaApprovalGateStore(clientForTransaction(tx));

    await expect(store.commitTransition(input())).resolves.toEqual({
      kind: "NOT_FOUND",
    });
  });

  it("maps only a processed-create target P2002 to DUPLICATE_REQUEST", async () => {
    const uniqueError = {
      code: "P2002",
      meta: {
        target: ["approvalGateId", "transitionRequestId"],
      },
    };
    const tx = transaction({ processedCreateError: uniqueError });
    const store = new PrismaApprovalGateStore(clientForTransaction(tx));

    await expect(store.commitTransition(input())).resolves.toEqual({
      kind: "DUPLICATE_REQUEST",
    });
  });

  it("does not classify a processed-create unrelated P2002 as duplicate", async () => {
    const unrelated = {
      code: "P2002",
      meta: { target: ["otherField"] },
    };
    const tx = transaction({ processedCreateError: unrelated });
    const store = new PrismaApprovalGateStore(clientForTransaction(tx));

    await expect(store.commitTransition(input())).resolves.toEqual({
      kind: "PERSISTENCE_FAILURE",
    });
  });

  it("does not classify an audit-create same-field P2002 as duplicate", async () => {
    const duplicateShapedAuditError = {
      code: "P2002",
      meta: {
        target: ["approvalGateId", "transitionRequestId"],
      },
    };
    const tx = transaction({
      auditCreateError: duplicateShapedAuditError,
    });
    const store = new PrismaApprovalGateStore(clientForTransaction(tx));

    await expect(store.commitTransition(input())).resolves.toEqual({
      kind: "PERSISTENCE_FAILURE",
    });
  });

  it("preserves durable state when audit insert rolls back the transaction", async () => {
    const { prisma, snapshot } = rollbackAwareAuditFailureClient(
      new Error("audit insert failed"),
    );
    const store = new PrismaApprovalGateStore(prisma);
    const before = snapshot();

    await expect(store.commitTransition(input())).resolves.toEqual({
      kind: "PERSISTENCE_FAILURE",
    });

    expect(snapshot()).toEqual(before);
  });

  it("retries P2034 once and then succeeds", async () => {
    const tx = transaction();
    const p2034 = { code: "P2034" };
    const prisma = clientForTransaction(tx, [p2034]);
    const store = new PrismaApprovalGateStore(prisma);

    const result = await store.commitTransition(input());

    expect(result.kind).toBe("COMMITTED");
    expect(prisma.$transaction).toHaveBeenCalledTimes(2);
  });

  it("returns PERSISTENCE_FAILURE after the P2034 retry limit", async () => {
    const p2034 = { code: "P2034" };
    const prisma = clientForTransaction(transaction(), [p2034, p2034]);
    const store = new PrismaApprovalGateStore(prisma);

    await expect(store.commitTransition(input())).resolves.toEqual({
      kind: "PERSISTENCE_FAILURE",
    });
  });

  it("rejects inconsistent input before opening a transaction", async () => {
    const prisma = clientForTransaction(transaction());
    const store = new PrismaApprovalGateStore(prisma);
    const inconsistent = input();
    inconsistent.nextState.processedTransitionRequestIds = [];

    await expect(store.commitTransition(inconsistent)).resolves.toEqual({
      kind: "PERSISTENCE_FAILURE",
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("never exposes an unknown internal error", async () => {
    const internalError = new Error("database password must not escape");
    const prisma = clientForTransaction(transaction(), [internalError]);
    const store = new PrismaApprovalGateStore(prisma);

    const result: CommitApprovalGateTransitionResult =
      await store.commitTransition(input());

    expect(result).toEqual({ kind: "PERSISTENCE_FAILURE" });
    expect(JSON.stringify(result)).not.toContain("password");
  });

  it("maps the fixed audit fields into the audit insert", async () => {
    const tx = transaction();
    const store = new PrismaApprovalGateStore(clientForTransaction(tx));

    await store.commitTransition(input());

    expect(tx.approvalGateAuditEventRecord.create).toHaveBeenCalledWith({
      data: {
        approvalGateId: APPROVAL_GATE_ID,
        transitionRequestId: TRANSITION_REQUEST_ID,
        eventType: ApprovalGateAuditEventType.APPROVAL_GATE_TRANSITION,
        fromStatus: ApprovalGateRecordStatus.DRAFT,
        toStatus: ApprovalGateRecordStatus.REVIEW_REQUIRED,
        actorRole: ApprovalGateActorRole.REVIEWER,
        recordVersion: 1,
      },
      select: { id: true },
    });
  });
});
