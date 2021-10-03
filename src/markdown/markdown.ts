import * as core from "@actions/core";
import { readFileSync } from 'fs';
import { AlertKind, Criticity, FullReport, Report, TestAlert } from "../types";
import { initMarkdownTable, translateAlertType, translateCriticity } from "./utils";

const replace = require("replace-in-file");
const GITHUB_URL = "https://github.com";

function appendMessageWithAlerts(suggestionsOnImpactedFiles: TestAlert[] | undefined, 
                                 initialMessage: string, repoURL: string, branch: string): string {

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
         message += `| [Bring me there](${GITHUB_URL}/${repoURL}/blob/${branch}/${alert.file_path}#L${alert.line}})`;
        message += "| \n";
    });

    return message;

}

// Create a markdown message from the two JSON.
function createAlertsMessage(suggestionsOnImpactedFiles: TestAlert[] | undefined, 
                             repo: any, branch: string): string | undefined {

    let message: string = "## GREAT Job! There is no alert on the files updated in the PR\n";

    if ((suggestionsOnImpactedFiles) && (suggestionsOnImpactedFiles.length > 0)) {

        message = "## List of alerts identified by Ponicode SQUAR in the files of your PR\n";

        message += initMarkdownTable();

        message = appendMessageWithAlerts(suggestionsOnImpactedFiles, message, repo, branch);
    }

    return message;
}

function addAlertsToFullReportComment(fileName: string, report: Report, repoURL: string, branch: string): string {
    let message = readFileSync(fileName, "utf-8");

    message += `## List of alerts identified by Ponicode SQUAR in your Project __*${report.fullReport.repoName}*__\n`;
    message += initMarkdownTable();

    message = appendMessageWithAlerts(report.fullReport.suggestions, message, repoURL, branch);

    return message;
}

async function generateMessageFromMDFile(file: string, report: FullReport, branch: string) {
    const options = {
        files: file,
        from: [/%repo_name%/g, /%grade%/g, /%missing_test_suites%/g, /%missing_test_cases%/g, /%missing_edge_cases%/g, /%branch%/g ],
        to: [report.repoName, report.ponicodeScore,
            report.missingTestSuite ? `${report.missingTestSuite}` : "0",
            report.missingTestCases ? `${report.missingTestCases}` : "0",
            report.missingEdgeCases ? `${report.missingEdgeCases}` : "0",
            branch ],
    };

    const results = await replace(options);
    core.debug(results);

}

async function createFullReportMessage(report: Report | undefined, repoURL: string, branch: string): Promise<string | undefined> {

    if (report?.fullReport) {

        const fileName = __dirname + "/full_report.md";

        await generateMessageFromMDFile(fileName, report?.fullReport, branch);

        const message = addAlertsToFullReportComment(fileName, report, repoURL, branch);

        return message;

    } else {
        return undefined;
    }

}

export { createAlertsMessage, createFullReportMessage };
