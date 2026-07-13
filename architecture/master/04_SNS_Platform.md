# 04 SNS Platform

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/04_SNS_Platform.md

## 1. Purpose

本章の目的は、Growth Lab Core におけるSNS基盤の設計方針を定義することである。

SNS基盤は、単に複数のSNSアカウントを作成して投稿するための仕組みではない。
Growth Lab Coreでは、SNSアカウントをIdentity、Mail Account、投稿、メディア、WordPress導線、アフィリエイト、KPI、AI改善提案、運用ログ、リスク管理と紐付けて管理する。

本章では、以下を定義する。

- SNS Platform全体方針

- 対象SNSプラットフォーム

- SNS AccountとIdentityの関係

- SNS AccountとMail Accountの関係

- SNS Account Registryの正本管理方針

- SNSアカウントのライフサイクル

- 1メールアドレスにつき1SNSアカウント方針との接続

- API First / OAuth First方針

- 投稿、予約、取得、分析、自動化の境界

- SNSからWordPressへの導線

- AI / Automationとの責任分界

- 規約遵守とアカウント停止リスク管理

- 20アカウントから100から500アカウントへの拡張方針

- SNS Scale Gate

- 運用リスクと軽減策

## 2. Scope

本章の対象範囲は、Growth Lab Coreで管理するSNS基盤全体である。

対象範囲は以下を含む。

- SNSアカウント管理

- SNS Account Registry

- SNSアカウントとIdentityの紐付け

- SNSアカウントとMail Accountの紐付け

- SNSアカウントの作成方針

- SNSアカウントの認証方針

- SNSアカウントのライフサイクル管理

- SNS投稿管理

- SNS投稿予約

- SNS投稿結果管理

- SNSアカウント状態管理

- SNS通知管理

- SNS API連携方針

- OAuth連携方針

- SNS分析データ取得方針

- SNSからWordPressへの導線管理

- AIによる投稿案作成、分析、改善提案

- Automation Engineによる定型処理

- アカウント停止リスク管理

- SNS Scale Gate

本章では、各SNSの画面操作手順、投稿本文テンプレート、画像制作手順、広告出稿の詳細、各SNS APIの具体的なエンドポイント仕様までは定義しない。
それらは、運用マニュアル、投稿ガイドライン、API and OAuth章、Analytics and KPI章、または下位仕様で定義する。

## 3. Non-Goals

本章では、以下を対象外とする。

- 各SNSの具体的なアカウント作成画面手順

- 各SNSの投稿画面操作手順

- 各SNSごとの最新APIエンドポイント詳細

- 各SNS広告管理画面の詳細手順

- 投稿文テンプレートの詳細作成

- 画像、動画、サムネイル制作手順

- インフルエンサー施策の個別運用手順

- フォロワー獲得施策の詳細戦術

- 広告予算配分の詳細

- アフィリエイト記事の詳細構成

- WordPress記事制作手順

- SNSごとのアルゴリズム攻略手法

- 利用規約に反する自動化や運用手法

SNSごとの詳細運用は、下位のSNS運用マニュアル、キャンペーン仕様書、またはOperations Manualで定義する。

## 4. Background

Growth Lab Coreでは、初期段階でXを含む複数SNSの運用を想定している。

初期構築では20アカウント規模を前提とする。
将来的には、KPI、ROI、運用負荷、停止リスク、API制限、セキュリティ管理、メール基盤、WordPress側の受け皿を確認しながら、100から500アカウント規模まで拡張できる構成にする。

ただし、アカウント数を増やすこと自体を目的とはしない。
Growth Lab Coreでは、SNSアカウント数、投稿数、流入数、クリック数、CV、売上、運用コスト、停止リスクを総合的に分析し、最適なSNS運用規模を判断する。

SNS運用の主目的は、以下である。

- WordPressメディアへの流入獲得

- アフィリエイト導線の強化

- テーマ別メディア群の育成

- 投稿データの収集

- KPI分析

- AI改善ループの構築

- 成果の出るアカウント運用パターンの発見

SNSアカウントは、使い捨ての運用資産ではなく、Identityに紐付く管理対象として扱う。

## 5. Alignment with Architecture Principles

本章は、01_Architecture_Principles.md で定義した原則に従う。

特に、SNS基盤では以下を重視する。

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

SNS基盤における優先順位は以下である。

1. 規約遵守
2. セキュリティ
3. 正本管理
4. 監査可能性
5. API First
6. 停止リスク管理
7. 運用しやすさ
8. 拡張性
9. コスト最適化
10. AI活用
11. 自動化
12. 継続改善

AI活用、自動化、アカウント拡張は、各SNSの利用規約、API利用条件、セキュリティ方針、運用監査の範囲内で実施する。

## 6. SNS Platform Vision

Growth Lab CoreのSNS基盤は、SNSアカウントを起点に、WordPressメディア、アフィリエイト、分析、AI改善ループを接続するための運用基盤である。

SNS Platform
    |
    +-- Account Management
    +-- Identity Relationship
    +-- Mail Account Relationship
    +-- Content Publishing
    +-- Media Distribution
    +-- WordPress Traffic Flow
    +-- Analytics Collection
    +-- KPI Evaluation
    +-- AI Improvement
    +-- Risk Management

SNS基盤の基本サイクルは以下である。

Plan
  |
  v
Create Draft
  |
  v
Review
  |
  v
Publish
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
Next Plan

Growth Lab Coreでは、SNSアカウント単体ではなく、アカウント、投稿、流入、成果、リスク、改善履歴を一体で管理する。

## 7. Overall SNS Architecture

Growth Lab CoreのSNS基盤は、以下の構成を基本とする。

SNS Platforms
    |
    +-- X
    +-- Instagram
    +-- TikTok
    +-- YouTube
    +-- Facebook
    +-- Threads
    +-- Pinterest
    +-- Future Platforms
            |
            v
Integration Layer
    |
    +-- SNS API Client
    +-- OAuth Client
    +-- Webhook Receiver
    +-- Analytics Adapter
    +-- Publishing Adapter
    +-- Notification Adapter
            |
            v
Growth Lab Core
    |
    +-- Identity Management
    +-- Mail Account Management
    +-- SNS Account Management
    +-- SNS Account Registry
    +-- Campaign Management
    +-- Post Management
    +-- Media Management
    +-- Scheduler
    +-- Automation Engine
    +-- AI Engine
    +-- Analytics Engine
    +-- KPI Engine
    +-- Monitoring
    +-- Audit Log

SNSプラットフォームごとの仕様差は、Integration Layerで吸収する。

Growth Lab Core本体では、SNSアカウント、投稿、KPI、状態、リスクを共通モデルとして扱う。

## 8. Target SNS Platforms

Growth Lab Coreで対象候補とするSNSプラットフォームは以下である。

Primary Candidate Platforms

- X
- Instagram
- TikTok
- YouTube
- Facebook
- Threads
- Pinterest

各SNSの位置付けは以下を基本とする。

### 8.1 X

Xは、初期運用候補の中心SNSとして扱う。

主な用途は以下である。

- テキスト投稿

- リンク誘導

- 速報性のある投稿

- WordPress記事への誘導

- 複数テーマアカウント運用

- 投稿データ分析

### 8.2 Instagram

Instagramは、画像、短尺動画、ブランド表現に適したSNSとして扱う。

主な用途は以下である。

- 画像投稿

- リール

- ストーリーズ

- テーマ別メディア運用

- 視覚的な訴求

- WordPressまたは外部リンクへの誘導

### 8.3 TikTok

TikTokは、短尺動画による拡散に適したSNSとして扱う。

主な用途は以下である。

- 短尺動画

- トレンド活用

- 認知拡大

- WordPressまたは関連導線への誘導

- 投稿反応データ収集

### 8.4 YouTube

YouTubeは、動画メディア、ショート動画、検索流入に適したSNSとして扱う。

主な用途は以下である。

- YouTube Shorts

- 長尺動画

- 動画メディア運用

- 検索流入

- WordPress記事との連携

### 8.5 Facebook

Facebookは、ページ運用、コミュニティ、広告連携の候補として扱う。

主な用途は以下である。

- Facebookページ

- 投稿配信

- コミュニティ連携

- 広告連携

- Instagram連携

### 8.6 Threads

Threadsは、テキスト中心のSNS運用候補として扱う。

主な用途は以下である。

- 短文投稿

- Instagram連携

- テーマ別アカウント運用

- WordPress導線

### 8.7 Pinterest

Pinterestは、画像検索、保存、長期流入に適したSNS候補として扱う。

主な用途は以下である。

- 画像ピン

- WordPress記事への誘導

- 長期検索流入

- テーマ別メディア連携

### 8.8 Future Platforms

将来的に新しいSNSまたはメディアプラットフォームを追加する場合は、Integration Layerを通じて追加する。

追加時は、以下を確認する。

- 利用規約

- API提供状況

- OAuth対応

- 投稿自動化の可否

- 分析データ取得可否

- アカウント作成ルール

- 運用負荷

- 停止リスク

- WordPress導線との相性

- KPI計測可否

## 9. Responsibility Boundary

SNS基盤では、各要素の責任範囲を明確に分離する。

### 9.1 Growth Lab Core Responsibilities

Growth Lab Coreが責任を持つ範囲は以下である。

- SNS Account Registry管理

- Identityとの紐付け管理

- Mail Accountとの紐付け管理

- SNSアカウント状態管理

- 投稿計画管理

- 投稿履歴管理

- KPI管理

- SNS分析データ管理

- AI提案管理

- Automation管理

- 監査ログ管理

- リスク状態管理

- 変更履歴管理

### 9.2 External Platform Responsibilities

外部SNSプラットフォーム側が責任を持つ範囲は以下である。

- アカウント作成仕様

- アカウント認証仕様

- API仕様

- OAuth仕様

- 投稿仕様

- レート制限

- アカウント制限

- アカウント停止判断

- 分析データ提供仕様

- 規約変更

- 管理画面仕様

Growth Lab Coreは外部SNS仕様を制御できない。
そのため、外部仕様変更を前提に、Integration Layer、監視、運用手順、ADRを設計する。

### 9.3 Human Operator Responsibilities

人間の運用担当者が責任を持つ範囲は以下である。

- SNSアカウント作成判断

- SNSアカウント削除判断

- 投稿内容の最終承認

- アカウント停止時の対応判断

- 規約変更時の対応判断

- AI提案の採用判断

- 自動化範囲の承認

- SNS Scale Gate Review

- 重要なADR承認

### 9.4 AI Assistant Responsibilities

AI Assistantが支援する範囲は以下である。

- 投稿案作成

- 投稿改善案作成

- プロフィール案作成

- 画像案作成

- KPI分析補助

- ABテスト分析補助

- アカウント改善提案

- リスク検知補助

- Codex / Claude Code作業指示書作成補助

AI Assistantは、重要判断を単独で確定しない。

### 9.5 Codex and Claude Code Responsibilities

Codexは、確定済み仕様の反映、台帳テンプレート作成、CHANGELOG更新、バックアップ作成を支援する。

Claude Codeは、仕様書とADRに基づいて、SNS基盤に関する実装、検証、自動化、スクリプト作成を支援する。

CodexおよびClaude Codeは、上位設計判断を単独で変更しない。

## 10. SNS Platform Components

SNS基盤は、以下のコンポーネントで構成する。

### 10.1 SNS Account Management

SNSアカウントを作成、登録、状態管理、停止、削除する機能である。

主な管理対象は以下である。

- SNS Account ID

- Platform

- Account Name

- Handle

- Profile URL

- Related Identity

- Related Mail Account

- Status

- Risk Level

- Created Date

- Last Checked Date

- Owner

- Operation History

### 10.2 SNS Account Registry

SNS Account Registryは、SNSアカウント情報のSingle Source of Truthである。

初期段階ではGoogle SheetsまたはMarkdown台帳で管理し、将来的にはGrowth Lab Core Databaseへ移行する。

### 10.3 Profile Management

SNSアカウントのプロフィール情報を管理する機能である。

対象は以下である。

- 表示名

- ユーザー名

- プロフィール文

- アイコン

- ヘッダー画像

- URL

- カテゴリ

- テーマ

- 注意事項

- 更新履歴

### 10.4 Post Management

SNS投稿の企画、下書き、承認、予約、公開、履歴管理を行う機能である。

対象は以下である。

- 投稿本文

- 画像

- 動画

- URL

- ハッシュタグ

- 投稿予定日時

- 承認状態

- 公開状態

- 投稿結果

- 反応データ

### 10.5 Media Management

SNS投稿に使用する画像、動画、サムネイル、バナー、素材を管理する機能である。

素材は、著作権、利用許諾、利用範囲を確認して管理する。

### 10.6 Publishing Adapter

SNSプラットフォームごとの投稿方式を吸収する接続層である。

公式API、公式予約投稿機能、承認済み外部ツール、または手動投稿を、利用規約に従って選択する。

### 10.7 Analytics Adapter

SNSプラットフォームごとの分析データを取得、変換、保存する接続層である。

取得対象は以下である。

- Impression

- Reach

- Engagement

- Click

- Follower

- View

- Save

- Share

- Comment

- Conversion Reference

### 10.8 Notification Adapter

SNSから届く通知、警告、制限、認証メール、セキュリティ通知を確認するための接続層である。

Mail Platformと連携して通知確認を行う。

## 11. SNS Account Types

Growth Lab Coreでは、SNSアカウントを用途別に分類する。

### 11.1 Main Account

主要なブランド、メディア、または運用単位を代表するアカウントである。

管理を厳格に行い、重要通知、認証、復旧手順を明確にする。

### 11.2 Theme Account

特定テーマ、ジャンル、ターゲット、コンテンツ群に紐付くアカウントである。

Growth Lab Coreの初期運用では、複数のTheme Accountを作成し、投稿と流入効果を比較する。

### 11.3 Test Account

検証用アカウントである。

本番投稿、本番アフィリエイト導線、本番分析には原則使用しない。

### 11.4 System Account

システム通知、連携確認、内部検証などに使用するアカウントである。

利用範囲を限定し、外部公開運用とは分離する。

### 11.5 Retired Account

運用終了済みのアカウントである。

削除前に、投稿履歴、分析履歴、関連WordPress導線、Mail Account、Identity、復旧情報を確認する。

## 12. SNS Account Registry

SNS Account Registryは、SNS基盤のSingle Source of Truthである。

初期段階ではGoogle SheetsまたはMarkdown台帳で管理し、将来的にはGrowth Lab Core Databaseへ移行する。

### 12.1 Required Fields

SNS Account Registryには、以下を記録する。

SNS Account ID
Identity ID
Mail Account ID
Platform
Account Type
Account Name
Handle
Profile URL
Theme
Target Audience
Related WordPress Site
Related Campaign
Status
Risk Level
Created Date
Verified Date
Last Checked Date
OAuth Connection Flag
API Access Flag
Posting Method
Analytics Collection Method
Owner
Notes
Change History

### 12.2 Registry Rules

台帳管理のルールは以下である。

- 本番利用するSNSアカウントは必ず登録する。

- 未登録SNSアカウントを本番運用しない。

- Mail Accountと必ず紐付ける。

- Identityと必ず紐付ける。

- ステータス変更時は更新する。

- プロフィール変更時は更新する。

- OAuth接続変更時は更新する。

- 投稿方式変更時は更新する。

- 運用終了時も履歴を残す。

- Secret実体を記録しない。

- 復旧情報は参照先のみ記録する。

- SNS管理画面を正本として扱わない。

### 12.3 Migration to Database

アカウント数が増えた場合、SNS Account RegistryはDatabaseへ移行する。

移行判断の目安は以下である。

- 50アカウントを超える。

- 投稿履歴との連携が必要になる。

- KPIとの連携が必要になる。

- OAuth状態管理が必要になる。

- 自動チェックが必要になる。

- 監査ログとの連携が必要になる。

- 手動台帳の更新漏れが増える。

## 13. Identity, Mail Account, and SNS Account Relationship

SNS Accountは、IdentityとMail Accountに紐付けて管理する。

Identity
    |
    +-- Mail Account
    |       |
    |       +-- Mail Address
    |       +-- Forwarding Destination
    |       +-- Verification Status
    |
    +-- SNS Account
            |
            +-- Platform
            +-- Handle
            +-- Profile URL
            +-- Status
            +-- Risk Level
            +-- Posting Method
            +-- Analytics Method

SNS Accountは、Mail Accountや認証情報と直接混在させない。
Identityを通じて関係を管理する。

### 13.1 Required Relationship

本番用SNSアカウントを作成する場合、以下の関係を必ず記録する。

- Identity ID

- Mail Account ID

- SNS Account ID

- Platform

- Account Type

- Handle

- Profile URL

- Status

- 作成日

- 最終確認日

- OAuth接続状態

- 投稿方式

- 分析取得方式

- 復旧方法

- 管理担当者

### 13.2 Account Relationship Policy

基本方針は以下である。

1 Identity
    =
1 Mail Account
    =
1 SNS Account

例外的に1つのIdentityに複数SNSアカウントを紐付ける場合は、以下を確認する。

- 管理上の必要性

- 停止時の影響範囲

- 復旧方法

- Mail Accountとの関係

- ログ管理

- KPI管理

- ADR作成要否

## 14. One Mail Address per SNS Account Policy

SNS基盤では、03_Mail_Platform.md で定義した「1メールアドレスにつき1SNSアカウント」の方針に従う。

1 Mail Address
    =
1 SNS Account
    =
1 Identity

この方針により、以下を実現する。

- SNS通知をアカウント単位で分離する。

- 認証メールを特定しやすくする。

- アカウント停止時の影響範囲を限定する。

- 復旧時に対象アカウントを特定しやすくする。

- KPI、投稿、リスクをIdentity単位で管理しやすくする。

以下は禁止する。

- 1つのメールアドレスを複数の無関係なSNSアカウントで使い回すこと。

- 管理者用メールを大量のSNS登録に使うこと。

- 復旧不能なメールアドレスでSNS登録すること。

- Mail Account Registryに未登録のメールをSNS登録に使うこと。

- SNS Account Registryに未登録のSNSアカウントを本番運用すること。

## 15. SNS Account Lifecycle and Status

SNS Accountは、ライフサイクルとステータスを分けて管理する。

### 15.1 Lifecycle

SNS Accountは、以下のライフサイクルで管理する。

Planned
  |
  v
Mail Prepared
  |
  v
Created
  |
  v
Verified
  |
  v
Profile Configured
  |
  v
Linked to Identity
  |
  v
Active
  |
  v
Measured
  |
  v
Improved
  |
  v
Suspended or Retired

各段階の意味は以下である。

- Planned: 作成予定

- Mail Prepared: 登録用Mail Account準備済み

- Created: SNSアカウント作成済み

- Verified: 認証確認済み

- Profile Configured: プロフィール設定済み

- Linked to Identity: Identity紐付け済み

- Active: 本番運用中

- Measured: KPI測定対象

- Improved: 改善施策反映済み

- Suspended: 一時停止

- Retired: 運用終了

- Deleted: 削除済み

### 15.2 Status

SNS Accountには、以下のステータスを持たせる。

Planned
Mail Prepared
Created
Verified
Profile Configured
Linked
Active
Warning
Limited
Suspended
Retired
Deleted

### 15.3 Warning Conditions

以下の場合はWarningにする。

- 認証メールが届かない。

- OAuth接続が失敗している。

- 投稿失敗が発生している。

- 分析データが取得できない。

- プロフィール情報が不完全である。

- Mail Accountとの紐付けが不明確である。

- KPIが一定期間取得できていない。

- 重要通知の確認が必要である。

### 15.4 Limited Conditions

以下の場合はLimitedにする。

- SNSプラットフォーム側で一部機能が制限されている。

- 投稿制限がかかっている。

- 認証追加確認が求められている。

- API利用制限が発生している。

- 一部分析データが取得できない。

### 15.5 Suspended Conditions

以下の場合はSuspendedにする。

- アカウント停止状態である。

- セキュリティ上の疑いがある。

- 認証情報が失効している。

- 復旧手順確認中である。

- 規約確認が必要である。

- 手動確認が完了するまで運用を止める必要がある。

## 16. Platform Selection and Expansion Policy

SNSプラットフォームを追加または運用拡大する場合、事前に評価を行う。

### 16.1 Selection Criteria

評価項目は以下である。

- 利用規約

- API提供状況

- OAuth対応

- 投稿管理機能

- 予約投稿対応

- 分析データ取得可否

- 外部リンク誘導のしやすさ

- WordPress導線との相性

- アフィリエイト導線との相性

- 運用負荷

- クリエイティブ制作負荷

- アカウント停止リスク

- コスト

- KPI計測可能性

- AI活用との相性

- Automationとの相性

### 16.2 Priority

初期段階では、以下を優先する。

1. WordPressへ誘導しやすいSNS
2. 投稿作成コストが低いSNS
3. 分析データを取得しやすいSNS
4. アカウント管理がしやすいSNS
5. 公式APIまたは公式管理機能が利用しやすいSNS
6. 停止リスクを管理しやすいSNS

### 16.3 Platform Expansion Review

新しいSNSを追加する場合は、Platform Expansion Reviewを行う。

Platform Expansion Review

1. 追加目的
2. 想定するターゲット
3. WordPress導線
4. 投稿形式
5. 必要なMail Account数
6. 必要なIdentity数
7. API / OAuth対応
8. 分析データ取得可否
9. 運用負荷
10. 停止リスク
11. コスト
12. ADR作成要否

## 17. Account Creation Policy

SNSアカウント作成は、管理可能な範囲で計画的に行う。

### 17.1 Creation Principles

作成方針は以下である。

- 作成前にPurposeを定義する。

- 作成前にTarget Audienceを定義する。

- 作成前にRelated WordPress Siteを定義する。

- 作成前にMail Accountを準備する。

- 作成前にIdentityを準備する。

- 作成後にSNS Account Registryへ登録する。

- 作成後に認証状態を確認する。

- 作成後にプロフィールを設定する。

- 作成後に運用ステータスを記録する。

### 17.2 Required Pre-Check

アカウント作成前に以下を確認する。

SNS Account Creation Pre-Check

1. 対象SNS
2. 作成目的
3. アカウント種別
4. ターゲット
5. 関連WordPressサイト
6. 関連キャンペーン
7. 使用するMail Account
8. 使用するIdentity
9. 命名ルール
10. プロフィール方針
11. 投稿方針
12. 分析方針
13. 復旧方針
14. 規約確認

### 17.3 Prohibited Creation

以下は禁止する。

- 目的が未定義のSNSアカウント作成

- Mail Account未準備での本番SNS作成

- Identity未登録での本番SNS作成

- SNS Account Registry未登録での本番運用

- 規約確認なしの大量作成

- 管理不能な数のアカウント作成

- 停止リスクを意図的に高める運用

- 認証制限を回避する目的の運用

## 18. Authentication and Recovery Policy

SNSアカウントの認証と復旧は、Mail PlatformおよびSecurity章と連携して管理する。

### 18.1 Authentication Principles

認証方針は以下である。

- 登録メールはMail Account Registryに登録されたものを使用する。

- 2要素認証を可能な範囲で設定する。

- TOTPを標準候補とする。

- パスキーは対応サービスごとに運用性を確認する。

- SMS認証は補助的方式として扱う。

- 復旧方法を記録する。

- 認証情報を平文保存しない。

- 認証失敗時は自動処理を停止する。

### 18.2 Recovery Principles

復旧方針は以下である。

- 復旧に使うMail Accountを確認する。

- 復旧コードはSecretとして扱う。

- 復旧作業は操作履歴に記録する。

- 復旧後はステータスを更新する。

- 復旧に失敗した場合は運用を停止する。

- 復旧方法が不明なアカウントは本番運用しない。

### 18.3 Recovery Workflow

復旧時は、以下の流れを基本とする。

Detect Issue
  |
  v
Identify SNS Account
  |
  v
Confirm Identity
  |
  v
Confirm Mail Account
  |
  v
Check Recovery Reference
  |
  v
Perform Approved Recovery
  |
  v
Record Action
  |
  v
Update Status

## 19. API and OAuth Policy

SNS連携では、公式APIとOAuthを優先する。

### 19.1 API First

公式APIが提供されている場合は、公式APIを優先する。

API利用時は以下を管理する。

- API利用条件

- API権限

- Rate Limit

- Token Expiration

- Error Response

- Logging

- Retry Policy

- API仕様変更

### 19.2 OAuth First

認証連携では、OAuthを優先する。

OAuth利用時は以下を管理する。

- OAuth Client

- Scope

- Access Token

- Refresh Token

- Expiration

- Revocation

- Reauthorization

- Audit Log

OAuth TokenやClient SecretはSecretとして扱い、Markdown仕様書、通常メモ、スプレッドシート、チャット履歴に平文で記録しない。

### 19.3 API Unavailable Case

公式APIが利用できない場合は、以下を確認する。

- 公式管理画面で代替できるか。

- 公式予約投稿機能があるか。

- 手動運用で対応できるか。

- 利用規約に適合しているか。

- 自動化してよい範囲か。

- 監査ログを残せるか。

- ADRが必要か。

非公式な接続、ブラウザ自動操作、スクレイピングは、利用規約、法令、セキュリティ、アカウント停止リスクを確認し、原則として慎重に扱う。

## 20. Publishing Architecture

SNS投稿は、Post Management、Scheduler、Publishing Adapterを通じて管理する。

Post Draft
  |
  v
AI Proposal
  |
  v
Human Review
  |
  v
Approved
  |
  v
Scheduled
  |
  v
Publishing Adapter
  |
  v
SNS Platform
  |
  v
Publish Result
  |
  v
Analytics Collection

### 20.1 Publishing Methods

投稿方式は以下に分類する。

Publishing Method

1. Manual Posting
2. Official Platform Scheduler
3. Official API Posting
4. Approved External Tool

### 20.2 Publishing Rules

投稿ルールは以下である。

- 投稿前に承認状態を確認する。

- 投稿先SNS Accountを確認する。

- 投稿本文、画像、URLを確認する。

- WordPress導線を確認する。

- アフィリエイトリンクの扱いを確認する。

- 利用規約に反する内容を投稿しない。

- 投稿結果を記録する。

- 失敗時はログに記録する。

- 連続失敗時は自動処理を停止する。

### 20.3 Human Review Required Cases

以下の場合は人間レビューを必須とする。

- 新規キャンペーン開始

- 新規SNSアカウント初回投稿

- 法令、規約、広告表現に関係する投稿

- アフィリエイト成果に直接関係する投稿

- ブランド毀損リスクがある投稿

- センシティブな内容を含む投稿

- AIが高リスクと判断した投稿

- 大量投稿または一括予約

## 21. Content, Media, and URL Policy

SNS投稿では、コンテンツ、メディア、URLを管理対象として扱う。

### 21.1 Content Types

投稿コンテンツは以下に分類する。

- Text Post

- Image Post

- Video Post

- Short Video

- Link Post

- Thread

- Story

- Live Content

- Poll

- Carousel

### 21.2 Media Rules

メディア利用時は以下を確認する。

- 著作権

- 利用許諾

- 商用利用可否

- 画像改変可否

- 出典管理

- ブランド整合性

- ファイル管理

- 再利用可否

### 21.3 URL Policy

SNS投稿にURLを含める場合は、以下を確認する。

- 関連WordPress記事

- アフィリエイトリンクの扱い

- UTMパラメータ

- リンク切れ

- リダイレクト

- 表示速度

- モバイル表示

- 計測可否

## 22. WordPress Traffic Flow

SNS基盤の主目的のひとつは、WordPressメディアへの流入を作ることである。

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
Analytics
  |
  v
AI Improvement

### 22.1 Traffic Principles

SNSからWordPressへの導線では、以下を確認する。

- 投稿内容と記事内容が一致しているか。

- リンク先が有効か。

- モバイルで見やすいか。

- アフィリエイト導線が自然か。

- 計測できるか。

- ユーザー体験を損なわないか。

- 規約や広告表現に問題がないか。

### 22.2 Related WordPress Site

SNS Account Registryでは、関連するWordPressサイトまたはページを記録する。

記録対象は以下である。

- Related WordPress Site

- Related WordPress Category

- Related Article

- Related Landing Page

- Related Affiliate Link

- UTM Rule

- Campaign ID

### 22.3 Link Governance

リンク管理では、以下を避ける。

- リンク切れ

- 無関係なリンク先

- 過剰なアフィリエイト誘導

- 誤認を招くリンク表現

- 計測不能なリンク

- 管理台帳にないリンク利用

## 23. Analytics and KPI Policy

SNS運用は、KPIに基づいて改善する。

### 23.1 Required Metrics

取得対象の指標は以下である。

Account Metrics
- Follower
- Following
- Profile View
- Account Status

Post Metrics
- Impression
- Reach
- Engagement
- Like
- Comment
- Share
- Save
- Click
- View

Traffic Metrics
- Session
- Click Through
- Landing Page View
- Bounce
- Conversion Reference

Business Metrics
- Conversion
- Revenue
- Cost
- ROI

### 23.2 KPI Usage

KPIは以下に利用する。

- 投稿改善

- アカウント改善

- キャンペーン改善

- WordPress記事改善

- アカウント継続判断

- アカウント停止判断

- アカウント追加判断

- Platform追加判断

- AI改善提案

### 23.3 KPI Integrity

KPIを利用する場合は、以下を確認する。

- 取得元

- 取得日

- 対象期間

- 対象SNS Account

- 対象Post

- 対象Campaign

- 計測方法

- 欠損有無

- 推定値か実測値か

## 24. AI Usage Policy

AIは、SNS運用の生成、分析、改善支援に利用する。

### 24.1 AI Use Cases

AIの主な利用範囲は以下である。

- 投稿案作成

- 投稿タイトル案作成

- ハッシュタグ案作成

- プロフィール案作成

- 画像案作成

- 動画構成案作成

- 投稿改善提案

- KPI分析補助

- ABテスト分析補助

- アカウント改善提案

- リスク検知補助

- Codex / Claude Code作業指示書作成補助

### 24.2 AI Boundary

AIは支援機能であり、重要判断を単独で確定しない。

以下は人間レビューを必須とする。

- 新規SNSアカウント作成

- SNSアカウント削除

- 新規キャンペーン開始

- 大量投稿

- 外部公開前の高リスク投稿

- 規約や広告表現に関係する投稿

- アカウント停止リスクがある判断

- セキュリティ設定変更

- OAuth権限変更

### 24.3 AI Output Management

AI出力は、以下の状態で管理する。

AI Proposed
Human Reviewed
Approved
Rejected
Modified
Published
Measured

AI提案、採用、却下、修正、公開、結果は、必要に応じて履歴に残す。

## 25. Automation Policy

Automation Engineは、SNS運用の反復作業を支援する。

### 25.1 Automation Use Cases

自動化候補は以下である。

- 投稿予約

- 投稿結果取得

- KPI取得

- アカウント状態確認

- OAuth状態確認

- 認証エラー検知

- 投稿失敗検知

- レポート生成

- 台帳整合性確認

- リンク切れ確認

- WordPress導線確認

- AI改善案生成

### 25.2 Automation Boundary

自動化は、各SNSの利用規約、API利用条件、セキュリティ方針に従う。

以下は自動化の前に人間承認を必要とする。

- 大量投稿

- 一括プロフィール変更

- 一括フォロー、アンフォロー

- アカウント作成

- アカウント削除

- 認証設定変更

- OAuth権限変更

- 高リスク投稿

- 規約確認が必要な処理

### 25.3 Required Safeguards

Automation Engineには、以下を必ず持たせる。

- 実行条件

- 停止条件

- リトライ制限

- レート制限考慮

- エラー処理

- 手動停止手段

- 実行ログ

- 監査ログ

- 人間承認条件

## 26. Account Risk Management

SNSアカウントには、停止、制限、認証失敗、誤投稿などのリスクがある。

### 26.1 Risk Levels

SNS Accountには、以下のリスクレベルを持たせる。

Low
Medium
High
Critical

### 26.2 Risk Factors

リスク要因は以下である。

- 認証未完了

- Mail Account不明

- OAuth失敗

- 投稿失敗

- 投稿頻度過多

- 重要通知未確認

- プロフィール不備

- 規約確認が必要な投稿

- アカウント制限

- セキュリティ通知

- KPI異常

- 連続エラー

- 手動確認未完了

### 26.3 Risk Handling

リスクが高い場合は、以下を行う。

- 投稿停止

- 自動化停止

- 手動確認

- Mail Account確認

- Identity確認

- OAuth確認

- SNS通知確認

- 復旧手順確認

- ステータス更新

- 対応履歴記録

## 27. Compliance and Platform Policy

SNS基盤は、各SNSの利用規約、API利用条件、広告ポリシー、アフィリエイト規約に従う。

### 27.1 Compliance Rules

以下を守る。

- 各SNSの利用規約を確認する。

- API利用条件を確認する。

- 自動化してよい範囲を確認する。

- アカウント作成ルールを確認する。

- 投稿内容が法令、規約、広告表現に反しないことを確認する。

- 通知や警告を無視しない。

- 規約変更時は運用方針を見直す。

- 不自然な運用や誤認を招く運用を避ける。

### 27.2 Prohibited Actions

以下は禁止する。

- 利用規約に反する自動化

- 認証制限やアクセス制限の回避

- 管理不能な大量アカウント作成

- アカウント停止回避を目的とした不自然な運用

- SNSプラットフォームの信頼性を損なう行為

- API制限回避を目的とした不自然な分散アクセス

- SecretやTokenの平文保存

- 未承認の大量投稿

- 誤認を招くアフィリエイト誘導

- 他者の権利を侵害するコンテンツ利用

## 28. Observability and Monitoring

SNS基盤では、アカウント状態、投稿状態、API状態、分析取得状態、リスク状態を監視対象とする。

### 28.1 Monitoring Targets

監視対象は以下である。

- SNS Account Status

- Mail Account Link

- Identity Link

- OAuth Status

- API Status

- Publishing Status

- Post Failure

- Analytics Collection Status

- Account Warning

- Account Limitation

- Security Notification

- WordPress Link Status

- KPI Collection Status

### 28.2 Required Logs

記録対象は以下である。

- SNS Account作成履歴

- プロフィール変更履歴

- Mail Account紐付け履歴

- Identity紐付け履歴

- OAuth接続履歴

- 投稿履歴

- 投稿失敗履歴

- APIエラー履歴

- KPI取得履歴

- アカウント状態変更履歴

- リスク対応履歴

- 復旧作業履歴

- 削除またはRetire履歴

### 28.3 Alert Conditions

以下の場合は通知または確認対象とする。

- 投稿が連続失敗している。

- OAuth Tokenが失効している。

- API接続が失敗している。

- アカウント制限通知がある。

- アカウント停止通知がある。

- 認証メールが届かない。

- SNS Account Registryと実態が一致しない。

- KPI取得が止まっている。

- WordPressリンクが切れている。

- 高リスク投稿が検出された。

## 29. SNS Data Model Overview

SNS基盤の論理データモデルは以下である。

Identity
    |
    +-- Mail Account
    |
    +-- SNS Account
            |
            +-- Profile
            +-- Post
            +-- Media
            +-- Campaign
            +-- Schedule
            +-- Analytics
            +-- KPI
            +-- Risk Status
            +-- OAuth Reference
            +-- Operation Log

### 29.1 SNS Account Entity

SNS Accountは、SNSプラットフォーム上のアカウント単位の管理エンティティである。

### 29.2 Profile Entity

Profileは、SNSアカウントの表示名、ユーザー名、紹介文、画像、URLを管理する。

### 29.3 Post Entity

Postは、SNS投稿単位の管理エンティティである。

### 29.4 Media Entity

Mediaは、投稿に使用する画像、動画、サムネイル、素材を管理する。

### 29.5 OAuth Reference Entity

OAuth Referenceは、OAuth連携に必要な参照情報を管理する。

Secret実体は保存しない。

### 29.6 Analytics Entity

Analyticsは、SNS投稿、アカウント、キャンペーン単位の成果データを管理する。

### 29.7 Risk Status Entity

Risk Statusは、SNSアカウントまたは投稿に関連するリスク状態を管理する。

## 30. Scale Architecture

SNS基盤は、アカウント数の増加に合わせて段階的に拡張する。

### 30.1 Scale Stages

Stage 1: 1から20SNSアカウント
Stage 2: 21から50SNSアカウント
Stage 3: 51から100SNSアカウント
Stage 4: 101から300SNSアカウント
Stage 5: 301から500SNSアカウント

### 30.2 Stage 1: 1から20SNSアカウント

初期段階では、以下を基本とする。

- SNS Account Registry

- Mail Account Registry

- Identity管理

- 手動投稿または公式機能中心

- 手動レビュー

- 手動KPI確認

- Gmail通知確認

- WordPress導線確認

### 30.3 Stage 2: 21から50SNSアカウント

以下を追加検討する。

- 投稿スケジュール管理

- SNS別ラベル管理

- 投稿テンプレート管理

- KPI集計ルール

- OAuth状態確認

- リスク状態管理

### 30.4 Stage 3: 51から100SNSアカウント

以下を追加検討する。

- Database管理

- Scheduler導入

- KPI自動取得

- 投稿失敗検知

- アカウント状態確認

- レポート生成

- 権限管理強化

### 30.5 Stage 4: 101から300SNSアカウント

以下を追加検討する。

- Automation Engine強化

- Queue導入

- API制限管理

- 複数プラットフォーム横断分析

- アカウント健全性スコア

- 自動アラート

- AI改善提案

### 30.6 Stage 5: 301から500SNSアカウント

以下を追加検討する。

- 高度な監視

- 自動棚卸し

- アカウント最適化

- 低成果アカウント整理

- リスク分散

- 権限分離

- 監査ログ強化

- 本格的なGrowth Lab Core運用基盤

## 31. SNS Scale Gate

次のSNS運用Stageへ進む前に、SNS Scale Gate Reviewを行う。

SNS Scale Gate Review

1. 現在のSNSアカウント数
2. 現在のMail Account数
3. 未登録SNSアカウントの有無
4. 未登録Mail Accountの有無
5. Identityとの紐付け状況
6. SNS Account Registryの更新状況
7. Mail Account Registryの更新状況
8. 投稿成功率
9. KPI取得状況
10. WordPress流入状況
11. CVまたは成果状況
12. アカウント停止リスク
13. API制限
14. OAuth状態
15. セキュリティ状態
16. 運用担当者の負荷
17. コスト
18. 次Stageへ進む必要性

SNS Scale Gateを通過できない場合は、SNSアカウントを増やさず、既存アカウントの改善、整理、停止、統合を優先する。

## 32. Cost Optimization

SNS基盤では、アカウント数、投稿数、AI利用量、外部ツール、人的運用コストのバランスを取る。

### 32.1 Cost Principles

コスト方針は以下である。

- 初期段階では過剰投資を避ける。

- 公式機能で対応できる範囲を優先する。

- 有料APIや外部ツールは効果を確認して導入する。

- 成果の低いアカウントを増やし続けない。

- AI利用コストをKPIと比較する。

- 自動化は運用負荷削減効果を確認して導入する。

- 停止リスクが高い運用に投資しない。

### 32.2 Cost Items

確認すべき費用項目は以下である。

- SNS API利用料

- 外部SNS管理ツール費用

- AI生成費用

- 画像生成費用

- 動画制作費用

- 投稿管理コスト

- 分析ツール費用

- WordPress運用費用

- Mail Platform費用

- 人的運用コスト

- 障害対応コスト

### 32.3 Cost Risk

安さだけを優先すると、以下のリスクがある。

- 分析できない。

- 投稿管理が破綻する。

- アカウント状態が見えない。

- 誤投稿が増える。

- 復旧できない。

- 停止リスクが増える。

- 成果の低いアカウントを増やし続ける。

## 33. Operations Policy

SNS基盤の日常運用では、以下を行う。

### 33.1 Regular Checks

定期確認項目は以下である。

- SNS Account Registry更新状況

- Mail Accountとの紐付け状況

- Identityとの紐付け状況

- 投稿スケジュール

- 投稿成功状況

- 投稿失敗状況

- 重要通知

- セキュリティ通知

- OAuth状態

- KPI取得状況

- WordPressリンク状態

- アカウントリスク状態

- 低成果アカウント

### 33.2 Change Management

以下の変更は記録する。

- SNSアカウント作成

- SNSアカウント削除

- SNSアカウント停止

- プロフィール変更

- Mail Account紐付け変更

- Identity紐付け変更

- OAuth接続変更

- 投稿方式変更

- 分析取得方式変更

- 関連WordPress導線変更

- Campaign紐付け変更

### 33.3 Account Retirement

SNSアカウントを廃止する場合は、以下を確認する。

- 関連Mail Account

- 関連Identity

- 関連WordPress導線

- 関連Campaign

- 投稿履歴

- KPI履歴

- アフィリエイト成果

- 復旧情報

- 削除前の保管要件

- SNS Account Registry更新

## 34. Incident Handling

SNS基盤で障害や異常が発生した場合、以下の流れで対応する。

Detect
  |
  v
Identify SNS Account
  |
  v
Identify Related Identity
  |
  v
Identify Related Mail Account
  |
  v
Check Platform Notification
  |
  v
Check API or OAuth Status
  |
  v
Mitigate
  |
  v
Record Incident
  |
  v
Update Status

### 34.1 Common Incidents

想定される異常は以下である。

- 投稿できない。

- 投稿が失敗する。

- 投稿が重複する。

- OAuthが失効する。

- API制限に到達する。

- 分析データが取得できない。

- アカウント制限が発生する。

- アカウント停止が発生する。

- 認証メールが届かない。

- セキュリティ通知が届く。

- WordPressリンクが切れている。

- KPIが異常値になる。

- 誤投稿が発生する。

### 34.2 Incident Records

障害対応では、以下を記録する。

- 発生日

- 対象SNS Account

- 対象Identity

- 対象Mail Account

- 対象Platform

- 発生内容

- 原因

- 対応内容

- 復旧結果

- 再発防止策

- 担当者

## 35. Integration with Other Chapters

本章は、以下の章と連携する。

### 35.1 02 Overall Architecture

SNS基盤は、Growth Lab Core全体アーキテクチャのExternal Service Layer、Integration Layer、Application Layer、AI and Automation Layerに関係する。

### 35.2 03 Mail Platform

SNSアカウント作成、認証、通知、復旧において、SNS AccountとMail Accountを紐付ける。

### 35.3 05 WordPress Platform

SNS投稿からWordPress記事、LP、アフィリエイト導線へ誘導する。

### 35.4 06 AI Platform

AIによる投稿案、改善案、分析補助、リスク検知を扱う。

### 35.5 07 Growth Lab Core System

SNS Account Management、Post Management、Scheduler、Automation Engine、Monitoringを扱う。

### 35.6 08 Database

SNS Account Registry、Post、Campaign、Analytics、KPI、Risk StatusをDatabaseへ移行する。

### 35.7 09 API and OAuth

SNS API、OAuth、Token、Rate Limit、Webhook、外部連携を扱う。

### 35.8 10 Security

認証情報、OAuth Token、TOTP、復旧コード、権限管理、監査ログを扱う。

### 35.9 11 Operations

SNSアカウント作成、投稿、確認、棚卸し、復旧、停止、削除の運用手順を扱う。

### 35.10 12 Analytics and KPI

SNS投稿、アカウント、キャンペーン、WordPress流入、CV、ROIの分析を扱う。

## 36. Chapter Responsibility Boundary

本章では、SNS基盤の上位設計を定義する。

詳細設計は、以下の章または下位文書で定義する。

04 SNS Platform
    |
    +-- Defines:
    |       +-- SNS platform architecture
    |       +-- SNS account policy
    |       +-- SNS Account Registry policy
    |       +-- Account lifecycle policy
    |       +-- API / OAuth basic policy
    |       +-- Publishing boundary
    |       +-- Automation boundary
    |       +-- Scale policy
    |
    +-- Does not define:
            +-- Detailed SNS screen operation
            +-- Detailed API endpoint specification
            +-- Detailed ad operation
            +-- Detailed creative production
            +-- Detailed WordPress article writing
            +-- Detailed database table design

詳細な手順は、Operations Manual、WordPress章、AI章、Database章、API and OAuth章、Security章、Analytics and KPI章で定義する。

## 37. Architecture Constraints

SNS基盤では、以下の制約を前提とする。

- 各SNSの利用規約を遵守する。

- 公式APIとOAuthを優先する。

- 1メールアドレスにつき1SNSアカウントを基本とする。

- SNS Account Registryを正本とする。

- Mail Account Registryと整合させる。

- Identityを中核管理単位とする。

- 未登録SNSアカウントを本番運用しない。

- Secretを平文保存しない。

- 自動化は許容範囲内で実施する。

- 高リスク処理には人間承認を入れる。

- 投稿結果とKPIを記録する。

- アカウント停止リスクを監視する。

- 初期段階では20アカウント規模に集中する。

- 拡張前にSNS Scale Gate Reviewを行う。

- アカウント数はKPIとリスクに基づいて最適化する。

## 38. Risks

本章に関連する主なリスクは以下である。

### 38.1 Risk: アカウント管理の破綻

SNSアカウント数が増え、どのIdentity、Mail Account、WordPress導線に紐付いているか分からなくなる可能性がある。

軽減策：

- SNS Account Registryを作成する。

- Identityと紐付ける。

- Mail Accountと紐付ける。

- 未登録アカウントを本番運用しない。

- 定期的に棚卸しする。

### 38.2 Risk: アカウント停止

規約違反、認証不備、過剰な自動化、不自然な運用により、SNSアカウントが停止する可能性がある。

軽減策：

- Compliance Firstを徹底する。

- 公式APIと公式機能を優先する。

- 自動化範囲を制限する。

- 重要通知を確認する。

- 停止リスクをRisk Levelで管理する。

### 38.3 Risk: 誤投稿

誤った内容、誤ったURL、誤ったアカウントで投稿される可能性がある。

軽減策：

- 投稿前レビューを行う。

- 承認ステータスを管理する。

- 投稿先アカウントを確認する。

- 投稿ログを記録する。

- 高リスク投稿は人間承認を必須にする。

### 38.4 Risk: 自動化による過剰処理

Automation Engineが想定以上に投稿、取得、変更を実行する可能性がある。

軽減策：

- 実行条件を定義する。

- 停止条件を定義する。

- リトライ制限を設定する。

- レート制限を考慮する。

- 手動停止手段を用意する。

- 実行ログを記録する。

### 38.5 Risk: API仕様変更

SNS APIやOAuth仕様が変更され、投稿、取得、分析が失敗する可能性がある。

軽減策：

- Integration Layerで疎結合にする。

- APIエラーを監視する。

- 仕様変更をCHANGELOGまたはADRに記録する。

- 手動運用への代替手段を持つ。

### 38.6 Risk: KPIが取得できない

分析データが取得できず、運用改善ができない可能性がある。

軽減策：

- 取得元を記録する。

- 欠損を記録する。

- 手動取得手段を用意する。

- KPI取得状況を監視する。

- 分析章で取得方法を詳細化する。

### 38.7 Risk: アカウント数増加によるコスト増大

SNSアカウント数が増えることで、投稿管理、AI利用、分析、監視、人的運用コストが増大する可能性がある。

軽減策：

- SNS Scale Gate Reviewを行う。

- KPIとROIを確認する。

- 低成果アカウントを整理する。

- 自動化投資の効果を確認する。

- アカウント数を最適化する。

### 38.8 Risk: WordPress導線との不整合

SNS投稿とWordPress記事、LP、アフィリエイト導線が一致せず、成果が低下する可能性がある。

軽減策：

- Related WordPress Siteを記録する。

- リンク切れを確認する。

- UTMルールを管理する。

- 投稿内容とリンク先を確認する。

- Analyticsで流入と成果を確認する。

## 39. Required Review Checklist

本章またはSNS基盤を更新する場合は、以下を確認する。

SNS Platform Review Checklist

1. SNS基盤の全体方針が明確か
2. 対象SNSプラットフォームが整理されているか
3. SNS AccountとIdentityの関係が明確か
4. SNS AccountとMail Accountの関係が明確か
5. SNS Account Registryが正本として定義されているか
6. 1メールアドレスにつき1SNSアカウント方針と整合しているか
7. SNSアカウントライフサイクルが定義されているか
8. SNS Account Statusが定義されているか
9. Platform Selection Policyが定義されているか
10. Account Creation Policyが定義されているか
11. API First / OAuth Firstが反映されているか
12. Publishing Architectureが定義されているか
13. WordPress導線が定義されているか
14. AI利用範囲が定義されているか
15. Automationの境界が定義されているか
16. アカウント停止リスク管理が定義されているか
17. Observabilityが定義されているか
18. SNS Scale Gateが定義されているか
19. Cost Optimizationが定義されているか
20. 下位章との責任分担が明確か
21. ADRが必要な判断が整理されているか

## 40. Review Points

本章のレビューでは、以下を確認する。

- SNS基盤がGrowth Lab Coreの中核として定義されているか。

- SNSアカウントがIdentity、Mail Account、WordPress、KPIと接続されているか。

- 1メールアドレスにつき1SNSアカウント方針と矛盾していないか。

- SNS Account Registryが正本として明確か。

- アカウント数を増やすこと自体が目的になっていないか。

- API First / OAuth Firstが明確か。

- 自動化の境界が明確か。

- 高リスク処理に人間承認が入っているか。

- 投稿からWordPress、アフィリエイト、分析、改善への流れが明確か。

- 20アカウントから100から500アカウントへ拡張できるか。

- SNS Scale Gateが拡張判断に使える内容になっているか。

- アカウント停止リスクを管理できるか。

- Codex反映時に章構成が崩れにくい構成になっているか。

## 41. Architecture Decision Records

本章に関連するADRは以下の通りである。

Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core

本章に関連して、今後追加が想定されるADRは以下である。

```text
ADR-0005: Core Architecture Principles
ADR-0011: Identity-Centric Architecture
ADR-0018: Mail Platform Architecture
ADR-0019: One Mail Address per SNS Account Policy
ADR-0025: SNS Platform Architecture
ADR-0026: SNS Account Registry Policy
ADR-0027: SNS Account Lifecycle Policy
ADR-0028: SNS API and OAuth Policy
ADR-0029: SNS Publishing Boundary Policy
ADR-0030: SNS Automation Boundary Policy
ADR-0031: SNS Scale Gate Policy
ADR-0032: SNS to WordPress Traffic Flow Policy
ADR-0033: SNS Risk Management Policy
```

以下の判断を変更する場合は、ADR作成を検討する。

- 対象SNSプラットフォームの大幅変更

- 1メールアドレスにつき1SNSアカウント方針の変更

- SNS Account Registryの正本変更

- SNSアカウント作成方針の変更

- 公式API以外の連携方式採用

- OAuth権限範囲の大幅変更

- SNS投稿自動化範囲の拡大

- 大量アカウント運用Stageへの移行

- SNSからWordPressへの導線方針変更

- アカウント停止リスク管理方針の変更
