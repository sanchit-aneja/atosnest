import {
  Body,
  Post,
  Put,
  Response,
  Route,
  Security,
  SuccessResponse,
} from "tsoa";
import { ContributionCorrectionAddMemberRequest } from "../schemas/request-schema";
import Status from "../utils/config";
import app from "../utils/app";
import sequelize from "../utils/database";
import { Op } from "sequelize";
import { Context } from "@azure/functions";
import { ContributionDetails, ContributionHeader } from "../models";
import {
  DetailsEligibleFilterElements,
  RetriveEligibleContributionDetailsResponse,
  SearchMemberContributionResultResponse,
} from "../schemas/response-schema";
import { headerEligibleFilterParams } from "../utils/constants";

@Route("/contribution")
export class ContributionCorrectionController {
  private _context: Context;

  constructor(context?: Context) {
    if (context) {
      this._context = context;
    }
  }

  /**
   * This is helper to log kafka steps
   * @param args
   */
  private log(...args: any[]) {
    if (this._context) {
      this._context.log("ContributionCorrectionController::", ...args);
    }
  }

  /**
   * 5905 API Catalogue Number
   * Add draft members to schedule
   * @param reqObj
   * @return
   */
  @Security("api_key")
  @Put("schedule/addMembers")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async addDraftMemberSchedule(
    @Body() reqObj: ContributionCorrectionAddMemberRequest | any
  ): Promise<any> {
    try {
      return await sequelize.transaction(async (t) => {
        const mapContribHeaderId = reqObj.contribHeaderId;
        let origContribHeaderId = await ContributionHeader.findOne({
          where: {
            contribHeaderId: mapContribHeaderId,
            scheduleType: "CS",
            [Op.or]: [
              { scheduleStatusCd: "CS1" },
              { scheduleStatusCd: "CS3" },
              { scheduleStatusCd: "CS4" },
              { scheduleStatusCd: "CS13" },
            ],
          },
          attributes: ["origContribHeaderId"],
          transaction: t,
        });
        origContribHeaderId =
          origContribHeaderId["dataValues"]["origContribHeaderId"];
        if (
          !(reqObj.contributionDetail instanceof Array) ||
          reqObj.contributionDetail.length === 0 ||
          origContribHeaderId == null ||
          origContribHeaderId == undefined
        ) {
          return Status.BAD_REQUEST;
        } else {
          const allMemberDetailsAry = reqObj.contributionDetail;
          for (const element of allMemberDetailsAry) {
            const whereCdn = {
              membContribDetlId: element.membContribDetlId,
              contribHeaderId: origContribHeaderId,
              schdlMembStatusCd: "MCS13",
            };
            const item = await ContributionDetails.findOne({
              where: whereCdn,
              attributes: [
                "contribHeaderId",
                "origScheduleRef",
                "employerNestId",
                "updatedBy",
                "membNonPayReason",
                "recordEndDate",
                "createdBy",
                "recordStartDate",
                "nestScheduleRef",
                "membEnrolmentRef",
                "membPlanRef",
                "membContriDueDate",
                "empGroupId",
                "groupName",
                "schdlMembStatusCd",
                "membPartyId",
                "scmPartyId",
                "nino",
                "alternativeId",
                "autoCalcFlag",
                "newGroupMembContriAmt",
                "enrolmentType",
                "emplContriPct",
                "membContriPct",
                "firstName",
                "lastName",
                "memTaxReliefEligibility",
                "origMembNonPayReason",
              ],
              include: [
                {
                  association: "contributionheader",
                  where: {
                    contribHeaderId: origContribHeaderId,
                    [Op.and]: [
                      { scheduleStatusCd: { [Op.ne]: "CS5" } },
                      { scheduleStatusCd: { [Op.ne]: "CS6" } },
                      { scheduleStatusCd: { [Op.ne]: "CS7" } },
                      { scheduleStatusCd: { [Op.ne]: "CS8" } },
                    ],
                  },
                },
              ],
              transaction: t,
            });
            if (item) {
              const membReq = await this.mapCompleteObj(item);
              const result = await ContributionDetails.bulkCreate(membReq, {
                transaction: t,
              });
              if (result) {
                return Status.SUCCESS;
              }
            } else {
              return Status.BAD_REQUEST;
            }
          }
        }
      });
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  /**
   * 5903 API Catalogue Number
   * Fetch List of Correction Eligible Contribution details with filter criterias
   * @return Contribution Details list with Array<Contribution_Details>
   */
  @Security("api_key")
  @Post("correction/retrieveCorrectionEligibleContributionDetails")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async getCorrectionEligibleDetailsByFilter(
    @Body() requestObj: DetailsEligibleFilterElements,
    headerId
  ): Promise<
    | SearchMemberContributionResultResponse<RetriveEligibleContributionDetailsResponse>
    | any
  > {
    try {
      const element = app.mapEligibleDetailsFilterElements(
        requestObj,
        headerEligibleFilterParams,
        "EMCD"
      );
      let whereCdtn = {
        [Op.and]: [
          {
            ...element.params,
          },
          {
            [Op.or]: {
              schedule_type: ["CC", "EC"],
            },
          },
          {
            [Op.or]: {
              schedule_status_cd: ["CS1", "CS3", "CS4"],
            },
          },
        ],
      };
      return await sequelize.transaction(async (t) => {
        const headerData = await ContributionHeader.findOne({
          where: whereCdtn,
          attributes: ["origContribHeaderId"],
        });
        if (headerData) {
          const { rows, count } = await ContributionDetails.findAndCountAll({
            limit: element.options.limit,
            offset: element.options.offset,
            order: element.options.sort,
            distinct: true,
            include: [
              {
                association: "rdschedulememberstatus",
                attributes: ["schdlMembStatusDesc"],
              },
              {
                association: "rdpartcontribreason",
                attributes: ["reasonDescription"],
              },
              {
                association: "errorDetails",
                attributes: [
                  "errorLogId",
                  "errorFileId",
                  "errorTypeId",
                  "errorSequenceNum",
                  "sourceRecordId",
                  "errorCode",
                  "errorMessage",
                ],
              },
            ],
            where: {
              contrib_header_id:
                headerData["dataValues"]["origContribHeaderId"],
              schdl_memb_status_cd: "MCS13",
            },
            subQuery: false,
            transaction: t,
          });

          const membData = await ContributionDetails.findAll({
            where: {
              contrib_header_id: headerId,
            },
          });
          if (rows && membData) {
            const updatedRows = await this.mapEligibleMembers(rows, membData);
            if (updatedRows?.length > 0) {
              return {
                totalRecordCount: updatedRows.length,
                results: updatedRows,
              };
            } else {
              return Status.NOT_FOUND;
            }
          } else {
            return Status.NOT_FOUND;
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

  async mapEligibleMembers(arr1, arr2): Promise<any> {
    try {
      const intersection = arr1.filter(({ nestScheduleRef: id1 }) =>
        arr2.some(({ nestScheduleRef: id2 }) => id2 === id1)
      );

      for (let r = 0; r < arr1.length; r++) {
        arr1[r]["dataValues"]["IncludedInCorrection"] = {
          IncludedInCorrection: "",
        };
        for (let t = 0; t < intersection.length; t++) {
          if (
            intersection[t]["dataValues"]["nestScheduleRef"] ==
            arr1[r]["dataValues"]["nestScheduleRef"]
          ) {
            arr1[r]["dataValues"]["IncludedInCorrection"][
              "IncludedInCorrection"
            ] = "True";
          } else {
            arr1[r]["dataValues"]["IncludedInCorrection"][
              "IncludedInCorrection"
            ] = "False";
          }
        }
      }
      return arr1;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * This method used to map object to pass create submission
   * @param item
   * @returns
   */
  async mapCompleteObj(item): Promise<any> {
    try {
      let nestScheduleRef = await app.createNestScheduleRef(item);
      const membArr = [];
      let finalObj = {
        contribHeaderId: item["dataValues"]["contribHeaderId"],
        employerNestId: item["dataValues"]["employerNestId"],
        updatedBy: item["dataValues"]["updatedBy"],
        membNonPayReason: item["dataValues"]["membNonPayReason"],
        recordEndDate: item["dataValues"]["recordEndDate"],
        createdBy: item["dataValues"]["createdBy"],
        recordStartDate: item["dataValues"]["recordStartDate"],
        nestScheduleRef: nestScheduleRef,
        membEnrolmentRef: item["dataValues"]["membEnrolmentRef"],
        membPlanRef: item["dataValues"]["membPlanRef"],
        membContriDueDate: item["dataValues"]["membContriDueDate"],
        empGroupId: item["dataValues"]["empGroupId"],
        groupName: item["dataValues"]["groupName"],
        schdlMembStatusCd: item["dataValues"]["schdlMembStatusCd"],
        membPartyId: item["dataValues"]["membPartyId"],
        scmPartyId: item["dataValues"]["scmPartyId"],
        nino: item["dataValues"]["nino"],
        alternativeId: item["dataValues"]["alternativeId"],
        autoCalcFlag: item["dataValues"]["autoCalcFlag"],
        newGroupMembContriAmt: item["dataValues"]["newGroupMembContriAmt"],
        enrolmentType: item["dataValues"]["enrolmentType"],
        emplContriPct: item["dataValues"]["emplContriPct"],
        membContriPct: item["dataValues"]["membContriPct"],
        firstName: item["dataValues"]["firstName"],
        lastName: item["dataValues"]["lastName"],
        memTaxReliefEligibility: item["dataValues"]["memTaxReliefEligibility"],
        origMembNonPayReason: item["dataValues"]["origMembNonPayReason"],
      };
      membArr.push(finalObj);
      return membArr;
    } catch (e) {
      return false;
    }
  }
}
