import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ContributionSubmissionUpdatesController } from "../controllers/submission-update-controller";
import { errorDetails } from "../utils/constants";
import errorHandler from "../utils/errorHandler";
import app from "../utils/app";
/**
* 5405 API Catalogue Number
* Update submission members
*/
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    
    context.log('HTTP trigger function processed a request.');
    const submissionHeaderId = (req.query.submissionHeaderId);
    const event = req.query.event;
    let validEvents = ["submitted", "awaiting payment","processing payment", "payment failed", "Paid"];
    let isEventValid = validEvents.indexOf(event)> -1;
      if(!isEventValid){
        const data = errorHandler.mapHandleErrorResponse(
            "",
            "",
            errorDetails.CIA0500[0],
            errorDetails.CIA0500[1] + "Event",
            "get"
          );
          const resp = await app.errorResponse(400, data);
          context.res = resp;    
      }
    const controller = new ContributionSubmissionUpdatesController();
    const result = await controller.updateSubmissionMembers(submissionHeaderId, event);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: result
    };

  } catch (error) {
    const data = errorHandler.mapHandleErrorResponse(
      "",
      "",
      500,
      "Something went wrong",
      "put"
    );
    const resp = await app.errorResponse(500, data);
    context.res = resp;
  }

};

export default httpTrigger;