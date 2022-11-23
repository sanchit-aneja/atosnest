import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import DataImportHelper from "../utils/dataImportHelper";
import app from "../utils/app";
import { LOADING_DATA_ERROR_CODES, CSV_FILES } from "../utils/constants";
import { CustomError } from "../Errors";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log(
    `Inside contribution-sfd-load-staging function with trigger data: ${JSON.stringify(
      req.body
    )}`
  );
  const payload = req.body;
  const correlationId = payload.correlationId;
  let errorPayload = null; // If any error it will update here

  let fileName = "";
  let fileTime = "";

  const startedTime = new Date();
  context.log(`staging started on : ${startedTime.toUTCString()}`);
  try {
    if (!payload.blobName) {
      throw new CustomError(
        "CONTRIBUTION_LOAD_STAGING_FAILED",
        "Blob name is missing"
      );
    }
    fileName = payload.blobName;
    fileTime = app.getFileTimeStamp(fileName);

    const importHelper = new DataImportHelper();
    // All three CSV files are loaded here to STG tables
    await importHelper.LoadDataFromCSVs(fileTime, context);
  } catch (error) {
    console.log(
      "Failed :  load-normalisation ",
      error?.name,
      error.moreDetails
    );
    errorPayload = {
      ...LOADING_DATA_ERROR_CODES.LOADING_TO_STAGING_TABLES,
      File_Name: `${CSV_FILES[0].namePrefix}${fileTime}.csv`,
      Time_Of_Processing: new Date().toUTCString(),
      Error_Details: `${error?.message} - ${error?.name} - ${error?.moreDetails}`,
    };
  }
  const endTime = new Date();
  context.log(`staging ended on : ${endTime.toUTCString()}`);
  context.log(
    `Total time taken for staging loading: ${
      (endTime.getTime() - startedTime.getTime()) / 1000
    } sec`
  );

  // Set response back
  if (errorPayload) {
    context.res = {
      status: 400,
      body: {
        errors: [
          {
            errorCode: "CoI-0004",
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
        contriActionTrigger: "loadStaging",
        nextContriActionTrigger: "loadNormalisation",
        payloadForNextAction: {
          correlationId: correlationId,
          blobName: `Contribution_Member_File_${fileTime}.csv`,
        },
      },
    };
  }
};

export default httpTrigger;
