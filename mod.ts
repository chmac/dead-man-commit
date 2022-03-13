import { parse } from "./deps.ts";
import { logSetup, logger } from "./src/logger.ts";
import { loadRepos } from "./src/config.ts";
import { deadManCommit } from "./src/services/repo/repo.ts";

const start = async () => {
  const args = parse(Deno.args);

  const verbose = args.v || args.verbose || false;
  const debug = args.d || args.debug || false;
  const consoleLevel = debug ? "DEBUG" : verbose ? "INFO" : "ERROR";

  await logSetup(consoleLevel);

  const repos = await loadRepos();

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
      logger.error(`#vmdFnp Error(s) encountered in repo at ${path}`);
      logger.error(result.errors);
    } else {
      logger.info(`#GTE28L Successfully processed repo ${path}`);
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
  console.error(`#Fdisfb Fatal error`);
  console.dir(error);
});
