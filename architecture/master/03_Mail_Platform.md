# 03 Mail Platform

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/03_Mail_Platform.md

## 1. Purpose

本章の目的は、Growth Lab Core におけるメール基盤の設計方針を定義することである。

メール基盤は、単なる連絡用メールアドレスの集合ではない。
Growth Lab Coreでは、メールアドレスをSNSアカウント作成、認証、通知受信、復旧、管理、監査、Identity管理の中核要素として扱う。

本章では、以下を定義する。

- 独自ドメインメール基盤

- レンタルサーバーメールの役割

- Gmail転送管理

- Google Workspaceの役割

- 1メールアドレスにつき1SNSアカウントの管理方針

- Mail AccountとIdentityの関係

- Mail Account Registryの正本管理方針

- 認証メール、通知メール、復旧メールの管理方針

- メールアドレス命名ルール

- メール転送、受信、検索、保管の方針

- メールセキュリティ

- メール基盤の拡張方針

- コスト最適化方針

- 運用リスクと軽減策

## 2. Scope

本章の対象範囲は、Growth Lab Coreで使用するメール基盤全体である。

対象範囲は以下を含む。

- 独自ドメインメール

- SNS登録用メールアドレス

- 管理者用メールアドレス

- 通知受信用メールアドレス

- 復旧用メールアドレス

- システム通知用メールアドレス

- Gmail転送

- Google Workspace

- レンタルサーバーのメール機能

- Mail Account Registry

- Identityとの紐付け

- SNS Accountとの紐付け

- メール受信確認

- メール転送確認

- メール認証設定の基本方針

- メールセキュリティ

- メール基盤の拡張方針

本章では、具体的なDNSレコード値、Google Workspaceの画面操作手順、Gmailのフィルタ設定手順、エックスサーバーの画面操作手順までは定義しない。
それらは、運用マニュアル、実装手順書、または下位仕様で定義する。

## 3. Non-Goals

本章では、以下を対象外とする。

- 個別SNSのアカウント作成画面の操作手順

- Google Workspaceの契約手順

- エックスサーバーの契約手順

- DNSレコードの具体値

- SPF、DKIM、DMARCの具体的な設定値

- Gmail画面上でのラベル作成手順

- メールソフトの個別設定手順

- SMTPを使った大量配信基盤の設計

- メールマーケティング配信基盤の詳細設計

- 顧客向けメール本文テンプレート

- メール配信法規制の詳細運用

メールマーケティングや大量配信が必要になった場合は、別章または別仕様書で定義する。

## 4. Background

Growth Lab Coreでは、初期段階でXを含む複数SNSの運用を想定している。

初期構築では20アカウント規模を前提とする。
将来的には、KPI、ROI、運用負荷、アカウント停止リスク、セキュリティ管理、メール基盤の管理負荷を確認しながら、100から500アカウント規模まで拡張できる構成にする。

SNSアカウント管理では、メールアドレスが重要な役割を持つ。

- アカウント登録

- ログイン確認

- 認証コード受信

- セキュリティ通知受信

- パスワードリセット

- アカウント制限通知

- 重要なお知らせ受信

- 復旧手続き

- 運用履歴確認

そのため、メールアドレスは使い捨てではなく、Identityに紐付く管理対象として扱う。

## 5. Alignment with Architecture Principles

本章は、01_Architecture_Principles.md で定義した原則に従う。

特に、メール基盤では以下を重視する。

AP-01 Compliance First AP-03 Security by Design AP-06 Scalability AP-07 Observability AP-08 Cost Optimization AP-09 Single Source of Truth

メール基盤における優先順位は以下である。

1. 規約遵守 2. セキュリティ 3. 復旧可能性 4. 正本管理 5. 運用しやすさ 6. 拡張性 7. コスト最適化

メールアドレス数の増加や転送設定の追加は、管理可能性、復旧可能性、セキュリティを損なわない範囲で実施する。

## 6. Mail Platform Vision

Growth Lab Coreのメール基盤は、SNS運用を支える認証、通知、復旧、監査の基盤である。

Mail Platform     |     +-- SNS Account Registration     +-- Authentication Support     +-- Security Notification     +-- Account Recovery     +-- Identity Management     +-- Operation Monitoring     +-- Cost Optimization

Growth Lab Coreでは、メールアドレスを以下のように扱う。

Mail Address     |     +-- Identity     +-- SNS Account     +-- Platform     +-- Forwarding Destination     +-- Verification Status     +-- Recovery Role     +-- Risk Status     +-- Operation History

メールアドレスは、SNSアカウントを管理するための重要な識別情報であり、単独で管理しない。

## 7. Overall Mail Architecture

Growth Lab Coreのメール基盤は、以下の構成を基本とする。

```text
Independent Domain | +- Domain Mail | | | +- SNS Registration Addresses | +- Admin Addresses | +- Notification Addresses | +- Recovery Addresses | +- System Addresses | +- Mail Forwarding | +- Gmail +- Google Workspace +- Shared Monitoring Inbox

Growth Lab Core | +- Identity Management +- Mail Account Management +- SNS Account Management +- Mail Account Registry +- Notification Log +- Recovery Reference +- Audit Log
```

基本方針は以下である。

- 独自ドメインを利用する。
- SNS登録用メールは独自ドメインで作成する。
- 初期段階ではレンタルサーバーのメール機能と転送を活用する。
- Gmailへ転送し、受信確認と検索をしやすくする。
- Google Workspaceは管理基盤として利用する。
- SNS登録用メールをすべてGoogle Workspaceユーザーとして作成しない。
- 1メールアドレスにつき1SNSアカウントを基本とする。
- メールアドレス、SNSアカウント、Identityを必ず紐付ける。
- メールアカウント情報の正本はMail Account Registryで管理する。

---

## 8. Mail Platform Components

メール基盤は、以下のコンポーネントで構成する。

### 8.1 Independent Domain

Growth Lab Core専用またはSNS運用専用の独自ドメインを利用する。

独自ドメインを利用する理由は以下である。

- メールアドレスを柔軟に作成できる。
- SNSアカウントごとの管理がしやすい。
- 外部フリーメールへの依存を減らせる。
- 将来の拡張に対応しやすい。
- ブランド、用途、管理範囲を分離しやすい。

### 8.2 Domain Mail

独自ドメインで作成するメールアドレス群である。

主な用途は以下である。

- SNS登録用
- SNS通知受信用
- 管理者用
- 復旧用
- システム通知用
- テスト用

### 8.3 Rental Server Mail

レンタルサーバーのメール機能は、独自ドメインメール作成と転送に利用する。

初期候補はエックスサーバーとする。
ただし、最終選定はコスト、安定性、メール転送管理、WordPress運用、DNS管理、バックアップ、セキュリティを比較して判断する。

### 8.4 Mail Forwarding

独自ドメインメールに届いたメールを、管理用GmailまたはGoogle Workspaceへ転送する仕組みである。

転送を利用する理由は以下である。

- 多数のメールアドレスを個別ログインせず確認できる。
- Gmailの検索、ラベル、フィルタを活用できる。
- 初期コストを抑えられる。
- 運用担当者が確認しやすい。

### 8.5 Gmail

Gmailは、転送されたメールを確認するための受信管理先として利用する。

Gmailは、メール基盤の正本ではない。
メールアドレス、SNSアカウント、Identityの正本は、Mail Account RegistryまたはGrowth Lab Core Databaseで管理する。

### 8.6 Google Workspace

Google Workspaceは、Growth Lab Coreの管理基盤として利用する。

主な用途は以下である。

- 管理者用メール
- Google Drive
- Google Docs
- Google Sheets
- Google Calendar
- 仕様書管理補助
- 共有ファイル管理
- 重要通知の受信
- 管理者認証

SNS登録用メールをすべてGoogle Workspaceユーザーとして作成するとコストが増大するため、初期段階では管理者や中核機能に限定して利用する。

### 8.7 Mail Account Registry

Mail Account Registryは、メールアカウント情報のSingle Source of Truthである。

管理対象は以下である。

- Mail Account ID
- メールアドレス
- ドメイン
- 用途
- 紐付くIdentity
- 紐付くSNSアカウント
- 転送先
- 作成日
- ステータス
- 最終確認日
- 復旧用途
- リスク状態
- 備考
- 変更履歴

初期段階ではGoogle SheetsまたはMarkdown台帳で管理し、将来的にはGrowth Lab Core Databaseへ移行する。

---

## 9. Responsibility Boundary

メール基盤では、各要素の責任範囲を明確に分離する。

### 9.1 Growth Lab Core Responsibilities

Growth Lab Coreが責任を持つ範囲は以下である。

- Mail Account Registry管理
- Identityとの紐付け管理
- SNS Accountとの紐付け管理
- メールアカウント状態管理
- 転送先情報管理
- 復旧参照情報管理
- 受信確認履歴管理
- 変更履歴管理
- 監査ログ管理

### 9.2 External Service Responsibilities

外部サービス側が責任を持つ範囲は以下である。

- ドメイン管理会社のDNS仕様
- レンタルサーバーのメール仕様
- Gmailの受信、検索、ラベル仕様
- Google Workspaceのユーザー管理仕様
- SNSプラットフォーム側のメール認証仕様
- SNSプラットフォーム側の通知送信仕様

Growth Lab Coreは外部サービス仕様を制御できない。
そのため、外部仕様変更を前提に、台帳管理、受信確認、障害対応、移行可能性を設計する。

### 9.3 Human Operator Responsibilities

人間の運用担当者が責任を持つ範囲は以下である。

- メールアドレス作成判断
- SNSアカウント作成判断
- 重要通知の確認
- 復旧作業の承認
- 管理者メールの保護
- 転送先変更の確認
- セキュリティ異常時の判断
- Mail Scale Gate Review

### 9.4 Codex and Claude Code Responsibilities

Codexは、確定済み仕様の反映、台帳テンプレート作成、CHANGELOG更新、バックアップ作成を支援する。

Claude Codeは、仕様書とADRに基づいて、メール基盤に関する実装、検証、自動化、スクリプト作成を支援する。

CodexおよびClaude Codeは、上位設計判断を単独で変更しない。

---

## 10. Mail Account Types

Growth Lab Coreでは、メールアドレスを用途別に分類する。

### 10.1 Admin Mail Account

管理者用メールアドレスである。

用途は以下である。

- Google Workspace管理
- ドメイン管理
- レンタルサーバー管理
- WordPress管理
- 重要な契約通知
- 重要なセキュリティ通知

Admin Mail Accountは、厳格に管理する。

### 10.2 SNS Registration Mail Account

SNSアカウント登録用メールアドレスである。

基本方針は以下である。

- 1メールアドレスにつき1SNSアカウントを基本とする。
- SNSごと、アカウントごとに識別可能にする。
- Identityに紐付ける。
- 転送先を明確にする。
- 復旧に使用できる状態を維持する。

### 10.3 Notification Mail Account

SNSや外部サービスからの通知受信用メールアドレスである。

通知は、必要に応じてGmailへ転送し、ラベルやフィルタで管理する。

### 10.4 Recovery Mail Account

アカウント復旧に使用するメールアドレスである。

Recovery Mail Accountは、通常の通知用とは区別して管理する。
復旧用メールアドレスには、強い認証、最小権限、アクセス制限を適用する。

### 10.5 System Mail Account

Growth Lab Core内部または関連システムからの通知に利用するメールアドレスである。

用途は以下である。

- エラー通知
- バックアップ通知
- Scheduler通知
- Automation通知
- セキュリティ通知

### 10.6 Test Mail Account

検証用メールアドレスである。

テスト用メールアドレスを本番SNSアカウントに使い回さない。

---

## 11. Domain Strategy

Growth Lab Coreでは、用途に応じてドメインまたはサブドメインを分離できる設計とする。

### 11.1 Primary Domain

事業またはプロジェクトの中核管理用ドメインである。

用途は以下である。

- 管理者メール
- Google Workspace
- 公式管理
- 重要通知

### 11.2 SNS Operation Domain

SNS運用専用のメールアドレスに使用するドメインまたはサブドメインである。

用途は以下である。

- SNS登録用メール
- SNS通知用メール
- SNS検証用メール

### 11.3 Subdomain Option

将来的な拡張やリスク分離のため、サブドメイン利用も検討できる。

例：

```text
accounts.example.com
sns.example.com
notify.example.com
```

実際のドメイン名は、別途ドメイン設計または実装手順書で定義する。

### 11.4 Domain Separation Policy

重要管理用メールとSNS登録用メールは、可能な範囲で役割を分離する。

分離する理由は以下である。

- 管理リスクを下げる。

- SNS運用リスクを中核管理基盤へ波及させにくくする。

- メールアドレスの用途を明確にする。

- 将来の移行をしやすくする。

## 12. Email Address Naming Convention

メールアドレスは、規則的に命名する。

命名ルールの目的は以下である。

- SNSアカウントとの対応を分かりやすくする。

- 将来の拡張に対応する。

- 管理台帳と照合しやすくする。

- 個人情報を含めない。

- 用途を推測しやすくする。

### 12.1 Naming Principles

命名原則は以下である。

- 小文字英数字を基本とする。

- 個人名を含めない。

- パスワードや秘密情報を含めない。

- SNS種別を識別できる形式を推奨する。

- 連番またはIdentity IDと対応させる。

- 運用途中で意味が変わりにくい形式にする。

### 12.2 Example Pattern

以下は命名例である。

x001@example.com x002@example.com ig001@example.com ig002@example.com tt001@example.com tt002@example.com yt001@example.com fb001@example.com

用途をより明確にする場合は、以下も候補とする。

sns-x-001@example.com sns-x-002@example.com sns-ig-001@example.com sns-tt-001@example.com

実際の命名ルールは、運用開始前に確定し、Mail Account Registryに記録する。

### 12.3 Reserved Names

以下のようなメールアドレスは、管理用または重要用途として予約する。

admin@example.com owner@example.com security@example.com recovery@example.com notify@example.com system@example.com support@example.com

予約アドレスをSNS登録用に流用しない。

## 13. One Mail Address per SNS Account Policy

Growth Lab Coreでは、1メールアドレスにつき1SNSアカウントを基本方針とする。

### 13.1 Rationale

この方針を採用する理由は以下である。

- SNSアカウントごとの通知を分離できる。

- 認証メールの確認がしやすい。

- アカウント制限時の影響範囲を限定できる。

- 復旧時に対象アカウントを特定しやすい。

- Identityとの紐付けが明確になる。

- 将来の自動化や分析に対応しやすい。

### 13.2 Policy

基本方針は以下である。

1 Mail Address     = 1 SNS Account     = 1 Identity

ただし、例外的に1つのIdentityに複数SNSアカウントを紐付ける場合は、ADRまたは下位仕様書で理由を記録する。

### 13.3 Prohibited Use

以下は禁止する。

- 1つのSNS登録用メールを複数の無関係なSNSアカウントで使い回すこと。

- 管理者用メールをSNS登録用として大量に使用すること。

- 復旧用メールを日常通知用として使い回すこと。

- テスト用メールを本番SNSアカウントに流用すること。

- 管理台帳に未登録のメールアドレスをSNS登録に使うこと。

## 14. Identity and Mail Account Relationship

Mail Accountは、Identityに紐付けて管理する。

Identity     |     +-- Mail Account     |       |     |       +-- Mail Address     |       +-- Mail Type     |       +-- Forwarding Destination     |       +-- Verification Status     |     +-- SNS Account     +-- Credential Reference     +-- OAuth Token Reference     +-- Recovery Reference     +-- Operation Log

Mail Accountは、SNSアカウントや認証情報と直接混在させない。
Identityを通じて関係を管理する。

### 14.1 Required Relationship

本番用SNSアカウントを作成する場合、以下の関係を必ず記録する。

- Identity ID

- Mail Account ID

- SNS Account ID

- Platform

- メールアドレス

- 転送先

- ステータス

- 作成日

- 最終確認日

- 復旧方法

- 管理担当者

### 14.2 Mail Account as Recovery Anchor

メールアドレスは、SNSアカウント復旧時の重要な基点になる。

そのため、以下を維持する。

- 受信可能であること。

- 転送先が有効であること。

- 管理台帳と実態が一致していること。

- 復旧に必要な情報が参照できること。

- Secretを平文で記録しないこと。

## 15. Mail Account Registry

Mail Account Registryは、メール基盤のSingle Source of Truthである。

初期段階ではGoogle SheetsまたはMarkdown台帳で管理し、将来的にはGrowth Lab Core Databaseへ移行する。

### 15.1 Required Fields

Mail Account Registryには、以下を記録する。

Mail Account ID Identity ID SNS Account ID Platform Mail Address Domain Mail Type Forwarding Destination Workspace User Flag Mailbox Flag Forwarding Flag Status Created Date Verified Date Last Checked Date Recovery Role Risk Level Owner Notes Change History

### 15.2 Registry Rules

台帳管理のルールは以下である。

- 本番利用するメールアドレスは必ず登録する。

- 未登録メールをSNS登録に使わない。

- ステータス変更時は更新する。

- 転送先変更時は更新する。

- SNSアカウント削除時も履歴を残す。

- Secret実体を記録しない。

- 復旧情報は参照先のみ記録する。

- Gmailを正本として扱わない。

### 15.3 Migration to Database

アカウント数が増えた場合、Mail Account RegistryはDatabaseへ移行する。

移行判断の目安は以下である。

- 50アカウントを超える。

- 転送設定の管理が複雑化する。

- 手動台帳の更新漏れが増える。

- KPIや通知ログとの連携が必要になる。

- 自動チェックが必要になる。

- 監査ログとの連携が必要になる。

## 16. Mail Account Lifecycle and Status

Mail Accountは、ライフサイクルとステータスを分けて管理する。

### 16.1 Lifecycle

Mail Accountは、以下のライフサイクルで管理する。

Planned   |   v Created   |   v Forwarding Configured   |   v Verified   |   v Linked to Identity   |   v Active   |   v Suspended or Retired

各段階の意味は以下である。

- Planned: 作成予定

- Created: メールアドレス作成済み

- Forwarding Configured: 転送設定済み

- Verified: 受信確認済み

- Linked to Identity: Identity紐付け済み

- Active: 本番運用中

- Suspended: 一時停止

- Retired: 運用終了

- Deleted: 削除済み

### 16.2 Status

Mail Accountには、以下のステータスを持たせる。

Planned Created Forwarding Configured Verified Linked Active Warning Suspended Retired Deleted

### 16.3 Warning Conditions

以下の場合はWarningにする。

- 転送失敗の疑いがある。

- SNS通知が届かない。

- ログイン確認メールが届かない。

- 転送先が変更された。

- 復旧情報が不明確。

- 管理台帳と実態が一致しない。

### 16.4 Suspended Conditions

以下の場合はSuspendedにする。

- 紐付くSNSアカウントが停止している。

- メール受信ができない。

- セキュリティ上の疑いがある。

- 認証情報が失効している。

- 復旧手順確認中である。

## 17. Forwarding Architecture

メール転送は、初期運用の管理効率を高めるために利用する。

SNS Registration Mail     |     v Domain Mail Server     |     v Forwarding Rule     |     v Gmail or Google Workspace Inbox     |     v Label and Search     |     v Operator Review

### 17.1 Forwarding Principles

転送方針は以下である。

- 転送先をMail Account Registryに記録する。

- 重要通知が届くことを定期確認する。

- 転送先変更時は変更履歴を残す。

- 重要メールを見逃さないようラベルやフィルタを活用する。

- 転送に依存しすぎず、必要に応じて元メールボックスも確認できる状態にする。

### 17.2 Shared Monitoring Inbox

多数のSNS通知を確認するため、共有確認用の受信先を設けることができる。

ただし、共有受信先を利用する場合も、個別メールアドレスとIdentityの紐付けは維持する。

### 17.3 Forwarding Failure Handling

転送失敗が疑われる場合は、以下を確認する。

- 元メールアドレスに受信しているか。

- 転送先が有効か。

- 転送設定が削除されていないか。

- Gmail側で迷惑メールまたはフィルタ処理されていないか。

- SNS側に登録されたメールアドレスが正しいか。

## 18. Gmail Management Policy

Gmailは、転送メールの確認、検索、ラベル管理に利用する。

### 18.1 Gmail Role

Gmailの役割は以下である。

- 転送メールの集約

- SNS通知の検索

- 認証メールの確認

- セキュリティ通知の確認

- アカウント制限通知の確認

- ラベルによる分類

- フィルタによる整理

### 18.2 Gmail Is Not the Source of Truth

Gmailは、受信確認のための運用ツールである。

以下の正本にはしない。

- Mail Account一覧

- SNS Account一覧

- Identity一覧

- 復旧情報

- 認証情報

- Secret

- OAuth Token

- TOTP Secret

これらは、Mail Account Registry、Growth Lab Core Database、Secret管理で扱う。

### 18.3 Label Policy

Gmailでは、必要に応じて以下の分類を行う。

SNS/X SNS/Instagram SNS/TikTok SNS/YouTube SNS/Facebook SNS/Threads Security Recovery Warning System

ラベル設計の詳細は、運用マニュアルで定義する。

## 19. Google Workspace Policy

Google Workspaceは、Growth Lab Coreの管理基盤として利用する。

### 19.1 Workspace Role

主な役割は以下である。

- 管理者メール

- 共有ドキュメント管理

- 仕様書管理補助

- Google Drive管理

- Google Sheetsによる初期台帳管理

- 重要通知受信

- カレンダー管理

- 権限管理

### 19.2 Cost Policy

SNS登録用メールをすべてGoogle Workspaceユーザーとして作成しない。

理由は以下である。

- アカウント数増加に比例してコストが上がる。

- 100から500アカウント規模では非効率になる。

- SNS登録用メールは必ずしも個別Workspaceユーザーである必要がない。

- 独自ドメインメールと転送で代替できる場合が多い。

### 19.3 Workspace Account Scope

Google Workspaceで作成するアカウントは、以下に限定する。

- 管理者

- オーナー

- 重要通知受信用

- 共有ドライブ管理用

- Growth Lab Core管理用

- 必要な運用担当者

SNS登録用の多数のメールアドレスは、原則としてWorkspaceユーザーではなく、独自ドメインメールまたは転送で管理する。

## 20. Rental Server Mail Policy

レンタルサーバーのメール機能は、初期の独自ドメインメール運用に利用する。

### 20.1 Role

主な役割は以下である。

- 独自ドメインメール作成

- メール転送設定

- DNS管理補助

- WordPress基盤との連携

- 初期コスト抑制

### 20.2 Selection Criteria

レンタルサーバー選定では、以下を確認する。

- WordPress運用の安定性

- メールアドレス作成数

- メール転送機能

- DNS管理機能

- バックアップ

- セキュリティ

- 管理画面の使いやすさ

- コスト

- サポート

- 将来の移行しやすさ

### 20.3 Xserver as Initial Candidate

初期候補はエックスサーバーとする。

ただし、エックスサーバーに固定するのではなく、実際の契約前または拡張前に、必要に応じて他サービスと比較する。

## 21. Mail Authentication and DNS Policy

独自ドメインメールを利用する場合、メール認証設定を適切に管理する。

### 21.1 Required DNS Areas

以下を設計対象とする。

- MX

- SPF

- DKIM

- DMARC

- CNAME

- TXT

### 21.2 DNS Management Policy

メール認証設定の方針は以下である。

- DNS変更は管理対象として記録する。

- メール送信が必要な場合は、SPF、DKIM、DMARCを確認する。

- 転送運用では、転送先での受信状況を確認する。

- DNS設定変更時は、変更理由と変更日を記録する。

- DNS情報にSecretを含めない。

- 重要なDNS変更は人間レビューを行う。

### 21.3 Deliverability

Growth Lab Coreのメール基盤は、主に受信と通知確認を目的とする。

大量配信やメールマーケティングを行う場合は、別途配信基盤を設計する。
その場合、到達率、配信停止、法令、迷惑メール対策、配信ログを別途定義する。

## 22. Security and Secret Handling

メール基盤は、SNSアカウント復旧に直結するため、厳格に管理する。

### 22.1 Key Security Rules

以下を必須とする。

- メールパスワードを平文で保存しない。

- 管理者用メールには2要素認証を設定する。

- 復旧用メールには強い認証を適用する。

- SNS登録用メールと管理者用メールを分離する。

- メール転送先をMail Account Registryに記録する。

- 不審なログイン通知を確認する。

- 退職者、担当変更時はアクセス権限を見直す。

- メールアカウント削除前にSNSとの紐付けを確認する。

### 22.2 Secret Types

以下はSecretとして扱う。

- メールパスワード

- SMTP認証情報

- IMAP認証情報

- Googleアカウント認証情報

- 復旧コード

- TOTP Secret

- App Password

- OAuth Token

Secret実体をMarkdown仕様書、通常メモ、スプレッドシート、チャット履歴に平文で記録しない。

### 22.3 Access Control

メール基盤へのアクセス権限は、役割に応じて分離する。

Owner Administrator Operator Reviewer Viewer System Role

Operatorが日常確認できる情報と、Administratorのみが変更できる情報を分離する。

## 23. TOTP and Recovery Relationship

メール基盤は、TOTPや復旧コードと密接に関係する。

### 23.1 TOTP Policy

TOTPは、2要素認証の標準候補として扱う。

メールアドレスとTOTP Secretは、同じ場所に平文保存しない。
TOTP SecretはSecret管理対象とし、Mail Account Registryには参照情報のみを記録する。

### 23.2 Recovery Code Policy

復旧コードは、Secretとして扱う。

復旧コードは、以下のように管理する。

- 平文で仕様書に記載しない。

- 通常のスプレッドシートに記載しない。

- 参照先のみを台帳に記録する。

- 利用後は更新または再発行を検討する。

- アクセス権限を限定する。

### 23.3 Recovery Workflow

復旧時は、以下の流れを基本とする。

Identify SNS Account   |   v Confirm Identity   |   v Confirm Registered Mail Account   |   v Check Mail Access   |   v Use Approved Recovery Method   |   v Record Recovery Action   |   v Update Status

復旧作業は、操作ログまたは作業履歴に記録する。

## 24. Observability and Monitoring

メール基盤では、受信、転送、通知、復旧可能性を監視対象とする。

### 24.1 Monitoring Targets

監視対象は以下である。

- メール受信状態

- メール転送状態

- 重要通知の受信状況

- SNS認証メールの到達状況

- セキュリティ通知の有無

- 転送先Gmailの受信状態

- メールアカウントのステータス

- DNS設定変更

- 管理者ログイン通知

### 24.2 Required Logs

記録対象は以下である。

- Mail Account作成履歴

- 転送設定変更履歴

- SNS登録利用履歴

- 受信確認履歴

- 復旧利用履歴

- ステータス変更履歴

- 権限変更履歴

- DNS変更履歴

- 障害対応履歴

### 24.3 Alert Conditions

以下の場合は通知または確認対象とする。

- 認証メールが届かない。

- 転送が失敗している疑いがある。

- 重要なSNS通知が届いている。

- アカウント制限通知が届いている。

- パスワードリセット通知が届いている。

- 不審なログイン通知が届いている。

- 管理者メールに異常がある。

- DNS設定が変更された。

## 25. Mail Data Model Overview

メール基盤の論理データモデルは以下である。

Identity     |     +-- Mail Account     |       |     |       +-- Mail Address     |       +-- Mail Type     |       +-- Domain     |       +-- Forwarding Setting     |       +-- Status     |       +-- Verification Log     |     +-- SNS Account     +-- Recovery Reference     +-- Credential Reference     +-- Operation Log

### 25.1 Mail Account Entity

Mail Accountは、メールアドレス単位の管理エンティティである。

### 25.2 Forwarding Setting Entity

Forwarding Settingは、転送先と転送状態を管理するエンティティである。

### 25.3 Verification Log Entity

Verification Logは、メール受信確認、転送確認、認証メール確認の履歴を管理する。

### 25.4 Recovery Reference Entity

Recovery Referenceは、復旧に必要な情報の参照先を管理する。

Secret実体は保存しない。

## 26. Scale Architecture

メール基盤は、アカウント数の増加に合わせて段階的に拡張する。

### 26.1 Scale Stages

Stage 1: 1から20メールアドレス Stage 2: 21から50メールアドレス Stage 3: 51から100メールアドレス Stage 4: 101から300メールアドレス Stage 5: 301から500メールアドレス

### 26.2 Stage 1: 1から20メールアドレス

初期段階では、以下を基本とする。

- 独自ドメインメール

- レンタルサーバーメール

- Gmail転送

- Google SheetsまたはMarkdown台帳

- 手動確認

- 重要メールの人間確認

### 26.3 Stage 2: 21から50メールアドレス

以下を追加検討する。

- 命名ルールの厳格化

- Gmailラベル設計

- 転送設定チェック

- 定期受信確認

- Mail Account Registryの整備

### 26.4 Stage 3: 51から100メールアドレス

以下を追加検討する。

- Database管理

- 自動受信確認

- 通知分類

- ステータス管理

- 変更履歴管理

- 権限管理強化

### 26.5 Stage 4: 101から300メールアドレス

以下を追加検討する。

- 自動監視

- 転送失敗検知

- アカウント状態連携

- セキュリティアラート

- 管理ダッシュボード

### 26.6 Stage 5: 301から500メールアドレス

以下を追加検討する。

- メール基盤の分散

- ドメイン分離

- リスク分離

- 自動棚卸し

- 監査ログ強化

- 復旧手順の標準化

## 27. Mail Scale Gate

次のメール運用Stageへ進む前に、Mail Scale Gate Reviewを行う。

```text
Mail Scale Gate Review

- 現在のメールアドレス数

- 未登録メールアドレスの有無

- Identityとの紐付け状況

- SNS Accountとの紐付け状況

- 転送成功率

- 重要通知の確認漏れ

- 復旧可能性

- Mail Account Registryの更新状況

- セキュリティ状態

- コスト

- 運用担当者の負荷

- 次Stageへ進む必要性
```

Mail Scale Gateを通過できない場合は、メールアドレスを増やさず、既存の管理精度を改善する。

---

## 28. Cost Optimization

メール基盤では、初期コストと将来拡張コストのバランスを取る。

### 28.1 Cost Principles

コスト方針は以下である。

- 初期段階では過剰投資を避ける。
- Google Workspaceユーザー数を必要最小限にする。
- SNS登録用メールは独自ドメインメールと転送で管理する。
- アカウント数増加に伴う月額費用を確認する。
- 管理負荷が高くなった場合は自動化に投資する。
- 低コストでも復旧不能になる構成は避ける。

### 28.2 Cost Items

確認すべき費用項目は以下である。

- 独自ドメイン費用
- レンタルサーバー費用
- Google Workspace費用
- メール転送管理コスト
- Gmail管理コスト
- Secret管理コスト
- 監視コスト
- 人的運用コスト
- 障害対応コスト

### 28.3 Cost Risk

安さだけを優先すると、以下のリスクがある。

- 復旧できない。
- メールが届かない。
- 転送先が不明になる。
- アカウント管理が破綻する。
- セキュリティリスクが増える。
- 拡張時に移行コストが高くなる。

---

## 29. Compliance and Platform Policy

メール基盤は、各SNS、Google、レンタルサーバー、ドメイン管理会社の利用規約に従う。

### 29.1 Compliance Rules

以下を守る。

- 各サービスの利用規約を確認する。
- 不正利用と誤認される運用を避ける。
- 認証制限を回避する目的でメールを乱用しない。
- メールアドレスの大量作成は管理可能な範囲で行う。
- アカウント作成、認証、復旧は正当な目的で行う。
- 通知メールを無視しない。
- 重要な利用規約変更は確認する。

### 29.2 Prohibited Actions

以下は禁止する。

- 管理できない数のメールアドレスを作成すること。
- SNSアカウント停止回避を目的にメールを使い捨てること。
- 復旧不能なメールアドレスでSNS登録すること。
- 受信できないメールアドレスを本番利用すること。
- 転送先不明のメールアドレスを運用すること。
- Secretをメール本文や下書きに保存すること。

---

## 30. Operations Policy

メール基盤の日常運用では、以下を行う。

### 30.1 Regular Checks

定期確認項目は以下である。

- 新規メールアドレスの登録状況
- SNSアカウントとの紐付け状況
- Identityとの紐付け状況
- 転送設定
- 重要通知
- セキュリティ通知
- 復旧可能性
- Mail Account Registry更新状況
- 不要メールアドレス
- リスク状態

### 30.2 Change Management

以下の変更は記録する。

- メールアドレス作成
- メールアドレス削除
- 転送先変更
- SNSアカウント紐付け変更
- Identity紐付け変更
- 復旧情報変更
- 権限変更
- DNS変更

### 30.3 Account Retirement

メールアドレスを廃止する場合は、以下を確認する。

- 紐付くSNSアカウントがないか。
- 復旧用途に使われていないか。
- 重要通知が届いていないか。
- ログが保存されているか。
- Mail Account Registryが更新されているか。
- 必要な保管期間を満たしているか。

---

## 31. Incident Handling

メール基盤で障害や異常が発生した場合、以下の流れで対応する。

```text
Detect
  |
  v
Identify Mail Account
  |
  v
Identify Related Identity
  |
  v
Identify Related SNS Account
  |
  v
Check Forwarding and Inbox
  |
  v
Mitigate
  |
  v
Record Incident
  |
  v
Update Status
```

### 31.1 Common Incidents

想定される異常は以下である。

- 認証メールが届かない。

- 転送されない。

- Gmail側で見つからない。

- SNS登録メールが不明。

- 復旧メールにアクセスできない。

- Mail Account Registryに登録がない。

- 転送先が退職者または無効アカウントになっている。

- 不審なログイン通知が届いている。

- パスワードリセット通知が届いている。

### 31.2 Incident Records

障害対応では、以下を記録する。

- 発生日

- 対象Mail Account

- 対象Identity

- 対象SNS Account

- 発生内容

- 原因

- 対応内容

- 復旧結果

- 再発防止策

- 担当者

## 32. Integration with Other Chapters

本章は、以下の章と連携する。

### 32.1 02 Overall Architecture

メール基盤は、Growth Lab Core全体アーキテクチャのExternal Service Layer、Integration Layer、Identity Management、Security Boundaryに関係する。

### 32.2 04 SNS Platform

SNSアカウント作成、通知、認証、復旧において、Mail AccountとSNS Accountを紐付ける。

### 32.3 08 Database

Mail Account Registryは、将来的にDatabaseへ移行する。

### 32.4 09 API and OAuth

Google API、Gmail連携、OAuth、通知取得などを扱う場合に連携する。

### 32.5 10 Security

メールパスワード、TOTP、復旧コード、OAuth Token、アクセス権限を扱う。

### 32.6 11 Operations

メールアカウント作成、確認、棚卸し、復旧、削除の運用手順を扱う。

### 32.7 12 Analytics and KPI

メール通知、SNSアカウント状態、復旧頻度、確認漏れなどをKPIまたは運用指標として扱う。

## 33. Chapter Responsibility Boundary

本章では、メール基盤の上位設計を定義する。

詳細設計は、以下の章または下位文書で定義する。

03 Mail Platform     |     +-- Defines:     |       +-- Mail architecture     |       +-- Mail account policy     |       +-- Registry policy     |       +-- Forwarding policy     |       +-- Scale policy     |     +-- Does not define:             +-- Detailed Gmail operation             +-- Detailed DNS values             +-- Detailed Google Workspace setup             +-- Detailed rental server operation             +-- Detailed security tool selection             +-- Detailed database table design

詳細な手順は、Operations Manual、Security章、Database章、API and OAuth章で定義する。

## 34. Architecture Constraints

メール基盤では、以下の制約を前提とする。

- 独自ドメインを利用する。

- 1メールアドレスにつき1SNSアカウントを基本とする。

- Google Workspaceは管理基盤として利用する。

- SNS登録用メールをすべてWorkspaceユーザーにしない。

- 初期段階ではレンタルサーバーメールと転送を活用する。

- Gmailは確認用の集約先として利用する。

- Gmailを正本管理台帳にしない。

- Mail Account Registryを正本とする。

- Secretを平文保存しない。

- 復旧用メールを厳格に管理する。

- メールアドレス削除前にSNSとの紐付けを確認する。

- アカウント数拡張前にMail Scale Gate Reviewを行う。

## 35. Risks

本章に関連する主なリスクは以下である。

### 35.1 Risk: メールアドレス管理の破綻

メールアドレス数が増え、どのSNSアカウントに紐付いているか分からなくなる可能性がある。

軽減策：

- Mail Account Registryを作成する。

- Identityと紐付ける。

- 命名ルールを統一する。

- 未登録メールを使用しない。

### 35.2 Risk: 転送失敗

メールが転送されず、重要通知を見逃す可能性がある。

軽減策：

- 転送テストを行う。

- 定期的に受信確認する。

- 元メールボックスも確認可能にする。

- 転送先変更履歴を残す。

### 35.3 Risk: 復旧不能

SNSアカウントの復旧に必要なメールへアクセスできない可能性がある。

軽減策：

- 復旧用メールを分離する。

- 復旧情報を参照管理する。

- 2要素認証を設定する。

- メールアドレス削除前に復旧用途を確認する。

### 35.4 Risk: コスト増大

SNS登録用メールをGoogle Workspaceユーザーとして大量作成すると、コストが増大する。

軽減策：

- SNS登録用メールは独自ドメインメールと転送で管理する。

- Workspaceユーザーは管理者や中核用途に限定する。

- Stageごとにコスト確認を行う。

### 35.5 Risk: セキュリティ事故

管理者メールや復旧用メールが侵害されると、SNSアカウント全体に影響する可能性がある。

軽減策：

- 管理者用メールとSNS登録用メールを分離する。

- 2要素認証を設定する。

- Secretを平文保存しない。

- アクセス権限を制限する。

- 監査ログを記録する。

### 35.6 Risk: Gmail依存

Gmail転送に依存しすぎると、転送失敗やフィルタ処理に気付けない可能性がある。

軽減策：

- Gmailを正本にしない。

- Mail Account Registryを正本にする。

- 元メールボックス確認手段を維持する。

- 重要メールの確認ルールを作る。

## 36. Required Review Checklist

本章またはメール基盤を更新する場合は、以下を確認する。

```text
Mail Platform Review Checklist

- 独自ドメインメールの方針が明確か

- Google Workspaceの役割が明確か

- Gmail転送の役割が明確か

- レンタルサーバーメールの役割が明確か

- 1メールアドレスにつき1SNSアカウントの方針が明確か

- Mail AccountとIdentityの関係が明確か

- Mail AccountとSNS Accountの関係が明確か

- Mail Account Registryが正本として定義されているか

- メールアドレス命名ルールが定義されているか

- 転送先管理が定義されているか

- 復旧用メールの扱いが定義されているか

- TOTPと復旧コードの扱いが定義されているか

- Secretを平文保存しない方針が明確か

- Gmailを正本にしない方針が明確か

- Google Workspaceコスト最適化方針が明確か

- 20から100から500アカウントへの拡張方針が明確か

- Mail Scale Gateが定義されているか

- メール障害時の対応方針が定義されているか

- 下位章との責任分担が明確か

- ADRが必要な判断が整理されているか
```

---

## 37. Review Points

本章のレビューでは、以下を確認する。

- メール基盤がSNS運用OSの中核として定義されているか。
- 独自ドメインメール、Gmail、Google Workspace、レンタルサーバーの役割分担が明確か。
- 1メールアドレスにつき1SNSアカウントの方針が運用しやすい形で定義されているか。
- Identity中心設計と矛盾していないか。
- Google Workspaceを使いすぎてコスト過多にならない設計か。
- Gmail転送に依存しすぎていないか。
- 復旧可能性が確保されているか。
- Secret管理がSecurity章へ接続できる内容になっているか。
- Mail Account RegistryがDatabase章へ展開しやすい内容になっているか。
- 20アカウントから100から500アカウントへ拡張できるか。
- メール基盤のリスクと軽減策が十分か。
- Codex反映時に章構成が崩れにくい構成になっているか。

---

## 38. Architecture Decision Records

本章に関連するADRは以下の通りである。

```text
Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core
```

本章に関連して、今後追加が想定されるADRは以下である。

```text
ADR-0005: Core Architecture Principles
ADR-0011: Identity-Centric Architecture
ADR-0018: Mail Platform Architecture
ADR-0019: One Mail Address per SNS Account Policy
ADR-0020: Google Workspace Scope Policy
ADR-0021: Independent Domain Mail and Forwarding Policy
ADR-0022: Mail Account Registry Policy
ADR-0023: Mail Recovery and TOTP Relationship Policy
ADR-0024: Mail Scale Gate Policy
```

以下の判断を変更する場合は、ADR作成を検討する。

- 1メールアドレスにつき1SNSアカウント方針の変更

- Google Workspace利用範囲の拡大

- SNS登録用メールの管理方式変更

- 独自ドメインまたはサブドメイン構成の変更

- Gmail転送中心運用から別方式への移行

- Mail Account Registryの正本変更

- 復旧用メール管理方式の変更
