import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ContributionFileUploadController } from "../controllers/contribution-file-upload";
import * as Joi from "joi";
import app from "../utils/app";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  let payload;  
  try {
        context.log('HTTP trigger function processed a request.');
        payload = req.query;
        let requestSchema = Joi.object().keys({
            contribHeaderId: Joi.string().required(),
            Type: Joi.string().required().valid("NR", "EN", "NE"),
          });
        const reqValidationResult = requestSchema.validate(payload);

          if (reqValidationResult.error) {
            context.log(`Bad request ${reqValidationResult.error}`);
            context.res = {
              status: 400 /* Defaults to 200 */,
              body: {
                errors: [
                  {
                    errorCode: "CoI-0006",
                    errorDetail: `Bad request: for contribution-fum-retrieve not uploaded values error details ${reqValidationResult.error}`,
                  },
                ],
              },
            };
            return; // Break here. No need go furthermore
          }
        let responseMessage;
        const result = await ContributionFileUploadController.retrieveNotUploadedMembers(req.query); 
        if(!result.count){
            responseMessage = [];
        }else{
            responseMessage = result;
        }
        
        context.res = {
            body: responseMessage
        };
    } catch (error) {

      const data = await app.mapErrorResponse("", "", 400, "Internal Server Error", "");
      const resp = await app.errorResponse(400, data);
      context.res = resp;
      
    }
};

export default httpTrigger;