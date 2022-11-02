import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionCorrectionController } from "../controllers/contribution-correction-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails } from "../utils/constants";

/**
* 5905 API Catalogue Number
* Add draft members to schedule
*/
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const reqObj = req.body;
    const ctrl = new ContributionCorrectionController();
    if (reqObj) {
      const item = await ctrl.addDraftMemberSchedule(reqObj);
      if (item == 200) {
        const resp = await app.successResponse(item);
        context.res = resp;
      } else if (item.name == 'SequelizeConnectionError') {
        const data = await app.mapErrorResponse("", "", 500, item.message, "");
        const resp = await app.errorResponse(500, data);
        context.res = resp;
      } else {
        const data = await app.mapErrorResponse("", "", errorDetails.CIA0503[0], errorDetails.CIA0503[1] + " Contribution Header Id " , "get");
        const resp = await app.errorResponse(404, data);
        context.res = resp;
      }
    } else {
      const data = await app.mapErrorResponse("", "", errorDetails.CIA0500[0], errorDetails.CIA0500[1] + " Contribution Header Id ", "get");
      const resp = await app.errorResponse(400, data);
      context.res = resp;
    }
  } catch (err) {
    const data = await app.mapErrorResponse("", "", 500, Status.FAILURE_MSG, "get");
    const resp = await app.errorResponse(500, data);
    context.res = resp;
  }
};

export default httpTrigger;
