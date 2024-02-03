#!/usr/bin/env node

import { exec } from "child_process";
import boxen from "boxen";
import inquirer from "inquirer";
import { program } from "commander";
import pkg from "../package.json" assert { type: "json" };
import { writeFile, existsSync, readFileSync } from "fs";
import chalk from "chalk";
import { logMessage, logError } from "../lib/log.js";
import { getConfigDir } from "../lib/config_dir.js";
import path from "path";

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
  .action(async (repositoryName) => {
    const config_dir = getConfigDir();
    if (!existsSync(config_dir)) {
      logError(
        "Configurations not found. Please run `repoinitiator config` to configure repoinitiator."
      );
      return;
    }
    const config_info = JSON.parse(readFileSync(config_dir, "utf8"));
    const { githubUsername, githubPersonalAccessToken } = config_info;
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "directory",
        message: "Enter the directory for the repository: ",
      },
    ]);

    const local_repo_dir = path.join(process.cwd(), answers.directory);

    let command;

    if (process.platform == "linux") {
      command = `../scripts/shell/index.sh "${githubUsername}" "${githubPersonalAccessToken}" "${repositoryName}" "${local_repo_dir}"`;
    } else {
      command = `../scripts/batch/index.bat "${githubUsername}" "${githubPersonalAccessToken}" "${repositoryName}" "${local_repo_dir}"`;
    }

    exec(command, function (err, stdout, stderr) {
      if (err) {
        console.error("Error executing shell script:", err);
        return;
      } else if (stderr) {
        console.error("Shell script errors:", stderr);
        return;
      }
      console.log(stdout);
      console.log(
        boxen("Made with love by <MuhireIghor />", {
          margin: 1,
          float: "left",
          padding: 1,
          borderStyle: "single",
          borderColor: "green",
        })
      );
    });
  });

program.parse();
