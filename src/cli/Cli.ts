import * as core from "@actions/core";
import { exec, execFile, fork, spawn } from "child_process";
import * as fs from "fs";
import * as rd from "readline";
import { Markdown } from "../markdown/Markdown";
import PullRequest from "../pull_request/PullRequest";
import { getPRBranchName } from "../pull_request/utils";
import { ActionInputs } from "../types";
import Login from "./Login";
import { TestFile } from "./types";

import lineReader from "line-reader";

class CLI {

    private files: string[] | undefined;

    public async login(inputs: ActionInputs, callback: () => void): Promise<void> {
        core.debug("Authenticating Ponicode CLI");
        await Login.setXdgConfigToken(inputs);

        // DEBUG
        const confContent: string | undefined = Login.getConfigFileContent();
        if (confContent) {
            core.debug(confContent);
        }

        core.debug("Loging Ponicode CLI");
        this.execCommand(`ponicode login`, () => {
            core.debug("Ponicoed CLI is well authenticated");
            callback();
        });
    }

    public async startCLI(inputs: ActionInputs, files: string[] | undefined): Promise<void> {
        if (files !== undefined) {
            this.files = files;
            let fileArguments = "";
            for (const file of files) {
                fileArguments += ` ${file}`;
            }

            await this.login(inputs, () => {
                //DEBUG
                core.debug(`Start generating Tests for ${files.toString()}`);

                this.execCommand(`ponicode test ${fileArguments} > /dev/null`, async () => {

                    const testFiles: TestFile[] = this.readTestFiles(this.files);
                    if ((testFiles !== undefined) && (testFiles.length > 0)) {
                        // core.debug(JSON.stringify(testFiles));

                        // Implement processing of the test Files=
                        // 1/ Create a PR with those files using 
                        //    https://github.com/gr2m/octokit-plugin-create-pull-request
                        // 2/ Generate a comment with an extract of the generateg UT
                        // PullRequest.generatePRComment(Markdown.createTestCodeComment(testFiles));

                        const check: number | undefined =
                            await PullRequest.isPRExist(getPRBranchName(inputs), inputs.apiInputs.branch );
                        const markdown = new Markdown(inputs.apiInputs.branch, inputs.apiInputs.repoURL, undefined);

                        if (check !== undefined) {
                            core.debug("PR already exists, create a commit");
                            PullRequest.createCommit(testFiles, inputs, check, markdown);
                        } else {
                            core.debug("PR does not exist: create the PR");
                            PullRequest.createUTPullRequest(testFiles, inputs, markdown);
                        }

                    }

                });
            });

        }
    }

    private readTestFiles(files: string[] | undefined): TestFile[] {

        const result: TestFile[] = [];

        if (files !== undefined) {
            for (const file of files) {
                if (file !== undefined) {
                    const testName: string = file.split(".")[0] + ".test." + file.split(".").pop();

                    // Comment all lines of the test file
                    this.commentAllLinesofFile(testName);

                    try {
                        const fileContent = fs.readFileSync(testName, "utf-8");

                        if (file) {
                            const testFile = {
                                filePath: testName,
                                content: fileContent,
                            };
                            result.push(testFile);
                        }
                    } catch (e) {
                        const error = e as Error;
                        core.debug(error.message);
                    }

                }

            }

        }

        return result;

    }

    private commentAllLinesofFile(filePath: string): void {
        const addPrefix = (str: string) => "// " + str;
        let fileContent: string = "";

        // DEBUG
        core.debug(`Read file ${filePath} for appending comments`);
        const data = fs.readFileSync(filePath, "utf-8");
        // split the contents by new line
        const lines = data.split(/\r?\n/);

        // print all lines
        lines.forEach((l) => {
            const prefixedLine = addPrefix(l) + "\n";
            // DEBUG
            core.debug(prefixedLine);

            fileContent += prefixedLine;
        });

    /*    lineReader.eachLine(filePath, (line) => {
            // DEBUG
            core.debug(line);

            const prefixedLine = addPrefix(line) + "\n";

            fileContent += prefixedLine;
        });
    */
     /*   const reader = rd.createInterface(fs.createReadStream(filePath, "utf-8"));
        reader.on("line", (l: string) => {

                const prefixedLine = addPrefix(l) + "\n";
                // DEBUG
                core.debug(prefixedLine);

                fileContent += prefixedLine;
        });
        reader.on("close", () => {
            core.debug("Done parsing the test file for commenting");
        });
*/

        fs.writeFileSync(filePath, fileContent);

        // DEBUG
        core.debug(fileContent);

    }

    private execCommand(command: string, callback: () => void) {
        const execProcess = exec(command, { 'encoding': 'utf8' }, (error, stdout) => {
            core.debug(`exec stdout: ${stdout} error: ${error}`);
        });
        execProcess.on("spawn", () => {
            core.debug("spawn on spawn");
        });
        execProcess.stderr?.on("data", (data) => {
            core.debug(`spawn on error ${data}`);
        });
        execProcess.on("exit", (code, signal) => {
            core.debug(`spawn on exit code: ${code} signal: ${signal}`);
        });
        execProcess.on("close", (code: number, args: any[]) => {
            core.debug(`spawn on close code: ${code} args: ${args}`);
            if (code === 0) {
                callback();
            } else {
                core.debug("Command fails");
            }
        });
    }

}

export default new CLI();
