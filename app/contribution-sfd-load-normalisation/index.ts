import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import normalisation from "../utils/normalisation";
import sequelize from "../utils/database";
import { LOADING_DATA_ERROR_CODES, CSV_FILES } from "../utils/constants";
import blobHelper from "../utils/blobHelper";
import * as moment from "moment";
import app from "../utils/app";
import { CustomError } from "../Errors";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log(
    `Inside contribution-sfd-load-normalisation function with trigger data: ${JSON.stringify(
      req.body
    )}`
  );
  const payload = req.body;
  const correlationId = payload.correlationId;
  let errorPayload = null; // If any error it will update here

  const startedTime = new Date();
  context.log(`staging started on : ${startedTime.toUTCString()}`);

  let fileName = "";
  let fileTime = "";
  let transaction;
  try {
    if (!payload.blobName) {
      throw new CustomError(
        "CONTRIBUTION_LOAD_STAGING_FAILED",
        "Blob name is missing"
      );
    }
    fileName = payload.blobName;
    fileTime = app.getFileTimeStamp(fileName);

    //Step1: Start transaction
    transaction = await sequelize.transaction();

    // Step2: Save File Log & File Header Map
    const blobServiceClient = blobHelper.getBlobServiceClient();
    const blobName = `Contribution_Header_File_${fileTime}.csv`;
    const properties = await blobHelper.getBlobProperties(
      blobName,
      blobServiceClient
    );
    let fileObj = {
      createdDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      createdBy: "System",
      file: {
        fileName: blobName,
        fileType: "CSE",
        fileSize: properties.contentLength,
        fileSizeType: "B",
        fileStatus: "V",
        fileFormat: "CSV",
        fileReceivedDate: new Date().toISOString(),
        fileProcessedDate: new Date().toISOString(),
        fileUploadedOn: new Date().toISOString(),
        fileSentDate: new Date().toISOString(),
      },
    };

    await normalisation.createFileHeaderMapping(context, fileObj);
    //Step 3: move data to contribution header, using sequelize bluk insert.
    await normalisation.createContributionHeader(context);
    //Step 4: move data member contribution details
    await normalisation.createContributionDetails(context);
    //Step 5: All success commit
    await transaction.commit();
  } catch (error) {
    context.log("normalisation failed : ", error.message);
    //FailedStep: Rollback changes
    if (transaction) {
      await transaction.rollback();
    }
    errorPayload = {
      ...LOADING_DATA_ERROR_CODES.LOADING_NORMALISATION_TABLES,
      File_Name: `${CSV_FILES[0].namePrefix}${fileTime}.csv`,
      Time_Of_Processing: new Date().toUTCString(),
      Error_Details: `${error?.message} - ${error?.name} - ${error?.moreDetails}`,
    };

    context.log("errorPayload", errorPayload);
  }
  const endTime = new Date();
  context.log(`normalisation ended on : ${endTime.toUTCString()}`);
  context.log(
    `Total time taken for normalisation: ${
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
            errorCode: "CoI-0005",
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
        contriActionTrigger: "loadNormalisation",
        nextContriActionTrigger: null,
        payloadForNextAction: {
          correlationId: correlationId,
          blobName: `Contribution_Header_File_${fileTime}.csv`,
        },
      },
    };
  }
};

export default httpTrigger;
