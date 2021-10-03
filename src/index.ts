import * as core from "@actions/core";
import * as github from "@actions/github";
import * as dotenv from "dotenv";
import {parseInputs} from "./inputs";
import { triggerSquarEvaluate, triggerSquarReport } from "./squar_client";
import { EvaluateReturn, FetchReportInput, Inputs, Report } from "./types";

dotenv.config({ path: __dirname + "/.env" });

/** 
* Main entry point.
* @param {string[]} args - arguments received from the command-line
* @return {void} 
*/
async function run(): Promise<void> {

    try {

        core.debug(`Parsing inputs`);
        const inputs = parseInputs(core.getInput);

        core.debug("Triggering SQUAR processing");
        core.debug(JSON.stringify(inputs));

        if (process.env.FETCH_REPORT_RETRY_MILLISEC !== undefined) {
            // Trigger SQUAR evaluate_pr endpoint
            const result: EvaluateReturn = await triggerSquarEvaluate(inputs);
            if (!result.success) {
                const errorMessage = result.message ? result.message : "Error Tgriggering SQUAR report";
                core.setFailed(errorMessage);
            }
            core.debug(JSON.stringify(result));

            core.debug("Fetching SQUAR report");

            // If repository_id is defined then retry fetchReport until we get it
            if ((result.repositoryId !== undefined) && (process.env.FETCH_REPORT_RETRY_MILLISEC !== undefined)) {
                const reportInputs: FetchReportInput = {
                    userToken: inputs.userToken,
                };
                // tslint:disable-next-line: max-line-length
                const reportResult: Report = await triggerSquarReport(reportInputs, result.repositoryId, parseInt(process.env.FETCH_REPORT_RETRY_MILLISEC, 10));
                core.debug(JSON.stringify(reportResult));
            } else {
                const errorMessage: string = "No Repository Id";
                core.setFailed(errorMessage);
            }
        } else {
            const errorMessage = "Missing ENV variable: FETCH_REPORT_RETRY_MILLISEC";
            core.setFailed(errorMessage);
        }

    } catch (e) {
        const error = e as Error;
        core.debug(error.toString());
        core.setFailed(error.message);
    }

}

void run();
