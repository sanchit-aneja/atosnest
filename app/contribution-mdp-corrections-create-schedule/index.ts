import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { correctionsCreateSchedule } from "../business-logic/correctionsCreateSchedule";
import { errorDetails } from "../utils/constants";
import app from "../utils/app";
const eventGridTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("Corrections Create Schedule started: ");

  const contribHeaderId = req.params.contribHeaderId;
  const scheduleType = req.params.scheduleType;

  try {
    context.log(
      `Started Create corrections for  ${contribHeaderId} and scheduleType ${scheduleType}`
    );
    let resp;

    const headerRow = await correctionsCreateSchedule.ValidateAndGetHeaderId(
      contribHeaderId
    );

    if (!["EC", "LE", "CC"].includes(scheduleType)) {
      const data = await app.mapErrorResponse(
        "",
        "",
        errorDetails.CIA0600[0],
        errorDetails.CIA0600[1] + " Schedule Type ",
        "put"
      );
      resp = await app.errorResponse(400, data);
    } else if (!headerRow) {
      const data = await app.mapErrorResponse(
        "",
        "",
        errorDetails.CIA0600[0],
        errorDetails.CIA0600[1] + " Contribution Header Id ",
        "put"
      );
      resp = await app.errorResponse(400, data);
    } else {
      const result = await correctionsCreateSchedule.CreateSchedule(
        headerRow,
        scheduleType
      );

      resp = await app.successResponse(result);
    }
    context.res = resp;
  } catch (error) {
    context.log("Error found ", context.invocationId, error.message);
  }
};

export default eventGridTrigger;
