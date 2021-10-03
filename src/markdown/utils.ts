import { AlertKind, Criticity } from "../types";

function initMarkdownTable(): string {
    let message = "";
    // Table Title
    message += "| File | Line Number | Type of alert | Criticity of your function | Go to |\n";
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

export { initMarkdownTable, translateAlertType, translateCriticity }
