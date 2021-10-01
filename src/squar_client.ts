import axios, { AxiosInstance, AxiosResponse } from "axios";
import { assert } from "console";
import { Logger } from "tslog";
import { EvaluateReturn, Inputs, FetchReportInput, Report } from "./types";

const log: Logger = new Logger();

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

type PromiseExecutor = (resolve: (value: Report) => void, reject: (reason?: any) => void) => void;

async function delay(timerMilliSec: number) {
    // tslint:disable-next-line: max-line-length
    await new Promise(() => setTimeout(() => { log.debug(`Wait for ${timerMilliSec}`); }, timerMilliSec));
}

function retry(timerMilliSec: number, executor: PromiseExecutor): Promise<Report> {

    if (typeof timerMilliSec !== "number") {
        throw new TypeError("retries is not a number");
    }

    delay(timerMilliSec);

    return new Promise<Report>(executor).catch((error) => retry(timerMilliSec, executor));

}

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
