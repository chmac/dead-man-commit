import { log } from "../deps.ts";

export const logSetup = async (consoleLevel: "DEBUG" | "INFO" | "ERROR") => {
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
};

export const getLogger = () => log.getLogger();
