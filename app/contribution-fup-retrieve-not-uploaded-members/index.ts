import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ContributionFileUploadController } from "../controllers/contribution-file-upload";
import * as Joi from "joi";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        

        context.log('HTTP trigger function processed a request.');
        const payload = req.query;
        // const contribHeaderId = (req.query.contribHeaderId || (req.body && req.body.contribHeaderId));
        // const rejectType = (req.query.rejectType || (req.body && req.body.rejectType));
        let requestSchema = Joi.object().keys({
            contribHeaderId: Joi.string().required(),
            type: Joi.string().required().valid("NR", "EN", "NE"),
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
        //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
        const result = await ContributionFileUploadController.retrieveNotUploadedMembers(req.query); 
        if(!result.count){
            responseMessage = "No rows found";
        }else{
            responseMessage = result;
        }
        
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: responseMessage
        };
    } catch (error) {
        context.res = {
            status: 500, /* Defaults to 200 */
            body: 'Internal Server Error'
        };  
    }
};

export default httpTrigger;