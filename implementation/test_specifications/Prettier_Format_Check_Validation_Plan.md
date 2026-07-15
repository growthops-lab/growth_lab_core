# Prettier Format Check Validation Plan

## Purpose

Verify that the Prettier Format Check workflow detects formatting violations without modifying repository files and is suitable as the fourth GitHub quality gate candidate.

## Scope

- Validate the workflow definition and the green local formatting baseline.
- Validate manual, `master` push, and `master` pull request triggers on GitHub.
- Confirm the stable workflow and job names for a future Required Status Check.
- Define evidence collection, failure handling, and rollback boundaries.

Ruleset changes, automatic remediation, and Prettier dependency or configuration changes are outside this plan.

## Target Workflow

- Path: `.github/workflows/prettier-check.yml`
- Workflow name: `Prettier Format Check`
- Job ID: `prettier-format-check`
- Job display name: `Prettier Format Check`
- Command: `pnpm run format:check`

## Preconditions

- The workflow is merged into `master` through a reviewed pull request.
- `package.json` fixes Prettier at `3.9.5` and declares `pnpm@11.7.0`.
- `pnpm-lock.yaml`, `.prettierrc.json`, and `.prettierignore` are present.
- Frozen installation and the local format check pass.
- Existing OpenAPI Lint, TypeScript Type Check, and ESLint workflows remain unchanged.

## Trigger Matrix

| Trigger | Test condition | Expected result |
| --- | --- | --- |
| Manual | Human Owner runs `workflow_dispatch` on `master` | Workflow starts and `Prettier Format Check` succeeds |
| Push | A reviewed change updates `master` | Workflow starts for the resulting commit and succeeds |
| Pull request | A pull request targets `master` | Workflow starts and reports the job result on the pull request |

Validate and record the three triggers separately.

## Permissions

The workflow grants only `contents: read` and checks out with `persist-credentials: false`. It requires no write permission, secret, deployment, artifact upload, auto-commit, or auto-push.

## Toolchain Alignment

- Runner: `ubuntu-24.04`
- `actions/checkout@v6`
- `pnpm/action-setup@v6` with pnpm `11.7.0`
- `actions/setup-node@v6` with Node.js `24`
- pnpm cache using `pnpm-lock.yaml`
- Install command: `pnpm install --frozen-lockfile`
- Default shell: `bash`
- Timeout: 10 minutes

## Local Baseline Validation

Run without repository-wide formatting:

```powershell
pnpm install --frozen-lockfile
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run lint:openapi
pnpm run build
git diff --check
```

Use repository-local Prettier `--file-info` to verify that the workflow is not ignored and is parsed as YAML. Every command must return exit code `0`, and only the approved five files may differ from the starting commit.

## Manual Workflow Validation

After merge, the Human Owner runs `Prettier Format Check` with `workflow_dispatch` on `master`. Record repository, branch/ref, commit SHA, event, workflow and job results, step summary, tool versions, command result, exit code, finding count, and the run URL only when recording it is permitted.

## Master Push Validation

Confirm that a subsequent `master` update starts the workflow automatically. Record the manual-run evidence fields and verify the checked commit.

## Pull Request Validation

Create a controlled pull request targeting `master`. Confirm that `Prettier Format Check` appears and succeeds on a formatted change. Any intentional formatting-failure test requires separate approval, a disposable branch, and must not be merged.

## Expected Workflow and Job Names

- Workflow: `Prettier Format Check`
- Job ID: `prettier-format-check`
- Job display name and status check candidate: `Prettier Format Check`

These names are stable interfaces and must not change during validation.

## Required Status Check Candidate

`Prettier Format Check` is the candidate. Do not add it to the `Protect master` Ruleset until GitHub execution succeeds and the actual status check name is confirmed.

## Evidence Requirements

For each trigger, retain execution time, repository, branch/ref, commit SHA, event type, workflow and job results, step summary, Node.js/pnpm/Prettier versions where available, format check exit code, finding counts, tool/configuration failure counts, and log/secret review results. Record a GitHub run URL only with Human Owner permission. Never record credentials, tokens, secrets, or sensitive environment values.

## Failure Handling

- Do not run `prettier --write`, auto-commit, or auto-push in CI.
- Correct formatting findings in a separately reviewed local change.
- Classify installation, parser, configuration, or workflow recognition failures as tool/configuration failures.
- Do not bypass the check or weaken the Ruleset to force completion.
- Preserve diagnostic evidence without exposing secret values.

## Rollback Boundary

Before Ruleset integration, rollback is limited to reverting the workflow introduction through normal review. Do not rewrite history, force push, reset shared branches, or change the established Prettier baseline as an implicit rollback.

## Completion Criteria

- Every required local validation returns exit code `0`.
- Prettier reports `ignored: false` and `inferredParser: yaml` for the workflow.
- GitHub recognizes the workflow, and the Human Owner records successful manual, push, and pull request evidence.
- Workflow and job names match this plan.
- Existing quality gates, dependencies, lockfile, Prettier configuration, and application source remain unchanged.
- Ruleset evaluation begins only after the successful status check name is confirmed.
