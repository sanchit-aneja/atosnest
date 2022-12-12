import {
  Body,
  Get,
  Put,
  Post,
  Response,
  Route,
  Security,
  SuccessResponse,
} from "tsoa";
import ContributionDetails from "../models/contributionDetails";
import MemberContributionSubmission from "../models/memberContributionSubmission";
import {
  DetailsFilterElements,
  MemberContributionDetailsResponse,
  SearchResultsetResponse,
  SearchMemberContributionResultResponse,
  RetriveContributionDetailsResponse,
} from "../schemas/response-schema";
import {
  contributionDetailsUpdateHelper,
  ContributionDetailsUpdateError,
} from "../models";
import Status from "../utils/config";
import sequelize from "../utils/database";
import app from "../utils/app";
import {
  ContributionDetailsRequestDTO,
  ContributionDetailsResponseDTO,
} from "../schemas";
import { Context } from "@azure/functions";
import {
  memberFilterParams,
  errorDetails,
  READONLY_CONTRIBUTION_DETAILS_COLUMNS_FOR_UPDATE,
  CONTR_MEMBER_DETAILS,
} from "../utils/constants";
import errorHandler from "../utils/errorHandler";

@Route("/contribution")
export class MemberContributionDetailsController {
  private _context: Context;

  constructor(context?: Context) {
    if (context) {
      this._context = context;
    }
    this.log(`MemberContributionDetailsController is created`);
  }

  /**
   * This is helper to log kafka steps
   * @param args
   */
  private log(...args: any[]) {
    if (this._context) {
      this._context.log("MemberContributionDetailsController::", ...args);
    }
  }

  /**
   * 5205 API Catalogue Number
   * Retrieves a list of details with filter criterias
   * @return Contribution Details list with Array<Contribution_Details>
   */
  @Security("api_key")
  @Post("/retrieveContributionDetails")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async getDetailsByFilter(
    @Body() requestObj: DetailsFilterElements
  ): Promise<
    | SearchMemberContributionResultResponse<RetriveContributionDetailsResponse>
    | any
  > {
    try {
      const element = app.mapDetailsFilterElements(
        requestObj,
        memberFilterParams,
        "MCD"
      );
      let whereCdtn = {
        ...element.params,
      };
      return await sequelize.transaction(async (t) => {
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
          where: whereCdtn,
          subQuery: false,
          transaction: t,
        });
        if (rows?.length > 0) {
          return {
            totalRecordCount: count,
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

  /**
   * 5204 API Catalogue Number
   * Update the Contribution Details
   */
  @Security("api_key")
  @Put("/contributionDetails")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async updateMemberContributionDetails(
    @Body() requestObj: ContributionDetailsRequestDTO
  ): Promise<ContributionDetailsResponseDTO | any> {
    this.log(`Update payload is validating...`);
    //Check Payload is having contributionDetail array and having items
    let allErrors: Array<ContributionDetailsUpdateError> = [];
    const transaction = await sequelize.transaction();
    try {
      if (
        !(requestObj.contributionDetail instanceof Array) ||
        requestObj.contributionDetail.length === 0
      ) {
        this.log("contributionDetail array is empty");
        allErrors.push({
          statusCode: Status.BAD_REQUEST,
          errorCode: errorDetails.CIA0600[0],
          errorDetail: errorDetails.CIA0600[1],
        });
      } else {
        const allMemberDetailsAry = requestObj.contributionDetail;
        const length = allMemberDetailsAry.length;

        // Update member details one by one
        for (let index = 0; index < length; index++) {
          const currentMemberDetails = allMemberDetailsAry[index];
          const membContribDetlId = currentMemberDetails.membContribDetlId;

          // Delete other readonly properties
          READONLY_CONTRIBUTION_DETAILS_COLUMNS_FOR_UPDATE.forEach((key) => {
            delete currentMemberDetails[key];
          });
          allErrors = await contributionDetailsUpdateHelper(
            membContribDetlId,
            currentMemberDetails,
            index,
            allErrors,
            transaction,
            this._context
          );
          if (allErrors.length > 0) {
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
      if (error.name == "CONTRIBUTION_DETAILS_VALIDATION_FAILED") {
        errorResp = {
          statusCode: Status.BAD_REQUEST,
          errorCode: errorDetails.CIA0600[0],
          errorDetail: errorDetails.CIA0600[1],
        };
      }
      this.log(
        `updateMemberContributionDetails is failed. Reason: ${error?.message} - ${error?.name} - ${error?.moreDetails}`
      );
      allErrors.push(errorResp);
    }

    if (allErrors.length === 0) {
      this.log("Success: No Error present, updates are commiting.");
      await transaction.commit();
      return {
        status: Status.SUCCESS /* Defaults to 200 */,
        body: { message: "Contribution Details are updated." },
        headers: {
          "Content-Type": "application/json",
        },
      };
    } else {
      this.log("Error: Updates are rollbacking.");
      await transaction.rollback();
      const data = errorHandler.mapHandleErrorResponse(
        "",
        "",
        allErrors[0].errorCode,
        allErrors[0].errorDetail,
        ""
      );
      return app.errorResponse(allErrors[0].statusCode, data);
    }
  }

  /**
   * 5404 API Catalogue Number
   * Retrieves returns a list of all Member Contribution Submissions based on contribSubmissionRef passed.
   * @param contribSubmissionRef contribSubmissionRef of the Member Contribution Submission record to be fetched
   * @return Member Contribution Submission list with reason code based on contribSubmissionRef
   */
  @Security("api_key")
  @Get("/Submission/MemberContributionSubmissions/{contribSubmissionRef}")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async getMemberContributionSubmission(
    contribSubmissionRef: string
  ): Promise<SearchResultsetResponse<MemberContributionDetailsResponse> | any> {
    try {
      let whereCdtn = {
        contrib_submission_ref: contribSubmissionRef,
      };
      return await sequelize.transaction(async (t) => {
        const { rows, count } =
          await MemberContributionSubmission.findAndCountAll({
            distinct: true,
            include: [
              {
                association: "contributiondetails",
                attributes: CONTR_MEMBER_DETAILS,
              },
            ],
            where: whereCdtn,
            subQuery: false,
            transaction: t,
          });

        if (rows?.length > 0) {
          const mappedItems = await this.mapCreateCompleteObj(rows);
          return {
            totalRecordCount: count,
            results: mappedItems,
          };
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
   * This method used to map object to get complete return object for member submission
   * @param item
   * @returns
   */
  async mapCreateCompleteObj(item) {
    try {
      if (app.isJSON(item)) {
        let results = [];
        for (let newItem of item) {
          let contDetails =
            newItem?.dataValues?.contributiondetails?.dataValues;
          let subObj = {
            ...contDetails,
            contribSubmissionRef: newItem?.dataValues?.contribSubmissionRef,
            createdBy: newItem?.dataValues?.createdBy,
            createdDate: newItem?.dataValues?.createdDate,
            membContribDetlId: newItem?.dataValues?.membContribDetlId,
            membSubmId: newItem?.dataValues?.membSubmId,
          };
          results.push(subObj);
        }
        return results;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
