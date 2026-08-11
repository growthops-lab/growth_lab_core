import { describe, expect, it } from "vitest";

import type { ApprovalGateActorContextProvider } from "./approval-gate-actor-context-provider";
import { resolveTrustedHumanOwnerActor } from "./approval-gate-actor-context-provider";

function providerFor(value: unknown): ApprovalGateActorContextProvider {
  return {
    async resolveActorContext() {
      return value;
    },
  };
}

function validActor() {
  return {
    actorRole: "HUMAN_OWNER",
    authorizationContext: {
      trustStatus: "VERIFIED_UPSTREAM",
      subjectReference: "AUTH_SUBJECT-owner_001",
      permissions: ["APPROVAL_GATE_HUMAN_OWNER_DECIDE"],
    },
  } as const;
}

describe("resolveTrustedHumanOwnerActor", () => {
  it("resolves and clones a verified Human Owner actor", async () => {
    const input = validActor();
    const result = await resolveTrustedHumanOwnerActor(providerFor(input));

    expect(result).toEqual({
      ok: true,
      actor: {
        actorRole: "HUMAN_OWNER",
        authorizationContext: {
          trustStatus: "VERIFIED_UPSTREAM",
          subjectReference: "AUTH_SUBJECT-owner_001",
          permissions: ["APPROVAL_GATE_HUMAN_OWNER_DECIDE"],
        },
      },
    });

    if (result.ok) {
      expect(result.actor).not.toBe(input);
      expect(result.actor.authorizationContext).not.toBe(
        input.authorizationContext,
      );
      expect(result.actor.authorizationContext.permissions).not.toBe(
        input.authorizationContext.permissions,
      );
    }
  });

  it.each([undefined, null])(
    "returns UNAUTHENTICATED when provider output is %s",
    async (value) => {
      await expect(
        resolveTrustedHumanOwnerActor(providerFor(value)),
      ).resolves.toEqual({
        ok: false,
        kind: "UNAUTHENTICATED",
      });
    },
  );

  it("closes provider exceptions without reflecting error details", async () => {
    const provider: ApprovalGateActorContextProvider = {
      async resolveActorContext() {
        throw new Error("credential value must never escape");
      },
    };

    const result = await resolveTrustedHumanOwnerActor(provider);

    expect(result).toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
    expect(JSON.stringify(result)).not.toContain("credential value");
  });

  it.each(["REVIEWER", "SYSTEM"])(
    "returns FORBIDDEN for valid non-Human-Owner role %s",
    async (actorRole) => {
      const input = {
        ...validActor(),
        actorRole,
      };

      await expect(
        resolveTrustedHumanOwnerActor(providerFor(input)),
      ).resolves.toEqual({
        ok: false,
        kind: "FORBIDDEN",
      });
    },
  );

  it("rejects malformed non-Human-Owner context before role authorization", async () => {
    const input = {
      actorRole: "REVIEWER",
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it("fails closed when hostile object inspection throws", async () => {
    const hostile = new Proxy(
      {},
      {
        ownKeys() {
          throw new Error("must remain private");
        },
      },
    );

    const result = await resolveTrustedHumanOwnerActor(providerFor(hostile));

    expect(result).toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
    expect(JSON.stringify(result)).not.toContain("must remain private");
  });

  it("returns FORBIDDEN when the Human Owner permission is missing", async () => {
    const input = {
      ...validActor(),
      authorizationContext: {
        ...validActor().authorizationContext,
        permissions: [],
      },
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "FORBIDDEN",
    });
  });

  it.each(["UNVERIFIED", "UNKNOWN"])(
    "rejects trust status %s",
    async (trustStatus) => {
      const input = {
        ...validActor(),
        authorizationContext: {
          ...validActor().authorizationContext,
          trustStatus,
        },
      };

      await expect(
        resolveTrustedHumanOwnerActor(providerFor(input)),
      ).resolves.toEqual({
        ok: false,
        kind: "UPSTREAM_CONTEXT_INVALID",
      });
    },
  );

  it("rejects an unsafe subject reference", async () => {
    const input = {
      ...validActor(),
      authorizationContext: {
        ...validActor().authorizationContext,
        subjectReference: "AUTH SUBJECT owner@example.com",
      },
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it("rejects a safe reference that lacks the AUTH_SUBJECT prefix", async () => {
    const input = {
      ...validActor(),
      authorizationContext: {
        ...validActor().authorizationContext,
        subjectReference: "USER-owner_001",
      },
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it("rejects an unknown outer key", async () => {
    const input = {
      ...validActor(),
      requestedBy: "AUTH_SUBJECT-owner_001",
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it("rejects a non-enumerable unknown outer own property", async () => {
    const input = { ...validActor() };

    Object.defineProperty(input, "requestedBy", {
      value: "AUTH_SUBJECT-owner_001",
      enumerable: false,
      configurable: true,
    });

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it("rejects a symbol outer own property", async () => {
    const input = { ...validActor() };

    Object.defineProperty(input, Symbol("actor-meta"), {
      value: "unexpected",
      enumerable: false,
      configurable: true,
    });

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it("rejects an unknown authorization-context key", async () => {
    const input = {
      ...validActor(),
      authorizationContext: {
        ...validActor().authorizationContext,
        issuer: "example",
      },
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it("rejects a non-enumerable secret-like authorization-context own property", async () => {
    const authorizationContext = {
      ...validActor().authorizationContext,
    };

    Object.defineProperty(authorizationContext, "accessToken", {
      value: "must-not-pass",
      enumerable: false,
      configurable: true,
    });

    const input = {
      ...validActor(),
      authorizationContext,
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it.each(["token", "cookie", "authorizationHeader"])(
    "rejects nested secret-like key %s",
    async (key) => {
      const input = {
        ...validActor(),
        authorizationContext: {
          ...validActor().authorizationContext,
          [key]: "must-not-pass",
        },
      };

      await expect(
        resolveTrustedHumanOwnerActor(providerFor(input)),
      ).resolves.toEqual({
        ok: false,
        kind: "UPSTREAM_CONTEXT_INVALID",
      });
    },
  );

  it("rejects an unknown permission string", async () => {
    const input = {
      ...validActor(),
      authorizationContext: {
        ...validActor().authorizationContext,
        permissions: [
          "APPROVAL_GATE_HUMAN_OWNER_DECIDE",
          "APPROVAL_GATE_UNKNOWN",
        ],
      },
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it("rejects a non-string permission", async () => {
    const input = {
      ...validActor(),
      authorizationContext: {
        ...validActor().authorizationContext,
        permissions: ["APPROVAL_GATE_HUMAN_OWNER_DECIDE", 1],
      },
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it("rejects a non-enumerable secret-like permissions-array own property", async () => {
    const permissions = ["APPROVAL_GATE_HUMAN_OWNER_DECIDE"];

    Object.defineProperty(permissions, "accessToken", {
      value: "must-not-pass",
      enumerable: false,
      configurable: true,
    });

    const input = {
      ...validActor(),
      authorizationContext: {
        ...validActor().authorizationContext,
        permissions,
      },
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it("rejects a symbol permissions-array own property", async () => {
    const permissions = ["APPROVAL_GATE_HUMAN_OWNER_DECIDE"];

    Object.defineProperty(permissions, Symbol("permission-meta"), {
      value: "unexpected",
      enumerable: false,
      configurable: true,
    });

    const input = {
      ...validActor(),
      authorizationContext: {
        ...validActor().authorizationContext,
        permissions,
      },
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it("rejects a sparse permissions array", async () => {
    const permissions = new Array(2);
    permissions[1] = "APPROVAL_GATE_HUMAN_OWNER_DECIDE";

    const input = {
      ...validActor(),
      authorizationContext: {
        ...validActor().authorizationContext,
        permissions,
      },
    };

    await expect(
      resolveTrustedHumanOwnerActor(providerFor(input)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });

  it.each([
    "HUMAN_OWNER",
    1,
    [],
    { actorRole: "HUMAN_OWNER" },
    {
      approvalGateId: "AG-001",
      request: {},
      actor: validActor(),
    },
  ])("rejects malformed or client-shaped output %#", async (value) => {
    await expect(
      resolveTrustedHumanOwnerActor(providerFor(value)),
    ).resolves.toEqual({
      ok: false,
      kind: "UPSTREAM_CONTEXT_INVALID",
    });
  });
});
