import {
  Body,
  Get,
  Post,
  Response,
  Route,
  Security,
  SuccessResponse
} from "tsoa";
import ContributionHeader from "../models/contributionheader";
import { ContributionHeaderResponse, SearchResultsetResponse, FilterElements } from "../schemas/response-schema";
import Status from "../utils/config";
import app from "../utils/app";
import sequelize from "../utils/database";
import { headerFilterParams } from "../utils/constants";

@Route('/contribution')
export class ContributionHeaderController {

  /**
  * 5102 API Catalogue Number
  * Retrieves the Contribution Header list based on scheduleReference passed.
  * @param externalScheduleRef scheduleReference of the Contribution Header record to be fetched
  * @return Contribution Header list with Array< ContributionHeader> based on scheduleReference
  */
  @Security("api_key")
  @Get("{externalScheduleRef}")
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

  /**
  * 5104 API Catalogue Number
  * Retrieves a list of header with filter criterias
  * @return Contribution Header list with Array<Contribution_Header>
  */
  @Security("api_key")
  @Post("/retrievescheduleheaders")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async getHeaderByFilter(
    @Body() requestObj: FilterElements
  ): Promise<SearchResultsetResponse<ContributionHeaderResponse> | any> {
    try {
      const element = app.mapFilterElements(
        requestObj,
        headerFilterParams
      );
      let whereCdtn = {
        ...element.params,
      };
      return await sequelize.transaction(async (t) => {
        const { rows, count } = await ContributionHeader.findAndCountAll({
          limit: element.options.limit,
          offset: element.options.offset,
          order: element.options.sort,
          distinct: true,
          include: [
            { association: "rdschedulestatus", attributes: ["scheduleStatusDesc"] },
          ],
          where: whereCdtn,
          subQuery: false,
          transaction: t,
        });
        return {
          totalRecordCount: count,
          results: rows,
        };
      });
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }
}
