import { join, YAML, configDir, z } from "./deps.ts";
import { PACKAGE_NAME_SLUG, PACKAGE_CONFIG_FILENAME } from "./constants.ts";
import { doesDirectoryExist, doesFileExist } from "./fs.utils.ts";

const configSchema = z.object({
  version: z.string(),
  repos: z
    .object({
      path: z.string(),
      timeout: z.number().int().default(3600),
    })
    .array(),
});
type Config = z.infer<typeof configSchema>;

export const getConfig = async (): Promise<Config> => {
  const configDirPath = configDir();

  if (configDirPath === null) {
    console.error(`#219bWK FATAL Could not find system config path`);
    Deno.exit(1);
  }

  const packageConfigDirPath = join(configDirPath, PACKAGE_NAME_SLUG);

  const dirExists = await doesDirectoryExist(packageConfigDirPath);

  if (!dirExists) {
    throw new Error(`#3qv1Ej Config dir does not exist`);
  }

  const packageConfigFilePath = join(
    packageConfigDirPath,
    PACKAGE_CONFIG_FILENAME
  );

  const fileExists = await doesFileExist(packageConfigFilePath);

  if (!fileExists) {
    throw new Error("#s8L89y Config file does not exist");
  }

  const configContents = await Deno.readTextFile(packageConfigFilePath);

  const parsedConfig = YAML.parse(configContents);

  const config = configSchema.parse(parsedConfig);

  return config;
};
