import {
  resolveTrustedHumanOwnerActor,
  type ApprovalGateActorContextProvider,
  type TrustedHumanOwnerTransitionActor,
} from "../application/approval-gate-actor-context-provider";
import { InMemoryApprovalGateStore } from "../application/testing/in-memory-approval-gate-store";
import { TransitionApprovalGateUseCase } from "../application/transition-approval-gate-use-case";
import type {
  ApprovalGateAggregate,
  TransitionApprovalGateRequest,
} from "../application/types";
import { findForbiddenKeys, isSafeApprovalReference } from "../sanitize";
import type { ApprovalGateState } from "../types";

const CREATE_KEYS = new Set(["approvalGateId"]);
const MAX_GENERATED_ID = 999_999;
const DEFAULT_ACTOR_CONTEXT = {
  actorRole: "HUMAN_OWNER",
  authorizationContext: {
    trustStatus: "VERIFIED_UPSTREAM",
    subjectReference: "AUTH_SUBJECT-in-memory-owner",
    permissions: ["APPROVAL_GATE_HUMAN_OWNER_DECIDE"],
  },
} as const;

export interface ApprovalGateHttpResponse {
  status: number;
  body: Record<string, unknown>;
}

export interface InMemoryApprovalGateApi {
  create(input: unknown): Promise<ApprovalGateHttpResponse>;
  list(): Promise<ApprovalGateHttpResponse>;
  get(approvalGateId: string): Promise<ApprovalGateHttpResponse>;
  transition(
    approvalGateId: string,
    input: unknown,
  ): Promise<ApprovalGateHttpResponse>;
}

export interface InMemoryApprovalGateApiOptions {
  actorContextProvider?: ApprovalGateActorContextProvider;
  store?: InMemoryApprovalGateStore;
}

class StaticActorContextProvider implements ApprovalGateActorContextProvider {
  constructor(private readonly value: unknown) {}

  async resolveActorContext(): Promise<unknown> {
    return this.value;
  }
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function initialState(): ApprovalGateState {
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
  };
}

function publicState(state: ApprovalGateState): Record<string, unknown> {
  return {
    status: state.status,
    recordVersion: state.recordVersion,
    reviewChecks: {
      terms: state.reviewChecks.terms,
      disclosure: state.reviewChecks.disclosure,
      prohibitedExpression: state.reviewChecks.prohibitedExpression,
    },
    humanOwnerDecisionRequired: state.humanOwnerDecisionRequired,
  };
}

function publicAggregate(
  aggregate: ApprovalGateAggregate,
): Record<string, unknown> {
  return {
    approvalGateId: aggregate.approvalGateId,
    state: publicState(aggregate.state),
  };
}

function response(status: number, body: Record<string, unknown>) {
  return { status, body } satisfies ApprovalGateHttpResponse;
}

function invalidInput(): ApprovalGateHttpResponse {
  return response(400, { error: "INVALID_INPUT" });
}

function notFound(): ApprovalGateHttpResponse {
  return response(404, { error: "NOT_FOUND" });
}

function createInputIsValid(
  input: unknown,
): input is { approvalGateId?: string } {
  try {
    if (!isPlainRecord(input) || findForbiddenKeys(input).length > 0) {
      return false;
    }

    return (
      Reflect.ownKeys(input).every(
        (key) => typeof key === "string" && CREATE_KEYS.has(key),
      ) &&
      (input.approvalGateId === undefined ||
        isSafeApprovalReference(input.approvalGateId))
    );
  } catch {
    return false;
  }
}

function nextGeneratedId(nextId: number): string {
  return `AG-${String(nextId).padStart(6, "0")}`;
}

export function createInMemoryApprovalGateApi(
  options: InMemoryApprovalGateApiOptions = {},
): InMemoryApprovalGateApi {
  const store = options.store ?? new InMemoryApprovalGateStore();
  const actorContextProvider =
    options.actorContextProvider ??
    new StaticActorContextProvider(DEFAULT_ACTOR_CONTEXT);
  const transitionUseCase = new TransitionApprovalGateUseCase(store);
  let generatedId = 1;

  async function requireActor(): Promise<
    | { ok: true; actor: TrustedHumanOwnerTransitionActor }
    | { ok: false; response: ApprovalGateHttpResponse }
  > {
    const resolved = await resolveTrustedHumanOwnerActor(actorContextProvider);
    if (resolved.ok) {
      return { ok: true, actor: resolved.actor };
    }

    return {
      ok: false,
      response: response(resolved.kind === "UNAUTHENTICATED" ? 401 : 403, {
        error: resolved.kind,
      }),
    };
  }

  return {
    async create(input) {
      const actor = await requireActor();
      if (!actor.ok) {
        return actor.response;
      }
      if (!createInputIsValid(input)) {
        return invalidInput();
      }

      if (input.approvalGateId !== undefined) {
        const created = await store.create({
          approvalGateId: input.approvalGateId,
          state: initialState(),
        });

        return created
          ? response(201, { item: publicAggregate(created) })
          : response(409, { error: "DUPLICATE_APPROVAL_GATE_ID" });
      }

      while (generatedId <= MAX_GENERATED_ID) {
        const created = await store.create({
          approvalGateId: nextGeneratedId(generatedId++),
          state: initialState(),
        });

        if (created) {
          return response(201, { item: publicAggregate(created) });
        }
      }

      return response(500, { error: "IN_MEMORY_ID_SPACE_EXHAUSTED" });
    },

    async list() {
      const actor = await requireActor();
      if (!actor.ok) {
        return actor.response;
      }

      const items = await store.list();
      return response(200, { items: items.map(publicAggregate) });
    },

    async get(approvalGateId) {
      const actor = await requireActor();
      if (!actor.ok) {
        return actor.response;
      }
      if (!isSafeApprovalReference(approvalGateId)) {
        return notFound();
      }

      const aggregate = await store.read(approvalGateId);
      return aggregate
        ? response(200, { item: publicAggregate(aggregate) })
        : notFound();
    },

    async transition(approvalGateId, input) {
      const actor = await requireActor();
      if (!actor.ok) {
        return actor.response;
      }
      if (!isSafeApprovalReference(approvalGateId)) {
        return notFound();
      }
      if (findForbiddenKeys(input).length > 0 || !isPlainRecord(input)) {
        return invalidInput();
      }

      const result = await transitionUseCase.execute({
        approvalGateId,
        request: input as TransitionApprovalGateRequest,
        actor: actor.actor,
      });

      if (result.ok) {
        return response(200, { item: publicAggregate(result.aggregate) });
      }

      switch (result.kind) {
        case "INVALID_INPUT":
          return invalidInput();
        case "NOT_FOUND":
          return notFound();
        case "CORE_REJECTED":
          return response(422, { error: result.error.code });
        case "VERSION_CONFLICT":
        case "DUPLICATE_REQUEST":
          return response(409, { error: result.kind });
        case "PERSISTENCE_FAILURE":
          return response(500, { error: "IN_MEMORY_OPERATION_FAILED" });
      }
    },
  };
}

let defaultApi: InMemoryApprovalGateApi | undefined;

export function getDefaultInMemoryApprovalGateApi(): InMemoryApprovalGateApi {
  defaultApi ??= createInMemoryApprovalGateApi();
  return defaultApi;
}
