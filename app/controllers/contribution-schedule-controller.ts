import { Put, Response, Route, Security, SuccessResponse } from "tsoa";
import ContributionHeader from "../models/contributionheader";
import ContributionDetails from "../models/contributionDetails";
import { ClearScheduleStatusResponse } from "../schemas/response-schema";
import Status from "../utils/config";
import app from "../utils/app";
import sequelize from "../utils/database";
import { Op } from "sequelize";

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
}
