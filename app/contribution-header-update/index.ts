import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import errorHandler from "../utils/errorHandler";
import { errorDetails } from "../utils/constants";
import app from "../utils/app";
import Status from "../utils/config";
import { ContributionHeaderController } from '../controllers/contribution-header-controller';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const reqObj = req.body;
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
    if (app.isNullEmpty(reqObj)) {
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
            const ctrl = new ContributionHeaderController(context);
            resp = await ctrl.updateContributionHeader(reqObj);
        } catch (error) {
            console.log("Failed :  contribution-header-update ", error?.message, error?.name, error?.moreDetails)
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