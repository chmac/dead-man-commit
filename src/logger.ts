import { datetime, log } from "../deps.ts";

const formatter = (logRecord: log.LogRecord) => {
  const date = datetime.format(logRecord.datetime, `yyyy-MM-dd_HH:mm:ss.SSS`);
  const level = logRecord.levelName.padEnd(8, " ");
  return `${date} ${level} ${logRecord.msg}`;
};

export const logSetup = async ({
  file,
  level,
}: {
  file?: string;
  level: "DEBUG" | "INFO" | "ERROR";
}) => {
  await log.setup({
    handlers:
      typeof file === "string"
        ? {
            file: new log.handlers.FileHandler(level, {
              filename: file,
              formatter,
            }),
          }
        : { console: new log.handlers.ConsoleHandler(level, { formatter }) },
    loggers: {
      default: {
        level: level,
        handlers: typeof file === "string" ? ["file"] : ["console"],
      },
    },
  });
};

export const getLogger = () => log.getLogger();
