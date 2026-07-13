# 07 Growth Lab Core System
Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/07_Growth_Lab_Core_System.md
---
## 1. Purpose
本章の目的は、Growth Lab Core本体システムの設計方針を定義することである。
Growth Lab Core Systemは、Mail Platform、SNS Platform、WordPress Platform、AI Platform、
Analytics、KPI、Scheduler、Automation、Database、API、OAuth、Security、Operationsを統合する中
核システムである。
Growth Lab Core Systemは、単なる管理画面ではない。
複数のSNSアカウント、メールアカウント、WordPressサイト、記事、LP、アフィリエイトリンク、AI出
力、Campaign、KPI、運用ログを一元的に管理し、継続改善ループを回すための統合運用OSである。
本章では、以下を定義する。
- Growth Lab Core System全体方針
- System Architecture
- User Interface方針
- API Layer方針
- Application Layer方針
- Domain Module方針
- Registry Management方針
- Workflow Management方針
- Approval Gate方針
- Scheduler方針
- Automation Engine方針
- Integration Layer方針
- Data Access方針
- Audit Log方針
- Monitoring and Alert方針
- Error Handling方針
- Security Boundary
- Configuration and Environment方針
- Local Development方針
- Mock Mode方針
- Deployment Readiness方針
- Scale Architecture
- Growth Lab Core System Scale Gate
- 運用リスクと軽減策
---
## 2. Scope
本章の対象範囲は、Growth Lab Core本体システム全体である。
対象範囲は以下を含む。
- Growth Lab Core System構成
- User Interface
- API Layer
- Application Layer
- Domain Module構成
- Identity Management
- Mail Account Management
- SNS Account Management
- WordPress Site Management
- Campaign Management
- Post Management
- Article Management
- Affiliate Link Management
- Prompt Management
- AI Output Management
- Workflow Management
- Approval Gate
- Scheduler
- Automation Engine
- Integration Layer
- Audit Log
- Monitoring
- Alert
- Error Handling
- Configuration Management
- Local Development
- Mock Mode
- Deployment Readiness
- Growth Lab Core System Scale Gate
本章では、Growth Lab Core本体システムが各PlatformとRegistryをどのように統合して扱うかを定義す
る。
各Platformの詳細方針は、03から06の各章で定義する。
---
## 3. Non-Goals
本章では、以下を対象外とする。
- Next.jsや特定フレームワークの詳細実装
- TypeScriptコード詳細
- Prisma Schemaの物理定義
- PostgreSQLの物理テーブル定義
- Index、Relation、Migrationの詳細
- 個別APIエンドポイント仕様
- 個別OAuthフロー詳細
- Webhook詳細
- 個別SNS API仕様
- WordPress REST API詳細
- AI API詳細
- UIデザインカンプ
- 画面単位の詳細レイアウト
- 本番インフラ構築手順
- Secret管理の具体実装
- サーバー監視ツールの具体設定
- 日次運用手順
- 障害対応の詳細Runbook
- KPI定義や分析指標の詳細
これらは、Database章、API and OAuth章、Security章、Operations章、Analytics and KPI章、または
下位実装仕様で定義する。
---
## 4. Background
Growth Lab Coreは、SNS運用を単独で管理するツールではない。
これまでの章で、以下を定義した。
- Mail Platform
- SNS Platform
- WordPress Platform
- AI Platform
これらを個別に運用すると、以下の問題が発生する。
- メールアカウントとSNSアカウントの紐付けが不明確になる。
- SNS投稿とWordPress記事の関係が追跡できない。
- アフィリエイトリンクとCampaignの関係が不明確になる。
- AI出力の採用、却下、公開、KPIが追跡できない。
- KPIと改善施策が分離する。
- アカウント数が増えると管理が破綻する。
- 人間承認が抜ける。
- 障害や制限時の影響範囲が分からない。
- 仕様書と実装がずれる。
Growth Lab Core Systemは、これらを統合して管理する中核システムである。
初期段階では、20SNSアカウント規模を前提に、Registry、手動確認、半自動運用を中心に構築する。
将来的には、100から500SNSアカウント、複数WordPressサイト、複数Campaign、多数のAI出力、KPIデー
タ、Automationを扱えるように段階的に拡張する。
---
## 5. Alignment with Architecture Principles
本章は、`01_Architecture_Principles.md` で定義した原則に従う。
特に、Growth Lab Core Systemでは以下を重視する。
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
Growth Lab Core Systemにおける優先順位は以下である。
1. 規約遵守
2. セキュリティ
3. 正本管理
4. 人間承認
5. 監査可能性
6. API First
7. 運用安定性
8. 拡張性
9. コスト最適化
10. AI活用
11. 自動化
12. 継続改善
システム実装は、外部サービスの制限、Secret管理、Human Review、Audit Log、Scale Gateを超えて拡張
してはならない。
## 6. System Vision
Growth Lab Core Systemは、SNS運用、WordPressメディア運用、AI活用、KPI改善を統合する運用OSであ
る。
Growth Lab Core System
    |
    +-- Identity Management
    +-- Mail Account Management
    +-- SNS Account Management
    +-- WordPress Site Management
    +-- Campaign Management
    +-- Content Management
    +-- AI Output Management
    +-- Workflow Management
    +-- Approval Gate
    +-- Scheduler
    +-- Automation Engine
    +-- Analytics and KPI
    +-- Monitoring
    +-- Audit Log
基本サイクルは以下である。
Plan
  |
  v
Create
  |
  v
Review
  |
  v
Approve
  |
  v
Publish or Execute
  |
  v
Measure
  |
  v
Analyze
  |
  v
Improve
  |
  v
Record
Growth Lab Core Systemは、すべての操作をこの改善サイクルに接続する。
## 7. Overall System Architecture
Growth Lab Core Systemの全体構成は以下である。
User
  |
  v
User Interface
  |
  v
API Layer
  |
  v
Application Layer
  |
  +-- Domain Modules
  |       +-- Identity Module
  |       +-- Mail Account Module
  |       +-- SNS Account Module
  |       +-- WordPress Module
  |       +-- Campaign Module
  |       +-- Content Module
  |       +-- AI Module
  |       +-- Analytics Module
  |       +-- KPI Module
  |
  +-- Workflow and Approval
  |       +-- Workflow Engine
  |       +-- Approval Gate
  |
  +-- Scheduler and Automation
  |       +-- Scheduler
  |       +-- Automation Engine
  |
  +-- Observability
          +-- Audit Log
          +-- Monitoring
          +-- Alert
Data Layer
  |
  +-- Database
  +-- Log Storage
  +-- Object Storage
  +-- Backup
Integration Layer
  |
  +-- SNS API Adapter
  +-- Mail Adapter
  +-- WordPress Adapter
  +-- AI Adapter
  +-- Analytics Adapter
  +-- Affiliate Adapter
  +-- Google Adapter
Growth Lab Core Systemは、外部サービスを直接Domain Logicへ結合しない。
外部サービス接続はIntegration Layerで分離する。
## 8. System Layers
Growth Lab Core Systemは、以下のレイヤーで構成する。
Layer 1: User Interface Layer
Layer 2: API Layer
Layer 3: Application Layer
Layer 4: Domain Layer
Layer 5: Workflow and Approval Layer
Layer 6: Scheduler and Automation Layer
Layer 7: Integration Layer
Layer 8: Data Layer
Layer 9: Security and Observability Layer
8.1 User Interface Layer
運用担当者、管理者、レビュー担当者が操作する画面を提供する。
8.2 API Layer
UI、外部連携、内部処理からのリクエストを受け取り、認証、認可、入力検証、エラー制御、ログ記録を行
う。
8.3 Application Layer
ユースケース単位の処理を制御する。
8.4 Domain Layer
Identity、Mail Account、SNS Account、WordPress Site、Campaign、Post、Article、AI Output、KPIなど
の業務概念を管理する。
8.5 Workflow and Approval Layer
Human Review、Approval Gate、状態遷移、差し戻し、承認履歴を扱う。
8.6 Scheduler and Automation Layer
定期実行、予約実行、反復作業、Retry、Stop Conditionを扱う。
8.7 Integration Layer
外部サービスとの接続を扱う。
8.8 Data Layer
Database、Log、Object Storage、Backupを扱う。
8.9 Security and Observability Layer
認証、権限、Secret参照、Audit Log、Monitoring、Alertを扱う。
## 9. Responsibility Boundary
Growth Lab Core Systemでは、責任範囲を明確に分離する。
9.1 Growth Lab Core System Responsibilities
Growth Lab Core Systemが責任を持つ範囲は以下である。
管理対象の状態管理
Registry管理
Workflow管理
Approval Gate管理
Scheduler管理
Automation実行管理
外部API接続管理
KPI管理
Audit Log管理
Monitoring管理
Error管理
Change History管理
Scale Gate用データ整理
9.2 External Platform Responsibilities
外部プラットフォームが責任を持つ範囲は以下である。
SNSアカウント実体
SNS投稿実体
SNS API
Mailサービス
Google Workspace
WordPress実体
Hosting環境
AIサービス
Analyticsサービス
Affiliate ASP
外部サービス側の制限や障害
9.3 Human Operator Responsibilities
人間の運用担当者が責任を持つ範囲は以下である。
重要判断
投稿承認
記事承認
LP承認
アフィリエイトリンク利用承認
アカウント作成判断
アカウント停止判断
OAuth権限変更承認
Secret変更承認
Scale Gate Review
ADR承認
9.4 AI Assistant Responsibilities
AI Assistantが支援する範囲は以下である。
下書き作成
分析補助
改善提案
リスク候補抽出
仕様書作成支援
Codex / Claude Code作業指示書作成支援
AI Assistantは、重要判断を単独で確定しない。
9.5 Codex and Claude Code Responsibilities
Codexは、確定済み仕様の反映、ファイル作成、バックアップ、CHANGELOG更新、検証支援を行う。
Claude Codeは、仕様書とADRに基づき、実装、検証、リファクタリング、修正、テスト作成を支援する。
CodexおよびClaude Codeは、上位設計判断を単独で変更しない。
## 10. Orchestration Boundary
Growth Lab Core Systemは、03から06で定義した各Platformを統合するOrchestration Layerとして機能す
る。
Mail Platform
SNS Platform
WordPress Platform
AI Platform
    |
    v
Growth Lab Core System
    |
    +-- State Management
    +-- Workflow
    +-- Approval
    +-- Scheduler
    +-- Automation
    +-- Monitoring
    +-- Audit
本章では、各Platformの詳細方針を再定義しない。
本章では、各Platformで定義されたRegistry、Status、Scale Gate、Risk Level、KPIをGrowth Lab Core
Systemがどのように参照、統合、制御するかを定義する。
## 11. Core System Components
Growth Lab Core Systemは、以下の主要コンポーネントで構成する。
11.1 User Interface
運用担当者が状態確認、レビュー、承認、登録、更新、分析、改善作業を行う画面である。
11.2 API Layer
UIとApplication Layerを接続するAPIである。
11.3 Domain Modules
業務領域ごとの管理機能である。
11.4 Workflow Engine
レビュー、承認、公開、実行、測定、改善の状態遷移を管理する。
11.5 Approval Gate
人間承認が必要な処理を制御する。
11.6 Scheduler
定期実行、予約実行、KPI取得、状態確認、レポート生成を管理する。
11.7 Automation Engine
反復作業を安全条件付きで実行する。
11.8 Integration Layer
外部サービスとの接続を管理する。
11.9 Data Access Layer
DatabaseまたはRegistryへの読み書きを管理する。
11.10 Audit Log
重要操作、状態変更、承認、外部API利用を記録する。
11.11 Monitoring and Alert
異常、失敗、未処理、制限、認証失敗、コスト急増を検知する。
## 12. User Interface Policy
User Interfaceは、Growth Lab Core Systemの運用状態を人間が理解し、判断し、承認できるように設計す
る。
12.1 UI Principles
UI方針は以下である。
状態が分かりやすいこと。
未処理、承認待ち、警告、失敗が分かること。
関連データへ移動しやすいこと。
重要操作の前に確認があること。
誤操作を防止すること。
AI出力と人間承認の状態が分かること。
KPIと改善対象が分かること。
影響範囲が分かること。
12.2 Primary Screens
初期候補画面は以下である。
Dashboard
Identity List
Mail Account List
SNS Account List
WordPress Site List
Article List
Campaign List
Post List
Affiliate Link List
AI Output List
Approval Queue
Scheduler Status
Automation Status
KPI Dashboard
Error and Alert List
Audit Log Viewer
Settings
12.3 Dashboard
Dashboardでは、以下を確認できるようにする。
SNSアカウント状態
Mail Account状態
WordPressサイト状態
投稿予定
承認待ち
AI出力未レビュー
KPI概要
エラー
アラート
Scale Gate関連指標
詳細なUIデザイン、画面レイアウト、コンポーネント設計は、下位実装仕様で定義する。
## 13. API Layer Policy
API Layerは、UI、内部処理、外部連携からの要求を安全に処理する。
13.1 API Responsibilities
API Layerの責任は以下である。
入力検証
認証確認
認可確認
Rate Limit考慮
Application Layer呼び出し
エラー整形
Audit Log記録
安全なレスポンス返却
13.2 API Rules
API設計では以下を守る。
Secretをレスポンスに含めない。
不要な個人情報や機密情報を返さない。
重要操作には権限確認を行う。
状態変更にはAudit Logを残す。
外部API呼び出し結果を安全に扱う。
失敗時に原因を記録する。
ユーザー向けエラーと内部ログを分ける。
13.3 API Boundary
個別APIエンドポイント、リクエスト形式、レスポンス形式、OAuthフロー、Webhook、Token、Scope、
Rate Limitの詳細は、09_API_OAuth.md で定義する。
## 14. Application Layer Policy
Application Layerは、Growth Lab Coreのユースケースを制御する。
14.1 Application Responsibilities
Application Layerの責任は以下である。
Use Case実行
Domain Module連携
Workflow起動
Approval状態確認
Scheduler登録
Automation起動可否判断
KPI更新
Audit Log出力
Error Handling
14.2 Application Rules
Application Layerでは、以下を守る。
Domainの状態遷移を無視しない。
Approval Gateを回避しない。
Secret実体を扱う場合はSecurity方針に従う。
外部サービス接続はIntegration Layer経由にする。
Database直接操作を分散させない。
失敗時は状態とログを残す。
冪等性が必要な処理は重複実行を防止する。
## 15. Domain Module Overview
Growth Lab Core Systemは、複数のDomain Moduleで構成する。
Domain Modules
    |
    +-- Identity Management
    +-- Mail Account Management
    +-- SNS Account Management
    +-- WordPress Site Management
    +-- Article Management
    +-- Landing Page Management
    +-- Affiliate Link Management
    +-- Campaign Management
    +-- Post Management
    +-- Prompt Management
    +-- AI Output Management
    +-- Analytics Management
    +-- KPI Management
    +-- Workflow Management
    +-- Audit Management
各Domain Moduleは、自分の責任範囲を持つ。
他Moduleの内部状態を直接変更せず、Application Layerまたは明示されたServiceを通じて連携する。
16. Identity Management Module
Identity Managementは、Growth Lab Coreにおけるアカウント運用単位を管理する。
16.1 Responsibilities
責任範囲は以下である。
Identity作成
Identity状態管理
Mail Accountとの紐付け
SNS Accountとの紐付け
WordPress関連情報との紐付け
Risk Level管理
Operation History管理
16.2 Identity States
Identity状態は以下を基本とする。
Planned
Prepared
Active
Warning
Limited
Suspended
Retired
Deleted
16.3 Rules
ルールは以下である。
IdentityはMail Account、SNS Account、Campaign管理の中核として扱う。
未登録Identityを本番運用しない。
状態変更時は履歴を残す。
リスクが高いIdentityはAutomation対象から除外する。
Identity中心設計の全体方針は、02_Overall_Architecture.md と関連ADRで扱う。
17. Mail Account Management Module
Mail Account Managementは、03 Mail Platformで定義したMail Account Registryをシステム上で扱う機能で
ある。
17.1 Responsibilities
責任範囲は以下である。
Mail Account参照
Mail Account状態管理
Identityとの紐付け確認
SNS Accountとの紐付け確認
通知確認状態管理
復旧情報参照先管理
Risk Level管理
Mail Scale Gate用データ提供
17.2 Boundary
メールアカウントの詳細設計、転送、復旧、Gmail、Google Workspace、独自ドメインメール、Mail Scale
Gateの詳細は、03_Mail_Platform.md で定義する。
本章では、Growth Lab Core SystemがMail Account情報をどう参照、統合、状態管理するかを定義する。
18. SNS Account Management Module
SNS Account Managementは、04 SNS Platformで定義したSNS Account Registryをシステム上で扱う機能で
ある。
18.1 Responsibilities
責任範囲は以下である。
SNS Account参照
SNS Account状態管理
Identityとの紐付け確認
Mail Accountとの紐付け確認
Posting Method管理
OAuth接続状態管理
Risk Level管理
SNS Scale Gate用データ提供
18.2 Boundary
SNS Account作成方針、Publishing、SNS Scale Gate、SNSごとの運用方針は、04_SNS_Platform.md で定
義する。
本章では、Growth Lab Core SystemがSNS Account情報をどう参照、統合、状態管理するかを定義する。
19. WordPress Management Module
WordPress Managementは、05 WordPress Platformで定義したWordPress Site Registry、Article
Registry、Affiliate Link Registryをシステム上で扱う機能である。
19.1 Responsibilities
責任範囲は以下である。
WordPress Site参照
Article参照
Landing Page参照
Affiliate Link参照
SNS Accountとの導線確認
Campaignとの紐付け確認
WordPress REST API連携状態確認
WordPress Scale Gate用データ提供
19.2 Boundary
WordPressサイト、Article、LP、Affiliate Link、SEO、バックアップ、WordPress Scale Gateの詳細は、
05_WordPress_Platform.md で定義する。
本章では、Growth Lab Core SystemがWordPress情報をどう参照、統合、状態管理するかを定義する。
20. Campaign Management Module
Campaign Managementは、SNS、WordPress、Affiliate Link、AI Output、KPIをまとめる単位である。
20.1 Responsibilities
責任範囲は以下である。
Campaign作成
Campaign状態管理
SNS Account紐付け
Post紐付け
Article紐付け
Landing Page紐付け
Affiliate Link紐付け
KPI紐付け
AI Output紐付け
Cost管理
Result管理
20.2 Campaign States
Campaign状態は以下を基本とする。
Planned
Drafting
Reviewing
Approved
Active
Measuring
Improving
Paused
Completed
Archived
20.3 Campaign Rules
ルールは以下である。
Campaignには目的を設定する。
期間を設定する。
KPIを設定する。
関連SNS Accountを記録する。
関連WordPress ArticleまたはLPを記録する。
関連Affiliate Linkを記録する。
結果を記録する。
改善履歴を残す。
KPI定義、分析指標、ROI、成果判断の詳細は、12_Analytics_KPI.md で定義する。
21. Content Management Module
Content Managementは、SNS投稿、WordPress記事、LP、AI出力を横断的に扱う。
21.1 Content Types
管理対象は以下である。
SNS Post
WordPress Article
Landing Page
Image Idea
Video Script
AI Output
Campaign Material
21.2 Content States
コンテンツ状態は以下を基本とする。
Planned
AI Proposed
Drafted
Needs Review
Approved
Scheduled
Published
Measured
Improved
Archived
Deleted
21.3 Rules
ルールは以下である。
外部公開前にApproval Gateを通す。
AI生成物はAI Output Registryと紐付ける。
SNS投稿はSNS Accountと紐付ける。
WordPress記事はArticle Registryと紐付ける。
Campaign対象の場合はCampaign IDを記録する。
公開後はKPIと紐付ける。
SNS投稿の詳細は04章、WordPress記事とLPの詳細は05章、AI出力の詳細は06章で定義する。
22. AI Management Module
AI Managementは、06 AI Platformで定義したPrompt Registry、AI Output Registry、Human Review
Workflowをシステム上で扱う機能である。
22.1 Responsibilities
責任範囲は以下である。
Prompt参照
AI Output参照
AI出力状態管理
Human Review状態管理
Approval状態管理
AI Cost記録
AI Risk Level管理
SNS / WordPress / Campaign / KPIとの紐付け
AI Scale Gate用データ提供
22.2 Boundary
AIの役割、Prompt Management、AI Output Registry、Human Review、AI Scale Gateの詳細は、
06_AI_Platform.md で定義する。
本章では、Growth Lab Core SystemがAI出力とAIワークフローをどう参照、統合、状態管理するかを定義す
る。
## 23. Workflow Management
Workflow Managementは、各業務の状態遷移を管理する。
23.1 Workflow Types
主なWorkflowは以下である。
SNS Post Workflow
WordPress Article Workflow
Landing Page Workflow
AI Output Review Workflow
Campaign Workflow
Account Review Workflow
Incident Workflow
Scale Gate Workflow
23.2 Standard Workflow
標準ワークフローは以下である。
Draft
  |
  v
Review
  |
  v
Approved
  |
  v
Scheduled or Executed
  |
  v
Measured
  |
  v
Improved
  |
  v
Archived
23.3 Workflow Rules
ルールは以下である。
重要処理はReviewを省略しない。
Approval前に外部公開しない。
状態変更時は履歴を残す。
失敗時はError状態を記録する。
手動差し戻しを可能にする。
Rejected状態を記録する。
Archived状態を持たせる。
詳細な運用フロー、担当者、日次手順、Runbookは、11_Operations.md で定義する。
## 24. Approval Gate Policy
Approval Gateは、人間承認が必要な処理を制御する。
24.1 Approval Required Cases
以下はApproval Gateを必須とする。
SNS投稿公開
WordPress記事公開
LP公開
アフィリエイトリンク掲載
AI生成物の外部公開
OAuth権限変更
Secret変更
セキュリティ設定変更
アカウント作成
アカウント削除
Automation範囲拡大
大量投稿
大量記事公開
Scale Stage移行
24.2 Approval Records
承認時は以下を記録する。
Approval ID
Target Type
Target ID
Requested By
Reviewed By
Approved By
Status
Comment
Created Date
Reviewed Date
Approved Date
Change History
24.3 Approval Rules
ルールは以下である。
承認者を記録する。
承認対象を明確にする。
承認範囲を明確にする。
承認前に実行しない。
承認後でも状況変化があれば再確認する。
高リスク処理は追加承認を行う。
## 25. Scheduler Policy
Schedulerは、定期処理、予約処理、確認処理を起動する仕組みである。
25.1 Scheduler Role
Schedulerは、処理を「いつ起動するか」を管理する。
処理の中身や外部実行可否は、Application Layer、Workflow、Approval Gate、Automation Engineが判断
する。
25.2 Scheduler Use Cases
主な用途は以下である。
SNS投稿予約の起動
KPI取得の起動
Analytics取得の起動
Mail状態確認の起動
SNS Account状態確認の起動
WordPress状態確認の起動
Affiliate Link確認の起動
AI Output未レビュー確認の起動
Backup確認の起動
Report生成の起動
Scale Gate指標取得の起動
25.3 Scheduler Rules
ルールは以下である。
実行条件を明確にする。
実行時刻を記録する。
実行結果を記録する。
失敗時はError Logを残す。
リトライ制限を設ける。
外部API制限を考慮する。
認証失敗時は自動継続しない。
手動停止できるようにする。
## 26. Automation Engine Policy
Automation Engineは、反復作業を安全条件付きで実行する。
26.1 Automation Role
Automation Engineは、処理を「どの条件で、どの範囲まで実行するか」を管理する。
Schedulerは起動タイミングを管理し、Automation Engineは実行条件、停止条件、承認条件、エラー処理を
管理する。
26.2 Automation Use Cases
自動化候補は以下である。
KPI取得
投稿結果取得
リンク切れ確認
OAuth状態確認
WordPress稼働確認
AI Output未レビュー通知
レポート生成
低成果候補抽出
Scale Gate指標集計
Backup確認
26.3 Automation Boundary
Automation Engineは、以下を単独で行わない。
未承認SNS投稿公開
未承認WordPress記事公開
未承認LP公開
未承認アフィリエイトリンク変更
未承認OAuth権限変更
未承認Secret変更
未承認アカウント削除
未承認大量投稿
未承認大量記事公開
26.4 Required Safeguards
Automation Engineには以下を持たせる。
実行条件
停止条件
リトライ制限
レート制限考慮
エラー処理
手動停止
実行ログ
Audit Log
Human Approval条件
詳細な自動化Runbook、運用担当、通知先、手動復旧手順は、11_Operations.md で定義する。
## 27. Integration Layer Policy
Integration Layerは、外部サービスとの接続を分離する。
27.1 Integration Adapters
主なAdapterは以下である。
SNS API Adapter
Mail Adapter
Google Workspace Adapter
Gmail Adapter
WordPress REST API Adapter
AI API Adapter
Analytics Adapter
Search Console Adapter
Affiliate ASP Adapter
Notification Adapter
27.2 Integration Rules
ルールは以下である。
公式APIを優先する。
OAuthが必要な場合はOAuthを使用する。
API KeyやTokenを平文保存しない。
Provider固有処理をAdapter内に閉じ込める。
Domain LogicをProvider仕様に依存させすぎない。
Rate Limitを考慮する。
Error Responseを記録する。
Mock Modeを用意する。
27.3 Boundary
外部API、OAuth、Webhook、Token、Scope、Rate Limit、Retry Policyの詳細は、09_API_OAuth.md で定
義する。
## 28. Data Access Policy
Growth Lab Core Systemは、正本データをRegistryまたはDatabaseで管理する。
28.1 Data Access Rules
データアクセスのルールは以下である。
Database操作は管理されたData Access Layer経由にする。
Domain Moduleごとの所有責任を明確にする。
Secret実体を通常テーブルに保存しない。
変更履歴を必要に応じて残す。
削除は慎重に扱う。
Archived状態を優先する。
MigrationはDatabase章に従う。
28.2 Initial Registry Mode
初期段階では、以下のRegistryがGoogle SheetsまたはMarkdown台帳として存在する可能性がある。
Mail Account Registry
SNS Account Registry
WordPress Site Registry
Article Registry
Affiliate Link Registry
Prompt Registry
AI Output Registry
Growth Lab Core Systemは、将来的にこれらをDatabaseへ移行できるように設計する。
28.3 Registry to Database Boundary
本章では、RegistryからDatabaseへ移行できる設計方針を定義する。
物理テーブル、Prisma Schema、Migration、Index、Relation、制約、整合性検証の詳細は、
08_Database.md で定義する。
## 29. Audit Log Policy
Audit Logは、重要操作と状態変更を追跡するために必須である。
29.1 Audit Targets
記録対象は以下である。
Account作成
Account状態変更
Mail Account紐付け変更
SNS Account紐付け変更
WordPress Site変更
Article公開
LP公開
Affiliate Link変更
AI Output承認
Campaign状態変更
OAuth接続変更
Secret参照または変更
Automation実行
Scheduler実行
Scale Gate Review
Incident対応
29.2 Audit Fields
Audit Logには以下を記録する。
Audit Log ID
Actor
Actor Role
Action
Target Type
Target ID
Before State
After State
Reason
Result
Timestamp
Related Workflow ID
Related Approval ID
Related Incident ID
29.3 Audit Rules
ルールは以下である。
重要操作はAudit Logを残す。
Secret実体をAudit Logに残さない。
失敗した操作も記録する。
自動実行と人間実行を区別する。
AI提案と人間承認を区別する。
Audit Logの保存方式、保持期間、閲覧権限、改ざん防止の詳細は、10_Security.md と 11_Operations.md
で定義する。
## 30. Monitoring and Alert Policy
Monitoringは、システム状態、外部連携状態、未処理、失敗、リスクを可視化する。
30.1 Monitoring Targets
監視対象は以下である。
System Health
API Error
OAuth Error
Scheduler Status
Automation Status
Mail Status
SNS Account Status
WordPress Status
AI API Status
Analytics Collection Status
KPI Freshness
Approval Queue
Unreviewed AI Output
High Risk Items
Cost Spike
Incident Status
30.2 Alert Conditions
通知または確認対象は以下である。
API接続失敗
OAuth失効
投稿失敗
KPI取得失敗
WordPress停止
Mail通知不達
AI API失敗
未レビューAI出力の滞留
高リスク状態
Automation連続失敗
Cost急増
Secret混入疑い
30.3 Boundary
監視ツール、通知先、アラート詳細条件、運用手順、担当者、対応SLAは、11_Operations.md で定義する。
## 31. Error Handling Policy
Growth Lab Core Systemは、外部サービス依存を前提に、失敗を通常状態として扱う。
31.1 Error Types
想定するエラーは以下である。
Validation Error
Permission Error
Authentication Error
OAuth Error
API Error
Rate Limit Error
Network Error
Scheduler Error
Automation Error
Database Error
AI Error
WordPress Error
SNS Error
Mail Error
31.2 Error Handling Rules
ルールは以下である。
エラーを握りつぶさない。
Error Logを残す。
ユーザー向けメッセージと内部ログを分ける。
認証失敗時は自動処理を止める。
Rate Limit時はリトライを制限する。
影響範囲を記録する。
必要に応じてIncidentを作成する。
復旧後に状態を更新する。
詳細なIncident対応手順とRunbookは、11_Operations.md で定義する。
## 32. Security Boundary
Growth Lab Core Systemは、Security by Designを前提とする。
32.1 Protected Data
保護対象は以下である。
Password
API Key
OAuth Token
Refresh Token
Client Secret
TOTP Secret
Recovery Code
Session
Cookie
Database Credential
SMTP Credential
WordPress Application Password
Hosting Credential
32.2 Security Rules
ルールは以下である。
Secret実体を通常ログに残さない。
Secret実体をMarkdownに書かない。
Secret実体を通常DBテーブルに平文保存しない。
権限は最小権限にする。
重要操作には権限確認を行う。
AI入力にSecretを含めない。
外部API接続は認証情報を安全に扱う。
監査ログを残す。
32.3 Boundary
Secret管理、権限、認証、セッション、2FA、TOTP、Recovery、Access Control、Security Incidentの詳細
は、10_Security.md で定義する。
## 33. Configuration and Environment Policy
Growth Lab Core Systemは、環境ごとに設定を分離する。
33.1 Environment Types
想定環境は以下である。
Local
Development
Staging
Production
初期段階ではLocal Developmentを中心に構築する。
33.2 Configuration Rules
設定管理のルールは以下である。
.env は実行環境設定として扱う。
.env.example には安全な仮値のみ記載する。
Secret実体をGit管理しない。
環境ごとに外部API接続を分離する。
Mock Modeを用意する。
本番接続は明示的に切り替える。
誤って本番実行しないようにする。
33.3 Environment Boundary
環境変数、Secret参照、環境分離、Access Controlの詳細は、10_Security.md と下位実装仕様で定義する。
## 34. Mock Mode Policy
Mock Modeでは、外部サービスに実際の変更を行わずに動作確認できるようにする。
34.1 Mock Targets
対象候補は以下である。
SNS API
WordPress REST API
AI API
Analytics API
Affiliate API
Mail Adapter
Notification Adapter
34.2 Mock Mode Rules
ルールは以下である。
初期開発ではMock Modeを優先する。
本番外部サービスへ誤送信しない。
Mock結果と実API結果を混同しない。
Mockデータであることを明示する。
本番切り替え時は承認を必要とする。
本番切り替え履歴を残す。
## 35. Local Development Policy
初期開発はLocal Firstで行う。
35.1 Initial Development Environment
初期候補は以下である。
VSCode
Codex
Claude Code
Next.js
TypeScript
PostgreSQL
Prisma
Docker-compatible database setup
.env
Mock Mode
35.2 Local Development Rules
ルールは以下である。
本番APIを不用意に呼び出さない。
Mock Modeを優先する。
Secretをソースに含めない。
Migrationは検証してから反映する。
テストデータと本番データを混在させない。
仕様書にない上位判断を実装で先行しない。
実装変更が仕様に影響する場合は仕様書またはADRを更新する。
詳細な開発環境構築手順は、下位実装仕様で定義する。
36. Deployment Readiness Policy
Growth Lab Core Systemは、将来的なStagingおよびProduction展開を見据えて設計する。
36.1 Readiness Items
本番展開前に確認すべき項目は以下である。
Security Review
Secret Management
Access Control
Database Backup
Audit Log
Monitoring
Error Handling
Rate Limit Handling
Approval Gate
Rollback Plan
Incident Response
Cost Monitoring
Terms Compliance
36.2 Production Restrictions
本番環境では以下を禁止する。
Secretの平文保存
未承認外部公開
無制限Automation
無制限Retry
Debug情報の外部表示
本番DBへの手動直接変更
Audit Logなしの重要操作
Approval Gate回避
本番展開の詳細、インフラ、監視、バックアップ、権限、リリース手順は、Security章、Operations章、
Database章、下位実装仕様で定義する。
## 37. System Data Model Overview
Growth Lab Core Systemの論理データモデルは以下である。
Growth Lab Core
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
    +-- KPI
    +-- Analytics
    +-- Audit Log
    +-- Incident
関係の概要は以下である。
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
物理データベース設計は、08_Database.md で定義する。
## 38. Scale Architecture
Growth Lab Core Systemは、運用規模に応じて段階的に拡張する。
38.1 Scale Stages
Stage 1: 20SNSアカウント前後の初期統合管理
Stage 2: 21から50SNSアカウントと複数Campaign管理
Stage 3: 51から100SNSアカウントとDatabase中心管理
Stage 4: 101から300SNSアカウントとAutomation強化
Stage 5: 301から500SNSアカウントと本格運用OS化
38.2 Stage 1
初期段階では、以下を基本とする。
Registry中心管理
手動レビュー
手動承認
手動KPI確認
基本Dashboard
基本Audit Log
Mock Mode
最小限Automation
38.3 Stage 2
以下を追加検討する。
Approval Queue
Scheduler強化
KPI Dashboard
Error List
Registry整合チェック
Campaign管理強化
38.4 Stage 3
以下を追加検討する。
Database中心管理
Domain Module強化
Workflow Engine
Automation Engine
Integration Adapter強化
Audit Log強化
Monitoring強化
38.5 Stage 4
以下を追加検討する。
Queue
Worker
高度なAutomation
Cost Monitoring
Alert
Role-based Access Control
Scale Gate Dashboard
38.6 Stage 5
以下を追加検討する。
本格的な運用OS
高度な監査
複数メディアポートフォリオ管理
大規模KPI分析
AI改善ループ高度化
自動棚卸し
高度な権限分離
## 39. Growth Lab Core System Scale Gate
次のSystem Stageへ進む前に、Growth Lab Core System Scale Gate Reviewを行う。
Growth Lab Core System Scale Gate Review
1. 現在のSNSアカウント数
2. 現在のMail Account数
3. 現在のWordPressサイト数
4. 現在のCampaign数
5. 現在の記事数
6. 現在のAI出力数
7. Registry更新状況
8. Database移行状況
9. Approval待ち件数
10. 未レビューAI出力数
11. Scheduler成功率
12. Automation成功率
13. APIエラー状況
14. OAuth状態
15. KPI取得状況
16. Audit Log記録状況
17. Monitoring状態
18. Security状態
19. 運用担当者の負荷
20. コスト
21. 次Stageへ進む必要性
Growth Lab Core System Scale Gateを通過できない場合は、機能追加やアカウント拡張を行わず、既存運用、Registry、
Workflow、KPI、Security、Monitoringの改善を優先する。
Growth Lab Core System Scale Gateは、Mail Scale Gate、SNS Scale Gate、WordPress Scale Gate、AI Scale Gateを置き換えるものではない。
各PlatformのScale Gate結果を統合し、Growth Lab Core System全体として次Stageへ進むかを判断するた
めの上位レビューである。
40. Operations Policy
Growth Lab Core Systemの日常運用では、状態、承認、エラー、KPI、改善を継続確認する。
40.1 Regular Checks
定期確認項目は以下である。
Dashboard確認
Approval Queue確認
Error確認
Alert確認
Registry更新状況
Scheduler実行状況
Automation実行状況
KPI取得状況
AI Output未レビュー
SNS Account状態
WordPress状態
Mail通知状態
Audit Log異常
Security状態
40.2 Change Management
以下の変更は記録する。
Domain Module追加
Workflow変更
Approval条件変更
Automation条件変更
Integration Adapter変更
Database Migration
Security設定変更
UI重要変更
Scale Stage変更
外部API接続変更
40.3 Maintenance
保守対象は以下である。
仕様書更新
ADR更新
CHANGELOG更新
Backup確認
Dependency確認
Security確認
API仕様変更確認
Error Log確認
古いRegistry整理
Archive処理
詳細な運用手順、担当者、頻度、Runbookは、11_Operations.md で定義する。
41. Incident Handling
Growth Lab Core Systemで異常が発生した場合、以下の流れで対応する。
Detect
  |
  v
Identify Affected Module
  |
  v
Identify Related Entity
  |
  v
Check Impact Scope
  |
  v
Stop Automation if Needed
  |
  v
Mitigate
  |
  v
Record Incident
  |
  v
Update Status
  |
  v
Prevent Recurrence
41.1 Common Incidents
想定される異常は以下である。
API接続失敗
OAuth失効
Scheduler失敗
Automation連続失敗
Database接続失敗
AI API失敗
WordPress API失敗
SNS API失敗
Mail通知不達
KPI取得失敗
Approval漏れ
無承認実行疑い
Secret混入疑い
Registry不整合
仕様書と実装の不整合
41.2 Incident Records
障害対応では、以下を記録する。
Incident ID
Detected Date
Detected By
Affected Module
Affected Entity
Severity
Description
Cause
Action Taken
Recovery Result
Preventive Action
Owner
Status
Change History
詳細なIncident Response手順は、11_Operations.md で定義する。
## 42. Integration with Other Chapters
本章は、以下の章と連携する。
42.1 02 Overall Architecture
Growth Lab Core Systemは、全体アーキテクチャで定義されたApplication Layer、Integration Layer、AI
and Automation Layer、Data Layerの中心である。
42.2 03 Mail Platform
Mail Account、通知、復旧、メール基盤との連携を扱う。
メール基盤の詳細は03 Mail Platformで定義する。
42.3 04 SNS Platform
SNS Account、Posting、SNS Scale Gate、SNS API連携を扱う。
SNS基盤の詳細は04 SNS Platformで定義する。
42.4 05 WordPress Platform
WordPress Site、Article、LP、Affiliate Link、WordPress REST API連携を扱う。
WordPress基盤の詳細は05 WordPress Platformで定義する。
42.5 06 AI Platform
Prompt、AI Output、Human Review、AI Scale Gateを扱う。
AI基盤の詳細は06 AI Platformで定義する。
42.6 08 Database
Domain Model、Registry移行、Prisma Schema、Migration、Data Integrityを扱う。
本章では論理的なSystem Data Modelまでを扱い、物理データベース設計は08章で定義する。
42.7 09 API and OAuth
API設計、OAuth、Token、Webhook、Rate Limit、外部接続を扱う。
本章ではAPI Layer方針までを扱い、個別API仕様は09章で定義する。
42.8 10 Security
認証、認可、Secret、Access Control、Audit、Security Incidentを扱う。
本章ではSecurity Boundaryまでを扱い、詳細なセキュリティ設計は10章で定義する。
42.9 11 Operations
日常運用、障害対応、保守、Runbook、手動手順を扱う。
本章ではOperations Policyまでを扱い、具体的な運用手順は11章で定義する。
42.10 12 Analytics and KPI
KPI設計、分析、レポート、改善判断、ROIを扱う。
本章ではKPI連携方針までを扱い、詳細な指標定義と分析設計は12章で定義する。
42.11 13 Roadmap
段階的な実装、運用拡張、Growth Lab Core System Scale Gate後の拡張計画を扱う。
42.12 14 ADR
本章で定義した重要なシステム判断をADRとして記録、参照、更新する。
## 43. Chapter Responsibility Boundary
本章では、Growth Lab Core本体システムの上位設計を定義する。
詳細設計は、以下の章または下位文書で定義する。
07 Growth Lab Core System
    |
    +-- Defines:
    |       +-- Core system architecture
    |       +-- Orchestration boundary
    |       +-- UI policy
    |       +-- API Layer policy
    |       +-- Application Layer policy
    |       +-- Domain Module policy
    |       +-- Workflow policy
    |       +-- Approval Gate policy
    |       +-- Scheduler policy
    |       +-- Automation Engine policy
    |       +-- Integration Layer policy
    |       +-- Data Access policy
    |       +-- Audit Log policy
    |       +-- Monitoring policy
    |       +-- Growth Lab Core System Scale Gate policy
    |
    +-- Does not define:
            +-- Physical database tables
            +-- Prisma Schema
            +-- Detailed API endpoints
            +-- Detailed OAuth flow
            +-- Detailed UI design
            +-- Detailed operation runbook
            +-- Detailed security implementation
            +-- Provider-specific API details
            +-- Detailed KPI formula
詳細な手順は、Database章、API and OAuth章、Security章、Operations章、Analytics and KPI章、実装仕
様、運用マニュアルで定義する。
## 44. Architecture Constraints
Growth Lab Core Systemでは、以下の制約を前提とする。
Markdown仕様書を正本とする。
RegistryまたはDatabaseを運用データの正本とする。
外部サービス管理画面を正本として扱わない。
Secretを平文保存しない。
AIに重要判断を単独で任せない。
Automationに未承認外部実行をさせない。
Approval Gateを回避しない。
公式APIを優先する。
外部サービス接続はIntegration Layer経由にする。
Domain Moduleの責任範囲を分離する。
Audit Logを重要操作に残す。
Monitoringを初期段階から設計する。
Mock Modeを用意する。
Scale Gateを通過せずに大規模化しない。
仕様変更が必要な場合はADRを検討する。
## 45. Risks
本章に関連する主なリスクは以下である。
45.1 Risk: システム責任範囲の肥大化
Growth Lab Core Systemがすべての詳細を抱え込み、各章との責任分界が不明確になる可能性がある。
軽減策：
本章は本体システムの上位設計に限定する。
詳細は下位章へ委譲する。
Chapter Responsibility Boundaryを維持する。
45.2 Risk: RegistryとDatabaseの不整合
初期Registryと将来Databaseの間で不整合が発生する可能性がある。
軽減策：
Single Source of Truthを明確にする。
移行時に移行手順を定義する。
更新履歴を残す。
Database章で物理設計を定義する。
45.3 Risk: Approval Gate回避
承認が必要な処理が承認なしに実行される可能性がある。
軽減策：
WorkflowでApproval状態を管理する。
重要処理はApproval IDを要求する。
Audit Logを残す。
Alertを設定する。
45.4 Risk: Automation暴走
Automationが誤った処理を繰り返す可能性がある。
軽減策：
Stop Conditionを定義する。
Retry Limitを設定する。
手動停止を用意する。
Automation Logを記録する。
高リスク処理は人間承認を必須にする。
45.5 Risk: 外部API変更
SNS、WordPress、AI、Analytics、AffiliateなどのAPI変更により、連携が失敗する可能性がある。
軽減策：
Integration Layerで分離する。
API Errorを監視する。
Mock Modeを用意する。
変更時はADRまたは仕様更新を行う。
45.6 Risk: Secret漏洩
Secretがログ、DB、Markdown、AI入力、エラー表示に混入する可能性がある。
軽減策：
Security章に従う。
Secretを通常ログに出さない。
AI入力にSecretを含めない。
.envやSecret Storeを適切に扱う。
45.7 Risk: 仕様書と実装の乖離
実装が進む一方で、仕様書やADRが更新されない可能性がある。
軽減策：
実装完了時に仕様更新要否を確認する。
CHANGELOGを更新する。
ADRが必要な変更を記録する。
Codex / Claude Code作業指示に検証項目を入れる。
45.8 Risk: 運用担当者の負荷増大
管理対象が増え、手動レビュー、承認、KPI確認が追いつかなくなる可能性がある。
軽減策：
Dashboardを整備する。
Approval Queueを整備する。
Automationを安全に導入する。
Scale Gateで負荷を確認する。
低成果対象を整理する。
45.9 Risk: 下位章との設計重複
07章がDatabase、API、Security、Operations、Analyticsの詳細に入り込み、下位章と重複する可能性があ
る。
軽減策：
07章は統合方針と本体システム境界に限定する。
08から12章へ詳細を委譲する。
章間責任分界をレビューする。
## 46. Required Review Checklist
本章またはGrowth Lab Core Systemを更新する場合は、以下を確認する。
Growth Lab Core System Review Checklist
1. Growth Lab Core Systemの全体方針が明確か
2. Mail / SNS / WordPress / AIとの接続が明確か
3. Orchestration Boundaryが明確か
4. User Interface方針が定義されているか
5. API Layer方針が定義されているか
6. Application Layer方針が定義されているか
7. Domain Module構成が定義されているか
8. Registry Management方針が定義されているか
9. Workflow Management方針が定義されているか
10. Approval Gate方針が定義されているか
11. Scheduler方針が定義されているか
12. Automation Engine方針が定義されているか
13. SchedulerとAutomation Engineの責任分界が明確か
14. Integration Layer方針が定義されているか
15. Data Access方針が定義されているか
16. Audit Log方針が定義されているか
17. Monitoring and Alert方針が定義されているか
18. Error Handling方針が定義されているか
19. Security Boundaryが定義されているか
20. Local Development方針が定義されているか
21. Mock Mode方針が定義されているか
22. Growth Lab Core System Scale Gateが定義されているか
23. 08 Databaseへ物理設計を委譲できているか
24. 09 API and OAuthへAPI詳細を委譲できているか
25. 10 SecurityへSecurity詳細を委譲できているか
26. 11 OperationsへRunbookを委譲できているか
27. 12 Analytics and KPIへKPI詳細を委譲できているか
28. ADRが必要な判断が整理されているか
## 47. Review Points
本章のレビューでは、以下を確認する。
Growth Lab Core Systemが統合運用OSとして定義されているか。
03 Mail Platform、04 SNS Platform、05 WordPress Platform、06 AI Platformを統合できているか。
本章が詳細実装に入りすぎていないか。
Orchestration Boundaryが明確か。
Domain Moduleの責任範囲が明確か。
WorkflowとApproval Gateが明確か。
SchedulerとAutomation Engineの境界が明確か。
外部サービス連携がIntegration Layerで分離されているか。
Data Access方針が08 Databaseと矛盾しないか。
API Layer方針が09 API and OAuthと矛盾しないか。
SecretやSecurityの詳細を10章へ委譲できているか。
Operations詳細を11章へ委譲できているか。
KPI詳細を12章へ委譲できているか。
Scale Gateが大規模化判断に使えるか。
Codex反映時に章構成が崩れにくい構成になっているか。
## 48. Architecture Decision Records
本章に関連するADRは以下の通りである。
Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core

本章に関連して、今後追加が想定されるADRは以下である。

```text
ADR-0005: Core Architecture Principles
ADR-0010: Overall Architecture Structure
ADR-0011: Identity-Centric Architecture
ADR-0012: Integration Layer Policy
ADR-0016: Scale Gate Policy
ADR-0043: AI Platform Architecture
ADR-0052: Growth Lab Core System Architecture
ADR-0053: Domain Module Boundary Policy
ADR-0054: Workflow and Approval Gate Policy
ADR-0055: Scheduler and Automation Engine Policy
ADR-0056: Integration Adapter Policy
ADR-0057: Registry to Database Migration Policy
ADR-0058: Audit Log Policy
ADR-0059: Monitoring and Alert Policy
ADR-0060: Local Development and Mock Mode Policy
ADR-0061: Growth Lab Core System Scale Gate Policy
```

以下の判断を変更する場合は、ADR作成を検討する。
Growth Lab Core Systemの責任範囲変更
Domain Module境界の大幅変更
RegistryからDatabaseへの移行方針変更
Approval Gate方針変更
SchedulerとAutomation Engineの責任分界変更
Automation実行範囲拡大
Integration Layer方針変更
Audit Log方針変更
Monitoring方針変更
Local Development方針変更
Production展開方針変更
Growth Lab Core System Scale Gate方針変更
