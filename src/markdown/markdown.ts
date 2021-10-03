import { FullReport, Report, TestAlert } from "../types";
import { readFileSync } from 'fs';
import { MessageChannel } from "worker_threads";

function initMarkdownTable(): string {
    let message = "";
    // Table Title
    message += "| File | Line Number | Type of alert |\n";
    // Table Column Definitions
    message += "| :--- | :---: | :---: |\n";

    return message;
}

// Create a markdown message from the two JSON.
function createAlertsMessage(suggestionsOnImpactedFiles: TestAlert[] | undefined): string | undefined {

    let message: string = "## GREAT Job! There is no alert on the files updated in the PR\n";

    if (suggestionsOnImpactedFiles) {

        message = "## List of alerts identified by Ponicode SQUAR in the files of your PR\n";

        message += initMarkdownTable();

        suggestionsOnImpactedFiles.forEach((alert: TestAlert) => {
            // First Column: The file
            // Please note the ` instead of ". This is TypeScripts
            // format string. Everything in ${ } will be replaced.
            message += `| ${alert.file_path}`;
            // Second column: the line number
            message += `| ${alert.line}`;
            // Third column: the criticity of the alert.
            message += `| ${alert.criticity}`;
            message += "| \n";
        });
    }

    return message;
}

function generateMessageFromMDFile(message: string, report: FullReport): string {
    const result: string = message;
    result.replace("%{repo_name}%", report.repoName);
    result.replace("%{grade}%", report.ponicodeScore);
    result.replace("%{missing_test_suites}%", report.missingTestSuite ? `${report.missingTestSuite}` : "0");
    result.replace("%{missing_test_cases}%", report.missingTestCases ? `${report.missingTestCases}` : "0");
    result.replace("%{missing_edge_cases}%", report.missingEdgeCases ? `${report.missingEdgeCases}` : "0");

    return result;
}

function createFullReportMessage(report: Report | undefined): string | undefined {

    let message: string | undefined;

    if (report?.fullReport) {

        message = readFileSync(__dirname + "full_report.md", "utf-8");
        message = generateMessageFromMDFile(message, report?.fullReport);

    }

    return message;

}

export { createAlertsMessage, createFullReportMessage };
