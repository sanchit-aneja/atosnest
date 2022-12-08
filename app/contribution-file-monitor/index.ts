import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionFileUploadController } from "../controllers/contribution-file-upload";

/**
 * 5802 API Catalogue Number
 * File upload monitor with virus check
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const payload = req.body;

  const controller = new ContributionFileUploadController();
  const status = await controller.fileUpload(payload);

  context.res = {
    status: status,
  };
};

export default httpTrigger;
