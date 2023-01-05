import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import blobHelper from "../utils/blobHelper";
import {
  SaveContributionDetails,
  Type2CValidations,
  Type2DValidations,
  CommonContributionDetails,
  Type2SaveResult,
} from "../business-logic";
import { FQSHelper } from "../utils";
import { v4 as uuidv4 } from "uuid";
import * as Joi from "joi";

const eventGridTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const timeStamp = new Date().toUTCString();
  context.log(
    `${timeStamp} - Inside contribution-fum-file-type2c-d-validation function with trigger data: ${JSON.stringify(
      req.body
    )}`
  );
  const payload = req.body;

  const fqsHelper = new FQSHelper(context);
  const fileId = uuidv4();

  try {
    // Request body validation for Type 2A anb 2B
    let requestSchema = Joi.object().keys({
      correlationId: Joi.string().guid({ version: "uuidv4" }).required(),
      blobName: Joi.string().required(),
      fqsId: Joi.string().guid({ version: "uuidv4" }).required(),
      processType: Joi.string().required().valid("CS", "CC"),
      contributionHeaderId: Joi.string().guid({ version: "uuidv4" }).required(),
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
              errorDetail: `Bad request: for contribution-fum-file-type2c-d-validation error details ${reqValidationResult.error}`,
            },
          ],
        },
      };
      return; // Break here. No need go furthermore
    }

    context.log(
      `Started vaildation for correlation Id ${payload.correlationId}, fqsId:${payload.fqsId}`
    );

    // initialization of errors and update FQS
    const errors = await CommonContributionDetails.getAllErrors();

    // Step 1: get data from blob file
    const _blobServiceClient = blobHelper.getBlobServiceClient();
    const fileProperties = await blobHelper.getBlobProperties(
      payload.blobName,
      _blobServiceClient
    );
    const readStream = await blobHelper.getBlobStream(
      payload.blobName,
      _blobServiceClient,
      context
    );
    const fileData = await blobHelper.streamToString(readStream);

    // Step 2: vaildation Type 2C and File error
    await CommonContributionDetails.createFileEntry(
      fileId,
      payload.blobName,
      fileProperties,
      payload.contributionHeaderId,
      "CSU"
    ); // File type is `CSU : Contribution Schedule upload from the employer`

    await Type2CValidations.start(
      blobHelper.stringToStream(fileData),
      context,
      fileId,
      payload.contributionHeaderId,
      payload.processType,
      errors
    );

    // Step 3: vaildation Type 2D
    await Type2DValidations.start(
      blobHelper.stringToStream(fileData),
      context,
      fileId,
      payload.contributionHeaderId, //"be0d57c4-0a8c-4d7b-8af5-1cba12a9f16a",
      payload.processType,
      errors
    );

    // Update contribution member details
    const updateResult: Type2SaveResult =
      await SaveContributionDetails.updateMemberDetails(
        blobHelper.stringToStream(fileData),
        context,
        payload
      );

    if (updateResult.isFailed) {
      throw new Error(
        "Update member details failed : SaveContributionDetails.updateMemberDetails"
      );
    }

    // Sending message to Type 3
    context.res = {
      status: 200 /* Defaults to 200 */,
      body: {
        initatorApp: "contriIndex",
        fileId: fileId,
        paidMembers: updateResult.paidMembers > 0,
        newMembers: updateResult.newMembers > 0,
      },
    };

    context.log(
      `${timeStamp} - Validation done for correlation Id ${payload.correlationId}, fqsId:${payload.fqsId}`
    );
  } catch (error) {
    if (!Array.isArray(error)) {
      context.log(
        `${timeStamp} - Something went wrong, error ${JSON.stringify(
          error.message
        )}`
      );
      const somethingError =
        CommonContributionDetails.getSomethingWentWrongError(
          "2C",
          payload.processType
        );
      error = [somethingError];
    }
    // Write errors to DB and Error log file only when Type 2B passed
    await CommonContributionDetails.saveFileErrorDetails(error, fileId);

    const errorFileDownloadLink =
      await CommonContributionDetails.saveErrorLogFile(
        error,
        payload.blobName,
        fileId,
        context
      );

    // Send to FQS
    const reqPayload = CommonContributionDetails.getFQSPayloadForErrors(
      "contrib-index-sched-file-upload",
      error,
      "Type 2",
      errorFileDownloadLink,
      "contribution-fum-file-type2c-d-validation"
    );

    await fqsHelper.updateFQSFinishedStatus(
      payload.fqsId,
      payload.correlationId,
      reqPayload
    );

    context.log(
      `${timeStamp} - Sending Error data to FQS`,
      JSON.stringify(reqPayload)
    );

    // Send Error response
    context.res = {
      status: 400 /* Defaults to 200 */,
      body: {
        errors: [
          {
            errorCode: "CoI-0007",
            errorDetail: `Please check more details in FQS with ID ${payload.fqsId}`,
          },
        ],
      },
    };
  }
  context.log(
    `${timeStamp} - Type 2C & D Vaildation done for correlation Id ${payload.correlationId}`
  );
};

export default eventGridTrigger;
