import * as core from "@actions/core";
import * as github from "@actions/github";
import * as dotenv from "dotenv";
import { parseInputs } from "./inputs";
import { createAlertsMessage, createFullReportMessage } from "./markdown/markdown";
import { generatePRComment } from "./pull_request/squar_report";
import { triggerSquarEvaluate, triggerSquarReport } from "./squar_client";
import { EvaluateReturn, FetchReportInput, Inputs, Report } from "./types";

dotenv.config({ path: __dirname + "/.env" });

function processInputs(): Inputs {
    core.debug(`Parsing inputs`);
    const inputs = parseInputs(core.getInput);
    return inputs;
}

async function triggerSQUARANalysis(inputs: Inputs): Promise<EvaluateReturn> {
    core.debug("Triggering SQUAR processing");
    core.debug(JSON.stringify(inputs));

    // Trigger SQUAR evaluate_pr endpoint
    const result: EvaluateReturn = await triggerSquarEvaluate(inputs);
    if (!result.success) {
        const errorMessage = result.message ? result.message : "Error Tgriggering SQUAR report";
        core.setFailed(errorMessage);
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
        const reportResult: Report = await triggerSquarReport(reportInputs, triggerResult.repositoryId, parseInt(process.env.FETCH_REPORT_RETRY_MILLISEC, 10));
        return reportResult;
    } else {
        const errorMessage: string = "No Repository Id";
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

        const triggerResult: EvaluateReturn = await triggerSQUARANalysis(inputs);

        const report: Report | undefined = await fetchSQUARReport(triggerResult, inputs);

        void generatePRComment(createAlertsMessage(report?.suggestionsOnImpactedFiles));

        void generatePRComment(createFullReportMessage(report));

    } catch (e) {
        const error = e as Error;
        core.debug(error.toString());
        core.setFailed(error.message);
    }

}

void run();
