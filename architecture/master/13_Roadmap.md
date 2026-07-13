# 13 Roadmap

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/13_Roadmap.md

---

## 1. Purpose

本章の目的は、Growth Lab CoreにおけるRoadmap基盤の設計方針を定義することである。

Growth Lab Coreは、SNS、Mail、WordPress、Affiliate、AI、Database、API、OAuth、Security、Operations、Analytics、KPI、Scheduler、Automationを統合する運用基盤である。
これらを一度に実装、拡張、外部連携、Automation化すると、Security、運用負荷、Cost、規約、品質、復旧可能性のリスクが高くなる。

そのため、Growth Lab Coreでは、実装と拡張を段階的に進める。
Roadmapは、単なる作業予定表ではない。
Growth Lab Core全体における、実装順序、優先順位、Scale Stage、投資判断、拡張判断、延期判断、停止判断、改善判断を管理する意思決定基盤である。

本章では、以下を定義する。

- Roadmap全体方針
- 07 Growth Lab Core Systemとの責任分界
- 08 Databaseとの責任分界
- 09 API and OAuthとの責任分界
- 10 Securityとの責任分界
- 11 Operationsとの責任分界
- 12 Analytics and KPIとの責任分界
- 14 ADRとの責任分界
- Roadmap Principles
- Roadmap Decision Policy
- Phase設計
- MVP方針
- 実装優先順位
- 依存関係管理
- Readiness確認
- Scale Stage
- Database移行Roadmap
- API and OAuth連携Roadmap
- Security強化Roadmap
- Operations標準化Roadmap
- Analytics and KPI強化Roadmap
- Automation拡張Roadmap
- AI活用拡張Roadmap
- Mail / SNS / WordPress / Affiliate拡張Roadmap
- Cost / ROIに基づく投資判断
- Roadmap変更管理
- Roadmap Review
- Roadmap Scale Gate
- Roadmap Risks and Mitigation

---

## 2. Scope

本章の対象範囲は、Growth Lab Coreの段階導入、実装順序、優先順位、拡張判断、Roadmap管理の上位設計である。

対象範囲は以下を含む。

- Roadmap Architecture
- Roadmap Responsibility Boundary
- Roadmap Principles
- Roadmap Decision Policy
- Roadmap Item Policy
- Phase Policy
- MVP Policy
- Priority Policy
- Dependency Policy
- Readiness Policy
- Investment Decision Policy
- Cost and ROI Review
- Stop and Defer Policy
- Scale Stage Policy
- Initial 20 Account Stage
- 50 Account Stage
- 100 Account Stage
- 300 Account Stage
- 500 Account Stage
- Database Migration Roadmap
- API and OAuth Roadmap
- Security Roadmap
- Operations Roadmap
- Analytics and KPI Roadmap
- Automation Roadmap
- AI Roadmap
- Mail Roadmap
- SNS Roadmap
- WordPress Roadmap
- Affiliate Roadmap
- Reporting Roadmap
- Provider Change Roadmap
- Roadmap Change Management
- Roadmap Review
- Roadmap Governance
- Roadmap Scale Gate
- ADR連携

本章では、個別機能の実装コード、具体的な開発チケット全文、スプリント日程、担当者別の詳細作業予定、実際の開発工数見積もり、個別ProviderのAPI仕様、KPI計算式詳細、Runbook全文までは定義しない。
それらは、下位実装仕様、プロジェクト管理資料、11 Operations、12 Analytics and KPI、または個別実装チケットで扱う。

---

## 3. Non-Goals

本章では、以下を対象外とする。

- 実装コード全文
- Database物理設計
- Prisma Schema全文
- API endpoint詳細
- OAuth実装手順
- Secret実体
- 個別サービス管理画面の操作手順
- Runbook全文
- Dashboard実装コード
- BIツール設定詳細
- KPI計算式詳細
- 個別Campaignの詳細企画
- 個別投稿文の作成
- 個別WordPress記事の編集方針
- 詳細な人員シフト
- 確定納期としてのカレンダー日程
- 詳細スプリント計画
- 詳細WBS
- 個別担当者の稼働計画
- 契約や法務判断の最終確定
- 個別規約違反判断の最終確定

Roadmapは、作業の方向性、順序、判断条件を定義する。
実際の実装タスク、担当者、日程、コード、テスト手順は、下位資料で管理する。

---

## 4. Background

Growth Lab Coreは、初期20SNSアカウント規模から開始し、将来的に100から500アカウント規模までの拡張を想定している。

ただし、アカウント数を増やすこと自体が目的ではない。
目的は、SNS、WordPress、Affiliate、AI、Analytics、Operationsを組み合わせ、継続的に成果を改善できる基盤を作ることである。

拡張を急ぎすぎると、以下の問題が発生する。

- Mail Account管理が追いつかない。
- SNS Account状態の確認が遅れる。
- WordPress記事やAffiliate Linkの管理が複雑になる。
- AI Outputが未レビューのまま増える。
- API and OAuthの接続管理が不安定になる。
- Database移行前にRegistryが破綻する。
- Security Reviewが追いつかない。
- Secret、Token、Recovery情報の扱いが危険になる。
- Automationが未承認で外部実行される。
- KPIが未整備のままScale判断される。
- Costが増えてもROIが判断できない。
- Roadmapの優先順位が感覚的になる。
- Provider規約変更やAPI変更に追従できなくなる。
- Incident未解決のまま拡張して被害が広がる。

そのため、Growth Lab Coreでは、Phase、Stage、Gate、KPI、ADRを使って段階的に実装と拡張を行う。

---

## 5. Alignment with Architecture Principles

本章は、`01_Architecture_Principles.md` で定義した原則に従う。

特に、Roadmapでは以下を重視する。

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

Roadmapにおける優先順位は以下である。

```text
1. Compliance
2. Security
3. Operational Safety
4. Single Source of Truth
5. Data Integrity
6. Measurable Outcome
7. Cost and ROI
8. Scalability
9. Automation Readiness
10. AI Utilization
11. Continuous Improvement
```

Roadmapでは、効率よりも、規約遵守、Security、復旧可能性、測定可能性、運用安定性を優先する。

---

## 6. Roadmap Principles

Growth Lab CoreのRoadmapは、以下の原則に従う。

### 6.1 Gate-Based Roadmap

Roadmapは、日付だけで進めない。
次のPhaseまたはStageへ進む前に、Scale Gate、Security Review、Operations Review、KPI Review、Cost Reviewを確認する。

### 6.2 MVP First

最初から完全な自動化や大規模運用を目指さない。
初期段階では、手動確認、Registry、Mock Mode、最小限のWorkflowを優先する。

### 6.3 Measure Before Scale

拡張前に測定基盤を整える。
KPI、Cost、ROI、Operations Load、Security Riskが確認できない状態で大規模化しない。

### 6.4 Security Before Automation

Automation拡大よりも、Secret管理、Access Control、Approval Gate、Audit Log、停止条件を優先する。

### 6.5 Manual Before Unsafe Automation

公式API、承認済み範囲、停止条件、Retry制限、Audit Logが整うまでは、手動運用または半自動運用を優先する。

### 6.6 Database When Registry Becomes Risk

初期段階ではGoogle SheetsやMarkdownによるRegistryを許容する。
ただし、件数、関係性、更新頻度、整合性リスクが高まった場合は、Database移行を優先する。

### 6.7 API Readiness Before Production

外部APIやOAuth連携は、Mock、Sandbox、Limited Production Read、Limited Production Writeの順で段階的に進める。

### 6.8 AI Supports, Humans Decide

AIはRoadmap分析、優先順位案、改善案、Report案を支援できる。
ただし、Roadmapの最終判断、投資判断、Security判断、外部公開判断は人間が行う。

### 6.9 Roadmap Changes Must Be Recorded

Roadmap変更は、理由、影響範囲、変更前後、承認者、関連ADRを記録する。

### 6.10 Stop or Defer is a Valid Decision

準備不足、Security Risk、Operations Load過大、KPI未定義、Cost不明、ROI不明、Provider Riskがある場合は、停止または延期を正式な判断として扱う。

---

## 7. Roadmap Vision

Roadmap基盤は、設計、実装、運用、分析、改善を段階的につなぐ管理基盤である。

```text
Master Architecture
  |
  v
Roadmap
  |
  +-- Phase
  +-- Stage
  +-- Milestone
  +-- Gate
  +-- Roadmap Item
  +-- Priority
  +-- Dependency
  +-- Risk
  +-- Cost
  +-- KPI
  +-- ADR
  |
  v
Implementation
  |
  v
Operations
  |
  v
Analytics
  |
  v
Improvement
```

Roadmap基盤は、以下を実現する。

- 実装順序を明確にする。
- 拡張判断を感覚ではなく条件で行う。
- SecurityとOperationsを先回りして整備する。
- Database移行のタイミングを判断する。
- API and OAuth連携の準備状態を判断する。
- Automation拡張の安全性を判断する。
- AI活用拡大の効果とリスクを判断する。
- CostとROIを考慮して投資判断する。
- Scale GateとADRをRoadmapに接続する。
- Provider変更時にRoadmapを見直す。
- 継続的な改善計画を管理する。

---

## 8. Relationship with 07, 08, 09, 10, 11, 12, and 14

`07_Growth_Lab_Core_System.md` は、Growth Lab Coreのシステム構造、Workflow、Approval Gate、Scheduler、Automation、Monitoringを定義する。
`08_Database.md` は、Database移行、Entity、Relation、保存方針、Backup、Data Integrityを定義する。
`09_API_OAuth.md` は、外部API、OAuth、Scope、Token Reference、Webhook、Rate Limit、Retryを定義する。
`10_Security.md` は、Secret、Access Control、2FA、Security Incident、Security Reviewを定義する。
`11_Operations.md` は、Daily、Weekly、Monthly、Runbook、Incident、Backup、Restore、Operations Scale Gateを定義する。
`12_Analytics_KPI.md` は、KPI定義、計算式、ROI、Report、Dashboard、Scale Gate Metrics、Roadmap Metricsを定義する。
`14_ADR.md` は、重要な設計判断と変更判断を記録する方針を定義する。
本章は、それらをもとに、実装順序、Phase、Stage、優先順位、投資判断、拡張判断、延期判断、停止判断を定義する。

責任分界は以下である。

```text
07 Growth Lab Core System
    |
    +-- System Structure
    +-- Workflow
    +-- Approval Gate
    +-- Scheduler
    +-- Automation
    +-- Monitoring
    |
    v
13 Roadmap
    |
    +-- Phase Plan
    +-- Stage Plan
    +-- Priority
    +-- Dependency
    +-- Investment Decision
    +-- Expansion Decision
    +-- Defer Decision
    +-- Stop Decision
    +-- Roadmap Gate
    |
    +-- Uses data model and migration readiness from:
    v
08 Database
    |
    +-- Database Migration Readiness
    +-- Data Integrity
    +-- Backup Readiness
    |
    +-- Uses integration readiness from:
    v
09 API and OAuth
    |
    +-- Provider Readiness
    +-- OAuth Readiness
    +-- Rate Limit Readiness
    +-- Production Connection Readiness
    |
    +-- Uses security readiness from:
    v
10 Security
    |
    +-- Secret Readiness
    +-- Access Control Readiness
    +-- Security Review
    +-- Security Incident Status
    |
    +-- Uses operations readiness from:
    v
11 Operations
    |
    +-- Operations Load
    +-- Incident Status
    +-- Runbook Readiness
    +-- Scale Gate Material
    |
    +-- Uses KPI and ROI from:
    v
12 Analytics and KPI
    |
    +-- KPI
    +-- ROI
    +-- Cost
    +-- Roadmap Metrics
    +-- Scale Gate Metrics
    |
    +-- Records major decisions through:
    v
14 ADR
    |
    +-- Architecture Decision
    +-- Roadmap Decision
    +-- Policy Change
```

13章は、他章の設計内容を置き換えない。
13章は、他章で定義された基準を使い、いつ、どの順序で、どこまで進めるかを管理する。

---

## 9. Roadmap Architecture Overview

Roadmap Architectureは、Roadmap Item、Phase、Stage、Gate、Decision、Reviewで構成する。

```text
Roadmap Item
  |
  v
Priority Review
  |
  v
Dependency Review
  |
  v
Readiness Review
  |
  v
Phase Assignment
  |
  v
Gate Review
  |
  v
Implementation
  |
  v
Operations Review
  |
  v
KPI Review
  |
  v
Next Roadmap Update
```

Roadmapでは、実装だけでなく、実装後の運用、測定、改善、延期、停止も管理する。

---

## 10. Roadmap Responsibility Boundary

Roadmap章は、実装順序、優先順位、Phase、Stage、Gate、Decisionの方針を定義する。

### 10.1 Roadmap Responsibilities

本章が責任を持つ範囲は以下である。

- Roadmap全体方針
- Roadmap Decision方針
- Phase設計
- Stage設計
- MVP方針
- 優先順位方針
- 依存関係方針
- Readiness判断
- Investment判断
- Cost and ROI判断
- Stop and Defer判断
- Scale Gate連携
- Database移行時期の判断方針
- API and OAuth連携時期の判断方針
- Security強化時期の判断方針
- Operations標準化時期の判断方針
- Analytics and KPI強化時期の判断方針
- Automation拡張時期の判断方針
- AI活用拡張時期の判断方針
- Roadmap変更管理
- Roadmap Review
- ADR連携

### 10.2 Roadmap Does Not Define

本章では以下を定義しない。

- 個別機能の実装コード
- Database物理設計
- API endpoint詳細
- OAuth実装手順
- Secret実体
- 個別Runbook全文
- KPI計算式詳細
- Dashboard実装コード
- 個別Campaign企画
- 個別投稿文
- 詳細スプリント計画
- 担当者別の細かい作業予定
- 確定納期としてのカレンダー日程

---

## 11. Roadmap Terms

Roadmapで利用する用語を定義する。

### 11.1 Phase

Phaseは、実装や整備を進める大きな区切りである。
例として、Database基盤整備、API連携、Automation拡張、Analytics強化などが該当する。

### 11.2 Stage

Stageは、運用規模や成熟度を示す。
例として、20アカウント、50アカウント、100アカウント、300アカウント、500アカウント規模が該当する。

### 11.3 Milestone

Milestoneは、Phase内の重要な到達点である。
例として、Registry完成、Database移行完了、OAuth接続成功、Daily Report開始などが該当する。

### 11.4 Gate

Gateは、次のPhaseまたはStageへ進む前の確認条件である。
Security、Operations、KPI、Cost、ROI、Scale Risk、Recoveryを確認する。

### 11.5 Roadmap Item

Roadmap Itemは、Roadmapで管理する作業、機能、整備、改善、検証の単位である。

### 11.6 Release

Releaseは、実装内容を利用可能な状態に反映することである。
Releaseは、必ずしもProduction公開を意味しない。

### 11.7 Deferred

Deferredは、今は実施しないが、将来候補として残す状態である。

### 11.8 Stop

Stopは、Security、規約、運用負荷、Cost、Incident、Provider Riskなどにより、対象の実行または拡張を止める判断である。

### 11.9 Pivot

Pivotは、目的を維持したまま、手段、技術、Provider、優先順位、Phaseを変更する判断である。

---

## 12. Phase and Stage Boundary

PhaseとStageは混同しない。

```text
Phase
  = 何をどの順番で整備するか

Stage
  = どの運用規模、成熟度まで拡張するか
```

例は以下である。

- Phase 3はDatabase Foundationであり、Database整備の段階を示す。
- Stage 3は51から100 SNS Accounts規模であり、運用規模を示す。
- Phaseが進んでいても、Stageを上げられるとは限らない。
- Stageを上げるには、Security、Operations、KPI、Cost、ROI、Scale Gateが必要である。

---

## 13. Roadmap Item Policy

Roadmap Itemは、実装対象や改善対象を管理する基本単位である。

### 13.1 Roadmap Item Fields

Roadmap Itemには以下を持たせる。

```text
Roadmap Item Fields

- Roadmap Item ID
- Title
- Category
- Related Chapter
- Purpose
- Expected Outcome
- Priority
- Status
- Phase
- Stage
- Dependency
- Risk Level
- Security Impact
- Operations Impact
- KPI Impact
- Cost Impact
- ROI Potential
- Owner
- Reviewer
- Approver
- Created At
- Updated At
- Decision Log
- Related ADR
- Notes
```

### 13.2 Roadmap Item Status

Roadmap ItemのStatusは以下を基本とする。

```text
Roadmap Item Status

Backlog
Planned
Ready
In Progress
Blocked
In Review
Completed
Deferred
Stopped
Canceled
```

### 13.3 Roadmap Item Rules

ルールは以下である。

- 目的を明確にする。
- 期待成果を明確にする。
- 関連章を明確にする。
- 依存関係を確認する。
- Security Impactを確認する。
- Operations Impactを確認する。
- KPI Impactを確認する。
- Cost Impactを確認する。
- ROI Potentialを確認する。
- 重要判断はADR候補にする。

---

## 14. Roadmap Decision Policy

Roadmap判断は、Go、No Go、Defer、Stop、Pivot、Cancelを明確に分ける。

### 14.1 Decision Types

Roadmap Decision Typeは以下を基本とする。

```text
Roadmap Decision Types

Go
No Go
Defer
Stop
Pivot
Cancel
Continue
Scale Up
Scale Down
```

### 14.2 Decision Rules

判断ルールは以下である。

- 判断理由を記録する。
- 判断に使ったKPIを記録する。
- Security Riskを確認する。
- Operations Loadを確認する。
- CostとROIを確認する。
- Provider Riskを確認する。
- 代替案を検討する。
- 重要判断はApproval Gateを通す。
- 重要判断はADR候補にする。

### 14.3 Stop or Defer Conditions

停止または延期条件は以下である。

- Critical Security Riskがある。
- Secret漏洩疑いがある。
- 未解決の重大Incidentがある。
- Operations Loadが許容範囲を超えている。
- KPIが未定義で成果測定できない。
- Missing Dataが多く判断できない。
- Costが不明または急増している。
- ROI前提が不明である。
- Provider規約変更の影響が未確認である。
- Approval Gateが未整備である。
- BackupまたはRestore方針が未整備である。

---

## 15. Priority Policy

Roadmapの優先順位は、Impact、Risk、Cost、Readiness、ROI、Operations Loadを総合して判断する。

### 15.1 Priority Levels

Priority Levelは以下を基本とする。

```text
Priority Levels

P0: Critical
P1: High
P2: Medium
P3: Low
P4: Deferred
```

### 15.2 Priority Criteria

優先順位の判断基準は以下である。

- Complianceへの影響
- Securityへの影響
- Operations安定性への影響
- Data Integrityへの影響
- KPI測定への影響
- ROI改善可能性
- Cost削減効果
- Automation安全性への影響
- Scale Gateへの影響
- 実装難易度
- 運用負荷
- 依存関係
- 復旧可能性

### 15.3 Priority Score Candidate

優先順位の参考スコアは以下である。

```text
Priority Score
  =
Business Impact
+ Risk Reduction
+ Learning Value
+ ROI Potential
+ Scale Enablement
- Implementation Complexity
- Cost
- Operations Load
- Security Risk
```

このScoreは参考値であり、最終判断ではない。
P0やP1の判断は、OwnerまたはApproverの確認を必要とする。

---

## 16. Dependency Policy

Roadmap Itemは、依存関係を確認してからPhaseへ割り当てる。

### 16.1 Dependency Types

依存関係の種類は以下である。

- Architecture Dependency
- Database Dependency
- API Dependency
- OAuth Dependency
- Security Dependency
- Operations Dependency
- Analytics Dependency
- WordPress Dependency
- SNS Dependency
- Mail Dependency
- AI Dependency
- External Provider Dependency
- Human Resource Dependency
- Cost Dependency
- ADR Dependency

### 16.2 Dependency Rules

依存関係のルールは以下である。

- 依存先が未完成の場合はReadyにしない。
- Security依存がある場合はSecurity Reviewを行う。
- Database依存がある場合はMigrationとBackupを確認する。
- API依存がある場合はMockまたはSandboxで検証する。
- Operations依存がある場合はRunbookと担当者を確認する。
- Analytics依存がある場合はKPI定義とData Sourceを確認する。
- Provider依存が強い場合は代替案を検討する。
- ADR依存がある場合はADR作成後に進行する。

---

## 17. Readiness Policy

Roadmap Itemを開始する前に、Readinessを確認する。

### 17.1 Readiness Categories

Readiness確認カテゴリは以下である。

- Architecture Readiness
- Data Readiness
- Security Readiness
- Operations Readiness
- API Readiness
- Analytics Readiness
- Cost Readiness
- Human Readiness
- Recovery Readiness
- Provider Readiness
- ADR Readiness

### 17.2 Readiness Rules

Readinessルールは以下である。

- 目的が明確であること。
- 完了条件が明確であること。
- 依存関係が確認されていること。
- Security Impactが確認されていること。
- Operations Impactが確認されていること。
- KPIが定義されていること。
- Cost Impactが確認されていること。
- Rollbackまたは停止方針があること。
- Provider Riskが確認されていること。
- 重要変更はApproval Gateを通すこと。

---

## 18. MVP Policy

MVPは、Growth Lab Coreの価値を最小構成で検証するための初期実装である。

### 18.1 MVP Purpose

MVPの目的は以下である。

- 初期20SNSアカウントの管理を成立させる。
- Mail、SNS、WordPress、Affiliate、AI、KPIの基本導線を確認する。
- 手動運用とRegistryで破綻しないか確認する。
- Automation前にWorkflowとApprovalを確認する。
- Database移行前にEntityと関係性を確認する。
- KPIとROIの基本測定を開始する。

### 18.2 MVP Scope Candidate

MVP候補は以下である。

- Mail Account Registry
- SNS Account Registry
- Identity管理
- WordPress Site Registry
- Article Registry
- Affiliate Link Registry
- Campaign Registry
- AI Output Registry
- Approval手動管理
- Basic Operation Log
- Basic Audit Log
- Manual KPI Report
- Basic Backup
- CHANGELOG運用
- ADR運用

### 18.3 MVP Non-Goals

MVPでは以下を目指さない。

- 完全自動投稿
- 大規模API連携
- 全SNS同時運用
- 完全Database移行
- 高度なDashboard
- 高度なAI分析
- 自動Scale判断
- 未承認Automation
- 100アカウント以上の即時運用

---

## 19. Phase Policy

Roadmapでは、Phaseを段階的に設計する。

Phaseは固定ではなく、Scale Gate、KPI、Operations Load、Security Risk、Provider Riskに応じて見直す。

### 19.1 Phase Design Rules

Phase設計ルールは以下である。

- Phaseごとに目的を明確にする。
- Phaseごとに完了条件を定義する。
- Phaseごとに主要Riskを定義する。
- Phaseごとに必要なKPIを定義する。
- PhaseごとにGateを設定する。
- Phaseをまたぐ依存関係を明確にする。
- Phase完了後にReviewを行う。
- Phase変更は記録する。

### 19.2 Phase List

Growth Lab Coreの初期Roadmap Phaseは以下を基本とする。

```text
Phase 0: Master Architecture Foundation
Phase 1: Manual Registry MVP
Phase 2: Workflow and Approval Foundation
Phase 3: Database Foundation
Phase 4: WordPress and Affiliate Flow Foundation
Phase 5: AI Operations Foundation
Phase 6: API and OAuth Foundation
Phase 7: Scheduler and Controlled Automation
Phase 8: Analytics and KPI Foundation
Phase 9: Security and Operations Hardening
Phase 10: Production Readiness and Controlled Expansion
```

---

## 20. Phase 0: Master Architecture Foundation

Phase 0は、設計書、ADR、基本方針を整備する段階である。

### 20.1 Purpose

目的は以下である。

- Master Architectureを整備する。
- 各章の責任分界を明確にする。
- CodexとClaude Codeの反映ルールを標準化する。
- ADR運用を開始する。
- Roadmapの判断基盤を作る。

### 20.2 Main Deliverables

主な成果物は以下である。

- 00 Document Governance
- 01 Architecture Principles
- 02 Overall Architecture
- 03 Mail Platform
- 04 SNS Platform
- 05 WordPress Platform
- 06 AI Platform
- 07 Growth Lab Core System
- 08 Database
- 09 API and OAuth
- 10 Security
- 11 Operations
- 12 Analytics and KPI
- 13 Roadmap
- 14 ADR

### 20.3 Gate Conditions

Gate条件は以下である。

- 各章がMarkdownで存在する。
- CHANGELOGが更新されている。
- 主要責任分界が明確である。
- ADR-0001が存在する。
- Codex反映ルールが安定している。
- 文字化け確認が実施されている。

---

## 21. Phase 1: Manual Registry MVP

Phase 1は、初期20SNSアカウント規模の手動Registry運用を成立させる段階である。

### 21.1 Purpose

目的は以下である。

- 1 Identity、1 Mail Account、1 SNS Accountの管理を開始する。
- 初期20SNSアカウントを破綻なく管理する。
- Mail、SNS、WordPress、Affiliateの基本Registryを整える。
- OperationsのDaily / Weekly確認を開始する。
- KPIの基本記録を開始する。

### 21.2 Main Deliverables

主な成果物は以下である。

- Identity Registry
- Mail Account Registry
- SNS Account Registry
- WordPress Site Registry
- Article Registry
- Affiliate Link Registry
- Campaign Registry
- AI Output Registry
- Daily Check運用
- Basic KPI Report
- Basic Operation Log

### 21.3 Gate Conditions

Gate条件は以下である。

- 20SNSアカウントの管理方針が明確である。
- Mail AccountとSNS Accountが紐付いている。
- Registry更新漏れが許容範囲内である。
- 重要通知を確認できる。
- 未承認投稿が発生していない。
- Secret実体がRegistryに含まれていない。
- Basic KPIを記録できる。

---

## 22. Phase 2: Workflow and Approval Foundation

Phase 2は、Workflow、Approval、Audit Logの基本運用を整える段階である。

### 22.1 Purpose

目的は以下である。

- SNS投稿、WordPress記事、LP、Affiliate Link変更にApproval Gateを適用する。
- AI OutputのReviewとApprovalを標準化する。
- 高リスク操作のAudit Logを整える。
- Manual OperationとApproved Executionを分離する。

### 22.2 Main Deliverables

主な成果物は以下である。

- Approval Queue
- Review Flow
- Manual Approval Record
- Audit Log Policy実装候補
- AI Output Review Flow
- SNS Post Approval Flow
- WordPress Publish Approval Flow
- Affiliate Link Change Approval Flow

### 22.3 Gate Conditions

Gate条件は以下である。

- Approval対象操作が明確である。
- ReviewerとApproverが明確である。
- 未承認外部公開が防止されている。
- Audit Log対象操作が明確である。
- AI Outputが未レビューのまま公開されていない。

---

## 23. Phase 3: Database Foundation

Phase 3は、Registry中心運用からDatabase中心運用へ移行する準備を行う段階である。

### 23.1 Purpose

目的は以下である。

- EntityとRelationを整理する。
- Database移行対象を決める。
- Migration準備を行う。
- Data Integrity確認を開始する。
- BackupとRestoreの基本方針を確認する。

### 23.2 Main Deliverables

主な成果物は以下である。

- Database Entity Candidate
- Migration Plan
- Data Source Priority
- Data Integrity Check
- Backup Policy
- Restore Policy
- Prisma Schema候補
- Local Development Database候補

### 23.3 Gate Conditions

Gate条件は以下である。

- 08 Databaseの設計方針に従っている。
- 物理設計に入る前にEntity関係が整理されている。
- Secret実体を通常DBに保存しない方針が明確である。
- Backup方針がある。
- Migration前後の整合性確認方針がある。
- Restore方針がある。

---

## 24. Phase 4: WordPress and Affiliate Flow Foundation

Phase 4は、SNSからWordPress、Affiliate Link、Conversionまでの基本導線を整える段階である。

### 24.1 Purpose

目的は以下である。

- WordPress記事とLPの管理を標準化する。
- Affiliate Linkの管理を標準化する。
- SNS投稿からWordPressへの流入を追跡する。
- Campaign IDとTracking Parameterを整える。
- Conversion測定の準備を行う。

### 24.2 Main Deliverables

主な成果物は以下である。

- WordPress Site Registry
- Article Registry
- Landing Page Registry
- Affiliate Link Registry
- Campaign Registry
- Tracking Parameter Policy
- Basic Funnel Report
- WordPress Publish Approval Flow

### 24.3 Gate Conditions

Gate条件は以下である。

- WordPress記事がCampaignと紐付いている。
- Affiliate LinkがArticleまたはLPと紐付いている。
- Tracking Parameter方針がある。
- Affiliate Link変更が承認制である。
- Conversion測定方法が定義されている。

---

## 25. Phase 5: AI Operations Foundation

Phase 5は、AI Output、Prompt、Review、Cost、Riskを管理する段階である。

### 25.1 Purpose

目的は以下である。

- AI Output Registryを整備する。
- Prompt Registryを整備する。
- AI OutputのReviewとApprovalを標準化する。
- AI CostとAI効果を記録する。
- AI入力にSecretを含めない運用を徹底する。

### 25.2 Main Deliverables

主な成果物は以下である。

- Prompt Registry
- AI Output Registry
- AI Review Flow
- AI Approval Flow
- AI Cost Record
- AI Output KPI
- AI Risk Review

### 25.3 Gate Conditions

Gate条件は以下である。

- AI出力をそのまま外部公開していない。
- AI OutputがReviewされている。
- AI入力にSecret実体を含めていない。
- AI Costを確認できる。
- AI Output KPIが定義されている。

---

## 26. Phase 6: API and OAuth Foundation

Phase 6は、外部API、OAuth、Webhook、Rate Limitを安全に扱う準備段階である。

### 26.1 Purpose

目的は以下である。

- API Adapter方針を具体化する。
- OAuth Connection管理を開始する。
- Scope管理を開始する。
- Mock ModeとSandboxを利用する。
- Production接続前のApproval条件を整える。

### 26.2 Main Deliverables

主な成果物は以下である。

- API Provider Candidate
- API Adapter Candidate
- OAuth Connection Registry
- Scope Review
- Token Reference Policy実装候補
- Mock Mode
- Sandbox Test
- Rate Limit Review
- API Error Log

### 26.3 Gate Conditions

Gate条件は以下である。

- 公式APIを優先している。
- OAuth Scopeが最小権限である。
- Token実体を通常DBやMarkdownへ保存していない。
- MockまたはSandboxで検証している。
- Production接続はApproval Gateを通す。
- Rate LimitとRetry方針がある。

---

## 27. Phase 7: Scheduler and Controlled Automation

Phase 7は、SchedulerとAutomationを安全に拡張する段階である。

### 27.1 Purpose

目的は以下である。

- Schedulerで実行タイミングを管理する。
- Automationで実行条件、停止条件、Retry制限を管理する。
- 未承認外部実行を防ぐ。
- Automationの効果と失敗率を測定する。

### 27.2 Main Deliverables

主な成果物は以下である。

- Scheduler Job Registry
- Automation Job Registry
- Stop Condition
- Retry Limit
- Manual Stop Procedure
- Automation Audit Log
- Automation KPI
- Automation Incident Handling

### 27.3 Gate Conditions

Gate条件は以下である。

- Automation対象が承認済みである。
- Stop Conditionが設定されている。
- Retry上限がある。
- Rate Limitを考慮している。
- 認証失敗時に停止できる。
- Manual Stop手段がある。
- Automation KPIを測定できる。

---

## 28. Phase 8: Analytics and KPI Foundation

Phase 8は、KPI、Report、Dashboard、Improvement Loopを整える段階である。

### 28.1 Purpose

目的は以下である。

- KPI Definitionを整備する。
- Primary、Secondary、Guardrail KPIを定義する。
- Reportを標準化する。
- Analytics Snapshotを記録する。
- Roadmap判断に使えるKPIを整える。

### 28.2 Main Deliverables

主な成果物は以下である。

- KPI Definition
- KPI Record
- Missing Data Record
- Attribution Record
- Basic Report
- Analytics Snapshot
- Roadmap Metrics
- Scale Gate Metrics

### 28.3 Gate Conditions

Gate条件は以下である。

- KPI定義が明確である。
- Missing Dataを0として扱っていない。
- Primary KPIとGuardrail KPIがある。
- ROIの前提が明確である。
- Reportが意思決定に使える。
- Roadmap Metricsが整備されている。

---

## 29. Phase 9: Security and Operations Hardening

Phase 9は、SecurityとOperationsの運用品質を強化する段階である。

### 29.1 Purpose

目的は以下である。

- Access Controlを強化する。
- Secret Reference管理を強化する。
- 2FA、TOTP、Recovery管理を確認する。
- Incident Responseを標準化する。
- Backup and Restoreを確認する。
- Offboarding漏れを防止する。

### 29.2 Main Deliverables

主な成果物は以下である。

- Access Control Review
- Secret Reference Review
- Token Rotation Review
- 2FA Review
- Recovery Metadata Review
- Security Incident Flow
- Backup Check
- Restore Check
- Offboarding Check
- Security KPI

### 29.3 Gate Conditions

Gate条件は以下である。

- Admin権限が棚卸しされている。
- Secret実体が文書やAI入力に含まれていない。
- Security Incident初動が定義されている。
- Backup状態を確認できる。
- Restore方針がある。
- Offboarding確認ができる。
- Security KPIが測定できる。

---

## 30. Phase 10: Production Readiness and Controlled Expansion

Phase 10は、Production接続、Controlled Expansion、Scale Stage移行を判断する段階である。

### 30.1 Purpose

目的は以下である。

- Production接続の準備状態を確認する。
- 20アカウントから50アカウント以上への拡張可否を判断する。
- Automation範囲拡大を判断する。
- API接続拡大を判断する。
- CostとROIを確認する。
- Roadmapの次Stageを決定する。

### 30.2 Main Deliverables

主な成果物は以下である。

- Production Readiness Review
- Scale Gate Review
- Cost Review
- ROI Review
- Operations Load Review
- Security Review
- Provider Risk Review
- Expansion Decision
- Next Roadmap Plan

### 30.3 Gate Conditions

Gate条件は以下である。

- Security Reviewが完了している。
- Operations Reviewが完了している。
- KPIとROIが確認できる。
- Incidentが未解決のまま拡張されていない。
- Automationが停止可能である。
- BackupとRecovery方針がある。
- OwnerまたはApproverが拡張を承認している。

---

## 31. Scale Stage Policy

Scale Stageは、アカウント数と運用成熟度に応じた拡張段階である。

```text
Scale Stages

Stage 1: 1から20 SNS Accounts
Stage 2: 21から50 SNS Accounts
Stage 3: 51から100 SNS Accounts
Stage 4: 101から300 SNS Accounts
Stage 5: 301から500 SNS Accounts
```

Scale Stageは、単純なアカウント数だけでは判断しない。
Mail、SNS、WordPress、AI、Database、API、Security、Operations、Analytics、Cost、ROIの準備状態を総合して判断する。

---

## 32. Stage 1: Initial 20 Account Roadmap

Stage 1では、初期20SNSアカウントの安全な管理を優先する。

### 32.1 Stage 1 Focus

重点項目は以下である。

- Manual Registry
- Mail Account管理
- SNS Account管理
- Identity紐付け
- WordPress基本導線
- Affiliate Link管理
- AI Output Review
- Daily Operations
- Basic KPI
- Basic Security

### 32.2 Stage 1 Entry Conditions

Entry Conditionsは以下である。

- Master Architectureの基本方針がある。
- Mail Platform方針がある。
- SNS Platform方針がある。
- Security方針がある。
- Operations方針がある。
- 初期20アカウントの目的が明確である。

### 32.3 Stage 1 Exit Conditions

Exit Conditionsは以下である。

- 20SNSアカウントがRegistryで管理できる。
- Mail AccountとSNS Accountが紐付いている。
- 未承認投稿が発生していない。
- WordPress流入導線が確認できる。
- Basic KPIを確認できる。
- Daily Checkが運用できる。
- Secret実体が文書に含まれていない。

---

## 33. Stage 2: 21 to 50 Account Roadmap

Stage 2では、Manual Registryの限界を確認しつつ、Database準備とOperations標準化を進める。

### 33.1 Stage 2 Focus

重点項目は以下である。

- Registry標準化
- Weekly / Monthly Review
- Approval Queue
- Basic Audit Log
- Database移行準備
- Campaign ID運用
- Tracking Parameter運用
- API Mock検証
- Security Review

### 33.2 Stage 2 Entry Conditions

Entry Conditionsは以下である。

- Stage 1 Exit Conditionsを満たしている。
- Operations Loadが許容範囲内である。
- Account追加の目的が明確である。
- Mail運用が破綻していない。
- KPI取得状態が確認できる。

### 33.3 Stage 2 Exit Conditions

Exit Conditionsは以下である。

- Weekly / Monthly Reviewが機能している。
- Approval Queueが運用できる。
- Registry更新漏れが管理できる。
- Database移行対象が整理されている。
- Campaign IDとTracking Parameterが運用できる。
- Security Reviewが実施できる。

---

## 34. Stage 3: 51 to 100 Account Roadmap

Stage 3では、Database中心運用と一部Automationを検討する。

### 34.1 Stage 3 Focus

重点項目は以下である。

- Core EntityのDatabase移行
- Operation Log
- Audit Log
- API接続開始
- OAuth管理
- Scheduler導入
- 一部Automation
- Report標準化
- Security Monitoring

### 34.2 Stage 3 Entry Conditions

Entry Conditionsは以下である。

- Database移行準備が整っている。
- Manual Registryでは限界が見えている。
- Backup方針がある。
- Restore方針がある。
- OAuthとToken Reference方針がある。
- Automation対象が限定されている。
- KPI定義が整っている。

### 34.3 Stage 3 Exit Conditions

Exit Conditionsは以下である。

- Core EntityのDatabase管理が開始されている。
- Operation LogとAudit Logが記録できる。
- API接続が限定範囲で検証されている。
- Schedulerの基本運用ができる。
- Automationの停止条件がある。
- Reportが定期的に確認できる。
- Security Monitoring候補が整理されている。

---

## 35. Stage 4: 101 to 300 Account Roadmap

Stage 4では、Monitoring、Automation、Dashboard、Incident対応を強化する。

### 35.1 Stage 4 Focus

重点項目は以下である。

- Monitoring Dashboard
- Alert Queue
- Incident Workflow
- Automation拡張
- API Rate Limit管理
- Dashboard強化
- Advanced Report
- Operations Quality Review
- Security Incident Response強化

### 35.2 Stage 4 Entry Conditions

Entry Conditionsは以下である。

- Database中心運用が成立している。
- Approval Gateが安定している。
- Automation失敗率が許容範囲内である。
- Incident対応が記録されている。
- KPI、ROI、Costを確認できる。
- Security Reviewが定期実施されている。

### 35.3 Stage 4 Exit Conditions

Exit Conditionsは以下である。

- MonitoringとAlertが機能している。
- Incident Workflowが運用できる。
- Automation拡張が承認制で管理されている。
- API Rate Limitが確認されている。
- Dashboardが意思決定に使える。
- Operations Quality Reviewが実施されている。
- Security Incident Responseが実行可能である。

---

## 36. Stage 5: 301 to 500 Account Roadmap

Stage 5では、大規模運用OSとしての継続改善体制を整える。

### 36.1 Stage 5 Focus

重点項目は以下である。

- Large Scale Operations
- Advanced Automation
- Multi-role Approval
- Advanced Analytics
- Account Portfolio Analysis
- Advanced Security Monitoring
- Cost Optimization
- Continuous Improvement Board
- Predictive Analytics候補
- Roadmap Governance強化

### 36.2 Stage 5 Entry Conditions

Entry Conditionsは以下である。

- Stage 4のMonitoringとAutomationが安定している。
- Scale Gateを定期実施できる。
- CostとROIを説明できる。
- Security Incident対応が安定している。
- Operations Loadを管理できる。
- Provider依存リスクが把握されている。
- Roadmap変更管理が機能している。

### 36.3 Stage 5 Exit Conditions

Exit Conditionsは以下である。

- 大規模Operationsが継続可能である。
- Advanced Automationが承認制で管理されている。
- Account Portfolioを分析できる。
- Cost Optimizationが継続的に行われている。
- Roadmap Governanceが定期運用されている。
- 継続改善がRoadmapに反映されている。

---

## 37. Database Migration Roadmap

Database移行は、Registry運用の限界、整合性リスク、Scale Gate判断に基づいて進める。

### 37.1 Migration Priority

Database移行の優先候補は以下である。

```text
Database Migration Priority

1. Identity
2. Mail Account
3. SNS Account
4. WordPress Site
5. Article
6. Landing Page
7. Affiliate Link
8. Campaign
9. AI Output
10. Approval
11. Audit Log
12. Operation Log
13. KPI Record
14. Incident Record
```

### 37.2 Migration Triggers

Database移行を強く検討する条件は以下である。

- Registry更新漏れが増えている。
- Entity間の関係が複雑になっている。
- SNS Account数が50を超える。
- AI OutputやCampaignが増えている。
- KPIやAudit Logを継続的に記録する必要がある。
- Manual RegistryではScale Gate判断が難しい。
- Data Integrity Riskが高まっている。

### 37.3 Migration Rules

ルールは以下である。

- 移行前にBackupを確認する。
- 移行前にEntity関係を確認する。
- 移行後にData Integrityを確認する。
- Secret実体を通常DBへ保存しない。
- 外部Platform画面を運用正本として扱わない。
- Migration失敗時のRollback方針を確認する。
- 重要MigrationはApproval Gateを通す。

---

## 38. API and OAuth Roadmap

API and OAuth連携は、Mock、Sandbox、Limited Productionの順で進める。

### 38.1 API Roadmap Stages

```text
API Roadmap Stages

Stage 1: Mock Mode
Stage 2: Sandbox or Test Connection
Stage 3: Limited Production Read
Stage 4: Limited Production Write
Stage 5: Scaled API Operation
```

### 38.2 API Roadmap Rules

ルールは以下である。

- 公式APIを優先する。
- Scopeを最小化する。
- Token実体を文書や通常DBへ保存しない。
- Rate Limitを確認する。
- Retry暴走を防ぐ。
- Production WriteはApproval Gateを通す。
- Unofficial連携は通常運用にしない。
- Provider仕様変更時はRoadmapを見直す。

### 38.3 API Expansion Conditions

API連携拡大条件は以下である。

- 09章のAPI and OAuth方針に従っている。
- MockまたはSandbox検証が完了している。
- OAuth Scopeが確認されている。
- Token Reference方針がある。
- Rate Limitを確認できる。
- API Errorを記録できる。
- Operationsで監視できる。

---

## 39. Security Roadmap

Security Roadmapは、すべてのPhaseより優先される横断的Roadmapである。

### 39.1 Security Priority Items

優先項目は以下である。

- Secret管理
- Access Control
- 2FA
- TOTP管理
- Recovery Code管理
- Token Rotation
- Admin権限棚卸し
- Offboarding
- Security Incident Response
- Backup Security
- AI Input Secret Protection

### 39.2 Security Roadmap Rules

ルールは以下である。

- Security Readinessが不足している場合は拡張しない。
- Secret実体を文書、AI入力、通常DB、Logへ含めない。
- Admin権限を最小化する。
- Production接続前にSecurity Reviewを行う。
- Security Incident後はRoadmapを見直す。
- Critical Security Riskがある場合はRoadmapを停止または延期する。

### 39.3 Security Expansion Conditions

Security観点で拡張できる条件は以下である。

- 10章のSecurity方針に従っている。
- Admin権限が棚卸しされている。
- 2FA対象が確認されている。
- Secret Reference方針がある。
- Incident Response方針がある。
- Offboarding確認ができる。
- Backup Securityが確認されている。

---

## 40. Operations Roadmap

Operations Roadmapは、運用負荷と安定性を管理する。

### 40.1 Operations Priority Items

優先項目は以下である。

- Daily Check
- Weekly Check
- Monthly Check
- Approval Queue
- Incident Queue
- Alert Queue
- Backup Check
- Restore Check
- Runbook整備
- Operations Log
- Audit Log
- Training and Handover

### 40.2 Operations Roadmap Rules

ルールは以下である。

- Operations Loadが過剰な場合は拡張しない。
- Runbookがない高リスク作業を増やさない。
- Incident未解決のまま拡張しない。
- BackupとRestore方針を確認する。
- Offboarding漏れがある場合は権限拡張しない。
- Operations KPIをScale Gateへ反映する。

### 40.3 Operations Expansion Conditions

Operations観点で拡張できる条件は以下である。

- Daily Checkが運用できている。
- Weekly / Monthly Reviewが機能している。
- AlertやIncidentを放置していない。
- Runbook方針がある。
- BackupとRestore方針がある。
- Human Operation Loadが許容範囲内である。

---

## 41. Analytics and KPI Roadmap

Analytics and KPI Roadmapは、測定と改善判断の成熟度を高める。

### 41.1 Analytics Priority Items

優先項目は以下である。

- KPI Definition
- Primary KPI
- Secondary KPI
- Guardrail KPI
- Missing Data管理
- Attribution管理
- Tracking Parameter
- Basic Report
- Campaign Report
- ROI Report
- Roadmap Metrics
- Scale Gate Metrics
- Dashboard候補

### 41.2 Analytics Roadmap Rules

ルールは以下である。

- KPI未定義の施策を拡張しない。
- Missing Dataを0として扱わない。
- ROI前提を明確にする。
- Primary KPIとGuardrail KPIを確認する。
- Roadmap判断に必要なKPIを優先する。
- Dashboard導入よりKPI定義を優先する。

### 41.3 Analytics Expansion Conditions

Analytics観点で拡張できる条件は以下である。

- KPI定義がある。
- Data Sourceが確認されている。
- Missing Data方針がある。
- Attribution方針がある。
- ROI前提がある。
- Reportが意思決定に使える。
- Roadmap Metricsが整備されている。

---

## 42. Automation Roadmap

Automation Roadmapは、手動運用から安全な自動化へ段階的に進める。

### 42.1 Automation Candidate Order

Automation候補の順序は以下である。

```text
Automation Candidate Order

1. Internal Status Check
2. Report Generation
3. Alert Candidate Detection
4. Draft Creation
5. Review Queue Preparation
6. Scheduled Internal Task
7. Limited External Read
8. Approved External Write
```

### 42.2 Automation Rules

ルールは以下である。

- いきなり外部公開を自動化しない。
- DraftやReportなど内部処理から開始する。
- External WriteはApproval Gateを通す。
- Stop Conditionを持たせる。
- Retry上限を設定する。
- Audit Logを残す。
- Automation KPIを測定する。

### 42.3 Automation Expansion Conditions

Automation拡張条件は以下である。

- Automation対象が明確である。
- 承認条件が明確である。
- Stop Conditionがある。
- Retry上限がある。
- Audit Logがある。
- Rate Limitを確認している。
- Manual Stop手段がある。
- Operationsで監視できる。

---

## 43. AI Roadmap

AI Roadmapは、生成、分析、改善提案、運用支援を段階的に拡張する。

### 43.1 AI Expansion Order

AI活用の拡張順序は以下である。

```text
AI Expansion Order

1. Draft Support
2. Review Support
3. Improvement Proposal
4. KPI Summary
5. Anomaly Candidate Detection
6. Roadmap Decision Material Draft
7. Operations Support
8. Advanced Analysis
```

### 43.2 AI Roadmap Rules

ルールは以下である。

- AIを最終判断者にしない。
- AI入力にSecretを含めない。
- 外部公開前にHuman Reviewする。
- High Risk Outputを記録する。
- AI Costを測定する。
- AI効果をKPIで確認する。
- AI利用拡大はOperations LoadとSecurity Riskを確認する。

### 43.3 AI Expansion Conditions

AI活用拡張条件は以下である。

- AI Output Registryがある。
- Prompt Registryがある。
- Human Reviewが機能している。
- AI Costを確認できる。
- AI Output KPIがある。
- AI入力にSecretが含まれていない。
- High Risk Outputを確認できる。

---

## 44. Mail Roadmap

Mail Roadmapは、SNSアカウント管理、通知、Recoveryを支える。

### 44.1 Mail Expansion Focus

重点項目は以下である。

- Independent Domain Mail
- Forwarding
- Gmail確認
- Mail Account Registry
- Recovery Role
- Important Notification
- Mail Scale Gate
- Workspaceとの責任分界

### 44.2 Mail Roadmap Rules

ルールは以下である。

- 1 Mail Account、1 SNS Account、1 Identityの関係を維持する。
- Gmail画面を運用正本にしない。
- 重要通知を見落とさない。
- Recovery用メールを明確にする。
- Mail Account増加時はScale Gateを確認する。
- Workspace利用コストを確認する。

---

## 45. SNS Roadmap

SNS Roadmapは、アカウント追加、投稿運用、Analytics、停止リスクを管理する。

### 45.1 SNS Expansion Focus

重点項目は以下である。

- SNS Account Registry
- Platform選定
- Posting Workflow
- Approval Gate
- Account Warning確認
- Analytics取得
- WordPress流入
- Conversion紐付け
- Scale Stage判断

### 45.2 SNS Roadmap Rules

ルールは以下である。

- アカウント数だけを目的にしない。
- 規約遵守を優先する。
- 未承認投稿を公開しない。
- Account WarningをScale判断に反映する。
- SNS KPIとWordPress流入を紐付ける。
- Account停止リスクが高い場合は拡張しない。

---

## 46. WordPress Roadmap

WordPress Roadmapは、Owned Media、SEO、Affiliate導線を管理する。

### 46.1 WordPress Expansion Focus

重点項目は以下である。

- WordPress Site Registry
- Article Registry
- Landing Page Registry
- Affiliate Link Registry
- SEO基本整備
- SNS流入導線
- Tracking Parameter
- Page Speed
- Mobile Display
- Backup

### 46.2 WordPress Roadmap Rules

ルールは以下である。

- 記事公開はApproval Gateを通す。
- Affiliate Link変更はApproval Gateを通す。
- WordPress管理画面を運用正本にしない。
- SNS導線とCampaignを紐付ける。
- BackupとSecurityを確認する。
- Page SpeedやMobile表示を成果要因として確認する。

---

## 47. Affiliate Roadmap

Affiliate Roadmapは、Affiliate Link、成果測定、Commission、ROIを管理する。

### 47.1 Affiliate Expansion Focus

重点項目は以下である。

- Affiliate Link Registry
- ASP管理
- Conversion定義
- Commission確認
- Approval / Rejection確認
- Attribution
- ROI
- Unattributed Conversion管理

### 47.2 Affiliate Roadmap Rules

ルールは以下である。

- Affiliate LinkをArticleまたはLPと紐付ける。
- ASP規約に従う。
- Pending、Approved、Rejectedを区別する。
- RevenueとCommissionを混同しない。
- Attributionできない成果を無理に紐付けない。
- ROI判断にCostを含める。

---

## 48. Provider Change Roadmap

Provider Change Roadmapは、外部サービスの規約、API、料金、機能変更に対応する。

### 48.1 Provider Change Targets

対象は以下である。

- SNS Platform
- Mail Provider
- Hosting Provider
- WordPress Plugin
- AI Provider
- Analytics Provider
- Affiliate ASP
- Google Service
- API Provider

### 48.2 Provider Change Rules

ルールは以下である。

- 重要Providerの変更を確認する。
- 影響範囲を確認する。
- Security Impactを確認する。
- Operations Impactを確認する。
- Cost Impactを確認する。
- Roadmap ItemのPriorityを見直す。
- 必要に応じてStop、Defer、Pivotを判断する。
- 重要変更はADR候補にする。

---

## 49. Cost and Investment Decision Policy

Roadmapでは、CostとROIを確認して投資判断を行う。

### 49.1 Cost Categories

Costカテゴリは以下である。

- Hosting Cost
- Domain Cost
- Google Workspace Cost
- AI Cost
- API Cost
- Tool Cost
- WordPress Plugin Cost
- Automation Cost
- Human Operation Cost
- Development Cost
- Security Cost

### 49.2 Investment Decision Rules

投資判断ルールは以下である。

- Costだけで判断しない。
- ROIだけで判断しない。
- Security Riskを確認する。
- Operations Loadを確認する。
- Data Readinessを確認する。
- Learning Valueを確認する。
- Scale Enablementを確認する。
- 投資判断は記録する。
- 高額または長期影響のある判断はADRを検討する。

---

## 50. Roadmap Review Policy

Roadmapは、定期的にReviewする。

### 50.1 Review Timing

Reviewタイミングは以下である。

- Phase開始前
- Phase完了後
- Scale Gate前
- Security Incident後
- Major API Change後
- Provider規約変更後
- Cost急増時
- KPI悪化時
- Operations Load増加時
- Owner判断時
- 四半期Review時

### 50.2 Review Items

Review項目は以下である。

- 完了済みRoadmap Item
- 未完了Roadmap Item
- Blocked Item
- Deferred Item
- Stopped Item
- Priority変更候補
- Dependency変更
- Cost変化
- ROI変化
- Security Risk
- Operations Load
- KPI状況
- Incident状況
- Provider Risk
- ADR必要性

---

## 51. Roadmap Change Management

Roadmap変更は、理由と影響範囲を記録する。

### 51.1 Change Types

変更種別は以下である。

- Priority Change
- Phase Change
- Stage Change
- Scope Change
- Dependency Change
- Deferred Decision
- Stop Decision
- Cancel Decision
- Pivot Decision
- Investment Change
- Security-driven Change
- Incident-driven Change
- Provider-driven Change
- KPI-driven Change

### 51.2 Change Rules

変更ルールは以下である。

- 変更理由を記録する。
- 変更前後を記録する。
- 影響範囲を確認する。
- Security Impactを確認する。
- Operations Impactを確認する。
- Cost Impactを確認する。
- KPI Impactを確認する。
- 重要変更はApproval Gateを通す。
- 必要に応じてADRを作成する。
- CHANGELOGを更新する。

---

## 52. Roadmap Gate Policy

Roadmap Gateは、PhaseやStage移行前に確認する条件である。

### 52.1 Gate Categories

Gateカテゴリは以下である。

- Compliance Gate
- Security Gate
- Operations Gate
- Database Gate
- API and OAuth Gate
- Analytics Gate
- Cost Gate
- ROI Gate
- Recovery Gate
- Provider Gate
- Human Readiness Gate
- ADR Gate

### 52.2 Gate Rules

Gateルールは以下である。

- Gate未通過の場合は拡張しない。
- Critical Security Riskがある場合は停止または延期する。
- Operations Loadが過大な場合は改善を優先する。
- KPIが未定義の場合は測定基盤整備を優先する。
- BackupとRestore方針がない場合は高リスク変更を行わない。
- Provider Riskが高い場合は代替案を検討する。
- 重要判断は記録する。
- Gate例外はOwner承認とADR候補にする。

---

## 53. Roadmap Exception Policy

Roadmap例外は、通常Gateを満たさない状態で進行する特別判断である。

### 53.1 Exception Rules

例外ルールは以下である。

- 例外理由を記録する。
- 期限を設定する。
- Owner承認を必要とする。
- Security Impactを確認する。
- Operations Impactを確認する。
- Rollbackまたは停止条件を定義する。
- 恒久例外にしない。
- 必要に応じてADRを作成する。

### 53.2 Exception Prohibited Cases

以下の場合は、原則として例外を認めない。

- Secret漏洩疑いがある。
- Critical Security Incidentが未解決である。
- 未承認外部実行が発生する。
- Provider規約違反リスクが高い。
- BackupやRecoveryが完全に不明である。
- Owner承認がない。

---

## 54. Roadmap Governance Policy

Roadmap Governanceは、Roadmapを継続的に保守するための方針である。

### 54.1 Governance Targets

対象は以下である。

- Roadmap Item
- Phase
- Stage
- Priority
- Gate
- Change History
- ADR Link
- KPI Link
- Cost Link
- Incident Link

### 54.2 Governance Rules

ルールは以下である。

- Roadmapを定期Reviewする。
- 完了、延期、停止、取消を記録する。
- Priorityを放置しない。
- Blocked Itemを放置しない。
- ADR候補を整理する。
- KPIやROIをRoadmapへ反映する。
- IncidentやProvider変更をRoadmapへ反映する。
- CHANGELOGを更新する。

---

## 55. Roadmap Scale Gate

次のRoadmap Stageへ進む前に、Roadmap Scale Gate Reviewを行う。

```text
Roadmap Scale Gate Review

1. 現在のPhase
2. 現在のScale Stage
3. 完了済みRoadmap Item
4. 未完了Roadmap Item
5. Blocked Item
6. Deferred Item
7. Stopped Item
8. Critical Dependency
9. Security Readiness
10. Operations Readiness
11. Database Readiness
12. API and OAuth Readiness
13. Analytics and KPI Readiness
14. Automation Readiness
15. AI Readiness
16. Mail Readiness
17. SNS Readiness
18. WordPress Readiness
19. Affiliate Readiness
20. Backup and Restore Readiness
21. Provider Readiness
22. Incident Status
23. KPI Status
24. ROI Status
25. Cost Status
26. Human Operation Load
27. Provider Risk
28. ADR Required Item
29. Next Phase Candidate
30. Next Stage Candidate
31. Expansion Decision
32. Stop or Defer Decision
```

Roadmap Scale Gateを通過できない場合は、Phase追加、Account拡張、Automation拡大、Production接続拡大を行わず、準備不足の領域を優先して改善する。

Roadmap Scale Gateは、各章のScale Gateを置き換えるものではない。
Roadmap観点の統合判断として、各章のScale Gate結果を集約する。

---

## 56. Roadmap Data Model Overview

Roadmap基盤の論理データモデルは以下である。

```text
Roadmap
    |
    +-- Roadmap Item
    +-- Phase
    +-- Stage
    +-- Milestone
    +-- Gate
    +-- Dependency
    +-- Priority
    +-- Readiness Review
    +-- Investment Review
    +-- Roadmap Change
    +-- Roadmap Decision
    +-- Roadmap Exception
    +-- Related ADR
```

Databaseに保存する場合は、Secret実体ではなく、Roadmap Item、判断履歴、依存関係、Gate結果、ADR参照を保存する。

物理データベース設計は、`08_Database.md` で定義する。

---

## 57. Roadmap Entity Policy

Roadmap関連Entityは、Phase、Stage、Item、Gate、Decisionを管理するために利用する。

本章に記載するEntity項目は、概念フィールド候補である。
物理テーブル、Prisma Schema、Column名、型、Index、Constraintは、08 Databaseおよび下位実装仕様で定義する。

### 57.1 Roadmap Item Entity

```text
Roadmap Item Conceptual Fields

- Roadmap Item ID
- Title
- Category
- Related Chapter
- Purpose
- Expected Outcome
- Priority
- Status
- Phase
- Stage
- Dependency
- Risk Level
- Security Impact
- Operations Impact
- KPI Impact
- Cost Impact
- ROI Potential
- Owner
- Reviewer
- Approver
- Related ADR
- Created At
- Updated At
- Notes
```

### 57.2 Phase Entity

```text
Phase Conceptual Fields

- Phase ID
- Phase Name
- Purpose
- Scope
- Start Condition
- Completion Condition
- Gate Condition
- Status
- Owner
- Related Roadmap Items
- Related ADR
- Notes
```

### 57.3 Gate Review Entity

```text
Gate Review Conceptual Fields

- Gate Review ID
- Gate Type
- Target Phase
- Target Stage
- Review Date
- Reviewer
- Result
- Blocking Issues
- Required Actions
- Approved By
- Related ADR
- Notes
```

### 57.4 Roadmap Decision Entity

```text
Roadmap Decision Conceptual Fields

- Roadmap Decision ID
- Decision Type
- Target Item
- Before State
- After State
- Reason
- Impact Summary
- Approved By
- Decision Date
- Related ADR
- Notes
```

### 57.5 Roadmap Exception Entity

```text
Roadmap Exception Conceptual Fields

- Roadmap Exception ID
- Target Item
- Exception Reason
- Risk Summary
- Time Limit
- Owner
- Approved By
- Compensating Control
- Status
- Related ADR
- Notes
```

### 57.6 Roadmap Entity Rules

ルールは以下である。

- Secret実体をRoadmap関連Entityへ保存しない。
- Roadmap ItemとADRを紐付ける。
- Gate Review結果を記録する。
- Deferred、Stopped、Canceledの理由を記録する。
- Roadmap変更履歴を残す。
- 例外は期限付きで管理する。
- 物理設計は08章へ委譲する。

---

## 58. Roadmap Operations Boundary

Roadmap運用は11章と連携する。

本章が定義するものは以下である。

- Roadmap方針
- Phase方針
- Stage方針
- Priority方針
- Investment判断方針
- Roadmap Gate方針
- Roadmap変更方針

11章が定義するものは以下である。

- Roadmap Review実施の運用確認
- Daily / Weekly / Monthly Operationsとの接続
- AlertやIncidentからRoadmapへ反映する運用
- CHANGELOG更新運用
- Runbook更新運用

この分界により、13章が日常運用手順に入りすぎることを防ぎ、11章がRoadmap判断そのものを抱え込みすぎることを防ぐ。

---

## 59. Analytics Boundary

Roadmap判断は12章のKPIとMetricsを利用する。

本章が定義するものは以下である。

- Roadmapで使う判断方針
- PhaseやStageの判断方針
- 投資判断方針
- 拡張判断方針
- 延期判断方針
- 停止判断方針

12章が定義するものは以下である。

- KPI定義
- KPI計算式
- ROI
- Roadmap Metrics
- Scale Gate Metrics
- Report方針
- Dashboard方針

13章はKPI計算式を定義しない。
13章は、12章で定義されたKPI、ROI、Metricsを使ってRoadmap判断を行う。

---

## 60. ADR Boundary

Roadmapの重要判断は、14章のADR方針に従って記録する。

### 60.1 ADR Required Candidates

ADR候補となるRoadmap判断は以下である。

- Database中心運用への移行
- Production API接続開始
- OAuth Scope拡大
- Automation外部実行開始
- 100アカウント以上への拡張
- Security方針変更
- Major Provider変更
- Hosting変更
- Analytics基盤変更
- KPI定義の重要変更
- ROI判断方針変更
- Roadmap Phase構造変更
- Roadmap例外の承認

### 60.2 ADR Rules

ルールは以下である。

- 重要判断はADR候補にする。
- Roadmap変更理由を記録する。
- 代替案を記録する。
- 採用理由を記録する。
- リスクを記録する。
- 14章のADR方針に従う。

---

## 61. Integration with Other Chapters

本章は、以下の章と連携する。

### 61.1 02 Overall Architecture

Roadmapは、全体Architectureの導入順序と拡張順序に関係する。

### 61.2 03 Mail Platform

Mail Account、Forwarding、Recovery、Scale Gateに関係する。

### 61.3 04 SNS Platform

SNS Account追加、投稿運用、Platform拡張、Scale Stageに関係する。

### 61.4 05 WordPress Platform

WordPress Site、Article、LP、Affiliate導線、SEO強化に関係する。

### 61.5 06 AI Platform

AI Output、Prompt、Review、AI Cost、AI Analyticsの拡張に関係する。

### 61.6 07 Growth Lab Core System

Workflow、Approval Gate、Scheduler、Automation、Monitoringの導入順序に関係する。

### 61.7 08 Database

Database移行、Entity管理、Data Integrity、Backup、Restoreに関係する。

### 61.8 09 API and OAuth

API連携、OAuth接続、Scope、Webhook、Rate Limit、Production接続に関係する。

### 61.9 10 Security

Secret、Access Control、2FA、Security Incident、Security Reviewに関係する。

### 61.10 11 Operations

Daily / Weekly / Monthly Operations、Runbook、Incident、Backup、Restore、Operations Loadに関係する。

### 61.11 12 Analytics and KPI

KPI、ROI、Cost、Report、Dashboard、Roadmap Metrics、Scale Gate Metricsに関係する。

### 61.12 14 ADR

Roadmap上の重要判断をADRとして記録する。

---

## 62. Chapter Responsibility Boundary

本章では、Roadmap基盤の上位設計と判断方針を定義する。

```text
13 Roadmap
    |
    +-- Defines:
    |       +-- Roadmap architecture
    |       +-- Roadmap principles
    |       +-- Phase and Stage boundary
    |       +-- Roadmap item policy
    |       +-- Roadmap decision policy
    |       +-- Priority policy
    |       +-- Dependency policy
    |       +-- Readiness policy
    |       +-- MVP policy
    |       +-- Phase policy
    |       +-- Phase roadmap
    |       +-- Scale stage policy
    |       +-- Stage roadmap
    |       +-- Database migration roadmap
    |       +-- API and OAuth roadmap
    |       +-- Security roadmap
    |       +-- Operations roadmap
    |       +-- Analytics and KPI roadmap
    |       +-- Automation roadmap
    |       +-- AI roadmap
    |       +-- Mail roadmap
    |       +-- SNS roadmap
    |       +-- WordPress roadmap
    |       +-- Affiliate roadmap
    |       +-- Provider change roadmap
    |       +-- Cost and investment decision policy
    |       +-- Roadmap review policy
    |       +-- Roadmap change management
    |       +-- Roadmap gate policy
    |       +-- Roadmap exception policy
    |       +-- Roadmap governance policy
    |       +-- Roadmap scale gate policy
    |
    +-- Does not define:
            +-- Full implementation code
            +-- Full database schema
            +-- Full API endpoint specification
            +-- Full OAuth implementation
            +-- Full operations runbook
            +-- Full KPI calculation details
            +-- Full dashboard implementation
            +-- Detailed sprint schedule
            +-- Secret実体
            +-- Legal judgment final decision
```

詳細な実装仕様は下位実装仕様で扱う。
日常運用は11章で扱う。
KPI定義と計算式は12章で扱う。
重要判断の記録は14章で扱う。

---

## 63. Architecture Constraints

Roadmap基盤では、以下の制約を前提とする。

- Roadmapは他章の設計方針を置き換えない。
- RoadmapはSecurity方針を上書きしない。
- RoadmapはApproval Gateを回避しない。
- RoadmapはScale Gateを回避しない。
- RoadmapはKPI未定義のまま拡張しない。
- RoadmapはCost未確認のまま投資拡大しない。
- RoadmapはOperations Load未確認のまま拡張しない。
- RoadmapはSecret実体を扱わない。
- Roadmapは日付だけで進めない。
- Critical Security Riskがある場合は拡張を止める。
- 未解決Incidentがある場合は拡張判断を慎重に行う。
- Provider Riskが未確認の場合は拡張判断を慎重に行う。
- Roadmap変更は理由と履歴を残す。
- 重要Roadmap判断はADR候補にする。

---

## 64. Risks

本章に関連する主なリスクは以下である。

### 64.1 Risk: Roadmapが日付だけで進む

GateやReadinessを確認せず、日程だけで次Phaseへ進む可能性がある。

軽減策：

- Gate-Based Roadmapにする。
- Readiness Reviewを行う。
- Scale Gateを確認する。
- Owner承認を必要にする。

### 64.2 Risk: SecurityよりAutomationを優先する

Securityが未整備のままAutomationが拡大する可能性がある。

軽減策：

- Security Before Automationを原則にする。
- Automation拡張前にSecurity Reviewを行う。
- Stop ConditionとAudit Logを必須にする。
- 未承認外部実行を禁止する。

### 64.3 Risk: Database移行が遅れる

Registry運用が限界を超えてもDatabase移行が遅れ、整合性が崩れる可能性がある。

軽減策：

- Registry更新漏れを確認する。
- Entity関係が複雑になった段階でMigrationを検討する。
- Database Scale Gateを確認する。
- Migration Roadmapを持つ。

### 64.4 Risk: KPI未定義のまま拡張する

成果測定ができない状態で、AccountやCampaignを増やす可能性がある。

軽減策：

- Measure Before Scaleを原則にする。
- KPI DefinitionをPhase条件にする。
- Primary KPIとGuardrail KPIを確認する。
- 12章のRoadmap Metricsを利用する。

### 64.5 Risk: CostやROIを見ずに投資する

Tool、AI、API、Hosting、人件費が増えても、ROIが判断できない可能性がある。

軽減策：

- Cost Reviewを実施する。
- ROI前提を確認する。
- Costが不明な場合はUnknownとして扱う。
- Investment Decisionを記録する。

### 64.6 Risk: Operations Loadを軽視する

アカウント数やAutomationが増え、担当者の運用負荷が過大になる可能性がある。

軽減策：

- Operations KPIを確認する。
- Human Operation LoadをScale Gateへ含める。
- Runbook整備を優先する。
- Operations Loadが過大な場合は拡張を延期する。

### 64.7 Risk: Provider変更を見落とす

SNS、AI、Analytics、Affiliate、HostingなどのProvider変更により、Roadmap前提が崩れる可能性がある。

軽減策：

- Provider Change Roadmapを定義する。
- Provider変更時にRoadmap Reviewを行う。
- Provider RiskをScale Gateへ含める。
- 必要に応じてPivot、Stop、Deferを判断する。

### 64.8 Risk: Roadmapが大きくなりすぎる

Roadmap Itemが増えすぎて、優先順位や依存関係が分からなくなる可能性がある。

軽減策：

- Roadmap ItemをStatus管理する。
- Deferred、Stopped、Canceledを明確にする。
- P0からP4で優先順位を管理する。
- 四半期Reviewを行う。

### 64.9 Risk: 13章が実装詳細に入りすぎる

本章が詳細チケット、実装コード、スプリント計画まで抱え込む可能性がある。

軽減策：

- 本章はRoadmap方針までを定義する。
- 詳細タスクは下位実装仕様やプロジェクト管理資料へ委譲する。
- 日常運用は11章へ委譲する。
- KPI計算式詳細は12章へ委譲する。

### 64.10 Risk: Roadmap例外が恒久化する

一時的な例外判断が放置され、SecurityやOperations上の弱点が恒久化する可能性がある。

軽減策：

- 例外には期限を設定する。
- Owner承認を必要にする。
- Compensating Controlを記録する。
- 定期Reviewで解除または正式ADR化を判断する。

---

## 65. Required Review Checklist

本章を更新する場合は、以下を確認する。

```text
Required Review Checklist

1. Roadmap方針が明確か
2. Roadmap Principlesが定義されているか
3. 07との責任分界が明確か
4. 08との責任分界が明確か
5. 09との責任分界が明確か
6. 10との責任分界が明確か
7. 11との責任分界が明確か
8. 12との責任分界が明確か
9. 14との責任分界が明確か
10. Phase and Stage Boundaryが定義されているか
11. Roadmap Item Policyが定義されているか
12. Roadmap Decision Policyが定義されているか
13. Priority Policyが定義されているか
14. Dependency Policyが定義されているか
15. Readiness Policyが定義されているか
16. MVP Policyが定義されているか
17. Phase Policyが定義されているか
18. Phase 0からPhase 10が定義されているか
19. Scale Stage Policyが定義されているか
20. Stage 1からStage 5が定義されているか
21. 各StageのEntry ConditionsとExit Conditionsが整理されているか
22. Database Migration Roadmapが定義されているか
23. API and OAuth Roadmapが定義されているか
24. Security Roadmapが定義されているか
25. Operations Roadmapが定義されているか
26. Analytics and KPI Roadmapが定義されているか
27. Automation Roadmapが定義されているか
28. AI Roadmapが定義されているか
29. Mail Roadmapが定義されているか
30. SNS Roadmapが定義されているか
31. WordPress Roadmapが定義されているか
32. Affiliate Roadmapが定義されているか
33. Provider Change Roadmapが定義されているか
34. Cost and Investment Decision Policyが定義されているか
35. Roadmap Review Policyが定義されているか
36. Roadmap Change Managementが定義されているか
37. Roadmap Gate Policyが定義されているか
38. Roadmap Exception Policyが定義されているか
39. Roadmap Governance Policyが定義されているか
40. Roadmap Scale Gateが定義されているか
41. ADR Boundaryが定義されているか
42. Secret実体を本文に含めていないか
43. 実装詳細に入りすぎていないか
44. 日常運用手順に入りすぎていないか
45. KPI計算式詳細に入りすぎていないか
46. ADR候補が整理されているか
```

---

## 66. Review Points

本章のレビューでは、以下を確認する。

- RoadmapがGrowth Lab Core全体の段階導入方針として定義されているか。
- 07、08、09、10、11、12、14との責任分界が明確か。
- Roadmapが他章の設計方針を置き換えていないか。
- PhaseとStageの違いが明確か。
- MVP方針が現実的か。
- Phase 0からPhase 10が段階的か。
- 初期20アカウントから500アカウントまでのScale Stageが定義されているか。
- StageごとのEntry ConditionsとExit Conditionsが整理されているか。
- Security Before Automationが守られているか。
- Measure Before Scaleが守られているか。
- Database移行の判断方針が明確か。
- API and OAuth連携の段階が明確か。
- Operations LoadをScale判断に入れているか。
- KPI、ROI、CostをRoadmap判断に使っているか。
- Stop、Defer、Pivot、Cancelを正式判断として扱っているか。
- Provider変更時のRoadmap見直しが定義されているか。
- Roadmap例外が期限付きで管理されているか。
- Roadmap変更管理が定義されているか。
- Roadmap Scale Gateが統合判断として使える内容か。
- 重要Roadmap判断がADRへ接続されているか。
- Secret実体を含んでいないか。
- 実装コードや詳細スプリント計画に入りすぎていないか。

---

## 67. Integration with Future Chapter 14

本章は、次章 `14_ADR.md` と強く連携する。

13章で定義したRoadmap判断のうち、以下は14章のADR候補となる。

- Roadmap Architectureの採用
- Phase and Stage Policyの採用
- MVP範囲の採用
- Database移行判断
- API Production接続判断
- Automation外部実行判断
- 100アカウント以上への拡張判断
- Roadmap例外判断
- Major Provider変更
- Roadmap Scale Gate方針変更

14章では、これらの判断をどの形式で記録し、どのように保守するかを定義する。

---

## 68. Architecture Decision Records

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
ADR-0054: Workflow and Approval Gate Policy
ADR-0055: Scheduler and Automation Engine Policy
ADR-0058: Audit Log Policy
ADR-0094: Operations Architecture
ADR-0103: Operations Scale Gate Policy
ADR-0107: Analytics and KPI Architecture
ADR-0116: Analytics and KPI Scale Gate Policy
ADR-0118: Roadmap Metrics Policy
ADR-0119: Roadmap Architecture
ADR-0120: Phase and Stage Policy
ADR-0121: MVP Scope Policy
ADR-0122: Priority and Dependency Policy
ADR-0123: Database Migration Roadmap Policy
ADR-0124: API and OAuth Roadmap Policy
ADR-0125: Security Before Automation Roadmap Policy
ADR-0126: Scale Stage Expansion Policy
ADR-0127: Cost and Investment Decision Policy
ADR-0128: Roadmap Change Management Policy
ADR-0129: Roadmap Scale Gate Policy
ADR-0130: Roadmap Exception Policy
ADR-0131: Provider Change Roadmap Policy
```

以下の判断を変更する場合は、ADR作成を検討する。

- Roadmap基盤の責任範囲変更
- Phase構造変更
- Stage構造変更
- MVP範囲変更
- 優先順位方針変更
- Dependency方針変更
- Readiness方針変更
- Database移行方針変更
- API連携方針変更
- Automation拡張方針変更
- Security Gate方針変更
- Cost and Investment判断方針変更
- Roadmap例外方針変更
- Roadmap Scale Gate方針変更
- Provider Change Roadmap方針変更
- 100アカウント以上への拡張判断
- Production接続開始判断

---
