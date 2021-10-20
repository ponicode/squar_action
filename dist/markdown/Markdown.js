"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Markdown = void 0;
var core = __importStar(require("@actions/core"));
var fs_1 = require("fs");
var utils_1 = require("./utils");
var replace = require("replace-in-file");
var Markdown = /** @class */ (function () {
    function Markdown(branch, repoURL, report) {
        this.branch = branch;
        this.repoURL = repoURL;
        this.report = report;
    }
    Markdown.generateCriticityLegend = function () {
        return (0, utils_1.generateCriticityLegend)();
    };
    // Create a markdown message from the two JSON.
    Markdown.prototype.createAlertsMessage = function (suggestionsOnImpactedFiles) {
        var message = "## GREAT Job! There is no alert on the files updated in the PR\n";
        if ((suggestionsOnImpactedFiles) && (suggestionsOnImpactedFiles.length > 0)) {
            message = "## List of alerts identified by Ponicode SQUAR in the files of your PR\n";
            message += (0, utils_1.initMarkdownTable)();
            message = this.appendMessageWithAlerts(suggestionsOnImpactedFiles, message);
        }
        return message;
    };
    Markdown.prototype.createFullReportMessage = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var fileName, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.report) === null || _a === void 0 ? void 0 : _a.fullReport)) return [3 /*break*/, 2];
                        fileName = __dirname + "/full_report.md";
                        return [4 /*yield*/, this.generateMessageFromMDFile(fileName)];
                    case 1:
                        _b.sent();
                        message = this.addAlertsToFullReportComment(fileName);
                        return [2 /*return*/, message];
                    case 2: return [2 /*return*/, undefined];
                }
            });
        });
    };
    Markdown.prototype.createUTPRComment = function (url, testFiles, isUpdate) {
        var message = "";
        if (url !== undefined) {
            if (!isUpdate) {
                message += "## Ponicode UT bootstrap Pull-Request\n";
            }
            else {
                message += "## Ponicode UT bootstrap Pull-Request has been updated\n";
            }
            if (url !== undefined) {
                message += "### [Ponicode UT Bootstrap Pull-Request](" + url + ")\n";
            }
            if (!isUpdate) {
                message += "The PR contains the following unit-Test bootstrap files:\n";
            }
            else {
                message += "The PR has been updated for the following unit-Test bootstrap files:\n";
            }
            testFiles.forEach(function (file) {
                message += "- " + file.filePath + "\n";
            });
        }
        return message;
    };
    Markdown.prototype.appendMessageWithAlerts = function (suggestionsOnImpactedFiles, initialMessage) {
        var _this = this;
        var message = initialMessage;
        suggestionsOnImpactedFiles === null || suggestionsOnImpactedFiles === void 0 ? void 0 : suggestionsOnImpactedFiles.forEach(function (alert) {
            // First Column: The file
            // Please note the ` instead of ". This is TypeScripts
            // format string. Everything in ${ } will be replaced.
            message += "| " + alert.file_path;
            // Second column: the line number
            message += "| " + alert.line;
            // 3rd column: the type of alert.
            message += "| " + (0, utils_1.translateAlertType)(alert.alert_kind);
            // 4th column: the criticity of the function.
            message += "| <span style=\"color:" + alert.criticity + "\">**" + (0, utils_1.translateCriticity)(alert.criticity) + "**</span>";
            // 5th column: the link to go directly to the file.
            message += "| " + (0, utils_1.buildGithubFileURL)(alert, _this.repoURL, _this.branch);
            //6th column: testable by Ponicode
            message += "| <p align=\"center\"><img src=\"https://ponicodefilesstorage.blob.core.windows.net/cli/logo-without-text-30x30.png\"></p>";
            message += "|\n";
        });
        return message;
    };
    Markdown.prototype.addAlertsToFullReportComment = function (fileName) {
        var _a, _b;
        var message = (0, fs_1.readFileSync)(fileName, "utf-8");
        message += "## List of alerts identified by Ponicode SQUAR in your Project          __*" + ((_a = this.report) === null || _a === void 0 ? void 0 : _a.fullReport.repoName) + "*__\n";
        message += (0, utils_1.initMarkdownTable)();
        message = this.appendMessageWithAlerts((_b = this.report) === null || _b === void 0 ? void 0 : _b.fullReport.suggestions, message);
        return message;
    };
    Markdown.prototype.generateMessageFromMDFile = function (file) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var options, results;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        options = {
                            files: file,
                            from: [/%repo_name%/g, /%grade%/g, /%missing_test_suites%/g,
                                /%missing_test_cases%/g, /%missing_edge_cases%/g, /%branch%/g],
                            to: [(_a = this.report) === null || _a === void 0 ? void 0 : _a.fullReport.repoName, (_b = this.report) === null || _b === void 0 ? void 0 : _b.fullReport.ponicodeScore, ((_c = this.report) === null || _c === void 0 ? void 0 : _c.fullReport.missingTestSuite) ? "" + ((_d = this.report) === null || _d === void 0 ? void 0 : _d.fullReport.missingTestSuite) : "0",
                                ((_e = this.report) === null || _e === void 0 ? void 0 : _e.fullReport.missingTestCases) ? "" + ((_f = this.report) === null || _f === void 0 ? void 0 : _f.fullReport.missingTestCases) : "0",
                                ((_g = this.report) === null || _g === void 0 ? void 0 : _g.fullReport.missingEdgeCases) ? "" + ((_h = this.report) === null || _h === void 0 ? void 0 : _h.fullReport.missingEdgeCases) : "0",
                                this.branch],
                        };
                        return [4 /*yield*/, replace(options)];
                    case 1:
                        results = _j.sent();
                        core.debug(results);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Markdown;
}());
exports.Markdown = Markdown;
