import * as core from "@actions/core";
import * as github from "@actions/github";
import { Octokit } from "@octokit/core";
import { SpawnSyncOptionsWithStringEncoding } from "child_process";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import { connected } from "process";
import { TestFile } from "../cli/types";
import { ActionInputs } from "../types";
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

const PullRequestOctokit = Octokit.plugin(createPullRequest);

interface TestFile4PR {
  [path: string]: string;
}

class PullRequest {

    public createUTPullRequest(testFiles: TestFile[], inputs: ActionInputs) {

      const myOctokit = new PullRequestOctokit({
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
          base: inputs.branch /* optional: defaults to default branch */,
          head: "ponicode-ut-proposal",
          changes: [
            {
              /* optional: if `files` is not passed, an empty commit is created instead */
              files: this.generateFiles4PR(testFiles),
              commit:
                `UT for files: ${this.listUTFile(testFiles)}`,
            },
          ],
        })
        .then((pr) => core.debug(`PR well created with number: ${pr?.data.number}`));

    }

  public async generatePRComment(message: string | undefined ): Promise<void> {

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

          /* un comment this if you want to keep only one Ponicode SQUAR report in the 
          * comments of the PR, and it is updated in case there is alreayd one
          */
        /*
          const comments = await getAllComments(repo, pullRequestNumber);

          const comment = await checkIfCommentALreadyExists(comments, message);

          // If yes, update that
          if (comment) {
              core.debug("There is already one comment that matches, then update it.");
              await updateComment(comment, message);
          // if not, create a new comment
          } else {
              core.debug("No comment matches, then create it.");
              await createComment(repo, pullRequestNumber, message);
          }
          */

          await this.createComment(repo, pullRequestNumber, message);

      } catch (e) {
          const error = e as Error;
          core.setFailed(error.message);
      }
    }

  }

  private listUTFile(testFiles: TestFile[]): string {
    let list: string = "";

    testFiles.forEach((test: TestFile) => {
      list += test.filePath;
      list += "/";
    });

    return list;

  }
  private generatePRBody(testFiles: TestFile[]): string  {
    let body: string = "";
    body += `This PR contains some proposal of Unit-Tests by Ponicode based on Ponicode SQUAR outputs.\
    It concerns the following files:`;

    body += this.listUTFile(testFiles);

    return body;

  }

  private generateFiles4PR(testFiles: TestFile[]): TestFile4PR {
    let result = {} as TestFile4PR;

    testFiles.forEach((test: TestFile) => {
      result[test.filePath] = test.content;
    });

    return result;
  }

    private async createComment(repo: any, pullRequestNumber: number, message: string): Promise<void> {
      await octokit.rest.issues.createComment({
          owner: repo.owner,
          repo: repo.repo,
          issue_number: pullRequestNumber,
          body: message,
      });

    }

  private async updateComment(comment: any, message: string): Promise<void> {
      await octokit.rest.issues.updateComment({
          owner: repo.owner,
          repo: repo.repo,
          comment_id: comment.id,
          body: message,
      });
  }

}

export default new PullRequest();
