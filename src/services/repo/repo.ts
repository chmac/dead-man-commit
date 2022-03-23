import { DEFAULT_ACTIVATE_AFTER_SECONDS } from "../../constants.ts";
import { getLogger } from "../../logger.ts";
import { doesDirectoryExist } from "../../fs.utils.ts";
import { getNewAndModifiedFiles } from "./getNewAndModifiedFiles.ts";
import { getStagedFiles } from "./getStagedFiles.ts";
import { gitAdd } from "./gitAdd.ts";
import { gitCommit } from "./gitCommit.ts";
import { gitPush } from "./gitPush.ts";
import { isDetachedHead } from "./isDetachedHead.ts";
import { secondsSinceLastChange } from "./secondsSinceLastChange.ts";

export const textDecoder = new TextDecoder();

type Success = { success: true; info?: string };
type Failure = { success: false; errors: string[] };
export const deadManCommit = async ({
  repoPath,
  delaySeconds = DEFAULT_ACTIVATE_AFTER_SECONDS,
}: {
  repoPath: string;
  delaySeconds: number;
}): Promise<Success | Failure> => {
  const logger = getLogger();

  const exists = await doesDirectoryExist(repoPath);
  if (!exists) {
    return {
      success: false,
      errors: [`#VcepTF Repo path does not exist`],
    };
  }

  const filesResult = await getNewAndModifiedFiles({ repoPath });

  if (!filesResult.success) {
    return filesResult;
  }

  if (filesResult.files.length === 0) {
    logger.debug({
      message: `#zVEYX6 No changed files, nothing to do`,
      repoPath,
    });
    return { success: true };
  }

  logger.info({
    message: `#DHU3Fr Got changed files`,
    repoPath,
    files: filesResult.files,
  });

  const isDetachedHeadResult = await isDetachedHead({ repoPath });
  if (!isDetachedHeadResult.success) {
    return isDetachedHeadResult;
  }
  if (isDetachedHeadResult.isDetachedHead) {
    return {
      success: true,
      info: `#xaYHyb Repo is not on a branch, aborting`,
    };
  }

  const stagedFilesResult = await getStagedFiles({ repoPath });
  if (!stagedFilesResult.success) {
    return stagedFilesResult;
  }

  const files = filesResult.files.concat(stagedFilesResult.files);

  const secondsResult = await secondsSinceLastChange({
    repoPath,
    files,
  });

  if (!secondsResult.success) {
    return secondsResult;
  }

  if (secondsResult.seconds > delaySeconds) {
    logger.debug({
      message: `#qv3c9w Found changes older than delay`,
      repoPath,
      newestChangeInSeconds: secondsResult.seconds,
    });

    const addResult = await gitAdd({ repoPath });
    if (!addResult.success) {
      return addResult;
    }

    const commitResult = await gitCommit({ repoPath });
    if (!commitResult.success) {
      return commitResult;
    }

    const pushResult = await gitPush({ repoPath });
    if (!pushResult.success) {
      return pushResult;
    }
  } else {
    logger.info({
      message: `#MqvNAI Changes are too recent, nothing to do yet`,
      repoPath,
      mostRecentChangeSeconds: secondsResult.seconds,
      delaySeconds,
    });
  }

  return { success: true };
};
