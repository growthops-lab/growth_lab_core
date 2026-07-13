# Approval Gate API Test Specification

Document Name: Growth Lab Core Approval Gate API Test Specification
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related API Design: implementation/api_designs/Approval_Gate_API_Design.md
Related Data Model: implementation/data_models/Approval_Gate_Data_Model.md
Related Policy: implementation/policies/Review_Log_Storage_and_Retention_Policy.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/Approval_Gate_API_Test_Specification.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本テスト仕様は、Approval Gate APIのMVP実装前に必要なテスト観点を定義する。

本テスト仕様は、Approval Gate OpenAPI DraftおよびApproval Gate API Designに基づく。

本テスト仕様は、状態遷移、権限、エラー、Secret混入防止、Review Log連携のテスト観点を整理する。

本テスト仕様は、テストコードやAPI実行を行わない。

## 2. Scope

対象:

- OpenAPI構造テスト観点
- Endpoint候補テスト観点
- Schema / Enumテスト観点
- Status Transitionテスト観点
- Review Log連携テスト観点
- Evidence Reference連携テスト観点
- Audit Logテスト観点
- Access Controlテスト観点
- Error Responseテスト観点
- Secret混入防止テスト観点
- Negative Test Case

対象外:

- テストコード実装
- 実API呼び出し
- CI設定
- 自動テスト実行
- DBテスト
- OAuth実装テスト
- 外部SNS APIテスト
- ASP連携テスト
- UIテスト
- 法務判断
- SNS規約の最終解釈
- ASP規約の最終解釈
- アフィリエイト規約の最終解釈

## 3. Important Notes

This test specification does not implement or execute tests.

This test specification does not call real APIs or external services.

This test specification defines MVP test cases for Approval Gate API planning.

Secret values, tokens, API keys, passwords, and recovery codes must not be used in test data, examples, requests, responses, or error messages.

Detailed SNS, ASP, and affiliate terms review is delegated to later specifications or official-source confirmation.

本テスト仕様は、テストを実装または実行しない。

本テスト仕様は、実APIや外部サービスを呼び出さない。

本テスト仕様は、Approval Gate API計画のためのMVPテストケースを定義する。

Secret、Token、API Key、Password、Recovery Codeなどの実体値をテストデータ、例、Request、Response、Error Messageに使用しない。

SNS、ASP、アフィリエイト規約の詳細確認は、後続仕様または公式情報確認へ委譲する。

## 4. Relationship to OpenAPI Draft and Related Documents

- Approval Gate OpenAPI Draftは、Endpoint、Schema、Response、Parameter、Security Scheme候補を定義する。
- Approval Gate API Designは、API境界、Validation、Access Control、Error Response方針を定義する。
- Approval Gate Data Modelは、状態、項目、制約ルールを定義する。
- Review Log Templateは、レビュー結果と判断理由の記録項目を定義する。
- Review Log Storage and Retention Policyは、保存、保持、アクセス制御、監査方針を定義する。
- Platform-specific Terms Confirmation Checklistは、媒体別確認項目を定義する。
- 本テスト仕様は、これらをAPIテスト観点へ変換する。

## 5. Test Specification Principles

- テストケースはMVPの検証観点として定義する。
- 実行手順ではなく、テスト設計の基礎資料として扱う。
- 実APIや外部サービスへ接続しない。
- 状態遷移制約を最重要テスト対象とする。
- Secret混入防止を最重要テスト対象とする。
- Human Owner承認が必要な操作は、SystemやReviewerが代替できない前提で検証する。
- Error Responseは安全な内容のみを返す前提で検証する。
- テストデータはダミー値のみを使用する。

## 6. Test ID Rules

Test ID形式:

AGAPI-<CATEGORY>-<NUMBER>

例:

- AGAPI-OPENAPI-001
- AGAPI-ENDPOINT-001
- AGAPI-SCHEMA-001
- AGAPI-TRANSITION-001
- AGAPI-ROLE-001
- AGAPI-ERROR-001
- AGAPI-SECRET-001

カテゴリ候補:

- OPENAPI
- ENDPOINT
- SCHEMA
- TRANSITION
- REVIEWLOG
- EVIDENCE
- AUDIT
- ROLE
- ERROR
- SECRET
- NEGATIVE

## 7. Test Levels and Execution Types

| Test Level | Description | Execution Type | MVP Required | Notes |
|---|---|---|---|---|
| Document Review Test | 関連文書とテスト観点の整合性を確認する。 | Manual review | Yes | 本作業では実行しない。 |
| OpenAPI Static Validation | OpenAPI Draftの構造、paths、componentsを静的に確認する。 | Static validation | Yes | ツールとCI設定は後続仕様で定義する。 |
| Schema Consistency Test | Schema、Enum、Error Responseが設計文書と矛盾しないことを確認する。 | Static validation | Yes | 実APIは呼び出さない。 |
| API Contract Test | 将来のAPI実装がOpenAPI Draft候補に沿うことを確認する。 | Future automated test | Deferred | 本仕様では実装しない。 |
| Status Transition Test | Draft、Approved、Publishedなどの状態遷移制約を確認する。 | Design test case | Yes | 最重要テスト対象。 |
| Access Control Test | Role別の操作可否とHuman Owner承認境界を確認する。 | Design test case | Yes | 実認証処理は実装しない。 |
| Security Negative Test | Secret混入、危険な入力、内部情報露出を拒否する観点を確認する。 | Design test case | Yes | 実Secret形式は使用しない。 |
| Error Response Test | Error Codeと安全なError Messageを確認する。 | Design test case | Yes | Stack traceやSecret実体を返さない。 |

注意: 本作業では実行しない。実行方法、ツール、CI設定は後続仕様で定義する。

## 8. Test Coverage Matrix

| Target Area | OPENAPI | ENDPOINT | SCHEMA | TRANSITION | ROLE | ERROR | SECRET | Notes |
|---|---|---|---|---|---|---|---|---|
| OpenAPI root structure | Yes | No | No | No | No | No | No | openapi、info、servers、tags、paths、componentsを確認する。 |
| Approval Gate endpoints | Yes | Yes | No | No | No | No | No | CRUD候補とoperationIdを確認する。 |
| Status transition endpoint | Yes | Yes | Yes | Yes | Yes | Yes | Yes | 状態遷移、権限、Error CodeをP0として確認する。 |
| Review Log endpoints | Yes | Yes | Yes | No | Yes | Yes | Yes | Review Log作成とSecret混入防止を確認する。 |
| Evidence Reference endpoints | Yes | Yes | Yes | No | Yes | Yes | Yes | Evidenceは実体ではなく安全な参照として扱う。 |
| Audit Log endpoints | Yes | Yes | Yes | Yes | Yes | Yes | Yes | 監査対象イベントと安全な記録を確認する。 |
| Request schemas | No | No | Yes | Yes | Yes | Yes | Yes | RequestにSecret実体を含めない。 |
| Response schemas | No | No | Yes | No | No | Yes | Yes | ResponseにSecret実体を含めない。 |
| Error responses | No | No | Yes | Yes | Yes | Yes | Yes | Error Codeと安全メッセージを確認する。 |
| Security scheme | Yes | No | No | No | Yes | Yes | Yes | BearerAuthPlaceholderが実装確定でないことを確認する。 |

## 9. OpenAPI Structure Tests

| Test ID | Test Name | Precondition | Input or Target | Expected Result | Priority | Notes |
|---|---|---|---|---|---|---|
| AGAPI-OPENAPI-001 | OpenAPI version check | OpenAPI Draftが読める。 | openapi | openapi: 3.1.0 が設定されている。 | P0 | 構文検証済みOpenAPI Draftを前提にする。 |
| AGAPI-OPENAPI-002 | Info object exists | OpenAPI Draftが読める。 | info | infoが存在する。 | P0 | title、version、summaryの候補を確認する。 |
| AGAPI-OPENAPI-003 | Placeholder server check | OpenAPI Draftが読める。 | servers | 実在URLではなくplaceholder serverである。 | P0 | 実在サービスへの接続を前提にしない。 |
| AGAPI-OPENAPI-004 | Tags exist | OpenAPI Draftが読める。 | tags | tagsが存在する。 | P1 | Approval Gatesなどの分類を確認する。 |
| AGAPI-OPENAPI-005 | Paths exist | OpenAPI Draftが読める。 | paths | pathsが存在する。 | P0 | Endpoint Candidate Testsへ接続する。 |
| AGAPI-OPENAPI-006 | Schemas exist | OpenAPI Draftが読める。 | components.schemas | components.schemasが存在する。 | P0 | Schema and Enum Testsへ接続する。 |
| AGAPI-OPENAPI-007 | Responses exist | OpenAPI Draftが読める。 | components.responses | components.responsesが存在する。 | P0 | Error Response Testsへ接続する。 |
| AGAPI-OPENAPI-008 | Parameters exist | OpenAPI Draftが読める。 | components.parameters | components.parametersが存在する。 | P1 | ApprovalGateIdPath、LimitQuery、OffsetQueryを確認する。 |
| AGAPI-OPENAPI-009 | Security schemes exist | OpenAPI Draftが読める。 | components.securitySchemes | components.securitySchemesが存在する。 | P0 | BearerAuthPlaceholderを確認する。 |
| AGAPI-OPENAPI-010 | Bearer placeholder check | OpenAPI Draftが読める。 | BearerAuthPlaceholder | placeholderとして定義されている。 | P0 | Token発行やOAuth実装は確定しない。 |
| AGAPI-OPENAPI-011 | OAuth endpoint absence check | OpenAPI Draftが読める。 | security scheme | auth URLやtoken URLを確定していない。 | P0 | OAuth実装方式は後続仕様へ委譲する。 |

## 10. Endpoint Candidate Tests

| Test ID | Endpoint | Method | Expected OperationId | Expected Result | Priority | Notes |
|---|---|---|---|---|---|---|
| AGAPI-ENDPOINT-001 | /approval-gates | GET | listApprovalGates | Endpoint候補が存在する。 | P0 | 一覧取得候補。 |
| AGAPI-ENDPOINT-002 | /approval-gates | POST | createApprovalGate | Endpoint候補が存在する。 | P0 | 作成候補。 |
| AGAPI-ENDPOINT-003 | /approval-gates/{approval_gate_id} | GET | getApprovalGate | Endpoint候補が存在する。 | P0 | 個別取得候補。 |
| AGAPI-ENDPOINT-004 | /approval-gates/{approval_gate_id} | PATCH | updateApprovalGateMetadata | Endpoint候補が存在する。 | P0 | Metadata更新候補。 |
| AGAPI-ENDPOINT-005 | /approval-gates/{approval_gate_id}/transition | POST | transitionApprovalGate | Endpoint候補が存在する。 | P0 | 状態遷移候補。 |
| AGAPI-ENDPOINT-006 | /approval-gates/{approval_gate_id}/review-logs | GET | listApprovalGateReviewLogs | Endpoint候補が存在する。 | P0 | Review Log一覧候補。 |
| AGAPI-ENDPOINT-007 | /approval-gates/{approval_gate_id}/review-logs | POST | createApprovalGateReviewLog | Endpoint候補が存在する。 | P0 | Review Log作成候補。 |
| AGAPI-ENDPOINT-008 | /approval-gates/{approval_gate_id}/evidence-references | GET | listApprovalGateEvidenceReferences | Endpoint候補が存在する。 | P0 | Evidence Reference一覧候補。 |
| AGAPI-ENDPOINT-009 | /approval-gates/{approval_gate_id}/evidence-references | POST | createApprovalGateEvidenceReference | Endpoint候補が存在する。 | P0 | Evidence Reference作成候補。 |
| AGAPI-ENDPOINT-010 | /approval-gates/{approval_gate_id}/audit-logs | GET | listApprovalGateAuditLogs | Endpoint候補が存在する。 | P0 | Audit Log一覧候補。 |
| AGAPI-ENDPOINT-011 | /approval-gates/{approval_gate_id}/archive | POST | archiveApprovalGate | Endpoint候補が存在する。 | P0 | Archive候補。 |
| AGAPI-ENDPOINT-012 | /approval-gates/{approval_gate_id}/invalidate | POST | invalidateApprovalGate | Endpoint候補が存在する。 | P0 | Invalidate候補。 |

## 11. Schema and Enum Tests

| Test ID | Target | Type | Expected Result | Priority | Notes |
|---|---|---|---|---|---|
| AGAPI-SCHEMA-001 | ApprovalGate | Schema | Schemaが存在する。 | P0 | Core entity。 |
| AGAPI-SCHEMA-002 | ApprovalGateCreateRequest | Schema | Schemaが存在する。 | P0 | 作成Request候補。 |
| AGAPI-SCHEMA-003 | ApprovalGateUpdateRequest | Schema | Schemaが存在する。 | P0 | 更新Request候補。 |
| AGAPI-SCHEMA-004 | ApprovalGateTransitionRequest | Schema | Schemaが存在する。 | P0 | 状態遷移Request候補。 |
| AGAPI-SCHEMA-005 | ApprovalGateTransitionResponse | Schema | Schemaが存在する。 | P0 | 状態遷移Response候補。 |
| AGAPI-SCHEMA-006 | ReviewLog | Schema | Schemaが存在する。 | P0 | Review Log relationship。 |
| AGAPI-SCHEMA-007 | ReviewLogCreateRequest | Schema | Schemaが存在する。 | P0 | Review Log作成Request候補。 |
| AGAPI-SCHEMA-008 | EvidenceReference | Schema | Schemaが存在する。 | P0 | Evidence Reference relationship。 |
| AGAPI-SCHEMA-009 | EvidenceReferenceCreateRequest | Schema | Schemaが存在する。 | P0 | Evidence Reference作成Request候補。 |
| AGAPI-SCHEMA-010 | AuditLog | Schema | Schemaが存在する。 | P0 | Audit Log reference。 |
| AGAPI-SCHEMA-011 | ErrorResponse | Schema | Schemaが存在する。 | P0 | Error Response標準候補。 |
| AGAPI-SCHEMA-012 | ValidationResult | Schema | Schemaが存在する。 | P0 | Validation結果候補。 |
| AGAPI-SCHEMA-013 | ApprovalGateStatus | Enum | Draft、Review Required、Approved、Blocked、Deferred、Published、Archived、Invalidatedが含まれる。 | P0 | 状態遷移テストの基礎。 |
| AGAPI-SCHEMA-014 | DecisionCategory | Enum | Requires Human Owner decisionが含まれる。 | P0 | Human Owner判断境界。 |
| AGAPI-SCHEMA-015 | ReviewStatus | Enum | Review状態候補が定義されている。 | P1 | Review Logとの整合を確認する。 |
| AGAPI-SCHEMA-016 | TermsCheckStatus | Enum | Unknown、Deferredが含まれる。 | P0 | 規約詳細判断を断定しない。 |
| AGAPI-SCHEMA-017 | LabelCheckStatus | Enum | Unknown、Deferredが含まれる。 | P1 | 表示・ラベル判断を断定しない。 |
| AGAPI-SCHEMA-018 | AutomationAllowedStatus | Enum | Unknown、Deferredが含まれる。 | P0 | 自動化可否を最終判断しない。 |
| AGAPI-SCHEMA-019 | Role | Enum | Human Owner、Reviewer、Operator、Developer、Auditor、Systemが含まれる。 | P0 | Role別Access Controlの基礎。 |

## 12. Status Transition Tests

| Test ID | From Status | To Status | Input Condition | Expected Result | Expected Error Code | Priority | Notes |
|---|---|---|---|---|---|---|---|
| AGAPI-TRANSITION-001 | Draft | Review Required | Required fields are present. | 許可 | None | P0 | Review開始。 |
| AGAPI-TRANSITION-002 | Draft | Published | Direct publish attempt. | 拒否 | INVALID_STATUS_TRANSITION | P0 | DraftからPublishedへ直接遷移できない。 |
| AGAPI-TRANSITION-003 | Review Required | Approved | Required review evidence is present and Human Owner decision is present when required. | 条件付き許可 | None | P0 | Approved前に確認条件を満たす。 |
| AGAPI-TRANSITION-004 | Review Required | Blocked | blocked_reasonあり。 | 許可 | None | P0 | Blocked理由を必須にする。 |
| AGAPI-TRANSITION-005 | Review Required | Blocked | blocked_reasonなし。 | 拒否 | MISSING_BLOCKED_REASON | P0 | 理由なしBlockedを拒否する。 |
| AGAPI-TRANSITION-006 | Review Required | Deferred | deferred_itemsあり。 | 許可 | None | P0 | Deferred項目を明示する。 |
| AGAPI-TRANSITION-007 | Review Required | Deferred | deferred_itemsなし。 | 拒否 | MISSING_DEFERRED_ITEMS | P0 | 項目なしDeferredを拒否する。 |
| AGAPI-TRANSITION-008 | Approved | Published | published_atまたはpublish_request_referenceあり。 | 許可 | None | P0 | Approved後のみPublishedへ進める。 |
| AGAPI-TRANSITION-009 | Approved | Published | published_atとpublish_request_referenceなし。 | 拒否 | VALIDATION_FAILED | P0 | Published証跡なしを拒否する。 |
| AGAPI-TRANSITION-010 | Blocked | Review Required | 再レビュー理由あり。 | 許可 | None | P1 | 再レビュー開始。 |
| AGAPI-TRANSITION-011 | Deferred | Review Required | 再レビュー理由あり。 | 許可 | None | P1 | Deferred再開。 |
| AGAPI-TRANSITION-012 | Published | Archived | Archive request is present. | 許可 | None | P1 | 公開後のArchive。 |
| AGAPI-TRANSITION-013 | Published | Review Required | 再レビュー理由あり。 | 許可 | None | P1 | 公開後再レビュー。 |
| AGAPI-TRANSITION-014 | Archived | Review Required | 再レビュー理由あり。 | 許可 | None | P1 | Archive後再レビュー。 |
| AGAPI-TRANSITION-015 | Review Required | Approved | Human Owner decision required but missing. | 拒否 | HUMAN_OWNER_DECISION_REQUIRED | P0 | SystemやReviewerは代替できない。 |
| AGAPI-TRANSITION-016 | Review Required | Approved | terms_check_status is Unknown. | 拒否 | TERMS_CHECK_UNKNOWN | P0 | 規約確認不明のまま承認しない。 |
| AGAPI-TRANSITION-017 | Review Required | Approved | automation_allowed_status is Unknown. | 拒否 | AUTOMATION_ALLOWED_STATUS_UNKNOWN | P0 | 自動化可否不明のまま承認しない。 |

## 13. Review Log Relationship Tests

| Test ID | Test Name | Target Endpoint or Schema | Expected Result | Priority | Notes |
|---|---|---|---|---|---|
| AGAPI-REVIEWLOG-001 | Review Log list endpoint exists | GET /approval-gates/{approval_gate_id}/review-logs | Review Log一覧取得候補が定義されている。 | P0 | 実API呼び出しはしない。 |
| AGAPI-REVIEWLOG-002 | Review Log create endpoint exists | POST /approval-gates/{approval_gate_id}/review-logs | Review Log作成候補が定義されている。 | P0 | 作成テストは後続実装。 |
| AGAPI-REVIEWLOG-003 | Review ID relation | ReviewLog | review_idがApproval Gateと紐づく。 | P0 | 論理関係を確認する。 |
| AGAPI-REVIEWLOG-004 | Decision reason record | ReviewLogCreateRequest | decision_reasonを記録できる。 | P0 | 判断理由の監査性。 |
| AGAPI-REVIEWLOG-005 | Review Log secret rejection | ReviewLogCreateRequest | Review LogにSecret実体を含めない。 | P0 | 実Secret形式は使わない。 |
| AGAPI-REVIEWLOG-006 | Review Log audit target | AuditLog | Review Log変更はAudit Log対象である。 | P1 | 監査記録方針と整合する。 |

## 14. Evidence Reference Tests

| Test ID | Test Name | Target Endpoint or Schema | Expected Result | Priority | Notes |
|---|---|---|---|---|---|
| AGAPI-EVIDENCE-001 | Evidence Reference list endpoint exists | GET /approval-gates/{approval_gate_id}/evidence-references | Evidence Reference一覧取得候補が定義されている。 | P0 | 実API呼び出しはしない。 |
| AGAPI-EVIDENCE-002 | Evidence Reference create endpoint exists | POST /approval-gates/{approval_gate_id}/evidence-references | Evidence Reference作成候補が定義されている。 | P0 | 作成テストは後続実装。 |
| AGAPI-EVIDENCE-003 | Evidence as reference | EvidenceReference | evidence_referenceは実体値ではなく参照IDまたは安全な保管先識別子である。 | P0 | dummy-evidence-referenceを使用する。 |
| AGAPI-EVIDENCE-004 | Evidence secret rejection | EvidenceReferenceCreateRequest | Secret、Token、API Key、PasswordをEvidenceとして受け取らない。 | P0 | 実体値は使用しない。 |
| AGAPI-EVIDENCE-005 | External URL example safety | EvidenceReference | 外部URLを使う場合は実在URLをExampleに含めない。 | P0 | 実在URLは記載しない。 |

## 15. Audit Log Tests

| Test ID | Test Name | Target Endpoint or Schema | Expected Result | Priority | Notes |
|---|---|---|---|---|---|
| AGAPI-AUDIT-001 | Audit Log list endpoint exists | GET /approval-gates/{approval_gate_id}/audit-logs | Audit Log一覧取得候補が定義されている。 | P0 | 実API呼び出しはしない。 |
| AGAPI-AUDIT-002 | Transition requested audit | AuditLog | status_transition_requestedがAudit対象である。 | P0 | 操作開始を記録する。 |
| AGAPI-AUDIT-003 | Transition completed audit | AuditLog | status_transition_completedがAudit対象である。 | P0 | 操作完了を記録する。 |
| AGAPI-AUDIT-004 | Transition rejected audit | AuditLog | status_transition_rejectedがAudit対象である。 | P0 | 拒否理由を安全に記録する。 |
| AGAPI-AUDIT-005 | Status set event audit | AuditLog | approved_set、blocked_set、deferred_set、published_set、archived_set、invalidated_setがAudit対象である。 | P0 | Statusごとの記録対象。 |
| AGAPI-AUDIT-006 | Audit Log secret exclusion | AuditLog | Audit LogにSecret実体を含めない。 | P0 | Errorやmetadataにも含めない。 |

## 16. Access Control and Role Tests

| Test ID | Role | Operation | Expected Result | Expected Error Code | Priority | Notes |
|---|---|---|---|---|---|---|
| AGAPI-ROLE-001 | Human Owner | Final approval | 最終承認できる。 | None | P0 | Human Owner判断が必要な操作。 |
| AGAPI-ROLE-002 | Reviewer | Create Review Log | Review Log作成できる。 | None | P0 | レビュー記録の作成。 |
| AGAPI-ROLE-003 | Reviewer | Final approval | Human Owner最終承認を代替できない。 | FORBIDDEN_ROLE | P0 | 承認境界を守る。 |
| AGAPI-ROLE-004 | Operator | Operational metadata update | 運用上必要な範囲で更新できる。 | None | P1 | 最終承認は含めない。 |
| AGAPI-ROLE-005 | Developer | Production real data access | 本番実データアクセスを最小化する。 | FORBIDDEN_ROLE | P0 | Least privilege。 |
| AGAPI-ROLE-006 | Auditor | Read audit-related records | 読み取り中心。 | None | P1 | 書き込みは原則許可しない。 |
| AGAPI-ROLE-007 | System | Record automation result | 自動処理結果を記録できるがHuman Owner承認を代替できない。 | HUMAN_OWNER_DECISION_REQUIRED | P0 | 自動処理境界。 |

## 17. Error Response Tests

| Test ID | Error Code | Trigger | Expected Safe Message | Must Not Include | Priority |
|---|---|---|---|---|---|
| AGAPI-ERROR-001 | APPROVAL_GATE_NOT_FOUND | Unknown approval_gate_id. | Approval Gate was not found. | Secret実体、Token実体、API Key実体、Password実体、内部スタックトレース、実在個人情報 | P0 |
| AGAPI-ERROR-002 | INVALID_STATUS_TRANSITION | Invalid status transition. | Status transition is not allowed. | Secret実体、Token実体、API Key実体、Password実体、内部スタックトレース、実在個人情報 | P0 |
| AGAPI-ERROR-003 | MISSING_BLOCKED_REASON | Blocked without blocked_reason. | blocked_reason is required. | Secret実体、Token実体、API Key実体、Password実体、内部スタックトレース、実在個人情報 | P0 |
| AGAPI-ERROR-004 | MISSING_DEFERRED_ITEMS | Deferred without deferred_items. | deferred_items is required. | Secret実体、Token実体、API Key実体、Password実体、内部スタックトレース、実在個人情報 | P0 |
| AGAPI-ERROR-005 | MISSING_EVIDENCE_REFERENCE | Evidence-required operation without reference. | evidence_reference is required. | Secret実体、Token実体、API Key実体、Password実体、内部スタックトレース、実在個人情報 | P0 |
| AGAPI-ERROR-006 | HUMAN_OWNER_DECISION_REQUIRED | Non-Human Owner attempts final decision. | Human Owner decision is required. | Secret実体、Token実体、API Key実体、Password実体、内部スタックトレース、実在個人情報 | P0 |
| AGAPI-ERROR-007 | TERMS_CHECK_UNKNOWN | terms_check_status is Unknown. | Terms check status must be resolved before this operation. | Secret実体、Token実体、API Key実体、Password実体、内部スタックトレース、実在個人情報 | P0 |
| AGAPI-ERROR-008 | AUTOMATION_ALLOWED_STATUS_UNKNOWN | automation_allowed_status is Unknown. | Automation allowed status must be resolved before this operation. | Secret実体、Token実体、API Key実体、Password実体、内部スタックトレース、実在個人情報 | P0 |
| AGAPI-ERROR-009 | FORBIDDEN_ROLE | Role is not permitted. | Role is not allowed for this operation. | Secret実体、Token実体、API Key実体、Password実体、内部スタックトレース、実在個人情報 | P0 |
| AGAPI-ERROR-010 | SECRET_VALUE_REJECTED | Request includes dummy-credential-placeholder as unsafe credential-like input. | Secret-like values are not accepted. | Secret実体、Token実体、API Key実体、Password実体、内部スタックトレース、実在個人情報 | P0 |
| AGAPI-ERROR-011 | VALIDATION_FAILED | Required field missing or invalid. | Request validation failed. | Secret実体、Token実体、API Key実体、Password実体、内部スタックトレース、実在個人情報 | P0 |

## 18. Security and Secret Handling Tests

| Test ID | Test Name | Input Condition | Expected Result | Expected Error Code | Priority | Notes |
|---|---|---|---|---|---|---|
| AGAPI-SECRET-001 | Secret-like request rejection | RequestにSecret実体相当の値が入った場合。 | 拒否 | SECRET_VALUE_REJECTED or VALIDATION_FAILED | P0 | 実在Secret形式は記載しない。 |
| AGAPI-SECRET-002 | Token value exclusion | RequestにToken実体を含めない。 | 拒否または仕様上禁止。 | SECRET_VALUE_REJECTED or VALIDATION_FAILED | P0 | Dummy valueのみ使用する。 |
| AGAPI-SECRET-003 | API Key value exclusion | RequestにAPI Key実体を含めない。 | 拒否または仕様上禁止。 | SECRET_VALUE_REJECTED or VALIDATION_FAILED | P0 | Dummy valueのみ使用する。 |
| AGAPI-SECRET-004 | Password value exclusion | RequestにPassword実体を含めない。 | 拒否または仕様上禁止。 | SECRET_VALUE_REJECTED or VALIDATION_FAILED | P0 | Dummy valueのみ使用する。 |
| AGAPI-SECRET-005 | Response secret exclusion | Response生成時。 | ResponseにSecret実体を含めない。 | None | P0 | Safe response only。 |
| AGAPI-SECRET-006 | Error response secret exclusion | Error Response生成時。 | Error ResponseにSecret実体を含めない。 | None | P0 | Stack traceも含めない。 |
| AGAPI-SECRET-007 | Dummy-only examples | Example定義時。 | Dummy valueのみをExampleとして使う。 | None | P0 | 実在値を使用しない。 |

禁止: 実在するSecret、Token、API Key、Password形式を具体的に記載しない。

## 19. Negative Test Cases

| Test ID | Test Name | Input Condition | Expected Result | Expected Error Code | Priority | Notes |
|---|---|---|---|---|---|---|
| AGAPI-NEGATIVE-001 | Direct Draft publish | DraftからPublishedへ直接遷移しようとする。 | 拒否 | INVALID_STATUS_TRANSITION | P0 | 直接公開禁止。 |
| AGAPI-NEGATIVE-002 | Publish without Approved | ApprovedなしでPublishedへ遷移しようとする。 | 拒否 | INVALID_STATUS_TRANSITION | P0 | Approved必須。 |
| AGAPI-NEGATIVE-003 | Blocked without reason | Blockedにblocked_reasonなしで遷移しようとする。 | 拒否 | MISSING_BLOCKED_REASON | P0 | 理由必須。 |
| AGAPI-NEGATIVE-004 | Deferred without items | Deferredにdeferred_itemsなしで遷移しようとする。 | 拒否 | MISSING_DEFERRED_ITEMS | P0 | 項目必須。 |
| AGAPI-NEGATIVE-005 | System replaces Human Owner | Human Owner判断が必要な状態でSystemがPublishedへ遷移しようとする。 | 拒否 | HUMAN_OWNER_DECISION_REQUIRED | P0 | 承認代替不可。 |
| AGAPI-NEGATIVE-006 | Unknown terms check approval | terms_check_statusがUnknownでApproved for MVP publishingへ遷移しようとする。 | 拒否 | TERMS_CHECK_UNKNOWN | P0 | 規約不明のまま承認しない。 |
| AGAPI-NEGATIVE-007 | Unknown automation allowed status | automation_allowed_statusがUnknownで自動投稿へ接続しようとする。 | 拒否 | AUTOMATION_ALLOWED_STATUS_UNKNOWN | P0 | 自動化可否不明のまま接続しない。 |
| AGAPI-NEGATIVE-008 | Credential placeholder input | Requestにdummy-credential-placeholderを含める。 | 拒否 | SECRET_VALUE_REJECTED or VALIDATION_FAILED | P0 | 実在するSecret形式ではない無害なダミー文字列を使う。 |
| AGAPI-NEGATIVE-009 | Stack trace in error response | Error Responseに内部スタックトレースが含まれる。 | 拒否 | VALIDATION_FAILED | P0 | 内部情報を露出しない。 |

## 20. Out-of-scope Test Cases

- 実API疎通テスト
- 外部SNS APIテスト
- ASP連携テスト
- WordPress投稿テスト
- OAuth認証フローテスト
- Token発行テスト
- DB永続化テスト
- SQLテスト
- UIテスト
- E2Eテスト
- 負荷テスト
- セキュリティ侵入テスト
- 法務判断テスト

## 21. Dummy Test Data

本仕様で使用できるダミー値:

- AG-20260708-0001
- REV-20260708-0001
- CONTENT-0001
- dummy-source-system
- dummy-platform
- dummy-content-title
- dummy-reference
- dummy-evidence-reference
- dummy-audit-log-reference
- dummy-credential-placeholder
- Human Owner
- Reviewer
- 2026-07-08T00:00:00Z

禁止:

- 実在URL
- 実在アカウント
- 実在メールアドレス
- 実在Token
- 実在API Key
- 実在Password
- 実在個人情報

## 22. Acceptance Criteria

- OpenAPI Draftの必須構造が確認できる。
- 必須Endpoint候補が確認できる。
- 必須SchemaとEnumが確認できる。
- Status Transition制約がテストケース化されている。
- Role別Access Controlがテストケース化されている。
- Error Responseがテストケース化されている。
- Secret混入防止がテストケース化されている。
- Review Log、Evidence Reference、Audit Log連携がテストケース化されている。
- 実API実行を前提にしていない。
- 外部サービス接続を前提にしていない。

## 23. Items Deferred to Later Test Specifications

- OpenAPI lint実行仕様
- API contract test実装
- Unit test実装
- Integration test実装
- E2E test実装
- CI設定
- Mock server設定
- DB永続化テスト
- OAuth認証テスト
- 外部SNS API連携テスト
- 管理画面UIテスト
- 負荷テスト
- セキュリティ診断

## 24. Items Not Decided by This Test Specification

- テストフレームワーク
- テスト実装言語
- CIツール
- Mock server方式
- API base pathの最終決定
- OAuth実装方式
- DB実装方式
- 外部SNS API連携方式
- UI実装方式
- 法務判断
- SNS規約の詳細結論
- ASP規約の詳細結論
- アフィリエイト規約の詳細結論

## 25. Validation Results

| Check | Result | Notes |
|---|---|---|
| Approval Gate OpenAPI Draftを参照した | Pass | implementation/openapi/Approval_Gate_OpenAPI_Draft.yamlを確認。 |
| Approval Gate API Designを参照した | Pass | Status Transition Validation Rulesを確認。 |
| Approval Gate Data Modelを参照した | Pass | 状態、項目、制約の参照元として確認。 |
| Review Log Templateを参照した | Pass | Review Log項目の参照元として確認。 |
| Review Log Storage and Retention Policyを参照した | Pass | 保存、保持、監査方針の参照元として確認。 |
| Platform-specific Terms Confirmation Checklistを参照した | Pass | 媒体別確認観点の参照元として確認。 |
| Test ID Rulesを定義した | Pass | Section 6に定義。 |
| Test Levels and Execution Typesを定義した | Pass | Section 7に定義。 |
| Test Coverage Matrixを定義した | Pass | Section 8に定義。 |
| OpenAPI Structure Testsを定義した | Pass | Section 9に定義。 |
| Endpoint Candidate Testsを定義した | Pass | Section 10に定義。 |
| Schema and Enum Testsを定義した | Pass | Section 11に定義。 |
| Status Transition Testsを定義した | Pass | Section 12に定義。 |
| Review Log Relationship Testsを定義した | Pass | Section 13に定義。 |
| Evidence Reference Testsを定義した | Pass | Section 14に定義。 |
| Audit Log Testsを定義した | Pass | Section 15に定義。 |
| Access Control and Role Testsを定義した | Pass | Section 16に定義。 |
| Error Response Testsを定義した | Pass | Section 17に定義。 |
| Security and Secret Handling Testsを定義した | Pass | Section 18に定義。 |
| Negative Test Casesを定義した | Pass | Section 19に定義。 |
| API実装をしていない | Pass | 文書作成のみ。 |
| テストコードを作成していない | Pass | Markdown仕様書のみ。 |
| DB実装をしていない | Pass | DB変更なし。 |
| SQLを作成していない | Pass | SQLなし。 |
| OAuth実装をしていない | Pass | OAuth実装なし。 |
| UI実装をしていない | Pass | UI変更なし。 |
| 実APIを呼び出していない | Pass | ローカルファイル確認のみ。 |
| 外部サービスへ接続していない | Pass | 本仕様書作成では外部サービス接続なし。 |
| 法務判断をしていない | Pass | 後続仕様または公式情報確認へ委譲。 |
| SNS規約詳細を断定していない | Pass | 最終判断なし。 |
| ASP規約詳細を断定していない | Pass | 最終判断なし。 |
| アフィリエイト規約詳細を断定していない | Pass | 最終判断なし。 |
| Secret実体を含めていない | Pass | Dummy valueのみ。 |
| package.jsonを変更していない | Pass | 本作業では変更なし。 |
| pnpm-lock.yamlを変更していない | Pass | 本作業では変更なし。 |
| 文字化けがない | Pass | 日本語表示を確認。 |
| 置換文字がない | Pass | 置換文字なし。 |
| コードブロック数が偶数 | Pass | コードブロックなし。 |
| 作業前後のgit diffを確認した | Pass | 作業前後に確認。 |

## 26. Next Actions

- Human Owner review of Approval Gate API Test Specification
- OpenAPI lint specification
- API contract test implementation planning
- Review Log storage implementation planning
- Access control implementation planning
- Evidence storage specification
- Platform-specific official-source confirmation tasks
- Phase 1 implementation preparation
