import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionHeaderController } from "../controllers/contribution-header-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails, headerFilterParams } from "../utils/constants";
import errorHandler from "../utils/errorHandler";

/**
 * 5104 API Catalogue Number
 * List of Contribution Header Objects with filtering and pagination
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const queryReq = await req.body;
    const filterParams = app.validateFilterParams(
      queryReq,
      headerFilterParams
    );
    if (app.isNullEmpty(filterParams)) {
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

    queryReq.params = filterParams;
    const ctrl = new ContributionHeaderController();
    const item = await ctrl.getHeaderByFilter(queryReq);
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
