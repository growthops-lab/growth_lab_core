import { describe, expect, it } from "vitest";

import type {
  ApprovalGateState,
  ApprovalGateTransitionRequest,
} from "../types";
import type {
  ApprovalGateStore,
  CommitApprovalGateTransitionInput,
  CommitApprovalGateTransitionResult,
} from "./approval-gate-store";
import { InMemoryApprovalGateStore } from "./testing/in-memory-approval-gate-store";
import { TransitionApprovalGateUseCase } from "./transition-approval-gate-use-case";
import type {
  ApprovalGateAggregate,
  TransitionApprovalGateCommand,
} from "./types";

const APPROVAL_GATE_ID = "AG-20260802-0001";
const TRANSITION_REQUEST_ID = "TR-20260802-0001";

function state(overrides: Partial<ApprovalGateState> = {}): ApprovalGateState {
  return {
    status: "DRAFT",
    recordVersion: 0,
    reviewChecks: {
      terms: "NOT_CHECKED",
      disclosure: "NOT_CHECKED",
      prohibitedExpression: "NOT_CHECKED",
    },
    humanOwnerDecisionRequired: false,
    processedTransitionRequestIds: [],
    ...overrides,
  };
}

function aggregate(
  approvalGateId = APPROVAL_GATE_ID,
  stateOverrides: Partial<ApprovalGateState> = {},
): ApprovalGateAggregate {
  return {
    approvalGateId,
    state: state(stateOverrides),
  };
}

function command(
  overrides: Partial<TransitionApprovalGateCommand> = {},
): TransitionApprovalGateCommand {
  return {
    approvalGateId: APPROVAL_GATE_ID,
    request: {
      fromStatus: "DRAFT",
      toStatus: "REVIEW_REQUIRED",
      expectedRecordVersion: 0,
      transitionRequestId: TRANSITION_REQUEST_ID,
    },
    actor: {
      actorRole: "REVIEWER",
    },
    ...overrides,
  };
}

class ResultStore implements ApprovalGateStore {
  commitCalls = 0;

  constructor(
    private readonly current: ApprovalGateAggregate | null,
    private readonly result: CommitApprovalGateTransitionResult,
  ) {}

  async read(): Promise<ApprovalGateAggregate | null> {
    return this.current;
  }

  async commitTransition(
    _input: CommitApprovalGateTransitionInput,
  ): Promise<CommitApprovalGateTransitionResult> {
    void _input;
    this.commitCalls += 1;
    return this.result;
  }
}

describe("TransitionApprovalGateUseCase", () => {
  it("commits state, request id, and audit event together", async () => {
    const store = new InMemoryApprovalGateStore([aggregate()]);
    const useCase = new TransitionApprovalGateUseCase(store);

    const result = await useCase.execute(command());

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.aggregate.state.status).toBe("REVIEW_REQUIRED");
    expect(result.aggregate.state.recordVersion).toBe(1);
    expect(result.aggregate.state.processedTransitionRequestIds).toEqual([
      TRANSITION_REQUEST_ID,
    ]);
    expect(store.getAuditEvents(APPROVAL_GATE_ID)).toEqual([result.auditEvent]);
  });

  it("rejects an unsafe Approval Gate ID before reading the store", async () => {
    const store = new ResultStore(null, { kind: "PERSISTENCE_FAILURE" });
    const useCase = new TransitionApprovalGateUseCase(store);

    const result = await useCase.execute(
      command({ approvalGateId: "https://unsafe.example" }),
    );

    expect(result).toEqual({ ok: false, kind: "INVALID_INPUT" });
    expect(store.commitCalls).toBe(0);
  });

  it("returns NOT_FOUND when the aggregate does not exist", async () => {
    const useCase = new TransitionApprovalGateUseCase(
      new InMemoryApprovalGateStore(),
    );

    await expect(useCase.execute(command())).resolves.toEqual({
      ok: false,
      kind: "NOT_FOUND",
    });
  });

  it("does not commit when Core rejects the transition", async () => {
    const store = new ResultStore(aggregate(), {
      kind: "PERSISTENCE_FAILURE",
    });
    const useCase = new TransitionApprovalGateUseCase(store);
    const invalidRequest = {
      ...command().request,
      toStatus: "PUBLISHED",
    } as ApprovalGateTransitionRequest;

    const result = await useCase.execute(command({ request: invalidRequest }));

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.kind).toBe("CORE_REJECTED");
    expect(store.commitCalls).toBe(0);
  });

  it("maps Store version conflicts to a safe result", async () => {
    const store = new ResultStore(aggregate(), {
      kind: "VERSION_CONFLICT",
    });
    const useCase = new TransitionApprovalGateUseCase(store);

    await expect(useCase.execute(command())).resolves.toEqual({
      ok: false,
      kind: "VERSION_CONFLICT",
    });
  });

  it("maps Store duplicate requests to a safe result", async () => {
    const store = new ResultStore(aggregate(), {
      kind: "DUPLICATE_REQUEST",
    });
    const useCase = new TransitionApprovalGateUseCase(store);

    await expect(useCase.execute(command())).resolves.toEqual({
      ok: false,
      kind: "DUPLICATE_REQUEST",
    });
  });

  it("returns DUPLICATE_REQUEST for an exact replay without new mutation", async () => {
    const store = new InMemoryApprovalGateStore([aggregate()]);
    const useCase = new TransitionApprovalGateUseCase(store);

    const first = await useCase.execute(command());
    expect(first.ok).toBe(true);

    const stateAfterFirst = await store.read(APPROVAL_GATE_ID);
    const auditAfterFirst = store.getAuditEvents(APPROVAL_GATE_ID);

    await expect(useCase.execute(command())).resolves.toEqual({
      ok: false,
      kind: "DUPLICATE_REQUEST",
    });

    await expect(store.read(APPROVAL_GATE_ID)).resolves.toEqual(
      stateAfterFirst,
    );
    expect(store.getAuditEvents(APPROVAL_GATE_ID)).toEqual(auditAfterFirst);
    expect(store.getAuditEvents(APPROVAL_GATE_ID)).toHaveLength(1);
  });

  it("prioritizes duplicate requests over version conflicts in the Store", async () => {
    const storedState = aggregate(APPROVAL_GATE_ID, {
      status: "REVIEW_REQUIRED",
      recordVersion: 1,
      processedTransitionRequestIds: [TRANSITION_REQUEST_ID],
    });
    const store = new InMemoryApprovalGateStore([storedState]);

    const result = await store.commitTransition({
      approvalGateId: APPROVAL_GATE_ID,
      expectedRecordVersion: 0,
      transitionRequestId: TRANSITION_REQUEST_ID,
      nextState: state({
        status: "APPROVED",
        recordVersion: 1,
        processedTransitionRequestIds: [TRANSITION_REQUEST_ID],
      }),
      auditEvent: {
        eventType: "APPROVAL_GATE_TRANSITION",
        transitionRequestId: TRANSITION_REQUEST_ID,
        fromStatus: "DRAFT",
        toStatus: "REVIEW_REQUIRED",
        actorRole: "REVIEWER",
        recordVersion: 1,
      },
    });

    expect(result).toEqual({ kind: "DUPLICATE_REQUEST" });
    await expect(store.read(APPROVAL_GATE_ID)).resolves.toEqual(storedState);
    expect(store.getAuditEvents(APPROVAL_GATE_ID)).toEqual([]);
  });

  it("keeps state and audit unchanged on persistence failure", async () => {
    const store = new InMemoryApprovalGateStore([aggregate()]);
    store.failNextCommit();
    const useCase = new TransitionApprovalGateUseCase(store);

    await expect(useCase.execute(command())).resolves.toEqual({
      ok: false,
      kind: "PERSISTENCE_FAILURE",
    });
    await expect(store.read(APPROVAL_GATE_ID)).resolves.toEqual(aggregate());
    expect(store.getAuditEvents(APPROVAL_GATE_ID)).toEqual([]);
  });

  it("maps a thrown read error without exposing the exception", async () => {
    const store: ApprovalGateStore = {
      async read() {
        throw new Error("database password must not escape");
      },
      async commitTransition() {
        return { kind: "PERSISTENCE_FAILURE" };
      },
    };
    const useCase = new TransitionApprovalGateUseCase(store);

    await expect(useCase.execute(command())).resolves.toEqual({
      ok: false,
      kind: "PERSISTENCE_FAILURE",
    });
  });

  it("maps a thrown commit error without exposing the exception", async () => {
    const store: ApprovalGateStore = {
      async read() {
        return aggregate();
      },
      async commitTransition() {
        throw new Error("stack trace must not escape");
      },
    };
    const useCase = new TransitionApprovalGateUseCase(store);

    await expect(useCase.execute(command())).resolves.toEqual({
      ok: false,
      kind: "PERSISTENCE_FAILURE",
    });
  });

  it("rejects unknown command fields instead of silently forwarding them", async () => {
    const store = new InMemoryApprovalGateStore([aggregate()]);
    const useCase = new TransitionApprovalGateUseCase(store);
    const input = {
      ...command(),
      arbitraryMetadata: "not allowed",
    };

    await expect(useCase.execute(input)).resolves.toEqual({
      ok: false,
      kind: "INVALID_INPUT",
    });
  });

  it("rejects secret-like runtime fields before Store access", async () => {
    const store = new InMemoryApprovalGateStore([aggregate()]);
    const useCase = new TransitionApprovalGateUseCase(store);
    const input = {
      ...command(),
      request: {
        ...command().request,
        accessToken: "not-a-real-secret",
      },
    };

    await expect(useCase.execute(input)).resolves.toEqual({
      ok: false,
      kind: "INVALID_INPUT",
    });
  });

  it("does not let an invalid authorization context bypass Core validation", async () => {
    const reviewState = aggregate(APPROVAL_GATE_ID, {
      status: "REVIEW_REQUIRED",
      recordVersion: 3,
      humanOwnerDecisionRequired: true,
    });
    const store = new InMemoryApprovalGateStore([reviewState]);
    const useCase = new TransitionApprovalGateUseCase(store);

    const result = await useCase.execute({
      approvalGateId: APPROVAL_GATE_ID,
      request: {
        fromStatus: "REVIEW_REQUIRED",
        toStatus: "APPROVED",
        expectedRecordVersion: 3,
        transitionRequestId: "TR-20260802-0002",
        decisionCategory: "APPROVED_FOR_MVP_PUBLISHING",
        decisionReason: "Human review completed.",
        reviewReference: "REV-20260802-0001",
        evidenceReference: "EVD-20260802-0001",
        reviewChecks: {
          terms: "PASS",
          disclosure: "PASS",
          prohibitedExpression: "PASS",
        },
      },
      actor: {
        actorRole: "HUMAN_OWNER",
        authorizationContext: {
          trustStatus: "UNVERIFIED",
          subjectReference: "USR-20260802-0001",
          permissions: ["APPROVAL_GATE_HUMAN_OWNER_DECIDE"],
        },
      },
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.kind).toBe("CORE_REJECTED");
    expect(store.getAuditEvents(APPROVAL_GATE_ID)).toEqual([]);
  });

  it("persists only the fixed audit allowlist", async () => {
    const store = new InMemoryApprovalGateStore([aggregate()]);
    const useCase = new TransitionApprovalGateUseCase(store);

    const result = await useCase.execute(
      command({
        request: {
          ...command().request,
          contentReference: "CNT-20260802-0001",
        },
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(Object.keys(result.auditEvent).sort()).toEqual(
      [
        "actorRole",
        "contentReference",
        "eventType",
        "fromStatus",
        "recordVersion",
        "toStatus",
        "transitionRequestId",
      ].sort(),
    );
  });

  it("returns cloned aggregates and audit events from the in-memory Store", async () => {
    const seeded = aggregate();
    const store = new InMemoryApprovalGateStore([seeded]);
    seeded.state.processedTransitionRequestIds = ["TR-MUTATED"];

    const firstRead = await store.read(APPROVAL_GATE_ID);
    expect(firstRead?.state.processedTransitionRequestIds).toEqual([]);

    const useCase = new TransitionApprovalGateUseCase(store);
    const result = await useCase.execute(command());
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    result.aggregate.state.processedTransitionRequestIds = ["TR-MUTATED"];
    const events = store.getAuditEvents(APPROVAL_GATE_ID);
    if (events[0]) {
      (
        events[0] as unknown as { transitionRequestId: string }
      ).transitionRequestId = "TR-MUTATED";
    }

    const secondRead = await store.read(APPROVAL_GATE_ID);
    expect(secondRead?.state.processedTransitionRequestIds).toEqual([
      TRANSITION_REQUEST_ID,
    ]);
    expect(store.getAuditEvents(APPROVAL_GATE_ID)[0]?.transitionRequestId).toBe(
      TRANSITION_REQUEST_ID,
    );
  });

  it("scopes duplicate request identifiers by Approval Gate ID", async () => {
    const secondGateId = "AG-20260802-0002";
    const store = new InMemoryApprovalGateStore([
      aggregate(APPROVAL_GATE_ID),
      aggregate(secondGateId),
    ]);
    const useCase = new TransitionApprovalGateUseCase(store);

    const first = await useCase.execute(command());
    const second = await useCase.execute(
      command({ approvalGateId: secondGateId }),
    );

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
  });

  it("rejects an inconsistent next state without partial mutation", async () => {
    const store = new InMemoryApprovalGateStore([aggregate()]);

    const result = await store.commitTransition({
      approvalGateId: APPROVAL_GATE_ID,
      expectedRecordVersion: 0,
      transitionRequestId: TRANSITION_REQUEST_ID,
      nextState: state({
        status: "REVIEW_REQUIRED",
        recordVersion: 1,
        processedTransitionRequestIds: [],
      }),
      auditEvent: {
        eventType: "APPROVAL_GATE_TRANSITION",
        transitionRequestId: TRANSITION_REQUEST_ID,
        fromStatus: "DRAFT",
        toStatus: "REVIEW_REQUIRED",
        actorRole: "REVIEWER",
        recordVersion: 1,
      },
    });

    expect(result).toEqual({ kind: "PERSISTENCE_FAILURE" });
    await expect(store.read(APPROVAL_GATE_ID)).resolves.toEqual(aggregate());
    expect(store.getAuditEvents(APPROVAL_GATE_ID)).toEqual([]);
  });
});
