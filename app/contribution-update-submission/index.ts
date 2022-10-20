import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ContributionSubmissionUpdatesController } from "../controllers/submission-update-controller";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const submissionRef = (req.params.submissionRef);
    const controller = new ContributionSubmissionUpdatesController();
    const result = await controller.updateSubmissionMembers(submissionRef);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: result
    };


};

export default httpTrigger;