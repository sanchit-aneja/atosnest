import { Body, Post, Response, Route, Security, SuccessResponse } from "tsoa";
import Status from "../utils/config";
import app from "../utils/app";
import blobHelper from "../utils/blobHelper";
import {
  FileUploadRequest,
} from "../schemas/request-schema";

@Route("/contribution")
export class ContributionFileUploadController {
  /**
   * 5802 API Catalogue Number
   * File upload monitor with virus check
   * @param params contain the file upload details
   * @return Returns OK status.
   */
  @Security("api_key")
  @Post("fileUpload/")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async fileUpload(@Body() params: FileUploadRequest): Promise<any> {
    let result = 200;
    try {
      // get blob
      const container = process.env.contribution_BlobContainerName;
      const blobServiceClient = blobHelper.getBlobServiceClient();
      const containerClient = blobServiceClient.getContainerClient(container);
      
      // get scan results
      const blobName = params.documentName;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const tags = await blockBlobClient.getTags();
  
      const scanResult = tags.tags["fss-scan-result"];
      console.log(scanResult);
      // process failure and success topic

      // Return
      return result;
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }
}
