import {
  Body,
  Get,
  Post,
  Put,
  Response,
  Route,
  Security,
  SuccessResponse,
} from "tsoa";
import ContributionHeader from "../models/contributionheader";
import ContributionDetails from "../models/contributionDetails";
import ContributionHeaderSubmission from "../models/contributionHeaderSubmission";
import {
  ContributionHeaderResponse,
  SearchResultsetResponse,
  HeaderFilterElements,
  CreateContributionResponse,
  SearchMemberContributionResultResponse,
  GetGroupNamesResponse,
} from "../schemas/response-schema";
import Status from "../utils/config";
import app from "../utils/app";
import sequelize from "../utils/database";
import {
  headerFilterParams,
  errorDetails,
  READONLY_CONTRIBUTION_HEADER_COLUMNS_FOR_UPDATE,
} from "../utils/constants";
import { Op } from "sequelize";
import * as moment from "moment";
import { Context } from "@azure/functions";
import {
  ContributionHeaderRequestDTO,
  ContributionHeaderResponseDTO,
} from "../schemas";
import {
  contributionHeaderUpdateHelper,
  ContributionHeaderUpdateError,
} from "../models";
import errorHandler from "../utils/errorHandler";

@Route("/contribution")
export class ContributionHeaderController {
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
      this._context.log("ContributionHeaderController::", ...args);
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
    @Body() requestObj: HeaderFilterElements,
    rangeParams
  ): Promise<SearchResultsetResponse<ContributionHeaderResponse> | any> {
    try {
      const element = app.mapHeaderFilterElements(
        requestObj,
        headerFilterParams,
        "CH"
      );
      let whereCdtn = {
        ...element.params,
      };

      if (rangeParams.startDate) {
        whereCdtn["$ContributionHeader.earning_period_start_date$"] = {
          [Op.gte]: rangeParams.startDate,
        };
        delete whereCdtn.startDate;
      }
      if (rangeParams.end_date) {
        whereCdtn["$ContributionHeader.earning_period_end_date$"] = {
          [Op.lt]: rangeParams.endDate,
        };
        delete whereCdtn.endDate;
      }

      return await sequelize.transaction(async (t) => {
        const { rows, count } = await ContributionHeader.findAndCountAll({
          limit: element.options.limit,
          offset: element.options.offset,
          order: element.options.sort,
          distinct: true,
          include: [
            {
              association: "rdschedulestatus",
              attributes: ["scheduleStatusDesc"],
            },
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

  /**
   * 5402 API Catalogue Number
   * Create contribution submission using contribHeaderId passed
   * @param contribHeaderId is the Contribution Header id
   * @return Returns Contribution Submission Ref and Schedule Submission Seq, count of “ready to submit” rows and a count of members.
   */
  @Security("api_key")
  @Put("submission/createsubmission/{contribHeaderId}")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async createContributionSubmission(
    contribHeaderId: string
  ): Promise<CreateContributionResponse | any> {
    try {
      return await sequelize.transaction(async (t) => {
        const contrDetails = await ContributionDetails.findAndCountAll({
          where: { schdl_memb_status_cd: "MCS2" },
          attributes: [
            "membContribDetlId",
            "employerNestId",
            "nestScheduleRef",
            "emplContriAmt",
            "membContriAmt",
          ],
          include: {
            model: ContributionHeader,
            attributes: [
              "nestScheduleRef",
              "employerNestId",
              "paymentMethod",
              "contribHeaderId",
            ],
            as: "contributionheader",
            where: { contrib_header_id: contribHeaderId },
          },
          transaction: t,
        });

        if (contrDetails) {
          let allMappedItems = await this.mapCompleteObj(contrDetails);
          const isSubmissionPresent = await this.checkSubmissionEntry(
            allMappedItems
          );
          if (isSubmissionPresent) {
            allMappedItems.submissionType = "P";
          } else {
            allMappedItems.submissionType = "A";
          }
          const items = await ContributionHeaderSubmission.create(
            allMappedItems,
            {
              include: [
                {
                  association: "membercontributionsubmission",
                  as: "membercontributionsubmission",
                },
              ],
              transaction: t,
            }
          );

          const updateCountDetails = await this.updateContributionDetails(
            allMappedItems
          );
          if (updateCountDetails && items.hasOwnProperty("dataValues")) {
            let finalCount = 0;
            if (isSubmissionPresent) {
              finalCount = contrDetails.count;
              return { items, finalCount };
            } else {
              finalCount = updateCountDetails;
              return { items, finalCount };
            }
          } else {
            return Status.FAILURE;
          }
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
   * This method used to check submission entry is already present or not
   * @param data
   * @returns
   */
  async checkSubmissionEntry(data): Promise<any> {
    try {
      return await sequelize.transaction(async (t) => {
        const items = await ContributionHeaderSubmission.findOne({
          where: { contrib_header_id: data?.contribHeaderId },
          transaction: t,
        });
        if (items) {
          return items;
        } else {
          return false;
        }
      });
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  /**
   * This method used to update contribution details schdlMembStatusCd
   * @param reqObj
   * @returns
   */
  async updateContributionDetails(reqObj): Promise<any> {
    try {
      return await sequelize.transaction(async (t) => {
        const objParams = {
          schdlMembStatusCd: "MCS10",
          updatedBy: "System",
        };
        const items = await ContributionDetails.update(objParams, {
          where: {
            [Op.and]: [
              {
                nest_schedule_ref: reqObj ? reqObj.nestScheduleRef : null,
                employer_nest_id: reqObj ? reqObj.employerNestId : null,
                schdl_memb_status_cd: "MCS2",
              },
            ],
          },
          transaction: t,
        });
        const allCount = await ContributionDetails.count({
          where: {
            [Op.and]: [
              {
                nest_schedule_ref: reqObj ? reqObj.nestScheduleRef : null,
              },
              {
                employer_nest_id: reqObj ? reqObj.employerNestId : null,
              },
            ],
          },
          transaction: t,
        });

        if (items && allCount) {
          return allCount;
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
   * This method used to map object to pass create submission
   * @param item
   * @returns
   */
  async mapCompleteObj(item): Promise<any> {
    try {
      if (app.isJSON(item)) {
        const objParams = {
          createdDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          createdBy: "System",
        };
        const contrDetailAttr = [];
        let finalObj = {};
        let totalAmt = 0;
        for (let newItem of item?.rows) {
          totalAmt +=
            parseFloat(newItem?.dataValues?.emplContriAmt) +
            parseFloat(newItem?.dataValues?.membContriAmt);
          let newObj = {
            membContribDetlId: newItem?.dataValues?.membContribDetlId,
            ...objParams,
          };
          contrDetailAttr.push(newObj);
          finalObj = {
            membercontributionsubmission: contrDetailAttr,
            nestScheduleRef:
              newItem?.dataValues?.contributionheader?.dataValues
                ?.nestScheduleRef,
            employerNestId:
              newItem?.dataValues?.contributionheader?.dataValues
                ?.employerNestId,
            contribHeaderId:
              newItem?.dataValues?.contributionheader?.dataValues
                ?.contribHeaderId,
            submissionType: "A",
            submissionDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            noOfMembsSubmitted: contrDetailAttr?.length,
            totContrSubmissionAmt: totalAmt,
            ...objParams,
          };
        }
        return finalObj;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  /**
   * 5105 API Catalogue Number
   * Update the Contribution Header
   */
  @Security("api_key")
  @Put("/contributionHeader")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async updateContributionHeader(
    @Body() requestObj: ContributionHeaderRequestDTO
  ): Promise<ContributionHeaderResponseDTO | any> {
    let allErrorsObj: Array<ContributionHeaderUpdateError> = [];
    const transaction = await sequelize.transaction();
    try {
      if (
        !(requestObj.contributionHeader instanceof Array) ||
        requestObj.contributionHeader.length === 0
      ) {
        allErrorsObj.push({
          statusCode: Status.BAD_REQUEST,
          errorCode: errorDetails.CIA0600[0],
          errorDetail: errorDetails.CIA0600[1],
        });
      } else {
        const allMemberDetailsAry = requestObj.contributionHeader;
        const length = allMemberDetailsAry.length;
        for (let index = 0; index < length; index++) {
          const currentHeaderDetails = allMemberDetailsAry[index];
          const contribHeaderId = currentHeaderDetails.contribHeaderId;
          READONLY_CONTRIBUTION_HEADER_COLUMNS_FOR_UPDATE.forEach((key) => {
            delete currentHeaderDetails[key];
          });
          allErrorsObj = await contributionHeaderUpdateHelper(
            contribHeaderId,
            currentHeaderDetails,
            index,
            allErrorsObj,
            transaction,
            this._context
          );
          if (allErrorsObj.length > 0) {
            break;
          }
        }
      }
    } catch (error) {
      let errorResp = {
        statusCode: Status.FAILURE,
        errorCode: errorDetails.CIA0602[0],
        errorDetail: errorDetails.CIA0602[1],
      };
      if (error.name == "CONTRIBUTION_HEADER_VALIDATION_FAILED") {
        errorResp = {
          statusCode: Status.BAD_REQUEST,
          errorCode: errorDetails.CIA0600[0],
          errorDetail: errorDetails.CIA0600[1],
        };
      }

      if (error.name == "SequelizeForeignKeyConstraintError") {
        errorResp = {
          statusCode: Status.BAD_REQUEST,
          errorCode: errorDetails.CIA0605[0],
          errorDetail: errorDetails.CIA0605[1],
        };
      }

      this.log(
        `updateContributionHeader is failed. Reason: ${error?.message} - ${error?.name} - ${error?.moreDetails}`
      );
      allErrorsObj.push(errorResp);
    }

    if (allErrorsObj.length === 0) {
      await transaction.commit();
      return {
        status: Status.SUCCESS,
        body: { message: "Contribution headers are updated." },
        headers: {
          "Content-Type": "application/json",
        },
      };
    } else {
      await transaction.rollback();
      const data = errorHandler.mapHandleErrorResponse(
        "",
        "",
        allErrorsObj[0].errorCode,
        allErrorsObj[0].errorDetail,
        ""
      );
      return app.errorResponse(allErrorsObj[0].statusCode, data);
    }
  }

  /**
   * 5909 API Catalogue Number
   * Retrieves the Group Name list based on contribHeaderId passed.
   * @param contribHeaderId of the Contribution Header record to be fetched
   * @return Member Details list with Array<GroupName> based on contribHeaderId
   */
  @Security("api_key")
  @Get("Submission/GetGroupsInSelection/{contribHeaderId}")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async getContributionGroupName(
    contribHeaderId: string
  ): Promise<
    SearchMemberContributionResultResponse<GetGroupNamesResponse> | any
  > {
    try {
      let whereCdtn = {
        [Op.and]: [
          {
            contrib_header_id: contribHeaderId,
          },
          {
            [Op.or]: {
              schedule_type: ["EC", "LE"],
            },
          },
          {
            [Op.or]: {
              schedule_status_cd: ["CS2", "CS3", "CS4"],
            },
          },
        ],
      };
      return await sequelize.transaction(async (t) => {
        const items = await ContributionHeader.findOne({
          where: whereCdtn,
          transaction: t,
        });
        if (items) {
          const { rows } = await ContributionDetails.findAndCountAll({
            attributes: ["groupName", "empGroupId"],
            group: ["groupName", "empGroupId"],
            distinct: true,
            where: {
              contrib_header_id: contribHeaderId,
            },
            transaction: t,
          });
          return {
            totalRecordCount: rows.length,
            results: rows,
          };
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
