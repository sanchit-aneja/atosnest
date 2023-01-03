import {
  Body,
  Post,
  Put,
  Response,
  Route,
  Security,
  SuccessResponse,
} from "tsoa";
import ContributionHeader from "../models/contributionheader";
import ContributionDetails from "../models/contributionDetails";
import {
  ClearScheduleStatusResponse,
  ContributionHeaderResponse,
  OverdueScheduleFilterElements,
  SearchResultsetResponse,
} from "../schemas/response-schema";
import * as moment from "moment";
import Status from "../utils/config";
import app from "../utils/app";
import sequelize from "../utils/database";
import { Op } from "sequelize";
import { RemoveContributionScheduleRequest } from "../schemas/request-schema";
import { overdueScheduleParams } from "../utils/constants";

@Route("/contribution")
export class ContributionScheduleController {
  /**
   * 5702 API Catalogue Number
   * clear current schedule - manual entry
   * @param contribHeaderId contribHeaderId of the Member Contribution Details record to be fetched
   * @return Success
   */
  @Security("api_key")
  @Put("clearSchedule/{contribHeaderId}")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async clearContributionSchedule(
    contribHeaderId: string
  ): Promise<ClearScheduleStatusResponse | any> {
    try {
      return await sequelize.transaction(async (t) => {
        const whereCdn = {
          [Op.and]: [
            {
              contrib_header_id: contribHeaderId,
              [Op.or]: {
                schdl_memb_status_cd: ["MCS0", "MCS2", "MCS3"],
              },
            },
          ],
        };
        const items = await ContributionDetails.findAll({
          include: [
            {
              association: "contributionheader",
              attributes: ["scheduleStatusCd"],
            },
          ],
          where: whereCdn,
          transaction: t,
        });

        if (items && items.length) {
          let newObj = {
            pensEarnings: null,
            emplContriAmt: null,
            membContriAmt: null,
            membNonPayReason: null,
            membLeaveEarnings: null,
            newEmpGroupId: null,
            newGroupName: null,
            newGroupEmplContriPct: null,
            newGroupMembContriPct: null,
            newGroupPensEarnings: null,
            newGroupEmplContriAmt: null,
            newGroupMembContriAmt: null,
            optoutRefNum: null,
            optoutDeclarationFlag: null,
            newPaymentPlanNo: null,
            newPaymentSourceName: null,
            membNonPayEffDate: null,
            secEnrolmentType: null,
            secEnrolPensEarnings: null,
            secEnrolEmplContriAmt: null,
            secEnrolMembContriAmt: null,
            recordChangedFlag: "N",
            schdlMembStatusCd: "MCS1",
          };
          await ContributionDetails.update(newObj, {
            where: whereCdn,
            transaction: t,
          });
          let headerObj = {
            scheduleStatusCd: "CS2",
          };
          await ContributionHeader.update(headerObj, {
            where: { contrib_header_id: contribHeaderId },
            transaction: t,
          });
          return Status.SUCCESS;
        } else {
          return Status.FAILURE;
        }
      });
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  /**
   * 5907 API Catalogue Number
   * remove members from schedule - correction
   * @param requestObj Array of the Member Contribution Details Id Array<Contribution_Details>
   * @return Success
   */
  @Security("api_key")
  @Put("schedule/removeMembers")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async removeContributionSchedule(
    @Body() requestObj: RemoveContributionScheduleRequest
  ): Promise<any> {
    try {
      return await sequelize.transaction(async (t) => {
        const memberArr = [];
        for (let i of requestObj.contributionDetail) {
          // find the contribHeaderId from member contribution details where status should be “Draft” OR “to be reviewed” OR “attention needed” OR “ready to submit”
          const memberData = await ContributionDetails.findOne({
            where: {
              [Op.and]: [
                { memb_contrib_detl_id: i.membContribDetlId },
                {
                  [Op.or]: {
                    schdl_memb_status_cd: ["MCS0", "MCS1", "MCS2", "MCS3"],
                  },
                },
              ],
            },
            attributes: ["contribHeaderId"],
          });
          if (memberData) {
            memberArr.push(memberData["dataValues"]["contribHeaderId"]);
          } else {
            return Status.NOT_FOUND;
          }
        }
        if (app.allEqual(memberArr)) {
          //find the record from contribution header id where schedule type != CS
          const headerData = await ContributionHeader.findOne({
            where: {
              contrib_header_id: memberArr?.[0],
              schedule_type: { [Op.not]: "CS" },
            },
          });
          if (headerData) {
            //update status to MCS17 (DELETED)
            await ContributionDetails.update(
              { schdlMembStatusCd: "MCS17" },
              {
                where: {
                  contrib_header_id: memberArr?.[0],
                },
                transaction: t,
              }
            );
            return Status.SUCCESS;
          }
        } else {
          return Status.NOT_FOUND;
        }
      });
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  /**
   * 5810 API Catalogue Number
   * Retrieves a list of header with filter criterias
   * @return Contribution Header list with Array<Contribution_Header>
   */
  @Security("api_key")
  @Post("/retrieveSchedulePaymentStatus")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async getOverdueScheduleByFilter(
    @Body() requestObj: OverdueScheduleFilterElements,
    rangeParams
  ): Promise<SearchResultsetResponse<ContributionHeaderResponse> | any> {
    try {
      let element;
      element = app.mapPaymentScheduleFilterElements(
        requestObj,
        overdueScheduleParams,
        rangeParams.filter
      );

      return await sequelize.transaction(async (t) => {
        let headerData = [];
        let headerObj = {};
        for (let i of element.params) {
          let whereCdtn = {};
          if (rangeParams.filter == "OVERDUE") {
            whereCdtn = {
              [Op.and]: {
                "$ContributionHeader.schedule_status_cd$": { [Op.ne]: "CS10" },
                "$ContributionHeader.earning_period_end_date$": {
                  [Op.gte]: rangeParams.fromDate,
                },
                "$ContributionHeader.payment_due_date$": {
                  [Op.lt]: moment().format("YYYY-MM-DD"),
                },
                "$ContributionHeader.employer_nest_id$": i.employerNestId,
              },
            };
          } else if (rangeParams.filter == "DUE") {
            whereCdtn = {
              [Op.and]: {
                "$ContributionHeader.schedule_status_cd$": { [Op.ne]: "CS10" },
                "$ContributionHeader.earning_period_end_date$": {
                  [Op.gte]: rangeParams.fromDate,
                },
                "$ContributionHeader.employer_nest_id$": i.employerNestId,
              },
            };
          } else if (rangeParams.filter == "PAID") {
            whereCdtn = {
              [Op.and]: {
                "$ContributionHeader.schedule_status_cd$": { [Op.eq]: "CS10" },
                "$ContributionHeader.earning_period_end_date$": {
                  [Op.gte]: rangeParams.fromDate,
                },
                "$ContributionHeader.employer_nest_id$": i.employerNestId,
              },
            };
          } else if (rangeParams.filter == "ALL") {
            whereCdtn = {
              [Op.and]: {
                [Op.or]: {
                  "$ContributionHeader.schedule_status_cd$": {
                    [Op.ne]: "CS10",
                  },
                  "$ContributionHeader.earning_period_end_date$": {
                    [Op.gte]: rangeParams.fromDate,
                  },
                  "$ContributionHeader.payment_due_date$": {
                    [Op.lt]: moment().format("YYYY-MM-DD"),
                  },
                  "$ContributionHeader.employer_nest_id$": i.employerNestId,
                },
                [Op.or]: {
                  "$ContributionHeader.schedule_status_cd$": {
                    [Op.ne]: "CS10",
                  },
                  "$ContributionHeader.earning_period_end_date$": {
                    [Op.gte]: rangeParams.fromDate,
                  },
                  "$ContributionHeader.employer_nest_id$": i.employerNestId,
                },
                [Op.or]: {
                  "$ContributionHeader.schedule_status_cd$": {
                    [Op.eq]: "CS10",
                  },
                  "$ContributionHeader.earning_period_end_date$": {
                    [Op.gte]: rangeParams.fromDate,
                  },
                  "$ContributionHeader.employer_nest_id$": i.employerNestId,
                },
              },
            };
          }

          const { rows } = await ContributionHeader.findAndCountAll({
            limit: element.options.limit,
            offset: element.options.offset,
            order: element.options.sort,
            distinct: true,
            where: whereCdtn,
            subQuery: false,
            transaction: t,
          });
          // if (rows?.length == 0) {
          //   return Status.NOT_FOUND;
          // } else {
          headerObj = await this.mapCompleteObj(rows, i, rangeParams.filter);
          headerData.push(headerObj);
          // }
        }
        headerData = [].concat(...headerData);
        return {
          rowcount: headerData.length,
          results: headerData,
        };
      });
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  /**
   * This method used to map object to get complete schedule payment status
   * @param item
   * @returns
   */
  async mapCompleteObj(item, currval, filter): Promise<any> {
    try {
      let objParams = {};
      const contHeaderAttr = [];
      if (item && item.length > 0) {
        objParams = {
          employerNestId: currval.employerNestId,
          employerName: currval.employerName,
          status: filter,
        };

        for (let newItem of item) {
          let newObj = {
            paymentDueDate: newItem?.dataValues?.paymentDueDate,
            ...objParams,
          };
          contHeaderAttr.push(newObj);
        }
        return contHeaderAttr;
      } else {
        objParams = {
          employerNestId: currval.employerNestId,
          employerName: currval.employerName,
          status: "N/A",
          paymentDueDate: "",
        };
        let newObj = {
          ...objParams,
        };
        contHeaderAttr.push(newObj);
        return contHeaderAttr;
      }
    } catch (e) {
      return false;
    }
  }
}
