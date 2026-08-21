# P1 Mock運用検証 詳細設計・受入基準

## 目的

B1EのApproval Gateを、外部接続・永続化・資格情報なしで運用受入する。対象は固定Human Owner actorを使う内部in-memory APIだけであり、実DB、OIDC、外部HTTP、実公開は含まない。

## 対象境界

- 対象パス: `app/`、`src/`、`tests/`、`docs/`、`implementation/`
- 許容: in-memory store、固定actor、状態遷移、監査イベント、品質テスト
- 禁止: DB接続、migration、seed、OIDC/OAuth、外部API、SNS・メール送信、credential、公開運用

## 受入シナリオ

| ID | シナリオ | 受入条件 |
| --- | --- | --- |
| P1-MOCK-001 | DRAFT → REVIEW_REQUIRED → APPROVED | recordVersionが1ずつ増加し、3種のreview checkがPASS、2件の監査イベントが残る。 |
| P1-MOCK-002 | DRAFT → PUBLISHEDの直接実行 | 422 `INVALID_STATUS_TRANSITION` を返し、状態とrecordVersionを変更しない。 |
| P1-MOCK-003 | 不正actorまたはsecret-like入力 | 既存の `in-memory-approval-gate-api.test.ts` でfail-closedの401/403または400と、秘密値を応答へ反映しないことを確認する。 |

## 完了条件

1. P1-MOCK-001〜002はP1受入テスト、P1-MOCK-003は既存API契約テストで自動確認する。
2. `pnpm test`、`pnpm lint`、`pnpm typecheck`、`pnpm format:check`、`pnpm lint:openapi`、`pnpm build` が成功する。
3. 実DB、実OIDC、アプリケーションの外部サービス接続、資格情報読取、Git commit/pushを実施していない。

## 次段階への境界

P1はMock運用検証で完結する。P2の手動連携またはP3の公式API連携は、対象サービス、credential管理、停止条件、受入基準の個別承認後にのみ開始する。

## 実施結果（2026-08-22）

- P1受入テストを含む `pnpm test` は11 test files・208 tests成功、終了コード0。
- `pnpm lint`、`pnpm typecheck`、`pnpm format:check`、`pnpm lint:openapi`、`pnpm build` はすべて終了コード0。
- `git diff --check` は終了コード0。追加差分は本書と `p1-mock-operation-acceptance.test.ts` の2ファイルのみである。
- 実DB接続、migration、seed、実OIDC/IdP、アプリケーションの外部サービス接続、資格情報の読取り、Git commit/pushは実施していない。
