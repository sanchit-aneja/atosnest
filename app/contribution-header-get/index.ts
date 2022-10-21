import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionHeaderController } from "../controllers/contribution-header-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails } from "../utils/constants";
import errorHandler from "../utils/errorHandler";

/**
 * 5102 API Catalogue Number
 * Get single Contribution Header using externalScheduleReference.
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const externalScheduleRef = req.params.externalScheduleRef;
    const ctrl = new ContributionHeaderController();
    if (externalScheduleRef) {
      const item = await ctrl.getContributionHeader(externalScheduleRef);
      if (item && item.ContributionHeader) {
        const resp = await app.successResponse(item);
        context.res = resp;
      } else if (item.name == "SequelizeConnectionError") {
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
          errorDetails.CIA0503[1] +
            " Schedule Reference Number " +
            externalScheduleRef,
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
