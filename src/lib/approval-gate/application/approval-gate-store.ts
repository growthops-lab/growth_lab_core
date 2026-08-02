import type { ApprovalGateAuditEvent, ApprovalGateState } from "../types";
import type { ApprovalGateAggregate } from "./types";

export interface CommitApprovalGateTransitionInput {
  approvalGateId: string;
  expectedRecordVersion: number;
  transitionRequestId: string;
  nextState: ApprovalGateState;
  auditEvent: ApprovalGateAuditEvent;
}

export type CommitApprovalGateTransitionResult =
  | {
      kind: "COMMITTED";
      aggregate: ApprovalGateAggregate;
    }
  | {
      kind:
        | "NOT_FOUND"
        | "VERSION_CONFLICT"
        | "DUPLICATE_REQUEST"
        | "PERSISTENCE_FAILURE";
    };

export interface ApprovalGateStore {
  read(approvalGateId: string): Promise<ApprovalGateAggregate | null>;

  /**
   * Production adapters must atomically persist the next state, processed
   * transition request identifier, and audit event. When both a duplicate
   * request and a version conflict apply, DUPLICATE_REQUEST takes precedence.
   */
  commitTransition(
    input: CommitApprovalGateTransitionInput,
  ): Promise<CommitApprovalGateTransitionResult>;
}
