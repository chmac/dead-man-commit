import { log } from "../deps.ts";

export const logSetup = async ({
  file,
  level,
}: {
  file?: string;
  level: "DEBUG" | "INFO" | "ERROR";
}) => {
  const handlers = {
    console: new log.handlers.ConsoleHandler(level),
    ...(typeof file === "string"
      ? {
          file: new log.handlers.FileHandler(level, {
            filename: file,
            formatter: `{datetime} {levelName} {msg}`,
          }),
        }
      : {}),
  };
  await log.setup({
    handlers,
    loggers: {
      default: {
        level: level,
        handlers: Object.keys(handlers),
      },
    },
  });
};

export const getLogger = () => log.getLogger();
