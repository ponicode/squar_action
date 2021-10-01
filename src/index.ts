import * as dotenv from "dotenv";
import { Logger } from "tslog";
import { triggerSquarEvaluate } from "./squar_client";
import { EvaluateReturn, Inputs } from "./types";

dotenv.config({ path: __dirname + "/.env" });

const log: Logger = new Logger();

/** 
* Checks all args are well defined
* @param {string[]} args - arguments received from the command-line
* @return {boolean} returns true if all arguments are well defined. False else.
*/
function check_args(args: string[]): boolean {
    let result: boolean = true;
    for (let i = 0; i < 4; i++ ) {
        result = result && (args[i] !== undefined);
    }
    return result;
}

/** 
* Main entry point.
* @param {string[]} args - arguments received from the command-line
* @return {void} 
*/
function main(args: string[]): void {

    const inputs: Inputs = JSON.parse(args[0]);

    log.debug(inputs);

    // Trigger SQUAR evaluate_pr endpoint
    triggerSquarEvaluate(inputs).then((result: EvaluateReturn) => {
        log.debug(result);
    }).catch((result: EvaluateReturn) => {
        log.debug(result);
    });

}

main(process.argv.slice(2));
