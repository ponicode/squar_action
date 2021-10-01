import * as dotenv from "dotenv";
import { Logger } from "tslog";
import { triggerSquarEvaluate, triggerSquarReport } from "./squar_client";
import { EvaluateReturn, FetchReportInput, Inputs, Report } from "./types";

dotenv.config({ path: __dirname + "/.env" });

const log: Logger = new Logger();

/** 
* Checks all args are well defined
* @param {string[]} args - arguments received from the command-line
* @return {boolean} returns true if all arguments are well defined. False else.
*/
function check_args(args: string[]): boolean {
    let result: boolean = true;
    for (let i = 0; i < 4; i++ ) {
        result = result && (args[i] !== undefined);
    }
    return result;
}

/** 
* Main entry point.
* @param {string[]} args - arguments received from the command-line
* @return {void} 
*/
function main(args: string[]): void {

    const inputs: Inputs = JSON.parse(args[0]);

    log.debug(inputs);

    if (process.env.FETCH_REPORT_RETRY_MILLISEC !== undefined) {
        // Trigger SQUAR evaluate_pr endpoint
        triggerSquarEvaluate(inputs).then((result: EvaluateReturn) => {
            log.debug(result);
            const reportInputs: FetchReportInput = {
                userToken: inputs.userToken,
            };

            // If repository_id is defined then retry fetchReport until we get it
            if ((result.repositoryId !== undefined) && (process.env.FETCH_REPORT_RETRY_MILLISEC !== undefined)) {
                // tslint:disable-next-line: max-line-length
                triggerSquarReport(reportInputs, result.repositoryId, parseInt(process.env.FETCH_REPORT_RETRY_MILLISEC, 10)).then((reportResult: Report) => {
                    log.debug(reportResult);
                });
            } else {
                log.error("No Repository Id");
            }
        }).catch((result: EvaluateReturn) => {
            log.debug(result);
        });
    }

}

main(process.argv.slice(2));
