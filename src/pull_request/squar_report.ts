import * as core from "@actions/core";
import * as github from "@actions/github";
import { checkIfCommentALreadyExists, getAllComments } from "./utils";

// get the inputs of the action. The "token" input
  // is not defined so far - we will come to it later.
const githubToken = core.getInput("githubToken");

// the context does for example also include information
// in the pull request or repository we are issued from
const context = github.context;
const repo = context.repo;
const pullRequestNumber = context.payload.pull_request?.number;

const octokit = github.getOctokit(githubToken);

async function createComment(repo: any, pullRequestNumber: number, message: string): Promise<void> {
    await octokit.rest.issues.createComment({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: pullRequestNumber,
        body: message,
    });

}

async function updateComment(comment: any, message: string): Promise<void> {
    await octokit.rest.issues.updateComment({
        owner: repo.owner,
        repo: repo.repo,
        comment_id: comment.id,
        body: message,
    });
}

async function generatePRComment(message: string | undefined ): Promise<void> {

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

  // The Octokit is a helper, to interact with
  // the github REST interface.
  // You can look up the REST interface
  // here: https://octokit.github.io/rest.js/v18

  if (pullRequestNumber) {

    try {

        const comments = await getAllComments(repo, pullRequestNumber);

        const comment = await checkIfCommentALreadyExists(comments, message);

        core.debug(JSON.stringify(comment));

        // If yes, update that
        if (comment) {
            await updateComment(comment, message);
        // if not, create a new comment
        } else {
            await createComment(repo, pullRequestNumber, message);
        }

    } catch (e) {
        const error = e as Error;
        core.setFailed(error.message);
    }
  }

}

export { generatePRComment };
