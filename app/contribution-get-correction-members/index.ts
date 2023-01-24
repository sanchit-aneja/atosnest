import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import app from "../utils/app";
import { errorDetails } from "../utils/constants";
import errorHandler from "../utils/errorHandler";
import { MemberContributionDetailsController } from "../controllers/member-contribution-details-controller";
import Status from "../utils/config";
import * as Joi from "joi";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    let params;
    try {
      const queryReq = await req.body;
      context.log('HTTP trigger function processed a request.');
      
      params = req.body.params;
      
      let requestSchema = Joi.object().keys({
        contribHeaderId: Joi.string().guid({ version: "uuidv4" }).required(),
        });
        const reqValidationResult = requestSchema.validate(params);
  
      if (reqValidationResult.error) {
        context.log(`Bad request ${reqValidationResult.error}`);
        context.res = {
          status: 400 /* Defaults to 200 */,
          body: {
            errors: [
              {
                errorCode: "CoI-0006",
                errorDetail: `Contribution header is either not present or it is incorrect`,
              },
            ],
          },
        };
        return; // Break here. No need go furthermore
      }

      const ctrl = new MemberContributionDetailsController();
      const item = await ctrl.getCorrectionMembersDetailsByFilter(queryReq);
      if (item.results) {
        const resp = await app.successResponse(item);
        context.res = resp;
      } else if (item.name == "SequelizeConnectionError") {
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
          errorDetails.CIA0503[1] +
            "No correction Records found for provided Contribution header Id" + req.body.contribHeaderId,
          "get"
        );
        const resp = await app.errorResponse(404, data);
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