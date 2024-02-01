#!/usr/bin/env node


import { exec } from "child_process"
import inquirer from "inquirer";
import boxen from "boxen";


async function main() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'githubUsername',
            message: 'Enter your GitHub username:',
        },
        {
            type: 'password',
            name: 'githubPersonalAccessToken',
            message: 'Enter your GitHub personal access token:',
        },
        {
            type: 'input',
            name: 'repositoryName',
            message: 'Enter your repository name:',
        },
        {
            type: 'input',
            name: 'projectDirectory',
            message: 'Enter your project directory:',
        },
    ]);

    const { githubUsername, githubPersonalAccessToken, repositoryName, projectDirectory } = answers;

    const command = `./index.sh "${githubUsername}" "${githubPersonalAccessToken}" "${repositoryName}" "${projectDirectory}"`;

    exec(command, function (err, stdout, stderr) {
        if (err) {
            console.error('Error executing shell script:', err);
            return;
        } else if (stderr) {
            console.error('Shell script errors:', stderr);
            return;
        }
        console.log(stdout);
        console.log(boxen('Made with love by <MuhireIghor />', {
            margin: 1,
            float: 'left',
            padding: 1,
            borderStyle: "single",
            borderColor: "green"
        }))

    });
}

main();
