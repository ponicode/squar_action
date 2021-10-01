import { Logger } from "tslog";

// Action Inputs Type definiction
interface Inputs {
    RepoUrl: string;
    UserToken: string;
    ImpactedFiles: string[];
    Branch: string;
}

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
    if (check_args(args)) {

        const inputs = {
            RepoUrl: args[0],
            UserToken: args[1],
            // tslint:disable-next-line: object-literal-sort-keys
            ImpactedFiles: args[2] as unknown as string[],
            Branch: args[3],
        } as Inputs;

        log.debug(inputs);
    } else {
        log.error("Missing Parameters");
    }
}

main(process.argv.slice(2));
