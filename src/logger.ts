import { datetime, log } from "../deps.ts";

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
            formatter: (logRecord) => {
              const date = datetime.format(
                logRecord.datetime,
                `yyyy-MM-dd_HH:mm:ss.SSS`
              );
              const level = logRecord.levelName.padEnd(8, " ");
              return `${date} ${level} ${logRecord.msg}`;
            },
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
