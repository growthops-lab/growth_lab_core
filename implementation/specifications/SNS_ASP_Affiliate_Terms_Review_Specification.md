# SNS / ASP / Affiliate Terms Review Specification

Document Name: Growth Lab Core SNS / ASP / Affiliate Terms Review Specification
Related ADR: ADR-0006
Status: Draft
Primary Format: Markdown
Target File: implementation/specifications/SNS_ASP_Affiliate_Terms_Review_Specification.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

- 本仕様書はADR-0006のAccepted条件に基づく後続仕様である。
- 本仕様書はMVPでの承認ゲート管理とHuman Reviewを定義する。
- 本仕様書はSNS、ASP、アフィリエイト規約の詳細結論を確定しない。
- 本仕様書は、規約確認を安全に運用へ組み込むための確認プロセスを定義する。
- 本仕様書は法務判断書ではない。

## 2. Scope

対象:

- SNS投稿
- WordPress投稿
- ASPリンク
- アフィリエイトリンク
- 広告表記、PR表記、アフィリエイト表記
- 投稿前Human Review
- Approval Gate
- Evidence / Review Log

対象外:

- SNS規約の最終解釈
- ASP規約の最終解釈
- アフィリエイト規約の最終解釈
- 媒体別投稿自動化可否の最終判断
- ASP別運用条件の最終判断
- 法務判断
- 公式規約ページの調査

## 3. Important Notes

- This specification does not finalize SNS, ASP, or affiliate terms interpretation.
- This specification defines MVP approval gate management and review logging.
- Detailed terms review is delegated to later specifications or official-source confirmation.
- MVP does not automatically decide platform-specific terms compliance.
- This specification is not legal advice.

日本語での重要事項:

- 本仕様書は、SNS、ASP、アフィリエイト規約の詳細判断を確定しない。
- 本仕様書は、MVPにおける承認ゲート管理と確認記録を定義する。
- 詳細な規約判断は、後続仕様または公式情報確認へ委譲する。
- MVPでは、媒体別規約適合性を自動で最終判断しない。
- 本仕様書は法務判断書ではない。

## 4. Relationship to ADR-0006

ADR-0006でAccepted条件として、SNS・ASP・アフィリエイト規約確認は後続仕様へ委譲された。

ADR-0006のAccepted条件として、SNS・ASP・アフィリエイト規約確認を後続仕様へ委譲する。

ADR-0006でAccepted条件として、MVPでは承認ゲート管理を行うことが定義された。

本仕様書は、その後続仕様として作成される。

## 5. MVP Policy

MVPで実施する:

- 投稿前承認ゲート管理
- Human Review
- Evidence / Review Log記録
- 承認状態の管理
- 未確認項目のブロック
- 後続仕様へ委譲する項目の明示

MVPで実施しない:

- 規約詳細の自動判定
- 媒体別規約の最終解釈
- ASP別運用条件の最終解釈
- 法務判断
- 承認なしの自動投稿実行

## 6. Responsibility Boundary

| Area | MVP Responsibility | Human Owner Responsibility | Later Specification Responsibility | Notes |
|---|---|---|---|---|
| SNS規約確認 | 確認要否を記録し、未確認ならBlockedまたはDeferredにする。 | 規約確認を進めるか、MVP対象外にするか判断する。 | 公式情報確認に基づく媒体別ルールを整理する。 | MVPでは詳細結論を出さない。 |
| ASP規約確認 | ASP条件確認要否をReview Logに記録する。 | 利用ASP、案件、導線の許容範囲を判断する。 | ASP別運用条件を仕様化する。 | 未確認ASP条件は自動実行しない。 |
| アフィリエイト規約確認 | 表記とリンク利用の確認要否を記録する。 | 収益化導線の運用可否を判断する。 | 案件別、媒体別の確認ルールを整理する。 | 法務判断は本仕様の範囲外。 |
| 投稿自動化可否 | Approved状態のみ自動実行可能にする。 | 自動化範囲の許容度を判断する。 | 媒体別の投稿自動化可否を確認する。 | MVPでは媒体別最終判断をしない。 |
| 広告表記 | 表記要否をReview Checklistで確認する。 | 表記方針の採用可否を判断する。 | 表記ルールとテンプレートを定義する。 | 安全側に倒す。 |
| PR表記 | PR表記要否を確認する。 | 表記が必要な運用範囲を判断する。 | 媒体別のPR表記ルールを整理する。 | 最終判断は後続仕様。 |
| アフィリエイト表記 | Affiliate表記要否を確認する。 | 表記方針を承認する。 | 案件別表記ルールを整理する。 | 未確認ならDeferredまたはBlocked。 |
| 媒体別禁止表現 | 禁止表現チェックの要否を記録する。 | 高リスク表現の扱いを判断する。 | 媒体別禁止表現リストを作成する。 | AI生成物はHuman Review対象。 |
| ASP別運用条件 | ASP条件不明時はPublishedへ進めない。 | ASP別運用方針を判断する。 | ASP別チェックリストを作成する。 | MVPでは最終判断しない。 |
| 投稿前承認 | Review RequiredからApprovedへの遷移を管理する。 | 承認者または承認責任者を決める。 | 承認権限と例外フローを詳細化する。 | DraftからPublishedへ直接進めない。 |
| Evidence / Review Log | 確認結果、判断理由、後続確認項目を記録する。 | 記録粒度と保管方針を判断する。 | Evidence保存項目と保管期間を定義する。 | Secret実体は記録しない。 |

## 7. Review Targets

| Review Target | Description | Required in MVP | Final Judgment in MVP | Notes |
|---|---|---|---|---|
| SNS投稿本文 | SNSに掲載する本文。 | Yes | No | 規約適合性の最終判断は後続確認へ委譲。 |
| SNS投稿画像 | SNS投稿に添付する画像。 | Yes | No | 画像内表記、禁止表現、権利確認をHuman Review対象にする。 |
| SNS投稿URL | 投稿に含めるURL。 | Yes | No | 短縮URL、Affiliate link、WordPress導線を確認する。 |
| WordPress本文 | WordPress記事本文。 | Yes | No | 表記、リンク、禁止表現を確認する。 |
| WordPress内リンク | 内部リンク、外部リンク、Affiliate link。 | Yes | No | 承認済みリンクのみ利用する。 |
| ASPリンク | ASP案件由来のリンク。 | Yes | No | ASP条件未確認ならBlockedまたはDeferred。 |
| アフィリエイトリンク | 収益化リンク。 | Yes | No | 直接投稿可否は媒体別に後続確認する。 |
| 広告表記 | 広告、PR、Affiliateに関する表示。 | Yes | No | 安全側の表記方針を採用する。 |
| PR表記 | PR関係の明示。 | Yes | No | 必要性は後続仕様で確認する。 |
| アフィリエイト表記 | Affiliate関係の明示。 | Yes | No | 案件別、媒体別の確認が必要。 |
| 禁止表現 | 媒体、ASP、案件で避けるべき表現。 | Yes | No | AI生成物はHuman Review必須。 |
| 投稿スケジュール | 投稿予約日時と頻度。 | Yes | No | 承認前予約、過剰投稿を避ける。 |
| 自動投稿設定 | Scheduler、Automation実行設定。 | Yes | No | ApprovedなしにPublishedへ進めない。 |

## 8. Approval Gate Design

Approval Gate Status:

- Draft
- Review Required
- Approved
- Blocked
- Deferred
- Published
- Archived

| Status | Meaning | Allowed Next Status | Required Evidence | Notes |
|---|---|---|---|---|
| Draft | 投稿案または記事案の作成中。 | Review Required, Archived | content_id, content_type | Publishedへ直接遷移しない。 |
| Review Required | Human Reviewが必要。 | Approved, Blocked, Deferred | reviewer, checklist result | 規約確認要否を記録する。 |
| Approved | 投稿または公開に進める承認済み状態。 | Published, Archived | approval record, decision_reason | ApprovedなしにPublishedへ進めない。 |
| Blocked | 問題があり公開不可。 | Review Required, Deferred, Archived | blocked reason | 理由を必ず記録する。 |
| Deferred | 後続確認へ回す状態。 | Review Required, Archived | deferred_items | 後続確認事項を明示する。 |
| Published | 承認済みで公開済み。 | Archived, Review Required | published_at, approval reference | 次回レビュー対象にできる。 |
| Archived | 保管または運用終了。 | Review Required | archive reason | 再利用時は再レビューする。 |

ルール:

- DraftからPublishedへ直接遷移しない。
- Review Requiredを経由する。
- ApprovedなしにPublishedへ進めない。
- Blockedの場合は理由を記録する。
- Deferredの場合は後続確認事項を記録する。
- Published後はArchivedまたは次回レビュー対象として管理する。

## 9. Human Review Checklist

| Check Item | Required | Reviewer | Evidence Required | Pass Condition | Notes |
|---|---|---|---|---|---|
| SNS規約確認が必要か | Yes | Human Reviewer | review_status, decision_reason | 確認要否が記録されている。 | 詳細判断は後続仕様。 |
| ASP規約確認が必要か | Yes | Human Reviewer | asp_terms_check_required | 確認要否が記録されている。 | ASP別最終判断はしない。 |
| アフィリエイト表記が必要か | Yes | Human Reviewer | affiliate_label_required | 表記要否が記録されている。 | 安全側に倒す。 |
| PR表記が必要か | Yes | Human Reviewer | pr_label_required | 表記要否が記録されている。 | 後続仕様で詳細化。 |
| 広告表記が必要か | Yes | Human Reviewer | advertising_label_required | 表記要否が記録されている。 | 表記テンプレートは後続。 |
| 禁止表現が含まれていないか | Yes | Human Reviewer | prohibited_expression_check | 問題なし、またはBlocked理由あり。 | AI生成物も対象。 |
| 投稿先媒体が確認済みか | Yes | Human Reviewer | platform | 媒体が記録されている。 | 媒体別可否は後続確認。 |
| ASPリンクの利用条件確認が必要か | Yes | Human Reviewer | asp_terms_check_required | 必要/不要/Deferredが記録されている。 | 未確認ならPublished不可。 |
| 自動投稿可否確認が必要か | Yes | Human Reviewer | approval_gate_status | Approvedなしに実行しない。 | 媒体別最終判断はしない。 |
| Human Owner承認があるか | Yes | Human Owner / Reviewer | approval record | ApprovedまたはDeferred/Blockedが記録されている。 | 高リスク時はOwner判断。 |

## 10. Evidence and Review Log

| Field | Required | Description | Example Value |
|---|---|---|---|
| review_id | Yes | Review Logの識別子。 | review_000001 |
| content_id | Yes | 対象コンテンツの識別子。 | content_000001 |
| platform | Yes | 投稿または公開先。 | X, WordPress, Instagram, Pinterest |
| content_type | Yes | コンテンツ種別。 | sns_post, wordpress_article, image_asset |
| review_status | Yes | Review結果。 | pass, blocked, deferred |
| reviewer | Yes | Review担当者または役割。 | human_reviewer |
| reviewed_at | Yes | Review日時。 | 2026-07-08T00:00:00Z |
| approval_gate_status | Yes | Approval Gate状態。 | Approved |
| sns_terms_check_required | Yes | SNS規約確認要否。 | true |
| asp_terms_check_required | Yes | ASP規約確認要否。 | true |
| affiliate_terms_check_required | Yes | Affiliate規約確認要否。 | true |
| advertising_label_required | Yes | 広告表記要否。 | true |
| pr_label_required | Yes | PR表記要否。 | true |
| affiliate_label_required | Yes | Affiliate表記要否。 | true |
| prohibited_expression_check | Yes | 禁止表現確認結果。 | no_issue_found |
| evidence_reference | Yes | Evidence参照。Secret実体は含めない。 | evidence_ref_000001 |
| decision_reason | Yes | 判断理由。 | approved_after_manual_review |
| deferred_items | No | 後続確認事項。 | asp_terms_detail_check |
| next_review_required | Yes | 次回Review要否。 | true |

## 11. Decision Categories

| Decision Category | Meaning | Allowed Action | Required Record |
|---|---|---|---|
| Approved for MVP publishing | MVP範囲で公開可能。 | Publishedへ進める。 | approval record, decision_reason |
| Approved with manual review | 手動確認付きで進行可能。 | ApprovedまたはReview Requiredへ進める。 | reviewer, manual review note |
| Blocked due to missing evidence | Evidence不足。 | Published不可。 | blocked reason |
| Blocked due to terms uncertainty | 規約不確実性が高い。 | Published不可。 | uncertainty reason, deferred_items |
| Deferred to later specification | 後続仕様へ委譲。 | Deferredへ進める。 | handoff item |
| Requires Human Owner decision | Owner判断が必要。 | Human Owner判断待ち。 | owner decision request |
| Requires official-source confirmation | 公式情報確認が必要。 | DeferredまたはBlocked。 | official-source confirmation item |

## 12. Items Delegated to Later Specifications

| Item | Delegation Reason | Required Later Output |
|---|---|---|
| SNS規約確認 | 媒体別の公式情報確認が必要。 | Platform-specific terms checklist |
| ASP規約確認 | ASP別、案件別の条件確認が必要。 | ASP terms operation matrix |
| アフィリエイト規約確認 | 表記、リンク、導線の詳細確認が必要。 | Affiliate disclosure and link policy |
| 投稿自動化可否 | 媒体別のAutomation可否確認が必要。 | Automation permission checklist |
| 広告表記、PR表記、アフィリエイト表記 | 表記ルールの詳細化が必要。 | Labeling template and review rule |
| 媒体別禁止表現 | 媒体ごとの禁止表現整理が必要。 | Prohibited expression list |
| ASP別運用条件 | ASP別条件の差異整理が必要。 | ASP-specific operation checklist |
| Human Review項目 | Review項目の運用詳細化が必要。 | Human Review operation checklist |
| Approval Gate項目 | 状態遷移と権限の詳細化が必要。 | Approval gate data model |
| Evidence / Review Log記録 | 記録項目、保管、参照権限の詳細化が必要。 | Review log schema and retention policy |

## 13. Items Not Decided in MVP

- SNS規約の詳細結論
- ASP規約の詳細結論
- アフィリエイト規約の詳細結論
- 投稿自動化可否の媒体別最終判断
- ASP別運用条件の最終判断
- 法務判断

## 14. Operational Flow

1. 投稿案をDraftとして作成する。
2. SNS、ASP、アフィリエイト関連の確認要否を判定する。
3. Review Requiredへ進める。
4. Human Review Checklistに基づいて確認する。
5. Evidence / Review Logを記録する。
6. 問題がなければApprovedへ進める。
7. 不明点があればDeferredまたはBlockedへ進める。
8. ApprovedのものだけPublishedへ進める。
9. Published後はArchivedまたは次回レビュー対象として管理する。

## 15. Risk Controls

- 承認なしの自動投稿を防ぐ。
- 規約未確認の投稿をPublishedにしない。
- ASPリンクやアフィリエイトリンクの利用条件不明時はBlockedまたはDeferredにする。
- Evidenceがない承認を避ける。
- AI生成物はHuman Reviewを通す。
- 高リスク投稿はHuman Owner Decisionに回す。

## 16. Validation Results

| Check | Result | Notes |
|---|---|---|
| ADR-0006を参照した | Pass | Accepted条件3点を確認済み。 |
| Accepted_ADR_Light_Review.mdを参照した | Pass | 引き継ぎ項目を反映。 |
| ADR-0006条件3点を反映した | Pass | 後続仕様委譲、承認ゲート管理、詳細判断委譲を記載。 |
| SNS規約詳細を断定していない | Pass | 最終判断は後続仕様または公式情報確認へ委譲。 |
| ASP規約詳細を断定していない | Pass | ASP別運用条件は後続確認。 |
| アフィリエイト規約詳細を断定していない | Pass | 詳細結論は確定していない。 |
| MVPでは承認ゲート管理を定義した | Pass | Approval Gate Statusと遷移ルールを定義。 |
| Human Review Checklistを定義した | Pass | 10項目を定義。 |
| Evidence / Review Log項目を定義した | Pass | 19項目を定義。 |
| ADR本文を変更していない | Pass | 本作業ではADR本文を変更していない。 |
| ADR READMEを変更していない | Pass | 本作業ではADR READMEを変更していない。 |
| Secret実体を含めていない | Pass | Secret、Token、API Key実体なし。 |
| 文字化けがない | Pass | 指定文字化けパターンなし。 |
| 置換文字がない | Pass | 置換文字なし。 |
| コードブロック数が偶数 | Pass | コードブロック数は偶数。 |
| 作業前後のgit diffを確認した | Pass | 作業前後で確認。 |

## 17. Next Actions

- Human Owner review of this specification
- Create review log template
- Create approval gate data model
- Create platform-specific terms confirmation checklist
- Create ADR README minor cleanup task for AALR-0001
