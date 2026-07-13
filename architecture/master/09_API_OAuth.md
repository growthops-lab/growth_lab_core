# 09 API and OAuth

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/09_API_OAuth.md

---

## 1. Purpose

本章の目的は、Growth Lab CoreにおけるAPI連携およびOAuth基盤の設計方針を定義することである。

Growth Lab Coreは、SNS、Mail、Google Workspace、Gmail、WordPress、AI、Analytics、Search Console、Affiliate ASP、Notificationなど、複数の外部サービスと連携する。
これらの外部サービス連携は、可能な限り公式API、OAuth、Webhook、公式SDK、公式管理機能を利用する。

API and OAuth基盤は、単なる外部接続機能ではない。
Growth Lab Coreにおける外部実行、データ取得、状態同期、投稿、分析、通知、Automation、Audit Log、Security、Operationsを支える重要な接続基盤である。

本章では、以下を定義する。

- API and OAuth全体方針
- 07 Growth Lab Core Systemとの責任分界
- 08 Databaseとの責任分界
- 10 Securityとの責任分界
- API First方針
- External Service Integration方針
- API Adapter方針
- OAuth方針
- OAuth Scope管理方針
- Token Reference方針
- API Credential Reference方針
- OAuthとSecretの境界
- Webhook方針
- Rate Limit方針
- Retry方針
- Timeout方針
- API Error Handling方針
- Mock Mode / Sandbox方針
- API Logging方針
- Audit Log連携方針
- Scheduler / Automationとの関係
- SNS API方針
- WordPress REST API方針
- Google / Gmail API方針
- AI API方針
- Analytics API方針
- Affiliate API方針
- Notification API方針
- API Observability
- API and OAuth Scale Gate
- 運用リスクと軽減策

---

## 2. Scope

本章の対象範囲は、Growth Lab Coreが外部サービスと接続するためのAPIおよびOAuth基盤全体である。

対象範囲は以下を含む。

- API Architecture
- External Service Integration
- API Adapter
- OAuth Authorization
- OAuth Scope
- OAuth Connection Status
- Token Reference
- API Key Reference
- Credential Reference
- Webhook
- Rate Limit
- Retry
- Timeout
- API Error Handling
- API Logging
- API Audit
- Mock Mode
- Sandbox Mode
- API Versioning
- Provider Change Management
- SNS API方針
- WordPress REST API方針
- Google API方針
- Gmail API方針
- AI API方針
- Analytics API方針
- Search Console API方針
- Affiliate API方針
- Notification API方針
- API and OAuth Scale Gate

本章では、Secret実体、Token実体、API Key実体、Client Secret実体、Refresh Token実体、暗号化鍵、Secret Storeの具体実装までは定義しない。
それらは、`10_Security.md` または下位実装仕様で定義する。

本章では、個別外部サービスの全APIエンドポイント一覧、全リクエスト形式、全レスポンス形式、全SDK実装コードまでは定義しない。
それらは、下位実装仕様または実装リポジトリで定義する。

---

## 3. Non-Goals

本章では、以下を対象外とする。

- API Key実体
- OAuth Token実体
- OAuth Refresh Token実体
- Client Secret実体
- TOTP Secret実体
- Recovery Code実体
- Secret Storeの具体実装
- 暗号化鍵の管理手順
- 個別APIエンドポイント全文
- 個別APIリクエスト全文
- 個別APIレスポンス全文
- SDK実装コード全文
- SNSごとの詳細投稿手順
- WordPress REST APIの詳細実装コード
- Gmail APIの詳細実装コード
- AI APIの詳細実装コード
- Analytics APIの詳細実装コード
- 本番外部サービス契約手順
- 本番OAuthアプリ審査手順
- 日次運用Runbook
- Security Incident詳細手順
- KPI計算式詳細

これらは、Security章、Operations章、Analytics and KPI章、下位実装仕様、または実装リポジトリで定義する。

---

## 4. Background

Growth Lab Coreでは、複数の外部サービスと連携する。

主な連携対象は以下である。

- X
- Instagram
- TikTok
- YouTube
- Facebook
- Threads
- Pinterest
- WordPress
- Google Workspace
- Gmail
- Google Analytics
- Google Search Console
- AI Services
- Affiliate ASP
- Notification Services

外部サービス連携を統一方針なしに実装すると、以下の問題が発生する。

- API接続方式がばらつく。
- OAuth Scopeが過剰になる。
- Token管理が不安全になる。
- Rate Limitを超過する。
- Retryが暴走する。
- API失敗時の影響範囲が分からない。
- Mock Modeがなく本番誤実行が起きる。
- Audit Logが不足する。
- 非公式手段に依存して規約違反リスクが高まる。
- 外部API仕様変更に追従できない。
- Automationが未承認外部実行を行う。
- SecretとOAuth Connectionの責任分界が曖昧になる。

そのため、Growth Lab Coreでは、API and OAuth基盤を統一方針のもとで設計する。

---

## 5. Alignment with Architecture Principles

本章は、`01_Architecture_Principles.md` で定義した原則に従う。

特に、API and OAuth基盤では以下を重視する。

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

API and OAuth基盤における優先順位は以下である。

```text
1. 規約遵守
2. セキュリティ
3. 公式API優先
4. 最小権限
5. 人間承認
6. 監査可能性
7. 安定性
8. Rate Limit遵守
9. Mock Mode
10. 拡張性
11. コスト最適化
12. 継続改善
```

外部サービス連携は、公式API、公式OAuth、公式Webhook、公式SDKを優先する。
非公式API、スクレイピング、制限回避、自動操作は、規約違反リスクが高いため、原則として通常運用にしない。

---

## 6. API and OAuth Vision

Growth Lab CoreのAPI and OAuth基盤は、外部サービスとの接続を安全、監査可能、拡張可能にするためのIntegration Control Layerである。

```text
Growth Lab Core
    |
    +-- API Layer
    +-- Application Layer
    +-- Integration Layer
            |
            +-- SNS API Adapter
            +-- WordPress REST API Adapter
            +-- Google API Adapter
            +-- Gmail API Adapter
            +-- AI API Adapter
            +-- Analytics API Adapter
            +-- Affiliate API Adapter
            +-- Notification API Adapter
                    |
                    v
            External Services
```

API and OAuth基盤は、以下を実現する。

- 外部サービス接続の標準化
- OAuth Scopeの管理
- Token参照の安全化
- Rate Limitの遵守
- Retryの制御
- API Errorの記録
- Webhookの受信管理
- Mock Modeでの安全検証
- Audit Logとの連携
- Scheduler / Automationとの安全な接続
- API変更時の影響範囲管理

---

## 7. Relationship with 07, 08, and 10

`07_Growth_Lab_Core_System.md` は、Growth Lab Core Systemを統合運用OSおよびOrchestration Layerとして定義する。
`08_Database.md` は、運用データの永続化、Entity、Relation、Migration、Backup、Scale Gateを定義する。
`10_Security.md` は、Secret実体、認証、認可、暗号化、Access Control、Security Incidentを定義する。
本章は、外部サービスとのAPIおよびOAuth連携方針を定義する。

責任分界は以下である。

```text
07 Growth Lab Core System
    |
    +-- Orchestration
    +-- Workflow
    +-- Approval Gate
    +-- Scheduler
    +-- Automation
    +-- Integration Layer Policy
    |
    v
09 API and OAuth
    |
    +-- External API Connection Policy
    +-- OAuth Policy
    +-- Scope Policy
    +-- Token Reference Policy
    +-- Webhook Policy
    +-- Rate Limit Policy
    +-- Retry Policy
    +-- API Adapter Policy
    |
    +-- Stores references and states through:
    v
08 Database
    |
    +-- API Connection State Reference
    +-- OAuth Reference
    +-- Token Reference Metadata
    +-- API Logs Reference
    +-- Webhook Event Reference
    +-- Audit Log Relation
    |
    +-- Protects actual secrets through:
    v
10 Security
    |
    +-- Secret Store
    +-- Token Encryption
    +-- API Key Protection
    +-- Client Secret Protection
    +-- Access Control
    +-- Security Incident
```

07章は「いつ、何を、承認後に実行するか」を管理する。
09章は「外部サービスへどのように安全に接続するか」を管理する。
08章は「接続状態、履歴、参照情報をどう保存するか」を管理する。
10章は「Secret実体をどう保護するか」を管理する。

---

## 8. Overall API Architecture

Growth Lab CoreのAPI Architectureは以下を基本とする。

```text
Application Use Case
    |
    v
Integration Service
    |
    v
API Adapter
    |
    +-- Request Builder
    +-- Auth Handler
    +-- Rate Limit Handler
    +-- Retry Handler
    +-- Error Handler
    +-- Response Normalizer
    +-- Log Handler
    |
    v
External API
```

Application Layerは、外部APIを直接呼び出さない。
外部API接続はIntegration LayerおよびAPI Adapterを経由する。

---

## 9. API First Policy

Growth Lab Coreでは、公式APIを優先する。

### 9.1 API First Rules

API Firstのルールは以下である。

- 公式APIを優先する。
- 公式OAuthを優先する。
- 公式Webhookを優先する。
- 公式SDKを優先する。
- 公式管理画面の機能を尊重する。
- API利用規約を確認する。
- Rate Limitを遵守する。
- APIで許可されていない操作を自動化しない。
- 非公式手段を通常運用にしない。
- API仕様変更を監視する。

### 9.2 Non-API Alternatives

公式APIで代替できない場合は、以下の手段を検討する。

- 公式管理画面での手動操作
- 公式予約投稿機能
- 公式CSV Export / Import
- 公式通知メール
- 手動レビュー
- 半自動運用
- 運用マニュアル化

非公式自動操作を検討する場合は、規約、リスク、影響範囲、停止条件、ADR作成要否を確認する。

---

## 10. External Service Integration Policy

外部サービス連携は、ProviderごとにAdapterを分離する。

### 10.1 External Service Categories

外部サービスは以下のカテゴリに分類する。

```text
External Service Categories

1. SNS Platform
2. Mail Platform
3. WordPress Platform
4. Google Platform
5. AI Platform
6. Analytics Platform
7. Affiliate Platform
8. Notification Platform
9. Hosting Platform
```

### 10.2 Integration Rules

連携ルールは以下である。

- ProviderごとにAdapterを分離する。
- Domain LogicをProvider仕様に依存させすぎない。
- API Responseを内部形式に正規化する。
- API Errorを内部Error形式に変換する。
- Provider固有制限をAdapter内で扱う。
- 外部API変更時の影響範囲を局所化する。
- Mock Adapterを用意する。
- 本番接続とMock接続を明確に分ける。

---

## 11. API Adapter Policy

API Adapterは、外部サービス接続の境界である。

### 11.1 API Adapter Responsibilities

API Adapterの責任は以下である。

- API Request構築
- Authentication Header付与
- OAuth Token参照
- API Key参照
- Rate Limit考慮
- Retry制御
- Timeout制御
- API Response正規化
- API Error変換
- API Log出力
- Audit Log連携
- Mock Response提供

### 11.2 Adapter Rules

Adapter設計のルールは以下である。

- ProviderごとにAdapterを分離する。
- Secret実体をAdapterコードへ直書きしない。
- Token実体を通常ログへ出さない。
- RequestとResponseの必要最小限を記録する。
- 個人情報やSecretをLogへ残さない。
- API仕様変更に備える。
- Mock Modeをサポートする。
- Error時に影響範囲を返せるようにする。

### 11.3 Adapter Detail Boundary

本章では、Adapterの責任と方針を定義する。
Adapterの実装コード、SDK選定、個別ProviderごとのRequest / Response変換詳細は、下位実装仕様または実装リポジトリで定義する。

---

## 12. OAuth Policy

OAuthは、外部サービスへの安全な権限委任のために利用する。

### 12.1 OAuth Use Cases

OAuthが必要になる主な用途は以下である。

- SNS API接続
- Google API接続
- Gmail API接続
- WordPress Application PasswordまたはOAuth相当接続
- Analytics API接続
- Search Console API接続
- Affiliate API接続
- Notification API接続

### 12.2 OAuth Rules

OAuth運用ルールは以下である。

- OAuthは公式フローを使用する。
- 最小Scopeを選択する。
- 不要なScopeを要求しない。
- Scope変更時はApproval Gateを通す。
- OAuth App設定変更時はAudit Logへ記録する。
- Token実体を通常DBへ平文保存しない。
- Refresh Token実体を通常ログへ出さない。
- Token失効時は自動処理を停止し、人間確認を行う。
- OAuth連携状態をDatabaseまたはRegistryで参照可能にする。

### 12.3 OAuth Status

OAuth接続状態は以下を基本とする。

```text
Not Connected
Pending Authorization
Connected
Expired
Revoked
Error
Needs Review
Disabled
```

OAuth Statusは、AutomationやSchedulerの実行可否に影響する。

---

## 13. Scope Management Policy

OAuth Scopeは、外部サービスに対して許可する権限範囲である。

### 13.1 Scope Principles

Scope管理の原則は以下である。

- 最小権限を原則とする。
- Read権限とWrite権限を分ける。
- 投稿、削除、権限変更など高リスクScopeは慎重に扱う。
- 不要になったScopeは削除する。
- Scope変更は記録する。
- Scope追加はApproval Gateを通す。
- 高リスクScopeはADR作成を検討する。

### 13.2 High-Risk Scopes

高リスクScopeの例は以下である。

- 投稿作成
- 投稿削除
- アカウント設定変更
- メール送信
- メール削除
- ユーザー情報変更
- 権限変更
- 課金または広告関連操作
- 広範な読み取り権限
- 管理者権限

### 13.3 Scope Records

Scope管理では以下を記録する。

```text
OAuth Scope Record

- Service
- OAuth App
- Scope Name
- Scope Purpose
- Risk Level
- Required Flag
- Approved By
- Approved At
- Last Reviewed At
- Notes
```

Scope Recordは、Scopeの意味、目的、リスク、承認状態を管理するための記録である。
Secret実体やToken実体はScope Recordへ保存しない。

---

## 14. OAuth, Token, and Secret Boundary

本章では、OAuth接続、Scope、Token参照、Credential参照の運用方針を定義する。
Token実体、Secret実体、暗号化、Secret Store、Access Controlは、`10_Security.md` で定義する。

### 14.1 Boundary Overview

責任分界は以下である。

```text
09 API and OAuth
    |
    +-- OAuth Connection Status
    +-- OAuth Scope
    +-- Token Reference
    +-- Credential Reference
    +-- Expiration Status
    +-- Rotation Event
    +-- API Connection State
    +-- Provider Integration Policy

10 Security
    |
    +-- Token Material
    +-- API Key Material
    +-- Client Secret Material
    +-- Refresh Token Material
    +-- Secret Store
    +-- Encryption
    +-- Access Control
    +-- Secret Rotation Procedure
    +-- Security Incident
```

09章は、外部接続を運用するための参照情報と状態を扱う。
10章は、Secret実体を安全に保管、保護、アクセス制御する方法を扱う。

### 14.2 Token Types

対象となるTokenは以下である。

- Access Token
- Refresh Token
- ID Token
- API Key
- Client Secret
- Webhook Secret
- Application Password
- Session Token

### 14.3 Token Rules

Token運用ルールは以下である。

- Token実体をMarkdownに記載しない。
- Token実体を通常DBテーブルへ平文保存しない。
- Token実体を通常ログに出さない。
- Token実体をAI入力に含めない。
- Token参照IDまたはSecret Referenceを使う。
- Token失効を検知する。
- Token更新履歴をAudit Logへ記録する。
- Token削除または無効化はApproval Gateを通す。

### 14.4 Token Reference

Databaseには、Token実体ではなく参照情報を保存する。

```text
Token Reference Conceptual Fields

- Token Reference ID
- Service
- Account ID
- Scope Summary
- Status
- Secret Store Reference
- Created At
- Expires At
- Last Rotated At
- Last Checked At
- Owner
- Notes
```

Token Referenceは、Secret実体そのものではない。
Secret Store Referenceも、Secretを復元できる情報を平文で含めてはならない。

---

## 15. API Credential Reference Policy

API Credentialは外部API接続に必要な認証情報である。

### 15.1 Credential Types

主なCredentialは以下である。

- API Key
- Client ID
- Client Secret
- OAuth Token
- Refresh Token
- Webhook Secret
- Application Password
- Service Account Reference

### 15.2 Credential Rules

Credential管理ルールは以下である。

- Credential実体をMarkdownへ書かない。
- Credential実体を通常DBへ平文保存しない。
- Credential実体をGit管理しない。
- Credential実体をAI入力へ含めない。
- Credential参照のみをDatabaseに保存する。
- Credential変更はAudit Logへ記録する。
- Credential変更はApproval Gateを通す。
- Credential漏洩疑いがある場合はSecurity Incidentとして扱う。

---

## 16. Webhook Policy

Webhookは、外部サービスからGrowth Lab Coreへイベントを通知する仕組みである。

### 16.1 Webhook Use Cases

Webhook利用候補は以下である。

- SNSイベント通知
- WordPress更新通知
- Form送信通知
- Affiliate成果通知
- Analyticsイベント通知
- PaymentまたはConversion通知
- Automation結果通知
- External Job完了通知

### 16.2 Webhook Rules

Webhook運用ルールは以下である。

- Webhook署名検証を行う。
- Webhook Secretを平文保存しない。
- 受信イベントを記録する。
- 重複イベントを検出する。
- 不正なイベントを拒否する。
- 冪等性を考慮する。
- 失敗時はRetryまたはDead Letterを検討する。
- 高リスクイベントはApproval Gateを通す。
- Webhookから直接未承認外部実行を行わない。

### 16.3 Webhook Event Status

Webhook Event状態は以下を基本とする。

```text
Received
Validated
Rejected
Processed
Failed
Retried
Ignored
Archived
```

### 16.4 Webhook Record

Webhook Eventでは以下を記録する。

```text
Webhook Event Conceptual Fields

- Webhook Event ID
- Provider
- Event Type
- Target Type
- Target ID
- Received At
- Validation Status
- Processing Status
- Retry Count
- Error Reference
- Audit Log ID
```

Webhook Eventの物理保存設計は08 Databaseで扱う。
Webhook Secret実体の管理は10 Securityで扱う。

---

## 17. Rate Limit Policy

Rate Limitは、外部サービスごとのAPI利用制限である。

### 17.1 Rate Limit Principles

Rate Limit方針は以下である。

- ProviderのRate Limitを遵守する。
- Rate Limitを回避しない。
- RetryでRate Limitを悪化させない。
- Rate Limit情報を可能な範囲で記録する。
- API利用量を監視する。
- 大量実行前に影響を確認する。
- Scale GateでAPI制限を確認する。

### 17.2 Rate Limit Handling

Rate Limit発生時は以下を行う。

- 該当処理を一時停止する。
- Retry間隔を空ける。
- Error Logを残す。
- Automationを必要に応じて停止する。
- 人間確認を要求する。
- 連続発生時はIncident扱いにする。

### 17.3 Rate Limit Record

Rate Limit関連情報として以下を記録する。

```text
Rate Limit Record

- Provider
- Endpoint Group
- Limit Type
- Remaining Count
- Reset Time
- Last Error At
- Impacted Job
- Status
- Notes
```

---

## 18. Retry and Backoff Policy

Retryは一時的な失敗に対応するために利用する。
ただし、無制限Retryは禁止する。

### 18.1 Retry Principles

Retry方針は以下である。

- Retry回数に上限を設ける。
- Exponential Backoffを検討する。
- Rate Limit時は慎重にRetryする。
- 認証失敗時は自動Retryを続けない。
- 4xx系と5xx系を区別する。
- 重複実行を防ぐ。
- 冪等性を確認する。
- Retry失敗時はErrorまたはIncidentとして扱う。

### 18.2 Retry Not Allowed Cases

以下の場合は自動Retryを慎重に扱うか、禁止する。

- 認証失敗
- 権限不足
- Scope不足
- Token失効
- 投稿作成済みか不明な状態
- 課金または広告関連操作
- 削除操作
- アカウント設定変更
- Rate Limit連続発生
- ProviderがRetryを禁止している場合

### 18.3 Retry Boundary

本章ではRetry方針を定義する。
具体的なRetry回数、Backoff秒数、Queue実装、Dead Letter実装は、下位実装仕様または11 Operationsで定義する。

---

## 19. Timeout Policy

外部API接続ではTimeoutを設定する。

### 19.1 Timeout Rules

Timeout方針は以下である。

- API種類ごとにTimeoutを設定する。
- 長時間待機を避ける。
- Timeout時はError Logを残す。
- Timeout後の重複実行に注意する。
- 外部実行結果が不明な場合は確認状態にする。
- Timeout連続発生時はMonitoring対象にする。

### 19.2 Timeout Status

Timeout発生時の状態は以下を基本とする。

```text
Timeout
Unknown Result
Needs Confirmation
Retry Scheduled
Failed
Resolved
```

具体的なTimeout秒数は、Provider、Endpoint、処理内容により異なるため、下位実装仕様で定義する。

---

## 20. API Error Handling Policy

API Errorは、外部サービス依存を前提として通常発生し得る状態として扱う。

### 20.1 API Error Types

主なAPI Errorは以下である。

- Validation Error
- Authentication Error
- Authorization Error
- Scope Error
- Token Expired Error
- Rate Limit Error
- Timeout Error
- Network Error
- Provider Error
- Maintenance Error
- Unknown Result Error
- Webhook Validation Error

### 20.2 Error Handling Rules

API Error処理のルールは以下である。

- Errorを握りつぶさない。
- Error Typeを分類する。
- Provider Responseを必要最小限で記録する。
- SecretをError Logへ記録しない。
- User向けMessageとInternal Logを分ける。
- Authentication ErrorではAutomationを停止する。
- Rate Limit ErrorではRetryを制限する。
- Unknown Resultでは重複実行を避ける。
- Incident作成要否を判断する。

### 20.3 API Error Record

API Errorでは以下を記録する。

```text
API Error Conceptual Fields

- API Error ID
- Provider
- Endpoint Group
- Error Type
- Status Code
- Error Summary
- Target Type
- Target ID
- Occurred At
- Retry Count
- Resolved At
- Incident ID
- Notes
```

API Errorの物理保存設計は08 Databaseで扱う。
Incident対応手順は11 Operationsで扱う。

---

## 21. API Logging Policy

API Loggingは、トラブルシュート、監査、改善のために必要である。
ただし、Secretや個人情報を過剰に記録しない。

### 21.1 API Log Targets

API Log対象は以下である。

- Provider
- Adapter
- Endpoint Group
- Request Type
- Target Type
- Target ID
- Result
- Status Code
- Latency
- Retry Count
- Error Summary
- Timestamp
- Actor
- Automation Job ID
- Audit Log ID

### 21.2 Logging Rules

API Loggingのルールは以下である。

- Secret実体をLogに残さない。
- Token実体をLogに残さない。
- Request Body全文を無条件に保存しない。
- Response Body全文を無条件に保存しない。
- 必要最小限のSummaryを保存する。
- Debug Logを本番で過剰に出さない。
- 高リスク操作はAudit Logへ接続する。
- 保存期間はOperations章で定義する。

---

## 22. Audit Log Integration Policy

API操作のうち重要操作はAudit Logへ記録する。

### 22.1 Audit Required API Actions

Audit Logが必要なAPI操作は以下である。

- SNS投稿公開
- WordPress記事公開
- LP公開
- アフィリエイトリンク変更
- OAuth接続作成
- OAuth接続解除
- Scope変更
- Token Rotation
- Webhook設定変更
- Automationによる外部実行
- Account設定変更
- Delete操作
- Scale Stage変更

### 22.2 Audit Rules

Audit連携ルールは以下である。

- Actorを記録する。
- Targetを記録する。
- Before / Afterを可能な範囲で記録する。
- Approval IDと紐付ける。
- Automation Job IDと紐付ける。
- Error時も必要に応じて記録する。
- Secret実体をAudit Logへ保存しない。

Audit Logの保存方式、保持期間、閲覧権限、改ざん防止の詳細は、08 Database、10 Security、11 Operationsで定義する。

---

## 23. Mock Mode and Sandbox Policy

Mock ModeとSandboxは、安全な開発、検証、Automationテストのために利用する。

### 23.1 Mock Mode

Mock Modeは、外部サービスへ実際の変更を行わず、内部動作を検証するためのモードである。

対象候補は以下である。

- SNS API
- WordPress REST API
- AI API
- Analytics API
- Affiliate API
- Mail Adapter
- Notification Adapter

### 23.2 Sandbox Mode

Sandbox Modeは、外部サービスが公式に提供する検証環境を利用するモードである。

利用可能な場合は、Production接続前にSandboxで検証する。

### 23.3 Mock and Sandbox Rules

ルールは以下である。

- 初期開発ではMock Modeを優先する。
- 本番APIを不用意に呼び出さない。
- Mock結果とProduction結果を混同しない。
- SandboxとProduction Credentialを分離する。
- Production切替はApproval Gateを通す。
- Mock Modeで成功しても本番成功とみなさない。
- Mock Modeの結果は明示する。

---

## 24. API Versioning and Deprecation Policy

外部APIは変更される可能性がある。
Growth Lab Coreでは、API Versionと廃止予定を管理する。

### 24.1 Versioning Rules

API Version管理ルールは以下である。

- Provider API Versionを記録する。
- SDK Versionを記録する。
- 重要AdapterのVersionを記録する。
- API Version変更時は影響範囲を確認する。
- Deprecation情報を確認する。
- Breaking Change時はADR作成を検討する。
- Production反映前にStagingまたはMockで検証する。

### 24.2 Deprecation Handling

API廃止予定が判明した場合は以下を行う。

- 影響Providerを特定する。
- 影響Adapterを特定する。
- 影響Workflowを特定する。
- 影響Automationを特定する。
- 代替APIを確認する。
- Migrationまたは改修計画を作成する。
- 必要に応じてRoadmapへ反映する。

---

## 25. Provider Change Management

外部Providerの仕様変更、規約変更、API制限変更は運用に影響する。

### 25.1 Change Types

想定される変更は以下である。

- API Endpoint変更
- API Version変更
- OAuth Scope変更
- Rate Limit変更
- Webhook仕様変更
- SDK変更
- 利用規約変更
- 審査要件変更
- 有料化
- API提供終了

### 25.2 Change Management Rules

変更管理ルールは以下である。

- Provider変更を確認する。
- 影響範囲を記録する。
- 関連Adapterを確認する。
- 関連Workflowを確認する。
- 関連Automationを確認する。
- 関連KPI取得を確認する。
- 重要変更はADRを検討する。
- 必要に応じてOperationsへ反映する。

---

## 26. Scheduler and Automation API Policy

SchedulerとAutomationは、API接続と密接に関係する。
ただし、未承認外部実行を許可しない。

### 26.1 Scheduler Role

Schedulerは、API処理の起動タイミングを管理する。

例は以下である。

- KPI取得
- SNS投稿予約起動
- WordPress状態確認
- OAuth状態確認
- Webhook処理再試行
- Link Check
- Report生成

### 26.2 Automation Role

Automation Engineは、API処理の実行条件、停止条件、承認条件、Retry条件を管理する。

### 26.3 API Automation Rules

API Automationルールは以下である。

- 未承認SNS投稿公開を行わない。
- 未承認WordPress記事公開を行わない。
- 未承認LP公開を行わない。
- 未承認OAuth権限変更を行わない。
- 未承認Secret変更を行わない。
- 認証失敗時はAutomationを停止する。
- Rate Limit発生時はRetryを制限する。
- API結果が不明な場合はNeeds Confirmationにする。

Scheduler、Automation、Approval Gateの上位制御は07章で定義する。
本章では、API接続時の制約、失敗時の扱い、外部実行の境界を定義する。

---

## 27. Approval Gate for External Execution

外部サービスに影響する実行はApproval Gateを通す。

### 27.1 Approval Required API Actions

以下のAPI操作はApproval Gateを必須とする。

- SNS投稿公開
- SNS投稿削除
- WordPress記事公開
- WordPress記事削除
- LP公開
- Affiliate Link変更
- OAuth Scope追加
- OAuth接続解除
- Webhook設定変更
- Account設定変更
- 広告または課金に関係する操作
- 大量API実行
- Production接続切替

### 27.2 Approval Rules

承認ルールは以下である。

- Approval IDを記録する。
- 承認対象を明確にする。
- 実行範囲を明確にする。
- 実行前に最新状態を確認する。
- 実行後に結果を記録する。
- 失敗時はErrorまたはIncidentとして扱う。

Approval Gateのワークフロー詳細は07章と11章で定義する。

---

## 28. SNS API Policy

SNS APIは、SNS Platformと連携するために利用する。

### 28.1 SNS API Use Cases

SNS API利用候補は以下である。

- SNS Account情報取得
- 投稿公開
- 投稿予約
- 投稿結果取得
- Analytics取得
- コメントまたは反応取得
- Profile情報取得
- OAuth状態確認

### 28.2 SNS API Rules

ルールは以下である。

- 公式SNS APIを優先する。
- SNSごとの利用規約を確認する。
- SNSごとのRate Limitを遵守する。
- 投稿公開にはApproval Gateを通す。
- API不可の場合は公式管理画面または手動運用を検討する。
- SNS管理画面をGrowth Lab Coreの正本として扱わない。
- SNS Account RegistryまたはDatabaseと紐付ける。
- API Errorを記録する。

SNS基盤の詳細は、`04_SNS_Platform.md` で定義する。

---

## 29. WordPress REST API Policy

WordPress REST APIは、WordPress Platformと連携するために利用する。

### 29.1 WordPress API Use Cases

WordPress API利用候補は以下である。

- 記事下書き作成
- 記事更新
- 記事公開
- LP作成
- LP更新
- Category取得
- Tag取得
- Media取得
- Site状態確認
- Link確認

### 29.2 WordPress API Rules

ルールは以下である。

- WordPress REST APIを優先する。
- WordPress記事公開にはApproval Gateを通す。
- Application Passwordまたは認証方式は安全に扱う。
- WordPress Credentialを平文保存しない。
- WordPress管理画面をGrowth Lab Coreの正本として扱わない。
- Article RegistryまたはDatabaseと紐付ける。
- API Errorを記録する。
- Backup状態を考慮して重要変更を行う。

WordPress基盤の詳細は、`05_WordPress_Platform.md` で定義する。

---

## 30. Google and Gmail API Policy

GoogleおよびGmail APIは、管理、通知、メール確認、Analytics、Search Consoleと連携するために利用する。

### 30.1 Google API Use Cases

Google API利用候補は以下である。

- Google Workspace情報確認
- Gmail通知確認
- Google Sheets連携
- Google Drive連携
- Google Analytics連携
- Google Search Console連携
- OAuth状態確認

### 30.2 Gmail API Rules

Gmail API利用ルールは以下である。

- 必要最小限のScopeを使う。
- メール本文の取得は目的を明確にする。
- 個人情報や機密情報の扱いに注意する。
- Gmail画面をGrowth Lab Coreの正本として扱わない。
- SNS Account、Mail Account、Notification状態と紐付ける。
- メール送信や削除など高リスク操作はApproval Gateを通す。
- Gmail API Errorを記録する。

Mail基盤の詳細は、`03_Mail_Platform.md` で定義する。
Security詳細は、`10_Security.md` で定義する。

---

## 31. AI API Policy

AI APIは、AI Platformと連携するために利用する。

### 31.1 AI API Use Cases

AI API利用候補は以下である。

- SNS投稿案作成
- WordPress記事案作成
- SEO改善案作成
- KPI分析補助
- Risk Detection
- Prompt実行
- AI Output生成
- AI改善提案
- Codex / Claude Code指示書作成補助

### 31.2 AI API Rules

ルールは以下である。

- AI入力にSecretを含めない。
- AI出力をそのまま外部公開しない。
- AI Output RegistryまたはDatabaseに記録する。
- 高リスク出力はHuman Reviewを必須にする。
- AI API Costを記録する。
- AI API Errorを記録する。
- Provider変更時は影響範囲を確認する。
- AIサービスの画面履歴を正本として扱わない。

AI基盤の詳細は、`06_AI_Platform.md` で定義する。

---

## 32. Analytics and Search Console API Policy

Analytics and Search Console APIは、KPI取得と改善判断に利用する。

### 32.1 Analytics API Use Cases

利用候補は以下である。

- Page View取得
- Session取得
- Click取得
- Conversion取得
- Referral取得
- Search Query取得
- Ranking関連情報取得
- Campaign別KPI取得
- Article別KPI取得
- SNS流入取得

### 32.2 Analytics API Rules

ルールは以下である。

- KPI定義と取得元を明確にする。
- 推定値と実測値を区別する。
- 欠損データを記録する。
- API取得失敗を記録する。
- Analytics Property IDなど外部IDを内部IDと分離する。
- KPI DataはDatabaseと紐付ける。
- Rate Limitを考慮する。

KPI定義、分析指標、ROI、レポートの詳細は、`12_Analytics_KPI.md` で定義する。

---

## 33. Affiliate API Policy

Affiliate APIは、ASP、広告主、成果、リンク管理と連携するために利用する。

### 33.1 Affiliate API Use Cases

利用候補は以下である。

- Affiliate Program情報取得
- Link情報取得
- 成果情報取得
- Click情報取得
- Commission情報取得
- Program Status確認
- Link切れ確認

### 33.2 Affiliate API Rules

ルールは以下である。

- ASP利用規約を確認する。
- Affiliate Link変更はApproval Gateを通す。
- 成果データはCampaign、Article、LPと紐付ける。
- Link URLの扱いに注意する。
- API Key実体を平文保存しない。
- Rate Limitを遵守する。
- API取得失敗を記録する。

Affiliate Link管理の詳細は、`05_WordPress_Platform.md` と `12_Analytics_KPI.md` で扱う。

---

## 34. Notification API Policy

Notification APIは、運用担当者への通知に利用する。

### 34.1 Notification Use Cases

通知候補は以下である。

- API Error通知
- OAuth失効通知
- Rate Limit通知
- 未レビューAI Output通知
- Approval待ち通知
- Automation失敗通知
- Scheduler失敗通知
- Database Backup失敗通知
- Incident通知
- Scale Gate Review通知

### 34.2 Notification Rules

ルールは以下である。

- 通知対象を明確にする。
- 通知頻度を制御する。
- 過剰通知を避ける。
- Secretを通知本文に含めない。
- 高リスク通知は優先度を上げる。
- 通知失敗もLogへ記録する。
- 通知先と担当者の詳細はOperations章で定義する。

---

## 35. API Data Model Overview

API and OAuth基盤の論理データモデルは以下である。

```text
API Integration
    |
    +-- Provider
    +-- API Adapter
    +-- OAuth App
    +-- OAuth Scope
    +-- Token Reference
    +-- API Credential Reference
    +-- API Request Log
    +-- API Error
    +-- Webhook Event
    +-- Rate Limit Record
    +-- Integration Status
```

Databaseに保存する場合は、Secret実体ではなく参照情報、状態、履歴、Error、Audit関係を保存する。

---

## 36. API Entity Policy

API and OAuth関連Entityは、接続状態、履歴、Error、Webhookを管理するために利用する。

本章に記載するEntity項目は、概念フィールド候補である。
物理テーブル、Prisma Schema、Column名、型、Index、Constraintは、08 Databaseおよび下位実装仕様で定義する。

### 36.1 Provider Entity

```text
Provider Conceptual Fields

- Provider ID
- Provider Name
- Provider Type
- Status
- Terms Review Status
- API Availability
- Notes
```

### 36.2 API Adapter Entity

```text
API Adapter Conceptual Fields

- API Adapter ID
- Provider ID
- Adapter Name
- Adapter Type
- Version
- Status
- Mock Supported Flag
- Last Checked At
- Owner
- Notes
```

### 36.3 OAuth Connection Entity

```text
OAuth Connection Conceptual Fields

- OAuth Connection ID
- Provider ID
- Related Account ID
- Scope Summary
- Status
- Token Reference ID
- Connected At
- Expires At
- Last Checked At
- Last Refreshed At
- Owner
- Notes
```

### 36.4 API Request Log Entity

```text
API Request Log Conceptual Fields

- API Request Log ID
- Provider ID
- Adapter ID
- Request Type
- Target Type
- Target ID
- Status
- Status Code
- Latency
- Retry Count
- Error Reference
- Audit Log ID
- Created At
```

### 36.5 Webhook Event Entity

Webhook Event Entityは、16章のWebhook Policyに従う。

### 36.6 API Entity Rules

ルールは以下である。

- Secret実体をAPI関連Entityに保存しない。
- TokenはReferenceとして扱う。
- ProviderとAdapterを分離する。
- OAuth Connection状態を追跡する。
- API Errorを記録する。
- 高リスクAPI操作はAudit Logと紐付ける。

物理Entity設計は、`08_Database.md` と下位実装仕様で定義する。

---

## 37. API Observability

API Observabilityは、外部連携の状態、失敗、制限、遅延、コストを可視化する。

### 37.1 Monitoring Targets

監視対象は以下である。

- API Success Rate
- API Error Rate
- OAuth Error
- Token Expiration
- Rate Limit
- Latency
- Retry Count
- Webhook Failure
- Adapter Failure
- Provider Maintenance
- API Cost
- Automation API Failure

### 37.2 Alert Conditions

通知または確認対象は以下である。

- OAuth失効
- Token更新失敗
- API Error急増
- Rate Limit到達
- Webhook検証失敗
- Webhook処理失敗
- Retry失敗
- Provider障害
- 投稿API失敗
- Analytics取得失敗
- AI API失敗
- Notification失敗

監視ツール、通知先、SLA、Runbookは、`11_Operations.md` で定義する。

---

## 38. API and OAuth Scale Architecture

API and OAuth基盤は、接続Provider数、SNS Account数、Automation数、KPI取得量に応じて段階的に拡張する。

### 38.1 Scale Stages

```text
Stage 1: Mock中心、少数Provider検証
Stage 2: 主要ProviderのAPI接続開始
Stage 3: OAuth、Webhook、KPI取得の安定運用
Stage 4: Automation連携とRate Limit管理強化
Stage 5: 大規模API運用と高度なObservability
```

### 38.2 Stage 1

初期段階では、以下を基本とする。

- Mock Mode
- Manual Export / Import
- 最小Provider接続
- OAuth接続検証
- API Error記録
- Rate Limit確認

### 38.3 Stage 2

以下を追加検討する。

- WordPress REST API
- Google API
- Gmail API
- AI API
- SNS APIの一部接続
- API Request Log
- OAuth Status管理

### 38.4 Stage 3

以下を追加検討する。

- Analytics API
- Search Console API
- Webhook受信
- OAuth Scope管理
- Token Reference管理
- Approval Gate連携
- Audit Log連携

### 38.5 Stage 4

以下を追加検討する。

- Automation API実行
- Rate Limit監視
- Retry制御
- Provider別Adapter強化
- Notification連携
- Incident連携

### 38.6 Stage 5

以下を追加検討する。

- 大規模API監視
- Provider別Health Dashboard
- API Cost管理
- Advanced Rate Limit Control
- API Version Migration管理
- 高度なWebhook処理
- API Performance Review

---

## 39. API and OAuth Scale Gate

次のAPI and OAuth Stageへ進む前に、API and OAuth Scale Gate Reviewを行う。

```text
API and OAuth Scale Gate Review

1. 現在の接続Provider数
2. 現在のAPI Adapter数
3. 現在のOAuth Connection数
4. OAuth Scopeの妥当性
5. Token Reference管理状況
6. Secret混入リスク
7. API Error Rate
8. Rate Limit発生状況
9. Retry失敗状況
10. Webhook処理状況
11. Mock Mode整備状況
12. Production接続承認状況
13. Audit Log連携状況
14. Approval Gate連携状況
15. Scheduler連携状況
16. Automation連携状況
17. API Cost状況
18. Provider規約確認状況
19. 運用担当者の負荷
20. 次Stageへ進む必要性
```

API and OAuth Scale Gateを通過できない場合は、接続ProviderやAutomation対象を増やさず、OAuth Scope、Rate Limit、Retry、Mock Mode、Error Handling、Audit Logを改善する。

API and OAuth Scale Gateは、Growth Lab Core System Scale GateやDatabase Scale Gateを置き換えるものではない。
API and OAuth観点の準備状態を確認し、07章のSystem Scale Gateへ判断材料を提供する。

---

## 40. Operations Policy

API and OAuthの日常運用では、接続状態、OAuth、Scope、Error、Rate Limit、Webhook、Token Referenceを確認する。

### 40.1 Regular Checks

定期確認項目は以下である。

- OAuth接続状態
- Token Expiration
- Scope一覧
- API Error
- Rate Limit
- Retry状況
- Webhook失敗
- Provider障害情報
- Adapter稼働状況
- Mock Mode状態
- Production接続状態
- Audit Log連携
- Secret混入疑い

### 40.2 Change Management

以下の変更は記録する。

- Provider追加
- API Adapter追加
- API Adapter変更
- OAuth App変更
- Scope追加
- Token Rotation
- Webhook設定変更
- Rate Limit方針変更
- Retry方針変更
- Mock Mode変更
- Production接続切替

### 40.3 Maintenance

保守対象は以下である。

- OAuth Connection
- API Adapter
- Webhook設定
- Scope一覧
- API Version
- SDK Version
- Rate Limit設定
- Retry設定
- API Error Log
- API Request Log
- Token Reference

詳細な運用手順は、`11_Operations.md` で定義する。

---

## 41. Incident Handling

API and OAuthで異常が発生した場合、以下の流れで対応する。

```text
Detect
  |
  v
Identify Provider
  |
  v
Identify Adapter
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
Recover Connection
  |
  v
Verify Result
  |
  v
Prevent Recurrence
```

### 41.1 Common Incidents

想定される異常は以下である。

- OAuth失効
- Token更新失敗
- Scope不足
- API認証失敗
- API権限不足
- API Rate Limit
- API仕様変更
- API提供終了
- Webhook署名検証失敗
- Webhook処理失敗
- Retry暴走
- 投稿API失敗
- Analytics取得失敗
- AI API失敗
- Provider障害
- Secret混入疑い

### 41.2 Incident Records

API Incidentでは、以下を記録する。

```text
Incident ID
Detected Date
Detected By
Provider
Adapter
Affected Entity
Affected Workflow
Severity
Description
Cause
Action Taken
Automation Stopped Flag
Recovery Result
Preventive Action
Owner
Status
Change History
```

詳細なIncident Response手順は、`11_Operations.md` で定義する。

---

## 42. Integration with Other Chapters

本章は、以下の章と連携する。

### 42.1 02 Overall Architecture

API and OAuthは、Integration LayerとExternal Service Layerの中核である。

### 42.2 03 Mail Platform

Mail Account、Gmail通知、メール確認、復旧通知とのAPI連携に関係する。

### 42.3 04 SNS Platform

SNS API、Publishing、SNS Analytics、OAuth、Rate Limitに関係する。

### 42.4 05 WordPress Platform

WordPress REST API、Article、LP、Affiliate Link、Site状態確認に関係する。

### 42.5 06 AI Platform

AI API、Prompt実行、AI Output生成、AI Cost、AI Errorに関係する。

### 42.6 07 Growth Lab Core System

Growth Lab Core SystemのIntegration Layer、Scheduler、Automation、Approval Gate、Monitoringと連携する。

### 42.7 08 Database

API Connection State、OAuth Reference、Token Reference Metadata、Webhook Event、API Error、API Request Log、Audit Relationを保存する。

### 42.8 10 Security

Secret、Token実体、API Key実体、Client Secret、暗号化、Access Control、Security Incidentを扱う。

### 42.9 11 Operations

API運用、OAuth更新、Webhook運用、Rate Limit対応、Incident Runbookを扱う。

### 42.10 12 Analytics and KPI

Analytics API、KPI取得、レポート、ROI、改善判断に連携する。

### 42.11 13 Roadmap

Provider接続順序、API接続Stage、OAuth審査、Webhook導入計画を扱う。

### 42.12 14 ADR

API and OAuthに関する重要な設計判断をADRとして記録する。

---

## 43. Chapter Responsibility Boundary

本章では、API and OAuth基盤の上位設計と運用方針を定義する。

詳細設計は、以下の章または下位文書で定義する。

```text
09 API and OAuth
    |
    +-- Defines:
    |       +-- API architecture
    |       +-- API First policy
    |       +-- External service integration policy
    |       +-- API Adapter policy
    |       +-- OAuth policy
    |       +-- Scope management policy
    |       +-- Token reference policy
    |       +-- Credential reference policy
    |       +-- OAuth and Secret boundary
    |       +-- Webhook policy
    |       +-- Rate Limit policy
    |       +-- Retry and Backoff policy
    |       +-- Timeout policy
    |       +-- API Error Handling policy
    |       +-- Mock Mode and Sandbox policy
    |       +-- API Observability
    |       +-- API and OAuth Scale Gate policy
    |
    +-- Does not define:
            +-- Secret実体
            +-- Token実体
            +-- API Key実体
            +-- Client Secret実体
            +-- Refresh Token実体
            +-- Full API endpoint specification
            +-- Full request / response specification
            +-- Full SDK implementation
            +-- Detailed operation runbook
            +-- Detailed KPI formula
```

Secret、Token、暗号化、Access ControlはSecurity章で扱う。
Database保存方針はDatabase章で扱う。
具体的な運用手順はOperations章で扱う。
KPI詳細はAnalytics and KPI章で扱う。

---

## 44. Architecture Constraints

API and OAuth基盤では、以下の制約を前提とする。

- 公式APIを優先する。
- 公式OAuthを優先する。
- 非公式APIを通常運用にしない。
- スクレイピングを通常運用にしない。
- API制限回避をしない。
- 最小Scopeを原則とする。
- Scope追加はApproval Gateを通す。
- Token実体を通常DBへ平文保存しない。
- Token実体を通常ログへ出さない。
- Token実体をAI入力に含めない。
- Secret実体をMarkdownへ記載しない。
- Token ReferenceとToken実体を混同しない。
- Rate Limitを遵守する。
- Retryは無制限にしない。
- 未承認外部実行をAutomationに許可しない。
- Mock Modeを用意する。
- Production接続切替は承認を必要とする。
- API Errorを記録する。
- 高リスクAPI操作はAudit Logへ記録する。
- 外部API変更時は影響範囲を確認する。
- 個別API endpoint全文を本章に抱え込まない。
- SDK実装コードを本章に抱え込まない。

---

## 45. Risks

本章に関連する主なリスクは以下である。

### 45.1 Risk: 非公式API依存

非公式APIやスクレイピングに依存すると、規約違反、アカウント停止、機能停止のリスクが高まる。

軽減策：

- 公式APIを優先する。
- API不可時は公式管理画面や手動運用を検討する。
- 非公式手段は通常運用にしない。
- 重要判断はADRを検討する。

### 45.2 Risk: OAuth Scope過剰

不要に広いScopeを要求すると、漏洩時の影響が大きくなる。

軽減策：

- 最小Scopeを原則とする。
- Scope一覧を管理する。
- 高リスクScopeはApproval Gateを通す。
- 定期的にScopeを棚卸しする。

### 45.3 Risk: Token漏洩

Access Token、Refresh Token、API Key、Client Secretが漏洩する可能性がある。

軽減策：

- Token実体を通常DBへ平文保存しない。
- Token実体をLogへ出さない。
- Secret Storeを利用する。
- Token Rotationを行う。
- 漏洩疑いはSecurity Incidentとして扱う。

### 45.4 Risk: Rate Limit超過

大量API実行やRetryによりRate Limitを超過する可能性がある。

軽減策：

- Rate Limitを記録する。
- Retryを制限する。
- Schedulerを調整する。
- Automationを停止できるようにする。
- Scale Gateで確認する。

### 45.5 Risk: Retry暴走

API失敗時にRetryが繰り返され、外部サービス負荷、重複実行、アカウント制限につながる可能性がある。

軽減策：

- Retry回数に上限を設ける。
- Exponential Backoffを検討する。
- 認証失敗時はRetryし続けない。
- Unknown Result時は確認状態にする。

### 45.6 Risk: Webhook不正受信

不正なWebhookや重複Webhookにより、誤処理が発生する可能性がある。

軽減策：

- Webhook署名検証を行う。
- 冪等性を設計する。
- 重複イベントを検出する。
- 不正イベントを拒否する。

### 45.7 Risk: 外部API仕様変更

ProviderのAPI仕様変更により、連携が停止する可能性がある。

軽減策：

- API Versionを管理する。
- Deprecation情報を確認する。
- AdapterでProvider依存を分離する。
- 変更時は影響範囲を確認する。

### 45.8 Risk: 未承認外部実行

AutomationやAPI連携が未承認の投稿、削除、変更を行う可能性がある。

軽減策：

- Approval Gateを必須にする。
- 高リスクAPI操作はAudit Logへ記録する。
- Automation Boundaryを明確にする。
- Production接続切替を承認制にする。

### 45.9 Risk: MockとProductionの混同

Mock Modeの結果をProduction実行と誤認したり、Productionへ誤接続する可能性がある。

軽減策：

- Mock Modeを明示する。
- 環境ごとのCredentialを分離する。
- Production接続は承認制にする。
- UIやLogで環境を明示する。

### 45.10 Risk: OAuthとSecretの責任分界不明

OAuth Connection、Token Reference、Token実体、Secret Storeの責任分界が曖昧になる可能性がある。

軽減策：

- 09章は接続状態、Scope、参照情報を扱う。
- 10章はSecret実体、暗号化、Access Controlを扱う。
- Token ReferenceとToken実体を混同しない。
- Secret実体を通常DB、Log、Markdownへ保存しない。

### 45.11 Risk: 09章が実装詳細に入りすぎる

本章が個別APIエンドポイント全文やSDK実装コードを抱え込み、下位実装仕様との責任分界が不明確になる可能性がある。

軽減策：

- 本章はAPI and OAuth設計方針までを定義する。
- 個別API仕様は下位実装仕様で扱う。
- Secret実体はSecurity章で扱う。
- RunbookはOperations章で扱う。

---

## 46. Required Review Checklist

本章またはAPI and OAuth基盤を更新する場合は、以下を確認する。

```text
API and OAuth Review Checklist

1. API and OAuthの全体方針が明確か
2. API First方針が明確か
3. 07 Growth Lab Core Systemとの責任分界が明確か
4. 08 Databaseとの責任分界が明確か
5. 10 Securityとの責任分界が明確か
6. OAuthとSecretの境界が明確か
7. 11 Operationsとの責任分界が明確か
8. 12 Analytics and KPIとの責任分界が明確か
9. API Adapter方針が定義されているか
10. OAuth方針が定義されているか
11. Scope Management方針が定義されているか
12. Token Reference方針が定義されているか
13. API Credential Reference方針が定義されているか
14. Webhook方針が定義されているか
15. Rate Limit方針が定義されているか
16. Retry and Backoff方針が定義されているか
17. Timeout方針が定義されているか
18. API Error Handling方針が定義されているか
19. API Logging方針が定義されているか
20. Audit Log連携方針が定義されているか
21. Mock Mode and Sandbox方針が定義されているか
22. Provider Change Managementが定義されているか
23. Scheduler and Automation API方針が定義されているか
24. Approval Gate for External Executionが定義されているか
25. SNS API方針が定義されているか
26. WordPress REST API方針が定義されているか
27. Google and Gmail API方針が定義されているか
28. AI API方針が定義されているか
29. Analytics API方針が定義されているか
30. Affiliate API方針が定義されているか
31. Notification API方針が定義されているか
32. API Observabilityが定義されているか
33. API and OAuth Scale Gateが定義されているか
34. Secret実体を扱いすぎていないか
35. 個別API endpoint詳細に入りすぎていないか
36. SDK実装コードに入りすぎていないか
37. ADRが必要な判断が整理されているか
```

---

## 47. Review Points

本章のレビューでは、以下を確認する。

- API and OAuth基盤がIntegration Control Layerとして定義されているか。
- 公式API優先、公式OAuth優先が明確か。
- 非公式APIや制限回避を通常運用にしない方針が明確か。
- 07 Growth Lab Core Systemとの接続が明確か。
- 08 Databaseとの保存責任分界が明確か。
- 10 SecurityへSecret実体、暗号化、Access Controlを委譲できているか。
- OAuth ConnectionとToken実体の境界が明確か。
- Token ReferenceとSecret Materialを混同していないか。
- 11 OperationsへRunbook、通知先、復旧手順を委譲できているか。
- 12 Analytics and KPIへKPI定義、分析、ROIを委譲できているか。
- OAuth Scopeが最小権限方針になっているか。
- Token実体を通常DBやログに保存しない方針が明確か。
- Rate Limit、Retry、Timeoutが定義されているか。
- Mock ModeとProduction接続が分離されているか。
- 未承認外部実行を許可しない方針が明確か。
- 個別API endpoint全文やSDK実装コードに入りすぎていないか。
- API and OAuth Scale Gateが拡張判断に使える内容になっているか。
- Codex反映時に章構成が崩れにくい構成になっているか。

---

## 48. Architecture Decision Records

本章に関連するADRは以下の通りである。

```text
Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core
```

本章に関連して、今後追加が想定されるADRは以下である。

```text
ADR-0005: Core Architecture Principles
ADR-0012: Integration Layer Policy
ADR-0016: Scale Gate Policy
ADR-0052: Growth Lab Core System Architecture
ADR-0056: Integration Adapter Policy
ADR-0072: API and OAuth Architecture
ADR-0073: API First Integration Policy
ADR-0074: OAuth Scope Management Policy
ADR-0075: Token Reference and Secret Boundary Policy
ADR-0076: API Adapter Policy
ADR-0077: Webhook Policy
ADR-0078: Rate Limit and Retry Policy
ADR-0079: Mock Mode and Sandbox Policy
ADR-0080: External API Approval Gate Policy
ADR-0081: API and OAuth Scale Gate Policy
```

以下の判断を変更する場合は、ADR作成を検討する。

- API and OAuth基盤の責任範囲変更
- 公式API優先方針の変更
- 非公式API利用方針の変更
- OAuth Scope管理方針の変更
- Token管理境界の変更
- OAuthとSecretの責任分界変更
- API Adapter方針の変更
- Webhook方針の変更
- Rate Limit方針の変更
- Retry方針の変更
- Mock Mode / Sandbox方針の変更
- 未承認外部実行を許可する変更
- Production接続切替方針の変更
- API and OAuth Scale Gate方針の変更

---
