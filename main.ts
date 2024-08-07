import { log, parse } from "./deps.ts";
import { loadConfig } from "./src/config.ts";
import { getLogger, logSetup } from "./src/logger.ts";
import { deadManCommit } from "./src/services/repo/repo.ts";

let logger: log.Logger;

const start = async () => {
  const args = parse(Deno.args);
  const { log, repos } = await loadConfig();

  const verbose = args.v || args.verbose || false;
  const debug = args.d || args.debug || false;
  const argsConsoleLevel = debug ? "DEBUG" : verbose ? "INFO" : "ERROR";
  const { file } = log;
  const level = verbose || debug ? argsConsoleLevel : log.level;

  await logSetup({ file, level });

  logger = getLogger();

  const results = await Promise.all(
    repos.map(async (repo) => {
      const result = await deadManCommit({
        repoPath: repo.path,
        delaySeconds: repo.delay,
      });
      return { ...repo, result };
    })
  );

  for (const repo of results) {
    const { path, result } = repo;
    if (!result.success) {
      logger.error({
        message: `#vmdFnp Error(s) encountered`,
        repoPath: path,
        errors: result.errors,
      });
    } else {
      logger.info({
        message: `#GTE28L Successfully processed repo`,
        repoPath: path,
      });
      if (typeof result.info === "string") {
        logger.info(result.info);
      }
    }
  }

  if (repos.length === 0) {
    logger.warning(`#0OksQB Warning: Zero repos are configured`);
  }
};

start().catch((error) => {
  // If start() throws before `logSetup()` then `logger` is undefined
  const logError = typeof logger === "undefined" ? console.error : logger.error;
  logError(`#Fdisfb Fatal error`);
  logError(error);
});
