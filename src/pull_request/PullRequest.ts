import * as core from "@actions/core";
import * as github from "@actions/github";
import { Octokit } from "@octokit/core";
import { Octokit as OctokitRest } from "@octokit/rest";
import { readFile } from "fs-extra";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import { TestFile } from "../cli/types";
import { Markdown } from "../markdown/Markdown";
import { buildGithubPRURL, createSQUARErrorMessage } from "../markdown/utils";
import { ActionInputs } from "../types";
import { GitTree, TestFile4PR } from "./types";
import { checkIfCommentALreadyExists, getAllComments, getPRBranchName } from "./utils";

// get the inputs of the action. The "token" input
  // is not defined so far - we will come to it later.
const githubToken = core.getInput("githubToken");

// the context does for example also include information
// in the pull request or repository we are issued from
const context = github.context;
const repo = context.repo;
const pullRequestNumber: number | undefined = context.payload.pull_request?.number;

const octokit = github.getOctokit(githubToken);

const PullRequestOctokit = Octokit.plugin(createPullRequest);

class PullRequest {

    public async isPRExist(originBranch: string, targetBranch: string): Promise<number | undefined> {
      const owner = repo.owner;
      const repository = repo.repo;
      const { data } = await octokit.rest.pulls.list({
        owner: owner,
        repo: repository,
      });

      const results = data.map((pull) => {

        if ((pull.head.ref === originBranch) && (pull.base.ref === targetBranch)) {
          return pull.number;
        }
      });
      const check = results.find((pullId) => pullId !== undefined );
      core.debug(`Existing PullId = ${check}`);

      return check;

    }

    public createUTPullRequest(testFiles: TestFile[], inputs: ActionInputs, markdown: Markdown) {

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
          base: inputs.apiInputs.branch /* optional: defaults to default branch */,
          head: getPRBranchName(inputs),
          draft: true,
          changes: [
            {
              /* optional: if `files` is not passed, an empty commit is created instead */
              files: this.generateFiles4PR(testFiles),
              commit:
                `UT for files: ${this.listUTFile(testFiles)}`,
            },
          ],
        })
        .then((pr) => {
          core.debug(`PR well created with number: ${pr?.data.number}`);
          const url = buildGithubPRURL(repo.repo, repo.owner, pr?.data.number);
          this.generatePRComment(markdown.createUTPRComment(url, testFiles, false));
        }).catch(async (e) => {
          const error = e as Error;
          core.debug(`ERROR While creating the PR: ${error.message}`);
          // Push an error message in PR comment
          const errorMessage = `Fails creating the branch ${getPRBranchName(inputs)}.
            It seems that there is already a branch with the given name.
            Either delete it, or create a PR on ${inputs.apiInputs.branch}`;
          const message = await createSQUARErrorMessage(errorMessage, inputs.apiInputs.repoURL);
          void this.generatePRComment(message);
        });

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
          const comments = await getAllComments(repo, pullRequestNumber);

          const comment = await checkIfCommentALreadyExists(comments, message);

          // If yes, update that
          if (comment) {
              core.debug("There is already one comment that matches, then delete it.");
              // await updateComment(comment, message);
              await this.deleteComment(comment);
          // if not, create a new comment
          } /*else {
              core.debug("No comment matches, then create it.");
              await createComment(repo, pullRequestNumber, message);
          }*/

        // Create the comment in the PR
          await this.createComment(repo, pullRequestNumber, message);

      } catch (e) {
          const error = e as Error;
          core.setFailed(error.message);
      }
    }

  }

  public async createCommit(testFiles: TestFile[], inputs: ActionInputs,
                            prNumber: number, markdown: Markdown): Promise<void> {
    const octo = new OctokitRest({
      auth: githubToken,
    });

    await this.uploadToRepo(octo, testFiles, repo.owner, repo.repo, getPRBranchName(inputs));
    // update the message with more sophisitcated MD content
    const url = buildGithubPRURL(repo.repo, repo.owner, prNumber);
    this.generatePRComment(markdown.createUTPRComment(url, testFiles, true));

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
    body += `This PR contains some proposal of Unit-Tests by Ponicode based on Ponicode SQUAR outputs.`;

    //body += this.listUTFile(testFiles);

    return body;

  }

  private generateFiles4PR(testFiles: TestFile[]): TestFile4PR {
    let result = {} as TestFile4PR;

    testFiles.forEach((test: TestFile) => {
      result[test.filePath] = test.content;
    });

    // TODO: add a workflow YAML to test if project build in the CI

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

  /*private async updateComment(comment: any, message: string): Promise<void> {
      await octokit.rest.issues.updateComment({
          owner: repo.owner,
          repo: repo.repo,
          comment_id: comment.id,
          body: message,
      });
  }*/

  private async deleteComment(comment: any): Promise<void> {
    await octokit.rest.issues.deleteComment({
        owner: repo.owner,
        repo: repo.repo,
        comment_id: comment.id,
    });
}

  /* Methods required to create a commit and push it on a branch */
  private uploadToRepo = async (
    octo: OctokitRest,
    testFiles: TestFile[],
    org: string,
    repo: string,
    branch: string = `master`,
  ) => {
    // gets commit's AND its tree's SHA
    const currentCommit = await this.getCurrentCommit(octo, org, repo, branch);
    const filesPaths = testFiles.map((file) => file.filePath);
    const filesBlobs = await Promise.all(filesPaths.map(this.createBlobForFile(octo, org, repo)));
    const pathsForBlobs = filesPaths;
    const newTree = await this.createNewTree(
      octo,
      org,
      repo,
      filesBlobs,
      pathsForBlobs,
      currentCommit.treeSha,
    );
    const commitMessage = `GitHub Action updates Ponicode UT`;
    const newCommit = await this.createNewCommit(
      octo,
      org,
      repo,
      commitMessage,
      newTree.sha,
      currentCommit.commitSha,
    );
    await this.setBranchToCommit(octo, org, repo, branch, newCommit.sha);
  }

  private getCurrentCommit = async (
    octo: OctokitRest,
    org: string,
    repo: string,
    branch: string = "master",
  ) => {
    const { data: refData } = await octo.rest.git.getRef({
      owner: org,
      repo,
      ref: `heads/${branch}`,
    });
    const commitSha = refData.object.sha;
    const { data: commitData } = await octo.rest.git.getCommit({
      owner: org,
      repo,
      commit_sha: commitSha,
    });
    return {
      commitSha,
      treeSha: commitData.tree.sha,
    };
  }

  // Notice that readFile's utf8 is typed differently from Github's utf-8
  private getFileAsUTF8 = (filePath: string) => readFile(filePath, "utf8");

  private createBlobForFile = (octo: OctokitRest, org: string, repo: string) => async (
    filePath: string,
  ) => {
    const content = await this.getFileAsUTF8(filePath);
    const blobData = await octo.rest.git.createBlob({
      owner: org,
      repo,
      content,
      encoding: "utf-8",
    });
    return blobData.data;
  }

  private createNewTree = async (
    octo: OctokitRest,
    owner: string,
    repo: string,
    blobs: any[],
    paths: string[],
    parentTreeSha: string
  ) => {
    // My custom config. Could be taken as parameters
    const tree = blobs.map(({ sha }, index) => ({
      path: paths[index],
      mode: `100644`,
      type: `blob`,
      sha,
    } as GitTree));
    const { data } = await octo.rest.git.createTree({
      owner,
      repo,
      tree,
      base_tree: parentTreeSha,
    });
    return data;
  }

  private createNewCommit = async (
    octo: OctokitRest,
    org: string,
    repo: string,
    message: string,
    currentTreeSha: string,
    currentCommitSha: string,
  ) =>
    (await octo.rest.git.createCommit({
      owner: org,
      repo,
      message,
      tree: currentTreeSha,
      parents: [currentCommitSha],
    })).data

  private setBranchToCommit = (
    octo: OctokitRest,
    org: string,
    repo: string,
    branch: string = `master`,
    commitSha: string,
  ) =>
    octo.rest.git.updateRef({
      owner: org,
      repo,
      ref: `heads/${branch}`,
      sha: commitSha,
    })

}

export default new PullRequest();
