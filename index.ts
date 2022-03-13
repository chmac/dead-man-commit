import { join, parse, log } from "./deps.ts";
import { doesDirectoryExist } from "./fs.utils.ts";

const args = parse(Deno.args);

const verbose = args.v || args.verbose || false;

const gitArgs = args._.map((arg) =>
  typeof arg === "string" ? arg : arg.toString()
);

const textDecoder = new TextDecoder();

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    default: {
      level: verbose ? "DEBUG" : "INFO",
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

    const entryPath = join(path, entry.name);

    const potentialGitPath = join(entryPath, `.git`);
    const exists = await doesDirectoryExist(potentialGitPath);

    if (!exists) {
      continue;
    }

    logger.debug(`#xmgnE0 Found git repo ${potentialGitPath}`);

    const command = Deno.run({
      cmd: ["git", "-C", entryPath, ...gitArgs],
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
      logger.error(`Path was ${entryPath}`);
      logger.error(textDecoder.decode(stderr));
    }

    logger.info(`#HkMvHN ${entryPath}`);
    logger.info(textDecoder.decode(stdout));
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
