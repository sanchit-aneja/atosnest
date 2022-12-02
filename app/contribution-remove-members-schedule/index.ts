import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionScheduleController } from "../controllers/contribution-schedule-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails } from "../utils/constants";

/**
 * 5907 API Catalogue Number
 * remove members from schedule - correction
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const queryReq = await req.body;
    const ctrl = new ContributionScheduleController();
    if (queryReq) {
      const item = await ctrl.removeContributionSchedule(queryReq);
      if (item == 200) {
        const resp = await app.successResponse(item);
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
          ` Member_Contribution_Detail row is not found `,
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
        ` put data fails validation `,
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
