"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseActionInputs = exports.parseSquarAPIInputs = void 0;
var parseJSON = function (getInput, property) {
    var value = getInput(property);
    if (!value) {
        return;
    }
    try {
        return JSON.parse(value);
    }
    catch (e) {
        var error = e;
        throw new Error("invalid format for '" + property + ": " + error.toString());
    }
};
var parseSquarAPIInputs = function (getInput) {
    var repoURL = getInput("repoURL", { required: true });
    var userToken = getInput("ponicodeSquarToken", { required: true });
    var impactedFiles = parseJSON(getInput, "impactedFiles");
    var branch = getInput("branch", { required: true });
    if (!impactedFiles) {
        impactedFiles = [];
    }
    return {
        repoURL: repoURL,
        userToken: userToken,
        impactedFiles: impactedFiles,
        branch: branch,
    };
};
exports.parseSquarAPIInputs = parseSquarAPIInputs;
var parseActionInputs = function (getInput) {
    var repoURL = getInput("repoURL", { required: true });
    var ponicodeSquarToken = getInput("ponicodeSquarToken", { required: true });
    var impactedFiles = parseJSON(getInput, "impactedFiles");
    var branch = getInput("branch", { required: true });
    var ponicodeUtToken = getInput("ponicodeUtToken", { required: true });
    var githubToken = getInput("githubToken", { required: true });
    var bootstrapUT = getInput("bootstrapUT", { required: true });
    var displayFullReport = getInput("displayFullReport", { required: true });
    if (!impactedFiles) {
        impactedFiles = [];
    }
    var apiInputs = {
        repoURL: repoURL,
        userToken: ponicodeSquarToken,
        impactedFiles: impactedFiles,
        branch: branch,
    };
    return {
        apiInputs: apiInputs,
        ponicodeUtToken: ponicodeUtToken,
        githubToken: githubToken,
        bootstrapUT: bootstrapUT,
        displayFullReport: displayFullReport,
    };
};
exports.parseActionInputs = parseActionInputs;
