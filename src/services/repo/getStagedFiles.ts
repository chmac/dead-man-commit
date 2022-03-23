import { run } from "../../run.ts";

type Success = { success: true; files: string[] };
type Failure = { success: false; errors: string[] };
export const getStagedFiles = async ({
  repoPath,
}: {
  repoPath: string;
}): Promise<Success | Failure> => {
  const result = await run({
    cmd: ["git", "-C", repoPath, "diff", "--name-only", "--cached"],
  });

  if (!result.success) {
    return {
      success: false,
      errors: [`#Yesths Error running git diff`],
    };
  }

  const { output } = result;

  if (output === "") {
    return { success: true, files: [] };
  }

  const files = output.split("\n");

  return { success: true, files };
};
