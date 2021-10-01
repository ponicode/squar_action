import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Logger } from "tslog";
import { EvaluateReturn, Inputs } from "./types";

const log: Logger = new Logger();

function triggerSquarEvaluate(inputs: Inputs): Promise<EvaluateReturn> {
    return axios({
        method: 'POST',
        data: inputs,
        url: process.env.SQUAR_API_URL + "/evaluate_pr",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res: AxiosResponse) => {
        return res.data;
      }).then((data: EvaluateReturn) => {
        return data;
      }).catch((err: any) => {
        const result: EvaluateReturn = {
            success: false,
            message: "Error triggering SQUAR evaluate_pr endpoint :" + err.message,
        };
        return result;
      });

}

export { triggerSquarEvaluate };
