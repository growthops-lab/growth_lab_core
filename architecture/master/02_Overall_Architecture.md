# 02 Overall Architecture

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/02_Overall_Architecture.md

## 1. Purpose

本章の目的は、Growth Lab Core 全体のシステムアーキテクチャを定義することである。

Growth Lab Core は、AIを活用したメディア運営プラットフォームであり、SNS、メール、WordPress、分析、AI、自動化、セキュリティ、運用管理を統合する「SNS運用OS」として設計する。

本章では、Growth Lab Core を構成する主要コンポーネント、外部サービス、データフロー、Identity中心設計、拡張方針、運用境界、セキュリティ境界を定義する。

本章は、以下の下位章の親アーキテクチャとして機能する。

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

本章は、Growth Lab Core全体を理解するための上位構造を示す章であり、個別サービスの詳細設定や実装手順は各下位章で定義する。

## 2. Scope

本章の対象範囲は、Growth Lab Core 全体の論理構成と主要な連携関係である。

対象範囲は以下を含む。

- Growth Lab Core の全体構成

- SNS運用OSとしての基本構造

- Identity中心の管理モデル

- SNS、メール、WordPress、AI、分析、運用の関係

- 外部サービスとの接続方針

- API、OAuth、Webhookの基本方針

- Scheduler、Queue、Automationの基本方針

- Database、Storage、Secret管理の基本方針

- Observability、ログ、監査の基本方針

- 20アカウントから100から500アカウントへの段階的拡張方針

- Codex / Claude Codeとの責任分界

- 仕様書、ADR、CHANGELOGとの関係

本章では、個別サービスの契約手順、画面操作、API実装コード、WordPressテーマ設定、SNS投稿文テンプレートの詳細までは定義しない。

## 3. Non-Goals

本章では、以下を対象外とする。

- 各SNSの個別アカウント作成手順

- Google Workspaceの詳細設定手順

- エックスサーバーの詳細設定手順

- WordPressのテーマ、プラグイン、記事テンプレートの詳細設計

- 各SNS APIの具体的なエンドポイント仕様

- データベースの物理テーブル定義

- Secret管理ツールの具体的な製品選定

- 投稿文、画像、動画、広告クリエイティブの制作ルール

- 運用担当者向けの日次作業手順

- 障害対応マニュアルの詳細手順

これらは下位章、実装仕様書、運用マニュアルで定義する。

## 4. Background

Growth Lab Core は、SNSアカウントを単体で管理するためのツールではない。

Growth Lab Core は、SNSを起点として、WordPress上のアフィリエイトブログへユーザーを誘導し、AIによる投稿生成、分析、改善提案、KPI管理、運用自動化を行う統合プラットフォームである。

初期段階では、20アカウント規模のSNS運用基盤を構築する。
ただし、将来的には運用効果、KPI、ROI、運用負荷、リスクを確認しながら、100から500アカウント規模まで拡張できる構造を採用する。

一方で、アカウント数を増やすこと自体を目的とはしない。
Growth Lab Core は、アカウント数、投稿数、流入数、CV、売上、運用コスト、停止リスクを総合的に分析し、最適なアカウント数と運用方式を判断する。

## 5. Alignment with Architecture Principles

本章の全体アーキテクチャは、01_Architecture_Principles.md で定義した以下の原則に従う。

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

特に本章では、以下の優先順位を重視する。

1. Compliance First
2. Security by Design
3. Single Source of Truth
4. API First
5. Observability
6. Scalability
7. Cost Optimization
8. AI First
9. Automation First
10. Continuous Improvement

自動化、AI活用、アカウント拡張は、規約遵守、セキュリティ、正本管理、監査可能性の範囲内で実施する。

## 6. Architecture Vision

Growth Lab Core の最終像は、AIを活用したメディア運営OSである。

このOSは、以下を統合管理する。

- SNSアカウント

- メールアドレス

- Identity

- WordPressサイト

- アフィリエイト導線

- 投稿コンテンツ

- 画像・動画などのメディア

- スケジュール

- KPI

- 分析データ

- AI改善提案

- 自動化タスク

- ログ

- セキュリティ

- 運用マニュアル

- ADR

- 仕様書

Growth Lab Core の基本思想は以下である。

SNS
  |
  v
WordPress Media
  |
  v
Affiliate Conversion
  |
  v
Analytics
  |
  v
AI Improvement
  |
  v
Next Action

Growth Lab Core は、このサイクルを継続的に回し、SNS運用とメディア運営を改善する。

## 7. Overall Architecture Overview

Growth Lab Core の全体構成は、以下のように定義する。

External Platforms
    |
    +-- SNS Platforms
    |       +-- X
    |       +-- Instagram
    |       +-- TikTok
    |       +-- YouTube
    |       +-- Facebook
    |       +-- Threads
    |       +-- Pinterest
    |
    +-- Mail Platform
    |       +-- Independent Domain Mail
    |       +-- Mail Forwarding
    |       +-- Gmail
    |       +-- Google Workspace
    |
    +-- WordPress Platform
    |       +-- Xserver
    |       +-- WordPress
    |       +-- Affiliate Blog
    |
    +-- Analytics Platforms
    |       +-- Web Analytics
    |       +-- SNS Analytics
    |       +-- Affiliate Reports
    |
    +-- AI Services
            +-- Text Generation
            +-- Image Generation
            +-- Analysis Support

Growth Lab Core
    |
    +-- User Interface
    +-- API Layer
    +-- Integration Layer
    +-- Identity Management
    +-- Account Management
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
    +-- Database
    +-- Secret Management
    +-- Documentation Management

この構成では、外部サービスとGrowth Lab Core本体を明確に分離する。
外部サービスへの接続は、原則としてIntegration Layerを通じて行う。

## 8. Architecture Layers

Growth Lab Core は、以下のレイヤー構造で設計する。

Layer 1: External Service Layer
Layer 2: Integration Layer
Layer 3: Application Layer
Layer 4: AI and Automation Layer
Layer 5: Data Layer
Layer 6: Security and Governance Layer
Layer 7: Operations and Observability Layer

### 8.1 External Service Layer

外部サービスを扱うレイヤーである。

対象は以下を含む。

- SNSプラットフォーム

- メールサービス

- Google Workspace

- WordPress

- レンタルサーバー

- アフィリエイトASP

- 分析ツール

- AIサービス

### 8.2 Integration Layer

外部サービスとの接続を管理するレイヤーである。

対象は以下を含む。

- API Client

- OAuth Client

- Webhook Receiver

- Mail Adapter

- SNS Adapter

- WordPress Adapter

- Analytics Adapter

- Affiliate Adapter

- AI Service Adapter

外部サービスごとの仕様変更をGrowth Lab Core本体へ直接影響させないため、Integration Layerを疎結合に設計する。

### 8.3 Application Layer

Growth Lab Coreの主要機能を提供するレイヤーである。

対象は以下を含む。

- Identity Management

- SNS Account Management

- Mail Account Management

- Campaign Management

- Post Management

- Media Management

- WordPress Content Management

- KPI Management

- Task Management

- Documentation Management

### 8.4 AI and Automation Layer

AIと自動化を管理するレイヤーである。

対象は以下を含む。

- AI Engine

- Prompt Management

- Content Generation

- Analysis Support

- Recommendation Engine

- Scheduler

- Queue

- Automation Engine

- Approval Workflow

AIと自動化は、Compliance First、Security by Design、API Firstの範囲内で実行する。

### 8.5 Data Layer

Growth Lab Coreのデータを管理するレイヤーである。

対象は以下を含む。

- Database

- Object Storage

- Log Storage

- Analytics Storage

- Backup

- Data Export

### 8.6 Security and Governance Layer

セキュリティとガバナンスを管理するレイヤーである。

対象は以下を含む。

- IAM

- Role Based Access Control

- Secret Management

- Audit Log

- Policy Management

- ADR

- Document Governance

### 8.7 Operations and Observability Layer

運用と監視を管理するレイヤーである。

対象は以下を含む。

- System Log

- Error Log

- API Log

- Auth Log

- Automation Log

- Health Check

- Alert

- Incident Management

- Maintenance

## 9. Core Components

Growth Lab Core は、以下の主要コンポーネントで構成する。

### 9.1 User Interface

運用担当者がGrowth Lab Coreを操作するための画面である。

主な機能は以下である。

- アカウント一覧

- Identity一覧

- 投稿管理

- スケジュール管理

- KPI確認

- エラー確認

- AI提案確認

- 承認作業

- 設定管理

### 9.2 API Layer

Growth Lab Core内部の機能を安全に利用するためのAPI層である。

主な役割は以下である。

- UIとBackendの接続

- 外部連携の入口

- 権限確認

- 入力検証

- レート制御

- ログ記録

### 9.3 Integration Layer

外部サービスとの接続を管理する層である。

対象は以下である。

- SNS API

- Mail API

- Google API

- WordPress REST API

- Affiliate API

- Analytics API

- AI API

Integration Layerは、外部サービスの仕様変更を吸収する役割を持つ。

### 9.4 Identity Management

Growth Lab Coreの中核となる管理単位である。

Identityは、メール、SNSアカウント、認証、トークン、状態、運用履歴を結び付ける。

Identity
    |
    +-- Mail Account
    +-- SNS Account
    +-- Credential Reference
    +-- OAuth Token Reference
    +-- TOTP Reference
    +-- Recovery Information Reference
    +-- Account Status
    +-- Operation History

Identityを中心に設計することで、アカウント数が増えても管理構造を維持できる。

### 9.5 Account Management

SNSアカウントとメールアカウントを管理する機能である。

主な管理項目は以下である。

- アカウントID

- メールアドレス

- SNS種別

- 表示名

- プロフィールURL

- ステータス

- 作成日

- 最終確認日

- 担当者

- 連携状態

- リスク状態

### 9.6 Campaign Management

SNS投稿、WordPress記事、アフィリエイト導線、KPIをキャンペーン単位で管理する機能である。

主な管理項目は以下である。

- Campaign ID

- Campaign Name

- Target SNS

- Target WordPress Page

- Affiliate Link

- KPI

- Period

- Budget

- Status

### 9.7 Post Management

SNS投稿とWordPress記事の投稿計画を管理する機能である。

主な管理項目は以下である。

- Post ID

- Platform

- Account

- Content

- Media

- Target URL

- Schedule

- Approval Status

- Publish Status

- Performance

### 9.8 Media Management

画像、動画、サムネイル、バナー、素材を管理する機能である。

主な管理項目は以下である。

- Media ID

- File Name

- File Type

- Source

- Usage

- License Status

- Related Post

- Related Campaign

### 9.9 AI Engine

AIによる生成、分析、改善提案を行う中核機能である。

主な機能は以下である。

- 投稿案生成

- 記事構成案生成

- 画像案生成

- KPI分析

- 改善提案

- リスク検知

- ABテスト分析

- Codex / Claude Code 作業指示書作成支援

AI Engineは、人間承認が必要な処理を自動実行しない。

### 9.10 Scheduler

投稿、分析、確認、通知、バックアップなどの定期処理を管理する機能である。

主な機能は以下である。

- 投稿予約

- KPI収集

- メール確認

- アカウント状態確認

- レポート生成

- バックアップ

- ヘルスチェック

### 9.11 Automation Engine

反復作業や定型作業を自動実行する機能である。

Automation Engineは、必ず以下を持つ。

- 実行条件

- 停止条件

- リトライ制限

- ログ

- エラー処理

- 手動停止手段

- 人間承認条件

### 9.12 Analytics Engine

SNS、WordPress、アフィリエイト、AI、運用データを分析する機能である。

主な分析対象は以下である。

- Impression

- Reach

- Engagement

- Click

- CTR

- Conversion

- CVR

- Revenue

- Cost

- ROI

- Account Performance

- Campaign Performance

### 9.13 KPI Engine

KPIを定義し、追跡し、改善判断に活用する機能である。

KPI Engineは、アカウント数を増やすべきか、維持すべきか、減らすべきかを判断するための材料を提供する。

### 9.14 Monitoring and Alert

システム状態、API状態、認証状態、投稿状態、アカウント状態を監視する機能である。

主な監視対象は以下である。

- API Error

- Auth Error

- Token Expiration

- Account Restriction

- Post Failure

- Scheduler Failure

- Automation Failure

- Security Event

- Data Collection Failure

### 9.15 Documentation Management

仕様書、ADR、CHANGELOG、運用マニュアル、Codex作業指示書を管理する機能である。

Markdownを正本とし、Word/PDFは出力物として扱う。

## 10. Responsibility Boundary

Growth Lab Coreでは、各要素の責任範囲を明確に分離する。

### 10.1 Growth Lab Core Responsibilities

Growth Lab Core が責任を持つ範囲は以下である。

- Identity管理

- アカウント状態管理

- 投稿計画管理

- KPI管理

- AI提案管理

- Automation管理

- Scheduler管理

- ログ管理

- 監査管理

- 仕様書管理

- ADR管理

### 10.2 External Platform Responsibilities

外部サービス側が責任を持つ範囲は以下である。

- SNSプラットフォーム上のアカウント仕様

- API提供条件

- OAuth仕様

- 投稿制限

- アカウント審査・制限

- メール配送仕様

- WordPress実行環境

- アフィリエイト成果計測仕様

Growth Lab Coreは、外部サービス仕様を制御できない。
そのため、外部仕様変更を前提にIntegration Layerと運用監視を設計する。

### 10.3 Human Operator Responsibilities

人間の運用担当者が責任を持つ範囲は以下である。

- 重要な設計判断

- 投稿内容の最終承認

- アカウント作成・削除の判断

- セキュリティ例外の判断

- 規約変更時の対応判断

- ADR承認

- 運用改善判断

### 10.4 AI Assistant Responsibilities

AI Assistant が支援する範囲は以下である。

- 投稿案作成

- 記事案作成

- 改善案作成

- KPI分析補助

- 仕様書作成補助

- Codex / Claude Code 指示書作成補助

AI Assistantは、重要判断を単独で確定しない。

### 10.5 Codex and Claude Code Responsibilities

Codexは、確定済み仕様の反映、ファイル更新、バックアップ、CHANGELOG更新を担当する。

Claude Codeは、仕様書とADRに基づく実装、コード修正、検証を担当する。

CodexおよびClaude Codeは、上位設計判断を単独で変更しない。

## 11. Identity-Centric Architecture

Growth Lab Coreでは、Identityを中心にシステムを設計する。

Identityは、単なるユーザー情報ではない。
Growth Lab CoreにおけるIdentityは、SNS運用に必要なメール、SNSアカウント、認証情報、API連携、状態、履歴を結び付ける管理単位である。

Identity
    |
    +-- Mail Address
    +-- SNS Account
    +-- Platform
    +-- Credential Reference
    +-- OAuth Token Reference
    +-- Recovery Reference
    +-- Status
    +-- Risk Level
    +-- Activity Log
    +-- KPI Summary

Identity中心設計を採用する理由は以下である。

- 1メールアドレスにつき1SNSアカウントの管理がしやすい。

- アカウント停止時の影響範囲を限定しやすい。

- 認証情報とアカウント情報を分離できる。

- SNS種別をまたいだ管理が可能になる。

- 将来100から500アカウントへ拡張しやすい。

- ログ、KPI、運用履歴を紐付けやすい。

- 復旧手順を標準化しやすい。

## 12. Data Flow Overview

Growth Lab Coreの基本データフローは以下である。

Planning
  |
  v
AI Content Draft
  |
  v
Human Review
  |
  v
Schedule
  |
  v
Publish to SNS
  |
  v
User Click
  |
  v
WordPress Affiliate Blog
  |
  v
Affiliate Conversion
  |
  v
Analytics Collection
  |
  v
KPI Analysis
  |
  v
AI Improvement Proposal
  |
  v
Next Planning

### 12.1 Content Creation Flow

AIが投稿案や記事構成案を作成する。
必要に応じて人間がレビューし、承認後に投稿予定へ登録する。

### 12.2 Publishing Flow

投稿はSchedulerによって管理される。
SNSへの投稿は公式APIを優先する。
APIが利用できない場合は、利用規約に適合する方法を確認した上で慎重に扱う。

### 12.3 Traffic Flow

SNS投稿からWordPress記事またはアフィリエイトブログへ誘導する。
WordPress側では、記事、LP、商品紹介、アフィリエイトリンクを管理する。

### 12.4 Analytics Flow

SNS、WordPress、アフィリエイトASP、その他分析ツールからデータを取得する。
取得したデータはKPI EngineとAnalytics Engineで分析する。

### 12.5 Improvement Flow

AI Engineが分析結果をもとに改善案を作成する。
改善案は人間レビューを経て、次回投稿、記事修正、アカウント運用、キャンペーン設計に反映する。

## 13. External Service Architecture

Growth Lab Coreは、複数の外部サービスと連携する。

### 13.1 SNS Platforms

対象候補は以下である。

- X

- Instagram

- TikTok

- YouTube

- Facebook

- Threads

- Pinterest

SNS連携は、公式API、OAuth、公式管理機能を優先する。

### 13.2 Mail Platform

メール基盤は、以下の構成を基本とする。

- 独自ドメインを利用する。

- レンタルサーバーでメール転送を活用する。

- Gmailへ転送して管理を簡素化する。

- Google Workspaceは管理基盤として利用する。

- 1メールアドレスにつき1SNSアカウントを基本とする。

### 13.3 WordPress Platform

WordPress基盤は、以下の構成を基本とする。

- WordPressを標準CMSとして採用する。

- エックスサーバーを第一候補とする。

- 必要に応じて他のレンタルサーバーを比較する。

- SNSからアフィリエイトブログへ誘導する。

- SEO、表示速度、セキュリティ、バックアップを重視する。

### 13.4 AI Services

AIサービスは、以下に利用する。

- 投稿案作成

- 記事構成案作成

- 画像案作成

- 分析補助

- 改善提案

- リスク検知

- 作業指示書作成支援

AIサービスには、必要最小限のデータのみを渡す。

### 13.5 Analytics Services

分析対象は以下である。

- SNS分析

- WordPressアクセス解析

- アフィリエイト成果

- 投稿別クリック

- キャンペーン別成果

- アカウント別成果

- コスト

- ROI

## 14. Integration Policy

Growth Lab Coreと外部サービスの連携では、以下の方針を採用する。

### 14.1 API First

公式APIを優先する。

### 14.2 OAuth First

認証はOAuthを優先する。

### 14.3 Webhook Preferred

リアルタイム通知が必要な場合、Webhookが利用可能であればWebhookを優先する。

### 14.4 Loose Coupling

外部サービスとの接続部分は、Growth Lab Core本体から分離する。

### 14.5 Rate Limit Awareness

API制限、投稿制限、取得制限を前提に設計する。

### 14.6 Failure Handling

API停止、認証失敗、トークン失効、レート制限到達時の動作を定義する。

### 14.7 Auditability

外部APIへのアクセスはログに記録する。

## 15. Data Boundary

Growth Lab Coreでは、データの種類ごとに扱う境界を定義する。

Public Data
    |
    +-- SNS Published Posts
    +-- WordPress Public Pages
    +-- Public Media

Operational Data
    |
    +-- Post Drafts
    +-- Campaign Data
    +-- KPI Data
    +-- Analytics Data
    +-- Account Status
    +-- Operation Logs

Restricted Data
    |
    +-- Credential References
    +-- OAuth Token References
    +-- Recovery References
    +-- Secret Metadata
    +-- Audit Logs
    +-- Security Logs

### 15.1 Public Data

公開されることを前提としたデータである。

例：

- SNS公開投稿

- WordPress公開ページ

- 公開画像

- 公開動画

### 15.2 Operational Data

運用上必要な内部データである。

例：

- 投稿下書き

- 投稿スケジュール

- KPI

- 分析結果

- キャンペーン情報

- アカウント状態

### 15.3 Restricted Data

厳格な権限管理が必要なデータである。

例：

- Credential Reference

- OAuth Token Reference

- Recovery Reference

- Secret Metadata

- Audit Log

- Security Log

Restricted Dataは、通常の仕様書本文や運用メモに平文で記載しない。

## 16. Security Boundary

Growth Lab Coreのセキュリティ境界は、以下を基本とする。

Public Area
    |
    +-- SNS Posts
    +-- WordPress Public Pages

Controlled Area
    |
    +-- Growth Lab Core UI
    +-- API Layer
    +-- Admin Functions

Restricted Area
    |
    +-- Database
    +-- Secret Management
    +-- OAuth Tokens
    +-- Credentials
    +-- Audit Logs

### 16.1 Public Area

外部ユーザーがアクセス可能な領域である。

対象は以下である。

- SNS投稿

- WordPress公開ページ

- アフィリエイト記事

- 公開画像

- 公開動画

### 16.2 Controlled Area

運用担当者または管理者がアクセスする領域である。

対象は以下である。

- Growth Lab Core UI

- 管理画面

- 投稿管理

- KPI管理

- AI提案確認

- 承認画面

### 16.3 Restricted Area

厳格な権限管理が必要な領域である。

対象は以下である。

- Secret

- OAuth Token

- API Key

- TOTP Secret

- Recovery Code

- Database

- Audit Log

- Security Log

Restricted Areaの情報は、Markdown仕様書や通常の運用メモに平文で記載しない。

## 17. Data Architecture Overview

Growth Lab Coreの主要データ領域は以下である。

Identity
Mail Account
SNS Account
WordPress Site
Campaign
Post
Media
Schedule
AI Prompt
AI Output
Approval
Analytics
KPI
Automation Task
Log
Audit
ADR
Changelog

### 17.1 Identity

Growth Lab Coreの中核管理単位である。

### 17.2 Mail Account

SNS登録や通知受信用のメールアドレスを管理する。

### 17.3 SNS Account

SNSプラットフォーム上のアカウントを管理する。

### 17.4 WordPress Site

アフィリエイトブログ、記事、LP、導線を管理する。

### 17.5 Campaign

目的、投稿、記事、KPI、期間をまとめる単位である。

### 17.6 Post

SNS投稿またはWordPress記事を管理する。

### 17.7 Media

画像、動画、サムネイル、素材を管理する。

### 17.8 Analytics

投稿、流入、クリック、CV、売上、コストを管理する。

### 17.9 KPI

改善判断に使用する指標を管理する。

### 17.10 Log and Audit

システムログ、操作ログ、監査ログを管理する。

## 18. Deployment Architecture

Growth Lab Coreの展開は、段階的に行う。

### 18.1 Phase 1: Local and Small Scale

初期段階では、以下を前提とする。

- ローカル開発環境

- 20アカウント規模

- Markdown仕様書管理

- Google Workspace管理基盤

- 独自ドメインメール転送

- WordPress on Xserver

- 手動レビュー中心

- Codex / Claude Code による実装支援

### 18.2 Phase 2: Managed Operation

運用が安定した段階で、以下を拡張する。

- 管理ダッシュボード

- 自動KPI収集

- 投稿管理

- AI改善提案

- Scheduler

- ログ管理

- 障害対応フロー

### 18.3 Phase 3: Scaled Operation

50から100アカウント規模へ拡張する段階で、以下を整備する。

- DB管理

- Queue

- Automation Engine

- 監査ログ

- 権限管理

- API制限管理

- レポート自動生成

### 18.4 Phase 4: Advanced AI Operation

100アカウント以上の運用を行う場合、以下を整備する。

- AIによるアカウント最適化

- AIによるキャンペーン改善

- ABテスト管理

- 高度なKPI分析

- 異常検知

- 自動改善提案

### 18.5 Phase 5: Growth Lab Core 2.0

将来的には、Growth Lab Coreを本格的なAIメディア運営プラットフォームへ発展させる。

## 19. Scalability Architecture

Growth Lab Coreは、20アカウントから100から500アカウント規模へ段階的に拡張できるように設計する。

### 19.1 Scale Unit

Growth Lab Coreの拡張単位は、Identityを基本とする。

1 Identity
    =
1 Mail Address
    +
1 SNS Account
    +
1 Platform
    +
1 Credential Reference
    +
1 Status

### 19.2 Scale Stages

Stage 1: 1から20アカウント
Stage 2: 21から50アカウント
Stage 3: 51から100アカウント
Stage 4: 101から300アカウント
Stage 5: 301から500アカウント

### 19.3 Scale Decision

拡張判断では、以下を確認する。

- KPIが改善しているか。

- ROIが改善しているか。

- 運用負荷が許容範囲か。

- アカウント停止リスクが管理できるか。

- API制限に対応できるか。

- セキュリティ管理が維持できるか。

- メール基盤が対応できるか。

- WordPress側の受け皿が整っているか。

### 19.4 Scale Gate

次のStageへ進む前に、Scale Gate Reviewを行う。

Scale Gate Reviewでは、以下を確認する。

Scale Gate Review

1. KPI改善
2. ROI改善
3. 運用負荷
4. セキュリティ状態
5. 規約遵守
6. API制限
7. アカウント停止リスク
8. メール基盤
9. WordPress受け皿
10. AI / Automationの安定性

Scale Gateを通過できない場合は、アカウント数を増やさず、既存運用の改善を優先する。

## 20. Reliability and Failure Handling

Growth Lab Coreは、外部サービス依存が多いため、障害を前提として設計する。

### 20.1 Expected Failure Types

想定する障害は以下である。

- SNS API停止

- SNS認証失敗

- OAuthトークン失効

- メール転送失敗

- WordPress障害

- レンタルサーバー障害

- AI API失敗

- Scheduler失敗

- 投稿失敗

- 分析データ取得失敗

- アカウント制限

- 認証情報失効

- DB障害

### 20.2 Failure Handling Policy

障害対応では、以下を原則とする。

- 障害をログに記録する。

- 影響範囲を特定する。

- 自動リトライは回数制限を設ける。

- 認証失敗は自動処理を停止する。

- アカウント制限時は該当Identityを停止状態にする。

- 重要障害は通知する。

- 復旧手順を運用マニュアル化する。

## 21. Observability Architecture

Growth Lab Coreでは、Observabilityを初期段階から組み込む。

### 21.1 Required Logs

以下のログを設計対象とする。

- System Log

- API Log

- Auth Log

- Automation Log

- Scheduler Log

- SNS Account Log

- Mail Log

- WordPress Log

- Post Log

- Analytics Log

- Error Log

- Security Log

- Audit Log

### 21.2 Monitoring Targets

監視対象は以下である。

- API接続状態

- OAuthトークン状態

- 投稿成功率

- 投稿失敗率

- メール受信状態

- WordPress稼働状態

- Scheduler状態

- Automation状態

- KPI取得状態

- アカウント状態

- セキュリティイベント

### 21.3 Alert Policy

重要な異常は通知対象とする。

通知対象の例：

- API認証失敗

- 投稿連続失敗

- アカウント停止

- OAuthトークン失効

- WordPress障害

- DB障害

- 自動化処理の異常終了

- セキュリティイベント

## 22. Security Architecture Overview

Growth Lab Coreのセキュリティ設計は、Security by Designを基本とする。

### 22.1 Key Policies

以下を必須とする。

- Secretを平文保存しない。

- 最小権限を採用する。

- 2要素認証を標準化する。

- OAuthを優先する。

- 操作ログを記録する。

- 重要操作には人間承認を入れる。

- アカウント停止時の影響範囲を限定する。

- バックアップと復旧手順を定義する。

### 22.2 Secret Types

以下はSecretとして扱う。

- Password

- API Key

- OAuth Access Token

- OAuth Refresh Token

- Client Secret

- TOTP Secret

- Recovery Code

- Cookie

- Session

- Database Credential

- SMTP Credential

- WordPress Application Password

### 22.3 Access Control

権限は、以下のように分離する。

- Owner

- Administrator

- Operator

- Reviewer

- Viewer

- AI Execution Role

- System Role

## 23. Operations Architecture Overview

Growth Lab Coreの運用は、以下のライフサイクルで管理する。

Create
  |
  v
Configure
  |
  v
Verify
  |
  v
Operate
  |
  v
Monitor
  |
  v
Improve
  |
  v
Suspend or Retire

### 23.1 Account Lifecycle

SNSアカウントとメールアドレスは、以下の状態を持つ。

- Planned

- Created

- Verified

- Active

- Limited

- Suspended

- Retired

- Deleted

### 23.2 Content Lifecycle

投稿と記事は、以下の状態を持つ。

- Draft

- AI Proposed

- Human Review

- Approved

- Scheduled

- Published

- Measured

- Improved

- Archived

### 23.3 Incident Lifecycle

障害は、以下の状態で管理する。

- Detected

- Investigating

- Mitigating

- Resolved

- Documented

- Preventive Action

## 24. Documentation Architecture

Growth Lab Coreの仕様書は、Markdownを正本とする。

文書構造は以下を基本とする。

architecture/master
    |
    +-- 00_Document_Governance.md
    +-- 01_Architecture_Principles.md
    +-- 02_Overall_Architecture.md
    +-- 03_Mail_Platform.md
    +-- 04_SNS_Platform.md
    +-- 05_WordPress_Platform.md
    +-- 06_AI_Platform.md
    +-- 07_Growth_Lab_Core_System.md
    +-- 08_Database.md
    +-- 09_API_OAuth.md
    +-- 10_Security.md
    +-- 11_Operations.md
    +-- 12_Analytics_KPI.md
    +-- 13_Roadmap.md
    +-- 14_ADR.md

日本語版Markdown本文を正本とする。
英語表記は、見出し、用語、システム名、ADR名、ファイル名に使用する。

Word、PDFは人間向け出力物であり、正本ではない。

Codex、Claude Code、ChatGPTは、Markdown正本を参照する。

## 25. Codex and Claude Code Application Policy

CodexとClaude Codeは、Growth Lab Coreの設計・実装・運用支援に使用する。

### 25.1 Codex

Codexは、確定済み仕様をローカルファイルへ反映する役割を持つ。

Codexの主な役割は以下である。

- フォルダ作成

- Markdownファイル作成

- 確定本文の反映

- バックアップ作成

- CHANGELOG更新

- Markdown構造確認

- ファイル整合性確認

Codexは、上位設計判断を単独で行わない。

### 25.2 Claude Code

Claude Codeは、仕様書とADRに基づいて実装、コード修正、検証を支援する。

Claude Codeが仕様書と矛盾する課題を発見した場合は、実装を強行せず、仕様書更新またはADR作成が必要である。

## 26. Non-Functional Requirements

Growth Lab Core全体では、以下の非機能要件を考慮する。

### 26.1 Maintainability

仕様書、ADR、CHANGELOG、実装、運用マニュアルを継続的に更新できる構成にする。

### 26.2 Extensibility

SNS、メール、WordPress、AI、分析サービスの追加・変更に対応できる構成にする。

### 26.3 Reliability

外部サービス障害、認証失敗、投稿失敗、データ取得失敗を前提に設計する。

### 26.4 Recoverability

アカウント、認証、投稿、データ、仕様書を復旧できる手順を持つ。

### 26.5 Auditability

重要操作、APIアクセス、認証、変更、AI提案、承認履歴を追跡できるようにする。

### 26.6 Security

Secretを保護し、最小権限、2要素認証、監査ログを標準化する。

### 26.7 Human Operability

運用担当者が理解し、確認し、停止し、復旧できる設計にする。

### 26.8 AI Readability

AI Assistant、Codex、Claude Codeが仕様書を読み取りやすいMarkdown構成にする。

## 27. Architecture Constraints

Growth Lab Coreの全体アーキテクチャでは、以下の制約を前提とする。

- 各SNSの利用規約を遵守する。

- 公式APIとOAuthを優先する。

- 自動化は許容範囲内で実施する。

- Secretを平文保存しない。

- Markdownを仕様書の正本とする。

- 日本語版Markdown本文を正本とする。

- 初期段階では20アカウント規模に集中する。

- 将来100から500アカウントへ拡張可能にする。

- アカウント数はKPIとリスクに基づいて最適化する。

- WordPressを標準CMSとする。

- エックスサーバーを第一候補とする。

- Google Workspaceは管理基盤として利用する。

- 独自ドメインメール転送を活用する。

- CodexとClaude Codeは上位設計判断を単独で変更しない。

## 28. Risks

本章のアーキテクチャに関連する主なリスクは以下である。

### 28.1 Risk: 外部サービス依存

SNS、メール、WordPress、AI、分析サービスに依存するため、外部仕様変更の影響を受ける。

軽減策：

- Integration Layerで疎結合にする。

- API仕様変更を監視する。

- ADRとCHANGELOGで変更履歴を管理する。

### 28.2 Risk: アカウント数増加による管理複雑化

アカウント数が増えると、認証、メール、投稿、ログ、KPI管理が複雑化する。

軽減策：

- Identity中心設計を採用する。

- アカウントライフサイクルを管理する。

- アカウント数はKPIとリスクで最適化する。

### 28.3 Risk: 自動化による誤操作

自動化が誤動作すると、誤投稿、過剰アクセス、API制限到達が発生する可能性がある。

軽減策：

- 停止条件を定義する。

- 人間承認フローを設ける。

- 実行ログを記録する。

### 28.4 Risk: セキュリティ事故

認証情報漏洩やアカウント乗っ取りが発生する可能性がある。

軽減策：

- Secret管理を分離する。

- 最小権限を採用する。

- 監査ログを記録する。

- 2要素認証を標準化する。

### 28.5 Risk: 仕様書と実装の乖離

仕様書が更新されないまま実装が進むと、正しい設計が分からなくなる。

軽減策：

- Markdown正本を更新する。

- CHANGELOGを更新する。

- ADRを作成する。

- Codex作業後に仕様更新要否を確認する。

### 28.6 Risk: AIと自動化の責任範囲が曖昧になる

AIやAutomation Engineが実行してよい範囲が曖昧な場合、意図しない操作や規約違反につながる可能性がある。

軽減策：

- 人間承認条件を定義する。

- 自動化の停止条件を定義する。

- AI提案と実行処理を分離する。

- 操作ログを記録する。

## 29. Required Review Checklist

本章または下位仕様書を作成・更新する場合は、以下を確認する。

Overall Architecture Review Checklist

1. Growth Lab Core全体の構成が明確か
2. Identity中心設計が反映されているか
3. SNS、メール、WordPress、AI、分析の関係が明確か
4. Integration Layerで外部サービスを分離しているか
5. API FirstとOAuth Firstが反映されているか
6. Security by Designが反映されているか
7. Secret管理方針が明確か
8. SchedulerとAutomationの停止条件が考慮されているか
9. Observabilityが初期段階から組み込まれているか
10. 20アカウントから100から500アカウントへの拡張方針が明確か
11. アカウント数の最適化判断がKPIとリスクに基づいているか
12. WordPressとアフィリエイトブログへの導線が設計に含まれているか
13. Codex / Claude Codeの役割が明確か
14. 下位章との責任分担が明確か
15. ADRが必要な設計判断が整理されているか
16. 日本語版Markdown本文が正本として扱われているか
17. AIと自動化の責任範囲が明確か
18. Scale Gateが定義されているか

## 30. Review Points

本章のレビューでは、以下を確認する。

- Growth Lab CoreがSNS運用OSとして定義されているか。

- 全体アーキテクチャが、後続章の親構造として十分か。

- Identity中心設計が明確か。

- 外部サービスとの接続方針が明確か。

- SNSからWordPress、アフィリエイト、分析、改善への流れが明確か。

- AIとAutomationの役割が明確か。

- Security、Observability、Operationsが初期段階から組み込まれているか。

- 20アカウントから100から500アカウントへ拡張できる構成か。

- 過剰なアカウント増加を防ぐ設計になっているか。

- Scale Gateが拡張判断に使える内容になっているか。

- Codex、Claude Code、人間が同じ理解で参照できる構成か。

- 下位章へ詳細化しやすい粒度になっているか。

## 31. Architecture Decision Records

本章に関連するADRは以下の通りである。

Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core

本章に関連して、今後追加が想定されるADRは以下である。

```text
ADR-0005: Core Architecture Principles
ADR-0010: Overall Architecture Structure
ADR-0011: Identity-Centric Architecture
ADR-0012: Integration Layer Policy
ADR-0013: Growth Lab Core Deployment Phases
ADR-0014: SNS to WordPress Affiliate Flow
ADR-0015: Observability Architecture Policy
ADR-0016: Scale Gate Policy
ADR-0017: Data Boundary and Security Boundary Policy
```

重要な全体設計変更、主要コンポーネント変更、外部サービス連携方針変更が発生した場合は、ADRを作成する。
