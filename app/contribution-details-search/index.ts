import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { MemberContributionDetailsController } from "../controllers/member-contribution-details-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails, memberFilterParams } from "../utils/constants";
import errorHandler from "../utils/errorHandler";

/**
 * 5205 API Catalogue Number
 * List of Contribution details Objects with filtering and pagination
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const queryReq = await req.body;
    const rangeParams = {};
    if (queryReq.params.schdlMembStatusCd) {
      rangeParams["schdlMembStatusCd"] = queryReq.params.schdlMembStatusCd;
    }
    const filterParams = app.validateFilterParams(queryReq, memberFilterParams);
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
    const ctrl = new MemberContributionDetailsController();
    const item = await ctrl.getDetailsByFilter(queryReq, rangeParams);
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
          " No Records Found for Nest Schedule Ref & Employer Nest Id",
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
