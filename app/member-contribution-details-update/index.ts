import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import errorHandler from "../utils/errorHandler";
import { errorDetails } from "../utils/constants";
import app from "../utils/app";
import Status from "../utils/config";
import { MemberContributionDetailsController } from "../controllers/member-contribution-details-controller";

//5204 API Catalogue Number
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log(
    "member-contribution-details-update function processing a request."
  );
  const payload = req.body;

  // Set default error response..
  const errorRespData = errorHandler.mapHandleErrorResponse(
    "",
    "",
    Status.FAILURE,
    Status.FAILURE_MSG,
    ""
  );
  let resp = await app.errorResponse(Status.FAILURE, errorRespData);

  // Check input payload is empty or not
  if (app.isNullEmpty(payload)) {
    const data = errorHandler.mapHandleErrorResponse(
      "",
      "",
      errorDetails.CIA0600[0],
      errorDetails.CIA0600[1],
      ""
    );
    resp = await app.errorResponse(Status.BAD_REQUEST, data);
  } else {
    try {
      const ctrl = new MemberContributionDetailsController(context);
      resp = await ctrl.updateMemberContributionDetails(payload);
    } catch (error) {
      console.log(
        "Failed :  member-contribution-details-update ",
        error?.message,
        error?.name,
        error?.moreDetails
      );
      const data = errorHandler.mapHandleErrorResponse(
        "",
        "",
        errorDetails.CIA0602[0],
        errorDetails.CIA0602[1],
        ""
      );
      resp = await app.errorResponse(Status.FAILURE, data);
    }
  }
  context.res = resp;
};

export default httpTrigger;
