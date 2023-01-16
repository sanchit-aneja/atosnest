import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionScheduleController } from "../controllers/contribution-schedule-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails } from "../utils/constants";
import errorHandler from "../utils/errorHandler";

/**
 * 5810 API Catalogue Number
 * List of Contribution Overdue Schedule Objects with filtering and pagination
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const queryReq = await req.body;
    const rangeParams = {};
    if (queryReq?.searchOptions?.filter) {
      rangeParams["filter"] = queryReq.searchOptions.filter;
    }
    if (queryReq?.searchOptions?.fromDate) {
      rangeParams["fromDate"] = queryReq.searchOptions.fromDate;
    }

    if (app.isNullEmpty(queryReq)) {
      const data = errorHandler.mapHandleErrorResponse(
        "",
        "",
        errorDetails.CIA0502[0],
        errorDetails.CIA0502[1] + " params",
        ""
      );
      const resp = await app.errorResponse(400, data);
      context.res = resp;
      return;
    }

    const ctrl = new ContributionScheduleController();
    const item = await ctrl.getOverdueScheduleByFilter(queryReq, rangeParams);
    if (item.results) {
      const resp = await app.successResponse(item);
      context.res = resp;
    } else {
      const data = errorHandler.mapHandleErrorResponse(
        "",
        "",
        500,
        item.message,
        ""
      );
      const resp = await app.errorResponse(500, data);
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
