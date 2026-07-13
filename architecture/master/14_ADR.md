# 14 ADR

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/14_ADR.md

---

## 1. Purpose

本章の目的は、Growth Lab CoreにおけるADR、Architecture Decision Record、の運用方針を定義することである。

Growth Lab Coreは、SNS、Mail、WordPress、Affiliate、AI、Database、API、OAuth、Security、Operations、Analytics、KPI、Roadmapを統合する運用基盤である。
このような複合的な基盤では、設計判断の理由、代替案、採用理由、影響範囲、リスク、将来見直し条件を記録しないと、後からなぜその設計になったのか分からなくなる。

ADRは、単なるメモではない。
ADRは、Growth Lab Coreにおける重要な設計判断を、将来の保守、拡張、監査、引き継ぎ、CodexやClaude Codeによる作業のために保存する判断記録である。

本章では、以下を定義する。

- ADR全体方針
- 00 Document Governanceとの責任分界
- 01 Architecture Principlesとの責任分界
- 07 Growth Lab Core Systemとの責任分界
- 08 Databaseとの責任分界
- 09 API and OAuthとの責任分界
- 10 Securityとの責任分界
- 11 Operationsとの責任分界
- 12 Analytics and KPIとの責任分界
- 13 Roadmapとの責任分界
- ADR Principles
- ADR作成条件
- ADR作成不要条件
- ADR Triage
- ADR番号体系
- ADR Status
- ADR Template
- ADR Lifecycle
- Decision Logとの違い
- CHANGELOGとの違い
- Roadmap Decisionとの違い
- Scale GateとADRの関係
- Security / Database / API / Automation / AI / Operations / Analytics / Roadmap判断のADR化基準
- ADR Review
- ADR更新、廃止、置換ルール
- ADR一覧管理
- Codex / Claude Codeとの関係
- ADR運用リスク
- Final Master Architecture Closure

---

## 2. Scope

本章の対象範囲は、Growth Lab CoreにおけるADRの上位運用設計である。

対象範囲は以下を含む。

- ADR Purpose
- ADR Principles
- ADR Responsibility Boundary
- ADR Creation Criteria
- ADR Non-Creation Criteria
- ADR Triage Policy
- ADR Numbering Policy
- ADR Status Policy
- ADR Lifecycle
- ADR Template
- ADR Metadata Policy
- ADR Review Policy
- ADR Approval Policy
- ADR Update Policy
- ADR Supersede Policy
- ADR Deprecation Policy
- ADR Rejection Policy
- ADR Index Policy
- ADR Relationship Policy
- ADR Link Policy
- ADR and Decision Log Boundary
- ADR and CHANGELOG Boundary
- ADR and Roadmap Decision Boundary
- ADR and Scale Gate Boundary
- ADR and Security Boundary
- ADR and Database Boundary
- ADR and API / OAuth Boundary
- ADR and Automation Boundary
- ADR and AI Boundary
- ADR and Operations Boundary
- ADR and Analytics Boundary
- ADR and Roadmap Boundary
- ADR File Structure
- ADR Naming Convention
- ADR Candidate Policy
- ADR Governance
- ADR Risks
- ADR Review Checklist

本章では、個別ADRの最終本文すべて、個別技術の詳細実装、API endpoint、SQL、Prisma Schema、Secret実体、個別Runbook全文までは定義しない。
それらは、個別ADRファイル、下位実装仕様、または各章の対象範囲で扱う。

---

## 3. Non-Goals

本章では、以下を対象外とする。

- 個別ADR本文のすべてを本章へ集約すること
- すべての設計判断をADR化すること
- 軽微な文言修正のADR化
- CHANGELOGの代替
- Roadmapの代替
- Decision Logの代替
- Issue管理の代替
- Project Management Toolの代替
- 実装コード全文
- Database物理設計
- Prisma Schema全文
- API endpoint詳細
- OAuth実装手順
- Secret実体
- Token実体
- Password実体
- API Key実体
- Recovery Code実体
- Dashboard実装コード
- Runbook全文
- KPI計算式詳細
- 法務判断の最終確定
- 個別規約違反判断の最終確定

ADRは、重要な設計判断を記録するための文書である。
すべての作業ログ、すべての変更履歴、すべての実装詳細をADRで扱わない。

---

## 4. Background

Growth Lab Coreでは、これまでの章で多数の重要判断が定義されている。

例は以下である。

- MarkdownをMaster Architectureの正本とする。
- Document Governanceを00章で定義する。
- Architecture Principlesを01章で定義する。
- Mail AccountとSNS AccountをIdentityに紐付ける。
- SNSは公式APIと規約遵守を優先する。
- WordPressはOwned Mediaとして位置付ける。
- AIは支援者であり、最終判断者にしない。
- Growth Lab Core SystemはWorkflow、Approval Gate、Scheduler、Automation、Monitoringを統合する。
- Databaseは段階的に移行する。
- OAuth Token実体は通常DBやMarkdownへ保存しない。
- Secret実体を文書、AI入力、通常DB、Logへ含めない。
- OperationsはRunbook、Incident、Backup、Restore、Scale Gateで管理する。
- KPI未定義のまま拡張しない。
- Roadmapは日付だけで進めない。
- Roadmap Scale Gateは各章のScale Gateを置き換えない。

これらの判断は、将来変更される可能性がある。
しかし、変更する場合は、なぜその判断をしたのか、何を比較したのか、どのリスクを受け入れたのかを残す必要がある。

そのため、ADRをGrowth Lab Coreの最終章として定義し、今後の重要判断を記録できる状態にする。

---

## 5. Alignment with Architecture Principles

本章は、`01_Architecture_Principles.md` で定義した原則に従う。

特に、ADRでは以下を重視する。

```text
AP-01 Compliance First
AP-02 API First
AP-03 Security by Design
AP-04 AI First
AP-05 Automation First
AP-06 Scalability
AP-07 Observability
AP-08 Cost Optimization
AP-09 Single Source of Truth
AP-10 Continuous Improvement
```

ADRにおける優先順位は以下である。

```text
1. Compliance
2. Security
3. Decision Traceability
4. Single Source of Truth
5. Architecture Consistency
6. Operational Safety
7. Future Maintainability
8. Cost and ROI Clarity
9. Scalability
10. Continuous Improvement
```

ADRでは、判断内容だけでなく、判断理由、代替案、採用しなかった案、影響範囲、将来見直し条件を記録する。

---

## 6. ADR Principles

Growth Lab CoreのADRは、以下の原則に従う。

### 6.1 Record Important Decisions

ADRは、重要な設計判断を記録する。
すべての作業や軽微な文言修正をADRにしない。

### 6.2 Explain Why, Not Only What

ADRは、何を決めたかだけでなく、なぜその判断をしたかを記録する。

### 6.3 Preserve Alternatives

採用しなかった代替案も記録する。
将来見直すときに、過去に比較した選択肢を確認できるようにする。

### 6.4 Separate Decision from Implementation

ADRは設計判断を記録する。
実装コード、SQL、API endpoint、画面操作手順は下位実装仕様へ委譲する。

### 6.5 Do Not Store Secrets

ADRには、Secret実体、Token実体、Password実体、API Key実体、Recovery Code実体を含めない。

### 6.6 ADR Is Not CHANGELOG

CHANGELOGは、ファイル変更履歴を記録する。
ADRは、重要な設計判断の理由を記録する。

### 6.7 ADR Is Not Roadmap

Roadmapは、実装順序、Phase、Stage、優先順位、拡張判断を扱う。
ADRは、重要判断の記録を扱う。

### 6.8 ADR Is Not Decision Log

Decision Logは、軽微または一時的な判断を記録する。
ADRは、長期的に参照する重要な設計判断を記録する。

### 6.9 Supersede, Do Not Rewrite History

過去のADRを無断で書き換えて歴史を消さない。
判断が変わった場合は、Superseded、Deprecated、Replacedなどの状態を使い、新しいADRから参照する。

### 6.10 ADR Must Be Linkable

ADRは、関連章、Roadmap Item、Scale Gate、CHANGELOG、実装仕様と紐付けられるようにする。

### 6.11 AI Can Draft, Human Decides

AIはADR案を作成できる。
ただし、ADRの採用、却下、置換、廃止は人間が判断する。

---

## 7. ADR Vision

ADRは、Growth Lab Coreにおける判断の記録Layerである。

```text
Architecture Chapters
  |
  v
Decision Candidate
  |
  v
ADR Draft
  |
  v
Review
  |
  v
Accepted ADR
  |
  v
Implementation / Operations / Roadmap
  |
  v
Review / Supersede / Deprecate
```

ADRは、以下を実現する。

- 重要判断の理由を残す。
- 代替案を残す。
- 将来の見直しを容易にする。
- CodexやClaude Codeが設計背景を理解しやすくする。
- SecurityやComplianceの判断根拠を残す。
- Database移行判断の根拠を残す。
- API and OAuth連携判断の根拠を残す。
- Automation拡張判断の根拠を残す。
- Roadmap変更の根拠を残す。
- Scale Gate判断の根拠を残す。
- 実装者が上位設計を誤解しないようにする。
- 引き継ぎ時の判断背景を残す。

---

## 8. Relationship with 00, 01, 07, 08, 09, 10, 11, 12, and 13

`00_Document_Governance.md` は、文書体系、正本、変更管理、レビュー方針を定義する。
`01_Architecture_Principles.md` は、Growth Lab Core全体の設計原則を定義する。
`07_Growth_Lab_Core_System.md` は、Workflow、Approval Gate、Scheduler、Automation、Monitoringを定義する。
`08_Database.md` は、Database、Entity、Relation、Migration、Backup、Data Integrityを定義する。
`09_API_OAuth.md` は、API、OAuth、Scope、Token Reference、Webhook、Rate Limit、Retryを定義する。
`10_Security.md` は、Secret、Access Control、2FA、Security Incident、Security Reviewを定義する。
`11_Operations.md` は、Daily、Weekly、Monthly、Runbook、Incident、Backup、Restore、Operations Scale Gateを定義する。
`12_Analytics_KPI.md` は、KPI、ROI、Report、Dashboard、Roadmap Metrics、Scale Gate Metricsを定義する。
`13_Roadmap.md` は、Phase、Stage、Roadmap Decision、Roadmap Gate、Roadmap Scale Gateを定義する。
本章は、重要な設計判断をADRとしてどう記録、管理、更新、廃止するかを定義する。

責任分界は以下である。

```text
00 Document Governance
    |
    +-- Document hierarchy
    +-- Master format
    +-- Change management
    +-- Review policy
    |
    v
14 ADR
    |
    +-- Decision record policy
    +-- ADR template
    +-- ADR lifecycle
    +-- ADR status
    +-- ADR index
    |
    +-- Follows principles from:
    v
01 Architecture Principles
    |
    +-- Compliance First
    +-- Security by Design
    +-- Single Source of Truth
    |
    +-- Records important decisions from:
    v
07 Growth Lab Core System
08 Database
09 API and OAuth
10 Security
11 Operations
12 Analytics and KPI
13 Roadmap
```

14章は、各章の設計内容を置き換えない。
14章は、各章で発生する重要判断をどのようにADR化するかを定義する。

---

## 9. ADR Architecture Overview

ADR Architectureは、Decision Candidate、ADR Draft、Review、Status、Index、Linkで構成する。

```text
Decision Candidate
  |
  v
ADR Required Check
  |
  v
ADR Draft
  |
  v
Human Review
  |
  +-- Accepted
  +-- Rejected
  +-- Deferred
  +-- Withdrawn
  |
  v
ADR Index Update
  |
  v
Related Chapter / Roadmap / CHANGELOG Link
  |
  v
Periodic Review
```

ADRは、判断候補を記録するだけでは完了しない。
採用、却下、延期、置換、廃止などのStatusを管理し、関連文書とリンクする。

---

## 10. ADR Responsibility Boundary

ADR章は、重要判断の記録方針を定義する。

### 10.1 ADR Responsibilities

本章が責任を持つ範囲は以下である。

- ADR全体方針
- ADR作成条件
- ADR作成不要条件
- ADR Triage
- ADR番号体系
- ADR Status
- ADR Lifecycle
- ADR Template
- ADR Metadata
- ADR Review
- ADR Approval
- ADR更新
- ADR置換
- ADR廃止
- ADR却下
- ADR一覧管理
- ADR Candidate管理
- Decision Logとの分界
- CHANGELOGとの分界
- Roadmap Decisionとの分界
- Scale Gateとの関係
- 重要判断のADR化基準
- ADR運用リスク
- ADR Review Checklist

### 10.2 ADR Does Not Define

本章では以下を定義しない。

- 個別ADR本文のすべて
- 個別機能の実装コード
- Database物理設計
- API endpoint詳細
- OAuth実装手順
- Secret実体
- 個別Runbook全文
- KPI計算式詳細
- Dashboard実装コード
- 詳細スプリント計画
- Project Management Tool運用全文
- 法務判断の最終確定

---

## 11. ADR Terms

ADRで利用する用語を定義する。

### 11.1 ADR

ADRは、Architecture Decision Recordの略である。
重要な設計判断、背景、代替案、採用理由、影響、リスクを記録する文書である。

### 11.2 Decision Candidate

Decision Candidateは、ADR化する可能性がある判断候補である。
すべてのCandidateがADRになるわけではない。

### 11.3 Accepted ADR

Accepted ADRは、採用された設計判断を記録するADRである。

### 11.4 Superseded ADR

Superseded ADRは、新しいADRによって置き換えられたADRである。

### 11.5 Deprecated ADR

Deprecated ADRは、現在は推奨されないが、過去の経緯として残すADRである。

### 11.6 Rejected ADR

Rejected ADRは、検討されたが採用されなかった判断を記録するADRである。

### 11.7 Decision Log

Decision Logは、軽微または一時的な判断を記録するログである。
ADRより軽い判断記録である。

### 11.8 CHANGELOG

CHANGELOGは、文書やファイルの変更履歴を記録する。
判断理由の詳細はADRで扱う。

### 11.9 Roadmap Decision

Roadmap Decisionは、Phase、Stage、Priority、Go / No Go / Defer / Stop / Pivot / Cancelなどの判断である。
長期的なArchitecture方針へ影響する場合はADR化を検討する。

---

## 12. ADR vs Decision Log vs CHANGELOG vs Roadmap

ADR、Decision Log、CHANGELOG、Roadmapは役割が異なる。

```text
ADR
  = 重要な設計判断の理由と影響を記録する

Decision Log
  = 軽微または一時的な判断を記録する

CHANGELOG
  = ファイルや文書の変更履歴を記録する

Roadmap
  = 実装順序、Phase、Stage、拡張判断を管理する
```

### 12.1 ADRに記録するもの

ADRに記録するものは以下である。

- 長期的な設計判断
- 複数章へ影響する判断
- Securityに影響する判断
- Databaseに影響する判断
- API / OAuthに影響する判断
- Automationに影響する判断
- AI利用方針に影響する判断
- Roadmapの重要変更
- Scale Gate方針変更
- CostやROIに大きく影響する判断
- 将来の保守で理由が必要になる判断

### 12.2 Decision Logに記録するもの

Decision Logに記録するものは以下である。

- 軽微な運用判断
- 一時的な対応判断
- 小さな文言修正理由
- 実装中の短期的な判断
- 後でADR化する可能性のあるメモ

### 12.3 CHANGELOGに記録するもの

CHANGELOGに記録するものは以下である。

- ファイル更新
- 章の反映
- 文書構造の変更
- 追加、修正、削除の履歴
- バージョン更新

### 12.4 Roadmapに記録するもの

Roadmapに記録するものは以下である。

- Phase
- Stage
- Roadmap Item
- Priority
- Dependency
- Gate
- Go / No Go
- Defer
- Stop
- Pivot
- Investment Decision

Roadmap Decisionが長期的な設計方針へ影響する場合は、ADR化を検討する。

---

## 13. ADR Creation Criteria

ADRを作成する条件を定義する。

### 13.1 ADR Required Conditions

以下に該当する場合は、ADR作成を原則として検討する。

- 複数章へ影響する設計判断
- 既存Architecture Principlesへ影響する判断
- Security方針に影響する判断
- Secret管理方針に影響する判断
- Database移行方針に影響する判断
- API / OAuth連携方針に影響する判断
- Automation外部実行方針に影響する判断
- AI利用方針に影響する判断
- Roadmap PhaseまたはStage構造に影響する判断
- 100アカウント以上への拡張判断
- Production接続開始判断
- Scale Gate方針変更
- CostやROIに長期影響する判断
- Provider変更によりArchitecture前提が変わる判断
- 後から理由を確認する必要が高い判断

### 13.2 ADR Optional Conditions

以下は、状況によりADR化を検討する。

- 特定機能の採用判断
- Tool選定
- Hosting選定
- WordPress Plugin選定
- AI Provider選定
- Analytics Tool選定
- 軽度な運用方針変更
- 一部のKPI定義変更
- 一時的なRoadmap例外
- Provider変更への一時対応

### 13.3 ADR Not Required Conditions

以下は、通常ADR化しない。

- 誤字修正
- 表記揺れ修正
- 軽微な見出し調整
- CHANGELOG追記
- ファイル移動のみ
- 一時的な作業メモ
- 実装中の小さな修正
- 下位仕様内で完結する判断
- 既存ADRの範囲内で明らかな作業

---

## 14. ADR Triage Policy

ADR候補は、作成前にTriageする。

### 14.1 Triage Questions

Triageで確認する質問は以下である。

```text
ADR Triage Questions

1. 複数章に影響するか
2. 長期的に参照する判断か
3. Security、Database、API、Automation、AI、Roadmapに影響するか
4. 将来、なぜこの判断をしたか確認する必要があるか
5. 代替案を比較したか
6. Cost、ROI、Operations Loadに影響するか
7. Scale GateまたはRoadmap判断に影響するか
8. Decision Logで足りるか
9. CHANGELOGだけで足りるか
10. 既存ADRで既に扱われているか
```

### 14.2 Triage Results

Triage結果は以下を基本とする。

```text
ADR Triage Results

- Create ADR
- Add to Decision Log
- Add to CHANGELOG only
- Link to Existing ADR
- Defer ADR Decision
- No Record Required
```

### 14.3 Triage Rules

ルールは以下である。

- 判断に迷う場合はDecision Logへ記録する。
- 後から重要化した場合はADRへ昇格する。
- 既存ADRで扱える場合は新規ADRを乱立しない。
- 重要判断をCHANGELOGだけで済ませない。
- AIやCodexだけでTriageを最終確定しない。

---

## 15. ADR Numbering Policy

ADR番号は、判断記録を一意に識別するために使用する。

### 15.1 Number Format

ADR番号は以下の形式を基本とする。

```text
ADR-0001
ADR-0002
ADR-0003
```

4桁の連番を使用する。

### 15.2 File Name Format

ADRファイル名は以下の形式を基本とする。

```text
ADR-0001-Initial-Architecture-Policy.md
```

ルールは以下である。

- 番号は4桁とする。
- 英数字とハイフンを基本とする。
- ファイル名に空白を使わない。
- 日本語タイトルを使う場合も、ファイル名はできるだけASCII中心にする。
- 拡張子は `.md` とする。

### 15.3 Number Reservation Rule

番号は、ADRファイルを作成した時点で確定する。
各章に記載された将来ADR候補番号は、正式なADRファイルが作成されるまでActiveなADRではない。

### 15.4 Number Reuse Prohibition

一度使用したADR番号は再利用しない。
Rejected、Deprecated、SupersededになったADR番号も再利用しない。

---

## 16. ADR Status Policy

ADR Statusは、判断の状態を示す。

### 16.1 Status Values

ADR Statusは以下を基本とする。

```text
Proposed
Accepted
Rejected
Deferred
Superseded
Deprecated
Withdrawn
```

### 16.2 Proposed

Proposedは、提案中のADRである。
まだ正式採用されていない。

### 16.3 Accepted

Acceptedは、採用されたADRである。
Growth Lab Coreの設計判断として有効である。

### 16.4 Rejected

Rejectedは、検討されたが採用されなかったADRである。
採用しなかった理由を残す。

### 16.5 Deferred

Deferredは、判断を延期したADRである。
将来再検討する可能性がある。

### 16.6 Superseded

Supersededは、新しいADRによって置き換えられたADRである。
置き換え先ADRを明記する。

### 16.7 Deprecated

Deprecatedは、現在は推奨されないが、過去の経緯として残すADRである。

### 16.8 Withdrawn

Withdrawnは、提案者またはOwnerにより取り下げられたADRである。

---

## 17. ADR Lifecycle

ADRのLifecycleは以下である。

```text
Decision Candidate
  |
  v
Triage
  |
  v
Proposed
  |
  v
Review
  |
  +-- Accepted
  +-- Rejected
  +-- Deferred
  +-- Withdrawn
  |
  v
Periodic Review
  |
  +-- Remain Accepted
  +-- Superseded
  +-- Deprecated
```

### 17.1 Lifecycle Rules

ルールは以下である。

- ADR候補を発見したらDecision Candidateとして扱う。
- 重要度が高い場合はADR Draftを作成する。
- ADR DraftはReviewする。
- Accepted後は関連章やRoadmapとリンクする。
- 判断が変わった場合は、過去ADRを無断で消さない。
- 新ADRでSupersedeする。
- 不要になった場合も履歴として残す。

---

## 18. ADR Template Policy

ADRは、標準Templateに従う。

### 18.1 ADR Template

ADR Templateは以下を基本とする。

```markdown
# ADR-0000: Title

Status: Proposed
Date: YYYY-MM-DD
Deciders:
- Owner
- Reviewer
Related Chapters:
- 00_Document_Governance.md
Related Roadmap Items:
- None
Related Scale Gate:
- None
Supersedes:
- None
Superseded By:
- None

## Context

背景、課題、前提、制約を記載する。

## Decision

採用する判断を記載する。

## Options Considered

### Option 1: Option Name

概要、利点、欠点を記載する。

### Option 2: Option Name

概要、利点、欠点を記載する。

## Rationale

なぜこの判断を採用するのかを記載する。

## Consequences

### Positive Consequences

- 利点を記載する。

### Negative Consequences

- 欠点や受け入れるリスクを記載する。

## Security Considerations

Security、Secret、Access Control、Privacyへの影響を記載する。

## Operations Considerations

Operations、Runbook、Monitoring、Incident、Backupへの影響を記載する。

## Cost and ROI Considerations

Cost、ROI、運用負荷への影響を記載する。

## Review Plan

見直し条件、見直し時期、見直し担当を記載する。

## Notes

補足を記載する。
```

### 18.2 Template Rules

ルールは以下である。

- Contextを省略しない。
- Decisionを明確にする。
- Options Consideredを可能な範囲で記録する。
- Rationaleを記録する。
- Consequencesを記録する。
- Security影響を確認する。
- Operations影響を確認する。
- Cost影響を確認する。
- Review Planを記録する。
- Secret実体を含めない。

---

## 19. ADR Metadata Policy

ADR Metadataは、ADRを検索、管理、レビューしやすくするために使用する。

### 19.1 Required Metadata

ADRに必要なMetadataは以下である。

```text
Required ADR Metadata

- ADR Number
- Title
- Status
- Date
- Deciders
- Related Chapters
- Related Roadmap Items
- Related Scale Gate
- Supersedes
- Superseded By
```

### 19.2 Optional Metadata

必要に応じて以下を追加する。

```text
Optional ADR Metadata

- Tags
- Risk Level
- Security Impact
- Operations Impact
- Cost Impact
- KPI Impact
- Review Date
- Provider
- Related Issue
- Related CHANGELOG Entry
```

### 19.3 Metadata Rules

ルールは以下である。

- Statusを必ず記載する。
- Dateを必ず記載する。
- Related Chaptersを記載する。
- Supersedesがない場合はNoneとする。
- Superseded Byがない場合はNoneとする。
- Secret実体をMetadataへ含めない。

---

## 20. ADR Context Policy

Contextには、判断の背景を記録する。

Contextに含める内容は以下である。

- 現在の課題
- 判断が必要になった理由
- 関連する章
- 前提条件
- 制約
- 既存方針
- 影響範囲
- 判断しない場合のリスク

Contextでは、結論だけを書かない。
背景を残すことで、将来の見直し時に判断の前提を確認できるようにする。

---

## 21. ADR Decision Policy

Decisionには、採用する判断を明確に記録する。

Decisionに含める内容は以下である。

- 採用する方針
- 採用する範囲
- 適用対象
- 適用しない対象
- 制約
- 実行条件
- 見直し条件

Decisionでは、曖昧な表現を避ける。
ただし、実装コードや詳細手順に入りすぎない。

---

## 22. ADR Options Policy

Options Consideredには、比較した選択肢を記録する。

### 22.1 Options to Include

記録する選択肢は以下である。

- 採用した案
- 採用しなかった主要案
- 保留した案
- 将来候補
- 現状維持案

### 22.2 Options Rules

ルールは以下である。

- 採用案だけを書かない。
- 代替案の利点と欠点を記録する。
- 却下理由を記録する。
- 将来再検討可能な案は明記する。
- ProviderやTool選定では、Vendor Lock-inやCostも確認する。

---

## 23. ADR Consequences Policy

Consequencesには、判断による影響を記録する。

### 23.1 Positive Consequences

Positive Consequencesには以下を記録する。

- 得られる利点
- Risk低減
- 運用改善
- Cost削減
- Scalability向上
- Security向上
- Observability向上
- 将来拡張のしやすさ

### 23.2 Negative Consequences

Negative Consequencesには以下を記録する。

- 受け入れるリスク
- Cost増加
- 運用負荷増加
- 実装複雑性
- Provider依存
- 将来変更コスト
- 移行リスク
- 一時的な制約

### 23.3 Consequences Rules

ルールは以下である。

- 良い点だけを書かない。
- 受け入れるリスクを明確にする。
- Risk Mitigationを記録する。
- Operationsへの影響を記録する。
- Securityへの影響を記録する。

---

## 24. ADR Approval Policy

ADRの採用にはReviewを必要とする。

### 24.1 Review Roles

Reviewに関係するRoleは以下である。

- Owner
- Reviewer
- Approver
- Security Reviewer
- Operations Reviewer
- Technical Reviewer
- Analyst
- AI Assistant

AI AssistantはADR Draftを支援できるが、承認者にはならない。

### 24.2 Approval Rules

ルールは以下である。

- Acceptedにする前にReviewする。
- Security影響がある場合はSecurity Reviewを行う。
- Operations影響がある場合はOperations Reviewを行う。
- CostやROIに影響する場合はCost Reviewを行う。
- Roadmapに影響する場合はRoadmap Reviewを行う。
- 重要ADRはOwnerまたはApproverが確認する。
- 承認者を記録する。
- CodexやClaude Code単独でAcceptedにしない。

---

## 25. ADR Update Policy

ADRは、原則として過去の判断履歴を消さない。

### 25.1 Allowed Updates

許可される更新は以下である。

- 誤字修正
- リンク修正
- Related Chapters追加
- Superseded By追加
- Review Date追加
- Notes追加
- Status更新

### 25.2 Restricted Updates

注意が必要な更新は以下である。

- Decision本文の変更
- Rationaleの変更
- Consequencesの変更
- Optionsの追加削除
- Security影響の変更
- Operations影響の変更

重要な判断変更は、既存ADRを書き換えるのではなく、新しいADRを作成してSupersedeする。

---

## 26. ADR Supersede Policy

判断が変わる場合は、Supersedeを使用する。

### 26.1 Supersede Rules

ルールは以下である。

- 古いADRのStatusをSupersededにする。
- 新しいADRを作成する。
- 古いADRにSuperseded Byを記載する。
- 新しいADRにSupersedesを記載する。
- 変更理由を新しいADRに記録する。
- CHANGELOGへ反映する。
- ADR Indexを更新する。

### 26.2 Supersede Examples

Supersedeが必要な例は以下である。

- Database移行方針が大きく変わる。
- API連携方針が変わる。
- OAuth Scope方針が変わる。
- Automation外部実行方針が変わる。
- Security方針が変わる。
- Roadmap Stage方針が変わる。
- KPIやROI判断方針が変わる。

---

## 27. ADR Deprecation Policy

Deprecatedは、現在は推奨されないが履歴として残す場合に使う。

Deprecatedを使う例は以下である。

- 過去には有効だったが、現在は新方針を推奨する。
- ToolやProviderの変更により古い判断になった。
- 運用上は残るが、新規採用しない。
- 移行期間中のみ過去方針を参照する。

Deprecatedにする場合は、理由と代替方針を記録する。

---

## 28. ADR Rejection Policy

Rejectedは、検討したが採用しなかった判断を残す場合に使う。

Rejected ADRを残す目的は以下である。

- 同じ議論を繰り返さない。
- 採用しなかった理由を残す。
- 将来条件が変わったときに再検討しやすくする。
- RiskやCostの判断を残す。

Rejectedにする場合も、Context、Options、Rejected理由を記録する。

---

## 29. ADR Index Policy

ADRは一覧で管理する。

### 29.1 ADR Index Location

ADR Indexは以下で管理することを基本とする。

```text
architecture/master/adr/README.md
```

14章はADR運用方針を定義する。
実際のADR一覧は、ADRフォルダ配下のREADMEで管理する。

### 29.2 ADR Index Fields

ADR Indexには以下を含める。

```text
ADR Index Fields

- ADR Number
- Title
- Status
- Date
- Related Chapters
- Supersedes
- Superseded By
- Notes
```

### 29.3 ADR Index Rules

ルールは以下である。

- ADR作成時にIndexを更新する。
- Status変更時にIndexを更新する。
- Superseded時にIndexを更新する。
- Deprecated時にIndexを更新する。
- RejectedもIndexに残す。
- 番号の欠番を無理に埋めない。

---

## 30. ADR File Structure Policy

ADRファイルは、以下のフォルダで管理する。

```text
architecture/master/adr
```

基本構成は以下である。

```text
architecture/master/adr
  |
  +-- README.md
  +-- ADR-0001-Initial-Architecture-Policy.md
  +-- ADR-0002-Example.md
```

Rules:

- ADRはMarkdownで管理する。
- UTF-8で保存する。
- ファイル名は一意にする。
- Secret実体を含めない。
- 重要ADRはREADMEからリンクする。
- ADR削除は原則行わず、Statusで管理する。

---

## 31. ADR Candidate Policy

各章に記載された将来ADR候補は、ADR Candidateである。

### 31.1 Candidate Rules

ルールは以下である。

- CandidateはActive ADRではない。
- ADRファイルを作成した時点で正式ADRになる。
- Candidate番号は予約ではなく目安として扱う。
- 正式作成時に番号の整合性を確認する。
- Candidateを採用しない場合も問題ない。
- Candidateが重要化した場合はADR Draftを作成する。

### 31.2 Candidate Sources

ADR Candidateの発生源は以下である。

- 各Architecture章
- Roadmap Review
- Scale Gate Review
- Security Review
- Incident Review
- Provider変更
- Cost Review
- KPI Review
- CodexまたはClaude Code作業中の設計判断候補

---

## 32. ADR and Scale Gate Policy

Scale GateとADRは連携する。

### 32.1 Scale Gate to ADR

Scale Gateの結果、以下が発生する場合はADR化を検討する。

- 次Stageへ進む。
- Account数を大幅に増やす。
- Production API接続を開始する。
- Automation範囲を拡大する。
- Security例外を承認する。
- Database移行を開始する。
- Roadmap Phaseを変更する。
- Cost増加を受け入れる。
- Provider変更を行う。

### 32.2 ADR to Scale Gate

ADRで決定した内容は、必要に応じてScale Gateへ反映する。

例は以下である。

- Security Gate条件
- API Gate条件
- Database Gate条件
- Automation Gate条件
- Analytics Gate条件
- Roadmap Gate条件

ADRはScale Gateの代替ではない。
ADRは、Scale Gateで生まれた重要判断の理由を記録するために使う。

---

## 33. Security ADR Criteria

Securityに関する判断は、ADR化を強く検討する。

### 33.1 Security ADR Required Candidates

以下はADR化候補である。

- Secret管理方針変更
- Secret Store方針変更
- Access Control方針変更
- Role設計変更
- 2FA方針変更
- Recovery方針変更
- Token Rotation方針変更
- Security Incident分類変更
- Security Exception方針変更
- Production接続Security条件変更
- AI入力Security方針変更

### 33.2 Security ADR Rules

ルールは以下である。

- Secret実体をADRに含めない。
- Security Riskを明記する。
- Compensating Controlを明記する。
- Exceptionには期限を設定する。
- Critical Riskを受け入れる場合はOwner承認を必要とする。
- Security Incident後の方針変更はADR化を検討する。

---

## 34. Database ADR Criteria

Databaseに関する判断は、長期影響が大きいためADR化を検討する。

### 34.1 Database ADR Required Candidates

以下はADR化候補である。

- Database採用判断
- Database移行開始判断
- RegistryからDatabaseへのSSOT移行判断
- Core Entity設計方針変更
- Data Source Priority変更
- Backup方針変更
- Restore方針変更
- Data Retention方針変更
- Audit Log保存方針変更
- Secret Reference保存方針変更

### 34.2 Database ADR Rules

ルールは以下である。

- 物理Schema全文はADRに含めない。
- 重要なEntity方針を記録する。
- Migration Riskを記録する。
- Rollback方針を記録する。
- Secret実体を通常DBに保存しない方針を確認する。

---

## 35. API and OAuth ADR Criteria

API and OAuthに関する判断は、Security、Cost、Provider依存に影響するためADR化を検討する。

### 35.1 API and OAuth ADR Required Candidates

以下はADR化候補である。

- API Provider採用判断
- Production API接続開始判断
- OAuth Scope拡大判断
- Token管理方針変更
- Webhook利用方針変更
- Rate Limit対応方針変更
- Retry方針変更
- Unofficial連携の扱い変更
- Provider仕様変更への対応方針
- API Write操作の開始判断

### 35.2 API and OAuth ADR Rules

ルールは以下である。

- Token実体をADRに含めない。
- API Key実体をADRに含めない。
- Scopeを記録する場合は実体Secretを含めない。
- Provider依存を記録する。
- Rate LimitとRetryのリスクを記録する。
- Production Writeは特にADR化を検討する。

---

## 36. Automation and Scheduler ADR Criteria

AutomationとSchedulerに関する判断は、外部実行リスクがあるためADR化を検討する。

### 36.1 Automation ADR Required Candidates

以下はADR化候補である。

- Automation Engine採用判断
- Scheduler方針変更
- 外部Write Automation開始判断
- SNS投稿Automation開始判断
- WordPress公開Automation開始判断
- Retry方針変更
- Stop Condition方針変更
- Manual Stop方針変更
- Automation Audit Log方針変更
- Automation Scale拡大判断

### 36.2 Automation ADR Rules

ルールは以下である。

- 未承認外部実行を許可しない。
- Stop Conditionを記録する。
- Retry上限を記録する。
- Audit Log方針を記録する。
- Human Reviewの有無を記録する。
- Automation失敗時の影響を記録する。

---

## 37. AI ADR Criteria

AIに関する判断は、品質、Cost、Security、外部公開に影響するためADR化を検討する。

### 37.1 AI ADR Required Candidates

以下はADR化候補である。

- AI Provider採用判断
- AI利用範囲変更
- AI Output Review方針変更
- AIによる分析範囲拡大
- AIによるRoadmap支援範囲変更
- AI入力Data方針変更
- AI Cost上限方針変更
- AI Output公開方針変更
- AI Risk分類変更

### 37.2 AI ADR Rules

ルールは以下である。

- AIを最終判断者にしない。
- AI入力にSecretを含めない。
- AI Output公開前にHuman Reviewする。
- AI Cost影響を記録する。
- AI品質リスクを記録する。
- AI分析の推定と事実を区別する。

---

## 38. Operations ADR Criteria

Operationsに関する判断は、運用安定性と復旧可能性に影響するためADR化を検討する。

### 38.1 Operations ADR Required Candidates

以下はADR化候補である。

- Operations体制方針変更
- Runbook管理方針変更
- Incident Response方針変更
- Backup方針変更
- Restore方針変更
- Monitoring方針変更
- Alert分類変更
- Operations Scale Gate方針変更
- Offboarding運用方針変更
- Emergency Manual Fallback方針変更

### 38.2 Operations ADR Rules

ルールは以下である。

- 日常運用手順全文はADRに含めない。
- 方針変更を記録する。
- Operations Loadへの影響を記録する。
- Incident対応への影響を記録する。
- BackupとRestoreへの影響を確認する。

---

## 39. Analytics and KPI ADR Criteria

Analytics and KPIに関する判断は、成果判断とRoadmap判断に影響するためADR化を検討する。

### 39.1 Analytics ADR Required Candidates

以下はADR化候補である。

- Primary KPI変更
- Guardrail KPI変更
- KPI計算方針変更
- Attribution Model変更
- Tracking Parameter方針変更
- ROI計算方針変更
- Dashboard方針変更
- Report方針変更
- Missing Data方針変更
- Analytics Tool採用判断
- Roadmap Metrics方針変更

### 39.2 Analytics ADR Rules

ルールは以下である。

- KPI計算式詳細をADRに入れすぎない。
- KPI定義変更の影響を記録する。
- 過去比較への影響を記録する。
- Missing Dataへの影響を記録する。
- Roadmap判断への影響を記録する。

---

## 40. Roadmap ADR Criteria

Roadmapに関する判断は、導入順序、拡張判断、投資判断に影響するためADR化を検討する。

### 40.1 Roadmap ADR Required Candidates

以下はADR化候補である。

- Roadmap Architecture採用
- Phase構造変更
- Stage構造変更
- MVP範囲変更
- 100アカウント以上への拡張判断
- Production接続開始判断
- Roadmap Scale Gate方針変更
- Roadmap Exception承認
- Provider Change方針変更
- 投資判断方針変更
- Stop / Defer / Pivot方針変更

### 40.2 Roadmap ADR Rules

ルールは以下である。

- Roadmap変更理由を記録する。
- KPIとROIへの影響を記録する。
- SecurityとOperationsへの影響を記録する。
- 代替案を記録する。
- 期限付き例外は期限を記録する。

---

## 41. Mail, SNS, WordPress, and Affiliate ADR Criteria

Mail、SNS、WordPress、Affiliateに関する判断も、長期影響がある場合はADR化を検討する。

### 41.1 Mail ADR Candidates

- Mail Provider変更
- Workspace採用判断
- Forwarding方針変更
- Recovery Mail方針変更
- Mail Scale Gate方針変更

### 41.2 SNS ADR Candidates

- SNS Platform追加判断
- SNS Account Scale方針変更
- 投稿Automation開始判断
- Account Risk対応方針変更
- SNS API利用方針変更

### 41.3 WordPress ADR Candidates

- Hosting変更
- WordPress構成変更
- REST API利用方針変更
- Affiliate導線方針変更
- Backup方針変更

### 41.4 Affiliate ADR Candidates

- Affiliate ASP採用判断
- Affiliate Link管理方針変更
- Conversion定義変更
- CommissionとRevenueの扱い変更
- Attribution方針変更

---

## 42. ADR Security and Privacy Policy

ADRでは、SecurityとPrivacyを常に確認する。

### 42.1 Security Rules

ルールは以下である。

- Secret実体を含めない。
- Token実体を含めない。
- Password実体を含めない。
- API Key実体を含めない。
- Recovery Code実体を含めない。
- TOTP Secret実体を含めない。
- 個人情報は必要最小限にする。
- 外部共有を想定しても問題ない粒度にする。
- Security影響を明記する。

### 42.2 Privacy Rules

ルールは以下である。

- 個人を不要に特定しない。
- 個人情報を含むRaw DataをADRへ貼り付けない。
- 集計値で足りる場合は集計値を使う。
- 外部Providerの機密情報を含めない。
- 法令や規約に従う。

---

## 43. ADR and Codex / Claude Code Policy

CodexやClaude Codeは、ADR作成や更新を支援できる。

### 43.1 Allowed Support

許可される支援は以下である。

- ADR Draft作成
- ADR Template整形
- Related Chapters整理
- Options整理
- Consequences整理
- Review Checklist作成
- 文字化け確認
- Markdown構造確認
- CHANGELOG更新案作成

### 43.2 Not Allowed

禁止する内容は以下である。

- Codex単独でADRをAcceptedにする。
- Codex単独で重要判断を変更する。
- Codex単独でSecurity例外を承認する。
- Codex単独でProduction接続開始を判断する。
- Secret実体をADRへ追加する。
- 過去ADRを無断で書き換える。
- ADR番号を重複させる。
- CHANGELOGなしでADRを変更する。

### 43.3 Codex Reflection Rules

ADR反映時は、以下を確認する。

- UTF-8で保存する。
- Markdown構造を壊さない。
- 既存ADRをバックアップする。
- CHANGELOGを更新する。
- ADR Indexを更新する。
- マーカーや未置換文を残さない。
- Secret実体を含めない。

---

## 44. ADR Review Policy

ADRは定期的にReviewする。

### 44.1 Review Timing

Reviewタイミングは以下である。

- Phase完了時
- Scale Gate前
- Roadmap Review時
- Security Incident後
- Provider変更時
- API仕様変更時
- Cost急増時
- KPI悪化時
- Operations Load増加時
- 四半期Review時
- Owner判断時

### 44.2 Review Items

Review項目は以下である。

- Statusが正しいか。
- Supersededが必要か。
- Deprecatedが必要か。
- Related Chaptersが正しいか。
- Related Roadmap Itemsが正しいか。
- Security影響が変わっていないか。
- Operations影響が変わっていないか。
- Cost影響が変わっていないか。
- Provider前提が変わっていないか。
- ADR Indexが更新されているか。

---

## 45. ADR Change Management

ADR変更は、理由と影響範囲を記録する。

### 45.1 Change Types

ADR変更種別は以下である。

- Status Change
- Metadata Change
- Link Update
- Supersede
- Deprecation
- Rejection
- Withdrawal
- Notes Update
- Review Date Update

### 45.2 Change Rules

ルールは以下である。

- 変更理由を記録する。
- CHANGELOGを更新する。
- Status変更時はADR Indexを更新する。
- Supersede時は新旧ADRを相互リンクする。
- Decision本文の意味を変える場合は新ADRを作成する。
- Secret実体を追加しない。

---

## 46. ADR Index Initial Policy

初期ADR Indexでは、少なくとも以下を管理する。

```text
Initial ADR Index Candidate

- ADR-0001: Initial Architecture Policy for Growth Lab Core
```

今後、各章で示されたADR候補は、必要に応じて正式ADRとして作成する。
候補ADR番号は、正式作成時に番号重複や欠番を確認する。

---

## 47. ADR Candidate Categories

今後想定されるADR Candidateは、以下のカテゴリで整理する。

```text
ADR Candidate Categories

- Document Governance
- Architecture Principles
- Overall Architecture
- Mail Platform
- SNS Platform
- WordPress Platform
- AI Platform
- Growth Lab Core System
- Database
- API and OAuth
- Security
- Operations
- Analytics and KPI
- Roadmap
- Provider Change
- Scale Gate
```

カテゴリは検索性を高めるための補助情報であり、ADR番号の代替ではない。

---

## 48. ADR Data Model Overview

ADR関連情報をDatabaseで管理する場合の論理データモデルは以下である。

```text
ADR
    |
    +-- ADR Record
    +-- ADR Status
    +-- ADR Category
    +-- ADR Relationship
    +-- Related Chapter
    +-- Related Roadmap Item
    +-- Related Scale Gate
    +-- Review Record
    +-- Change Record
```

Databaseに保存する場合も、Secret実体は保存しない。
物理データベース設計は、`08_Database.md` で定義する。

---

## 49. ADR Entity Policy

ADR関連Entityは、ADRの一覧、Status、関係、Review履歴を管理するために利用する。

本章に記載するEntity項目は、概念フィールド候補である。
物理テーブル、Prisma Schema、Column名、型、Index、Constraintは、08 Databaseおよび下位実装仕様で定義する。

### 49.1 ADR Record Entity

```text
ADR Record Conceptual Fields

- ADR ID
- ADR Number
- Title
- Status
- Date
- Category
- Related Chapters
- Related Roadmap Items
- Related Scale Gate
- Supersedes
- Superseded By
- Risk Level
- Security Impact
- Operations Impact
- Cost Impact
- KPI Impact
- Owner
- Reviewer
- Approver
- File Path
- Created At
- Updated At
- Notes
```

### 49.2 ADR Review Entity

```text
ADR Review Conceptual Fields

- ADR Review ID
- ADR ID
- Review Date
- Reviewer
- Review Result
- Required Action
- Next Review Date
- Notes
```

### 49.3 ADR Change Entity

```text
ADR Change Conceptual Fields

- ADR Change ID
- ADR ID
- Change Type
- Before Status
- After Status
- Reason
- Changed By
- Changed At
- Related CHANGELOG Entry
- Notes
```

### 49.4 ADR Entity Rules

ルールは以下である。

- Secret実体をADR関連Entityへ保存しない。
- ADR番号を一意にする。
- Status変更履歴を残す。
- SupersedesとSuperseded Byを管理する。
- Related Chaptersを管理する。
- 物理設計は08章へ委譲する。

---

## 50. ADR File Naming Examples

ADRファイル名の例は以下である。

```text
ADR-0001-Initial-Architecture-Policy.md
ADR-0002-Markdown-As-Primary-Source.md
ADR-0003-Identity-Mail-SNS-One-To-One-Policy.md
ADR-0004-API-First-Integration-Policy.md
ADR-0005-Core-Architecture-Principles.md
```

ファイル名は、内容が分かる短い英語表記を推奨する。
日本語タイトルは本文内のTitleで表現できる。

---

## 51. ADR Link Policy

ADRは、関連文書とリンクする。

### 51.1 Link Targets

リンク対象は以下である。

- Related Architecture Chapter
- Related Roadmap Item
- Related Scale Gate
- Related CHANGELOG Entry
- Related Implementation Spec
- Related Runbook
- Related Incident
- Related KPI Report

### 51.2 Link Rules

ルールは以下である。

- 関連章を明記する。
- Roadmap判断に関係する場合はRoadmap Itemを記録する。
- Scale Gateに関係する場合はGateを記録する。
- Supersede関係を明記する。
- リンク切れを定期Reviewする。
- 機密URLやSecretを含めない。

---

## 52. ADR Governance Policy

ADR Governanceは、ADRが増えても管理可能な状態を維持するための方針である。

### 52.1 Governance Rules

ルールは以下である。

- ADR Indexを維持する。
- Statusを維持する。
- 重複ADRを避ける。
- 古いADRを放置しない。
- Superseded ADRを明確にする。
- Rejected ADRも残す。
- 四半期Reviewを行う。
- CHANGELOGと整合させる。
- Roadmapと整合させる。
- Secret実体を含めない。

### 52.2 Governance Failure Signs

ADR Governanceが崩れている兆候は以下である。

- ADR番号が重複している。
- ADR Indexが更新されていない。
- Superseded関係が不明である。
- Acceptedのまま古い方針が残っている。
- RoadmapとADRが矛盾している。
- CHANGELOGに変更履歴がない。
- ADRにSecretが含まれている。
- ADRが多すぎて検索できない。

---

## 53. ADR Operations Boundary

ADR運用は11章と連携する。

本章が定義するものは以下である。

- ADR作成方針
- ADR Status方針
- ADR Template方針
- ADR Review方針
- ADR Index方針
- ADR Supersede方針

11章が定義するものは以下である。

- ADR Reviewをいつ確認するか
- CHANGELOG更新運用
- Documentation Review運用
- Codex / Claude Code反映作業の運用確認
- 定期Reviewの実施確認

この分界により、14章が日常運用手順に入りすぎることを防ぎ、11章がADR判断方針そのものを抱え込みすぎることを防ぐ。

---

## 54. Architecture Constraints

ADR基盤では、以下の制約を前提とする。

- ADRはMarkdownで管理する。
- ADRはUTF-8で保存する。
- ADR番号は再利用しない。
- ADRは重要判断に限定する。
- ADRはCHANGELOGの代替ではない。
- ADRはRoadmapの代替ではない。
- ADRはDecision Logの代替ではない。
- ADRはRunbookの代替ではない。
- ADRは実装仕様の代替ではない。
- ADRにSecret実体を含めない。
- ADRにToken実体を含めない。
- ADRにPassword実体を含めない。
- ADRにAPI Key実体を含めない。
- ADRは過去判断を無断で消さない。
- 判断変更時はSupersedeを使う。
- ADR Indexを更新する。
- 重要ADRはHuman Reviewする。
- AIはADR Draftを支援できるが、最終判断者にはならない。
- CodexやClaude Code単独でADRをAcceptedにしない。

---

## 55. Risks

本章に関連する主なリスクは以下である。

### 55.1 Risk: 重要判断がADR化されない

重要な設計判断が口頭や一時メモだけで残り、将来理由が分からなくなる可能性がある。

軽減策：

- ADR Creation Criteriaを定義する。
- Scale GateやRoadmap ReviewでADR候補を確認する。
- 重要判断はReview時にADR化を検討する。

### 55.2 Risk: ADRが多すぎて管理できない

軽微な判断までADR化し、検索や保守が困難になる可能性がある。

軽減策：

- ADR Not Required Conditionsを定義する。
- 軽微判断はDecision Logへ記録する。
- ADRは長期影響のある判断に絞る。

### 55.3 Risk: ADRとCHANGELOGが混同される

ファイル更新履歴と設計判断理由が混在する可能性がある。

軽減策：

- ADRとCHANGELOGの責任分界を定義する。
- CHANGELOGには変更内容を記録する。
- ADRには判断理由を記録する。

### 55.4 Risk: ADRとRoadmapが混同される

実装順序と設計判断が混在し、RoadmapがADR化されすぎる可能性がある。

軽減策：

- Roadmap Decisionとの分界を定義する。
- Roadmapの重要判断のみADR化する。
- Roadmap Itemは13章で管理する。

### 55.5 Risk: 古いADRが放置される

過去のADRがAcceptedのまま残り、現在の方針と矛盾する可能性がある。

軽減策：

- ADR Reviewを定期実施する。
- Superseded、Deprecatedを使う。
- ADR Indexを更新する。

### 55.6 Risk: ADRにSecretが含まれる

Secret、Token、API Key、PasswordなどがADRに記録される可能性がある。

軽減策：

- Secret実体を禁止する。
- Codex反映時に禁止文字列とSecret疑いを確認する。
- Security Reviewを行う。

### 55.7 Risk: CodexがADRを勝手にAcceptedにする

AIやCodexが人間判断なしにADRを採用状態にする可能性がある。

軽減策：

- AIはDraft支援のみとする。
- AcceptedにはHuman Reviewを必要とする。
- Codex単独で重要判断を変更しない。

### 55.8 Risk: Supersedeせずに過去ADRを書き換える

過去判断の履歴が失われる可能性がある。

軽減策：

- Supersede Policyを定義する。
- 判断変更は新ADRで記録する。
- 旧ADRにSuperseded Byを記録する。

### 55.9 Risk: ADR番号が重複する

複数のADR作成により番号が重複する可能性がある。

軽減策：

- ADR Indexを確認する。
- 番号を再利用しない。
- 正式作成時に番号を確定する。

### 55.10 Risk: 14章が実装詳細に入りすぎる

ADR章が、実装コード、SQL、API endpoint、Runbook詳細、KPI計算式詳細を抱え込みすぎる可能性がある。

軽減策：

- 14章はADR運用方針までに限定する。
- 実装詳細は下位実装仕様へ委譲する。
- Runbook詳細は11章または下位Runbookへ委譲する。
- KPI計算式詳細は12章へ委譲する。

---

## 56. Required Review Checklist

本章を更新する場合は、以下を確認する。

```text
Required Review Checklist

1. ADR全体方針が明確か
2. ADR Principlesが定義されているか
3. 00 Document Governanceとの責任分界が明確か
4. 01 Architecture Principlesとの責任分界が明確か
5. 07との責任分界が明確か
6. 08との責任分界が明確か
7. 09との責任分界が明確か
8. 10との責任分界が明確か
9. 11との責任分界が明確か
10. 12との責任分界が明確か
11. 13との責任分界が明確か
12. ADRとDecision Logの分界が明確か
13. ADRとCHANGELOGの分界が明確か
14. ADRとRoadmapの分界が明確か
15. ADR作成条件が定義されているか
16. ADR化不要条件が定義されているか
17. ADR Triage Policyが定義されているか
18. ADR番号体系が定義されているか
19. ADR Statusが定義されているか
20. ADR Lifecycleが定義されているか
21. ADR Templateが定義されているか
22. ADR Metadata Policyが定義されているか
23. ADR Context Policyが定義されているか
24. ADR Decision Policyが定義されているか
25. ADR Options Policyが定義されているか
26. ADR Consequences Policyが定義されているか
27. ADR Approval Policyが定義されているか
28. ADR Update Policyが定義されているか
29. ADR Supersede Policyが定義されているか
30. ADR Deprecation Policyが定義されているか
31. ADR Rejection Policyが定義されているか
32. ADR Index Policyが定義されているか
33. ADR File Structure Policyが定義されているか
34. ADR Candidate Policyが定義されているか
35. ADR and Scale Gate Policyが定義されているか
36. Security ADR Criteriaが定義されているか
37. Database ADR Criteriaが定義されているか
38. API and OAuth ADR Criteriaが定義されているか
39. Automation ADR Criteriaが定義されているか
40. AI ADR Criteriaが定義されているか
41. Operations ADR Criteriaが定義されているか
42. Analytics and KPI ADR Criteriaが定義されているか
43. Roadmap ADR Criteriaが定義されているか
44. ADR Security and Privacy Policyが定義されているか
45. Codex / Claude Code Policyが定義されているか
46. ADR Review Policyが定義されているか
47. ADR Change Managementが定義されているか
48. ADR Governance Policyが定義されているか
49. Final Master Architecture Closureが定義されているか
50. Secret実体を本文に含めていないか
51. 実装詳細に入りすぎていないか
52. Runbook詳細に入りすぎていないか
53. KPI計算式詳細に入りすぎていないか
```

---

## 57. Review Points

本章のレビューでは、以下を確認する。

- ADRが重要な設計判断の記録として定義されているか。
- 00、01、07、08、09、10、11、12、13との責任分界が明確か。
- ADRとDecision Logの違いが明確か。
- ADRとCHANGELOGの違いが明確か。
- ADRとRoadmapの違いが明確か。
- ADR番号体系が明確か。
- ADR Statusが明確か。
- ADR Lifecycleが明確か。
- ADR Templateが実用的か。
- Triage方針があるか。
- Supersede方針が明確か。
- 過去判断を無断で書き換えない方針になっているか。
- ADR Index方針があるか。
- Scale GateとADRの関係が明確か。
- Security、Database、API、Automation、AI、Operations、Analytics、RoadmapのADR化基準があるか。
- Secret実体を含まない方針が明確か。
- CodexやClaude CodeがADRを勝手にAcceptedにできない方針になっているか。
- 実装コードやRunbook詳細に入りすぎていないか。
- 最終章として、Master Architecture全体の判断記録ルールを閉じられているか。

---

## 58. Integration with Other Chapters

本章は、以下の章と連携する。

### 58.1 00 Document Governance

文書体系、正本、変更管理、Markdown管理方針に関係する。

### 58.2 01 Architecture Principles

ADR判断の優先順位と設計原則に関係する。

### 58.3 02 Overall Architecture

全体Architectureに関わる重要判断をADRとして記録する。

### 58.4 03 Mail Platform

Mail Provider、Recovery、Mail Scale方針に関わる重要判断をADRとして記録する。

### 58.5 04 SNS Platform

SNS Platform、Account Scale、投稿Automation、API利用方針に関わる重要判断をADRとして記録する。

### 58.6 05 WordPress Platform

Hosting、WordPress構成、Affiliate導線、REST API方針に関わる重要判断をADRとして記録する。

### 58.7 06 AI Platform

AI Provider、AI利用範囲、AI Output Review、AI Cost、AI Riskに関わる重要判断をADRとして記録する。

### 58.8 07 Growth Lab Core System

Workflow、Approval Gate、Scheduler、Automation、Monitoringに関わる重要判断をADRとして記録する。

### 58.9 08 Database

Database移行、Entity、Data Integrity、Backup、Restoreに関わる重要判断をADRとして記録する。

### 58.10 09 API and OAuth

API Provider、OAuth Scope、Token Reference、Webhook、Rate Limit、Production Writeに関わる重要判断をADRとして記録する。

### 58.11 10 Security

Secret、Access Control、2FA、Security Incident、Security Exceptionに関わる重要判断をADRとして記録する。

### 58.12 11 Operations

Runbook方針、Incident Response、Backup、Restore、Operations Scale Gateに関わる重要判断をADRとして記録する。

### 58.13 12 Analytics and KPI

KPI、Attribution、ROI、Report、Dashboard、Analytics and KPI Scale Gateに関わる重要判断をADRとして記録する。

### 58.14 13 Roadmap

Phase、Stage、Roadmap Scale Gate、Provider Change、Roadmap Exceptionに関わる重要判断をADRとして記録する。

---

## 59. Chapter Responsibility Boundary

本章では、ADR基盤の上位設計と運用方針を定義する。

```text
14 ADR
    |
    +-- Defines:
    |       +-- ADR principles
    |       +-- ADR creation criteria
    |       +-- ADR non-creation criteria
    |       +-- ADR triage policy
    |       +-- ADR numbering policy
    |       +-- ADR status policy
    |       +-- ADR lifecycle
    |       +-- ADR template
    |       +-- ADR metadata policy
    |       +-- ADR context policy
    |       +-- ADR decision policy
    |       +-- ADR options policy
    |       +-- ADR consequences policy
    |       +-- ADR approval policy
    |       +-- ADR update policy
    |       +-- ADR supersede policy
    |       +-- ADR deprecation policy
    |       +-- ADR rejection policy
    |       +-- ADR index policy
    |       +-- ADR candidate policy
    |       +-- ADR and Scale Gate policy
    |       +-- Security ADR criteria
    |       +-- Database ADR criteria
    |       +-- API and OAuth ADR criteria
    |       +-- Automation ADR criteria
    |       +-- AI ADR criteria
    |       +-- Operations ADR criteria
    |       +-- Analytics ADR criteria
    |       +-- Roadmap ADR criteria
    |       +-- ADR governance policy
    |
    +-- Does not define:
            +-- Full individual ADR bodies
            +-- Full implementation code
            +-- Full database schema
            +-- Full API endpoint specification
            +-- Full OAuth implementation
            +-- Full operations runbook
            +-- Full KPI calculation details
            +-- Detailed sprint schedule
            +-- Secret実体
            +-- Legal judgment final decision
```

ADRは重要判断を記録する。
実装詳細は下位実装仕様で扱う。
運用手順は11章で扱う。
KPI定義と計算式は12章で扱う。
Roadmap判断は13章で扱う。

---

## 60. Final Master Architecture Closure

本章は、Growth Lab Core Master Architecture Specificationの最終章である。

00章から13章までで定義されたArchitecture、Operations、Analytics、Roadmapは、将来変更される可能性がある。
その変更を安全に行うために、14章ではADR方針を定義する。

これにより、Growth Lab Coreは以下を満たす。

- 文書体系がある。
- 設計原則がある。
- 全体Architectureがある。
- Mail、SNS、WordPress、AIのPlatform方針がある。
- Core System方針がある。
- Database方針がある。
- API and OAuth方針がある。
- Security方針がある。
- Operations方針がある。
- Analytics and KPI方針がある。
- Roadmap方針がある。
- ADR方針がある。

今後の開発、運用、改善、拡張では、各章の方針とADRを参照し、重要判断を記録しながら進める。

---

## 61. Architecture Decision Records

本章に関連するADRは以下の通りである。

```text
Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core
```

本章に関連して、今後追加が想定されるADRは以下である。

```text
ADR-0005: Core Architecture Principles
ADR-0016: Scale Gate Policy
ADR-0052: Growth Lab Core System Architecture
ADR-0058: Audit Log Policy
ADR-0094: Operations Architecture
ADR-0107: Analytics and KPI Architecture
ADR-0119: Roadmap Architecture
ADR-0132: ADR Governance Policy
ADR-0133: ADR Numbering and Status Policy
ADR-0134: ADR Template Policy
ADR-0135: ADR Supersede and Deprecation Policy
ADR-0136: ADR Index Policy
ADR-0137: ADR and Scale Gate Policy
ADR-0138: ADR and Codex Claude Code Policy
ADR-0139: ADR Triage Policy
ADR-0140: Decision Log Boundary Policy
```

以下の判断を変更する場合は、ADR作成を検討する。

- ADR作成条件の変更
- ADR作成不要条件の変更
- ADR Triage方針の変更
- ADR番号体系の変更
- ADR Statusの変更
- ADR Templateの変更
- ADR Lifecycleの変更
- ADR Supersede方針の変更
- ADR Index方針の変更
- ADRとDecision Logの責任分界変更
- ADRとCHANGELOGの責任分界変更
- ADRとRoadmapの責任分界変更
- ADRとScale Gateの関係変更
- CodexやClaude CodeによるADR反映方針変更

---
