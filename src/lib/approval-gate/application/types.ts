import type {
  ApprovalActorRole,
  ApprovalGateAuditEvent,
  ApprovalGateError,
  ApprovalGateState,
  ApprovalGateTransitionRequest,
  TrustedAuthorizationContext,
} from "../types";

export interface TrustedTransitionActor {
  actorRole: ApprovalActorRole;
  authorizationContext?: TrustedAuthorizationContext;
}

export type TransitionApprovalGateRequest = Omit<
  ApprovalGateTransitionRequest,
  "actorRole" | "authorizationContext"
>;

export interface TransitionApprovalGateCommand {
  approvalGateId: string;
  request: TransitionApprovalGateRequest;
  actor: TrustedTransitionActor;
}

export interface ApprovalGateAggregate {
  approvalGateId: string;
  state: ApprovalGateState;
}

export type TransitionApprovalGateResult =
  | {
      ok: true;
      aggregate: ApprovalGateAggregate;
      auditEvent: ApprovalGateAuditEvent;
    }
  | {
      ok: false;
      kind: "INVALID_INPUT";
    }
  | {
      ok: false;
      kind: "NOT_FOUND";
    }
  | {
      ok: false;
      kind: "CORE_REJECTED";
      error: ApprovalGateError;
    }
  | {
      ok: false;
      kind: "VERSION_CONFLICT" | "DUPLICATE_REQUEST" | "PERSISTENCE_FAILURE";
    };
