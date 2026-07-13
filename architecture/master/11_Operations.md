# 11 Operations

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/11_Operations.md

---

## 1. Purpose

本章の目的は、Growth Lab CoreにおけるOperations基盤の設計方針を定義することである。

Growth Lab Coreは、SNSアカウント、メールアカウント、WordPress、AI、API、OAuth、Database、Security、Analytics、Affiliate、Scheduler、Automationを統合して運用する基盤である。
そのため、設計だけでなく、日次、週次、月次、Incident、復旧、棚卸し、承認、監視、改善を継続的に行う運用体制が必要である。

Operations基盤は、単なる作業手順書ではない。
Growth Lab Core全体における、確認、実行、承認、停止、復旧、記録、改善を支える実運用の中核である。

本章では、以下を定義する。

- Operations全体方針
- Operations Principles
- 07 Growth Lab Core Systemとの責任分界
- 08 Databaseとの責任分界
- 09 API and OAuthとの責任分界
- 10 Securityとの責任分界
- 12 Analytics and KPIとの責任分界
- Daily Operations
- Weekly Operations
- Monthly Operations
- Quarterly Operations
- Runbook方針
- Approval Operations
- Account Operations
- Onboarding and Offboarding Operations
- Mail Operations
- SNS Operations
- WordPress Operations
- AI Operations
- API and OAuth Operations
- Database Operations
- Security Operations
- Scheduler Operations
- Automation Operations
- Monitoring and Alert Operations
- Backup and Restore Operations
- Secret Rotation Operations
- Incident Response Operations
- Provider and Terms Change Operations
- Change Management
- Release and Deployment Operations
- Documentation Operations
- Data Retention and Archive Operations
- Business Continuity Operations
- Operations Quality Review
- Scale Gate Operations
- Operations Risks and Mitigation

---

## 2. Scope

本章の対象範囲は、Growth Lab Coreを継続運用するための運用方針全体である。

対象範囲は以下を含む。

- Operations Architecture
- Operations Responsibility Boundary
- Operations Principles
- Operations Roles
- Daily Operations
- Weekly Operations
- Monthly Operations
- Quarterly Operations
- Account Review
- Onboarding
- Offboarding
- Mail Review
- SNS Review
- WordPress Review
- AI Review
- API and OAuth Review
- Database Review
- Security Review
- Approval Queue Review
- Scheduler Review
- Automation Review
- Monitoring Review
- Alert Handling
- Incident Response
- Backup Review
- Restore Procedure Policy
- Secret Rotation Procedure Policy
- Provider and Terms Change Review
- Change Management
- Release Management
- Documentation Maintenance
- Changelog Maintenance
- Data Retention Review
- Archive Review
- Business Continuity Review
- Runbook Policy
- Escalation Policy
- Training and Handover Policy
- Operations Quality Review
- Scale Gate Operations

本章では、個別サービスごとの管理画面操作手順全文、実際のSecret、実際のToken、実際のPassword、個別APIリクエスト全文、実装コード全文、KPI計算式詳細までは定義しない。
それらは、下位運用マニュアル、下位実装仕様、12 Analytics and KPI、または安全な管理基盤で扱う。

---

## 3. Non-Goals

本章では、以下を対象外とする。

- 実際のPassword
- 実際のAPI Key
- 実際のOAuth Token
- 実際のRefresh Token
- 実際のClient Secret
- 実際のTOTP Secret
- 実際のRecovery Code
- 実際のDatabase Credential
- 実際のWordPress Credential
- 実際のHosting Credential
- 個別サービス管理画面の全操作手順
- 個別Runbook全文
- Providerごとの全API Endpoint仕様
- Database物理設計
- Prisma Schema全文
- Security実装コード
- CI/CD実装コード
- KPI定義詳細
- KPI計算式詳細
- ROI分析詳細
- 投稿文作成ルール詳細
- SEO戦略詳細
- 法務判断の最終確定
- 個別規約違反判断の最終確定
- 個別ProviderのSLA数値
- 個別担当者の勤務シフト詳細

これらは、各専門章、下位実装仕様、下位運用マニュアル、12 Analytics and KPI、または法務確認で扱う。

---

## 4. Background

Growth Lab Coreでは、初期20SNSアカウントから将来的に100から500アカウント規模までの拡張を想定する。

運用対象は多岐にわたる。

- SNS Account
- Mail Account
- Identity
- WordPress Site
- Article
- Landing Page
- Affiliate Link
- Campaign
- AI Output
- Prompt
- API Connection
- OAuth Connection
- Token Reference
- Database
- Backup
- Security Incident
- Approval
- Scheduler
- Automation
- KPI
- Analytics
- Audit Log

これらを設計だけで管理し、運用方針を定義しない場合、以下の問題が発生する。

- RegistryやDatabaseの更新漏れが発生する。
- 未承認の投稿や変更が起きる。
- OAuth失効やAPI Errorを見落とす。
- SNSアカウント停止に気づくのが遅れる。
- WordPress記事やAffiliate Linkの状態が不明になる。
- AI Outputが未レビューのまま放置される。
- BackupやRestoreの状態が不明になる。
- Security Incidentの初動が遅れる。
- Scale Gateの判断材料が揃わない。
- CodexやClaude Codeによる変更が記録されない。
- KPI取得漏れにより改善判断が遅れる。
- Providerの規約変更やAPI仕様変更を見落とす。
- 担当者交代時に運用が引き継げない。

そのため、Growth Lab Coreでは、Operationsを独立した章として定義し、日常運用と改善ループを標準化する。

---

## 5. Alignment with Architecture Principles

本章は、`01_Architecture_Principles.md` で定義した原則に従う。

特に、Operations基盤では以下を重視する。

```text
AP-01 Compliance First
AP-02 API First
AP-03 Security by Design
AP-05 Automation First
AP-06 Scalability
AP-07 Observability
AP-08 Cost Optimization
AP-09 Single Source of Truth
AP-10 Continuous Improvement
```

Operationsにおける優先順位は以下である。

```text
1. 規約遵守
2. Security
3. Approval
4. Single Source of Truth
5. Audit Log
6. Incident Response
7. Monitoring
8. Backup and Restore
9. Automation Control
10. KPI Review
11. Documentation
12. Continuous Improvement
```

運用効率よりも、規約遵守、Security、承認、記録、復旧可能性を優先する。

---

## 6. Operations Principles

Growth Lab CoreのOperationsは、以下の原則に従う。

### 6.1 Confirm Before Execute

重要操作は、実行前に対象、影響範囲、承認状態、Rollbackまたは復旧方針を確認する。

### 6.2 Record Every Important Operation

重要操作、手動変更、承認、Incident、復旧、Scale Gate判断は記録する。

### 6.3 Approval Before External Impact

SNS投稿公開、WordPress公開、LP公開、Affiliate Link変更、Production接続切替、Secret変更、Restoreなど、外部影響がある操作はApproval Gateを通す。

### 6.4 Stop Before Damage Expansion

Incidentや認証失敗、Rate Limit、Secret漏洩疑いがある場合は、必要に応じてAutomationやSchedulerを停止する。

### 6.5 No Secret in Operations Records

Operation Log、Runbook、Incident Record、CHANGELOG、AI入力にはSecret実体を含めない。

### 6.6 Source of Truth Respect

運用判断では、各章で定義されたSource of Truthを尊重する。
外部サービス管理画面は、原則としてGrowth Lab Coreの正本ではない。

### 6.7 Improve Through Review

運用で発見した問題は、Runbook、Checklist、Architecture、ADR、Roadmapへ反映する。

---

## 7. Operations Vision

Growth Lab CoreのOperations基盤は、Plan、Execute、Check、Record、Improveを継続的に回す運用OSである。

```text
Operations Cycle

Plan
  |
  v
Execute
  |
  v
Check
  |
  v
Record
  |
  v
Review
  |
  v
Improve
  |
  v
Document
```

Operations基盤は、以下を実現する。

- 日常運用を標準化する。
- 重要操作にApproval Gateを適用する。
- 異常を早期に検知する。
- Incident発生時に停止、隔離、復旧できる。
- 変更履歴を記録する。
- RegistryとDatabaseの整合性を保つ。
- Scale Gateに必要な情報を揃える。
- AIとAutomationを安全に運用する。
- 改善内容を次の運用へ反映する。

---

## 8. Relationship with 07, 08, 09, 10, and 12

`07_Growth_Lab_Core_System.md` は、Workflow、Approval Gate、Scheduler、Automation、Monitoringの上位構造を定義する。
`08_Database.md` は、運用データ、履歴、Entity、Relation、Backup、Scale Gateに必要な保存方針を定義する。
`09_API_OAuth.md` は、API接続、OAuth、Scope、Token Reference、Webhook、Rate Limit、Retryを定義する。
`10_Security.md` は、Secret、認証、認可、Access Control、Security Incident方針を定義する。
`12_Analytics_KPI.md` は、KPI定義、KPI計算式、分析、ROI、改善判断を定義する。
本章は、それらの設計を実運用としてどう確認し、実行し、記録し、復旧し、改善するかを定義する。

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
11 Operations
    |
    +-- Daily Operations
    +-- Weekly Operations
    +-- Monthly Operations
    +-- Runbook Policy
    +-- Incident Response Procedure Policy
    +-- Backup Restore Operation
    +-- Secret Rotation Operation
    +-- Scale Gate Operation
    |
    +-- Stores operational records through:
    v
08 Database
    |
    +-- Operation Log
    +-- Audit Log
    +-- Incident Record
    +-- Review Record
    +-- Scale Gate Record
    |
    +-- Uses external connection policy from:
    v
09 API and OAuth
    |
    +-- API Status
    +-- OAuth Status
    +-- Rate Limit
    +-- Webhook Status
    |
    +-- Follows security policy from:
    v
10 Security
    |
    +-- Secret Policy
    +-- Access Control
    +-- Security Incident
    +-- Security Review
    |
    +-- Provides operation status to:
    v
12 Analytics and KPI
    |
    +-- KPI Freshness
    +-- Missing Data
    +-- Report Status
    +-- Operations KPI
```

07章は「運用を支えるシステム構造」を定義する。
08章は「運用記録をどう保存するか」を定義する。
09章は「外部接続をどう運用するかの接続方針」を定義する。
10章は「Security方針」を定義する。
11章は「日常運用で何を確認し、どう実行し、どう記録するか」を定義する。
12章は「KPIをどう定義し、分析し、改善判断へ使うか」を定義する。

---

## 9. Operations Architecture Overview

Operations Architectureは、確認、承認、実行、監視、記録、改善の流れで構成する。

```text
Operator
  |
  v
Operations Dashboard
  |
  +-- Daily Check
  +-- Approval Queue
  +-- Alert Queue
  +-- Incident Queue
  +-- Scheduler Status
  +-- Automation Status
  +-- KPI Status
  |
  v
Operational Action
  |
  +-- Manual Operation
  +-- Approved Execution
  +-- Scheduled Execution
  +-- Automation Execution
  |
  v
Record
  |
  +-- Operation Log
  +-- Audit Log
  +-- Incident Record
  +-- Changelog
  |
  v
Review and Improve
```

Operationsは、手動作業とAutomationの両方を管理する。
ただし、Automationは承認済み範囲、定義済み条件、停止条件、Audit Logを前提として実行する。

---

## 10. Operations Responsibility Boundary

Operations章は、運用方針と運用確認項目を定義する。

### 10.1 Operations Responsibilities

本章が責任を持つ範囲は以下である。

- 日次運用方針
- 週次運用方針
- 月次運用方針
- 四半期運用方針
- Runbook方針
- Escalation方針
- Account棚卸し
- Onboarding方針
- Offboarding方針
- Mail確認
- SNS確認
- WordPress確認
- AI Output確認
- API and OAuth確認
- Database確認
- Security確認
- Approval Queue確認
- Scheduler確認
- Automation確認
- Monitoring and Alert確認
- Backup確認
- Restore運用方針
- Secret Rotation運用方針
- Incident Response運用方針
- Provider and Terms Change確認
- Documentation更新
- Changelog更新
- Data Retention確認
- Archive確認
- Training and Handover方針
- Scale Gate実施方針

### 10.2 Operations Does Not Define

本章では以下を定義しない。

- 物理DB設計
- API Endpoint詳細
- OAuth実装詳細
- Secret実体
- 暗号化実装コード
- 投稿文作成の詳細ルール
- KPI計算式詳細
- ROI分析詳細
- 個別サービスの全管理画面操作
- 個別Runbook全文
- 法務判断の最終確定

---

## 11. Operations Roles

Operationsでは、役割ごとに責任を分ける。

### 11.1 Initial Operations Roles

初期Role候補は以下である。

```text
Operations Roles

- Owner
- Operations Lead
- Operator
- Reviewer
- Approver
- Security Admin
- System Admin
- Developer
- Analyst
- AI Assistant
- Automation
```

### 11.2 Owner

Ownerは、最終判断、Scale Gate承認、高リスクOperation承認、重要ADR承認を行う。

### 11.3 Operations Lead

Operations Leadは、日常運用の進行、確認漏れ防止、担当割り当て、Incident初動整理を行う。

### 11.4 Operator

Operatorは、日次確認、投稿準備、Registry更新、Error確認、手動作業を行う。

### 11.5 Reviewer

Reviewerは、AI Output、SNS投稿、WordPress記事、LP、Affiliate Link、Risk Candidateを確認する。

### 11.6 Approver

Approverは、外部公開、Production操作、高リスク変更、Scale Gate移行を承認する。

### 11.7 Security Admin

Security Adminは、Secret、Access Control、Security Review、Security Incident対応を管理する。

### 11.8 System Admin

System Adminは、System設定、User管理、Integration、Environment、Deploymentを管理する。

### 11.9 Developer

Developerは、実装、修正、Migration、Mock検証、Test、Codex反映作業を担当する。

### 11.10 Analyst

Analystは、KPI、Analytics、Report、改善提案、Scale Gate判断材料を整理する。

### 11.11 AI Assistant

AI Assistantは、下書き、分析補助、改善提案、Runbook案、Codex指示書作成を支援する。
AI Assistantは、承認、外部公開、Secret参照、Security設定変更を行わない。

### 11.12 Automation

Automationは、承認済み範囲、定義済み条件、停止条件に基づいて処理を行う。
Automationは、未承認外部実行を行わない。

---

## 12. Operations Frequency

Operationsは、頻度ごとに管理する。

```text
Operations Frequency

- Real-time or Event-based
- Daily
- Weekly
- Monthly
- Quarterly
- Before Scale Gate
- After Incident
- Before Production Change
- Before High-Risk External Execution
```

頻度は固定ではなく、Account数、Provider数、Campaign数、Incident発生状況、Automation範囲に応じて見直す。

---

## 13. Daily Operations

Daily Operationsでは、日々の運用状態を確認する。

### 13.1 Daily Check Targets

日次確認対象は以下である。

- Alert
- Incident
- Approval Queue
- Scheduler Status
- Automation Status
- SNS Account Status
- Mail Notification
- WordPress Status
- AI Output Review Queue
- API Error
- OAuth Error
- Security Alert
- Backup Status
- KPI Freshness
- Changelog Update Need

### 13.2 Daily Operations Checklist

```text
Daily Operations Checklist

1. Alertを確認する。
2. Incident発生有無を確認する。
3. Approval Queueを確認する。
4. 未レビューAI Outputを確認する。
5. Scheduler失敗を確認する。
6. Automation失敗を確認する。
7. OAuth失効やAPI認証失敗を確認する。
8. Rate Limit発生を確認する。
9. SNS投稿予定と投稿結果を確認する。
10. WordPress記事とLPの公開予定を確認する。
11. Mail重要通知を確認する。
12. Backup失敗有無を確認する。
13. Security Alertを確認する。
14. KPI取得状態を確認する。
15. 必要なOperation Logを記録する。
```

### 13.3 Daily Completion Condition

日次運用は、以下を満たした場合に完了とする。

- Critical Alertが未確認で残っていない。
- Incident候補が放置されていない。
- Approval待ちの高リスク項目が確認されている。
- SchedulerとAutomationの重大失敗が確認されている。
- Security上の重大問題が確認されている。
- 必要な記録が残っている。

---

## 14. Weekly Operations

Weekly Operationsでは、日次では見落としやすい傾向や蓄積情報を確認する。

### 14.1 Weekly Check Targets

週次確認対象は以下である。

- SNS Account状態
- Mail Account状態
- WordPress Site状態
- Article状態
- Affiliate Link状態
- AI Output採用状況
- API Error傾向
- OAuth Scope状態
- Automation成功率
- Scheduler成功率
- KPI取得状況
- Security Review候補
- Backup状態
- Documentation更新漏れ

### 14.2 Weekly Operations Checklist

```text
Weekly Operations Checklist

1. SNS Accountの状態を確認する。
2. Mail AccountとSNS Accountの紐付けを確認する。
3. WordPress Siteの表示状態を確認する。
4. ArticleとLPの状態を確認する。
5. Affiliate Linkの状態を確認する。
6. AI Outputの未レビュー件数を確認する。
7. API Errorの傾向を確認する。
8. OAuth Scopeに過剰権限がないか確認する。
9. Scheduler成功率を確認する。
10. Automation成功率を確認する。
11. KPI取得漏れを確認する。
12. Backup状態を確認する。
13. Security上の注意点を確認する。
14. CHANGELOGやArchitecture文書の更新漏れを確認する。
```

---

## 15. Monthly Operations

Monthly Operationsでは、アカウント、権限、コスト、KPI、Scale Gate候補を確認する。

### 15.1 Monthly Check Targets

月次確認対象は以下である。

- Account棚卸し
- User権限棚卸し
- OAuth Scope棚卸し
- API Key棚卸し
- Secret Reference棚卸し
- Recovery Code状態
- WordPress Site棚卸し
- Campaign結果
- KPI取得状態
- Cost
- Incident件数
- Automation効果
- AI Cost and Effect
- Scale Gate必要性

### 15.2 Monthly Operations Checklist

```text
Monthly Operations Checklist

1. User、Role、Permissionを確認する。
2. SNS Account一覧を確認する。
3. Mail Account一覧を確認する。
4. WordPress Site一覧を確認する。
5. OAuth Scopeを確認する。
6. API KeyとToken Referenceを確認する。
7. Secret Referenceを確認する。
8. Recovery Code状態を確認する。
9. BackupとRestore確認状況を確認する。
10. Incident件数と原因を確認する。
11. Campaign別KPI取得状態を確認する。
12. AI利用コストと採用効果を確認する。
13. Automation効果と失敗率を確認する。
14. Security Exception期限を確認する。
15. Scale Gate実施要否を判断する。
```

KPIの定義、分析、改善判断は、`12_Analytics_KPI.md` で定義する。

---

## 16. Quarterly Operations

Quarterly Operationsでは、運用方針、Security、Scale、Cost、Architectureの見直しを行う。

### 16.1 Quarterly Check Targets

四半期確認対象は以下である。

- Architecture Principlesとの整合性
- 各章の更新必要性
- ADR追加必要性
- Account増加状況
- Scale Gate状態
- Cost
- Security Review
- Incident傾向
- Automation拡張可否
- Database移行状況
- API Provider変更
- Roadmap更新

### 16.2 Quarterly Operations Checklist

```text
Quarterly Operations Checklist

1. 00から14章の更新必要性を確認する。
2. ADR追加が必要な判断を確認する。
3. Scale Gate結果を確認する。
4. Account数と運用負荷を確認する。
5. コストを確認する。
6. Security Reviewを実施する。
7. Incident傾向を確認する。
8. Automation拡張可否を確認する。
9. Database移行状況を確認する。
10. API Provider変更や規約変更を確認する。
11. Roadmapを更新する。
```

---

## 17. Runbook Policy

Runbookは、繰り返し実行する運用作業、Incident対応、復旧作業を標準化するために作成する。

### 17.1 Runbook Targets

Runbook対象は以下である。

- Daily Check
- Weekly Check
- Monthly Check
- Account Creation
- Account Suspension
- Mail Forwarding Check
- SNS Posting Check
- WordPress Publishing Check
- AI Output Review
- OAuth Reauthorization
- Token Rotation
- Backup Check
- Restore Execution
- Incident Response
- Security Review
- Scale Gate Review

### 17.2 Runbook Rules

Runbook作成ルールは以下である。

- 手順の目的を明記する。
- 対象範囲を明記する。
- 前提条件を明記する。
- 実行者を明記する。
- 承認要否を明記する。
- 確認項目を明記する。
- 失敗時の対応方針を明記する。
- 記録先を明記する。
- 更新履歴を残す。
- Secret実体を記載しない。

### 17.3 Runbook Detail Boundary

本章ではRunbookの方針、対象、管理ルールを定義する。
個別サービスの画面操作手順、具体的なコマンド、個別Providerの詳細手順、担当者別の細かい作業手順は、`manuals` または下位運用マニュアルで管理する。

---

## 18. Approval Operations

Approval Operationsでは、外部公開、高リスク操作、Production変更を承認制で管理する。

### 18.1 Approval Required Operations

承認が必要なOperationは以下である。

- SNS投稿公開
- SNS投稿削除
- WordPress記事公開
- WordPress記事削除
- LP公開
- Affiliate Link変更
- OAuth Scope追加
- OAuth接続解除
- Secret変更
- Token Rotation
- 2FA解除
- Recovery Code再発行
- Production接続切替
- Backup Restore
- Account削除
- Automation範囲拡大
- Scale Stage移行

### 18.2 Approval Queue Operations

Approval Queue確認では以下を確認する。

- Target Type
- Target ID
- Requester
- Reviewer
- Approver
- Risk Level
- Due Date
- Status
- Comment
- Related Incident
- Related Workflow
- Related Audit Log

### 18.3 Approval Completion Condition

承認完了条件は以下である。

- 承認対象が明確である。
- 影響範囲が確認されている。
- 必要なReviewが完了している。
- 承認者が記録されている。
- 実行結果が記録されている。
- Audit Logに紐付いている。

---

## 19. Account Operations

Account Operationsでは、Identity、Mail Account、SNS Account、WordPress User、System User、Service Accountを管理する。

### 19.1 Account Operation Targets

対象は以下である。

- Identity
- Mail Account
- SNS Account
- WordPress User
- Google Workspace User
- Gmail Account
- API Service Account
- Database User
- Git User
- AI Service Account
- Affiliate ASP Account

### 19.2 Account Operations Rules

Account運用ルールは以下である。

- Account作成目的を明確にする。
- Ownerを設定する。
- Identityと紐付ける。
- Mail Accountと紐付ける。
- Statusを管理する。
- 不要Accountを放置しない。
- 高リスクAccountには2FAを設定する。
- Account削除よりArchiveを優先する。
- Account状態変更はAudit Logへ記録する。

### 19.3 Account Review Checklist

```text
Account Review Checklist

1. Account IDがあるか。
2. Ownerが設定されているか。
3. Identityと紐付いているか。
4. Mail Accountと紐付いているか。
5. Statusが正しいか。
6. 2FA状態が確認されているか。
7. Recovery状態が確認されているか。
8. 不要Accountが残っていないか。
9. Access権限が過剰でないか。
10. Audit Logが残っているか。
```

---

## 20. Onboarding and Offboarding Operations

Onboarding and Offboarding Operationsでは、担当者、運用者、開発者、外部協力者の参加と離脱を安全に管理する。

### 20.1 Onboarding Operations

Onboarding時は以下を確認する。

- Role設定
- Permission設定
- 必要最小限のAccess付与
- 2FA設定
- 運用対象の説明
- Runbook所在の説明
- Secret取り扱いルールの説明
- Audit Log対象操作の説明

### 20.2 Offboarding Operations

Offboarding時は以下を確認する。

- User Account無効化
- Role削除
- Permission削除
- Secretアクセス権削除
- OAuth管理権限削除
- Google Workspace権限確認
- WordPress権限確認
- SNS管理権限確認
- Hosting権限確認
- Database権限確認
- Git Repository権限確認
- Session無効化
- Secret Rotation要否確認

### 20.3 Onboarding and Offboarding Boundary

本章ではOnboardingとOffboardingの確認方針を定義する。
個別サービスごとの実作業手順は、下位運用マニュアルで定義する。

---

## 21. Mail Operations

Mail Operationsでは、SNS認証、通知、Recoveryに関係するメール基盤を運用する。

### 21.1 Mail Check Targets

確認対象は以下である。

- Mail Account Status
- Forwarding Status
- Gmail受信状態
- SNS認証メール
- Recoveryメール
- 重要通知
- Bounce
- Spam判定
- 未確認メール
- Mail Account Registry

### 21.2 Mail Operations Rules

Mail運用ルールは以下である。

- Mail Account Registryを更新する。
- Gmail画面を正本として扱わない。
- 重要通知を見落とさない。
- 転送設定を定期確認する。
- Recovery用メールを明確にする。
- Mail Account停止や乗っ取り疑いはIncident候補とする。
- SNS Accountとの紐付けを維持する。

Mail基盤の詳細は、`03_Mail_Platform.md` で定義する。

---

## 22. SNS Operations

SNS Operationsでは、SNS投稿、アカウント状態、Analytics、規約リスクを確認する。

### 22.1 SNS Check Targets

確認対象は以下である。

- SNS Account Status
- Posting Schedule
- Published Posts
- Failed Posts
- Engagement
- Account Warning
- Account Suspension
- OAuth Status
- API Error
- DMや通知
- Profile状態

### 22.2 SNS Operations Rules

SNS運用ルールは以下である。

- 未承認投稿を公開しない。
- SNS Account Registryを更新する。
- 投稿結果を記録する。
- Account Warningを確認する。
- API制限回避をしない。
- 規約違反リスクがあるAutomationを行わない。
- Account停止や制限はIncident候補とする。
- WordPress流入と紐付ける。

SNS基盤の詳細は、`04_SNS_Platform.md` で定義する。

---

## 23. WordPress Operations

WordPress Operationsでは、記事、LP、Affiliate Link、Site状態、Backupを確認する。

### 23.1 WordPress Check Targets

確認対象は以下である。

- Site Status
- Article Status
- Landing Page Status
- Affiliate Link Status
- Broken Link
- Publishing Schedule
- WordPress Admin User
- Plugin Update
- Theme Update
- Backup Status
- Security Alert
- Page Speed
- Mobile Display

### 23.2 WordPress Operations Rules

WordPress運用ルールは以下である。

- 記事公開はApproval Gateを通す。
- LP公開はApproval Gateを通す。
- Affiliate Link変更はApproval Gateを通す。
- WordPress Site Registryを更新する。
- Article Registryを更新する。
- WordPress管理画面を正本として扱わない。
- PluginやTheme更新は影響範囲を確認する。
- Backup状態を確認する。
- 改ざん疑いはSecurity Incidentとして扱う。

WordPress基盤の詳細は、`05_WordPress_Platform.md` で定義する。

---

## 24. AI Operations

AI Operationsでは、AI Output、Prompt、Review、Cost、Riskを管理する。

### 24.1 AI Check Targets

確認対象は以下である。

- AI Output Queue
- Unreviewed AI Output
- Approved AI Output
- Rejected AI Output
- Prompt Registry
- AI Cost
- AI Error
- High Risk Output
- Secret混入疑い
- Published AI-derived Content

### 24.2 AI Operations Rules

AI運用ルールは以下である。

- AI出力をそのまま外部公開しない。
- Human Reviewを行う。
- AI入力にSecretを含めない。
- AI Output Registryを更新する。
- Prompt Registryを更新する。
- 採用、却下、修正を記録する。
- AI Costを確認する。
- 高リスク出力は追加Reviewする。

AI基盤の詳細は、`06_AI_Platform.md` で定義する。

---

## 25. API and OAuth Operations

API and OAuth Operationsでは、外部接続、OAuth、Scope、Rate Limit、Webhookを確認する。

### 25.1 API and OAuth Check Targets

確認対象は以下である。

- API Provider Status
- API Adapter Status
- OAuth Connection Status
- OAuth Scope
- Token Reference Status
- API Error
- Rate Limit
- Retry Failure
- Webhook Event
- Webhook Failure
- Production Connection
- Mock Mode Status

### 25.2 API and OAuth Operations Rules

API and OAuth運用ルールは以下である。

- 公式APIを優先する。
- OAuth失効を確認する。
- Scope追加はApproval Gateを通す。
- Token実体を表示しない。
- API Errorを記録する。
- Rate Limit発生を確認する。
- Retry暴走を防ぐ。
- Webhook失敗を確認する。
- Production接続切替は承認制にする。

API and OAuth基盤の詳細は、`09_API_OAuth.md` で定義する。

---

## 26. Database Operations

Database Operationsでは、運用データ、Migration、Backup、Restore、Integrityを確認する。

### 26.1 Database Check Targets

確認対象は以下である。

- Database Availability
- Migration Status
- Backup Status
- Restore Test Status
- Data Integrity
- Orphan Data
- Duplicate ID
- Relation Error
- Query Performance
- Storage Usage
- Audit Log Growth
- Incident Record

### 26.2 Database Operations Rules

Database運用ルールは以下である。

- Production DBへの直接操作を制限する。
- Migration前にBackupを確認する。
- RestoreはApproval Gateを通す。
- Data Integrityを確認する。
- Secret実体を通常DBへ平文保存しない。
- Audit Logを削除しない。
- 重要DB操作を記録する。
- RegistryからDatabaseへの移行状況を確認する。

Database基盤の詳細は、`08_Database.md` で定義する。

---

## 27. Security Operations

Security Operationsでは、Secret、Access Control、2FA、Incident、Exceptionを確認する。

### 27.1 Security Check Targets

確認対象は以下である。

- Secret Reference
- Token Reference
- API Key棚卸し
- OAuth Scope
- User
- Role
- Permission
- 2FA Status
- TOTP Status
- Recovery Code Metadata
- Security Incident
- Security Exception
- Audit Log
- Backup Security
- AI Secret Exposure Risk

### 27.2 Security Operations Rules

Security運用ルールは以下である。

- Secret実体を確認対象へ表示しない。
- 最小権限を確認する。
- Admin権限を棚卸しする。
- 2FA状態を確認する。
- Recovery Code状態を確認する。
- Security Exception期限を確認する。
- Secret漏洩疑いはSecurity Incidentとして扱う。
- Offboarding漏れを確認する。

Security基盤の詳細は、`10_Security.md` で定義する。

---

## 28. Scheduler Operations

Scheduler Operationsでは、定期実行の状態、失敗、遅延、停止条件を確認する。

### 28.1 Scheduler Check Targets

確認対象は以下である。

- Scheduled Job一覧
- Last Run
- Next Run
- Success Rate
- Failure Count
- Delayed Job
- Disabled Job
- Related Automation
- Related Approval
- Related Incident

### 28.2 Scheduler Operations Rules

Scheduler運用ルールは以下である。

- Schedulerは実行タイミングを管理する。
- 処理内容の可否はApplication、Approval、Automationが判断する。
- 失敗したJobを確認する。
- 遅延したJobを確認する。
- 認証失敗時は関連Automationを停止する。
- Scheduler変更は記録する。
- 高リスクJobは承認状態を確認する。

Schedulerの上位方針は、`07_Growth_Lab_Core_System.md` で定義する。

---

## 29. Automation Operations

Automation Operationsでは、自動処理の実行条件、失敗、停止、効果を確認する。

### 29.1 Automation Check Targets

確認対象は以下である。

- Automation Job一覧
- Status
- Trigger
- Scope
- Approval Requirement
- Stop Condition
- Retry Count
- Success Rate
- Failure Reason
- Related API Error
- Related Incident
- Related Audit Log

### 29.2 Automation Operations Rules

Automation運用ルールは以下である。

- 未承認外部実行を行わない。
- 承認済み範囲だけを実行する。
- Stop Conditionを設定する。
- Retry回数に上限を設ける。
- Rate Limitを考慮する。
- 認証失敗時は停止する。
- 手動停止手段を用意する。
- 実行結果を記録する。
- 効果とリスクを定期確認する。

Automationの上位方針は、`07_Growth_Lab_Core_System.md` と `10_Security.md` で定義する。

---

## 30. Monitoring and Alert Operations

Monitoring and Alert Operationsでは、異常検知と通知対応を管理する。

### 30.1 Monitoring Targets

監視対象は以下である。

- System Health
- API Error
- OAuth Error
- Rate Limit
- Scheduler Failure
- Automation Failure
- Database Error
- Backup Failure
- WordPress Error
- SNS Account Warning
- Mail Important Notification
- Security Alert
- Incident Status
- KPI Freshness

### 30.2 Alert Levels

Alert Levelは以下を基本とする。

```text
Alert Levels

Level 1: Info
Level 2: Warning
Level 3: Error
Level 4: Critical
```

### 30.3 Alert Handling Rules

Alert対応ルールは以下である。

- Critical Alertを放置しない。
- Security Alertは優先確認する。
- 同一Alertの連続発生をIncident候補にする。
- Alert対応結果を記録する。
- 過剰通知は調整する。
- 通知先を明確にする。
- Alert原因が不明な場合は調査対象にする。

---

## 31. Backup Operations

Backup Operationsでは、データ保護と復旧可能性を確認する。

### 31.1 Backup Targets

Backup対象候補は以下である。

- Architecture Markdown
- ADR
- CHANGELOG
- Database
- Registry
- WordPress Site
- WordPress Media
- Configuration
- Operations Manual
- Export File

### 31.2 Backup Operations Rules

Backup運用ルールは以下である。

- Backup対象を明確にする。
- Backup頻度を定義する。
- Backup保存先を保護する。
- Backup失敗を確認する。
- BackupにSecretが含まれる場合は保護する。
- Backupファイル名にSecretを含めない。
- Backup Restore確認を定期的に検討する。
- 不要な古いBackupを整理する。

### 31.3 Backup Check Checklist

```text
Backup Check Checklist

1. Backup対象が明確か。
2. Backupが取得されているか。
3. Backup失敗がないか。
4. Backup保存先が保護されているか。
5. BackupにSecretが混入していないか。
6. Restore可能性が確認されているか。
7. 古いBackupの扱いが定義されているか。
```

---

## 32. Restore Operations

Restore Operationsでは、復旧作業の承認、影響範囲確認、実行、確認を管理する。

### 32.1 Restore Required Cases

Restoreが必要になる例は以下である。

- Database破損
- 誤削除
- Migration失敗
- WordPress障害
- 設定破損
- ファイル破損
- Security Incident後の復旧
- Backup検証

### 32.2 Restore Operations Rules

Restore運用ルールは以下である。

- RestoreはApproval Gateを通す。
- Restore前に影響範囲を確認する。
- Restore前に現状Backupを検討する。
- Restore後にData Integrityを確認する。
- Restore後にAccess Controlを確認する。
- Restore後に外部連携状態を確認する。
- Restore結果を記録する。
- Restore失敗時はIncidentとして扱う。

---

## 33. Secret Rotation Operations

Secret Rotation Operationsでは、Token、API Key、Password、Client Secretなどの更新を安全に行う。

### 33.1 Rotation Targets

Rotation対象は以下である。

- Password
- API Key
- OAuth Token
- Refresh Token
- Client Secret
- Webhook Secret
- Database Credential
- SMTP Credential
- WordPress Application Password
- Hosting Credential
- Service Account Key

### 33.2 Rotation Required Cases

Rotationが必要になる例は以下である。

- 漏洩疑い
- 担当者変更
- Offboarding
- Provider要件
- 定期更新
- Scope変更
- Security Review結果
- Incident後
- Production接続変更

### 33.3 Rotation Operations Rules

Rotation運用ルールは以下である。

- RotationはApproval Gateを通す。
- 影響範囲を確認する。
- 関連Automationを確認する。
- 関連Schedulerを確認する。
- 関連API Adapterを確認する。
- 更新後に接続確認を行う。
- 旧Secretを無効化する。
- Rotation結果を記録する。
- Secret実体をOperation Logへ記録しない。

具体的なRotation手順は、下位Runbookで定義する。

---

## 34. Incident Response Operations

Incident Response Operationsでは、異常発生時の初動、封じ込め、復旧、再発防止を管理する。

### 34.1 Incident Types

主なIncidentは以下である。

- SNS Account Suspension
- SNS Account Warning
- Mail Account Failure
- WordPress Failure
- API Failure
- OAuth Failure
- Database Failure
- Backup Failure
- Automation Failure
- Scheduler Failure
- Security Incident
- Secret Leakage Suspicion
- Unauthorized Execution
- Data Integrity Failure

### 34.2 Incident Response Flow

```text
Detect
  |
  v
Classify
  |
  v
Assign Owner
  |
  v
Contain
  |
  v
Investigate
  |
  v
Recover
  |
  v
Record
  |
  v
Review
  |
  v
Prevent Recurrence
```

### 34.3 Incident Initial Checklist

```text
Incident Initial Checklist

1. Incident Typeを分類する。
2. Severityを分類する。
3. Ownerを設定する。
4. 影響範囲を確認する。
5. Automation停止要否を判断する。
6. External Service影響を確認する。
7. Security影響を確認する。
8. 復旧方針を決める。
9. Incident Recordを作成する。
10. 再発防止候補を記録する。
```

詳細なIncident Response手順は、下位Runbookで定義する。

---

## 35. Security Incident Operations

Security Incidentは、10章の方針に従って優先対応する。

### 35.1 Security Incident Initial Actions

初動候補は以下である。

- 関連Automation停止
- 関連Scheduler停止
- Token無効化
- API Key無効化
- Password変更
- OAuth接続解除
- Scope削除
- Session無効化
- User権限停止
- 影響範囲確認
- Audit Log確認
- Incident Record作成

### 35.2 Security Incident Rules

Security Incident運用ルールは以下である。

- Secret実体をIncident Recordへ記録しない。
- 影響範囲を確認する。
- 復旧より封じ込めを優先する場合がある。
- OwnerとApproverを設定する。
- Critical Incidentは放置しない。
- 再発防止策を記録する。

Security Incident方針は、`10_Security.md` で定義する。

---

## 36. Provider and Terms Change Operations

Provider and Terms Change Operationsでは、SNS、Mail、WordPress、Google、AI、Affiliate、Analyticsなどの外部サービス変更を確認する。

### 36.1 Change Targets

確認対象は以下である。

- 利用規約変更
- API仕様変更
- OAuth Scope変更
- Rate Limit変更
- 認証方式変更
- 料金変更
- 機能廃止
- 審査要件変更
- 投稿ルール変更
- Affiliate Program条件変更

### 36.2 Provider Change Rules

Provider変更確認ルールは以下である。

- 重要Providerの変更情報を確認する。
- 影響範囲を記録する。
- 関連するAPI Adapterを確認する。
- 関連するAutomationを確認する。
- 関連するRunbookを確認する。
- Compliance Firstを優先する。
- 重要変更はADR作成を検討する。
- 必要に応じてRoadmapへ反映する。

Provider変更の詳細な調査手順は、下位Runbookで定義する。

---

## 37. Change Management

Change Managementでは、設計、実装、設定、運用手順の変更を管理する。

### 37.1 Change Types

変更種別は以下である。

- Architecture Change
- ADR Change
- Database Change
- API Integration Change
- OAuth Scope Change
- Security Setting Change
- WordPress Change
- SNS Operation Change
- Automation Change
- Scheduler Change
- Runbook Change
- Documentation Change

### 37.2 Change Management Rules

変更管理ルールは以下である。

- 変更目的を明確にする。
- 影響範囲を確認する。
- Backup要否を確認する。
- Approval要否を確認する。
- TestまたはMock確認を行う。
- 変更結果を記録する。
- CHANGELOGを更新する。
- ADRが必要な変更を確認する。
- 失敗時のRollback方針を確認する。

---

## 38. Release and Deployment Operations

Release and Deployment Operationsでは、実装変更や運用基盤変更の反映を管理する。

### 38.1 Release Targets

Release対象は以下である。

- Growth Lab Core Application
- Database Migration
- API Adapter
- Scheduler
- Automation Job
- WordPress関連設定
- Monitoring設定
- Security設定
- Documentation

### 38.2 Release Rules

Releaseルールは以下である。

- Production反映前に影響範囲を確認する。
- Backupを確認する。
- Migrationがある場合はRollback方針を確認する。
- SecretをRelease Noteに含めない。
- Approval Gateを通す。
- Release後にHealth Checkを行う。
- Release結果を記録する。
- 失敗時はIncidentまたはRollback対象にする。

---

## 39. Documentation Operations

Documentation Operationsでは、Markdown、ADR、CHANGELOG、Runbook、Manualを管理する。

### 39.1 Documentation Targets

対象文書は以下である。

- Master Architecture
- ADR
- CHANGELOG
- Runbook
- Operations Manual
- Implementation Specification
- README
- Codex Instruction
- Review Memo

### 39.2 Documentation Rules

文書運用ルールは以下である。

- Markdownを正本として扱う。
- Word、PDF、DOCXは人間向け出力として扱う。
- 変更前にBackupを作成する。
- CHANGELOGを更新する。
- ADRが必要な判断を記録する。
- 文字化けを確認する。
- コードブロックを壊さない。
- 開始マーカーと終了マーカーは対象ファイルへ残さない。
- マーカーは単独行で扱う。
- PDF単独からMarkdown構造を復元しない。

---

## 40. Codex and Claude Code Operations

Codex and Claude Code Operationsでは、AI開発支援ツールによる反映作業を管理する。

### 40.1 Codex Operation Rules

Codex作業ルールは以下である。

- 確定本文のみを反映する。
- 本文を要約しない。
- 本文を省略しない。
- 上位設計判断を変更しない。
- 更新前にBackupを作成する。
- CHANGELOGを更新する。
- 文字化けを確認する。
- Markdown構造を確認する。
- 作業完了報告を残す。

### 40.2 Claude Code Operation Rules

Claude Codeを利用する場合も、Codexと同様に以下を守る。

- 確定仕様に従う。
- 独自判断で上位設計を変更しない。
- Secret実体を扱わない。
- BackupとCHANGELOGを管理する。
- 変更内容を報告する。

### 40.3 AI Tool Boundary

Codex、Claude Code、AI Assistantは、以下を行わない。

- Secret実体の参照
- Secret実体の保存
- 未承認外部公開
- Security設定変更の最終判断
- Production接続切替の最終判断
- 法務判断の最終確定

---

## 41. Communication and Escalation Policy

Communication and Escalationでは、異常や承認待ちを適切な担当へ伝える。

### 41.1 Communication Targets

通知対象は以下である。

- Approval Request
- Alert
- Incident
- Security Incident
- Backup Failure
- Restore Request
- OAuth Expiration
- API Failure
- SNS Account Warning
- WordPress Failure
- Scale Gate Review
- Security Exception

### 41.2 Escalation Rules

Escalationルールは以下である。

- Critical IncidentはOwnerへEscalationする。
- Security IncidentはSecurity AdminへEscalationする。
- Production障害はSystem AdminへEscalationする。
- KPI重大問題はAnalystとOwnerへ共有する。
- Approval遅延はApproverへ通知する。
- 通知内容にSecret実体を含めない。
- Escalation結果を記録する。

---

## 42. Operations Log Policy

Operations Logは、日常運用、手動作業、確認結果を記録する。

### 42.1 Operations Log Targets

記録対象は以下である。

- Daily Check結果
- Weekly Check結果
- Monthly Check結果
- Manual Operation
- Approval Result
- Incident Response
- Backup Check
- Restore Result
- Secret Rotation Result
- Account Review
- Security Review
- Scale Gate Review
- Documentation Update

### 42.2 Operations Log Rules

Operations Logルールは以下である。

- Secret実体を記録しない。
- 操作対象を明確にする。
- 実行者を記録する。
- 実行日時を記録する。
- 結果を記録する。
- 未完了項目を記録する。
- 関連するAudit LogやIncidentと紐付ける。

---

## 43. Audit Log Operations

Audit Log Operationsでは、高リスク操作と重要変更を監査可能にする。

### 43.1 Audit Required Operations

Audit Logが必要な操作は以下である。

- Account作成
- Account削除
- Role変更
- Permission変更
- Secret変更
- Token Rotation
- OAuth Scope変更
- SNS投稿公開
- WordPress記事公開
- LP公開
- Affiliate Link変更
- Production接続切替
- Backup Restore
- Automation実行
- Scheduler変更
- Security Incident対応
- Scale Stage変更

### 43.2 Audit Log Rules

Audit Logルールは以下である。

- Actorを記録する。
- Targetを記録する。
- Actionを記録する。
- Resultを記録する。
- Timestampを記録する。
- Approval IDを紐付ける。
- Incident IDを紐付ける。
- Secret実体を保存しない。

---

## 44. Registry and Database Consistency Operations

Registry and Database Consistency Operationsでは、初期Registry運用とDatabase移行後の整合性を管理する。

### 44.1 Consistency Targets

確認対象は以下である。

- Mail Account Registry
- SNS Account Registry
- WordPress Site Registry
- Article Registry
- Affiliate Link Registry
- Prompt Registry
- AI Output Registry
- Database Entity
- Audit Log
- Incident Record

### 44.2 Consistency Rules

整合性ルールは以下である。

- Registry更新漏れを確認する。
- Database移行後はDatabaseを正本とする。
- 重複IDを確認する。
- Orphan Dataを確認する。
- Relation不整合を確認する。
- External Platform画面を正本として扱わない。
- 修正結果を記録する。

---

## 45. KPI Operations Boundary

KPI Operationsでは、KPI取得状態、欠損、レポート実行を確認する。
KPI定義、計算式、分析、ROI、改善判断の詳細は、`12_Analytics_KPI.md` で扱う。

### 45.1 KPI Operations Targets

確認対象は以下である。

- KPI Data Freshness
- Analytics API Status
- Campaign KPI取得状態
- SNS KPI取得状態
- WordPress KPI取得状態
- Affiliate KPI取得状態
- AI Output Effect取得状態
- Missing Data
- Report Status

### 45.2 KPI Operations Rules

KPI運用ルールは以下である。

- KPI取得状態を確認する。
- 欠損データを記録する。
- 推定値と実測値を区別する。
- Report生成状態を確認する。
- Scale Gateに必要なKPIを整理する。
- KPI定義変更は12章で扱う。
- ROIや改善判断の詳細は12章で扱う。

---

## 46. Cost Operations

Cost Operationsでは、AI、API、Hosting、Google Workspace、Tool、Automationに関するコストを確認する。

### 46.1 Cost Targets

確認対象は以下である。

- AI Cost
- API Cost
- Google Workspace Cost
- Hosting Cost
- Domain Cost
- WordPress Plugin Cost
- Automation Cost
- Tool Cost
- Human Operation Cost

### 46.2 Cost Operations Rules

Cost運用ルールは以下である。

- 月次で主要Costを確認する。
- AI Costの急増を確認する。
- API Costの急増を確認する。
- Account増加に伴うCostを確認する。
- ROIと運用負荷を確認する。
- Scale GateでCostを確認する。

ROI分析の詳細は、`12_Analytics_KPI.md` で定義する。

---

## 47. Data Retention and Archive Operations

Data Retention and Archive Operationsでは、運用データ、ログ、文書、Backupの保持と整理を管理する。

### 47.1 Retention Targets

対象は以下である。

- Operation Log
- Audit Log
- Incident Record
- Approval Record
- AI Output
- API Log
- Webhook Event
- Backup
- Export File
- Runbook
- ADR
- CHANGELOG

### 47.2 Retention and Archive Rules

保持とArchiveのルールは以下である。

- 重要記録を不用意に削除しない。
- 削除よりArchiveを優先する。
- 保持期間はデータ種別ごとに定義する。
- Secret実体をArchiveへ含めない。
- 古いBackupの扱いを定期確認する。
- 法令や規約上必要な削除には対応する。
- 削除またはArchive結果を記録する。

詳細な保持期間は、08 Database、10 Security、12 Analytics and KPI、下位Runbookで定義する。

---

## 48. Business Continuity Operations

Business Continuity Operationsでは、障害、担当不在、外部サービス停止、災害、重大Incident時の継続運用を管理する。

### 48.1 Continuity Targets

対象は以下である。

- Critical Account
- Critical Mail
- Critical SNS Account
- Critical WordPress Site
- Critical Database
- Critical Secret Reference
- Backup
- Recovery Procedure
- Emergency Contact
- Manual Operation Fallback

### 48.2 Continuity Rules

継続運用ルールは以下である。

- 重要アカウントを特定する。
- 重要データのBackup状態を確認する。
- 担当不在時の代替確認者を定義する。
- Manual Operationへの切替を検討する。
- 外部サービス停止時の影響範囲を確認する。
- Recovery手段を確認する。
- Critical Incident時のEscalationを定義する。

詳細な継続運用手順は、下位Runbookで定義する。

---

## 49. Training and Handover Operations

Training and Handover Operationsでは、運用担当者が安全に作業できるように教育と引継ぎを管理する。

### 49.1 Training Targets

教育対象は以下である。

- Architecture overview
- Operations Principles
- Daily Check
- Approval Gate
- Secret Handling
- Incident Response
- Documentation Rules
- Codex and Claude Code Rules
- Security Rules
- Scale Gate Rules

### 49.2 Handover Rules

引継ぎルールは以下である。

- 運用対象を明確にする。
- Runbook所在を共有する。
- 権限範囲を明確にする。
- 未完了作業を記録する。
- Incident中の引継ぎはOwnerを明確にする。
- Secret実体を引継ぎ資料へ記載しない。
- 引継ぎ後にAccess Controlを確認する。

---

## 50. Operations Quality Review

Operations Quality Reviewでは、運用品質を定期的に確認する。

### 50.1 Quality Review Targets

確認対象は以下である。

- Checklist実施率
- Incident対応時間
- Alert未対応件数
- Approval滞留件数
- Documentation更新遅れ
- Registry更新漏れ
- Automation失敗率
- Scheduler失敗率
- Backup失敗率
- Security Exception期限切れ
- Human Operation Load

### 50.2 Quality Review Rules

Quality Reviewルールは以下である。

- 月次または四半期で運用品質を確認する。
- 問題がある場合は改善項目を記録する。
- 改善項目のOwnerを設定する。
- 改善結果を次回Reviewで確認する。
- 必要に応じてRunbookを更新する。
- 必要に応じてArchitectureまたはADRへ反映する。

Operations Qualityの詳細KPIは、`12_Analytics_KPI.md` で定義する。

---

## 51. Operations Data Model Overview

Operations基盤の論理データモデルは以下である。

```text
Operations
    |
    +-- Operation Log
    +-- Runbook
    +-- Checklist
    +-- Approval
    +-- Incident
    +-- Alert
    +-- Scheduler Job
    +-- Automation Job
    +-- Backup Record
    +-- Restore Record
    +-- Rotation Record
    +-- Review Record
    +-- Scale Gate Record
    +-- Change Record
    +-- Training Record
    +-- Handover Record
```

Databaseに保存する場合は、Secret実体ではなく、参照情報、状態、履歴、結果、承認、Incidentとの関係を保存する。

物理データベース設計は、`08_Database.md` で定義する。

---

## 52. Operations Entity Policy

Operations関連Entityは、運用状態、履歴、確認結果、承認、Incidentを管理するために利用する。

本章に記載するEntity項目は、概念フィールド候補である。
物理テーブル、Prisma Schema、Column名、型、Index、Constraintは、08 Databaseおよび下位実装仕様で定義する。

### 52.1 Operation Log Entity

```text
Operation Log Conceptual Fields

- Operation Log ID
- Operation Type
- Target Type
- Target ID
- Actor
- Result
- Summary
- Related Approval ID
- Related Incident ID
- Created At
- Notes
```

### 52.2 Runbook Entity

```text
Runbook Conceptual Fields

- Runbook ID
- Runbook Name
- Target Operation
- Owner
- Status
- Last Reviewed At
- Next Review At
- Version
- Notes
```

### 52.3 Alert Entity

```text
Alert Conceptual Fields

- Alert ID
- Alert Type
- Severity
- Source
- Target Type
- Target ID
- Status
- Detected At
- Resolved At
- Owner
- Related Incident ID
```

### 52.4 Review Record Entity

```text
Review Record Conceptual Fields

- Review Record ID
- Review Type
- Target Type
- Target ID
- Reviewer
- Result
- Risk Level
- Review Date
- Next Action
- Notes
```

### 52.5 Scale Gate Record Entity

```text
Scale Gate Record Conceptual Fields

- Scale Gate Record ID
- Scale Gate Type
- Current Stage
- Target Stage
- Reviewer
- Result
- Conditions
- Risks
- Approved By
- Review Date
- Notes
```

### 52.6 Operations Entity Rules

ルールは以下である。

- Secret実体をOperations関連Entityへ保存しない。
- Operation LogとAudit Logの目的を混同しない。
- Review RecordをScale Gate判断へ活用する。
- IncidentとAlertを紐付ける。
- 物理設計は08章へ委譲する。

---

## 53. Operations Scale Architecture

Operations基盤は、運用規模に応じて段階的に強化する。

### 53.1 Scale Stages

```text
Stage 1: 初期20SNSアカウント規模の手動中心運用
Stage 2: 主要RegistryとDaily Checkの標準化
Stage 3: Database中心運用と一部Automation
Stage 4: Monitoring、Alert、Automationの強化
Stage 5: 大規模運用OSとしての継続改善体制
```

### 53.2 Stage 1

初期段階では、以下を基本とする。

- Manual Check
- Registry更新
- Approval手動管理
- Mock Mode
- Backup確認
- Basic Incident Record
- CHANGELOG更新

### 53.3 Stage 2

以下を追加検討する。

- Daily Checklist
- Weekly Checklist
- Monthly Checklist
- Runbook整備
- Approval Queue
- Alert Queue
- AI Output Review Queue

### 53.4 Stage 3

以下を追加検討する。

- Database中心管理
- Operation Log
- Audit Log強化
- Scheduler運用
- 一部Automation
- KPI Data Freshness確認

### 53.5 Stage 4

以下を追加検討する。

- Monitoring Dashboard
- Alert Automation
- Incident Workflow
- Backup Restore Drill
- Security Review強化
- Automation効果測定

### 53.6 Stage 5

以下を追加検討する。

- Operations Governance
- Advanced Monitoring
- Advanced Automation
- Multi-role Approval
- Cost Optimization
- Continuous Improvement Board
- Large Scale Gate Management

---

## 54. Operations Scale Gate

次のOperations Stageへ進む前に、Operations Scale Gate Reviewを行う。

```text
Operations Scale Gate Review

1. 現在のSNSアカウント数
2. 現在のMail Account数
3. 現在のWordPress Site数
4. 現在のCampaign数
5. 現在のAI Output数
6. Daily Check実施状況
7. Weekly Check実施状況
8. Monthly Check実施状況
9. Approval Queue滞留状況
10. Alert未対応件数
11. Incident未解決件数
12. Scheduler成功率
13. Automation成功率
14. Backup確認状況
15. Restore確認状況
16. Security Review状況
17. Registry更新漏れ状況
18. Database整合性状況
19. KPI取得状態
20. Documentation更新状況
21. Provider変更確認状況
22. Offboarding確認状況
23. 運用担当者の負荷
24. コスト
25. 次Stageへ進む必要性
```

Operations Scale Gateを通過できない場合は、アカウント追加、Provider追加、Automation拡大、Production連携拡大を行わず、運用体制の改善を優先する。

Operations Scale Gateは、Growth Lab Core System Scale Gate、Database Scale Gate、API and OAuth Scale Gate、Security Scale Gateを置き換えるものではない。
Operations観点の準備状態を確認し、07章のSystem Scale Gateへ判断材料を提供する。

---

## 55. Operations Review Checklist

Operations章または運用体制を更新する場合は、以下を確認する。

```text
Operations Review Checklist

1. Operations全体方針が明確か
2. Operations Principlesが定義されているか
3. 07 Growth Lab Core Systemとの責任分界が明確か
4. 08 Databaseとの責任分界が明確か
5. 09 API and OAuthとの責任分界が明確か
6. 10 Securityとの責任分界が明確か
7. 12 Analytics and KPIとの責任分界が明確か
8. Daily Operationsが定義されているか
9. Weekly Operationsが定義されているか
10. Monthly Operationsが定義されているか
11. Quarterly Operationsが定義されているか
12. Runbook方針が定義されているか
13. Runbook詳細に入りすぎていないか
14. Approval Operationsが定義されているか
15. Account Operationsが定義されているか
16. Onboarding and Offboarding Operationsが定義されているか
17. Mail Operationsが定義されているか
18. SNS Operationsが定義されているか
19. WordPress Operationsが定義されているか
20. AI Operationsが定義されているか
21. API and OAuth Operationsが定義されているか
22. Database Operationsが定義されているか
23. Security Operationsが定義されているか
24. Scheduler Operationsが定義されているか
25. Automation Operationsが定義されているか
26. Monitoring and Alert Operationsが定義されているか
27. Backup Operationsが定義されているか
28. Restore Operationsが定義されているか
29. Secret Rotation Operationsが定義されているか
30. Incident Response Operationsが定義されているか
31. Provider and Terms Change Operationsが定義されているか
32. Change Managementが定義されているか
33. Release and Deployment Operationsが定義されているか
34. Documentation Operationsが定義されているか
35. Codex and Claude Code Operationsが定義されているか
36. Operations Log方針が定義されているか
37. Audit Log Operationsが定義されているか
38. Registry and Database Consistency Operationsが定義されているか
39. KPI Operations Boundaryが定義されているか
40. Cost Operationsが定義されているか
41. Data Retention and Archive Operationsが定義されているか
42. Business Continuity Operationsが定義されているか
43. Training and Handover Operationsが定義されているか
44. Operations Quality Reviewが定義されているか
45. Operations Scale Gateが定義されているか
46. Secret実体を本文に含めていないか
47. 個別Runbook全文に入りすぎていないか
48. ADRが必要な判断が整理されているか
```

---

## 56. Operations Review Points

本章のレビューでは、以下を確認する。

- OperationsがGrowth Lab Core全体の実運用基盤として定義されているか。
- 07、08、09、10、12との責任分界が明確か。
- 日次、週次、月次、四半期運用が整理されているか。
- Runbook方針が明確か。
- Runbook詳細、個別画面手順、コマンドに入りすぎていないか。
- Approval Queueと外部実行の運用が明確か。
- Account、Mail、SNS、WordPress、AI、API、Database、Securityの運用がつながっているか。
- OnboardingとOffboardingが定義されているか。
- SchedulerとAutomationの運用境界が明確か。
- MonitoringとAlertの運用が定義されているか。
- BackupとRestoreの運用が定義されているか。
- Secret Rotationの運用方針が定義されているか。
- Incident Responseが初動、封じ込め、復旧、再発防止まで整理されているか。
- Providerや規約変更の確認方針があるか。
- DocumentationとCHANGELOG運用が明確か。
- CodexとClaude Codeの反映運用が安全か。
- KPI取得状態とKPI分析詳細の責任分界が明確か。
- Data Retention、Business Continuity、Training、Quality Reviewが定義されているか。
- Operations Scale Gateが拡張判断に使える内容になっているか。
- Secret実体を含んでいないか。

---

## 57. Architecture Constraints

Operations基盤では、以下の制約を前提とする。

- Secret実体をOperation Logへ記録しない。
- Secret実体をRunbookへ記載しない。
- Secret実体をAI入力へ含めない。
- 未承認外部実行を行わない。
- 重要操作はApproval Gateを通す。
- 高リスク操作はAudit Logへ記録する。
- Production変更は承認制にする。
- Backupなしで高リスク変更を行わない。
- Restoreは承認制にする。
- Automationは停止条件を持つ。
- Schedulerは実行タイミングのみを管理する。
- KPI定義詳細は12章で扱う。
- KPI計算式詳細は12章で扱う。
- Security方針は10章に従う。
- API and OAuth方針は09章に従う。
- Database保存方針は08章に従う。
- 個別Runbook全文を本章に抱え込まない。
- Operations Scale Gateを通過せずに高リスク拡張を行わない。

---

## 58. Risks

本章に関連する主なリスクは以下である。

### 58.1 Risk: 日常確認漏れ

日次、週次、月次確認が実施されず、異常やIncidentを見落とす可能性がある。

軽減策：

- Checklistを用意する。
- Operations Logを記録する。
- Alertを設定する。
- 未確認項目を可視化する。

### 58.2 Risk: 未承認外部実行

承認されていないSNS投稿、WordPress公開、Affiliate Link変更が実行される可能性がある。

軽減策：

- Approval Gateを必須にする。
- Automationの権限を制限する。
- Audit Logを記録する。
- 実行前Checkを行う。

### 58.3 Risk: Incident初動遅れ

Incident発生時に担当者や手順が不明で、対応が遅れる可能性がある。

軽減策：

- Incident Response Flowを定義する。
- Ownerを設定する。
- Escalationを定義する。
- Runbookを整備する。

### 58.4 Risk: BackupやRestore未確認

Backupが取得されていない、またはRestoreできないことに後から気づく可能性がある。

軽減策：

- Backup Checkを定期実施する。
- Restore確認を検討する。
- Backup失敗をAlert化する。
- RestoreをApproval Gateで管理する。

### 58.5 Risk: RegistryとDatabaseの不整合

Registry、Database、外部サービス状態が一致せず、正しい判断ができなくなる可能性がある。

軽減策：

- Consistency Checkを行う。
- Database移行後はDatabaseを正本とする。
- 外部サービス画面を正本として扱わない。
- 不整合修正を記録する。

### 58.6 Risk: Automation暴走

AutomationがRetryを繰り返し、Rate Limit超過や未承認処理につながる可能性がある。

軽減策：

- Retry上限を設定する。
- Stop Conditionを設定する。
- Rate Limitを監視する。
- Manual Stopを用意する。

### 58.7 Risk: Documentation更新漏れ

実運用や設計変更が文書に反映されず、将来の作業で誤判断が発生する可能性がある。

軽減策：

- CHANGELOGを更新する。
- ADRが必要な変更を記録する。
- Markdownを正本とする。
- Codex反映後に確認する。

### 58.8 Risk: Provider変更見落とし

外部サービスの規約、API、認証、料金、機能廃止を見落とす可能性がある。

軽減策：

- Provider Change Reviewを行う。
- 重要Providerの変更を確認する。
- 影響範囲を記録する。
- 必要に応じてRoadmapとADRへ反映する。

### 58.9 Risk: Offboarding漏れ

担当変更や外部委託終了後も権限が残る可能性がある。

軽減策：

- Offboarding Checklistを用意する。
- User、Role、Permissionを棚卸しする。
- Session無効化を検討する。
- Secret Rotation要否を確認する。

### 58.10 Risk: KPI取得状態とKPI分析の混同

11章がKPI定義や分析判断まで抱え込み、12章との責任分界が曖昧になる可能性がある。

軽減策：

- 11章はKPI取得状態、欠損、レポート実行状態までを扱う。
- KPI定義、計算式、ROI、改善判断は12章へ委譲する。

### 58.11 Risk: 11章が手順詳細に入りすぎる

本章が個別サービスの画面操作や詳細Runbook全文を抱え込み、保守しにくくなる可能性がある。

軽減策：

- 本章はOperations方針までを定義する。
- 個別Runbookは下位運用マニュアルへ委譲する。
- 実装詳細は下位実装仕様へ委譲する。
- Secret実体は本章に記載しない。

---

## 59. Required Review Checklist

本章を更新する場合は、以下を確認する。

```text
Required Review Checklist

1. Operations方針が明確か
2. Operations Principlesが定義されているか
3. 07との責任分界が明確か
4. 08との責任分界が明確か
5. 09との責任分界が明確か
6. 10との責任分界が明確か
7. 12との責任分界が明確か
8. Daily Operationsが定義されているか
9. Weekly Operationsが定義されているか
10. Monthly Operationsが定義されているか
11. Quarterly Operationsが定義されているか
12. Runbook方針が定義されているか
13. Approval Operationsが定義されているか
14. Account Operationsが定義されているか
15. Onboarding and Offboarding Operationsが定義されているか
16. Mail Operationsが定義されているか
17. SNS Operationsが定義されているか
18. WordPress Operationsが定義されているか
19. AI Operationsが定義されているか
20. API and OAuth Operationsが定義されているか
21. Database Operationsが定義されているか
22. Security Operationsが定義されているか
23. Scheduler Operationsが定義されているか
24. Automation Operationsが定義されているか
25. Monitoring and Alert Operationsが定義されているか
26. Backup Operationsが定義されているか
27. Restore Operationsが定義されているか
28. Secret Rotation Operationsが定義されているか
29. Incident Response Operationsが定義されているか
30. Provider and Terms Change Operationsが定義されているか
31. Change Managementが定義されているか
32. Documentation Operationsが定義されているか
33. Codex and Claude Code Operationsが定義されているか
34. Scale Gate Operationsが定義されているか
35. KPI定義詳細に入りすぎていないか
36. Runbook詳細に入りすぎていないか
37. Secret実体を本文に含めていないか
38. ADR候補が整理されているか
```

---

## 60. Integration with Other Chapters

本章は、以下の章と連携する。

### 60.1 02 Overall Architecture

Operationsは、Growth Lab Core全体の運用Layerとして関係する。

### 60.2 03 Mail Platform

Mail Account、Forwarding、Gmail通知、Recovery通知の運用に関係する。

### 60.3 04 SNS Platform

SNS Account、投稿、Analytics、Account Warning、停止対応の運用に関係する。

### 60.4 05 WordPress Platform

WordPress記事、LP、Affiliate Link、Site状態、Backupの運用に関係する。

### 60.5 06 AI Platform

AI Output、Prompt、Review、AI Cost、AI Riskの運用に関係する。

### 60.6 07 Growth Lab Core System

Workflow、Approval Gate、Scheduler、Automation、Monitoring、Audit Logの運用に関係する。

### 60.7 08 Database

Operation Log、Audit Log、Incident Record、Review Record、Scale Gate Recordの保存に関係する。

### 60.8 09 API and OAuth

API Error、OAuth失効、Scope、Rate Limit、Webhook、Retryの運用に関係する。

### 60.9 10 Security

Secret、Access Control、Security Incident、Security Review、Security Exceptionの運用に関係する。

### 60.10 12 Analytics and KPI

KPI取得、レポート、ROI、改善判断、運用KPIに関係する。

### 60.11 13 Roadmap

Operations強化、Automation拡大、Scale Stage移行計画に関係する。

### 60.12 14 ADR

Operationsに関する重要な設計判断をADRとして記録する。

---

## 61. Chapter Responsibility Boundary

本章では、Operations基盤の上位設計と運用方針を定義する。

```text
11 Operations
    |
    +-- Defines:
    |       +-- Operations architecture
    |       +-- Operations principles
    |       +-- Operations roles
    |       +-- Daily Operations
    |       +-- Weekly Operations
    |       +-- Monthly Operations
    |       +-- Quarterly Operations
    |       +-- Runbook policy
    |       +-- Approval Operations
    |       +-- Account Operations
    |       +-- Onboarding and Offboarding Operations
    |       +-- Mail Operations
    |       +-- SNS Operations
    |       +-- WordPress Operations
    |       +-- AI Operations
    |       +-- API and OAuth Operations
    |       +-- Database Operations
    |       +-- Security Operations
    |       +-- Scheduler Operations
    |       +-- Automation Operations
    |       +-- Monitoring and Alert Operations
    |       +-- Backup and Restore Operations
    |       +-- Secret Rotation Operations
    |       +-- Incident Response Operations
    |       +-- Provider and Terms Change Operations
    |       +-- Change Management
    |       +-- Documentation Operations
    |       +-- Data Retention and Archive Operations
    |       +-- Business Continuity Operations
    |       +-- Training and Handover Operations
    |       +-- Operations Quality Review
    |       +-- Operations Scale Gate policy
    |
    +-- Does not define:
            +-- Secret実体
            +-- Full individual service manual
            +-- Full Runbook details
            +-- Full API endpoint specification
            +-- Physical database schema
            +-- Security implementation code
            +-- Detailed KPI formula
            +-- ROI analysis details
            +-- Legal judgment final decision
```

具体的な個別Runbookは、下位運用マニュアルで扱う。
KPI定義、計算式、分析、ROI、改善判断は、12章で扱う。
Roadmapは、13章で扱う。

---

## 62. Architecture Decision Records

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
ADR-0090: Security Incident Response Policy
ADR-0091: Security Scale Gate Policy
ADR-0094: Operations Architecture
ADR-0095: Daily Weekly Monthly Operations Policy
ADR-0096: Runbook Management Policy
ADR-0097: Approval Operations Policy
ADR-0098: Incident Response Operations Policy
ADR-0099: Backup and Restore Operations Policy
ADR-0100: Secret Rotation Operations Policy
ADR-0101: Scheduler and Automation Operations Policy
ADR-0102: Documentation and Changelog Operations Policy
ADR-0103: Operations Scale Gate Policy
ADR-0104: Provider and Terms Change Operations Policy
ADR-0105: Onboarding and Offboarding Operations Policy
ADR-0106: Business Continuity Operations Policy
```

以下の判断を変更する場合は、ADR作成を検討する。

- Operations基盤の責任範囲変更
- Daily / Weekly / Monthly Operations方針変更
- Approval運用方針変更
- Incident Response方針変更
- Backup and Restore運用方針変更
- Secret Rotation運用方針変更
- Scheduler運用方針変更
- Automation運用方針変更
- Provider and Terms Change確認方針変更
- Documentation運用方針変更
- Business Continuity方針変更
- Operations Scale Gate方針変更

---
