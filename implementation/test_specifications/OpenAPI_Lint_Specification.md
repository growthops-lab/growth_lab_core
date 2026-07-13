# OpenAPI Lint Specification

Document Name: Growth Lab Core OpenAPI Lint Specification
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related API Design: implementation/api_designs/Approval_Gate_API_Design.md
Related Test Specification: implementation/test_specifications/Approval_Gate_API_Test_Specification.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/OpenAPI_Lint_Specification.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本Lint仕様は、Approval Gate OpenAPI Draftを静的検証するためのMVP lint方針を定義する。

本Lint仕様は、Approval Gate API Test Specificationを補完する。

本Lint仕様は、OpenAPI構造、Endpoint、Schema、Error Response、Security Scheme、Secret混入防止を検証対象とする。

本Lint仕様は、Lintツール導入、CI設定、テストコード実装を行わない。

## 2. Scope

対象:

- OpenAPI root structure
- servers
- tags
- paths
- operationIds
- components.schemas
- components.responses
- components.parameters
- components.securitySchemes
- enums
- requestBody
- responses
- error response
- placeholder security scheme
- dummy examples
- real URL detection
- secret value detection
- status transition description

対象外:

- Lintツール導入
- Lint設定ファイル作成
- CI設定
- テストコード実装
- API実装
- DB実装
- OAuth実装
- UI実装
- 外部SNS API検証
- 法務判断
- SNS規約の最終解釈
- ASP規約の最終解釈
- アフィリエイト規約の最終解釈

## 3. Important Notes

This lint specification does not install or configure lint tools.

This lint specification does not modify the OpenAPI draft.

This lint specification defines MVP static validation rules for Approval Gate OpenAPI planning.

Secret values, tokens, API keys, passwords, and recovery codes must not be used in lint examples, test data, requests, responses, or error messages.

Detailed SNS, ASP, and affiliate terms review is delegated to later specifications or official-source confirmation.

本Lint仕様は、Lintツールの導入や設定を行わない。

本Lint仕様は、OpenAPI Draftを変更しない。

本Lint仕様は、Approval Gate OpenAPI計画のためのMVP静的検証ルールを定義する。

Secret、Token、API Key、Password、Recovery Codeなどの実体値をLint例、テストデータ、Request、Response、Error Messageに使用しない。

SNS、ASP、アフィリエイト規約の詳細確認は、後続仕様または公式情報確認へ委譲する。

## 4. Relationship to OpenAPI Draft and API Test Specification

- Approval Gate OpenAPI Draftは、Endpoint、Schema、Response、Parameter、Security Scheme候補を定義する。
- Approval Gate API Test Specificationは、テスト観点を定義する。
- 本Lint仕様は、OpenAPI Draftを静的検証するためのルールとSeverityを定義する。
- 本Lint仕様は、将来のOpenAPI lint、API contract test、CI quality gateの基礎資料となる。

## 5. Lint Specification Principles

- Lintは実装前の品質ゲートとして扱う。
- OpenAPI Draftの構造欠落は優先度高く扱う。
- Secret、Token、API Key、Password混入は最重要違反として扱う。
- 実在URL混入は最重要違反として扱う。
- OAuth URL、token URL、scopeの確定は本段階では禁止する。
- MVPでは手動チェック可能な形式でルールを定義する。
- 将来はLintツール、CI、API contract testへ接続できるようにする。

## 6. Lint Severity Model

| Severity | Meaning | Example | Required Action |
|---|---|---|---|
| Blocker | MVP品質ゲートを通せない重大違反。 | Secret、Token、API Key、Password実体の混入、実在URLの混入。 | 修正完了まで承認不可。 |
| Critical | OpenAPI Draftとして成立しない構造違反。 | openapi version欠落、paths欠落、components欠落。 | 実装計画前に修正必須。 |
| Major | 必須API候補や必須schemaの欠落。 | required path欠落、operationId欠落、required schema欠落。 | Phase 1実装前に修正必須。 |
| Minor | 可読性や将来実装に影響する説明不足。 | description不足、Notes不足。 | 後続レビューで修正推奨。 |
| Info | 補足確認または改善候補。 | 表記ゆれ、将来Lint自動化候補。 | 必要に応じて改善。 |

## 7. Lint Rule ID Rules

Rule ID形式:

OALINT-<CATEGORY>-<NUMBER>

例:

- OALINT-ROOT-001
- OALINT-SERVER-001
- OALINT-PATH-001
- OALINT-SCHEMA-001
- OALINT-ERROR-001
- OALINT-SECURITY-001
- OALINT-SECRET-001

カテゴリ候補:

- ROOT
- SERVER
- PATH
- OPERATION
- SCHEMA
- ENUM
- REQUEST
- RESPONSE
- ERROR
- SECURITY
- TRANSITION
- SECRET
- EXAMPLE
- TOOL

## 8. Lint Target Files

| Target File | Lint Required | Purpose | Notes |
|---|---|---|---|
| implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | Yes | OpenAPI Draftの静的検証対象。 | 本Lint仕様の主対象。 |
| implementation/api_designs/Approval_Gate_API_Design.md | Reference | API境界、Validation、Error Response方針の補助確認。 | 変更しない。 |
| implementation/test_specifications/Approval_Gate_API_Test_Specification.md | Reference | APIテスト観点との整合確認。 | 変更しない。 |

## 9. OpenAPI Root Structure Rules

| Rule ID | Rule | Severity | Check Target | Expected Result | Notes |
|---|---|---|---|---|---|
| OALINT-ROOT-001 | openapiが存在する。 | Critical | openapi | 存在する。 | Root必須項目。 |
| OALINT-ROOT-002 | openapiが3.1.0である。 | Critical | openapi | 3.1.0である。 | MVP Draft前提。 |
| OALINT-ROOT-003 | infoが存在する。 | Critical | info | 存在する。 | API識別情報。 |
| OALINT-ROOT-004 | info.titleが存在する。 | Major | info.title | 存在する。 | Draft名を確認する。 |
| OALINT-ROOT-005 | info.versionが存在する。 | Major | info.version | 存在する。 | Draft versionを確認する。 |
| OALINT-ROOT-006 | serversが存在する。 | Critical | servers | 存在する。 | URL安全性ルールへ接続する。 |
| OALINT-ROOT-007 | tagsが存在する。 | Major | tags | 存在する。 | API分類を確認する。 |
| OALINT-ROOT-008 | pathsが存在する。 | Critical | paths | 存在する。 | Endpoint候補の基礎。 |
| OALINT-ROOT-009 | componentsが存在する。 | Critical | components | 存在する。 | Schema等の基礎。 |
| OALINT-ROOT-010 | components.schemasが存在する。 | Critical | components.schemas | 存在する。 | Schema検証の基礎。 |
| OALINT-ROOT-011 | components.responsesが存在する。 | Major | components.responses | 存在する。 | Error Response検証の基礎。 |
| OALINT-ROOT-012 | components.parametersが存在する。 | Major | components.parameters | 存在する。 | Parameter検証の基礎。 |
| OALINT-ROOT-013 | components.securitySchemesが存在する。 | Critical | components.securitySchemes | 存在する。 | Security Scheme検証の基礎。 |

## 10. Server and URL Safety Rules

| Rule ID | Rule | Severity | Allowed Value | Forbidden Value Pattern | Notes |
|---|---|---|---|---|---|
| OALINT-SERVER-001 | servers.urlはplaceholderのみ許容する。 | Blocker | https://api.example.invalid | example.invalid以外のhttps URL | 実在URLを記載しない。 |
| OALINT-SERVER-002 | OAuth authorizationUrlを記載しない。 | Blocker | None | authorizationUrl | OAuth方式を確定しない。 |
| OALINT-SERVER-003 | OAuth tokenUrlを記載しない。 | Blocker | None | tokenUrl | Token発行方式を確定しない。 |
| OALINT-SERVER-004 | 外部SNS、ASP、WordPress、社内本番URLを記載しない。 | Blocker | None | production URL、staging URL、real service URL | 実在サービスへの接続を前提にしない。 |
| OALINT-SERVER-005 | exampleやdescriptionに実在URLを含めない。 | Blocker | https://api.example.invalid | example.invalid以外のhttps URL | Dummy example ruleと連動する。 |

## 11. Path and Operation Rules

| Rule ID | Path | Method | Expected OperationId | Severity | Notes |
|---|---|---|---|---|---|
| OALINT-PATH-001 | /approval-gates | GET | listApprovalGates | Major | 一覧取得候補。 |
| OALINT-PATH-002 | /approval-gates | POST | createApprovalGate | Major | 作成候補。 |
| OALINT-PATH-003 | /approval-gates/{approval_gate_id} | GET | getApprovalGate | Major | 個別取得候補。 |
| OALINT-PATH-004 | /approval-gates/{approval_gate_id} | PATCH | updateApprovalGateMetadata | Major | Metadata更新候補。 |
| OALINT-PATH-005 | /approval-gates/{approval_gate_id}/transition | POST | transitionApprovalGate | Major | 状態遷移候補。 |
| OALINT-PATH-006 | /approval-gates/{approval_gate_id}/review-logs | GET | listApprovalGateReviewLogs | Major | Review Log一覧候補。 |
| OALINT-PATH-007 | /approval-gates/{approval_gate_id}/review-logs | POST | createApprovalGateReviewLog | Major | Review Log作成候補。 |
| OALINT-PATH-008 | /approval-gates/{approval_gate_id}/evidence-references | GET | listApprovalGateEvidenceReferences | Major | Evidence Reference一覧候補。 |
| OALINT-PATH-009 | /approval-gates/{approval_gate_id}/evidence-references | POST | createApprovalGateEvidenceReference | Major | Evidence Reference作成候補。 |
| OALINT-PATH-010 | /approval-gates/{approval_gate_id}/audit-logs | GET | listApprovalGateAuditLogs | Major | Audit Log一覧候補。 |
| OALINT-PATH-011 | /approval-gates/{approval_gate_id}/archive | POST | archiveApprovalGate | Major | Archive候補。 |
| OALINT-PATH-012 | /approval-gates/{approval_gate_id}/invalidate | POST | invalidateApprovalGate | Major | Invalidate候補。 |

## 12. Schema and Enum Rules

| Rule ID | Target | Type | Severity | Expected Result | Notes |
|---|---|---|---|---|---|
| OALINT-SCHEMA-001 | ApprovalGate | Schema | Major | 存在する。 | Core entity。 |
| OALINT-SCHEMA-002 | ApprovalGateCreateRequest | Schema | Major | 存在する。 | 作成Request候補。 |
| OALINT-SCHEMA-003 | ApprovalGateUpdateRequest | Schema | Major | 存在する。 | 更新Request候補。 |
| OALINT-SCHEMA-004 | ApprovalGateTransitionRequest | Schema | Major | 存在する。 | 状態遷移Request候補。 |
| OALINT-SCHEMA-005 | ApprovalGateTransitionResponse | Schema | Major | 存在する。 | 状態遷移Response候補。 |
| OALINT-SCHEMA-006 | ReviewLog | Schema | Major | 存在する。 | Review Log relationship。 |
| OALINT-SCHEMA-007 | ReviewLogCreateRequest | Schema | Major | 存在する。 | Review Log作成Request候補。 |
| OALINT-SCHEMA-008 | EvidenceReference | Schema | Major | 存在する。 | Evidence Reference relationship。 |
| OALINT-SCHEMA-009 | EvidenceReferenceCreateRequest | Schema | Major | 存在する。 | Evidence Reference作成Request候補。 |
| OALINT-SCHEMA-010 | AuditLog | Schema | Major | 存在する。 | Audit Log reference。 |
| OALINT-SCHEMA-011 | ErrorResponse | Schema | Major | 存在する。 | Error Response標準候補。 |
| OALINT-SCHEMA-012 | ValidationResult | Schema | Major | 存在する。 | Validation結果候補。 |
| OALINT-ENUM-001 | ApprovalGateStatus | Enum | Major | Draft、Review Required、Approved、Blocked、Deferred、Published、Archived、Invalidatedを含む。 | 状態遷移制約の基礎。 |
| OALINT-ENUM-002 | DecisionCategory | Enum | Major | Approved for MVP publishing、Approved with manual review、Blocked due to missing evidence、Blocked due to terms uncertainty、Deferred to later specification、Requires Human Owner decision、Requires official-source confirmationを含む。 | 判断カテゴリ。 |
| OALINT-ENUM-003 | TermsCheckStatus | Enum | Major | Not Required、Required、Passed、Failed、Unknown、Deferredを含む。 | 規約判断を断定しない。 |
| OALINT-ENUM-004 | AutomationAllowedStatus | Enum | Major | Allowed、Not Allowed、Unknown、Deferredを含む。 | 自動化可否を断定しない。 |
| OALINT-ENUM-005 | Role | Enum | Major | Human Owner、Reviewer、Operator、Developer、Auditor、Systemを含む。 | Role別Access Controlの基礎。 |

## 13. Request and Response Rules

| Rule ID | Rule | Severity | Target Schema | Expected Result | Notes |
|---|---|---|---|---|---|
| OALINT-REQUEST-001 | Request schemaにSecret実体を含めない。 | Blocker | All request schemas | Secret実体なし。 | 一般化した検出対象にする。 |
| OALINT-RESPONSE-001 | Response schemaにSecret実体を含めない。 | Blocker | All response schemas | Secret実体なし。 | Error Responseも含む。 |
| OALINT-RESPONSE-002 | ErrorResponseにSecret実体を含めない。 | Blocker | ErrorResponse | Secret、Token、API Key、Password実体なし。 | 安全な説明文のみ。 |
| OALINT-REQUEST-002 | ApprovalGateTransitionRequestにはfrom_status、to_status、decision_categoryを含める。 | Major | ApprovalGateTransitionRequest | 必須項目候補が定義されている。 | 状態遷移検証の基礎。 |
| OALINT-REQUEST-003 | Blockedにはblocked_reasonが必要であることをdescriptionに含める。 | Major | ApprovalGateTransitionRequest | 制約説明が存在する。 | MISSING_BLOCKED_REASONと連動。 |
| OALINT-REQUEST-004 | Deferredにはdeferred_itemsが必要であることをdescriptionに含める。 | Major | ApprovalGateTransitionRequest | 制約説明が存在する。 | MISSING_DEFERRED_ITEMSと連動。 |
| OALINT-REQUEST-005 | Publishedにはpublished_atまたはpublish_request_referenceが必要であることをdescriptionに含める。 | Major | ApprovalGateTransitionRequest | 制約説明が存在する。 | Published証跡の確認。 |

## 14. Error Response Rules

| Rule ID | Error Code | Required | Severity | Safe Response Requirement | Notes |
|---|---|---|---|---|---|
| OALINT-ERROR-001 | APPROVAL_GATE_NOT_FOUND | Yes | Major | 安全な説明文のみ。 | Stack traceなし。 |
| OALINT-ERROR-002 | INVALID_STATUS_TRANSITION | Yes | Major | 安全な説明文のみ。 | 状態遷移拒否。 |
| OALINT-ERROR-003 | MISSING_BLOCKED_REASON | Yes | Major | 安全な説明文のみ。 | 理由不足。 |
| OALINT-ERROR-004 | MISSING_DEFERRED_ITEMS | Yes | Major | 安全な説明文のみ。 | Deferred項目不足。 |
| OALINT-ERROR-005 | MISSING_EVIDENCE_REFERENCE | Yes | Major | 安全な説明文のみ。 | Evidence参照不足。 |
| OALINT-ERROR-006 | HUMAN_OWNER_DECISION_REQUIRED | Yes | Major | 安全な説明文のみ。 | Human Owner判断境界。 |
| OALINT-ERROR-007 | TERMS_CHECK_UNKNOWN | Yes | Major | 安全な説明文のみ。 | 規約確認不明。 |
| OALINT-ERROR-008 | AUTOMATION_ALLOWED_STATUS_UNKNOWN | Yes | Major | 安全な説明文のみ。 | 自動化可否不明。 |
| OALINT-ERROR-009 | FORBIDDEN_ROLE | Yes | Major | 安全な説明文のみ。 | Role違反。 |
| OALINT-ERROR-010 | SECRET_VALUE_REJECTED | Yes | Blocker | Secret実体を返さない。 | Secret混入拒否。 |
| OALINT-ERROR-011 | VALIDATION_FAILED | Yes | Major | 安全な説明文のみ。 | Validation失敗。 |
| OALINT-ERROR-012 | Internal stack trace exclusion | Yes | Blocker | 内部スタックトレースを含めない。 | 内部情報を露出しない。 |
| OALINT-ERROR-013 | Sensitive value exclusion | Yes | Blocker | Secret、Token、API Key、Passwordの実体を含めない。 | Error Responseにも含めない。 |

## 15. Security Scheme Rules

| Rule ID | Rule | Severity | Expected Result | Notes |
|---|---|---|---|---|
| OALINT-SECURITY-001 | securitySchemesにはBearerAuthPlaceholderを定義する。 | Critical | Placeholder security schemeが存在する。 | 実装確定ではない。 |
| OALINT-SECURITY-002 | BearerAuthPlaceholderはplaceholderとして扱う。 | Major | descriptionでplaceholderであることを示す。 | Token発行は定義しない。 |
| OALINT-SECURITY-003 | OAuth authorizationUrlを記載しない。 | Blocker | authorizationUrlなし。 | OAuth方式を確定しない。 |
| OALINT-SECURITY-004 | OAuth tokenUrlを記載しない。 | Blocker | tokenUrlなし。 | Token発行方式を確定しない。 |
| OALINT-SECURITY-005 | OAuth scopeを確定しない。 | Blocker | scopesなし。 | Scope設計は後続仕様。 |
| OALINT-SECURITY-006 | 実在Tokenのexampleを記載しない。 | Blocker | 実在Token例なし。 | Dummy valueのみ。 |

## 16. Status Transition Description Rules

| Rule ID | Transition Rule | Severity | Expected Location | Notes |
|---|---|---|---|---|
| OALINT-TRANSITION-001 | DraftからPublishedへ直接遷移できない。 | Major | info.description or transition description | 直接公開禁止。 |
| OALINT-TRANSITION-002 | Review Requiredを経由しないPublishedは禁止。 | Major | transition description | Review経由を確認する。 |
| OALINT-TRANSITION-003 | ApprovedなしにPublishedへ進めない。 | Major | transition description | Approved必須。 |
| OALINT-TRANSITION-004 | Blockedにはblocked_reasonが必須。 | Major | ApprovalGateTransitionRequest description | MISSING_BLOCKED_REASONと連動。 |
| OALINT-TRANSITION-005 | Deferredにはdeferred_itemsが必須。 | Major | ApprovalGateTransitionRequest description | MISSING_DEFERRED_ITEMSと連動。 |
| OALINT-TRANSITION-006 | Publishedにはpublished_atまたはpublish_request_referenceが必要。 | Major | ApprovalGateTransitionRequest description | Published証跡。 |
| OALINT-TRANSITION-007 | Human Owner承認が必要な場合、承認完了までPublishedへ進めない。 | Major | transition description | Human Owner判断境界。 |
| OALINT-TRANSITION-008 | terms_check_statusがUnknownの場合、Approved for MVP publishingにしない。 | Major | transition description | 規約判断を断定しない。 |
| OALINT-TRANSITION-009 | automation_allowed_statusがUnknownの場合、自動投稿実行へ接続しない。 | Major | transition description | 自動化可否を断定しない。 |

## 17. Secret and Sensitive Value Detection Rules

| Rule ID | Detection Target | Severity | Forbidden Content | Required Action | Notes |
|---|---|---|---|---|---|
| OALINT-SECRET-001 | Secret value | Blocker | Secret実体 | 即時修正。 | 具体形式は記載しない。 |
| OALINT-SECRET-002 | Token value | Blocker | Token実体 | 即時修正。 | 具体形式は記載しない。 |
| OALINT-SECRET-003 | API Key value | Blocker | API Key実体 | 即時修正。 | 具体形式は記載しない。 |
| OALINT-SECRET-004 | Password value | Blocker | Password実体 | 即時修正。 | 具体形式は記載しない。 |
| OALINT-SECRET-005 | Recovery Code | Blocker | Recovery Code実体 | 即時修正。 | 具体形式は記載しない。 |
| OALINT-SECRET-006 | TOTP Secret | Blocker | TOTP Secret実体 | 即時修正。 | 具体形式は記載しない。 |
| OALINT-SECRET-007 | Real personal data | Blocker | 実在個人情報 | 即時修正。 | ダミー値のみ許容。 |
| OALINT-SECRET-008 | Real email address | Blocker | 実在メールアドレス | 即時修正。 | メール例は使わない。 |
| OALINT-SECRET-009 | Real production URL | Blocker | 実在本番URL | 即時修正。 | placeholderのみ許容。 |

注意:

- 実在Secret形式の具体例は記載しない。
- 検出ルールは一般化した表現にする。
- ダミー値は許容する。

## 18. Dummy Example Rules

- exampleはダミー値のみ使用する。
- 実在URL、実在メールアドレス、実在アカウント名を使わない。
- 許容されるURL例は https://api.example.invalid のみ。
- dummy、example、placeholderであることが明確な値のみ許容する。

許容ダミー値の例:

- AG-20260708-0001
- REV-20260708-0001
- CONTENT-0001
- dummy-source-system
- dummy-platform
- dummy-content-title
- dummy-reference
- dummy-evidence-reference
- dummy-audit-log-reference
- Human Owner
- Reviewer
- 2026-07-08T00:00:00Z

## 19. Tool Candidate Policy

- MVPではLint仕様を先に定義し、ツール選定は後続仕様へ委譲する。
- 候補としてOpenAPI lintツールやYAML parserを検討できる。
- ただし、本仕様では特定ツール、特定バージョン、CI実装を確定しない。
- 既に導入済みのPyYAMLとNode yamlは、YAML parse確認に使用できる候補として扱う。
- OpenAPI専用lintツールの導入、設定、CI接続は後続仕様で決定する。

## 20. Manual Lint Checklist

| Check ID | Manual Check Item | Expected Result | Severity | Notes |
|---|---|---|---|---|
| OALINT-MANUAL-001 | OpenAPI YAMLがparseできる。 | Parse成功。 | Critical | PyYAMLまたはNode yamlを候補にできる。 |
| OALINT-MANUAL-002 | openapiが3.1.0である。 | 3.1.0。 | Critical | Root ruleと連動。 |
| OALINT-MANUAL-003 | 必須pathがすべて存在する。 | 12 endpoint候補が存在。 | Major | Path and Operation Rulesと連動。 |
| OALINT-MANUAL-004 | 必須operationIdがすべて存在する。 | Expected OperationIdが存在。 | Major | API contract testの基礎。 |
| OALINT-MANUAL-005 | 必須schemaがすべて存在する。 | 必須schemaが存在。 | Major | Schema rulesと連動。 |
| OALINT-MANUAL-006 | 必須enum値がすべて存在する。 | 必須enum値が存在。 | Major | Enum rulesと連動。 |
| OALINT-MANUAL-007 | servers.urlがplaceholderである。 | https://api.example.invalid のみ。 | Blocker | 実在URL禁止。 |
| OALINT-MANUAL-008 | auth URL、token URLがない。 | authorizationUrl、tokenUrlなし。 | Blocker | OAuth確定禁止。 |
| OALINT-MANUAL-009 | 実在URLがない。 | placeholder以外なし。 | Blocker | 実在サービスURL禁止。 |
| OALINT-MANUAL-010 | Secret実体がない。 | Secret実体なし。 | Blocker | 具体形式は記載しない。 |
| OALINT-MANUAL-011 | Error ResponseにSecret実体がない。 | Secret実体なし。 | Blocker | 安全な説明文のみ。 |
| OALINT-MANUAL-012 | Draft -> Published禁止が記載されている。 | 記載あり。 | Major | Transition ruleと連動。 |
| OALINT-MANUAL-013 | ApprovedなしPublished禁止が記載されている。 | 記載あり。 | Major | Transition ruleと連動。 |

## 21. Future Automated Lint Policy

- 後続仕様でOpenAPI lintツールを選定する。
- 後続仕様でlint configファイルを作成する。
- 後続仕様でCI実行条件を定義する。
- 後続仕様でBlockerまたはCritical違反時のmerge禁止ルールを定義する。
- 後続仕様でOpenAPI lint結果の保存場所を定義する。

## 22. Out-of-scope Lint Items

- Lintツール導入
- Lint config作成
- CI設定
- API contract test実装
- Mock server実装
- API実装
- DB実装
- SQL
- OAuth実装
- UI実装
- 外部SNS API検証
- ASP連携検証
- 法務判断
- SNS規約詳細判断
- ASP規約詳細判断
- アフィリエイト規約詳細判断

## 23. Acceptance Criteria

- OpenAPI lint方針が定義されている。
- Severity Modelが定義されている。
- Rule ID Rulesが定義されている。
- Root Structure Rulesが定義されている。
- Server and URL Safety Rulesが定義されている。
- Path and Operation Rulesが定義されている。
- Schema and Enum Rulesが定義されている。
- Request and Response Rulesが定義されている。
- Error Response Rulesが定義されている。
- Security Scheme Rulesが定義されている。
- Status Transition Description Rulesが定義されている。
- Secret and Sensitive Value Detection Rulesが定義されている。
- Manual Lint Checklistが定義されている。
- OpenAPI Draftを変更していない。
- Lint設定ファイルを作成していない。
- package.json、pnpm-lock.yamlを変更していない。

## 24. Items Deferred to Later Specifications

- OpenAPI lintツール選定
- Lint config作成
- CI連携
- OpenAPI contract test実装
- Mock server設定
- API実装時の自動テスト
- Lint結果レポート保存方式
- PRまたはmerge時の品質ゲート
- OpenAPI versioning rule
- API breaking change rule

## 25. Items Not Decided by This Lint Specification

- 使用するOpenAPI lintツール
- 使用するLint config形式
- CIツール
- package script
- OpenAPI修正方針
- API実装方式
- DB実装方式
- OAuth実装方式
- UI実装方式
- 外部SNS API連携方式
- 法務判断
- SNS規約の詳細結論
- ASP規約の詳細結論
- アフィリエイト規約の詳細結論

## 26. Validation Results

| Check | Result | Notes |
|---|---|---|
| Approval Gate OpenAPI Draftを参照した | Pass | OpenAPI 3.1.0、paths、componentsを確認。 |
| Approval Gate API Designを参照した | Pass | Validation、Access Control、Error Response方針の参照元。 |
| Approval Gate API Test Specificationを参照した | Pass | APIテスト観点の参照元。 |
| Lint Severity Modelを定義した | Pass | Section 6に定義。 |
| Lint Rule ID Rulesを定義した | Pass | Section 7に定義。 |
| Lint Target Filesを定義した | Pass | Section 8に定義。 |
| OpenAPI Root Structure Rulesを定義した | Pass | Section 9に定義。 |
| Server and URL Safety Rulesを定義した | Pass | Section 10に定義。 |
| Path and Operation Rulesを定義した | Pass | Section 11に定義。 |
| Schema and Enum Rulesを定義した | Pass | Section 12に定義。 |
| Request and Response Rulesを定義した | Pass | Section 13に定義。 |
| Error Response Rulesを定義した | Pass | Section 14に定義。 |
| Security Scheme Rulesを定義した | Pass | Section 15に定義。 |
| Status Transition Description Rulesを定義した | Pass | Section 16に定義。 |
| Secret and Sensitive Value Detection Rulesを定義した | Pass | Section 17に定義。 |
| Dummy Example Rulesを定義した | Pass | Section 18に定義。 |
| Manual Lint Checklistを定義した | Pass | Section 20に定義。 |
| Future Automated Lint Policyを定義した | Pass | Section 21に定義。 |
| OpenAPI Draftを変更していない | Pass | 本作業では変更なし。 |
| Lint設定ファイルを作成していない | Pass | Markdown仕様書のみ。 |
| package.jsonを変更していない | Pass | 本作業では変更なし。 |
| pnpm-lock.yamlを変更していない | Pass | 本作業では変更なし。 |
| テストコードを作成していない | Pass | コード作成なし。 |
| API実装をしていない | Pass | 実装なし。 |
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
| Secret実体を含めていない | Pass | 一般化した表現とダミー値のみ。 |
| 文字化けがない | Pass | 日本語表示を確認。 |
| 置換文字がない | Pass | 置換文字なし。 |
| コードブロック数が偶数 | Pass | コードブロックなし。 |
| 作業前後のgit diffを確認した | Pass | 作業前後に確認。 |

## 27. Next Actions

- Human Owner review of OpenAPI Lint Specification
- OpenAPI lint tool selection
- OpenAPI lint config creation
- API contract test implementation planning
- Review Log storage implementation planning
- Access control implementation planning
- Evidence storage specification
- Platform-specific official-source confirmation tasks
- Phase 1 implementation preparation
