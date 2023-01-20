import { AxiosResponse } from "axios";
import { Context } from "@azure/functions";
import { httpRequestGenerator } from "./httpRequestGenerator";
import { FQSBody, EventBody, IntentAttributes, FQSError } from "./fqsBody";

const ROOT_ENDPOINT = process.env.contribution_FqsHost;
const API_KEY = process.env.contribution_FqsApiKey;

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
   * @param fqsId
   *  @returns response
   */
  getFQSStatusViews(fqsId: string, correlationId: string) {
    return new Promise((resolve, reject) => {
      httpRequestGenerator(
        "GET",
        `${ROOT_ENDPOINT}/statusviews/${fqsId}`,
        null,
        {
          "Correlation-ID": correlationId,
          "api-key": API_KEY
        }
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
   * @param fqsId
   * @param correlationId
   *  @returns response
   */
  updateFQSProcessingStatus(
    fqsId: string,
    correlationId: string,
    payload: any
  ) {
    return new Promise((resolve, reject) => {
      httpRequestGenerator(
        "PUT",
        `${ROOT_ENDPOINT}/statusviews/${fqsId}/processingstatus`,
        payload,
        {
          "Correlation-ID": correlationId,
          "api-key": API_KEY
        }
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
   * @param fqsId
   * @param correlationId
   * @param payload
   * @returns response
   */
  updateFQSFinishedStatus(fqsId: string, correlationId: string, payload: any) {
    return new Promise((resolve, reject) => {
      httpRequestGenerator(
        "PUT",
        `${ROOT_ENDPOINT}/statusviews/${fqsId}/finishedstatus`,
        payload,
        {
          "Correlation-ID": correlationId,
          "api-key": API_KEY
        }
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
    const fqsbody = {} as FQSBody;

    const eventbody = {} as EventBody;

    const intentAttributes = {} as IntentAttributes;

    const fqserror = {} as FQSError;
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
      fqserror.ErrorText = error.Error_Details;
      intentAttributes.error = fqserror;
    }
    eventbody.intentAttributes = intentAttributes;
    fqsbody.eventBody = eventbody;
    return fqsbody;
  }
}

export default FQSHelper;
