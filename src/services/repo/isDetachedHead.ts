import { run } from "../../run.ts";

type Success = { success: true; isDetachedHead: boolean };
type Failure = { success: false; errors: string[] };
/**
 * This captures any errors and assumes they mean we are on a detached head. In
 * theory we could maybe detect a detached head from the error message or exit
 * code, but it's unclear how portable this would be across various languages,
 * etc. This could be improved.
 */
export const isDetachedHead = async ({
  repoPath,
}: {
  repoPath: string;
}): Promise<Success> => {
  const command = await run({
    cmd: ["git", "-C", repoPath, "symbolic-ref", "HEAD"],
  });

  if (command.success) {
    return { success: true, isDetachedHead: false };
  }

  return {
    success: true,
    isDetachedHead: true,
  };
};
