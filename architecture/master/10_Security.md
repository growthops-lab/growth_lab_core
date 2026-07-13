# 10 Security

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/10_Security.md

## 1. Purpose

本章の目的は、Growth Lab CoreにおけるSecurity基盤の設計方針を定義することである。

Growth Lab Coreは、SNSアカウント、メールアカウント、WordPress、API、OAuth、AI、Analytics、Affiliate、Database、Automationを統合する運用基盤である。
そのため、Password、API Key、OAuth Token、Refresh Token、Client Secret、TOTP Secret、Recovery Code、Database Credential、WordPress Credential、Hosting Credentialなど、多くの機密情報を扱う可能性がある。

Security基盤は、単なる認証やパスワード管理ではない。
Growth Lab Core全体における、Secret保護、認証、認可、権限分離、監査、AI入力保護、Automation制御、Incident対応、復旧可能性を支える中核機能である。

本章では、以下を定義する。

- Security全体方針

- 07 Growth Lab Core Systemとの責任分界

- 08 Databaseとの責任分界

- 09 API and OAuthとの責任分界

- 11 Operationsとの責任分界

- Secret管理方針

- Token実体の保護方針

- API Key / Client Secret / Refresh Tokenの扱い

- Password方針

- TOTP / 2FA / Recovery Code方針

- Passkey方針

- Authentication方針

- Authorization方針

- Access Control方針

- Role設計方針

- Least Privilege方針

- Account Lifecycle and Offboarding方針

- Environment Security方針

- Device and Local Development Security方針

- Database Security方針

- API and OAuth Security方針

- WordPress Security方針

- Mail Security方針

- AI Security方針

- Automation Security方針

- Logging and Audit Security方針

- Backup and Restore Security方針

- Security Monitoring方針

- Security Incident方針

- Security Exception方針

- Security Scale Gate

- 運用リスクと軽減策

## 2. Scope

本章の対象範囲は、Growth Lab Core全体のSecurity設計である。

対象範囲は以下を含む。

- Security Architecture

- Protected Data Classification

- Secret Management

- Credential Management

- Token Protection

- Password Policy

- TOTP Policy

- 2FA Policy

- Recovery Code Policy

- Passkey Policy

- Authentication

- Authorization

- Access Control

- Role Management

- Permission Management

- Least Privilege

- Account Lifecycle

- Offboarding

- Environment Security

- Device Security

- Local Development Security

- Database Security Boundary

- API and OAuth Security Boundary

- Mail Security

- SNS Security

- WordPress Security

- AI Security

- Automation Security

- Logging Security

- Audit Log Security

- Backup Security

- Restore Security

- Security Monitoring

- Security Incident

- Security Review

- Security Exception

- Security Scale Gate

本章では、実際のPassword、API Key、OAuth Token、Refresh Token、Client Secret、TOTP Secret、Recovery CodeなどのSecret実体は記載しない。

本章では、特定Secret Store製品の詳細設定、暗号化鍵そのもの、実際の接続文字列、実装コード全文までは定義しない。
それらは、下位実装仕様、安全なSecret管理基盤、またはOperations章で定義する。

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

- 実際のSMTP Credential

- 実際のWordPress Application Password

- 実際のHosting Credential

- Secret Store製品の詳細設定手順

- 暗号化鍵の実体

- 暗号化アルゴリズムの実装コード

- 認証ライブラリの実装コード

- セッション管理の実装コード

- FirewallやWAFの詳細設定

- 本番サーバー構築手順

- 日次Security Runbook全文

- Secret Rotationの実作業手順全文

- Incident Responseの実作業手順全文

- 法務判断の最終確定

- 個別規約違反判断の最終確定

- 個別API endpointのSecurity実装詳細

これらは、下位実装仕様、Operations章、法務確認、または安全な管理基盤で扱う。

## 4. Background

Growth Lab Coreでは、複数の外部サービスと連携し、多数のアカウントを管理する。

主なSecurity対象は以下である。

- SNSアカウント

- メールアカウント

- Google Workspace

- Gmail

- WordPress

- Hosting

- Database

- API

- OAuth

- AIサービス

- Analytics

- Affiliate ASP

- Notification Service

- Automation

- Scheduler

- Audit Log

- Backup

Security方針なしに運用すると、以下の問題が発生する。

- SecretがMarkdown、チャット、ログ、DBに混入する。

- Token実体とToken Referenceが混同される。

- OAuth Scopeが過剰になる。

- 不要な権限を持つユーザーが増える。

- 退任者や不要アカウントの権限が残る。

- AI入力にSecretが混入する。

- Automationが高リスク操作を実行する。

- Recovery Codeの保管場所が不明になる。

- API Key漏洩時の対応が遅れる。

- Audit Logが不足し、原因追跡ができない。

- BackupにSecretが含まれて漏洩する。

- Security Incident発生時の影響範囲が分からない。

そのため、Growth Lab Coreでは、Security by Designを前提に、初期段階からSecurity基盤を明確に設計する。

## 5. Alignment with Architecture Principles

本章は、01_Architecture_Principles.md で定義した原則に従う。

特に、Security基盤では以下を重視する。

AP-01 Compliance First AP-02 API First AP-03 Security by Design AP-05 Automation First AP-06 Scalability AP-07 Observability AP-09 Single Source of Truth AP-10 Continuous Improvement

Security基盤における優先順位は以下である。

1. 規約遵守 2. Secret保護 3. 最小権限 4. 認証強化 5. 認可と権限分離 6. 監査可能性 7. 復旧可能性 8. Automation制御 9. AI入力保護 10. 運用しやすさ 11. 拡張性 12. コスト最適化

Securityは、利便性、Automation、AI活用、拡張性より優先される。
Security要件を満たせないAutomationや外部連携は、実行しない。

## 6. Security Vision

Growth Lab CoreのSecurity基盤は、Secret、Account、Access、Operation、Audit、Incidentを統合的に保護する。

Security Architecture     |     +-- Protected Data Classification     +-- Secret Management     +-- Authentication     +-- Authorization     +-- Access Control     +-- Role Management     +-- Token Protection     +-- 2FA / TOTP / Recovery     +-- Environment Security     +-- Device Security     +-- Database Security     +-- API Security     +-- AI Input Security     +-- Automation Security     +-- Audit Log Security     +-- Backup Security     +-- Security Monitoring     +-- Security Incident Response

Security基盤は、以下を実現する。

- Secretを平文で露出しない。

- 必要最小限の権限で運用する。

- 重要操作に承認を要求する。

- 高リスク処理を監査可能にする。

- AIやAutomationにSecretを渡さない。

- Token漏洩時に影響範囲を把握できる。

- Security Incident発生時に停止、隔離、復旧、再発防止ができる。

- Scale GateでSecurity準備状態を確認できる。

## 7. Relationship with 07, 08, 09, and 11

07_Growth_Lab_Core_System.md は、Growth Lab Core SystemのOrchestration、Workflow、Approval Gate、Scheduler、Automationを定義する。
08_Database.md は、運用データの永続化、Entity、Relation、Migration、Backupを定義する。
09_API_OAuth.md は、外部API接続、OAuth、Scope、Token Reference、Webhook、Rate Limitを定義する。
11_Operations.md は、日常運用、棚卸し、復旧、Rotation、Incident ResponseのRunbookを定義する。
本章は、Secret実体、認証、認可、暗号化、Access Control、Security Incident方針を定義する。

責任分界は以下である。

07 Growth Lab Core System     |     +-- Workflow     +-- Approval Gate     +-- Automation Boundary     +-- Scheduler Boundary     |     v 10 Security     |     +-- Authentication     +-- Authorization     +-- Access Control     +-- Secret Protection     +-- Security Policy     +-- Security Incident Policy     |     +-- Stores safe metadata through:     v 08 Database     |     +-- Security Status     +-- Secret Reference Metadata     +-- Audit Log Relation     +-- Incident Relation     |     +-- Connects external services through:     v 09 API and OAuth     |     +-- OAuth Connection     +-- Scope     +-- Token Reference     +-- API Credential Reference     |     +-- Executes procedures through:     v 11 Operations     |     +-- Security Runbook     +-- Secret Rotation Procedure     +-- Incident Response Procedure     +-- Access Review Procedure     +-- Backup Restore Procedure

07章は「承認と実行の流れ」を管理する。
08章は「Security関連メタデータと履歴をどう保存するか」を管理する。
09章は「外部接続とToken Referenceをどう扱うか」を管理する。
10章は「Secret実体をどう保護し、誰が何にアクセスできるか」を管理する。
11章は「Security方針を日常運用でどう実行するか」を管理する。

## 8. Security Architecture Overview

Growth Lab CoreのSecurity Architectureは以下を基本とする。

User or Automation     |     v Authentication     |     v Authorization     |     v Access Control     |     v Application Layer     |     +-- Approval Gate     +-- Audit Log     +-- Security Check     |     v Secret Reference     |     v Secret Store or Protected Secret Area     |     v External Service or Database

重要な原則は以下である。

- ユーザー、Automation、AI、System Jobを区別する。

- 認証済みであっても、すべての操作を許可しない。

- 重要操作にはRole、Permission、Approvalを要求する。

- Secret実体は必要な処理にのみ限定的に利用する。

- Secret実体を通常ログ、Markdown、AI入力、通常DBに露出しない。

- Security関連操作はAudit Logへ記録する。

## 9. Security Responsibility Boundary

Security基盤では、責任範囲を明確に分離する。

### 9.1 Security Responsibilities

Security章が責任を持つ範囲は以下である。

- Secret保護方針

- Credential保護方針

- Token実体保護方針

- Password方針

- 2FA / TOTP方針

- Recovery Code方針

- Passkey方針

- Authentication方針

- Authorization方針

- Access Control方針

- Role方針

- Permission方針

- Encryption方針

- AI入力へのSecret混入防止

- Automation Security Boundary

- Security Incident方針

- Security Scale Gate

### 9.2 Growth Lab Core System Responsibilities

07章が責任を持つ範囲は以下である。

- Workflow

- Approval Gate

- Scheduler

- Automation Engine

- Domain Module

- Dashboard

- Monitoring

- Operations Policy

### 9.3 Database Responsibilities

08章が責任を持つ範囲は以下である。

- Security Statusの保存

- Audit Logの保存

- Incident Entityの保存

- Secret Reference Metadataの保存

- User / Role / Permission Metadataの保存

- Relationと履歴の保存

### 9.4 API and OAuth Responsibilities

09章が責任を持つ範囲は以下である。

- OAuth Connection Status

- OAuth Scope

- Token Reference

- API Credential Reference

- Webhook

- Rate Limit

- API Error

- API Adapter

### 9.5 Operations Responsibilities

11章が責任を持つ範囲は以下である。

- Security Runbook

- 定期Security確認

- Secret Rotation手順

- Incident Response手順

- Backup / Restore手順

- 担当者と通知先

- 復旧手順

- 棚卸し手順

- Offboarding手順

## 10. Protected Data Classification

Security設計では、保護対象データを分類する。

### 10.1 Protected Data Classes

保護対象データ分類は以下を基本とする。

```text
Protected Data Classes
```

Class A: Public Data Class B: Internal Operational Data Class C: Sensitive Operational Data Class D: Secret Material Class E: Recovery and Emergency Material

```text
### 10.2 Class A: Public Data

例は以下である。

- 公開SNSプロフィールURL
- 公開WordPress URL
- 公開記事URL
- 公開済み投稿内容

### 10.3 Class B: Internal Operational Data

例は以下である。

- Internal ID
- Campaign管理情報
- KPI Summary
- Status
- Owner
- Notes

### 10.4 Class C: Sensitive Operational Data

例は以下である。

- Mail Address
- Account管理情報
- OAuth Connection Status
- API Error
- Audit Log
- Incident情報
- AI Output
- 非公開Campaign情報

### 10.5 Class D: Secret Material

例は以下である。

- Password
- API Key
- OAuth Token
- Refresh Token
- Client Secret
- TOTP Secret
- Database Credential
- WordPress Application Password

### 10.6 Class E: Recovery and Emergency Material

例は以下である。

- Recovery Code
- Backup Code
- Emergency Admin Credential
- Account Recovery Credential

### 10.7 Classification Rules

ルールは以下である。

- Class DとClass EはSecret実体として扱う。
- Class DとClass EをMarkdown、通常DB、ログ、AI入力へ含めない。
- Class CはAccess Controlを設定する。
- Class Bも不要な外部共有を避ける。
- Class Aでも誤情報や規約違反リスクがある場合はReview対象にする。

---

## 11. Secret Management Policy

Secret Managementは、Growth Lab Core Securityの中核である。

### 11.1 Secret Definition

Secretとは、漏洩した場合にアカウント、システム、データ、外部サービスへ不正アクセスされる可能性がある情報を指す。

主なSecretは以下である。

```text
Secret Types

- Password
- API Key
- OAuth Access Token
- OAuth Refresh Token
- Client Secret
- TOTP Secret
- Recovery Code
- Database Credential
- SMTP Credential
- WordPress Application Password
- Hosting Control Panel Credential
- Webhook Secret
- Session Secret
- Cookie
- Private Key
- Service Account Key
```

### 11.2 Secret Management Rules

Secret管理ルールは以下である。

- Secret実体をMarkdownに記載しない。

- Secret実体を通常DBテーブルへ平文保存しない。

- Secret実体を通常ログへ出さない。

- Secret実体をAI入力へ含めない。

- Secret実体をチャットへ貼り付けない。

- Secret実体をIssueやCHANGELOGへ記載しない。

- Secret実体をGit管理しない。

- Secret実体をメール本文へ不用意に記載しない。

- Secret実体を共有フォルダへ平文保存しない。

- SecretはSecret Storeまたは保護された管理領域で扱う。

- Secretへのアクセスは最小権限にする。

- Secret参照とSecret実体を区別する。

- Secret変更はAudit Logへ記録する。

- Secret漏洩疑いはSecurity Incidentとして扱う。

### 11.3 Secret Reference

Growth Lab Coreでは、Secret実体ではなくSecret Referenceを利用する。

```text
Secret Reference Conceptual Fields
```

- Secret Reference ID

- Secret Type

- Related Service

- Related Account

- Status

- Risk Level

- Created At

- Last Rotated At

- Last Checked At

- Owner

- Notes

```text
Secret Referenceは、Secret実体ではない。
Secret ReferenceからSecret実体を復元できる情報を平文で含めてはならない。

---

## 12. Credential Classification

Credentialは、用途とリスクに応じて分類する。

### 12.1 Credential Classes

Credential分類は以下を基本とする。

```text
Credential Classes

Class 1: Low Risk Reference
Class 2: Internal Reference
Class 3: External Access Credential
Class 4: High-Risk Admin Credential
Class 5: Recovery Credential
```

### 12.2 Class 1: Low Risk Reference

例は以下である。

- Public Account ID

- Public Profile URL

- Public Site URL

- Non-secret Provider ID

### 12.3 Class 2: Internal Reference

例は以下である。

- Secret Reference ID

- Token Reference ID

- OAuth Connection ID

- Internal Account ID

### 12.4 Class 3: External Access Credential

例は以下である。

- API Key

- OAuth Access Token

- WordPress Application Password

- SMTP Credential

### 12.5 Class 4: High-Risk Admin Credential

例は以下である。

- Google Workspace Admin Credential

- Hosting Control Panel Credential

- Database Admin Credential

- Client Secret

- Refresh Token

### 12.6 Class 5: Recovery Credential

例は以下である。

- Recovery Code

- Backup Code

- Emergency Admin Credential

- Account Recovery Email Credential

Class 3以上は、Secret実体として扱い、通常DB、Markdown、ログ、AI入力に含めない。

## 13. Token Security Policy

Tokenは、APIやOAuth連携で外部サービスへアクセスするための高リスクSecretである。

### 13.1 Token Types

対象Tokenは以下である。

- Access Token

- Refresh Token

- ID Token

- Session Token

- Webhook Token

- Service Account Token

### 13.2 Token Security Rules

Token保護ルールは以下である。

- Token実体を通常DBへ平文保存しない。

- Token実体をログへ出さない。

- Token実体をAI入力へ含めない。

- Token実体をMarkdownへ記載しない。

- Token実体をGit管理しない。

- Token Referenceを使用する。

- Token失効を検知する。

- Token Rotationを行う。

- Token漏洩疑いはSecurity Incidentとして扱う。

- Refresh TokenはAccess Tokenより高リスクとして扱う。

- Token削除または無効化はApproval Gateを通す。

### 13.3 Token Rotation

Token Rotationでは以下を確認する。

- 対象Provider

- 対象Account

- 対象Scope

- 影響するAutomation

- 影響するScheduler

- 影響するAPI Adapter

- Rotation実施者

- Rotation日時

- Rotation結果

- 旧Tokenの無効化状態

具体的なToken Rotation手順は、11_Operations.md で定義する。

## 14. API Key and Client Secret Policy

API KeyとClient Secretは、外部サービス接続に必要なSecretである。

### 14.1 API Key Rules

API Key管理ルールは以下である。

- API Key実体をMarkdownへ記載しない。

- API Key実体を通常DBへ平文保存しない。

- API Key実体をログへ出さない。

- API Key実体をAI入力へ含めない。

- API KeyをGit管理しない。

- API Keyには用途と所有者を設定する。

- 不要なAPI Keyは無効化する。

- API Key漏洩疑いはSecurity Incidentとして扱う。

### 14.2 Client Secret Rules

Client Secret管理ルールは以下である。

- Client Secret実体を通常DBへ平文保存しない。

- Client Secret実体をログへ出さない。

- Client Secret実体をAI入力へ含めない。

- Client SecretをGit管理しない。

- Client Secret変更はApproval Gateを通す。

- Client Secret漏洩疑いはSecurity Incidentとして扱う。

### 14.3 Service Account Key Rules

Service Account Keyを使用する場合は、以下を守る。

- 必要最小限の権限にする。

- 使用目的を明確にする。

- Key実体を安全なSecret管理領域で扱う。

- 不要になったKeyは無効化する。

- Key Rotationを検討する。

- Key漏洩疑いはSecurity Incidentとして扱う。

## 15. Password Policy

Passwordは、人間またはシステムが外部サービスへアクセスするための重要なSecretである。

### 15.1 Password Rules

Password管理ルールは以下である。

- PasswordをMarkdownへ記載しない。

- Passwordを通常DBへ平文保存しない。

- Passwordをログへ出さない。

- PasswordをAI入力へ含めない。

- PasswordをGit管理しない。

- Passwordをチャットへ貼り付けない。

- Passwordを使い回さない。

- 高リスクアカウントは強力なPasswordを使用する。

- 退任、担当変更、漏洩疑い時はPassword変更を行う。

- Password変更は必要に応じてAudit Logへ記録する。

### 15.2 Password Storage

Passwordは、信頼できるPassword ManagerまたはSecret Storeで扱う。
Growth Lab Coreの通常DB、Markdown台帳、CHANGELOG、Issue、AIプロンプトへPassword実体を保存しない。

### 15.3 Shared Password Restriction

複数人で同一Passwordを共有する運用は、原則として避ける。
共有が避けられない場合は、権限、責任者、保管場所、利用履歴、変更手順を明確にする。

## 16. Two-Factor Authentication Policy

2FAは、高リスクアカウントに対して必須または強く推奨する。

### 16.1 2FA Required Targets

2FA必須または優先対象は以下である。

- Google Workspace Admin

- Gmail重要管理アカウント

- Domain Registrar

- Hosting Control Panel

- WordPress Admin

- SNS管理アカウント

- Affiliate ASP管理アカウント

- Analytics管理アカウント

- AI Service管理アカウント

- Database管理アカウント

- Git Repository管理アカウント

### 16.2 2FA Rules

2FA運用ルールは以下である。

- 対応サービスでは2FAを有効化する。

- SMSのみの2FAは可能であれば避ける。

- TOTPを標準候補とする。

- Passkey対応サービスでは補助的または強化的に利用する。

- Recovery Codeを安全に保管する。

- 2FA設定変更はAudit Logへ記録する。

- 2FA解除はApproval Gateを通す。

## 17. TOTP Policy

TOTPは、Growth Lab Coreにおける2FAの標準候補である。

### 17.1 TOTP Rules

TOTP運用ルールは以下である。

- TOTP SecretをMarkdownへ記載しない。

- TOTP Secretを通常DBへ平文保存しない。

- TOTP Secretをログへ出さない。

- TOTP SecretをAI入力へ含めない。

- TOTP QR画像を不用意に保存しない。

- TOTP設定者と保管場所を明確にする。

- 端末紛失時の復旧手順を用意する。

- TOTP解除または再設定はApproval Gateを通す。

### 17.2 TOTP Recovery

TOTP復旧では以下を確認する。

- 対象アカウント

- 対象サービス

- 復旧権限者

- Recovery Codeの有無

- Backup管理者の有無

- 影響範囲

- 復旧完了後のSecurity確認

具体的なTOTP復旧手順は、11_Operations.md で定義する。

## 18. Passkey Policy

Passkeyは、対応サービスで補助的または強化的に採用する。

### 18.1 Passkey Rules

Passkey運用ルールは以下である。

- Passkey対応サービスでは導入を検討する。

- Passkeyを単独の復旧手段として過信しない。

- 端末紛失時の復旧手順を確認する。

- 管理者アカウントでは複数の復旧手段を用意する。

- Passkey登録、削除、再設定は記録する。

- 高リスクアカウントのPasskey変更はApproval Gateを通す。

### 18.2 Passkey Boundary

Passkeyの実装方式や端末管理方針は、利用サービス、端末管理、Operations方針に従う。
本章では、PasskeyをTOTPの代替または補助要素として扱う方針を定義する。

## 19. Recovery Code Policy

Recovery Codeは、2FAやTOTP復旧のための高リスクSecretである。

### 19.1 Recovery Code Rules

Recovery Code管理ルールは以下である。

- Recovery CodeをMarkdownへ記載しない。

- Recovery Codeを通常DBへ平文保存しない。

- Recovery Codeをログへ出さない。

- Recovery CodeをAI入力へ含めない。

- Recovery Codeをチャットへ貼り付けない。

- Recovery Codeを安全な保管場所で管理する。

- Recovery Codeの存在有無を記録する。

- Recovery Code使用後は再発行または無効化を検討する。

- Recovery Code漏洩疑いはSecurity Incidentとして扱う。

### 19.2 Recovery Code Metadata

DatabaseまたはRegistryには、Recovery Code実体ではなく、以下のようなメタデータのみを保存する。

```text
Recovery Code Metadata
```

- Account ID

- Service

- Recovery Code Exists Flag

- Storage Location Reference

- Last Checked At

- Last Regenerated At

- Owner

- Notes

```text
Storage Location Referenceには、Recovery Code実体を復元できる情報を平文で含めてはならない。

---

## 20. Authentication Policy

Authenticationは、利用者やSystem Jobが本人または正当な実行主体であることを確認する仕組みである。

### 20.1 Authentication Subjects

認証対象は以下である。

- Human User
- Admin User
- Operator
- Reviewer
- Developer
- Automation Job
- Scheduler Job
- API Client
- Service Account
- AI Assistant

### 20.2 Authentication Rules

認証ルールは以下である。

- 管理者は強力な認証を使用する。
- 高リスク操作には再認証を検討する。
- Service Accountは用途を限定する。
- 不要なUser Accountを無効化する。
- 退任者や担当変更者の権限を削除する。
- Shared Accountの利用は最小化する。
- 認証失敗をMonitoring対象にする。
- 認証失敗の連続はSecurity Incident候補とする。

### 20.3 Google Workspace Role

Google Workspaceは、管理者、重要通知、ドキュメント、認証、共通通知、重要管理用メールの基盤として利用する候補である。

ただし、SNS登録用メールすべてをGoogle Workspace Userとして作成することは、コスト面で最適とは限らない。
SNS登録用メールは、独自ドメインメール、転送、用途別メール基盤と組み合わせて管理する。

---

## 21. Authorization Policy

Authorizationは、認証済み主体に対して、どの操作を許可するかを判断する仕組みである。

### 21.1 Authorization Principles

認可の原則は以下である。

- 最小権限を原則とする。
- Roleに応じてPermissionを分離する。
- ReadとWriteを分離する。
- Admin操作とOperator操作を分離する。
- Review操作とApprove操作を分離する。
- Secret閲覧権限を限定する。
- Automation実行権限を限定する。
- Production操作権限を限定する。
- 権限変更はAudit Logへ記録する。

### 21.2 Authorization Required Actions

認可確認が必要な操作は以下である。

- Secret参照
- Token Rotation
- OAuth Scope変更
- API Key変更
- User Role変更
- Production接続切替
- SNS投稿公開
- WordPress記事公開
- LP公開
- Account削除
- Backup Restore
- Security設定変更
- Automation有効化
- Scale Stage変更

---

## 22. Access Control Policy

Access Controlは、User、Role、Permission、Targetを組み合わせて操作可否を制御する。

### 22.1 Access Control Model

初期方針はRole-Based Access Controlを基本とする。

```text
Access Control Model

User
  |
  v
Role
  |
  v
Permission
  |
  v
Target Resource
```

将来的に必要になった場合は、Resource単位、Environment単位、Risk Level単位の制御を追加する。

### 22.2 Access Control Rules

Access Controlルールは以下である。

- Userに直接権限を付与しすぎない。

- Roleを通じてPermissionを管理する。

- Production操作は権限を限定する。

- Secret参照は特別なPermissionにする。

- ApprovalとExecutionの権限を分離する。

- 権限変更はAudit Logへ記録する。

- 定期的に権限棚卸しを行う。

## 23. Role Design Policy

Growth Lab CoreのRoleは、業務責任とSecurity責任に基づいて設計する。

### 23.1 Initial Roles

初期Role候補は以下である。

```text
Initial Roles
```

- Owner

- System Admin

- Security Admin

- Operator

- Reviewer

- Approver

- Developer

- Analyst

- Read Only

- Automation

- AI Assistant

```text
### 23.2 Role Responsibilities

Roleごとの概要は以下である。

### Owner

- 最終判断
- Scale Gate承認
- 高リスク操作承認
- ADR承認

### System Admin

- System設定
- User管理
- Integration管理
- Environment管理

### Security Admin

- Secret管理
- Security設定
- Incident対応
- Access Control確認

### Operator

- 日常運用
- 投稿準備
- KPI確認
- Error確認

### Reviewer

- AI Output確認
- SNS投稿確認
- WordPress記事確認
- リスク確認

### Approver

- 外部公開承認
- 高リスク操作承認
- Production実行承認

### Developer

- 実装
- Migration作成
- Mock検証
- Test作成

### Analyst

- KPI分析
- Report確認
- 改善提案

### Read Only

- 参照のみ

### Automation

- 承認済み範囲での自動処理

### AI Assistant

- 下書き
- 分析補助
- 改善提案
- 判断支援

AI Assistantは、Secret参照、外部公開、承認、Security設定変更を行わない。

---

## 24. Permission Policy

Permissionは、操作単位で定義する。

### 24.1 Permission Categories

Permissionカテゴリは以下を基本とする。

```text
Permission Categories

- Read
- Create
- Update
- Delete
- Archive
- Approve
- Execute
- Publish
- Manage Secret
- Manage OAuth
- Manage User
- Manage Role
- Manage Automation
- Manage Database
- Manage Backup
- View Audit Log
- Manage Security Incident
```

### 24.2 Permission Rules

Permissionルールは以下である。

- Delete権限は限定する。

- Publish権限はApprovalと連動する。

- Manage Secret権限は最小化する。

- Manage OAuth権限は最小化する。

- Manage User / Role権限はAdminに限定する。

- Production Execute権限は限定する。

- View Audit Log権限は必要者に限定する。

- Permission変更はAudit Logへ記録する。

## 25. Least Privilege Policy

Least Privilegeは、必要最小限の権限だけを付与する原則である。

### 25.1 Least Privilege Rules

ルールは以下である。

- 初期権限は最小にする。

- 必要な期間だけ権限を付与する。

- 不要になった権限は削除する。

- 高リスク権限は定期確認する。

- Admin権限の常用を避ける。

- Automationに広すぎる権限を付与しない。

- AI AssistantにSecret権限を付与しない。

- Read権限とWrite権限を分離する。

- Production権限とDevelopment権限を分離する。

### 25.2 Privilege Review

権限棚卸しでは以下を確認する。

- User一覧

- Role一覧

- Admin権限保持者

- Secretアクセス権保持者

- OAuth管理権保持者

- Production操作権保持者

- 退任者や不要User

- Automation権限

- Service Account権限

- 外部サービス側の権限

## 26. Account Lifecycle and Offboarding Policy

User Account、Service Account、外部サービスアカウントは、作成、利用、変更、停止、削除またはArchiveまでのLifecycleを管理する。

### 26.1 Account Lifecycle States

Account Lifecycle状態は以下を基本とする。

```text
Account Lifecycle States
```

Planned Created Active Limited Suspended Retired Archived Deleted

```text
### 26.2 Account Lifecycle Rules

ルールは以下である。

- Account作成目的を明確にする。
- Ownerを設定する。
- RoleとPermissionを記録する。
- 不要Accountを放置しない。
- 退任、担当変更、外部委託終了時は権限を削除する。
- Service Accountの用途を限定する。
- Account削除よりArchiveを優先する。
- 高リスクAccount停止時は影響範囲を確認する。
- Account状態変更はAudit Logへ記録する。

### 26.3 Offboarding Rules

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
- Recovery権限確認

具体的なOffboarding手順は、`11_Operations.md` で定義する。

---

## 27. Session and Cookie Security Policy

Session、Cookie、Login状態は、Account乗っ取りや不正アクセスに直結する。

### 27.1 Session Security Rules

Session Securityルールは以下である。

- Session SecretをMarkdownへ記載しない。
- Session Tokenを通常DBへ平文保存しない。
- Session Tokenをログへ出さない。
- Session TokenをAI入力へ含めない。
- 管理者Sessionは適切に期限を設定する。
- 不審なSessionは無効化する。
- 退任や権限変更時はSession無効化を検討する。
- Security Incident時は関連Sessionを無効化する。

### 27.2 Cookie Security Rules

Cookie Securityルールは以下である。

- CookieをSecretとして扱う場合がある。
- CookieをMarkdownへ記載しない。
- Cookieをログへ出さない。
- CookieをAI入力へ含めない。
- Cookieを手動で共有しない。
- 不審なCookie利用はSecurity Incident候補とする。

具体的なSession実装とCookie属性は、下位実装仕様で定義する。

---

## 28. Environment Security Policy

Growth Lab Coreでは、環境ごとにSecurity境界を分離する。

### 28.1 Environment Types

想定環境は以下である。

```text
Environment Types

- Local
- Development
- Staging
- Production
```

### 28.2 Environment Rules

環境分離ルールは以下である。

- Production SecretをLocalへ不用意に持ち込まない。

- DevelopmentとProductionのCredentialを分離する。

- Mock ModeとProduction Modeを明確に分ける。

- .env をGit管理しない。

- .env.example にはSecret実体を書かない。

- Production接続切替はApproval Gateを通す。

- Debug情報をProductionで過剰に表示しない。

- Test DataとProduction Dataを混在させない。

### 28.3 Environment Variable Rules

Environment Variableでは以下を守る。

- Secret実体を.env.exampleへ記載しない。

- .envの共有は安全な方法で行う。

- 不要な環境変数を残さない。

- 環境変数変更は必要に応じてAudit Logへ記録する。

- Production環境変数の変更はApproval Gateを通す。

## 29. Device and Local Development Security Policy

Local開発環境や作業端末は、Secret漏洩や誤接続の起点になりやすい。

### 29.1 Device Security Rules

Device Securityルールは以下である。

- 作業端末にはOSログイン保護を設定する。

- 不要な端末にSecretを保存しない。

- 端末紛失時の報告手順を用意する。

- 管理者Credentialを個人端末に平文保存しない。

- TOTP端末の紛失時は復旧手順を実行する。

- 不審な端末利用はSecurity Incident候補とする。

### 29.2 Local Development Security Rules

Local Development Securityルールは以下である。

- LocalではMock Modeを優先する。

- Production SecretをLocalへ不用意に持ち込まない。

- .envをGit管理しない。

- Test DataとProduction Dataを混在させない。

- Codex / Claude CodeへSecret実体を渡さない。

- AIプロンプトへCredentialを貼り付けない。

- Local LogへSecretが出力されないようにする。

- Local BackupへSecretが混入しないようにする。

詳細な開発環境手順は、下位実装仕様または11 Operationsで定義する。

## 30. Database Security Policy

Databaseは、運用データ、Audit Log、Incident、Reference情報を保存する重要基盤である。

### 30.1 Database Security Rules

Database Securityルールは以下である。

- Database Credentialを平文共有しない。

- Database CredentialをMarkdownへ記載しない。

- Database CredentialをGit管理しない。

- Database CredentialをAI入力へ含めない。

- Database接続権限を最小化する。

- Production Databaseへの直接操作を制限する。

- Migration前にBackupを確認する。

- RestoreはApproval Gateを通す。

- Database操作はAudit Logへ記録する。

- Secret実体を通常テーブルへ平文保存しない。

### 30.2 Database Access Boundary

Databaseに保存できるものは以下である。

- Secret Reference

- Token Reference Metadata

- Security Status

- Audit Log

- Incident Record

- Access Control Metadata

- Approval Record

Databaseに平文保存してはいけないものは以下である。

- Password

- API Key

- OAuth Token

- Refresh Token

- Client Secret

- TOTP Secret

- Recovery Code

- Database Credential

- WordPress Application Password

- Hosting Credential

Database設計の詳細は、08_Database.md で定義する。

## 31. API and OAuth Security Policy

API and OAuthのSecurityは、09章と連携して扱う。

### 31.1 API Security Rules

API Securityルールは以下である。

- 公式APIを優先する。

- API制限回避を行わない。

- API Keyを平文保存しない。

- Token実体をログへ出さない。

- API ResponseにSecretが含まれる場合はマスクする。

- Rate Limitを遵守する。

- Retry暴走を防ぐ。

- API Errorを記録する。

- 高リスクAPI操作はApproval Gateを通す。

### 31.2 OAuth Security Rules

OAuth Securityルールは以下である。

- 最小Scopeを原則とする。

- Scope追加はApproval Gateを通す。

- 高リスクScopeはADRを検討する。

- Token失効時はAutomationを停止する。

- Refresh Tokenを高リスクSecretとして扱う。

- OAuth接続解除はAudit Logへ記録する。

- OAuth App設定変更はApproval Gateを通す。

API and OAuth方針は、09_API_OAuth.md で定義する。

## 32. Mail Security Policy

Mail Securityは、SNSアカウント作成、認証、通知、復旧に直結する。

### 32.1 Mail Security Rules

Mail Securityルールは以下である。

- 重要メールアカウントには強い認証を設定する。

- 可能な範囲で2FAを有効化する。

- Mail AccountとIdentityを紐付ける。

- Mail AccountとSNS Accountを紐付ける。

- Gmail画面をGrowth Lab Coreの正本として扱わない。

- Recoveryメールの管理責任を明確にする。

- 転送先を確認する。

- 不要な転送設定を残さない。

- Mail Accountの停止や乗っ取り疑いはIncidentとして扱う。

メール基盤の詳細は、03_Mail_Platform.md で定義する。

## 33. SNS Security Policy

SNS Securityは、アカウント停止、乗っ取り、不正投稿、規約違反を防ぐために重要である。

### 33.1 SNS Security Rules

SNS Securityルールは以下である。

- SNS AccountをIdentityとMail Accountに紐付ける。

- SNS AccountのPasswordを平文保存しない。

- SNS Accountの2FAを可能な範囲で有効化する。

- Recovery手段を確認する。

- 未承認投稿を禁止する。

- API制限回避を行わない。

- 規約違反リスクがあるAutomationを行わない。

- アカウント停止や制限はIncident候補とする。

- SNS管理画面をGrowth Lab Coreの正本として扱わない。

SNS基盤の詳細は、04_SNS_Platform.md で定義する。

## 34. WordPress Security Policy

WordPress Securityは、記事公開、LP、Affiliate Link、SEO資産、サイト改ざん防止に直結する。

### 34.1 WordPress Security Rules

WordPress Securityルールは以下である。

- WordPress Admin権限を最小化する。

- WordPress Passwordを平文保存しない。

- WordPress Application Passwordを平文保存しない。

- WordPress記事公開はApproval Gateを通す。

- PluginやTheme更新は影響範囲を確認する。

- Backup状態を確認する。

- 不要なAdmin Userを削除または無効化する。

- WordPress REST API認証情報を安全に扱う。

- 改ざん疑いはSecurity Incidentとして扱う。

WordPress基盤の詳細は、05_WordPress_Platform.md で定義する。

## 35. AI Security Policy

AI Securityは、AI入力、AI出力、Secret混入、誤公開、高リスク判断を制御するために重要である。

### 35.1 AI Input Security

AI入力では以下を守る。

- Secret実体を含めない。

- Passwordを含めない。

- API Keyを含めない。

- OAuth Tokenを含めない。

- Refresh Tokenを含めない。

- Client Secretを含めない。

- TOTP Secretを含めない。

- Recovery Codeを含めない。

- Database Credentialを含めない。

- 個人情報や機密情報は必要最小限にする。

- 高リスク情報はマスクまたは要約する。

### 35.2 AI Output Security

AI出力では以下を守る。

- AI出力をそのまま外部公開しない。

- 高リスク出力はHuman Reviewを必須にする。

- AIが生成したSecret風文字列を実Secretとして扱わない。

- AI出力に機密情報が含まれる場合は公開しない。

- AI出力の採用、却下、修正を記録する。

- AI Output RegistryまたはDatabaseへ記録する。

### 35.3 AI Security Boundary

AI Assistantは以下を行わない。

- Secret参照

- Secret変更

- Token実体参照

- OAuth Scope変更

- Security設定変更

- 未承認外部公開

- Account削除

- Production接続切替

- Security Incidentの最終判断

AI基盤の詳細は、06_AI_Platform.md で定義する。

## 36. Automation Security Policy

Automationは便利である一方、誤実行時の影響が大きい。

### 36.1 Automation Security Rules

Automation Securityルールは以下である。

- 未承認外部実行を行わない。

- 未承認SNS投稿公開を行わない。

- 未承認WordPress記事公開を行わない。

- 未承認LP公開を行わない。

- 未承認Secret変更を行わない。

- 未承認OAuth Scope変更を行わない。

- Retry回数に上限を設ける。

- Rate Limitを遵守する。

- 認証失敗時は停止する。

- High Risk EntityはAutomation対象から除外する。

- Automation実行はAudit Logへ記録する。

- 手動停止手段を用意する。

### 36.2 Automation Permission

Automationには、処理に必要な最小権限のみを付与する。
AutomationにAdmin権限やSecret管理権限を広く付与しない。

Automation方針は、07章と09章で扱う。
具体的な運用手順は、11章で定義する。

## 37. Logging and Audit Security Policy

LoggingとAudit LogはSecurity上重要であるが、Secret漏洩の原因にもなる。

### 37.1 Logging Security Rules

Logging Securityルールは以下である。

- Secret実体をLogへ出さない。

- Token実体をLogへ出さない。

- PasswordをLogへ出さない。

- Recovery CodeをLogへ出さない。

- Request Body全文を無条件に保存しない。

- Response Body全文を無条件に保存しない。

- 個人情報を必要以上に保存しない。

- Debug LogをProductionで過剰に出さない。

- Error LogにSecretが含まれていないか確認する。

### 37.2 Audit Log Security Rules

Audit Logには以下を記録する。

- Actor

- Role

- Action

- Target

- Result

- Timestamp

- Approval ID

- Incident ID

- Reason

- Before / After Summary

Audit Logへ以下を保存しない。

- Password

- API Key

- OAuth Token

- Refresh Token

- Client Secret

- TOTP Secret

- Recovery Code

- Cookie

- Session Token

Audit Logの保存方式、保持期間、改ざん防止、閲覧権限は、08章、10章、11章で連携して定義する。

## 38. Backup and Restore Security Policy

BackupとRestoreは、復旧可能性を支える一方で、漏洩リスクも持つ。

### 38.1 Backup Security Rules

Backup Securityルールは以下である。

- Backup保存先を保護する。

- Backupへのアクセス権を限定する。

- Backup説明文にSecretを含めない。

- Backupファイル名にSecretを含めない。

- Backupの所在を記録する。

- Backup復元テストを検討する。

- 不要な古いBackupを整理する。

- Backup漏洩疑いはSecurity Incidentとして扱う。

### 38.2 Restore Security Rules

Restore Securityルールは以下である。

- RestoreはApproval Gateを通す。

- Restore前に影響範囲を確認する。

- Restore後にData Integrityを確認する。

- Restore後にAccess Controlを確認する。

- Restore後にSecret混入がないか確認する。

- Restore操作はAudit Logへ記録する。

Backup and Restoreの詳細手順は、11_Operations.md で定義する。

## 39. Encryption Policy

Encryptionは、保存中および通信中のデータを保護するために利用する。

### 39.1 Encryption Targets

暗号化対象候補は以下である。

- Secret実体

- Token実体

- Database Backup

- Sensitive Configuration

- Private Key

- Service Account Key

- 高リスクExport File

- 通信経路

### 39.2 Encryption Rules

暗号化方針は以下である。

- Secret実体は保護された形式で保存する。

- 通信経路はTLSを利用する。

- 暗号化鍵を平文でMarkdownへ記載しない。

- 暗号化鍵を通常DBへ平文保存しない。

- 暗号化鍵をAI入力へ含めない。

- 暗号化鍵のアクセス権を限定する。

- 暗号化方式変更はADRを検討する。

具体的な暗号化方式、鍵管理、Secret Store実装は、下位実装仕様で定義する。

## 40. Data Protection and Masking Policy

Growth Lab Coreでは、運用データ、個人情報、機密情報を必要最小限で扱い、必要に応じてMaskingする。

### 40.1 Protected Data Categories

保護対象データは以下である。

- Secret

- Credential

- User Account

- Mail Address

- SNS Account情報

- OAuth Connection情報

- API Log

- Audit Log

- Incident情報

- Campaign情報

- KPI情報

- AI Output

- Backup

### 40.2 Data Protection Rules

Data Protectionルールは以下である。

- 必要以上の個人情報を保存しない。

- 不要な機密情報をAIへ入力しない。

- Export Fileの扱いに注意する。

- CSVやSheetへの出力時にSecretを含めない。

- Access Controlを設定する。

- Data Retention方針に従う。

- 削除よりArchiveを優先するが、法令や規約上必要な削除には対応する。

### 40.3 Masking Rules

Maskingルールは以下である。

- Secret実体は表示しない。

- TokenやAPI Keyは原則として全文表示しない。

- Mail Addressは必要に応じて部分Maskingを検討する。

- Error LogやAPI LogではSecret候補をMaskingする。

- AI入力前にSecret候補を削除またはMaskingする。

- ScreenやExportで不要な機密情報を表示しない。

## 41. Security Monitoring Policy

Security Monitoringは、異常、漏洩、権限過剰、不正アクセスを検知するために必要である。

### 41.1 Monitoring Targets

監視対象は以下である。

- Login Failure

- 2FA Failure

- OAuth Error

- Token Expiration

- Token Rotation Failure

- API Authentication Error

- API Authorization Error

- Secret Access

- Role Change

- Permission Change

- Production Access

- Automation Failure

- Unauthorized Execution Suspicion

- Secret Leakage Suspicion

- Backup Failure

- Restore Execution

- Incident Status

### 41.2 Alert Conditions

通知または確認対象は以下である。

- 管理者Login失敗の連続

- OAuth失効

- Token更新失敗

- Scope変更

- Secret参照異常

- Production接続切替

- 未承認外部実行疑い

- API認証失敗の連続

- Backup失敗

- Restore実行

- Secret混入疑い

- Account乗っ取り疑い

通知先、確認頻度、対応SLAは、11_Operations.md で定義する。

## 42. Security Incident Policy

Security Incidentは、Secret漏洩、認証異常、不正アクセス、未承認実行、アカウント乗っ取りなどを扱う。

### 42.1 Security Incident Types

主なSecurity Incidentは以下である。

- Secret Leakage

- Token Leakage

- API Key Leakage

- Password Leakage

- TOTP Secret Leakage

- Recovery Code Leakage

- Unauthorized Access

- Account Takeover

- Unauthorized API Execution

- Unauthorized Publication

- OAuth Scope Abuse

- Malware or Compromised Device

- Database Credential Leakage

- Backup Leakage

- AI Input Secret Exposure

- Audit Log Tampering Suspicion

### 42.2 Incident Severity

Severityは以下を基本とする。

```text
Security Incident Severity
```

Level 1: Low Level 2: Medium Level 3: High Level 4: Critical

```text
### 42.3 Severity Examples

Level 1の例は以下である。

- 低リスク設定ミス
- 影響範囲が限定された権限ミス
- Secret実体を含まない軽微なログ不備

Level 2の例は以下である。

- 不要権限の放置
- OAuth失効による一部Automation停止
- Secret混入疑いだが外部露出不明

Level 3の例は以下である。

- API Key漏洩疑い
- Token漏洩疑い
- WordPress Admin不正アクセス疑い
- SNS Account乗っ取り疑い

Level 4の例は以下である。

- 複数Secret漏洩
- Production Database Credential漏洩
- 管理者アカウント乗っ取り
- 未承認外部公開の大規模発生
- 顧客情報や重要機密の外部流出

---

## 43. Security Incident Response

Security Incident発生時は、以下の流れで対応する。

```text
Detect
  |
  v
Classify Severity
  |
  v
Contain
  |
  v
Revoke or Rotate Secret if Needed
  |
  v
Stop Automation if Needed
  |
  v
Check Impact Scope
  |
  v
Recover
  |
  v
Record Incident
  |
  v
Review Root Cause
  |
  v
Prevent Recurrence
```

### 43.1 Initial Response

初動対応では以下を確認する。

- 対象Secret

- 対象Account

- 対象Provider

- 対象Environment

- 影響するAutomation

- 影響するScheduler

- 影響するAPI Adapter

- 影響するDatabase

- 影響するSNS投稿

- 影響するWordPress記事

- 影響するMail Account

- 影響するUser

- 影響範囲

- 公開情報の有無

### 43.2 Containment Actions

封じ込め対応候補は以下である。

- Token無効化

- API Key無効化

- Password変更

- OAuth接続解除

- Scope削除

- 2FA再設定

- Recovery Code再発行

- Automation停止

- Scheduler停止

- User権限停止

- 外部サービス側のSession無効化

- 該当端末の利用停止

具体的なIncident Response Runbookは、11_Operations.md で定義する。

## 44. Security Incident Records

Security Incidentでは、以下を記録する。

```text
Security Incident Record
```

- Incident ID

- Detected At

- Detected By

- Severity

- Incident Type

- Affected Service

- Affected Account

- Affected Secret Reference

- Affected Environment

- Description

- Initial Action

- Containment Action

- Recovery Action

- Root Cause

- Impact Scope

- Preventive Action

- Owner

- Status

- Closed At

- Change History

```text
Security Incident Recordには、Secret実体を記載しない。
Secret Referenceや対象Account IDなど、追跡に必要な参照情報のみを記録する。

---

## 45. Security Review Policy

Security Reviewは、定期的または重要変更前に実施する。

### 45.1 Review Timing

Security Reviewを行うタイミングは以下である。

- 新規Provider接続前
- OAuth Scope追加前
- Production接続切替前
- Secret管理方式変更前
- Database Migration前
- Backup Restore前
- Automation範囲拡大前
- SNS Account大量追加前
- WordPress Admin変更前
- Security Incident後
- Scale Stage移行前

### 45.2 Review Items

Security Reviewでは以下を確認する。

- Secret保管状態
- Token Reference管理状態
- OAuth Scope
- Access Control
- Role設定
- Admin権限保持者
- 2FA有効化状況
- Recovery Code管理状況
- API Key棚卸し
- Automation権限
- AI入力へのSecret混入リスク
- Backup保護状態
- Audit Log状態
- Incident対応履歴

---

## 46. Security Exception and Risk Acceptance Policy

Security方針を一時的に満たせない場合は、例外を無制限に許可せず、Risk Acceptanceとして明示的に管理する。

### 46.1 Exception Required Cases

Security Exceptionが必要になる例は以下である。

- 一時的に2FAを有効化できない。
- 一時的にManual Operationが必要になる。
- 公式APIが利用できず手動代替が必要になる。
- Secret Rotationを予定より遅らせる。
- 権限削除が一時的に実施できない。
- Production接続切替を延期できない。

### 46.2 Exception Rules

Security Exceptionルールは以下である。

- 例外理由を記録する。
- 影響範囲を記録する。
- Risk Levelを記録する。
- 期限を設定する。
- Ownerを設定する。
- 代替策を設定する。
- Approval Gateを通す。
- 期限切れ例外を放置しない。
- 例外を恒久運用にしない。

### 46.3 Risk Acceptance Record

Risk Acceptanceでは以下を記録する。

```text
Risk Acceptance Record

- Risk Acceptance ID
- Target Type
- Target ID
- Reason
- Risk Level
- Compensating Control
- Approved By
- Approved At
- Expiration Date
- Owner
- Status
- Notes
```

詳細な例外承認手順は、11_Operations.md で定義する。

## 47. Security Data Model Overview

Security基盤の論理データモデルは以下である。

Security     |     +-- User     +-- Role     +-- Permission     +-- Secret Reference     +-- Token Reference     +-- Credential Reference     +-- OAuth Security Status     +-- Access Log     +-- Audit Log     +-- Security Incident     +-- Security Review     +-- Recovery Metadata     +-- Risk Acceptance

Databaseへ保存する場合は、Secret実体ではなく、参照情報、状態、履歴、権限、Incident情報を保存する。

物理データベース設計は、08_Database.md で定義する。

## 48. Security Entity Policy

Security関連Entityは、権限、参照情報、状態、Incidentを管理するために利用する。

本章に記載するEntity項目は、概念フィールド候補である。
物理テーブル、Prisma Schema、Column名、型、Index、Constraintは、08 Databaseおよび下位実装仕様で定義する。

### 48.1 User Entity

```text
User Conceptual Fields
```

- User ID

- Display Name

- Email

- Role

- Status

- 2FA Status

- Last Login At

- Last Reviewed At

- Owner

- Notes

```text
### 48.2 Role Entity

```text
Role Conceptual Fields

- Role ID
- Role Name
- Description
- Risk Level
- Status
- Created At
- Updated At
- Notes
```

### 48.3 Permission Entity

```text
Permission Conceptual Fields
```

- Permission ID

- Permission Name

- Permission Category

- Target Resource

- Risk Level

- Status

- Notes

```text
### 48.4 Secret Reference Entity

```text
Secret Reference Conceptual Fields

- Secret Reference ID
- Secret Type
- Related Service
- Related Account
- Status
- Risk Level
- Last Rotated At
- Last Checked At
- Owner
- Notes
```

### 48.5 Security Review Entity

```text
Security Review Conceptual Fields
```

- Security Review ID

- Review Type

- Target Type

- Target ID

- Reviewer

- Result

- Risk Level

- Review Date

- Next Review Date

- Notes

```text
### 48.6 Security Entity Rules

ルールは以下である。

- Secret実体をSecurity関連Entityへ保存しない。
- Secret ReferenceとSecret実体を混同しない。
- User、Role、Permissionの変更はAudit Logへ記録する。
- Security Review結果を記録する。
- Incidentと関連Entityを紐付ける。

---

## 49. Security Scale Architecture

Security基盤は、運用規模に応じて段階的に拡張する。

### 49.1 Scale Stages

```text
Stage 1: 初期20SNSアカウント規模の基本Security
Stage 2: 主要外部サービス連携時のSecret管理強化
Stage 3: Database中心運用時のAccess Control強化
Stage 4: Automation拡大時のSecurity Monitoring強化
Stage 5: 大規模運用OSとしてのSecurity Governance
```

### 49.2 Stage 1

初期段階では、以下を基本とする。

- Secret平文保存禁止

- Password Managerまたは安全なSecret管理領域

- TOTP標準候補

- Recovery Code管理

- 最小権限

- Manual Approval

- 基本Audit Log

- Mock Mode

### 49.3 Stage 2

以下を追加検討する。

- OAuth Scope棚卸し

- Token Reference管理

- API Key Rotation

- Provider別Secret管理

- Security Review

- Production接続承認

### 49.4 Stage 3

以下を追加検討する。

- Role-Based Access Control

- Permission管理

- Database Access Control

- Audit Log閲覧権限

- Security Incident Entity

- Backup Security確認

### 49.5 Stage 4

以下を追加検討する。

- Automation Security Monitoring

- Unauthorized Execution Detection

- Secret Access Monitoring

- Advanced Alert

- Security Runbook強化

- Incident Response Drill

### 49.6 Stage 5

以下を追加検討する。

- Security Governance

- 高度な権限分離

- 複数管理者承認

- 定期Security Audit

- Compliance Review

- Advanced Secret Management

- Advanced Incident Response

## 50. Security Scale Gate

次のSecurity Stageへ進む前に、Security Scale Gate Reviewを行う。

```text
Security Scale Gate Review
```

- 現在の管理User数

- 現在のRole数

- Admin権限保持者数

- Secret Reference管理状況

- Token Reference管理状況

- OAuth Scope棚卸し状況

- API Key棚卸し状況

- 2FA有効化状況

- TOTP管理状況

- Recovery Code管理状況

- Password管理状況

- Access Control状況

- Audit Log記録状況

- Security Incident発生状況

- AI入力へのSecret混入リスク

- Automation権限状況

- Backup Security状況

- Production接続管理状況

- Security Exception状況

- Offboarding確認状況

- 運用担当者の負荷

- 次Stageへ進む必要性

```text
Security Scale Gateを通過できない場合は、アカウント拡張、Provider追加、Automation拡大、Production接続拡大を行わず、Security改善を優先する。

Security Scale Gateは、Growth Lab Core System Scale Gate、Database Scale Gate、API and OAuth Scale Gateを置き換えるものではない。
Security観点の準備状態を確認し、07章のSystem Scale Gateへ判断材料を提供する。

---

## 51. Operations Policy

Securityの日常運用では、Secret、権限、OAuth、2FA、Audit Log、Incidentを確認する。

### 51.1 Regular Checks

定期確認項目は以下である。

- Secret管理状態
- Token Reference状態
- API Key棚卸し
- OAuth Scope棚卸し
- 2FA有効化状況
- Recovery Code管理状況
- Admin権限保持者
- User一覧
- Role一覧
- Automation権限
- Audit Log
- Security Incident
- Security Exception
- Backup Security
- AI入力へのSecret混入疑い

### 51.2 Change Management

以下の変更は記録する。

- Secret変更
- Token Rotation
- API Key変更
- OAuth Scope追加
- User追加
- Role変更
- Permission変更
- 2FA解除
- Recovery Code再発行
- Production接続切替
- Backup Restore
- Security設定変更
- Security Exception承認

### 51.3 Maintenance

保守対象は以下である。

- 不要User
- 不要Role
- 不要Permission
- 不要API Key
- 不要OAuth Scope
- 古いToken Reference
- 古いSecret Reference
- Recovery Code状態
- Security Incident履歴
- Security Exception期限
- Audit Log容量
- Backup保護状態

詳細な運用手順は、`11_Operations.md` で定義する。

---

## 52. Integration with Other Chapters

本章は、以下の章と連携する。

### 52.1 02 Overall Architecture

Securityは、Growth Lab Core全体アーキテクチャの全Layerに横断的に関係する。

### 52.2 03 Mail Platform

Mail Account、Gmail、転送、復旧、認証通知、Recoveryに関係する。

### 52.3 04 SNS Platform

SNS Account、投稿、アカウント停止、乗っ取り、Recovery、2FAに関係する。

### 52.4 05 WordPress Platform

WordPress Admin、Application Password、記事公開、Plugin、Backupに関係する。

### 52.5 06 AI Platform

AI入力、AI出力、Secret混入防止、Human Reviewに関係する。

### 52.6 07 Growth Lab Core System

Workflow、Approval Gate、Automation Boundary、Audit Log、Incident Handlingと連携する。

### 52.7 08 Database

Secret Reference、Security Status、User、Role、Permission、Audit Log、Incidentの保存方針と連携する。

### 52.8 09 API and OAuth

OAuth Connection、Scope、Token Reference、API Credential Reference、Webhook Secret、Rate Limit、API Errorと連携する。

### 52.9 11 Operations

Security Runbook、Secret Rotation、Incident Response、Backup Restore、定期棚卸し、Offboarding、Security Exception管理を扱う。

### 52.10 12 Analytics and KPI

Security関連KPI、Risk指標、Incident件数、運用負荷、改善判断と連携する。

### 52.11 13 Roadmap

Security強化の段階導入、Secret管理強化、権限管理強化、監査強化の計画を扱う。

### 52.12 14 ADR

Securityに関する重要な設計判断をADRとして記録する。

---

## 53. Chapter Responsibility Boundary

本章では、Security基盤の上位設計と運用方針を定義する。

詳細設計は、以下の章または下位文書で定義する。

```text
10 Security
    |
    +-- Defines:
    |       +-- Security architecture
    |       +-- Protected data classification
    |       +-- Secret management policy
    |       +-- Token protection policy
    |       +-- API Key and Client Secret policy
    |       +-- Password policy
    |       +-- 2FA / TOTP / Recovery Code policy
    |       +-- Authentication policy
    |       +-- Authorization policy
    |       +-- Access Control policy
    |       +-- Role and Permission policy
    |       +-- Account lifecycle and offboarding policy
    |       +-- Environment security policy
    |       +-- Device and local development security policy
    |       +-- Database security boundary
    |       +-- API and OAuth security boundary
    |       +-- AI security policy
    |       +-- Automation security policy
    |       +-- Logging and Audit security policy
    |       +-- Backup and Restore security policy
    |       +-- Security Incident policy
    |       +-- Security Exception policy
    |       +-- Security Scale Gate policy
    |
    +-- Does not define:
            +-- Secret実体
            +-- Token実体
            +-- Password実体
            +-- API Key実体
            +-- Client Secret実体
            +-- TOTP Secret実体
            +-- Recovery Code実体
            +-- Full security implementation code
            +-- Detailed operation runbook
            +-- Legal judgment final decision
```

具体的な運用手順はOperations章で扱う。
物理データベース設計はDatabase章で扱う。
OAuth接続方針はAPI and OAuth章で扱う。
KPI詳細はAnalytics and KPI章で扱う。

## 54. Architecture Constraints

Security基盤では、以下の制約を前提とする。

- Secret実体をMarkdownへ記載しない。

- Secret実体を通常DBへ平文保存しない。

- Secret実体をログへ出さない。

- Secret実体をAI入力へ含めない。

- Token ReferenceとToken実体を混同しない。

- Recovery Code実体を通常台帳へ記載しない。

- Passwordを使い回さない。

- 最小権限を原則とする。

- 重要操作はApproval Gateを通す。

- 高リスク操作はAudit Logへ記録する。

- 2FAを可能な範囲で有効化する。

- TOTPを標準候補とする。

- Passkeyは対応サービスで補助的または強化的に利用する。

- AI AssistantにSecret参照権限を与えない。

- Automationに未承認外部実行を許可しない。

- Production接続切替は承認制にする。

- Security Incident発生時は停止、隔離、復旧、再発防止を行う。

- Security Exceptionは期限付きで管理する。

- Security Scale Gateを通過せずに高リスク拡張を行わない。

## 55. Risks

本章に関連する主なリスクは以下である。

### 55.1 Risk: Secret漏洩

Password、API Key、OAuth Token、Refresh Token、Client Secretなどが漏洩する可能性がある。

軽減策：

- Secret実体をMarkdown、通常DB、ログ、AI入力へ含めない。

- Secret Storeまたは保護された管理領域を利用する。

- Secret Rotationを行う。

- 漏洩疑いはSecurity Incidentとして扱う。

### 55.2 Risk: 権限過剰

User、Automation、Service Accountが必要以上の権限を持つ可能性がある。

軽減策：

- 最小権限を原則とする。

- RoleとPermissionを分離する。

- 権限棚卸しを行う。

- Admin権限を限定する。

### 55.3 Risk: 2FA復旧不能

TOTP端末紛失やRecovery Code不備により、重要アカウントへアクセスできなくなる可能性がある。

軽減策：

- Recovery Codeを安全に保管する。

- Backup管理者を検討する。

- 復旧手順をOperations章で定義する。

- TOTP再設定手順を用意する。

### 55.4 Risk: AI入力へのSecret混入

AIプロンプトやAI分析入力にSecretやCredentialが混入する可能性がある。

軽減策：

- AI入力前にSecretを除外する。

- 高リスク情報をマスクする。

- AI AssistantにSecret参照権限を与えない。

- AI出力をHuman Reviewする。

### 55.5 Risk: Automationの未承認実行

Automationが未承認の投稿、削除、OAuth変更、Secret変更を行う可能性がある。

軽減策：

- Approval Gateを必須にする。

- Automation権限を限定する。

- 高リスク操作を禁止する。

- Automation実行をAudit Logへ記録する。

### 55.6 Risk: Recovery Code漏洩

Recovery Codeが平文で共有され、第三者に利用される可能性がある。

軽減策：

- Recovery Codeを通常台帳へ保存しない。

- Recovery Code Metadataのみ管理する。

- 使用後は再発行または無効化を検討する。

- 漏洩疑いはSecurity Incidentとして扱う。

### 55.7 Risk: Backup漏洩

Backupに機密情報が含まれ、保存先や共有方法から漏洩する可能性がある。

軽減策：

- Backup保存先を保護する。

- Backupアクセス権を限定する。

- Backup説明文にSecretを含めない。

- 不要なBackupを整理する。

### 55.8 Risk: Audit LogへのSecret混入

ErrorやRequest情報にSecretが含まれ、そのままAudit Logに保存される可能性がある。

軽減策：

- Log出力前にSecretをマスクする。

- Request / Response全文保存を避ける。

- Log Reviewを行う。

- Secret混入疑いはIncidentとして扱う。

### 55.9 Risk: Offboarding漏れ

退任者、担当変更者、不要Service Accountの権限が残る可能性がある。

軽減策：

- Offboarding手順を定義する。

- User、Role、Permissionを棚卸しする。

- 外部サービス側の権限も確認する。

- 退任時はSession無効化とSecret Rotationを検討する。

### 55.10 Risk: Security Exceptionの恒久化

一時的な例外が放置され、恒久的な脆弱性になる可能性がある。

軽減策：

- 例外期限を設定する。

- Ownerを設定する。

- 期限切れを確認する。

- Risk Acceptanceを記録する。

- Scale Gateで確認する。

### 55.11 Risk: 10章が実装詳細に入りすぎる

本章がSecret Store製品設定、暗号化実装コード、運用Runbook全文を抱え込み、下位文書との責任分界が不明確になる可能性がある。

軽減策：

- 本章はSecurity設計方針までを定義する。

- 実装詳細は下位実装仕様へ委譲する。

- 運用手順は11 Operationsへ委譲する。

- Secret実体は本章に記載しない。

## 56. Required Review Checklist

本章またはSecurity基盤を更新する場合は、以下を確認する。

```text
Security Review Checklist
```

- Security全体方針が明確か

- 07 Growth Lab Core Systemとの責任分界が明確か

- 08 Databaseとの責任分界が明確か

- 09 API and OAuthとの責任分界が明確か

- 11 Operationsとの責任分界が明確か

- Protected Data Classificationが定義されているか

- Secret管理方針が定義されているか

- Token実体の保護方針が定義されているか

- API Key / Client Secret方針が定義されているか

- Password方針が定義されているか

- 2FA方針が定義されているか

- TOTP方針が定義されているか

- Passkey方針が定義されているか

- Recovery Code方針が定義されているか

- Authentication方針が定義されているか

- Authorization方針が定義されているか

- Access Control方針が定義されているか

- Role方針が定義されているか

- Permission方針が定義されているか

- Least Privilege方針が定義されているか

- Account Lifecycle and Offboarding方針が定義されているか

- Session and Cookie Security方針が定義されているか

- Environment Security方針が定義されているか

- Device and Local Development Security方針が定義されているか

- Database Security方針が定義されているか

- API and OAuth Security方針が定義されているか

- Mail Security方針が定義されているか

- SNS Security方針が定義されているか

- WordPress Security方針が定義されているか

- AI Security方針が定義されているか

- Automation Security方針が定義されているか

- Logging and Audit Security方針が定義されているか

- Backup and Restore Security方針が定義されているか

- Encryption方針が定義されているか

- Data Protection and Masking方針が定義されているか

- Security Monitoring方針が定義されているか

- Security Incident方針が定義されているか

- Security Exception方針が定義されているか

- Security Scale Gateが定義されているか

- Secret実体を本文に含めていないか

- 実装詳細に入りすぎていないか

- ADRが必要な判断が整理されているか

```text
---

## 57. Review Points

本章のレビューでは、以下を確認する。

- Security基盤がGrowth Lab Core全体の横断基盤として定義されているか。
- Secret実体をMarkdown、通常DB、ログ、AI入力へ含めない方針が明確か。
- Token ReferenceとToken実体の境界が明確か。
- 09 API and OAuthとの責任分界が明確か。
- 08 Databaseとの保存責任分界が明確か。
- 07 Growth Lab Core SystemのApproval Gate、Automation Boundaryと接続できているか。
- 11 OperationsへRunbook詳細を委譲できているか。
- TOTPを標準候補、Passkeyを補助または強化要素として扱えているか。
- Recovery Codeの扱いが安全か。
- Role、Permission、Access Controlが最小権限の方針になっているか。
- Account LifecycleとOffboardingが定義されているか。
- SessionとCookieの扱いが定義されているか。
- AI入力へのSecret混入防止が明確か。
- Automationに未承認外部実行を許可していないか。
- BackupとRestoreのSecurity方針が明確か。
- Security Exceptionが期限付きで管理されているか。
- Security Incidentの初動、封じ込め、復旧、再発防止が定義されているか。
- Security Scale Gateが拡張判断に使える内容になっているか。
- Secret Store製品設定や暗号化実装コードに入りすぎていないか。
- Codex反映時に章構成が崩れにくい構成になっているか。

---

## 58. Architecture Decision Records

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
ADR-0075: Token Reference and Secret Boundary Policy
ADR-0082: Security Architecture
ADR-0083: Secret Management Policy
ADR-0084: Token Protection Policy
ADR-0085: Password and 2FA Policy
ADR-0086: TOTP and Recovery Code Policy
ADR-0087: Access Control and Role Policy
ADR-0088: AI Input Secret Protection Policy
ADR-0089: Automation Security Boundary Policy
ADR-0090: Security Incident Response Policy
ADR-0091: Security Scale Gate Policy
ADR-0092: Account Lifecycle and Offboarding Policy
ADR-0093: Security Exception and Risk Acceptance Policy
```

以下の判断を変更する場合は、ADR作成を検討する。

- Security基盤の責任範囲変更

- Secret管理方針変更

- Token保護方針変更

- Password管理方針変更

- 2FA / TOTP方針変更

- Passkey方針変更

- Recovery Code方針変更

- Access Control方針変更

- Role / Permission方針変更

- Account Lifecycle方針変更

- Offboarding方針変更

- Secret Store方針変更

- Encryption方針変更

- AI入力Secret保護方針変更

- Automation Security Boundary変更

- Security Incident方針変更

- Security Exception方針変更

- Security Scale Gate方針変更
