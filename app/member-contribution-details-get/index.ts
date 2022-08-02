import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { MemberContributionDetailsController } from "../controllers/member-contribution-details-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails } from "../utils/constants";
import errorHandler from "../utils/errorHandler";

/**
* 5202 API Catalogue Number
* Get single Member Contribution details using nestScheduleReference.
*/
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const nestScheduleRef = req.params.nestScheduleRef;
    const ctrl = new MemberContributionDetailsController();
    if (nestScheduleRef) {
      const item = await ctrl.getMemberContributionDetails(nestScheduleRef);
      if (item && item.ContributionDetail) {
        const resp = await app.successResponse(item);
        context.res = resp;
      } else if (item.name == 'SequelizeConnectionError' || item.name == "SequelizeDatabaseError") {
        const data = errorHandler.mapHandleErrorResponse(
          "",
          "",
          500,
          item.message,
          ""
        );
        const resp = await app.errorResponse(500, data);
        context.res = resp;
      } else {
        const data = errorHandler.mapHandleErrorResponse(
          "",
          "",
          errorDetails.CIA0503[0],
          errorDetails.CIA0503[1] + " Schedule Reference Number " + nestScheduleRef,
          "get"
        );
        const resp = await app.errorResponse(404, data);
        context.res = resp;
      }
    } else {
      const data = errorHandler.mapHandleErrorResponse(
        "",
        "",
        errorDetails.CIA0500[0],
        errorDetails.CIA0500[1] + " party id",
        "get"
      );
      const resp = await app.errorResponse(400, data);
      context.res = resp;
    }
  } catch (err) {
    context.log("Error found ", context.invocationId, err.message);
    const data = errorHandler.mapHandleErrorResponse(
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
