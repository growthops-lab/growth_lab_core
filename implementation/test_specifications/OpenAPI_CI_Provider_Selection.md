# OpenAPI CI Provider Selection

Document Name: Growth Lab Core OpenAPI CI Provider Selection
Related CI Quality Gate Plan: implementation/test_specifications/OpenAPI_CI_Quality_Gate_Plan.md
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related Spectral Config: implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml
Related Logging Specification: implementation/test_specifications/OpenAPI_Lint_Result_Logging_Specification.md
Related Manual Recheck Report: implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/OpenAPI_CI_Provider_Selection.md
Created Date: 2026-07-09
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

本計画は、Approval Gate OpenAPI DraftのSpectral lintを将来CI quality gateへ接続するため、CI provider候補を比較し、Human Ownerが採用判断できる状態にすることを目的とする。

- 本計画はCI実装ではない。
- 本計画はCI providerの最終採用決定ではない。
- 本計画はCI implementation executionの前段階として候補を整理する。
- 手動Lint Pass状態を前提に、最小リスクでCIへ移行する方針を検討する。

## 2. Scope

対象:

- CI provider候補整理
- provider評価基準
- OpenAPI lint quality gateとの相性
- Node.js / pnpm / Spectral CLI実行との相性
- repository hostとの関係
- trigger / branch protectionとの関係
- log / artifact handling
- secret handling
- operational maintenance
- MVP fit assessment
- Human Owner decision points
- provider別のfuture CI implementation scope

対象外:

- CI providerの最終決定
- CI設定ファイル作成
- GitHub Actions設定
- GitLab CI設定
- Azure Pipelines設定
- CircleCI設定
- Spectral lint実行
- OpenAPI Draft変更
- Spectral config変更
- package.json変更
- pnpm-lock.yaml変更
- package script変更
- test_results更新
- CI log実保存
- CI artifact作成
- branch protection設定
- repository settings変更
- API implementation
- DB implementation
- OAuth implementation
- UI implementation
- 法務判断

## 3. Important Notes

This plan does not select or implement a CI provider.
This plan does not create CI configuration files.
This plan does not execute Spectral lint.
This plan does not modify the OpenAPI Draft.
This plan does not modify the Spectral config.
This plan does not modify package.json or pnpm-lock.yaml.
Provider selection and CI implementation are deferred to later tasks after Human Owner review.

本計画は、CI providerを最終選定しない。
本計画は、CI設定ファイルを作成しない。
本計画は、Spectral lintを実行しない。
本計画は、OpenAPI Draftを変更しない。
本計画は、Spectral configを変更しない。
本計画は、package.jsonまたはpnpm-lock.yamlを変更しない。
CI provider選定とCI実装は、Human Owner review後の後続作業へ委譲する。

## 4. Relationship to Existing CI and Lint Artifacts

| Artifact | Role | Provider Selection Relevance |
|---|---|---|
| implementation/test_specifications/OpenAPI_CI_Quality_Gate_Plan.md | OpenAPI lint CI quality gate計画。 | provider選定時の前提、trigger、command、failure policyを参照する。 |
| implementation/test_specifications/OpenAPI_Lint_Result_Logging_Specification.md | lint result logging方針。 | providerごとのlogs、artifacts、Markdown report保存方針の整合先。 |
| implementation/test_specifications/OpenAPI_Lint_Package_Script_Plan.md | package script計画。 | CIでは既存scriptを利用する方針の根拠。 |
| implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md | 最新Manual OpenAPI lint recheck report。 | Provider decision baselineの主要根拠。 |
| implementation/test_results/openapi/20260709_141003_OpenAPI_Lint_Manual_Recheck_Report.md | 直前Manual OpenAPI lint recheck report。 | latest baselineとの比較参考。 |
| implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | OpenAPI Draft本体。 | provider上でlint対象になる候補ファイル。 |
| implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml | Spectral ruleset。 | provider上でlint configとして参照する候補ファイル。 |
| package.json | packageManagerとlint scriptsを保持。 | Node.js / pnpm / Spectral CLI実行設計の参照元。 |
| pnpm-lock.yaml | dependency lockfile。 | install commandとfrozen lockfile利用判断の参照元。 |
| architecture/master/adr/ADR-0003-security-secret-token-and-access-control-boundary.md | secret/token境界のADR。 | CI secrets、variables、private registry tokenの扱いを検討する際に参照する。 |
| architecture/master/adr/ADR-0010-mvp-implementation-architecture-boundary.md | MVP implementation境界のADR。 | CI provider選定と実装をMVP範囲へ接続する際に参照する。 |

## 5. Current Provider Decision Baseline

| Item | Current Status | Source |
|---|---|---|
| Current lint status | Pass, 0 errors, 0 warnings, 0 infos, 0 hints | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Manual recheck baseline | Latest manual recheck completed successfully with no findings | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| CI quality gate plan | Draft created; CI provider remains undecided | implementation/test_specifications/OpenAPI_CI_Quality_Gate_Plan.md |
| CI provider | Not decided by this plan | This selection plan |
| Repository host | Not decided by this plan | Human Owner decision required |
| Branch protection | Not decided by this plan | Human Owner decision required |
| Required checks | Not decided by this plan | Human Owner decision required |
| CI log storage | Not decided by this plan | OpenAPI_Lint_Result_Logging_Specification.md / future policy |
| CI artifact retention | Not decided by this plan | Future policy |
| Known findings | None | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.md |
| Warning handling | Not finally decided; MVP fail candidate from quality gate plan | implementation/test_specifications/OpenAPI_CI_Quality_Gate_Plan.md |

## 6. Provider Selection Principles

- 既存repository hostとの親和性を優先する。
- MVPでは実装負荷が低いproviderを優先候補にする。
- OpenAPI lintを既存package scriptで実行できることを重視する。
- Node.jsとpnpmのsetupが単純であることを重視する。
- CI logsとartifactsの扱いが明確であることを重視する。
- SecretやTokenを露出しない運用が可能であることを重視する。
- 将来branch protectionやPR required checkへ接続しやすいことを評価する。
- provider lock-inリスクを評価する。
- Human Ownerが運用しやすいことを重視する。

## 7. Candidate Provider List

| Candidate | Description | Initial Position |
|---|---|---|
| GitHub Actions | GitHub repositoryを使う場合の標準候補。 | Repository hostがGitHubなら第一候補。 |
| GitLab CI | GitLab repositoryを使う場合の標準候補。 | Repository hostがGitLabなら第一候補。 |
| Local Manual CI-like Workflow | CI provider未決定時の暫定運用候補。 | CI provider採用までのbridge運用。 |
| Other CI Provider | Azure Pipelines、CircleCIなど、repository hostや組織方針に応じた候補。 | 組織標準CIがある場合に再評価。 |

## 8. Evaluation Criteria

| Criterion | Description | Weight Candidate |
|---|---|---|
| Repository host compatibility | 現在または将来のrepository hostと統合しやすいか。 | High |
| Setup simplicity | MVPで設定を始めやすいか。 | High |
| Node.js setup compatibility | Node.js version setupを明確にできるか。 | High |
| pnpm setup compatibility | pnpm versionとpackageManagerを扱いやすいか。 | High |
| OpenAPI lint script compatibility | `pnpm run lint:openapi` を自然に実行できるか。 | High |
| Lockfile handling | `pnpm-lock.yaml` とfrozen lockfile方針を扱いやすいか。 | High |
| Secret handling | secrets、variables、private registry tokenを安全に扱えるか。 | High |
| Log visibility | Human Ownerが実行結果を確認しやすいか。 | Medium |
| Artifact handling | reportやraw logの保存候補を扱いやすいか。 | Medium |
| Branch protection integration | branch protectionやrequired checkへ接続しやすいか。 | Medium |
| PR required check support | PR/MRでquality gateを必須化しやすいか。 | Medium |
| Manual trigger support | Human Ownerが手動実行できるか。 | Medium |
| Maintenance burden | provider固有設定の保守負荷が低いか。 | Medium |
| MVP speed | 初期導入までの速度が速いか。 | High |
| Future scalability | Phase 1以降の拡張に耐えやすいか。 | Medium |
| Human Owner operability | Human Ownerが判断、確認、運用しやすいか。 | High |

## 9. Candidate A: GitHub Actions

概要:
GitHub repositoryを使用する場合の有力候補。

MVP適合:
repository hostがGitHubである場合は高い。

メリット:

- repositoryとCIを同一基盤で管理しやすい。
- pull request、push、manual dispatchなどのtrigger候補と相性がよい。
- Node.js / pnpm / package script実行のworkflowを設計しやすい。
- branch protectionやrequired checkと接続しやすい候補となる。

リスク:

- `.github/workflows` 配下の設定ファイル作成が必要になる。
- GitHub repositoryでない場合は採用しづらい。
- secretsやartifact retentionの設計が必要。
- warningをfail扱いにするかの判断が必要。

本作業での扱い:

- 実装しない。
- 採用決定しない。

## 10. Candidate B: GitLab CI

概要:
GitLab repositoryを使用する場合の有力候補。

MVP適合:
repository hostがGitLabである場合は高い。

メリット:

- GitLab上でrepositoryとCIを統合管理しやすい。
- merge requestやbranch pushのquality gateと接続しやすい候補となる。
- CI variables、artifacts、pipeline logsの管理候補がある。

リスク:

- `.gitlab-ci.yml` の作成が必要になる。
- GitLab repositoryでない場合は採用しづらい。
- runner環境やcache方針の設計が必要。
- secretsやartifact retentionの設計が必要。

本作業での扱い:

- 実装しない。
- 採用決定しない。

## 11. Candidate C: Local Manual CI-like Workflow

概要:
CI providerをまだ決めず、ローカルの手動実行とtimestamped reportで暫定運用する候補。

MVP適合:
CI provider未決定時の暫定運用として高い。

メリット:

- 追加CI設定なしで開始できる。
- 既存のManual OpenAPI lint recheck運用を継続できる。
- provider選定前でも品質確認を継続できる。
- 実装負荷が低い。

リスク:

- 自動化されない。
- 実行漏れが発生する可能性がある。
- pull requestやpush時の自動quality gateにはならない。
- Human Ownerまたは担当者の運用負荷が残る。

本作業での扱い:

- 暫定候補として整理する。
- CI provider採用の代替ではなく、CI実装前のbridge運用として扱う。

## 12. Candidate D: Other CI Provider

概要:
Azure Pipelines、CircleCI、その他CI providerを候補として残す。

MVP適合:
既存組織基盤やrepository hostが該当providerと連携している場合に検討する。

メリット:

- 組織標準のCI基盤に合わせられる可能性がある。
- 既存運用ルールに乗せられる可能性がある。

リスク:

- 個別providerごとの設定調査が必要。
- MVPでは調査と実装の負荷が増える可能性がある。
- repository hostとの連携、secrets、artifacts、runner設定の確認が必要。

本作業での扱い:

- 保留候補として整理する。
- Human Ownerが組織標準CIを指定する場合に再評価する。

## 13. Comparison Matrix

| Criterion | GitHub Actions | GitLab CI | Local Manual CI-like Workflow | Other CI Provider |
|---|---|---|---|---|
| Repository host compatibility | High if GitHub | High if GitLab | Not applicable | Unknown |
| Setup simplicity | High | High | High | Medium |
| MVP speed | High if GitHub | High if GitLab | High | Medium |
| Automation level | High | High | Low | Medium |
| Manual trigger support | High | High | High | Unknown |
| PR/MR quality gate suitability | High | High | Low | Medium |
| Branch protection suitability | High | High | Low | Medium |
| Node.js/pnpm setup clarity | High | High | Medium | Medium |
| Log handling clarity | High | High | Medium | Unknown |
| Artifact handling clarity | High | High | Medium | Unknown |
| Secret handling clarity | High | High | Medium | Unknown |
| Maintenance burden | Medium | Medium | Low | Unknown |
| Future scalability | High | High | Low | Medium |
| Human Owner operability | Medium | Medium | High for manual control | Unknown |

## 14. MVP Fit Assessment

MVP観点では、repository hostが明確であれば、そのhostに統合されたCI providerを優先候補にする。
repository hostが未決定、またはCI実装を急がない場合は、Local Manual CI-like Workflowを暫定運用として継続する。

| Situation | Recommended Candidate | Notes |
|---|---|---|
| Repository is GitHub | GitHub Actions | CI設定作成前にHuman Owner approvalが必要。 |
| Repository is GitLab | GitLab CI | CI設定作成前にHuman Owner approvalが必要。 |
| Repository host is not decided | Local Manual CI-like Workflow | provider選定までmanual recheckを継続する。 |
| Organization standard CI exists | Other CI Provider | 組織標準、secrets、artifacts、runner方針を確認する。 |
| MVP speed is highest priority | Local Manual CI-like Workflow, then host-integrated provider | 自動化より先に品質確認継続を優先できる。 |
| Branch protection is highest priority | GitHub Actions or GitLab CI depending on host | required check化はHuman Owner decision後。 |

## 15. Security and Secret Handling Assessment

- どのproviderでもSecret実値を文書化しない。
- CI variablesやsecretsを登録する前にHuman Owner approvalを必要とする。
- OpenAPI lintでは現時点で外部API credentialを必要としない。
- private registry tokenが必要になった場合は、Secret handling policyとADR-0003に従う。
- CI logsやartifactsにSecret、Token、API Key、Password、private registry token、個人情報を保存しない。

## 16. Log and Artifact Handling Assessment

- CI provider built-in logsは候補だが、保存期間と閲覧権限の確認が必要。
- Markdown reportをrepositoryに保存する運用は証跡として有効だが、CI自動生成を行うかは後続判断とする。
- CI artifactsを使う場合は保存期間、アクセス権限、Secret redactionを確認する。
- Local Manual CI-like Workflowでは implementation/test_results/openapi のtimestamped reportを継続利用する。

## 17. Repository and Branch Protection Considerations

- branch protectionを使うかは本計画では決定しない。
- PR/MR required checkを有効化する前にHuman Owner approvalを必要とする。
- main branchへのpush時にCIを必須化するかは後続判断とする。
- MVP初期ではmanual triggerまたはPR/MR triggerから開始する候補とする。

## 18. Operational Maintenance Considerations

- CI providerごとにNode.js、pnpm、cache、artifact、secret設定の保守が必要になる。
- packageManagerやlockfile変更時はCI定義の更新が必要になる可能性がある。
- Spectral CLI version更新時はCI結果の差分が出る可能性がある。
- warning policy変更時はCI quality gateの判定条件見直しが必要になる。
- Human Ownerまたは運用担当者がCI failureを確認できる導線が必要である。

## 19. Recommended MVP Direction

Recommended MVP direction:

1. repository hostをHuman Ownerが確認する。
2. repository hostがGitHubであればGitHub Actionsを第一候補にする。
3. repository hostがGitLabであればGitLab CIを第一候補にする。
4. repository hostが未決定の場合はLocal Manual CI-like Workflowを暫定継続する。
5. 組織標準CIがある場合はOther CI Providerとして再評価する。

Recommendation pending Human Owner decision.

理由:
CI providerはrepository host、branch protection方針、artifact保存方針、secret handling方針に依存するため、本計画では最終決定しない。

## 20. Human Owner Decision Points

Human Owner approvalが必要なポイント:

- repository hostを確定する前
- CI providerを選定する前
- CI設定ファイルを作成する前
- CI triggerを有効化する前
- PR/MR required checkを有効化する前
- branch protectionに接続する前
- CI logs保存先を確定する前
- CI artifact保存方針を確定する前
- secretsまたはCI variablesを登録する前
- warningをfailまたはallow扱いにする前
- known findingを許容する前

## 21. Future CI Implementation Scope by Provider

| Provider Candidate | Future Implementation Scope |
|---|---|
| GitHub Actions | CI設定ファイル作成候補、Node.js setup候補、pnpm setup候補、dependency install候補、lint:openapi:version実行候補、lint:openapi実行候補、log / artifact handling候補、CHANGELOG更新候補。 |
| GitLab CI | CI設定ファイル作成候補、Node.js setup候補、pnpm setup候補、dependency install候補、lint:openapi:version実行候補、lint:openapi実行候補、log / artifact handling候補、CHANGELOG更新候補。 |
| Local Manual CI-like Workflow | CI設定ファイル作成なし、Node.js / pnpmはlocal environmentを使用、dependency installは必要時のみ、lint:openapi:version実行候補、lint:openapi実行候補、timestamped report継続候補、CHANGELOG更新候補。 |
| Other CI Provider | provider固有のCI設定ファイル作成候補、Node.js setup候補、pnpm setup候補、dependency install候補、lint:openapi:version実行候補、lint:openapi実行候補、log / artifact handling候補、CHANGELOG更新候補。 |

## 22. Future Verification Candidate Commands

将来のCI implementation後に確認する候補コマンド:

```powershell
pnpm --version
node --version
pnpm run lint:openapi:version
pnpm run lint:openapi
```

必要に応じて以下も候補とする:

```powershell
node -e "require('yaml').parse(require('fs').readFileSync('implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml','utf8')); console.log('OpenAPI Draft YAML parse OK')"
node -e "require('yaml').parse(require('fs').readFileSync('implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml','utf8')); console.log('Spectral config YAML parse OK')"
```

本作業では実行しない。

## 23. Risk Review

- repository host未確認のままproviderを決めると手戻りが発生する。
- CI provider固有の設定に依存しすぎると移行コストが増える。
- branch protectionを急いで有効化すると開発作業が止まる可能性がある。
- warningをallowにすると品質退行を見逃す可能性がある。
- warningをfailにすると初期開発速度が落ちる可能性がある。
- CI logsにSecretが出力されると重大なセキュリティ事故になる。
- artifact retentionを決めずにCIを導入すると証跡管理が曖昧になる。
- ローカル環境とCI環境のNode/pnpm差異で結果が変わる可能性がある。
- 未追跡ファイルが多い状態でCI接続すると対象ファイルの取り込み漏れが起きる可能性がある。

## 24. Out-of-scope Items

- CI provider最終決定
- CI設定ファイル作成
- GitHub Actions設定
- GitLab CI設定
- Azure Pipelines設定
- CircleCI設定
- Spectral lint実行
- OpenAPI Draft修正
- Spectral config修正
- package.json変更
- pnpm-lock.yaml変更
- package script変更
- test_results更新
- CI log実保存
- CI artifact作成
- branch protection設定
- repository settings変更
- test implementation
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

- OpenAPI_CI_Provider_Selection.md が作成されている。
- CHANGELOG.md が更新されている。
- Current Provider Decision Baselineが記載されている。
- Provider Selection Principlesが記載されている。
- Candidate Provider Listが記載されている。
- Evaluation Criteriaが記載されている。
- Candidate A GitHub Actionsを記載している。
- Candidate B GitLab CIを記載している。
- Candidate C Local Manual CI-like Workflowを記載している。
- Candidate D Other CI Providerを記載している。
- Comparison Matrixを記載している。
- MVP Fit Assessmentを記載している。
- Security and Secret Handling Assessmentを記載している。
- Log and Artifact Handling Assessmentを記載している。
- Repository and Branch Protection Considerationsを記載している。
- Operational Maintenance Considerationsを記載している。
- Recommended MVP Directionを記載している。
- Human Owner Decision Pointsを記載している。
- Future CI Implementation Scope by Providerを記載している。
- Future Verification Candidate Commandsを記載している。
- Risk Reviewを記載している。
- CI providerを最終決定していない。
- CI設定ファイルを作成していない。
- .githubフォルダを作成していない。
- Spectral lintを実行していない。
- OpenAPI Draftを変更していない。
- Spectral configを変更していない。
- package.jsonを変更していない。
- pnpm-lock.yamlを変更していない。
- package scriptを変更していない。
- test_resultsを更新していない。

## 26. Items Deferred to Later Specifications

- CI provider final decision
- CI implementation execution
- CI log storage policy
- CI artifact retention policy
- branch protection planning
- PR/MR required check planning
- known finding exception policy
- API contract test implementation planning
- Phase 1 implementation preparation

## 27. Items Not Decided by This Selection Plan

- CI provider
- repository host
- CI triggerの最終範囲
- warningをfail扱いにするか
- info/hintを完全にallowするか
- CI logsの保存先
- CI artifactsの保存期間
- branch protectionの有無
- PR/MR required checkの有無
- known findingの最大許容期間
- CIでMarkdown reportを自動生成するか
- CI implementation executionの実施日

## 28. Validation Results

| Check | Result | Notes |
|---|---|---|
| OpenAPI_CI_Quality_Gate_Plan.mdを参照した | Pass | implementation/test_specifications/OpenAPI_CI_Quality_Gate_Plan.mdが存在し、CI provider未決定であることを確認。 |
| 最新Manual OpenAPI lint recheck reportを参照した | Pass | implementation/test_results/openapi/20260709_144207_OpenAPI_Lint_Manual_Recheck_Report.mdを参照。 |
| 最新Manual OpenAPI lint recheckがPassであることを確認した | Pass | Result Pass、Exit code 0、0 errors / 0 warnings / 0 infos / 0 hints。 |
| OpenAPI_Lint_Result_Logging_Specification.mdを参照した | Pass | implementation/test_specifications/OpenAPI_Lint_Result_Logging_Specification.mdが存在。 |
| OpenAPI_Lint_Package_Script_Plan.mdを参照した | Pass | implementation/test_specifications/OpenAPI_Lint_Package_Script_Plan.mdが存在。 |
| package.json scriptsを確認した | Pass | `lint:openapi` と `lint:openapi:version` が存在。 |
| Current Provider Decision Baselineを記載した | Pass | Section 5に記載。 |
| Provider Selection Principlesを記載した | Pass | Section 6に記載。 |
| Candidate Provider Listを記載した | Pass | Section 7に記載。 |
| Evaluation Criteriaを記載した | Pass | Section 8に記載。 |
| Comparison Matrixを記載した | Pass | Section 13に記載。 |
| Recommended MVP Directionを記載した | Pass | Section 19に記載。 |
| Human Owner Decision Pointsを記載した | Pass | Section 20に記載。 |
| Future CI Implementation Scope by Providerを記載した | Pass | Section 21に記載。 |
| CI providerを最終決定していない | Pass | Recommendation pending Human Owner decisionとして記載。 |
| Spectral lintを実行していない | Pass | 本作業では実行していない。 |
| CI設定ファイルを作成していない | Pass | `.github`、`.gitlab-ci.yml`、`azure-pipelines.yml`、`circle.yml`を作成していない。 |
| OpenAPI Draftを変更していない | Pass | 本作業の変更対象外。 |
| Spectral configを変更していない | Pass | 本作業の変更対象外。 |
| package.jsonを変更していない | Pass | 本作業の変更対象外。 |
| pnpm-lock.yamlを変更していない | Pass | 本作業の変更対象外。 |
| test_resultsを更新していない | Pass | 本作業では読み取りのみ。 |

## 29. Next Actions

1. Human Owner review of OpenAPI CI Provider Selection
2. CI provider final decision
3. CI implementation execution
