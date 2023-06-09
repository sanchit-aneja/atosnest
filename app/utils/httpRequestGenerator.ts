import Axios, { AxiosPromise, AxiosInstance } from "axios";
import * as https from "https";
export function httpRequestGenerator(
  requestType: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  url: string,
  data?: any,
  headers: any = {}
): AxiosPromise<any> {
  const instance: AxiosInstance = Axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });

  return instance({
    method: requestType,
    url: url,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    data,
  });
}
