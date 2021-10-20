"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSQUARErrorMessage = exports.generateCriticityLegend = exports.buildGithubPRURL = exports.buildGithubSecretURL = exports.buildGithubFileURL = exports.translateCriticity = exports.translateAlertType = exports.initMarkdownTable = void 0;
var fs_1 = require("fs");
var markdown_1 = require("@ts-stack/markdown");
var replace = require("replace-in-file");
var GITHUB_URL = "https://github.com";
function initMarkdownTable() {
    var message = "";
    // Table Title
    message += "| File | Line Number | Type of alert | Criticity of the function | Go to | Testable by Ponicode |\n";
    // Table Column Definitions
    message += "| :--- | :---: | :---: | :---: | :---: | :---: |\n";
    return message;
}
exports.initMarkdownTable = initMarkdownTable;
function translateAlertType(alertKind) {
    var alertTable = {
        edge_case: "Missing Edge Cases",
        test_case: "Missing Test cases",
        test_suite: "Misssing Tests",
    };
    if (alertKind) {
        return alertTable[alertKind.toString()];
    }
    else {
        return undefined;
    }
}
exports.translateAlertType = translateAlertType;
function translateCriticity(criticity) {
    var criticityTable = {
        orange: "Critical",
        green: "Not Critical",
        red: "Highly Critical",
    };
    if (criticity) {
        return criticityTable[criticity.toString()];
    }
    else {
        return undefined;
    }
}
exports.translateCriticity = translateCriticity;
function buildGithubFileURL(alert, repoURL, branch) {
    var message = "[Bring me there](" + GITHUB_URL + "/" + repoURL + "/blob/" + branch + "/" + alert.file_path + "#L" + alert.line + "})";
    return message;
}
exports.buildGithubFileURL = buildGithubFileURL;
function buildGithubSecretURL(repoURL) {
    var message = GITHUB_URL + "/" + repoURL + "/settings/secrets/actions";
    return message;
}
exports.buildGithubSecretURL = buildGithubSecretURL;
function buildGithubPRURL(repoURL, repoOwner, pullId) {
    if (pullId !== undefined) {
        var message = GITHUB_URL + "/" + repoOwner + "/" + repoURL + "/pull/" + pullId;
        return message;
    }
    else {
        return;
    }
}
exports.buildGithubPRURL = buildGithubPRURL;
function generateCriticityLegend() {
    var fileName = __dirname + "/criticity_legends.md";
    var message = (0, fs_1.readFileSync)(fileName, "utf-8");
    return message;
}
exports.generateCriticityLegend = generateCriticityLegend;
function createSQUARErrorMessage(errorMessage, repoURL) {
    return __awaiter(this, void 0, void 0, function () {
        var fileName, url, options, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileName = __dirname + "/error_message.md";
                    url = buildGithubSecretURL(repoURL);
                    options = {
                        files: fileName,
                        from: [/%errorMessage%/g, /%url%/g],
                        to: [errorMessage, url],
                    };
                    return [4 /*yield*/, replace(options)];
                case 1:
                    _a.sent();
                    message = (0, fs_1.readFileSync)(fileName, "utf-8");
                    return [2 /*return*/, message];
            }
        });
    });
}
exports.createSQUARErrorMessage = createSQUARErrorMessage;
function createUTErrorMessage(errorMessage, repoURL) {
    return __awaiter(this, void 0, void 0, function () {
        var fileName, url, options, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileName = __dirname + "/ut_error_message.md";
                    url = buildGithubSecretURL(repoURL);
                    options = {
                        files: fileName,
                        from: [/%errorMessage%/g, /%url%/g],
                        to: [errorMessage, url],
                    };
                    return [4 /*yield*/, replace(options)];
                case 1:
                    _a.sent();
                    message = (0, fs_1.readFileSync)(fileName, "utf-8");
                    return [2 /*return*/, message];
            }
        });
    });
}
function createTestCodeComment(testFiles) {
    var message = "## Overview of Unit-Tests generated for your impacted files\n";
    message += appendUTOverviewMessages(testFiles);
    return message;
}
function appendUTOverviewMessages(testFiles) {
    var message = "";
    testFiles === null || testFiles === void 0 ? void 0 : testFiles.forEach(function (testFile) {
        message += "### Unit-Tests proposal for file " + testFile.filePath + "\n";
        message += markdown_1.Marked.parse(testFile.content);
    });
    return message;
}
;
