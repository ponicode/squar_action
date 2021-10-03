import { Report, TestAlert } from "./types";

function initMarkdownTable(): string {
    let message = "";
    // Table Title
    message += "| File | Line Number | Type of alert |\n";
    // Table Column Definitions
    message += "| :--- | :---: | :---: |\n";

    return message;
}


// Create a markdown message from the two JSON.
function createAlertsMessage(suggestionsOnImpactedFiles: TestAlert[] | undefined): string {

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

export { createAlertsMessage };
