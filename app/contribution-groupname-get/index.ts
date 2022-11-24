import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionHeaderController } from "../controllers/contribution-header-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails } from "../utils/constants";

/**
 * 5909 API Catalogue Number
 * Get Group Name using contribHeaderId.
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const contribHeaderId = req.params.contribHeaderId;
    const ctrl = new ContributionHeaderController();
    if (contribHeaderId) {
      const item = await ctrl.getContributionGroupName(contribHeaderId);
      if (item && item.results) {
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
          `No suitable record found for Contribution Header Id ` +
            contribHeaderId,
          "get"
        );
        const resp = await app.errorResponse(404, data);
        context.res = resp;
      }
    }
  } catch (err) {
    const data = await app.mapErrorResponse(
      "",
      "",
      500,
      Status.FAILURE_MSG,
      ""
    );
    const resp = await app.errorResponse(500, data);
    context.res = resp;
  }
};

export default httpTrigger;
