import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { correctionsCreateSchedule } from "../business-logic/correctionsCreateSchedule";
import app from "../utils/app";
const eventGridTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("Corrections Create Schedule started: ");

  const contribHeaderId = req.query.ContributionHeaderId;

  try {
    context.log(`Started Create corrections for  ${contribHeaderId}`);
    let resp;

    const { headerRow, errorDetailsObject} = await correctionsCreateSchedule.ValidateAndGetHeaderId(
      contribHeaderId
    );

    if (!headerRow) {
      const data = await app.mapErrorResponse(
        "",
        "",
        errorDetailsObject.errorMessage[0],
        errorDetailsObject.errorMessage[1] + ` - Contribution Header Id: ${contribHeaderId}`,
        "put"
      );
      resp = await app.errorResponse(errorDetailsObject.errorCode, data);
    } else {
      const result = await correctionsCreateSchedule.CreateSchedule(
        headerRow,
        "CC"
      );
      resp = await app.successResponse(result);
    }

    context.res = resp;
  } catch (error) {
    context.log("Error found ", context.invocationId, error.message);
  }
};

export default eventGridTrigger;
