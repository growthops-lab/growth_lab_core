# 06 AI Platform

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/06_AI_Platform.md

## 1. Purpose

本章の目的は、Growth Lab Core におけるAI基盤の設計方針を定義することである。

AI基盤は、単に文章を生成するための補助機能ではない。
Growth Lab Coreでは、AIをSNS投稿、WordPress記事、画像案、動画構成案、SEO改善、KPI分析、リスク検知、改善提案、Codex / Claude Code作業指示書作成を支援する中核機能として扱う。

ただし、AIは重要判断を単独で確定しない。
AIは、提案、下書き、分析、改善案、作業指示書案を作成する支援機能であり、外部公開、投稿実行、記事公開、LP公開、アフィリエイトリンク掲載、認証情報変更、OAuth権限変更、セキュリティ設定変更、予算変更、規約判断などの最終決定は人間レビューと承認を必要とする。

本章では、以下を定義する。

- AI Platform全体方針

- AIの役割と責任境界

- AI Assistant、AI Engine、Codex、Claude Codeの関係

- Prompt Management方針

- AI Output Registryの正本管理方針

- AI生成物のライフサイクル

- Human Review / Approval Gate

- SNS投稿案へのAI活用

- WordPress記事案へのAI活用

- メディア案へのAI活用

- Analytics and KPIへのAI活用

- Codex / Claude Code作業指示書作成へのAI活用

- AIによる自動実行の禁止範囲

- 高リスク領域の扱い

- AI Safety and Quality方針

- AI Cost Optimization

- AI Observability

- AI Scale Gate

- 運用リスクと軽減策

## 2. Scope

本章の対象範囲は、Growth Lab Coreで使用するAI基盤全体である。

対象範囲は以下を含む。

- AI Assistantの利用方針

- AI Engineの役割

- AI Integration Layer

- Prompt Management

- Prompt Registry

- AI Output Registry

- AI生成物の状態管理

- Human Review / Approval Gate

- SNS投稿案作成

- WordPress記事案作成

- SEO改善案作成

- 画像案作成

- 動画構成案作成

- KPI分析補助

- ABテスト分析補助

- リスク検知補助

- Campaign改善提案

- Codex作業指示書作成補助

- Claude Code作業指示書作成補助

- AI利用ログ

- AIコスト管理

- AIリスク管理

- AI Scale Gate

本章では、特定AIモデルの詳細仕様、プロンプト全文テンプレート、AI APIエンドポイント詳細、AIサービス契約手順、画像生成の詳細手順、動画生成の詳細手順、SNS投稿実行手順、WordPress記事公開手順までは定義しない。
それらは、Prompt Library、AI運用マニュアル、SNS運用マニュアル、WordPress運用マニュアル、API and OAuth章、Security章、Operations章、または下位仕様で定義する。

## 3. Non-Goals

本章では、以下を対象外とする。

- 特定AIモデルの詳細比較

- 特定AIサービスの契約手順

- AI APIの具体的なエンドポイント仕様

- プロンプト全文テンプレート集

- SNS投稿テンプレートの詳細

- WordPress記事テンプレートの詳細

- 画像生成プロンプトの詳細集

- 動画生成プロンプトの詳細集

- AIモデルの学習手順

- ファインチューニング手順

- AIによる完全自動投稿

- AIによる完全自動記事公開

- AIによる認証情報変更

- AIによるOAuth権限変更

- AIによるSecret変更

- AIによる予算変更

- AIによる規約判断の最終確定

- SNS Accountの詳細管理

- WordPress Articleの詳細管理

- Mail AccountやRecoveryの詳細管理

- 物理データベース設計

AIの詳細な利用手順は、AI運用マニュアル、Prompt Library、SNS運用マニュアル、WordPress運用マニュアル、Analytics and KPI章で定義する。

## 4. Background

Growth Lab Coreでは、SNSアカウント、WordPress記事、Campaign、KPI、Analytics、Automationを統合的に扱う。

この運用では、以下の作業が繰り返し発生する。

- SNS投稿案作成

- WordPress記事案作成

- SEO改善案作成

- 画像案作成

- 動画構成案作成

- KPI分析

- 成果比較

- 改善施策作成

- 低成果アカウントの見直し

- 低成果記事の見直し

- Campaign改善

- Codex / Claude Codeへの作業指示作成

- 仕様書や運用手順の整備

AIは、これらの作業を高速化し、改善案を増やし、分析の質を高めるために利用する。

一方で、AIは以下のリスクを持つ。

- 誤情報

- 過剰表現

- 規約違反

- 広告表現リスク

- 著作権リスク

- Secret混入

- 品質低下

- コスト増大

- 無承認実行

- AIへの過信

そのため、Growth Lab Coreでは、AIを「生成と分析の支援者」として位置付け、人間が重要判断と外部公開を承認する。

## 5. Alignment with Architecture Principles

本章は、01_Architecture_Principles.md で定義した原則に従う。

特に、AI基盤では以下を重視する。

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

AI基盤における優先順位は以下である。

1. 規約遵守
2. セキュリティ
3. 人間承認
4. 正本管理
5. 監査可能性
6. 品質管理
7. API First
8. コスト最適化
9. 拡張性
10. 自動化
11. 継続改善

AI活用は、Compliance First、Security by Design、Single Source of Truth、Human Reviewを超えて実行してはならない。

## 6. AI Platform Vision

Growth Lab CoreのAI基盤は、SNS、WordPress、Analytics、Automation、Operationsを横断して、生成、分析、改善提案を支援する中核機能である。

AI Platform
    |
    +-- Prompt Management
    +-- AI Output Management
    +-- Human Review Workflow
    +-- SNS Draft Support
    +-- WordPress Draft Support
    +-- SEO Improvement Support
    +-- Media Idea Support
    +-- KPI Analysis Support
    +-- Risk Detection Support
    +-- Campaign Improvement Support
    +-- Codex Instruction Support
    +-- Claude Code Instruction Support

AI基盤の基本サイクルは以下である。

Input Data
  |
  v
Prompt
  |
  v
AI Proposal
  |
  v
Human Review
  |
  v
Approved Action
  |
  v
Execution by Human or Approved System
  |
  v
Measurement
  |
  v
AI Improvement Proposal

AIは、提案、下書き、分析、改善案を作る。
実行可否の最終判断は、人間または承認済みワークフローが行う。

## 7. Overall AI Architecture

Growth Lab CoreのAI基盤は、以下の構成を基本とする。

External AI Services
    |
    +-- Text Generation
    +-- Image Generation
    +-- Analysis Support
    +-- Embedding or Search Support
            |
            v
AI Integration Layer
    |
    +-- AI API Client
    +-- Model Adapter
    +-- Prompt Adapter
    +-- Safety Adapter
    +-- Cost Adapter
    +-- Logging Adapter
            |
            v
Growth Lab Core
    |
    +-- AI Engine
    +-- Prompt Management
    +-- Prompt Registry
    +-- AI Output Registry
    +-- Human Review Workflow
    +-- SNS Post Management
    +-- WordPress Article Management
    +-- Campaign Management
    +-- Analytics Engine
    +-- KPI Engine
    +-- Automation Engine
    +-- Monitoring
    +-- Audit Log

外部AIサービスの仕様差は、AI Integration Layerで吸収する。

Growth Lab Core本体では、AI出力、承認状態、利用目的、関連SNS、関連WordPress記事、関連Campaign、関連KPI、リスク状態、コストを管理する。

## 8. AI Platform Components

AI基盤は、以下のコンポーネントで構成する。

### 8.1 AI Engine

AI Engineは、Growth Lab Core内部でAI利用を制御する中核機能である。

主な役割は以下である。

- Promptの受け取り

- 入力データの整理

- AIサービスへのリクエスト

- AI出力の取得

- AI Output Registryへの保存

- Human Review Workflowへの連携

- KPIやAnalyticsとの接続

- コストやログの記録

### 8.2 AI Integration Layer

AI Integration Layerは、外部AIサービスとの接続層である。

主な役割は以下である。

- AI API接続

- モデル切り替え

- レート制限管理

- エラー処理

- コスト取得

- ログ記録

- セキュリティ境界の維持

### 8.3 Prompt Management

Prompt Managementは、用途別のプロンプト、入力条件、出力形式、禁止事項、レビュー条件を管理する機能である。

### 8.4 Prompt Registry

Prompt Registryは、本番運用で使うプロンプトの管理台帳である。

初期段階ではMarkdownまたはGoogle Sheetsで管理し、将来的にはGrowth Lab Core Databaseへ移行する。

### 8.5 AI Output Registry

AI Output Registryは、AI生成物やAI分析結果のSingle Source of Truthである。

初期段階ではGoogle SheetsまたはMarkdown台帳で管理し、将来的にはGrowth Lab Core Databaseへ移行する。

### 8.6 Human Review Workflow

Human Review Workflowは、AI出力を人間が確認し、承認、却下、修正、保留するためのワークフローである。

### 8.7 Safety and Risk Check

Safety and Risk Checkは、AI出力に含まれるリスクを確認する機能である。

対象は以下である。

- 規約違反リスク

- 広告表現リスク

- 誤情報リスク

- セキュリティリスク

- 著作権リスク

- ブランド毀損リスク

- 高リスク領域リスク

### 8.8 Cost Tracking

Cost Trackingは、AI利用量、API呼び出し回数、トークン量、画像生成回数、処理単価、Campaign別コストを記録する機能である。

## 9. Responsibility Boundary

AI基盤では、各要素の責任範囲を明確に分離する。

### 9.1 Growth Lab Core Responsibilities

Growth Lab Coreが責任を持つ範囲は以下である。

- AI Engine管理

- Prompt Management

- Prompt Registry管理

- AI Output Registry管理

- AI出力ステータス管理

- Human Review Workflow管理

- AI利用ログ管理

- AIコスト管理

- AI出力とSNS Accountの紐付け

- AI出力とWordPress Articleの紐付け

- AI出力とCampaignの紐付け

- AI出力とKPIの紐付け

- リスク状態管理

- 監査ログ管理

### 9.2 External AI Service Responsibilities

外部AIサービスが責任を持つ範囲は以下である。

- モデル提供

- API提供

- 出力生成

- サービス稼働

- レート制限

- 利用条件

- モデル更新

- API仕様変更

Growth Lab Coreは外部AIサービスの内部挙動を制御できない。
そのため、AI出力は常に検証可能な提案として扱い、重要判断をAIだけに委任しない。

### 9.3 Human Operator Responsibilities

人間の運用担当者が責任を持つ範囲は以下である。

- AI出力の確認

- 投稿公開承認

- 記事公開承認

- LP公開承認

- アフィリエイトリンク掲載承認

- 高リスク表現の確認

- 規約判断の最終確認

- セキュリティ設定変更の承認

- AI提案の採用判断

- AI Scale Gate Review

- 重要なADR承認

### 9.4 AI Assistant Responsibilities

AI Assistantが支援する範囲は以下である。

- SNS投稿案作成

- WordPress記事案作成

- 見出し案作成

- 画像案作成

- 動画構成案作成

- SEO改善案作成

- KPI分析補助

- ABテスト分析補助

- リスク検知補助

- 仕様書作成補助

- Codex / Claude Code作業指示書作成補助

AI Assistantは、重要判断を単独で確定しない。

### 9.5 Codex and Claude Code Responsibilities

Codexは、確定済み仕様の反映、台帳テンプレート作成、CHANGELOG更新、バックアップ作成、簡易検証を支援する。

Claude Codeは、仕様書とADRに基づいて、AI基盤に関する実装、検証、自動化、スクリプト作成を支援する。

CodexおよびClaude Codeは、上位設計判断を単独で変更しない。

## 10. AI Use Case Categories

Growth Lab Coreでは、AI利用を用途別に分類する。

### 10.1 Content Generation

主な用途は以下である。

- SNS投稿案

- WordPress記事案

- 記事構成案

- 見出し案

- メタディスクリプション案

- FAQ案

- LP構成案

- CTA案

### 10.2 Media Idea Generation

主な用途は以下である。

- 画像案

- サムネイル案

- バナー案

- 動画構成案

- ショート動画台本案

- カルーセル構成案

### 10.3 Analysis Support

主な用途は以下である。

- SNS KPI分析

- WordPress KPI分析

- Campaign分析

- ABテスト分析

- 高成果パターン抽出

- 低成果パターン抽出

- 改善優先度整理

### 10.4 Improvement Recommendation

主な用途は以下である。

- 投稿改善案

- 記事改善案

- SEO改善案

- 内部リンク改善案

- LP改善案

- アフィリエイト導線改善案

- Campaign改善案

- アカウント運用改善案

### 10.5 Risk Detection Support

主な用途は以下である。

- 規約違反リスク検知

- 広告表現リスク検知

- 誤情報リスク検知

- 著作権リスク検知

- ブランド毀損リスク検知

- セキュリティリスク検知

- 高リスク領域フラグ付け

### 10.6 Documentation and Implementation Support

主な用途は以下である。

- 仕様書ドラフト作成

- 最適化レビュー

- Codex作業指示書作成

- Claude Code作業指示書作成

- CHANGELOG文案作成

- ADR文案作成

- 運用マニュアル文案作成

## 11. Prompt Management

Prompt Managementは、AI利用の品質、再現性、監査可能性を高めるための管理機能である。

### 11.1 Prompt Registry

Prompt Registryは、用途別プロンプトの管理台帳である。

初期段階ではMarkdownまたはGoogle Sheetsで管理し、将来的にはGrowth Lab Core Databaseへ移行する。

### 11.2 Required Fields

Prompt Registryには、以下を記録する。

Prompt ID
Prompt Name
Use Case
Target Platform
Input Data Type
Output Format
Risk Level
Human Review Required Flag
Related Workflow
Version
Status
Created Date
Last Updated Date
Owner
Notes
Change History

### 11.3 Prompt Rules

プロンプト管理のルールは以下である。

- 本番運用で使うプロンプトは登録する。

- 用途を明確にする。

- 入力データの範囲を明確にする。

- 出力形式を明確にする。

- 禁止事項を明確にする。

- 人間レビューが必要な条件を明確にする。

- バージョンを管理する。

- 高リスク領域のプロンプトは特に慎重に扱う。

- Secret実体をプロンプトに含めない。

- 個人情報や機密情報を不要に含めない。

- AIサービスの画面履歴を正本として扱わない。

### 11.4 Prompt Versioning

プロンプトを変更する場合は、以下を記録する。

- 変更日

- 変更理由

- 変更前後の概要

- 影響するUse Case

- 検証結果

- 承認者

- ADR作成要否

## 12. AI Output Registry

AI Output Registryは、AI生成物やAI分析結果のSingle Source of Truthである。

初期段階ではGoogle SheetsまたはMarkdown台帳で管理し、将来的にはGrowth Lab Core Databaseへ移行する。

### 12.1 Required Fields

AI Output Registryには、以下を記録する。

AI Output ID
Prompt ID
Use Case
Source Data Reference
Target Platform
Related SNS Account ID
Related WordPress Site ID
Related Article ID
Related Campaign ID
Output Type
Output Summary
Status
Risk Level
Human Review Status
Approved By
Created Date
Reviewed Date
Published Date
Measured Date
KPI Reference
Cost Reference
Owner
Notes
Change History

### 12.2 Registry Rules

台帳管理のルールは以下である。

- 本番利用するAI出力は登録する。

- 外部公開に使うAI出力は人間レビューを記録する。

- 投稿、記事、LP、Campaignとの関係を記録する。

- AI出力をそのまま正しい情報として扱わない。

- AI出力の採用、却下、修正を記録する。

- 高リスク出力はRisk Levelを上げる。

- Secret実体を記録しない。

- AIサービスの画面履歴を正本として扱わない。

### 12.3 Migration to Database

AI利用量が増えた場合、AI Output RegistryはDatabaseへ移行する。

移行判断の目安は以下である。

- AI出力が月100件を超える。

- SNS投稿やWordPress記事との紐付けが複雑化する。

- KPIとの連携が必要になる。

- コスト管理が必要になる。

- Human Review Workflowと連携が必要になる。

- 手動台帳の更新漏れが増える。

- 監査ログとの連携が必要になる。

## 13. AI Output Lifecycle and Status

AI Outputは、ライフサイクルとステータスを分けて管理する。

### 13.1 Lifecycle

AI Outputは、以下のライフサイクルで管理する。

Requested
  |
  v
Generated
  |
  v
Registered
  |
  v
Human Reviewed
  |
  v
Approved or Rejected
  |
  v
Used
  |
  v
Measured
  |
  v
Improved or Archived

### 13.2 Status

AI Outputには、以下のステータスを持たせる。

Requested
Generated
Registered
Needs Review
Approved
Rejected
Modified
Used
Published
Measured
Improved
Archived
Deleted

### 13.3 Status Rules

ステータス管理のルールは以下である。

- Generatedのまま外部公開しない。

- 外部公開前にHuman ReviewedまたはApprovedへ進める。

- 修正した場合はModifiedを記録する。

- 採用しない場合はRejectedを記録する。

- 公開または利用した場合はUsedまたはPublishedを記録する。

- KPI確認後はMeasuredを記録する。

- 改善に使った場合はImprovedを記録する。

## 14. Human Review and Approval Gate

Growth Lab Coreでは、AI出力を人間が確認し、承認してから重要処理に利用する。

### 14.1 Human Review Required Cases

以下の場合は、人間レビューを必須とする。

- SNS投稿公開

- WordPress記事公開

- LP公開

- アフィリエイトリンク掲載

- 広告表現を含む内容

- 法令や規約に関係する内容

- 健康、金融、法律、安全など高リスク領域の内容

- ブランド毀損リスクがある内容

- 外部に送信される文章

- 顧客や取引先に送る文章

- 認証、OAuth、Secret、権限に関係する変更

- セキュリティ設定変更

- 予算、広告、コストに関係する変更

- 大量投稿または大量記事公開

### 14.2 Approval States

承認状態は以下を基本とする。

Not Reviewed
Needs Review
Reviewed
Approved
Rejected
Approved with Edits
Escalated

### 14.3 Approval Rules

承認ルールは以下である。

- AI出力は承認前に外部公開しない。

- 承認者を記録する。

- 承認日を記録する。

- 修正があった場合は修正内容を記録する。

- 高リスク領域は必要に応じて追加レビューを行う。

- 承認済みでも、規約変更や状況変化があれば再確認する。

## 15. SNS AI Usage Policy

AIは、SNS運用における投稿案、改善案、分析補助に利用する。

### 15.1 Use Cases

SNSでのAI利用候補は以下である。

- 投稿案作成

- 投稿バリエーション作成

- ハッシュタグ案作成

- プロフィール案作成

- 画像案作成

- 動画構成案作成

- 投稿時間帯の改善提案

- 投稿結果分析

- ABテスト案作成

- 高成果投稿の分析

- 低成果投稿の改善案作成

### 15.2 SNS AI Rules

SNS AI利用のルールは以下である。

- AI生成投稿を無レビューで公開しない。

- 投稿先SNS Accountを確認する。

- WordPress導線を確認する。

- アフィリエイトリンクの扱いを確認する。

- 利用規約に反する内容を生成または公開しない。

- 高リスク投稿は人間レビューを必須とする。

- SNS Account Registryと連携して記録する。

- 投稿後のKPIを確認し、改善に反映する。

### 15.3 Relationship with 04 SNS Platform

SNS Account、投稿、Publishing、SNS Scale Gateの詳細は、04_SNS_Platform.md で定義する。

本章では、AIがSNS運用をどのように支援し、どこで人間レビューを必要とするかを定義する。

## 16. WordPress AI Usage Policy

AIは、WordPress運用における記事案、構成案、SEO改善案、リライト案に利用する。

### 16.1 Use Cases

WordPressでのAI利用候補は以下である。

- 記事案作成

- 見出し案作成

- 記事構成案作成

- リード文案作成

- FAQ案作成

- メタディスクリプション案作成

- 比較表案作成

- 内部リンク案作成

- リライト案作成

- SEO改善案作成

- LP構成案作成

- アフィリエイト導線改善案作成

### 16.2 WordPress AI Rules

WordPress AI利用のルールは以下である。

- AI生成記事を無レビューで公開しない。

- 公開前に事実確認を行う。

- 広告表現を確認する。

- ASP規約を確認する。

- 引用、出典、著作権に注意する。

- 高リスク領域の記事は追加レビューを行う。

- Article Registryと連携して記録する。

- 公開後のKPIを確認し、改善に反映する。

### 16.3 Relationship with 05 WordPress Platform

WordPress Site、Article、LP、Affiliate Link、WordPress Scale Gateの詳細は、05_WordPress_Platform.md で定義する。

本章では、AIがWordPress運用をどのように支援し、どこで人間レビューを必要とするかを定義する。

## 17. Media AI Usage Policy

AIは、画像案、動画構成案、サムネイル案、バナー案の作成支援に利用する。

### 17.1 Use Cases

メディア領域でのAI利用候補は以下である。

- 画像コンセプト案作成

- バナー案作成

- サムネイル案作成

- 動画構成案作成

- ショート動画台本案作成

- カルーセル構成案作成

- SNS別クリエイティブ案作成

- WordPress記事内画像案作成

### 17.2 Media AI Rules

メディアAI利用のルールは以下である。

- 著作権や利用許諾を確認する。

- 他者の権利を侵害しない。

- ブランドイメージを損なわない。

- 誤認を招く画像や動画を使わない。

- 商用利用可否を確認する。

- 高リスクな画像生成は人間レビューを行う。

- 公開前に用途と掲載先を確認する。

## 18. Analytics and KPI AI Usage Policy

AIは、Analytics and KPIの分析補助と改善提案に利用する。

### 18.1 Use Cases

Analytics and KPI領域でのAI利用候補は以下である。

- SNS KPI分析

- WordPress KPI分析

- Campaign分析

- アカウント別成果分析

- 投稿別成果分析

- 記事別成果分析

- LP別成果分析

- CV分析

- ROI分析

- 異常値検知

- 改善優先度提案

### 18.2 KPI AI Rules

KPI分析でのAI利用ルールは以下である。

- AI分析の根拠となるデータを明確にする。

- 推定値と実測値を区別する。

- 欠損データを明示する。

- 重要判断は人間が確認する。

- AI提案をそのまま予算変更や大量実行へつなげない。

- 分析結果をCampaign、SNS Account、Article、KPIと紐付ける。

### 18.3 AI Improvement Loop

AI改善ループは以下を基本とする。

Collect KPI
  |
  v
Analyze
  |
  v
AI Recommendation
  |
  v
Human Review
  |
  v
Approved Improvement
  |
  v
Apply
  |
  v
Measure Again

Analytics、KPI定義、取得方法、分析指標の詳細は、12_Analytics_KPI.md で定義する。

## 19. Codex and Claude Code AI Support Policy

AIは、CodexやClaude Codeに渡す作業指示書の作成にも利用する。

### 19.1 Codex Instruction Support

Codex向けには、以下を支援する。

- Markdownファイル反映指示書

- バックアップ指示

- CHANGELOG更新指示

- UTF-8確認指示

- Markdown構造確認指示

- 完了報告形式

- 禁止事項

- 完了条件

### 19.2 Claude Code Instruction Support

Claude Code向けには、以下を支援する。

- 実装指示書

- バグ修正指示

- リファクタリング指示

- テスト作成指示

- 検証手順

- ディレクトリ構成確認

- 差分確認

- 仕様書との整合確認

### 19.3 Instruction Rules

AIが作成する作業指示書は、以下を守る。

- 上位仕様に従う。

- 対象ファイルを明記する。

- バックアップを指示する。

- 変更禁止事項を明記する。

- Secretを含めない。

- 実行前後の検証を明記する。

- 完了報告形式を明記する。

- 上位設計判断をCodexやClaude Codeに任せない。

- 開始マーカーと終了マーカーの間に、確定Markdown本文を直接入れる。

## 20. AI Execution Boundary

AIは支援機能であり、外部影響を持つ実行を単独で行わない。

### 20.1 AI May Support

AIが支援できる範囲は以下である。

- 下書き作成

- 分析案作成

- 改善案作成

- リスク候補抽出

- 指示書作成

- 要約

- 比較

- レビュー補助

- テンプレート作成

### 20.2 AI Must Not Execute Alone

AIが単独で実行してはならない範囲は以下である。

- SNS投稿公開

- WordPress記事公開

- LP公開

- アフィリエイトリンク掲載

- アカウント作成

- アカウント削除

- 認証情報変更

- OAuth権限変更

- Secret変更

- セキュリティ設定変更

- 予算変更

- 広告出稿

- 大量投稿

- 大量記事公開

- 規約判断の最終確定

### 20.3 Approved Execution

AI出力を実行に移す場合は、以下を満たす。

- 対象が明確である。

- 実行内容が明確である。

- 人間レビューが完了している。

- 承認者が記録されている。

- 影響範囲が確認されている。

- ロールバックまたは停止手段がある。

- 実行ログが残る。

## 21. High-Risk Domain Policy

高リスク領域では、AI利用を特に慎重に扱う。

### 21.1 High-Risk Domains

高リスク領域は以下である。

- 法律

- 金融

- 医療

- 健康

- 安全

- 個人情報

- セキュリティ

- 認証

- 広告表現

- 規約判断

- 返金や契約に関わる内容

- 企業信用に関わる内容

### 21.2 High-Risk Rules

高リスク領域のルールは以下である。

- AI出力をそのまま最終判断にしない。

- 必ず人間レビューを行う。

- 必要に応じて専門確認を行う。

- 断定表現を避ける。

- 根拠を確認する。

- 公開前に追加レビューを行う。

- 重要判断は記録する。

- ADRが必要か確認する。

## 22. AI Safety and Quality Policy

AI出力は、品質と安全性を確認してから利用する。

### 22.1 Quality Checks

AI出力に対して以下を確認する。

- 目的に合っているか。

- 内容が正確か。

- 誤情報がないか。

- 表現が過剰でないか。

- 読者に誤認を与えないか。

- 規約違反がないか。

- 広告表現に問題がないか。

- 著作権リスクがないか。

- ブランドトーンに合っているか。

- 出力形式が合っているか。

### 22.2 AI Hallucination Policy

AIは誤情報を生成する可能性がある。

そのため、以下を守る。

- 事実情報は確認する。

- 数値情報は確認する。

- 規約情報は確認する。

- 最新情報は確認する。

- 出典が必要な内容は出典を確認する。

- 不確かな内容は断定しない。

- 高リスク内容は追加レビューする。

### 22.3 Brand and Tone Policy

AI出力は、対象メディア、SNS、Campaign、ブランドに合わせて調整する。

確認対象は以下である。

- トーン

- 語尾

- 表現の強さ

- 読者層

- 専門性

- 親しみやすさ

- 信頼性

- 過剰な煽り表現の有無

## 23. Security and Secret Handling

AI基盤では、Secretや認証情報をAI入力やAI出力に含めない。

### 23.1 Secret Types

以下はAIに入力しない。

- パスワード

- API Key

- OAuth Token

- OAuth Refresh Token

- Client Secret

- TOTP Secret

- Recovery Code

- Cookie

- Session

- Database Credential

- SMTP Credential

- WordPress Application Password

- Hosting Control Panel Credential

### 23.2 Security Rules

セキュリティルールは以下である。

- Secretをプロンプトに含めない。

- SecretをAI出力に含めない。

- SecretをAI Output Registryに記録しない。

- 個人情報や機密情報を不要に入力しない。

- 外部AIサービスへ送るデータ範囲を制限する。

- 高リスクデータを使う場合は事前に確認する。

- AIログにSecretが入らないようにする。

### 23.3 Sensitive Data Handling

機密情報、個人情報、未公開情報をAIに入力する場合は、以下を確認する。

- 入力が必要か。

- 匿名化できるか。

- 要約化できるか。

- 権限上問題ないか。

- 外部サービスに送信してよいか。

- ログに残ってよいか。

- 代替手段があるか。

Secret管理、認証情報、アクセス権限の詳細は、10_Security.md で定義する。

## 24. AI Data Input Policy

AIに入力するデータは、目的に応じて最小限にする。

### 24.1 Input Data Types

AI入力データの例は以下である。

- SNS投稿結果

- WordPress記事情報

- Article Summary

- Campaign Summary

- KPI Summary

- Analytics Summary

- Prompt

- Review Comment

- Operation Note

- Public Information

- Draft Content

### 24.2 Input Rules

入力ルールは以下である。

- 必要最小限のデータを使う。

- Secretを含めない。

- 機密情報を不要に含めない。

- 個人情報を不要に含めない。

- 出力目的を明確にする。

- 対象CampaignやAccountを明確にする。

- 推定値と実測値を区別する。

- 古いデータの場合は日付を明記する。

## 25. AI Output Policy

AI出力は、利用目的、状態、レビュー結果とともに管理する。

### 25.1 Output Types

AI出力タイプは以下である。

- SNS Post Draft

- SNS Profile Draft

- WordPress Article Draft

- Article Outline

- Landing Page Draft

- SEO Recommendation

- Image Idea

- Video Script

- KPI Analysis

- Risk Report

- Improvement Proposal

- Codex Instruction

- Claude Code Instruction

- Operation Manual Draft

- ADR Draft

### 25.2 Output Rules

出力ルールは以下である。

- 出力タイプを記録する。

- 関連対象を記録する。

- Human Review Statusを記録する。

- 高リスク出力はRisk Levelを記録する。

- 外部公開前に承認を記録する。

- 採用、却下、修正を記録する。

- KPI結果と紐付ける。

- Secretを含めない。

## 26. AI Cost Optimization

AI基盤では、AI利用コストをKPIと比較して最適化する。

### 26.1 Cost Principles

コスト方針は以下である。

- 初期段階では過剰なAI利用を避ける。

- 高コスト処理は目的を明確にする。

- 大量生成前に少量で検証する。

- 再利用できるプロンプトを整備する。

- 成果の低い生成処理を継続しない。

- AI利用コストをCampaign、SNS Account、Article、KPIと比較する。

- 人的作業削減効果も確認する。

### 26.2 Cost Items

確認すべき費用項目は以下である。

- Text Generation Cost

- Image Generation Cost

- Video Generation Cost

- Embedding Cost

- Search or Retrieval Cost

- API Call Cost

- Storage Cost

- Review Labor Cost

- Rework Cost

- Failed Output Cost

### 26.3 Cost Risk

AIコスト管理を行わない場合、以下のリスクがある。

- 大量生成による費用増大

- 低品質出力の増加

- レビュー負荷の増加

- 使わない出力の蓄積

- Campaign別ROIの悪化

- 成果とコストの関係が見えなくなる

## 27. AI Observability and Monitoring

AI基盤では、AI利用状況、出力状態、コスト、エラー、承認状態を監視対象とする。

### 27.1 Monitoring Targets

監視対象は以下である。

- AI Request Count

- AI Output Count

- Prompt Usage

- Model Usage

- AI Error

- AI Latency

- AI Cost

- Human Review Status

- Approval Status

- Rejection Rate

- Modification Rate

- Published Output Count

- KPI After Use

- Risk Level

### 27.2 Required Logs

記録対象は以下である。

- AIリクエスト履歴

- Prompt ID

- Use Case

- 対象SNS Account

- 対象WordPress Article

- 対象Campaign

- 出力タイプ

- エラー履歴

- コスト履歴

- レビュー履歴

- 承認履歴

- 採用結果

- KPI結果

- 改善履歴

### 27.3 Alert Conditions

以下の場合は通知または確認対象とする。

- AI API接続失敗

- 連続エラー

- コスト急増

- 高リスク出力の増加

- 未レビュー出力の滞留

- 無承認公開の疑い

- Secret混入の疑い

- KPI悪化

- Rejection Rateの急上昇

## 28. AI Data Model Overview

AI基盤の論理データモデルは以下である。

AI Platform
    |
    +-- Prompt
    +-- AI Output
    +-- Review
    +-- Approval
    +-- Risk Status
    +-- Cost Record
    +-- KPI Reference
    +-- Operation Log

SNS、WordPress、Campaignとの関係は以下である。

AI Output
    |
    +-- SNS Account
    +-- SNS Post
    +-- WordPress Site
    +-- Article
    +-- Landing Page
    +-- Campaign
    +-- KPI

### 28.1 Prompt Entity

Promptは、AI利用の入力テンプレート、用途、条件、出力形式を管理する。

### 28.2 AI Output Entity

AI Outputは、AI生成物またはAI分析結果を管理する。

### 28.3 Review Entity

Reviewは、人間による確認結果、コメント、修正指示を管理する。

### 28.4 Approval Entity

Approvalは、承認者、承認日、承認条件、承認範囲を管理する。

### 28.5 Cost Record Entity

Cost Recordは、AI利用にかかった費用または推定費用を管理する。

### 28.6 Risk Status Entity

Risk Statusは、AI出力またはAI利用に関連するリスク状態を管理する。

物理テーブル設計は、08_Database.md で定義する。

## 29. Scale Architecture

AI基盤は、SNSアカウント数、WordPress記事数、Campaign数、AI出力数の増加に合わせて段階的に拡張する。

### 29.1 Scale Stages

Stage 1: 初期AI支援と20SNSアカウント運用
Stage 2: 21から50SNSアカウントと記事制作支援
Stage 3: 51から100SNSアカウントとAI Output Registry拡張
Stage 4: 101から300SNSアカウントと高度な分析支援
Stage 5: 301から500SNSアカウントと本格的なAI改善基盤

### 29.2 Stage 1

初期段階では、以下を基本とする。

- 手動プロンプト管理

- AI Output簡易台帳

- SNS投稿案作成

- WordPress記事案作成

- Codex作業指示書作成補助

- 人間レビュー

- 手動KPI分析補助

### 29.3 Stage 2

以下を追加検討する。

- Prompt Registry

- AI Output Registry

- 用途別プロンプト整理

- SNS投稿改善提案

- 記事改善提案

- KPI分析テンプレート

- コスト記録

### 29.4 Stage 3

以下を追加検討する。

- Database管理

- Human Review Workflow

- AI出力とSNS / WordPress / Campaignの紐付け

- KPI連携

- リスクレベル管理

- 承認履歴管理

### 29.5 Stage 4

以下を追加検討する。

- 高度なKPI分析

- AI改善提案の自動生成

- 未レビュー出力アラート

- コストダッシュボード

- リスク検知強化

- Prompt品質管理

### 29.6 Stage 5

以下を追加検討する。

- AI改善ループの高度化

- Campaign別AI ROI分析

- アカウント別改善提案

- 記事ポートフォリオ改善提案

- 自動棚卸し

- 監査ログ強化

- 本格的なAI運用基盤

## 30. AI Scale Gate

次のAI運用Stageへ進む前に、AI Scale Gate Reviewを行う。

AI Scale Gate Review

1. 現在のAI利用件数
2. 現在のAI出力数
3. 未レビューAI出力数
4. 承認済みAI出力数
5. 却下率
6. 修正率
7. 採用後KPI
8. AI利用コスト
9. Campaign別AI効果
10. SNS Account別AI効果
11. WordPress Article別AI効果
12. 高リスク出力の発生状況
13. Secret混入リスク
14. 人間レビュー負荷
15. Prompt Registryの整備状況
16. AI Output Registryの整備状況
17. 次Stageへ進む必要性

AI Scale Gateを通過できない場合は、AI利用量を増やさず、プロンプト品質、レビュー体制、コスト管理、出力品質を改善する。

## 31. Cost and ROI Review

AI利用は、成果とコストの関係を定期的に確認する。

### 31.1 Review Targets

確認対象は以下である。

- AI生成投稿の成果

- AI支援記事の成果

- AI改善提案の採用率

- AI改善後KPI

- AIコスト

- 人間レビュー時間

- 修正作業時間

- 却下された出力の割合

- 再利用可能なプロンプト数

### 31.2 ROI Review

AI ROIを確認する場合は、以下を見る。

AI ROI Review

1. AI利用目的
2. AI利用コスト
3. 人的作業削減効果
4. KPI改善効果
5. CV改善効果
6. 売上または成果への影響
7. 品質改善効果
8. リスク増加の有無

## 32. Operations Policy

AI基盤の日常運用では、以下を行う。

### 32.1 Regular Checks

定期確認項目は以下である。

- Prompt Registry更新状況

- AI Output Registry更新状況

- 未レビューAI出力

- 承認待ちAI出力

- 高リスクAI出力

- AI利用コスト

- AIエラー

- 採用後KPI

- Prompt品質

- 出力品質

- Secret混入疑い

- Human Review負荷

### 32.2 Change Management

以下の変更は記録する。

- Prompt追加

- Prompt変更

- Prompt廃止

- AIサービス変更

- AIモデル変更

- AI出力利用ルール変更

- Human Review条件変更

- Approval Gate変更

- 高リスク領域の扱い変更

- コスト管理方針変更

### 32.3 AI Output Retirement

AI出力を廃止またはアーカイブする場合は、以下を確認する。

- 関連SNS Account

- 関連WordPress Article

- 関連Campaign

- 採用有無

- KPI結果

- リスク状態

- 保管要否

- AI Output Registry更新

詳細な運用手順は、11_Operations.md で定義する。

## 33. Incident Handling

AI基盤で異常が発生した場合、以下の流れで対応する。

Detect
  |
  v
Identify AI Output or Prompt
  |
  v
Identify Related SNS / WordPress / Campaign
  |
  v
Check Risk and Impact
  |
  v
Stop Use if Needed
  |
  v
Mitigate
  |
  v
Record Incident
  |
  v
Update Status

### 33.1 Common Incidents

想定される異常は以下である。

- AI APIが失敗する。

- AI出力が不正確である。

- AI出力に誤情報が含まれる。

- AI出力に規約違反リスクがある。

- AI出力にSecretが含まれる。

- AI出力が無レビューで使われる。

- AIコストが急増する。

- 高リスク出力が増える。

- AI改善提案によりKPIが悪化する。

- Prompt変更により出力品質が低下する。

### 33.2 Incident Records

障害対応では、以下を記録する。

- 発生日

- 対象AI Output

- 対象Prompt

- 対象SNS Account

- 対象WordPress Article

- 対象Campaign

- 発生内容

- 原因

- 対応内容

- 復旧結果

- 再発防止策

- 担当者

## 34. Integration with Other Chapters

本章は、以下の章と連携する。

### 34.1 02 Overall Architecture

AI基盤は、Growth Lab Core全体アーキテクチャのAI and Automation Layer、Application Layer、Analytics Engine、Audit Logに関係する。

### 34.2 03 Mail Platform

AIは、メールアカウント管理や通知管理の設計支援を行う。
メールアカウント、認証、復旧の詳細は03 Mail Platformで扱う。

### 34.3 04 SNS Platform

AIは、SNS投稿案、プロフィール案、投稿改善案、KPI分析補助を行う。
SNS Account、投稿、Publishing、SNS Scale Gateの詳細は04 SNS Platformで扱う。

### 34.4 05 WordPress Platform

AIは、WordPress記事案、SEO改善案、LP改善案、アフィリエイト導線改善案を行う。
WordPress Site、Article、LP、Affiliate Link、WordPress Scale Gateの詳細は05 WordPress Platformで扱う。

### 34.5 07 Growth Lab Core System

AI Engine、Prompt Management、AI Output Registry、Human Review Workflow、Automation Engine、Monitoringを扱う。

### 34.6 08 Database

Prompt Registry、AI Output Registry、Review、Approval、Cost Record、Risk StatusをDatabaseへ移行する。

### 34.7 09 API and OAuth

AI API、AIサービス認証、API Key、レート制限、モデル接続、外部API連携を扱う。

### 34.8 10 Security

Secret管理、機密情報、個人情報、AI入力データ制限、監査ログを扱う。

### 34.9 11 Operations

AI出力レビュー、承認、プロンプト更新、インシデント対応、棚卸し、廃止の運用手順を扱う。

### 34.10 12 Analytics and KPI

AIによるKPI分析、改善提案、AI ROI、AI出力の成果測定を扱う。

## 35. Chapter Responsibility Boundary

本章では、AI基盤の上位設計を定義する。

詳細設計は、以下の章または下位文書で定義する。

06 AI Platform
    |
    +-- Defines:
    |       +-- AI platform architecture
    |       +-- AI role and responsibility
    |       +-- Prompt Management policy
    |       +-- Prompt Registry policy
    |       +-- AI Output Registry policy
    |       +-- Human Review policy
    |       +-- AI execution boundary
    |       +-- High-risk domain policy
    |       +-- AI cost policy
    |       +-- AI scale policy
    |
    +-- Does not define:
            +-- Detailed prompt templates
            +-- Detailed AI API endpoint specification
            +-- Detailed model comparison
            +-- Detailed SNS operation
            +-- Detailed WordPress article writing
            +-- Detailed database table design
            +-- Detailed security implementation
            +-- Detailed operation runbook

詳細な手順は、AI運用マニュアル、Prompt Library、Operations章、Database章、API and OAuth章、Security章、Analytics and KPI章で定義する。

## 36. Architecture Constraints

AI基盤では、以下の制約を前提とする。

- AIは重要判断を単独で確定しない。

- AI出力を無レビューで外部公開しない。

- SNS投稿公開には人間レビューを入れる。

- WordPress記事公開には人間レビューを入れる。

- LP公開には人間レビューを入れる。

- アフィリエイトリンク掲載には人間レビューを入れる。

- 高リスク領域では追加レビューを行う。

- SecretをAI入力に含めない。

- SecretをAI出力に含めない。

- SecretをAI Output Registryに記録しない。

- Prompt Registryを管理する。

- AI Output Registryを正本とする。

- AIサービスの画面履歴を正本として扱わない。

- AI利用コストを管理する。

- AI改善提案はKPIと紐付ける。

- 拡張前にAI Scale Gate Reviewを行う。

## 37. Risks

本章に関連する主なリスクは以下である。

### 37.1 Risk: AI出力の誤情報

AIが不正確な情報を生成し、SNS投稿やWordPress記事に使われる可能性がある。

軽減策：

- 人間レビューを必須にする。

- 事実確認を行う。

- 高リスク領域は追加レビューする。

- AI出力をそのまま正しい情報として扱わない。

### 37.2 Risk: 無承認公開

AI生成物が人間レビューなしで外部公開される可能性がある。

軽減策：

- Approval Gateを設定する。

- AI Output Statusを管理する。

- 未承認出力を公開対象にしない。

- 公開ログを記録する。

### 37.3 Risk: 規約違反や広告表現違反

AI出力により、SNS、ASP、広告主、法令に反する表現が生まれる可能性がある。

軽減策：

- Compliance Firstを徹底する。

- 広告表現を確認する。

- ASP規約を確認する。

- 高リスク出力をRisk Levelで管理する。

### 37.4 Risk: Secret混入

AI入力やAI出力にSecretや認証情報が含まれる可能性がある。

軽減策：

- SecretをAI入力に含めない。

- AI出力にSecretがないか確認する。

- AI Output RegistryにSecretを保存しない。

- ログにもSecretを残さない。

### 37.5 Risk: AIコスト増大

大量生成や高コストモデル利用により、費用が増大する可能性がある。

軽減策：

- AI Costを記録する。

- 大量生成前に少量検証する。

- Campaign別ROIを確認する。

- 成果の低い生成処理を継続しない。

### 37.6 Risk: レビュー負荷の増大

AI出力が増えすぎて、人間レビューが追いつかなくなる可能性がある。

軽減策：

- AI Scale Gate Reviewを行う。

- 未レビュー出力を監視する。

- 出力量を調整する。

- Prompt品質を改善する。

- 低価値な生成を減らす。

### 37.7 Risk: AIへの過信

AI提案を過信し、KPI、規約、セキュリティ、ユーザー体験を十分に確認しない可能性がある。

軽減策：

- AIは支援機能と明記する。

- 重要判断は人間が行う。

- KPIで結果を確認する。

- 監査ログを残す。

### 37.8 Risk: Prompt品質低下

プロンプトが不適切で、低品質な出力や誤った出力が増える可能性がある。

軽減策：

- Prompt Registryを管理する。

- Prompt Versionを管理する。

- 出力品質を確認する。

- 採用率や却下率を確認する。

- 必要に応じてPromptを改善する。

## 38. Required Review Checklist

本章またはAI基盤を更新する場合は、以下を確認する。

AI Platform Review Checklist

1. AI基盤の全体方針が明確か
2. AIの役割と責任境界が明確か
3. AI Assistant、AI Engine、Codex、Claude Codeの関係が明確か
4. Prompt Managementが定義されているか
5. Prompt Registryが定義されているか
6. AI Output Registryが正本として定義されているか
7. AI Output Lifecycleが定義されているか
8. Human Review / Approval Gateが定義されているか
9. SNS AI利用方針が定義されているか
10. WordPress AI利用方針が定義されているか
11. Analytics and KPI AI利用方針が定義されているか
12. AI Execution Boundaryが定義されているか
13. 高リスク領域の扱いが定義されているか
14. SecretをAI入力や出力に含めない方針が明確か
15. AI Cost Optimizationが定義されているか
16. AI Observabilityが定義されているか
17. AI Scale Gateが定義されているか
18. Codex / Claude Code支援方針が定義されているか
19. 下位章との責任分担が明確か
20. ADRが必要な判断が整理されているか

## 39. Review Points

本章のレビューでは、以下を確認する。

- AI基盤がGrowth Lab Coreの中核支援機能として定義されているか。

- AIが重要判断を単独で確定しない方針が明確か。

- AI出力を無レビューで外部公開しない方針が明確か。

- Prompt Managementが管理対象として定義されているか。

- Prompt Registryが定義されているか。

- AI Output Registryが正本として明確か。

- SNS、WordPress、Analytics、Automationとの関係が明確か。

- 高リスク領域の扱いが明確か。

- Secretや機密情報の扱いが明確か。

- AI CostとAI ROIを確認できるか。

- AI Scale Gateが拡張判断に使える内容になっているか。

- Codex / Claude Codeとの責任分界が明確か。

- 03 Mail Platform、04 SNS Platform、05 WordPress Platformと責任分界が明確か。

- Codex反映時に章構成が崩れにくい構成になっているか。

## 40. Architecture Decision Records

本章に関連するADRは以下の通りである。

Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core

本章に関連して、今後追加が想定されるADRは以下である。

```text
ADR-0005: Core Architecture Principles
ADR-0008: AI First Operation Policy
ADR-0025: SNS Platform Architecture
ADR-0034: WordPress Platform Architecture
ADR-0043: AI Platform Architecture
ADR-0044: Prompt Management Policy
ADR-0045: AI Output Registry Policy
ADR-0046: Human Review and Approval Gate Policy
ADR-0047: AI Execution Boundary Policy
ADR-0048: High-Risk Domain AI Usage Policy
ADR-0049: AI Cost and ROI Policy
ADR-0050: AI Scale Gate Policy
ADR-0051: Codex and Claude Code AI Support Policy
```

以下の判断を変更する場合は、ADR作成を検討する。

- AIの責任範囲変更

- AI Output Registryの正本変更

- Prompt Management方式の変更

- AI出力の無レビュー公開を許可する変更

- AIによる外部実行範囲の拡大

- 高リスク領域の扱い変更

- AIサービスまたはモデルの大幅変更

- AIコスト管理方式の変更

- AI Scale Gate方針の変更

- Codex / Claude Codeへの権限拡大
