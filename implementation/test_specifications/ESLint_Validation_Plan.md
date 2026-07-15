# ESLint Validation Plan

## 1. Purpose

This plan validates ESLint as the third GitHub Quality Gate after OpenAPI Spectral Lint and TypeScript Type Check. It confirms that the same lint command passes locally and in GitHub Actions before Human Owner consideration for a Required Status Check.

## 2. Target Workflow

- Workflow: `.github/workflows/eslint.yml`
- Workflow name: `ESLint`
- Job ID: `eslint`
- Job name: `ESLint`
- Runner: `ubuntu-24.04`
- Command: `pnpm run lint`
- Dependency installation: `pnpm install --frozen-lockfile`
- Triggers: `workflow_dispatch`, push to `master`, and pull requests targeting `master`
- Permissions: `contents: read`

The initial workflow intentionally does not use a `paths` filter so that the first GitHub validation covers the complete repository scope.

## 3. Preconditions

- `package.json` contains `lint: eslint .`.
- `eslint`, `eslint-config-next`, and `@eslint/eslintrc` are already declared.
- `eslint.config.mjs` exists and uses ESLint Flat Config compatibility.
- `pnpm-lock.yaml` and `pnpm-workspace.yaml` exist.
- The working tree is clean before the task begins.
- `master` and `origin/master` are synchronized.
- OpenAPI Lint and TypeScript Type Check workflows remain unchanged.

## 4. Local Validation

Run the following commands in the repository root:

```powershell
pnpm install --frozen-lockfile
pnpm --version
node --version
pnpm exec eslint --version
pnpm run lint
```

Acceptance criteria:

- `pnpm run lint` exits with code `0`.
- ESLint errors are `0`.
- ESLint warnings are `0`.
- No dependency file, package script, or ESLint configuration change is required.

The local report records the exact command result, tool versions, duration, and non-fatal network metadata warning status without recording secrets.

## 5. Manual Workflow Validation

After the local commit is reviewed, Human Owner runs `ESLint` with `workflow_dispatch` in GitHub Actions. Confirm that the workflow is recognized, the expected job is created, and the version and lint steps complete.

## 6. Push Trigger Validation

Human Owner pushes the feature branch through the normal repository workflow and confirms that a later push to `master` runs the workflow. Codex does not push or operate the GitHub Web UI.

## 7. Pull Request Trigger Validation

Human Owner creates a pull request targeting `master` and confirms that the workflow runs for the `pull_request` event. The pull request should show the exact check name `ESLint` after a successful run.

## 8. Expected Status Check

Expected check name: `ESLint`.

Human Owner must confirm the actual GitHub check name from the successful pull request before adding it to the `Protect master` Ruleset. Ruleset changes are outside this task.

## 9. Evidence

- Local evidence: `implementation/test_results/eslint/20260715_100211_ESLint_Local_Execution_Report.md`
- Workflow source: `.github/workflows/eslint.yml`
- GitHub evidence: Human Owner workflow and pull request run details, to be recorded after GitHub validation.

## 10. Warning Policy

The formal Required Check adoption condition is Errors `0` and Warnings `0`. Any ESLint warning stops Required Check adoption until the warning is understood and an approved remediation is available. Non-ESLint package-manager metadata messages must be recorded separately and must not be counted as ESLint warnings.

## 11. Failure Handling

If local or GitHub ESLint returns an error or warning, do not add the workflow to the Ruleset. Do not modify `eslint.config.mjs`, `package.json`, lockfiles, or existing workflows as an autonomous remediation. Record representative messages, counts, affected files, and a remediation candidate for Human Owner review.

## 12. Completion Criteria

- The workflow exists with the required triggers, job, runner, permissions, and frozen dependency installation.
- Local `pnpm run lint` succeeds with Errors `0` and Warnings `0`.
- This Validation Plan and the Local Execution Report exist.
- `Project_Progress.md` and `changelog/CHANGELOG.md` are updated.
- Only the specified files are staged and committed locally.
- The working tree is clean after the local commit.
- Push, pull request creation, merge, GitHub Web UI operation, and Ruleset changes remain unperformed by Codex.
