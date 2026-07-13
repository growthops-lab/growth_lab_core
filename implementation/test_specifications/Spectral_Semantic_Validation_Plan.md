# Spectral Semantic Validation Plan

Document Name: Growth Lab Core Spectral Semantic Validation Plan
Related OpenAPI Draft: implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml
Related Spectral Config: implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml
Related Lint Specification: implementation/test_specifications/OpenAPI_Lint_Specification.md
Related Tool Selection: implementation/test_specifications/OpenAPI_Lint_Tool_Selection.md
Status: Draft
Primary Format: Markdown
Target File: implementation/test_specifications/Spectral_Semantic_Validation_Plan.md
Created Date: 2026-07-08
Owner: Human Owner
Reviewer: Human Owner / Codex Support

---

## 1. Purpose

This plan defines future Spectral semantic validation execution planning for Approval Gate OpenAPI Draft and Spectral lint config draft.

This plan organizes execution targets, execution conditions, success conditions, failure conditions, and remediation policy before Spectral CLI installation.

This plan complements OpenAPI Lint Specification and OpenAPI Lint Tool Selection.

This plan does not install Spectral CLI, run Spectral CLI, or change lint settings.

## 2. Scope

In scope:

- Semantic validation purpose
- Target files
- Prerequisites
- Candidate commands for later use
- Severity mapping
- Validation result categories
- Failure handling
- Warning handling
- Result review workflow
- Remediation decision flow
- Evidence recording policy
- Human Owner approval points

Out of scope:

- Spectral CLI installation
- Spectral CLI execution
- Redocly CLI installation
- Lint config changes
- OpenAPI Draft changes
- package.json changes
- pnpm-lock.yaml changes
- package script additions
- CI settings
- test code implementation
- API implementation
- DB implementation
- OAuth implementation
- UI implementation
- legal judgment
- final interpretation of SNS terms
- final interpretation of ASP terms
- final interpretation of affiliate terms

## 3. Important Notes

This plan does not install or execute Spectral CLI.

This plan does not modify the OpenAPI draft or Spectral lint config.

This plan defines future semantic validation planning for Approval Gate OpenAPI quality checks.

Secret values, tokens, API keys, passwords, and recovery codes must not be used in examples, commands, outputs, requests, responses, or error messages.

Detailed SNS, ASP, and affiliate terms review is delegated to later specifications or official-source confirmation.

本計画は、Spectral CLIの導入や実行を行わない。

本計画は、OpenAPI DraftやSpectral lint configを変更しない。

本計画は、Approval Gate OpenAPI品質確認のための将来のsemantic validation計画を定義する。

Secret、Token、API Key、Password、Recovery Codeなどの実体値を例、コマンド、出力例、Request、Response、Error Messageに使用しない。

SNS、ASP、アフィリエイト規約の詳細確認は、後続仕様または公式情報確認へ委譲する。

## 4. Relationship to Existing OpenAPI Lint Artifacts

- OpenAPI Lint Specification defines lint rules and severity policy.
- OpenAPI Lint Tool Selection identifies Spectral CLI as the MVP Primary candidate.
- approval_gate_openapi_spectral.yaml is the Spectral CLI MVP ruleset draft.
- This plan defines how the ruleset draft should be validated by Spectral CLI in a future task.
- This plan does not replace the lint config or OpenAPI Draft.

## 5. Semantic Validation Principles

- Semantic validation checks ruleset interpretation and lint execution results that YAML parse cannot detect.
- MVP starts with manual execution before CI integration.
- CI connection is deferred to later specifications.
- Spectral error is treated as Blocker or Critical equivalent.
- Spectral warn is treated as Major equivalent.
- Spectral info and hint are treated as Minor or Info equivalent.
- Findings related to real URL, Secret, Token, API Key, or Password must be handled first.
- Do not auto-fix findings. Classify the cause first.

## 6. Current Validation Status

| Item | Current Status | Notes |
|---|---|---|
| Approval Gate OpenAPI Draft | Created | implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml exists. |
| OpenAPI version | 3.1.0 | Confirmed from OpenAPI Draft. |
| OpenAPI YAML parse by PyYAML | Completed | Confirmed in prior validation work. |
| OpenAPI YAML parse by Node yaml | Completed | Confirmed in prior validation work. |
| Spectral lint config draft | Created | implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml exists. |
| Spectral config YAML parse by PyYAML | Completed | Confirmed in prior config creation work. |
| Spectral config YAML parse by Node yaml | Completed | Confirmed in prior config creation work. |
| Spectral CLI installed | Not installed in this task | This task does not install Spectral CLI. |
| Spectral semantic validation executed | Not executed in this task | This task does not run Spectral CLI. |
| package.json script | Not created in this task | This task does not add package scripts. |
| CI integration | Not created in this task | CI is deferred to later specifications. |

## 7. Validation Target Files

| Target Type | Path | Required | Purpose | Notes |
|---|---|---|---|---|
| OpenAPI Draft | implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml | Yes | Future lint execution target. | Do not modify in this task. |
| Spectral Config | implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml | Yes | Future ruleset target. | Do not modify in this task. |
| Lint Specification | implementation/test_specifications/OpenAPI_Lint_Specification.md | Yes | Rule and severity source. | Reference only. |
| Tool Selection | implementation/test_specifications/OpenAPI_Lint_Tool_Selection.md | Yes | Tool selection source. | Reference only. |

## 8. Prerequisites for Future Execution

- Human Owner has approved Spectral CLI installation.
- Spectral CLI installation task has been completed separately.
- package.json and pnpm-lock.yaml changes have been reviewed.
- approval_gate_openapi_spectral.yaml has passed YAML parse validation.
- Approval_Gate_OpenAPI_Draft.yaml has passed YAML parse validation.
- git diff has been checked before execution.
- target OpenAPI Draft and target ruleset are explicitly specified.
- output logging policy has been decided.

This plan creation task does not execute these prerequisites.

## 9. Candidate Execution Commands

Future candidate command:

`cd /d C:\claudcode_ap\growth_lab_core`

`pnpm exec spectral lint -r implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml`

Future verbose candidate:

`pnpm exec spectral lint -r implementation/lint_configs/openapi/approval_gate_openapi_spectral.yaml implementation/openapi/Approval_Gate_OpenAPI_Draft.yaml --verbose`

Notes:

- Do not run these commands in this task.
- Do not add a package.json script in this task.
- Output format, log destination, and CI options are deferred to later specifications.

## 10. Validation Levels

| Validation Level | Description | Execution Timing | MVP Required | Notes |
|---|---|---|---|---|
| YAML Parse Validation | Confirms YAML can be parsed. | Already performed before this plan. | Yes | Only YAML Parse Validation has already been performed. |
| Spectral Config Semantic Validation | Confirms Spectral can interpret the ruleset. | Future task after approved installation. | Yes | Deferred to future tasks. |
| OpenAPI Draft Lint Validation | Runs the ruleset against the OpenAPI Draft. | Future task after semantic validation. | Yes | Deferred to future tasks. |
| Security Safety Validation | Reviews findings related to real URLs and sensitive values. | Future lint result review. | Yes | Human Owner review may be required. |
| Result Review Validation | Maps Spectral findings to project severity and remediation flow. | Future manual review. | Yes | Deferred to future tasks. |
| CI Quality Gate Validation | Executes lint in CI with failure policy. | Later phase. | Deferred | CI connection is not part of this task. |

Only YAML Parse Validation has already been performed.

Spectral Config Semantic Validation and later levels are deferred to future tasks.

## 11. Expected Result Categories

| Result Category | Meaning | Example Handling | Completion Impact |
|---|---|---|---|
| Pass | No findings that require action. | Record result and execution conditions. | Future validation can be marked complete. |
| Pass with Info | Only info-level findings. | Record as improvement candidates. | Human Owner review optional. |
| Pass with Warning | Warnings exist but no error. | Human Owner decides MVP continuation. | Conditional completion. |
| Fail with Major Warning | Major-equivalent warnings block automatic completion. | Review and classify findings. | Requires Human Owner confirmation. |
| Fail with Critical Error | Critical-equivalent error exists. | Do not mark complete. | Separate remediation task required. |
| Fail with Blocker Error | Blocker-equivalent error exists. | Handle first and do not accept by default. | Completion blocked. |
| Execution Failed | Command failed outside lint findings. | Review environment, command, or tool issue. | Completion blocked. |
| Tool Not Available | Spectral CLI is unavailable. | Install in separate approved task. | Completion blocked. |
| Config Semantic Error | Spectral cannot interpret ruleset. | Create lint config remediation task. | Completion blocked. |

## 12. Severity Mapping and Handling Policy

| Project Severity | Spectral Severity | Handling Policy | Notes |
|---|---|---|---|
| Blocker | error | Blocker-equivalent error cannot be completed. | Real URL, Secret, Token, API Key, or Password findings are handled first. |
| Critical | error | Critical-equivalent error cannot normally be completed. | Root structure or config interpretation failures require remediation. |
| Major | warn | Major-equivalent warn requires Human Owner confirmation. | MVP continuation is not automatic. |
| Minor | info | Minor-equivalent info is treated as a later improvement candidate. | Record but do not auto-fix. |
| Info | hint | Info-equivalent hint is recorded. | Future cleanup candidate. |

## 13. Blocker and Critical Failure Policy

If a Blocker or Critical equivalent finding appears, do not mark the validation complete.

Classify the cause into one of the following categories:

- OpenAPI Draft defect
- Spectral lint config defect
- Spectral CLI interpretation difference
- Lint rule over-detection
- Real URL finding
- Secret-like field finding
- OAuth URL finding
- Required schema missing
- Required path missing
- operationId mismatch

Response policy:

- Do not auto-fix.
- Classify the cause.
- Identify the file that needs a change.
- If OpenAPI Draft remediation is needed, create a separate task.
- If lint config remediation is needed, create a separate task.
- If judgment is needed, ask Human Owner.

## 14. Warning and Info Handling Policy

- warn is treated as Major equivalent and requires Human Owner review.
- info and hint are recorded as improvement candidates.
- If warnings appear, MVP continuation is decided by Human Owner based on the finding details.
- This plan does not define a rule to ignore warnings.
- Exception approval is delegated to a later specification or Human Owner decision.

## 15. Expected Validation Areas

| Validation Area | Expected Rule Coverage | Expected Failure Type | Notes |
|---|---|---|---|
| OpenAPI version | openapi must be 3.1.0. | Critical | Root version check. |
| Root required fields | Required root fields exist. | Critical | openapi, info, servers, tags, paths, components. |
| Components required fields | schemas, responses, parameters, securitySchemes exist. | Critical | Component baseline. |
| Placeholder server | Only approved placeholder server is allowed. | Blocker | Only https://api.example.invalid is allowed. |
| OAuth authorizationUrl prohibition | authorizationUrl is not defined. | Blocker | OAuth finalization is prohibited. |
| OAuth tokenUrl prohibition | tokenUrl is not defined. | Blocker | Token endpoint finalization is prohibited. |
| OAuth scope prohibition | scopes are not defined. | Blocker | Scope finalization is prohibited. |
| Required paths | Approval Gate required paths exist. | Major | Required path missing. |
| Required operations | Required methods exist on paths. | Major | Required operation missing. |
| Required operationIds | Required operationIds match. | Major | operationId mismatch. |
| Required schemas | Required reusable schemas exist. | Major | Schema missing. |
| Required enums | Required enum values exist. | Major | Enum value missing. |
| Required responses | Required reusable responses exist. | Major | Response component missing. |
| Required parameters | Required reusable parameters exist. | Major | Parameter component missing. |
| Required security scheme | BearerAuthPlaceholder exists. | Critical | Security scheme missing. |
| Status transition descriptions | Transition requirements are described. | Major | Description missing. |
| ErrorResponse schema | Safe error response fields exist. | Major | Error schema mismatch. |
| Secret-like fields | Secret-like fields are not defined. | Blocker | Sensitive field finding. |
| Dummy example safety | Real URL examples are not used. | Blocker | Placeholder safety finding. |

## 16. Known Risk Areas Before Execution

| Risk Area | Risk | Potential Cause | Proposed Handling |
|---|---|---|---|
| Spectral ruleset syntax is YAML-valid but Spectral-invalid | YAML parse passes but Spectral rejects ruleset. | Spectral-specific schema or function option mismatch. | Classify as Config Semantic Error and create remediation task. |
| JSONPath expression compatibility issue | Some rules do not target expected nodes. | Spectral JSONPath support differs from expectation. | Review rule path and adjust in separate task. |
| Schema function options mismatch | schema rule behaves unexpectedly. | JSON Schema draft support or Spectral function behavior. | Validate behavior after Spectral installation. |
| pattern rule too strict | Valid draft text may be flagged. | Regex over-detection. | Classify as false positive before changing files. |
| falsy rule behavior mismatch | Prohibited fields may not be detected as expected. | Function semantics differ from expectation. | Confirm in semantic validation task. |
| Custom security rule false positive | Security placeholder is incorrectly flagged. | Generic OAS rules conflict with MVP placeholder policy. | Review and decide exception or config remediation. |
| Secret-like field detection false positive | Safe text may be flagged. | Field names or descriptions include sensitive terms. | Human Owner review before remediation. |
| OpenAPI Draft intentionally differs from ruleset | Draft and ruleset policy may not align. | Policy changed after config creation. | Determine whether Draft or config requires a separate change. |
| documentationUrl placeholder handling | Tool may treat placeholder URL unexpectedly. | Spectral metadata interpretation. | Confirm in semantic validation. |
| Spectral CLI version difference | Results vary by version. | Unpinned or changed Spectral version. | Version pinning is deferred to later specification. |

## 17. Result Review Workflow

1. Check git diff before execution.
2. Confirm Spectral CLI is installed in a separate approved task.
3. Confirm the target OpenAPI Draft and target ruleset.
4. Run Spectral lint.
5. Save or record output results.
6. Classify error, warn, info, and hint.
7. Map each result to Project Severity.
8. Classify the cause as OpenAPI Draft, lint config, tool behavior, or rule false positive.
9. If Blocker or Critical exists, do not mark complete.
10. If remediation is needed, create a separate task.
11. Send the result to Human Owner review.

This workflow is not executed in this task.

## 18. Remediation Decision Flow

| Finding Type | Primary Owner | Action | Separate Task Required | Notes |
|---|---|---|---|---|
| OpenAPI Draft defect | Human Owner / API owner | Create OpenAPI Draft remediation task. | Yes | Do not edit Draft in validation task. |
| Lint config defect | Human Owner / lint owner | Create lint config remediation task. | Yes | Do not edit config without approval. |
| Spectral CLI behavior difference | Tooling owner | Investigate version and behavior. | Yes | May require version pinning decision. |
| False positive | Human Owner | Decide remediation or exception path. | Yes | Exception format is deferred. |
| Missing required path | API owner | Review Draft and scope. | Yes | May be Draft defect or rule mismatch. |
| Missing required schema | API owner | Review schema requirements. | Yes | Use Lint Specification as reference. |
| Secret-like field finding | Security owner / Human Owner | Treat as priority review item. | Yes | No auto-acceptance. |
| Real URL finding | Security owner / Human Owner | Replace or remove real URL in separate task. | Yes | Placeholder-only policy. |
| OAuth URL finding | API / Security owner | Remove finalization or create decision task. | Yes | OAuth finalization is prohibited in MVP Draft. |
| Warning only | Human Owner | Decide continue, remediate, or defer. | Maybe | Requires documented decision. |

## 19. Exception Handling Policy

- Blocker-equivalent exception approval is generally not allowed.
- Secret findings, real URL findings, and OAuth URL finalization are candidates for no exception approval.
- Critical-equivalent exception requires Human Owner approval.
- Temporary acceptance of Major warnings requires Human Owner decision.
- Exception approval must record reason, expiration condition, and recheck condition.
- Exception approval record format is deferred to later specification.

## 20. Output and Evidence Recording Policy

- Future semantic validation results should record execution time, target file, ruleset, command, and summary.
- Output log destination is deferred to later specification.
- Execution logs must not contain Secret, Token, API Key, or Password values.
- errors and warns must be recorded individually.
- Passing results should also record target file and execution condition.
- Before CI integration, results are managed as manual execution logs.

Future candidate destination:

- implementation/test_results/openapi_lint/

This task does not create the test_results directory.

## 21. Human Owner Approval Points

Human Owner approval is required before:

- Installing Spectral CLI
- Changing package.json
- Changing pnpm-lock.yaml
- Adding package scripts
- Connecting to CI
- Treating Blocker or Critical findings as resolved
- Temporarily accepting Major warnings
- Modifying the lint config
- Modifying the OpenAPI Draft
- Recording exception approval

## 22. Out-of-scope Items

- Spectral CLI installation
- Spectral CLI execution
- Redocly CLI installation
- Lint config remediation
- OpenAPI Draft remediation
- package.json changes
- pnpm-lock.yaml changes
- package script additions
- CI settings
- test_results directory creation
- lint execution log creation
- test code implementation
- API implementation
- DB implementation
- SQL
- OAuth implementation
- UI implementation
- external SNS API validation
- ASP integration validation
- legal judgment
- SNS terms detailed judgment
- ASP terms detailed judgment
- affiliate terms detailed judgment

## 23. Acceptance Criteria

- Semantic validation purpose is defined.
- Target files are defined.
- Future execution prerequisites are defined.
- Candidate execution commands are defined.
- Validation Levels are defined.
- Expected Result Categories are defined.
- Severity Mapping is defined.
- Blocker and Critical Failure Policy is defined.
- Warning and Info Handling Policy is defined.
- Expected Validation Areas are defined.
- Known Risk Areas Before Execution are defined.
- Result Review Workflow is defined.
- Remediation Decision Flow is defined.
- Exception Handling Policy is defined.
- Output and Evidence Recording Policy is defined.
- Human Owner Approval Points are defined.
- Spectral CLI is not installed.
- Spectral CLI is not executed.
- Lint config is not changed.
- OpenAPI Draft is not changed.
- package.json and pnpm-lock.yaml are not changed.

## 24. Items Deferred to Later Specifications

- Spectral CLI installation planning
- Spectral CLI installation execution
- package.json script planning
- Spectral semantic validation execution
- lint result logging specification
- CI quality gate planning
- CI integration
- Lint config remediation specification
- OpenAPI Draft remediation specification
- API contract test implementation planning

## 25. Items Not Decided by This Plan

- Spectral CLI installation timing
- Spectral CLI version pinning
- package script name
- CI tool
- CI execution conditions
- final lint result log destination
- lint finding exception approval format
- OpenAPI Draft remediation policy
- Lint config remediation policy
- API implementation method
- DB implementation method
- OAuth implementation method
- UI implementation method
- external SNS API integration method
- legal judgment
- detailed conclusion on SNS terms
- detailed conclusion on ASP terms
- detailed conclusion on affiliate terms

## 26. Validation Results

| Check | Result | Notes |
|---|---|---|
| approval_gate_openapi_spectral.yaml was referenced | Pass | Existing config file was confirmed. |
| Approval_Gate_OpenAPI_Draft.yaml was referenced | Pass | OpenAPI 3.1.0 was confirmed. |
| OpenAPI_Lint_Specification.md was referenced | Pass | Existing lint specification was confirmed. |
| OpenAPI_Lint_Tool_Selection.md was referenced | Pass | Existing tool selection was confirmed. |
| Approval_Gate_API_Test_Specification.md was referenced | Pass | Existing API test specification was confirmed. |
| Current Validation Status was defined | Pass | Section 6. |
| Validation Target Files was defined | Pass | Section 7. |
| Prerequisites for Future Execution was defined | Pass | Section 8. |
| Candidate Execution Commands was defined | Pass | Section 9. |
| Validation Levels was defined | Pass | Section 10. |
| Expected Result Categories was defined | Pass | Section 11. |
| Severity Mapping and Handling Policy was defined | Pass | Section 12. |
| Blocker and Critical Failure Policy was defined | Pass | Section 13. |
| Warning and Info Handling Policy was defined | Pass | Section 14. |
| Expected Validation Areas was defined | Pass | Section 15. |
| Known Risk Areas Before Execution was defined | Pass | Section 16. |
| Result Review Workflow was defined | Pass | Section 17. |
| Remediation Decision Flow was defined | Pass | Section 18. |
| Exception Handling Policy was defined | Pass | Section 19. |
| Output and Evidence Recording Policy was defined | Pass | Section 20. |
| Human Owner Approval Points was defined | Pass | Section 21. |
| Spectral CLI was not installed | Pass | No install command was run. |
| Spectral CLI was not executed | Pass | No spectral command was run. |
| Lint config was not changed | Pass | Existing config was not edited in this task. |
| OpenAPI Draft was not changed | Pass | OpenAPI Draft was not edited in this task. |
| package.json was not changed | Pass | package.json was not edited in this task. |
| pnpm-lock.yaml was not changed | Pass | pnpm-lock.yaml was not edited in this task. |
| package script was not added | Pass | No script was added. |
| CI settings were not created | Pass | No CI file was created. |
| test_results directory was not created | Pass | Directory was not created. |
| API implementation was not created | Pass | No implementation was created. |
| DB implementation was not created | Pass | No DB implementation was created. |
| SQL was not created | Pass | No SQL was created. |
| OAuth implementation was not created | Pass | No OAuth implementation was created. |
| UI implementation was not created | Pass | No UI implementation was created. |
| real API was not called | Pass | No API call was performed. |
| external service was not connected | Pass | No external connection was performed for this task. |
| legal judgment was not made | Pass | Deferred to later specifications or official-source confirmation. |
| SNS terms details were not concluded | Pass | No final interpretation. |
| ASP terms details were not concluded | Pass | No final interpretation. |
| affiliate terms details were not concluded | Pass | No final interpretation. |
| real Secret values were not included | Pass | No real sensitive values are included. |
| real URLs were not included | Pass | Only permitted placeholder URL is included. |
| no garbled Japanese text | Pass | Japanese text was checked. |
| no replacement character | Pass | Replacement character was not found. |
| Markdown code fence count is even | Pass | No code fences are used. |
| git diff was checked before and after work | Pass | Checked before and after work. |

## 27. Next Actions

- Human Owner review of Spectral Semantic Validation Plan
- OpenAPI lint tool installation planning
- Spectral CLI installation execution
- package.json script planning
- Spectral semantic validation execution
- lint result logging specification
- CI quality gate planning
- API contract test implementation planning
- Phase 1 implementation preparation
