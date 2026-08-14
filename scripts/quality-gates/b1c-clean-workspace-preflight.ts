import { execFileSync } from "node:child_process";
import { existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const EXPECTED_WORKSPACE =
  "/home/sns-ops-pc/growth_lab_core_b1c_clean_work";
export const EXPECTED_WSL_DISTRO = "Ubuntu-24.04";
export const EXPECTED_ORIGIN =
  "https://github.com/growthops-lab/growth_lab_core.git";

export type PreflightCode =
  | "PREFLIGHT_OK"
  | "INVALID_WORKSPACE"
  | "WSL_REQUIRED"
  | "WINDOWS_MOUNT_BLOCKED"
  | "RUNTIME_VERSION_BLOCKED"
  | "ORIGIN_MISMATCH"
  | "DIRTY_WORKTREE_BLOCKED"
  | "REMOTE_STATE_BLOCKED"
  | "GITHUB_AUTH_BLOCKED"
  | "BRANCH_COLLISION_BLOCKED"
  | "PR_COLLISION_BLOCKED";

export interface CommandResult {
  exitCode: number;
  stdout: string;
}

export interface PreflightEnvironment {
  PATH?: string;
  WSL_DISTRO_NAME?: string;
  WSL_INTEROP?: string;
}

export interface PreflightAdapters {
  cwd(): string;
  environment(): PreflightEnvironment;
  nodePath(): string;
  nodeVersion(): string;
  platform(): NodeJS.Platform;
  resolveCommand(command: string): string | undefined;
  run(command: string, args: readonly string[]): CommandResult;
}

export interface PreflightOptions {
  expectedRoot?: string;
  expectedWslDistro?: string;
  intendedBranch?: string;
}

export interface DirtyCounts {
  staged: number;
  unstaged: number;
  untracked: number;
}

function resolveExecutable(
  command: string,
  environment: PreflightEnvironment,
): string | undefined {
  const entries = environment.PATH?.split(path.delimiter) ?? [];

  for (const entry of entries) {
    if (!entry) {
      continue;
    }

    const candidate = path.join(entry, command);
    try {
      if (!existsSync(candidate) || !statSync(candidate).isFile()) {
        continue;
      }
      return realpathSync(candidate);
    } catch {
      continue;
    }
  }

  return undefined;
}

function runCommand(command: string, args: readonly string[]): CommandResult {
  try {
    return {
      exitCode: 0,
      stdout: execFileSync(command, args, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }),
    };
  } catch (error) {
    const exitCode =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 1;
    return { exitCode, stdout: "" };
  }
}

function runtimeEnvironment(): PreflightEnvironment {
  return {
    PATH: process.env.PATH,
    WSL_DISTRO_NAME: process.env.WSL_DISTRO_NAME,
    WSL_INTEROP: process.env.WSL_INTEROP,
  };
}

export function createDefaultPreflightAdapters(): PreflightAdapters {
  return {
    cwd: () => process.cwd(),
    environment: runtimeEnvironment,
    nodePath: () => process.execPath,
    nodeVersion: () => process.versions.node,
    platform: () => process.platform,
    resolveCommand: (command) =>
      resolveExecutable(command, runtimeEnvironment()),
    run: runCommand,
  };
}

function isWindowsMount(targetPath: string): boolean {
  const normalized = targetPath.replace(/\\/g, "/").toLowerCase();
  return normalized === "/mnt/c" || normalized.startsWith("/mnt/c/");
}

function hasSupportedVersion(version: string, minimumMajor: number): boolean {
  const match = /^(\d+)/.exec(version.trim());
  return match !== null && Number(match[1]) >= minimumMajor;
}

function isExpectedWsl(
  platformName: NodeJS.Platform,
  environment: PreflightEnvironment,
  expectedDistro: string,
): boolean {
  return (
    platformName === "linux" &&
    environment.WSL_DISTRO_NAME === expectedDistro &&
    typeof environment.WSL_INTEROP === "string" &&
    environment.WSL_INTEROP.length > 0
  );
}

export function countDirtyEntries(porcelain: string): DirtyCounts {
  const counts: DirtyCounts = { staged: 0, unstaged: 0, untracked: 0 };

  for (const entry of porcelain.split(/\r?\n/)) {
    if (!entry) {
      continue;
    }

    if (entry.startsWith("??")) {
      counts.untracked += 1;
      continue;
    }

    if (entry[0] !== " ") {
      counts.staged += 1;
    }
    if (entry[1] !== " ") {
      counts.unstaged += 1;
    }
  }

  return counts;
}

function isDirty(counts: DirtyCounts): boolean {
  return counts.staged + counts.unstaged + counts.untracked > 0;
}

function isSafeBranchName(branch: string): boolean {
  return (
    /^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(branch) &&
    !branch.includes("..") &&
    !branch.includes("//") &&
    !branch.endsWith(".") &&
    !branch.endsWith("/")
  );
}

function readMasterSha(result: CommandResult): string | undefined {
  if (result.exitCode !== 0) {
    return undefined;
  }

  const value = result.stdout.trim().split(/\s+/)[0];
  return value || undefined;
}

function hasOpenPullRequest(result: CommandResult): boolean | undefined {
  if (result.exitCode !== 0) {
    return undefined;
  }
  return result.stdout.trim().length > 0;
}

function checkBranchCollisions(
  branch: string,
  adapters: PreflightAdapters,
): PreflightCode {
  const local = adapters.run("git", [
    "show-ref",
    "--verify",
    "--quiet",
    `refs/heads/${branch}`,
  ]);
  if (local.exitCode === 0) {
    return "BRANCH_COLLISION_BLOCKED";
  }
  if (local.exitCode !== 1) {
    return "REMOTE_STATE_BLOCKED";
  }

  const remote = adapters.run("git", [
    "ls-remote",
    "--exit-code",
    "--heads",
    "origin",
    branch,
  ]);
  if (remote.exitCode === 0) {
    return "BRANCH_COLLISION_BLOCKED";
  }
  if (remote.exitCode !== 2) {
    return "REMOTE_STATE_BLOCKED";
  }

  const pullRequest = hasOpenPullRequest(
    adapters.run("gh", [
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
    ]),
  );
  if (pullRequest === undefined) {
    return "REMOTE_STATE_BLOCKED";
  }
  return pullRequest ? "PR_COLLISION_BLOCKED" : "PREFLIGHT_OK";
}

export function runPreflight(
  options: PreflightOptions = {},
  adapters: PreflightAdapters = createDefaultPreflightAdapters(),
): PreflightCode {
  const expectedRoot = options.expectedRoot ?? EXPECTED_WORKSPACE;
  const expectedDistro = options.expectedWslDistro ?? EXPECTED_WSL_DISTRO;
  const environment = adapters.environment();

  if (path.resolve(adapters.cwd()) !== path.resolve(expectedRoot)) {
    return "INVALID_WORKSPACE";
  }
  if (!isExpectedWsl(adapters.platform(), environment, expectedDistro)) {
    return "WSL_REQUIRED";
  }

  const pnpmPath = adapters.resolveCommand("pnpm");
  if (
    isWindowsMount(adapters.nodePath()) ||
    (pnpmPath !== undefined && isWindowsMount(pnpmPath))
  ) {
    return "WINDOWS_MOUNT_BLOCKED";
  }
  if (
    pnpmPath === undefined ||
    !hasSupportedVersion(adapters.nodeVersion(), 20) ||
    !hasSupportedVersion(adapters.run(pnpmPath, ["--version"]).stdout, 11)
  ) {
    return "RUNTIME_VERSION_BLOCKED";
  }

  const origin = adapters.run("git", ["remote", "get-url", "origin"]);
  if (origin.exitCode !== 0 || origin.stdout.trim() !== EXPECTED_ORIGIN) {
    return "ORIGIN_MISMATCH";
  }

  const dirty = adapters.run("git", [
    "status",
    "--porcelain=v1",
    "--untracked-files=all",
  ]);
  if (dirty.exitCode !== 0) {
    return "REMOTE_STATE_BLOCKED";
  }
  if (isDirty(countDirtyEntries(dirty.stdout))) {
    return "DIRTY_WORKTREE_BLOCKED";
  }

  if (adapters.run("gh", ["auth", "status"]).exitCode !== 0) {
    return "GITHUB_AUTH_BLOCKED";
  }

  const localMaster = readMasterSha(
    adapters.run("git", ["rev-parse", "origin/master"]),
  );
  const remoteMaster = readMasterSha(
    adapters.run("git", ["ls-remote", "origin", "refs/heads/master"]),
  );
  if (!localMaster || !remoteMaster || localMaster !== remoteMaster) {
    return "REMOTE_STATE_BLOCKED";
  }

  if (options.intendedBranch === undefined) {
    return "PREFLIGHT_OK";
  }
  if (!isSafeBranchName(options.intendedBranch)) {
    return "BRANCH_COLLISION_BLOCKED";
  }
  return checkBranchCollisions(options.intendedBranch, adapters);
}

function readIntendedBranch(args: readonly string[]): string | undefined {
  const index = args.indexOf("--branch");
  if (index >= 0) {
    return args[index + 1] ?? "";
  }

  const assignment = args.find((arg) => arg.startsWith("--branch="));
  return assignment?.slice("--branch=".length);
}

const entrypoint = process.argv[1];
if (entrypoint && path.resolve(entrypoint) === fileURLToPath(import.meta.url)) {
  process.stdout.write(
    `${runPreflight({ intendedBranch: readIntendedBranch(process.argv.slice(2)) })}\n`,
  );
}
