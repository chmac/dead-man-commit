import { join, YAML, configDir, z } from "../deps.ts";
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

const ConfigSchema = z.object({
  version: z.number(),
  repos: RepoSchema.or(z.string()).array(),
});
type Config = z.infer<typeof ConfigSchema>;

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

  const config = ConfigSchema.parse(parsedConfig);

  if (config.version !== 1) {
    throw new Error("#wqHafz Invalid config version");
  }

  return config;
};

export const loadRepos = async (): Promise<Repo[]> => {
  const { repos } = await loadConfig();
  const convertedRepos = repos.map((repo) => {
    if (typeof repo === "string") {
      return { path: repo, delay: DEFAULT_ACTIVATE_AFTER_SECONDS };
    }
    return repo;
  });
  return convertedRepos;
};
