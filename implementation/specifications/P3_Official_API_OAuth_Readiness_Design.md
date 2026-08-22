# P3A 公式 API / OAuth 連携準備設計・受入基準

## 1. 目的

P3A は、Growth Lab Core が将来公式 API を利用する前に、対象サービス、最小権限、資格情報の責任分界、失敗時の停止、及び P3B 以降の承認条件を確定する設計工程である。P3A 自体では実サービス、実資格情報、実データベース、又は実公開を利用しない。

最初の候補は、既存の mock-first 実装と read-only スコープが存在する Google OAuth、Google Analytics 4 Data API、及び Search Console Search Analytics API とする。ただし、P3A は Google Cloud プロジェクト、GA4 property、Search Console property、又は OAuth client の作成・選択・接続を承認しない。

## 2. P3A の対象と非対象

### 2.1 変更対象

- `implementation/specifications/P3_Official_API_OAuth_Readiness_Design.md`

### 2.2 観測対象の既存実装

- `src/lib/google/oauth.ts`
- `src/lib/google/token.ts`
- `src/lib/google/encryption.ts`
- `app/api/google/oauth/callback/route.ts`
- `app/google-actions.ts`

これらは設計の確認対象であり、P3A では変更しない。既存の実装観測は、実接続が有効又は安全であることの証明ではない。

### 2.3 明示的な非対象

- Google、WordPress、X、Canva、ASP、メール、Slack、AI その他の外部サービスへの HTTP 要求
- OAuth 画面の開始、callback の受信、認可コード交換、token refresh
- 実アカウント、client ID、client secret、token、暗号鍵、cookie、`.env`、デプロイ設定の読取・作成・変更
- 実 DB 接続、Prisma migration、`db push`、seed、既存データの読取・変更
- cron、worker、scheduled job、SNS 投稿、WordPress 作成・公開、メール送信
- 本番、ステージング又は開発環境への設定適用、リリース

## 3. 設計上の前提

1. `GOOGLE_API_REAL_CONNECTION_ENABLED` が `true` 以外である限り、Google の実接続は無効でなければならない。
2. P3B で候補とする最小権限は、GA4 と Search Console の読取り専用スコープだけである。投稿、編集、広告管理、ユーザー管理、メール送信などの書込み権限は対象外とする。
3. OAuth redirect URI は環境ごとに固定値を Human Owner が承認し、ワイルドカード又は未承認の URI を認めない。
4. credential は承認済みの秘密情報保管経路で Human Owner が直接管理する。チャット、リポジトリ、PR 本文、ログ、テスト fixture、エラー応答へ値を入れない。
5. OAuth state は署名、有効期限、リプレイ防止を満たす設計にする。P3B では、開始要求と callback の対応付け、one-time 使用、PKCE 採用可否を実装前に確定する。
6. 実接続の全入口は、明示的な feature flag、許可環境、及び構成完全性を検査し、いずれかが欠ける場合は外部要求・DB 書込みをせず fail-closed で停止する。
7. 実行は P3B 以降も手動起動を既定とし、cron 又は worker による自動同期は別承認とする。

## 4. P3B の開始前に必要な Human Owner 決定

| ID        | 決定事項   | 必要な確定内容                                                                                                                      |
| --------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| P3A-HO-01 | 接続対象   | Google OAuth / GA4 / Search Console のみを対象にするか、又は別サービスを先行させるか。                                              |
| P3A-HO-02 | 環境       | 最初に許可する環境、対象の Google Cloud project、GA4 property、Search Console property、及び所有者。                                |
| P3A-HO-03 | OAuth 契約 | 承認済み redirect URI、最小 scopes、同意画面、テストユーザー、再認可手順。                                                          |
| P3A-HO-04 | 秘密情報   | client secret、token encryption key、refresh token の保管責任者、投入経路、失効・ローテーション担当。値そのものは本書に記録しない。 |
| P3A-HO-05 | DB         | 実 DB を使うか、接続先、migration / seed / data retention の可否。P3A の承認は DB 利用を承認しない。                                |
| P3A-HO-06 | 実行・停止 | 手動同期の許可者、timeout / quota / authorization error 時の停止、監査ログ、rollback の担当。                                       |
| P3A-HO-07 | 受入       | P3B で許可するパス、テスト方法、外部接続確認の範囲、完了基準、PR / merge / release の承認者。                                       |

上記のいずれかが未確定の場合、P3B の実装・設定・接続を開始しない。

## 5. P3B の最小実装境界（設計案）

P3B は、P3A-HO-01 から P3A-HO-07 の承認後に、次の順序で限定的に検討する。

1. 構成未設定・機能無効・許可外環境の各ケースで、認可開始、callback、token exchange、DB 書込みの全てを fail-closed にする。
2. OAuth 開始時に、最小スコープ、state の有効期限、開始要求と callback の one-time 対応付け、ログの値マスキングを自動テストする。
3. callback は設定検査より前に token exchange や DB 書込みを開始しない。Google から返されたエラー及び例外メッセージを、秘密値を含まない固定分類に変換する。
4. 実接続を許可する場合も、まず承認済みの非本番環境で read-only の単一 property に限定し、手動実行の証跡を残す。
5. 本番接続、複数 property、定期同期、トークン更新の自動化、又は外部サービスの書込みは、別工程・別受入とする。

## 6. 失敗時の停止とロールバック

| 事象                                  | 必須動作                                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| feature flag が無効又は未設定         | 外部要求・DB 書込みなしで停止し、再設定を要求する。                                                 |
| credential 又は redirect URI が未設定 | 値を表示せず、外部要求・DB 書込みなしで停止する。                                                   |
| OAuth state 不正・期限切れ・再利用    | 認可コード交換を行わず、固定分類で拒否する。                                                        |
| token exchange / refresh 失敗         | token をログへ出さず、接続状態を再認可要求へ遷移させる。                                            |
| quota、timeout、5xx                   | 自動リトライや自動投稿を行わず、手動対応が必要な状態として記録する。                                |
| rollback                              | feature flag を無効化して新規外部要求を停止する。token / 接続記録の削除は別の明示承認が必要である。 |

## 7. P3A 受入基準

| ID         | 受入条件                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| P3A-ACC-01 | P3A の変更は本書だけであり、アプリケーション、Prisma schema、環境変数、資格情報、外部設定に変更がない。                                 |
| P3A-ACC-02 | Google を最初の候補にする理由、最小権限、callback、state、token、DB、ログ、停止、rollback の境界が明記されている。                      |
| P3A-ACC-03 | P3B の開始に必要な Human Owner 決定が個別に列挙され、未決定時に実接続を禁止している。                                                   |
| P3A-ACC-04 | `pnpm exec prettier --check implementation/specifications/P3_Official_API_OAuth_Readiness_Design.md` と `git diff --check` が成功する。 |
| P3A-ACC-05 | P3A の作成・検証中に、実 DB、migration、seed、OIDC / OAuth、外部 HTTP、credential、Git commit / push を実行しない。                     |

## 8. 完了記録

- 承認日: 2026-08-22
- P3A の実装: 本書の追加のみ
- P3A の完了: P3A-ACC-01 から P3A-ACC-05 の確認後、Human Owner が P3A の commit / push / Draft PR 作成を個別承認した時点で記録する。
- 次工程: P3B は P3A-HO-01 から P3A-HO-07 の明示承認後にのみ定義する。
