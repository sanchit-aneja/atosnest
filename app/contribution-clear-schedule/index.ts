import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionScheduleController } from "../controllers/contribution-schedule-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails } from "../utils/constants";

/**
 * 5702 API Catalogue Number
 * clear current schedule - manual entry
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const contribHeaderId = req.params.contribHeaderId;
    const ctrl = new ContributionScheduleController();
    if (contribHeaderId) {
      const item = await ctrl.clearContributionSchedule(contribHeaderId);
      if (item == 200) {
        const result = { clearSuccess: "True" };
        const resp = await app.successResponse(result);
        context.res = resp;
      } else if (
        item.name == "SequelizeConnectionError" ||
        item.name == "SequelizeDatabaseError"
      ) {
        const data = await app.mapErrorResponse("", "", 500, item.message, "");
        const resp = await app.errorResponse(500, data);
        context.res = resp;
      } else {
        const data = await app.mapErrorResponse(
          "",
          "",
          errorDetails.CIA0503[0],
          errorDetails.CIA0503[1] +
            ` Contribution Header Id ` +
            contribHeaderId,
          "get"
        );
        const resp = await app.errorResponse(404, data);
        context.res = resp;
      }
    } else {
      const data = await app.mapErrorResponse(
        "",
        "",
        errorDetails.CIA0500[0],
        errorDetails.CIA0500[1] + ` Contribution Header Id `,
        "get"
      );
      const resp = await app.errorResponse(400, data);
      context.res = resp;
    }
  } catch (err) {
    const data = await app.mapErrorResponse(
      "",
      "",
      500,
      Status.FAILURE_MSG,
      "get"
    );
    const resp = await app.errorResponse(500, data);
    context.res = resp;
  }
};

export default httpTrigger;
