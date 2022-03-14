import { doesFileExist } from "../../fs.utils.ts";
import { difference, join } from "../../../deps.ts";

type Success = { success: true; seconds: number };
type Failure = { success: false; errors: string[] };
export const secondsSinceLastChange = async ({
  repoPath,
  files,
}: {
  repoPath: string;
  files: string[];
}): Promise<Success | Failure> => {
  const now = new Date();

  const secondsAgoOrErrors = await Promise.all(
    files.map(async (file): Promise<number | string> => {
      const filePath = join(repoPath, file);

      const exists = await doesFileExist(filePath);
      if (!exists) {
        // NOTE: Returning -1 signals this file does not exist
        return -1;
      }

      const stat = await Deno.lstat(filePath);
      if (stat.mtime === null) {
        return `#11gBxX ERROR Failed to get mtime for file ${filePath}`;
      }
      const { seconds } = difference(stat.mtime, now, { units: ["seconds"] });
      // NOTE: We need to cast here as the return type of `difference` makes
      // `seconds` optional
      return seconds as number;
    })
  );

  const errors = secondsAgoOrErrors.filter(
    (entry) => typeof entry === "string"
  ) as string[];

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  // Remove any `-1` for non existent files
  const secondsFiltered = (secondsAgoOrErrors as number[]).filter(
    (s) => s !== -1
  );

  const seconds = Math.min(...secondsFiltered);

  return { success: true, seconds };
};
