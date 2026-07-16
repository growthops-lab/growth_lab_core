# Five Quality Gates Final Validation Plan

## 1. Purpose

Validate that all five required quality checks start on a pull request targeting `master`, block merging while incomplete or failed, and allow Squash and merge only after every check succeeds. This plan separates local preparation by Codex from GitHub validation and merge operations performed by the Human Owner.

## 2. Scope

This validation covers the five existing GitHub Actions workflows, their pull request results, the `Protect master` Ruleset presentation, merge blocking behavior, Squash and merge availability, and post-merge workflow results on `master`.

The following are outside scope:

- Production code and test code changes
- Workflow, dependency, package, lockfile, or tool configuration changes
- Ruleset or Required Status Check changes
- Push, pull request, merge, and branch cleanup by Codex
- Access to credentials, secrets, recovery material, or authentication settings

## 3. Required Status Checks

The expected Required Status Check names are:

1. `OpenAPI Spectral Lint`
2. `TypeScript Type Check`
3. `ESLint`
4. `Prettier Format Check`
5. `Unit Test`

The Human Owner must confirm that each Ruleset entry exactly matches the check name shown on the pull request. A missing, duplicated, skipped, renamed, or unexpected check is a validation failure until investigated.

## 4. Preconditions

- The work branch is based on the latest synchronized `master`.
- The work branch contains only this plan, the validation record, `Project_Progress.md`, and `changelog/CHANGELOG.md` changes.
- The five existing workflow files are unchanged.
- Production code, tests, dependencies, lockfiles, tool configuration, and Ruleset are unchanged.
- The Human Owner has permission to push the branch, create a pull request, inspect Actions and Ruleset results, and complete a Squash and merge.
- The pull request base is `master` and the head is `docs/five-quality-gates-final-validation`.

Stop before remote validation if any precondition is not satisfied.

## 5. Pull Request Validation

The Human Owner performs the following steps and records evidence without exposing secrets:

1. Push the work branch and create a pull request targeting `master`.
2. Record the repository, pull request number and URL, base branch, head branch, starting `master` SHA, and feature branch SHA.
3. Confirm that all five expected checks are displayed and start for the `pull_request` event.
4. Confirm that each displayed check name exactly matches the expected Required Status Check name.
5. Record the final result and relevant GitHub run URL for each check.
6. Record missing, skipped, cancelled, timed-out, duplicated, or unexpectedly named checks as failures requiring investigation.

## 6. Merge Blocking Validation

Validate and record all three states:

1. **Checks running:** Immediately after the five checks start, confirm that merge is blocked while one or more checks are pending or running.
2. **Check failed or incomplete:** If a check fails naturally, confirm that merge remains blocked. Do not alter production code, tests, dependencies, configuration, workflows, or Ruleset solely to manufacture a failure. If no safe failure evidence is available, record this item as `Pending Human Owner Validation` rather than claiming success.
3. **All checks passed:** After all five checks succeed, confirm that the Required checks are satisfied and Squash and merge becomes available.

Capture the Ruleset name, enforcement state, required check count, displayed check names, merge control state, and review date. Screenshots or GitHub run links may be retained outside the repository when they contain account-specific or access-sensitive information.

## 7. Success Validation

The pull request validation succeeds only when:

- All five expected checks are present and successful.
- Required Status Check names match the workflow job names exactly.
- Merge is blocked while checks are running, incomplete, or failed.
- Merge becomes available only after all required checks pass.
- No unexpected workflow, dependency, configuration, or Ruleset change is included.
- Evidence is complete enough for another reviewer to distinguish observed facts from pending items.

Any unobserved GitHub state remains `Pending Human Owner Validation` and prevents a final `PASS` result.

## 8. Squash Merge Validation

After all five checks pass, the Human Owner:

1. Confirms that Squash and merge is available.
2. Reviews the final pull request file list and confirms only the four authorized files changed.
3. Performs Squash and merge without bypassing Required Status Checks.
4. Records the merge result and merge SHA.
5. Does not record success if GitHub reports a bypass, unresolved requirement, failed merge, or unexpected file change.

## 9. Master Push Validation

After merge, verify the `push` event on `master`:

1. Confirm that all five workflows start from the merged `master` SHA.
2. Confirm that `OpenAPI Spectral Lint`, `TypeScript Type Check`, `ESLint`, `Prettier Format Check`, and `Unit Test` all succeed.
3. Record each run result and run URL.
4. Confirm that local `master` can be updated by fast-forward and matches `origin/master`.
5. Record branch deletion separately; deletion is cleanup and is not evidence that the quality gates passed.

## 10. Evidence Requirements

The validation record must include:

- Repository identifier, branch names, pull request number and URL
- Starting `master` SHA, feature branch SHA, merge SHA, validation date, and Human Owner
- Pull request result for each of the five checks
- Merge blocking observations for running, failed or incomplete, and all-passed states
- Squash and merge availability and result
- Post-merge `master` push result for each check
- Ruleset name, enforcement state, and required check count
- Final result of `PASS`, `FAIL`, or `PARTIAL`

Use `Pending Human Owner Validation` for every GitHub item that has not been directly observed. Do not store credentials, secret values, recovery material, private log data, or unnecessary local absolute paths.

## 11. Failure Handling

- Stop the merge when a required check is missing, incomplete, cancelled, skipped, timed out, or failed.
- Stop when the Ruleset check name differs from the actual job name.
- Preserve the failed run URL and concise non-sensitive error summary.
- Classify workflow/tool failures separately from application, test, lint, type, formatting, or OpenAPI findings.
- Use a new reviewed change for remediation; do not amend, rebase, force push, bypass protection, or modify Ruleset during this validation.
- Re-run validation after remediation and retain the prior result as historical evidence.

## 12. Completion Criteria

Preparation is complete when the four authorized files are committed locally, the working tree is clean, existing workflows and dependency/configuration files are unchanged, and all local document quality checks pass.

Final validation is complete only when the Human Owner records all required GitHub evidence, all five pull request checks pass, merge blocking behavior is confirmed, Squash and merge succeeds without bypass, and all five post-merge `master` workflows pass. Until then, the overall result remains `PARTIAL` or `Pending Human Owner Validation`.
