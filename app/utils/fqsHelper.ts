import { AxiosResponse } from "axios";
import { Context } from "@azure/functions";
import { httpRequestGenerator } from "./httpRequestGenerator";
import { fqsbody, eventbody, intentAttributes, fqserror } from "./fqsBody";

const ROOT_ENDPOINT = process.env.fqs_Host;

class FQSHelper {
  private _context: Context;

  /** FQSHelper */
  constructor(context?: Context) {
    try {
      if (context) {
        this._context = context;
      }
    } catch (error) {
      this.log(
        `Failed to create insteance of FQSHelper. Reason: ${error.message}`
      );
    }
  }

  /**
   * This is helper to log fqs call
   * @param args
   */
  private log(...args: any[]) {
    if (this._context) {
      this._context.log("FQSHelper::", ...args);
    }
  }
  /**
   * get FQS Status Views
   * @param correlationId
   *  @returns response
   */
  getFQSStatusViews(correlationId: string) {
    return new Promise((resolve, reject) => {
      httpRequestGenerator(
        "GET",
        `${ROOT_ENDPOINT}/statusviews/${correlationId}`
      )
        .then((response: AxiosResponse) => {
          resolve(response);
        })
        .catch((e) => {
          this.log("error making fqs status views GET request");
          reject(e);
        });
    });
  }
  /**
   * update FQS  processing Status
   * @param correlationId
   *  @returns response
   */
  updateFQSProcessingStatus(correlationId: string, payload: any) {
    return new Promise((resolve, reject) => {
      httpRequestGenerator(
        "PUT",
        `${ROOT_ENDPOINT}/statusviews/${correlationId}/processingstatus`,
        payload
      )
        .then((response: AxiosResponse) => {
          resolve(response);
        })
        .catch((e) => {
          this.log("error making fqs processing status PUT request");
          reject(e);
        });
    });
  }
  /**
   * update FQS  finished Status
   * @param correlationId
   *  @returns response
   */
  updateFQSFinishedStatus(correlationId: string, payload: any) {
    return new Promise((resolve, reject) => {
      httpRequestGenerator(
        "PUT",
        `${ROOT_ENDPOINT}/statusviews/${correlationId}/finishedstatus`,
        payload
      )
        .then((response: AxiosResponse) => {
          resolve(response);
        })
        .catch((e) => {
          this.log("error making fqs finished status PUT request");
          reject(e);
        });
    });
  }
  /**
   * update FQS  finished Status
   * @param correlationId
   * @param fileId
   * @param stage
   * @param status
   * @param errors
   * @returns json
   */
  getFQSBody(
    correlationId: string,
    fileId: string,
    stage: string,
    status: string,
    errors?: any
  ) {
    eventbody.correlationId = correlationId;
    eventbody.payloadType = "ContIndexFileUpload";
    eventbody.srcSystemId = "AZURE";
    eventbody.recievedDateTime = new Date().toUTCString();
    intentAttributes.FileId = fileId;
    intentAttributes.Stage = stage;
    intentAttributes.Status = status;

    if (errors) {
      intentAttributes.NumberOfErrors = errors.length;
      const error = errors[0];
      fqserror.ErrorItem = error.Error_Code;
      fqserror.ErrorText = error.Error_Name;
      intentAttributes.error = fqserror;
    }
    eventbody.intentAttributes = intentAttributes;
    fqsbody.eventBody = eventbody;
    return fqsbody;
  }
}

export default FQSHelper;
