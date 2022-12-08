import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionCorrectionController } from "../controllers/contribution-correction-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails, headerEligibleFilterParams } from "../utils/constants";
import errorHandler from "../utils/errorHandler";

/**
 * 5903 API Catalogue Number
 * Fetch List of Correction Eligible Contribution details Objects with filtering and pagination
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const queryReq = await req.body;
    const filterParams = app.validateFilterParams(
      queryReq,
      headerEligibleFilterParams
    );
    const headerId = queryReq?.params?.contribHeaderId;
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
    const ctrl = new ContributionCorrectionController();
    const item = await ctrl.getCorrectionEligibleDetailsByFilter(
      queryReq,
      headerId
    );
    if (item.results) {
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
          "  No record found for contribution header id ",
        "get"
      );
      const resp = await app.errorResponse(404, data);
      context.res = resp;
    }
  } catch (err) {
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
