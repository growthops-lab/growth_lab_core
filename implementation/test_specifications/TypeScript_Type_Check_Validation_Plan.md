# TypeScript Type Check Validation Plan

## 1. Purpose

This document defines the validation plan for introducing TypeScript Type Check as the second GitHub quality gate for Growth Lab Core.

The gate is intended to prevent TypeScript type errors from being merged into `master`.

## 2. Target Workflow

- Workflow path: `.github/workflows/typescript-check.yml`
- Workflow name: TypeScript Type Check
- Job id: `typescript-type-check`
- Job name: TypeScript Type Check
- Runner: `ubuntu-24.04`
- Node.js: `24`
- pnpm: `11.7.0`
- Command: `pnpm run typecheck`

## 3. Preconditions

- Repository Ruleset Protect master remains active.
- OpenAPI Spectral Lint remains unchanged.
- `package.json` already defines `typecheck`.
- `tsconfig.json` exists.
- No dependency or lockfile change is required.

## 4. Local Validation

Local validation must run before the workflow is pushed:

```powershell
pnpm --version
node --version
pnpm exec tsc --version
pnpm run typecheck
```

Success criteria:

- `pnpm run typecheck` exits with code 0.
- Type error count is 0.
- No package dependency changes are introduced.

## 5. Manual Workflow Validation

After the branch is pushed, Human Owner should run the workflow manually with `workflow_dispatch` if available.

Evidence to record:

- Workflow run URL
- Branch
- Conclusion
- TypeScript version
- Exit code

## 6. Push Trigger Validation

After the workflow branch is merged to `master`, confirm that `push` to `master` starts TypeScript Type Check automatically.

Success criteria:

- Workflow event is `push`.
- Target branch is `master`.
- Job name is TypeScript Type Check.
- Result is success.

## 7. Pull Request Trigger Validation

Open a pull request targeting `master` from a feature branch and confirm TypeScript Type Check runs automatically.

Success criteria:

- Workflow event is `pull_request`.
- Base branch is `master`.
- Job name is TypeScript Type Check.
- Result is success.

## 8. Expected Status Check

The expected status check candidate is:

- TypeScript Type Check

The actual GitHub-displayed check name must be confirmed from a pull request run before adding it to Ruleset required checks.

## 9. Evidence

Record the following evidence after remote validation:

- Manual workflow run result, if executed
- Push event run result
- Pull request event run result
- Actual displayed status check name
- Node.js version
- pnpm version
- TypeScript version
- Type error count
- Secret review result for workflow logs

## 10. Failure Handling

If local typecheck fails, do not create or push the workflow.

If remote workflow execution fails:

1. Do not add TypeScript Type Check to required status checks.
2. Review the workflow log.
3. Confirm dependency installation and `pnpm run typecheck` behavior.
4. Fix the workflow or type errors in a separate task.

## 11. Completion Criteria

TypeScript Type Check validation is complete when:

- Local `pnpm run typecheck` succeeds.
- The workflow exists in the repository.
- `workflow_dispatch`, `push`, and `pull_request` are configured.
- Push and pull request executions have succeeded on GitHub.
- Human Owner has confirmed the actual status check name.
- Human Owner has decided whether to add TypeScript Type Check to Ruleset required checks.
