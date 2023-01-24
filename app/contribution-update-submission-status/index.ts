import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import errorHandler from "../utils/errorHandler";
import { errorDetails } from "../utils/constants";
import app from "../utils/app";
import { ContributionSubmissionController } from "../controllers";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  
  try {
    context.log('HTTP trigger function processed a request.' + JSON.stringify(req.body));
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

      if(result && result[1] && result[1]["rowCount"]){
      
      const result = "ok";
      const resp = await app.successResponse(result);
      context.res = resp;
    }else{
     
      const data = await app.mapErrorResponse("", "", 404, "No rows found", "");
      const resp = await app.errorResponse(404, data);
      context.res = resp;
    
    }
  
  } catch (error) {

    const data = await app.mapErrorResponse("", "", 400, error.message, "");
    const resp = await app.errorResponse(400, data);
    context.res = resp;  
  }
  
};

export default httpTrigger;