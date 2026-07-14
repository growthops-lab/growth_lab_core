# OpenAPI Lint Automatic Trigger Validation Plan

## 1. Purpose

This document defines the validation plan for confirming that the OpenAPI Lint GitHub Actions workflow runs automatically for `master` pushes and pull requests targeting `master`, while preserving manual `workflow_dispatch` execution.

This plan is limited to validation planning. It does not execute GitHub Actions, create pull requests, push commits, configure Branch Protection, or configure GitHub Rulesets.

## 2. Target Workflow

- Workflow file: `.github/workflows/openapi-lint.yml`
- Workflow name: OpenAPI Lint
- Job id: `openapi-lint`
- Job name: OpenAPI Spectral Lint
- Manual trigger: `workflow_dispatch`
- Automatic push trigger: `push` to `master`
- Automatic pull request trigger: `pull_request` targeting `master`
- Required status check name: To be recorded from the actual GitHub check display after validation

## 3. Trigger Matrix

| ID | Trigger | Target | Validation Change | Expected Result |
|---|---|---|---|---|
| AUTO-001 | push | master | Workflow change commit | Run |
| AUTO-002 | pull_request | master | Harmless OpenAPI-related change | Run |
| AUTO-003 | pull_request | master | README-only change | Run |
| AUTO-004 | workflow_dispatch | master | No change | Run |

Initial validation intentionally confirms that every pull request targeting `master` runs the workflow. No `paths` or `paths-ignore` filter is used in the initial rollout.

## 4. Push Trigger Validation

Human Owner validation steps:

1. Review the local commit that enables automatic triggers.
2. Push the commit to `origin master`.
3. Open GitHub Actions for the repository.
4. Confirm that the OpenAPI Lint workflow started from the `push` event.
5. Confirm that the run uses branch `master`.
6. Confirm that the run completes successfully.
7. Record the run URL, result, duration, and displayed check name.

Success criteria:

- The OpenAPI Lint workflow runs automatically after the `master` push.
- The job name remains OpenAPI Spectral Lint.
- Spectral lint completes without errors.
- No secrets or credential values appear in logs.

## 5. Pull Request Trigger Validation

Human Owner validation steps:

1. Create a test branch from `master`.
2. Make a harmless OpenAPI-related change and open a pull request targeting `master`.
3. Confirm that the OpenAPI Lint workflow starts from the `pull_request` event.
4. Confirm that the run completes successfully.
5. Record the actual status check name shown on the pull request.
6. Repeat with a README-only change to confirm that all `master` pull requests run the workflow.

Success criteria:

- The OpenAPI Lint workflow runs for pull requests targeting `master`.
- README-only pull requests also run the workflow.
- The actual required status check candidate is recorded from GitHub, not inferred.

## 6. Expected Status Check

The expected candidate is the check displayed by GitHub for the OpenAPI Lint job.

Do not finalize a required status check value from this document alone. The Human Owner must copy the actual check name from GitHub after the first successful `pull_request` validation run.

## 7. Evidence

Record the following evidence after validation:

- Push run URL and result
- Pull request run URL and result
- Pull request URL used for validation
- Actual displayed status check name
- Spectral version
- Error, warning, info, and hint counts
- Secret review result for workflow logs
- Confirmation that no `paths` or `paths-ignore` filter was used

## 8. Failure Handling

If a trigger does not run:

1. Confirm that the workflow file exists on `master`.
2. Confirm that the branch or pull request target is `master`.
3. Confirm that GitHub Actions is enabled for the repository.
4. Confirm that no `paths` or `paths-ignore` filter exists.
5. Record the failure and stop before configuring Branch Protection.

If lint fails:

1. Do not configure required status checks.
2. Review the Spectral output.
3. Fix the OpenAPI draft or lint configuration in a separate task.
4. Re-run validation before continuing.

## 9. Completion Criteria

Automatic trigger validation is complete when:

- `workflow_dispatch` still works on `master`.
- `push` to `master` starts OpenAPI Lint automatically.
- Pull requests targeting `master` start OpenAPI Lint automatically.
- README-only pull requests also start OpenAPI Lint.
- The actual GitHub status check name has been recorded.
- Branch Protection or Ruleset configuration can proceed with a verified required check candidate.

<!-- PR_TRIGGER_TEST: temporary validation change; do not merge -->

<!-- PR_TRIGGER_TEST: temporary validation change; do not merge -->
