import { Get, Response, Route, Security, SuccessResponse } from "tsoa";
import Status from "../utils/config";
import { ContributionDetails } from "../models";
import ContributionHeader from "../models/contributionheader";

@Route("/contribution")
export class ContributionSubmissionsXmlController {
  async getContributionHeader(id: any): Promise<any> {
    const doc = await ContributionHeader.findAll({
      where: {
        contribHeaderId: id,
      },
    });

    return doc;
  }

  /**
   * 5401 API Catalogue Number
   * Get XML of contribution in either return body or file
   * @param id is the Contribution Header id
   * @return Returns XML of contribution in either return body or file
   */
  @Security("api_key")
  @Get("submission/{contributionHeaderId}")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async generateXml(id: any): Promise<any> {
    let doc = {};

    const contributionHeader = await ContributionHeader.findAll({
      where: {
        contribHeaderId: id,
      },
    });

    const contributionDetails = await ContributionDetails.findAll({
      where: {
        contribHeaderId: id,
      },
    });

    const isStreaming =
      contributionDetails.length <
      parseInt(process.env.contribution_MaxXmlLength);

    doc = {
      header: contributionHeader,
      details: contributionDetails,
    };

    const result = {
      isStreaming: isStreaming,
      doc: doc,
      totalRecordCount: contributionDetails.length,
    };

    return result;
  }
}
