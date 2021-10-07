import * as core from "@actions/core";
import { Markdown } from "../markdown/Markdown";
import PullRequest from "../pull_request/PullRequest";
import { EvaluateReturn, FetchReportInput, SquarAPIInputs, Report } from "../types";
import SquarClient from "./squar_client";

class Squar {

    public async triggerSQUARANalysis(inputs: SquarAPIInputs): Promise<EvaluateReturn | undefined> {
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

    public async fetchSQUARReport(triggerResult: EvaluateReturn, inputs: SquarAPIInputs): Promise<Report | undefined> {
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

}

export default new Squar();
