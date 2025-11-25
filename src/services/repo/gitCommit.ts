import { DEFAULT_COMMIT_MESSAGE } from "../../constants.ts";
import { getLogger } from "../../logger.ts";
import { run } from "../../run.ts";

const getHostname = async (): Promise<string> => {
  try {
    const hostname = Deno.hostname();
    return hostname;
  } catch (error) {
    const logger = await getLogger();
    logger.error({
      message: "#8d1n2A Failed to get hostname",
      error,
    });
    return "";
  }
};

type Success = { success: true };
type Failure = { success: false; errors: string[] };
export const gitCommit = async ({
  repoPath,
}: {
  repoPath: string;
}): Promise<Success | Failure> => {
  const logger = await getLogger();

  const hostname = await getHostname();
  const hostnameMessage = hostname.length > 0 ? ` on ${hostname}` : "";
  const commitMessage = `${DEFAULT_COMMIT_MESSAGE}${hostnameMessage}`;

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
