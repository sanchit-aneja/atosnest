import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Type3Validations } from "../business-logic/type3Validations";
import app from "../utils/app";
import { FQSHelper } from "../utils";
import { fqsStage, fqsStatus } from "../utils/fqsBody";
import * as Joi from "joi";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const timeStamp = new Date().toUTCString();
  context.log(
    `${timeStamp} - Inside contribution-fum-file-type3-validation function with trigger data: ${JSON.stringify(
      req.body
    )}`
  );
  const payload = req.body;

  try {
    // Request body validation for Type 2A anb 2B
    let requestSchema = Joi.object().keys({
      correlationId: Joi.string().guid({ version: "uuidv4" }).required(),
      blobName: Joi.string().required(),
      fqsId: Joi.string().guid({ version: "uuidv4" }).required(),
      processType: Joi.string().required().valid("CS", "CC"),
      contributionHeaderId: Joi.string().guid({ version: "uuidv4" }).required(),
      fileId: Joi.string().guid({ version: "uuidv4" }).required(),
      paidMembers: Joi.boolean().required(),
      newMembers: Joi.boolean().required(),
    });
    const reqValidationResult = requestSchema.validate(payload);
    const fqsHelper = new FQSHelper(context);
    if (reqValidationResult.error) {
      context.log(`Bad request ${reqValidationResult.error}`);
      context.res = {
        status: 400 /* Defaults to 200 */,
        body: {
          errors: [
            {
              errorCode: "CoI-0006",
              errorDetail: `Bad request: for contribution-fum-file-type3-validation error details ${reqValidationResult.error}`,
            },
          ],
        },
      };
      return; // Break here. No need go furthermore
    }

    context.log(
      `Started Type 3 vaildation for contribHeaderId  ${payload.contribHeaderId}`
    );
    const contribHeaderId = payload.contributionHeaderId;
    // Step 2: vaildation Type 3
    const fqsBody = fqsHelper.getFQSBody(
      payload.fqsId,
      payload.blobName,
      fqsStage.TYPE3,
      fqsStatus.INPROGRESS
    );

    await fqsHelper.updateFQSProcessingStatus(
      payload.fqsId,
      payload.correlationId,
      fqsBody
    );
    const dataHeaderRow = await Type3Validations.getHeaderRows(contribHeaderId);
    if (dataHeaderRow == null) {
      context.res = {
        status: 404,
        body: {
          errors: [
            {
              errorCode: "CIA-0503",
              errorDetail: "Unique reference does not exists",
            },
          ],
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
    } else {
      // Step 2: vaildation Type 3

      const { totalTobeReviewed } = await Type3Validations.start(
        contribHeaderId,
        dataHeaderRow,
        context
      );
      let data;
      if (totalTobeReviewed > 0) {
        data = {
          initatorApp: "contriIndex",
          status: "Type 3 Found",
        };
      } else {
        data = {
          initatorApp: "contriIndex",
          status: "Type 3 not Found",
        };
        const fqsBody = fqsHelper.getFQSBody(
          payload.fqsId,
          payload.blobName,
          fqsStage.TYPE3,
          fqsStatus.COMPLETED
        );

        await fqsHelper.updateFQSFinishedStatus(
          payload.fqsId,
          payload.correlationId,
          fqsBody
        );
      }

      const resp = await app.successResponse(data);
      context.res = resp;
    }
  } catch (error) {
    context.log("Error found ", context.invocationId, error.message);
  }
};

export default httpTrigger;
