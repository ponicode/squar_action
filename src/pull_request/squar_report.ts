import * as core from "@actions/core";
import * as github from "@actions/github";

async function generatePR(message: string | undefined ): Promise<void> {

    // The github module has a member called "context",
  // which always includes information on the action workflow
  // we are currently running in.
  // For example, it let's us check the event that triggered the workflow.
  if (github.context.eventName !== "pull_request") {
    // The core module on the other hand let's you get
    // inputs or create outputs or control the action flow
    // e.g. by producing a fatal error
    core.debug("Can only run on pull requests!");
    return;
  }

  if (!message) {
    core.debug("Message to display is empty");
    return;
  }

  // get the inputs of the action. The "token" input
  // is not defined so far - we will come to it later.
  const githubToken = core.getInput("githubToken");
  core.debug(githubToken);

  // the context does for example also include information
  // in the pull request or repository we are issued from
  const context = github.context;
  const repo = context.repo;
  const pullRequestNumber = context.payload.pull_request?.number;

  core.debug(`${pullRequestNumber}`);

  // The Octokit is a helper, to interact with
  // the github REST interface.
  // You can look up the REST interface
  // here: https://octokit.github.io/rest.js/v18

  if (pullRequestNumber) {

    try {

        const octokit = github.getOctokit(githubToken);

        const result = await octokit.rest.issues.createComment({
            owner: "Ponicode SQUAR",
            repo: repo.repo,
            issue_number: pullRequestNumber,
            body: message,
        });

    } catch(e) {
        const error = e as Error;
        core.debug(error.message);
        core.setFailed(error.message);
    }
  }

}

export { generatePR };
