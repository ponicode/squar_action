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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var child_process_1 = require("child_process");
var fs = __importStar(require("fs"));
var Markdown_1 = require("../markdown/Markdown");
var PullRequest_1 = __importDefault(require("../pull_request/PullRequest"));
var utils_1 = require("../pull_request/utils");
var Login_1 = __importDefault(require("./Login"));
var CLI = /** @class */ (function () {
    function CLI() {
    }
    CLI.prototype.login = function (inputs, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var confContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        core.debug("Authenticating Ponicode CLI");
                        return [4 /*yield*/, Login_1.default.setXdgConfigToken(inputs)];
                    case 1:
                        _a.sent();
                        confContent = Login_1.default.getConfigFileContent();
                        if (confContent) {
                            core.debug(confContent);
                        }
                        core.debug("Loging Ponicode CLI");
                        this.execCommand("ponicode login", function () {
                            core.debug("Ponicoed CLI is well authenticated");
                            callback();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CLI.prototype.startCLI = function (inputs, files) {
        return __awaiter(this, void 0, void 0, function () {
            var fileArguments_1, _i, files_1, file;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(files !== undefined)) return [3 /*break*/, 2];
                        this.files = files;
                        fileArguments_1 = "";
                        for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                            file = files_1[_i];
                            fileArguments_1 += " " + file;
                        }
                        return [4 /*yield*/, this.login(inputs, function () {
                                //DEBUG
                                core.debug("Start generating Tests for " + files.toString());
                                _this.execCommand("ponicode test " + fileArguments_1 + " > /dev/null", function () { return __awaiter(_this, void 0, void 0, function () {
                                    var testFiles, check, markdown;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                testFiles = this.readTestFiles(this.files);
                                                if (!((testFiles !== undefined) && (testFiles.length > 0))) return [3 /*break*/, 2];
                                                return [4 /*yield*/, PullRequest_1.default.isPRExist((0, utils_1.getPRBranchName)(inputs), inputs.apiInputs.branch)];
                                            case 1:
                                                check = _a.sent();
                                                markdown = new Markdown_1.Markdown(inputs.apiInputs.branch, inputs.apiInputs.repoURL, undefined);
                                                if (check !== undefined) {
                                                    core.debug("PR already exists, create a commit");
                                                    PullRequest_1.default.createCommit(testFiles, inputs, check, markdown);
                                                }
                                                else {
                                                    core.debug("PR does not exist: create the PR");
                                                    PullRequest_1.default.createUTPullRequest(testFiles, inputs, markdown);
                                                }
                                                return [3 /*break*/, 3];
                                            case 2:
                                                core.debug("No generated Tests files");
                                                PullRequest_1.default.generatePRComment("Sorry, we couldn't generate the Unit-Tests for your files...\
                            Please try later");
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CLI.prototype.readTestFiles = function (files) {
        var result = [];
        if (files !== undefined) {
            for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
                var file = files_2[_i];
                if (file !== undefined) {
                    var testName = file.split(".")[0] + ".test." + file.split(".").pop();
                    if (fs.existsSync(testName)) {
                        // Comment all lines of the test file
                        this.commentAllLinesofFile(testName);
                        try {
                            var fileContent = fs.readFileSync(testName, "utf-8");
                            if (file) {
                                var testFile = {
                                    filePath: testName,
                                    content: fileContent,
                                };
                                result.push(testFile);
                            }
                        }
                        catch (e) {
                            var error = e;
                            core.debug(error.message);
                        }
                    }
                }
            }
        }
        return result;
    };
    CLI.prototype.commentAllLinesofFile = function (filePath) {
        var addPrefix = function (str) { return "// " + str; };
        var fileContent = "";
        // DEBUG
        core.debug("Read file " + filePath + " for appending comments");
        var data = fs.readFileSync(filePath, "utf-8");
        // split the contents by new line
        var lines = data.split(/\r?\n/);
        // print all lines
        lines.forEach(function (l) {
            var prefixedLine = addPrefix(l) + "\n";
            fileContent += prefixedLine;
        });
        fs.writeFileSync(filePath, fileContent);
    };
    CLI.prototype.execCommand = function (command, callback) {
        var _a;
        var execProcess = (0, child_process_1.exec)(command, { 'encoding': 'utf8' }, function (error, stdout) {
            core.debug("exec stdout: " + stdout + " error: " + error);
        });
        execProcess.on("spawn", function () {
            core.debug("spawn on spawn");
        });
        (_a = execProcess.stderr) === null || _a === void 0 ? void 0 : _a.on("data", function (data) {
            core.debug("spawn on error " + data);
        });
        execProcess.on("exit", function (code, signal) {
            core.debug("spawn on exit code: " + code + " signal: " + signal);
        });
        execProcess.on("close", function (code, args) {
            core.debug("spawn on close code: " + code + " args: " + args);
            if (code === 0) {
                callback();
            }
            else {
                core.debug("Command fails");
                PullRequest_1.default.generatePRComment("## Sorry, we couldn't generate the Unit-Tests for your files...\
                    Please try later");
            }
        });
    };
    return CLI;
}());
exports.default = new CLI();
