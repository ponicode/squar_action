import * as core from "@actions/core";
import { readFileSync } from 'fs';
import { TestFile } from "../cli/types";
import { Report, TestAlert } from "../types";
import { buildGithubFileURL, buildGithubSecretURL, initMarkdownTable, 
    translateAlertType, translateCriticity } from "./utils";
import { Marked } from '@ts-stack/markdown';

const replace = require("replace-in-file");

class Markdown {

    static async createSQUARErrorMessage(errorMessage: string | undefined, repoURL: string): Promise<string> {
        const fileName = __dirname + "/error_message.md";
        const url = buildGithubSecretURL(repoURL);
        const options = {
            files: fileName,
            from: [/%errorMessage%/g, /%url%/g],
            to: [errorMessage, url],
        };

        await replace(options);

        const message = readFileSync(fileName, "utf-8");
        return message;
    }

    static async createUTErrorMessage(errorMessage: string | undefined, repoURL: string): Promise<string> {
        const fileName = __dirname + "/ut_error_message.md";
        const url = buildGithubSecretURL(repoURL);
        const options = {
            files: fileName,
            from: [/%errorMessage%/g, /%url%/g],
            to: [errorMessage, url],
        };

        await replace(options);

        const message = readFileSync(fileName, "utf-8");
        return message;
    }

    public static createTestCodeComment(testFiles: TestFile[]): string {
        let message = `## Overview of Unit-Tests generated for your impacted files\n`;
        message += Markdown.appendUTOverviewMessages(testFiles);
        return message;
    }

    private static appendUTOverviewMessages(testFiles: TestFile[]): string {
        let message: string = "";

        testFiles?.forEach((testFile: TestFile) => {
            message += `### Unit-Tests proposal for file ${testFile.filePath}\n`;
            message += Marked.parse(testFile.content);
        });

        return message;
    };

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
        }

        return message;
    }

    public async createFullReportMessage():
    Promise<string | undefined> {

        if (this.report?.fullReport) {

            const fileName = __dirname + "/full_report.md";

            await this.generateMessageFromMDFile(fileName);

            const message = this.addAlertsToFullReportComment(fileName);

            return message;

        } else {
            return undefined;
        }

    }

    public createNewPRComment(url: string | undefined, testFiles: TestFile[]): string {
        let message: string = "";

        if (url !== undefined) {
            message += "## Ponicode UT bootstrap Pull-Request\n";
            if (url !== undefined) {
                message += `### [Ponicode UT Bootstrap Pull-Request](${url})\n`;
            }
            message += "The PR contains unit-Test bootstrap for the following files:\n";
            testFiles.forEach((file: TestFile) => {
                message += `- ${file.filePath}`;
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

    private async generateMessageFromMDFile(file: string) {
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
