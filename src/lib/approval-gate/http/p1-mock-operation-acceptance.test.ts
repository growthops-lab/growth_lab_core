import { describe, expect, it } from "vitest";

import { InMemoryApprovalGateStore } from "../application/testing/in-memory-approval-gate-store";
import { createInMemoryApprovalGateApi } from "./in-memory-approval-gate-api";

const REVIEW_CHECKS_PASS = {
  terms: "PASS",
  disclosure: "PASS",
  prohibitedExpression: "PASS",
} as const;

describe("P1 Mock operation acceptance", () => {
  it("P1-MOCK-001 keeps the approved workflow in-memory while retaining auditable transitions", async () => {
    const store = new InMemoryApprovalGateStore();
    const api = createInMemoryApprovalGateApi({ store });
    const approvalGateId = "AG-P1MOCK-0001";

    await expect(api.create({ approvalGateId })).resolves.toMatchObject({
      status: 201,
      body: { item: { approvalGateId, state: { status: "DRAFT" } } },
    });

    await expect(
      api.transition(approvalGateId, {
        fromStatus: "DRAFT",
        toStatus: "REVIEW_REQUIRED",
        expectedRecordVersion: 0,
        transitionRequestId: "P1-MOCK-REVIEW-001",
      }),
    ).resolves.toMatchObject({
      status: 200,
      body: {
        item: { state: { status: "REVIEW_REQUIRED", recordVersion: 1 } },
      },
    });

    await expect(
      api.transition(approvalGateId, {
        fromStatus: "REVIEW_REQUIRED",
        toStatus: "APPROVED",
        expectedRecordVersion: 1,
        transitionRequestId: "P1-MOCK-APPROVE-001",
        decisionCategory: "APPROVED_FOR_MVP_PUBLISHING",
        decisionReason: "P1 mock acceptance checks passed.",
        reviewReference: "P1-MOCK-REVIEW-EVIDENCE-001",
        evidenceReference: "P1-MOCK-EVIDENCE-001",
        reviewChecks: REVIEW_CHECKS_PASS,
      }),
    ).resolves.toMatchObject({
      status: 200,
      body: {
        item: {
          approvalGateId,
          state: {
            status: "APPROVED",
            recordVersion: 2,
            reviewChecks: REVIEW_CHECKS_PASS,
          },
        },
      },
    });

    await expect(api.get(approvalGateId)).resolves.toMatchObject({
      status: 200,
      body: { item: { state: { status: "APPROVED", recordVersion: 2 } } },
    });

    expect(store.getAuditEvents(approvalGateId)).toEqual([
      expect.objectContaining({
        transitionRequestId: "P1-MOCK-REVIEW-001",
        fromStatus: "DRAFT",
        toStatus: "REVIEW_REQUIRED",
        recordVersion: 1,
      }),
      expect.objectContaining({
        transitionRequestId: "P1-MOCK-APPROVE-001",
        fromStatus: "REVIEW_REQUIRED",
        toStatus: "APPROVED",
        recordVersion: 2,
        reviewReference: "P1-MOCK-REVIEW-EVIDENCE-001",
        evidenceReference: "P1-MOCK-EVIDENCE-001",
      }),
    ]);
  });

  it("P1-MOCK-002 fails closed for an attempted direct publish and leaves the state unchanged", async () => {
    const api = createInMemoryApprovalGateApi();
    const approvalGateId = "AG-P1MOCK-0002";
    await api.create({ approvalGateId });

    await expect(
      api.transition(approvalGateId, {
        fromStatus: "DRAFT",
        toStatus: "PUBLISHED",
        expectedRecordVersion: 0,
        transitionRequestId: "P1-MOCK-DIRECT-PUBLISH-001",
      }),
    ).resolves.toEqual({
      status: 422,
      body: { error: "INVALID_STATUS_TRANSITION" },
    });

    await expect(api.get(approvalGateId)).resolves.toMatchObject({
      body: { item: { state: { status: "DRAFT", recordVersion: 0 } } },
    });
  });
});
