# 05 WordPress Platform

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/05_WordPress_Platform.md

## 1. Purpose

本章の目的は、Growth Lab Core におけるWordPress基盤の設計方針を定義することである。

WordPress基盤は、単なるブログやCMSではない。
Growth Lab Coreでは、WordPressをSNSからの流入を受け止め、アフィリエイト導線へ接続し、SEO資産を蓄積し、投稿・記事・Campaign・KPI・AI改善ループを統合する owned media platform として扱う。

本章では、以下を定義する。

- WordPress Platform全体方針

- Xserverを第一候補とするホスティング方針

- WordPress SiteとSNS Accountの関係

- WordPress SiteとCampaignの関係

- SNSからWordPress記事、LP、アフィリエイト導線への流れ

- WordPress Site Registryの正本管理方針

- Article Registryの管理方針

- Landing Pageの管理方針

- Affiliate Link Registryの管理方針

- SEO、表示速度、モバイル、セキュリティ、バックアップ方針

- WordPress REST API連携方針

- AIによる記事案、改善案、SEO改善案との関係

- Analytics and KPIとの関係

- WordPress Scale Gate

- 20アカウントから100から500アカウント拡張時の受け皿設計

- 運用リスクと軽減策

## 2. Scope

本章の対象範囲は、Growth Lab Coreで使用するWordPress基盤全体である。

対象範囲は以下を含む。

- WordPressサイト管理

- WordPress Site Registry

- WordPressサイトとSNS Accountの紐付け

- WordPressサイトとCampaignの紐付け

- WordPress記事管理

- Article Registry

- カテゴリ管理

- Landing Page管理

- Affiliate Link Registry

- SEO方針

- 表示速度方針

- モバイル表示方針

- セキュリティ方針

- バックアップ方針

- WordPress REST API連携方針

- WordPressからAnalyticsへのデータ連携方針

- AIによる記事作成支援、改善提案

- SNSからWordPressへの流入管理

- WordPress Scale Gate

本章では、具体的なWordPressテーマ設定、プラグイン設定手順、記事本文テンプレート、サーバー契約手順、ASP案件ごとの詳細条件、各画面の操作手順までは定義しない。
それらは、WordPress運用マニュアル、SEOガイドライン、記事制作ガイドライン、ASP管理マニュアル、API and OAuth章、Analytics and KPI章、Security章、または下位仕様で定義する。

## 3. Non-Goals

本章では、以下を対象外とする。

- WordPressの具体的なインストール手順

- Xserverの契約手順

- DNSの具体的な設定値

- WordPressテーマの詳細設定

- WordPressプラグインの個別操作手順

- 記事本文テンプレートの詳細作成

- SEOライティングの詳細マニュアル

- ASP案件ごとの個別規約解説

- 広告タグの個別設定手順

- Google AnalyticsやSearch Consoleの画面操作手順

- WordPressのPHPコード実装詳細

- データベースの物理テーブル定義

- 顧客向け問い合わせフォームの詳細仕様

- SNSアカウント運用の詳細手順

- メールアカウント運用の詳細手順

これらは、下位の運用マニュアル、実装仕様、API and OAuth章、Analytics and KPI章、Security章で定義する。

## 4. Background

Growth Lab Coreでは、SNSを単独の集客チャネルとして扱わない。

SNS投稿は、WordPress上の owned media へ流入を作り、記事、LP、比較ページ、レビュー、ランキング、FAQ、アフィリエイト導線へ接続するための入口として扱う。

SNSから直接アフィリエイトリンクを投稿できない、または制限される場合でも、WordPress記事やLPを経由することで、以下を実現しやすくなる。

- 規約遵守

- 記事資産の蓄積

- SEO流入の獲得

- アフィリエイト導線の整理

- 計測の安定化

- AI改善の蓄積

- SNSごとの成果比較

- 長期的なメディア価値の向上

初期段階では、SNS運用20アカウント規模を前提に、WordPress側の受け皿を構築する。
将来的には、SNSアカウント数、記事数、カテゴリ数、LP数、アフィリエイトリンク数、アクセス数、CV、売上、運用負荷を確認しながら、100から500アカウント規模のSNS流入にも対応できる構成にする。

## 5. Alignment with Architecture Principles

本章は、01_Architecture_Principles.md で定義した原則に従う。

特に、WordPress基盤では以下を重視する。

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

WordPress基盤における優先順位は以下である。

1. 規約遵守
2. セキュリティ
3. 正本管理
4. SEO資産性
5. ユーザー体験
6. 計測可能性
7. API First
8. 拡張性
9. コスト最適化
10. AI活用
11. 自動化
12. 継続改善

WordPress記事、LP、アフィリエイトリンク、広告表現、SEO施策は、ASP規約、広告表現、法令、検索品質、ユーザー体験を損なわない範囲で運用する。

## 6. WordPress Platform Vision

Growth Lab CoreのWordPress基盤は、SNS流入を受け止め、アフィリエイト成果とSEO資産へ接続する owned media foundation である。

WordPress Platform
    |
    +-- Owned Media
    +-- Article Management
    +-- Landing Page Management
    +-- Affiliate Link Management
    +-- SEO Asset Management
    +-- SNS Traffic Receiver
    +-- Analytics Source
    +-- AI Improvement Target
    +-- Conversion Path

WordPress基盤の基本サイクルは以下である。

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
  |
  v
Article / SNS / Campaign Update

Growth Lab Coreでは、WordPressサイトを単独のブログではなく、SNS、Campaign、Post、Affiliate Link、KPIと接続された中核メディアとして管理する。

## 7. Overall WordPress Architecture

Growth Lab CoreのWordPress基盤は、以下の構成を基本とする。

SNS Platforms
    |
    +-- X
    +-- Instagram
    +-- TikTok
    +-- YouTube
    +-- Facebook
    +-- Threads
    +-- Pinterest
            |
            v
WordPress Platform
    |
    +-- Hosting Environment
    |       +-- Xserver Candidate
    |
    +-- WordPress
    |       +-- Theme
    |       +-- Plugin
    |       +-- Article
    |       +-- Category
    |       +-- Landing Page
    |       +-- Affiliate Link
    |       +-- SEO Metadata
    |       +-- Analytics Tags
            |
            v
Growth Lab Core
    |
    +-- WordPress Site Registry
    +-- Article Registry
    +-- Affiliate Link Registry
    +-- Campaign Management
    +-- SNS Account Registry
    +-- Post Management
    +-- Analytics Engine
    +-- KPI Engine
    +-- AI Engine
    +-- Monitoring
    +-- Audit Log

WordPress本体、テーマ、プラグイン、サーバー環境はExternal Service Layerとして扱う。
Growth Lab Core本体では、WordPress Site、Article、Landing Page、Campaign、Affiliate Link、KPI、状態、変更履歴を管理する。

## 8. WordPress Platform Components

WordPress基盤は、以下のコンポーネントで構成する。

### 8.1 Hosting Environment

WordPressを稼働させるホスティング環境である。

初期候補はXserverとする。
ただし、最終判断は、安定性、表示速度、バックアップ、セキュリティ、WordPress運用、メール機能、DNS管理、コスト、サポートを比較して行う。

### 8.2 WordPress Core

WordPress本体である。

WordPressは、Growth Lab Coreの標準CMSとして扱う。

### 8.3 Theme

表示デザイン、記事テンプレート、カテゴリページ、LP、モバイル表示の基礎となる要素である。

テーマ選定では、以下を重視する。

- 表示速度

- モバイル対応

- SEO対応

- 保守性

- セキュリティ

- カスタマイズ性

- 過剰な依存を避けること

### 8.4 Plugin

WordPress機能を拡張する要素である。

プラグイン利用では、以下を確認する。

- 必要性

- 更新頻度

- セキュリティ

- 互換性

- 表示速度への影響

- 代替手段

- 削除時の影響

### 8.5 Article

SEO流入、SNS流入、アフィリエイト誘導、情報提供の中心となるコンテンツである。

### 8.6 Landing Page

特定キャンペーン、商品、比較、ランキング、申込導線に特化したページである。

### 8.7 Category and Tag

記事群を整理し、SEO構造、内部リンク、ユーザー導線を管理するための分類である。

### 8.8 Affiliate Link

ASP、案件、商品、成果地点に紐付くリンクである。

Affiliate Linkは、記事本文の一部として埋め込むだけでなく、管理対象として扱う。

### 8.9 Analytics Tags

アクセス解析、クリック計測、CV計測、広告タグ、Search Console連携などの計測要素である。

### 8.10 WordPress REST API

Growth Lab CoreとWordPressを連携する公式APIである。

WordPress連携では、WordPress REST APIを優先する。

## 9. Responsibility Boundary

WordPress基盤では、各要素の責任範囲を明確に分離する。

### 9.1 Growth Lab Core Responsibilities

Growth Lab Coreが責任を持つ範囲は以下である。

- WordPress Site Registry管理

- Article Registry管理

- Affiliate Link Registry管理

- WordPress SiteとSNS Accountの紐付け管理

- WordPress SiteとCampaignの紐付け管理

- Article情報管理

- Landing Page情報管理

- Affiliate Link情報管理

- KPI管理

- Analytics情報管理

- AI提案管理

- 変更履歴管理

- 監査ログ管理

- WordPress関連リスク状態管理

### 9.2 WordPress Responsibilities

WordPressが責任を持つ範囲は以下である。

- 記事本文の表示

- カテゴリ表示

- タグ表示

- メディア表示

- ユーザー管理

- テーマ反映

- プラグイン動作

- REST API提供

- 管理画面操作

WordPress管理画面は運用画面であり、Growth Lab Coreにおける正本管理台帳ではない。

### 9.3 Hosting Provider Responsibilities

ホスティング事業者が責任を持つ範囲は以下である。

- サーバー稼働

- PHP、MySQLなどの実行環境

- サーバー管理画面

- DNS管理補助

- SSL設定

- バックアップ機能

- セキュリティ機能

- 障害対応範囲

### 9.4 Human Operator Responsibilities

人間の運用担当者が責任を持つ範囲は以下である。

- WordPressサイト作成判断

- テーマ採用判断

- 重要プラグイン採用判断

- 記事公開承認

- LP公開承認

- アフィリエイトリンク利用承認

- 広告表現確認

- SEO方針確認

- WordPress Scale Gate Review

- 重要なADR承認

### 9.5 AI Assistant Responsibilities

AI Assistantが支援する範囲は以下である。

- 記事案作成

- 見出し案作成

- リード文案作成

- メタディスクリプション案作成

- 内部リンク案作成

- SNS投稿連携案作成

- SEO改善案作成

- KPI分析補助

- リライト提案

- Codex / Claude Code作業指示書作成補助

AI Assistantは、重要判断を単独で確定しない。

### 9.6 Codex and Claude Code Responsibilities

Codexは、確定済み仕様の反映、台帳テンプレート作成、CHANGELOG更新、バックアップ作成を支援する。

Claude Codeは、仕様書とADRに基づいて、WordPress基盤に関する実装、検証、自動化、スクリプト作成を支援する。

CodexおよびClaude Codeは、上位設計判断を単独で変更しない。

## 10. WordPress Site Types

Growth Lab Coreでは、WordPressサイトを用途別に分類する。

### 10.1 Main Media Site

主要なowned mediaとして運用するWordPressサイトである。

主な用途は以下である。

- SEO記事

- アフィリエイト記事

- 比較記事

- ランキング記事

- SNS流入受け皿

- キャンペーン導線

### 10.2 Theme Media Site

特定テーマ、ジャンル、ターゲット、SNSアカウント群に紐付くWordPressサイトである。

SNS Theme Accountと連携して、特定領域の流入と成果を比較する。

### 10.3 Landing Page Site

キャンペーン、商品、案件、比較、申込導線に特化したLP中心のサイトである。

### 10.4 Test Site

検証用WordPressサイトである。

本番アフィリエイト導線、本番SEO評価、本番KPIには原則使用しない。

### 10.5 Archived Site

運用終了済み、または一時停止中のWordPressサイトである。

削除前に、記事、リンク、KPI、SNS導線、バックアップ、ASP関連情報を確認する。

## 11. WordPress Site Registry

WordPress Site Registryは、WordPress基盤のSingle Source of Truthである。

初期段階ではGoogle SheetsまたはMarkdown台帳で管理し、将来的にはGrowth Lab Core Databaseへ移行する。

### 11.1 Required Fields

WordPress Site Registryには、以下を記録する。

WordPress Site ID
Site Name
Domain
Site Type
Hosting Provider
Environment
Related SNS Account ID
Related Identity ID
Related Campaign ID
Related Category
Primary Theme
Key Plugins
Analytics Setup Flag
Search Console Setup Flag
Affiliate Program
Status
Risk Level
Created Date
Last Checked Date
Backup Status
Security Status
Owner
Notes
Change History

### 11.2 Registry Rules

台帳管理のルールは以下である。

- 本番利用するWordPressサイトは必ず登録する。

- 未登録WordPressサイトを本番SNS導線に使わない。

- 関連SNS Accountを記録する。

- 関連Campaignを記録する。

- 関連Affiliate Programを記録する。

- ステータス変更時は更新する。

- テーマ変更時は更新する。

- 主要プラグイン変更時は更新する。

- Analytics設定変更時は更新する。

- Search Console設定変更時は更新する。

- Secret実体を記録しない。

- WordPress管理画面を正本として扱わない。

### 11.3 Migration to Database

サイト数、記事数、SNSアカウント数が増えた場合、WordPress Site RegistryはDatabaseへ移行する。

移行判断の目安は以下である。

- 複数サイトを本番運用する。

- SNS Accountとの紐付け管理が複雑化する。

- Campaignとの紐付け管理が必要になる。

- ArticleやLPとの連携が必要になる。

- AnalyticsやKPIとの連携が必要になる。

- 手動台帳の更新漏れが増える。

- 監査ログとの連携が必要になる。

## 12. Article Registry

Article Registryは、WordPress記事情報の管理台帳である。

記事本文そのものはWordPressに存在するが、Growth Lab Coreでは記事の運用情報、SNS連携、Campaign連携、KPI、改善履歴を管理する。

### 12.1 Required Fields

Article Registryには、以下を記録する。

Article ID
WordPress Site ID
WordPress Post ID
Title
Slug
Category
Tag
Article Type
Target Keyword
Related SNS Account ID
Related Campaign ID
Related Affiliate Link ID
Status
Published URL
Published Date
Last Updated Date
AI Draft Flag
Human Review Status
SEO Status
Analytics Status
KPI Summary
Owner
Notes
Change History

### 12.2 Article Types

記事タイプは以下を基本とする。

- Informational Article

- Review Article

- Comparison Article

- Ranking Article

- How-to Article

- FAQ Article

- Landing Article

- Campaign Article

- News Article

- Evergreen Article

### 12.3 Article Status

記事ステータスは以下を基本とする。

Planned
AI Drafted
Human Reviewed
Approved
Published
Measured
Improved
Needs Update
Archived
Deleted

### 12.4 Article Rules

記事管理のルールは以下である。

- 本番公開記事はArticle Registryに登録する。

- SNSから誘導する記事は関連SNS Accountを記録する。

- Campaignに使う記事は関連Campaignを記録する。

- アフィリエイトリンクを含む記事は関連Affiliate Linkを記録する。

- AI作成記事はAI Draft Flagを記録する。

- 公開前に人間レビューを行う。

- 更新履歴を残す。

- 古い記事は定期的に見直す。

## 13. Category and Site Structure Policy

WordPressサイトでは、カテゴリ、タグ、内部リンク、LP構造を整理する。

### 13.1 Category Principles

カテゴリ設計では、以下を重視する。

- ユーザーが理解しやすいこと。

- SEO構造として自然であること。

- SNSアカウントのテーマと対応しやすいこと。

- 記事数が増えても破綻しないこと。

- 重複カテゴリを作りすぎないこと。

- アフィリエイト導線と矛盾しないこと。

### 13.2 Tag Principles

タグ設計では、以下を重視する。

- 補助的な分類として使う。

- 乱用しない。

- SEO目的だけで大量作成しない。

- 記事群の横断整理に使う。

- 重複や表記ゆれを避ける。

### 13.3 Internal Link Policy

内部リンクでは、以下を確認する。

- 関連記事へ自然に誘導しているか。

- LPやCV導線へ過剰に誘導していないか。

- リンク切れがないか。

- 古い記事から新しい記事へ誘導できているか。

- 重要記事へ内部リンクが集まっているか。

## 14. Landing Page Policy

Landing Pageは、特定目的に対してCVを最大化するページである。

### 14.1 LP Use Cases

LPの用途は以下である。

- 商品紹介

- 比較

- ランキング

- 申込誘導

- キャンペーン

- SNS流入受け皿

- 特定ターゲット向け導線

- アフィリエイト成果向上

### 14.2 LP Rules

LP管理のルールは以下である。

- LPの目的を明確にする。

- 関連Campaignを記録する。

- 関連SNS Accountを記録する。

- 関連Affiliate Linkを記録する。

- CTAを明確にする。

- モバイル表示を確認する。

- 計測できる状態にする。

- 広告表現やASP規約に反しないことを確認する。

- 公開前に人間レビューを行う。

### 14.3 LP Status

LPステータスは以下を基本とする。

Planned
Drafted
Reviewed
Approved
Published
Measured
Improved
Paused
Archived
Deleted

## 15. Affiliate Link Management

Affiliate Linkは、WordPress基盤における重要な成果導線である。

### 15.1 Affiliate Link Registry

Affiliate Link Registryは、アフィリエイトリンクの管理台帳である。

初期段階ではGoogle SheetsまたはMarkdown台帳で管理し、将来的にはGrowth Lab Core Databaseへ移行する。

### 15.2 Required Fields

Affiliate Link Registryには、以下を記録する。

Affiliate Link ID
ASP Name
Program Name
Advertiser
Product or Service
Link URL
Tracking Parameter
Related WordPress Site ID
Related Article ID
Related Landing Page ID
Related Campaign ID
Status
Rule Notes
Created Date
Last Checked Date
Owner
Notes
Change History

### 15.3 Affiliate Link Rules

アフィリエイトリンク管理のルールは以下である。

- 利用するASPと案件を記録する。

- リンク先を確認する。

- 掲載可能媒体を確認する。

- SNS直接掲載可否を確認する。

- WordPress記事内の掲載位置を記録する。

- リンク切れを定期確認する。

- 成果計測できる状態を維持する。

- 規約違反の疑いがあるリンクは停止する。

### 15.4 Direct SNS Link Policy

SNS投稿に直接アフィリエイトリンクを掲載する場合は、ASP、案件、SNSプラットフォームの規約を確認する。

直接掲載が禁止または不明確な場合は、WordPress記事またはLPを経由する。

SNS Post
  |
  v
WordPress Article or LP
  |
  v
Affiliate Link

## 16. SNS to WordPress Relationship

WordPress Platformは、SNS Platformと密接に連携する。

### 16.1 Relationship Model

SNS Account
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
Conversion

### 16.2 Required Relationship

SNSからWordPressへ誘導する場合、以下を記録する。

- SNS Account ID

- SNS Post ID

- WordPress Site ID

- Article ID

- Landing Page ID

- Campaign ID

- Affiliate Link ID

- UTM Rule

- Published URL

- KPI Target

### 16.3 Relationship Rules

関係管理のルールは以下である。

- SNS投稿とリンク先記事の内容を一致させる。

- 無関係な記事へ誘導しない。

- リンク切れを防ぐ。

- UTMなどの計測ルールを統一する。

- 重要導線はKPIで確認する。

- 成果の低い導線は改善対象にする。

## 17. Campaign Relationship

WordPress記事やLPは、Campaignと紐付けて管理する。

### 17.1 Campaign Role

Campaignは、SNS投稿、WordPress記事、LP、Affiliate Link、KPIをまとめる単位である。

Campaign
    |
    +-- SNS Account
    +-- SNS Post
    +-- WordPress Article
    +-- Landing Page
    +-- Affiliate Link
    +-- KPI

### 17.2 Campaign Rules

Campaign管理のルールは以下である。

- Campaign IDを記録する。

- 関連SNS Accountを記録する。

- 関連Articleを記録する。

- 関連LPを記録する。

- 関連Affiliate Linkを記録する。

- KPIを定義する。

- 期間を定義する。

- 結果を記録する。

## 18. WordPress REST API Policy

WordPress連携では、WordPress REST APIを優先する。

### 18.1 API Use Cases

WordPress REST APIの利用候補は以下である。

- 記事下書き作成

- 記事ステータス取得

- 記事更新

- カテゴリ取得

- タグ取得

- メディアアップロード

- 公開URL取得

- 記事一覧取得

- メタ情報取得

### 18.2 API Rules

API利用時は以下を守る。

- 公式APIを優先する。

- 必要最小限の権限を使う。

- API利用ログを記録する。

- 失敗時はエラーを記録する。

- リトライ制限を設ける。

- 認証情報を平文保存しない。

- 本番公開前に人間レビューを行う。

- 直接DB操作を通常運用にしない。

### 18.3 API Unavailable Case

WordPress REST APIで対応できない場合は、以下を確認する。

- WordPress管理画面で対応できるか。

- 公式プラグインで対応できるか。

- テーマ設定で対応できるか。

- 手動運用で対応できるか。

- 直接DB操作が本当に必要か。

- ADRが必要か。

直接DB操作は原則として避ける。
必要な場合は、影響範囲、バックアップ、復旧手順、ADRを確認する。

## 19. SEO Policy

WordPress基盤では、SEOを長期的な資産形成として扱う。

### 19.1 SEO Principles

SEO方針は以下である。

- ユーザーに役立つ記事を作る。

- 検索意図に合う記事を作る。

- SNS流入だけに依存しない。

- カテゴリ構造を整理する。

- 内部リンクを整理する。

- 重複記事を避ける。

- 古い記事を更新する。

- 表示速度を維持する。

- モバイル表示を重視する。

- 過剰な広告やリンクを避ける。

### 19.2 SEO Metadata

管理対象は以下である。

- Title

- Meta Description

- Slug

- Heading Structure

- Category

- Tag

- Canonical

- Noindex Flag

- Structured Data

- Internal Links

- External Links

### 19.3 SEO Review

記事公開前または更新時に、以下を確認する。

- タイトルが内容と一致しているか。

- 見出し構成が自然か。

- 検索意図と記事内容が一致しているか。

- 不自然なキーワード詰め込みがないか。

- 内部リンクが適切か。

- アフィリエイトリンクが過剰でないか。

- モバイルで読みやすいか。

- 表示速度に問題がないか。

## 20. Performance and Mobile Policy

WordPressサイトでは、表示速度とモバイル体験を重視する。

### 20.1 Performance Principles

表示速度方針は以下である。

- 不要なプラグインを増やさない。

- 画像サイズを最適化する。

- キャッシュを適切に利用する。

- 外部スクリプトを増やしすぎない。

- テーマを重くしすぎない。

- 計測タグを管理する。

- 定期的に速度を確認する。

### 20.2 Mobile Principles

モバイル方針は以下である。

- スマートフォンで読みやすいこと。

- CTAが押しやすいこと。

- 画像が崩れないこと。

- 表が横にはみ出さないこと。

- 広告やリンクが邪魔にならないこと。

- ページ表示が遅すぎないこと。

### 20.3 Performance Monitoring

監視対象は以下である。

- ページ表示速度

- Core Web Vitals

- 画像サイズ

- プラグイン数

- 外部スクリプト数

- モバイル表示崩れ

- エラーページ

- リンク切れ

## 21. Security Policy

WordPress基盤は、攻撃対象になりやすいため、Security by Designを前提とする。

### 21.1 Key Security Rules

以下を必須とする。

- 管理者アカウントを厳格に管理する。

- 強いパスワードを使用する。

- 可能な範囲で2要素認証を設定する。

- 不要なユーザーを削除する。

- 不要なプラグインを削除する。

- WordPress本体、テーマ、プラグインを更新する。

- 管理画面アクセスを管理する。

- バックアップを取得する。

- 重要変更は記録する。

- 認証情報を平文保存しない。

### 21.2 Secret Types

以下はSecretとして扱う。

- WordPress管理者パスワード

- WordPress Application Password

- Database Credential

- FTP / SFTP Credential

- Hosting Control Panel Credential

- API Key

- OAuth Token

- Backup Access Credential

Secret実体をMarkdown仕様書、通常メモ、スプレッドシート、チャット履歴に平文で記録しない。

### 21.3 Access Control

WordPress権限は、役割に応じて分離する。

Administrator
Editor
Author
Contributor
Viewer
System Role

運用担当者が必要以上の管理者権限を持たないようにする。

## 22. Backup and Recovery Policy

WordPressサイトは、バックアップと復旧手順を前提に運用する。

### 22.1 Backup Targets

バックアップ対象は以下である。

- WordPress files

- Database

- Media files

- Theme settings

- Plugin settings

- Server configuration

- Exported content

- Important configuration notes

### 22.2 Backup Rules

バックアップ方針は以下である。

- 定期バックアップを行う。

- 重要変更前にバックアップを取得する。

- テーマ変更前にバックアップを取得する。

- プラグイン追加、削除、更新前にバックアップを検討する。

- 復旧手順を確認する。

- バックアップ保存先を記録する。

- Secretをバックアップ説明文に平文記載しない。

### 22.3 Recovery Workflow

復旧時は、以下の流れを基本とする。

Detect Issue
  |
  v
Identify WordPress Site
  |
  v
Confirm Backup
  |
  v
Confirm Impact Scope
  |
  v
Perform Approved Recovery
  |
  v
Verify Site
  |
  v
Record Action
  |
  v
Update Status

## 23. Analytics and KPI Policy

WordPress基盤では、アクセス、クリック、CV、売上、ROIを分析対象とする。

### 23.1 Required Metrics

取得対象の指標は以下である。

Site Metrics
- Sessions
- Users
- Page Views
- Landing Page Views
- Bounce Rate
- Engagement Time

Article Metrics
- Page Views
- Scroll
- Click
- Internal Link Click
- Affiliate Link Click
- Conversion Reference

Traffic Metrics
- Source
- Medium
- Campaign
- SNS Account
- SNS Post
- UTM
- Referrer

Business Metrics
- Conversion
- Revenue
- Cost
- ROI

### 23.2 KPI Usage

KPIは以下に利用する。

- 記事改善

- LP改善

- SNS投稿改善

- Campaign改善

- アフィリエイト導線改善

- SEO改善

- 内部リンク改善

- 低成果記事の整理

- 高成果記事の横展開

- WordPress Scale Gate判断

### 23.3 KPI Integrity

KPIを利用する場合は、以下を確認する。

- 取得元

- 取得日

- 対象期間

- 対象WordPress Site

- 対象Article

- 対象Landing Page

- 対象SNS Account

- 対象Campaign

- 計測方法

- 欠損有無

- 推定値か実測値か

## 24. AI Usage Policy

AIは、WordPress運用の企画、作成、改善、分析支援に利用する。

### 24.1 AI Use Cases

AIの主な利用範囲は以下である。

- 記事案作成

- 見出し案作成

- 構成案作成

- リード文案作成

- メタディスクリプション案作成

- FAQ案作成

- 比較表案作成

- 内部リンク案作成

- SNS投稿連携案作成

- SEO改善案作成

- リライト案作成

- KPI分析補助

- アフィリエイト導線改善案

- Codex / Claude Code作業指示書作成補助

### 24.2 AI Boundary

AIは支援機能であり、重要判断を単独で確定しない。

以下は人間レビューを必須とする。

- 新規WordPressサイト作成

- 記事公開

- LP公開

- アフィリエイトリンク掲載

- 広告表現に関係する内容

- 法令、規約、健康、金融など高リスク領域の内容

- テーマ変更

- 主要プラグイン変更

- SEO方針の大幅変更

- 大量記事公開

### 24.3 AI Output Management

AI出力は、以下の状態で管理する。

AI Proposed
Human Reviewed
Approved
Rejected
Modified
Published
Measured
Improved

AI提案、採用、却下、修正、公開、結果は、必要に応じて履歴に残す。

## 25. Automation Policy

Automation Engineは、WordPress運用の反復作業を支援する。

### 25.1 Automation Use Cases

自動化候補は以下である。

- 記事下書き作成

- 記事ステータス取得

- 投稿URL取得

- リンク切れ確認

- KPI取得

- 記事更新候補抽出

- Search Consoleデータ取得

- アクセス解析データ取得

- Affiliate Link確認

- バックアップ確認

- WordPress稼働確認

- レポート生成

### 25.2 Automation Boundary

自動化は、WordPress、ASP、分析ツール、API利用条件、セキュリティ方針に従う。

以下は自動化前に人間承認を必要とする。

- 記事公開

- LP公開

- 既存記事の大幅更新

- アフィリエイトリンクの一括変更

- テーマ変更

- プラグイン追加、削除、更新

- ユーザー権限変更

- バックアップからの復元

- SEO設定の大幅変更

- 大量記事生成または大量公開

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

## 26. WordPress Risk Management

WordPress基盤には、セキュリティ、表示速度、SEO、リンク切れ、規約違反、計測不備などのリスクがある。

### 26.1 Risk Levels

WordPress Siteには、以下のリスクレベルを持たせる。

Low
Medium
High
Critical

### 26.2 Risk Factors

リスク要因は以下である。

- 管理者権限が多すぎる。

- WordPress本体が古い。

- テーマが古い。

- プラグインが古い。

- 不要なプラグインが多い。

- バックアップが未確認。

- SSLに問題がある。

- 表示速度が遅い。

- モバイル表示が崩れている。

- リンク切れがある。

- アフィリエイトリンクが無効である。

- 計測タグが未設定である。

- Search Consoleが未設定である。

- 規約確認が必要な表現がある。

- セキュリティ通知がある。

### 26.3 Risk Handling

リスクが高い場合は、以下を行う。

- 公開停止または一時非公開

- 該当リンクの停止

- 該当記事の修正

- バックアップ確認

- セキュリティ確認

- テーマ、プラグイン確認

- 管理者権限確認

- KPI取得確認

- 対応履歴記録

- 必要に応じてADR作成

## 27. Compliance and Affiliate Policy

WordPress基盤は、ASP、広告主、SNS、検索エンジン、法令、広告表現ルールに従う。

### 27.1 Compliance Rules

以下を守る。

- ASP規約を確認する。

- 広告主ごとの掲載条件を確認する。

- アフィリエイトリンクの掲載可能媒体を確認する。

- SNS直接掲載可否を確認する。

- 記事表現が誤認を招かないことを確認する。

- 比較やランキングの根拠を明確にする。

- 過剰な広告表現を避ける。

- 必要な開示や注記を行う。

- 規約変更時は記事やリンクを見直す。

### 27.2 Prohibited Actions

以下は禁止する。

- ASP規約に反するリンク掲載

- 広告主条件に反する表現

- 誤認を招くランキングや比較

- 実態のないレビュー

- 計測不能なリンクの放置

- 無関係な記事からの強引な誘導

- リンク切れの放置

- Secretや管理情報の公開

- AI生成文の無レビュー公開

- 大量記事の無確認公開

## 28. Observability and Monitoring

WordPress基盤では、サイト状態、記事状態、リンク状態、KPI状態、セキュリティ状態を監視対象とする。

### 28.1 Monitoring Targets

監視対象は以下である。

- WordPress Site Status

- Hosting Status

- SSL Status

- Backup Status

- Security Status

- Plugin Update Status

- Theme Update Status

- Article Status

- Landing Page Status

- Affiliate Link Status

- Link Broken Status

- Analytics Tag Status

- Search Console Status

- Page Speed

- Mobile Display

- KPI Collection Status

### 28.2 Required Logs

記録対象は以下である。

- WordPress Site作成履歴

- テーマ変更履歴

- プラグイン変更履歴

- 記事作成履歴

- 記事更新履歴

- LP作成履歴

- Affiliate Link変更履歴

- API接続履歴

- KPI取得履歴

- バックアップ確認履歴

- セキュリティ対応履歴

- 障害対応履歴

### 28.3 Alert Conditions

以下の場合は通知または確認対象とする。

- WordPressサイトが表示されない。

- SSLに問題がある。

- バックアップが確認できない。

- 管理者ログインに異常がある。

- プラグインに重大な問題がある。

- テーマ更新で表示が崩れている。

- リンク切れが発生している。

- アフィリエイトリンクが無効である。

- KPI取得が止まっている。

- 表示速度が大きく低下している。

- モバイル表示が崩れている。

## 29. WordPress Data Model Overview

WordPress基盤の論理データモデルは以下である。

WordPress Site
    |
    +-- Article
    +-- Landing Page
    +-- Category
    +-- Tag
    +-- Media
    +-- Affiliate Link
    +-- Campaign
    +-- Analytics
    +-- KPI
    +-- Risk Status
    +-- Operation Log

SNSやIdentityとの関係は以下である。

Identity
    |
    +-- SNS Account
            |
            +-- SNS Post
                    |
                    v
WordPress Article or Landing Page

### 29.1 WordPress Site Entity

WordPress Siteは、サイト単位の管理エンティティである。

### 29.2 Article Entity

Articleは、WordPress記事単位の管理エンティティである。

### 29.3 Landing Page Entity

Landing Pageは、特定目的のCV導線ページ単位の管理エンティティである。

### 29.4 Affiliate Link Entity

Affiliate Linkは、ASP、案件、記事、LP、Campaignに紐付く成果導線管理エンティティである。

### 29.5 Analytics Entity

Analyticsは、WordPressアクセス、クリック、CV、収益、SNS流入を管理する。

### 29.6 Risk Status Entity

Risk Statusは、WordPressサイト、記事、LP、リンクに関連するリスク状態を管理する。

## 30. Scale Architecture

WordPress基盤は、SNSアカウント数、記事数、LP数、アクセス数、アフィリエイトリンク数の増加に合わせて段階的に拡張する。

### 30.1 Scale Stages

Stage 1: 初期WordPressサイトと20SNSアカウント受け皿
Stage 2: 複数カテゴリと21から50SNSアカウント受け皿
Stage 3: 複数サイトまたは複数メディアと51から100SNSアカウント受け皿
Stage 4: 101から300SNSアカウント流入に対応するメディア群
Stage 5: 301から500SNSアカウント流入に対応する高度なメディア運営基盤

### 30.2 Stage 1

初期段階では、以下を基本とする。

- Xserver候補

- WordPress標準CMS

- Main Media Site

- 基本カテゴリ

- WordPress Site Registry

- Article Registry

- Affiliate Link Registry

- 手動記事公開

- 手動KPI確認

- SNS導線確認

### 30.3 Stage 2

以下を追加検討する。

- カテゴリ整理

- LP作成

- SNS Account別導線管理

- UTM管理

- 記事更新ルール

- リンク切れ確認

- SEO改善ルール

### 30.4 Stage 3

以下を追加検討する。

- 複数サイト管理

- Database管理

- WordPress REST API連携

- KPI自動取得

- Search Console連携

- Affiliate Link自動確認

- レポート生成

### 30.5 Stage 4

以下を追加検討する。

- 複数メディア運用

- 高度な内部リンク設計

- 高度なLP管理

- 自動監視

- 高度なSEO改善

- AI改善提案

- 権限分離

### 30.6 Stage 5

以下を追加検討する。

- メディアポートフォリオ管理

- アカウント別受け皿最適化

- 低成果記事整理

- 高成果記事横展開

- 自動棚卸し

- 監査ログ強化

- 本格的なGrowth Lab Coreメディア運営基盤

## 31. WordPress Scale Gate

次のWordPress運用Stageへ進む前に、WordPress Scale Gate Reviewを行う。

WordPress Scale Gate Review

1. 現在のWordPressサイト数
2. 現在の記事数
3. 現在のLP数
4. 現在のSNSアカウント数
5. SNSからの流入状況
6. SEO流入状況
7. Affiliate Linkの管理状況
8. CVまたは成果状況
9. KPI取得状況
10. リンク切れ状況
11. 表示速度
12. モバイル表示
13. セキュリティ状態
14. バックアップ状態
15. 運用担当者の負荷
16. コスト
17. 次Stageへ進む必要性

WordPress Scale Gateを通過できない場合は、サイト数や記事数を増やさず、既存記事、導線、SEO、表示速度、セキュリティ、計測の改善を優先する。

## 32. Cost Optimization

WordPress基盤では、サーバー、テーマ、プラグイン、記事制作、AI利用、分析、人的運用コストのバランスを取る。

### 32.1 Cost Principles

コスト方針は以下である。

- 初期段階では過剰投資を避ける。

- Xserverなど低コストで安定した環境を第一候補にする。

- 有料テーマや有料プラグインは効果を確認して導入する。

- 記事制作コストと成果を比較する。

- AI利用コストをKPIと比較する。

- 表示速度やセキュリティを犠牲にした低コスト化を避ける。

- 成果の低い記事やLPを増やし続けない。

### 32.2 Cost Items

確認すべき費用項目は以下である。

- ドメイン費用

- レンタルサーバー費用

- WordPressテーマ費用

- WordPressプラグイン費用

- SSL費用

- バックアップ費用

- セキュリティ対策費用

- 記事制作費用

- AI生成費用

- 分析ツール費用

- 人的運用コスト

- 障害対応コスト

### 32.3 Cost Risk

安さだけを優先すると、以下のリスクがある。

- 表示速度が遅い。

- セキュリティが弱い。

- バックアップが不十分。

- 復旧できない。

- SEO評価が下がる。

- 管理が複雑化する。

- 成果の低い記事を増やし続ける。

## 33. Operations Policy

WordPress基盤の日常運用では、以下を行う。

### 33.1 Regular Checks

定期確認項目は以下である。

- WordPress Site Registry更新状況

- Article Registry更新状況

- Affiliate Link Registry更新状況

- SNS Accountとの紐付け状況

- Campaignとの紐付け状況

- 公開記事状況

- LP状況

- リンク切れ

- アフィリエイトリンク有効性

- 表示速度

- モバイル表示

- セキュリティ通知

- バックアップ状態

- KPI取得状況

- 低成果記事

### 33.2 Change Management

以下の変更は記録する。

- WordPressサイト作成

- WordPressサイト削除

- ドメイン変更

- テーマ変更

- プラグイン追加、削除、更新

- 記事公開

- 記事更新

- LP公開

- Affiliate Link変更

- Analytics設定変更

- Search Console設定変更

- 関連SNS Account変更

- Campaign紐付け変更

### 33.3 Site Retirement

WordPressサイトを廃止する場合は、以下を確認する。

- 関連SNS Account

- 関連Campaign

- 記事履歴

- LP履歴

- Affiliate Link

- KPI履歴

- バックアップ

- リダイレクト要否

- Search Console影響

- 削除前の保管要件

- WordPress Site Registry更新

## 34. Incident Handling

WordPress基盤で障害や異常が発生した場合、以下の流れで対応する。

Detect
  |
  v
Identify WordPress Site
  |
  v
Identify Related Article or LP
  |
  v
Identify Related SNS Account
  |
  v
Check Hosting and WordPress Status
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

- サイトが表示されない。

- SSLエラーが発生する。

- 管理画面にログインできない。

- 記事が表示されない。

- LPが崩れている。

- モバイル表示が崩れている。

- リンク切れが発生している。

- アフィリエイトリンクが無効である。

- 表示速度が大きく低下する。

- プラグイン更新でエラーが発生する。

- テーマ更新で表示が崩れる。

- KPIが取得できない。

- 不審なログイン通知がある。

### 34.2 Incident Records

障害対応では、以下を記録する。

- 発生日

- 対象WordPress Site

- 対象Article

- 対象Landing Page

- 対象SNS Account

- 対象Campaign

- 発生内容

- 原因

- 対応内容

- 復旧結果

- 再発防止策

- 担当者

## 35. Integration with Other Chapters

本章は、以下の章と連携する。

### 35.1 02 Overall Architecture

WordPress基盤は、Growth Lab Core全体アーキテクチャのExternal Service Layer、Integration Layer、Application Layer、AI and Automation Layer、Analytics Engineに関係する。

### 35.2 03 Mail Platform

WordPress管理者メール、通知メール、復旧メール、ホスティング通知、ドメイン通知と連携する。
メールアカウントの詳細管理は03 Mail Platformで扱う。

### 35.3 04 SNS Platform

SNS投稿からWordPress記事、LP、アフィリエイト導線へ誘導する。
SNS Accountの詳細管理は04 SNS Platformで扱う。

### 35.4 06 AI Platform

AIによる記事案、見出し案、SEO改善案、リライト案、KPI分析補助を扱う。

### 35.5 07 Growth Lab Core System

WordPress Site Management、Article Management、Campaign Management、Scheduler、Automation Engine、Monitoringを扱う。

### 35.6 08 Database

WordPress Site Registry、Article Registry、Affiliate Link Registry、Campaign、Analytics、KPI、Risk StatusをDatabaseへ移行する。

### 35.7 09 API and OAuth

WordPress REST API、認証、Application Password、外部API、Analytics API、Search Console APIを扱う。

### 35.8 10 Security

WordPress管理者権限、Application Password、サーバー認証情報、バックアップ、監査ログを扱う。

### 35.9 11 Operations

WordPressサイト作成、記事公開、更新、バックアップ、復旧、棚卸し、削除の運用手順を扱う。

### 35.10 12 Analytics and KPI

WordPressアクセス、SNS流入、CV、Affiliate Linkクリック、ROI、SEO成果の分析を扱う。

## 36. Chapter Responsibility Boundary

本章では、WordPress基盤の上位設計を定義する。

詳細設計は、以下の章または下位文書で定義する。

05 WordPress Platform
    |
    +-- Defines:
    |       +-- WordPress platform architecture
    |       +-- WordPress site policy
    |       +-- WordPress Site Registry policy
    |       +-- Article Registry policy
    |       +-- Affiliate Link policy
    |       +-- SEO basic policy
    |       +-- WordPress REST API basic policy
    |       +-- Scale policy
    |
    +-- Does not define:
            +-- Detailed WordPress screen operation
            +-- Detailed theme settings
            +-- Detailed plugin settings
            +-- Detailed article writing manual
            +-- Detailed ASP operation
            +-- Detailed SNS account operation
            +-- Detailed mail account operation
            +-- Detailed database table design

詳細な手順は、Operations Manual、AI章、Database章、API and OAuth章、Security章、Analytics and KPI章で定義する。

## 37. Architecture Constraints

WordPress基盤では、以下の制約を前提とする。

- WordPressを標準CMSとして扱う。

- Xserverを初期ホスティング候補とする。

- WordPress Site Registryを正本とする。

- Article Registryを管理する。

- Affiliate Link Registryを管理する。

- WordPress管理画面を正本として扱わない。

- SNS Account Registryと整合させる。

- Campaignと紐付ける。

- ASP、広告主、SNS、検索エンジンの規約を遵守する。

- 公式APIであるWordPress REST APIを優先する。

- 直接DB操作を通常運用にしない。

- Secretを平文保存しない。

- 記事公開やLP公開には人間レビューを入れる。

- AI生成記事を無レビューで公開しない。

- バックアップと復旧手順を持つ。

- 拡張前にWordPress Scale Gate Reviewを行う。

- サイト数や記事数はKPIとリスクに基づいて最適化する。

## 38. Risks

本章に関連する主なリスクは以下である。

### 38.1 Risk: WordPress管理の破綻

サイト、記事、LP、リンク、Campaign、SNS導線が増え、管理関係が不明確になる可能性がある。

軽減策：

- WordPress Site Registryを作成する。

- Article Registryを作成する。

- Affiliate Link Registryを作成する。

- SNS Accountと紐付ける。

- Campaignと紐付ける。

- 定期的に棚卸しする。

### 38.2 Risk: セキュリティ事故

WordPress管理者アカウントやプラグイン脆弱性により、サイト改ざんや情報漏洩が発生する可能性がある。

軽減策：

- 管理者権限を制限する。

- 2要素認証を設定する。

- 不要ユーザーを削除する。

- 不要プラグインを削除する。

- WordPress本体、テーマ、プラグインを更新する。

- バックアップを取得する。

### 38.3 Risk: 表示速度低下

プラグイン、画像、外部スクリプト、広告タグにより表示速度が低下する可能性がある。

軽減策：

- 不要プラグインを削除する。

- 画像を最適化する。

- キャッシュを利用する。

- 外部スクリプトを管理する。

- 定期的に速度を確認する。

### 38.4 Risk: アフィリエイト規約違反

ASPや広告主の条件に反する掲載、誤認を招く表現、禁止されたSNS直接リンクが発生する可能性がある。

軽減策：

- ASP規約を確認する。

- 案件条件を記録する。

- 直接SNSリンク可否を確認する。

- WordPress経由導線を基本にする。

- 公開前に人間レビューを行う。

### 38.5 Risk: リンク切れ

記事内リンク、LP、アフィリエイトリンク、SNS投稿リンクが切れる可能性がある。

軽減策：

- リンク切れ確認を行う。

- Affiliate Link Registryを管理する。

- URL変更時に更新履歴を残す。

- 重要導線を定期確認する。

### 38.6 Risk: SEO資産の劣化

古い記事、重複記事、低品質記事、過剰広告によりSEO評価が下がる可能性がある。

軽減策：

- 記事を定期更新する。

- 重複記事を整理する。

- 低成果記事を改善または整理する。

- 内部リンクを見直す。

- ユーザー体験を重視する。

### 38.7 Risk: KPIが取得できない

AnalyticsやSearch Console、Affiliate Linkクリック、CVが取得できず、改善判断ができない可能性がある。

軽減策：

- 計測設定を確認する。

- 取得元を記録する。

- 欠損を記録する。

- 手動確認手段を用意する。

- Analytics章で取得方法を詳細化する。

### 38.8 Risk: AI生成記事の品質問題

AI生成記事が不正確、低品質、規約違反、誤認表現を含む可能性がある。

軽減策：

- 人間レビューを必須にする。

- 高リスク領域は慎重に扱う。

- 根拠を確認する。

- 広告表現を確認する。

- 公開後にKPIとユーザー反応を確認する。

## 39. Required Review Checklist

本章またはWordPress基盤を更新する場合は、以下を確認する。

WordPress Platform Review Checklist

1. WordPress基盤の全体方針が明確か
2. Xserver第一候補の位置付けが明確か
3. WordPress SiteとSNS Accountの関係が明確か
4. WordPress SiteとCampaignの関係が明確か
5. WordPress Site Registryが正本として定義されているか
6. Article Registryが定義されているか
7. Affiliate Link Registryが定義されているか
8. SNSからWordPressへの導線が定義されているか
9. WordPress REST API方針が定義されているか
10. SEO方針が定義されているか
11. 表示速度とモバイル方針が定義されているか
12. セキュリティ方針が定義されているか
13. バックアップと復旧方針が定義されているか
14. AI利用範囲が定義されているか
15. Automationの境界が定義されているか
16. Affiliate Link管理方針が定義されているか
17. Observabilityが定義されているか
18. WordPress Scale Gateが定義されているか
19. 下位章との責任分担が明確か
20. ADRが必要な判断が整理されているか

## 40. Review Points

本章のレビューでは、以下を確認する。

- WordPress基盤がGrowth Lab Coreのowned media基盤として定義されているか。

- SNS流入の受け皿として設計されているか。

- WordPress Site Registryが正本として明確か。

- Article、LP、Affiliate Linkが管理対象として定義されているか。

- SNS Account、Campaign、KPIと接続されているか。

- WordPress REST API Firstの方針が明確か。

- 直接DB操作を通常運用にしていないか。

- SEO、表示速度、モバイル、セキュリティが設計に含まれているか。

- バックアップと復旧方針があるか。

- AIとAutomationの境界が明確か。

- 20アカウントから100から500アカウント流入へ拡張できるか。

- WordPress Scale Gateが拡張判断に使える内容になっているか。

- 03 Mail Platform、04 SNS Platformと責任分界が明確か。

- Codex反映時に章構成が崩れにくい構成になっているか。

## 41. Architecture Decision Records

本章に関連するADRは以下の通りである。

Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core

本章に関連して、今後追加が想定されるADRは以下である。

```text
ADR-0005: Core Architecture Principles
ADR-0014: SNS to WordPress Affiliate Flow
ADR-0025: SNS Platform Architecture
ADR-0032: SNS to WordPress Traffic Flow Policy
ADR-0034: WordPress Platform Architecture
ADR-0035: Xserver Initial Hosting Policy
ADR-0036: WordPress Site Registry Policy
ADR-0037: Article Registry Policy
ADR-0038: Affiliate Link Registry Policy
ADR-0039: WordPress REST API Policy
ADR-0040: WordPress SEO and Performance Policy
ADR-0041: WordPress Backup and Recovery Policy
ADR-0042: WordPress Scale Gate Policy
```

以下の判断を変更する場合は、ADR作成を検討する。

- WordPressを標準CMSとする方針の変更

- Xserver第一候補方針の変更

- WordPress Site Registryの正本変更

- WordPress REST API以外の連携方式採用

- 直接DB操作の通常運用化

- Affiliate Link管理方式の変更

- SNSからWordPressへの導線方針変更

- SEO方針の大幅変更

- バックアップ方式の大幅変更

- 大量サイト運用Stageへの移行
