import { getLogger } from "../../logger.ts";
import { run } from "../../run.ts";

type Success = { success: true };
type Failure = { success: false; errors: string[] };
export const gitPush = async ({
  repoPath,
}: {
  repoPath: string;
}): Promise<Success | Failure> => {
  const logger = await getLogger();

  const command = await run({ cmd: ["git", "-C", repoPath, "push"] });

  if (command.success) {
    logger.debug({
      message: `#TfiOLd Successfully pushed`,
      repoPath,
    });
    return { success: true };
  }

  return {
    success: false,
    errors: [command.error],
  };
};
