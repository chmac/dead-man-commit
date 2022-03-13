import { difference, join, parse, log } from "./deps.ts";
import { doesDirectoryExist } from "./fs.utils.ts";
import { DEFAULT_ACTIVATE_AFTER_SECONDS } from "./constants.ts";

const args = parse(Deno.args);

const verbose = args.v || args.verbose || false;
const debug = args.d || args.debug || false;
const consoleLevel = debug ? "DEBUG" : verbose ? "INFO" : "ERROR";

const textDecoder = new TextDecoder();

const now = new Date();

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    default: {
      level: consoleLevel,
      handlers: ["console"],
    },
  },
});
const logger = log.getLogger();

const getGitDirs = async (path: string) => {
  for await (const entry of Deno.readDir(path)) {
    logger.debug(`#u5rab9 readDir entry ${entry.name}`);

    if (!entry.isDirectory) {
      continue;
    }

    const repoPath = join(path, entry.name);

    const potentialGitPath = join(repoPath, `.git`);
    const exists = await doesDirectoryExist(potentialGitPath);

    if (!exists) {
      continue;
    }

    logger.debug(`#xmgnE0 Found git repo ${potentialGitPath}`);

    const command = Deno.run({
      cmd: [
        "git",
        "-C",
        repoPath,
        "ls-files",
        "--modified",
        "--others",
        "--exclude-standard",
      ],
      stdout: "piped",
      stderr: "piped",
    });

    const [status, stdout, stderr] = await Promise.all([
      command.status(),
      command.output(),
      command.stderrOutput(),
    ]);

    if (!status.success) {
      logger.error(`#8eKr7E Error running git command`);
      logger.error(`Path was ${repoPath}`);
      logger.error(textDecoder.decode(stderr));
      continue;
    }

    const fileList = textDecoder.decode(stdout);

    if (fileList.trim() === "") {
      logger.debug(`#4rqeVo No changes in ${repoPath}`);
      continue;
    }

    // NOTE: The output will have a trailing newline so we need to `trim()` it
    // before using `split()`.
    const files = fileList.trim().split("\n");

    const filesEditedAgoSeconds = await Promise.all(
      files.map(async (file) => {
        const filePath = join(repoPath, file);
        const stat = await Deno.lstat(filePath);
        if (stat.mtime === null) {
          // TODO Figure out how to handle not getting a mtime
          console.error(
            `#11gBxX FATAL Failed to get mtime for file ${filePath}`
          );
          Deno.exit(1);
        }
        const { seconds } = difference(stat.mtime, now, { units: ["seconds"] });
        // NOTE: We need to cast here as the return type of `difference` makes
        // `seconds` optional
        return seconds as number;
      })
    );

    const fileLastEditedAgoSeconds = Math.min(...filesEditedAgoSeconds);

    if (fileLastEditedAgoSeconds < DEFAULT_ACTIVATE_AFTER_SECONDS) {
      logger.info(`#98aPlr Repo has recent changes, skipping ${repoPath}`);
      continue;
    }

    // TODO Commit and push the repo
  }
};

const start = async () => {
  await getGitDirs(Deno.cwd());
};

start()
  .then(() => {
    logger.debug(`#VO2Jj4 Finished`);
  })
  .catch((error) => {
    console.error(`#Fdisfb Fatal error`);
    console.dir(error);
  });
