# OpenAPI Lint Tool Selection

Document Name: Growth Lab Core OpenAPI Lint Tool Selection
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related Lint Specification: implementation/test_specifications/OpenAPI_Lint_Specification.md
Related API Test Specification: implementation/test_specifications/Approval_Gate_API_Test_Specification.md
Related API Design: implementation/api_designs/Approval_Gate_API_Design.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/OpenAPI_Lint_Tool_Selection.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本ツール選定文書は、Approval Gate OpenAPI Draftの静的検証に使用するOpenAPI lintツール候補を評価する。

本ツール選定文書は、OpenAPI Lint Specificationで定義したlintルールを将来実行可能にするための前段資料である。

本ツール選定文書は、MVPで採用するPrimary candidate、Secondary candidate、Supplemental candidateを整理する。

本ツール選定文書は、ツール導入、設定、CI実装を行わない。

## 2. Scope

対象:

- OpenAPI lint tool候補の整理
- MVP Primary candidate選定
- Secondary candidate選定
- Supplemental candidate整理
- Parse-only helper整理
- 選定基準
- 採用理由
- 非採用理由
- 導入前提
- 設定作成方針
- CI接続方針
- Secret混入防止観点

対象外:

- ツールインストール
- Lint config作成
- package.json変更
- pnpm-lock.yaml変更
- CI設定
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

This tool selection document does not install or configure lint tools.

This tool selection document does not modify package.json, pnpm-lock.yaml, or the OpenAPI draft.

This tool selection document defines MVP candidate tools for future OpenAPI lint implementation.

Secret values, tokens, API keys, passwords, and recovery codes must not be used in examples, tool configuration examples, requests, responses, or error messages.

Detailed SNS, ASP, and affiliate terms review is delegated to later specifications or official-source confirmation.

本ツール選定文書は、Lintツールの導入や設定を行わない。

本ツール選定文書は、package.json、pnpm-lock.yaml、OpenAPI Draftを変更しない。

本ツール選定文書は、将来のOpenAPI lint実装に向けたMVP候補ツールを定義する。

Secret、Token、API Key、Password、Recovery Codeなどの実体値を例、設定例、Request、Response、Error Messageに使用しない。

SNS、ASP、アフィリエイト規約の詳細確認は、後続仕様または公式情報確認へ委譲する。

## 4. Relationship to OpenAPI Lint Specification

- OpenAPI Lint Specificationは、lint対象、Severity、Rule ID、検証ルールを定義する。
- OpenAPI Lint Tool Selectionは、それらのルールを将来どのツールで実行するかを検討する。
- 本文書は、Lint Specificationを置き換えない。
- 本文書は、後続のOpenAPI lint config creationに接続する。

## 5. Selection Principles

- OpenAPI 3.1.0に対応できることを重視する。
- YAML / JSONのOpenAPI文書を扱えることを重視する。
- カスタムルールを定義できることを重視する。
- 実在URLやSecret混入防止など、プロジェクト固有ルールへ対応しやすいことを重視する。
- pnpm環境に導入しやすいことを重視する。
- CLIでローカル実行しやすいことを重視する。
- 将来CIへ接続しやすいことを重視する。
- MVPでは単一Primary toolに過度依存せず、YAML parse補助検証も併用する。
- 公式ドキュメントによる最終確認とバージョン固定は後続仕様で行う。

## 6. Current Project Environment

| Item | Current Status | Notes |
|---|---|---|
| Repository root | C:\claudcode_ap\growth_lab_core | 作業ルート。 |
| Package manager | pnpm | package.jsonでpnpm@11.7.0を確認。 |
| package.json | Exists | 本作業では変更しない。 |
| pnpm-lock.yaml | Exists | 本作業では変更しない。 |
| OpenAPI draft path | implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | 本作業では変更しない。 |
| OpenAPI version | 3.1.0 | OpenAPI Draftの先頭で確認。 |
| PyYAML availability | Available | import yamlで確認。 |
| Node yaml availability | Available | Node require('yaml')で確認。 |
| Existing lint specification | Exists | implementation/test_specifications/OpenAPI_Lint_Specification.md。 |
| Existing API test specification | Exists | implementation/test_specifications/Approval_Gate_API_Test_Specification.md。 |
| yaml npm package | Installed as devDependency | package.jsonで確認。 |

## 7. Candidate Tool Overview

| Tool | Category | Main Use | MVP Candidate Role | Notes |
|---|---|---|---|---|
| Spectral CLI | OpenAPI lint tool | Custom lint rules for OpenAPI documents. | Primary candidate | Project-specific rules are the main selection reason. |
| Redocly CLI | OpenAPI quality tool | OpenAPI quality checks, bundle, and future documentation workflow support. | Secondary candidate | Useful beyond lint, but not MVP primary. |
| IBM OpenAPI Validator | OpenAPI validator | Specification compliance and best-practice checks. | Supplemental candidate | Supplemental validation candidate. |
| OpenAPI Generator validate | Spec validation utility | Validate spec before generation workflows. | Supplemental candidate | Useful for validation, not lint governance primary. |
| PyYAML | YAML parser | YAML parse verification. | Parse-only helper | Not an OpenAPI governance lint tool. |
| Node yaml | YAML parser | Node-based YAML parse verification. | Parse-only helper | Useful in Node / pnpm environment. |

## 8. Evaluation Criteria

| Criterion | Description | Weight | Notes |
|---|---|---|---|
| OpenAPI 3.1 compatibility | OpenAPI 3.1.0 Draftを扱えること。 | High | 最終確認は後続仕様。 |
| YAML support | YAML形式のOpenAPI文書を扱えること。 | High | Approval Gate DraftはYAML。 |
| Custom rule support | Project-specific lint ruleを定義できること。 | High | Secret、URL、状態遷移説明の検証に必要。 |
| CLI usability | ローカルCLIで実行しやすいこと。 | High | Phase 1実装前の手動実行にも必要。 |
| pnpm / Node ecosystem fit | pnpm環境へ導入しやすいこと。 | Medium | package managerはpnpm。 |
| CI readiness | 将来CIへ接続しやすいこと。 | High | 品質ゲート化を想定。 |
| Secret detection extensibility | Secret混入検出ルールを表現しやすいこと。 | High | Blocker扱い。 |
| Real URL detection extensibility | 実在URL検出ルールを表現しやすいこと。 | High | placeholder以外はBlocker扱い。 |
| Status transition rule expression | description等の状態遷移制約を検証しやすいこと。 | Medium | 完全自動化は後続検討。 |
| Error response rule expression | ErrorResponse安全性を検証しやすいこと。 | Medium | Secret混入防止と連動。 |
| Maintenance and documentation | 継続利用に必要な情報が得やすいこと。 | Medium | 公式確認は後続仕様へ委譲。 |
| MVP simplicity | MVP段階で導入範囲を抑えやすいこと。 | High | 過剰導入を避ける。 |

## 9. Candidate Evaluation Matrix

| Tool | OpenAPI 3.1 | Custom Rules | CLI | pnpm Fit | Secret / URL Rule Fit | MVP Simplicity | Recommended Role | Notes |
|---|---|---|---|---|---|---|---|---|
| Spectral CLI | Expected Fit | Strong | Strong | Strong | Strong | Medium | Primary candidate | Custom rulesを重視するMVP方針に合う。 |
| Redocly CLI | Expected Fit | Medium | Strong | Strong | Medium | Medium | Secondary candidate | Quality check、bundle、docs連携も見据える。 |
| IBM OpenAPI Validator | Expected Fit | Medium | Medium | Medium | Medium | Medium | Supplemental candidate | 仕様準拠やbest practice確認の補助。 |
| OpenAPI Generator validate | Expected Fit | Limited | Medium | Medium | Limited | Medium | Supplemental candidate | 生成前spec validation用途。 |
| PyYAML | Parse only | None | Strong | Not applicable | None | Strong | Parse-only helper | YAML parse確認用。 |
| Node yaml | Parse only | None | Strong | Strong | None | Strong | Parse-only helper | Node環境でのYAML parse確認用。 |

## 10. Recommended MVP Selection

Recommended MVP selection:

- Primary: Spectral CLI
- Secondary: Redocly CLI
- Supplemental: IBM OpenAPI Validator
- Supplemental: OpenAPI Generator validate
- Parse-only helpers: PyYAML
- Parse-only helpers: Node yaml

理由:

- OpenAPI Lint Specificationで定義したプロジェクト固有ルールを将来実装するには、カスタムルール対応を重視する必要がある。
- Spectral CLIをPrimary candidateとする。
- Redocly CLIはOpenAPI品質チェック、bundle、ドキュメント生成連携を見据えたSecondary candidateとする。
- IBM OpenAPI ValidatorとOpenAPI Generator validateは補助的な仕様検証候補とする。
- PyYAMLとNode yamlは既にYAML parse検証に使用できるため、parse-only helperとして位置づける。

## 11. Primary Tool Candidate

| Item | Description |
|---|---|
| Tool | Spectral CLI |
| Recommended Role | Primary candidate |
| Reason | OpenAPI Lint Specificationのカスタムルール化に向いているため。 |
| Expected Future Use | OpenAPI root、paths、schemas、securitySchemes、実在URL禁止、Secret混入防止、description内の状態遷移ルール確認。 |
| Expected Config File | 後続仕様で決定する。現時点では作成しない。 |
| Expected Command | 後続仕様で決定する。現時点では実行しない。 |
| Strength | Project-specific governance ruleを表現しやすい候補。 |
| Concern | OpenAPI 3.1対応範囲、設定形式、バージョン固定は後続仕様で公式確認が必要。 |
| Decision | MVP Primary candidateとして採用候補。 |

## 12. Secondary Tool Candidate

| Item | Description |
|---|---|
| Tool | Redocly CLI |
| Recommended Role | Secondary candidate |
| Reason | OpenAPI品質チェック、bundle、将来のドキュメント生成連携に利用できる可能性があるため。 |
| Expected Future Use | OpenAPI quality check、bundle、documentation workflowとの接続検討。 |
| Expected Config File | 後続仕様で決定する。現時点では作成しない。 |
| Expected Command | 後続仕様で決定する。現時点では実行しない。 |
| Strength | lint以外のOpenAPI運用にも展開できる可能性。 |
| Concern | MVP Primaryはproject-specific custom rule実装を重視するためSpectral CLIを優先する。 |
| Decision | MVP Secondary candidateとして採用候補。 |

## 13. Supplemental Tool Candidates

| Tool | Recommended Role | Expected Use | Reason Not Primary | Notes |
|---|---|---|---|---|
| IBM OpenAPI Validator | Supplemental candidate | OpenAPI仕様準拠やベストプラクティス確認の補助候補。 | Project-specific custom ruleのPrimary実装候補としてはSpectral CLIを優先するため。 | 導入可否は後続仕様で確認する。 |
| OpenAPI Generator validate | Supplemental candidate | 生成前のspec validation補助候補。 | lint governance全体のPrimary候補ではないため。 | API client/server generation導入時に再検討する。 |
| PyYAML | Parse-only helper | YAML parse確認用。 | OpenAPI構造やAPI governanceルールを直接検証するlint toolではないため。 | 既にparse確認に使用可能。 |
| Node yaml | Parse-only helper | Node環境でのYAML parse確認用。 | OpenAPI構造やAPI governanceルールを直接検証するlint toolではないため。 | pnpm / Node環境の補助確認に使える。 |

## 14. Tools Not Selected for MVP Primary Use

- Redocly CLIはPrimaryではなくSecondaryとする。理由は、今回のLint Specificationではプロジェクト固有のカスタムルールを重視するため。
- IBM OpenAPI ValidatorはPrimaryではなくSupplementalとする。理由は、汎用OpenAPI検証やベストプラクティス確認として有用だが、プロジェクト固有ルールのPrimary実装候補としてはSpectral CLIを優先するため。
- OpenAPI Generator validateはPrimaryではなくSupplementalとする。理由は、spec validation用途として有用だが、lint governance全体のPrimary候補ではないため。
- PyYAML / Node yamlはParse-only helperとする。理由は、OpenAPI構造やAPI governanceルールを直接検証するlint toolではないため。

## 15. Security and Secret Handling Considerations

- 選定ツールは、Secret、Token、API Key、Password混入検出ルールを将来実装できることを重視する。
- ただし、実在Secret形式の具体例は設定例や文書例に記載しない。
- 実在URL検出ルールでは、https://api.example.invalid のみ許容する方針を維持する。
- Error Response内のSecret混入検出も将来のlint対象とする。
- Lint tool selection文書内にも実在Secretや実在Tokenを含めない。

## 16. Integration Policy

- 本作業ではツール導入を行わない。
- 後続のOpenAPI lint config creationでPrimary tool向けの設定方針を具体化する。
- 後続のCI設計でBlocker、Critical違反時の失敗条件を定義する。
- 既存のPyYAMLとNode yamlは、YAML parseの補助検証として継続利用できる。
- OpenAPI lint toolは、OpenAPI Draftの品質ゲートとしてPhase 1実装前に導入を検討する。

## 17. Installation Policy

- 本作業ではインストールを行わない。
- package.jsonを変更しない。
- pnpm-lock.yamlを変更しない。
- 導入時はpnpmを前提にする。
- 導入バージョン固定方針は後続仕様で決定する。
- 導入前にHuman Owner approvalを必要とする。

## 18. Configuration Policy

- 本作業ではLint設定ファイルを作成しない。
- Spectral CLI向け設定ファイルの名称、配置場所、ルール内容は後続仕様で決定する。
- Redocly CLI向け設定ファイルの要否は後続仕様で決定する。
- Secret detection、real URL detection、required paths、required schemas、status transition descriptionsは設定候補とする。

## 19. CI Policy

- 本作業ではCI設定を作成しない。
- 将来的にOpenAPI lintをCIへ接続する。
- Blocker違反はmerge不可候補とする。
- Critical違反は原則修正必須候補とする。
- Major以下の扱いは後続仕様で決定する。
- CI対象ブランチ、実行タイミング、ログ保存先は後続仕様で決定する。

## 20. Risk and Limitation Assessment

| Risk or Limitation | Impact | Mitigation | Notes |
|---|---|---|---|
| ツールごとにOpenAPI 3.1対応範囲が異なる可能性 | 期待したlintが通らない可能性。 | 後続仕様で公式情報と実検証を行う。 | 本文書では最終判断しない。 |
| カスタムルールの実装難易度 | Project-specific ruleの自動化が遅れる可能性。 | MVPでは手動チェックとparse helperを併用する。 | Spectral CLIをPrimary candidateにする理由。 |
| Secret検出の誤検知 | Dummy値や説明文が誤検知される可能性。 | ルールを段階導入し、Blocker対象を明確化する。 | 具体的Secret形式は記載しない。 |
| 実在URL検出の誤検知 | placeholder以外の説明文が誤検知される可能性。 | 許容値を明確化する。 | https://api.example.invalid のみ許容。 |
| Lintが設計意図を完全に検証できない | Human Owner判断が必要な領域が残る。 | Document reviewとAPI test specificationを併用する。 | 法務判断は後続確認。 |
| CI導入時に既存差分へ影響する可能性 | 既存未整理差分でCIが不安定になる可能性。 | 導入前に対象範囲とbaselineを決める。 | 本作業ではCI設定なし。 |
| バージョン固定方針が未定 | 再現性が確定しない。 | 後続仕様でバージョン固定方針を決定する。 | 本作業ではインストールなし。 |

## 21. Decision Summary

| Decision Item | Decision | Status | Notes |
|---|---|---|---|
| Primary lint tool candidate | Spectral CLI | Draft candidate | Project-specific custom ruleを重視。 |
| Secondary lint tool candidate | Redocly CLI | Draft candidate | Quality check、bundle、docs連携を見据える。 |
| Supplemental validators | IBM OpenAPI Validator / OpenAPI Generator validate | Draft candidate | 補助検証候補。 |
| YAML parse helpers | PyYAML / Node yaml | Available helper | YAML parse確認に使用可能。 |
| Install now | No | Decided for this work | 本作業では導入しない。 |
| Create lint config now | No | Decided for this work | 本作業では作成しない。 |
| Modify package.json now | No | Decided for this work | 本作業では変更しない。 |
| Modify pnpm-lock.yaml now | No | Decided for this work | 本作業では変更しない。 |
| CI setup now | No | Decided for this work | 本作業では設定しない。 |

## 22. Items Deferred to Later Specifications

- Spectral CLI導入
- Redocly CLI導入
- IBM OpenAPI Validator導入可否
- OpenAPI Generator validate導入可否
- 公式ドキュメントによる各ツールの最新仕様確認
- 各ツールのバージョン固定方針
- Lint config作成
- package.json scripts追加
- pnpm-lock.yaml更新
- CI接続
- Blocker / Critical違反時のCI失敗条件
- lint結果レポート保存方式
- API contract test実装
- OpenAPI breaking change rule

## 23. Items Not Decided by This Tool Selection

- Lintツールの最終導入
- Lintツールのバージョン固定
- Lint configファイル名
- Lint config配置場所
- package script名
- CIツール
- CI実行条件
- Pull request品質ゲート
- API実装方式
- DB実装方式
- OAuth実装方式
- UI実装方式
- 外部SNS API連携方式
- 法務判断
- SNS規約の詳細結論
- ASP規約の詳細結論
- アフィリエイト規約の詳細結論

## 24. Validation Results

| Check | Result | Notes |
|---|---|---|
| OpenAPI Lint Specificationを参照した | Pass | 既存lint方針を確認。 |
| Approval Gate OpenAPI Draftを参照した | Pass | OpenAPI 3.1.0を確認。 |
| Approval Gate API Designを参照した | Pass | API境界とError Response方針の参照元。 |
| Approval Gate API Test Specificationを参照した | Pass | APIテスト観点の参照元。 |
| package.jsonを確認した | Pass | pnpmとyaml devDependencyを確認。 |
| pnpm-lock.yamlを確認した | Pass | 存在確認済み。 |
| Candidate Tool Overviewを作成した | Pass | Section 7に定義。 |
| Evaluation Criteriaを作成した | Pass | Section 8に定義。 |
| Candidate Evaluation Matrixを作成した | Pass | Section 9に定義。 |
| Recommended MVP Selectionを作成した | Pass | Section 10に定義。 |
| Primary Tool Candidateを定義した | Pass | Section 11に定義。 |
| Secondary Tool Candidateを定義した | Pass | Section 12に定義。 |
| Supplemental Tool Candidatesを定義した | Pass | Section 13に定義。 |
| Tools Not Selected for MVP Primary Useを定義した | Pass | Section 14に定義。 |
| Security and Secret Handling Considerationsを定義した | Pass | Section 15に定義。 |
| Integration Policyを定義した | Pass | Section 16に定義。 |
| Installation Policyを定義した | Pass | Section 17に定義。 |
| Configuration Policyを定義した | Pass | Section 18に定義。 |
| CI Policyを定義した | Pass | Section 19に定義。 |
| Risk and Limitation Assessmentを定義した | Pass | Section 20に定義。 |
| Decision Summaryを定義した | Pass | Section 21に定義。 |
| Lintツールをインストールしていない | Pass | 本作業では導入なし。 |
| Lint設定ファイルを作成していない | Pass | Markdown文書のみ。 |
| package.jsonを変更していない | Pass | 本作業では変更なし。 |
| pnpm-lock.yamlを変更していない | Pass | 本作業では変更なし。 |
| OpenAPI Draftを変更していない | Pass | 本作業では変更なし。 |
| API Test Specificationを変更していない | Pass | 本作業では変更なし。 |
| OpenAPI Lint Specificationを変更していない | Pass | 本作業では変更なし。 |
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
| Secret実体を含めていない | Pass | 一般化した表現のみ。 |
| 実在URLを含めていない | Pass | placeholderのみ。 |
| 文字化けがない | Pass | 日本語表示を確認。 |
| 置換文字がない | Pass | 置換文字なし。 |
| コードブロック数が偶数 | Pass | コードブロックなし。 |
| 作業前後のgit diffを確認した | Pass | 作業前後に確認。 |

## 25. Next Actions

- Human Owner review of OpenAPI Lint Tool Selection
- OpenAPI lint config creation
- OpenAPI lint tool installation planning
- package.json script planning
- CI quality gate planning
- API contract test implementation planning
- Review Log storage implementation planning
- Access control implementation planning
- Evidence storage specification
- Platform-specific official-source confirmation tasks
- Phase 1 implementation preparation
