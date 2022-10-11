import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { MemberContributionDetailsController } from "../controllers/member-contribution-details-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails } from "../utils/constants";
import errorHandler from "../utils/errorHandler";

/**
* 5404 API Catalogue Number
* returns a list of all Member Contribution Submissions with detailed attributes
*/
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const contribSubmissionRef = req.params.contribSubmissionRef;
    const ctrl = new MemberContributionDetailsController();
    if (contribSubmissionRef) {
      const item = await ctrl.getMemberContributionSubmission(contribSubmissionRef);
      if (item && item.totalRecordCount > 0) {
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
          errorDetails.CIA0503[1] + " Submission Reference Number " + contribSubmissionRef,
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
        errorDetails.CIA0500[1] + " Submission Reference Number",
        "get"
      );
      const resp = await app.errorResponse(400, data);
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
