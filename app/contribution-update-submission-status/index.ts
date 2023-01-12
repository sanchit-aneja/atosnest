import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import errorHandler from "../utils/errorHandler";
import { errorDetails } from "../utils/constants";
import app from "../utils/app";
import { ContributionSubmissionController } from "../controllers";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  
  try {
    context.log('HTTP trigger function processed a request.');
    // const name = (req.query.name || (req.body && req.body.name));
    const submissionHeaderId = (req.body?.submissionHeaderId);
    const fileStatus = req.body?.fileStatus;
    let validFileStatus = ["N","V","I","A","S","P","X","F","D"];
    let isFileStatusValid = validFileStatus.indexOf(fileStatus)> -1;
      if(!isFileStatusValid){
        const data = errorHandler.mapHandleErrorResponse(
            "",
            "",
            errorDetails.CIA0500[0],
            errorDetails.CIA0500[1] + " File Status",
            "get"
          );
          const resp = await app.errorResponse(400, data);
          context.res = resp;
          return;

      }
      let result = await ContributionSubmissionController.updateSubmissionStatus(req.body);
    let responseMessage;
    if(result && result[1] && result[1]["rowCount"]){
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: "ok"
      };
    }else{
      context.res = {
        status: 404, 
        body: "No rows found"
      };
    }

    
  
  } catch (error) {
    // const responseMessage = "ok";
    context.res = {
        status: 400, /* Defaults to 200 */
        body: error.message
    };
  
  }
  
};

export default httpTrigger;