import type { Prisma, PrismaClient } from "@prisma/client";

import type {
  ApprovalGateStore,
  CommitApprovalGateTransitionInput,
  CommitApprovalGateTransitionResult,
} from "../approval-gate-store";
import {
  mapApprovalGateAuditEventToRecordData,
  mapApprovalGatePersistenceRow,
  mapApprovalGateStateToRecordData,
} from "./approval-gate-persistence-mapper";

const APPROVAL_GATE_READ_SELECT = {
  approvalGateId: true,
  status: true,
  recordVersion: true,
  reviewTerms: true,
  reviewDisclosure: true,
  reviewProhibitedExpression: true,
  humanOwnerDecisionRequired: true,
  processedTransitions: {
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      approvalGateId: true,
      transitionRequestId: true,
      createdAt: true,
      auditEvent: {
        select: {
          approvalGateId: true,
          transitionRequestId: true,
        },
      },
    },
  },
} satisfies Prisma.ApprovalGateRecordSelect;

class ProcessedTransitionUniqueConflict extends Error {
  constructor() {
    super("Processed transition unique conflict.");
    this.name = "ProcessedTransitionUniqueConflict";
  }
}

function getPrismaErrorCode(error: unknown): string | null {
  if (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return null;
}

function getPrismaErrorTarget(error: unknown): string {
  if (
    error === null ||
    typeof error !== "object" ||
    !("meta" in error) ||
    error.meta === null ||
    typeof error.meta !== "object" ||
    !("target" in error.meta)
  ) {
    return "";
  }

  const target = error.meta.target;
  if (Array.isArray(target)) {
    return target
      .filter((value): value is string => typeof value === "string")
      .join(",");
  }

  return typeof target === "string" ? target : "";
}

function isProcessedTransitionUniqueConflict(error: unknown): boolean {
  if (getPrismaErrorCode(error) !== "P2002") {
    return false;
  }

  const target = getPrismaErrorTarget(error);
  return (
    target.includes("approvalGateId") && target.includes("transitionRequestId")
  );
}

function isRetryableTransactionConflict(error: unknown): boolean {
  return getPrismaErrorCode(error) === "P2034";
}

function hasOneProcessedRequest(
  requestIds: readonly string[],
  transitionRequestId: string,
): boolean {
  return (
    requestIds.filter((requestId) => requestId === transitionRequestId)
      .length === 1
  );
}

function isCommitInputConsistent(
  input: CommitApprovalGateTransitionInput,
): boolean {
  const expectedNextVersion = input.expectedRecordVersion + 1;

  return (
    Number.isInteger(input.expectedRecordVersion) &&
    input.expectedRecordVersion >= 0 &&
    input.nextState.recordVersion === expectedNextVersion &&
    hasOneProcessedRequest(
      input.nextState.processedTransitionRequestIds,
      input.transitionRequestId,
    ) &&
    input.auditEvent.eventType === "APPROVAL_GATE_TRANSITION" &&
    input.auditEvent.transitionRequestId === input.transitionRequestId &&
    input.auditEvent.recordVersion === expectedNextVersion &&
    input.auditEvent.toStatus === input.nextState.status
  );
}

export class PrismaApprovalGateStore implements ApprovalGateStore {
  constructor(private readonly prisma: PrismaClient) {}

  async read(approvalGateId: string) {
    const row = await this.prisma.approvalGateRecord.findUnique({
      where: { approvalGateId },
      select: APPROVAL_GATE_READ_SELECT,
    });

    return row === null ? null : mapApprovalGatePersistenceRow(row);
  }

  async commitTransition(
    input: CommitApprovalGateTransitionInput,
  ): Promise<CommitApprovalGateTransitionResult> {
    if (!isCommitInputConsistent(input)) {
      return { kind: "PERSISTENCE_FAILURE" };
    }

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await this.prisma.$transaction((transaction) =>
          this.commitInTransaction(transaction, input),
        );
      } catch (error) {
        if (error instanceof ProcessedTransitionUniqueConflict) {
          return { kind: "DUPLICATE_REQUEST" };
        }

        if (isRetryableTransactionConflict(error) && attempt === 0) {
          continue;
        }

        return { kind: "PERSISTENCE_FAILURE" };
      }
    }

    return { kind: "PERSISTENCE_FAILURE" };
  }

  private async commitInTransaction(
    transaction: Prisma.TransactionClient,
    input: CommitApprovalGateTransitionInput,
  ): Promise<CommitApprovalGateTransitionResult> {
    const requestKey = {
      approvalGateId: input.approvalGateId,
      transitionRequestId: input.transitionRequestId,
    };

    const duplicate =
      await transaction.approvalGateProcessedTransition.findUnique({
        where: {
          approvalGateId_transitionRequestId: requestKey,
        },
        select: { id: true },
      });

    if (duplicate !== null) {
      return { kind: "DUPLICATE_REQUEST" };
    }

    const current = await transaction.approvalGateRecord.findUnique({
      where: { approvalGateId: input.approvalGateId },
      select: {
        approvalGateId: true,
        status: true,
        recordVersion: true,
      },
    });

    if (current === null) {
      return { kind: "NOT_FOUND" };
    }

    if (current.status !== input.auditEvent.fromStatus) {
      return { kind: "PERSISTENCE_FAILURE" };
    }

    const updated = await transaction.approvalGateRecord.updateMany({
      where: {
        approvalGateId: input.approvalGateId,
        recordVersion: input.expectedRecordVersion,
      },
      data: mapApprovalGateStateToRecordData(input.nextState),
    });

    if (updated.count === 0) {
      const duplicateAfterCas =
        await transaction.approvalGateProcessedTransition.findUnique({
          where: {
            approvalGateId_transitionRequestId: requestKey,
          },
          select: { id: true },
        });

      if (duplicateAfterCas !== null) {
        return { kind: "DUPLICATE_REQUEST" };
      }

      const currentAfterCas = await transaction.approvalGateRecord.findUnique({
        where: { approvalGateId: input.approvalGateId },
        select: { approvalGateId: true },
      });

      return currentAfterCas === null
        ? { kind: "NOT_FOUND" }
        : { kind: "VERSION_CONFLICT" };
    }

    try {
      await transaction.approvalGateProcessedTransition.create({
        data: requestKey,
        select: { id: true },
      });
    } catch (error) {
      if (isProcessedTransitionUniqueConflict(error)) {
        throw new ProcessedTransitionUniqueConflict();
      }

      throw error;
    }

    await transaction.approvalGateAuditEventRecord.create({
      data: {
        ...requestKey,
        ...mapApprovalGateAuditEventToRecordData(input.auditEvent),
      },
      select: { id: true },
    });

    const committed = await transaction.approvalGateRecord.findUnique({
      where: { approvalGateId: input.approvalGateId },
      select: APPROVAL_GATE_READ_SELECT,
    });

    if (committed === null) {
      return { kind: "PERSISTENCE_FAILURE" };
    }

    return {
      kind: "COMMITTED",
      aggregate: mapApprovalGatePersistenceRow(committed),
    };
  }
}
