import { AzureFunction, Context } from "@azure/functions";
import blobHelper from "../utils/blobHelper";
import { LOADING_DATA_ERROR_CODES } from "../utils/constants";
import {
  SaveContributionDetails,
  Type2CValidations,
  Type2DValidations,
  Type2Validations,
  CommonContributionDetails,
} from "../business-logic";
import { FQSHelper } from "../utils";
import { fqsStage, fqsStatus } from "../utils/fqsBody";
import { v4 as uuidv4 } from "uuid";

const eventGridTrigger: AzureFunction = async function (
  context: Context,
  eventGridEvent: any
): Promise<void> {
  context.log(
    "File Upload validation started: " + JSON.stringify(eventGridEvent)
  );
  const fileName = eventGridEvent.data.fileName;
  const correlationId = eventGridEvent.data.correlationId;
  const fqsHelper = new FQSHelper(context);
  const fileId = eventGridEvent.data.fileId;
  const contributionHeaderId = eventGridEvent.data.contributionHeaderId;
  try {
    context.log(`Started vaildation for correlation Id ${correlationId}`);

    // initialization of errors and update FQS
    const errors = await CommonContributionDetails.getAllErrors();

    const fqsBody = fqsHelper.getFQSBody(
      correlationId,
      fileName,
      fqsStage.HEADER,
      fqsStatus.INPROGRESS
    );

    await fqsHelper.updateFQSProcessingStatus(correlationId, fqsBody);

    // Step 1: get data from blob file
    const _blobServiceClient = blobHelper.getBlobServiceClient();
    const fileProperties = await blobHelper.getBlobProperties(
      fileName,
      _blobServiceClient
    );
    const readStream = await blobHelper.getBlobStream(
      fileName,
      _blobServiceClient
    );
    const fileData = await blobHelper.streamToString(readStream);

    // Step 2: vaildation Type 2C
    await CommonContributionDetails.createFileEntry(
      fileId,
      fileName,
      fileProperties,
      contributionHeaderId,
      "CSU"
    ); // File type is `CSU : Contribution Schedule upload from the employer`
    await Type2CValidations.start(
      blobHelper.stringToStream(fileData),
      context,
      fileId,
      contributionHeaderId,
      errors
    );
    // Step 3: vaildation Type 2D
    await Type2DValidations.start(
      blobHelper.stringToStream(fileData),
      context,
      fileId,
      contributionHeaderId, //"be0d57c4-0a8c-4d7b-8af5-1cba12a9f16a",
      errors
    );

    // Update contribution member details
    await SaveContributionDetails.updateMemberDetails(
      blobHelper.stringToStream(fileData),
      context,
      contributionHeaderId,
      errors
    );

    // Sending message to Type 3
    const timeStamp = new Date().toUTCString();
    context.bindings.outputEvent = {
      id: uuidv4(),
      subject:
        process.env.contribution_ValidateFUMType3Suject ||
        "validate-contribution-fum-file-type3",
      dataVersion: "1.0",
      eventType: "csv-validated",
      data: {
        message: "contribution fum file type3 validate",
        correlationId: correlationId,
        contributionHeaderId: contributionHeaderId,
        fileId: fileId,
        fileName: fileName,
      },
      eventTime: timeStamp,
    };

    context.log(`Validation done for correlation Id ${correlationId}`);
  } catch (error) {
    if (!Array.isArray(error)) {
      context.log(
        `Something went wrong, error ${JSON.stringify(error.message)}`
      );
      error = [
        {
          code: "ID9999",
          message: "Something went wrong",
        },
      ];
    }
    // Write errors to DB and Error log file only when Type 2B passed
    await CommonContributionDetails.saveFileErrorDetails(error, fileId);
    const errorPayload = [
      {
        ...LOADING_DATA_ERROR_CODES.FILE_HEADER_VALIDATION,
        File_Name: fileName,
        Time_Of_Processing: new Date().toUTCString(),
        Error_Details: error,
      },
    ];
    const fqsBody = fqsHelper.getFQSBody(
      correlationId,
      fileName,
      fqsStage.HEADER,
      fqsStatus.ERROR,
      errorPayload
    );

    await fqsHelper.updateFQSFinishedStatus(correlationId, fqsBody);

    context.log("Sending Error data to FQS", JSON.stringify(errorPayload));
  }
  context.log(`Vaildation done for correlation Id ${correlationId}`);
};

export default eventGridTrigger;
