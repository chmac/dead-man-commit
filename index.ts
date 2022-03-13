import { join, parse, log } from "./deps.ts";
import { doesDirectoryExist } from "./fs.utils.ts";

const args = parse(Deno.args);

const verbose = args.v || args.verbose || false;

console.dir(args);

const positional = args._;

if (positional[0] === "status") {
  console.log("#T8r32X status");
}

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

    const potentialGitPath = join(path, entry.name, `.git`);
    const exists = await doesDirectoryExist(potentialGitPath);

    if (!exists) {
      continue;
    }

    console.log(`#xmgnE0 Found git repo ${potentialGitPath}`);
  }
};

const start = async () => {
  await getGitDirs(Deno.cwd());
};

start()
  .then(() => {
    console.log(`#VO2Jj4 Finished`);
  })
  .catch((error) => {
    console.error(`#Fdisfb Fatal error`);
    console.dir(error);
  });
