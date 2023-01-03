import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CustomError } from "../Errors";
import app from "../utils/app";
import blobHelper from "../utils/blobHelper";
import {
  memberColumnFormats,
  memberColumns,
  LOADING_DATA_ERROR_CODES,
} from "../utils/constants";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
) {
  const payload = req.body;
  const correlationId = payload.correlationId;
  let errorPayload = null; // If any error it will update here

  if (!payload.blobName) {
    throw new CustomError(
      "CONTRIBUTION_HEADER_VALIDATION_FAILED",
      "Blob name is missing"
    );
  }
  const fileTimeStamp = app.getFileTimeStamp(payload.blobName);

  let newItem: any;
  const fileName = payload.blobName;
  try {
    const _blobServiceClient = blobHelper.getBlobServiceClient();
    const readStream = await blobHelper.getBlobStream(
      fileName,
      _blobServiceClient
    );

    await app
      .getCSVDataFromReadStream(readStream, memberColumns, memberColumnFormats)
      .then(
        (onResolved) => {
          newItem = onResolved;
        },
        (onRejected) => {
          errorPayload = {
            ...LOADING_DATA_ERROR_CODES.MEMBER_VALIDATION,
            File_Name: fileName,
            Time_Of_Processing: new Date().toUTCString(),
            Error_Details: `${onRejected?.message}`,
          };
          context.log("errorPayload", errorPayload);
        }
      );
    if (newItem) {
      context.log("SUCCESS", "MEMBER FILE VALIDATED SUCCSSFULLY");
      context.res = {
        status: 200 /* Defaults to 200 */,
        body: {
          initatorApp: "contriIndex",
          contriActionTrigger: "memberValidation",
          nextContriActionTrigger: "plicyValidation",
          payloadForNextAction: {
            correlationId: correlationId,
            blobName: `Contribution_Policy_File_${fileTimeStamp}.csv`,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      };

      context.log(
        "Member validation Done : " +
          JSON.stringify(context.bindings.outputEvent)
      );
    }
  } catch (error) {
    context.log("FAILURE", error.message);

    errorPayload = {
      ...LOADING_DATA_ERROR_CODES.MEMBER_VALIDATION,
      File_Name: fileName,
      Time_Of_Processing: new Date().toUTCString(),
      Error_Details: `${error?.message} - ${error?.name} - ${error?.moreDetails}`,
    };
    if (errorPayload) {
      context.res = {
        status: 400,
        body: {
          errors: [
            {
              errorCode: "CoI-0002",
              errorDetail: errorPayload.Error_Details,
            },
          ],
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    context.log("errorPayload", errorPayload);
  }
};

export default httpTrigger;
