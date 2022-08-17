import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { MemberContributionDetailsController } from "../controllers/member-contribution-details-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails, memberFilterParams } from "../utils/constants";
import errorHandler from "../utils/errorHandler";
import logger from "../utils/logger";

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
    const filterParams = app.validateFilterParams(
      queryReq,
      memberFilterParams
    );
    if (app.isNullEmpty(filterParams)) {
      const data = errorHandler.mapHandleErrorResponse(
        "",
        "",
        errorDetails.CIA0502[0],
        errorDetails.CIA0502[1] + " params",
        ""
      );
      context.res = {
        status: 400,
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      };
      return;
    }

    queryReq.params = filterParams;
    const ctrl = new MemberContributionDetailsController();
    const item = await ctrl.getDetailsByFilter(queryReq);
    if (item.results) {
      context.res = {
        status: 200,
        body: item,
        headers: {
          "Content-Type": "application/json",
        },
      };
      logger.generateLogger.info(
        Status.GET_MSG,
        { url: req.url },
        { method: "[5205] contribution-details-search" }
      );
      logger.generateLogger.debug(
        Status.GET_MSG,
        { data: item },
        { url: req.url },
        { method: "[5205] contribution-details-search" }
      );
    } else {
      const data = errorHandler.mapHandleErrorResponse(
        "",
        "",
        500,
        item.message,
        ""
      );
      context.res = {
        status: 500,
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      };
      logger.generateLogger.error(
        Status.FAILURE_MSG,
        { url: req.url },
        { request: req.body },
        { data: item.message },
        { method: "[5205] contribution-details-search" }
      );
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
    context.res = {
      status: 500,
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    };
    logger.generateLogger.error(
      Status.FAILURE_MSG,
      { data: err.message },
      { url: req.url },
      { request: req.body },
      { method: "[5205] contribution-details-search" }
    );
  }
};

export default httpTrigger;
