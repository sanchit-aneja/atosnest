import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionSubmissionErrorsController } from "../controllers/submission-errors-controller";

/**
* 5406 API Catalogue Number
* Add external error
*/
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const controller = new ContributionSubmissionErrorsController();
    const result = await controller.createSubmissionError(req.body);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: result
    };

};

export default httpTrigger;