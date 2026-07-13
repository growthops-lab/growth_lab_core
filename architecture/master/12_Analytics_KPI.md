# 12 Analytics and KPI

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/12_Analytics_KPI.md

---

## 1. Purpose

本章の目的は、Growth Lab CoreにおけるAnalytics and KPI基盤の設計方針を定義することである。

Growth Lab Coreは、SNSアカウント、WordPress、Affiliate、AI、Campaign、投稿、記事、LP、API、Automation、Operationsを統合して運用する基盤である。
そのため、投稿数やアクセス数を単独で見るのではなく、SNSからWordPress、Affiliate、Conversion、Revenue、Cost、ROI、改善判断までを一貫して分析する必要がある。

Analytics and KPI基盤は、単なるレポート作成機能ではない。
Growth Lab Core全体における、成果測定、改善判断、Scale Gate判断、Cost判断、AI活用評価、Operations品質評価を支える意思決定基盤である。

本章では、以下を定義する。

- Analytics and KPI全体方針
- 07 Growth Lab Core Systemとの責任分界
- 08 Databaseとの責任分界
- 09 API and OAuthとの責任分界
- 10 Securityとの責任分界
- 11 Operationsとの責任分界
- 13 Roadmapとの責任分界
- Analytics and KPI Principles
- KPI Definition Policy
- KPI Calculation Policy
- Primary KPI / Secondary KPI / Guardrail KPI
- Data Source Policy
- Data Freshness Policy
- Missing Data Policy
- Attribution Policy
- Tracking Parameter Policy
- Funnel Analytics
- SNS KPI
- WordPress KPI
- Affiliate KPI
- Campaign KPI
- Content KPI
- AI Output KPI
- Operations KPI
- Security KPI
- Cost KPI
- ROI Policy
- Report Policy
- Dashboard Policy
- Improvement Loop
- Analytics and KPI Scale Gate
- Analytics Risks and Mitigation

---

## 2. Scope

本章の対象範囲は、Growth Lab Coreにおける分析、KPI、レポート、改善判断の上位設計である。

対象範囲は以下を含む。

- Analytics Architecture
- KPI Architecture
- KPI Definition
- KPI Calculation Policy
- KPI Category
- Primary KPI
- Secondary KPI
- Guardrail KPI
- KPI Threshold
- Data Source Policy
- Data Freshness
- Missing Data
- Attribution
- Tracking Parameter
- Funnel Analysis
- Campaign Analytics
- SNS Analytics
- WordPress Analytics
- Affiliate Analytics
- AI Output Analytics
- Operations Analytics
- Security Analytics
- Cost Analytics
- ROI
- Dashboard
- Report
- Content Performance
- Account Performance
- Improvement Loop
- Scale Gate Metrics
- Analytics Data Model
- Analytics Entity Policy
- Analytics and KPI Scale Gate

本章では、個別Analyticsツールの詳細設定手順、Provider別API endpoint、SQL全文、Dashboard実装コード、BIツールの詳細設定、個別広告管理画面の操作手順までは定義しない。
それらは、下位実装仕様、下位運用マニュアル、または利用ツール別の設定文書で扱う。

---

## 3. Non-Goals

本章では、以下を対象外とする。

- 個別Analyticsツールの詳細設定手順
- Google Analyticsなど個別ツールの画面操作手順全文
- Search Consoleの詳細設定手順全文
- SNS管理画面の詳細操作手順全文
- Affiliate ASP管理画面の詳細操作手順全文
- Provider別API endpoint詳細
- API request / response全文
- SQL全文
- Prisma Schema全文
- Dashboard実装コード
- BIツール実装コード
- 広告運用の詳細設定
- SEO戦略全文
- 投稿文作成ルール全文
- 個別記事の詳細編集方針
- 日次KPI確認手順全文
- Report実行手順全文
- Roadmap実装順序の確定
- 法務判断の最終確定
- 個別規約違反判断の最終確定

これらは、下位実装仕様、下位運用マニュアル、広告運用資料、SEO運用資料、13 Roadmap、または法務確認で扱う。

---

## 4. Background

Growth Lab Coreでは、SNSからWordPressへ流入し、Affiliate Linkを経由してConversionを獲得する流れを重視する。

基本的な成果導線は以下である。

```text
SNS Post
  |
  v
WordPress Article or Landing Page
  |
  v
Affiliate Link
  |
  v
Conversion
  |
  v
Revenue or Commission
  |
  v
KPI Analysis
  |
  v
Improvement
```

この流れを分析しない場合、以下の問題が発生する。

- 投稿数は多いが成果につながっているか分からない。
- SNS Accountごとの貢献度が分からない。
- WordPress記事やLPの成果が分からない。
- Affiliate Linkごとの成果が分からない。
- AI生成コンテンツの効果が分からない。
- CampaignごとのROIが分からない。
- Costが増えても改善しているか判断できない。
- Scale Gateの判断材料が不足する。
- Automationが本当に効果的か判断できない。
- 取得漏れや欠損データに気づかない。
- 成果が出た理由、出なかった理由を改善に反映できない。
- Roadmap上の優先順位を数値で判断できない。

そのため、Growth Lab Coreでは、Analytics and KPIを独立した章として定義し、成果測定と改善判断の標準方針を明確にする。

---

## 5. Alignment with Architecture Principles

本章は、`01_Architecture_Principles.md` で定義した原則に従う。

特に、Analytics and KPI基盤では以下を重視する。

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

Analytics and KPIにおける優先順位は以下である。

```text
1. 規約遵守
2. Data Integrity
3. Single Source of Truth
4. Measurement Consistency
5. Attribution Clarity
6. ROI Visibility
7. Improvement Loop
8. Observability
9. Automation Support
10. Cost Optimization
11. Scalability
12. AI-assisted Analysis
```

KPIは、単なる数値ではなく、意思決定と改善のために使う。
測定できないものを無理に成果として扱わず、推定値、欠損値、未確認値を明確に区別する。

---

## 6. Analytics and KPI Principles

Growth Lab CoreのAnalytics and KPIは、以下の原則に従う。

### 6.1 Define Before Measure

測定前に、KPI名、目的、定義、計算式、対象範囲、データソース、更新頻度を定義する。

### 6.2 Separate Raw Data, Metrics, Analysis, and Decisions

Raw Data、Calculated Metrics、Analysis、Decisionは分離する。

```text
Raw Data
  |
  v
Calculated Metrics
  |
  v
Analysis
  |
  v
Decision
```

Raw Dataは事実データである。
Calculated Metricsは計算結果である。
Analysisは解釈である。
Decisionは人間または承認済みルールによる判断である。

### 6.3 Distinguish Actual, Estimated, and Missing

実測値、推定値、欠損値を区別する。

### 6.4 Track the Full Funnel

SNS単体、WordPress単体、Affiliate単体ではなく、導線全体で成果を見る。

### 6.5 Link KPI to Action

KPIは、改善アクションにつながる形で管理する。

### 6.6 Avoid Vanity Metrics Only

Follower数、Like数、Impression数などの見栄え指標だけで判断しない。
Traffic、CTR、CVR、Revenue、Commission、ROI、Quality、Riskも合わせて判断する。

### 6.7 Preserve Measurement History

KPI定義、計算式、データソースを変更した場合は、過去データとの比較可能性に注意する。

### 6.8 No Secret in Analytics Data

Analytics Data、Report、Dashboard、AI分析入力にはSecret実体を含めない。

### 6.9 KPI Must Support Roadmap Decisions

KPIは、13 Roadmapにおける優先順位、Stage移行、投資判断、改善テーマ判断に使える形で定義する。

---

## 7. Analytics and KPI Vision

Analytics and KPI基盤は、SNSからConversionまでの成果を可視化し、改善ループを回すための意思決定基盤である。

```text
Analytics and KPI Architecture
    |
    +-- Data Source
    +-- Data Collection
    +-- Data Validation
    +-- KPI Calculation
    +-- Attribution
    +-- Dashboard
    +-- Report
    +-- AI Analysis Support
    +-- Improvement Proposal
    +-- Human Review
    +-- Action
    +-- Measurement
```

Analytics and KPI基盤は、以下を実現する。

- SNS Accountごとの成果を把握する。
- 投稿ごとの成果を把握する。
- WordPress記事やLPごとの成果を把握する。
- Affiliate Linkごとの成果を把握する。
- Campaignごとの成果を把握する。
- AI Outputの採用効果を把握する。
- Operations品質を把握する。
- Securityリスク傾向を把握する。
- CostとROIを把握する。
- Scale Gate判断材料を提供する。
- Roadmap判断材料を提供する。
- 改善ループを継続する。

---

## 8. Relationship with 07, 08, 09, 10, 11, and 13

`07_Growth_Lab_Core_System.md` は、Analytics and KPIを利用するWorkflow、Approval Gate、Scheduler、Automation、Monitoringの上位構造を定義する。
`08_Database.md` は、Analytics Data、KPI Record、Report Record、Scale Gate Recordなどの保存方針を定義する。
`09_API_OAuth.md` は、Analytics取得に必要な外部API、OAuth、Scope、Rate Limit、Webhookの接続方針を定義する。
`10_Security.md` は、Analytics DataにSecret実体を含めない方針、Access Control、Security Incident方針を定義する。
`11_Operations.md` は、KPI取得状態、欠損、Report生成状態、Scale Gate材料整理の運用方針を定義する。
`13_Roadmap.md` は、Growth Lab Coreの段階導入、優先順位、実装順序、拡張計画を定義する。
本章は、KPI定義、計算式、分析、ROI、改善判断、Roadmap判断に必要な指標を定義する。

責任分界は以下である。

```text
07 Growth Lab Core System
    |
    +-- Workflow
    +-- Approval Gate
    +-- Scheduler
    +-- Automation
    +-- Monitoring
    |
    v
12 Analytics and KPI
    |
    +-- KPI Definition
    +-- KPI Calculation
    +-- Attribution
    +-- Report Definition
    +-- Dashboard Definition
    +-- ROI Analysis
    +-- Improvement Logic
    +-- Roadmap Metrics
    |
    +-- Stores analytics records through:
    v
08 Database
    |
    +-- Raw Data Reference
    +-- KPI Record
    +-- Report Record
    +-- Analytics Snapshot
    +-- Scale Gate Record
    |
    +-- Collects data through:
    v
09 API and OAuth
    |
    +-- Analytics API
    +-- SNS API
    +-- WordPress API
    +-- Affiliate API
    +-- Search Console API
    |
    +-- Follows security policy from:
    v
10 Security
    |
    +-- No Secret in Analytics
    +-- Access Control
    +-- Data Protection
    |
    +-- Operated by:
    v
11 Operations
    |
    +-- KPI Freshness Check
    +-- Missing Data Check
    +-- Report Execution Check
    +-- Scale Gate Material Preparation
    |
    +-- Provides decision material to:
    v
13 Roadmap
    |
    +-- Stage Decision
    +-- Priority Decision
    +-- Investment Decision
    +-- Expansion Decision
```

07章は「KPIを利用するシステム構造」を定義する。
08章は「KPIとAnalytics Dataをどう保存するか」を定義する。
09章は「外部データをどう取得するか」を定義する。
10章は「Analytics Dataをどう安全に扱うか」を定義する。
11章は「KPI取得状態とReport実行状態をどう運用確認するか」を定義する。
12章は「何をKPIとして定義し、どう計算し、どう分析し、どう改善判断へ使うか」を定義する。
13章は「KPIやROIをもとに、いつ何を実装、拡張、延期するか」を定義する。

---

## 9. Analytics Architecture Overview

Analytics Architectureは、Data Source、Collection、Validation、Calculation、Analysis、Report、Improvementで構成する。

```text
Data Source
  |
  v
Data Collection
  |
  v
Data Validation
  |
  v
KPI Calculation
  |
  v
Analytics Snapshot
  |
  v
Dashboard and Report
  |
  v
AI-assisted Analysis
  |
  v
Human Review
  |
  v
Improvement Action
  |
  v
Next Measurement
```

Analytics基盤では、取得したデータをそのまま意思決定に使わない。
データソース、更新日時、欠損、推定値、Attribution条件を確認したうえでKPIとして扱う。

---

## 10. KPI Responsibility Boundary

Analytics and KPI章は、KPI定義と分析方針を定義する。

### 10.1 Analytics and KPI Responsibilities

本章が責任を持つ範囲は以下である。

- KPI Definition
- KPI Calculation Policy
- KPI Category
- Primary KPI
- Secondary KPI
- Guardrail KPI
- KPI Threshold
- Data Source Policy
- Data Freshness Definition
- Missing Data Definition
- Attribution Policy
- Tracking Parameter Policy
- Campaign KPI
- SNS KPI
- WordPress KPI
- Affiliate KPI
- AI Output KPI
- Operations KPI
- Security KPI
- Cost KPI
- ROI Definition
- Report Definition
- Dashboard Definition
- Improvement Loop
- Roadmap Metrics
- Analytics and KPI Scale Gate

### 10.2 Analytics and KPI Does Not Define

本章では以下を定義しない。

- 外部API接続手順
- OAuth認証手順
- 物理DB設計
- SQL全文
- Dashboard実装コード
- BIツールの詳細設定
- 日次運用手順
- Report実行手順
- 個別Runbook全文
- Secret管理手順
- Roadmap実装順序の確定
- 法務判断の最終確定

---

## 11. KPI Taxonomy

Growth Lab Coreでは、KPIを目的別に分類する。

```text
KPI Taxonomy

1. Growth KPI
2. Engagement KPI
3. Traffic KPI
4. Conversion KPI
5. Revenue KPI
6. Cost KPI
7. ROI KPI
8. Content KPI
9. AI KPI
10. Operations KPI
11. Security KPI
12. Scale Gate KPI
13. Roadmap KPI
```

KPIは、単独で判断せず、複数カテゴリを組み合わせて判断する。

例えば、Engagementが高くてもConversionが低い場合は、導線、記事、LP、Affiliate Link、Audience mismatchを確認する。
Trafficが少なくてもCVRが高い場合は、投稿拡大、SEO強化、Campaign拡大を検討する。

---

## 12. Primary, Secondary, and Guardrail KPI Policy

KPIは、意思決定上の役割に応じて分類する。

### 12.1 Primary KPI

Primary KPIは、Campaignや施策の主目的を判断するための最重要KPIである。

例は以下である。

- Conversion
- Commission
- Revenue
- Campaign ROI
- Affiliate Link Click
- WordPress Session
- Cost per Conversion

Primary KPIは、Campaignごとに原則として1から3個に絞る。

### 12.2 Secondary KPI

Secondary KPIは、Primary KPIの変動理由を分析するための補助KPIである。

例は以下である。

- Impression
- Engagement
- Engagement Rate
- CTR
- Article View
- LP View
- Search Click
- Average Position
- AI Adoption Rate

### 12.3 Guardrail KPI

Guardrail KPIは、成果拡大時に悪化してはいけない安全確認用KPIである。

例は以下である。

- Account Warning Count
- Account Suspension Count
- Security Incident Count
- Automation Failure Rate
- Cost Spike
- Unresolved Alert Count
- Missing Data Rate
- Rejection Rate
- Human Operation Load

### 12.4 KPI Role Rules

ルールは以下である。

- Primary KPIだけで判断しない。
- Secondary KPIで原因を確認する。
- Guardrail KPIが悪化している場合は拡張を止める。
- Scale GateではPrimary、Secondary、Guardrailを組み合わせて確認する。

---

## 13. KPI Definition Policy

KPIを定義する場合は、以下の項目を明確にする。

```text
KPI Definition Fields

- KPI ID
- KPI Name
- KPI Category
- KPI Role
- Purpose
- Definition
- Calculation Formula
- Data Source
- Target Entity
- Aggregation Level
- Update Frequency
- Owner
- Target Value
- Threshold
- Warning Condition
- Guardrail Flag
- Decision Usage
- Notes
```

KPI定義では、次の点を確認する。

- 何を測るKPIか。
- なぜ必要なKPIか。
- Primary、Secondary、Guardrailのどれか。
- どのデータソースから取得するか。
- どの単位で集計するか。
- いつ更新するか。
- どの判断に使うか。
- 目標値や警告条件は何か。
- 欠損時にどう扱うか。
- 推定値を許可するか。

---

## 14. KPI Calculation Policy

KPI計算では、計算式、集計単位、対象期間、欠損値の扱いを明確にする。

### 14.1 Calculation Rules

KPI計算ルールは以下である。

- 計算式を明記する。
- 分母と分子を明確にする。
- 対象期間を明確にする。
- 対象Entityを明確にする。
- 欠損値を区別する。
- 推定値を区別する。
- 重複計上を避ける。
- 過去比較時は定義変更に注意する。
- 重要KPIの定義変更はADRを検討する。

### 14.2 Calculation Levels

集計単位は以下を基本とする。

```text
Aggregation Levels

- Post
- SNS Account
- Platform
- Article
- Landing Page
- Affiliate Link
- Campaign
- Identity
- AI Output
- Date
- Week
- Month
- Quarter
- Total
```

### 14.3 Calculation Boundary

本章ではKPI計算式と集計方針を定義する。
SQL、ETL処理、BIツール実装、Dashboard実装コードは下位実装仕様で定義する。

---

## 15. KPI Threshold and Target Policy

KPIには、必要に応じてTarget、Threshold、Warning Conditionを設定する。

### 15.1 Threshold Types

Threshold種別は以下である。

```text
Threshold Types

- Target
- Minimum Acceptable Value
- Warning Threshold
- Critical Threshold
- Stop Condition
- Scale Gate Condition
```

### 15.2 Threshold Rules

ルールは以下である。

- ThresholdはKPIごとに定義する。
- 根拠のないThresholdを固定しない。
- 初期段階ではBaseline取得を優先する。
- 十分なデータがない場合は参考値として扱う。
- Guardrail KPIのCritical Threshold超過時は拡張を止める。
- Threshold変更は履歴を残す。
- 重要Threshold変更はADRを検討する。

---

## 16. Data Source Policy

Analytics and KPIでは、データソースの信頼性を明確にする。

### 16.1 Data Source Types

主なデータソースは以下である。

- SNS Platform Data
- WordPress Data
- Analytics Tool Data
- Search Console Data
- Affiliate ASP Data
- API Log
- Webhook Event
- Campaign Registry
- AI Output Registry
- Operations Log
- Audit Log
- Security Incident Record
- Cost Record
- Manual Import CSV
- Manual Note

### 16.2 Data Source Priority

同じ指標に複数のデータソースがある場合は、優先順位を定義する。

```text
Data Source Priority

1. Approved Database Record
2. Official API Data
3. Official Export Data
4. External Platform Report
5. Manual Import
6. Manual Note
```

Database移行後は、Growth Lab Core Databaseを分析用の中心参照先とする。
ただし、外部サービス上の実績値が正本となる場合は、その出典と取得日時を記録する。

### 16.3 Data Source Rules

ルールは以下である。

- Data Sourceを記録する。
- 取得日時を記録する。
- API経由か手動取得かを区別する。
- 推定値と実測値を区別する。
- Manual Importは出典を記録する。
- 外部サービス管理画面の数値をそのまま正本化しない。
- Secret実体をData Sourceへ含めない。

---

## 17. Data Freshness Policy

Data Freshnessは、KPIがどれだけ新しいデータに基づいているかを示す。

### 17.1 Freshness States

Data Freshness状態は以下を基本とする。

```text
Data Freshness States

Fresh
Delayed
Stale
Missing
Unknown
```

### 17.2 Freshness Rules

Freshnessルールは以下である。

- KPIごとに期待更新頻度を定義する。
- 最終取得日時を記録する。
- 期待更新頻度を超えた場合はDelayedまたはStaleとする。
- 取得不能な場合はMissingとする。
- 原因不明の場合はUnknownとする。
- StaleまたはMissingのKPIは重要判断に使う場合に注意する。
- Scale GateではFreshnessを確認する。

具体的な日次確認は、`11_Operations.md` で定義する。

---

## 18. Missing Data Policy

Missing Dataは、分析精度と意思決定に影響する。

### 18.1 Missing Data Types

欠損種別は以下である。

```text
Missing Data Types

- Not Collected
- API Error
- OAuth Expired
- Provider Delay
- Manual Import Missing
- Tracking Missing
- Attribution Missing
- Deleted Source
- Unknown
```

### 18.2 Missing Data Rules

Missing Dataルールは以下である。

- 欠損を0として扱わない。
- 欠損理由を記録する。
- 欠損期間を記録する。
- 欠損したKPIを記録する。
- 欠損が分析判断に与える影響を記録する。
- 欠損が多い場合は改善アクションを設定する。
- 欠損がCritical KPIに影響する場合はAlert対象にする。

### 18.3 Missing Data Record

```text
Missing Data Record Fields

- Missing Data ID
- KPI ID
- Target Type
- Target ID
- Data Source
- Missing Type
- Missing Period
- Detected At
- Impact Level
- Recovery Action
- Status
- Notes
```

---

## 19. Attribution Policy

Attributionは、ConversionやRevenueをどの投稿、SNS Account、Article、LP、Campaignへ紐付けるかを定義する。

### 19.1 Attribution Purpose

Attributionの目的は以下である。

- SNS投稿の貢献度を把握する。
- WordPress記事の貢献度を把握する。
- LPの貢献度を把握する。
- Affiliate Linkの貢献度を把握する。
- Campaign全体の成果を把握する。
- AI Outputの効果を把握する。
- Costと成果を紐付ける。

### 19.2 Attribution Levels

Attributionの単位は以下を基本とする。

```text
Attribution Levels

- Post
- SNS Account
- Platform
- Article
- Landing Page
- Affiliate Link
- Campaign
- AI Output
- Date
```

### 19.3 Attribution Rules

Attributionルールは以下である。

- Campaign IDを可能な限り付与する。
- Post IDを可能な限り付与する。
- Article IDまたはLP IDを可能な限り付与する。
- Affiliate Link IDを可能な限り付与する。
- Tracking Parameterを標準化する。
- 直接紐付けできない成果はUnattributedとして扱う。
- 推定AttributionはEstimatedとして扱う。
- Attribution条件をReportに記載する。

### 19.4 Attribution Models

初期候補のAttribution Modelは以下である。

```text
Attribution Models

- Direct Attribution
- Last Click
- Campaign-level Attribution
- Article-level Attribution
- Estimated Attribution
- Unattributed
```

Attribution Modelの変更は、過去比較に影響するため、重要変更として扱う。

---

## 20. Tracking Parameter Policy

Tracking Parameterは、SNS、WordPress、Affiliate、Campaignを紐付けるために利用する。

### 20.1 Tracking Parameter Purpose

Tracking Parameterの目的は以下である。

- SNS PostからWordPress流入を追跡する。
- Campaign単位の成果を追跡する。
- Platform単位の成果を追跡する。
- SNS Account単位の成果を追跡する。
- ArticleまたはLP単位の成果を追跡する。
- Affiliate Link単位の成果を追跡する。

### 20.2 Tracking Parameter Fields

Tracking Parameter候補は以下である。

```text
Tracking Parameter Fields

- Campaign ID
- Platform
- SNS Account ID
- Post ID
- Article ID
- Landing Page ID
- Affiliate Link ID
- AI Output ID
- Source
- Medium
- Content
- Date
```

### 20.3 Tracking Parameter Rules

ルールは以下である。

- 命名規則を標準化する。
- 不要に長いParameterを避ける。
- Secretや個人情報をParameterへ含めない。
- Campaign IDとPost IDを可能な範囲で付与する。
- URL変更時はリンク切れを確認する。
- Tracking Parameter変更は過去比較への影響を確認する。

---

## 21. Funnel Analytics Policy

Funnel Analyticsでは、SNSからConversionまでの離脱を把握する。

### 21.1 Funnel Stages

基本Funnelは以下である。

```text
Funnel Stages

1. Impression
2. Engagement
3. Click
4. WordPress Session
5. Article or LP View
6. Affiliate Link Click
7. Conversion
8. Revenue or Commission
```

### 21.2 Funnel Rate Definitions

主なFunnel Rateは以下である。

```text
Engagement Rate = Engagement / Impression
```

```text
CTR = Click / Impression
```

```text
Session Rate = WordPress Session / Click
```

```text
Affiliate CTR = Affiliate Link Click / Article or LP View
```

```text
CVR = Conversion / Click
```

```text
Affiliate CVR = Conversion / Affiliate Link Click
```

### 21.3 Funnel Rules

Funnel分析ルールは以下である。

- Stageごとの数値を区別する。
- Stage間の率を計算する。
- 離脱が大きいStageを特定する。
- Platform別、Campaign別、Post別に比較する。
- 期間比較を行う。
- 欠損Stageを明確にする。
- Affiliate側で取得できない指標はMissingまたはEstimatedとして扱う。

---

## 22. Core KPI Definitions

Growth Lab Coreの基本KPI候補は以下である。

### 22.1 Impression

```text
Impression = 表示回数
```

SNS投稿や広告が表示された回数を示す。

### 22.2 Reach

```text
Reach = 到達したユニークユーザー数
```

取得可能な場合に利用する。

### 22.3 Engagement

```text
Engagement = Like + Comment + Share + Save + Other Engagement
```

PlatformによってEngagement定義が異なるため、Providerごとの定義差を記録する。

### 22.4 Engagement Rate

```text
Engagement Rate = Engagement / Impression
```

Impressionが取得できない場合は、ReachまたはFollowerを分母にするか、別KPIとして定義する。

### 22.5 Click

```text
Click = SNS PostまたはLinkからのクリック数
```

ClickはPlatform側Click、Analytics側Session、Affiliate Link Clickと一致しない場合がある。

### 22.6 Click Through Rate

```text
CTR = Click / Impression
```

### 22.7 WordPress Session

```text
WordPress Session = WordPressまたはAnalytics Toolで計測された訪問セッション
```

### 22.8 Affiliate Link Click

```text
Affiliate Link Click = Affiliate Linkがクリックされた回数
```

### 22.9 Conversion

```text
Conversion = Affiliateまたは定義済み成果地点で発生した成果
```

Conversionの定義はCampaignごとに明確にする。

### 22.10 Conversion Rate

```text
CVR = Conversion / Click
```

分母は用途に応じて、SNS Click、WordPress Session、Affiliate Link Clickのいずれかを明確に指定する。

### 22.11 Revenue

```text
Revenue = Conversionにより発生した売上または成果金額
```

### 22.12 Commission

```text
Commission = Affiliate成果報酬
```

### 22.13 Cost

```text
Cost = AI Cost + API Cost + Tool Cost + Hosting Cost + Human Operation Cost + Other Cost
```

### 22.14 Profit Estimate

```text
Profit Estimate = Revenue or Commission - Cost
```

推定の場合はEstimatedとして扱う。

### 22.15 ROI

```text
ROI = Profit Estimate / Cost
```

Costが0または未確定の場合は、ROIを確定値として扱わない。

---

## 23. Growth KPI

Growth KPIは、運用規模と成長傾向を見るために利用する。

### 23.1 Growth KPI List

主なGrowth KPIは以下である。

- Follower Growth
- SNS Account Growth
- WordPress Article Growth
- Organic Traffic Growth
- SNS Referral Growth
- Affiliate Link Click Growth
- Conversion Growth
- Commission Growth
- Campaign Growth
- AI Output Usage Growth

### 23.2 Growth KPI Formula

```text
Growth Rate = (Current Period Value - Previous Period Value) / Previous Period Value
```

```text
Follower Growth = Current Followers - Previous Followers
```

```text
Traffic Growth = Current Sessions - Previous Sessions
```

### 23.3 Growth KPI Rules

Growth KPIルールは以下である。

- 成長率だけで判断しない。
- 母数が小さい場合は参考値として扱う。
- 季節性やCampaign影響を記録する。
- GrowthとCost、Risk、Operations Loadを合わせて判断する。

---

## 24. SNS KPI

SNS KPIは、SNS Account、Platform、Post、Campaignの成果を見るために利用する。

### 24.1 SNS KPI List

主なSNS KPIは以下である。

- Post Count
- Impression
- Reach
- Engagement
- Engagement Rate
- Like
- Comment
- Share
- Save
- Follower
- Follower Growth
- Profile View
- Link Click
- CTR
- Post Success Rate
- Post Failure Rate
- Account Warning Count
- Account Suspension Count
- Traffic to WordPress
- Conversion Assisted by SNS

### 24.2 SNS KPI Formula

```text
Post Success Rate = Successful Posts / Planned Posts
```

```text
Post Failure Rate = Failed Posts / Planned Posts
```

```text
Follower Growth Rate = Follower Growth / Previous Followers
```

### 24.3 SNS KPI Rules

SNS KPIルールは以下である。

- Platformごとの差異を記録する。
- Post単位でCampaignと紐付ける。
- SNS Account単位で成果を比較する。
- Follower数だけで成果判断しない。
- EngagementとTrafficを組み合わせて判断する。
- Account Warningや停止リスクも評価対象にする。
- API取得値と手動取得値を区別する。

---

## 25. WordPress KPI

WordPress KPIは、記事、LP、サイト、SEO、Affiliate導線の成果を見るために利用する。

### 25.1 WordPress KPI List

主なWordPress KPIは以下である。

- Page View
- Session
- User
- Organic Traffic
- SNS Referral Traffic
- Article View
- Landing Page View
- Average Engagement Time
- Scroll Depth
- Internal Link Click
- Affiliate Link Click
- Affiliate CTR
- Broken Link Count
- Page Speed
- Mobile Usability
- Search Query
- Search Impression
- Search Click
- Search CTR
- Average Position

### 25.2 WordPress KPI Formula

```text
Affiliate CTR = Affiliate Link Click / Article or Landing Page View
```

```text
Search CTR = Search Click / Search Impression
```

```text
SNS Referral Rate = SNS Referral Traffic / Total Sessions
```

### 25.3 WordPress KPI Rules

WordPress KPIルールは以下である。

- ArticleとCampaignを紐付ける。
- LPとCampaignを紐付ける。
- SNS流入とSEO流入を区別する。
- Affiliate Link Clickを重要KPIとして扱う。
- SEO指標は期間比較で見る。
- Page SpeedやMobile表示は成果への影響要因として扱う。
- WordPress管理画面だけを正本として扱わない。

---

## 26. Affiliate KPI

Affiliate KPIは、Affiliate Link、ASP、Campaign、Article、LPの成果を見るために利用する。

### 26.1 Affiliate KPI List

主なAffiliate KPIは以下である。

- Affiliate Link Click
- Conversion
- Approved Conversion
- Rejected Conversion
- Pending Conversion
- Conversion Rate
- Revenue
- Commission
- Approval Rate
- Rejection Rate
- EPC
- CPA
- Affiliate ROI
- Unattributed Conversion

### 26.2 Affiliate KPI Formula

```text
Approval Rate = Approved Conversion / Conversion
```

```text
Rejection Rate = Rejected Conversion / Conversion
```

```text
EPC = Commission / Affiliate Link Click
```

```text
CPA = Cost / Conversion
```

```text
Affiliate ROI = Commission / Cost
```

### 26.3 Affiliate KPI Rules

Affiliate KPIルールは以下である。

- ASPごとの成果確定タイミングを記録する。
- Pending、Approved、Rejectedを区別する。
- 成果発生と成果承認を区別する。
- Affiliate Link IDとArticleまたはLPを紐付ける。
- Attributionできない成果はUnattributedとして扱う。
- CommissionとRevenueを混同しない。
- ASP規約に従う。

---

## 27. Campaign KPI

Campaign KPIは、SNS、WordPress、Affiliate、AI、Costを統合してCampaign単位で評価するために利用する。

### 27.1 Campaign KPI List

主なCampaign KPIは以下である。

- Campaign Post Count
- Campaign Article Count
- Campaign LP Count
- Campaign Impression
- Campaign Engagement
- Campaign Engagement Rate
- Campaign Click
- Campaign CTR
- Campaign WordPress Session
- Campaign Affiliate Link Click
- Campaign Conversion
- Campaign CVR
- Campaign Revenue
- Campaign Commission
- Campaign Cost
- Campaign ROI
- Campaign AI Usage Count
- Campaign AI Adoption Rate
- Campaign Incident Count
- Campaign Improvement Count

### 27.2 Campaign KPI Formula

```text
Campaign CTR = Campaign Click / Campaign Impression
```

```text
Campaign CVR = Campaign Conversion / Campaign Click
```

```text
Campaign ROI = Campaign Profit Estimate / Campaign Cost
```

```text
Campaign AI Adoption Rate = Campaign Approved AI Output Count / Campaign Reviewed AI Output Count
```

### 27.3 Campaign KPI Rules

Campaign KPIルールは以下である。

- Campaign IDを中心に各Entityを紐付ける。
- SNS、WordPress、Affiliate、AI、Costを統合する。
- Campaign期間を明確にする。
- Campaign目的を明確にする。
- CampaignごとにPrimary KPIを定義する。
- Campaign終了後にReviewを行う。
- 次の改善アクションへつなげる。

---

## 28. Content KPI

Content KPIは、投稿、記事、LP、Media、AI Outputの成果を見るために利用する。

### 28.1 Content KPI List

主なContent KPIは以下である。

- Content Count
- Published Count
- Approved Count
- Rejected Count
- Post Engagement
- Article View
- LP View
- Link Click
- Affiliate Link Click
- Conversion
- Content CTR
- Content CVR
- Content Revenue
- Content Commission
- Content Revision Count
- Content Quality Score
- Content Risk Flag

### 28.2 Content KPI Formula

```text
Content CTR = Content Click / Content Impression
```

```text
Content CVR = Content Conversion / Content Click
```

```text
Approval Rate = Approved Count / Reviewed Count
```

### 28.3 Content KPI Rules

Content KPIルールは以下である。

- Content Typeを区別する。
- SNS Post、Article、LPを紐付ける。
- AI生成か人間作成かを区別する。
- Revision回数を記録する。
- Risk Flagを記録する。
- 成果の良いContentを再利用候補にする。
- 成果の悪いContentを改善候補にする。

---

## 29. AI Output KPI

AI Output KPIは、AI利用が成果、効率、品質、リスクに与える影響を見るために利用する。

### 29.1 AI Output KPI List

主なAI Output KPIは以下である。

- AI Output Count
- Reviewed AI Output Count
- Approved AI Output Count
- Rejected AI Output Count
- Modified AI Output Count
- Used AI Output Count
- Published AI-derived Content Count
- AI Adoption Rate
- AI Rejection Rate
- AI Modification Rate
- AI Cost
- Cost per AI Output
- Cost per Approved AI Output
- KPI Lift After AI Use
- High Risk Output Count
- Secret Exposure Suspicion Count
- Human Review Load

### 29.2 AI KPI Formula

```text
AI Adoption Rate = Approved AI Output Count / Reviewed AI Output Count
```

```text
AI Rejection Rate = Rejected AI Output Count / Reviewed AI Output Count
```

```text
AI Modification Rate = Modified AI Output Count / Reviewed AI Output Count
```

```text
Cost per AI Output = AI Cost / AI Output Count
```

```text
Cost per Approved AI Output = AI Cost / Approved AI Output Count
```

### 29.3 AI Output KPI Rules

AI Output KPIルールは以下である。

- AI出力数だけで評価しない。
- 採用率、修正率、却下率を確認する。
- AI Costと成果を紐付ける。
- AI由来Contentの成果を測定する。
- High Risk Outputを記録する。
- Secret混入疑いを記録する。
- AI効果は推定と実測を区別する。
- AIの最終判断ではなく、人間レビュー結果を重視する。

---

## 30. Operations KPI

Operations KPIは、運用品質、負荷、安定性を評価するために利用する。

### 30.1 Operations KPI List

主なOperations KPIは以下である。

- Daily Check Completion Rate
- Weekly Check Completion Rate
- Monthly Check Completion Rate
- Approval Queue Count
- Approval Lead Time
- Alert Count
- Unresolved Alert Count
- Incident Count
- Open Incident Count
- Incident Resolution Time
- Scheduler Success Rate
- Automation Success Rate
- Automation Failure Rate
- Backup Success Rate
- Restore Test Count
- Documentation Update Delay
- Registry Update Delay
- Human Operation Load

### 30.2 Operations KPI Formula

```text
Daily Check Completion Rate = Completed Daily Checks / Planned Daily Checks
```

```text
Scheduler Success Rate = Successful Scheduler Runs / Total Scheduler Runs
```

```text
Automation Success Rate = Successful Automation Runs / Total Automation Runs
```

```text
Backup Success Rate = Successful Backups / Planned Backups
```

### 30.3 Operations KPI Rules

Operations KPIルールは以下である。

- 11 Operationsの運用品質確認と連携する。
- 未完了Checkを記録する。
- IncidentとAlertを区別する。
- Automation効果と失敗率を両方見る。
- Human Operation LoadをScale Gate判断に使う。
- Operations KPIの詳細運用確認は11章で扱う。

---

## 31. Security KPI

Security KPIは、Security状態、Incident、権限、Secret管理の品質を評価するために利用する。

### 31.1 Security KPI List

主なSecurity KPIは以下である。

- Security Incident Count
- Critical Security Incident Count
- Secret Leakage Suspicion Count
- Token Rotation Count
- Overdue Token Rotation Count
- 2FA Enabled Rate
- Admin Account Count
- Excess Permission Count
- Offboarding Completion Rate
- Security Exception Count
- Expired Security Exception Count
- Recovery Code Checked Rate
- Audit Log Coverage
- AI Secret Exposure Suspicion Count

### 31.2 Security KPI Formula

```text
2FA Enabled Rate = 2FA Enabled Accounts / 2FA Required Accounts
```

```text
Offboarding Completion Rate = Completed Offboarding Items / Required Offboarding Items
```

```text
Audit Log Coverage = Audited High-Risk Operations / Total High-Risk Operations
```

### 31.3 Security KPI Rules

Security KPIルールは以下である。

- Security Incidentを軽視しない。
- 2FA必須対象と任意対象を区別する。
- Secret実体はKPIデータに含めない。
- Security Exception期限切れを重要指標とする。
- Critical IncidentはScale Gate判断に反映する。
- Security KPIの運用確認は10章と11章に従う。

---

## 32. Cost KPI

Cost KPIは、運用費用と成果の関係を把握するために利用する。

### 32.1 Cost KPI List

主なCost KPIは以下である。

- AI Cost
- API Cost
- Hosting Cost
- Domain Cost
- Google Workspace Cost
- Tool Cost
- WordPress Plugin Cost
- Automation Cost
- Human Operation Cost
- Cost per Campaign
- Cost per Post
- Cost per Article
- Cost per Conversion
- Cost per Approved AI Output
- Total Operating Cost

### 32.2 Cost KPI Formula

```text
Cost per Campaign = Campaign Cost / Campaign Count
```

```text
Cost per Post = Related Cost / Post Count
```

```text
Cost per Article = Related Cost / Article Count
```

```text
Cost per Conversion = Cost / Conversion
```

### 32.3 Cost KPI Rules

Cost KPIルールは以下である。

- 固定費と変動費を区別する。
- Campaign別Costを可能な範囲で計算する。
- AI Costを個別に把握する。
- API Costを個別に把握する。
- Human Operation Costは推定値として扱う場合がある。
- Costが不明な場合はUnknownとして扱う。
- Cost増加はROIと合わせて判断する。

---

## 33. ROI Policy

ROIは、Costに対してどれだけ成果が得られたかを判断するために利用する。

### 33.1 ROI Formula

基本式は以下である。

```text
ROI = Profit Estimate / Cost
```

Profit Estimateは以下のいずれかで定義する。

```text
Profit Estimate = Revenue - Cost
```

```text
Profit Estimate = Commission - Cost
```

Affiliate中心の分析では、Commission基準のROIを優先する場合がある。

### 33.2 ROI Variants

ROI候補は以下である。

- Campaign ROI
- SNS Account ROI
- Platform ROI
- Article ROI
- LP ROI
- Affiliate Link ROI
- AI ROI
- Operations ROI

### 33.3 ROI Rules

ROIルールは以下である。

- Costが不明な場合はROIを確定値として扱わない。
- RevenueとCommissionを混同しない。
- 固定費を含めるか除外するかを明確にする。
- Human Operation Costを推定値として扱う場合は明記する。
- 短期ROIと中長期ROIを区別する。
- SEOやBrand効果など短期Conversionに出にくい成果は補助KPIで見る。
- ROIだけで継続可否を判断しない。
- RiskとOperations Loadも合わせて判断する。

---

## 34. Report Policy

Reportは、KPIを意思決定に使える形で整理するために作成する。

### 34.1 Report Types

主なReportは以下である。

- Daily Operations KPI Report
- Weekly Performance Report
- Monthly Campaign Report
- Monthly ROI Report
- SNS Account Performance Report
- WordPress Performance Report
- Affiliate Performance Report
- AI Output Performance Report
- Operations Quality Report
- Security KPI Report
- Scale Gate Report
- Roadmap Decision Report

### 34.2 Report Rules

Report作成ルールは以下である。

- Report目的を明確にする。
- 対象期間を明確にする。
- 対象Entityを明確にする。
- Data Sourceを明記する。
- Missing Dataを明記する。
- 推定値を明記する。
- Primary KPIを明確にする。
- Guardrail KPIを明確にする。
- 改善提案を記載する。
- 次アクションを記載する。
- Secret実体を含めない。

### 34.3 Report Output Boundary

本章ではReportの種類と方針を定義する。
実際のReportテンプレート、BI表示、出力形式、配布手順は下位運用マニュアルまたは実装仕様で定義する。

---

## 35. Dashboard Policy

Dashboardは、現状確認、異常検知、改善判断を支援するために利用する。

### 35.1 Dashboard Types

主なDashboardは以下である。

- Executive Dashboard
- Operations Dashboard
- Campaign Dashboard
- SNS Dashboard
- WordPress Dashboard
- Affiliate Dashboard
- AI Dashboard
- Security Dashboard
- Cost Dashboard
- Scale Gate Dashboard
- Roadmap Dashboard

### 35.2 Dashboard Rules

Dashboardルールは以下である。

- Dashboardの目的を明確にする。
- 表示KPIを絞る。
- Data Freshnessを表示する。
- Missing Dataを表示する。
- Primary KPIとGuardrail KPIを区別する。
- Alert状態を表示する。
- Drill-down先を定義する。
- Secret実体を表示しない。
- Dashboardの数値だけで最終判断しない。

---

## 36. Analytics Snapshot Policy

Analytics Snapshotは、特定時点のKPI状態を保存し、過去比較やScale Gate判断に使う。

### 36.1 Snapshot Targets

Snapshot対象は以下である。

- Daily KPI Snapshot
- Weekly KPI Snapshot
- Monthly KPI Snapshot
- Campaign Snapshot
- Scale Gate Snapshot
- Roadmap Decision Snapshot
- Incident-related Snapshot
- Pre-change Snapshot
- Post-change Snapshot

### 36.2 Snapshot Rules

Snapshotルールは以下である。

- Snapshot日時を記録する。
- 対象期間を記録する。
- Data Sourceを記録する。
- KPI定義Versionを記録する。
- Missing Dataを記録する。
- 推定値を区別する。
- 重要変更前後のSnapshotを比較可能にする。

---

## 37. Improvement Loop Policy

Analytics and KPIは、改善ループに接続する。

### 37.1 Improvement Loop

```text
Measure
  |
  v
Analyze
  |
  v
Identify Issue
  |
  v
Propose Improvement
  |
  v
Human Review
  |
  v
Approve
  |
  v
Execute
  |
  v
Measure Again
```

### 37.2 Improvement Targets

改善対象は以下である。

- SNS Posting
- SNS Account Strategy
- WordPress Article
- Landing Page
- Affiliate Link Placement
- Campaign Design
- AI Prompt
- AI Output Review
- Automation
- Operations Process
- Cost Allocation
- Security Process
- Roadmap Priority

### 37.3 Improvement Rules

改善ルールは以下である。

- KPI低下要因を仮説化する。
- 改善案を記録する。
- 影響範囲を確認する。
- 外部公開や高リスク変更はApproval Gateを通す。
- 改善実行前後でKPIを比較する。
- 改善結果をReportへ記録する。
- 成功した改善をRunbookやTemplateへ反映する。
- 失敗した改善も学習として記録する。

---

## 38. AI-assisted Analytics Policy

AIは、KPI分析、異常検知、改善案作成を支援できる。

### 38.1 AI Analytics Use Cases

AI支援対象は以下である。

- KPI Summary
- Trend Analysis
- Anomaly Candidate Detection
- Campaign Review Draft
- Content Improvement Proposal
- SNS Post Improvement Proposal
- WordPress Article Improvement Proposal
- AI Output Quality Review
- Cost and ROI Summary
- Scale Gate Material Draft
- Roadmap Decision Material Draft

### 38.2 AI Analytics Rules

AI Analyticsルールは以下である。

- AI入力にSecret実体を含めない。
- 個人情報や機密情報は必要最小限にする。
- AI分析結果を最終判断にしない。
- AI提案はHuman Reviewする。
- 推定と事実を区別する。
- AIが不明なデータを補完した場合は採用しない。
- AI分析の採用、却下、修正を記録する。

AI基盤の詳細は、`06_AI_Platform.md` で定義する。

---

## 39. Data Quality Policy

Data Qualityは、KPI判断の信頼性を支える。

### 39.1 Data Quality Dimensions

Data Qualityの観点は以下である。

```text
Data Quality Dimensions

- Accuracy
- Completeness
- Freshness
- Consistency
- Traceability
- Uniqueness
- Validity
```

### 39.2 Data Quality Rules

Data Qualityルールは以下である。

- Data Sourceを明確にする。
- 欠損を記録する。
- 重複を確認する。
- 異常値を確認する。
- Manual Importの出典を記録する。
- 計算式変更を記録する。
- Provider定義差を記録する。
- Data Qualityが低いKPIは重要判断に使う場合に注意する。

---

## 40. Anomaly Detection Policy

Anomaly Detectionは、異常値や急変を発見するために利用する。

### 40.1 Anomaly Targets

異常検知対象は以下である。

- Sudden Traffic Drop
- Sudden Traffic Spike
- Conversion Drop
- CTR Drop
- CVR Drop
- Cost Spike
- AI Cost Spike
- API Error Spike
- Missing Data Spike
- Incident Spike
- Account Warning Spike
- Automation Failure Spike

### 40.2 Anomaly Rules

Anomalyルールは以下である。

- 通常範囲を定義する。
- 期間比較を行う。
- CampaignやSeasonalityを考慮する。
- Missing Dataと実際の低下を区別する。
- 異常候補をAlertまたはReview対象にする。
- AIによる異常候補抽出はHuman Reviewする。
- Critical KPIの異常はOperationsへ通知する。

---

## 41. Comparative Analysis Policy

Comparative Analysisでは、改善判断のために比較を行う。

### 41.1 Comparison Types

比較種別は以下である。

- Before and After
- Period over Period
- Campaign Comparison
- Platform Comparison
- SNS Account Comparison
- Post Comparison
- Article Comparison
- LP Comparison
- Affiliate Link Comparison
- AI vs Non-AI Content
- Manual vs Automated Operation

### 41.2 Comparison Rules

比較ルールは以下である。

- 比較対象を明確にする。
- 対象期間を揃える。
- KPI定義を揃える。
- Data Sourceを揃える。
- Missing Dataを確認する。
- External Eventの影響を記録する。
- 推定値と実測値を混在させる場合は明記する。
- 比較結果から改善仮説を作成する。

---

## 42. Experiment and A/B Test Policy

Experiment and A/B Testは、改善案の効果を検証するために利用する。

### 42.1 Experiment Targets

実験対象は以下である。

- SNS Post Format
- SNS Posting Time
- Call to Action
- WordPress Article Title
- WordPress Article Structure
- Landing Page Structure
- Affiliate Link Placement
- AI Prompt
- Image or Media Pattern
- Campaign Theme

### 42.2 Experiment Rules

実験ルールは以下である。

- 仮説を明確にする。
- 対象KPIを明確にする。
- 対象期間を明確にする。
- Primary KPIとGuardrail KPIを明確にする。
- 比較対象を明確にする。
- 外部要因を記録する。
- 十分なデータ量がない場合は参考値として扱う。
- 勝敗だけでなく学びを記録する。
- 実験結果を次の改善に反映する。

### 42.3 Hypothesis Format

仮説は以下の形式を基本とする。

```text
If X is changed to Y, then Z will improve because of Reason.
```

日本語では以下を基本とする。

```text
XをYに変更すると、ReasonによりZが改善する。
```

---

## 43. Roadmap Metrics Policy

Roadmap Metricsは、13 Roadmapの優先順位やStage移行判断に使う指標である。

### 43.1 Roadmap Metrics Categories

Roadmap判断に使う指標カテゴリは以下である。

- Business Impact
- Implementation Cost
- Operations Load
- Security Risk
- Data Readiness
- Automation Readiness
- ROI Potential
- Scale Readiness
- Provider Dependency
- Incident Risk

### 43.2 Roadmap Metrics Rules

Roadmap Metricsルールは以下である。

- Roadmap項目ごとに判断材料となるKPIを整理する。
- ROIだけでRoadmap優先順位を決めない。
- Security RiskとOperations Loadを必ず確認する。
- Data Readinessが低い場合は測定基盤整備を優先する。
- KPIが不足している場合は、実装前に測定方法を定義する。
- Roadmapの最終決定は13章で扱う。

---

## 44. Scale Gate Metrics Policy

Scale Gate Metricsは、各章のScale Gate判断材料として利用する。

### 44.1 Scale Gate Metric Categories

Scale Gateで確認する指標カテゴリは以下である。

- Account Scale Metrics
- Mail Scale Metrics
- SNS Scale Metrics
- WordPress Scale Metrics
- AI Scale Metrics
- Database Scale Metrics
- API and OAuth Scale Metrics
- Security Scale Metrics
- Operations Scale Metrics
- Cost and ROI Metrics
- Performance Metrics
- Risk Metrics

### 44.2 Scale Gate Metrics Rules

Scale Gate Metricsルールは以下である。

- 各章のScale Gate項目と紐付ける。
- 現在Stageと次Stageを明確にする。
- KPIだけでなくRiskとOperations Loadも見る。
- Missing Dataがある場合は明記する。
- Cost増加とROIを確認する。
- Incident傾向を確認する。
- Scale Gate判断は人間が承認する。

---

## 45. Analytics and KPI Scale Architecture

Analytics and KPI基盤は、運用規模に応じて段階的に強化する。

### 45.1 Scale Stages

```text
Stage 1: 手動集計と基本KPI定義
Stage 2: Registry連携とCampaign単位KPI管理
Stage 3: Database中心のKPI管理とReport標準化
Stage 4: Automation連携とDashboard強化
Stage 5: 大規模Analytics基盤と高度な改善ループ
```

### 45.2 Stage 1

初期段階では、以下を基本とする。

- 基本KPI定義
- Manual Report
- Campaign単位の簡易集計
- SNSとWordPressの基本数値確認
- Affiliate成果の手動確認
- Missing Data記録

### 45.3 Stage 2

以下を追加検討する。

- Campaign ID運用
- Tracking Parameter標準化
- Article / LP / Affiliate Link紐付け
- AI Output効果記録
- Weekly Report標準化

### 45.4 Stage 3

以下を追加検討する。

- Database中心のKPI Record
- Analytics Snapshot
- Report Record
- Data Freshness管理
- Missing Data管理
- Scale Gate Metrics管理

### 45.5 Stage 4

以下を追加検討する。

- API連携による自動取得
- Dashboard強化
- Alert連携
- Anomaly Detection
- AI-assisted Analytics
- Experiment Tracking

### 45.6 Stage 5

以下を追加検討する。

- 大規模Campaign分析
- Account Portfolio分析
- Multi-touch Attribution検討
- Advanced ROI分析
- Predictive Analytics
- Continuous Improvement System

---

## 46. Analytics and KPI Scale Gate

次のAnalytics Stageへ進む前に、Analytics and KPI Scale Gate Reviewを行う。

```text
Analytics and KPI Scale Gate Review

1. 現在のKPI定義数
2. Primary KPIの明確性
3. Secondary KPIの整備状況
4. Guardrail KPIの整備状況
5. Campaign ID運用状況
6. Tracking Parameter運用状況
7. SNS KPI取得状況
8. WordPress KPI取得状況
9. Affiliate KPI取得状況
10. AI Output KPI取得状況
11. Operations KPI取得状況
12. Security KPI取得状況
13. Cost KPI取得状況
14. ROI計算状況
15. Data Freshness状況
16. Missing Data状況
17. Attribution状況
18. Report作成状況
19. Dashboard整備状況
20. Improvement Loop実行状況
21. Roadmap Metrics整備状況
22. Scale Gate Metrics整備状況
23. 運用担当者の負荷
24. Analytics Cost
25. 次Stageへ進む必要性
```

Analytics and KPI Scale Gateを通過できない場合は、Account拡張、Campaign拡大、Automation拡大、AI利用拡大を行わず、測定基盤と改善判断の整備を優先する。

Analytics and KPI Scale Gateは、Growth Lab Core System Scale Gate、Database Scale Gate、API and OAuth Scale Gate、Operations Scale Gate、Security Scale Gateを置き換えるものではない。
Analytics観点の準備状態を確認し、07章のSystem Scale Gateと13章のRoadmap判断へ材料を提供する。

---

## 47. Analytics Data Model Overview

Analytics and KPI基盤の論理データモデルは以下である。

```text
Analytics and KPI
    |
    +-- KPI Definition
    +-- KPI Record
    +-- Raw Data Reference
    +-- Data Source
    +-- Analytics Snapshot
    +-- Report
    +-- Dashboard
    +-- Campaign Performance
    +-- SNS Performance
    +-- WordPress Performance
    +-- Affiliate Performance
    +-- AI Output Performance
    +-- Operations Performance
    +-- Security Performance
    +-- Cost Record
    +-- ROI Record
    +-- Missing Data Record
    +-- Attribution Record
    +-- Improvement Record
    +-- Roadmap Metric
```

Databaseに保存する場合は、Secret実体ではなく、参照情報、集計結果、KPI定義、欠損、Attribution、Report、改善履歴を保存する。

物理データベース設計は、`08_Database.md` で定義する。

---

## 48. Analytics Entity Policy

Analytics関連Entityは、KPI定義、KPI実績、Report、Attribution、改善履歴を管理するために利用する。

本章に記載するEntity項目は、概念フィールド候補である。
物理テーブル、Prisma Schema、Column名、型、Index、Constraintは、08 Databaseおよび下位実装仕様で定義する。

### 48.1 KPI Definition Entity

```text
KPI Definition Conceptual Fields

- KPI Definition ID
- KPI Name
- KPI Category
- KPI Role
- Purpose
- Formula
- Data Source
- Target Entity
- Aggregation Level
- Update Frequency
- Owner
- Target Value
- Threshold
- Status
- Notes
```

### 48.2 KPI Record Entity

```text
KPI Record Conceptual Fields

- KPI Record ID
- KPI Definition ID
- Target Type
- Target ID
- Period Start
- Period End
- Value
- Value Type
- Data Source
- Freshness State
- Missing Data Flag
- Created At
- Notes
```

### 48.3 Attribution Record Entity

```text
Attribution Record Conceptual Fields

- Attribution Record ID
- Attribution Model
- Campaign ID
- Platform
- SNS Account ID
- Post ID
- Article ID
- Landing Page ID
- Affiliate Link ID
- Conversion ID
- Revenue or Commission
- Confidence Level
- Created At
- Notes
```

### 48.4 Report Entity

```text
Report Conceptual Fields

- Report ID
- Report Type
- Target Period
- Target Entity
- Primary KPI
- Data Source Summary
- Missing Data Summary
- Key Findings
- Improvement Proposal
- Created By
- Created At
- Status
```

### 48.5 Improvement Record Entity

```text
Improvement Record Conceptual Fields

- Improvement ID
- Target Type
- Target ID
- Hypothesis
- Related KPI
- Action
- Approved By
- Executed At
- Result
- Next Action
- Notes
```

### 48.6 Analytics Entity Rules

ルールは以下である。

- Secret実体をAnalytics関連Entityへ保存しない。
- KPI定義とKPI実績を分離する。
- 推定値と実測値を区別する。
- Missing Dataを記録する。
- Attribution Modelを記録する。
- ReportとImprovementを紐付ける。
- Roadmap Metricを13章の判断材料として利用する。
- 物理設計は08章へ委譲する。

---

## 49. Analytics Operations Boundary

Analytics and KPIの運用確認は11章と連携する。

本章が定義するものは以下である。

- KPI定義
- KPI計算式
- Attribution
- ROI
- Report方針
- Dashboard方針
- Improvement Loop
- Analytics and KPI Scale Gate
- Roadmap Metrics

11章が定義するものは以下である。

- KPI取得状態確認
- Missing Data確認
- Report実行確認
- Daily / Weekly / Monthly Operations
- Scale Gate材料整理
- Alert対応
- 運用担当者の確認作業

この分界により、12章が運用手順に入りすぎることを防ぎ、11章がKPI計算や分析判断を抱え込みすぎることを防ぐ。

---

## 50. Roadmap Boundary

Analytics and KPIは、13 Roadmapへ判断材料を提供する。

12章が定義するものは以下である。

- Roadmap判断に必要なKPI
- ROI判断材料
- Cost判断材料
- Data Readiness
- Scale Gate Metrics
- Risk Metrics
- Improvement Priority候補

13章が定義するものは以下である。

- 実装順序
- Stage計画
- Roadmap優先順位
- 導入時期
- 延期判断
- 投資判断
- Phaseごとの実行計画

12章はRoadmapを決定しない。
12章は、Roadmap判断に必要な数値、分析、リスク、改善候補を提供する。

---

## 51. Security and Privacy Boundary

Analytics and KPIでは、SecurityとPrivacyを考慮する。

### 51.1 Security Rules

Securityルールは以下である。

- Secret実体をAnalytics Dataへ含めない。
- Token実体をAnalytics Dataへ含めない。
- API Key実体をReportへ含めない。
- Personal Dataは必要最小限にする。
- Export Fileの扱いに注意する。
- Dashboard閲覧権限を制御する。
- Report共有先を制御する。
- AI分析入力にSecretを含めない。

### 51.2 Privacy Rules

Privacyルールは以下である。

- 個人を不要に識別しない。
- 集計値で足りる場合は集計値を利用する。
- 個人情報を含むRaw Dataを不要に保存しない。
- 外部共有Reportには機密情報を含めない。
- 法令や規約に従う。

Security詳細は、`10_Security.md` で定義する。

---

## 52. Integration with Other Chapters

本章は、以下の章と連携する。

### 52.1 02 Overall Architecture

Analytics and KPIは、Growth Lab Core全体の意思決定Layerとして関係する。

### 52.2 03 Mail Platform

Mail Account状態、重要通知、Recovery関連の運用KPIに関係する。

### 52.3 04 SNS Platform

SNS Account、Post、Engagement、Traffic、Account RiskのKPIに関係する。

### 52.4 05 WordPress Platform

Article、LP、SEO、Affiliate Link、Traffic、ConversionのKPIに関係する。

### 52.5 06 AI Platform

AI Output、Prompt、Review、AI Cost、AI採用効果のKPIに関係する。

### 52.6 07 Growth Lab Core System

Workflow、Approval Gate、Scheduler、Automation、Monitoring、Scale Gateに関係する。

### 52.7 08 Database

KPI Definition、KPI Record、Analytics Snapshot、Report、Attribution、Improvement Recordの保存に関係する。

### 52.8 09 API and OAuth

SNS API、Analytics API、Search Console API、Affiliate API、Webhook、Rate Limitに関係する。

### 52.9 10 Security

Secret保護、Access Control、Security KPI、Privacy、Report共有に関係する。

### 52.10 11 Operations

KPI取得状態、Missing Data確認、Report実行確認、Scale Gate材料整理に関係する。

### 52.11 13 Roadmap

Analytics強化、Dashboard導入、Automation強化、AI分析強化、Stage移行判断、優先順位判断に関係する。

### 52.12 14 ADR

KPI定義、Attribution、ROI、Scale Gateに関する重要判断をADRとして記録する。

---

## 53. Chapter Responsibility Boundary

本章では、Analytics and KPI基盤の上位設計と分析方針を定義する。

```text
12 Analytics and KPI
    |
    +-- Defines:
    |       +-- Analytics architecture
    |       +-- Analytics and KPI principles
    |       +-- KPI taxonomy
    |       +-- Primary KPI policy
    |       +-- Secondary KPI policy
    |       +-- Guardrail KPI policy
    |       +-- KPI definition policy
    |       +-- KPI calculation policy
    |       +-- KPI threshold policy
    |       +-- Data source policy
    |       +-- Data freshness policy
    |       +-- Missing data policy
    |       +-- Attribution policy
    |       +-- Tracking parameter policy
    |       +-- Funnel analytics policy
    |       +-- Core KPI definitions
    |       +-- Growth KPI
    |       +-- SNS KPI
    |       +-- WordPress KPI
    |       +-- Affiliate KPI
    |       +-- Campaign KPI
    |       +-- Content KPI
    |       +-- AI Output KPI
    |       +-- Operations KPI
    |       +-- Security KPI
    |       +-- Cost KPI
    |       +-- ROI policy
    |       +-- Report policy
    |       +-- Dashboard policy
    |       +-- Improvement loop policy
    |       +-- AI-assisted analytics policy
    |       +-- Data quality policy
    |       +-- Anomaly detection policy
    |       +-- Experiment policy
    |       +-- Roadmap metrics policy
    |       +-- Analytics and KPI Scale Gate policy
    |
    +-- Does not define:
            +-- Full analytics tool setup procedure
            +-- Full API endpoint specification
            +-- Physical database schema
            +-- SQL implementation
            +-- Dashboard implementation code
            +-- Daily operations runbook
            +-- Roadmap implementation schedule
            +-- Secret実体
            +-- Legal judgment final decision
```

KPI取得状態の運用確認は11章で扱う。
物理データベース設計は08章で扱う。
API接続方針は09章で扱う。
Security方針は10章で扱う。
Roadmapの実装順序と計画は13章で扱う。

---

## 54. Architecture Constraints

Analytics and KPI基盤では、以下の制約を前提とする。

- KPI定義を明確にする。
- KPI計算式を明確にする。
- Primary KPI、Secondary KPI、Guardrail KPIを区別する。
- Data Sourceを記録する。
- Data Freshnessを記録する。
- Missing Dataを0として扱わない。
- 推定値と実測値を区別する。
- Attribution Modelを記録する。
- RevenueとCommissionを混同しない。
- Costが不明な場合はROIを確定値として扱わない。
- Secret実体をAnalytics Dataへ含めない。
- Secret実体をReportへ含めない。
- Secret実体をAI分析入力へ含めない。
- KPI取得状態の運用確認は11章に従う。
- API取得方針は09章に従う。
- Database保存方針は08章に従う。
- Security方針は10章に従う。
- Roadmap実装順序は13章に従う。
- Analytics and KPI Scale Gateを通過せずに高リスク拡張を行わない。

---

## 55. Risks

本章に関連する主なリスクは以下である。

### 55.1 Risk: KPI定義が曖昧

KPI名だけが存在し、定義、計算式、データソースが不明な状態になる可能性がある。

軽減策：

- KPI Definition Fieldsを必須化する。
- Primary KPIを明確にする。
- 定義変更時は履歴を残す。
- 重要変更はADRを検討する。

### 55.2 Risk: 欠損データを0として扱う

データ未取得を0と誤認し、成果悪化または改善と誤判断する可能性がある。

軽減策：

- Missing Dataを記録する。
- Missingと0を区別する。
- Missing DataがあるReportには明記する。
- Critical KPI欠損はAlert対象にする。

### 55.3 Risk: Attributionが不明

ConversionやRevenueをどの投稿、記事、LP、Campaignに紐付けるか不明になる可能性がある。

軽減策：

- Campaign IDを運用する。
- Tracking Parameterを標準化する。
- Attribution Modelを記録する。
- Unattributedを許容し、無理に紐付けない。

### 55.4 Risk: Vanity Metricsだけで判断する

Follower数やLike数だけで成果判断し、ConversionやROIが見落とされる可能性がある。

軽減策：

- Funnel全体を見る。
- Traffic、CTR、CVR、Revenue、ROIを組み合わせる。
- CostとRiskも確認する。
- Primary KPI、Secondary KPI、Guardrail KPIを分ける。

### 55.5 Risk: ROI計算が不正確

Cost、Revenue、Commissionが混在し、ROI判断が不正確になる可能性がある。

軽減策：

- RevenueとCommissionを区別する。
- Cost範囲を明確にする。
- 推定Costを明記する。
- ROIを確定値と推定値に分ける。

### 55.6 Risk: AI分析の過信

AIが欠損データを補完したり、推定を事実のように扱う可能性がある。

軽減策：

- AI分析はHuman Reviewする。
- AI入力にSecretを含めない。
- 推定と事実を区別する。
- AI提案の採用、却下、修正を記録する。

### 55.7 Risk: Provider定義差の見落とし

SNS PlatformやAnalytics Toolごとの指標定義差により、単純比較が誤る可能性がある。

軽減策：

- Providerごとの差異を記録する。
- Platform横断比較では定義差を明記する。
- 同一Provider内の期間比較を優先する。
- 不明な場合は参考値として扱う。

### 55.8 Risk: 12章が運用手順に入りすぎる

本章が日次確認手順、Report実行手順、Dashboard操作手順を抱え込み、11章との責任分界が曖昧になる可能性がある。

軽減策：

- 12章はKPI定義、計算、分析、改善判断までを扱う。
- 運用確認手順は11章へ委譲する。
- 実装詳細は下位実装仕様へ委譲する。

### 55.9 Risk: 12章がRoadmap判断を抱え込みすぎる

本章が13章で扱う実装順序や優先順位の最終判断まで抱え込む可能性がある。

軽減策：

- 12章はRoadmap判断材料を提供する。
- Roadmapの計画、優先順位、Stage移行計画は13章で扱う。
- Roadmap判断に必要なKPIとROIを明確にする。

---

## 56. Required Review Checklist

本章を更新する場合は、以下を確認する。

```text
Required Review Checklist

1. Analytics and KPI方針が明確か
2. Analytics and KPI Principlesが定義されているか
3. 07との責任分界が明確か
4. 08との責任分界が明確か
5. 09との責任分界が明確か
6. 10との責任分界が明確か
7. 11との責任分界が明確か
8. 13との責任分界が明確か
9. KPI Taxonomyが定義されているか
10. Primary KPI / Secondary KPI / Guardrail KPIが定義されているか
11. KPI Definition Policyが定義されているか
12. KPI Calculation Policyが定義されているか
13. KPI Threshold Policyが定義されているか
14. Data Source Policyが定義されているか
15. Data Freshness Policyが定義されているか
16. Missing Data Policyが定義されているか
17. Attribution Policyが定義されているか
18. Tracking Parameter Policyが定義されているか
19. Funnel Analytics Policyが定義されているか
20. Core KPI Definitionsが定義されているか
21. Growth KPIが定義されているか
22. SNS KPIが定義されているか
23. WordPress KPIが定義されているか
24. Affiliate KPIが定義されているか
25. Campaign KPIが定義されているか
26. Content KPIが定義されているか
27. AI Output KPIが定義されているか
28. Operations KPIが定義されているか
29. Security KPIが定義されているか
30. Cost KPIが定義されているか
31. ROI Policyが定義されているか
32. Report Policyが定義されているか
33. Dashboard Policyが定義されているか
34. Improvement Loopが定義されているか
35. AI-assisted Analytics Policyが定義されているか
36. Data Quality Policyが定義されているか
37. Anomaly Detection Policyが定義されているか
38. Experiment and A/B Test Policyが定義されているか
39. Roadmap Metrics Policyが定義されているか
40. Analytics and KPI Scale Gateが定義されているか
41. Secret実体を本文に含めていないか
42. 運用手順に入りすぎていないか
43. 実装詳細に入りすぎていないか
44. ADR候補が整理されているか
```

---

## 57. Review Points

本章のレビューでは、以下を確認する。

- Analytics and KPIがGrowth Lab Core全体の意思決定基盤として定義されているか。
- 07、08、09、10、11、13との責任分界が明確か。
- KPI定義とKPI計算式が明確か。
- Primary KPI、Secondary KPI、Guardrail KPIが分離されているか。
- Raw Data、Calculated Metrics、Analysis、Decisionが分離されているか。
- Data Source、Data Freshness、Missing Dataが定義されているか。
- Missing Dataを0として扱わない方針が明確か。
- AttributionとTracking Parameterが定義されているか。
- Funnel全体を分析対象にしているか。
- Growth、SNS、WordPress、Affiliate、Campaign、Content、AI、Operations、Security、CostのKPIが定義されているか。
- RevenueとCommissionを混同していないか。
- ROIの前提が明確か。
- AI分析を最終判断にしていないか。
- ReportとDashboardの方針が明確か。
- Improvement Loopにつながっているか。
- Roadmap判断材料として使える内容になっているか。
- Scale Gate判断に使える内容になっているか。
- Secret実体を含んでいないか。
- 日次運用やRunbook詳細に入りすぎていないか。
- SQLやDashboard実装コードに入りすぎていないか。

---

## 58. Integration with Other Chapters

本章は、以下の章と連携する。

### 58.1 02 Overall Architecture

Analytics and KPIは、Growth Lab Core全体の意思決定Layerとして関係する。

### 58.2 03 Mail Platform

Mail Account状態、重要通知、Recovery関連の運用KPIに関係する。

### 58.3 04 SNS Platform

SNS Account、Post、Engagement、Traffic、Account RiskのKPIに関係する。

### 58.4 05 WordPress Platform

Article、LP、SEO、Affiliate Link、Traffic、ConversionのKPIに関係する。

### 58.5 06 AI Platform

AI Output、Prompt、Review、AI Cost、AI採用効果のKPIに関係する。

### 58.6 07 Growth Lab Core System

Workflow、Approval Gate、Scheduler、Automation、Monitoring、Scale Gateに関係する。

### 58.7 08 Database

KPI Definition、KPI Record、Analytics Snapshot、Report、Attribution、Improvement Recordの保存に関係する。

### 58.8 09 API and OAuth

SNS API、Analytics API、Search Console API、Affiliate API、Webhook、Rate Limitに関係する。

### 58.9 10 Security

Secret保護、Access Control、Security KPI、Privacy、Report共有に関係する。

### 58.10 11 Operations

KPI取得状態、Missing Data確認、Report実行確認、Scale Gate材料整理に関係する。

### 58.11 13 Roadmap

Analytics強化、Dashboard導入、Automation強化、AI分析強化、Stage移行判断、優先順位判断に関係する。

### 58.12 14 ADR

KPI定義、Attribution、ROI、Scale Gateに関する重要判断をADRとして記録する。

---

## 59. Architecture Decision Records

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
ADR-0103: Operations Scale Gate Policy
ADR-0107: Analytics and KPI Architecture
ADR-0108: KPI Definition Policy
ADR-0109: Data Source and Freshness Policy
ADR-0110: Missing Data Policy
ADR-0111: Attribution and Tracking Parameter Policy
ADR-0112: Campaign KPI Policy
ADR-0113: AI Output KPI Policy
ADR-0114: ROI Calculation Policy
ADR-0115: Analytics Report and Dashboard Policy
ADR-0116: Analytics and KPI Scale Gate Policy
ADR-0117: Primary Secondary Guardrail KPI Policy
ADR-0118: Roadmap Metrics Policy
```

以下の判断を変更する場合は、ADR作成を検討する。

- Analytics and KPI基盤の責任範囲変更
- KPI定義方針変更
- Primary KPI変更
- Secondary KPI変更
- Guardrail KPI変更
- KPI計算式変更
- KPI Threshold方針変更
- Data Source優先順位変更
- Missing Data方針変更
- Attribution Model変更
- Tracking Parameter方針変更
- ROI計算方針変更
- Report方針変更
- Dashboard方針変更
- AI分析利用方針変更
- Roadmap Metrics方針変更
- Analytics and KPI Scale Gate方針変更

---
