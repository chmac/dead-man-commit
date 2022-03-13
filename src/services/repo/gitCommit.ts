import { DEFAULT_COMMIT_MESSAGE } from "../../constants.ts";
import { run } from "../../run.ts";

type Success = { success: true };
type Failure = { success: false; errors: string[] };
export const gitCommit = async ({
  repoPath,
}: {
  repoPath: string;
}): Promise<Success | Failure> => {
  const command = await run({
    cmd: [
      "echo",
      "git",
      "-C",
      repoPath,
      "commit",
      "--message",
      DEFAULT_COMMIT_MESSAGE,
    ],
  });

  if (command.success) {
    return { success: true };
  }

  return {
    success: false,
    errors: [command.error],
  };
};
