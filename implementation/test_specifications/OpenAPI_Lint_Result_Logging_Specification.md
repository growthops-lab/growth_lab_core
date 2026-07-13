# OpenAPI Lint Result Logging Specification

Document Name: Growth Lab Core OpenAPI Lint Result Logging Specification
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related Spectral Config: implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml
Related Package Script Plan: implementation/test_specifications/OpenAPI_Lint_Package_Script_Plan.md
Related Latest Follow-up Report: implementation/test_results/openapi/OpenAPI_Draft_Followup_Remediation_Execution_Report.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/OpenAPI_Lint_Result_Logging_Specification.md
Created Date: 2026-07-09
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本仕様は、Approval Gate OpenAPI Draftに対するSpectral lint結果を一貫して記録、比較、確認するためのlogging仕様を定義する。

本仕様は、Lint結果の証跡を残し、remediation前後の変化を追跡できるようにする。また、CI接続前の手動実行結果を管理しやすくし、将来のCI quality gate planningへ接続できる形式にする。

## 2. Scope

対象:

- OpenAPI lint result reportの保存先
- report命名規則
- report types
- required metadata
- execution environment fields
- command fields
- result summary fields
- finding recording format
- no-finding recording format
- raw output handling
- security review logging
- file change review logging
- remediation comparison logging
- Human Owner review logging
- retention policy
- manual execution logging workflow
- CI logging readiness policy
- failure and exception logging policy
- future lint result report template

対象外:

- Spectral lint実行
- OpenAPI Draft変更
- Spectral config変更
- package.json変更
- pnpm-lock.yaml変更
- package script変更
- CI設定
- test implementation
- API implementation
- DB implementation
- OAuth implementation
- UI implementation
- 法務判断
- SNS規約の最終解釈
- ASP規約の最終解釈
- アフィリエイト規約の最終解釈

## 3. Important Notes

This specification does not execute Spectral lint.
This specification does not modify the OpenAPI Draft.
This specification does not modify the Spectral config.
This specification defines logging rules for future OpenAPI lint results.
Secret values, tokens, API keys, passwords, private registry tokens, and personal information must not be persisted in lint result reports.

本仕様は、Spectral lintを実行しない。
本仕様は、OpenAPI Draftを変更しない。
本仕様は、Spectral configを変更しない。
本仕様は、今後のOpenAPI lint結果の記録ルールを定義する。
Secret、Token、API Key、Password、private registry token、個人情報はLint結果レポートに保存しない。

## 4. Relationship to Existing Lint Artifacts

| Artifact | Role | Logging Relevance |
|---|---|---|
| OpenAPI_Lint_Specification.md | OpenAPI lint方針と検査観点の仕様 | finding分類、severity、Human Owner review対象の参照元。 |
| OpenAPI_Lint_Tool_Selection.md | lint tool選定方針 | Spectral CLIをMVP Primary candidateとする前提を示す。 |
| Spectral_Semantic_Validation_Plan.md | Spectral semantic validation計画 | lint実行レベル、failure handling、review flowの参照元。 |
| OpenAPI_Lint_Tool_Installation_Plan.md | Spectral CLI導入計画 | tool導入と依存関係管理の前提を示す。 |
| OpenAPI_Lint_Package_Script_Plan.md | package script計画 | `lint:openapi` と `lint:openapi:version` の記録対象commandを定義する。 |
| Spectral_Semantic_Validation_Execution_Report.md | 初回lint実行レポート | 初回4 warningsとraw output記録の履歴。 |
| OpenAPI_Draft_Remediation_Execution_Report.md | Draft remediation実行レポート | 3 warnings解消、1 warning残存の比較履歴。 |
| OpenAPI_Draft_Followup_Remediation_Execution_Report.md | follow-up remediation実行レポート | 最新Pass baselineの根拠。 |
| approval_gate_openapi_spectral.yaml | Spectral ruleset | future lint executionで使用するconfig path。 |
| Approval_Gate_OpenAPI_Draft.yaml | lint対象OpenAPI Draft | future lint executionで使用するOpenAPI path。 |
| package.json | package script定義 | `lint:openapi` と `lint:openapi:version` の存在確認対象。 |

## 5. Current Lint Result Baseline

| Item | Result | Source |
|---|---|---|
| Latest lint command | pnpm run lint:openapi | OpenAPI_Draft_Followup_Remediation_Execution_Report.md |
| Exit code | 0 | OpenAPI_Draft_Followup_Remediation_Execution_Report.md |
| Result | Pass | OpenAPI_Draft_Followup_Remediation_Execution_Report.md |
| Error count | 0 | OpenAPI_Draft_Followup_Remediation_Execution_Report.md |
| Warning count | 0 | OpenAPI_Draft_Followup_Remediation_Execution_Report.md |
| Info count | 0 | OpenAPI_Draft_Followup_Remediation_Execution_Report.md |
| Hint count | 0 | OpenAPI_Draft_Followup_Remediation_Execution_Report.md |
| Tool / Config Failure | 0 | OpenAPI_Draft_Followup_Remediation_Execution_Report.md |
| Resolved previous warnings | `glc-human-owner-condition-description` resolved after follow-up remediation | OpenAPI_Draft_Followup_Remediation_Execution_Report.md |
| Remaining findings | None | OpenAPI_Draft_Followup_Remediation_Execution_Report.md |
| New findings | None | OpenAPI_Draft_Followup_Remediation_Execution_Report.md |

前提:

- Spectral CLIは導入済みである。
- package.jsonには `lint:openapi` と `lint:openapi:version` が追加済みである。
- 初回Spectral semantic validationでは4 warningsが検出された。
- OpenAPI Draft remediation executionで3 warningsが解消され、1 warningが残存した。
- OpenAPI Draft follow-up remediation executionで残存warningが解消された。
- 現在の `pnpm run lint:openapi` 結果は 0 errors, 0 warnings, 0 infos, 0 hints である。
- 本作業ではlintを再実行しない。

## 6. Logging Principles

- Lint実行ごとに結果をMarkdown reportとして記録する。
- reportは人間が読める形式を優先する。
- command、exit code、error/warning/info/hint countを必ず記録する。
- findingがある場合はlocation、rule、message、severityを記録する。
- findingがない場合もNo findingsとして明示する。
- remediation前後の比較が必要な場合はbefore/afterを記録する。
- raw outputは必要最小限を記録し、SecretやTokenが含まれていないことを確認する。
- CI接続前は手動実行結果をMarkdown reportで保存する。
- CI接続後のログ保存方式はCI quality gate planningで最終決定する。
- 既存の実行レポートは履歴として維持し、明示指示なくリネーム、削除、統合しない。

## 7. Log Storage Location

Primary storage location:

`implementation/test_results/openapi`

- OpenAPI lint関連の実行レポートは `implementation/test_results/openapi` に保存する。
- `test_results` 配下は実行結果の証跡であり、仕様書や計画書は保存しない。
- 仕様書や計画書は `implementation/test_specifications` に保存する。
- CI logsの保存先は本仕様では確定しない。
- 新規レポート作成時は既存レポートを上書きしない。

## 8. File Naming Convention

将来のOpenAPI lint result reportは、以下の命名規則を候補とする。

推奨形式:

`YYYYMMDD_HHMMSS_OpenAPI_Lint_<purpose>_Report.md`

例:

- `20260709_140000_OpenAPI_Lint_Manual_Pass_Report.md`
- `20260709_143000_OpenAPI_Lint_Remediation_Recheck_Report.md`
- `20260709_150000_OpenAPI_Lint_CI_Candidate_Report.md`

既存レポートは履歴として維持し、リネームしない。新規のLint結果レポートから本命名規則を適用する候補とする。

## 9. Report Types

| Report Type | Purpose | Required When | Storage Location |
|---|---|---|---|
| Initial Validation Report | 初回lint実行結果を記録する。 | 初回Spectral lint実行時。 | implementation/test_results/openapi |
| Remediation Execution Report | remediation実行後のlint結果と比較を記録する。 | remediation後に再Lintする時。 | implementation/test_results/openapi |
| Follow-up Remediation Report | 残存findingへのfollow-up結果を記録する。 | follow-up remediation後に再Lintする時。 | implementation/test_results/openapi |
| Manual Recheck Report | 手動再確認lintの結果を記録する。 | CI接続前や変更後の確認時。 | implementation/test_results/openapi |
| CI Candidate Report | CI接続候補としてのlint結果を記録する。 | CI quality gate planning前の候補確認時。 | implementation/test_results/openapi |
| Failure Report | tool、config、実行環境の失敗を記録する。 | command failureやYAML parse failureが発生した時。 | implementation/test_results/openapi |
| Exception Review Report | known warningや例外許容判断を記録する。 | warning一時許容や例外承認が必要な時。 | implementation/test_results/openapi |

## 10. Required Report Metadata

Future lint result reports must include:

- Document Name
- Related OpenAPI Draft
- Related Spectral Config
- Related Package Script
- Related Previous Report
- Status
- Primary Format
- Target File
- Execution Date
- Execution Time
- Owner
- Executor
- Review Status

## 11. Required Execution Environment Fields

Future lint result reports must include:

- Repository root
- OS
- Package manager
- pnpm version
- Node.js version
- Spectral CLI version
- package script used
- OpenAPI Draft path
- Spectral config path
- Git branch if available
- Existing git diff note
- PATH adjustment note if applicable

補足:

Follow-up remediation executionでは通常PATHのnodeが利用できず、同梱NodeをPATH追加して確認した事例がある。今後のlint result reportでは、PATH調整や実行環境差異を記録対象に含める。

## 12. Required Command Fields

Future lint result reports must include:

- Version check command
- Lint command
- Command execution directory
- Command execution result
- Exit code
- stdout summary
- stderr summary
- Commands not executed

実行していないコマンドも、必要に応じてNot executedとして明示する。

## 13. Required Result Summary Fields

Future lint result reports must include:

- Result
- Exit code
- Error count
- Warning count
- Info count
- Hint count
- Tool / Config Failure count
- Finding count total
- Result interpretation
- Completion assessment

Result候補:

- Pass
- Completed with findings
- Tool or configuration failure
- Execution failure
- Skipped

## 14. Finding Recording Format

findingがある場合は、以下の形式で記録する。

| No. | Severity | Location | Rule | Message | Category | Suggested Next Action |
|---:|---|---|---|---|---|---|
| 1 | warning | components.example.path | example-rule | Example lint message. | OpenAPI Draft issue | OpenAPI Draft remediation planning |

Category候補:

- OpenAPI Draft issue
- Spectral config issue
- Tool / configuration issue
- Security concern
- Documentation issue
- Deferred
- Unknown

Suggested Next Action候補:

- OpenAPI Draft remediation planning
- Lint config remediation planning
- Tool troubleshooting planning
- Human Owner review
- Deferred

## 15. No-finding Recording Format

findingがない場合は、以下を明記する。

No findings were reported by the OpenAPI lint execution.

| Category | Count |
|---|---:|
| Error | 0 |
| Warning | 0 |
| Info | 0 |
| Hint | 0 |
| Tool / Config Failure | 0 |

## 16. Raw Output Handling Policy

- raw outputは必要最小限で記録する。
- outputが長い場合は、summaryを優先し、全文保存はHuman Owner判断とする。
- Secret、Token、API Key、Password、private registry token、個人情報が含まれていないことを確認する。
- 含まれている可能性がある場合は、そのまま保存せずredactionを行い、redactedであることを明記する。
- redactionを行った場合は、redaction理由と対象種別を記録する。

redaction表記:

- `[REDACTED_SECRET]`
- `[REDACTED_TOKEN]`
- `[REDACTED_API_KEY]`
- `[REDACTED_PASSWORD]`
- `[REDACTED_PERSONAL_INFORMATION]`

## 17. Security Review Logging Policy

Future lint result reports must include a security review table.

| Check | Result | Notes |
|---|---|---|
| 実在Secretなし | Pass / Fail / Not Applicable | Secret実体が保存されていないことを確認する。 |
| 実在Tokenなし | Pass / Fail / Not Applicable | Token実体が保存されていないことを確認する。 |
| 実在API Keyなし | Pass / Fail / Not Applicable | API Key実体が保存されていないことを確認する。 |
| 実在Passwordなし | Pass / Fail / Not Applicable | Password実体が保存されていないことを確認する。 |
| private registry tokenなし | Pass / Fail / Not Applicable | registry tokenが保存されていないことを確認する。 |
| 個人情報なし | Pass / Fail / Not Applicable | 個人情報が保存されていないことを確認する。 |
| 実在URLなし | Pass / Fail / Not Applicable | 実在URLが追加されていないことを確認する。 |
| https://api.example.invalid 以外のURLなし | Pass / Fail / Not Applicable | 許容URL以外が保存されていないことを確認する。 |
| contact.email追加なし | Pass / Fail / Not Applicable | contact.emailが追加されていないことを確認する。 |
| contact.url追加なし | Pass / Fail / Not Applicable | contact.urlが追加されていないことを確認する。 |
| raw outputにSecret実体なし | Pass / Fail / Not Applicable | raw output保存前に確認する。 |

## 18. File Change Review Logging Policy

Future lint result reports must include:

- Changed files
- Not changed files
- `git diff --name-only`
- `git status --short`
- OpenAPI Draft changed / not changed
- Spectral config changed / not changed
- package.json changed / not changed
- pnpm-lock.yaml changed / not changed
- package script changed / not changed
- CI config changed / not changed

既存差分がある場合は、作業前から存在した差分と、当該lint実行またはremediationで発生した差分を区別して記録する。

## 19. Remediation Comparison Logging Policy

remediation前後比較が必要な場合は、以下の形式で記録する。

| Finding | Before | After | Status | Notes |
|---|---|---|---|---|
| example-rule | warning | not reported | Resolved | Remediation resolved the finding. |

Status候補:

- Resolved
- Remaining
- Changed
- New
- Not Applicable

以下も記録する:

- remediation前のfinding count
- remediation後のfinding count
- resolved findings
- remaining findings
- new findings
- follow-up required / not required

## 20. Human Owner Review Logging Policy

- Human Owner review statusを記録する。
- warningを許容する場合はHuman Owner decisionが必要。
- errorを許容してPass扱いにしない。
- known warningとして扱う場合は理由と期限を記録する。
- CI接続前にwarningの扱いを確認する。

Review status候補:

- Not reviewed
- Reviewed
- Approved
- Approved with conditions
- Rejected
- Deferred

## 21. Retention Policy

- MVP期間中のOpenAPI lint result reportは削除しない。
- Passに至るまでのremediation履歴は保持する。
- 同じ目的の再実行が複数ある場合も、Human Owner判断なく削除しない。
- 古いレポートの整理、アーカイブ、削除は後続のrepository maintenance policyで扱う。
- 個人情報やSecretが誤って含まれていた場合は、通常の保管方針よりSecret handling policyを優先する。

## 22. Manual Execution Logging Workflow

1. `git diff --name-only` を確認する。
2. `git status --short` を確認する。
3. `pnpm run lint:openapi:version` を実行する。
4. `pnpm run lint:openapi` を実行する。
5. exit codeを確認する。
6. error/warning/info/hint countを記録する。
7. findingがある場合はfinding tableを作成する。
8. findingがない場合はNo findingsを明記する。
9. raw outputを確認し、必要最小限を記録する。
10. security reviewを記録する。
11. file change reviewを記録する。
12. next actionsを記録する。

## 23. CI Logging Readiness Policy

- 本仕様ではCI設定を作成しない。
- CI接続後のログ保存先はCI quality gate planningで決定する。
- CI接続前にManual Recheck Reportが少なくとも1件Passしていることを推奨する。
- CI上でerrorをfail扱いにする候補とする。
- CI上でwarningをfail扱いにするかはHuman Owner判断とする。
- CI logsにSecretやTokenが出力されないことを確認する。

## 24. Failure and Exception Logging Policy

| Failure or Exception | Required Logging | Next Action |
|---|---|---|
| Spectral command not found | command、exit code、stderr summary、PATH note | Tool troubleshooting planning |
| package script not found | missing script name、package.json check result | Package script remediation planning |
| OpenAPI Draft file not found | expected path、working directory、git status | File path review / OpenAPI Draft restoration planning |
| Spectral config file not found | expected path、working directory、git status | Lint config restoration planning |
| YAML parse failure | file path、parse command、error summary | YAML remediation planning |
| Tool / config failure | tool output、config path、failure category | Tool troubleshooting planning |
| Lint error findings | count、finding table、severity | OpenAPI Draft or config remediation planning |
| Lint warning findings | count、finding table、Human Owner review status | Human Owner review / remediation planning |
| Raw output contains possible secret | redaction status、redaction type、storage decision | Secret handling policy escalation |
| Unexpected file changes | changed files、expected vs unexpected diff | Stop and review before completion |
| CI-only failure | CI context、local reproduction status、artifact links if safe | CI quality gate troubleshooting planning |

## 25. Report Template for Future Lint Results

将来のManual Recheck ReportまたはCI Candidate Reportで使用する最小テンプレート:

```markdown
# OpenAPI Lint Result Report

Document Name:
Related OpenAPI Draft:
Related Spectral Config:
Related Package Script:
Related Previous Report:
Status:
Primary Format: Markdown
Target File:
Execution Date:
Execution Time:
Owner:
Executor:
Review Status:

## 1. Purpose

## 2. Execution Environment

## 3. Commands

## 4. Result Summary

## 5. Findings

## 6. Raw Output Summary

## 7. Security Review

## 8. File Change Review

## 9. Human Owner Review

## 10. Completion Assessment

## 11. Next Actions
```

注意: 本作業では、このテンプレートを使用した実行レポートを作成しない。

## 26. Out-of-scope Items

- Spectral lint実行
- OpenAPI Draft修正
- Spectral config修正
- package.json変更
- pnpm-lock.yaml変更
- package script変更
- CI設定
- CI integration
- test_results更新
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

## 27. Acceptance Criteria

- `OpenAPI_Lint_Result_Logging_Specification.md` が作成されている。
- `CHANGELOG.md` が更新されている。
- Current Lint Result Baselineが記載されている。
- Logging Principlesが記載されている。
- Log Storage Locationが記載されている。
- File Naming Conventionが記載されている。
- Report Typesが記載されている。
- Required Report Metadataが記載されている。
- Required Execution Environment Fieldsが記載されている。
- Required Command Fieldsが記載されている。
- Required Result Summary Fieldsが記載されている。
- Finding Recording Formatが記載されている。
- No-finding Recording Formatが記載されている。
- Raw Output Handling Policyが記載されている。
- Security Review Logging Policyが記載されている。
- File Change Review Logging Policyが記載されている。
- Remediation Comparison Logging Policyが記載されている。
- Human Owner Review Logging Policyが記載されている。
- Retention Policyが記載されている。
- Manual Execution Logging Workflowが記載されている。
- CI Logging Readiness Policyが記載されている。
- Failure and Exception Logging Policyが記載されている。
- Report Template for Future Lint Resultsが記載されている。
- Spectral lintを実行していない。
- OpenAPI Draftを変更していない。
- Spectral configを変更していない。
- package.jsonを変更していない。
- pnpm-lock.yamlを変更していない。
- package scriptを変更していない。
- CI設定を作成していない。
- test_resultsを更新していない。

## 28. Items Deferred to Later Specifications

- Manual OpenAPI lint recheck execution
- CI quality gate planning
- CI integration
- CI log storage policy
- Repository maintenance policy
- OpenAPI Draft future remediation policy
- Spectral config future remediation policy
- API contract test implementation planning

## 29. Items Not Decided by This Specification

- CI上でwarningをfail扱いにするか
- CI logsの保存先
- CI logsの保管期間
- 古いtest_resultsのアーカイブ方法
- 古いtest_resultsの削除条件
- known warningの最大許容期間
- lint結果を自動集計するか
- HTMLまたはJSON形式のLint reportを導入するか

## 30. Validation Results

| Check | Result | Notes |
|---|---|---|
| Spectral_Semantic_Validation_Execution_Report.mdを参照した | Pass | 初回4 warningsを確認。 |
| OpenAPI_Draft_Remediation_Execution_Report.mdを参照した | Pass | 3 warnings解消、1 warning残存を確認。 |
| OpenAPI_Draft_Followup_Remediation_Execution_Report.mdを参照した | Pass | 最新Pass baselineを確認。 |
| 最新Lint結果Passを確認した | Pass | 0 errors, 0 warnings, 0 infos, 0 hints。 |
| OpenAPI_Lint_Specification.mdを参照した | Pass | lint分類とreview前提を確認。 |
| OpenAPI_Lint_Package_Script_Plan.mdを参照した | Pass | package scriptと実行方針を確認。 |
| Current Lint Result Baselineを記載した | Pass | Section 5に記載。 |
| Log Storage Locationを定義した | Pass | Section 7に記載。 |
| File Naming Conventionを定義した | Pass | Section 8に記載。 |
| Report Typesを定義した | Pass | Section 9に記載。 |
| Required Metadataを定義した | Pass | Section 10に記載。 |
| Finding Recording Formatを定義した | Pass | Section 14に記載。 |
| No-finding Recording Formatを定義した | Pass | Section 15に記載。 |
| Raw Output Handling Policyを定義した | Pass | Section 16に記載。 |
| Security Review Logging Policyを定義した | Pass | Section 17に記載。 |
| File Change Review Logging Policyを定義した | Pass | Section 18に記載。 |
| Remediation Comparison Logging Policyを定義した | Pass | Section 19に記載。 |
| Retention Policyを定義した | Pass | Section 21に記載。 |
| Manual Execution Logging Workflowを定義した | Pass | Section 22に記載。 |
| CI Logging Readiness Policyを定義した | Pass | Section 23に記載。 |
| Report Template for Future Lint Resultsを定義した | Pass | Section 25に記載。 |
| Spectral lintを実行していない | Pass | 本作業ではlint未実行。 |
| OpenAPI Draftを変更していない | Pass | 本作業では未変更。 |
| Spectral configを変更していない | Pass | 本作業では未変更。 |
| package.jsonを変更していない | Pass | 本作業では未変更。 |
| pnpm-lock.yamlを変更していない | Pass | 本作業では未変更。 |
| test_resultsを更新していない | Pass | 本作業では未変更。 |
| Secret実体を含めていない | Pass | 実体値は記載していない。 |
| 実在URLを含めていない | Pass | 許容URLのみ記載。 |
| 文字化けがない | Pass | UTF-8 Markdownとして作成。 |
| 置換文字がない | Pass | 置換文字は使用していない。 |
| コードブロック数が偶数 | Pass | コードフェンスは開始と終了を対で記載。 |
| 作業前後のgit diffを確認した | Pass | 既存差分と今回作業対象を区別して確認。 |

## 31. Next Actions

Recommended next actions:

1. Human Owner review of OpenAPI Lint Result Logging Specification
2. Manual OpenAPI lint recheck execution
3. CI quality gate planning
4. API contract test implementation planning
5. Phase 1 implementation preparation
