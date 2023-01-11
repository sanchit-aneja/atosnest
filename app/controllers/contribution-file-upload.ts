import { Body, Post, Response, Route, Security, SuccessResponse } from "tsoa";
import Status from "../utils/config";
import app from "../utils/app";
import blobHelper from "../utils/blobHelper";
import {
  FileUploadRequest,
} from "../schemas/request-schema";
import { ContributionHeader, StgFileMemberDetails,File as ContributionFile, FileHeaderMap } from "../models";

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
    let result = 202;
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


  static async retrieveNotUploadedMembers(params){
    try {
      const contribHeaderId = params.contribHeaderId;
      const rejectType = params.type;

      const contributionHeader = await ContributionHeader.findAll({
        where: {
          contribHeaderId: contribHeaderId,
        },
      });

      if(!contributionHeader.length){
        throw new Error('Header does not exist');
      }  

      const stageFileMembersNotUploaded = await StgFileMemberDetails.findAndCountAll({
        where: {
          // contribHeaderId: contribHeaderId
          scheduleExclusionType: rejectType,
        },
        include: [
          {
            model: ContributionFile,
            attributes:[],
            required: true,
            as: 'file',
            include:[
              {
                model: FileHeaderMap,
                attributes:[],
                required: true,
                as: 'fileheadermap',
                where:{
                  contribHeaderId: contribHeaderId,
                },
                include: [{
                  model: ContributionHeader,
                  attributes:[],
                  required: true,
                  as:'contributionheader',
                  
                }]
              }
            ]
          }
        ]
  
      })

      return stageFileMembersNotUploaded

    // Select <stg_file_member_details attributes> from stg_file_member_details stg, File fil, file_header_map fhm, contribution_header ch
    // where stg.Upload_File_Id = fil.file_id
    // and stg.reject_type = parameter (at the time of writing story this attribute not added to model so name may be different)
    // and fhm. file_id = fil.file_id
    // and fil.file_type = “CSU” (=file upload by employer)
    // and fhm.contrib_header_id = ch.contrib_header_id
    // write rows found to results and return. 
    // No rows found? return an empty set.

    } catch (error) {
      throw error;
    }
    
    

  }




}
