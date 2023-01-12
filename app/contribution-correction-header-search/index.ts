import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionCorrectionController } from "../controllers/contribution-correction-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails, headerFilterParams } from "../utils/constants";
import errorHandler from "../utils/errorHandler";

/**
 * 5901 API Catalogue Number
 * List of Contribution Correction Header Objects with filtering and pagination
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const queryReq = await req.body;
    const rangeParams = {};
    if (queryReq.params.startDate) {
      rangeParams["startDate"] = queryReq.params.startDate;
    }
    if (queryReq.params.endDate) {
      rangeParams["endDate"] = queryReq.params.endDate;
    }
    const filterParams = app.validateFilterParams(queryReq, headerFilterParams);
    if (app.isNullEmpty(filterParams)) {
      const data = errorHandler.mapHandleErrorResponse(
        "",
        "",
        errorDetails.CIA0502[0],
        `Posted parameters fail validation`,
        ""
      );
      const resp = await app.errorResponse(400, data);
      context.res = resp;
      return;
    }

    queryReq.params = filterParams;
    const ctrl = new ContributionCorrectionController();
    const item = await ctrl.getCorrectionHeaderByFilter(queryReq, rangeParams);
    if (item.results) {
      const resp = await app.successResponse(item);
      context.res = resp;
    } else if (item == Status.NOT_FOUND) {
      const data = errorHandler.mapHandleErrorResponse(
        "",
        "",
        404,
        `No record found for supplied params`,
        ""
      );
      const resp = await app.errorResponse(404, data);
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
