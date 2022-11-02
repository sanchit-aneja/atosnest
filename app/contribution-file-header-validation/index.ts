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
    const fileId = uuidv4();
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

    const result = await Type2Validations.start(
      blobHelper.stringToStream(fileData),
      context, 
      errors
    );

    // Step 4: vaildation Type 2C
    // PN-97531: be0d57c4-0a8c-4d7b-8af5-1cba12a9f16a is hard coded need to change once TO DO once header details ticket is done. PN-97531
    await CommonContributionDetails.createFileEntry(
      fileId,
      fileName,
      fileProperties,
      result.header_id,
      "CSU"
    ); // File type is `CSU : Contribution Schedule upload from the employer`
    await Type2CValidations.start(
      blobHelper.stringToStream(fileData),
      context,
      fileId,
      result.header_id,
      errors
    );
    // Step 5: vaildation Type 2D
    await Type2DValidations.start(
      blobHelper.stringToStream(fileData),
      context,
      fileId,
      result.header_id, //"be0d57c4-0a8c-4d7b-8af5-1cba12a9f16a",
      errors
    );

    // Update contribution member details
    await SaveContributionDetails.updateMemberDetails(
      blobHelper.stringToStream(fileData),
      context,
      result.header_id,
      errors
    );

    const timeStamp = new Date().toUTCString();
    context.bindings.outputEvent = {
      id: uuidv4(),
      subject:
        process.env.contribution_ValidateFUMType3Suject ||
        "validate-contribution-fum-file-type3",
      dataVersion: "1.0",
      eventType: "csv-validated",
      data: {
        message: "contribution fum file type3 validated",
        correlationId: correlationId,
        contributionHeaderId: result.header_id,
        fileId: fileId,
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
