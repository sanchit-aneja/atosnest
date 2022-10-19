import app from "../utils/app";
import ContributionHeader from '../models/contributionheader';
import { ContributionHeaderSubmission } from '../models';
import FileHeaderMap from "../models/fileheadermap";
import { File } from "../models";
import ErrorDetails from "../models/errorDetails";
import { MemberContributionDetailsController } from './member-contribution-details-controller';

export class ContributionSubmissionErrorsController {

  async getContributionHeaderSubmission(contributionSubmissionId: any): Promise<any> {
    try {
      const doc = await ContributionHeaderSubmission.findAll({
        where: {
          submissionHeaderId: contributionSubmissionId,
        },
      });

      if (doc !== null && doc.length > 0)
        return doc[0];
      else
        return null;

    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  async getFile(submissionHeaderId: any): Promise<any> {
    try {
      const doc = await FileHeaderMap.findAll({
        where: {
          submissionHeaderId: submissionHeaderId,
        },
      });

      if (doc !== null && doc.length > 0) {
        return doc[0];
      }
      else
        return null;

    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  async createSubmissionError(params: any): Promise<any> {
    try {
      let errorDetails = [];

      // Get submission record for supplied contribution header ID
      const contributionSubmission = await this.getContributionHeaderSubmission(params.contributionSubmissionId);

      // Get member contribution detail ID
      const memberContributionSubmissionsController = new MemberContributionDetailsController();
      const memberContributionSubmissions = await memberContributionSubmissionsController.getMemberContributionSubmission(params.contributionSubmissionId);
      memberContributionSubmissions.results.forEach(result => {
        errorDetails.push({
          membContribDetlId: result.membContribDetlId
        });
      });

      // Get file ID from header Map
      const fileMap = await this.getFile(contributionSubmission.submissionHeaderId);
      errorDetails.forEach(async (errorDetail) => {
        errorDetail.errorFileId = fileMap.fileId;
        errorDetail.errorCode = params.errorCode;
        errorDetail.errorMessage = params.payload;
        errorDetail.errorType = params.payloadType;
        errorDetail.errorSequenceNum = 0;

      });
      
      // Create error records
      // await ErrorDetails.bulkCreate(errorDetails);
      await ErrorDetails.create(errorDetails[0]);


      // Return
      return errorDetails;
      
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }


}