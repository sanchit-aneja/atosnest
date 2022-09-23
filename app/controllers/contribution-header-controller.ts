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
} from "../schemas/response-schema";
import Status from "../utils/config";
import app from "../utils/app";
import sequelize from "../utils/database";
import { headerFilterParams } from "../utils/constants";
import { Op } from "sequelize";
import * as moment from "moment";

@Route("/contribution")
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
  async getContributionHeader(
    externalScheduleRef: string
  ): Promise<ContributionHeaderResponse | any> {
    try {
      let whereCdtn = {
        external_schedule_ref: externalScheduleRef,
      };
      return await sequelize.transaction(async (t) => {
        const items = await ContributionHeader.findOne({
          where: whereCdtn,
          transaction: t,
        });
        if (items) {
          return { ContributionHeader: items.toJSON() };
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
    @Body() requestObj: HeaderFilterElements
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
          where: { schdl_memb_status_cd: "MS2" },
          attributes: ['membContribDetlId', 'employerNestId', 'nestScheduleRef', "emplContriAmt", "membContriAmt"],
          include: {
            model: ContributionHeader,
            attributes: ["nestScheduleRef", "employerNestId", 'paymentMethod', 'fileId', "contribHeaderId"],
            as: "contributionheader",
            where: { contrib_header_id: contribHeaderId },
          },
          transaction: t,
        });

        if (contrDetails) {
          let allMappedItems = await this.mapCompleteObj(contrDetails);
          const isSubmissionPresent = await this.checkSubmissionEntry(allMappedItems);
          if (isSubmissionPresent) {
            allMappedItems.submissionType = 'P';
          } else {
            allMappedItems.submissionType = 'A';
          }
          const items = await ContributionHeaderSubmission.create(allMappedItems, {
            include: [
              { association: "membercontributionsubmission", as: "membercontributionsubmission" }
            ],
            transaction: t,
          })

          const updateCountDetails = await this.updateContributionDetails(allMappedItems);
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
        })
        if (items) {
          return items;
        } else {
          return false;
        }
      })
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
          schdlMembStatusCd: 'MS4',
          updatedBy: 'System',
        };
        const items = await ContributionDetails.update(objParams, {
          where: {
            [Op.and]: [{
              nest_schedule_ref: reqObj
                ? reqObj.nestScheduleRef
                : null,
              employer_nest_id: reqObj
                ? reqObj.employerNestId
                : null,
              schdl_memb_status_cd: "MS2"
            }]
          },
          transaction: t
        })
        const allCount = await ContributionDetails.count({
          where: {
            [Op.and]: [{
              nest_schedule_ref: reqObj
                ? reqObj.nestScheduleRef
                : null,
            }, {
              employer_nest_id: reqObj
                ? reqObj.employerNestId
                : null,
            }]
          },
          transaction: t
        })

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
          createdBy: 'System'
        };
        const contrDetailAttr = [];
        let finalObj = {};
        let totalAmt = 0;
        for (let newItem of item?.rows) {
          totalAmt += parseFloat(newItem?.dataValues?.emplContriAmt) + parseFloat(newItem?.dataValues?.membContriAmt);
          let newObj = {
            membContribDetlId: newItem?.dataValues?.membContribDetlId,
            ...objParams
          }
          contrDetailAttr.push(newObj);
          finalObj = {
            membercontributionsubmission: contrDetailAttr,
            contribFileId: newItem?.dataValues?.contributionheader?.dataValues?.fileId,
            nestScheduleRef: newItem?.dataValues?.contributionheader?.dataValues?.nestScheduleRef,
            employerNestId: newItem?.dataValues?.contributionheader?.dataValues?.employerNestId,
            contribHeaderId: newItem?.dataValues?.contributionheader?.dataValues?.contribHeaderId,
            submissionType: 'A',
            submissionDate: moment().format("YYYY-MM-DD HH:mm:ss"),
            noOfMembsSubmitted: contrDetailAttr?.length,
            totContrSubmissionAmt: totalAmt,
            ...objParams
          }
        }
        return finalObj;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
