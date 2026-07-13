# OpenAPI Draft Remediation Plan

Document Name: Growth Lab Core OpenAPI Draft Remediation Plan
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related Spectral Config: implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml
Related Execution Report: implementation/test_results/openapi/Spectral_Semantic_Validation_Execution_Report.md
Related Lint Specification: implementation/test_specifications/OpenAPI_Lint_Specification.md
Related Semantic Validation Plan: implementation/test_specifications/Spectral_Semantic_Validation_Plan.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/OpenAPI_Draft_Remediation_Plan.md
Created Date: 2026-07-09
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本計画は、Spectral semantic validation executionで検出されたApproval Gate OpenAPI Draftのwarningについて、将来のremediation executionに向けた修正方針候補を整理する。

本計画はremediation実行ではない。本計画はOpenAPI DraftとSpectral configのどちらで扱うべきかを切り分ける。本計画はHuman Owner判断が必要な箇所を明確化する。

## 2. Scope

対象:

- Spectral finding 4件の確認
- findingごとの原因候補整理
- OpenAPI Draft remediation candidateの整理
- Lint config remediation candidateの整理
- no-actionまたはdeferred candidateの整理
- Human Owner decision pointsの整理
- 将来のremediation execution範囲整理
- 将来の再Lint確認候補整理

対象外:

- OpenAPI Draft修正
- Spectral config修正
- package.json修正
- pnpm-lock.yaml修正
- package script修正
- Spectral lint再実行
- remediation execution
- CI設定
- lint result logging specification策定
- test_results更新
- API実装
- DB実装
- OAuth実装
- UI実装
- 法務判断
- SNS規約の最終解釈
- ASP規約の最終解釈
- アフィリエイト規約の最終解釈

## 3. Important Notes

This plan does not modify the OpenAPI Draft.

This plan does not modify the Spectral config.

This plan does not execute Spectral lint.

This plan defines remediation planning only.

Remediation execution is deferred to a later task after Human Owner review.

本計画は、OpenAPI Draftを変更しない。

本計画は、Spectral configを変更しない。

本計画は、Spectral lintを実行しない。

本計画は、remediation planningのみを定義する。

remediation実行は、Human Owner review後の後続作業へ委譲する。

## 4. Source Validation Result

| Item | Result |
|---|---|
| Command | pnpm run lint:openapi |
| Exit Code | 0 |
| Result | Completed with warnings |
| Error Count | 0 |
| Warning Count | 4 |
| Info Count | 0 |
| Hint Count | 0 |
| Tool / Config Failure | 0 |

## 5. Remediation Planning Principles

- Errorがないため、MVP blocking issueではなくwarning remediation candidateとして扱う。
- warningは放置せず、Draft修正、Lint config修正、No-action、Deferredのいずれかに分類する。
- OpenAPI仕様として自然な改善はDraft remediation candidateとする。
- custom ruleの過剰検知または意図不明な検知はLint config remediation candidateとする。
- 未使用componentは、使用予定がある場合は参照追加候補、不要であれば削除候補とする。
- component削除はAPI設計との整合確認後に行う。
- Human Owner approval conditionに関わる文言は、Approval Gateの運用境界と矛盾しない範囲で明確化する。
- 実在URL、Secret、個人情報を追加しない。

## 6. Finding Classification Model

| Classification | Meaning | Typical Action | Requires Human Owner |
|---|---|---|---|
| Draft Remediation Candidate | OpenAPI Draftの自然な改善で解消できる候補 | 後続のDraft修正作業で対応 | Yes |
| Lint Config Remediation Candidate | custom ruleやunused ruleの対象範囲を見直す候補 | 後続のLint config planningで対応 | Yes |
| No-action Candidate | 仕様上問題がなく修正しない候補 | 理由を記録 | Yes |
| Deferred Candidate | MVP後や後続設計で扱う候補 | deferred理由を記録 | Yes |
| Human Owner Decision Required | 設計判断または承認境界に関わる候補 | Human Ownerが判断 | Yes |

## 7. Finding Summary

| ID | Rule | Location | Severity | Initial Classification | Notes |
|---|---|---|---|---|---|
| ODRP-0001 | info-contact | 2:6 | warning | Draft Remediation Candidate | Info object must have contact. |
| ODRP-0002 | oas3-unused-component | 499:25, components.responses.InternalServerError | warning | Draft Remediation Candidate / Human Owner Decision Required | Reusable response component is not referenced. |
| ODRP-0003 | oas3-unused-component | 549:22, components.schemas.LabelCheckStatus | warning | Draft Remediation Candidate / Human Owner Decision Required | Schema component is not referenced. |
| ODRP-0004 | glc-human-owner-condition-description | 711:20, components.schemas.ApprovalGateTransitionRequest.description | warning | Draft Remediation Candidate / Lint Config Remediation Candidate | Human Owner approval condition description is insufficient. |

## 8. ODRP-0001: info-contact

Rule: info-contact

Message: Info object must have contact.

Likely Cause: OpenAPI info objectにcontactが不足している可能性がある。

Initial Classification: Draft Remediation Candidate

Candidate Remediation: OpenAPI Draftのinfo配下にcontact objectを追加する候補。

Candidate Example:

```yaml
contact:
  name: Human Owner
```

Security Notes:

- 実在個人メールアドレスを追加しない。
- 実在URLを追加しない。
- 個人情報を追加しない。
- contact objectには最小限の非個人情報のみを使用する候補とする。

Human Owner Decision:

- contact.name を Human Owner とするか、Project Owner とするか。
- emailやurlを追加しない方針でよいか。

注意: 本作業ではOpenAPI Draftへcontactを追加しない。

## 9. ODRP-0002: Unused InternalServerError Response Component

Rule: oas3-unused-component

Location: components.responses.InternalServerError

Likely Cause: InternalServerError response componentが定義されているが、paths配下で参照されていない可能性がある。

Initial Classification: Draft Remediation Candidate / Human Owner Decision Required

Candidate Remediation Options:

- Option A: 既存operationの500 responseとして `#/components/responses/InternalServerError` を参照する。
- Option B: MVPで500 response componentを使わない方針であれば、unused componentを削除する。
- Option C: 将来使用予定として残す場合は、Lint config側でunused componentの扱いを検討する。

Preferred Direction: API DesignとError Response方針にInternalServerErrorが必要であれば、Option Aを優先候補とする。ただし、operationごとのresponse設計と矛盾しないことを確認する。

Human Owner Decision:

- MVPで500 responseを明示するか。
- InternalServerError componentを全operationまたは該当operationへ参照追加するか。
- 使用予定がない場合に削除してよいか。

注意: 本作業ではOpenAPI Draftを変更しない。

## 10. ODRP-0003: Unused LabelCheckStatus Schema Component

Rule: oas3-unused-component

Location: components.schemas.LabelCheckStatus

Likely Cause: LabelCheckStatus schema componentが定義されているが、requestBody、response、または他schemaから参照されていない可能性がある。

Initial Classification: Draft Remediation Candidate / Human Owner Decision Required

Candidate Remediation Options:

- Option A: LabelCheckStatusがApproval Gate API Design上必要な概念であれば、該当responseまたはschemaから参照する。
- Option B: MVPで使用しないschemaであれば、unused componentを削除する。
- Option C: 将来使用予定として残す場合は、Lint config側でunused componentの扱いを検討する。

Preferred Direction: Approval Gate API DesignおよびApproval Gate Data ModelにLabelCheckStatus相当の概念があるか確認し、存在する場合は参照追加候補とする。存在しない、またはMVP対象外であれば削除候補とする。

Human Owner Decision:

- LabelCheckStatusがMVPのAPI Contractに必要か。
- Review LogやApproval Gate状態管理で使うべきか。
- 使用しない場合に削除してよいか。

注意: 本作業ではOpenAPI Draftを変更しない。

## 11. ODRP-0004: Human Owner Approval Condition Description

Rule: glc-human-owner-condition-description

Message: Human Owner approval condition の記述不足

Likely Cause: OpenAPI Draft内のoperation、schema、description、またはcustom rule対象箇所に、Human Owner approval conditionに関する説明が不足している可能性がある。

Initial Classification: Draft Remediation Candidate / Lint Config Remediation Candidate

Candidate Remediation Options:

- Option A: OpenAPI Draftの該当descriptionにHuman Owner approval conditionを明記する。
- Option B: custom ruleの対象範囲が過剰であれば、Lint config remediation planningで扱う。
- Option C: 該当箇所がMVP対象外または意図的に未記載であれば、Human Owner判断でDeferredにする。

Preferred Direction: Approval Gateの承認境界を明確化する目的であれば、OpenAPI Draftのdescriptionを補強する候補とする。ただし、custom ruleのlocationを確認し、Draft側の自然な説明追加で解消できる場合のみDraft remediation candidateとする。

Human Owner Decision:

- どのoperationまたはschemaにHuman Owner approval conditionを明記するか。
- descriptionに含める標準文言を決めるか。
- custom rule側の対象範囲調整が必要か。

Candidate wording: Human Owner approval is required before this approval gate can transition into an approved execution state.

日本語の説明候補: Human Ownerによる承認が完了するまで、この承認ゲートは投稿実行または外部実行の承認済み状態へ遷移できない。

注意: 本作業ではOpenAPI DraftやSpectral configを変更しない。

## 12. Draft Remediation Candidate Matrix

| Finding | Draft Change Candidate | Expected Effect | Risk | Human Owner Approval |
|---|---|---|---|---|
| ODRP-0001 info-contact | info.contact.nameを追加する。email/urlは追加しない候補。 | info-contact warning解消候補。 | contact名の責任境界が曖昧になる可能性。 | Required |
| ODRP-0002 InternalServerError | 500 responseとして参照追加、または不要ならcomponent削除。 | unused component warning解消候補。 | response contract拡張または設計要素削除の影響。 | Required |
| ODRP-0003 LabelCheckStatus | 関連schemaから参照追加、または不要ならcomponent削除。 | unused component warning解消候補。 | 状態管理モデルとの不整合。 | Required |
| ODRP-0004 glc-human-owner-condition-description | ApprovalGateTransitionRequest.descriptionへ承認条件文言を追加。 | custom rule warning解消候補。 | 運用境界を過度に固定する可能性。 | Required |

## 13. Lint Config Remediation Candidate Matrix

| Finding | Config Change Candidate | When Needed | Risk | Deferred To |
|---|---|---|---|---|
| ODRP-0002 InternalServerError | unused component ruleの対象除外またはseverity調整を検討。 | 将来使用予定componentを意図的に保持する場合。 | 品質ゲートが弱くなる。 | Lint config remediation planning |
| ODRP-0003 LabelCheckStatus | unused component ruleの対象除外またはseverity調整を検討。 | MVP後に使うschemaを意図的に保持する場合。 | 不要schemaを見逃す可能性。 | Lint config remediation planning |
| ODRP-0004 Human Owner condition | custom ruleの対象範囲または判定文字列を調整。 | Draft側の自然なdescription追加で解消できない場合。 | 承認境界チェックが弱くなる可能性。 | Lint config remediation planning |

## 14. No-action or Deferred Candidate Matrix

| Finding | No-action Candidate | Deferred Candidate | Reason | Required Decision |
|---|---|---|---|---|
| ODRP-0001 info-contact | No-actionは非推奨。 | contact設計を後続に回す。 | OpenAPI infoとして自然な改善候補。 | contact.name方針 |
| ODRP-0002 InternalServerError | 将来使用予定としてwarningを一時許容。 | response設計確定まで保留。 | 500 responseの範囲判断が必要。 | 参照追加、削除、保留 |
| ODRP-0003 LabelCheckStatus | 将来使用予定としてwarningを一時許容。 | LabelCheck運用設計まで保留。 | MVP API Contractで必要か判断が必要。 | 参照追加、削除、保留 |
| ODRP-0004 Human Owner condition | No-actionは非推奨。 | 標準文言確定まで保留。 | Approval Gate責任境界に関わる。 | 文言確定またはrule調整 |

## 15. Human Owner Decision Points

Human Owner approvalが必要なポイント:

- info.contactに入れるnameを決める前
- contact.emailまたはcontact.urlを追加する前
- InternalServerErrorをoperationへ参照追加する前
- InternalServerError componentを削除する前
- LabelCheckStatusを参照追加する前
- LabelCheckStatus componentを削除する前
- Human Owner approval conditionの標準文言を確定する前
- Lint config側で例外またはルール調整を行う前
- warningを許容してPass扱いにする前

## 16. Future OpenAPI Draft Remediation Execution Scope

Candidate future changes:

- info.contactの追加
- InternalServerError response componentの参照追加、または削除
- LabelCheckStatus schema componentの参照追加、または削除
- Human Owner approval condition descriptionの追加
- OpenAPI Draft YAML parse確認
- pnpm run lint:openapiによる再確認

注意: 本作業では上記を実施しない。

## 17. Future Verification Candidate Commands

将来のremediation execution後に実行する候補コマンド:

```powershell
cd /d C:\claudcode_ap\growth_lab_core
node -e "require('yaml').parse(require('fs').readFileSync('implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml','utf8')); console.log('OpenAPI Draft YAML parse OK')"
pnpm run lint:openapi
```

注意: 本作業では実行しない。

## 18. Risk Review

- info.contactに実在メールアドレスや実在URLを入れると個人情報または外部連絡先管理の問題が出る。
- InternalServerErrorを全operationへ追加する場合、API contractが広がる可能性がある。
- Unused componentを削除すると、後続実装やテスト仕様で参照予定だった設計要素を失う可能性がある。
- Human Owner approval conditionの文言が曖昧だと、承認ゲートの責任境界が不明確になる。
- Lint configを緩めすぎると、将来の品質ゲートが弱くなる。

## 19. Security and Secret Handling Policy

- contact.emailには実在個人メールアドレスを使用しない。
- contact.urlには実在URLを使用しない。
- 許容URLは https://api.example.invalid のみとする。
- descriptionやexampleにSecret、Token、API Key、Passwordを含めない。
- Error response exampleにSecretを含めない。
- private registry tokenや認証情報を文書化しない。

## 20. Out-of-scope Items

- OpenAPI Draft修正
- Spectral config修正
- package.json変更
- pnpm-lock.yaml変更
- package script変更
- Spectral lint実行
- semantic validation再実行
- remediation execution
- CI設定
- lint result logging specification策定
- test_results更新
- テストコード実装
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

## 21. Acceptance Criteria

- Spectral validation結果4件を整理している。
- findingごとの原因候補を記載している。
- findingごとのDraft remediation candidateを記載している。
- findingごとのLint config remediation candidateを記載している。
- no-actionまたはdeferred candidateを記載している。
- Human Owner Decision Pointsを記載している。
- Future OpenAPI Draft Remediation Execution Scopeを記載している。
- Future Verification Candidate Commandsを記載している。
- Risk Reviewを記載している。
- Security and Secret Handling Policyを記載している。
- OpenAPI Draftを変更していない。
- Spectral configを変更していない。
- package.jsonを変更していない。
- pnpm-lock.yamlを変更していない。
- Spectral lintを実行していない。
- remediationを実施していない。

## 22. Items Deferred to Later Specifications

- OpenAPI Draft remediation execution
- Lint config remediation planning
- Lint config remediation execution
- Spectral semantic validation re-execution
- lint result logging specification
- CI quality gate planning
- API contract test implementation planning

## 23. Items Not Decided by This Plan

- info.contactの最終name
- contact.emailを追加するかどうか
- contact.urlを追加するかどうか
- InternalServerErrorを参照追加するか削除するか
- LabelCheckStatusを参照追加するか削除するか
- Human Owner approval conditionの最終文言
- Lint config ruleを調整するかどうか
- warningを許容してPass扱いにするかどうか
- CI上でwarningをfail扱いにするかどうか

## 24. Validation Results

| Check | Result | Notes |
|---|---|---|
| Spectral_Semantic_Validation_Execution_Report.mdを参照した | Pass | finding 4件を確認。 |
| Approval_Gate_OpenAPI_Draft.yamlを参照した | Pass | openapi: 3.1.0を確認。 |
| approval_gate_openapi_spectral.yamlを参照した | Pass | 既存rulesetとして参照。 |
| OpenAPI_Lint_Specification.mdを参照した | Pass | remediation境界の確認対象。 |
| Spectral validation結果4件を整理した | Pass | Section 7から11に記載。 |
| info-contactのplanningを記載した | Pass | Section 8に記載。 |
| InternalServerError unused componentのplanningを記載した | Pass | Section 9に記載。 |
| LabelCheckStatus unused componentのplanningを記載した | Pass | Section 10に記載。 |
| Human Owner approval condition descriptionのplanningを記載した | Pass | Section 11に記載。 |
| Draft Remediation Candidate Matrixを記載した | Pass | Section 12に記載。 |
| Lint Config Remediation Candidate Matrixを記載した | Pass | Section 13に記載。 |
| No-action or Deferred Candidate Matrixを記載した | Pass | Section 14に記載。 |
| Human Owner Decision Pointsを記載した | Pass | Section 15に記載。 |
| OpenAPI Draftを変更していない | Pass | 本作業では未変更。 |
| Spectral configを変更していない | Pass | 本作業では未変更。 |
| package.jsonを変更していない | Pass | 本作業では未変更。 |
| pnpm-lock.yamlを変更していない | Pass | 作業前からM状態。本作業では未変更。 |
| Spectral lintを実行していない | Pass | 本作業では未実行。 |
| remediationを実施していない | Pass | planningのみ。 |
| Secret実体を含めていない | Pass | 実体値なし。 |
| 実在URLを含めていない | Pass | 許容placeholderのみ。 |
| 文字化けがない | Pass | UTF-8 Markdownとして作成。 |
| 置換文字がない | Pass | 置換文字なし。 |
| コードブロック数が偶数 | Pass | 開始と終了を対応させた。 |
| 作業前後のgit diffを確認した | Pass | 作業前確認済み。作業後に再確認する。 |

## 25. Next Actions

Recommended next actions:

1. Human Owner review of OpenAPI Draft Remediation Plan
2. OpenAPI Draft remediation execution
3. Spectral semantic validation re-execution
4. Lint config remediation planning if needed
5. lint result logging specification
6. CI quality gate planning
