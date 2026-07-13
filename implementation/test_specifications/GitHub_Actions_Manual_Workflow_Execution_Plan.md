# GitHub Actions Manual Workflow Execution Plan

Document Name: Growth Lab Core GitHub Actions Manual Workflow Execution Plan
Related Workflow: .github/workflows/openapi-lint.yml
Related CI Implementation Report: implementation/test_results/openapi/20260710_092659_GitHub_Actions_OpenAPI_Lint_CI_Implementation_Report.md
Related Human Owner Approval: implementation/test_specifications/OpenAPI_CI_Provider_Human_Owner_Approval.md
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related Spectral Config: implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/GitHub_Actions_Manual_Workflow_Execution_Plan.md
Created Date: 2026-07-10
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本計画は、GitHub Actions上でOpenAPI lint workflowをmanual workflow_dispatchにより初回実行する前に、実行条件、確認項目、成功条件、失敗条件、log確認方針、evidence記録方針を明確にする。

- 本計画はmanual workflow executionの前段階である。
- 本計画はGitHub Actionsを実行しない。
- 本計画はGitHub repository settingsを変更しない。
- 本計画はbranch protectionを設定しない。
- 本計画はworkflowのtrigger追加を行わない。

## 2. Scope

対象:

- manual workflow execution objective
- execution preconditions
- target workflow
- target branch or ref
- execution method candidates
- recommended initial execution method
- pre-execution checklist
- manual execution procedure candidate
- expected workflow steps
- success criteria
- failure criteria
- stop conditions
- log review policy
- evidence recording policy
- security and secret review policy
- post-execution report plan
- rollback and remediation policy

対象外:

- GitHub Actions remote execution
- gh workflow run
- git push
- GitHub repository settings変更
- branch protection設定
- pull_request trigger追加
- push trigger追加
- schedule trigger追加
- workflow変更
- OpenAPI Draft変更
- Spectral config変更
- package.json変更
- pnpm-lock.yaml変更
- package script変更
- test_results更新
- API implementation
- DB implementation
- OAuth implementation
- UI implementation
- 法務判断

## 3. Important Notes

This plan does not execute the GitHub Actions workflow.
This plan does not run gh workflow run.
This plan does not push changes to GitHub.
This plan does not modify the workflow file.
This plan does not modify GitHub repository settings.
This plan does not configure branch protection.
This plan does not modify the OpenAPI Draft or Spectral config.

本計画は、GitHub Actions workflowを実行しない。
本計画は、gh workflow runを実行しない。
本計画は、GitHubへpushしない。
本計画は、workflowファイルを変更しない。
本計画は、GitHub repository settingsを変更しない。
本計画は、branch protectionを設定しない。
本計画は、OpenAPI DraftまたはSpectral configを変更しない。

## 4. Relationship to Existing CI Artifacts

| Artifact | Role | Manual Execution Relevance |
|---|---|---|
| .github/workflows/openapi-lint.yml | GitHub Actions OpenAPI lint workflow。 | manual workflow_dispatchで実行する対象workflow。 |
| implementation/test_results/openapi/20260710_092659_GitHub_Actions_OpenAPI_Lint_CI_Implementation_Report.md | workflow実装とローカル検証結果のreport。 | ローカルbaselineとworkflow構成の根拠。 |
| implementation/test_specifications/OpenAPI_CI_Provider_Human_Owner_Approval.md | Human OwnerによるGitHub Actions provider承認記録。 | GitHub Actions manual executionへ進むprovider承認の根拠。 |
| implementation/test_specifications/OpenAPI_CI_Provider_Final_Decision.md | provider決定状態の記録。 | Human Owner承認前のpending状態を参照。 |
| implementation/test_specifications/OpenAPI_CI_Quality_Gate_Plan.md | OpenAPI lint quality gate計画。 | success/failure方針、warning handling、log policyの上位計画。 |
| implementation/test_specifications/OpenAPI_Lint_Result_Logging_Specification.md | lint結果ログ方針。 | 後続manual execution reportの記録方針に関連。 |
| implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md | 直近manual lint baseline。 | Pass、0 findingsの根拠。 |
| implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | lint対象OpenAPI Draft。 | workflow内のlint対象。 |
| implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml | Spectral ruleset。 | workflow内のlint config。 |
| package.json | package scriptsとpackageManager。 | `lint:openapi`、`lint:openapi:version`、pnpm 11.7.0の根拠。 |
| pnpm-lock.yaml | dependency lockfile。 | CI installの前提。 |

## 5. Current Baseline

| Item | Value |
|---|---|
| Approved provider | GitHub Actions |
| Workflow file | .github/workflows/openapi-lint.yml |
| Trigger | workflow_dispatch only |
| Permissions | contents: read only |
| Runner | ubuntu-24.04 |
| Node.js | 24 |
| pnpm | 11.7.0 |
| Install command | pnpm install --frozen-lockfile |
| Version command | pnpm run lint:openapi:version |
| Lint command | pnpm run lint:openapi |
| Latest local workflow YAML parse | Pass |
| Latest local lint result | Pass, 0 errors, 0 warnings, 0 infos, 0 hints |
| Error count | 0 |
| Warning count | 0 |
| Info count | 0 |
| Hint count | 0 |
| Remote GitHub Actions execution | Not executed yet |
| Branch protection | Not configured |
| pull_request trigger | Not added |
| push trigger | Not added |
| schedule trigger | Not added |

## 6. Manual Workflow Execution Objective

manual workflow executionの目的は、GitHub Actionsの実行環境上で、ローカル検証済みのOpenAPI lint workflowが同じくPassすることを確認することである。

- GitHub hosted runner上でdependency installが成功することを確認する。
- `pnpm run lint:openapi:version`が成功することを確認する。
- `pnpm run lint:openapi`が成功することを確認する。
- GitHub Actions logsにSecret、Token、API Key、Passwordが含まれないことを確認する。
- pull_request triggerやpush triggerを有効化する前の初回安全確認とする。

## 7. Execution Preconditions

manual workflow execution前の前提条件:

- Human OwnerがGitHub Actions providerを承認済みである。
- `.github/workflows/openapi-lint.yml` が対象GitHub repositoryの対象branchに存在する。
- workflow triggerは `workflow_dispatch` のみである。
- GitHub repositoryでActionsが利用可能である。
- 実行者がGitHub Actionsを手動実行できる権限を持っている。
- 最新ローカルlint結果がPassである。
- package.json と pnpm-lock.yaml の既存差分の扱いをHuman Ownerが理解している。
- 実行前にworkflow対象branchまたはrefを確認している。

注意:
workflowファイルがGitHub repositoryへpushされていない場合、GitHub上でmanual workflow executionは実行できない。
本計画ではgit pushを実行しない。

## 8. Target Workflow

| Item | Value |
|---|---|
| Workflow name | OpenAPI Lint |
| Workflow path | .github/workflows/openapi-lint.yml |
| Job id | openapi-lint |
| Job name | OpenAPI Spectral Lint |
| Trigger | workflow_dispatch |
| Permissions | contents: read |

## 9. Target Branch or Ref

Target branch or ref is not decided by this plan.

Candidate target refs:

- default branch
- main
- feature branch used for CI setup
- Human Owner-specified branch

manual workflow executionでは、実行対象branchまたはrefを誤ると古いworkflowまたは未反映workflowを実行する可能性がある。
実行前にGitHub上で対象branchまたはrefを確認する。

## 10. Execution Method Candidates

| Method Candidate | Position | Notes |
|---|---|---|
| GitHub web UI manual run | Recommended initial method | Human Ownerがworkflow、branch/ref、result、logsを目視確認しやすい。 |
| GitHub CLI gh workflow run | Deferred | 本計画ではGitHub CLIを使用しない。 |
| GitHub API dispatch | Deferred | 初回実行ではAPI tokenを使用しない方針。 |

## 11. Recommended Initial Execution Method

Recommended initial execution method:
GitHub web UI manual run.

Reason:

- 初回実行時にHuman Ownerがworkflow名、branch/ref、実行結果、job logsを確認しやすい。
- GitHub CLIやAPI tokenを使用しないため、初回のsecret handlingリスクを低くできる。
- 本workflowはworkflow_dispatchのみをtriggerとしているため、manual runと整合する。

注意:
本作業ではGitHub web UIを操作しない。
本作業ではGitHub Actions workflowを実行しない。

## 12. Pre-execution Checklist

- 未確認: GitHub repositoryが確認済みである。
- 未確認: `.github/workflows/openapi-lint.yml` がGitHub repository上に存在する。
- 未確認: workflow名が `OpenAPI Lint` である。
- 未確認: triggerが `workflow_dispatch` のみである。
- 未確認: 対象branchまたはrefが確認済みである。
- 未確認: 実行者にmanual workflow実行権限がある。
- 確認済み: 最新ローカルlint結果がPassである。
- 確認済み: `pnpm run lint:openapi` のbaselineが 0 / 0 / 0 / 0 である。
- 未確認: GitHub Actions実行中にSecretを使用しないことを確認済みである。
- 未確認: 初回実行でpull_request triggerやpush triggerを追加しないことを確認済みである。
- 未確認: 失敗時にOpenAPI DraftやSpectral configを即時修正しない方針を確認済みである。
- 未確認: 実行後report作成方針を確認済みである。

## 13. Manual Execution Procedure Candidate

Candidate procedure using GitHub web UI:

1. GitHub repositoryを開く。
2. Actionsタブを開く。
3. `OpenAPI Lint` workflowを選択する。
4. `Run workflow` を選択する。
5. 対象branchまたはrefを確認する。
6. workflowを実行する。
7. `OpenAPI Spectral Lint` jobの進行状況を確認する。
8. 各stepの成功または失敗を確認する。
9. logsにSecret、Token、API Key、Password、private registry tokenが出力されていないことを確認する。
10. 実行結果をreportへ記録する。

注意:
本作業では上記手順を実行しない。
実行は後続のGitHub Actions manual workflow execution taskで行う。

## 14. Expected Workflow Steps

| Step | Expected Result |
|---|---|
| Checkout repository | Success; credentials are not persisted. |
| Setup pnpm | Success; pnpm 11.7.0 is available. |
| Setup Node.js | Success; Node.js 24 is available. |
| Install dependencies | Success; `pnpm install --frozen-lockfile` completes. |
| Show tool versions | Success; pnpm, Node.js, and Spectral CLI versions are shown. |
| Run OpenAPI lint | Success; `pnpm run lint:openapi` exits with code 0. |

## 15. Success Criteria

manual workflow executionの成功条件:

- workflow runが完了している。
- job `OpenAPI Spectral Lint` が成功している。
- `pnpm install --frozen-lockfile` が成功している。
- `pnpm run lint:openapi:version` が成功している。
- `pnpm run lint:openapi` が成功している。
- lint resultが 0 errors, 0 warnings, 0 infos, 0 hints である。
- tool/config failureがない。
- logsに実在Secret、Token、API Key、Password、private registry tokenが含まれていない。
- OpenAPI Draft、Spectral config、package.json、pnpm-lock.yamlが変更されていない。

## 16. Failure Criteria

manual workflow executionの失敗条件:

- workflow runが失敗する。
- jobが失敗する。
- checkoutが失敗する。
- pnpm setupが失敗する。
- Node.js setupが失敗する。
- `pnpm install --frozen-lockfile`が失敗する。
- `pnpm run lint:openapi:version`が失敗する。
- `pnpm run lint:openapi`がexit code 0以外になる。
- Error、Warning、Info、Hintが発生する。
- tool/config failureが発生する。
- logsにSecret、Token、API Key、Password、private registry tokenの疑いがある情報が出力される。

## 17. Stop Conditions During Execution

後続のmanual workflow execution中に以下が発生した場合は、追加実行や修正を行わず停止する。

- GitHub上にworkflowが表示されない。
- workflow_dispatchで実行できない。
- 対象branchまたはrefが不明である。
- 誤ったbranchまたはrefで実行しそうになった。
- install failureが発生した。
- lint failureが発生した。
- tool/config failureが発生した。
- Secretまたはprivate registry tokenらしき値がlogsに表示された。
- workflowが想定外のtriggerで実行された。
- repository settingsやbranch protection変更が必要になった。

## 18. Log Review Policy

- log確認は最小限かつ目的限定で行う。
- 確認対象はworkflow result、job result、step result、exit code、lint summary、tool/config failure有無とする。
- Secret、Token、API Key、Password、private registry tokenが出力されていないことを確認する。
- log全文の無制限コピーは避ける。
- reportには必要なsummaryのみを記録する。
- raw logを保存する場合は、secret redaction確認後とする。

## 19. Evidence Recording Policy

manual workflow execution後のevidence候補:

- workflow run日時
- workflow run result
- target branch or ref
- job result
- failed stepまたはpassed step summary
- Spectral CLI version
- lint result summary
- Error / Warning / Info / Hint count
- tool/config failure count
- secret review result
- run URLの扱い

注意:
本計画ではGitHub run URLを記録しない。

## 20. Security and Secret Review Policy

- 初回manual workflow executionではCI secretsを使用しない。
- CI variablesを使用しない。
- private registry tokenを使用しない。
- GitHub CLI tokenを使用しない。
- GitHub API tokenを使用しない。
- logsにSecret、Token、API Key、Password、private registry token、個人情報が含まれていないことを確認する。
- もしSecret疑いの文字列が出力された場合は、追加操作を停止し、Human Ownerへ報告する。

## 21. Post-execution Report Plan

後続作業で作成するreport候補:

# GitHub Actions Manual Workflow Execution Report

Document Name: Growth Lab Core GitHub Actions Manual Workflow Execution Report
Related Workflow: .github/workflows/openapi-lint.yml
Related Execution Plan: implementation/test_specifications/GitHub_Actions_Manual_Workflow_Execution_Plan.md
Status: Completed / Failed
Primary Format: Markdown
Created Date: YYYY-MM-DD
Owner: Human Owner
Executor: Human Owner / Codex Support

---

## 1. Purpose

## 2. Execution Summary

## 3. Target Workflow

## 4. Target Branch or Ref

## 5. Execution Method

## 6. Workflow Run Result

## 7. Job Result

## 8. Step Result Summary

## 9. Lint Result Summary

## 10. Log Review Summary

## 11. Security and Secret Review

## 12. Failure Details

## 13. Scope Control Confirmation

## 14. Evidence Summary

## 15. Next Actions

## 22. Rollback and Remediation Policy

- manual workflow execution失敗時に、OpenAPI DraftやSpectral configを即時修正しない。
- 失敗時は原因分類を行い、必要に応じてremediation planningを作成する。
- dependency install failureの場合は、package.json、pnpm-lock.yaml、CI environmentの差分を確認する。
- lint findingの場合は、OpenAPI Draft remediation planningまたはlint config remediation planningに戻す。
- workflow構文またはCI設定問題の場合は、GitHub Actions workflow remediation planningを作成する。
- secret exposure疑いがある場合は、作業を停止し、Human Ownerへ報告する。

## 23. Items Not Executed by This Plan

- GitHub Actions workflow execution
- gh workflow run
- git push
- GitHub web UI operation
- GitHub repository settings変更
- branch protection設定
- CI secrets作成
- workflow変更
- OpenAPI lint再実行

## 24. Out-of-scope Items

- GitHub Actions remote execution
- GitHub CLI実行
- GitHub API実行
- GitHub repository settings変更
- branch protection設定
- pull_request trigger追加
- push trigger追加
- schedule trigger追加
- workflow変更
- OpenAPI Draft修正
- Spectral config修正
- package.json変更
- pnpm-lock.yaml変更
- package script変更
- test_results更新
- API implementation
- DB implementation
- SQL
- OAuth implementation
- UI implementation
- 外部SNS API検証
- ASP連携検証
- 法務判断
- SNS規約詳細判断
- ASP規約詳細判断
- アフィリエイト規約詳細判断

## 25. Acceptance Criteria

- GitHub_Actions_Manual_Workflow_Execution_Plan.md が作成されている。
- CHANGELOG.md が更新されている。
- Current Baselineが記載されている。
- Manual Workflow Execution Objectiveが記載されている。
- Execution Preconditionsが記載されている。
- Target Workflowが記載されている。
- Target Branch or Refが記載されている。
- Execution Method Candidatesが記載されている。
- Recommended Initial Execution Methodが記載されている。
- Pre-execution Checklistが記載されている。
- Manual Execution Procedure Candidateが記載されている。
- Expected Workflow Stepsが記載されている。
- Success Criteriaが記載されている。
- Failure Criteriaが記載されている。
- Stop Conditions During Executionが記載されている。
- Log Review Policyが記載されている。
- Evidence Recording Policyが記載されている。
- Security and Secret Review Policyが記載されている。
- Post-execution Report Planが記載されている。
- Rollback and Remediation Policyが記載されている。
- GitHub Actions workflowを実行していない。
- gh workflow runを実行していない。
- git pushを実行していない。
- GitHubへ接続していない。
- workflowファイルを変更していない。
- OpenAPI Draftを変更していない。
- Spectral configを変更していない。
- package.jsonを変更していない。
- pnpm-lock.yamlを変更していない。
- test_resultsを更新していない。

## 26. Items Deferred to Later Specifications

- GitHub Actions manual workflow execution
- GitHub Actions manual workflow execution report creation
- GitHub Actions workflow remediation planning if needed
- Pull request trigger planning
- Push trigger planning
- Branch protection planning
- PR required check planning
- CI log storage policy
- CI artifact retention policy
- API contract test implementation planning

## 27. Items Not Decided by This Plan

- manual workflow executionの実施日時
- manual workflow execution実行者
- target branch or refの最終決定
- GitHub run URLをreportへ記載するか
- raw logを保存するか
- CI artifactを保存するか
- pull_request triggerをいつ追加するか
- push triggerを追加するか
- branch protectionを設定するか
- PR required checkを設定するか

## 28. Validation Results

| Check | Result | Notes |
|---|---|---|
| openapi-lint.ymlを参照した | Pass | .github/workflows/openapi-lint.ymlを確認。 |
| triggerがworkflow_dispatchのみであることを確認した | Pass | YAML 1.2 parseでworkflow_dispatchのみを確認。 |
| permissionsがcontents: readのみであることを確認した | Pass | contents: readのみ。 |
| CI implementation reportを参照した | Pass | 20260710_092659 reportを確認。 |
| ローカルlint baselineがPassであることを確認した | Pass | Pass、0 / 0 / 0 / 0。 |
| Human Owner approved providerがGitHub Actionsであることを確認した | Pass | Human Owner approval文書を確認。 |
| package.json scriptsを確認した | Pass | `lint:openapi` と `lint:openapi:version` が存在。 |
| Current Baselineを記載した | Pass | Section 5に記載。 |
| Execution Preconditionsを記載した | Pass | Section 7に記載。 |
| Recommended Initial Execution Methodを記載した | Pass | Section 11に記載。 |
| Success Criteriaを記載した | Pass | Section 15に記載。 |
| Failure Criteriaを記載した | Pass | Section 16に記載。 |
| Stop Conditionsを記載した | Pass | Section 17に記載。 |
| Log Review Policyを記載した | Pass | Section 18に記載。 |
| Security and Secret Review Policyを記載した | Pass | Section 20に記載。 |
| GitHub Actions workflowを実行していない | Pass | 本作業では実行していない。 |
| gh workflow runを実行していない | Pass | 本作業では実行していない。 |
| git pushを実行していない | Pass | 本作業では実行していない。 |
| GitHubへ接続していない | Pass | 本作業では接続していない。 |
| workflowファイルを変更していない | Pass | 本作業では未変更。 |
| OpenAPI Draftを変更していない | Pass | 本作業では未変更。 |
| Spectral configを変更していない | Pass | 本作業では未変更。 |
| package.jsonを変更していない | Pass | 本作業では未変更。 |
| pnpm-lock.yamlを変更していない | Pass | 本作業では未変更。 |
| test_resultsを更新していない | Pass | 本作業では未変更。 |
| Secret実体を含めていない | Pass | 実体値なし。 |
| 実在URLを含めていない | Pass | GitHub run URLなし、許容URLのみ。 |
| 文字化けがない | Pass | 確認済み。 |
| 置換文字がない | Pass | 確認済み。 |
| Markdownコードブロック数が偶数 | Pass | 確認済み。 |
| 作業前後のgit diffを確認した | Pass | 確認済み。 |

## 29. Next Actions

Recommended next actions:

1. Human Owner review of GitHub Actions Manual Workflow Execution Plan
2. GitHub Actions manual workflow execution
3. GitHub Actions manual workflow execution report creation
4. Pull request trigger planning
5. API contract test implementation planning
