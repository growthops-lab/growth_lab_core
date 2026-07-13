# 08 Database

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/08_Database.md

## 1. Purpose

本章の目的は、Growth Lab CoreにおけるDatabase基盤の設計方針を定義することである。

Databaseは、Growth Lab Coreにおける運用データの中核である。
Mail Account、SNS Account、WordPress Site、Article、Landing Page、Affiliate Link、Prompt、AI Output、Campaign、KPI、Workflow、Approval、Scheduler、Automation、Audit Log、Incidentなどを、一貫した構造で管理する。

Growth Lab Coreでは、初期段階ではGoogle SheetsまたはMarkdown台帳によるRegistry管理を許容する。
ただし、運用規模、アカウント数、記事数、AI出力数、KPIデータ、Automation対象が増加するため、段階的にDatabaseへ移行できる設計にする。

本章では、以下を定義する。

- Database全体方針

- 07 Growth Lab Core Systemとの責任分界

- RegistryからDatabaseへの移行方針

- Databaseの責任範囲

- Logical Data Model方針

- Entity Group方針

- Entity設計方針

- Relation設計方針

- Primary Key / ID設計方針

- Status / Lifecycle管理方針

- Soft Delete / Archive方針

- Audit Log連携方針

- Data Integrity方針

- Prisma / ORM方針

- Migration方針

- Index方針

- Constraint方針

- Transaction方針

- Backup and Restore方針

- Data Retention方針

- Database Security Boundary

- Database Observability

- Database Scale Gate

- 運用リスクと軽減策

## 2. Scope

本章の対象範囲は、Growth Lab Coreで使用するDatabase基盤全体である。

対象範囲は以下を含む。

- Database Architecture

- Registry to Database Migration

- Logical Data Model

- Physical Data Model方針

- Prisma / ORM方針

- Entity設計方針

- Relation設計方針

- ID設計方針

- Status設計方針

- Soft Delete / Archive

- Audit Log連携

- Data Integrity

- Migration

- Index

- Constraint

- Transaction

- Backup

- Restore

- Data Retention

- Database Security Boundary

- Database Observability

- Database Scale Gate

本章では、Database基盤の上位設計と物理設計方針を定義する。
ただし、具体的なPrisma Schema全文、SQL全文、Migrationファイル全文、DB接続文字列、Secret実体、本番DB構築手順までは定義しない。

それらは、下位実装仕様、Security章、Operations章、または実装リポジトリ内の安全な管理ファイルで定義する。

## 3. Non-Goals

本章では、以下を対象外とする。

- 本番Database接続情報

- Database Password

- Database Credential

- Connection String実体

- Prisma Schema全文

- SQL全文

- Migrationファイル全文

- 本番DBサーバー構築手順

- DBホスティングサービス選定詳細

- バックアップ保存先のSecret情報

- 個別APIのリクエスト、レスポンス定義

- 個別画面のUI設計

- 日次運用Runbook

- セキュリティ実装詳細

- 暗号化鍵の実体管理

- KPI計算式の詳細

- BIツールやDashboardの詳細設定

これらは、Security章、Operations章、API and OAuth章、Analytics and KPI章、下位実装仕様、または安全なSecret管理基盤で扱う。

## 4. Background

Growth Lab Coreでは、初期段階で複数のRegistryをGoogle SheetsまたはMarkdown台帳として管理する。

初期Registryの例は以下である。

- Mail Account Registry

- SNS Account Registry

- WordPress Site Registry

- Article Registry

- Affiliate Link Registry

- Prompt Registry

- AI Output Registry

これらのRegistryは、初期20SNSアカウント規模では管理しやすい。
しかし、運用規模が拡大すると、以下の課題が発生する。

- 台帳更新漏れ

- IDの重複

- 関連データの不整合

- SNS AccountとMail Accountの紐付け不明

- SNS PostとWordPress Articleの紐付け不明

- AI OutputとKPIの紐付け不明

- Campaign単位の成果追跡が困難

- 承認履歴の追跡が困難

- Audit Logの一元管理が困難

- Scale Gate判断に必要なデータ集計が困難

そのため、Growth Lab Coreでは、初期Registryを尊重しながら、段階的にDatabaseへ移行できる設計にする。

## 5. Alignment with Architecture Principles

本章は、01_Architecture_Principles.md で定義した原則に従う。

特に、Database基盤では以下を重視する。

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

Database基盤における優先順位は以下である。

```text
1. 正本管理
2. セキュリティ
3. データ整合性
4. 監査可能性
5. 復旧可能性
6. 拡張性
7. API連携性
8. 運用しやすさ
9. コスト最適化
10. AI活用
11. 自動化
12. 継続改善
```

Databaseは、Growth Lab Coreの運用データにおけるSingle Source of Truthの中心候補である。
ただし、Secret実体はDatabase通常テーブルに平文保存しない。

## 6. Database Vision

Growth Lab CoreのDatabase基盤は、Mail、SNS、WordPress、AI、Campaign、KPI、Workflow、Auditを統合する運用データ基盤である。

```text
Database
    |
    +-- Identity
    +-- Mail Account
    +-- SNS Account
    +-- WordPress Site
    +-- Article
    +-- Landing Page
    +-- Affiliate Link
    +-- Campaign
    +-- Post
    +-- Prompt
    +-- AI Output
    +-- Workflow
    +-- Approval
    +-- Schedule
    +-- Automation Job
    +-- Analytics
    +-- KPI
    +-- Audit Log
    +-- Incident
```

Databaseは、以下を実現する。

- 管理対象の一元化

- 状態管理の一貫性

- 関連データの追跡

- KPI分析の基盤

- Approval履歴の保管

- Automationの安全制御

- Audit Logの記録

- Scale Gate判断のデータ提供

- Registryからの段階的移行

## 7. Relationship with 07 Growth Lab Core System

07_Growth_Lab_Core_System.md は、Growth Lab Core Systemを統合運用OSおよびOrchestration Layerとして定義する。
本章は、そのGrowth Lab Core Systemを支えるData Layerとして、永続化、整合性、履歴、Migration、Backup、Scale Gate用データを定義する。

責任分界は以下である。

```text
07 Growth Lab Core System
    |
    +-- Defines:
    |       +-- System orchestration
    |       +-- Domain modules
    |       +-- Workflow
    |       +-- Approval Gate
    |       +-- Scheduler
    |       +-- Automation Engine
    |       +-- Integration Layer
    |
    v
08 Database
    |
    +-- Defines:
            +-- Data persistence
            +-- Entity policy
            +-- Relation policy
            +-- ID policy
            +-- Status persistence
            +-- Audit storage policy
            +-- Migration policy
            +-- Backup and Restore policy
            +-- Database Scale Gate
```

07章は、システムが何を統合し、どう実行、承認、監視するかを定義する。
08章は、そのデータをどのように保存し、整合性を保ち、移行し、復旧するかを定義する。

## 8. Overall Database Architecture

Growth Lab CoreのDatabase Architectureは以下を基本とする。

```text
Application Layer
    |
    v
Data Access Layer
    |
    +-- Repository
    +-- Query Service
    +-- Transaction Service
    +-- Migration Service
    +-- Validation Service
    |
    v
Database
    |
    +-- Core Tables
    +-- Registry Tables
    +-- Workflow Tables
    +-- KPI Tables
    +-- Audit Tables
    +-- Log Tables
    +-- Reference Tables
```

Application Layerは、Databaseへ直接散在的にアクセスしない。
Data Access Layerを経由して、Domain Moduleごとの責任範囲を保つ。

## 9. Database Technology Policy

初期実装候補は以下を基本とする。

```text
Database: PostgreSQL
ORM: Prisma
Language: TypeScript
Runtime: Node.js / Next.js environment
Local Development: Local PostgreSQL or Docker-compatible database setup
```

### 9.1 PostgreSQL Policy

PostgreSQLを初期候補とする理由は以下である。

- Relation設計に向いている。

- 将来の複雑なQueryに対応しやすい。

- Prismaとの相性が良い。

- Index、Constraint、Transactionを扱いやすい。

- Local / Staging / Productionで環境を揃えやすい。

- 将来の分析基盤へ接続しやすい。

### 9.2 Prisma / ORM Policy

Prismaは、Database SchemaとApplication Layerを接続するORM候補である。

Prisma利用では、以下を重視する。

- Schemaを明示的に管理する。

- Migration履歴を残す。

- 型安全性を活用する。

- Relationを明確にする。

- Production反映前にMigrationを検証する。

- Prisma Schemaと本章の設計方針を整合させる。

ただし、本章ではPrisma Schema全文を定義しない。
Prisma Schema全文は実装リポジトリで管理し、本章は設計方針を定義する。

### 9.3 Technology Change Policy

Database、ORM、ホスティング方式を大きく変更する場合は、ADR作成を検討する。

## 10. Responsibility Boundary

Database基盤では、責任範囲を明確に分離する。

### 10.1 Database Responsibilities

Databaseが責任を持つ範囲は以下である。

- 正本データの保存

- Entity間のRelation管理

- Statusの保存

- 履歴データの保存

- Audit Logの保存

- KPI集計元データの保存

- Workflow状態の保存

- Approval状態の保存

- Incident情報の保存

- Scale Gate判断用データの保存

### 10.2 Application Layer Responsibilities

Application Layerが責任を持つ範囲は以下である。

- Use Case制御

- Domain Rule適用

- Validation

- Workflow制御

- Approval Gate確認

- Database更新の実行判断

- Transaction範囲の決定

- Error Handling

- Audit Log出力指示

### 10.3 Data Access Layer Responsibilities

Data Access Layerが責任を持つ範囲は以下である。

- Database読み書き

- Repository管理

- Query管理

- Transaction実行

- Database Error整形

- Migration補助

- Database依存処理の分離

### 10.4 Security Responsibilities

Secret管理、認証、認可、アクセス制御、暗号化、Database Credentialの管理は、10_Security.md で詳細を定義する。

本章では、DatabaseにSecretを平文保存しないという境界を定義する。

## 11. Registry to Database Migration Policy

Growth Lab Coreでは、初期RegistryからDatabaseへ段階的に移行する。

### 11.1 Initial Registry Mode

初期段階では、以下の管理を許容する。

- Google Sheets Registry

- Markdown Registry

- CSV Export

- Manual Review

- Human Checked Change History

### 11.2 Database Migration Triggers

Database移行を検討する条件は以下である。

```text
Database Migration Triggers

1. SNSアカウント数が50を超える。
2. Mail AccountとSNS Accountの紐付け管理が複雑化する。
3. WordPress Site、Article、LPが増える。
4. AI Outputが月100件を超える。
5. Campaign単位の成果追跡が必要になる。
6. KPIデータの自動取得が必要になる。
7. Approval履歴の追跡が必要になる。
8. Audit Logを一元管理する必要がある。
9. Automation実行履歴が増える。
10. 手動台帳更新漏れが発生する。
11. Scale Gate判断に集計が必要になる。
```

### 11.3 Migration Principles

移行方針は以下である。

- 既存Registryを破棄せず、移行元として扱う。

- 移行前にバックアップを作成する。

- 移行前にID重複を確認する。

- 移行前に必須項目の欠損を確認する。

- 移行前にRelation整合性を確認する。

- 移行後に件数を照合する。

- 移行後にサンプルデータを確認する。

- 移行後に旧Registryとの役割を整理する。

- Databaseが正本になった場合は明記する。

- 移行判断が重要な場合はADRを作成する。

### 11.4 Registry After Migration

Database移行後のRegistryは、以下のいずれかの役割に変更する。

- Read-only Archive

- Export View

- Human Review Sheet

- Temporary Import Source

- 廃止

Database移行後に、Google SheetsやMarkdown台帳を正本として運用し続ける場合は、整合性リスクを明記する。

## 12. Single Source of Truth Policy

Databaseが正本になった領域では、DatabaseをSingle Source of Truthとして扱う。

### 12.1 Data Source Priority

正本の優先順位は以下を基本とする。

```text
1. Database
2. Approved Registry
3. External Platform Record
4. Exported CSV
5. Manual Note
```

ただし、外部サービス側にしか存在しない情報は、外部サービスを参照元として扱う。
Growth Lab Core側では、その情報を同期、参照、記録する。

### 12.2 External Platform Is Not the Source of Truth

外部サービス管理画面は、Growth Lab Coreの運用台帳としての正本ではない。

対象例は以下である。

- SNS管理画面

- WordPress管理画面

- Gmail画面

- Google Workspace管理画面

- AIサービス画面

- ASP管理画面

- Analytics管理画面

これらは実体または参照元であるが、Growth Lab Core内の関連、状態、履歴、承認、KPI、リスクの正本はDatabaseまたは承認済みRegistryで管理する。

### 12.3 Secret Is Not Stored as Normal Data

Secret実体はDatabase通常テーブルに平文保存しない。

Secretの参照情報、Secret ID、Vault Reference、Masked Valueなどの扱いはSecurity章で定義する。

## 13. Logical Data Model Overview

Growth Lab Coreの論理データモデルは以下である。

```text
Identity
    |
    +-- Mail Account
    +-- SNS Account
            |
            +-- SNS Post
                    |
                    v
WordPress Article or Landing Page
                    |
                    v
Affiliate Link
                    |
                    v
Conversion / KPI

Campaign
    |
    +-- SNS Account
    +-- Post
    +-- Article
    +-- Landing Page
    +-- Affiliate Link
    +-- AI Output
    +-- KPI

Workflow
    |
    +-- Approval
    +-- Audit Log
    +-- Incident
```

論理データモデルでは、Identityを中心にMail、SNS、WordPress、Campaign、AI、KPIを接続する。

## 14. Core Entity Groups

Databaseでは、Entityを用途ごとに分類する。

```text
Core Entity Groups

1. Identity and Account Group
2. Mail Group
3. SNS Group
4. WordPress Group
5. Campaign and Content Group
6. AI Group
7. Workflow and Approval Group
8. Scheduler and Automation Group
9. Analytics and KPI Group
10. Audit and Incident Group
11. Reference and Configuration Group
```

各Groupは、Domain Moduleの責任範囲と対応する。

## 15. Conceptual Field Policy

本章に記載するEntity項目は、Database設計時に検討すべき概念フィールド候補である。

本章に記載されたフィールド名は、実装時のPrisma Schema、SQL、Column名を完全に固定するものではない。
最終的な物理名、型、Null可否、Index、Constraint、Relationは、下位実装仕様と実装リポジトリで定義する。

ただし、以下の設計意図は保持する。

- Entityごとの一意IDを持つ。

- Statusを持つ。

- Risk Levelを必要に応じて持つ。

- Created / Updated / Archivedの時刻を必要に応じて持つ。

- Ownerまたは管理責任を必要に応じて持つ。

- NotesやChange Historyを必要に応じて持つ。

- 外部サービスIDと内部IDを分離する。

- Secret実体を通常フィールドに持たない。

## 16. Identity and Account Entity Policy

Identityは、Growth Lab Coreにおけるアカウント運用単位である。

### 16.1 Identity Entity

Identity Entityは以下を管理する。

```text
Identity Conceptual Fields

- Identity ID
- Display Name
- Identity Type
- Status
- Risk Level
- Owner
- Created At
- Updated At
- Archived At
- Notes
```

### 16.2 Identity Relationship

Identityは以下と関係する。

- Mail Account

- SNS Account

- Campaign

- Audit Log

- Risk Status

- Operation History

### 16.3 Identity Rules

ルールは以下である。

- 本番運用するMail AccountとSNS AccountはIdentityに紐付ける。

- Identityの状態変更は履歴を残す。

- Identity削除よりArchivedを優先する。

- Identity IDは変更しない。

- IdentityがHigh Risk以上の場合はAutomation対象から除外する。

## 17. Mail Entity Policy

Mail Entityは、03 Mail Platformで定義したMail Account RegistryをDatabase化するためのEntityである。

### 17.1 Mail Account Entity

Mail Account Entityは以下を管理する。

```text
Mail Account Conceptual Fields

- Mail Account ID
- Identity ID
- Mail Address
- Domain
- Mail Type
- Forwarding Destination
- Mailbox Flag
- Forwarding Flag
- Workspace User Flag
- Status
- Risk Level
- Created At
- Verified At
- Last Checked At
- Owner
- Notes
```

### 17.2 Mail Relationship

Mail Accountは以下と関係する。

- Identity

- SNS Account

- Notification

- Recovery Reference

- Audit Log

### 17.3 Mail Rules

ルールは以下である。

- 1 Mail Accountは原則1 Identityに紐付ける。

- 1 Mail Accountは原則1 SNS Accountに紐付ける。

- Gmail画面を正本として扱わない。

- SecretやPasswordをMail Account Entityに保存しない。

- Recovery Code実体を保存しない。

メール基盤の詳細は、03_Mail_Platform.md で定義する。

## 18. SNS Entity Policy

SNS Entityは、04 SNS Platformで定義したSNS Account Registry、SNS Post、Publishing、Analyticsとの関係をDatabase化するためのEntityである。

### 18.1 SNS Account Entity

SNS Account Entityは以下を管理する。

```text
SNS Account Conceptual Fields

- SNS Account ID
- Identity ID
- Mail Account ID
- Platform
- Account Type
- Account Name
- Handle
- Profile URL
- Theme
- Target Audience
- Related WordPress Site ID
- Status
- Risk Level
- OAuth Connection Flag
- API Access Flag
- Posting Method
- Analytics Collection Method
- Created At
- Verified At
- Last Checked At
- Owner
- Notes
```

### 18.2 SNS Post Entity

SNS Post Entityは以下を管理する。

```text
SNS Post Conceptual Fields

- SNS Post ID
- SNS Account ID
- Campaign ID
- AI Output ID
- Post Type
- Content Summary
- Target URL
- Scheduled At
- Published At
- Status
- Publish Result
- KPI Reference
- Created At
- Updated At
- Owner
```

### 18.3 SNS Relationship

SNS Accountは以下と関係する。

- Identity

- Mail Account

- SNS Post

- Campaign

- WordPress Site

- OAuth Reference

- KPI

- Audit Log

### 18.4 SNS Rules

ルールは以下である。

- 本番SNS AccountはDatabaseまたは承認済みRegistryへ登録する。

- SNS Account IDは変更しない。

- SNS管理画面を正本として扱わない。

- SNS投稿公開はApproval Gateを通す。

- OAuth Token実体を通常テーブルに保存しない。

SNS基盤の詳細は、04_SNS_Platform.md で定義する。

## 19. WordPress Entity Policy

WordPress Entityは、05 WordPress Platformで定義したWordPress Site、Article、Landing Page、Affiliate LinkをDatabase化するためのEntityである。

### 19.1 WordPress Site Entity

WordPress Site Entityは以下を管理する。

```text
WordPress Site Conceptual Fields

- WordPress Site ID
- Site Name
- Domain
- Site Type
- Hosting Provider
- Environment
- Primary Theme
- Analytics Setup Flag
- Search Console Setup Flag
- Status
- Risk Level
- Created At
- Last Checked At
- Backup Status
- Security Status
- Owner
- Notes
```

### 19.2 Article Entity

Article Entityは以下を管理する。

```text
Article Conceptual Fields

- Article ID
- WordPress Site ID
- WordPress Post ID
- Title
- Slug
- Category
- Tag Summary
- Article Type
- Target Keyword
- Status
- Published URL
- Published At
- Last Updated At
- AI Draft Flag
- Human Review Status
- SEO Status
- Analytics Status
- KPI Reference
- Owner
- Notes
```

### 19.3 Landing Page Entity

Landing Page Entityは以下を管理する。

```text
Landing Page Conceptual Fields

- Landing Page ID
- WordPress Site ID
- Campaign ID
- Title
- Slug
- Published URL
- Status
- CTA Summary
- Affiliate Link ID
- Analytics Status
- KPI Reference
- Created At
- Updated At
- Owner
```

### 19.4 Affiliate Link Entity

Affiliate Link Entityは以下を管理する。

```text
Affiliate Link Conceptual Fields

- Affiliate Link ID
- ASP Name
- Program Name
- Advertiser
- Product or Service
- Link URL Reference
- Tracking Parameter
- Related WordPress Site ID
- Related Article ID
- Related Landing Page ID
- Related Campaign ID
- Status
- Rule Notes
- Created At
- Last Checked At
- Owner
- Notes
```

### 19.5 WordPress Rules

ルールは以下である。

- WordPress管理画面を正本として扱わない。

- WordPress Post IDは外部参照IDとして管理する。

- Article IDはGrowth Lab Core側の内部IDとして管理する。

- Affiliate Linkの実URL管理は規約と安全性を確認する。

- WordPress記事公開はApproval Gateを通す。

- WordPress REST API接続詳細は09章で扱う。

WordPress基盤の詳細は、05_WordPress_Platform.md で定義する。

## 20. Campaign and Content Entity Policy

Campaignは、SNS、WordPress、Affiliate Link、AI Output、KPIをまとめる単位である。

### 20.1 Campaign Entity

Campaign Entityは以下を管理する。

```text
Campaign Conceptual Fields

- Campaign ID
- Campaign Name
- Purpose
- Target Audience
- Start Date
- End Date
- Status
- Owner
- Budget Reference
- KPI Goal
- Result Summary
- Created At
- Updated At
- Notes
```

### 20.2 Campaign Relationship

Campaignは以下と関係する。

- SNS Account

- SNS Post

- WordPress Article

- Landing Page

- Affiliate Link

- AI Output

- KPI

- Approval

- Audit Log

### 20.3 Content Entity

Content Entityは、SNS Post、Article、Landing Page、AI Outputを横断管理する補助Entityとして扱うことができる。

```text
Content Conceptual Fields

- Content ID
- Content Type
- Related Entity Type
- Related Entity ID
- Campaign ID
- Status
- Human Review Status
- Published At
- Measured At
- KPI Reference
- Created At
- Updated At
```

### 20.4 Campaign Rules

ルールは以下である。

- Campaignには目的、期間、KPIを設定する。

- Campaignに紐付くSNS、Article、LP、Affiliate Linkを追跡する。

- Campaign結果はKPIと紐付ける。

- 低成果Campaignは改善またはArchive対象にする。

## 21. AI Entity Policy

AI Entityは、06 AI Platformで定義したPrompt Registry、AI Output Registry、Human Review、AI CostをDatabase化するためのEntityである。

### 21.1 Prompt Entity

Prompt Entityは以下を管理する。

```text
Prompt Conceptual Fields

- Prompt ID
- Prompt Name
- Use Case
- Target Platform
- Input Data Type
- Output Format
- Risk Level
- Human Review Required Flag
- Related Workflow
- Version
- Status
- Created At
- Updated At
- Owner
- Notes
```

### 21.2 AI Output Entity

AI Output Entityは以下を管理する。

```text
AI Output Conceptual Fields

- AI Output ID
- Prompt ID
- Use Case
- Source Data Reference
- Target Platform
- Related SNS Account ID
- Related WordPress Site ID
- Related Article ID
- Related Campaign ID
- Output Type
- Output Summary
- Status
- Risk Level
- Human Review Status
- Approved By
- Created At
- Reviewed At
- Published At
- Measured At
- KPI Reference
- Cost Reference
- Owner
- Notes
```

### 21.3 AI Cost Entity

AI Cost Entityは以下を管理する。

```text
AI Cost Conceptual Fields

- AI Cost ID
- AI Output ID
- Provider
- Model Reference
- Request Type
- Estimated Cost
- Actual Cost
- Currency
- Created At
- Campaign ID
- Owner
```

### 21.4 AI Rules

ルールは以下である。

- AI Outputをそのまま正しい情報として扱わない。

- AI Outputの外部公開にはHuman Reviewを必須とする。

- AIサービスの画面履歴を正本として扱わない。

- PromptにSecretを含めない。

- AI OutputにSecretを保存しない。

- AI CostはCampaign、SNS、Articleと紐付け可能にする。

AI基盤の詳細は、06_AI_Platform.md で定義する。

## 22. Workflow and Approval Entity Policy

WorkflowとApprovalは、外部公開、重要変更、Automation、Scale Stage移行を安全に管理するためのEntityである。

### 22.1 Workflow Entity

Workflow Entityは以下を管理する。

```text
Workflow Conceptual Fields

- Workflow ID
- Workflow Type
- Target Type
- Target ID
- Status
- Current Step
- Requested By
- Assigned To
- Created At
- Updated At
- Completed At
- Notes
```

### 22.2 Approval Entity

Approval Entityは以下を管理する。

```text
Approval Conceptual Fields

- Approval ID
- Workflow ID
- Target Type
- Target ID
- Requested By
- Reviewed By
- Approved By
- Status
- Comment
- Created At
- Reviewed At
- Approved At
- Change History Reference
```

### 22.3 Approval Rules

ルールは以下である。

- SNS投稿公開はApproval Gateを通す。

- WordPress記事公開はApproval Gateを通す。

- LP公開はApproval Gateを通す。

- Affiliate Link掲載はApproval Gateを通す。

- Secret変更はApproval Gateを通す。

- OAuth権限変更はApproval Gateを通す。

- Scale Stage移行はApproval Gateを通す。

- Approval履歴はAudit Logと紐付ける。

## 23. Scheduler and Automation Entity Policy

SchedulerとAutomationは、定期処理と反復作業を管理するためのEntityである。

### 23.1 Schedule Entity

Schedule Entityは以下を管理する。

```text
Schedule Conceptual Fields

- Schedule ID
- Schedule Type
- Target Type
- Target ID
- Cron Expression Reference
- Next Run At
- Last Run At
- Status
- Owner
- Created At
- Updated At
```

### 23.2 Automation Job Entity

Automation Job Entityは以下を管理する。

```text
Automation Job Conceptual Fields

- Automation Job ID
- Job Type
- Target Type
- Target ID
- Schedule ID
- Status
- Approval Required Flag
- Last Result
- Retry Count
- Max Retry
- Last Run At
- Next Run At
- Owner
- Created At
- Updated At
```

### 23.3 Automation Execution Entity

Automation Execution Entityは以下を管理する。

```text
Automation Execution Conceptual Fields

- Automation Execution ID
- Automation Job ID
- Started At
- Finished At
- Status
- Result Summary
- Error Reference
- Audit Log ID
```

### 23.4 Scheduler and Automation Rules

ルールは以下である。

- Schedulerは起動タイミングを管理する。

- Automation Engineは実行条件、停止条件、承認条件を管理する。

- 未承認外部公開をAutomationに許可しない。

- Retryには上限を設ける。

- 実行結果を記録する。

- 失敗時はAudit LogまたはError Logへ記録する。

## 24. Analytics and KPI Entity Policy

Analytics and KPI Entityは、SNS、WordPress、Campaign、AI出力の成果を管理するためのEntityである。

### 24.1 Analytics Record Entity

Analytics Record Entityは以下を管理する。

```text
Analytics Record Conceptual Fields

- Analytics Record ID
- Source Type
- Source ID
- Metric Name
- Metric Value
- Metric Unit
- Measured At
- Period Start
- Period End
- Collection Method
- Data Quality
- Notes
```

### 24.2 KPI Entity

KPI Entityは以下を管理する。

```text
KPI Conceptual Fields

- KPI ID
- Target Type
- Target ID
- Campaign ID
- KPI Name
- Goal Value
- Actual Value
- Status
- Period Start
- Period End
- Measured At
- Owner
- Notes
```

### 24.3 KPI Rules

ルールは以下である。

- KPIは対象Entityと紐付ける。

- 推定値と実測値を区別する。

- 欠損データを記録する。

- 取得元を記録する。

- Campaign結果と紐付ける。

- Scale Gate判断に使える形式で保存する。

KPI定義、分析指標、ROI、レポートの詳細は、12_Analytics_KPI.md で定義する。

## 25. Audit and Incident Entity Policy

Audit and Incident Entityは、操作履歴、承認履歴、障害対応履歴を管理する。

### 25.1 Audit Log Entity

Audit Log Entityは以下を管理する。

```text
Audit Log Conceptual Fields

- Audit Log ID
- Actor
- Actor Role
- Action
- Target Type
- Target ID
- Before State Reference
- After State Reference
- Reason
- Result
- Timestamp
- Related Workflow ID
- Related Approval ID
- Related Incident ID
```

### 25.2 Incident Entity

Incident Entityは以下を管理する。

```text
Incident Conceptual Fields

- Incident ID
- Detected At
- Detected By
- Affected Module
- Affected Entity Type
- Affected Entity ID
- Severity
- Description
- Cause
- Action Taken
- Recovery Result
- Preventive Action
- Owner
- Status
- Created At
- Updated At
```

### 25.3 Audit and Incident Rules

ルールは以下である。

- 重要操作はAudit Logへ記録する。

- Secret実体をAudit Logへ保存しない。

- Incidentは影響範囲を記録する。

- Incidentは再発防止策を記録する。

- Audit Logは人間実行、AI提案、Automation実行を区別する。

- Audit Logの改ざん防止、保持期間、閲覧権限はSecurity章とOperations章で扱う。

## 26. Reference and Configuration Entity Policy

Reference and Configuration Entityは、選択肢、状態、Platform、環境設定を管理する。

### 26.1 Reference Data Examples

参照データの例は以下である。

- Platform Type

- Account Type

- Status Type

- Risk Level

- Workflow Type

- Content Type

- Approval Status

- Automation Job Type

- Metric Type

- Environment Type

### 26.2 Configuration Data Examples

設定データの例は以下である。

- Feature Flag

- Mock Mode Flag

- Integration Enabled Flag

- Scheduler Enabled Flag

- Automation Enabled Flag

- Scale Stage

- Alert Threshold Reference

### 26.3 Configuration Rules

ルールは以下である。

- Secret実体をConfigurationに保存しない。

- 本番設定変更はApproval Gateを通す。

- Mock ModeとProduction Modeを明確に分ける。

- Configuration変更はAudit Logへ記録する。

## 27. ID Design Policy

ID設計は、Entity間の追跡性、移行性、可読性を重視する。

### 27.1 ID Principles

ID設計の原則は以下である。

- Entityごとに一意のIDを持つ。

- IDは原則変更しない。

- 外部サービスIDと内部IDを分離する。

- 内部IDを正本Relationに使う。

- 外部IDは参照情報として保存する。

- Migration時にID対応表を作成する。

### 27.2 Internal ID Examples

内部IDの例は以下である。

```text
Identity ID
Mail Account ID
SNS Account ID
WordPress Site ID
Article ID
Landing Page ID
Affiliate Link ID
Campaign ID
Prompt ID
AI Output ID
Workflow ID
Approval ID
Audit Log ID
Incident ID
```

### 27.3 External ID Examples

外部IDの例は以下である。

```text
WordPress Post ID
SNS Platform Post ID
Google User ID
Analytics Property ID
Search Console Site ID
Affiliate Program ID
External Campaign ID
```

### 27.4 ID Rules

ルールは以下である。

- 外部IDのみで内部Relationを作らない。

- 外部ID変更に備える。

- 内部IDはMigration後も維持する。

- ID採番方式を変更する場合はADRを検討する。

## 28. Relation Design Policy

Relation設計では、Entity間の責任と参照方向を明確にする。

### 28.1 Core Relations

主要Relationは以下である。

```text
Identity 1 - N Mail Account
Identity 1 - N SNS Account
Mail Account 1 - 0..1 SNS Account
SNS Account 1 - N SNS Post
WordPress Site 1 - N Article
WordPress Site 1 - N Landing Page
Article 1 - N Affiliate Link Reference
Campaign 1 - N SNS Post
Campaign 1 - N Article
Campaign 1 - N Landing Page
Campaign 1 - N AI Output
Campaign 1 - N KPI
Prompt 1 - N AI Output
Workflow 1 - N Approval
Entity 1 - N Audit Log
```

### 28.2 Relation Rules

ルールは以下である。

- Relationは業務上の意味を持つものに限定する。

- 必須Relationと任意Relationを区別する。

- 循環参照を増やしすぎない。

- 外部サービスIDへの直接依存を避ける。

- Soft Delete時のRelation影響を確認する。

- Archive対象の参照を残せるようにする。

## 29. Status and Lifecycle Policy

Statusは、各Entityの運用状態を表す重要な項目である。

### 29.1 Common Status

共通Status候補は以下である。

```text
Planned
Prepared
Drafted
Needs Review
Approved
Active
Scheduled
Published
Measured
Improved
Warning
Limited
Suspended
Paused
Completed
Archived
Deleted
```

### 29.2 Status Rules

ルールは以下である。

- Statusは自由入力にしない。

- 重要Status変更はAudit Logへ記録する。

- Status変更条件をDomain Moduleで定義する。

- External Platformの状態と内部Statusを区別する。

- SuspendedやHigh Risk状態のEntityはAutomation対象から除外する。

- DeletedよりArchivedを優先する。

### 29.3 Lifecycle Relationship

Lifecycleの詳細は各Platform章で定義する。

本章では、StatusをDatabaseで一貫して扱えるようにする方針を定義する。

## 30. Soft Delete and Archive Policy

Growth Lab Coreでは、削除よりArchiveを優先する。

### 30.1 Archive Principles

Archive方針は以下である。

- 運用履歴を残す。

- KPI履歴を残す。

- Audit Logを残す。

- Relationの参照切れを防ぐ。

- 復旧可能性を残す。

- 誤削除を防ぐ。

### 30.2 Soft Delete Fields

Soft Deleteに必要な概念フィールドは以下を基本とする。

```text
Deleted At
Deleted By
Delete Reason
Archived At
Archived By
Archive Reason
```

### 30.3 Delete Rules

ルールは以下である。

- 本番Entityは物理削除よりArchiveを優先する。

- 物理削除が必要な場合はApproval Gateを通す。

- 物理削除前にBackupを確認する。

- 物理削除はAudit Logへ記録する。

- 法令や規約に基づく削除要求がある場合はSecurity章とOperations章に従う。

## 31. Data Integrity Policy

Data IntegrityはDatabase基盤の重要要件である。

### 31.1 Integrity Targets

整合性確認対象は以下である。

- IdentityとMail Accountの紐付け

- IdentityとSNS Accountの紐付け

- Mail AccountとSNS Accountの紐付け

- SNS PostとSNS Accountの紐付け

- SNS PostとWordPress ArticleまたはLPの紐付け

- ArticleとWordPress Siteの紐付け

- Affiliate LinkとArticleまたはLPの紐付け

- Campaignと各Entityの紐付け

- AI OutputとPromptの紐付け

- AI OutputとHuman Reviewの紐付け

- KPIと対象Entityの紐付け

- ApprovalとWorkflowの紐付け

- Audit Logと対象Entityの紐付け

### 31.2 Integrity Rules

ルールは以下である。

- 必須Relationの欠損を検出する。

- ID重複を検出する。

- Status不整合を検出する。

- Orphan Dataを検出する。

- 外部ID参照切れを検出する。

- Scale Gate前に整合性チェックを行う。

- Migration前後で件数とRelationを照合する。

## 32. Constraint Policy

ConstraintはDatabaseの最低限の整合性を守るために設定する。

### 32.1 Constraint Types

利用候補は以下である。

- Primary Key

- Foreign Key

- Unique Constraint

- Not Null Constraint

- Check Constraint

- Default Value

- Enum-like Reference

### 32.2 Constraint Rules

ルールは以下である。

- Primary Keyは必須とする。

- 外部RelationにはForeign Keyを検討する。

- Mail Addressなど重複禁止項目にはUnique Constraintを検討する。

- 必須項目にはNot Null Constraintを検討する。

- StatusやRisk Levelは制限された値にする。

- 制約を強くしすぎて運用不能にならないようにする。

- Constraint変更はMigrationとして管理する。

最終的なConstraint定義は、Prisma SchemaまたはMigrationで定義する。

## 33. Index Policy

Indexは検索、一覧、集計、Scale Gate、KPI取得の性能を支える。

### 33.1 Index Targets

Index候補は以下である。

- Identity ID

- Mail Account ID

- SNS Account ID

- WordPress Site ID

- Article ID

- Campaign ID

- AI Output ID

- Status

- Risk Level

- Platform

- Created At

- Updated At

- Published At

- Measured At

- Target Type / Target ID

- Workflow ID

- Approval ID

### 33.2 Index Rules

ルールは以下である。

- 一覧表示でよく使う項目にIndexを検討する。

- Relation検索で使うIDにIndexを検討する。

- KPI集計で使う期間項目にIndexを検討する。

- StatusやRisk Levelの検索にIndexを検討する。

- 不要なIndexを増やしすぎない。

- Index追加はMigrationで管理する。

- Query性能を確認してからIndexを追加する。

最終的なIndex定義は、実装時のQuery、件数、性能確認に基づいて決定する。

## 34. Transaction Policy

Transactionは、複数Entityの更新を安全に行うために利用する。

### 34.1 Transaction Required Cases

Transactionを検討する処理は以下である。

- SNS Post公開結果とKPI参照更新

- Article公開とApproval更新

- AI Output承認とContent状態更新

- Campaign状態変更と関連Entity更新

- Automation ExecutionとAudit Log作成

- Registry Migration

- Scale Stage変更

- Soft Delete / Archive処理

### 34.2 Transaction Rules

ルールは以下である。

- 複数Entityの整合性が必要な処理はTransactionを使う。

- 外部API呼び出しとDB Transactionの境界を慎重に扱う。

- 長時間Transactionを避ける。

- 失敗時のRollbackを考慮する。

- Retry時の重複更新を防ぐ。

- 冪等性を設計する。

外部API実行とTransactionの詳細な制御は、09章および実装仕様で定義する。

## 35. Migration Policy

MigrationはDatabase構造変更の履歴である。

### 35.1 Migration Principles

Migration方針は以下である。

- Migrationは履歴として管理する。

- 本番適用前にLocalまたはStagingで検証する。

- 破壊的変更を避ける。

- Column削除よりDeprecationを優先する。

- Data Migrationを伴う場合はバックアップを取得する。

- Migration結果を確認する。

- Rollback方針を確認する。

### 35.2 Migration Types

Migrationの種類は以下である。

- Schema Migration

- Data Migration

- Index Migration

- Constraint Migration

- Reference Data Migration

- Registry Import Migration

### 35.3 Migration Rules

ルールは以下である。

- Migration前にバックアップを確認する。

- Migration実行者を記録する。

- Migration日時を記録する。

- Migration結果を記録する。

- 失敗時はIncidentとして扱う。

- 重要なMigrationはApproval Gateを通す。

具体的なMigrationコマンド、実行手順、Rollback Runbookは、下位実装仕様と11 Operationsで定義する。

## 36. Backup and Restore Policy

Databaseは、BackupとRestoreを前提に運用する。

### 36.1 Backup Targets

Backup対象は以下である。

- Database本体

- Migration履歴

- Reference Data

- Audit Log

- Configuration

- Exported Registry

- Critical Reports

### 36.2 Backup Rules

Backup方針は以下である。

- 定期Backupを行う。

- Migration前にBackupを確認する。

- 大量Import前にBackupを確認する。

- 大量更新前にBackupを確認する。

- Restore手順を確認する。

- Backup保存先を記録する。

- Secret実体をBackup説明文に平文記載しない。

### 36.3 Restore Workflow

Restore時は以下を基本とする。

```text
Detect Issue
  |
  v
Identify Database Scope
  |
  v
Confirm Backup
  |
  v
Confirm Impact
  |
  v
Approve Restore
  |
  v
Restore
  |
  v
Verify Data
  |
  v
Record Action
```

Restoreは重要操作であり、原則としてApproval GateとAudit Logを必要とする。

具体的なBackup方式、保存先、Restore Runbook、復旧時間目標は、11 Operationsと下位実装仕様で定義する。

## 37. Data Retention Policy

Data Retentionは、運用履歴、分析、監査、コストのバランスを取る。

### 37.1 Retention Targets

保持対象は以下である。

- Core Entity

- Registry History

- Workflow History

- Approval History

- Audit Log

- Incident History

- KPI History

- Analytics Record

- AI Output

- Automation Execution

- Error Log

### 37.2 Retention Rules

ルールは以下である。

- 本番運用履歴は必要期間保持する。

- Audit Logは削除を慎重に扱う。

- KPI履歴は分析価値を確認して保持する。

- 不要な一時データは整理する。

- 個人情報や機密情報が含まれる場合はSecurity章に従う。

- 保持期間を変更する場合はADRを検討する。

保持期間の具体値は、Operations章または下位運用仕様で定義する。

## 38. Database Security Boundary

Databaseは重要情報を扱うため、Security by Designを前提とする。

### 38.1 Protected Data

保護対象は以下である。

- Database Credential

- User Account

- API Reference

- OAuth Reference

- Audit Log

- Approval History

- Campaign Data

- KPI Data

- AI Output

- Incident Data

### 38.2 Secret Handling

Secret実体は、通常テーブルに平文保存しない。

保存禁止の例は以下である。

- Password

- API Key

- OAuth Token

- Refresh Token

- Client Secret

- TOTP Secret

- Recovery Code

- SMTP Credential

- WordPress Application Password

- Hosting Credential

### 38.3 Access Control Boundary

Databaseへのアクセス権限、接続情報、暗号化、Secret Store、権限分離、監査は、10_Security.md で定義する。

## 39. Database Observability

Databaseの状態、性能、整合性、Backup状況を監視する。

### 39.1 Monitoring Targets

監視対象は以下である。

- Database Connection

- Query Error

- Migration Status

- Backup Status

- Restore Test Status

- Slow Query

- Storage Usage

- Index Usage

- Failed Transaction

- Data Integrity Error

- Orphan Data

- Audit Log Volume

### 39.2 Alert Conditions

通知または確認対象は以下である。

- Database接続失敗

- Migration失敗

- Backup失敗

- Restore失敗

- Queryエラー急増

- Storage急増

- Data Integrity Error

- Audit Log異常

- 未承認データ更新の疑い

- Secret混入疑い

監視ツール、通知先、SLA、Runbookは、11_Operations.md で定義する。

## 40. Database Scale Architecture

Database基盤は、運用規模に応じて段階的に拡張する。

### 40.1 Scale Stages

```text
Stage 1: Registry中心、Database準備段階
Stage 2: 一部EntityのDatabase管理開始
Stage 3: Core EntityのDatabase中心管理
Stage 4: KPI、Audit、Automation履歴の本格管理
Stage 5: 大規模運用データ基盤
```

### 40.2 Stage 1

初期段階では、以下を基本とする。

- Google SheetsまたはMarkdown Registry

- Database設計方針作成

- Entity定義

- ID設計

- Migration方針

- Local Database検証

- Mock Data

### 40.3 Stage 2

以下を追加検討する。

- Identity

- Mail Account

- SNS Account

- WordPress Site

- Campaign

- AI Output

- 基本Audit Log

### 40.4 Stage 3

以下を追加検討する。

- Article

- Landing Page

- Affiliate Link

- SNS Post

- Workflow

- Approval

- KPI

- Analytics Record

### 40.5 Stage 4

以下を追加検討する。

- Automation Execution

- Scheduler History

- Incident

- Scale Gate Data

- Cost Data

- Data Integrity Check

- Backup Automation

### 40.6 Stage 5

以下を追加検討する。

- 大規模KPI分析

- 高度なIndex最適化

- Archive Strategy

- Data Mart

- Read Replica

- Advanced Monitoring

- Database Performance Review

## 41. Database Scale Gate

次のDatabase Stageへ進む前に、Database Scale Gate Reviewを行う。

```text
Database Scale Gate Review

1. 現在のRegistry数
2. 現在のDatabase管理Entity数
3. SNSアカウント数
4. Mail Account数
5. WordPress Site数
6. Article数
7. AI Output数
8. Campaign数
9. KPI Record数
10. Audit Log数
11. Registry更新漏れ状況
12. ID重複状況
13. Relation不整合状況
14. Orphan Data有無
15. Migration成功率
16. Backup状態
17. Restore確認状況
18. Query性能
19. Storage使用量
20. 運用担当者の負荷
21. 次Stageへ進む必要性
```

Database Scale Gateを通過できない場合は、Database対象を増やさず、既存Registry、Entity、Relation、Backup、Migration、整合性確認を改善する。

Database Scale Gateは、Growth Lab Core System Scale Gateを置き換えるものではない。
Database観点の準備状態を確認し、07章のSystem Scale Gateへ判断材料を提供する。

## 42. Operations Policy

Databaseの日常運用では、整合性、Backup、Migration、Query、Auditを確認する。

### 42.1 Regular Checks

定期確認項目は以下である。

- Database接続状態

- Backup状態

- Migration状態

- Data Integrity

- ID重複

- Orphan Data

- Query Error

- Audit Log

- Storage使用量

- Slow Query

- Registryとの差分

- Security状態

### 42.2 Change Management

以下の変更は記録する。

- Entity追加

- Column追加

- Relation変更

- Constraint変更

- Index追加

- Migration実行

- Data Import

- Data Export

- Backup設定変更

- Restore実行

- Archive方針変更

### 42.3 Maintenance

保守対象は以下である。

- Migration履歴

- Backup

- Restore Test

- Index確認

- 古い一時データ

- Archived Data

- Reference Data

- Audit Log容量

- Database権限

詳細な運用手順は、11_Operations.md で定義する。

## 43. Incident Handling

Databaseで異常が発生した場合、以下の流れで対応する。

```text
Detect
  |
  v
Identify Affected Entity
  |
  v
Check Impact Scope
  |
  v
Stop Related Automation if Needed
  |
  v
Confirm Backup
  |
  v
Mitigate
  |
  v
Record Incident
  |
  v
Restore or Repair if Needed
  |
  v
Verify Data
  |
  v
Prevent Recurrence
```

### 43.1 Common Incidents

想定される異常は以下である。

- Database接続失敗

- Migration失敗

- Data Import失敗

- Data Export失敗

- Relation不整合

- ID重複

- Orphan Data発生

- 誤更新

- 誤削除

- Backup失敗

- Restore失敗

- Query性能低下

- Storage不足

- Secret混入疑い

- Audit Log欠損

### 43.2 Incident Records

Database Incidentでは、以下を記録する。

```text
Incident ID
Detected Date
Detected By
Affected Entity
Affected Table
Severity
Description
Cause
Action Taken
Backup Used
Restore Result
Data Verification Result
Preventive Action
Owner
Status
Change History
```

詳細なIncident Response手順は、11_Operations.md で定義する。

## 44. Integration with Other Chapters

本章は、以下の章と連携する。

### 44.1 02 Overall Architecture

Databaseは、Growth Lab Core全体アーキテクチャのData Layerの中核である。

### 44.2 03 Mail Platform

Mail Account RegistryをDatabase化する際のEntity、Relation、ID管理と連携する。

### 44.3 04 SNS Platform

SNS Account Registry、SNS Post、SNS AnalyticsをDatabase化する際のEntity、Relation、ID管理と連携する。

### 44.4 05 WordPress Platform

WordPress Site Registry、Article Registry、Affiliate Link RegistryをDatabase化する際のEntity、Relation、ID管理と連携する。

### 44.5 06 AI Platform

Prompt Registry、AI Output Registry、Human Review、AI CostをDatabase化する際のEntity、Relation、ID管理と連携する。

### 44.6 07 Growth Lab Core System

Growth Lab Core SystemのDomain Module、Workflow、Approval、Scheduler、Automation、Audit LogをDatabaseで支える。

### 44.7 09 API and OAuth

Databaseに保存するOAuth Reference、API接続状態、Webhook履歴、Rate Limit関連データと連携する。
Token実体やSecret管理の詳細は09章と10章で扱う。

### 44.8 10 Security

Database Credential、Access Control、Secret管理、暗号化、監査、Security Incidentを扱う。

### 44.9 11 Operations

Database運用、Backup、Restore、Migration、Incident Response、Runbookを扱う。

### 44.10 12 Analytics and KPI

Analytics Record、KPI、Report、ROI、改善判断の保存と分析に連携する。

### 44.11 13 Roadmap

RegistryからDatabaseへの移行時期、Scale Stage、実装順序を扱う。

### 44.12 14 ADR

Databaseに関する重要な設計判断をADRとして記録する。

## 45. Chapter Responsibility Boundary

本章では、Database基盤の上位設計と物理設計方針を定義する。

詳細設計は、以下の章または下位文書で定義する。

```text
08 Database
    |
    +-- Defines:
    |       +-- Database architecture
    |       +-- Relationship with 07 Growth Lab Core System
    |       +-- Registry to Database migration policy
    |       +-- Logical data model
    |       +-- Entity policy
    |       +-- Conceptual field policy
    |       +-- Relation policy
    |       +-- ID policy
    |       +-- Status policy
    |       +-- Soft Delete and Archive policy
    |       +-- Constraint policy
    |       +-- Index policy
    |       +-- Transaction policy
    |       +-- Migration policy
    |       +-- Backup and Restore policy
    |       +-- Database Scale Gate policy
    |
    +-- Does not define:
            +-- Secret実体
            +-- Production connection string
            +-- Full Prisma Schema
            +-- Full SQL files
            +-- Detailed API endpoints
            +-- Detailed OAuth flow
            +-- Detailed security implementation
            +-- Detailed operation runbook
            +-- Detailed KPI formulas
```

Secret、接続情報、認証、権限、暗号化はSecurity章で扱う。
API、OAuth、Webhook、Token、Rate LimitはAPI and OAuth章で扱う。
運用手順はOperations章で扱う。
KPIの詳細定義はAnalytics and KPI章で扱う。

## 46. Architecture Constraints

Database基盤では、以下の制約を前提とする。

- Databaseは運用データのSingle Source of Truth候補である。

- RegistryからDatabaseへ段階的に移行できる設計にする。

- Secret実体を通常テーブルに平文保存しない。

- 外部サービス管理画面を正本として扱わない。

- 内部IDと外部IDを分離する。

- 重要EntityはStatusを持つ。

- 削除よりArchiveを優先する。

- 重要操作はAudit Logへ記録する。

- Migrationは履歴管理する。

- Migration前にBackupを確認する。

- Production反映前に検証する。

- Conceptual FieldsをそのままPrisma Schema全文として扱わない。

- Database変更が上位設計に影響する場合はADRを検討する。

- Scale Gateを通過せずにDatabase対象を急拡大しない。

## 47. Risks

本章に関連する主なリスクは以下である。

### 47.1 Risk: Database設計の過剰複雑化

初期段階から過度に複雑なDatabase設計にすると、実装や運用が重くなる可能性がある。

軽減策：

- Stageごとに段階導入する。

- 初期はCore Entityから開始する。

- 不要なRelationを増やしすぎない。

- Database Scale Gateで拡張判断する。

### 47.2 Risk: RegistryとDatabaseの二重管理

RegistryとDatabaseが並行運用され、不整合が発生する可能性がある。

軽減策：

- Single Source of Truthを明確にする。

- 移行後のRegistry役割を決める。

- 差分確認を行う。

- Database移行時にADRを検討する。

### 47.3 Risk: Secret漏洩

DatabaseにSecret実体が保存される可能性がある。

軽減策：

- Secret実体を通常テーブルに保存しない。

- Secret参照はSecurity章に従う。

- AI入力やAudit LogにもSecretを含めない。

- Secret混入チェックを行う。

### 47.4 Risk: Migration失敗

Schema変更やData Migrationに失敗し、データ不整合やサービス停止が発生する可能性がある。

軽減策：

- Migration前にBackupを確認する。

- LocalまたはStagingで検証する。

- Rollback方針を確認する。

- Migration結果を記録する。

### 47.5 Risk: Data Integrity低下

ID重複、Relation欠損、Orphan Dataにより、KPIやWorkflowが正しく機能しない可能性がある。

軽減策：

- Constraintを設定する。

- Integrity Checkを行う。

- Scale Gate前に整合性確認する。

- Orphan Dataを検出する。

### 47.6 Risk: Query性能低下

データ量増加により、一覧、検索、KPI集計が遅くなる可能性がある。

軽減策：

- Indexを設計する。

- Queryを監視する。

- 不要なデータをArchiveする。

- 必要に応じてRead ModelやData Martを検討する。

### 47.7 Risk: Audit Log肥大化

Audit Logが増加し、Storageや検索性能に影響する可能性がある。

軽減策：

- 保持方針を定義する。

- Archive方針を定義する。

- Indexを設計する。

- 重要度に応じて保持期間を検討する。

### 47.8 Risk: 物理削除による履歴喪失

データを物理削除すると、Audit、KPI、Campaign履歴が追跡できなくなる可能性がある。

軽減策：

- Soft DeleteとArchiveを優先する。

- 物理削除にはApproval Gateを設ける。

- 物理削除前にBackupを確認する。

- Audit Logを残す。

### 47.9 Risk: 08章が実装詳細に入りすぎる

本章がPrisma Schema全文やSQL全文を抱え込み、実装仕様との責任分界が不明確になる可能性がある。

軽減策：

- 本章はDatabase設計方針までを定義する。

- Entity項目はConceptual Fieldsとして扱う。

- Prisma Schema全文、SQL全文は実装リポジトリで管理する。

- 必要に応じて下位実装仕様へ分離する。

### 47.10 Risk: 09から12章との責任重複

Database章がAPI、Security、Operations、Analyticsの詳細に入り込み、下位章と重複する可能性がある。

軽減策：

- 09 API and OAuthへAPI詳細を委譲する。

- 10 SecurityへSecretと権限詳細を委譲する。

- 11 OperationsへRunbook詳細を委譲する。

- 12 Analytics and KPIへKPI定義と分析詳細を委譲する。

## 48. Required Review Checklist

本章またはDatabase基盤を更新する場合は、以下を確認する。

```text
Database Review Checklist

1. Databaseの全体方針が明確か
2. 07 Growth Lab Core Systemとの責任分界が明確か
3. RegistryからDatabaseへの移行方針が明確か
4. Single Source of Truth方針が明確か
5. Secretを通常テーブルに保存しない方針が明確か
6. Logical Data Modelが定義されているか
7. Entity Groupが定義されているか
8. Conceptual Field Policyが定義されているか
9. Identity Entity方針が定義されているか
10. Mail Entity方針が定義されているか
11. SNS Entity方針が定義されているか
12. WordPress Entity方針が定義されているか
13. Campaign Entity方針が定義されているか
14. AI Entity方針が定義されているか
15. Workflow and Approval Entity方針が定義されているか
16. Scheduler and Automation Entity方針が定義されているか
17. Analytics and KPI Entity方針が定義されているか
18. Audit and Incident Entity方針が定義されているか
19. ID設計方針が定義されているか
20. Relation設計方針が定義されているか
21. Status設計方針が定義されているか
22. Soft Delete / Archive方針が定義されているか
23. Constraint方針が定義されているか
24. Index方針が定義されているか
25. Transaction方針が定義されているか
26. Migration方針が定義されているか
27. Backup and Restore方針が定義されているか
28. Data Retention方針が定義されているか
29. Database Security Boundaryが定義されているか
30. Database Scale Gateが定義されているか
31. Prisma Schema全文に入りすぎていないか
32. SQL全文に入りすぎていないか
33. 09 API and OAuthとの責任分界が明確か
34. 10 Securityとの責任分界が明確か
35. 11 Operationsとの責任分界が明確か
36. 12 Analytics and KPIとの責任分界が明確か
37. ADRが必要な判断が整理されているか
```

## 49. Review Points

本章のレビューでは、以下を確認する。

- DatabaseがGrowth Lab Coreの運用データ基盤として定義されているか。

- 07 Growth Lab Core Systemを支えるData Layerとして整理されているか。

- RegistryからDatabaseへ段階的に移行できるか。

- Entity、Relation、ID、Statusの方針が明確か。

- Entity項目がConceptual Fieldsとして扱われ、実装詳細に入りすぎていないか。

- Secretを通常テーブルに平文保存しない方針が明確か。

- 外部サービス管理画面を正本として扱っていないか。

- 08章がPrisma Schema全文やSQL全文に入りすぎていないか。

- 09 API and OAuthへAPI、OAuth、Webhook、Token、Rate Limit詳細を委譲できているか。

- 10 SecurityへSecret、Access Control、暗号化詳細を委譲できているか。

- 11 OperationsへBackup、Restore、Migration Runbookを委譲できているか。

- 12 Analytics and KPIへKPI定義や分析詳細を委譲できているか。

- Database Scale Gateが拡張判断に使える内容になっているか。

- Codex反映時に章構成が崩れにくい構成になっているか。

## 50. Architecture Decision Records

本章に関連するADRは以下の通りである。

```text
Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core
```

本章に関連して、今後追加が想定されるADRは以下である。

```text
ADR-0005: Core Architecture Principles
ADR-0011: Identity-Centric Architecture
ADR-0016: Scale Gate Policy
ADR-0052: Growth Lab Core System Architecture
ADR-0057: Registry to Database Migration Policy
ADR-0062: Database Architecture
ADR-0063: PostgreSQL Initial Database Policy
ADR-0064: Prisma ORM Policy
ADR-0065: Registry to Database Migration Policy
ADR-0066: Database ID Design Policy
ADR-0067: Database Relation Design Policy
ADR-0068: Soft Delete and Archive Policy
ADR-0069: Database Migration Policy
ADR-0070: Database Backup and Restore Policy
ADR-0071: Database Scale Gate Policy
```

以下の判断を変更する場合は、ADR作成を検討する。

- Database技術選定の変更

- PostgreSQL初期候補方針の変更

- Prisma利用方針の変更

- RegistryからDatabaseへの移行方針変更

- DatabaseをSingle Source of Truthとする領域の変更

- Conceptual Field Policyの変更

- ID設計方針変更

- Relation設計方針変更

- Soft Delete / Archive方針変更

- Migration方針変更

- Backup and Restore方針変更

- Database Scale Gate方針変更
