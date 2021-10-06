import { exec, execFile, fork, spawn } from "child_process";
import * as core from "@actions/core";

function startCLI(files: string[] | undefined): void {
    if (files !== undefined) {
        let fileArguments = "";
        for (const file of files) {
            fileArguments += ` ${file}`;
        }
        execCommand(`ponicode test ${fileArguments}`);
    }
}

function execCommand(command: string, ...args: string[]) {
    const execProcess = exec(command, { 'encoding': 'utf8' }, (error, stdout) => {
        core.debug(`exec stdout: ${stdout} error: ${error}`);
    });
    core.debug("spawn");
    core.debug(execProcess.spawnfile);
    execProcess.on("spawn", () => {
        core.debug("spawn on spawn");
    });
    execProcess.stdout?.on("data", (data) => {
        core.debug(`spawn stdout: ${data}`);
    });
    execProcess.stderr?.on("data", (data) => {
        core.debug(`spawn on error ${data}`);
    });
    execProcess.on("exit", (code, signal) => {
        core.debug(`spawn on exit code: ${code} signal: ${signal}`);
    });
    execProcess.on("close", (code: number, args: any[]) => {
        core.debug(`spawn on close code: ${code} args: ${args}`);
    });
}

export { startCLI };
