import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import app from "../utils/app";
import blobHelper from "../utils/blobHelper";
import {
  headerColumns,
  headerColumnFormats,
  LOADING_DATA_ERROR_CODES,
} from "../utils/constants";
import { CustomError } from "../Errors";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log(
    `Inside contribution-sfd-header-validation function with trigger data: ${JSON.stringify(
      req.body
    )}, headers: ${JSON.stringify(req.headers)}`
  );
  const payload = req.body;
  const correlationId = payload.correlationId;
  let errorPayload = null; // If any error it will update here

  let fileName = "";
  let fileTime = "";
  try {
    if (!payload.blobName) {
      throw new CustomError(
        "CONTRIBUTION_HEADER_VALIDATION_FAILED",
        "Blob name is missing"
      );
    }
    fileName = payload.blobName;
    fileTime = app.getFileTimeStamp(fileName);

    let newItem;
    const _blobServiceClient = blobHelper.getBlobServiceClient();
    const readStream = await blobHelper.getBlobStream(
      fileName,
      _blobServiceClient
    );
    if (readStream == null) {
      throw new CustomError(
        "CONTRIBUTION_HEADER_VALIDATION_FAILED",
        `${fileName} is not found`
      );
    }

    await app
      .getCSVDataFromReadStream(readStream, headerColumns, headerColumnFormats)
      .then(
        (onResolved) => {
          newItem = onResolved;
        },
        (onRejected) => {
          errorPayload = {
            ...LOADING_DATA_ERROR_CODES.HEADER_VALIDATION,
            File_Name: fileName,
            Time_Of_Processing: new Date().toUTCString(),
            Error_Details: `${onRejected?.message}`,
          };
          context.log("errorPayload", errorPayload);
        }
      );

    if (newItem) {
      context.log("SUCCESS", "HEADER FILE VALIDATED SUCCSSFULLY");
    }
  } catch (error) {
    context.log("FAILURE", error.message);

    errorPayload = {
      ...LOADING_DATA_ERROR_CODES.HEADER_VALIDATION,
      File_Name: fileName,
      Time_Of_Processing: new Date().toUTCString(),
      Error_Details: `${error?.message} - ${error?.name} - ${error?.moreDetails}`,
    };

    context.log("errorPayload", errorPayload);
  }

  // Set response back
  if (errorPayload) {
    context.res = {
      status: 400,
      body: {
        errors: [
          {
            errorCode: "CoI-0001",
            errorDetail: errorPayload.Error_Details,
          },
        ],
      },
      headers: {
        "Content-Type": "application/json",
      },
    };
  } else {
    context.res = {
      status: 200 /* Defaults to 200 */,
      body: {
        initatorApp: "contriIndex",
        contriActionTrigger: "headerValidation",
        nextContriActionTrigger: "memberValidation",
        payloadForNextAction: {
          correlationId: correlationId,
          blobName: `Contribution_Member_File_${fileTime}.csv`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};

export default httpTrigger;
