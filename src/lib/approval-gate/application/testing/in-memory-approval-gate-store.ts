import type { ApprovalGateAuditEvent, ApprovalGateState } from "../../types";
import type {
  ApprovalGateStore,
  CommitApprovalGateTransitionInput,
  CommitApprovalGateTransitionResult,
} from "../approval-gate-store";
import type { ApprovalGateAggregate } from "../types";

interface StoredApprovalGate {
  aggregate: ApprovalGateAggregate;
  auditEvents: ApprovalGateAuditEvent[];
}

function cloneState(state: ApprovalGateState): ApprovalGateState {
  return {
    status: state.status,
    recordVersion: state.recordVersion,
    reviewChecks: {
      terms: state.reviewChecks.terms,
      disclosure: state.reviewChecks.disclosure,
      prohibitedExpression: state.reviewChecks.prohibitedExpression,
    },
    humanOwnerDecisionRequired: state.humanOwnerDecisionRequired,
    processedTransitionRequestIds: [...state.processedTransitionRequestIds],
  };
}

function cloneAggregate(
  aggregate: ApprovalGateAggregate,
): ApprovalGateAggregate {
  return {
    approvalGateId: aggregate.approvalGateId,
    state: cloneState(aggregate.state),
  };
}

function cloneAuditEvent(
  event: ApprovalGateAuditEvent,
): ApprovalGateAuditEvent {
  return {
    eventType: event.eventType,
    transitionRequestId: event.transitionRequestId,
    fromStatus: event.fromStatus,
    toStatus: event.toStatus,
    actorRole: event.actorRole,
    recordVersion: event.recordVersion,
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

export class InMemoryApprovalGateStore implements ApprovalGateStore {
  private readonly records = new Map<string, StoredApprovalGate>();
  private failNextCommitFlag = false;

  constructor(initialAggregates: readonly ApprovalGateAggregate[] = []) {
    for (const aggregate of initialAggregates) {
      if (this.records.has(aggregate.approvalGateId)) {
        throw new Error("Duplicate Approval Gate ID in test seed.");
      }

      this.records.set(aggregate.approvalGateId, {
        aggregate: cloneAggregate(aggregate),
        auditEvents: [],
      });
    }
  }

  async read(approvalGateId: string): Promise<ApprovalGateAggregate | null> {
    const stored = this.records.get(approvalGateId);
    return stored ? cloneAggregate(stored.aggregate) : null;
  }

  async create(
    aggregate: ApprovalGateAggregate,
  ): Promise<ApprovalGateAggregate | null> {
    if (this.records.has(aggregate.approvalGateId)) {
      return null;
    }

    const created = cloneAggregate(aggregate);
    this.records.set(created.approvalGateId, {
      aggregate: created,
      auditEvents: [],
    });

    return cloneAggregate(created);
  }

  async list(): Promise<readonly ApprovalGateAggregate[]> {
    return [...this.records.values()].map(({ aggregate }) =>
      cloneAggregate(aggregate),
    );
  }

  async commitTransition(
    input: CommitApprovalGateTransitionInput,
  ): Promise<CommitApprovalGateTransitionResult> {
    const stored = this.records.get(input.approvalGateId);

    if (!stored) {
      return { kind: "NOT_FOUND" };
    }

    if (this.failNextCommitFlag) {
      this.failNextCommitFlag = false;
      return { kind: "PERSISTENCE_FAILURE" };
    }

    if (
      stored.aggregate.state.processedTransitionRequestIds.includes(
        input.transitionRequestId,
      )
    ) {
      return { kind: "DUPLICATE_REQUEST" };
    }

    if (stored.aggregate.state.recordVersion !== input.expectedRecordVersion) {
      return { kind: "VERSION_CONFLICT" };
    }

    const expectedNextVersion = input.expectedRecordVersion + 1;
    const nextStateIsConsistent =
      input.nextState.recordVersion === expectedNextVersion &&
      input.nextState.processedTransitionRequestIds.includes(
        input.transitionRequestId,
      ) &&
      input.auditEvent.transitionRequestId === input.transitionRequestId &&
      input.auditEvent.recordVersion === expectedNextVersion;

    if (!nextStateIsConsistent) {
      return { kind: "PERSISTENCE_FAILURE" };
    }

    const nextAggregate: ApprovalGateAggregate = {
      approvalGateId: input.approvalGateId,
      state: cloneState(input.nextState),
    };
    const nextAuditEvents = [
      ...stored.auditEvents.map(cloneAuditEvent),
      cloneAuditEvent(input.auditEvent),
    ];

    this.records.set(input.approvalGateId, {
      aggregate: nextAggregate,
      auditEvents: nextAuditEvents,
    });

    return {
      kind: "COMMITTED",
      aggregate: cloneAggregate(nextAggregate),
    };
  }

  failNextCommit(): void {
    this.failNextCommitFlag = true;
  }

  getAuditEvents(approvalGateId: string): readonly ApprovalGateAuditEvent[] {
    return (
      this.records.get(approvalGateId)?.auditEvents.map(cloneAuditEvent) ?? []
    );
  }
}
