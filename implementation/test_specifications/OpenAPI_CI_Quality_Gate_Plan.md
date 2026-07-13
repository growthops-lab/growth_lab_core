# OpenAPI CI Quality Gate Plan

Document Name: Growth Lab Core OpenAPI CI Quality Gate Plan
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related Spectral Config: implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml
Related Logging Specification: implementation/test_specifications/OpenAPI_Lint_Result_Logging_Specification.md
Related Manual Recheck Report: implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/OpenAPI_CI_Quality_Gate_Plan.md
Created Date: 2026-07-09
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本計画は、Approval Gate OpenAPI DraftのSpectral lintを将来CI quality gateへ接続するための方針を定義する。

- 手動Lint Pass状態をCI接続前のbaselineとして扱う。
- CIで検出すべき品質問題を明確にする。
- error、warning、info、hint、tool/config failureの扱いを整理する。
- CI設定作成前にHuman Owner判断が必要な項目を明確化する。
- 将来のCI implementation executionで実施する範囲を限定する。

## 2. Scope

対象:

- CI quality gateの目的
- CI readiness baseline
- candidate trigger policy
- candidate execution environment
- candidate commands
- pass/fail decision policy
- error handling
- warning handling
- info/hint handling
- tool/config failure handling
- known finding policy
- log/report handling
- security/secret handling
- file change/scope control
- Human Owner decision points
- CI provider decision points
- future CI implementation scope
- risk review

対象外:

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
- test implementation
- API implementation
- DB implementation
- OAuth implementation
- UI implementation
- 法務判断

## 3. Important Notes

This plan does not create CI configuration files.
This plan does not execute Spectral lint.
This plan does not modify the OpenAPI Draft.
This plan does not modify the Spectral config.
This plan does not modify package.json or pnpm-lock.yaml.
CI implementation is deferred to a later task after Human Owner review.

本計画は、CI設定ファイルを作成しない。
本計画は、Spectral lintを実行しない。
本計画は、OpenAPI Draftを変更しない。
本計画は、Spectral configを変更しない。
本計画は、package.jsonまたはpnpm-lock.yamlを変更しない。
CI実装は、Human Owner review後の後続作業へ委譲する。

## 4. Relationship to Existing Lint Artifacts

| Artifact | Role | CI Relevance |
|---|---|---|
| implementation/test_specifications/OpenAPI_Lint_Specification.md | OpenAPI lint方針を定義する仕様。 | CI quality gateで確認する品質観点の上位仕様。 |
| implementation/test_specifications/OpenAPI_Lint_Result_Logging_Specification.md | lint結果ログの記録方針を定義する仕様。 | 将来CIログやMarkdown reportを保存する場合の整合先。 |
| implementation/test_specifications/OpenAPI_Lint_Package_Script_Plan.md | lint用package scriptの計画文書。 | CIでは既存script利用を優先する方針の根拠。 |
| implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md | 最新Manual OpenAPI lint recheck report。 | CI接続前baselineの主要根拠。 |
| implementation/test_results/openapi/20260709_141003_OpenAPI_Lint_Manual_Recheck_Report.md | 直前のManual OpenAPI lint recheck report。 | 最新baselineとの比較参考。 |
| implementation/test_results/openapi/OpenAPI_Draft_Followup_Remediation_Execution_Report.md | follow-up remediation後の確認レポート。 | warnings解消後の履歴確認に使用。 |
| implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | OpenAPI Draft本体。 | CI lint対象候補。 |
| implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml | Spectral ruleset。 | CI lintで使用するconfig候補。 |
| package.json | lint scriptとpackageManagerを保持。 | CIコマンド候補の参照元。 |
| pnpm-lock.yaml | dependency lockfile。 | CI install方針とfrozen lockfile判断の参照元。 |

## 5. Current CI Readiness Baseline

| Item | Result | Source |
|---|---|---|
| Manual recheck command | `pnpm run lint:openapi` | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Exit code | 0 | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Result | Pass | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Error count | 0 | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Warning count | 0 | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Info count | 0 | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Hint count | 0 | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Tool / Config Failure | 0 | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Remaining findings | None | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| New findings | None | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Package script `lint:openapi` | Present | package.json |
| Package script `lint:openapi:version` | Present | package.json |
| Spectral CLI version | 6.16.1 | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| pnpm version | 11.7.0 | package.json / implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Node.js version | v24.14.0 | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |

## 6. CI Quality Gate Principles

- CI quality gateはOpenAPI Contract品質の退行を検出するために使用する。
- CIはOpenAPI DraftとSpectral configの整合性を確認する。
- CIはSecretや実在認証情報を出力または保存しない。
- CI導入前に手動Lint Pass状態をbaselineとする。
- CIでは原則としてerrorをfail扱いにする。
- warningの扱いはHuman Owner判断によりfailまたはallowを決める。
- tool/config failureは品質確認不能としてfail扱い候補とする。
- CIで自動remediationは行わない。
- CIでOpenAPI DraftやSpectral configを自動修正しない。
- CIログは証跡として扱うが、保存先と保管期間は後続仕様で確定する。

## 7. Candidate CI Trigger Policy

| Trigger Candidate | Purpose | Recommended for MVP | Notes |
|---|---|---|---|
| Manual dispatch | Human Ownerが任意タイミングでlintを確認する。 | Recommended | 初期MVPで最も制御しやすい。 |
| Pull request | OpenAPI Draftやlint config変更前後の退行を検出する。 | Recommended after CI implementation is stable | required check化は別途判断する。 |
| Push to main | main branchへの品質退行を検出する。 | Recommended after Human Owner approval | 初期から必須化しない。 |
| Push to feature branch | feature branch作業中に早期検出する。 | Optional | 実行回数と速度への影響を確認する。 |
| Scheduled run | 定期的な環境変化や依存関係変化を検知する。 | Deferred | MVPでは優先しない。 |
| Pre-release check | release前にOpenAPI lint状態を確認する。 | Recommended later | release process確定後に検討する。 |

## 8. Candidate CI Execution Environment

| Item | Candidate | Notes |
|---|---|---|
| CI provider | Not decided by this plan | Human Owner review後に選定する。 |
| Repository host | Not decided by this plan | GitHub、GitLabなどのhost判断は本計画外。 |
| OS runner | Linux runner candidate | Windows runnerとの差異が必要な場合は後続で判断する。 |
| Node.js version | Align with current working environment when practical | 最新manual recheckではv24.14.0。 |
| pnpm version | Align with packageManager or documented environment | package.jsonではpnpm@11.7.0。 |
| Dependency installation command | `pnpm install --frozen-lockfile` candidate | lockfile状態とpackageManager設定を確認して最終判断する。 |
| Version check command | `pnpm run lint:openapi:version` | Spectral CLI version確認に使用する候補。 |
| Lint command | `pnpm run lint:openapi` | 既存package scriptを利用する候補。 |
| Cache policy | pnpm store cache candidate | 初期MVPではcacheなしでも開始可能。 |
| Artifact upload policy | Not decided by this plan | report保存とretentionは後続仕様で確定する。 |

CI provider is not decided by this plan.
Node.js version should align with the current working environment when practical.
pnpm version should align with packageManager or documented environment.
Dependencies should be installed using pnpm with lockfile awareness.
CI should use existing package scripts instead of inline long commands where possible.

## 9. Candidate CI Commands

将来CI implementation時の候補コマンド:

```powershell
pnpm --version
node --version
pnpm install --frozen-lockfile
pnpm run lint:openapi:version
pnpm run lint:openapi
```

本作業では上記を実行しない。
CI implementation時に環境に応じて調整する。
`pnpm install --frozen-lockfile`をCIで使用するかは、lockfile状態とpackageManager設定を確認して判断する。
既存のローカル環境ではpnpmとNodeのPATHに注意点があったため、CI implementation時にNode setup方法を明確にする。

## 10. Pass and Fail Decision Policy

| Condition | Candidate CI Result | Human Owner Decision Required | Notes |
|---|---|---|---|
| 0 errors, 0 warnings, 0 infos, 0 hints | Pass | No | 現在baselineと一致する。 |
| 1 or more errors | Fail | No for fail, Yes for remediation direction | OpenAPI contract品質の退行候補。 |
| 1 or more warnings | Fail candidate or Allow candidate | Yes | MVP初期ではfail候補、最終扱いはHuman Owner判断。 |
| info only | Allow candidate | Yes if security or contract risk is implied | reportには記録する。 |
| hint only | Allow candidate | Yes if security or contract risk is implied | reportには記録する。 |
| tool/config failure | Fail candidate | Yes for recovery direction | 品質確認不能として扱う。 |
| execution failure | Fail candidate | Yes for recovery direction | CI環境、PATH、dependency、scriptを確認する。 |
| package install failure | Fail candidate | Yes | lockfile、packageManager、registry設定を確認する。 |
| script not found | Fail candidate | Yes | package script追加またはCI command変更が必要。 |
| OpenAPI Draft not found | Fail candidate | Yes | 対象ファイルの取り込み漏れを確認する。 |
| Spectral config not found | Fail candidate | Yes | config pathとrepository取り込み状態を確認する。 |

## 11. Error Handling Policy

- OpenAPI lint errorは原則としてCI fail候補とする。
- errorが発生した場合、OpenAPI Draft remediation planningまたはLint config remediation planningを行う。
- errorをHuman Owner判断なしに許容しない。
- errorをPass扱いにしない。

## 12. Warning Handling Policy

- warningは品質退行を示す可能性があるため、CI接続前に扱いを決める。
- MVP初期ではwarningをfail扱いにする候補とする。
- known warningとして一時許容する場合はHuman Owner decisionを必須とする。
- known warningには理由、期限、対象rule、location、再確認条件を記録する。
- warningを許容する場合でも、warning countとfinding detailは記録する。

## 13. Info and Hint Handling Policy

- infoとhintは原則としてCI failにはしない候補とする。
- ただし、security riskやcontract riskを示す場合はHuman Owner review対象とする。
- info/hintもreportには記録する。

## 14. Tool and Configuration Failure Policy

- tool/config failureは品質確認不能のため、CI fail候補とする。
- Spectral config parse failureはfail候補とする。
- OpenAPI Draft YAML parse failureはfail候補とする。
- package script missingはfail候補とする。
- dependency install failureはfail候補とする。
- Node/pnpm version mismatchはwarningまたはfail候補とし、Human Owner判断で決める。

## 15. Known Finding Policy

- known findingはHuman Owner承認なしに許容しない。
- known findingを許容する場合は、理由、期限、対象rule、location、再確認条件を記録する。
- known findingの保存形式はlint result logging specificationまたは後続のexception policyで定義する。
- CI接続初期段階ではknown findingなしをbaselineとする。

## 16. Log and Report Handling Policy

- CI実行結果はOpenAPI Lint Result Logging Specificationと整合させる。
- CI logsの最終保存先は本計画では決定しない。
- CI implementation時は、Markdown report、CI raw log、artifact uploadの扱いを決める。
- CI logsにはSecret、Token、API Key、Password、private registry token、個人情報を保存しない。
- raw outputは必要最小限を保存する。

候補保存先:

- CI provider built-in logs
- implementation/test_results/openapi timestamped report
- CI artifact
- release evidence folder

## 17. Security and Secret Handling Policy

- CI secretsは実値を文書に記録しない。
- CI logsにSecret、Token、API Key、Password、private registry tokenを出力しない。
- package manager認証情報を使用する場合は、Secret handling policyに従う。
- private registry tokenをlint reportやCI logsに保存しない。
- OpenAPI Draft、Spectral config、example、descriptionに実在Secretを含めない。
- 許容URLは `https://api.example.invalid` のみとする。
- 実在URLを追加する場合は後続仕様またはHuman Owner判断を必要とする。

## 18. File Change and Scope Control Policy

- CI quality gateは検証のみを行う。
- CIはOpenAPI Draftを自動修正しない。
- CIはSpectral configを自動修正しない。
- CIはpackage.jsonまたはpnpm-lock.yamlを自動修正しない。
- CI implementation時に設定ファイルを追加する場合は、Human Owner review後に実施する。
- CI設定追加は本計画の範囲外である。

## 19. Human Owner Decision Points

Human Owner approvalが必要なポイント:

- CI providerを選定する前
- CI設定ファイルを作成する前
- CI triggerを有効化する前
- push to mainでCIを必須化する前
- pull requestでCIを必須化する前
- warningをfail扱いにする前
- warningをallow扱いにする前
- known findingを許容する前
- CI logsの保存先を確定する前
- CI artifactsの保存期間を確定する前
- SecretやCI variablesを登録する前
- package install方針を確定する前

## 20. CI Provider Decision Points

| Decision Point | Options | Current Decision | Notes |
|---|---|---|---|
| CI provider | GitHub Actions / GitLab CI / Azure Pipelines / CircleCI / other | Not decided by this plan | Human Owner review後に判断する。 |
| Repository host | GitHub / GitLab / other | Not decided by this plan | provider選定と合わせて確認する。 |
| Runner OS | Linux / Windows / macOS | Not decided by this plan | Node/pnpm差異を考慮する。 |
| Node.js setup method | provider action / preinstalled node / manual setup | Not decided by this plan | current environmentとの整合を確認する。 |
| pnpm setup method | packageManager / corepack / setup-pnpm equivalent | Not decided by this plan | packageManagerのpnpm@11.7.0を参照する。 |
| Dependency install command | `pnpm install --frozen-lockfile` / `pnpm install` | Not decided by this plan | lockfile状態を確認して決める。 |
| Cache strategy | no cache / pnpm store cache / dependency cache | Not decided by this plan | 初期MVPではcacheなしも候補。 |
| Artifact strategy | no artifact / raw log / Markdown report / bundled evidence | Not decided by this plan | logging specificationとの整合が必要。 |
| Branch protection integration | disabled / advisory / required | Not decided by this plan | required check化は別途承認が必要。 |
| Pull request required check | disabled / optional / required | Not decided by this plan | CI安定後に判断する。 |

## 21. Future CI Implementation Scope

Candidate future changes:

- CI provider選定
- CI設定ファイル作成
- Node.js setup
- pnpm setup
- dependency install step
- lint:openapi:version step
- lint:openapi step
- result summary step
- artifact upload候補
- branchまたはPR trigger設定候補
- documentation update
- CHANGELOG update

本作業では上記を実施しない。

## 22. Future CI Verification Candidate Commands

将来のCI implementation後に確認する候補コマンド:

```powershell
pnpm --version
node --version
pnpm run lint:openapi:version
pnpm run lint:openapi
node -e "require('yaml').parse(require('fs').readFileSync('implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml','utf8')); console.log('OpenAPI Draft YAML parse OK')"
node -e "require('yaml').parse(require('fs').readFileSync('implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml','utf8')); console.log('Spectral config YAML parse OK')"
```

本作業では実行しない。

## 23. Risk Review

- CI導入時にlockfile状態が不安定だとinstall failureが発生する可能性がある。
- warningをallowにすると品質退行を見逃す可能性がある。
- warningをfailにすると初期開発速度が落ちる可能性がある。
- tool/config failureをallowにすると品質確認不能のまま通過する可能性がある。
- CI logsにSecretが出力されると重大なセキュリティ事故になる。
- CI provider未決定のまま具体設定を作ると手戻りが発生する。
- ローカル環境とCI環境のNode/pnpm差異で結果が変わる可能性がある。
- 未追跡ファイルが多い状態でCI接続すると、対象ファイルの取り込み漏れが起きる可能性がある。

## 24. Out-of-scope Items

- CI設定ファイル作成
- GitHub Actions設定
- GitLab CI設定
- Azure Pipelines設定
- CircleCI設定
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

## 25. Acceptance Criteria

- OpenAPI_CI_Quality_Gate_Plan.md が作成されている。
- CHANGELOG.md が更新されている。
- Current CI Readiness Baselineが記載されている。
- CI Quality Gate Principlesが記載されている。
- Candidate CI Trigger Policyが記載されている。
- Candidate CI Execution Environmentが記載されている。
- Candidate CI Commandsが記載されている。
- Pass and Fail Decision Policyが記載されている。
- Error Handling Policyが記載されている。
- Warning Handling Policyが記載されている。
- Info and Hint Handling Policyが記載されている。
- Tool and Configuration Failure Policyが記載されている。
- Known Finding Policyが記載されている。
- Log and Report Handling Policyが記載されている。
- Security and Secret Handling Policyが記載されている。
- File Change and Scope Control Policyが記載されている。
- Human Owner Decision Pointsが記載されている。
- CI Provider Decision Pointsが記載されている。
- Future CI Implementation Scopeが記載されている。
- Future CI Verification Candidate Commandsが記載されている。
- Risk Reviewが記載されている。
- CI設定ファイルを作成していない。
- .githubフォルダを作成していない。
- Spectral lintを実行していない。
- OpenAPI Draftを変更していない。
- Spectral configを変更していない。
- package.jsonを変更していない。
- pnpm-lock.yamlを変更していない。
- package scriptを変更していない。
- test_resultsを更新していない。

## 26. Items Deferred to Later Specifications

- CI provider selection
- CI implementation execution
- CI log storage policy
- CI artifact retention policy
- branch protection planning
- PR required check planning
- known finding exception policy
- API contract test implementation planning
- Phase 1 implementation preparation

## 27. Items Not Decided by This Plan

- CI provider
- repository host上のrequired check設定
- CI triggerの最終範囲
- warningをfail扱いにするか
- info/hintを完全にallowするか
- CI logsの保存先
- CI artifactsの保存期間
- branch protectionの有無
- PR required checkの有無
- known findingの最大許容期間
- CIでMarkdown reportを自動生成するか

## 28. Validation Results

| Check | Result | Notes |
|---|---|---|
| 最新Manual OpenAPI lint recheck reportを参照した | Pass | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.mdを参照。 |
| 最新Manual OpenAPI lint recheckがPassであることを確認した | Pass | Result Pass、Exit code 0、0 errors / 0 warnings / 0 infos / 0 hints。 |
| OpenAPI_Lint_Result_Logging_Specification.mdを参照した | Pass | implementation/test_specifications/OpenAPI_Lint_Result_Logging_Specification.mdが存在。 |
| OpenAPI_Lint_Package_Script_Plan.mdを参照した | Pass | implementation/test_specifications/OpenAPI_Lint_Package_Script_Plan.mdが存在。 |
| package.json scriptsを確認した | Pass | `lint:openapi` と `lint:openapi:version` が存在。 |
| Current CI Readiness Baselineを記載した | Pass | Section 5に記載。 |
| Candidate CI Trigger Policyを記載した | Pass | Section 7に記載。 |
| Candidate CI Execution Environmentを記載した | Pass | Section 8に記載。 |
| Candidate CI Commandsを記載した | Pass | Section 9に記載。 |
| Pass and Fail Decision Policyを記載した | Pass | Section 10に記載。 |
| Error Handling Policyを記載した | Pass | Section 11に記載。 |
| Warning Handling Policyを記載した | Pass | Section 12に記載。 |
| Tool and Configuration Failure Policyを記載した | Pass | Section 14に記載。 |
| Human Owner Decision Pointsを記載した | Pass | Section 19に記載。 |
| CI Provider Decision Pointsを記載した | Pass | Section 20に記載。 |
| Future CI Implementation Scopeを記載した | Pass | Section 21に記載。 |
| Spectral lintを実行していない | Pass | 本作業では候補コマンドを実行していない。 |
| CI設定ファイルを作成していない | Pass | `.github`、gitlab-ci.yml、azure-pipelines.yml、circle.ymlを作成していない。 |
| OpenAPI Draftを変更していない | Pass | 本作業の変更対象外。 |
| Spectral configを変更していない | Pass | 本作業の変更対象外。 |
| package.jsonを変更していない | Pass | 本作業の変更対象外。 |
| pnpm-lock.yamlを変更していない | Pass | 本作業の変更対象外。 |
| test_resultsを更新していない | Pass | 本作業では読み取りのみ。 |

## 29. Next Actions

1. Human Owner review of OpenAPI CI Quality Gate Plan
2. CI provider selection
3. CI implementation execution
