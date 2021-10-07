import { Report, TestAlert } from "../types";

function extractImpactedFilesFromReport(report: Report): string[] | undefined {
    if (report !== undefined) {
        return report.suggestionsOnImpactedFiles.map((alert: TestAlert): any => {
            if (alert.file_path) {
                return alert.file_path;
            }
        });
    } else {
        return undefined;
    }

}

export { extractImpactedFilesFromReport };
