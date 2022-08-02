import {
  Get,
  Response,
  Security,
  SuccessResponse
} from "tsoa";
import ContributionHeader from "../models/contributionheader";
import { ContributionHeaderResponse } from "../schemas/response-schema";
import Status from "../utils/config";
import app from "../utils/app";
import sequelize from "../utils/database";

export class ContributionHeaderController {

  /**
  * 5102 API Catalogue Number
  * Retrieves the Contribution Header list based on scheduleReference passed.
  * @param externalScheduleReference scheduleReference of the Contribution Header record to be fetched
  * @return Contribution Header list with Array< ContributionHeader> based on scheduleReference
  */
  @Security("api_key")
  @Get("{externalScheduleReference}")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async getContributionHeader(externalScheduleRef: string): Promise<ContributionHeaderResponse | any> {
    try {
      let whereCdtn = {
        external_schedule_ref: externalScheduleRef
      };
      return await sequelize.transaction(async (t) => {
        const items = await ContributionHeader.findOne({
          where: whereCdtn,
          transaction: t
        });
        if (items) {
          return { ContributionHeader: items.toJSON() }
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
