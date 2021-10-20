"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractImpactedFilesFromReport = void 0;
function extractImpactedFilesFromReport(report) {
    if (report !== undefined) {
        return report.suggestionsOnImpactedFiles.map(function (alert) {
            if (alert.file_path) {
                return alert.file_path;
            }
        });
    }
    else {
        return undefined;
    }
}
exports.extractImpactedFilesFromReport = extractImpactedFilesFromReport;
