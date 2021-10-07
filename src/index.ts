import * as core from "@actions/core";
import * as dotenv from "dotenv";
import CLI from "./cli/Cli";
import { extractImpactedFilesFromReport } from "./cli/utils";
import { parseActionInputs, parseSquarAPIInputs } from "./squar/inputs";
import { Markdown } from "./markdown/Markdown";
import PullRequest from "./pull_request/PullRequest";
import Squar from "./squar/Squar";
import { ActionInputs, EvaluateReturn, Report, SquarAPIInputs } from "./types";

dotenv.config({ path: __dirname + "/.env" });

function processSquarAPIInputs(): SquarAPIInputs {
    core.debug(`Parsing inputs`);
    const inputs = parseSquarAPIInputs(core.getInput);
    return inputs;
}

function processActionInputs(): ActionInputs {
    core.debug(`Parsing inputs`);
    const inputs = parseActionInputs(core.getInput);
    return inputs;
}

/** 
* Main entry point.
* @param {string[]} args - arguments received from the command-line
* @return {void} 
*/
async function run(): Promise<void> {

    try {

        const squarAPIInputs: SquarAPIInputs = processSquarAPIInputs();
        const actionInputs: ActionInputs = processActionInputs();

        const triggerResult: EvaluateReturn | undefined = await Squar.triggerSQUARANalysis(squarAPIInputs);

        if (triggerResult !== undefined) {
            const report: Report | undefined = await Squar.fetchSQUARReport(triggerResult, squarAPIInputs);

            if (report !== undefined) {
                const markdown = new Markdown(squarAPIInputs.branch, squarAPIInputs.repoURL, report);
                void PullRequest.generatePRComment(markdown.createAlertsMessage(report.suggestionsOnImpactedFiles));

                if (actionInputs.displayFullReport === "true") {
                    const reportComment = await markdown.createFullReportMessage();
                    void PullRequest.generatePRComment(reportComment);
                }

                const impactedFiles = extractImpactedFilesFromReport(report);

                core.setOutput("impacted_files", impactedFiles);

                if (actionInputs.bootstrapUT === "true") {
                    await CLI.startCLI(actionInputs, impactedFiles);
                }

            }

        }

    } catch (e) {
        const error = e as Error;
        core.debug(error.toString());
        core.setFailed(error.message);
    }

}

void run();
