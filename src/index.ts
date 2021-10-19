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

function removeDuplicateInImpactedFiles(impactedFiles: string[] | undefined): string[] {
    const result = [...Array.from(new Set(impactedFiles))];
    return result;
}

/** 
* Main entry point.
* @param {string[]} args - arguments received from the command-line
* @return {void} 
*/
async function run(): Promise<void> {

    try {

        // Get the inputs from the CI
        const squarAPIInputs: SquarAPIInputs = processSquarAPIInputs();
        const actionInputs: ActionInputs = processActionInputs();

        // Trigger SQUAR API to generate the reports
        const triggerResult: EvaluateReturn | undefined = await Squar.triggerSQUARANalysis(squarAPIInputs);

        if (triggerResult !== undefined) {
            // Get SQUAR report
            const report: Report | undefined = await Squar.fetchSQUARReport(triggerResult, squarAPIInputs);

            if (report !== undefined) {
                const markdown = new Markdown(squarAPIInputs.branch, squarAPIInputs.repoURL, report);
                // Write a comment with the alerts in the files of the PR
                void PullRequest.generatePRComment(markdown.createAlertsMessage(report.suggestionsOnImpactedFiles));

                if (actionInputs.displayFullReport === "true") {
                    // Generate and write in a comment the Full SQUAR report
                    const reportComment = await markdown.createFullReportMessage();
                    void PullRequest.generatePRComment(reportComment);
                }

                // Generate and write in a comment the definitions of SQUAR vocabulary
                const definitionsComment = Markdown.generateCriticityLegend();
                void PullRequest.generatePRComment(definitionsComment);

                if (actionInputs.bootstrapUT === "true") {
                     // Extract PR impacted files
                    const impactedFiles = removeDuplicateInImpactedFiles(extractImpactedFilesFromReport(report));

                    // Start Ponicode CLI on the impacted files only
                    core.setOutput("impacted_files", impactedFiles);
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

// E2E Test #1
