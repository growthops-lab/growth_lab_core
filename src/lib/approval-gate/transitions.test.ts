import { describe, expect, it } from "vitest";

import { findForbiddenKeys } from "./sanitize";
import { transitionApprovalGate } from "./transitions";
import type {
  ApprovalGateErrorCode,
  ApprovalGateState,
  ApprovalGateTransitionRequest,
  ApprovalReviewChecks,
  TrustedAuthorizationContext,
} from "./types";

const ALL_PASS: ApprovalReviewChecks = {
  terms: "PASS",
  disclosure: "PASS",
  prohibitedExpression: "PASS",
};

const NOT_CHECKED: ApprovalReviewChecks = {
  terms: "NOT_CHECKED",
  disclosure: "NOT_CHECKED",
  prohibitedExpression: "NOT_CHECKED",
};

function state(overrides: Partial<ApprovalGateState> = {}): ApprovalGateState {
  return {
    status: "REVIEW_REQUIRED",
    recordVersion: 3,
    reviewChecks: NOT_CHECKED,
    humanOwnerDecisionRequired: false,
    processedTransitionRequestIds: [],
    ...overrides,
  };
}

function request(
  overrides: Partial<ApprovalGateTransitionRequest> = {},
): ApprovalGateTransitionRequest {
  return {
    fromStatus: "REVIEW_REQUIRED",
    toStatus: "APPROVED",
    expectedRecordVersion: 3,
    transitionRequestId: "transition-001",
    actorRole: "REVIEWER",
    decisionCategory: "APPROVED_FOR_MVP_PUBLISHING",
    decisionReason: "Reviewed against the required checks.",
    reviewReference: "review-001",
    evidenceReference: "evidence-001",
    reviewChecks: ALL_PASS,
    ...overrides,
  };
}

function approvedState(
  overrides: Partial<ApprovalGateState> = {},
): ApprovalGateState {
  return state({
    status: "APPROVED",
    reviewChecks: ALL_PASS,
    ...overrides,
  });
}

function publishRequest(
  overrides: Partial<ApprovalGateTransitionRequest> = {},
): ApprovalGateTransitionRequest {
  return request({
    fromStatus: "APPROVED",
    toStatus: "PUBLISHED",
    publishMode: "MANUAL",
    automationAllowedStatus: "NOT_APPLICABLE",
    publishRequestReference: "publish-request-001",
    ...overrides,
  });
}

function trustedHumanOwnerContext(
  overrides: Partial<TrustedAuthorizationContext> = {},
): TrustedAuthorizationContext {
  return {
    trustStatus: "VERIFIED_UPSTREAM",
    subjectReference: "owner-001",
    permissions: ["APPROVAL_GATE_HUMAN_OWNER_DECIDE"],
    ...overrides,
  };
}

function expectError(
  result: ReturnType<typeof transitionApprovalGate>,
  code: ApprovalGateErrorCode,
): void {
  expect(result).toMatchObject({ ok: false, error: { code } });
}

describe("transitionApprovalGate", () => {
  it("AGCORE-001 allows DRAFT to REVIEW_REQUIRED", () => {
    const result = transitionApprovalGate(
      state({ status: "DRAFT", recordVersion: 0 }),
      request({
        fromStatus: "DRAFT",
        toStatus: "REVIEW_REQUIRED",
        expectedRecordVersion: 0,
      }),
    );

    expect(result).toMatchObject({
      ok: true,
      nextState: { status: "REVIEW_REQUIRED", recordVersion: 1 },
    });
  });

  it("AGCORE-002 rejects DRAFT to PUBLISHED", () => {
    const result = transitionApprovalGate(
      state({ status: "DRAFT", recordVersion: 0 }),
      publishRequest({
        fromStatus: "DRAFT",
        expectedRecordVersion: 0,
      }),
    );

    expectError(result, "INVALID_STATUS_TRANSITION");
  });

  it("AGCORE-003 rejects a fromStatus mismatch", () => {
    const currentState = state();
    const result = transitionApprovalGate(
      currentState,
      request({ fromStatus: "DRAFT" }),
    );

    expectError(result, "FROM_STATUS_MISMATCH");
    expect(result.nextState).toBe(currentState);
  });

  it("AGCORE-004 approves when every review check passes", () => {
    const result = transitionApprovalGate(state(), request());

    expect(result).toMatchObject({
      ok: true,
      nextState: { status: "APPROVED", reviewChecks: ALL_PASS },
    });
  });

  it("AGCORE-005 rejects SYSTEM approval", () => {
    const result = transitionApprovalGate(
      state(),
      request({ actorRole: "SYSTEM" }),
    );

    expectError(result, "SYSTEM_CANNOT_APPROVE");
  });

  it("AGCORE-006 rejects a Reviewer when Human Owner approval is required", () => {
    const result = transitionApprovalGate(
      state({ humanOwnerDecisionRequired: true }),
      request(),
    );

    expectError(result, "HUMAN_OWNER_DECISION_REQUIRED");
  });

  it("AGCORE-007 allows a verified Human Owner approval", () => {
    const result = transitionApprovalGate(
      state({ humanOwnerDecisionRequired: true }),
      request({
        actorRole: "HUMAN_OWNER",
        authorizationContext: trustedHumanOwnerContext(),
      }),
    );

    expect(result).toMatchObject({
      ok: true,
      nextState: { status: "APPROVED", humanOwnerDecisionRequired: false },
      auditEvent: { authorizationSubjectReference: "owner-001" },
    });
  });

  it("AGCORE-008 rejects UNKNOWN review checks", () => {
    const result = transitionApprovalGate(
      state(),
      request({ reviewChecks: { ...ALL_PASS, terms: "UNKNOWN" } }),
    );

    expectError(result, "REVIEW_CHECK_INCOMPLETE");
  });

  it("AGCORE-009 rejects NOT_CHECKED review checks", () => {
    const result = transitionApprovalGate(
      state(),
      request({ reviewChecks: { ...ALL_PASS, terms: "NOT_CHECKED" } }),
    );

    expectError(result, "REVIEW_CHECK_INCOMPLETE");
  });

  it("AGCORE-010 rejects a Reviewer approval when a check has a warning", () => {
    const result = transitionApprovalGate(
      state(),
      request({ reviewChecks: { ...ALL_PASS, terms: "WARNING" } }),
    );

    expectError(result, "REVIEW_CHECK_INCOMPLETE");
  });

  it("AGCORE-011 rejects a Human Owner approval when a check has a warning", () => {
    const result = transitionApprovalGate(
      state(),
      request({
        actorRole: "HUMAN_OWNER",
        authorizationContext: trustedHumanOwnerContext(),
        decisionCategory: "APPROVED_WITH_MANUAL_REVIEW",
        reviewChecks: { ...ALL_PASS, terms: "WARNING" },
      }),
    );

    expectError(result, "REVIEW_CHECK_INCOMPLETE");
  });

  it("AGCORE-012 rejects BLOCKED without a blocked reason", () => {
    const result = transitionApprovalGate(
      state(),
      request({ toStatus: "BLOCKED", blockedReason: undefined }),
    );

    expectError(result, "MISSING_BLOCKED_REASON");
  });

  it("AGCORE-013 rejects DEFERRED without deferred items", () => {
    const result = transitionApprovalGate(
      state(),
      request({ toStatus: "DEFERRED", deferredItems: [] }),
    );

    expectError(result, "MISSING_DEFERRED_ITEMS");
  });

  it("AGCORE-014 rejects publication without a publication reference", () => {
    const result = transitionApprovalGate(
      approvedState(),
      publishRequest({ publishRequestReference: undefined }),
    );

    expectError(result, "MISSING_PUBLISH_REFERENCE");
  });

  it("AGCORE-015 rejects automated publication when automation is UNKNOWN", () => {
    const result = transitionApprovalGate(
      approvedState(),
      publishRequest({
        publishMode: "AUTOMATED",
        automationAllowedStatus: "UNKNOWN",
      }),
    );

    expectError(result, "AUTOMATION_NOT_ALLOWED");
  });

  it("AGCORE-016 allows automated publication when automation is ALLOWED", () => {
    const result = transitionApprovalGate(
      approvedState(),
      publishRequest({
        publishMode: "AUTOMATED",
        automationAllowedStatus: "ALLOWED",
      }),
    );

    expect(result).toMatchObject({
      ok: true,
      nextState: { status: "PUBLISHED" },
    });
  });

  it("AGCORE-017 allows manual publication when automation is NOT_APPLICABLE", () => {
    const result = transitionApprovalGate(approvedState(), publishRequest());

    expect(result).toMatchObject({
      ok: true,
      nextState: { status: "PUBLISHED" },
    });
  });

  it("AGCORE-018 rejects an accessToken input key without exposing its value", () => {
    const unsafeRequest = {
      ...request(),
      accessToken: "placeholder",
    } as unknown as ApprovalGateTransitionRequest;
    const result = transitionApprovalGate(state(), unsafeRequest);

    expectError(result, "FORBIDDEN_FIELD_DETECTED");
    expect(result).toMatchObject({ error: { forbiddenKeys: ["accessToken"] } });
    expect(JSON.stringify(result)).not.toContain("placeholder");
  });

  it("AGCORE-019 rejects a nested password input key", () => {
    const unsafeRequest = {
      ...request(),
      authorizationContext: {
        ...trustedHumanOwnerContext(),
        nested: { password: "placeholder" },
      },
    } as unknown as ApprovalGateTransitionRequest;
    const result = transitionApprovalGate(state(), unsafeRequest);

    expectError(result, "FORBIDDEN_FIELD_DETECTED");
    expect(result).toMatchObject({ error: { forbiddenKeys: ["password"] } });
  });

  it("AGCORE-020 emits allowlisted audit references", () => {
    const result = transitionApprovalGate(
      state(),
      request({
        contentReference: "content-001",
        archiveReference: "archive-001",
      }),
    );

    expect(result).toMatchObject({
      ok: true,
      auditEvent: {
        contentReference: "content-001",
        reviewReference: "review-001",
        evidenceReference: "evidence-001",
        archiveReference: "archive-001",
      },
    });
  });

  it("AGCORE-021 increments the record version on success", () => {
    const result = transitionApprovalGate(
      state({ recordVersion: 9 }),
      request({ expectedRecordVersion: 9 }),
    );

    expect(result).toMatchObject({
      ok: true,
      nextState: { recordVersion: 10 },
      auditEvent: { recordVersion: 10 },
    });
  });

  it("AGCORE-022 excludes decision text and arbitrary payloads from audit events", () => {
    const result = transitionApprovalGate(
      state(),
      request({
        decisionReason:
          "A detailed decision belongs to the state transition, not the audit event.",
      }),
    );

    expect(result).toMatchObject({ ok: true });
    if (result.ok) {
      expect(result.auditEvent).not.toHaveProperty("decisionReason");
      expect(result.auditEvent).not.toHaveProperty("payload");
      expect(result.auditEvent).not.toHaveProperty("metadata");
      expect(result.auditEvent).not.toHaveProperty("publishedAt");
    }
  });

  it("AGCORE-023 allows PUBLISHED to REVIEW_REQUIRED", () => {
    const result = transitionApprovalGate(
      approvedState({ status: "PUBLISHED" }),
      request({
        fromStatus: "PUBLISHED",
        toStatus: "REVIEW_REQUIRED",
      }),
    );

    expect(result).toMatchObject({
      ok: true,
      nextState: { status: "REVIEW_REQUIRED", reviewChecks: NOT_CHECKED },
    });
  });

  it("AGCORE-024 requires a reuse reason when ARCHIVED returns to review", () => {
    const result = transitionApprovalGate(
      state({ status: "ARCHIVED" }),
      request({
        fromStatus: "ARCHIVED",
        toStatus: "REVIEW_REQUIRED",
        decisionReason: undefined,
      }),
    );

    expectError(result, "MISSING_DECISION_REASON");
  });

  it("AGCORE-025 requires a review reference for approval", () => {
    const result = transitionApprovalGate(
      state(),
      request({ reviewReference: undefined }),
    );

    expectError(result, "MISSING_REVIEW_ID");
  });

  it("AGCORE-026 requires an evidence reference for approval", () => {
    const result = transitionApprovalGate(
      state(),
      request({ evidenceReference: undefined }),
    );

    expectError(result, "MISSING_EVIDENCE_REFERENCE");
  });

  it("rejects REVIEW_REQUIRED to PUBLISHED without APPROVED", () => {
    const result = transitionApprovalGate(
      state(),
      publishRequest({ fromStatus: "REVIEW_REQUIRED" }),
    );

    expectError(result, "INVALID_STATUS_TRANSITION");
  });

  it("rejects PUBLISHED when a Human Owner decision remains pending", () => {
    const result = transitionApprovalGate(
      approvedState({ humanOwnerDecisionRequired: true }),
      publishRequest(),
    );

    expectError(result, "HUMAN_OWNER_DECISION_REQUIRED");
  });

  it("rejects PUBLISHED when the terms check is UNKNOWN", () => {
    const result = transitionApprovalGate(
      approvedState({ reviewChecks: { ...ALL_PASS, terms: "UNKNOWN" } }),
      publishRequest(),
    );

    expectError(result, "REVIEW_CHECK_INCOMPLETE");
  });

  it("rejects stale record versions", () => {
    const result = transitionApprovalGate(
      state({ recordVersion: 4 }),
      request({ expectedRecordVersion: 3 }),
    );

    expectError(result, "STALE_RECORD_VERSION");
  });

  it("rejects a duplicate transition request identifier", () => {
    const result = transitionApprovalGate(
      state({ processedTransitionRequestIds: ["transition-001"] }),
      request(),
    );

    expectError(result, "DUPLICATE_TRANSITION_REQUEST_ID");
  });

  it("rejects invalid runtime status values", () => {
    // The assertion deliberately simulates untrusted runtime input.
    const result = transitionApprovalGate(
      state(),
      request({ toStatus: "INVALID" as unknown as "APPROVED" }),
    );

    expectError(result, "INVALID_INPUT");
  });

  it("rejects a benign unknown input key", () => {
    const unsafeRequest = {
      ...request(),
      articleBody: "placeholder-body",
    } as unknown as ApprovalGateTransitionRequest;

    const result = transitionApprovalGate(state(), unsafeRequest);

    expectError(result, "INVALID_INPUT");
    expect(JSON.stringify(result)).not.toContain("placeholder-body");
  });

  it("rejects the removed auditMetadata input key", () => {
    const unsafeRequest = {
      ...request(),
      auditMetadata: { source: "test" },
    } as unknown as ApprovalGateTransitionRequest;

    const result = transitionApprovalGate(state(), unsafeRequest);

    expectError(result, "INVALID_INPUT");
  });

  it.each([
    ["contentReference", "https://example.invalid/content"],
    ["contentReference", "content-\n001"],
    ["contentReference", "content-\u0001001"],
    ["transitionRequestId", "https://example.invalid/request"],
    ["transitionRequestId", "request-\n001"],
    ["transitionRequestId", "request-\u0001001"],
  ] as const)(
    "rejects unsafe %s values",
    (field: "contentReference" | "transitionRequestId", value: string) => {
      const result = transitionApprovalGate(
        state(),
        request({ [field]: value }),
      );

      expectError(result, "INVALID_REFERENCE");
    },
  );

  it("rejects reference values longer than the maximum length", () => {
    const result = transitionApprovalGate(
      state(),
      request({ contentReference: `content-${"a".repeat(121)}` }),
    );

    expectError(result, "INVALID_REFERENCE");
  });

  it("emits only fixed audit-event properties and allowlisted references", () => {
    const result = transitionApprovalGate(
      state({ humanOwnerDecisionRequired: true }),
      request({
        actorRole: "HUMAN_OWNER",
        contentReference: "content-001",
        archiveReference: "archive-001",
        authorizationContext: trustedHumanOwnerContext(),
      }),
    );

    expect(result).toMatchObject({ ok: true });
    if (result.ok) {
      expect(Object.keys(result.auditEvent).sort()).toEqual([
        "actorRole",
        "archiveReference",
        "authorizationSubjectReference",
        "contentReference",
        "eventType",
        "evidenceReference",
        "fromStatus",
        "recordVersion",
        "reviewReference",
        "toStatus",
        "transitionRequestId",
      ]);
    }
  });

  it.each([
    "api-key",
    "api_key",
    "API_KEY",
    "ApiKey",
    "recovery-code",
    "recovery_code",
    "totp-secret",
    "totp_secret",
  ])("detects normalized forbidden key %s", (key: string) => {
    expect(findForbiddenKeys({ [key]: "placeholder" })).toEqual([key]);
  });

  it("does not classify authorizationContext as a forbidden key", () => {
    expect(
      findForbiddenKeys({ authorizationContext: trustedHumanOwnerContext() }),
    ).toEqual([]);
  });

  it("rejects Human Owner role input without authorization context", () => {
    const result = transitionApprovalGate(
      state({ humanOwnerDecisionRequired: true }),
      request({ actorRole: "HUMAN_OWNER" }),
    );

    expectError(result, "UNTRUSTED_AUTHORIZATION_CONTEXT");
  });

  it("rejects an explicitly absent authorization context", () => {
    const result = transitionApprovalGate(
      state({ humanOwnerDecisionRequired: true }),
      request({
        actorRole: "HUMAN_OWNER",
        authorizationContext: undefined,
      }),
    );

    expectError(result, "UNTRUSTED_AUTHORIZATION_CONTEXT");
  });

  it.each(["UNVERIFIED", "UNKNOWN"] as const)(
    "rejects a %s authorization context",
    (trustStatus: "UNVERIFIED" | "UNKNOWN") => {
      const result = transitionApprovalGate(
        state({ humanOwnerDecisionRequired: true }),
        request({
          actorRole: "HUMAN_OWNER",
          authorizationContext: trustedHumanOwnerContext({ trustStatus }),
        }),
      );

      expectError(result, "UNTRUSTED_AUTHORIZATION_CONTEXT");
    },
  );

  it("rejects an authorization context without the required permission", () => {
    const result = transitionApprovalGate(
      state({ humanOwnerDecisionRequired: true }),
      request({
        actorRole: "HUMAN_OWNER",
        authorizationContext: trustedHumanOwnerContext({ permissions: [] }),
      }),
    );

    expectError(result, "MISSING_HUMAN_OWNER_PERMISSION");
  });

  it("rejects an authorization context without a subject reference", () => {
    const result = transitionApprovalGate(
      state({ humanOwnerDecisionRequired: true }),
      request({
        actorRole: "HUMAN_OWNER",
        authorizationContext: trustedHumanOwnerContext({
          subjectReference: "",
        }),
      }),
    );

    expectError(result, "MISSING_AUTHORIZATION_SUBJECT_REFERENCE");
  });

  it("rejects authorization context supplied by a non-Human Owner actor", () => {
    const result = transitionApprovalGate(
      state(),
      request({ authorizationContext: trustedHumanOwnerContext() }),
    );

    expectError(result, "INVALID_INPUT");
  });

  it("rejects an invalid context when Human Owner approval is not required", () => {
    const result = transitionApprovalGate(
      state(),
      request({
        actorRole: "HUMAN_OWNER",
        authorizationContext: trustedHumanOwnerContext({
          trustStatus: "UNVERIFIED",
        }),
      }),
    );

    expectError(result, "UNTRUSTED_AUTHORIZATION_CONTEXT");
  });

  it("does not emit a verified authorization subject when it is not used", () => {
    const result = transitionApprovalGate(
      state(),
      request({
        actorRole: "HUMAN_OWNER",
        authorizationContext: trustedHumanOwnerContext(),
      }),
    );

    expect(result).toMatchObject({ ok: true });
    if (result.ok) {
      expect(result.auditEvent).not.toHaveProperty(
        "authorizationSubjectReference",
      );
    }
  });

  it("rejects WARNING even with verified Human Owner authorization", () => {
    const result = transitionApprovalGate(
      state({ humanOwnerDecisionRequired: true }),
      request({
        actorRole: "HUMAN_OWNER",
        authorizationContext: trustedHumanOwnerContext(),
        reviewChecks: { ...ALL_PASS, terms: "WARNING" },
      }),
    );

    expectError(result, "REVIEW_CHECK_INCOMPLETE");
  });

  it("rejects APPROVED_WITH_MANUAL_REVIEW even when all checks pass", () => {
    const result = transitionApprovalGate(
      state(),
      request({ decisionCategory: "APPROVED_WITH_MANUAL_REVIEW" }),
    );

    expectError(result, "INVALID_INPUT");
  });

  it("rejects PUBLISHED when a review check is WARNING", () => {
    const result = transitionApprovalGate(
      approvedState({ reviewChecks: { ...ALL_PASS, terms: "WARNING" } }),
      publishRequest(),
    );

    expectError(result, "REVIEW_CHECK_INCOMPLETE");
  });

  it("allows PUBLISHED when every check is NOT_APPLICABLE", () => {
    const notApplicableChecks: ApprovalReviewChecks = {
      terms: "NOT_APPLICABLE",
      disclosure: "NOT_APPLICABLE",
      prohibitedExpression: "NOT_APPLICABLE",
    };
    const result = transitionApprovalGate(
      approvedState({ reviewChecks: notApplicableChecks }),
      publishRequest(),
    );

    expect(result).toMatchObject({
      ok: true,
      nextState: { status: "PUBLISHED" },
    });
  });
});
