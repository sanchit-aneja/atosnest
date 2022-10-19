import { AzureFunction, Context } from "@azure/functions";
import blobHelper from "../utils/blobHelper";
import { LOADING_DATA_ERROR_CODES } from "../utils/constants";
import { SaveContributionDetails, Type2CValidations, Type2DValidations, Type2Validations } from "../business-logic";
import { FQSHelper } from "../utils";
import { fqsStage, fqsStatus } from "../utils/fqsBody";

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

    const fqsBody = fqsHelper.getFQSBody(
      correlationId,
      fileName,
      fqsStage.HEADER,
      fqsStatus.INPROGRESS
    );

    await fqsHelper.updateFQSProcessingStatus(correlationId, fqsBody);

    // Step 1: get data from blob file
    const _blobServiceClient = blobHelper.getBlobServiceClient();
    const readStream = await blobHelper.getBlobStream(
      fileName,
      _blobServiceClient
    );
    const fileData = await blobHelper.streamToString(readStream);

    const result = await Type2Validations.start(blobHelper.stringToStream(fileData), context);
    
    // Step 4: vaildation Type 2C
    await Type2CValidations.start(blobHelper.stringToStream(fileData), context);
    // Step 5: vaildation Type 2D
    await Type2DValidations.start(blobHelper.stringToStream(fileData), context );
    
    // // Update contribution member details
    const results2D = await SaveContributionDetails.updateMemberDetails(blobHelper.stringToStream(fileData), context);

    context.log(`Validation done for correlation Id ${correlationId}`);
  } catch (error) {
    if (!Array.isArray(error)){
      context.log(`Something went wrong, error ${JSON.stringify(error.message)}`)
      error = [{
          code: "ID9999",
          message: "Something went wrong"
      }]
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
