import * as core from "@actions/core";
import { readFileSync } from 'fs';
import { TestFile } from "../cli/types";
import { Report, TestAlert } from "../types";
import { buildGithubFileURL, buildGithubSecretURL, generateCriticityLegend, initMarkdownTable, 
    translateAlertType, translateCriticity } from "./utils";

const replace = require("replace-in-file");

class Markdown {

    private branch: string;
    private repoURL: string;
    private report: Report | undefined;

    constructor(branch: string, repoURL: string, report: Report | undefined) {
        this.branch = branch;
        this.repoURL = repoURL;
        this.report = report;
    }

    // Create a markdown message from the two JSON.
    public createAlertsMessage(suggestionsOnImpactedFiles: TestAlert[] | undefined): string | undefined {

        let message: string = "## GREAT Job! There is no alert on the files updated in the PR\n";

        if ((suggestionsOnImpactedFiles) && (suggestionsOnImpactedFiles.length > 0)) {

            message = "## List of alerts identified by Ponicode SQUAR in the files of your PR\n";

            message += initMarkdownTable();

            message = this.appendMessageWithAlerts(suggestionsOnImpactedFiles, message);

            message += generateCriticityLegend( __dirname + "/criticity_legends.md");
        }

        return message;
    }

    public async createFullReportMessage():
    Promise<string | undefined> {

        if (this.report?.fullReport) {

            const fileName = __dirname + "/full_report.md";

            await this.generateMessageFromMDFile(fileName);

            let message = this.addAlertsToFullReportComment(fileName);

            message += generateCriticityLegend( __dirname + "/criticity_legends.md");

            return message;

        } else {
            return undefined;
        }

    }

    public createUTPRComment(url: string | undefined, testFiles: TestFile[], isUpdate: boolean): string {
        let message: string = "";

        if (url !== undefined) {
            if (!isUpdate) {
                message += "## Ponicode UT bootstrap Pull-Request\n";
            } else {
                message += "## Ponicode UT bootstrap Pull-Request has been updated\n";
            }
            if (url !== undefined) {
                message += `### [Ponicode UT Bootstrap Pull-Request](${url})\n`;
            }
            if (!isUpdate) {
                message += "The PR contains the following unit-Test bootstrap files:\n";
            } else {
                message += "The PR has been updated for the following unit-Test bootstrap files:\n";
            }
            testFiles.forEach((file: TestFile) => {
                message += `- ${file.filePath}\n`;
            });
        }

        return message;
    }

    private appendMessageWithAlerts(suggestionsOnImpactedFiles: TestAlert[] | undefined,
                                    initialMessage: string): string {

        let message: string = initialMessage;

        suggestionsOnImpactedFiles?.forEach((alert: TestAlert) => {
        // First Column: The file
        // Please note the ` instead of ". This is TypeScripts
        // format string. Everything in ${ } will be replaced.
        message += `| ${alert.file_path}`;
        // Second column: the line number
        message += `| ${alert.line}`;
        // 3rd column: the type of alert.
        message += `| ${translateAlertType(alert.alert_kind)}`;
        // 4th column: the criticity of the function.
        message += `| <span style="color:${alert.criticity}">**${translateCriticity(alert.criticity)}**</span>`;
        // 5th column: the link to go directly to the file.
        message += `| ${buildGithubFileURL(alert, this.repoURL, this.branch)}`;
        //6th column: testable by Ponicode
        message += `| <p align="center"><img src="https://uploads-ssl.webflow.com/5f85a5ab7da846bd78f988af/5fb398a89699fb39f6afeb4b_1.%20Mark.svg" max-width="15" max-height="15"></p>`;
        message += "|\n";
        });

        return message;

    }

    private addAlertsToFullReportComment(fileName: string): string {
        let message = readFileSync(fileName, "utf-8");

        message += `## List of alerts identified by Ponicode SQUAR in your Project \
         __*${this.report?.fullReport.repoName}*__\n`;
        message += initMarkdownTable();

        message = this.appendMessageWithAlerts(this.report?.fullReport.suggestions, message);

        return message;
    }

    private async generateMessageFromMDFile(file: string): Promise<void> {
        const options = {
        files: file,
        from: [/%repo_name%/g, /%grade%/g, /%missing_test_suites%/g,
            /%missing_test_cases%/g, /%missing_edge_cases%/g, /%branch%/g ],
        to: [this.report?.fullReport.repoName, this.report?.fullReport.ponicodeScore,
        this.report?.fullReport.missingTestSuite ? `${this.report?.fullReport.missingTestSuite}` : "0",
        this.report?.fullReport.missingTestCases ? `${this.report?.fullReport.missingTestCases}` : "0",
        this.report?.fullReport.missingEdgeCases ? `${this.report?.fullReport.missingEdgeCases}` : "0",
        this.branch ],
        };

        const results = await replace(options);
        core.debug(results);

    }

}

export { Markdown };
