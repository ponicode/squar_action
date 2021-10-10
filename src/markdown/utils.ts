import { AlertKind, Criticity, TestAlert } from "../types";

const GITHUB_URL = "https://github.com";

function initMarkdownTable(): string {
    let message = "";
    // Table Title
    message += "| File | Line Number | Type of alert | Criticity of the function | Go to |\n";
    // Table Column Definitions
    message += "| :--- | :---: | :---: | :---: | :---: |\n";

    return message;
}

function translateAlertType(alertKind: AlertKind | undefined): string | undefined {

    const alertTable: {[key: string]: string} = {
        edge_case: "Missing Edge Cases",
        test_case: "Missing Test cases",
        test_suite: "Misssing Tests",
    };

    if (alertKind) {
        return alertTable[alertKind.toString()];
    } else {
        return undefined;
    }

}

function translateCriticity(criticity: Criticity | undefined): string | undefined {

    const criticityTable: {[key: string]: string} = {
        orange: "Critical",
        green: "Not Critical",
        red: "Highly Critical",
    };

    if (criticity) {
        return criticityTable[criticity.toString()];
    } else {
        return undefined;
    }

}

function buildGithubFileURL(alert: TestAlert, repoURL: string, branch: string): string {
    const message = `[Bring me there](${GITHUB_URL}/${repoURL}/blob/${branch}/${alert.file_path}#L${alert.line}})`;
    return message;
}

function buildGithubSecretURL(repoURL: string): string {
    const message = `${GITHUB_URL}/${repoURL}/settings/secrets/actions`;
    return message;
}

function buildGithubPRURL(repoURL: string, pullId: number | undefined): string | undefined {
    if (pullId !== undefined) {
        const message = `${GITHUB_URL}/${repoURL}/pulls/${pullId}`;
        return message;
    } else {
        return ;
    }
}

export { initMarkdownTable, translateAlertType, translateCriticity,
    buildGithubFileURL, buildGithubSecretURL, buildGithubPRURL };
