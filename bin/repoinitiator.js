#!/usr/bin/env node

// Ignore Node warnings
supressWarnings();

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
import { supressWarnings } from "../lib/suppress_warning.js";

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

    // Check if Git is installed
    exec('git --version', (error, stdout, stderr) => {
      if (error) {
        logError(chalk.red.bold("Git is not installed on your machine. Please install Git and try again."));
        return;
      }
    });

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
      {
        type: "checkbox",
        name: "isRepoPrivate",
        message: ' Is the repo private',
        choices: ["false", "true"
        ],
      }
    ]);

    const local_repo_dir = path.join(process.cwd(), answers.directory);

    let command;

    if (process.platform == "linux" ) {
      const shell_path = path.join(import.meta.dirname, "../scripts/shell/index.sh");
      command = `${shell_path} "${githubUsername}" "${githubPersonalAccessToken}" "${repositoryName}" "${local_repo_dir}"`;
    } 
    else if (process.platform == "darwin"){
      const shell_path = path.join("/usr/local/lib/node_modules",".repoinitiator/scripts/shell/index.sh");
      command = `${shell_path} "${githubUsername}" "${githubPersonalAccessToken}" "${repositoryName}" "${local_repo_dir}"`;
    }
    else {
      console.log(import.meta.dirname);
      const appDataPath =(process.env.USERPROFILE ? path.join(process.env.USERPROFILE, "AppData", "Roaming", "npm", "node_modules", "repoinitiator") : null) || (process.env.APPDATA?path.join(process.env.APPDATA, "npm","node_modules","repoinitiator"):null);
      const batch_path = path.join(appDataPath, "./scripts/batch/index.bat");
      command = `"${batch_path}" "${githubUsername}" "${githubPersonalAccessToken}" "${repositoryName}" "${local_repo_dir}"`;
    }

    exec(command, function (err, stdout, stderr) {

      if (err) {
        console.error("Error executing shell script:", err);
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
