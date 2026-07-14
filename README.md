# Growth Lab Core

[![OpenAPI Lint](https://github.com/growthops-lab/growth_lab_core/actions/workflows/openapi-lint.yml/badge.svg?branch=master)](https://github.com/growthops-lab/growth_lab_core/actions/workflows/openapi-lint.yml)

Growth Lab Core は、20以上の専門アフィリエイトメディアと複数SNSアカウントを管理するためのローカルMVPです。Phase 1ではX投稿を中心に、AIモック生成、下書き、人間承認、リンクチェック、予約投稿、投稿履歴、API使用量ログを扱います。

## Phase 1の方針

- Xは広告リンクの直貼りではなく、WordPress、note、Blogger、Instagram、Pinterestなど登録メディアへの集客導線として使います。
- SNS投稿は `AI生成 -> 下書き -> 承認待ち -> 人間承認 -> 予約 -> 投稿済み` の流れで扱います。
- 未承認、リンクチェック未完了、ブロック対象リンク、API停止中、自動投稿OFFの投稿は自動投稿されません。
- スクレイピングやブラウザ自動操作は使わず、将来の公式API連携を前提にしています。
- 初期状態は `X_MOCK_MODE=true` のため、実際にはXへ投稿せず、モック成功として履歴とAPIログに保存します。

## セットアップ

```bash
pnpm install
docker compose up -d
pnpm db:push
pnpm db:seed
pnpm dev
```

ブラウザで http://localhost:3000 を開きます。

## Worker

予約投稿はNext.js本体ではなく、独立workerで1分ごとに処理します。

```bash
pnpm worker
```

開発時にNext.jsとworkerを同時起動する場合:

```bash
pnpm dev:all
```

単発実行:

```bash
pnpm worker:publish-due
```

HTTP cron:

```bash
curl -H "Authorization: Bearer change-this-local-secret" http://localhost:3000/api/cron/publish-due
```

## 環境変数

`.env.example` を参考に `.env` を作成します。

重要な変数:

- `DATABASE_URL`: PostgreSQL接続文字列
- `AUTO_POSTING_ENABLED`: システム全体の自動投稿ON/OFF
- `DEFAULT_POST_TIMES`: 既定の投稿スロット。初期値は `08:00,12:30,20:00`
- `X_MOCK_MODE`: `true` の場合、Xへ実投稿せずモック成功として記録
- `AI_MOCK_MODE`: `true` の場合、OpenAI API未接続でもAI風の下書きを生成
- `BLOCK_AFFILIATE_DIRECT_LINKS`: 直接広告リンクのブロックON/OFF
- `ALLOWED_LINK_DOMAINS`: 許可ドメイン
- `BLOCKED_LINK_DOMAINS`: A8、afi-b、ValueCommerce、短縮URLなどのブロックドメイン

APIキーやアクセストークンはサーバー側だけで扱います。`NEXT_PUBLIC_` が付く環境変数には秘密情報を入れないでください。

## DB

主要モデル:

- `Media`: メディア管理。WordPress、note、Blogger、Instagram、Pinterest URLとGrowth Scoreを保持
- `SocialAccount`: SNSアカウント管理。自動投稿ON/OFF、API停止フラグ、日次上限を保持
- `Post`: 投稿管理。承認、予約、リンクチェック、ロック、失敗理由、外部投稿IDを保持
- `PostApproval`: 承認/却下履歴
- `ApiUsageLog`: API使用量、Mock Mode、エラー、レート制限ログ
- `LinkCheck`: URLごとのリンクチェック履歴
- `Setting`: 運用設定
- `PlatformCredential`: 将来のOAuth/API認証情報保存用の拡張領域

Prisma操作:

```bash
pnpm db:generate
pnpm db:push
pnpm db:migrate
pnpm db:seed
pnpm prisma:studio
```

## リンクチェック

投稿本文、誘導先URL、リンクURLを確認します。

Phase 1でブロックする例:

- `px.a8.net`
- `a8.net`
- `afi-b.com`
- `t.afi-b.com`
- `accesstrade.net`
- `valuecommerce.com`
- `ck.jp.ap.valuecommerce.com`
- `bit.ly`
- `tinyurl.com`
- `x.gd`
- `is.gd`
- `00m.in`

登録済みメディアのURL、`ALLOWED_LINK_DOMAINS` にあるドメインは安全候補として扱います。ブロックされた投稿は `BLOCKED` になり、自動投稿対象から外れます。

## X API連携メモ

Phase 1ではモック投稿が既定です。実投稿にはBearer Tokenだけでなく、ユーザーコンテキストで投稿できる認証が必要です。OAuth画面の完全実装はPhase 2以降を想定し、Phase 1ではDBと環境変数に認証情報を追加できる余地だけ残しています。

## 品質確認

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm prisma:validate
```

## Phase 2以降

- Canva Connect API連携
- Instagram / Pinterest / YouTube / TikTok連携
- ASP案件管理
- Growth Scoreの自動算出
- Growth Strategy Board
- OAuth接続画面
- 投稿メトリクス取得

## Phase 2: WordPress連携

Growth Lab内でWordPress記事下書きを作成し、WordPressへ `draft` として同期できます。X投稿にはA8.net等の広告リンクを直接載せず、WordPress記事URLを紐づけます。

### Application Password

WordPress管理画面でユーザーのApplication Passwordを作成し、Growth LabのWordPressサイト登録フォームに入力します。保存時はAES-256-GCMで暗号化され、画面には `********` のみ表示されます。

実接続に必要な環境変数:

```env
WORDPRESS_MOCK_MODE=false
WORDPRESS_ENCRYPTION_KEY="長いランダム文字列"
WORDPRESS_REQUEST_TIMEOUT_MS=15000
WORDPRESS_DEFAULT_STATUS=draft
WORDPRESS_ALLOW_PUBLISH=false
```

`WORDPRESS_ENCRYPTION_KEY` が未設定の場合、実WordPress接続は無効です。`WORDPRESS_MOCK_MODE=true` の場合のみ、キーなしで動作確認できます。

### WordPressサイト登録

1. メディアを作成
2. WordPressサイト名、サイトURL、ユーザー名を入力
3. Mock ModeをONにして登録
4. 接続テストを実行
5. 必要に応じてカテゴリ同期、タグ同期を実行

API Base URLは空欄なら `https://example.com/wp-json/wp/v2` の形式で自動生成されます。HTTP URLは警告対象です。

### WordPress記事

- 手動でタイトル、slug、抜粋、Markdown本文、SEO項目を保存できます。
- AIモック記事生成で、タイトル、slug、本文、SEO項目を作成できます。
- WordPressへ新規作成する前にslug重複確認を行います。
- 重複がある場合は `DUPLICATE_FOUND` になり、新規作成を止めます。
- 同期許可後、WordPressへ `draft` として同期できます。
- 同期成功時はWordPress投稿ID、記事URL、編集URLを保存します。

### WordPress記事からX投稿

WordPress記事にURLが保存された後、同じメディアのXアカウントを選んでX投稿案を作成できます。作成された投稿はPhase 1のリンクチェック、承認、予約フローに入ります。

### ログ

WordPress API呼び出しは以下に保存されます。

- `ApiUsageLog`: API使用量の横断ログ
- `WordPressSyncLog`: WordPress連携専用の詳細ログ

ログにはApplication Password、Authorizationヘッダー、Basic Auth文字列は保存しません。

### publish制限

Phase 2ではWordPress自動公開を基本機能にしていません。`WORDPRESS_ALLOW_PUBLISH=false` が既定で、WordPressへは原則 `draft` として作成します。公開や公開済み記事の更新は、後続Phaseで確認ダイアログ付きの手動操作として扱います。

### Phase 3候補

- Canva連携とアイキャッチ生成
- WordPressメディアアップロード
- SEOプラグイン別meta連携
- 公開済み記事の安全な更新フロー
- WordPress投稿メトリクス取得

## Phase 3: Canva連携・画像アセット管理

Phase 3では、Canva実APIに依存しないローカルMVPとして、Canva mock接続、テンプレート登録、mock SVG画像生成、CreativeAsset管理、画像承認、WordPressアイキャッチmock upload、X投稿画像mock uploadを追加しています。

標準設定は安全なmock運用です。

```env
CANVA_MOCK_MODE=true
IMAGE_MOCK_MODE=true
WORDPRESS_ENABLE_MEDIA_UPLOAD=false
WORDPRESS_MEDIA_MOCK_MODE=true
X_MEDIA_UPLOAD_ENABLED=false
X_MEDIA_MOCK_MODE=true
```

### 操作フロー

1. `docker compose up -d` でPostgreSQLを起動
2. `pnpm db:push` でPrisma schemaをDBへ反映
3. `pnpm db:seed` でPhase 1/2/3のサンプルデータを投入
4. `pnpm dev` で `http://localhost:3000` を開く
5. Canva mock connectionを作成
6. Canva templateを登録
7. Generate mock imageでSVG画像を生成
8. Creative AssetsでRisk checkを実行
9. `SAFE` になった画像をApprove
10. 承認済み画像のみWordPress記事またはX投稿へ紐づけ

### 安全設計

- Canva token、client secret、Authorization headerはログ保存しません。
- `CANVA_ENCRYPTION_KEY` が未設定の場合、実Canva接続は許可しません。
- mock画像は `public/generated-images` に保存され、公開URLは `/generated-images/...` になります。
- `approval_status = APPROVED` かつ `risk_check_status = SAFE` の画像だけがWordPress/Xへ利用できます。
- WordPress media uploadとX media uploadは標準でmockです。実APIへは送信されません。
- X画像付き投稿も、既存の承認フロー、リンクチェック、API上限制御を通過してから予約投稿されます。

### Phase 3の主なモデル

- `CanvaConnection`
- `CanvaBrandTemplate`
- `CanvaDesignJob`
- `CanvaExport`
- `CreativeAsset`
- `CreativeAssetUsage`
- `ImageApproval`
- `CanvaSyncLog`

### 検証コマンド

```bash
pnpm run prisma:validate
pnpm db:push
pnpm db:seed
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Phase 9: SNS API posting and improvement loop

Phase 9 adds an SNS API connection layer, X-focused post queue, safety gate, mock posting execution, social performance snapshots, attribution, and improvement suggestions.

Real posting is off by default:

```env
SNS_REAL_POSTING_ENABLED=false
SNS_POSTING_MOCK_MODE=true
SNS_REQUIRE_HUMAN_APPROVAL=true
SNS_REQUIRE_LINK_CHECK=true
SNS_REQUIRE_RISK_CHECK=true
SNS_PREVENT_DIRECT_AFFILIATE_LINK=true
SNS_MANUAL_REVIEW_ON_UNKNOWN_STATUS=true
SNS_POST_WORKER_ENABLED=false
X_API_ENABLED=false
X_POSTING_ENABLED=false
X_MOCK_MODE=true
```

The dashboard can create a mock X API connection, queue a post, approve it, run safety checks, execute a mock post, and create mock performance/attribution data. Direct affiliate URLs are blocked for X, short URLs require review, tokens are not logged, and Growth Score suggestions never increase posting volume automatically.

Worker command:

```bash
pnpm run worker:social-post
```

Verification:

```bash
pnpm run prisma:validate
pnpm run db:generate
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Phase 10: Campaigns, Calendar, ROI, Reports

Phase 10 adds campaign-level cross-channel management on top of the existing media, WordPress, SNS, creative asset, affiliate revenue, SEO, and operations data.

Included in this MVP:

- Campaigns, objectives, targets, and campaign items
- Campaign item duplicate prevention with `campaignId + itemType + itemId`
- Campaign budgets, actual costs, revenue attribution, and ROI snapshots
- Pending revenue and approved revenue are stored and displayed separately
- Content calendar events and conflict detection
- Campaign Growth Score snapshots, risks, and recommendations
- Draft/ready campaign reports with sections and mock exports
- Business insights for human review

Safe defaults:

```env
REPORT_AUTO_GENERATION_ENABLED=false
REPORT_EXTERNAL_SEND_ENABLED=false
CAMPAIGN_ROI_PREVENT_DOUBLE_COUNT=true
CAMPAIGN_REQUIRE_HUMAN_REVIEW=true
BUSINESS_INSIGHT_REQUIRE_HUMAN_REVIEW=true
```

Phase 10 does not integrate ad APIs, send reports externally, alter budgets automatically, pause campaigns automatically, or increase SNS posting volume automatically. Reports and exports are sanitized to avoid secrets such as tokens, passwords, authorization headers, and webhooks.

Verification:

```bash
pnpm run prisma:validate
pnpm run db:push
pnpm run db:seed
pnpm run smoke:phase10
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Phase 8: Article Improvement Workflow

Phase 8 adds a safe article improvement workflow from SEO recommendations, alerts, growth recommendations, or manual tasks.

Workflow:

```text
ArticleImprovementTask
-> ArticleRevisionSnapshot
-> RewriteDraft
-> RewriteSuggestion
-> ContentChangeSet
-> RewriteRiskCheck
-> RewriteApproval
-> WordPressRewriteSafetyCheck
-> WordPressDraftUpdate
-> SeoImpactMeasurement
```

Safe defaults:

```env
ARTICLE_IMPROVEMENT_ENABLED=true
ARTICLE_IMPROVEMENT_MOCK_MODE=true
REWRITE_REQUIRE_HUMAN_APPROVAL=true
REWRITE_REQUIRE_REAPPROVAL_ON_CHANGE=true
WORDPRESS_REWRITE_DRAFT_UPDATE_ENABLED=false
WORDPRESS_PUBLISHED_POST_DIRECT_UPDATE_ENABLED=false
WORDPRESS_REWRITE_DEFAULT_MODE=create_new_draft
CONTENT_SANITIZE_HTML_ENABLED=true
REWRITE_CRITICAL_RISK_BLOCKS_WORDPRESS_UPDATE=true
```

Rules:

- Published WordPress posts are never directly updated.
- Rewrite drafts must be approved before a WordPress draft update is allowed.
- If an approved draft or change set is edited, reapproval is required.
- Unsafe HTML is sanitized and critical rewrite risks block WordPress update.
- The default WordPress update is a mock draft update record.
- SEO impact measurement reports `INSUFFICIENT_DATA` when the after period or metric volume is too small.

## Phase 5: GA4 / Search Console mock, SEO analysis

Phase 5 adds local-only Google data management for GA4 and Search Console, CSV/mock imports, SEO opportunity detection, and human-reviewed article improvement recommendations.

Safe defaults:

```env
GA4_MOCK_MODE=true
GA4_API_ENABLED=false
GA4_CSV_IMPORT_ENABLED=true
GOOGLE_SEARCH_CONSOLE_MOCK_MODE=true
GOOGLE_SEARCH_CONSOLE_API_ENABLED=false
GOOGLE_SEARCH_CONSOLE_CSV_IMPORT_ENABLED=true
SEO_ANALYSIS_ENABLED=true
SEO_IMPROVEMENT_MOCK_MODE=true
SEO_REQUIRE_HUMAN_REVIEW=true
```

The MVP does not call real Google APIs. Use the dashboard to create a Google mock connection, register GA4/Search Console properties, paste CSV rows, run SEO analysis, and approve/reject recommendations manually.

Minimal GA4 page CSV:

```csv
date,page_path,page_title,sessions,users,views,conversions,affiliate_clicks
2026-07-01,/ai-sidejob-tools-for-beginners/,AI tools guide,120,90,240,3,8
```

Minimal Search Console query-page CSV:

```csv
date,query,page,clicks,impressions,ctr,position,country,device,search_type
2026-07-01,ai tool comparison,https://example.com/ai-sidejob-tools-for-beginners/,24,1800,0.013,11.2,jpn,desktop,web
```

Verification:

```bash
pnpm run prisma:validate
pnpm run db:generate
pnpm db:push
pnpm db:seed
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Phase 6: Google API real connection

Phase 6 adds the safe foundation for real Google OAuth, GA4 Data API, and Search Console Search Analytics API sync.

Real API calls are disabled by default:

```env
GOOGLE_API_REAL_CONNECTION_ENABLED=false
GA4_API_ENABLED=false
GA4_SYNC_ENABLED=false
GOOGLE_SEARCH_CONSOLE_API_ENABLED=false
GOOGLE_SEARCH_CONSOLE_SYNC_ENABLED=false
```

To enable real connection locally, configure Google Cloud OAuth, enable the Google Analytics Data API and Search Console API, set the redirect URI to:

```text
http://127.0.0.1:3000/api/google/oauth/callback
```

Then set:

```env
GOOGLE_API_REAL_CONNECTION_ENABLED=true
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_TOKEN_ENCRYPTION_KEY=use-a-long-random-secret
GA4_API_ENABLED=true
GA4_SYNC_ENABLED=true
GOOGLE_SEARCH_CONSOLE_API_ENABLED=true
GOOGLE_SEARCH_CONSOLE_SYNC_ENABLED=true
```

Tokens are encrypted before saving and are never shown in the UI or logs. If Google does not return a refresh token, the connection is saved as `MISSING_REFRESH_TOKEN`; start OAuth again with consent to reauthorize.

Phase 6 sync jobs are manually run from the dashboard. API data is stored with source `GA4_API` or `SEARCH_CONSOLE_API`, so existing mock and CSV data is not deleted. Quota and error events are recorded in `GoogleApiQuotaLog` and `GoogleApiErrorLog`.

## Phase 4: ASP案件管理・収益分析・Growth Score

Phase 4では、ASP案件、Affiliate Link、WordPress記事内の配置、Revenue Event、CSV取り込み、Operating Cost、Growth Score、Growth Strategy Boardを追加しています。

安全方針:

- ASP管理画面への自動ログインやスクレイピングは実装しません。
- ASPのID/パスワードは保存しません。
- order_id / click_id は保存前にhash化します。
- XへASP広告リンクを直接投稿する導線は作りません。
- ASPリンクはWordPress記事内placement用として管理します。
- Growth Scoreは自動投資判断ではなく、人間が確認する意思決定支援です。

標準設定:

```env
AFFILIATE_MOCK_MODE=true
AFFILIATE_CSV_IMPORT_ENABLED=true
AFFILIATE_SCRAPING_ENABLED=false
AFFILIATE_DIRECT_X_LINK_BLOCK=true
GROWTH_SCORE_REQUIRE_HUMAN_REVIEW=true
GA4_API_ENABLED=false
GOOGLE_SEARCH_CONSOLE_API_ENABLED=false
```

CSV取り込みの最小ヘッダー:

```csv
event_date,network_slug,program_name,media_name,status,reward,currency,order_id,click_id,memo
2026-07-01,a8-net,AI tools comparison program,AI副業ラボ,approved,1800,JPY,order-1,click-1,mock row
```

検証:

```bash
pnpm run prisma:validate
pnpm db:push
pnpm db:seed
pnpm run typecheck
pnpm run lint
pnpm run build
```

PR Trigger Test
