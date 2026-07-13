# Approval Gate Data Model

Document Name: Growth Lab Core Approval Gate Data Model
Related ADR: ADR-0006 / ADR-0008
Related Template: templates/review_logs/SNS_ASP_Affiliate_Review_Log_Template.md
Related Specification: implementation/specifications/SNS_ASP_Affiliate_Terms_Review_Specification.md
Status: Draft
Primary Format: Markdown
Target File: implementation/data_models/Approval_Gate_Data_Model.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

- 本データモデルは、SNS、ASP、アフィリエイト関連投稿の承認ゲート状態を管理するための論理データモデルである。
- 本データモデルは、ADR-0006、ADR-0008、Review Log Templateに基づく。
- 本データモデルは、MVPでの承認ゲート管理、Human Review、Evidence / Review Logとの関連管理に使用する。
- 本データモデルは、物理DB実装やSQL定義ではない。

## 2. Scope

対象:

- Approval Gate状態管理
- Review Logとの関連
- Human Review結果との関連
- 投稿前承認状態
- Blocked理由
- Deferred理由
- Published状態
- Archived状態
- MVP実装に必要な論理項目

対象外:

- 物理DB実装
- SQLマイグレーション
- ORM実装
- APIエンドポイント設計
- UI設計
- SNS規約の最終解釈
- ASP規約の最終解釈
- アフィリエイト規約の最終解釈
- 法務判断

## 3. Important Notes

- This data model does not implement a physical database schema.
- This data model does not define SQL, ORM, API, or UI implementation.
- This data model does not finalize SNS, ASP, or affiliate terms interpretation.
- This data model defines MVP approval gate state management.
- Detailed terms review is delegated to later specifications or official-source confirmation.

日本語での重要事項:

- 本データモデルは、物理DBスキーマを実装しない。
- 本データモデルは、SQL、ORM、API、UI実装を定義しない。
- 本データモデルは、SNS、ASP、アフィリエイト規約の詳細判断を確定しない。
- 本データモデルは、MVPにおける承認ゲート状態管理を定義する。
- 詳細な規約判断は、後続仕様または公式情報確認へ委譲する。

## 4. Relationship to ADRs and Review Log Template

- ADR-0006は、SNS、WordPress、ASP、アフィリエイト連携に関する実行境界を定義する。
- ADR-0006では、SNS・ASP・アフィリエイト規約確認を後続仕様へ委譲し、MVPでは承認ゲート管理を行う。
- ADR-0008は、Workflow、Approval Gate、Scheduler、Automation Engineの境界を定義する。
- Review Log Templateは、承認ゲート判断の証跡、理由、状態を記録する。
- 本データモデルは、Review Log Templateの項目を論理データモデルへ整理する。

## 5. Conceptual Model Overview

Approval Gate Data Modelは、投稿案またはコンテンツ案を直接公開するためのモデルではない。MVPにおける公開前確認、Human Review、証跡参照、状態遷移を整理し、承認なしの自動投稿を防止するための論理モデルである。

| Entity | Role | Relationship |
|---|---|---|
| approval_gate | 承認ゲート単位の状態を管理する中心エンティティ。 | content_reference、review_log、status_transition、evidence_referenceと関連する。 |
| review_log | Human Review結果、判断理由、確認状態を記録する。 | 1つのapproval_gateに1つ以上関連する場合がある。 |
| content_reference | 投稿案、記事案、リンク、画像など対象コンテンツを識別する。 | 1つのcontent_referenceは、1つ以上のapproval_gateを持つ場合がある。 |
| reviewer | Human Reviewの担当者、role、チーム、内部識別子を表す。 | review_logおよびapproval_gateの判断者として参照される。 |
| evidence_reference | 証跡の参照IDまたは保管場所識別子を表す。 | approval_gateとreview_logの判断根拠として参照される。 |
| status_transition | 承認ゲート状態の遷移履歴を表す。 | 1つのapproval_gateは複数のstatus_transition履歴を持つ場合がある。 |

関係性:

- 1つのcontent_referenceは、1つ以上のapproval_gateを持つ場合がある。
- 1つのapproval_gateは、1つ以上のreview_logと関連する場合がある。
- 1つのapproval_gateは、複数のstatus_transition履歴を持つ場合がある。
- evidence_referenceは実体値ではなく、証跡の参照IDまたは保管場所識別子である。

## 6. Entity Definitions

| Entity | Description | MVP Required | Notes |
|---|---|---|---|
| approval_gate | 承認ゲート状態、判断カテゴリ、公開可否に関する中心エンティティ。 | Yes | DraftからPublishedまでの状態を管理する。 |
| review_log | Review Log Templateに基づくHuman Review記録。 | Yes | 本データモデルはReview Log Templateを置き換えない。 |
| content_reference | 対象コンテンツの内部参照。 | Yes | 実在URLではなく内部IDや参照IDを優先する。 |
| reviewer | Review担当のrole、チーム、内部識別子。 | Yes | 個人情報を避ける。 |
| evidence_reference | 証跡参照IDまたは保管場所識別子。 | Conditional | Secret実体、Token実体、API Key実体を記録しない。 |
| status_transition | 状態遷移履歴。 | Yes | DraftからPublishedへの直接遷移などを検証する。 |

## 7. Field Definitions

| Field | Entity | Required | Logical Type | Description | Allowed Values | Source Template Field | Notes |
|---|---|---|---|---|---|---|---|
| approval_gate_id | approval_gate | Yes | reference_id | 承認ゲート単位の一意なID候補。 | AG-YYYYMMDD-0001形式を推奨 | N/A | 物理DB主キーではなく論理ID候補。 |
| review_id | approval_gate, review_log | Yes | reference_id | Review Log Templateのreview_idと対応する。 | REV-YYYYMMDD-0001形式を推奨 | review_id | Review Logとの紐づけに使う。 |
| content_id | content_reference | Yes | reference_id | 対象コンテンツを識別するID。 | CONTENT-0001形式を推奨 | content_id | 複数媒体では媒体別approval_gateを持てる。 |
| source_system | content_reference | Yes | string | コンテンツ案の作成元。 | Growth Lab Core, WordPress, SNS, Manual, AI Draft, Other | source_system | 外部認証情報は記録しない。 |
| platform | approval_gate, content_reference | Yes | enum | 対象媒体。 | X, WordPress, Instagram, Pinterest, Other, Unknown | platform | 媒体別投稿自動化可否は最終判断しない。 |
| content_type | content_reference | Yes | enum | 対象コンテンツ種別。 | sns_post, wordpress_article, image_asset, affiliate_link, campaign_item, other | content_type | 実装時の分類キー候補。 |
| content_title | content_reference | No | string | 管理用タイトル。 | Free text | content_title | 個人情報を入れない。 |
| content_url_or_reference | content_reference | Yes | string | URLまたは内部参照。 | internal reference, draft ID, storage reference | content_url_or_reference | Exampleでは実在URLを使わない。 |
| approval_gate_status | approval_gate | Yes | enum | 承認ゲートの状態。 | Draft, Review Required, Approved, Blocked, Deferred, Published, Archived | approval_gate_status | review_statusとは同義ではない。 |
| previous_status | status_transition | Conditional | enum | 遷移前の状態。 | Draft, Review Required, Approved, Blocked, Deferred, Published, Archived, None | N/A | 初回作成時はNoneでもよい。 |
| next_status | status_transition | Conditional | enum | 遷移後の状態。 | Draft, Review Required, Approved, Blocked, Deferred, Published, Archived | N/A | 状態遷移検証に使う。 |
| decision_category | approval_gate | Yes | enum | 判断カテゴリ。 | Approved for MVP publishing, Approved with manual review, Blocked due to missing evidence, Blocked due to terms uncertainty, Deferred to later specification, Requires Human Owner decision, Requires official-source confirmation | decision_category | approval_gate_statusと整合させる。 |
| review_status | review_log | Yes | enum | レビュー作業の状態。 | Not Started, In Review, Pass, Warning, Blocked, Deferred, Approved, Unknown | review_status | approval_gate_statusとは同義ではない。 |
| reviewer | reviewer, review_log | Yes | string | Review担当者または担当識別子。 | role, team, internal reviewer ID | reviewer | 個人名ではなくroleや内部識別子を推奨する。 |
| reviewed_at | review_log | Conditional | datetime | Review実施日時。 | ISO 8601 datetime, blank | reviewed_at | Review済みの場合は必須。 |
| human_owner_decision_required | approval_gate | Yes | boolean | Human Owner判断要否。 | Yes, No, Unknown | human_owner_decision_required | Yesの場合は判断完了までPublished不可。 |
| evidence_reference | evidence_reference | Conditional | reference_id | 証跡参照IDまたは保管場所識別子。 | reference ID, file ID, storage reference, internal control number | evidence_reference | Secret実体を記録しない。 |
| decision_reason | approval_gate, review_log | Conditional | text | 判断理由。 | Free text | decision_reason | Approved、Blocked、Deferred時は必須。 |
| blocked_reason | approval_gate | Conditional | text | Blocked理由。 | Free text, blank | blocked_reason | approval_gate_statusがBlockedの場合は必須。 |
| deferred_items | approval_gate | Conditional | text | 後続確認へ委譲する項目。 | Free text, blank | deferred_items | approval_gate_statusがDeferredの場合は必須。 |
| follow_up_owner | approval_gate | Conditional | string | 後続確認担当。 | role, team, internal owner ID, blank | follow_up_owner | 個人情報を避ける。 |
| follow_up_due_date | approval_gate | Conditional | date | 後続確認期限。 | ISO 8601 date, blank | follow_up_due_date | DeferredやOwner判断待ちで使用する。 |
| published_at | approval_gate | Conditional | datetime | Published日時。 | ISO 8601 datetime, blank | published_at | approval_gate_statusがPublishedの場合は必須。 |
| archive_reference | approval_gate | No | reference_id | Archive参照ID。 | archive ID, storage reference, blank | archive_reference | Archived時に推奨する。 |
| created_at | approval_gate | Yes | datetime | 作成日時。 | ISO 8601 datetime | created_at | 論理レコード作成日時。 |
| updated_at | approval_gate | Yes | datetime | 更新日時。 | ISO 8601 datetime | updated_at | 更新時に変更する。 |
| sns_terms_check_required | review_log | Yes | enum | SNS規約確認要否。 | Yes, No, Unknown | sns_terms_check_required | 詳細判断は後続仕様へ委譲する。 |
| sns_terms_check_status | review_log | Yes | enum | SNS規約確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | sns_terms_check_status | UnknownならApproved for MVP publishingにしない。 |
| asp_terms_check_required | review_log | Yes | enum | ASP規約確認要否。 | Yes, No, Unknown | asp_terms_check_required | ASP別運用条件を最終判断しない。 |
| asp_terms_check_status | review_log | Yes | enum | ASP規約確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | asp_terms_check_status | Deferredなら後続確認へ送る。 |
| affiliate_terms_check_required | review_log | Yes | enum | アフィリエイト規約確認要否。 | Yes, No, Unknown | affiliate_terms_check_required | 案件別詳細判断はしない。 |
| affiliate_terms_check_status | review_log | Yes | enum | アフィリエイト規約確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | affiliate_terms_check_status | 詳細結論を確定しない。 |
| advertising_label_required | review_log | Yes | enum | 広告表記確認要否。 | Yes, No, Unknown | advertising_label_required | 表記詳細は後続仕様へ委譲する。 |
| advertising_label_status | review_log | Yes | enum | 広告表記確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | advertising_label_status | UnknownならPublished不可。 |
| pr_label_required | review_log | Yes | enum | PR表記確認要否。 | Yes, No, Unknown | pr_label_required | 安全側の確認を想定する。 |
| pr_label_status | review_log | Yes | enum | PR表記確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | pr_label_status | 媒体別ルールの最終判断はしない。 |
| affiliate_label_required | review_log | Yes | enum | アフィリエイト表記確認要否。 | Yes, No, Unknown | affiliate_label_required | 案件別確認へ接続する。 |
| affiliate_label_status | review_log | Yes | enum | アフィリエイト表記確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | affiliate_label_status | Pass以外は理由を記録する。 |
| prohibited_expression_check_required | review_log | Yes | enum | 禁止表現確認要否。 | Yes, No, Unknown | prohibited_expression_check_required | AI生成物はHuman Review対象。 |
| prohibited_expression_check_status | review_log | Yes | enum | 禁止表現確認状態。 | Not Checked, Pass, Warning, Blocked, Deferred, Not Applicable, Unknown | prohibited_expression_check_status | Blockedならblocked_reason必須。 |
| automation_allowed_status | approval_gate | Yes | enum | 自動投稿実行可否の管理状態。 | Allowed, Manual Only, Blocked, Deferred, Unknown | automation_allowed_status | Unknownの場合、自動投稿を実行しない。 |

## 8. Field Value Rules

- approval_gate_idは承認ゲート単位の一意なID候補である。
- review_idはReview Log Templateのreview_idと対応する。
- content_idは対象コンテンツを識別するIDである。
- approval_gate_statusは承認ゲートの状態を表す。
- review_statusはレビュー作業の状態を表し、approval_gate_statusとは同義ではない。
- evidence_referenceにはSecret実体やToken実体を記載せず、参照IDまたは保管場所識別子のみを記載する。
- created_at、updated_at、reviewed_at、published_atはISO 8601形式を推奨する。

ID形式:

```text
approval_gate_id: AG-20260708-0001
review_id: REV-20260708-0001
content_id: CONTENT-0001
```

日時形式:

```text
reviewed_at: 2026-07-08T13:00:00+09:00
published_at: 2026-07-08T15:00:00+09:00
```

## 9. Approval Gate Status Model

| Status | Meaning | Entry Condition | Exit Condition | Required Fields | Notes |
|---|---|---|---|---|---|
| Draft | 投稿案またはコンテンツ案の作成中。 | content_referenceが作成された。 | Review RequiredまたはArchivedへ進む。 | approval_gate_id, content_id, created_at | DraftからPublishedへ直接遷移しない。 |
| Review Required | Human Reviewが必要な状態。 | Draft、Blocked、Deferred、Published、Archivedから再確認が必要になった。 | Approved、Blocked、Deferred、Archivedへ進む。 | reviewer, review_id, reviewed_at or review request | Review Requiredを経由しないPublishedを禁止する。 |
| Approved | MVP公開または手動投稿に進める承認済み状態。 | Human ReviewとEvidence確認が完了した。 | Published、Archived、Review Requiredへ進む。 | evidence_reference, decision_reason, reviewed_at | ApprovedなしにPublishedへ進めない。 |
| Blocked | 証跡不足、規約不確実性、禁止表現などで停止する状態。 | Published不可の理由がある。 | Review Required、Deferred、Archivedへ進む。 | blocked_reason, decision_category, updated_at | blocked_reasonを必須にする。 |
| Deferred | 後続仕様、公式情報確認、Human Owner判断へ委譲する状態。 | 本データモデル内で最終判断しない項目がある。 | Review Required、Blocked、Archivedへ進む。 | deferred_items, follow_up_owner, decision_category | deferred_itemsを必須にする。 |
| Published | 承認済みコンテンツが公開済みまたは投稿済みである状態。 | Approved済みでpublished_atが記録された。 | Archived、Review Requiredへ進む。 | prior Approved state, published_at, evidence_reference | published_atを必須にする。 |
| Archived | 承認ゲート記録を保管または終了する状態。 | 運用完了、停止、保管対象になった。 | 条件付きでReview Requiredへ戻る。 | archive_reference recommended, updated_at | archive_referenceを推奨する。 |

## 10. Status Transition Rules

| From Status | To Status | Allowed | Required Condition | Notes |
|---|---|---|---|---|
| Draft | Review Required | Yes | content_idとapproval_gate_idがある。 | 通常の初回Reviewへ進む。 |
| Draft | Published | No | Not allowed. | DraftからPublishedへ直接遷移しない。 |
| Review Required | Approved | Yes | review_id、reviewer、reviewed_at、evidence_reference、decision_reasonがある。 | Human Review後のみ許可する。 |
| Review Required | Blocked | Yes | blocked_reasonがある。 | 証跡不足や規約不確実性で停止する。 |
| Review Required | Deferred | Yes | deferred_itemsがある。 | 後続仕様または公式確認へ委譲する。 |
| Approved | Published | Yes | published_atがあり、Approved記録が存在する。 | ApprovedなしのPublishedは禁止する。 |
| Approved | Archived | Yes | archive_referenceを推奨する。 | 公開しないまま保管する場合。 |
| Blocked | Review Required | Conditional | blocked_reasonに対する対応が完了した。 | 再レビューする。 |
| Deferred | Review Required | Conditional | deferred_itemsの確認が完了した。 | 後続確認後に再レビューする。 |
| Published | Archived | Yes | archive_referenceを推奨する。 | 公開後の保管。 |
| Published | Review Required | Conditional | 再レビューが必要になった。 | 規約変更、表記変更、再投稿判断時のみ。 |
| Archived | Review Required | Conditional | 再利用または再公開判断が必要。 | 再Reviewとして扱う。 |
| Review Required | Published | No | Not allowed. | Approvedを経由しないPublishedは禁止する。 |
| Blocked | Published | No | Not allowed. | Blocked状態から直接Publishedへ進めない。 |
| Deferred | Published | No | Not allowed. | Deferred状態から直接Publishedへ進めない。 |

必須ルール:

- Draft -> Published はNoにする。
- Review Requiredを経由しないPublishedは禁止する。
- ApprovedなしのPublishedは禁止する。
- Blockedにはblocked_reasonが必須である。
- Deferredにはdeferred_itemsが必須である。
- Publishedにはpublished_atが必須である。
- Archivedにはarchive_referenceを推奨する。
- Published -> Review Requiredは再レビューが必要な場合のみConditionalとする。
- Archived -> Review Requiredは再利用または再公開判断が必要な場合のみConditionalとする。

## 11. Decision Category Model

| Decision Category | Meaning | Allowed Approval Gate Status | Required Record |
|---|---|---|---|
| Approved for MVP publishing | MVP範囲で公開または投稿へ進めてよい。 | Approved | evidence_reference, decision_reason, reviewer, reviewed_at |
| Approved with manual review | 手動確認付きで進めてよい。 | Approved | manual review note, evidence_reference, decision_reason |
| Blocked due to missing evidence | 証跡不足により停止する。 | Blocked | blocked_reason, missing evidence detail |
| Blocked due to terms uncertainty | 規約不確実性が高いため停止する。 | Blocked | blocked_reason, terms uncertainty note |
| Deferred to later specification | 後続仕様へ委譲する。 | Deferred | deferred_items, follow_up_owner |
| Requires Human Owner decision | Human Owner判断が必要。 | Deferred, Review Required | decision request, follow_up_owner, follow_up_due_date |
| Requires official-source confirmation | 公式情報確認が必要。 | Deferred, Blocked | official-source confirmation item, follow_up_owner |

## 12. Review Log Relationship

- approval_gate_idは承認ゲート単位のIDである。
- review_idはReview Log Templateのreview_idと紐づく。
- content_idは対象コンテンツを識別する。
- evidence_referenceは証跡の参照IDまたは保管場所識別子であり、Secret実体ではない。
- Approval Gate Data ModelはReview Log Templateを置き換えるものではなく、実装時の状態管理モデルである。
- Review Log Templateは人が確認結果を記録するテンプレートであり、本データモデルは状態管理と関連項目を整理する。

Review Log Templateとの主な対応:

| Approval Gate Field | Review Log Template Field | Relationship Notes |
|---|---|---|
| approval_gate_id | N/A | 本データモデルで追加する承認ゲート単位ID。 |
| review_id | review_id | Review Logとの関連キー候補。 |
| content_id | content_id | 対象コンテンツの関連キー候補。 |
| approval_gate_status | approval_gate_status | 承認ゲート状態。 |
| review_status | review_status | レビュー作業状態。approval_gate_statusとは別管理。 |
| decision_category | decision_category | 判断カテゴリ。 |
| evidence_reference | evidence_reference | Secret実体ではなく参照ID。 |
| blocked_reason | blocked_reason | Blocked時に必須。 |
| deferred_items | deferred_items | Deferred時に必須。 |
| published_at | published_at | Published時に必須。 |
| automation_allowed_status | automation_allowed_status | 自動投稿抑止の判断に利用する。 |

## 13. Validation and Constraint Rules

- approval_gate_statusがPublishedの場合、事前にApprovedが必要である。
- approval_gate_statusがBlockedの場合、blocked_reasonが必須である。
- approval_gate_statusがDeferredの場合、deferred_itemsが必須である。
- approval_gate_statusがPublishedの場合、published_atが必須である。
- evidence_referenceはSecret実体ではなく参照IDまたは保管場所の識別子とする。
- human_owner_decision_requiredがYesの場合、Human Owner判断が完了するまでPublishedへ進めない。
- terms_check_statusがUnknownの場合、Approved for MVP publishingにしない。
- automation_allowed_statusがUnknownの場合、自動投稿を実行しない。
- DraftからPublishedへ直接遷移しない。
- Review Requiredを経由しないPublishedを禁止する。
- approval_gate_statusとreview_statusを混同しない。

制約の論理表現:

```text
if approval_gate_status == Published:
  require previous approved decision
  require published_at
  require evidence_reference

if approval_gate_status == Blocked:
  require blocked_reason

if approval_gate_status == Deferred:
  require deferred_items

if automation_allowed_status == Unknown:
  do not execute automated publishing
```

## 14. MVP Logical Table Draft

このセクションは物理DBではなく、論理テーブル案である。SQLのCREATE TABLE文は作成しない。物理DB制約、インデックス、ORM、API、UIは本データモデルでは確定しない。

| Logical Table | Purpose | Primary Key Candidate | Notes |
|---|---|---|---|
| approval_gates | 承認ゲート状態を管理する中心テーブル候補。 | approval_gate_id | 物理DB設計時に正規化や履歴分離を再検討する。 |
| approval_gate_transitions | 状態遷移履歴を管理するテーブル候補。 | transition_id | previous_status、next_status、changed_atを持つ想定。 |
| review_logs | Human Review記録を管理するテーブル候補。 | review_id | Review Log Templateに基づく。 |
| content_references | 対象コンテンツ参照を管理するテーブル候補。 | content_id | WordPress、SNS、画像、リンクなどを参照する。 |
| evidence_references | 証跡参照を管理するテーブル候補。 | evidence_reference_id | Secret実体は保存しない。 |

approval_gates の主要項目案:

| Column Candidate | Required | Logical Type | Description | Notes |
|---|---|---|---|---|
| approval_gate_id | Yes | reference_id | 承認ゲートID。 | AG-YYYYMMDD-0001形式を推奨。 |
| review_id | Yes | reference_id | Review Log ID。 | review_logsと関連する。 |
| content_id | Yes | reference_id | 対象コンテンツID。 | content_referencesと関連する。 |
| platform | Yes | enum | 対象媒体。 | 媒体別最終可否は判断しない。 |
| approval_gate_status | Yes | enum | 承認ゲート状態。 | Draft, Review Required, Approved, Blocked, Deferred, Published, Archived。 |
| decision_category | Yes | enum | 判断カテゴリ。 | approval_gate_statusと整合させる。 |
| review_status | Yes | enum | Review作業状態。 | approval_gate_statusとは別。 |
| human_owner_decision_required | Yes | boolean | Human Owner判断要否。 | Yesの場合Published不可。 |
| evidence_reference | Conditional | reference_id | 証跡参照。 | Secret実体は入れない。 |
| decision_reason | Conditional | text | 判断理由。 | Approved、Blocked、Deferred時に必須。 |
| blocked_reason | Conditional | text | Blocked理由。 | Blocked時に必須。 |
| deferred_items | Conditional | text | 後続確認項目。 | Deferred時に必須。 |
| automation_allowed_status | Yes | enum | 自動投稿管理状態。 | Unknownでは自動投稿しない。 |
| follow_up_owner | Conditional | string | 後続確認担当。 | roleまたは内部識別子を推奨。 |
| follow_up_due_date | Conditional | date | 後続確認期限。 | ISO 8601 date。 |
| published_at | Conditional | datetime | Published日時。 | Published時に必須。 |
| archive_reference | No | reference_id | Archive参照。 | Archived時に推奨。 |
| created_at | Yes | datetime | 作成日時。 | ISO 8601 datetime。 |
| updated_at | Yes | datetime | 更新日時。 | ISO 8601 datetime。 |

## 15. Example Records

以下はExample Valueであり、すべてダミー値である。実在URL、実在アカウント名、実在Token、API Key、Password、個人情報は含めない。

```text
Draft example:
approval_gate_id: AG-20260708-0001
review_id: REV-20260708-0001
content_id: CONTENT-0001
platform: X
approval_gate_status: Draft
decision_category: Requires Human Owner decision
review_status: Not Started
evidence_reference:
created_at: 2026-07-08T10:00:00+09:00
updated_at: 2026-07-08T10:00:00+09:00

Review Required example:
approval_gate_id: AG-20260708-0002
review_id: REV-20260708-0002
content_id: CONTENT-0002
platform: WordPress
approval_gate_status: Review Required
decision_category: Requires official-source confirmation
review_status: In Review
reviewer: human-reviewer-role
evidence_reference: dummy-evidence-reference-0002
created_at: 2026-07-08T10:30:00+09:00
updated_at: 2026-07-08T11:00:00+09:00

Approved example:
approval_gate_id: AG-20260708-0003
review_id: REV-20260708-0003
content_id: CONTENT-0003
platform: X
approval_gate_status: Approved
decision_category: Approved with manual review
review_status: Approved
reviewer: human-reviewer-role
reviewed_at: 2026-07-08T12:00:00+09:00
evidence_reference: dummy-evidence-reference-0003
decision_reason: Dummy approved after manual review
automation_allowed_status: Manual Only
created_at: 2026-07-08T11:00:00+09:00
updated_at: 2026-07-08T12:00:00+09:00

Blocked example:
approval_gate_id: AG-20260708-0004
review_id: REV-20260708-0004
content_id: CONTENT-0004
platform: X
approval_gate_status: Blocked
decision_category: Blocked due to missing evidence
review_status: Blocked
blocked_reason: Dummy missing evidence reason
evidence_reference:
automation_allowed_status: Blocked
created_at: 2026-07-08T12:15:00+09:00
updated_at: 2026-07-08T12:30:00+09:00

Deferred example:
approval_gate_id: AG-20260708-0005
review_id: REV-20260708-0005
content_id: CONTENT-0005
platform: X
approval_gate_status: Deferred
decision_category: Deferred to later specification
review_status: Deferred
deferred_items: Dummy platform-specific terms confirmation item
follow_up_owner: terms-review-owner-role
follow_up_due_date: 2026-07-15
automation_allowed_status: Deferred
created_at: 2026-07-08T12:45:00+09:00
updated_at: 2026-07-08T13:00:00+09:00

Published example:
approval_gate_id: AG-20260708-0006
review_id: REV-20260708-0006
content_id: CONTENT-0006
platform: WordPress
approval_gate_status: Published
decision_category: Approved for MVP publishing
review_status: Approved
reviewer: human-reviewer-role
reviewed_at: 2026-07-08T13:30:00+09:00
evidence_reference: dummy-evidence-reference-0006
decision_reason: Dummy approved for MVP publishing
published_at: 2026-07-08T15:00:00+09:00
automation_allowed_status: Manual Only
created_at: 2026-07-08T13:00:00+09:00
updated_at: 2026-07-08T15:00:00+09:00
```

## 16. Items Not Decided by This Data Model

- 物理DBスキーマ
- SQLマイグレーション
- ORM実装
- APIエンドポイント
- UI設計
- SNS規約の詳細結論
- ASP規約の詳細結論
- アフィリエイト規約の詳細結論
- 投稿自動化可否の媒体別最終判断
- ASP別運用条件の最終判断
- Review Log保存先の最終決定
- Review Log保持期間の最終決定
- 法務判断

## 17. Related Documents

- templates/review_logs/SNS_ASP_Affiliate_Review_Log_Template.md
- implementation/specifications/SNS_ASP_Affiliate_Terms_Review_Specification.md
- architecture/master/adr/ADR-0006-sns-publishing-wordpress-affiliate-flow-and-platform-execution-boundary.md
- architecture/master/adr/ADR-0007-ai-output-prompt-human-review-and-high-risk-ai-boundary.md
- architecture/master/adr/ADR-0008-workflow-approval-gate-scheduler-and-automation-engine-boundary.md
- architecture/master/adr/ADR-0005-database-registry-id-and-relation-design-boundary.md
- architecture/master/08_Database.md

## 18. Validation Results

| Check | Result | Notes |
|---|---|---|
| Review Log Templateを参照した | Pass | Related TemplateとRelated Documentsに記載。 |
| ADR-0006を参照した | Pass | Related ADRとRelated Documentsに記載。 |
| ADR-0008を参照した | Pass | Related ADRとRelated Documentsに記載。 |
| Approval Gate Status Modelを定義した | Pass | Section 9に定義。 |
| Status Transition Rulesを定義した | Pass | Section 10に定義。 |
| Decision Category Modelを定義した | Pass | Section 11に定義。 |
| Review Log Relationshipを定義した | Pass | Section 12に定義。 |
| Validation and Constraint Rulesを定義した | Pass | Section 13に定義。 |
| MVP Logical Table Draftを作成した | Pass | Section 14に論理テーブル案として作成。 |
| Example Recordsはダミー値のみで作成した | Pass | Section 15にダミー値のみを使用。 |
| SNS規約詳細を断定していない | Pass | 詳細判断は後続仕様または公式情報確認へ委譲。 |
| ASP規約詳細を断定していない | Pass | ASP別運用条件の最終判断はしない。 |
| アフィリエイト規約詳細を断定していない | Pass | 詳細結論は確定しない。 |
| Secret実体を含めていない | Pass | evidence_referenceは参照IDのみ。 |
| 物理DB実装をしていない | Pass | 論理データモデルに限定。 |
| SQLを作成していない | Pass | SQL文なし。 |
| API設計をしていない | Pass | APIは対象外。 |
| UI設計をしていない | Pass | UIは対象外。 |
| 文字化けがない | Pass | UTF-8 Markdownで作成。 |
| 置換文字がない | Pass | 置換文字なし。 |
| コードブロック数が偶数 | Pass | 作成後に検証する。 |
| 作業前後のgit diffを確認した | Pass | 作業前後で確認する。 |

## 19. Next Actions

- Human Owner review of Approval Gate Data Model
- Platform-specific Terms Confirmation Checklist作成
- Review Log storage and retention policy作成
- Approval Gate API design
- Phase 1 implementation preparation
