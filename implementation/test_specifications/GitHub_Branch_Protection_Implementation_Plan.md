# GitHub Branch Protection Implementation Plan

## Purpose

This document defines the initial plan for introducing Branch Protection or an equivalent GitHub Ruleset for the Growth Lab Core repository after the OpenAPI Lint workflow has entered formal manual operation and automatic trigger validation has succeeded.

The plan is intentionally limited to implementation planning. It does not apply repository settings, configure GitHub Branch Protection, configure GitHub Rulesets, push commits, create pull requests, or merge pull requests.

## Current State

- Repository: growthops-lab/growth_lab_core
- Default branch: master
- Current OpenAPI Lint workflow triggers: workflow_dispatch, push to master, pull_request targeting master
- Current OpenAPI Lint job candidate: OpenAPI Spectral Lint
- Current formal manual CI status: OpenAPI Lint manual workflow_dispatch run succeeded
- Current validation result: Spectral 6.16.1 with 0 errors, 0 warnings, 0 infos, and 0 hints
- Automatic trigger validation status: pending Human Owner push and pull request validation

## Initial Recommended Policy

Recommended initial policy:

1. Push the automatic OpenAPI Lint workflow change to `master`.
2. Confirm a successful `push` event run.
3. Create a test branch and pull request targeting `master`.
4. Confirm a successful `pull_request` event run.
5. Confirm the actual GitHub status check name after the pull request run.
6. Choose GitHub Rulesets or Classic Branch Protection based on repository availability.
7. Start with the minimum protection needed to avoid blocking routine solo maintenance.

Candidate required check:

- OpenAPI Spectral Lint

The candidate check name must not be enforced until GitHub displays the actual check name from a relevant pull_request workflow run.

## Preconditions

- Human Owner has reviewed the formal OpenAPI Lint manual execution report.
- Human Owner has confirmed that OpenAPI Lint remains visible in GitHub Actions.
- Human Owner has pushed the automatic trigger workflow commit to `master`.
- Human Owner has confirmed successful `push` event execution.
- Human Owner has confirmed successful `pull_request` event execution.
- Human Owner has confirmed whether Branch Protection or Rulesets are available for the private repository.
- Human Owner has confirmed administrator bypass and emergency recovery options.
- Human Owner has recorded the actual status check name displayed by GitHub.

## Important Limitation

Required status checks should be configured only after the automatic `push` and `pull_request` triggers have been validated on GitHub.

The initial automatic rollout intentionally does not use `paths` or `paths-ignore`. If path filters are introduced before required status checks are stable, some pull requests may not produce a required check result and could become blocked.

## Human Owner Decisions

Required Human Owner decisions:

1. Whether to use Branch Protection or GitHub Rulesets.
2. Whether required approvals should be 0 or 1 for solo operation.
3. Whether administrators can bypass protection.
4. Which branch protection recovery path is acceptable for solo operation.
5. Which confirmed GitHub check name should be required.
6. Whether branches must be up to date before merging.
7. Whether conversation resolution should be required.

## Implementation Procedure

Planned procedure, to be executed only after Human Owner approval:

1. Push the automatic workflow commit to `master`.
2. Confirm the OpenAPI Lint `push` event run succeeds.
3. Create a test branch.
4. Create a pull request targeting `master`.
5. Confirm the OpenAPI Lint `pull_request` event run succeeds.
6. Confirm the actual status check name displayed by GitHub.
7. Select GitHub Rulesets or Classic Branch Protection based on repository availability.
8. Enable pull request requirement for `master`.
9. Enable required status checks.
10. Configure the confirmed OpenAPI Lint check as required.
11. Confirm whether branches must be up to date before merging.
12. Confirm whether conversation resolution is required.
13. Block force pushes.
14. Block branch deletion.
15. Keep signed commits disabled for the initial rollout unless Human Owner explicitly enables them.
16. Keep administrator bypass available as an initial recovery path unless Human Owner explicitly disables it.
17. Verify merge conditions with the test pull request.
18. Confirm the rollback procedure.
19. Record the applied settings and evidence in the project documentation.

## Initial Settings Candidate

- Target branch: master
- Require a pull request before merging: candidate enabled
- Required approvals: 0 or 1, to be decided by Human Owner
- Require status checks: enabled
- Required check: actual GitHub-displayed check name, not inferred
- Require branches to be up to date before merging: candidate enabled
- Require conversation resolution: candidate enabled
- Block force pushes: enabled
- Block branch deletion: enabled
- Signed commits: disabled for initial rollout
- Administrator bypass: candidate allowed as initial recovery path

## Rollback Procedure

If Branch Protection or Ruleset configuration blocks required maintenance:

1. Human Owner uses administrator access or configured bypass to disable the blocking rule.
2. Human Owner records the incident and the blocked operation.
3. The team reviews whether the required check name, trigger, or bypass setting was incorrect.
4. A remediation plan is created before re-enabling the protection.

No automated rollback is defined in this planning document.

## Completion Criteria

Branch Protection planning is complete when:

- Human Owner has reviewed this plan.
- Automatic push and pull request trigger validation has succeeded.
- The actual required status check has been identified but not prematurely enforced.
- Administrator bypass and recovery path have been reviewed.
- A future implementation task can be created without ambiguity.
