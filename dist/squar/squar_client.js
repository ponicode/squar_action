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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var SquarClient = /** @class */ (function () {
    function SquarClient() {
    }
    /**
    * Trigger SQUAR report_pr endpoint
    * @summary The function retries every timer msec so that it periodically checks when the report is available (it takes couple of seconds to be processed by Havana)
    * @param {FetchReportInput} inputs - Inputs of the endpoint
    * @param {number} repositoryId - Repository Id of the repo to be processed
    * @param {number} timer - Numbmer of msec to wait beteween each retries
    * @return {Promise<Report>} Returns the Promise with the generated Report
    */
    SquarClient.prototype.triggerSquarReport = function (inputs, repositoryId, timer) {
        return __awaiter(this, void 0, void 0, function () {
            var executor;
            return __generator(this, function (_a) {
                executor = (function (resolve, reject) {
                    (0, axios_1.default)({
                        method: 'GET',
                        data: inputs,
                        url: process.env.SQUAR_API_URL + "/report_pr/" + repositoryId,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then(function (res) {
                        return res.data;
                    }).then(function (report) {
                        resolve(report);
                    }).catch(function (err) {
                        reject(err);
                    });
                });
                return [2 /*return*/, this.retry(timer, executor)];
            });
        });
    };
    /**
    * Triggers SQUAR evaluate_pr endpoint
    * @param {Inputs} inputs - contains the inputs required for the endpoint
    * @return {Promise<EvaluateReturn>} returns a promise with the EvaluateReturn object
    */
    SquarClient.prototype.triggerSquarEvaluate = function (inputs) {
        return (0, axios_1.default)({
            method: 'POST',
            data: inputs,
            url: process.env.SQUAR_API_URL + "/evaluate_pr",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(function (res) {
            return res.data;
        }).then(function (data) {
            return data;
        }).catch(function (err) {
            var result = {
                success: false,
                message: "Error triggering SQUAR evaluate_pr endpoint :" + err.message,
            };
            return result;
        });
    };
    /**
    * Block the main thread to wait before moving on in the execution.
    * @param {number} ms - Number of msec to wait
    * @return {void} No return value
    */
    SquarClient.prototype.wait = function (ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    };
    /**
    * Function that triggers again a Promise execution while this is not successfull
    * @param {number} timerMilliSec - Timer in msec to wait before retrying
    * @param {PromiseExecutor} executor - Promise executor to be used in Promise execution retry
    * @return {Promise<Report>} returns a promise that executes the Promise Executor
    */
    SquarClient.prototype.retry = function (timerMilliSec, executor) {
        var _this = this;
        if (typeof timerMilliSec !== "number") {
            throw new TypeError("retries is not a number");
        }
        this.wait(timerMilliSec);
        return new Promise(executor).catch(function (error) { return _this.retry(timerMilliSec, executor); });
    };
    return SquarClient;
}());
exports.default = new SquarClient();
