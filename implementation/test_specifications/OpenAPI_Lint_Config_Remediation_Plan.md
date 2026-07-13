# OpenAPI Lint Config Remediation Plan

Document Name: Growth Lab Core OpenAPI Lint Config Remediation Plan
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related Spectral Config: implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml
Related Draft Remediation Report: implementation/test_results/openapi/OpenAPI_Draft_Remediation_Execution_Report.md
Related Initial Validation Report: implementation/test_results/openapi/Spectral_Semantic_Validation_Execution_Report.md
Related Draft Remediation Plan: implementation/test_specifications/OpenAPI_Draft_Remediation_Plan.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/OpenAPI_Lint_Config_Remediation_Plan.md
Created Date: 2026-07-09
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本計画は、OpenAPI Draft remediation execution後に残存した `glc-human-owner-condition-description` warningについて、Lint config側のremediation候補を整理する。

本計画はremediation実行ではない。本計画はcustom ruleの期待条件とOpenAPI Draft側の記述が一致しているかを整理する。本計画はLint config修正、Draft再修正、warning一時許容の判断候補を整理する。本計画はHuman Owner判断が必要な箇所を明確化する。

## 2. Scope

対象:

- 残存finding 1件の確認
- `glc-human-owner-condition-description` rule定義の確認
- rule対象locationの確認
- rule検出条件の確認
- Draft側に追加済み説明文の確認
- root cause hypothesisの整理
- Lint config remediation candidateの整理
- Draft remediation follow-up candidateの整理
- warning一時許容候補の整理
- Human Owner decision pointsの整理
- 将来のremediation execution範囲整理
- 将来の再Lint確認候補整理

対象外:

- Spectral config修正
- OpenAPI Draft修正
- package.json修正
- pnpm-lock.yaml修正
- package script修正
- Spectral lint再実行
- remediation execution
- CI設定
- lint result logging specification策定
- API実装
- DB実装
- OAuth実装
- UI実装
- 法務判断
- SNS規約の最終解釈
- ASP規約の最終解釈
- アフィリエイト規約の最終解釈

## 3. Important Notes

This plan does not modify the Spectral config.
This plan does not modify the OpenAPI Draft.
This plan does not execute Spectral lint.
This plan defines lint config remediation planning only.
Remediation execution is deferred to a later task after Human Owner review.

本計画は、Spectral configを変更しない。
本計画は、OpenAPI Draftを変更しない。
本計画は、Spectral lintを実行しない。
本計画は、Lint config remediation planningのみを定義する。
remediation実行は、Human Owner review後の後続作業へ委譲する。

## 4. Source Validation Result

| Item | Result |
|---|---|
| Command | pnpm run lint:openapi |
| Exit Code | 0 |
| Result | Completed with warnings |
| Error Count | 0 |
| Warning Count | 1 |
| Info Count | 0 |
| Hint Count | 0 |
| Tool / Config Failure | 0 |

補足: OpenAPI Draft Remediation Execution Reportでは、実行結果本文に `Completed with findings` と記録されているが、raw outputは `0 errors, 1 warning, 0 infos, 0 hints` である。本計画では指示書の表現に合わせ、warningありの完了として扱う。

## 5. Remaining Finding Summary

| Item | Value |
|---|---|
| Rule | glc-human-owner-condition-description |
| Severity | Warning |
| Status | Remaining |
| Location | 716:20, components.schemas.ApprovalGateTransitionRequest.description |
| Message | ApprovalGateTransitionRequest description should document Human Owner approval condition. |
| Initial Remediation Attempt | OpenAPI Draft側にHuman Owner approval condition descriptionを追加 |
| Current Issue | Draft側の追記後もcustom ruleが反応している |

初回validationでは同ruleが 711:20 に記録され、Draft remediation後の再Lintでは 716:20 に記録された。location pathはいずれも `components.schemas.ApprovalGateTransitionRequest.description` である。

## 6. Related Rule Definition Review

| Rule Element | Current Value | Notes |
|---|---|---|
| Rule ID | glc-human-owner-condition-description | Spectral custom rule。 |
| Description | [Major] Human Owner approval condition must be documented for publish-related transitions. | warning相当のMajor確認事項。 |
| Severity | warn | Spectral warningとして扱われる。 |
| Given | $.components.schemas.ApprovalGateTransitionRequest | schema objectを直接対象にしている。 |
| Then field | description | 対象schemaのdescription fieldを検査する。 |
| Function | pattern | pattern functionで文言を確認する。 |
| Function Options | match: Human Owner | descriptionに `Human Owner` が含まれることを期待している。 |
| Expected text or pattern | Human Owner | approval condition全文ではなく、文字列 `Human Owner` の存在確認。 |
| Target object type | schema description | operation descriptionではなくcomponent schema descriptionが対象。 |

rule定義にはSecret、Token、API Key、Password、実在URLは含まれていない。

## 7. Current OpenAPI Draft Description Review

| Item | Value |
|---|---|
| Finding location | components.schemas.ApprovalGateTransitionRequest.description |
| Current description exists | Yes |
| Current description summary | status transition restrictions、Published前提、Blocked/Deferred条件、terms check制約を記載している。 |
| Contains Human Owner | No |
| Contains approval condition | Partial |
| Contains transition restriction | Yes |
| Matches rule expected text or pattern | No |

OpenAPI Draftには `Human Owner` を含む説明が複数箇所に存在する。ただし、残存findingのlocationである `ApprovalGateTransitionRequest.description` には `Human Owner` が含まれていない。Draft remediationで追加された候補文言は、operation側descriptionなど別locationに入った可能性が高い。

## 8. Root Cause Hypotheses

| Hypothesis ID | Hypothesis | Evidence | Likelihood | Notes |
|---|---|---|---|---|
| LCRP-H1 | Draft側の追加文言がruleの期待文字列またはpatternと一致していない。 | 対象schema descriptionには `Human Owner` が含まれていない。 | High | 期待patternは `Human Owner` のため、schema descriptionへ文言追加すれば解消する可能性がある。 |
| LCRP-H2 | Draft側の説明文を追加したlocationと、ruleが検査しているlocationが異なる。 | `Human Owner approval is required` はoperation description側に存在し、ruleはschema descriptionを検査している。 | High | 今回の最有力候補。 |
| LCRP-H3 | ruleのgiven範囲が広すぎて、Human Owner conditionが不要なoperationまたはschemaまで検査している。 | givenは単一schemaであり、過剰範囲とは言い切れない。 | Low | ただしschemaではなくoperation側を正とする設計なら再評価が必要。 |
| LCRP-H4 | ruleのfunctionまたはfunctionOptionsが、descriptionの一部一致ではなく完全一致に近い条件になっている。 | functionはpattern、matchは `Human Owner` であり、完全一致条件ではない。 | Low | 現状はpattern過剰よりlocation不一致が濃厚。 |
| LCRP-H5 | remediation execution時に追加対象locationを取り違えた、またはschema description更新が漏れた。 | Draft remediation planでは `ApprovalGateTransitionRequest.description` への追加候補が示されていたが、現Draftの同descriptionには未反映。 | High | Draft follow-up remediation candidate。 |
| LCRP-H6 | MVP段階ではruleが厳しすぎ、Human Owner conditionをschema descriptionへ要求する設計判断が未確定である。 | Human Owner判断待ち項目として標準文言と対象locationが残る。 | Medium | Human Owner reviewでschema対象の妥当性を確認する。 |

## 9. Classification Model

| Classification | Meaning | Typical Action | Requires Human Owner |
|---|---|---|---|
| Draft Follow-up Candidate | OpenAPI Draftの対象descriptionに不足がある候補。 | 後続のDraft follow-up remediationでdescriptionを修正する。 | Yes |
| Lint Config Expected Text Candidate | ruleの期待文字列またはpatternを調整する候補。 | 後続のLint config remediation executionでfunctionOptionsを調整する。 | Yes |
| Lint Config Target Location Candidate | ruleのgiven対象locationを調整する候補。 | 後続のLint config remediation executionでgivenを調整する。 | Yes |
| Rule Split Candidate | 1つのruleに複数責務が混在している候補。 | operation向け、schema向け、transition向けにrule分割を検討する。 | Yes |
| Temporary Acceptance Candidate | warningを既知のwarningとして一時保留する候補。 | lint result loggingまたはCI quality gate planningへ委譲する。 | Yes |

## 10. Candidate Remediation Options

| Option | Summary | Primary Change Candidate | Current Assessment |
|---|---|---|---|
| Option A | Keep Config and Adjust OpenAPI Draft Text | `ApprovalGateTransitionRequest.description` に `Human Owner` を含む承認条件を追記する。 | Most likely。現rule対象と現Draft descriptionの差分に合う。 |
| Option B | Adjust Rule Expected Text | `Human Owner` 以外の標準文言またはpatternへ調整する。 | 現時点では優先度低。 |
| Option C | Adjust Rule Target Location | givenをoperation descriptionなどへ変更する。 | schema descriptionで検査すべきでないと判断した場合に検討。 |
| Option D | Split Rule into Narrower Rules | schema向けとoperation向けを分ける。 | MVPでは過剰な可能性あり。 |
| Option E | Defer or Accept Warning Temporarily | 既知warningとして保留する。 | Human Owner判断が未完了の場合の一時案。 |

## 11. Option A: Keep Config and Adjust OpenAPI Draft Text

概要:
現在のcustom ruleを維持し、OpenAPI Draft側の `ApprovalGateTransitionRequest.description` にHuman Owner approval conditionを明記する。

適用条件:

- rule対象locationが正しい。
- `ApprovalGateTransitionRequest` schema descriptionに承認境界を記載する設計が妥当である。
- Draft側の自然なdescriptionとして `Human Owner` を含められる。

将来変更候補:

- `ApprovalGateTransitionRequest.description` にHuman Owner approval conditionの標準文言を追加する。

メリット:

- configを緩めず、承認境界チェックを維持できる。
- 残存warningの直接原因に対応しやすい。

リスク:

- schema descriptionが運用文言に寄りすぎる可能性がある。
- 標準文言の確定にはHuman Owner判断が必要。

本作業での扱い:

- 実行しない。

## 12. Option B: Adjust Rule Expected Text

概要:
custom ruleの期待文言またはpatternを、実際のOpenAPI Draft descriptionに合わせて調整する。

適用条件:

- `Human Owner` という文字列を必須にしない方針がある。
- 承認条件を別表現で記述する標準がHuman Ownerにより決定される。
- rule messageと期待patternが現在のAPI contract descriptionに対して厳しすぎる。

将来変更候補:

- `approval_gate_openapi_spectral.yaml` の `glc-human-owner-condition-description` ruleの `functionOptions.match` を調整する。

メリット:

- 表現の自由度を保てる。
- 将来の標準文言に合わせやすい。

リスク:

- ruleを緩めすぎると、承認条件チェックとしての意味が弱くなる可能性がある。

本作業での扱い:

- 実行しない。

## 13. Option C: Adjust Rule Target Location

概要:
custom ruleが不要なlocationまで検査している場合、given対象を調整する。

適用条件:

- Human Owner approval conditionが必要なoperationまたはschemaが限定できる。
- 現在のgiven範囲が広すぎる。
- warning locationが承認条件を記述すべき場所ではない。

将来変更候補:

- `approval_gate_openapi_spectral.yaml` の `glc-human-owner-condition-description` ruleのgivenを調整する。

メリット:

- 本当に必要なAPI contract要素だけを検査できる。
- 不要なwarningを抑制できる。

リスク:

- 検査対象を狭めすぎると、重要な承認境界の欠落を検出できなくなる。

本作業での扱い:

- 実行しない。

## 14. Option D: Split Rule into Narrower Rules

概要:
1つのcustom ruleで複数の責務を検査している場合、operation向け、schema向け、transition向けなどにruleを分割する。

適用条件:

- 現在のruleが複数種類のdescriptionに同一条件を要求している。
- operationとschemaで必要な文言が異なる。
- 将来CI quality gateで明確なseverity管理をしたい。

将来変更候補:

- `approval_gate_openapi_spectral.yaml` 内でruleを分割する。
- rule ID命名規則をOpenAPI Lint Specificationに合わせる。

メリット:

- warning原因を明確化できる。
- severityや対象範囲を細かく管理できる。

リスク:

- configが複雑になる。
- 初期MVPでは過剰設計になる可能性がある。

本作業での扱い:

- 実行しない。

## 15. Option E: Defer or Accept Warning Temporarily

概要:
残存warningを既知のwarningとして一時的に許容し、Lint result logging specificationまたはCI quality gate planningで扱う。

適用条件:

- warningがMVP blocking issueではない。
- OpenAPI DraftとLint configのどちらを正とするかHuman Owner判断が未完了。
- 直ちに品質リスクが高いわけではない。

将来変更候補:

- 既知warningとして記録する。
- CIではwarningをfail扱いにしない候補とする。

メリット:

- 後続工程を止めずに進められる。
- 判断を急がず、CI設計時に扱いを決められる。

リスク:

- warningを放置する運用が定着する可能性がある。
- 承認条件の曖昧さが残る可能性がある。

本作業での扱い:

- 実行しない。

## 16. Recommended MVP Direction

Recommended MVP direction:

1. まずrule定義とfinding locationを基に、Draft側の文言不一致なのか、rule対象locationの過剰検知なのかを判断する。
2. rule対象locationが正しい場合は、Option AまたはOption Bを優先候補とする。
3. rule対象locationが過剰である場合は、Option Cを優先候補とする。
4. 1つのruleに複数責務が混在している場合のみ、Option Dを検討する。
5. Human Owner判断が未完了の場合は、Option Eとして一時保留にする。

現時点の推奨: Option A recommended

理由: 残存findingのlocationは `components.schemas.ApprovalGateTransitionRequest.description` であり、ruleは同descriptionに `Human Owner` を要求している。現在のOpenAPI Draftでは同descriptionに `Human Owner` が含まれていないため、最小の後続対応はOpenAPI Draft follow-up remediationで対象schema descriptionを補強することである。ただし、標準文言とschema descriptionへ記載する方針はHuman Owner reviewで確認する。

## 17. Human Owner Decision Points

Human Owner approvalが必要なポイント:

- Draft側のHuman Owner approval condition標準文言を変更する前
- custom ruleの期待文言またはpatternを変更する前
- custom ruleのgiven対象範囲を変更する前
- custom ruleを分割する前
- 残存warningを一時許容する前
- CIでwarningをfail扱いにする前
- CIでwarningを許容する前
- Human Owner approval conditionの意味を拡張または縮小する前

## 18. Future Lint Config Remediation Execution Scope

Candidate future changes:

- `approval_gate_openapi_spectral.yaml` の `glc-human-owner-condition-description` rule期待文言の調整
- `approval_gate_openapi_spectral.yaml` の `glc-human-owner-condition-description` rule対象locationの調整
- `glc-human-owner-condition-description` ruleの分割
- `Approval_Gate_OpenAPI_Draft.yaml` のdescription follow-up修正
- Spectral config YAML parse確認
- OpenAPI Draft YAML parse確認
- `pnpm run lint:openapi` による再確認

注意: 本作業では上記を実施しない。

## 19. Future Verification Candidate Commands

将来のremediation execution後に実行する候補コマンド:

```powershell
cd /d C:\claudcode_ap\growth_lab_core

node -e "require('yaml').parse(require('fs').readFileSync('implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml','utf8')); console.log('Spectral config YAML parse OK')"

node -e "require('yaml').parse(require('fs').readFileSync('implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml','utf8')); console.log('OpenAPI Draft YAML parse OK')"

pnpm run lint:openapi
```

注意: 本作業では実行しない。

## 20. Risk Review

- custom ruleを緩めすぎると、Human Owner approval conditionの欠落を検出できなくなる。
- custom ruleを厳しくしすぎると、自然なdescriptionでもwarningが残る。
- given対象を広くしすぎると不要なwarningが増える。
- given対象を狭くしすぎると重要なAPI contract要素を見落とす。
- Draft側文言をruleに合わせすぎると、API contract descriptionが不自然になる。
- warningを一時許容すると、承認境界の曖昧さが残る。
- CI接続前にwarningの扱いを決めていないと、品質ゲートが不安定になる。

## 21. Security and Secret Handling Policy

- Spectral configにSecret、Token、API Key、Passwordを含めない。
- rule messageやfunctionOptionsに実在Secret形式の文字列を含めない。
- OpenAPI DraftのdescriptionやexampleにSecret、Token、API Key、Passwordを含めない。
- contact.emailには実在個人メールアドレスを使用しない。
- contact.urlには実在URLを使用しない。
- 許容URLは https://api.example.invalid のみとする。
- private registry tokenや認証情報を文書化しない。

## 22. Out-of-scope Items

- Spectral config修正
- OpenAPI Draft修正
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

## 23. Acceptance Criteria

- `OpenAPI_Lint_Config_Remediation_Plan.md` が作成されている。
- `CHANGELOG.md` が更新されている。
- 残存finding `glc-human-owner-condition-description` を整理している。
- Related Rule Definition Reviewを記載している。
- Current OpenAPI Draft Description Reviewを記載している。
- Root Cause Hypothesesを記載している。
- Classification Modelを記載している。
- Candidate Remediation Optionsを記載している。
- Option AからOption Eまで整理している。
- Recommended MVP Directionを記載している。
- Human Owner Decision Pointsを記載している。
- Future Lint Config Remediation Execution Scopeを記載している。
- Future Verification Candidate Commandsを記載している。
- Risk Reviewを記載している。
- Security and Secret Handling Policyを記載している。
- Spectral configを変更していない。
- OpenAPI Draftを変更していない。
- package.jsonを変更していない。
- pnpm-lock.yamlを変更していない。
- Spectral lintを実行していない。
- remediationを実施していない。

## 24. Items Deferred to Later Specifications

- Lint config remediation execution
- OpenAPI Draft follow-up remediation execution
- Spectral semantic validation re-execution
- lint result logging specification
- CI quality gate planning
- API contract test implementation planning

## 25. Items Not Decided by This Plan

- custom ruleの最終期待文言
- custom ruleの最終given対象
- custom ruleを分割するかどうか
- OpenAPI Draft側のdescriptionを再修正するかどうか
- warningを一時許容するかどうか
- CI上でwarningをfail扱いにするかどうか
- CI上でwarningを許容するかどうか
- lint結果ログ保存先
- lint違反の例外承認フォーマット

## 26. Validation Results

| Check | Result | Notes |
|---|---|---|
| OpenAPI_Draft_Remediation_Execution_Report.mdを参照した | Pass | post-remediation結果と残存findingを確認。 |
| Spectral_Semantic_Validation_Execution_Report.mdを参照した | Pass | 初回4 warningsと該当raw outputを確認。 |
| Approval_Gate_OpenAPI_Draft.yamlを参照した | Pass | 対象schema descriptionとHuman Owner文言の位置を確認。 |
| approval_gate_openapi_spectral.yamlを参照した | Pass | custom rule定義を確認。 |
| glc-human-owner-condition-description rule定義を確認した | Pass | given、field、function、functionOptionsを確認。 |
| 残存finding locationを確認した | Pass | 716:20, components.schemas.ApprovalGateTransitionRequest.description。 |
| 残存finding messageを確認した | Pass | ApprovalGateTransitionRequest description should document Human Owner approval condition. |
| Current OpenAPI Draft descriptionを確認した | Pass | 対象schema descriptionにHuman Ownerは含まれていない。 |
| Root Cause Hypothesesを記載した | Pass | LCRP-H1からLCRP-H6を記載。 |
| Candidate Remediation Optionsを記載した | Pass | Option AからOption Eを記載。 |
| Recommended MVP Directionを記載した | Pass | Option A recommended。 |
| Human Owner Decision Pointsを記載した | Pass | Section 17に記載。 |
| Future Verification Candidate Commandsを記載した | Pass | Section 19に記載。本作業では未実行。 |
| Spectral configを変更していない | Pass | 読み取りのみ。 |
| OpenAPI Draftを変更していない | Pass | 読み取りのみ。 |
| package.jsonを変更していない | Pass | 本作業では未変更。 |
| pnpm-lock.yamlを変更していない | Pass | 本作業では未変更。 |
| Spectral lintを実行していない | Pass | lint commandは未実行。 |
| remediationを実施していない | Pass | planningのみ。 |
| Secret実体を含めていない | Pass | 実体値は記載していない。 |
| 実在URLを含めていない | Pass | 許容URLのみ記載。 |
| 文字化けがない | Pass | UTF-8 Markdownとして作成。 |
| 置換文字がない | Pass | 置換文字は使用していない。 |
| コードブロック数が偶数 | Pass | コードフェンスは開始と終了を対で記載。 |
| 作業前後のgit diffを確認した | Pass | 既存差分と今回作業対象を区別して確認。 |

## 27. Next Actions

Recommended next actions:

1. Human Owner review of OpenAPI Lint Config Remediation Plan
2. Lint config remediation execution or OpenAPI Draft follow-up remediation execution
3. Spectral semantic validation re-execution
4. lint result logging specification
5. CI quality gate planning
6. API contract test implementation planning
