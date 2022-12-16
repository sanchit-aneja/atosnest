import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ContributionSubmissionUpdatesController } from "../controllers/submission-update-controller";

/**
* 5405 API Catalogue Number
* Update submission members
*/
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const submissionHeaderId = (req.query.submissionHeaderId);
    const event = req.query.event;
    let validEvents = ["submitted", "awaiting payment","processing payment", "payment failed", "Paid"];
    let isEventValid = validEvents.indexOf(event)=== -1;
      if(isEventValid){
       throw new Error("Invalid Event") 
      }
    const controller = new ContributionSubmissionUpdatesController();
    const result = await controller.updateSubmissionMembers(submissionHeaderId, event);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: result
    };


};

export default httpTrigger;