import {InputOptions} from "@actions/core";
import { Logger } from "tslog";
import {Inputs} from "./types";

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

export const parseInputs = (getInput: GetInput): Inputs => {
  const repoURL = getInput("repoURL", {required: true});
  const userToken = getInput("userToken", {required: true});
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
