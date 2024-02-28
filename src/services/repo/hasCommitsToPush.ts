import { run } from "../../run.ts";

type Success = { success: true; hasCommitsToPush: boolean };
type Failure = { success: false; errors: string[] };
export const hasCommitsToPush = async ({
  repoPath,
}: {
  repoPath: string;
}): Promise<Success | Failure> => {
  const result = await run({
    cmd: ["git", "-C", repoPath, "branch", "--verbose"],
  });

  if (!result.success) {
    return {
      success: false,
      errors: [`#EC9FJ0 Error running git branch`],
    };
  }

  const { output } = result;

  if (output === "") {
    return {
      success: false,
      errors: [`#7igJ7U No output from git branch`],
    };
  }

  const branches = output.split("\n");
  const currentBranch = branches.find((line) => line.startsWith("* "));
  if (typeof currentBranch === "undefined") {
    return {
      success: false,
      errors: [`#k6Athz Failed to find current branch`],
    };
  }

  const hasCommitsToPush = currentBranch.includes("[ahead ");

  return { success: true, hasCommitsToPush };
};
