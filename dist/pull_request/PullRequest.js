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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var github = __importStar(require("@actions/github"));
var core_1 = require("@octokit/core");
var rest_1 = require("@octokit/rest");
var fs_extra_1 = require("fs-extra");
var octokit_plugin_create_pull_request_1 = require("octokit-plugin-create-pull-request");
var utils_1 = require("../markdown/utils");
var utils_2 = require("./utils");
// get the inputs of the action. The "token" input
// is not defined so far - we will come to it later.
var githubToken = core.getInput("githubToken");
// the context does for example also include information
// in the pull request or repository we are issued from
var context = github.context;
var repo = context.repo;
var pullRequestNumber = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number;
var octokit = github.getOctokit(githubToken);
var PullRequestOctokit = core_1.Octokit.plugin(octokit_plugin_create_pull_request_1.createPullRequest);
var PullRequest = /** @class */ (function () {
    function PullRequest() {
        var _this = this;
        /* Methods required to create a commit and push it on a branch */
        this.uploadToRepo = function (octo, testFiles, org, repo, branch) {
            if (branch === void 0) { branch = "master"; }
            return __awaiter(_this, void 0, void 0, function () {
                var currentCommit, filesPaths, filesBlobs, pathsForBlobs, newTree, commitMessage, newCommit;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getCurrentCommit(octo, org, repo, branch)];
                        case 1:
                            currentCommit = _a.sent();
                            filesPaths = testFiles.map(function (file) { return file.filePath; });
                            return [4 /*yield*/, Promise.all(filesPaths.map(this.createBlobForFile(octo, org, repo)))];
                        case 2:
                            filesBlobs = _a.sent();
                            pathsForBlobs = filesPaths;
                            return [4 /*yield*/, this.createNewTree(octo, org, repo, filesBlobs, pathsForBlobs, currentCommit.treeSha)];
                        case 3:
                            newTree = _a.sent();
                            commitMessage = "GitHub Action updates Ponicode UT";
                            return [4 /*yield*/, this.createNewCommit(octo, org, repo, commitMessage, newTree.sha, currentCommit.commitSha)];
                        case 4:
                            newCommit = _a.sent();
                            return [4 /*yield*/, this.setBranchToCommit(octo, org, repo, branch, newCommit.sha)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        this.getCurrentCommit = function (octo, org, repo, branch) {
            if (branch === void 0) { branch = "master"; }
            return __awaiter(_this, void 0, void 0, function () {
                var refData, commitSha, commitData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, octo.rest.git.getRef({
                                owner: org,
                                repo: repo,
                                ref: "heads/" + branch,
                            })];
                        case 1:
                            refData = (_a.sent()).data;
                            commitSha = refData.object.sha;
                            return [4 /*yield*/, octo.rest.git.getCommit({
                                    owner: org,
                                    repo: repo,
                                    commit_sha: commitSha,
                                })];
                        case 2:
                            commitData = (_a.sent()).data;
                            return [2 /*return*/, {
                                    commitSha: commitSha,
                                    treeSha: commitData.tree.sha,
                                }];
                    }
                });
            });
        };
        // Notice that readFile's utf8 is typed differently from Github's utf-8
        this.getFileAsUTF8 = function (filePath) { return (0, fs_extra_1.readFile)(filePath, "utf8"); };
        this.createBlobForFile = function (octo, org, repo) { return function (filePath) { return __awaiter(_this, void 0, void 0, function () {
            var content, blobData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFileAsUTF8(filePath)];
                    case 1:
                        content = _a.sent();
                        return [4 /*yield*/, octo.rest.git.createBlob({
                                owner: org,
                                repo: repo,
                                content: content,
                                encoding: "utf-8",
                            })];
                    case 2:
                        blobData = _a.sent();
                        return [2 /*return*/, blobData.data];
                }
            });
        }); }; };
        this.createNewTree = function (octo, owner, repo, blobs, paths, parentTreeSha) { return __awaiter(_this, void 0, void 0, function () {
            var tree, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tree = blobs.map(function (_a, index) {
                            var sha = _a.sha;
                            return ({
                                path: paths[index],
                                mode: "100644",
                                type: "blob",
                                sha: sha,
                            });
                        });
                        return [4 /*yield*/, octo.rest.git.createTree({
                                owner: owner,
                                repo: repo,
                                tree: tree,
                                base_tree: parentTreeSha,
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                }
            });
        }); };
        this.createNewCommit = function (octo, org, repo, message, currentTreeSha, currentCommitSha) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, octo.rest.git.createCommit({
                            owner: org,
                            repo: repo,
                            message: message,
                            tree: currentTreeSha,
                            parents: [currentCommitSha],
                        })];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        }); };
        this.setBranchToCommit = function (octo, org, repo, branch, commitSha) {
            if (branch === void 0) { branch = "master"; }
            return octo.rest.git.updateRef({
                owner: org,
                repo: repo,
                ref: "heads/" + branch,
                sha: commitSha,
            });
        };
    }
    PullRequest.prototype.isPRExist = function (originBranch, targetBranch) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, repository, data, results, check;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        owner = repo.owner;
                        repository = repo.repo;
                        return [4 /*yield*/, octokit.rest.pulls.list({
                                owner: owner,
                                repo: repository,
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        results = data.map(function (pull) {
                            if ((pull.head.ref === originBranch) && (pull.base.ref === targetBranch)) {
                                return pull.number;
                            }
                        });
                        check = results.find(function (pullId) { return pullId !== undefined; });
                        core.debug("Existing PullId = " + check);
                        return [2 /*return*/, check];
                }
            });
        });
    };
    PullRequest.prototype.createUTPullRequest = function (testFiles, inputs, markdown) {
        var _this = this;
        var myOctokit = new PullRequestOctokit({
            auth: inputs.githubToken,
        });
        // Returns a normal Octokit PR response
        // See https://octokit.github.io/rest.js/#octokit-routes-pulls-create
        myOctokit
            .createPullRequest({
            owner: repo.owner,
            repo: repo.repo,
            title: "Unit-Tests bootstrap by Ponicode",
            body: this.generatePRBody(testFiles),
            base: inputs.apiInputs.branch /* optional: defaults to default branch */,
            head: (0, utils_2.getPRBranchName)(inputs),
            draft: true,
            changes: [
                {
                    /* optional: if `files` is not passed, an empty commit is created instead */
                    files: this.generateFiles4PR(testFiles),
                    commit: "UT for files: " + this.listUTFile(testFiles),
                },
            ],
        })
            .then(function (pr) {
            core.debug("PR well created with number: " + (pr === null || pr === void 0 ? void 0 : pr.data.number));
            var url = (0, utils_1.buildGithubPRURL)(repo.repo, repo.owner, pr === null || pr === void 0 ? void 0 : pr.data.number);
            _this.generatePRComment(markdown.createUTPRComment(url, testFiles, false));
        }).catch(function (e) { return __awaiter(_this, void 0, void 0, function () {
            var error, errorMessage, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = e;
                        core.debug("ERROR While creating the PR: " + error.message);
                        errorMessage = "Fails creating the branch " + (0, utils_2.getPRBranchName)(inputs) + ".\n            It seems that there is already a branch with the given name.\n            Either delete it, or create a PR on " + inputs.apiInputs.branch;
                        return [4 /*yield*/, (0, utils_1.createSQUARErrorMessage)(errorMessage, inputs.apiInputs.repoURL)];
                    case 1:
                        message = _a.sent();
                        void this.generatePRComment(message);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    PullRequest.prototype.generatePRComment = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var comments, comment, e_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // The github module has a member called "context",
                        // which always includes information on the action workflow
                        // we are currently running in.
                        // For example, it let's us check the event that triggered the workflow.
                        if (github.context.eventName !== "pull_request") {
                            // The core module on the other hand let's you get
                            // inputs or create outputs or control the action flow
                            // e.g. by producing a fatal error
                            core.debug("Can only run on pull requests!");
                            return [2 /*return*/];
                        }
                        if (!message) {
                            core.debug("Message to display is empty");
                            return [2 /*return*/];
                        }
                        if (!pullRequestNumber) return [3 /*break*/, 8];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, (0, utils_2.getAllComments)(repo, pullRequestNumber)];
                    case 2:
                        comments = _a.sent();
                        return [4 /*yield*/, (0, utils_2.checkIfCommentALreadyExists)(comments, message)];
                    case 3:
                        comment = _a.sent();
                        if (!comment) return [3 /*break*/, 5];
                        core.debug("There is already one comment that matches, then delete it.");
                        // await updateComment(comment, message);
                        return [4 /*yield*/, this.deleteComment(comment)];
                    case 4:
                        // await updateComment(comment, message);
                        _a.sent();
                        _a.label = 5;
                    case 5: /*else {
                        core.debug("No comment matches, then create it.");
                        await createComment(repo, pullRequestNumber, message);
                    }*/ 
                    // Create the comment in the PR
                    return [4 /*yield*/, this.createComment(repo, pullRequestNumber, message)];
                    case 6:
                        // Create the comment in the PR
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _a.sent();
                        error = e_1;
                        core.setFailed(error.message);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    PullRequest.prototype.createCommit = function (testFiles, inputs, prNumber, markdown) {
        return __awaiter(this, void 0, void 0, function () {
            var octo, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        octo = new rest_1.Octokit({
                            auth: githubToken,
                        });
                        return [4 /*yield*/, this.uploadToRepo(octo, testFiles, repo.owner, repo.repo, (0, utils_2.getPRBranchName)(inputs))];
                    case 1:
                        _a.sent();
                        url = (0, utils_1.buildGithubPRURL)(repo.repo, repo.owner, prNumber);
                        this.generatePRComment(markdown.createUTPRComment(url, testFiles, true));
                        return [2 /*return*/];
                }
            });
        });
    };
    PullRequest.prototype.listUTFile = function (testFiles) {
        var list = "";
        testFiles.forEach(function (test) {
            list += test.filePath;
            list += "/";
        });
        return list;
    };
    PullRequest.prototype.generatePRBody = function (testFiles) {
        var body = "";
        body += "This PR contains some proposal of Unit-Tests by Ponicode based on Ponicode SQUAR outputs.";
        //body += this.listUTFile(testFiles);
        return body;
    };
    PullRequest.prototype.generateFiles4PR = function (testFiles) {
        var result = {};
        testFiles.forEach(function (test) {
            result[test.filePath] = test.content;
        });
        // TODO: add a workflow YAML to test if project build in the CI
        return result;
    };
    PullRequest.prototype.createComment = function (repo, pullRequestNumber, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, octokit.rest.issues.createComment({
                            owner: repo.owner,
                            repo: repo.repo,
                            issue_number: pullRequestNumber,
                            body: message,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*private async updateComment(comment: any, message: string): Promise<void> {
        await octokit.rest.issues.updateComment({
            owner: repo.owner,
            repo: repo.repo,
            comment_id: comment.id,
            body: message,
        });
    }*/
    PullRequest.prototype.deleteComment = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, octokit.rest.issues.deleteComment({
                            owner: repo.owner,
                            repo: repo.repo,
                            comment_id: comment.id,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PullRequest;
}());
exports.default = new PullRequest();
