interface TestFile {
    filePath: string;
    content: string;
}

interface Settings {
    "auth.token": string | undefined;
}

export { TestFile, Settings };
