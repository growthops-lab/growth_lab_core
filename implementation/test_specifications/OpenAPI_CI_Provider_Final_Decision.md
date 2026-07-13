# OpenAPI CI Provider Final Decision

Document Name: Growth Lab Core OpenAPI CI Provider Final Decision
Related CI Provider Selection: implementation/test_specifications/OpenAPI_CI_Provider_Selection.md
Related CI Quality Gate Plan: implementation/test_specifications/OpenAPI_CI_Quality_Gate_Plan.md
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related Spectral Config: implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml
Related Manual Recheck Report: implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/OpenAPI_CI_Provider_Final_Decision.md
Created Date: 2026-07-09
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本決定文書は、OpenAPI lint CI quality gateに使用するCI providerの最終判断状態を記録する。

- 本文書はCI implementation executionの前段階として作成する。
- 本文書は、採用provider、採用理由、未決定事項、後続作業を明確化する。
- Human Ownerの明示決定がない場合は、最終決定を行わずPendingとして記録する。

## 2. Scope

対象:

- CI provider決定状態
- 決定ソース確認
- selected provider記録
- decision rationale
- non-selected provider summary
- MVP implementation assumptions
- initial trigger decision
- initial pass/fail decision
- initial warning handling decision
- initial log/artifact decision
- security/secret handling decision
- required Human Owner confirmations
- future CI implementation execution scope

対象外:

- CI provider実装
- CI設定ファイル作成
- GitHub Actions設定
- GitLab CI設定
- Azure Pipelines設定
- CircleCI設定
- Spectral lint実行
- OpenAPI Draft変更
- Spectral config変更
- package.json変更
- pnpm-lock.yaml変更
- package script変更
- test_results更新
- CI log実保存
- CI artifact作成
- branch protection設定
- repository settings変更
- API implementation
- DB implementation
- OAuth implementation
- UI implementation
- 法務判断

## 3. Important Notes

This document does not implement a CI provider.
This document does not create CI configuration files.
This document does not execute Spectral lint.
This document does not modify the OpenAPI Draft.
This document does not modify the Spectral config.
This document does not modify package.json or pnpm-lock.yaml.
If an explicit Human Owner decision is not found, the decision status remains Pending Human Owner Decision.

本文書は、CI providerを実装しない。
本文書は、CI設定ファイルを作成しない。
本文書は、Spectral lintを実行しない。
本文書は、OpenAPI Draftを変更しない。
本文書は、Spectral configを変更しない。
本文書は、package.jsonまたはpnpm-lock.yamlを変更しない。
Human Ownerの明示決定が確認できない場合、Decision StatusはPending Human Owner Decisionのままとする。

## 4. Relationship to Existing CI Documents

| Document | Role | Decision Relevance |
|---|---|---|
| implementation/test_specifications/OpenAPI_CI_Provider_Selection.md | CI provider候補比較と選定計画。 | Recommendation pending Human Owner decisionであり、本決定文書の判断状態の根拠。 |
| implementation/test_specifications/OpenAPI_CI_Quality_Gate_Plan.md | OpenAPI lint CI quality gate計画。 | provider未決定、trigger候補、pass/fail候補、warning handling候補を参照する。 |
| implementation/test_specifications/OpenAPI_Lint_Result_Logging_Specification.md | lint result logging方針。 | CI logs、Markdown report、artifact候補の扱いに関連する。 |
| implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md | 最新Manual OpenAPI lint recheck report。 | Current lint baselineとしてPass、0 findingsを確認する。 |
| implementation/test_results/openapi/20260709_141003_OpenAPI_Lint_Manual_Recheck_Report.md | 直前Manual OpenAPI lint recheck report。 | baseline推移の参考。 |
| implementation/test_specifications/OpenAPI_Lint_Package_Script_Plan.md | package script計画。 | CI implementationでは既存package scriptsを使う方針の根拠。 |
| package.json | packageManagerとlint scripts。 | `pnpm@11.7.0`、`lint:openapi`、`lint:openapi:version`を参照する。 |
| pnpm-lock.yaml | dependency lockfile。 | CI dependency install方針の判断材料。 |
| architecture/master/adr/ADR-0003-security-secret-token-and-access-control-boundary.md | Secret、Token、access control境界ADR。 | CI secrets、private registry token、logging redaction方針と整合させる。 |
| architecture/master/adr/ADR-0010-mvp-implementation-architecture-boundary.md | MVP implementation境界ADR。 | CI implementation executionの範囲整理に参照する。 |

## 5. Current Decision Status

| Item | Value |
|---|---|
| Decision Status | Pending Human Owner Decision |
| Selected Provider | Not selected by this document |
| Decision Source | No explicit Human Owner decision was found in the reviewed artifacts. |
| Decision Date | Not decided |
| Decision Owner | Human Owner |
| Implementation Status | Not implemented |
| CI Configuration Created | No |
| Spectral Lint Executed in This Task | No |

## 6. Decision Source Review

| Source | Reviewed | Decision Found | Notes |
|---|---|---|---|
| OpenAPI_CI_Provider_Selection.md | Yes | No | Recommendation remains pending Human Owner decision. |
| OpenAPI_CI_Quality_Gate_Plan.md | Yes | No | CI provider is not decided by the plan. |
| CHANGELOG.md | Yes | No | Contains provider selection planning, but not Human Owner final approval. |
| Manual OpenAPI lint recheck reports | Yes | No | Latest recheck confirms lint Pass but does not decide provider. |
| git remote -v if checked | Yes | No | No remote output was returned; repository host was not used as a provider decision source. |

## 7. Selected Provider

Selected Provider:
Not selected by this document.

Selection Summary:
OpenAPI_CI_Provider_Selection.md recommends that the final provider decision remain pending Human Owner decision. This document preserves that status and does not select a provider.

Implementation Candidate:
CI implementation execution must not start until Human Owner confirms the selected provider.

## 8. Decision Rationale

Decision rationale is not finalized because the selected CI provider has not been explicitly approved by the Human Owner.

Current rationale from provider selection:

- If the repository host is GitHub, GitHub Actions is the first candidate.
- If the repository host is GitLab, GitLab CI is the first candidate.
- If the repository host is not decided, Local Manual CI-like Workflow remains a temporary bridge.
- If an organization-standard CI provider exists, Other CI Provider should be re-evaluated.

## 9. Non-selected Provider Summary

| Provider | Status | Reason |
|---|---|---|
| GitHub Actions | Not selected by this document | Final provider decision is pending Human Owner decision. |
| GitLab CI | Not selected by this document | Final provider decision is pending Human Owner decision. |
| Local Manual CI-like Workflow | Not selected by this document | Final provider decision is pending Human Owner decision. |
| Other CI Provider | Not selected by this document | Final provider decision is pending Human Owner decision. |

## 10. MVP Implementation Assumptions

- OpenAPI lint is currently passing manually.
- CI implementation should use existing package scripts where possible.
- CI should not perform automatic remediation.
- CI should not modify OpenAPI Draft or Spectral config.
- CI should not expose secrets, tokens, API keys, passwords, or private registry tokens.
- CI implementation should begin only after Human Owner confirms the provider.

## 11. Initial CI Trigger Decision

Initial trigger decision:
Pending Human Owner confirmation.

候補方針:

- Manual dispatch is the safest first trigger candidate.
- Pull request trigger is recommended after initial CI workflow stability is confirmed.
- Push to main should require Human Owner approval before activation.
- Scheduled run is deferred.

## 12. Initial Pass and Fail Decision

Initial pass/fail decision:
Pending Human Owner confirmation before CI implementation.

Candidate policy:

- Error: Fail
- Warning: Human Owner decision required before fail/allow finalization
- Info: Allow candidate
- Hint: Allow candidate
- Tool / Config Failure: Fail candidate
- Execution Failure: Fail candidate

## 13. Initial Warning Handling Decision

Initial warning handling decision:
Pending Human Owner confirmation.

Candidate policy:

- MVP初期ではwarningをfail扱いにする候補とする。
- known warningとして一時許容する場合はHuman Owner decisionを必須とする。
- known warningには理由、期限、対象rule、location、再確認条件を記録する。

## 14. Initial Log and Artifact Decision

Initial log and artifact decision:
Pending Human Owner confirmation.

Candidate policy:

- CI provider built-in logs are a candidate.
- Timestamped Markdown report under implementation/test_results/openapi is a candidate.
- CI artifact upload is a candidate.
- Final storage and retention are deferred to CI implementation or CI log storage policy.

## 15. Security and Secret Handling Decision

Security and secret handling decision:
No secret values are required for the current OpenAPI lint command.

Candidate policy:

- Do not store real Secret, Token, API Key, Password, private registry token, or personal information in CI logs or reports.
- Do not document CI secret values.
- If private registry credentials become necessary, Human Owner approval and ADR-0003 alignment are required.
- Allowed placeholder URL remains `https://api.example.invalid`.

## 16. Required Human Owner Confirmations

Human Owner confirmation is required before:

- selecting the CI provider
- creating CI configuration files
- enabling CI trigger
- enabling pull request or merge request required check
- connecting to branch protection
- deciding warning fail/allow behavior
- allowing any known finding
- choosing CI log storage
- choosing CI artifact retention
- registering secrets or CI variables
- starting CI implementation execution

## 17. Future CI Implementation Execution Scope

Future CI implementation execution must wait until Human Owner confirms the selected provider.

Candidate scope after provider confirmation:

- CI configuration file creation
- Node.js setup
- pnpm setup
- dependency install step
- lint:openapi:version step
- lint:openapi step
- pass/fail handling
- log and artifact handling
- CHANGELOG update
- validation report

## 18. Future Verification Candidate Commands

```powershell
pnpm --version
node --version
pnpm run lint:openapi:version
pnpm run lint:openapi
```

必要に応じて以下も候補とする:

```powershell
node -e "require('yaml').parse(require('fs').readFileSync('implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml','utf8')); console.log('OpenAPI Draft YAML parse OK')"
node -e "require('yaml').parse(require('fs').readFileSync('implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml','utf8')); console.log('Spectral config YAML parse OK')"
```

本作業では実行しない。

## 19. Risk Review

- Human Owner決定がないままCI implementationへ進むと手戻りが発生する。
- repository host未確認のままproviderを決めると実装できない可能性がある。
- CI設定を急いで作るとbranch protectionやtrigger方針と矛盾する可能性がある。
- warning扱いを決めないままCIを導入すると品質ゲートの挙動が不安定になる。
- CI logsやartifactsにSecretが出力されると重大なセキュリティ事故になる。
- Local Manual CI-like Workflowを長く継続すると自動品質ゲートにならない。
- GitHub ActionsやGitLab CIなどprovider固有仕様に依存しすぎると移行コストが増える。

## 20. Out-of-scope Items

- CI provider実装
- CI設定ファイル作成
- GitHub Actions設定
- GitLab CI設定
- Azure Pipelines設定
- CircleCI設定
- .github作成
- gitlab-ci.yml作成
- azure-pipelines.yml作成
- circle.yml作成
- Spectral lint実行
- OpenAPI Draft修正
- Spectral config修正
- package.json変更
- pnpm-lock.yaml変更
- package script変更
- test_results更新
- CI log実保存
- CI artifact作成
- branch protection設定
- repository settings変更
- test implementation
- API implementation
- DB implementation
- SQL
- OAuth implementation
- UI implementation
- 外部SNS API検証
- ASP連携検証
- 法務判断
- SNS規約詳細判断
- ASP規約詳細判断
- アフィリエイト規約詳細判断

## 21. Acceptance Criteria

- OpenAPI_CI_Provider_Final_Decision.md が作成されている。
- CHANGELOG.md が更新されている。
- Current Decision Statusが記載されている。
- Decision Source Reviewが記載されている。
- Selected Providerが記載されている。
- Decision Rationaleが記載されている。
- Non-selected Provider Summaryが記載されている。
- MVP Implementation Assumptionsが記載されている。
- Initial CI Trigger Decisionが記載されている。
- Initial Pass and Fail Decisionが記載されている。
- Initial Warning Handling Decisionが記載されている。
- Initial Log and Artifact Decisionが記載されている。
- Security and Secret Handling Decisionが記載されている。
- Required Human Owner Confirmationsが記載されている。
- Future CI Implementation Execution Scopeが記載されている。
- Future Verification Candidate Commandsが記載されている。
- Risk Reviewが記載されている。
- Human Ownerの明示決定がない場合、CI providerを最終決定していない。
- CI providerを実装していない。
- CI設定ファイルを作成していない。
- .githubフォルダを作成していない。
- gitlab-ci.ymlを作成していない。
- azure-pipelines.ymlを作成していない。
- circle.ymlを作成していない。
- Spectral lintを実行していない。
- OpenAPI Draftを変更していない。
- Spectral configを変更していない。
- package.jsonを変更していない。
- pnpm-lock.yamlを変更していない。
- package scriptを変更していない。
- test_resultsを更新していない。

## 22. Items Deferred to Later Specifications

- CI provider final approval if still pending
- CI implementation execution
- CI log storage policy
- CI artifact retention policy
- branch protection planning
- PR/MR required check planning
- known finding exception policy
- API contract test implementation planning
- Phase 1 implementation preparation

## 23. Items Not Decided by This Document

- CI provider
- repository host
- CI triggerの最終範囲
- warningをfail扱いにするか
- info/hintを完全にallowするか
- CI logsの保存先
- CI artifactsの保存期間
- branch protectionの有無
- PR/MR required checkの有無
- known findingの最大許容期間
- CIでMarkdown reportを自動生成するか
- CI implementation executionの実施日

## 24. Validation Results

| Check | Result | Notes |
|---|---|---|
| OpenAPI_CI_Provider_Selection.mdを参照した | Pass | Recommendation pending Human Owner decisionを確認。 |
| OpenAPI_CI_Quality_Gate_Plan.mdを参照した | Pass | CI providerが未決定であることを確認。 |
| 最新Manual OpenAPI lint recheck reportを参照した | Pass | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.mdを参照。 |
| 最新Manual OpenAPI lint recheckがPassであることを確認した | Pass | Result Pass、Exit code 0、0 errors / 0 warnings / 0 infos / 0 hints。 |
| package.json scriptsを確認した | Pass | `lint:openapi` と `lint:openapi:version` が存在。 |
| Current Decision Statusを記載した | Pass | Section 5に記載。 |
| Decision Source Reviewを記載した | Pass | Section 6に記載。 |
| Selected Providerを記載した | Pass | Section 7に記載。 |
| Decision Rationaleを記載した | Pass | Section 8に記載。 |
| Required Human Owner Confirmationsを記載した | Pass | Section 16に記載。 |
| Future CI Implementation Execution Scopeを記載した | Pass | Section 17に記載。 |
| CI providerを独自に最終決定していない | Pass | Decision StatusはPending Human Owner Decision。 |
| Spectral lintを実行していない | Pass | 本作業では実行していない。 |
| CI設定ファイルを作成していない | Pass | `.github`、`.gitlab-ci.yml`、`azure-pipelines.yml`、`circle.yml`を作成していない。 |
| OpenAPI Draftを変更していない | Pass | 本作業の変更対象外。 |
| Spectral configを変更していない | Pass | 本作業の変更対象外。 |
| package.jsonを変更していない | Pass | 本作業の変更対象外。 |
| pnpm-lock.yamlを変更していない | Pass | 本作業の変更対象外。 |
| test_resultsを更新していない | Pass | 本作業では読み取りのみ。 |

## 25. Next Actions

1. Human Owner review of OpenAPI CI Provider Final Decision
2. CI implementation execution
3. CI implementation verification
