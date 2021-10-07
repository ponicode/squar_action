import * as core from "@actions/core";
import * as github from "@actions/github";
import * as dotenv from "dotenv";
import CLI from "./cli/Cli";
import { extractImpactedFilesFromReport } from "./cli/utils";
import { parseInputs } from "./inputs";
import { Markdown } from "./markdown/Markdown";
import PullRequest from "./pull_request/PullRequest";
import SquarClient from "./squar_client";
import { EvaluateReturn, FetchReportInput, Inputs, Report } from "./types";

dotenv.config({ path: __dirname + "/.env" });

function processInputs(): Inputs {
    core.debug(`Parsing inputs`);
    const inputs = parseInputs(core.getInput);
    return inputs;
}

async function triggerSQUARANalysis(inputs: Inputs): Promise<EvaluateReturn | undefined> {
    core.debug("Triggering SQUAR processing");
    core.debug(JSON.stringify(inputs));

    // Trigger SQUAR evaluate_pr endpoint
    const result: EvaluateReturn = await SquarClient.triggerSquarEvaluate(inputs);
    if (!result.success) {
        const errorMessage = result.message ? result.message : "Error Tgriggering SQUAR report";
        //core.setFailed(errorMessage);
        // Push an error message in PR comment
        const message = await Markdown.createSQUARErrorMessage(errorMessage, inputs.repoURL);
        void PullRequest.generatePRComment(message);
        return ;
    }
    core.debug(JSON.stringify(result));
    return result;
}

async function fetchSQUARReport(triggerResult: EvaluateReturn, inputs: Inputs): Promise<Report | undefined> {
    core.debug("Fetching SQUAR report");

    // If repository_id is defined then retry fetchReport until we get it
    if ((triggerResult.repositoryId !== undefined) && (process.env.FETCH_REPORT_RETRY_MILLISEC !== undefined)) {
        const reportInputs: FetchReportInput = {
            userToken: inputs.userToken,
        };
        // tslint:disable-next-line: max-line-length
        const reportResult: Report = await SquarClient.triggerSquarReport(reportInputs, triggerResult.repositoryId, parseInt(process.env.FETCH_REPORT_RETRY_MILLISEC, 10));
        return reportResult;
    } else {
        const errorMessage: string = "No Repository Id";
        // Push an error message in PR comment
        const message = await Markdown.createSQUARErrorMessage(errorMessage, inputs.repoURL);
        void PullRequest.generatePRComment(message);
        core.setFailed(errorMessage);
        return undefined;
    }
}

/** 
* Main entry point.
* @param {string[]} args - arguments received from the command-line
* @return {void} 
*/
async function run(): Promise<void> {

    try {

        const inputs: Inputs = processInputs();

        const triggerResult: EvaluateReturn | undefined = await triggerSQUARANalysis(inputs);

        if (triggerResult !== undefined) {
            const report: Report | undefined = await fetchSQUARReport(triggerResult, inputs);

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
