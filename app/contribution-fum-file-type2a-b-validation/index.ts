import { AzureFunction, Context } from "@azure/functions";
import blobHelper from "../utils/blobHelper";
import { LOADING_DATA_ERROR_CODES } from "../utils/constants";
import { Type2Validations, CommonContributionDetails } from "../business-logic";
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
  const fqsId = eventGridEvent.data.fqsId;

  const fqsHelper = new FQSHelper(context);
  try {
    context.log(
      `Started vaildation for correlation Id ${correlationId} fqsId: ${fqsId}`
    );

    // initialization of errors and update FQS
    const errors = await CommonContributionDetails.getAllErrors();

    const fqsBody = fqsHelper.getFQSBody(
      fqsId,
      fileName,
      fqsStage.HEADER,
      fqsStatus.INPROGRESS
    );

    await fqsHelper.updateFQSProcessingStatus(fqsId, fqsBody);

    // Step 1: get data from blob file
    const _blobServiceClient = blobHelper.getBlobServiceClient();
    const readStream = await blobHelper.getBlobStream(
      fileName,
      _blobServiceClient
    );
    const fileData = await blobHelper.streamToString(readStream);

    // STEP 2 & 3 : Type 2A & 2B errors
    const result = await Type2Validations.start(
      blobHelper.stringToStream(fileData),
      context,
      errors
    );

    // Sending message to Type 2C & D
    const timeStamp = new Date().toUTCString();
    context.bindings.outputEvent = {
      id: uuidv4(),
      subject:
        process.env.contribution_ValidateFUMType2CDSuject ||
        "validate-contribution-fum-file-type2c-d",
      dataVersion: "1.0",
      eventType: "csv-validated",
      data: {
        message: "contribution fum file type2C and D validate",
        correlationId: correlationId,
        contributionHeaderId: result.header_id,
        fileName: fileName,
        fqsId: fqsId,
      },
      eventTime: timeStamp,
    };

    context.log(
      `Validation done for correlation Id ${correlationId} fqsId:${fqsId}`
    );
  } catch (error) {
    if (!Array.isArray(error)) {
      context.log(
        `Something went wrong, error ${JSON.stringify(error.message)}`
      );
      const somethingError =
        CommonContributionDetails.getSomethingWentWrongError("2B", "CS");
      error = [somethingError];
    }
    // Send error to FQS
    const reqPayload = CommonContributionDetails.getFQSPayloadForErrors(
      "contrib-index-sched-file-upload",
      error,
      "Type 2",
      "",
      "contribution-fum-file-type2a-b-validation"
    );

    await fqsHelper.updateFQSFinishedStatus(fqsId, reqPayload);

    context.log("Sending Error data to FQS", JSON.stringify(reqPayload));
  }
  context.log(
    `Vaildation done for correlation Id ${correlationId} fqsId: ${fqsId}`
  );
};

export default eventGridTrigger;
