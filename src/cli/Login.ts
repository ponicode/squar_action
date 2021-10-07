import * as core from "@actions/core";
import fs from "fs";
import path from "path";
import { Markdown } from "../markdown/Markdown";
import PullRequest from "../pull_request/PullRequest";
import { Inputs } from "../types";
import { Settings } from "./types";

const xdg = require("@folder/xdg");

class Login {

    async setXdgConfigToken(inputs: Inputs): Promise<void> {
        try {
            const configDir = xdg().config as string;
            const configFile = path.join(configDir, "ponicode", "settings.json");

            const settings: Settings = {
                "auth.token": inputs.githubToken,
            };
            fs.mkdirSync(path.join(configDir, "ponicode"), { recursive: true, mode: 0o755 });

            fs.writeFileSync(configFile, JSON.stringify(settings, null, 4));

            const confContent = fs.readFileSync(configFile, 'utf-8');
            core.debug(`${configFile}: ${confContent}`);

        } catch (e) {
            const error: Error = e as Error;
            const errorMessage = `Failed to locate settings folder: ${error.message}`;
            // Push an error message in PR comment
            const message = await Markdown.createSQUARErrorMessage(errorMessage, inputs.repoURL);
            void PullRequest.generatePRComment(message);
            core.setFailed(errorMessage);
        }

    }

}

export default new Login();
