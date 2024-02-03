import path from "path";
import { logError } from "./log.js";
import chalk from "chalk";

export const getConfigDir = () => {
  let config_dir;
  const appDataPath =
    process.env.APPDATA ||
    (process.env.USERPROFILE
      ? path.join(process.env.USERPROFILE, "AppData", "Roaming")
      : null);

  if (process.platform === "linux") {
    config_dir = path.join(process.env.HOME, ".repoinitiator.config");
  } else if (appDataPath) {
    config_dir = path.join(
      appDataPath,
      "repoinitiator",
      ".repoinitiator.config"
    );
  } else {
    logError(chalk.blue.bold("Unable to determine the configuration directory."));
    process.exit(1);
  }

  return config_dir;
};