import { describe, expect, it } from "vitest";

import type { ApprovalGateActorContextProvider } from "../application/approval-gate-actor-context-provider";
import { createInMemoryApprovalGateApi } from "./in-memory-approval-gate-api";

function transitionInput(overrides: Record<string, unknown> = {}) {
  return {
    fromStatus: "DRAFT",
    toStatus: "REVIEW_REQUIRED",
    expectedRecordVersion: 0,
    transitionRequestId: "TR-20260817-0001",
    ...overrides,
  };
}

describe("in-memory Approval Gate HTTP contract", () => {
  it("creates, lists, and gets only the public in-memory representation", async () => {
    const api = createInMemoryApprovalGateApi();

    const created = await api.create({});
    expect(created.status).toBe(201);
    expect(created.body).toEqual({
      item: {
        approvalGateId: "AG-000001",
        state: {
          status: "DRAFT",
          recordVersion: 0,
          reviewChecks: {
            terms: "NOT_CHECKED",
            disclosure: "NOT_CHECKED",
            prohibitedExpression: "NOT_CHECKED",
          },
          humanOwnerDecisionRequired: false,
        },
      },
    });

    await expect(api.list()).resolves.toEqual({
      status: 200,
      body: { items: [created.body.item] },
    });
    await expect(api.get("AG-000001")).resolves.toEqual({
      status: 200,
      body: { item: created.body.item },
    });
    expect(JSON.stringify(created.body)).not.toContain(
      "processedTransitionRequestIds",
    );
    expect(JSON.stringify(created.body)).not.toContain("auditEvent");
  });

  it("skips a client-specified ID when generating the next in-memory ID", async () => {
    const api = createInMemoryApprovalGateApi();

    await expect(
      api.create({ approvalGateId: "AG-000001" }),
    ).resolves.toMatchObject({
      status: 201,
      body: { item: { approvalGateId: "AG-000001" } },
    });
    await expect(api.create({})).resolves.toMatchObject({
      status: 201,
      body: { item: { approvalGateId: "AG-000002" } },
    });
  });

  it("rejects secret-like create input without reflecting it", async () => {
    const api = createInMemoryApprovalGateApi();

    const result = await api.create({ accessToken: "must-not-return" });

    expect(result).toEqual({ status: 400, body: { error: "INVALID_INPUT" } });
    expect(JSON.stringify(result)).not.toContain("must-not-return");
  });

  it("treats unknown or malformed IDs as not found", async () => {
    const api = createInMemoryApprovalGateApi();

    await expect(api.get("AG-20990101-0001")).resolves.toEqual({
      status: 404,
      body: { error: "NOT_FOUND" },
    });
    await expect(api.get("not a valid id")).resolves.toEqual({
      status: 404,
      body: { error: "NOT_FOUND" },
    });
  });

  it("uses an injected actor context and fails closed for an invalid actor", async () => {
    const invalidProvider: ApprovalGateActorContextProvider = {
      async resolveActorContext() {
        return { actorRole: "REVIEWER" };
      },
    };
    const api = createInMemoryApprovalGateApi({
      actorContextProvider: invalidProvider,
    });

    await expect(api.create({})).resolves.toEqual({
      status: 403,
      body: { error: "UPSTREAM_CONTEXT_INVALID" },
    });
  });

  it("transitions through the Application Layer with an injected Human Owner actor", async () => {
    const api = createInMemoryApprovalGateApi();
    await api.create({ approvalGateId: "AG-20260817-0001" });

    await expect(
      api.transition("AG-20260817-0001", transitionInput()),
    ).resolves.toEqual({
      status: 200,
      body: {
        item: {
          approvalGateId: "AG-20260817-0001",
          state: {
            status: "REVIEW_REQUIRED",
            recordVersion: 1,
            reviewChecks: {
              terms: "NOT_CHECKED",
              disclosure: "NOT_CHECKED",
              prohibitedExpression: "NOT_CHECKED",
            },
            humanOwnerDecisionRequired: false,
          },
        },
      },
    });
  });

  it("rejects an invalid transition and preserves the stored state", async () => {
    const api = createInMemoryApprovalGateApi();
    await api.create({ approvalGateId: "AG-20260817-0001" });

    await expect(
      api.transition(
        "AG-20260817-0001",
        transitionInput({ toStatus: "PUBLISHED" }),
      ),
    ).resolves.toEqual({
      status: 422,
      body: { error: "INVALID_STATUS_TRANSITION" },
    });

    const retrieved = await api.get("AG-20260817-0001");
    expect(retrieved.body).toMatchObject({
      item: { state: { status: "DRAFT", recordVersion: 0 } },
    });
  });

  it("enforces idempotency without adding another state transition", async () => {
    const api = createInMemoryApprovalGateApi();
    await api.create({ approvalGateId: "AG-20260817-0001" });
    await api.transition("AG-20260817-0001", transitionInput());

    await expect(
      api.transition("AG-20260817-0001", transitionInput()),
    ).resolves.toEqual({
      status: 409,
      body: { error: "DUPLICATE_REQUEST" },
    });
    await expect(api.get("AG-20260817-0001")).resolves.toMatchObject({
      body: {
        item: { state: { status: "REVIEW_REQUIRED", recordVersion: 1 } },
      },
    });
  });

  it("rejects secret-like transition input before it reaches the Use Case", async () => {
    const api = createInMemoryApprovalGateApi();
    await api.create({ approvalGateId: "AG-20260817-0001" });

    const result = await api.transition(
      "AG-20260817-0001",
      transitionInput({ authorizationHeader: "must-not-return" }),
    );

    expect(result).toEqual({ status: 400, body: { error: "INVALID_INPUT" } });
    expect(JSON.stringify(result)).not.toContain("must-not-return");
  });
});
