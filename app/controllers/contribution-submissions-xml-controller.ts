import { Get, Response, Route, Security, SuccessResponse } from "tsoa";
import Status from "../utils/config";
import { ContributionDetails } from "../models";
import ContributionHeader from "../models/contributionheader";
import { ContributionXmlResponse } from "../schemas/response-schema";

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
   * @param contributionHeaderId is the Contribution Header id
   * @return Returns XML of contribution in either return body or file
   */
  @Security("api_key")
  @Get("submission/getxml/{contributionHeaderId}")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async generateXml(
    contributionHeaderId: any
  ): Promise<ContributionXmlResponse> {
    const contributionHeader = await ContributionHeader.findAll({
      where: {
        contribHeaderId: contributionHeaderId,
      },
    });

    const contributionDetails = await ContributionDetails.findAll({
      where: {
        contribHeaderId: contributionHeaderId,
      },
    });

    const isStreaming =
      contributionDetails.length <
      parseInt(process.env.contribution_MaxXmlLength);

    // doc = {
    //   header: contributionHeader,
    //   details: contributionDetails,
    // }

    const result: ContributionXmlResponse = {
      isStreaming: isStreaming,
      docs: [
        {
          header: contributionHeader,
          details: contributionDetails,
        },
      ],
      totalRecordCount: contributionDetails.length,
    };

    // let result: ContributionXmlResponse;
    // result.isStreaming = isStreaming;
    // result.docs = [{
    //     header: contributionHeader,
    //     details: contributionDetails,
    // }];
    // result.totalRecordCount = contributionDetails.length;

    return result;
  }
}
