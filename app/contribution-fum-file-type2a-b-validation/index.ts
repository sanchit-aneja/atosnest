import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import blobHelper from "../utils/blobHelper";
import { Type2Validations, CommonContributionDetails } from "../business-logic";
import { FQSHelper } from "../utils";
import { fqsStage, fqsStatus } from "../utils/fqsBody";
import * as Joi from "joi";
import app from "../utils/app";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log(
    `Inside contribution-fum-file-type2a-b-validation function with trigger data: ${JSON.stringify(
      req.body
    )}`
  );

  const payload = req.body;

  const fqsHelper = new FQSHelper(context);
  try {
    // Request body validation for Type 2A anb 2B
    let requestSchema = Joi.object().keys({
      correlationId: Joi.string().guid({ version: "uuidv4" }).required(),
      blobName: Joi.string().required(),
      fqsId: Joi.string().guid({ version: "uuidv4" }).required(),
      processType: Joi.string().required().valid("CS", "CC"),
    });
    const reqValidationResult = requestSchema.validate(payload);

    if (reqValidationResult.error) {
      context.log(`Bad request ${reqValidationResult.error}`);
      context.res = {
        status: 400 /* Defaults to 200 */,
        body: {
          errors: [
            {
              errorCode: "CoI-0006",
              errorDetail: `Bad request: for contribution-fum-file-type2a-b-validation error details ${reqValidationResult.error}`,
            },
          ],
        },
      };
      return; // Break here. No need go furthermore
    }

    context.log(
      `Started vaildation for correlation Id ${payload.correlationId} fqsId: ${payload.fqsId}`
    );

    // initialization of errors and update FQS
    const errors = await CommonContributionDetails.getAllErrors();

    const fqsBody = fqsHelper.getFQSBody(
      payload.fqsId,
      payload.blobName,
      fqsStage.HEADER,
      fqsStatus.INPROGRESS
    );

    await fqsHelper.updateFQSProcessingStatus(
      payload.fqsId,
      payload.correlationId,
      fqsBody
    );

    // Step 1: get data from blob file
    const _blobServiceClient = blobHelper.getBlobServiceClient();
    const readStream = await blobHelper.getBlobStream(
      payload.blobName,
      _blobServiceClient,
      context
    );
    const fileData = await blobHelper.streamToString(readStream);

    // STEP 2 & 3 : Type 2A & 2B errors
    const result = await Type2Validations.start(
      blobHelper.stringToStream(fileData),
      context,
      errors,
      payload.processType
    );

    // Sending message to Type 2C & D
    
    const responseBody = {
      initatorApp: "contriIndex",
      contributionHeaderId: result.header_id,
    };
    const resp = await app.successResponse(responseBody);
    context.res = resp;
    context.log(
      `Validation done for correlation Id ${payload.correlationId} fqsId:${payload.fqsId}`
    );
  } catch (error) {
    if (!Array.isArray(error)) {
      context.log(
        `Something went wrong, error ${JSON.stringify(error.message)}`
      );
      const somethingError =
        CommonContributionDetails.getSomethingWentWrongError(
          "2B",
          payload.processType
        );
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

    await fqsHelper.updateFQSFinishedStatus(
      payload.fqsId,
      payload.correlationId,
      reqPayload
    );

    context.log("Sending Error data to FQS", JSON.stringify(reqPayload));


    const data = await app.mapErrorResponse(
      "",
      "",
      "CoI-0007",
      `Please check more details in FQS with ID ${payload.fqsId}`,
      "get"
    );

    const resp = await app.errorResponse(400, data);
    context.res = resp;

  }
  context.log(
    `Vaildation done for correlation Id ${payload.correlationId} fqsId: ${payload.fqsId}`
  );
};

export default httpTrigger;
