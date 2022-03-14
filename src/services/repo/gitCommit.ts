import { DEFAULT_COMMIT_MESSAGE } from "../../constants.ts";
import { getLogger } from "../../logger.ts";
import { run } from "../../run.ts";

type Success = { success: true };
type Failure = { success: false; errors: string[] };
export const gitCommit = async ({
  repoPath,
}: {
  repoPath: string;
}): Promise<Success | Failure> => {
  const logger = await getLogger();

  const commitMessage = DEFAULT_COMMIT_MESSAGE;
  const command = await run({
    cmd: ["git", "-C", repoPath, "commit", "--message", commitMessage],
  });

  if (command.success) {
    logger.debug({
      message: `#AWF5JN Commited changed files`,
      repoPath,
      commitMessage,
    });
    return { success: true };
  }

  return {
    success: false,
    errors: [command.error],
  };
};
