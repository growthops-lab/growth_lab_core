# OpenAPI Lint Package Script Plan

Document Name: Growth Lab Core OpenAPI Lint Package Script Plan
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related Spectral Config: implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml
Related Lint Specification: implementation/test_specifications/OpenAPI_Lint_Specification.md
Related Tool Selection: implementation/test_specifications/OpenAPI_Lint_Tool_Selection.md
Related Semantic Validation Plan: implementation/test_specifications/Spectral_Semantic_Validation_Plan.md
Related Installation Plan: implementation/test_specifications/OpenAPI_Lint_Tool_Installation_Plan.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/OpenAPI_Lint_Package_Script_Plan.md
Created Date: 2026-07-09
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本計画は、Approval Gate OpenAPI DraftのSpectral lint実行を簡単にするpackage.json scriptの将来追加方針を定義する。

本計画は、Spectral CLI installation execution完了後の次段階として、script名、実行対象、成功条件、失敗条件を整理する。

本計画は、将来のSpectral semantic validation executionおよびCI quality gate planningの前段資料である。

本計画では、package.jsonの変更、script追加、Spectral lint実行、CI設定は行わない。

## 2. Scope

対象:

- package.json script追加計画
- script名候補
- MVP推奨script set
- script command候補
- 実行対象OpenAPI Draft
- 使用ruleset
- script実行境界
- 成功条件
- 失敗条件
- exit code handling
- manual execution方針
- CI readiness方針
- Human Owner approval points
- script addition report requirements

対象外:

- package.json変更
- pnpm-lock.yaml変更
- package script追加
- Spectral lint実行
- CI設定
- lint result logging
- test_resultsフォルダ作成
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

This plan does not modify package.json or pnpm-lock.yaml.

This plan does not add package scripts.

This plan does not execute Spectral lint.

This plan defines future package script planning for OpenAPI lint execution.

Secret values, tokens, API keys, passwords, and recovery codes must not be used in examples, commands, outputs, requests, responses, or error messages.

Detailed SNS, ASP, and affiliate terms review is delegated to later specifications or official-source confirmation.

本計画は、package.jsonやpnpm-lock.yamlを変更しない。

本計画は、package scriptを追加しない。

本計画は、Spectral lintを実行しない。

本計画は、OpenAPI lint実行のための将来package script計画を定義する。

Secret、Token、API Key、Password、Recovery Codeなどの実体値を例、コマンド、出力例、Request、Response、Error Messageに使用しない。

SNS、ASP、アフィリエイト規約の詳細確認は、後続仕様または公式情報確認へ委譲する。

## 4. Relationship to Existing OpenAPI Lint Artifacts

- OpenAPI Lint Tool Selectionは、Spectral CLIをMVP Primary candidateとしている。
- OpenAPI Lint Tool Installation Planは、Spectral CLI導入方針を定義している。
- Spectral CLI installation executionにより、@stoplight/spectral-cliはdevDependencyとして導入済みである。
- approval_gate_openapi_spectral.yamlは、Spectral CLI向けruleset draftである。
- Spectral Semantic Validation Planは、将来のSpectral lint実行計画を定義している。
- 本計画は、将来package.jsonに追加するscript候補を定義する。

## 5. Package Script Planning Principles

- script追加はHuman Owner承認後に別作業として実行する。
- scriptはpnpm環境でのローカルdevDependency実行を前提とする。
- scriptはOpenAPI DraftとSpectral configの対象を明示する。
- script名は短く、役割が分かる名称にする。
- MVPでは最小限のscriptから始める。
- CI接続は後続仕様へ委譲する。
- script追加時にOpenAPI DraftやLint configを自動修正しない。
- script実行結果がerrorの場合、完了不可候補とする。
- script実行結果がwarnのみの場合、Human Owner review対象とする。

## 6. Current Environment Status

| Item | Current Status | Notes |
|---|---|---|
| Repository root | C:\claudcode_ap\growth_lab_core | 作業場所として確認済み。 |
| Package manager | pnpm | package.jsonのpackageManagerでpnpm@11.7.0を確認。 |
| package.json | Exists | 本作業では変更しない。 |
| pnpm-lock.yaml | Exists | 本作業では変更しない。 |
| @stoplight/spectral-cli | Installed as devDependency | package.jsonで^6.16.1を確認。 |
| pnpm exec spectral --version | 6.16.1 | 前工程で成功済み。 |
| OpenAPI Draft | Exists | implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml。 |
| OpenAPI Draft version | 3.1.0 | openapi: 3.1.0を確認。 |
| Spectral config draft | Exists | implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml。 |
| OpenAPI Lint Specification | Exists | implementation/test_specifications/OpenAPI_Lint_Specification.md。 |
| Semantic Validation Plan | Exists | implementation/test_specifications/Spectral_Semantic_Validation_Plan.md。 |
| Existing scripts | Exists | package.jsonに既存scriptsあり。lint:openapiは未追加。 |
| CI integration | Not created in this task | 本計画ではCI設定を作成しない。 |

## 7. Script Addition Target

| Target File | Expected Future Change | This Task Change | Notes |
|---|---|---|---|
| package.json | 将来scriptを追加する対象。 | No change | 本作業では変更しない。 |
| pnpm-lock.yaml | script追加のみであれば通常変更想定なし。 | No change | 本作業では変更しない。 |

## 8. Candidate Package Scripts

| Candidate Script Name | Candidate Command | Purpose | MVP Recommended | Notes |
|---|---|---|---|---|
| lint:openapi | spectral lint -r implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | 標準的なOpenAPI lint実行候補。 | Yes | 本作業ではpackage.jsonへ追加しない。 |
| lint:openapi:verbose | spectral lint -r implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml --verbose | 詳細調査用のlint実行候補。 | Later | 初期導入時の調査には有用だがMVP必須ではない。 |
| lint:openapi:version | spectral --version | 導入確認と環境確認用。 | Yes | 本作業では実行しない。 |

候補script:

```json
{
  "lint:openapi": "spectral lint -r implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml",
  "lint:openapi:verbose": "spectral lint -r implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml --verbose",
  "lint:openapi:version": "spectral --version"
}
```

上記は将来追加候補であり、本作業ではpackage.jsonへ追加しない。

package.json scripts内では、pnpm exec spectralではなくspectralコマンドを使う候補とする。これはnpm互換script実行時にnode_modules/.binがPATHに入る前提である。

## 9. Recommended MVP Script Set

Recommended MVP script set:

1. lint:openapi
2. lint:openapi:version

Optional later script:

- lint:openapi:verbose

理由:

- lint:openapi は標準的なOpenAPI lint実行用である。
- lint:openapi:version は導入確認と環境確認に使える。
- lint:openapi:verbose は初期導入時の詳細調査に有用だが、MVPでは必須ではない。

## 10. Script Command Details

| Script | Command Detail | Input File | Ruleset | Expected Output | Notes |
|---|---|---|---|---|---|
| lint:openapi | spectral lint -r implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml | lint結果の標準出力。 | 将来追加後に手動確認する。 |
| lint:openapi:version | spectral --version | None | None | Spectral CLI version。 | 環境確認用。 |
| lint:openapi:verbose | spectral lint -r implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml --verbose | implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml | verbose lint結果の標準出力。 | 調査用の任意候補。 |

## 11. Script Execution Boundary

- scriptはSpectral lintを実行するだけである。
- scriptはOpenAPI Draftを変更しない。
- scriptはLint configを変更しない。
- scriptはpackage.jsonを変更しない。
- scriptはpnpm-lock.yamlを変更しない。
- scriptはtest_resultsフォルダを作成しない。
- scriptはログファイルを自動保存しない。
- scriptはCI設定を行わない。
- scriptは外部SNS、ASP、WordPress、OAuth、DB、UIへ接続しない。

## 12. Expected Files to Change During Future Script Addition

| File | Expected Change | Review Required | Notes |
|---|---|---|---|
| package.json | scriptsへlint:openapiおよびlint:openapi:versionを追加する候補。 | Yes | 本作業では変更しない。 |

## 13. Files Not Expected to Change During Future Script Addition

| File or Directory | Expected Change | Notes |
|---|---|---|
| pnpm-lock.yaml | No change expected | script追加のみであれば通常変更しない。 |
| implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | No change expected | lint対象であり、script追加対象ではない。 |
| implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml | No change expected | rulesetであり、script追加対象ではない。 |
| implementation/test_specifications | No existing file changes expected | script plan以外の既存仕様は変更しない。 |
| architecture/master | No change expected | Master Architecture本文は変更しない。 |
| architecture/master/adr | No change expected | ADR本文とADR READMEは変更しない。 |
| implementation/api_designs | No change expected | API設計は変更しない。 |
| implementation/data_models | No change expected | データモデルは変更しない。 |
| implementation/checklists | No change expected | チェックリストは変更しない。 |
| implementation/policies | No change expected | ポリシーは変更しない。 |
| implementation/specifications | No change expected | 仕様群は変更しない。 |
| templates | No change expected | テンプレートは変更しない。 |

## 14. Pre-addition Checklist

- Human Owner approvalを取得する。
- package.jsonの既存scriptsを確認する。
- lint:openapiが未定義であることを確認する。
- lint:openapi:versionが未定義であることを確認する。
- @stoplight/spectral-cliがdevDependencyとして導入済みであることを確認する。
- pnpm exec spectral --versionが成功することを確認する。
- OpenAPI Draftが存在することを確認する。
- Spectral config draftが存在することを確認する。
- OpenAPI Draftがopenapi: 3.1.0であることを確認する。
- 実在URLを追加しないことを確認する。
- Secret、Token、API Key、Password、Recovery Codeなどの実体値を追加しないことを確認する。
- script追加後に変更してよいファイルを明確化済みであることを確認する。

## 15. Post-addition Verification Candidate Commands

将来のscript追加後に実行する確認候補:

```powershell
cd /d C:\claudcode_ap\growth_lab_core
pnpm run lint:openapi:version
pnpm run lint:openapi
```

任意候補:

```powershell
pnpm run lint:openapi:verbose
```

注意:

- 本作業では実行しない。
- script追加後の実行可否は別作業で確認する。
- lint実行結果の保存先は後続仕様で決定する。

## 16. Success and Failure Policy

| Result | Meaning | Required Action | Completion Impact |
|---|---|---|---|
| Version command success | Spectral CLI実行環境を確認できる。 | versionを報告する。 | Pass候補。 |
| Lint pass | lint対象が設定ルールを満たす。 | 結果を報告する。 | Pass候補。 |
| Lint pass with info | 軽微な改善候補がある。 | 改善候補として記録する。 | Human Owner review対象。 |
| Lint pass with warning | Major相当の確認事項がある。 | Human Owner reviewへ回す。 | 条件付きPass候補。 |
| Lint fail with error | BlockerまたはCritical相当の可能性がある。 | 原因確認と修正計画を作る。 | 完了不可候補。 |
| Script command not found | package scriptが未追加または名称不一致。 | package.jsonを確認する。 | 完了不可候補。 |
| Spectral command not found | devDependencyまたはPATH解決に問題がある。 | 依存関係とpnpm実行環境を確認する。 | 完了不可候補。 |
| Ruleset file not found | Spectral config pathが不正。 | pathを確認する。 | 完了不可候補。 |
| OpenAPI file not found | OpenAPI Draft pathが不正。 | pathを確認する。 | 完了不可候補。 |
| Unexpected file modification | script実行で想定外のファイルが変わった。 | git diffを確認し原因を報告する。 | 完了不可候補。 |

## 17. Exit Code Handling Policy

- lint:openapiのexit code 0は、MVPではPass候補とする。
- lint:openapiのexit code非0は、原因確認が必要であり完了不可候補とする。
- SpectralのerrorはBlockerまたはCritical相当として扱う。
- SpectralのwarnはMajor相当としてHuman Owner review対象とする。
- infoやhintは改善候補として記録する。
- exit codeのCI上の扱いはCI quality gate planningで決定する。

## 18. Manual Execution Policy

- MVPでは、script追加後すぐにCI接続せず、まず手動実行で確認する。
- 手動実行時はgit diffを確認してから実行する。
- 実行結果は完了報告に記載する。
- 実行ログ保存は後続のlint result logging specificationで決定する。
- Secret、Token、API Key、Passwordが出力に含まれていないことを確認する。

## 19. CI Readiness Policy

- 本計画ではCI設定を作成しない。
- lint:openapiが手動実行で安定した後にCI接続を検討する。
- CI接続時はBlockerまたはCritical相当のerrorで失敗させる候補とする。
- warnの扱いはHuman Owner判断またはCI quality gate planningで決定する。
- CI対象ブランチ、実行タイミング、ログ保存先は後続仕様で決定する。

## 20. Security and Secret Handling Policy

- package scriptにはSecret、Token、API Key、Passwordを含めない。
- package scriptにはprivate registry tokenを含めない。
- package scriptには実在外部サービスURLを含めない。
- 許容URLは既存placeholderである https://api.example.invalid のみとする。
- script実行出力にSecret実体が含まれていないことを確認する。
- Error outputにもSecret実体が含まれていないことを確認する。

## 21. Human Owner Approval Points

Human Owner approvalが必要なポイント:

- package.jsonにscriptを追加する前
- script名を確定する前
- lint:openapiを初回実行する前
- lint:openapi:verboseを追加する前
- CIへ接続する前
- warnを許容する前
- errorを解消済み扱いにする前
- lint結果ログ保存方式を決める前

## 22. Future Script Addition Report Requirements

将来のscript追加実行後に必要な報告項目:

- 実行日時
- 実行ディレクトリ
- 変更ファイル
- 追加script名
- 追加script内容
- package.json差分
- pnpm-lock.yaml変更有無
- pnpm run lint:openapi:version結果
- pnpm run lint:openapi結果
- exit code
- error件数
- warn件数
- infoまたはhint件数
- OpenAPI Draft変更有無
- Lint config変更有無
- 変更禁止ファイルの変更有無
- Secret混入有無
- 実在URL混入有無
- 次の推奨作業

## 23. Out-of-scope Items

- package.json変更
- package script追加
- pnpm-lock.yaml変更
- Spectral lint実行
- semantic validation実行
- CI設定
- lint result logging
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

## 24. Acceptance Criteria

- package script planningの目的が定義されている。
- Current Environment Statusが定義されている。
- Script Addition Targetが定義されている。
- Candidate Package Scriptsが定義されている。
- Recommended MVP Script Setが定義されている。
- Script Command Detailsが定義されている。
- Script Execution Boundaryが定義されている。
- Expected Files to Change During Future Script Additionが定義されている。
- Files Not Expected to Change During Future Script Additionが定義されている。
- Pre-addition Checklistが定義されている。
- Post-addition Verification Candidate Commandsが定義されている。
- Success and Failure Policyが定義されている。
- Exit Code Handling Policyが定義されている。
- Manual Execution Policyが定義されている。
- CI Readiness Policyが定義されている。
- Security and Secret Handling Policyが定義されている。
- Human Owner Approval Pointsが定義されている。
- Future Script Addition Report Requirementsが定義されている。
- package.jsonを変更していない。
- pnpm-lock.yamlを変更していない。
- package scriptを追加していない。
- Spectral lintを実行していない。
- OpenAPI Draftを変更していない。
- Lint configを変更していない。
- CI設定を作成していない。

## 25. Items Deferred to Later Specifications

- package.json script addition
- package script実行
- Spectral semantic validation execution
- lint result logging specification
- CI quality gate planning
- CI integration
- OpenAPI Draft remediation specification
- Lint config remediation specification
- API contract test implementation planning

## 26. Items Not Decided by This Plan

- package script追加実行日
- lint:openapi:verboseをMVPに含めるか
- lint結果ログ保存先の最終決定
- CIツール
- CI実行条件
- warnのCI上の扱い
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

## 27. Validation Results

| Check | Result | Notes |
|---|---|---|
| package.jsonを参照した | Pass | packageManagerとdevDependenciesを確認。 |
| pnpm-lock.yamlを参照した | Pass | ファイル存在を確認。 |
| OpenAPI_Lint_Tool_Installation_Plan.mdを参照した | Pass | ファイル存在を確認。 |
| Spectral_Semantic_Validation_Plan.mdを参照した | Pass | ファイル存在を確認。 |
| OpenAPI_Lint_Tool_Selection.mdを参照した | Pass | Spectral CLIがMVP Primary candidateであることを確認。 |
| OpenAPI_Lint_Specification.mdを参照した | Pass | 既存lint仕様を確認。 |
| approval_gate_openapi_spectral.yamlを参照した | Pass | Spectral ruleset draftを確認。 |
| Approval_Gate_OpenAPI_Draft.yamlを参照した | Pass | openapi: 3.1.0を確認。 |
| Current Environment Statusを定義した | Pass | Section 6に定義。 |
| Script Addition Targetを定義した | Pass | Section 7に定義。 |
| Candidate Package Scriptsを定義した | Pass | Section 8に定義。 |
| Recommended MVP Script Setを定義した | Pass | Section 9に定義。 |
| Script Command Detailsを定義した | Pass | Section 10に定義。 |
| Script Execution Boundaryを定義した | Pass | Section 11に定義。 |
| Expected Files to Change During Future Script Additionを定義した | Pass | Section 12に定義。 |
| Files Not Expected to Change During Future Script Additionを定義した | Pass | Section 13に定義。 |
| Pre-addition Checklistを定義した | Pass | Section 14に定義。 |
| Post-addition Verification Candidate Commandsを定義した | Pass | Section 15に定義。 |
| Success and Failure Policyを定義した | Pass | Section 16に定義。 |
| Exit Code Handling Policyを定義した | Pass | Section 17に定義。 |
| Manual Execution Policyを定義した | Pass | Section 18に定義。 |
| CI Readiness Policyを定義した | Pass | Section 19に定義。 |
| Security and Secret Handling Policyを定義した | Pass | Section 20に定義。 |
| Human Owner Approval Pointsを定義した | Pass | Section 21に定義。 |
| Future Script Addition Report Requirementsを定義した | Pass | Section 22に定義。 |
| package.jsonを変更していない | Pass | 本作業では未変更。 |
| pnpm-lock.yamlを変更していない | Pass | 本作業では未変更。 |
| package scriptを追加していない | Pass | 計画のみ。 |
| Spectral lintを実行していない | Pass | lintコマンド未実行。 |
| CI設定を作成していない | Pass | 未作成。 |
| Lint configを変更していない | Pass | 未変更。 |
| OpenAPI Draftを変更していない | Pass | 未変更。 |
| API実装をしていない | Pass | 未実装。 |
| DB実装をしていない | Pass | 未実装。 |
| SQLを作成していない | Pass | 未作成。 |
| OAuth実装をしていない | Pass | 未実装。 |
| UI実装をしていない | Pass | 未実装。 |
| 実APIを呼び出していない | Pass | 呼び出しなし。 |
| 外部サービスへ接続していない | Pass | 接続なし。 |
| 法務判断をしていない | Pass | 後続仕様または公式情報確認へ委譲。 |
| SNS規約詳細を断定していない | Pass | 断定なし。 |
| ASP規約詳細を断定していない | Pass | 断定なし。 |
| アフィリエイト規約詳細を断定していない | Pass | 断定なし。 |
| Secret実体を含めていない | Pass | 実体値なし。 |
| 実在URLを含めていない | Pass | 許容placeholderのみ。 |
| 文字化けがない | Pass | UTF-8 Markdownとして作成。 |
| 置換文字がない | Pass | 置換文字なし。 |
| コードブロック数が偶数 | Pass | 開始と終了を対応させた。 |
| 作業前後のgit diffを確認した | Pass | 作業前確認済み。作業後に再確認する。 |

## 28. Next Actions

- Human Owner review of OpenAPI Lint Package Script Plan
- package.json script addition
- Spectral semantic validation execution
- lint result logging specification
- CI quality gate planning
- API contract test implementation planning
- Phase 1 implementation preparation
