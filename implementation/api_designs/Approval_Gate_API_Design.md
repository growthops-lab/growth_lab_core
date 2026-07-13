# Approval Gate API Design

Document Name: Growth Lab Core Approval Gate API Design
Related ADR: ADR-0003 / ADR-0005 / ADR-0006 / ADR-0008 / ADR-0009 / ADR-0010
Related Data Model: implementation/data_models/Approval_Gate_Data_Model.md
Related Template: templates/review_logs/SNS_ASP_Affiliate_Review_Log_Template.md
Related Checklist: implementation/checklists/Platform_Specific_Terms_Confirmation_Checklist.md
Related Policy: implementation/policies/Review_Log_Storage_and_Retention_Policy.md
Related Specification: implementation/specifications/SNS_ASP_Affiliate_Terms_Review_Specification.md
Status: Draft
Primary Format: Markdown
Target File: implementation/api_designs/Approval_Gate_API_Design.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

- This API design defines the MVP API boundary for operating, viewing, and updating Approval Gate state.
- This API design is based on Approval Gate Data Model, Review Log Template, Platform-specific Terms Confirmation Checklist, and Review Log Storage and Retention Policy.
- This API design defines relationships with Human Review, Evidence Reference, and Audit Log.
- This API design does not implement APIs, databases, authentication, OAuth, or UI.

日本語での目的:

- 本API設計は、Approval Gate状態の操作、参照、更新に関するMVP API境界を定義する。
- 本API設計は、Approval Gate Data Model、Review Log Template、Platform-specific Terms Confirmation Checklist、Review Log Storage and Retention Policyに基づく。
- 本API設計は、Human Review、Evidence Reference、Audit Logとの関係を定義する。
- 本API設計は、API、DB、認証、OAuth、UIを実装しない。

## 2. Scope

In scope:

- Approval Gate API boundary
- Endpoint candidates
- Request and response fields
- Status transition API
- Review Log relationship API
- Evidence Reference relationship API
- Audit Log reference API
- Validation policy
- Access control policy
- Error response policy

Out of scope:

- API implementation
- Server code
- Routing implementation
- Database implementation
- SQL migration
- OAuth implementation
- Token issuing logic
- UI design
- Frontend implementation
- External SNS API integration
- Final interpretation of SNS terms
- Final interpretation of ASP terms
- Final interpretation of affiliate terms
- Legal judgment

## 3. Important Notes

- This API design does not implement API endpoints.
- This API design does not implement authentication, OAuth, database, SQL, or UI.
- This API design defines MVP API boundaries for Approval Gate operations.
- Approval Gate APIs must not accept or return secret values, tokens, API keys, passwords, recovery codes, or TOTP secrets.
- Detailed SNS, ASP, and affiliate terms review is delegated to later specifications or official-source confirmation.

日本語での重要事項:

- 本API設計は、APIエンドポイントを実装しない。
- 本API設計は、認証、OAuth、DB、SQL、UIを実装しない。
- 本API設計は、Approval Gate操作に関するMVP API境界を定義する。
- Approval Gate APIは、Secret、Token、API Key、Password、Recovery Code、TOTP Secretなどの実体値を受け取らず、返却しない。
- SNS、ASP、アフィリエイト規約の詳細確認は、後続仕様または公式情報確認へ委譲する。

## 4. Relationship to ADRs and Related Documents

- ADR-0003 defines the boundary for Secret, Token, and Access Control.
- ADR-0005 defines the boundary for Database, Registry, ID, and Relation design.
- ADR-0006 defines the execution boundary for SNS, WordPress, ASP, and affiliate flows.
- ADR-0008 defines the boundary for Workflow, Approval Gate, Scheduler, and Automation Engine.
- ADR-0009 defines the boundary between Integration Adapter and Core System Module.
- ADR-0010 defines the MVP Implementation Architecture Boundary.
- Approval Gate Data Model defines approval state, fields, and constraints.
- Review Log Template defines fields for review results and decision reasons.
- Platform-specific Terms Confirmation Checklist defines review checklist areas.
- Review Log Storage and Retention Policy defines storage, retention, access control, and audit policy.
- This API design translates these documents into API boundary candidates.

## 5. API Design Principles

- The API explicitly handles Approval Gate state.
- Status transitions are validation targets.
- Published is allowed only after Approved.
- Direct Draft to Published transition is forbidden.
- Published without Review Required path is forbidden.
- Blocked requires blocked_reason.
- Deferred requires deferred_items.
- Published requires published_at or publish_request_reference.
- Evidence is handled as evidence_reference, not as the evidence body.
- Secret, Token, API Key, and Password must not appear in request or response fields.
- Human Owner approval cannot be replaced by System or Reviewer.
- API-triggered events that affect approval state are Audit Log targets.
- MVP defines the API boundary only. Implementation details are delegated to later specifications.

## 6. API Resource Overview

| Resource | Purpose | Related Data Model | Notes |
|---|---|---|---|
| approval_gates | Approval Gate Recordの作成、参照、メタデータ更新を扱う。 | approval_gate | 状態変更は専用transition endpointで扱う。 |
| approval_gate_transitions | 状態遷移要求と結果を扱う。 | status_transition | DraftからPublishedへの直接遷移は禁止。 |
| review_logs | Review Logとの関連を扱う。 | review_log | Review Logは判断根拠として扱う。 |
| evidence_references | Evidence Referenceとの関連を扱う。 | evidence_reference | Evidence bodyやSecret実体は扱わない。 |
| audit_logs | 状態変更、理由変更、証跡参照変更の参照を扱う。 | audit_log | MVPでは読み取り候補として定義する。 |

## 7. Endpoint Candidate Summary

These endpoints are candidates and are not final implementation contracts. API versioning, base path, authentication method, and OAuth scope are deferred to later specifications. Real URLs are not defined in this document.

| Method | Endpoint Candidate | Purpose | MVP Required | Notes |
|---|---|---|---|---|
| GET | /approval-gates | Approval Gate一覧候補を参照する。 | Yes | Filtering and pagination are deferred. |
| POST | /approval-gates | Approval Gate Record候補を作成する。 | Yes | Secret values must be rejected. |
| GET | /approval-gates/{approval_gate_id} | 個別Approval Gateを参照する。 | Yes | Response excludes credential values. |
| PATCH | /approval-gates/{approval_gate_id} | メタデータを更新する。 | Yes | approval_gate_statusを直接変更しない。 |
| POST | /approval-gates/{approval_gate_id}/transition | 状態遷移を要求する。 | Yes | Status transition validation target. |
| GET | /approval-gates/{approval_gate_id}/review-logs | 関連Review Logを参照する。 | Yes | Review Log body format is deferred. |
| POST | /approval-gates/{approval_gate_id}/review-logs | 関連Review Log候補を作成する。 | Yes | Secret values must be rejected. |
| GET | /approval-gates/{approval_gate_id}/evidence-references | Evidence Referenceを参照する。 | Yes | Evidence body is out of scope. |
| POST | /approval-gates/{approval_gate_id}/evidence-references | Evidence Referenceを関連付ける。 | Yes | Evidence is reference-only. |
| GET | /approval-gates/{approval_gate_id}/audit-logs | Audit Logを参照する。 | Yes | Tamper resistance is deferred. |
| POST | /approval-gates/{approval_gate_id}/archive | Archive操作候補。 | Yes | May map to transition endpoint later. |
| POST | /approval-gates/{approval_gate_id}/invalidate | Invalidate操作候補。 | Yes | Requires reason and audit trail. |

Explicit endpoint candidate labels:

- POST /approval-gates/{approval_gate_id}/archive
- POST /approval-gates/{approval_gate_id}/invalidate

## 8. Approval Gate Endpoints

| Endpoint | Purpose | Request Summary | Response Summary | Validation | Audit Required |
|---|---|---|---|---|---|
| GET /approval-gates | Approval Gate一覧を参照する。 | filter candidates, role context | approval_gate summaries | Access control, safe response fields | No |
| POST /approval-gates | 新しいApproval Gate Record候補を作成する。 | content_id, platform, content_type, source_system | approval_gate_id, current_status, created_at | Required fields, no secret values | Yes |
| GET /approval-gates/{approval_gate_id} | 個別Approval Gateを参照する。 | approval_gate_id | current_status, decision_category, related references | Access control, not found handling | No |
| PATCH /approval-gates/{approval_gate_id} | メタデータを更新する。 | content_title, follow_up_owner, follow_up_due_date, archive_reference | updated metadata, record_version | Must not directly change approval_gate_status | Yes |

Rules:

- POST /approval-gates creates a new Approval Gate Record candidate.
- PATCH /approval-gates/{approval_gate_id} is limited to metadata updates.
- PATCH must not directly change approval_gate_status.
- Status transitions must use the dedicated transition endpoint.
- Secret, Token, API Key, Password, Recovery Code, and TOTP Secret must not be included in requests.

## 9. Status Transition Endpoint

Endpoint candidate:

- POST /approval-gates/{approval_gate_id}/transition

Request field candidates:

- approval_gate_id
- transition_request_id
- from_status
- to_status
- decision_category
- review_id
- evidence_reference
- decision_reason
- blocked_reason
- deferred_items
- human_owner_decision_required
- publish_request_reference
- requested_by
- requested_at
- record_version

Required validation:

- from_status must match the current approval_gate_status.
- record_version should be checked if optimistic concurrency is used later.
- transition_request_id may be used for idempotency in later implementation.
- Draft -> Published is forbidden.
- Published without Review Required path is forbidden.
- Published without prior Approved is forbidden.
- If to_status is Blocked, blocked_reason is required.
- If to_status is Deferred, deferred_items is required.
- If to_status is Published, published_at or publish_request_reference is required.
- If human_owner_decision_required is Yes, Published is forbidden until Human Owner approval is complete.
- If terms_check_status is Unknown, Approved for MVP publishing is forbidden.
- If automation_allowed_status is Unknown, connection to automated publishing is forbidden.

| From Status | To Status | API Allowed | Required Fields | Error on Violation |
|---|---|---|---|---|
| Draft | Review Required | Yes | approval_gate_id, content_id, requested_by | VALIDATION_FAILED |
| Draft | Published | No | Not allowed | INVALID_STATUS_TRANSITION |
| Review Required | Approved | Conditional | review_id, evidence_reference, decision_reason, requested_by, Human Owner approval when required | HUMAN_OWNER_DECISION_REQUIRED or MISSING_EVIDENCE_REFERENCE |
| Review Required | Blocked | Yes | blocked_reason, decision_category, requested_by | MISSING_BLOCKED_REASON |
| Review Required | Deferred | Yes | deferred_items, decision_category, requested_by | MISSING_DEFERRED_ITEMS |
| Approved | Published | Conditional | publish_request_reference or published_at, evidence_reference, record_version | VALIDATION_FAILED |
| Approved | Archived | Yes | archive_reference recommended, requested_by | VALIDATION_FAILED |
| Blocked | Review Required | Conditional | decision_reason, requested_by | VALIDATION_FAILED |
| Deferred | Review Required | Conditional | deferred_items resolution note, requested_by | VALIDATION_FAILED |
| Published | Archived | Yes | archive_reference, requested_by | VALIDATION_FAILED |
| Published | Review Required | Conditional | re_review_reason, requested_by | VALIDATION_FAILED |
| Archived | Review Required | Conditional | reuse_or_republish_reason, requested_by | VALIDATION_FAILED |

## 10. Review Log Relationship Endpoints

Endpoint candidates:

- GET /approval-gates/{approval_gate_id}/review-logs
- POST /approval-gates/{approval_gate_id}/review-logs

Rules:

- Review Log is treated as evidence for Approval Gate decisions.
- review_id maps to the Review Log Template review_id.
- Review Log creation must not include secret values.
- Review Log correction after creation should be captured in history or Audit Log.
- Review Log body storage format is not finalized by this API design.

## 11. Evidence Reference Endpoints

Endpoint candidates:

- GET /approval-gates/{approval_gate_id}/evidence-references
- POST /approval-gates/{approval_gate_id}/evidence-references

Rules:

- evidence_reference is a reference ID or safe storage identifier, not the evidence body.
- Secret, Token, API Key, Password, Recovery Code, and TOTP Secret values must not be accepted as Evidence.
- When an external URL reference is used, public visibility, access control, and credential leakage risk must be checked.
- Evidence body storage location is not decided by this API design.
- File upload API is not designed in this document.

## 12. Audit Log Endpoints

Endpoint candidate:

- GET /approval-gates/{approval_gate_id}/audit-logs

Rules:

- Audit Log is used for status transitions, reason changes, evidence reference changes, and Human Owner decisions.
- MVP defines this as a read endpoint candidate.
- Tamper resistance of Audit Log is delegated to later specifications.

| Event | API Trigger | Audit Required | Required Audit Fields |
|---|---|---|---|
| approval_gate_created | POST /approval-gates | Yes | approval_gate_id, requested_by, requested_at |
| approval_gate_updated | PATCH /approval-gates/{approval_gate_id} | Yes | approval_gate_id, changed_fields, requested_by |
| status_transition_requested | POST /approval-gates/{approval_gate_id}/transition | Yes | transition_request_id, from_status, to_status |
| status_transition_completed | transition validation success | Yes | approval_gate_id, from_status, to_status, record_version |
| status_transition_rejected | transition validation failure | Yes | approval_gate_id, error_code, safe_error_message |
| review_log_added | POST /approval-gates/{approval_gate_id}/review-logs | Yes | approval_gate_id, review_id, requested_by |
| evidence_reference_added | POST /approval-gates/{approval_gate_id}/evidence-references | Yes | approval_gate_id, evidence_reference, requested_by |
| approved_set | transition to Approved | Yes | approval_gate_id, review_id, evidence_reference |
| blocked_set | transition to Blocked | Yes | approval_gate_id, blocked_reason |
| deferred_set | transition to Deferred | Yes | approval_gate_id, deferred_items |
| published_set | transition to Published | Yes | approval_gate_id, publish_request_reference or published_at |
| archived_set | archive endpoint or transition | Yes | approval_gate_id, archive_reference |
| invalidated_set | invalidate endpoint | Yes | approval_gate_id, invalidation_reason |

## 13. Request Field Definitions

| Field | Required | Type | Used In | Description | Allowed Values | Notes |
|---|---|---|---|---|---|---|
| approval_gate_id | Conditional | reference_id | path, transition, response lookup | Approval Gate ID. | AG-YYYYMMDD-0001 style candidate | Required after creation. |
| transition_request_id | Conditional | reference_id | transition | Transition request ID candidate. | TR-YYYYMMDD-0001 style candidate | Later idempotency candidate. |
| review_id | Conditional | reference_id | review log, transition | Review Log ID. | REV-YYYYMMDD-0001 style candidate | Maps to Review Log Template. |
| content_id | Yes | reference_id | create | Content reference ID. | CONTENT-0001 style candidate | No real private URL. |
| source_system | Yes | string | create | Source system. | Growth Lab Core, WordPress, SNS, Manual, AI Draft, Other | No credentials. |
| platform | Yes | enum | create, filter | Platform. | X, WordPress, Instagram, TikTok, Other, Unknown | Terms are not finalized. |
| content_type | Yes | enum | create | Content type. | sns_post, wordpress_article, image_asset, affiliate_link, campaign_item, other | Logical value only. |
| content_title | No | string | create, patch | Management title. | Free text | Avoid personal data. |
| content_url_or_reference | Conditional | string | create, patch | URL or internal reference. | internal reference, draft ID, storage reference | Do not include credential-bearing URL. |
| approval_gate_status | No | enum | response | Current status. | Draft, Review Required, Approved, Blocked, Deferred, Published, Archived | Not changed by PATCH. |
| from_status | Yes | enum | transition | Current status asserted by caller. | Draft, Review Required, Approved, Blocked, Deferred, Published, Archived | Must match current state. |
| to_status | Yes | enum | transition | Requested status. | Draft, Review Required, Approved, Blocked, Deferred, Published, Archived | Validated by transition rules. |
| decision_category | Conditional | enum | transition | Decision category. | Approved for MVP publishing, Approved with manual review, Blocked due to missing evidence, Blocked due to terms uncertainty, Deferred to later specification, Requires Human Owner decision, Requires official-source confirmation | Must align with status. |
| review_status | Conditional | enum | review log | Review work status. | Not Started, In Review, Pass, Warning, Blocked, Deferred, Approved, Unknown | Not same as approval_gate_status. |
| reviewer | Conditional | string | review log | Reviewer role or ID. | role, team, internal reviewer ID | Avoid personal data. |
| reviewed_at | Conditional | datetime | review log, transition | Review timestamp. | ISO 8601 datetime | Required after review completion. |
| human_owner_decision_required | Yes | enum | transition | Whether Human Owner decision is required. | Yes, No, Unknown | Yes blocks Published until complete. |
| evidence_reference | Conditional | reference_id | transition, evidence reference | Evidence reference ID. | reference ID, storage identifier | No evidence body or credentials. |
| decision_reason | Conditional | text | transition | Decision reason. | Free text | Required for Approved, Blocked, Deferred. |
| blocked_reason | Conditional | text | transition | Blocked reason. | Free text | Required for Blocked. |
| deferred_items | Conditional | text | transition | Deferred items. | Free text | Required for Deferred. |
| follow_up_owner | Conditional | string | patch, transition | Follow-up owner role. | role, team, internal owner ID | Avoid personal data. |
| follow_up_due_date | Conditional | date | patch, transition | Follow-up date. | ISO 8601 date | Logical date only. |
| published_at | Conditional | datetime | transition | Published timestamp. | ISO 8601 datetime | Required for Published if no publish_request_reference. |
| publish_request_reference | Conditional | reference_id | transition | Publish request reference. | reference ID | Alternative to published_at for requested publish. |
| archive_reference | Conditional | reference_id | archive | Archive reference. | archive ID, storage reference | Recommended for Archived. |
| requested_by | Yes | string | mutation endpoints | Requesting role or internal ID. | Human Owner, Reviewer, Operator, Developer, Auditor, System | System cannot replace Human Owner. |
| requested_at | Yes | datetime | mutation endpoints | Request timestamp. | ISO 8601 datetime | Audit candidate. |
| record_version | Conditional | integer | patch, transition | Version for later optimistic concurrency. | positive integer | Later implementation detail. |
| sns_terms_check_status | Conditional | enum | transition validation | SNS terms check status. | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Unknown blocks Approved for MVP publishing. |
| asp_terms_check_status | Conditional | enum | transition validation | ASP terms check status. | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Unknown blocks Approved for MVP publishing. |
| affiliate_terms_check_status | Conditional | enum | transition validation | Affiliate terms check status. | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Unknown blocks Approved for MVP publishing. |
| advertising_label_status | Conditional | enum | transition validation | Advertising label status. | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Unknown requires review. |
| pr_label_status | Conditional | enum | transition validation | PR label status. | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Unknown requires review. |
| affiliate_label_status | Conditional | enum | transition validation | Affiliate label status. | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Unknown requires review. |
| prohibited_expression_check_status | Conditional | enum | transition validation | Prohibited expression status. | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | Blocked requires blocked_reason. |
| automation_allowed_status | Conditional | enum | transition validation | Automation allowed status. | Allowed, Manual Only, Blocked, Deferred, Unknown | Unknown cannot connect to automated publishing. |

## 14. Response Field Definitions

| Field | Type | Returned By | Description | Notes |
|---|---|---|---|---|
| approval_gate_id | reference_id | all Approval Gate endpoints | Approval Gate ID. | Safe identifier only. |
| current_status | enum | GET, transition | Current Approval Gate status. | No credentials. |
| previous_status | enum | transition, audit | Previous status. | Used for audit. |
| next_allowed_statuses | enum list | GET, transition | Candidate next statuses. | Based on validation rules. |
| decision_category | enum | GET, transition | Decision category. | Terms interpretation not finalized. |
| review_id | reference_id | review log endpoints, transition | Related Review Log ID. | Maps to Review Log Template. |
| evidence_reference | reference_id | evidence endpoints, transition | Evidence reference ID. | Evidence body not returned. |
| validation_result | object | transition | Safe validation result. | No stack trace. |
| error_code | string | error response | Safe error code. | No secret values. |
| error_message | string | error response | Safe message. | No internal stack traces. |
| audit_log_reference | reference_id | mutation endpoints | Related audit reference. | Audit body details deferred. |
| created_at | datetime | create, GET | Created timestamp. | ISO 8601. |
| updated_at | datetime | mutation, GET | Updated timestamp. | ISO 8601. |
| record_version | integer | mutation, GET | Later concurrency candidate. | Implementation deferred. |

Rules:

- Responses must not include secret values, token values, API key values, password values, recovery code values, or TOTP secret values.
- Error responses must not include secret values.
- Internal stack traces must not be returned.

## 15. Status Transition Validation Rules

- Draft cannot transition directly to Published.
- Published without Review Required path is forbidden.
- Published without Approved is forbidden.
- Blocked requires blocked_reason.
- Deferred requires deferred_items.
- Published requires published_at or publish_request_reference.
- Evidence-based decisions require evidence_reference.
- Human Owner decision required means Published is forbidden until Human Owner approval is complete.
- Unknown terms_check_status cannot be used with Approved for MVP publishing.
- Unknown automation_allowed_status cannot be connected to automated publishing.
- Current status must match from_status before transition.
- Transition attempts that are rejected should be audit candidates.

## 16. Access Control and Role Rules

| Role | Read | Create | Update Metadata | Transition | Approve | Archive | Invalidate | Notes |
|---|---|---|---|---|---|---|---|---|
| Human Owner | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Only Human Owner can perform final approval. |
| Reviewer | Limited | Yes, review logs | Limited | Propose Review Required, Blocked, Deferred | No | No | No | Can create Review Logs and propose non-final states. |
| Operator | Limited | Yes | Yes, operational metadata | Limited | No | Yes, with policy | Request only | Operational scope only. |
| Developer | Minimal | No production actual data | No production actual data | No | No | No | No | Production actual data access must be minimized. |
| Auditor | Yes, read-oriented | No | No | No | No | No | No | Audit purpose only. |
| System | Limited | Automated processing results | Automated metadata only | Limited, non-final | No | No | No | Cannot replace Human Owner approval. |

## 17. Error Response Policy

| Error Code Candidate | Meaning | Typical Trigger | Safe Response Message |
|---|---|---|---|
| APPROVAL_GATE_NOT_FOUND | Approval Gateが見つからない。 | Unknown approval_gate_id | Approval Gate was not found. |
| INVALID_STATUS_TRANSITION | 許可されない状態遷移。 | Draft -> Published | Requested status transition is not allowed. |
| STATUS_VERSION_CONFLICT | レコードバージョン不整合。 | stale record_version | Approval Gate record version conflict. |
| MISSING_BLOCKED_REASON | blocked_reason不足。 | to_status Blocked without reason | blocked_reason is required for Blocked status. |
| MISSING_DEFERRED_ITEMS | deferred_items不足。 | to_status Deferred without items | deferred_items is required for Deferred status. |
| MISSING_EVIDENCE_REFERENCE | evidence_reference不足。 | evidence-based approval without evidence | evidence_reference is required. |
| HUMAN_OWNER_DECISION_REQUIRED | Human Owner判断待ち。 | Published requested while owner decision required | Human Owner decision is required before publishing. |
| TERMS_CHECK_UNKNOWN | 規約確認がUnknown。 | Approved for MVP publishing with Unknown terms check | Terms check status is unknown. |
| AUTOMATION_ALLOWED_STATUS_UNKNOWN | 自動投稿可否がUnknown。 | automated publishing connection requested | automation_allowed_status is unknown. |
| FORBIDDEN_ROLE | 権限不足。 | Reviewer final approval attempt | Role is not allowed to perform this action. |
| SECRET_VALUE_REJECTED | Secret-like値を拒否。 | request contains credential-like value | Request contains a prohibited credential value. |
| VALIDATION_FAILED | その他の検証失敗。 | missing required field | Request validation failed. |

Rules:

- Error responses must not include secret values.
- Error responses must not expose internal stack traces.
- Error messages must be safe for user-facing or operator-facing logs.

## 18. Security and Secret Handling Policy

- Approval Gate API must not accept secret values.
- Approval Gate API must not accept token values.
- Approval Gate API must not accept API key values.
- Approval Gate API must not accept password values.
- Approval Gate API must not accept recovery code values.
- Approval Gate API must not accept TOTP secret values.
- Responses must not return credential values.
- Evidence Reference must not contain credential values.
- Authentication method, OAuth scope, and Token management follow later specifications and ADR-0002 / ADR-0003 boundaries.

## 19. MVP API Scope

MVP design target:

- Approval Gate Record creation
- Approval Gate Record reference
- Approval Gate metadata update
- Status transition
- Review Log relationship
- Evidence Reference relationship
- Audit Log reference candidate
- Basic role-based operation control
- Basic validation policy
- Safe error response policy

Not finalized in MVP API design:

- API base path
- API versioning method
- OAuth implementation
- Token issuing method
- Physical database design
- SQL migration
- Frontend screen
- External SNS API integration
- Automated publishing execution API
- Legal judgment

## 20. Items Deferred to Later Specifications

- API base path
- API versioning
- OpenAPI definition
- Authentication implementation
- OAuth scope design
- Token management implementation
- Physical DB design
- SQL migration
- API rate limit
- Request size limit
- File upload design
- Evidence body storage API
- Automated publishing execution API
- External SNS API integration
- Admin UI design
- API test specification
- Idempotency implementation details
- Optimistic concurrency implementation details

## 21. Items Not Decided by This API Design

- API implementation
- Server code
- Routing code
- Controller code
- Database implementation
- SQL
- Authentication implementation
- OAuth implementation
- Token issuing process
- UI design
- Frontend implementation
- External SNS API integration implementation
- Final platform-specific automated publishing decision
- Final SNS terms interpretation
- Final ASP terms interpretation
- Final affiliate terms interpretation
- Legal judgment

## 22. Validation Results

| Check | Result | Notes |
|---|---|---|
| Approval Gate Data Model was referenced | Pass | Related Data Modelに記載。 |
| Review Log Template was referenced | Pass | Related Templateに記載。 |
| Platform-specific Terms Confirmation Checklist was referenced | Pass | Related Checklistに記載。 |
| Review Log Storage and Retention Policy was referenced | Pass | Related Policyに記載。 |
| ADR-0003 was referenced | Pass | Related ADRに記載。 |
| ADR-0005 was referenced | Pass | Related ADRに記載。 |
| ADR-0006 was referenced | Pass | Related ADRに記載。 |
| ADR-0008 was referenced | Pass | Related ADRに記載。 |
| ADR-0009 was referenced | Pass | Related ADRに記載。 |
| ADR-0010 was referenced | Pass | Related ADRに記載。 |
| API Resource Overview was defined | Pass | Section 6に定義。 |
| Endpoint Candidate Summary was defined | Pass | Section 7に定義。 |
| Approval Gate Endpoints were defined | Pass | Section 8に定義。 |
| Status Transition Endpoint was defined | Pass | Section 9に定義。 |
| Review Log Relationship Endpoints were defined | Pass | Section 10に定義。 |
| Evidence Reference Endpoints were defined | Pass | Section 11に定義。 |
| Audit Log Endpoints were defined | Pass | Section 12に定義。 |
| Request Field Definitions were defined | Pass | Section 13に定義。 |
| Response Field Definitions were defined | Pass | Section 14に定義。 |
| Status Transition Validation Rules were defined | Pass | Section 15に定義。 |
| Access Control and Role Rules were defined | Pass | Section 16に定義。 |
| Error Response Policy was defined | Pass | Section 17に定義。 |
| Security and Secret Handling Policy was defined | Pass | Section 18に定義。 |
| API implementation was not created | Pass | Markdown設計のみ。 |
| DB implementation was not created | Pass | DB実装なし。 |
| SQL was not created | Pass | SQL文なし。 |
| OAuth implementation was not created | Pass | OAuth実装なし。 |
| UI implementation was not created | Pass | UI実装なし。 |
| Legal judgment was not made | Pass | 後続仕様へ委譲。 |
| SNS terms details were not finalized | Pass | 詳細判断は後続仕様または公式情報確認へ委譲。 |
| ASP terms details were not finalized | Pass | 詳細結論は確定しない。 |
| Affiliate terms details were not finalized | Pass | 詳細結論は確定しない。 |
| Secret values were not included | Pass | Credential values are prohibited. |
| No mojibake exists | Pass | UTF-8 Markdownで作成。 |
| No replacement character exists | Pass | 置換文字なし。 |
| Markdown code fence count is even | Pass | 作成後に検証する。 |
| Git diff was checked before and after work | Pass | 作業前後で確認する。 |

## 23. Next Actions

- Human Owner review of Approval Gate API Design
- OpenAPI draft creation
- Approval Gate API test specification
- Review Log storage implementation planning
- Access control implementation planning
- Evidence storage specification
- Platform-specific official-source confirmation tasks
- Phase 1 implementation preparation
