import * as core from "@actions/core";
import * as github from "@actions/github";

export async function getAllComments(repo: { owner: any; repo: any; }, issue_number: number): Promise<any[]> {
    // get the inputs of the action. The "token" input
    // is not defined so far - we will come to it later.
    const githubToken = core.getInput("githubToken");

    const octokit = github.getOctokit(githubToken);

    // Get all comments we currently have...
    // (this is an asynchronous function)
    const { data: comments } = await octokit.rest.issues.listComments({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: issue_number,
    });

    return comments;
}

export async function checkIfCommentALreadyExists(comments: any[], message: string): Promise<any> {

    const startOfMessage = message.slice(0, 50);
    // ... and check if there is already a comment by us
    // tslint:disable-next-line: no-shadowed-variable
    const comment = comments.find((comment) => {
        if ((comment) && (comment.user) && (comment.body)) {
            return (
                comment.user.login === "github-actions[bot]" &&
                comment.body.startsWith(startOfMessage)
            );
        }
    });
    return comment;

}
