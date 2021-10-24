import {InputOptions} from "@actions/core";
import { Logger } from "tslog";
import {ActionInputs, SquarAPIInputs} from "../types";

type GetInput = (name: string, options?: InputOptions | undefined) => string;

const parseJSON = <T>(getInput: GetInput, property: string): T | undefined => {
  const value = getInput(property);
  if (!value) {
    return;
  }
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    const error = e as Error;
    throw new Error(`invalid format for '${property}: ${error.toString()}`);
  }
};

const parseSquarAPIInputs = (getInput: GetInput): SquarAPIInputs => {
  const repoURL = getInput("repoURL", {required: true});
  const userToken = getInput("ponicodeSquarToken", {required: true});
  let impactedFiles = parseJSON<string[]>(getInput, "impactedFiles");
  const branch = getInput("branch", { required: true});

  if (!impactedFiles) {
    impactedFiles = [];
  }

  return {
    repoURL,
    userToken,
    impactedFiles,
    branch,
  };
};

const parseActionInputs = (getInput: GetInput): ActionInputs => {
  const repoURL = getInput("repoURL", {required: true});
  const ponicodeSquarToken = getInput("ponicodeSquarToken", {required: true});
  let impactedFiles = parseJSON<string[]>(getInput, "impactedFiles");
  const branch = getInput("branch", { required: true});
  const githubToken = getInput("githubToken", { required: true});
  const displayFullReport = getInput("displayFullReport", { required: true});

  if (!impactedFiles) {
    impactedFiles = [];
  }

  const apiInputs: SquarAPIInputs = {
    repoURL: repoURL,
    userToken: ponicodeSquarToken,
    impactedFiles: impactedFiles,
    branch: branch,
  }

  return {
    apiInputs: apiInputs,
    githubToken,
    displayFullReport,
  };
};

export { parseSquarAPIInputs, parseActionInputs };
