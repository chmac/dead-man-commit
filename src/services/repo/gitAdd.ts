import { run } from "../../run.ts";

type Success = { success: true };
type Failure = { success: false; errors: string[] };
export const gitAdd = async ({
  repoPath,
}: {
  repoPath: string;
}): Promise<Success | Failure> => {
  const command = await run({ cmd: ["git", "-C", repoPath, "add", "--all"] });

  if (command.success) {
    return { success: true };
  }

  return {
    success: false,
    errors: [command.error],
  };
};
