import { AxiosResponse } from "axios";
import { Context } from "@azure/functions";
import { httpRequestGenerator } from "./httpRequestGenerator";

/**
 * Document Index Helper
 */
class DocumentIndexHelper {
  private _context: Context;
  public static BASE_URL: string =
    process.env.contribution_DocumentIndexBaseURL;
  public static INPUT_SOURCE: string =
    process.env.contribution_DocumentIndexSource;

  /** DocumentIndexHelper */
  constructor(context?: Context) {
    try {
      if (context) {
        this._context = context;
      }
    } catch (error) {
      this.log(
        `Failed to create insteance of DocumentIndexHelper. Reason: ${error.message}`
      );
    }
  }

  /**
   * This is helper to log fqs call
   * @param args
   */
  private log(...args: any[]) {
    if (this._context) {
      this._context.log("DocumentIndexHelper::", ...args);
    }
  }

  public moveFile(
    blobName: string,
    operation: string = "move"
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      httpRequestGenerator("POST", `${DocumentIndexHelper.BASE_URL}/file`, {
        documentName: blobName,
        directionId: 1, // For now it will static value
        isMigrated: "N", // For now it will static value
        businessType: "NK", // For now it will static value
        source: DocumentIndexHelper.INPUT_SOURCE,
        op: operation,
      })
        .then((response: AxiosResponse) => {
          if (response.status == 200 && response.data.documentId) {
            this.log(
              `Document index response: ${JSON.stringify(response.data)}`
            );
            resolve(
              `${DocumentIndexHelper.BASE_URL}/file/${response.data.documentId}`
            );
          } else {
            throw new Error(
              `Document index call is failed: ${JSON.stringify(response)}}`
            );
          }
        })
        .catch((e) => {
          this.log(
            `error making document move processing status POST request ${e.message}`
          );
          reject(e);
        });
    });
  }
}

export default DocumentIndexHelper;
