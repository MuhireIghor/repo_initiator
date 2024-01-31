#!/bin/env node

'use strict'
import { exec } from "child_process"
import boxen from "boxen"
import chalk from "chalk"
const text = chalk.blue.bold("Made with love by <MuhireIghor />\n\n ")
function main() {
    exec("./index.sh", function (err, stdout, stderr) {
        if (err) {
            console.log(err);
            return;

        }
        else if (stderr) {
            console.log(stderr);
            return;
        }
        console.log(boxen(text, { padding: 1, borderStyle: 'singleDouble', borderColor: 'blue', margin: '1', backgroundColor: 'black', height: 8 }))
    })
}

main()