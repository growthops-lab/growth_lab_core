# GitHub Branch Protection Implementation Plan

## Purpose

This document defines the initial plan for introducing Branch Protection or an equivalent GitHub Ruleset for the Growth Lab Core repository after the OpenAPI Lint workflow has entered formal manual operation.

The plan is intentionally limited to implementation planning. It does not apply repository settings, configure GitHub Branch Protection, configure GitHub Rulesets, or change workflow triggers.

## Current State

- Repository: growthops-lab/growth_lab_core
- Default branch: master
- Current OpenAPI Lint workflow trigger: workflow_dispatch
- Current OpenAPI Lint job candidate: OpenAPI Spectral Lint
- Current formal manual CI status: OpenAPI Lint manual workflow_dispatch run succeeded
- Current validation result: Spectral 6.16.1 with 0 errors, 0 warnings, 0 infos, and 0 hints

## Initial Recommended Policy

Recommended initial policy:

1. Keep Branch Protection disabled until Human Owner confirms the desired solo-operation recovery path.
2. Add pull_request or push trigger support to OpenAPI Lint before requiring it as a status check.
3. Confirm the actual GitHub check name after a pull_request or push run.
4. Use the confirmed check name as the required status check candidate.
5. Start with the minimum protection needed to avoid blocking routine solo maintenance.

Candidate required check:

- OpenAPI Spectral Lint

The candidate check name must not be enforced until GitHub displays the actual check name from a relevant pull_request or push workflow run.

## Preconditions

- Human Owner has reviewed the formal OpenAPI Lint manual execution report.
- Human Owner has confirmed that OpenAPI Lint remains visible in GitHub Actions.
- Human Owner has decided whether to add pull_request or push trigger support.
- Human Owner has confirmed whether Branch Protection or Rulesets are available for the private repository.
- Human Owner has confirmed administrator bypass and emergency recovery options.

## Important Limitation

The current OpenAPI Lint workflow uses workflow_dispatch only.

A manually triggered workflow is useful for formal manual validation, but it is not sufficient by itself for reliable required status check enforcement on pull requests or pushes. Required status check operation should be planned only after adding and validating a pull_request or push trigger.

## Human Owner Decisions

Required Human Owner decisions:

1. Whether to keep OpenAPI Lint manual-only for the next stage.
2. Whether to add pull_request trigger support.
3. Whether to add push trigger support.
4. Whether to use Branch Protection or GitHub Rulesets.
5. Whether administrators can bypass protection.
6. Which branch protection recovery path is acceptable for solo operation.
7. Which confirmed GitHub check name should be required.

## Implementation Procedure

Planned procedure, to be executed only after Human Owner approval:

1. Confirm current default branch is master.
2. Confirm OpenAPI Lint is visible in GitHub Actions.
3. Add the approved trigger to OpenAPI Lint in a separate change.
4. Run the workflow using the approved trigger.
5. Confirm the actual check name displayed by GitHub.
6. Draft the Branch Protection or Ruleset settings.
7. Confirm administrator bypass and recovery settings.
8. Apply Branch Protection or Ruleset settings in GitHub Web UI.
9. Verify that normal maintenance remains possible.
10. Record the applied settings and evidence in the project documentation.

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
- The trigger requirement for required status checks is understood.
- The candidate required check has been identified but not prematurely enforced.
- Administrator bypass and recovery path have been reviewed.
- A future implementation task can be created without ambiguity.
