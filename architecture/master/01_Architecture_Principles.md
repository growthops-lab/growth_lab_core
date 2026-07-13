# 01 Architecture Principles

Document Name: Growth Lab Core Master Architecture Specification
Japanese Name: SNS運用基盤設計書 Ver.1.0
Version: 1.0 Draft
Status: Draft
Primary Format: Markdown
Target File: architecture/master/01_Architecture_Principles.md

## 1. Purpose

本章の目的は、Growth Lab Core 全体に適用するアーキテクチャ原則を定義することである。

Growth Lab Core は、AIを活用したメディア運営プラットフォームであり、SNS、メール、WordPress、分析、AI、自動化、セキュリティ、運用管理を統合する「SNS運用OS」として設計する。

本章で定義するアーキテクチャ原則は、以下の判断に使用する。

- Growth Lab Core の基本設計

- SNS運用基盤の設計

- メール基盤の設計

- WordPress・アフィリエイトブログ基盤の設計

- AI運用基盤の設計

- データベース設計

- API・OAuth設計

- セキュリティ設計

- アカウント管理設計

- 運用マニュアル作成

- Codex / Claude Code への実装指示

- 将来拡張時の判断

- 仕様変更時のADR作成

本章は、Growth Lab Core の設計思想を統一し、長期運用、段階的拡張、規約遵守、セキュリティ、コスト最適化、継続的改善を両立するための基準である。

## 2. Scope

本章の適用範囲は、Growth Lab Core に関連するすべての設計、実装、運用、改善活動である。

対象範囲は以下を含む。

- Growth Lab Core 本体システム

- SNS運用基盤

- メール基盤

- WordPress・アフィリエイトブログ基盤

- AI生成・AI分析・AI改善基盤

- データベース

- API連携

- OAuth認証

- セキュリティ・認証・権限管理

- 監査ログ・モニタリング

- KPI分析

- アカウントライフサイクル管理

- Codex作業指示書

- Claude Code作業指示書

- 運用マニュアル

- 下位仕様書

- ADR

本章の原則は、下位仕様書、実装仕様書、運用マニュアルより優先される。

ただし、本章の原則を変更または例外適用する必要がある場合は、必ずADRを作成し、理由、影響範囲、リスク、見直し条件を記録する。

## 3. Background

Growth Lab Core は、単なるSNS投稿管理ツールではない。

Growth Lab Core は、SNS、メール、WordPress、AI、分析、KPI、スケジューラー、データベース、監視、改善ループを統合する、AIを活用したメディア運営プラットフォームである。

このプロジェクトでは、初期段階では20アカウント規模のSNS運用基盤を構築する。ただし、将来的には必要に応じて100から500アカウント規模への拡張も想定する。

一方で、アカウント数を増やすほど、以下のリスクが増加する。

- 管理コストの増加

- セキュリティリスクの増加

- 運用ミスの増加

- 各SNSプラットフォームの利用規約違反リスク

- API制限や認証制限の影響

- アカウント停止時の影響範囲拡大

- 監査・復旧作業の複雑化

- AIや自動化による誤操作リスク

そのため、Growth Lab Core では、単純にアカウント数を増やすのではなく、KPI、ROI、運用負荷、セキュリティ、規約遵守、停止リスクを総合的に分析し、最適なアカウント数と運用方式を判断する必要がある。

本章のアーキテクチャ原則は、このような長期運用と段階的拡張を前提として定義する。

## 4. Principle Language

本仕様書では、設計判断の強制力を明確にするため、以下の表現を使用する。

| Term | Meaning |
| --- | --- |
| 必須 | 必ず守る必要がある。例外はADRで明示する。 |
| 原則 | 標準方針として採用する。例外は理由を記録する。 |
| 推奨 | 可能な限り採用する。採用しない場合は理由を残す。 |
| 許可 | 条件を満たす場合に採用してよい。 |
| 禁止 | 採用してはならない。例外は原則として認めない。 |

Codex、Claude Code、人間の実装者は、本章の「必須」「禁止」に反する変更を行ってはならない。

例外が必要な場合は、必ず事前にADRを作成し、理由、影響範囲、リスク、見直し条件を記録する。

## 5. Architecture Principles Overview

Growth Lab Core では、以下の10原則を中核アーキテクチャ原則として採用する。

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

これらの原則は、すべての章、下位仕様書、実装、運用、改善活動に適用する。

原則間で判断が衝突する場合は、以下の優先順位を基本とする。

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

この優先順位は、短期的な効率よりも、長期運用、規約遵守、セキュリティ、保守性を優先するために設定する。

ただし、実際の判断では、影響範囲、リスク、運用負荷、将来拡張性を総合的に確認し、必要に応じてADRを作成する。

## 6. AP-01 Compliance First

### 6.1 Definition

Compliance First とは、各SNS、メールサービス、Google Workspace、レンタルサーバー、WordPress、AIサービス、APIサービスの利用規約、API利用条件、法令、セキュリティ要件を最優先にする原則である。

Growth Lab Core は、自動化やAI活用を前提とするが、すべての自動化は、各サービスが公式に許容する範囲で実施する。

### 6.2 Policy

以下を必須とする。

- 各SNSの利用規約を遵守する。

- 各SNSのAPI利用条件を遵守する。

- メールサービスの利用規約を遵守する。

- Google Workspaceの利用条件を遵守する。

- WordPress、レンタルサーバー、アフィリエイトASPの利用条件を遵守する。

- 個人情報、認証情報、ログ、トークンを適切に管理する。

- サービス側が禁止する自動操作、回避行為、過剰アクセスを行わない。

- 規約変更が発生した場合は、関連章を見直す。

### 6.3 Prohibited Practices

以下は禁止する。

- 公式に禁止されている自動化。

- アクセス制限や認証制限の回避。

- アカウント停止リスクを意図的に高める運用。

- SNSプラットフォームの信頼性を損なう行為。

- メールサービスやSNSの不正利用と判断される可能性が高い行為。

- 規約確認を行わないまま大規模な自動化を実施すること。

- API制限を回避するための不自然な分散アクセス。

- 認証情報やトークンを安全でない場所へ保存すること。

### 6.4 Design Implications

Compliance First により、Growth Lab Core では以下の設計を採用する。

- 公式APIとOAuthを優先する。

- 利用規約やAPI仕様の変更を確認できる運用を設計する。

- 自動化対象を明確に定義する。

- 投稿、取得、分析、通知などの機能ごとに許可範囲を確認する。

- アカウント数をKPIだけでなくリスク面からも最適化する。

- 規約変更時に運用を停止または縮小できる仕組みを持つ。

### 6.5 Review Questions

- この設計は対象サービスの利用規約に反していないか。

- API利用条件を満たしているか。

- 自動化の範囲は公式に許容される範囲か。

- 規約変更時に停止・修正できるか。

- リスクが高い運用を前提にしていないか。

## 7. AP-02 API First

### 7.1 Definition

API First とは、Growth Lab Core と外部サービスの連携において、公式API、OAuth、Webhook、公式SDKなど、正式に提供された連携方法を優先する原則である。

ブラウザ操作の自動化や非公式な連携方法は、公式APIで代替できない場合に限定し、利用規約やリスクを確認した上で慎重に扱う。

### 7.2 Policy

以下を原則とする。

- SNS連携は公式APIを優先する。

- 認証はOAuthを優先する。

- メール連携は公式API、IMAP、SMTP、OAuth対応方式を優先する。

- WordPress連携はWordPress REST APIを優先する。

- 分析データ取得は公式APIまたは公式エクスポート機能を優先する。

- Webhookが利用可能な場合は、ポーリングよりWebhookを優先する。

- 非公式な取得や操作は原則として採用しない。

### 7.3 API Selection Criteria

APIを採用する際は、以下を確認する。

- 公式に提供されているか。

- 利用規約に適合しているか。

- OAuthや安全な認証に対応しているか。

- レート制限が明確か。

- 必要な機能を満たしているか。

- エラー時の復旧方法が明確か。

- 長期的な継続性があるか。

- 監査ログを残せるか。

### 7.4 Design Implications

API First により、Growth Lab Core では以下の設計を採用する。

- 外部サービス連携はIntegration Layerで管理する。

- APIキー、OAuthトークン、Refresh Tokenは安全に管理する。

- レート制限、認証失敗、API停止を前提に設計する。

- API仕様変更に備え、連携部分を疎結合にする。

- 外部APIごとにログ、エラー、再試行、停止条件を定義する。

- API利用状況をObservabilityの対象に含める。

### 7.5 Review Questions

- 公式APIを利用しているか。

- OAuthに対応しているか。

- API制限に対応できるか。

- 非公式な連携方法に依存していないか。

- API変更時に影響範囲を限定できるか。

## 8. AP-03 Security by Design

### 8.1 Definition

Security by Design とは、Growth Lab Core の設計段階からセキュリティを組み込み、後付けの対策に依存しない原則である。

Growth Lab Core は、メールアドレス、SNSアカウント、認証情報、OAuthトークン、APIキー、投稿履歴、分析データなどを扱うため、セキュリティを最優先の設計要件として扱う。

### 8.2 Policy

以下を必須とする。

- 最小権限の原則を採用する。

- 認証情報を平文で保存しない。

- APIキー、OAuthトークン、TOTPシークレットは安全に管理する。

- アカウント、メール、SNS、APIトークンをIdentity単位で管理する。

- 2要素認証を標準化する。

- 認証失敗、アクセス異常、トークン失効を検知できるようにする。

- バックアップと復旧手順を定義する。

- アクセス権限を役割ごとに分離する。

- セキュリティ変更はADRまたは関連章に記録する。

### 8.3 Authentication Policy

認証方式は、以下の方針とする。

- 公式APIやOAuthが利用できる場合は最優先で採用する。

- 2要素認証はTOTPを標準候補とする。

- パスキーは対応サービスごとに運用性を確認した上で採用する。

- パスキーを一律標準とはせず、サービスごとの対応状況、Growth Lab Coreとの連携方式、復旧性を確認する。

- SMS認証は、可能な限り補助的な方式として扱う。

- 復旧方法を必ず記録する。

### 8.4 Secret Management

以下の情報はSecretとして扱う。

- パスワード

- APIキー

- OAuth Client Secret

- OAuth Access Token

- OAuth Refresh Token

- TOTP Secret

- Recovery Code

- Cookie

- Session

- Database Credential

- SMTP Credential

- WordPress Application Password

Secretは、ソースコード、Markdown仕様書、運用メモ、共有ドキュメントに平文で記載しない。

Secretの実体は、安全なSecret管理方式で管理し、仕様書や台帳には参照情報のみを記録する。

### 8.5 Design Implications

Security by Design により、Growth Lab Core では以下の設計を採用する。

- Identity管理を中心に設計する。

- 認証情報は専用のSecret管理方式を採用する。

- アクセスログと操作ログを記録する。

- アカウント停止、認証失敗、権限不足を検知する。

- 復旧手順を運用マニュアル化する。

- 権限は管理者、運用者、閲覧者、AI実行権限などに分離する。

### 8.6 Review Questions

- 認証情報は安全に管理されているか。

- 最小権限になっているか。

- トークン失効時の復旧方法はあるか。

- アカウント停止時の影響範囲は限定されているか。

- Secretが仕様書やコードに平文保存されていないか。

## 9. AP-04 AI First

### 9.1 Definition

AI First とは、Growth Lab Core の設計において、AIによる生成、分析、改善、判断支援を前提とする原則である。

ただし、AI First は、AIにすべてを無制限に任せることを意味しない。AIは、人間の判断、規約遵守、セキュリティ、運用ルールを補助する存在として設計する。

### 9.2 Policy

以下を原則とする。

- 投稿案、画像案、改善案、分析案の生成にAIを活用する。

- KPI分析、ABテスト分析、改善提案にAIを活用する。

- アカウント数の最適化判断にAIを活用する。

- 異常検知、エラー分析、運用改善にAIを活用する。

- AIの出力は必要に応じて人間がレビューする。

- AIが利用規約やセキュリティ方針に反する提案を実行しないようにする。

- AIの判断根拠をログまたは分析結果として残す。

### 9.3 AI Use Cases

Growth Lab Core で想定するAI活用は以下である。

- SNS投稿案の生成

- 投稿テーマの設計

- 投稿スケジュール案の作成

- 画像・動画アイデアの生成

- WordPress記事構成案の作成

- アフィリエイト導線の改善提案

- KPI分析

- 投稿効果測定

- アカウント運用改善提案

- リスク検知

- 障害原因の分析補助

- 運用マニュアル改善

- Codex / Claude Code 作業指示書の作成支援

### 9.4 Human Review Policy

AIの出力は、以下の場合に人間レビューを必須とする。

- 新しい運用方針を決める場合。

- アカウント作成・削除・停止に関わる場合。

- 外部公開コンテンツのブランド毀損リスクがある場合。

- 法令、利用規約、広告表現、アフィリエイト規約に関わる場合。

- 認証情報、セキュリティ、権限変更に関わる場合。

- 大規模な自動投稿や一括変更に関わる場合。

### 9.5 Design Implications

AI First により、Growth Lab Core では以下の設計を採用する。

- AI Engine を中核コンポーネントとして設計する。

- AI出力と人間承認の状態を管理する。

- AI提案、採用、却下、修正の履歴を記録する。

- AIに渡すデータは必要最小限にする。

- AIが参照する仕様書をMarkdown正本に統一する。

- AI生成物と公開済みコンテンツを区別する。

### 9.6 Review Questions

- AIに任せる範囲は明確か。

- 人間レビューが必要な範囲は定義されているか。

- AI出力の根拠や履歴は残るか。

- AIが規約違反やセキュリティ違反につながる操作をしないか。

- AIが古い仕様書を参照しないようになっているか。

## 10. AP-05 Automation First

### 10.1 Definition

Automation First とは、反復作業、定型作業、データ取得、レポート生成、監視、通知、改善提案を自動化前提で設計する原則である。

ただし、自動化はCompliance First、Security by Design、API First の範囲内で実施する。

### 10.2 Policy

以下を原則とする。

- 手作業で繰り返す処理は自動化候補とする。

- 自動化は公式API、OAuth、Webhookを優先する。

- 自動化ログを記録する。

- 自動化失敗時の復旧手順を定義する。

- 自動化対象と人間承認対象を分離する。

- アカウント、投稿、分析、メール確認、レポート生成をモジュール化する。

- 自動化の停止条件を定義する。

### 10.3 Automation Candidates

自動化候補は以下である。

- 投稿スケジュール管理

- 投稿案生成

- 投稿予約

- KPI収集

- レポート生成

- メール通知確認

- アカウント状態確認

- APIエラー監視

- WordPress記事下書き作成

- アフィリエイトリンク管理補助

- CHANGELOG更新補助

- MarkdownからWord/PDFへの出力

- バックアップ作成

- 仕様書構成チェック

### 10.4 Required Safeguards

自動化には以下の安全対策を必須とする。

- 実行ログ

- エラーログ

- リトライ制限

- 停止条件

- 手動停止手段

- 権限分離

- 認証失敗時の停止

- API制限到達時の停止または待機

- 大量処理時の事前確認

- 人間承認フロー

### 10.5 Design Implications

Automation First により、Growth Lab Core では以下の設計を採用する。

- Schedulerを独立コンポーネントとして設計する。

- Queueを用いて処理を分散する。

- 自動処理は状態管理する。

- 失敗時に再実行可能な設計にする。

- 処理単位を小さくし、影響範囲を限定する。

- 監視と通知を標準装備する。

### 10.6 Review Questions

- 自動化対象は明確か。

- 自動化が規約に適合しているか。

- 失敗時に停止できるか。

- 人間承認が必要な処理を自動実行していないか。

- ログと復旧手順があるか。

## 11. AP-06 Scalability

### 11.1 Definition

Scalability とは、Growth Lab Core が初期20アカウント規模から、必要に応じて100から500アカウント規模へ段階的に拡張できるように設計する原則である。

ただし、Scalability は無制限にアカウント数を増やすことを意味しない。アカウント数は、KPI、ROI、運用負荷、リスクを基に最適化する。

### 11.2 Policy

以下を原則とする。

- 初期構築は20アカウント規模を前提とする。

- 設計は100から500アカウント規模まで拡張可能にする。

- アカウント数の増加はKPIとリスク分析に基づいて判断する。

- 1メールアドレスにつき1SNSアカウントを基本とする。

- Identity単位でメール、SNS、認証、API、状態を管理する。

- 拡張時に既存構造を大きく作り直さない設計にする。

- アカウントが増えても監査、ログ、復旧が可能な構造にする。

### 11.3 Scale Stages

Growth Lab Core の拡張段階は以下を基本とする。

Stage 1: 1から20アカウント
Stage 2: 21から50アカウント
Stage 3: 51から100アカウント
Stage 4: 101から300アカウント
Stage 5: 301から500アカウント

各Stageへ進む前に、以下を確認する。

- KPIは改善しているか。

- 運用負荷は許容範囲か。

- アカウント停止リスクは管理できるか。

- メール基盤は対応できるか。

- API制限に対応できるか。

- セキュリティ管理は維持できるか。

- コストに対する効果はあるか。

### 11.4 Design Implications

Scalability により、Growth Lab Core では以下の設計を採用する。

- Identityモデルを中核にする。

- Account、Mail、SNS、Credential、Token、Post、Analyticsを分離して管理する。

- アカウントごとの状態を管理する。

- アカウント追加・停止・休止・削除のライフサイクルを定義する。

- 拡張時のコストとリスクを可視化する。

- 大規模化しても一括管理できるダッシュボードを想定する。

### 11.5 Review Questions

- 20アカウントから100アカウントへ拡張できるか。

- 100アカウントから500アカウントへ拡張できるか。

- アカウント数を増やす判断基準はあるか。

- 管理コストが増えすぎないか。

- セキュリティと監査を維持できるか。

## 12. AP-07 Observability

### 12.1 Definition

Observability とは、Growth Lab Core の状態、処理結果、エラー、認証、API利用状況、投稿結果、KPI、アカウント状態を可視化し、問題発生時に原因を追跡できるようにする原則である。

### 12.2 Policy

以下を必須とする。

- 重要な操作ログを記録する。

- API呼び出し結果を記録する。

- 認証失敗を記録する。

- 自動化処理の成功・失敗を記録する。

- 投稿結果を記録する。

- KPIデータを履歴として管理する。

- アカウント状態を管理する。

- エラー時に原因調査できる情報を残す。

- 重要な異常は通知する。

### 12.3 Required Logs

最低限、以下のログを設計対象とする。

- System Log

- API Log

- Auth Log

- Automation Log

- Scheduler Log

- SNS Account Log

- Mail Log

- Post Log

- Analytics Log

- Error Log

- Security Log

- Audit Log

### 12.4 Design Implications

Observability により、Growth Lab Core では以下の設計を採用する。

- ログ設計を初期段階から行う。

- 操作主体を記録する。

- AIによる操作、人間による操作、Codex / Claude Codeによる作業を区別する。

- エラーコード、対象アカウント、対象API、発生時刻を記録する。

- ダッシュボードで状態を確認できる設計にする。

- 障害時に運用マニュアルへ接続できるようにする。

### 12.5 Review Questions

- 問題発生時に原因を追跡できるか。

- 誰が何を実行したか分かるか。

- APIエラーや認証エラーを検知できるか。

- アカウント状態を把握できるか。

- KPI変化を履歴で確認できるか。

## 13. AP-08 Cost Optimization

### 13.1 Definition

Cost Optimization とは、初期コスト、運用コスト、拡張コスト、AI利用コスト、API利用コスト、人的コストを継続的に最適化する原則である。

Growth Lab Core は、初期段階ではコストを抑えながら構築し、効果が確認できた領域へ段階的に投資する。

### 13.2 Policy

以下を原則とする。

- 初期構築では過剰投資を避ける。

- Google Workspaceは管理基盤として活用する。

- SNS用メールは独自ドメインと転送を活用し、コストを抑える。

- WordPressはエックスサーバーを第一候補とし、必要に応じて他サービスを比較する。

- AI利用コストはKPIとROIを基に管理する。

- アカウント数は成果とリスクを基に最適化する。

- 有料サービス導入時は採用理由を記録する。

- 長期的なTCOを確認する。

### 13.3 Cost Evaluation Items

費用評価では以下を確認する。

- Google Workspace費用

- レンタルサーバー費用

- 独自ドメイン費用

- メール管理費用

- SNS API費用

- AI API費用

- 画像生成・動画生成費用

- ストレージ費用

- バックアップ費用

- 監視ツール費用

- 人的運用コスト

- 障害対応コスト

### 13.4 Design Implications

Cost Optimization により、Growth Lab Core では以下の設計を採用する。

- Phase 1では20アカウント規模で検証する。

- 初期投資を抑え、成果を見ながら拡張する。

- 無駄なアカウント増加を避ける。

- メール、SNS、AI、WordPressの費用を分離して管理する。

- KPIとコストを紐付けて分析する。

- 低コスト構成から高可用性構成へ段階的に移行できるようにする。

### 13.5 Review Questions

- 初期コストを抑えられているか。

- 将来拡張時のコストが見えているか。

- アカウント数と成果のバランスは適切か。

- 有料サービスを採用する理由は明確か。

- ROIとTCOを確認できるか。

## 14. AP-09 Single Source of Truth

### 14.1 Definition

Single Source of Truth とは、Growth Lab Core に関する仕様、設定、設計判断、アカウント情報、状態情報、運用ルールを一元管理し、複数の矛盾した情報源を作らない原則である。

本仕様書におけるSingle Source of Truthは、文書面ではGrowth Lab Core Master Architecture Specification、データ面ではGrowth Lab Coreの管理データベースを意味する。

### 14.2 Policy

以下を必須とする。

- 設計判断は本仕様書またはADRに記録する。

- Markdownを正本とする。

- Word/PDFは二次成果物とする。

- アカウント情報は台帳またはDBで一元管理する。

- 認証情報の実体は安全なSecret管理へ分離する。

- SNSアカウント、メールアドレス、Identity、投稿、KPIを紐付けて管理する。

- 複数の場所に矛盾する情報を残さない。

- 更新時は関連ファイルとの整合性を確認する。

### 14.3 Data Domains

一元管理すべき主なデータ領域は以下である。

- Identity

- Mail Account

- SNS Account

- Credential Reference

- OAuth Token Reference

- WordPress Site

- Campaign

- Post

- Media

- Schedule

- Analytics

- KPI

- Error

- Audit Log

- ADR

- Changelog

### 14.4 Design Implications

Single Source of Truth により、Growth Lab Core では以下の設計を採用する。

- Markdown仕様書を正本にする。

- アカウント管理情報を統一する。

- 管理台帳とDBの関係を明確にする。

- Secretの保存先を仕様書や台帳から分離する。

- 同じ情報を複数箇所で手動管理しない。

- Codex / Claude Code の参照先を明示する。

### 14.5 Review Questions

- 正本は明確か。

- 同じ情報が複数の場所で矛盾していないか。

- CodexやClaude Codeが正しいファイルを参照できるか。

- アカウント情報とIdentityが紐付いているか。

- Word/PDFが正本扱いになっていないか。

## 15. AP-10 Continuous Improvement

### 15.1 Definition

Continuous Improvement とは、Growth Lab Core が運用データ、KPI、AI分析、失敗履歴、成功パターンをもとに継続的に改善される設計にする原則である。

Growth Lab Core は、一度構築して完了するシステムではない。SNS、AI、検索、アフィリエイト、メール、WordPressの環境変化に合わせて継続的に改善する。

### 15.2 Policy

以下を原則とする。

- KPIを定期的に分析する。

- 投稿結果を改善に反映する。

- アカウントごとの成果を評価する。

- 成果の低い運用は見直す。

- 成果の高い運用は横展開する。

- 仕様書、ADR、運用マニュアルを継続的に更新する。

- AIによる改善提案を活用する。

- ただし、重要な設計変更は人間レビューとADRを通す。

### 15.3 Improvement Cycle

Growth Lab Core の改善サイクルは以下を基本とする。

Plan
  |
  v
Create
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
Document

改善結果は、仕様書、運用マニュアル、設定、AIプロンプト、投稿設計、KPI設計へ反映する。

### 15.4 Design Implications

Continuous Improvement により、Growth Lab Core では以下の設計を採用する。

- KPIを時系列で保存する。

- 改善提案を記録する。

- ABテスト結果を管理する。

- 投稿テンプレートを改善可能にする。

- AIプロンプトを管理する。

- 変更履歴を残す。

- 成功事例と失敗事例を学習資産化する。

### 15.5 Review Questions

- 改善サイクルが設計に組み込まれているか。

- KPIが改善判断に使えるか。

- AI提案の採用・却下理由が残るか。

- 成功パターンを再利用できるか。

- 仕様書と運用が継続的に更新されるか。

## 16. Cross-Principle Priority

各原則は相互に関連する。ただし、実務上は原則同士が衝突する場合がある。

例えば、Automation First と Compliance First が衝突する場合、自動化よりもCompliance Firstを優先する。
Cost Optimization と Security by Design が衝突する場合、コスト削減よりもSecurity by Designを優先する。

優先順位の基本は以下である。

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

この優先順位は、設計判断の標準方針である。

重大な例外が必要な場合は、ADRに記録する。

## 17. Architecture Decision Criteria

Growth Lab Core の設計判断では、以下の基準を用いる。

### 17.1 Required Criteria

以下を満たさない設計は採用しない。

- 利用規約に反していないこと。

- セキュリティ上の重大リスクがないこと。

- 認証情報を安全に管理できること。

- Codex、Claude Code、人間が理解できること。

- 運用担当者が維持できること。

- 将来の仕様変更に対応できること。

- 障害時に復旧できること。

### 17.2 Preferred Criteria

以下を満たす設計を優先する。

- 公式APIに対応している。

- OAuthに対応している。

- ログが取得できる。

- 段階的に拡張できる。

- 初期コストを抑えられる。

- 将来の大規模化に対応できる。

- AIによる改善に活用できる。

- WordPress、SNS、メール、分析と連携しやすい。

### 17.3 Rejection Criteria

以下に該当する設計は採用しない。

- 規約違反を前提にしている。

- セキュリティ上の重大な欠陥がある。

- 認証情報を平文管理する。

- ログが残らない。

- 障害時に復旧できない。

- 仕様書と実装の整合性が取れない。

- 人間が運用できないほど複雑である。

- 短期的なコスト削減のために長期リスクを大きくする。

## 18. Exception Management

本章の原則に例外を設ける場合は、以下を必須とする。

- 例外が必要な理由を記録する。

- 影響範囲を明確にする。

- セキュリティリスクを評価する。

- 規約遵守上の問題がないことを確認する。

- 運用負荷を評価する。

- 見直し条件を記録する。

- 必要に応じてADRを作成する。

例外は、一時的な回避策として扱う。
例外が恒久化する場合は、本仕様書または下位仕様書を更新する。

## 19. Application to Growth Lab Core Components

本章の原則は、Growth Lab Core の各コンポーネントに以下のように適用する。

### 19.1 Mail Platform

- 独自ドメインを利用する。

- メール転送を活用して初期コストを抑える。

- Google Workspaceは管理基盤として活用する。

- 1メールアドレスにつき1SNSアカウントを基本とする。

- メール、SNS、Identityを紐付けて管理する。

- 認証情報とメールアカウント情報を分離して管理する。

### 19.2 SNS Platform

- 公式APIとOAuthを優先する。

- 利用規約を遵守する。

- アカウント数はKPIとリスクで最適化する。

- 投稿、取得、分析、自動化の範囲を明確にする。

- アカウントライフサイクルを管理する。

### 19.3 WordPress Platform

- WordPressを標準CMSとして採用する。

- エックスサーバーを第一候補とする。

- 必要に応じて他のレンタルサーバーも比較する。

- SNSからアフィリエイトブログへの導線を設計する。

- SEO、表示速度、セキュリティ、バックアップを考慮する。

### 19.4 AI Platform

- AIは投稿生成、分析、改善提案に活用する。

- AI出力は必要に応じて人間レビューを行う。

- AIが参照する仕様書はMarkdown正本とする。

- AIの提案、採用、却下の履歴を残す。

### 19.5 Database

- Identityを中核データモデルとする。

- Account、Mail、SNS、Credential Reference、Post、Analytics、KPIを分離して管理する。

- Secretの実体はDBに直接平文保存しない。

- 監査ログと運用ログを設計する。

### 19.6 API and OAuth

- 公式APIを優先する。

- OAuthを優先する。

- API制限、トークン失効、権限不足、仕様変更に対応する。

- レート制限と再試行ルールを設計する。

### 19.7 Security

- 最小権限を採用する。

- TOTPを標準候補とする。

- パスキーはサービスごとに検討する。

- Secret管理を分離する。

- 監査ログを残す。

### 19.8 Operations

- 作業手順を標準化する。

- アカウント作成、運用、休止、削除をライフサイクル管理する。

- 障害対応手順を定義する。

- CHANGELOGとADRを更新する。

## 20. Codex and Claude Code Application Policy

CodexとClaude Codeは、本章の原則に従って作業する。

### 20.1 Codex

Codexは、確定済みの本文、仕様、指示をローカルファイルへ反映する役割を持つ。

Codexに任せる作業は以下である。

- フォルダ作成

- Markdownファイル作成

- 確定本文の反映

- バックアップ作成

- CHANGELOG更新

- ファイル構成確認

- Markdown構造確認

- 軽微な整合性確認

Codexに任せない作業は以下である。

- 上位設計判断

- 利用規約リスクの独自判断

- セキュリティ方針の独自変更

- 確定本文の要約

- 確定本文の意味変更

- ADRなしの重要設計変更

### 20.2 Claude Code

Claude Codeは、仕様書とADRに基づいて実装、コード修正、検証を支援する。

Claude Codeに任せる作業は以下である。

- 実装

- コード修正

- 設定ファイル更新

- テスト作成

- 検証スクリプト作成

- ドキュメント出力補助

Claude Codeが実装中に仕様書と矛盾する課題を発見した場合は、実装を強行せず、仕様書更新またはADR作成が必要である。

## 21. Risks

本章の原則が守られない場合、以下のリスクが発生する。

### 21.1 Risk: 規約違反リスク

Compliance First が守られない場合、アカウント停止、API利用停止、サービス利用制限が発生する可能性がある。

軽減策：

- 公式APIを優先する。

- 規約変更を定期確認する。

- 自動化範囲を明確化する。

- リスクのある変更はADRに記録する。

### 21.2 Risk: セキュリティリスク

Security by Design が守られない場合、認証情報漏洩、アカウント乗っ取り、不正アクセスが発生する可能性がある。

軽減策：

- Secret管理を徹底する。

- 最小権限を採用する。

- 2要素認証を標準化する。

- 監査ログを残す。

### 21.3 Risk: 自動化暴走リスク

Automation First が他原則より優先されると、意図しない投稿、過剰アクセス、API制限到達が発生する可能性がある。

軽減策：

- 自動化に停止条件を設ける。

- 人間承認フローを設ける。

- API制限を監視する。

- 実行ログを記録する。

### 21.4 Risk: コスト増加リスク

Scalability を誤って解釈し、必要以上にアカウントやサービスを増やすと、運用コストが増加する。

軽減策：

- KPIとROIに基づいて拡張判断を行う。

- 初期段階では20アカウント規模に集中する。

- アカウント数を定期的に最適化する。

### 21.5 Risk: 仕様と実装の乖離

Single Source of Truth が守られない場合、仕様書と実装が乖離する。

軽減策：

- Markdown正本を更新する。

- CHANGELOGを更新する。

- ADRを作成する。

- Codex / Claude Codeの作業後に仕様更新要否を確認する。

### 21.6 Risk: AI判断の過信

AI First を誤って解釈し、AIの提案を無条件に実行すると、品質低下、規約違反、ブランド毀損につながる可能性がある。

軽減策：

- 重要操作には人間レビューを入れる。

- AI出力の採用理由を記録する。

- AIが参照する仕様書を最新に保つ。

## 22. Required Review Checklist

本章または下位仕様書を作成・更新する場合は、以下を確認する。

Architecture Principles Review Checklist

1. Compliance Firstに反していないか
2. Security by Designに反していないか
3. Single Source of Truthが維持されているか
4. 公式APIまたはOAuthを優先しているか
5. ログ、監査、状態確認が可能か
6. 段階的拡張に対応できるか
7. 初期コストと長期コストのバランスは適切か
8. AIの利用範囲と人間レビュー範囲は明確か
9. 自動化に停止条件と復旧手順があるか
10. ADRが必要な変更か確認したか

## 23. Review Points

本章のレビューでは、以下を確認する。

- Growth Lab Core全体に適用できる原則になっているか。

- Compliance Firstが最優先になっているか。

- API FirstとAutomation Firstの関係が明確か。

- Security by Designが具体的に定義されているか。

- AI Firstが無制限なAI任せになっていないか。

- 20アカウントから100から500アカウントへの拡張方針が明確か。

- アカウント数の最適化方針が含まれているか。

- Cost Optimizationが短期コスト削減だけになっていないか。

- Single Source of Truthが文書とデータの両面で定義されているか。

- Continuous Improvementが仕様書、運用、AI改善まで含んでいるか。

- Codex / Claude Codeの役割が明確か。

- 各原則が実装判断に使える粒度になっているか。

- ADRが必要な例外条件が明確か。

## 24. Architecture Decision Records

本章に関連するADRは以下の通りである。

Related ADRs:

- ADR-0001: Initial Architecture Policy for Growth Lab Core

本章に関連して、今後追加が想定されるADRは以下である。

ADR-0002: Markdown as Primary Source Format
ADR-0003: Document Hierarchy and Conflict Resolution Policy
ADR-0004: Chapter-Based Architecture Review Process
ADR-0005: Core Architecture Principles
ADR-0006: API First Integration Policy
ADR-0007: Security by Design and Secret Management Policy
ADR-0008: AI First Operation Policy
ADR-0009: Account Scalability and Optimization Policy

重要な例外、原則変更、優先順位変更が発生した場合は、ADRを作成する。
