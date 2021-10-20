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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var dotenv = __importStar(require("dotenv"));
var Cli_1 = __importDefault(require("./cli/Cli"));
var utils_1 = require("./cli/utils");
var inputs_1 = require("./squar/inputs");
var Markdown_1 = require("./markdown/Markdown");
var PullRequest_1 = __importDefault(require("./pull_request/PullRequest"));
var Squar_1 = __importDefault(require("./squar/Squar"));
dotenv.config({ path: __dirname + "/.env" });
function processSquarAPIInputs() {
    core.debug("Parsing inputs");
    var inputs = (0, inputs_1.parseSquarAPIInputs)(core.getInput);
    return inputs;
}
function processActionInputs() {
    core.debug("Parsing inputs");
    var inputs = (0, inputs_1.parseActionInputs)(core.getInput);
    return inputs;
}
function removeDuplicateInImpactedFiles(impactedFiles) {
    var result = __spreadArray([], Array.from(new Set(impactedFiles)), true);
    return result;
}
/**
* Main entry point.
* @param {string[]} args - arguments received from the command-line
* @return {void}
*/
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var squarAPIInputs, actionInputs, triggerResult, report, markdown, reportComment, definitionsComment, impactedFiles, e_1, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    squarAPIInputs = processSquarAPIInputs();
                    actionInputs = processActionInputs();
                    return [4 /*yield*/, Squar_1.default.triggerSQUARANalysis(squarAPIInputs)];
                case 1:
                    triggerResult = _a.sent();
                    if (!(triggerResult !== undefined)) return [3 /*break*/, 6];
                    return [4 /*yield*/, Squar_1.default.fetchSQUARReport(triggerResult, squarAPIInputs)];
                case 2:
                    report = _a.sent();
                    if (!(report !== undefined)) return [3 /*break*/, 6];
                    markdown = new Markdown_1.Markdown(squarAPIInputs.branch, squarAPIInputs.repoURL, report);
                    // Write a comment with the alerts in the files of the PR
                    void PullRequest_1.default.generatePRComment(markdown.createAlertsMessage(report.suggestionsOnImpactedFiles));
                    if (!(actionInputs.displayFullReport === "true")) return [3 /*break*/, 4];
                    return [4 /*yield*/, markdown.createFullReportMessage()];
                case 3:
                    reportComment = _a.sent();
                    void PullRequest_1.default.generatePRComment(reportComment);
                    _a.label = 4;
                case 4:
                    definitionsComment = Markdown_1.Markdown.generateCriticityLegend();
                    void PullRequest_1.default.generatePRComment(definitionsComment);
                    if (!(actionInputs.bootstrapUT === "true")) return [3 /*break*/, 6];
                    impactedFiles = removeDuplicateInImpactedFiles((0, utils_1.extractImpactedFilesFromReport)(report));
                    if (!((impactedFiles !== undefined) && (impactedFiles.length > 0))) return [3 /*break*/, 6];
                    // Start Ponicode CLI on the impacted files only
                    core.setOutput("impacted_files", impactedFiles);
                    return [4 /*yield*/, Cli_1.default.startCLI(actionInputs, impactedFiles)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_1 = _a.sent();
                    error = e_1;
                    core.debug(error.toString());
                    core.setFailed(error.message);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
void run();
// E2E Test
