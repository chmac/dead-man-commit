import { configDir, deepmerge, join, YAML, z } from "../deps.ts";
import {
  DEFAULT_ACTIVATE_AFTER_SECONDS,
  PACKAGE_CONFIG_FILENAME,
  PACKAGE_NAME_SLUG,
} from "./constants.ts";
import { doesDirectoryExist, doesFileExist } from "./fs.utils.ts";

const RepoSchema = z.object({
  path: z.string(),
  delay: z.number().int().default(DEFAULT_ACTIVATE_AFTER_SECONDS),
});
type Repo = z.infer<typeof RepoSchema>;

const LogLevelSchema = z
  .literal("ERROR")
  .or(z.literal("INFO"))
  .or(z.literal("DEBUG"));
const ConfigFileSchema = z.object({
  version: z.number(),
  log: z
    .object({
      file: z.string().optional(),
      level: LogLevelSchema.optional(),
    })
    .optional(),
  repos: RepoSchema.or(z.string()).array(),
});

const ConfigSchema = z.object({
  version: z.literal(1),
  log: z.object({
    file: z.string().optional(),
    level: LogLevelSchema,
  }),
  repos: RepoSchema.array(),
});
type Config = z.infer<typeof ConfigSchema>;

const baseConfig: Config = {
  // NOTE: We cast 0 as 1 to pass the type check for `Config` as we check later
  // that this is overwritten
  version: 0 as 1,
  log: {
    level: "ERROR",
  },
  repos: [],
};

export const loadConfig = async (): Promise<Config> => {
  const configDirPath = configDir();

  if (configDirPath === null) {
    console.error(`#219bWK FATAL Could not find system config path`);
    Deno.exit(1);
  }

  const packageConfigDirPath = join(configDirPath, PACKAGE_NAME_SLUG);

  const dirExists = await doesDirectoryExist(packageConfigDirPath);

  if (!dirExists) {
    throw new Error(
      `#3qv1Ej Config dir does not exist ${packageConfigDirPath}`
    );
  }

  const packageConfigFilePath = join(
    packageConfigDirPath,
    PACKAGE_CONFIG_FILENAME
  );

  const fileExists = await doesFileExist(packageConfigFilePath);

  if (!fileExists) {
    throw new Error(
      `#s8L89y Config file does not exist ${packageConfigFilePath}`
    );
  }

  const configContents = await Deno.readTextFile(packageConfigFilePath);

  const parsedConfig = YAML.parse(configContents);

  const config = ConfigFileSchema.parse(parsedConfig);

  const { repos, ...configToMerge } = config;

  const convertedRepos = repos.map((repo) => {
    if (typeof repo === "string") {
      return { path: repo, delay: DEFAULT_ACTIVATE_AFTER_SECONDS };
    }
    return repo;
  });

  // NOTE: We need to cast to `Config` here because `log.level` can be
  // `undefined` in the config file, and TypeScript doesn't know that the
  // default vaule exists. There's likely a better way.
  const output = deepmerge(baseConfig, configToMerge, {
    repos: convertedRepos,
  }) as Config;

  if (output.version !== 1) {
    throw new Error("#wqHafz Invalid config version");
  }

  // A final double check to make sure the output matches the output schema
  ConfigSchema.parse(output);

  return output;
};

export const loadRepos = async (): Promise<Repo[]> => {
  const { repos } = await loadConfig();
  return repos;
};
