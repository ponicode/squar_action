import * as core from "@actions/core";
import * as dotenv from "dotenv";
import CLI from "./cli/Cli";
import { extractImpactedFilesFromReport } from "./cli/utils";
import { parseInputs } from "./inputs";
import { Markdown } from "./markdown/Markdown";
import PullRequest from "./pull_request/PullRequest";
import Squar from "./squar/Squar";
import { EvaluateReturn, Inputs, Report } from "./types";

dotenv.config({ path: __dirname + "/.env" });

function processInputs(): Inputs {
    core.debug(`Parsing inputs`);
    const inputs = parseInputs(core.getInput);
    return inputs;
}

/** 
* Main entry point.
* @param {string[]} args - arguments received from the command-line
* @return {void} 
*/
async function run(): Promise<void> {

    try {

        const inputs: Inputs = processInputs();

        const triggerResult: EvaluateReturn | undefined = await Squar.triggerSQUARANalysis(inputs);

        if (triggerResult !== undefined) {
            const report: Report | undefined = await Squar.fetchSQUARReport(triggerResult, inputs);

            if (report !== undefined) {
                const markdown = new Markdown(inputs.branch, inputs.repoURL, report);
                void PullRequest.generatePRComment(markdown.createAlertsMessage(report.suggestionsOnImpactedFiles));

                if (inputs.displayFullReport === "true") {
                    const reportComment = await markdown.createFullReportMessage();
                    void PullRequest.generatePRComment(reportComment);
                }

                const impactedFiles = extractImpactedFilesFromReport(report);

                core.setOutput("impacted_files", impactedFiles);

                if (inputs.bootstrapUT === "true") {
                    await CLI.startCLI(inputs, impactedFiles);
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
