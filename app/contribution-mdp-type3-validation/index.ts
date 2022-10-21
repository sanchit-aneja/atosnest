import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Type3Validations } from "../business-logic/type3Validations";
import app from "../utils/app";
const eventGridTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("Type 3 validation started: ");

  const contribHeaderId = req.params.contribHeaderId;
  try {
    context.log(
      `Started Type 3 vaildation for contribHeaderId  ${contribHeaderId}`
    );

    // Step 2: vaildation Type 3
    const { errorIds, sucessIds } = await Type3Validations.start(
      contribHeaderId,
      context
    );
    const data = {
      number_of_rows_in_Requires_Attention: errorIds ? errorIds.length : 0,
      number_of_rows_ready_to_submit: sucessIds ? sucessIds.length : 0,
    };
    const resp = await app.successResponse(data);
    context.res = resp;
  } catch (error) {
    context.log("Error found ", context.invocationId, error.message);
  }
};

export default eventGridTrigger;
