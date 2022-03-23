import { run } from "../../run.ts";

type Success = { success: true; files: string[] };
type Failure = { success: false; errors: string[] };
export const getNewAndModifiedFiles = async ({
  repoPath,
}: {
  repoPath: string;
}): Promise<Success | Failure> => {
  const result = await run({
    cmd: [
      "git",
      "-C",
      repoPath,
      "ls-files",
      "--modified",
      "--others",
      "--exclude-standard",
    ],
  });

  if (!result.success) {
    return {
      success: false,
      errors: [`#8eKr7E Error running git ls-files`],
    };
  }

  const { output } = result;

  if (output === "") {
    return { success: true, files: [] };
  }

  const files = output.split("\n");

  return { success: true, files };
};
