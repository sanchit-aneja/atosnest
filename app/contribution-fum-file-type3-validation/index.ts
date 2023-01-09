import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Type3Validations } from "../business-logic/type3Validations";
import * as Joi from "joi";

const eventGridTrigger: AzureFunction = async function (
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

    // Step 2: vaildation Type 3
    const dataHeaderRow = await Type3Validations.getHeaderRows(
      payload.contribHeaderId
    );
    await Type3Validations.start(
      payload.contribHeaderId,
      dataHeaderRow,
      context
    );

    context.log(
      `Type 3 Validation done for contribHeaderId ${payload.contribHeaderId}`
    );
  } catch (error) {
    context.log("Error found ", context.invocationId, error.message);
  }
};

export default eventGridTrigger;
