import {
  APPROVAL_GATE_PERMISSIONS,
  type ApprovalGatePermission,
  type TrustedAuthorizationContext,
} from "../types";
import { findForbiddenKeys, isSafeApprovalReference } from "../sanitize";
import type { TrustedTransitionActor } from "./types";

const ACTOR_KEYS = new Set(["actorRole", "authorizationContext"]);
const AUTHORIZATION_CONTEXT_KEYS = new Set([
  "trustStatus",
  "subjectReference",
  "permissions",
]);

const AUTH_SUBJECT_PREFIX = "AUTH_SUBJECT-";

export interface ApprovalGateActorContextProvider {
  resolveActorContext(): Promise<unknown>;
}

export const APPROVAL_GATE_ACTOR_CONTEXT_FAILURE_KINDS = [
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "UPSTREAM_CONTEXT_INVALID",
] as const;

export type ApprovalGateActorContextFailureKind =
  (typeof APPROVAL_GATE_ACTOR_CONTEXT_FAILURE_KINDS)[number];

export type TrustedHumanOwnerTransitionActor = TrustedTransitionActor & {
  actorRole: "HUMAN_OWNER";
  authorizationContext: TrustedAuthorizationContext;
};

export type ApprovalGateActorContextResolution =
  | { ok: true; actor: TrustedHumanOwnerTransitionActor }
  | { ok: false; kind: ApprovalGateActorContextFailureKind };

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasOnlyAllowedOwnStringKeys(
  value: Record<string, unknown>,
  allowedKeys: ReadonlySet<string>,
): boolean {
  const ownKeys = Reflect.ownKeys(value);

  return ownKeys.every(
    (key) =>
      typeof key === "string" &&
      Object.prototype.hasOwnProperty.call(value, key) &&
      allowedKeys.has(key),
  );
}

function hasOnlyDenseCanonicalArrayOwnKeys(value: readonly unknown[]): boolean {
  const ownKeys = Reflect.ownKeys(value);

  if (ownKeys.some((key) => typeof key !== "string")) {
    return false;
  }

  const stringKeys = ownKeys as string[];
  if (
    stringKeys.length !== value.length + 1 ||
    !stringKeys.includes("length")
  ) {
    return false;
  }

  for (let index = 0; index < value.length; index += 1) {
    const key = String(index);
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      return false;
    }
  }

  return stringKeys.every((key) => {
    if (key === "length") {
      return true;
    }

    if (!/^(0|[1-9][0-9]*)$/.test(key)) {
      return false;
    }

    const index = Number(key);
    return (
      Number.isSafeInteger(index) &&
      index >= 0 &&
      index < value.length &&
      Object.prototype.hasOwnProperty.call(value, key)
    );
  });
}

function isApprovalGatePermission(
  value: unknown,
): value is ApprovalGatePermission {
  return (
    typeof value === "string" &&
    APPROVAL_GATE_PERMISSIONS.includes(value as ApprovalGatePermission)
  );
}

function invalid(): ApprovalGateActorContextResolution {
  return { ok: false, kind: "UPSTREAM_CONTEXT_INVALID" };
}

export async function resolveTrustedHumanOwnerActor(
  provider: ApprovalGateActorContextProvider,
): Promise<ApprovalGateActorContextResolution> {
  let rawActor: unknown;

  try {
    rawActor = await provider.resolveActorContext();
  } catch {
    return invalid();
  }

  if (rawActor === null || rawActor === undefined) {
    return { ok: false, kind: "UNAUTHENTICATED" };
  }

  try {
    if (findForbiddenKeys(rawActor).length > 0) {
      return invalid();
    }

    if (
      !isPlainRecord(rawActor) ||
      !hasOnlyAllowedOwnStringKeys(rawActor, ACTOR_KEYS)
    ) {
      return invalid();
    }

    if (
      rawActor.actorRole !== "HUMAN_OWNER" &&
      rawActor.actorRole !== "REVIEWER" &&
      rawActor.actorRole !== "SYSTEM"
    ) {
      return invalid();
    }

    const rawAuthorizationContext = rawActor.authorizationContext;
    if (
      !isPlainRecord(rawAuthorizationContext) ||
      !hasOnlyAllowedOwnStringKeys(
        rawAuthorizationContext,
        AUTHORIZATION_CONTEXT_KEYS,
      )
    ) {
      return invalid();
    }

    if (rawAuthorizationContext.trustStatus !== "VERIFIED_UPSTREAM") {
      return invalid();
    }

    if (
      typeof rawAuthorizationContext.subjectReference !== "string" ||
      !rawAuthorizationContext.subjectReference.startsWith(
        AUTH_SUBJECT_PREFIX,
      ) ||
      !isSafeApprovalReference(rawAuthorizationContext.subjectReference)
    ) {
      return invalid();
    }

    const rawPermissions = rawAuthorizationContext.permissions;
    if (
      !Array.isArray(rawPermissions) ||
      !hasOnlyDenseCanonicalArrayOwnKeys(rawPermissions) ||
      !rawPermissions.every(isApprovalGatePermission)
    ) {
      return invalid();
    }

    if (rawActor.actorRole !== "HUMAN_OWNER") {
      return { ok: false, kind: "FORBIDDEN" };
    }

    if (!rawPermissions.includes("APPROVAL_GATE_HUMAN_OWNER_DECIDE")) {
      return { ok: false, kind: "FORBIDDEN" };
    }

    return {
      ok: true,
      actor: {
        actorRole: "HUMAN_OWNER",
        authorizationContext: {
          trustStatus: "VERIFIED_UPSTREAM",
          subjectReference: rawAuthorizationContext.subjectReference,
          permissions: [...rawPermissions],
        },
      },
    };
  } catch {
    return invalid();
  }
}
