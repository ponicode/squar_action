interface TestFile4PR {
[   path: string]: string;
}

interface Commit {
    commitSha: string;
    treeSha: string;
}

interface GitTree {
    path?: string | undefined;
    mode?: "100644" | "100755" | "040000" | "160000" | "120000" | undefined;
    type?: "tree" | "blob" | "commit" | undefined;
    sha?: string | null | undefined;
    content?: string | undefined;
}

const PONICODE_UT_BRANCH = "ponicode-ut-proposal";

export { PONICODE_UT_BRANCH, TestFile4PR, Commit, GitTree };
