import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import blobHelper from "../utils/blobHelper";
import {
  policyColumns,
  policyFormats,
  LOADING_DATA_ERROR_CODES,
} from "../utils/constants";
import app from "../utils/app";
import { CustomError } from "../Errors";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log(
    `Inside contribution-sfd-policy-validation function with trigger data: ${JSON.stringify(
      req.body
    )}`
  );
  const payload = req.body;
  const correlationId = payload.correlationId;
  let errorPayload = null; // If any error it will update here

  let fileName = "";
  try {
    let newItem;

    if (!payload.blobName) {
      throw new CustomError(
        "CONTRIBUTION_POLICY_VALIDATION_FAILED",
        "Blob name is missing"
      );
    }
    fileName = payload.blobName;

    const _blobServiceClient = blobHelper.getBlobServiceClient();
    const readStream = await blobHelper.getBlobStream(
      fileName,
      _blobServiceClient
    );

    if (readStream == null) {
      throw new CustomError(
        "CONTRIBUTION_POLICY_VALIDATION_FAILED",
        `${fileName} is not found`
      );
    }

    await app
      .getCSVDataFromReadStream(readStream, policyColumns, policyFormats)
      .then(
        (onResolved) => {
          newItem = onResolved;
        },
        (onRejected) => {
          errorPayload = {
            ...LOADING_DATA_ERROR_CODES.POLICY_VALIDATION,
            File_Name: fileName,
            Time_Of_Processing: new Date().toUTCString(),
            Error_Details: `${JSON.stringify(onRejected)}`,
          };
          context.log(errorPayload);
        }
      );
    if (newItem) {
      context.log("SUCCESS", "POLICY FILE VALIDATED SUCCSSFULLY");
    }
  } catch (error) {
    context.log("FAILURE", error.message);

    errorPayload = {
      ...LOADING_DATA_ERROR_CODES.POLICY_VALIDATION,
      File_Name: fileName,
      Time_Of_Processing: new Date().toUTCString(),
      Error_Details: `${error?.message} - ${error?.name} - ${error?.moreDetails}`,
    };

    console.log(errorPayload);
  }

  // Set response back
  if (errorPayload) {
    context.res = {
      status: 400,
      body: {
        errors: [
          {
            errorCode: "CoI-0003",
            errorDetail: errorPayload.Error_Details,
          },
        ],
      },
    };
  } else {
    context.res = {
      status: 200 /* Defaults to 200 */,
      body: {
        initatorApp: "contriIndex",
        contriActionTrigger: "policyValidation",
        nextContriActionTrigger: "loadStaging",
        payloadForNextAction: {
          correlationId: correlationId,
          blobName: fileName,
        },
      },
    };
  }
};

export default httpTrigger;
