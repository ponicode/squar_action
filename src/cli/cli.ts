import * as core from "@actions/core";
import { exec, execFile, fork, spawn } from "child_process";
import * as fs from "fs";
import { TestFile } from "./types";

class CLI {

    private files: string[] | undefined;

    public startCLI(files: string[] | undefined): void {
        if (files !== undefined) {
            this.files = files;
            let fileArguments = "";
            for (const file of files) {
                fileArguments += ` ${file}`;
            }
            this.execCommand(`ponicode test ${fileArguments}`);
        }
    }

    private readTestFiles(files: string[] | undefined): TestFile[] {

        let result: TestFile[] = [];

        if (files !== undefined) {
            for (const file of files) {
                if (file !== undefined) {
                    const testName: string = file.split(".")[0] + ".test." + file.split(".").pop();

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

    private execCommand(command: string, ...args: string[]) {
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
            const testFiles: TestFile[] = this.readTestFiles(this.files);
            core.debug(JSON.stringify(testFiles));
        });
    }

}

export default new CLI();
