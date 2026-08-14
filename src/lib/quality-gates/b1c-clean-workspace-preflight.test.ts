import { describe, expect, it } from "vitest";

import {
  EXPECTED_ORIGIN,
  EXPECTED_WORKSPACE,
  EXPECTED_WSL_DISTRO,
  countDirtyEntries,
  runPreflight,
  type CommandResult,
  type PreflightAdapters,
} from "../../../scripts/quality-gates/b1c-clean-workspace-preflight";

function success(stdout = ""): CommandResult {
  return { exitCode: 0, stdout };
}

function failure(exitCode = 1): CommandResult {
  return { exitCode, stdout: "" };
}

function commandKey(command: string, args: readonly string[]): string {
  return `${command}\u0000${args.join("\u0000")}`;
}

function adapters(
  overrides: Partial<PreflightAdapters> = {},
  results: Record<string, CommandResult> = {},
): PreflightAdapters {
  return {
    cwd: () => EXPECTED_WORKSPACE,
    environment: () => ({
      WSL_DISTRO_NAME: EXPECTED_WSL_DISTRO,
      WSL_INTEROP: "/run/WSL/1_interop",
    }),
    nodePath: () => "/usr/bin/node",
    nodeVersion: () => "20.19.0",
    platform: () => "linux",
    resolveCommand: () => "/usr/bin/pnpm",
    run: (command, args) => {
      const configured = results[commandKey(command, args)];
      if (configured) {
        return configured;
      }

      if (command === "/usr/bin/pnpm") {
        return success("11.7.0\n");
      }
      if (command === "git" && args[0] === "remote") {
        return success(`${EXPECTED_ORIGIN}\n`);
      }
      if (command === "git" && args[0] === "status") {
        return success();
      }
      if (command === "gh" && args[0] === "auth") {
        return success();
      }
      if (command === "git" && args[0] === "rev-parse") {
        return success("master-sha\n");
      }
      if (command === "git" && args[0] === "ls-remote") {
        if (args.at(-1) === "refs/heads/master") {
          return success("master-sha\trefs/heads/master\n");
        }
        return failure(2);
      }
      if (command === "git" && args[0] === "show-ref") {
        return failure(1);
      }
      if (command === "gh" && args[0] === "pr") {
        return success();
      }
      return failure();
    },
    ...overrides,
  };
}

describe("B1C clean workspace preflight", () => {
  it("B1C-001 permits the verified Ubuntu-24.04 clean workspace", () => {
    expect(EXPECTED_WSL_DISTRO).toBe("Ubuntu-24.04");
    expect(
      runPreflight(
        {},
        adapters({
          environment: () => ({
            WSL_DISTRO_NAME: "Ubuntu-24.04",
            WSL_INTEROP: "/run/WSL/1_interop",
          }),
        }),
      ),
    ).toBe("PREFLIGHT_OK");
  });

  it("B1C-002 accepts a supplied branch when no branch or PR collision exists", () => {
    expect(
      runPreflight(
        { intendedBranch: "feat/b1c-clean-workspace-preflight" },
        adapters(),
      ),
    ).toBe("PREFLIGHT_OK");
  });

  it("B1C-003 rejects a different repository root", () => {
    expect(
      runPreflight({}, adapters({ cwd: () => "/tmp/not-the-workspace" })),
    ).toBe("INVALID_WORKSPACE");
  });

  it("B1C-004 fails closed for a different WSL distribution", () => {
    expect(
      runPreflight(
        {},
        adapters({
          environment: () => ({
            WSL_DISTRO_NAME: "Ubuntu",
            WSL_INTEROP: "/run/WSL/1_interop",
          }),
          platform: () => "linux",
        }),
      ),
    ).toBe("WSL_REQUIRED");
  });

  it("B1C-005 blocks runtimes that resolve from the Windows mount", () => {
    expect(
      runPreflight({}, adapters({ nodePath: () => "/mnt/c/node/node.exe" })),
    ).toBe("WINDOWS_MOUNT_BLOCKED");
  });

  it("B1C-006 blocks unsupported Node.js and pnpm versions", () => {
    expect(runPreflight({}, adapters({ nodeVersion: () => "18.20.0" }))).toBe(
      "RUNTIME_VERSION_BLOCKED",
    );
    expect(
      runPreflight(
        {},
        adapters(
          {},
          {
            [commandKey("/usr/bin/pnpm", ["--version"])]: success("10.9.0\n"),
          },
        ),
      ),
    ).toBe("RUNTIME_VERSION_BLOCKED");
  });

  it("B1C-007 requires the exact fixed origin URL", () => {
    expect(
      runPreflight(
        {},
        adapters(
          {},
          {
            [commandKey("git", ["remote", "get-url", "origin"])]: success(
              "git@github.com:growthops-lab/growth_lab_core.git\n",
            ),
          },
        ),
      ),
    ).toBe("ORIGIN_MISMATCH");
  });

  it("B1C-008 counts dirty entries without exposing their paths", () => {
    expect(
      countDirtyEntries("M  staged.ts\n M unstaged.ts\n?? new.ts\n"),
    ).toEqual({
      staged: 1,
      unstaged: 1,
      untracked: 1,
    });
    expect(
      runPreflight(
        {},
        adapters(
          {},
          {
            [commandKey("git", [
              "status",
              "--porcelain=v1",
              "--untracked-files=all",
            ])]: success("M  changed.ts\n"),
          },
        ),
      ),
    ).toBe("DIRTY_WORKTREE_BLOCKED");
  });

  it("B1C-009 blocks unauthenticated GitHub access", () => {
    expect(
      runPreflight(
        {},
        adapters(
          {},
          {
            [commandKey("gh", ["auth", "status"])]: failure(),
          },
        ),
      ),
    ).toBe("GITHUB_AUTH_BLOCKED");
  });

  it("B1C-010 blocks stale origin/master state", () => {
    expect(
      runPreflight(
        {},
        adapters(
          {},
          {
            [commandKey("git", ["ls-remote", "origin", "refs/heads/master"])]:
              success("other-sha\trefs/heads/master\n"),
          },
        ),
      ),
    ).toBe("REMOTE_STATE_BLOCKED");
  });

  it("B1C-011 blocks local and remote branch collisions", () => {
    const branch = "feat/b1c-clean-workspace-preflight";
    expect(
      runPreflight(
        { intendedBranch: branch },
        adapters(
          {},
          {
            [commandKey("git", [
              "show-ref",
              "--verify",
              "--quiet",
              `refs/heads/${branch}`,
            ])]: success(),
          },
        ),
      ),
    ).toBe("BRANCH_COLLISION_BLOCKED");
    expect(
      runPreflight(
        { intendedBranch: branch },
        adapters(
          {},
          {
            [commandKey("git", [
              "ls-remote",
              "--exit-code",
              "--heads",
              "origin",
              branch,
            ])]: success(`${branch}\n`),
          },
        ),
      ),
    ).toBe("BRANCH_COLLISION_BLOCKED");
  });

  it("B1C-012 blocks an existing open pull request for the intended branch", () => {
    const branch = "feat/b1c-clean-workspace-preflight";
    expect(
      runPreflight(
        { intendedBranch: branch },
        adapters(
          {},
          {
            [commandKey("gh", [
              "pr",
              "list",
              "--repo",
              "growthops-lab/growth_lab_core",
              "--state",
              "open",
              "--head",
              branch,
              "--json",
              "number",
              "--jq",
              ".[].number",
            ])]: success("29\n"),
          },
        ),
      ),
    ).toBe("PR_COLLISION_BLOCKED");
  });
});
