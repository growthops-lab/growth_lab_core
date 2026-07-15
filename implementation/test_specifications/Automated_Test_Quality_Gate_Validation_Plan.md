# Automated Test Quality Gate Validation Plan

## Purpose

Validate the initial automated test foundation and the `Unit Test` GitHub Actions workflow as the fifth quality gate candidate without connecting to production services or changing application behavior.

## Scope

- Vitest runner configuration and deterministic local execution
- Behavioral tests for the production revenue metrics module
- Manual, `master` push, and `master` pull request workflow triggers
- Existing four quality gates and production build regression checks
- Evidence, failure handling, and Ruleset handoff boundaries

Coverage thresholds, browser tests, external API tests, real database tests, and Ruleset changes are outside this plan.

## Test Foundation

- Framework: Vitest `4.1.10`
- Runtime: Node.js
- Configuration: `vitest.config.ts`
- CI script: `pnpm run test` (`vitest run`)
- Test discovery: `src/**/*.test.ts`
- Initial test: `src/lib/analytics/metrics.test.ts`
- Production target: `src/lib/analytics/metrics.ts`

The initial suite validates complete funnel calculations, optional-value defaults, zero-denominator handling, explicit zero preservation, and negative return behavior. It uses no network, database, environment secret, clock, random value, filesystem write, snapshot, mock, or fixture.

## Target Workflow

- Path: `.github/workflows/unit-test.yml`
- Workflow name: `Unit Test`
- Job ID: `unit-test`
- Job display name: `Unit Test`
- Command: `pnpm run test`

## Preconditions

- The feature is reviewed before merge.
- `master` and `origin/master` were synchronized at the starting commit.
- Vitest is locked and a frozen installation succeeds.
- The local test suite, existing quality commands, and production build pass.
- Existing OpenAPI, TypeScript, ESLint, and Prettier workflows remain semantically unchanged.

## Trigger Matrix

| Trigger | Test condition | Expected result |
| --- | --- | --- |
| Manual | Human Owner runs `workflow_dispatch` on `master` | `Unit Test` starts and succeeds |
| Push | A reviewed update reaches `master` | `Unit Test` runs for that commit and succeeds |
| Pull request | A pull request targets `master` | `Unit Test` appears on the pull request and succeeds |

Validate and retain evidence for each trigger separately.

## Permissions and Toolchain

- Permissions: `contents: read` only
- Checkout: `actions/checkout@v6`, `persist-credentials: false`
- pnpm: `pnpm/action-setup@v6`, version `11.7.0`
- Node.js: `actions/setup-node@v6`, version `24`
- Cache: pnpm using `pnpm-lock.yaml`
- Runner: `ubuntu-24.04`
- Shell: `bash`
- Timeout: 15 minutes
- Installation: `pnpm install --frozen-lockfile`

## Local Validation

Run:

```powershell
pnpm install --frozen-lockfile
pnpm run test
pnpm run typecheck
pnpm run lint
pnpm run format:check
pnpm run lint:openapi
pnpm run build
git diff --check
```

Parse the workflow with the existing repository YAML parser and assert the required name, triggers, branch filters, permissions, job identity, runner, timeout, and test command. All commands must return exit code `0`.

## Existing Quality Gate Regression

Confirm that the following workflows have no semantic or textual changes:

- `.github/workflows/openapi-lint.yml`
- `.github/workflows/typescript-check.yml`
- `.github/workflows/eslint.yml`
- `.github/workflows/prettier-check.yml`

Run each corresponding local command and the production build. Do not dismiss an existing gate failure as unrelated.

## GitHub Validation

The Human Owner performs the first GitHub executions after pushing the branch and creating a pull request. For manual, push, and pull request events, record repository, branch/ref, commit SHA, event, workflow/job/step results, test file count, test count, passed/failed counts, duration, exit code, and the run URL only when recording it is permitted.

## Expected Names

- Workflow: `Unit Test`
- Job ID: `unit-test`
- Job display name and Required Status Check candidate: `Unit Test`

These identifiers must remain stable.

## Evidence Requirements

Evidence must include the starting commit, branch, Node.js/pnpm/Vitest versions, dependency changes, production target, test file and test counts, passed/failed counts, durations, changed files, regression results, workflow structure validation, encoding/safety results, and confirmation that secret values were not recorded.

## Failure Handling

- Do not update snapshots, source files, or test expectations automatically in CI.
- Do not bypass, ignore, or weaken a failed test or existing quality gate.
- Do not connect to real SNS, ASP, external production APIs, real databases, or real credentials.
- Stop without commit if any mandatory validation fails.
- Diagnose tool/configuration failures separately from behavioral test failures.

## Rollback Boundary

Before Ruleset integration, rollback uses normal reviewed Git reversion of the foundation and workflow commits. Do not force push, rewrite history, reset shared branches, or remove existing Required Status Checks.

## Completion Criteria

- Vitest `4.1.10` is recorded and frozen installation succeeds.
- The meaningful initial suite is deterministic and passes locally.
- Workflow names, triggers, permissions, runner, timeout, and command match this plan.
- Existing four quality commands and production build pass.
- Existing four workflow files remain unchanged.
- Validation evidence and project records are consistent.
- The branch is committed locally with a clean working tree.
- Push, PR, merge, Ruleset, and Required Status Check changes remain Human Owner work.

## Required Status Check Candidate

`Unit Test` becomes a Ruleset candidate only after successful GitHub execution confirms the actual check name. Do not add it before that evidence exists.
