import {
  Get,
  Response,
  Security,
  SuccessResponse
} from "tsoa";
import ContributionDetails from "../models/contributionDetails";
import { MemberContributionDetailsResponse } from "../schemas/response-schema";
import Status from "../utils/config";
import sequelize from "../utils/database";
import app from "../utils/app";

export class MemberContributionDetailsController {

  /**
  * 5202 API Catalogue Number
  * Retrieves the Member Contribution Details list based on scheduleReference passed.
  * @param nestScheduleReference scheduleReference of the Member Contribution Details record to be fetched
  * @return Member Contribution Details list with Array< MemberContributionDetails> based on scheduleReference
  */
  @Security("api_key")
  @Get("{nestScheduleReference}")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async getMemberContributionDetails(nestScheduleRef: string): Promise<MemberContributionDetailsResponse | any> {
    try {
      let whereCdtn = {
        nest_schedule_ref: nestScheduleRef
      };
      return await sequelize.transaction(async (t) => {
        const items = await ContributionDetails.findOne({
          where: whereCdtn,
          transaction: t
        });
        if (items) {
          return { ContributionDetail: items.toJSON() }
        } else {
          return Status.BAD_REQUEST;
        }
      });
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }
}
