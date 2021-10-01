// Action Inputs Type definition
interface Inputs {
    repoURL: string;
    userToken: string;
    impactedFiles: string[];
    branch: string;
}

// SQUAR evalutaPR endpoint Return type
interface EvaluateReturn {
    success: boolean;
    repositoryId?: number;
    message?: string;
}

export { Inputs, EvaluateReturn }