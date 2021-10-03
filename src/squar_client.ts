import axios, { AxiosInstance, AxiosResponse } from "axios";
import { assert } from "console";
import { Logger } from "tslog";
import { EvaluateReturn, FetchReportInput, Inputs, Report } from "./types";

const log: Logger = new Logger();
/** 
* Triggers SQUAR evaluate_pr endpoint
* @param {Inputs} inputs - contains the inputs required for the endpoint
* @return {Promise<EvaluateReturn>} returns a promise with the EvaluateReturn object
*/
function triggerSquarEvaluate(inputs: Inputs): Promise<EvaluateReturn> {
    return axios({
        method: 'POST',
        data: inputs,
        url: process.env.SQUAR_API_URL + "/evaluate_pr",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res: AxiosResponse) => {
        return res.data;
      }).then((data: EvaluateReturn) => {
        return data;
      }).catch((err: any) => {
        const result: EvaluateReturn = {
            success: false,
            message: "Error triggering SQUAR evaluate_pr endpoint :" + err.message,
        };
        return result;
      });

}
// Define the Promise executor type for clarity purpose
type PromiseExecutor = (resolve: (value: Report) => void, reject: (reason?: any) => void) => void;
/** 
* Block the main thread to wait before moving on in the execution.
* @param {number} ms - Number of msec to wait
* @return {void} No return value
*/
function wait(ms: number): void {
    const start = new Date().getTime();
    let end = start;
    while (end < start + ms) {
      end = new Date().getTime();
   }
 }
/** 
* Function that triggers again a Promise execution while this is not successfull
* @param {number} timerMilliSec - Timer in msec to wait before retrying
* @param {PromiseExecutor} executor - Promise executor to be used in Promise execution retry
* @return {Promise<Report>} returns a promise that executes the Promise Executor
*/
function retry(timerMilliSec: number, executor: PromiseExecutor): Promise<Report> {

    if (typeof timerMilliSec !== "number") {
        throw new TypeError("retries is not a number");
    }

    wait(timerMilliSec);

    return new Promise<Report>(executor).catch((error) => retry(timerMilliSec, executor));

}
/** 
* Trigger SQUAR report_pr endpoint
* @summary The function retries every timer msec so that it periodically checks when the report is available (it takes couple of seconds to be processed by Havana)
* @param {FetchReportInput} inputs - Inputs of the endpoint
* @param {number} repositoryId - Repository Id of the repo to be processed
* @param {number} timer - Numbmer of msec to wait beteween each retries
* @return {Promise<Report>} Returns the Promise with the generated Report
*/
async function triggerSquarReport(inputs: FetchReportInput, repositoryId: number, timer: number): Promise<Report> {

    const executor: PromiseExecutor = ((resolve: (value: Report) => void, reject: (reason?: any) => void) => {
        axios({
            method: 'GET',
            data: inputs,
            url: process.env.SQUAR_API_URL + "/report_pr/" + repositoryId,
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res: AxiosResponse) => {
            return res.data;
          }).then((report: Report) => {
              log.debug(report);
              return report;
          }).catch((err: any) => {
              log.debug("ERROR fetching report");
              reject(err);
          });
    });
    return retry(timer, executor);

}

export { triggerSquarEvaluate, triggerSquarReport };
