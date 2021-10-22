// Action Inputs Type definition
interface SquarAPIInputs {
    repoURL: string;
    userToken: string;
    impactedFiles: string[];
    branch: string;
}

interface ActionInputs {
    apiInputs: SquarAPIInputs;
    ponicodeUtToken: string;
    githubToken: string;
    bootstrapUT: string;
    displayFullReport: string;
}

// SQUAR evalutaPR endpoint Return type
interface EvaluateReturn {
    success: boolean;
    repositoryId?: number;
    message?: string;
}

// Input types to fetch report
interface FetchReportInput {
    userToken: string;
}

//SQUAR TestAlert type
enum AlertKind {
    "test_case",
    "test_suite",
    "edge_case",
}

enum Criticity {
    "green",
    "orange",
    "red",
}

interface TestAlert {
    id?: number;
    repository_id: number;
    alert_kind?: AlertKind;
    line?: number;
    criticity?: Criticity;
    file_path?: string;
}

// SQUAR Report type
interface FullReport {
    repoName: string;
    repoUrl: string;
    ponicodeScore: string;
    missingTestSuite: number | undefined;
    missingTestCases: number | undefined;
    missingEdgeCases: number | undefined;
    suggestions: TestAlert[];
}

interface Report {
    fullReport: FullReport;
    suggestionsOnImpactedFiles: TestAlert[];
}

interface TestFile {
    filePath: string;
    content: string;
}

export { SquarAPIInputs, ActionInputs, EvaluateReturn, FetchReportInput, Report, TestAlert, FullReport, Criticity, AlertKind, TestFile };
