#!/usr/bin/env node

import { exec } from "child_process";
import boxen from "boxen";
import inquirer from "inquirer";
import { program } from "commander";
import pkg from "../package.json" assert { type: "json" };
import { writeFile, existsSync } from "fs";
import chalk from "chalk";
import { logMessage, logError } from "../lib/log.js";
import { getConfigDir } from "../lib/config_dir.js";

program
  .name("repoinitiator")
  .description("With CLI, Create a new repository on Github")
  .usage("command [arguments]")
  .version(
    `\x1b[1mv${pkg.version}\x1b[0m`,
    "-v, --version",
    "Output repoinitiator's current version."
  )
  .helpOption("-h, --help", "Output usage of repoinitiator.");

program
  .command("config")
  .description("Configure repoinitiator locally")
  .action(async () => {
    const config_dir = getConfigDir();
    if (existsSync(config_dir)) {
      logMessage(chalk.redBright.bold("Configurations already exists"));
      return;
    } else {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "githubUsername",
          message: "GitHub username: ",
        },
        {
          type: "password",
          name: "githubPersonalAccessToken",
          message: "GitHub personal access token: ",
        },
      ]);
      writeFile(config_dir, JSON.stringify(answers), (err) => {
        if (err) {
          logError("Error writing to the file:", err);
        } else {
          logMessage(chalk.blue.bold("Configurations saved successfully."));
        }
      });
    }
  });

program
  .command("new <repository_name>")
  .description("Create a new repository on Github")
  .action((repositoryName) => {
    logMessage(boxen('Made with love by <MuhireIghor />', {
        margin: 1,
        float: 'left',
        padding: 1,
        borderStyle: "single",
        borderColor: "green"
    }))
  });

program.parse();
