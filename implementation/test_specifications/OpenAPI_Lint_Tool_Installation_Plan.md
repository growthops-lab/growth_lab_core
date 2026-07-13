# OpenAPI Lint Tool Installation Plan

Document Name: Growth Lab Core OpenAPI Lint Tool Installation Plan
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related Spectral Config: implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml
Related Lint Specification: implementation/test_specifications/OpenAPI_Lint_Specification.md
Related Tool Selection: implementation/test_specifications/OpenAPI_Lint_Tool_Selection.md
Related Semantic Validation Plan: implementation/test_specifications/Spectral_Semantic_Validation_Plan.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/OpenAPI_Lint_Tool_Installation_Plan.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本計画は、Approval Gate OpenAPI Draftのsemantic validationに使用するSpectral CLIの将来導入計画を定義する。

本計画は、OpenAPI Lint Tool Selection、OpenAPI Lint Specification、Spectral Semantic Validation Planを補完する。

本計画は、導入対象、導入前提、導入時の変更ファイル、検証方法、失敗時対応、承認ポイントを整理する。

本計画では、Spectral CLIの導入、package.json更新、pnpm-lock.yaml更新、package script追加、CI設定は行わない。

## 2. Scope

対象:

- Spectral CLI導入計画
- 導入対象パッケージ
- pnpmによる導入候補
- 導入前確認
- 導入後確認
- 将来の導入候補コマンド
- 将来の検証候補コマンド
- package.json更新方針
- pnpm-lock.yaml更新方針
- 依存関係レビュー方針
- rollback方針
- failure handling
- Human Owner approval points
- installation execution report requirements

対象外:

- Spectral CLI導入
- Redocly CLI導入
- package.json変更
- pnpm-lock.yaml変更
- package script追加
- CI設定
- Spectral CLI実行
- Lint config変更
- OpenAPI Draft変更
- テストコード実装
- API実装
- DB実装
- OAuth実装
- UI実装
- 法務判断
- SNS規約の最終解釈
- ASP規約の最終解釈
- アフィリエイト規約の最終解釈

## 3. Important Notes

This plan does not install Spectral CLI.

This plan does not modify package.json or pnpm-lock.yaml.

This plan defines future installation planning for OpenAPI lint tooling.

Secret values, tokens, API keys, passwords, and recovery codes must not be used in examples, commands, outputs, requests, responses, or error messages.

Detailed SNS, ASP, and affiliate terms review is delegated to later specifications or official-source confirmation.

本計画は、Spectral CLIの導入を行わない。

本計画は、package.jsonやpnpm-lock.yamlを変更しない。

本計画は、OpenAPI lint toolingの将来導入計画を定義する。

Secret、Token、API Key、Password、Recovery Codeなどの実体値を例、コマンド、出力例、Request、Response、Error Messageに使用しない。

SNS、ASP、アフィリエイト規約の詳細確認は、後続仕様または公式情報確認へ委譲する。

## 4. Relationship to Existing OpenAPI Lint Artifacts

- OpenAPI Lint Tool Selectionは、Spectral CLIをMVP Primary candidateとしている。
- OpenAPI Lint Specificationは、OpenAPI lint rulesとSeverity方針を定義している。
- approval_gate_openapi_spectral.yamlは、Spectral CLI向けruleset draftである。
- Spectral Semantic Validation Planは、将来のSpectral lint実行計画を定義している。
- 本計画は、Spectral CLIを将来導入するための前提、手順候補、検証候補、承認ポイントを定義する。

## 5. Installation Planning Principles

- 導入はHuman Owner承認後に別作業として実行する。
- 導入はpnpmを前提とする。
- Spectral CLIはdevDependencyとして導入する候補とする。
- グローバルインストールではなく、プロジェクトローカル導入を優先候補とする。
- package.jsonとpnpm-lock.yamlの変更は導入作業で明示的に確認する。
- 導入後はバージョン確認とlint実行可能性確認を行う。
- 導入直後にOpenAPI DraftやLint configを自動修正しない。
- 依存関係追加による差分はレビュー対象とする。
- CI接続は導入後の別作業へ委譲する。

## 6. Current Environment Status

| Item | Current Status | Notes |
|---|---|---|
| Repository root | C:\claudcode_ap\growth_lab_core | 作業ルート。 |
| Package manager | pnpm | package.jsonでpnpm@11.7.0を確認。 |
| package.json | Exists | 本作業では変更しない。 |
| pnpm-lock.yaml | Exists | 本作業では変更しない。 |
| Existing yaml package | Exists | package.jsonのdevDependencyで確認。 |
| PyYAML | Available | 既存検証作業で使用済み。 |
| Node yaml | Available | 既存検証作業で使用済み。 |
| Spectral CLI | Not installed in this task | 本作業では導入しない。 |
| OpenAPI Draft | Exists | OpenAPI 3.1.0を確認。 |
| Spectral config draft | Exists | approval_gate_openapi_spectral.yamlを確認。 |
| Semantic validation plan | Exists | Spectral_Semantic_Validation_Plan.mdを確認。 |
| CI integration | Not created in this task | 本作業ではCI設定を作成しない。 |

## 7. Installation Target

| Target | Package Name | Dependency Type | Installation Timing | Notes |
|---|---|---|---|---|
| Spectral CLI | @stoplight/spectral-cli | devDependency | Future installation execution task | Primary OpenAPI lint tool candidate. |

## 8. Installation Method Candidate

Recommended method:

Project local devDependency installation by pnpm.

Reason:

- Repository-specific version managementができる。
- CI接続時に同じバージョンを使いやすい。
- グローバル環境差分を避けやすい。
- package.jsonとpnpm-lock.yamlで依存関係をレビューしやすい。

Global installation is not the MVP preferred method.

Direct one-off execution without dependency update is not the MVP preferred method unless Human Owner approves it for investigation only.

## 9. Files Expected to Change During Future Installation

| File | Expected Change | Review Required | Notes |
|---|---|---|---|
| package.json | devDependenciesに@stoplight/spectral-cliが追加される可能性。 | Yes | 本作業では変更しない。 |
| pnpm-lock.yaml | Spectral CLIと推移的依存関係が追加される可能性。 | Yes | 本作業では変更しない。 |

## 10. Files Not Expected to Change During Future Installation

| File or Directory | Expected Change | Notes |
|---|---|---|
| implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | No change expected | 導入作業ではOpenAPI Draftを変更しない。 |
| implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml | No change expected | 導入作業ではLint configを変更しない。 |
| implementation/test_specifications/OpenAPI_Lint_Specification.md | No change expected | 既存仕様書は変更しない。 |
| implementation/test_specifications/OpenAPI_Lint_Tool_Selection.md | No change expected | 既存選定文書は変更しない。 |
| implementation/test_specifications/Spectral_Semantic_Validation_Plan.md | No change expected | 既存計画文書は変更しない。 |
| architecture/master | No change expected | Master Architecture本文は変更しない。 |
| architecture/master/adr | No change expected | ADR本文とADR READMEは変更しない。 |

## 11. Pre-installation Checklist

| Check ID | Check Item | Expected Result | Required Before Installation | Notes |
|---|---|---|---|---|
| INSTALL-PRE-001 | Human Owner approval | Approval received | Yes | 導入前に必須。 |
| INSTALL-PRE-002 | Repository root確認 | C:\claudcode_ap\growth_lab_core | Yes | 誤ディレクトリ導入防止。 |
| INSTALL-PRE-003 | package manager確認 | pnpm | Yes | package.jsonで確認。 |
| INSTALL-PRE-004 | package.json backup or diff baseline | Baseline captured | Yes | 導入差分確認用。 |
| INSTALL-PRE-005 | pnpm-lock.yaml backup or diff baseline | Baseline captured | Yes | lockfile差分確認用。 |
| INSTALL-PRE-006 | Existing git diff確認 | Existing diffs recorded | Yes | 既存差分と導入差分を区別する。 |
| INSTALL-PRE-007 | Package name確認 | @stoplight/spectral-cli | Yes | 類似名誤導入を防ぐ。 |
| INSTALL-PRE-008 | Network availability確認 | Available or approved | Yes | 導入時にregistry accessが必要。 |
| INSTALL-PRE-009 | Lint config確認 | Existing ruleset draft exists | Yes | 導入後検証対象。 |
| INSTALL-PRE-010 | OpenAPI Draft確認 | OpenAPI 3.1.0 | Yes | lint対象。 |

## 12. Future Installation Candidate Commands

The following commands are future candidates only and must not be executed in this task.

`cd /d C:\claudcode_ap\growth_lab_core`

`pnpm add -D @stoplight/spectral-cli`

Notes:

- 本作業では実行しない。
- 導入前にHuman Owner approvalを取得する。
- 導入後にpackage.jsonとpnpm-lock.yamlの差分を確認する。
- バージョン固定方針は後続仕様で決定する。

## 13. Post-installation Verification Candidate Commands

The following commands are future candidates only and must not be executed in this task.

`pnpm exec spectral --version`

`pnpm exec spectral lint -r implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml`

`pnpm exec spectral lint -r implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml --verbose`

Notes:

- 本作業では実行しない。
- 実行結果の保存先は後続仕様で決定する。
- semantic validation実行は、導入後の別作業として扱う。

## 14. Package Script Planning Boundary

- 本計画ではpackage scriptを追加しない。
- package script追加は後続のpackage.json script planningで定義する。
- script名、実行対象、exit code handling、CI連携は後続仕様で決定する。
- 参考候補としてlint:openapiのようなscript名を検討できるが、本計画では確定しない。

## 15. Lockfile and Dependency Review Policy

- 導入時にpnpm-lock.yamlが更新される想定である。
- lockfile差分はレビュー対象とする。
- package.jsonのdevDependencies差分はレビュー対象とする。
- 追加依存の範囲が想定以上に大きい場合は、導入完了扱いにせずHuman Ownerへ報告する。
- lockfileを手動編集しない。
- package.jsonを手動で雑に編集せず、pnpmによる依存追加結果を確認する。

## 16. Security and Supply Chain Review Policy

- 導入前に追加パッケージ名が @stoplight/spectral-cli であることを確認する。
- 類似名パッケージを誤導入しない。
- 導入後、package.jsonとpnpm-lock.yamlの差分を確認する。
- 導入時に実在SecretやTokenを使用しない。
- private registryや認証tokenを文書やログに記載しない。
- 脆弱性監査コマンドの実施要否は後続仕様またはHuman Owner判断とする。
- 依存関係リスクが見つかった場合は導入完了扱いにしない。

## 17. Rollback Policy

導入失敗または導入中止時は、以下を確認する。

- package.jsonの変更有無
- pnpm-lock.yamlの変更有無
- node_modulesの状態
- OpenAPI Draftに変更がないこと
- Lint configに変更がないこと

rollback候補:

- 変更前バックアップまたはgit差分を確認する。
- package.jsonとpnpm-lock.yamlの変更を戻す必要がある場合は、Human Owner確認後に別作業として扱う。
- node_modulesの削除や再インストールは本計画では実行しない。

## 18. Failure Handling Policy

| Failure Type | Example | Required Action | Completion Impact | Notes |
|---|---|---|---|---|
| pnpm command unavailable | pnpmが実行できない。 | 環境確認を行い、Human Ownerへ報告する。 | Installation incomplete | 本計画では修正しない。 |
| package resolution failed | package解決に失敗。 | package名、registry、networkを確認する。 | Installation incomplete | 類似名導入を避ける。 |
| network unavailable | registryへ接続できない。 | 承認済みnetwork条件を確認する。 | Installation incomplete | 再試行は別判断。 |
| package name mismatch | 想定外packageが追加される。 | 導入完了扱いにしない。 | Blocked | @stoplight/spectral-cliを確認する。 |
| package.json unexpected change | 想定外のscriptやdependencyが増える。 | 差分を分類して報告する。 | Installation incomplete | 自動修正しない。 |
| pnpm-lock.yaml unexpected change | 想定以上のlockfile差分。 | 依存範囲をレビューする。 | Installation incomplete | Human Owner確認。 |
| Spectral version check failed | version確認ができない。 | install状態とcommandを確認する。 | Installation incomplete | 実行環境問題の可能性。 |
| Spectral lint command unavailable | lint commandが実行できない。 | CLI導入状態を確認する。 | Installation incomplete | semantic validationへ進まない。 |
| Security concern found | 依存関係リスクが見つかる。 | Human Ownerへ報告する。 | Blocked | 一時許容には承認が必要。 |
| Existing git diff conflict | 既存差分と導入差分が混ざる。 | 差分を分離して報告する。 | Conditional | 既存差分を戻さない。 |

## 19. Human Owner Approval Points

Human Owner approvalが必要なポイント:

- Spectral CLIを導入する前
- package.jsonを変更する前
- pnpm-lock.yamlを変更する前
- 導入バージョンを固定する前
- package scriptを追加する前
- Spectral semantic validationを初回実行する前
- CIへ接続する前
- 導入失敗後にrollbackを実行する前
- lockfile差分を承認する前
- 依存関係リスクを一時許容する前

## 20. Installation Execution Report Requirements

将来の導入実行後に必要な報告項目:

- 実行日時
- 実行ディレクトリ
- 実行コマンド
- 追加パッケージ名
- package manager
- package.json変更有無
- pnpm-lock.yaml変更有無
- Spectral CLI version確認結果
- git diff確認結果
- git status確認結果
- 変更禁止ファイルの変更有無
- 実在Secret混入有無
- 実在URL混入有無
- 導入成功または失敗
- 失敗した場合の原因
- 次の推奨作業

## 21. Out-of-scope Items

- Spectral CLI導入
- Redocly CLI導入
- IBM OpenAPI Validator導入
- OpenAPI Generator導入
- package.json変更
- pnpm-lock.yaml変更
- package script追加
- Spectral CLI実行
- Semantic validation実行
- CI設定
- Lint result logging
- test_resultsフォルダ作成
- Lint config変更
- OpenAPI Draft変更
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

## 22. Acceptance Criteria

- Spectral CLI導入計画の目的が定義されている。
- 導入対象パッケージが定義されている。
- pnpmによる将来導入候補が定義されている。
- 導入時に変更が想定されるファイルが定義されている。
- 導入時に変更しないファイルが定義されている。
- Pre-installation Checklistが定義されている。
- Future Installation Candidate Commandsが定義されている。
- Post-installation Verification Candidate Commandsが定義されている。
- Lockfile and Dependency Review Policyが定義されている。
- Security and Supply Chain Review Policyが定義されている。
- Rollback Policyが定義されている。
- Failure Handling Policyが定義されている。
- Human Owner Approval Pointsが定義されている。
- Installation Execution Report Requirementsが定義されている。
- Spectral CLIを導入していない。
- package.jsonを変更していない。
- pnpm-lock.yamlを変更していない。
- package scriptを追加していない。
- CI設定を作成していない。
- OpenAPI Draftを変更していない。
- Lint configを変更していない。

## 23. Items Deferred to Later Specifications

- Spectral CLI installation execution
- package.json script planning
- package script追加
- Spectral semantic validation execution
- lint result logging specification
- CI quality gate planning
- CI integration
- OpenAPI Draft remediation specification
- Lint config remediation specification
- API contract test implementation planning

## 24. Items Not Decided by This Plan

- Spectral CLI導入実行日
- Spectral CLIバージョン固定方針
- package script名
- package script内容
- CIツール
- CI実行条件
- lint結果ログ保存先の最終決定
- lint違反の例外承認フォーマット
- OpenAPI Draft修正方針
- Lint config修正方針
- API実装方式
- DB実装方式
- OAuth実装方式
- UI実装方式
- 外部SNS API連携方式
- 法務判断
- SNS規約の詳細結論
- ASP規約の詳細結論
- アフィリエイト規約の詳細結論

## 25. Validation Results

| Check | Result | Notes |
|---|---|---|
| OpenAPI_Lint_Tool_Selection.mdを参照した | Pass | 既存選定文書を確認。 |
| OpenAPI_Lint_Specification.mdを参照した | Pass | 既存Lint仕様を確認。 |
| Spectral_Semantic_Validation_Plan.mdを参照した | Pass | 既存semantic validation planを確認。 |
| approval_gate_openapi_spectral.yamlを参照した | Pass | 既存ruleset draftを確認。 |
| Approval_Gate_OpenAPI_Draft.yamlを参照した | Pass | OpenAPI 3.1.0を確認。 |
| package.jsonを参照した | Pass | pnpm前提と既存yaml packageを確認。 |
| pnpm-lock.yamlを参照した | Pass | 存在確認済み。 |
| Current Environment Statusを定義した | Pass | Section 6。 |
| Installation Targetを定義した | Pass | Section 7。 |
| Installation Method Candidateを定義した | Pass | Section 8。 |
| Files Expected to Change During Future Installationを定義した | Pass | Section 9。 |
| Files Not Expected to Change During Future Installationを定義した | Pass | Section 10。 |
| Pre-installation Checklistを定義した | Pass | Section 11。 |
| Future Installation Candidate Commandsを定義した | Pass | Section 12。 |
| Post-installation Verification Candidate Commandsを定義した | Pass | Section 13。 |
| Package Script Planning Boundaryを定義した | Pass | Section 14。 |
| Lockfile and Dependency Review Policyを定義した | Pass | Section 15。 |
| Security and Supply Chain Review Policyを定義した | Pass | Section 16。 |
| Rollback Policyを定義した | Pass | Section 17。 |
| Failure Handling Policyを定義した | Pass | Section 18。 |
| Human Owner Approval Pointsを定義した | Pass | Section 19。 |
| Installation Execution Report Requirementsを定義した | Pass | Section 20。 |
| Spectral CLIをインストールしていない | Pass | No install command was run. |
| Spectral CLIを実行していない | Pass | No spectral command was run. |
| Redocly CLIをインストールしていない | Pass | No install command was run. |
| package.jsonを変更していない | Pass | 本作業では変更なし。 |
| pnpm-lock.yamlを変更していない | Pass | 本作業では変更なし。 |
| package scriptを追加していない | Pass | 本作業では追加なし。 |
| CI設定を作成していない | Pass | CI file was not created. |
| Lint configを変更していない | Pass | Existing lint config was not edited. |
| OpenAPI Draftを変更していない | Pass | Existing OpenAPI Draft was not edited. |
| API実装をしていない | Pass | No implementation was created. |
| DB実装をしていない | Pass | No DB implementation was created. |
| SQLを作成していない | Pass | No SQL was created. |
| OAuth実装をしていない | Pass | No OAuth implementation was created. |
| UI実装をしていない | Pass | No UI implementation was created. |
| 実APIを呼び出していない | Pass | No API call was performed. |
| 外部サービスへ接続していない | Pass | No external service connection was performed. |
| 法務判断をしていない | Pass | Delegated to later specification or official-source confirmation. |
| SNS規約詳細を断定していない | Pass | No final interpretation. |
| ASP規約詳細を断定していない | Pass | No final interpretation. |
| アフィリエイト規約詳細を断定していない | Pass | No final interpretation. |
| Secret実体を含めていない | Pass | No real sensitive values are included. |
| 実在URLを含めていない | Pass | Only permitted placeholder URL is included. |
| 文字化けがない | Pass | Japanese text was checked. |
| 置換文字がない | Pass | Replacement character was not found. |
| コードブロック数が偶数 | Pass | No code fences are used. |
| 作業前後のgit diffを確認した | Pass | Checked before and after work. |

## 26. Next Actions

- Human Owner review of OpenAPI Lint Tool Installation Plan
- Spectral CLI installation execution
- package.json script planning
- Spectral semantic validation execution
- lint result logging specification
- CI quality gate planning
- API contract test implementation planning
- Phase 1 implementation preparation
