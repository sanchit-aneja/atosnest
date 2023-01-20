import { Get, Put, Response, Route, Security, SuccessResponse } from "tsoa";
import Status from "../utils/config";
import app from "../utils/app";
import {
  ContributionDetails,
  ContributionHeader,
  ContributionHeaderSubmission,
} from "../models";
import { MemberContributionDetailsController } from "./member-contribution-details-controller";
import { ContributionSubmissionUpdateResponse } from "../schemas/response-schema";
import sequelize from "../utils/database";

enum NonPayReason {
  MemberOptOut = "CON16",
  NoContributionsPayable = "CON10",
  InsufficientEarnings = "CON12",
  TransferPaymentSource = "CON13",
  ChangeMemberGroupAndPay = "CON14",
  PayForPreviousAndNewGroup = "CON15",
  ChangePaymentSourceAndGroup = "CON18",
  PayMoreThanOneEnrollmentType = "CON17",
  MemberFamilyLeave = "CON02",
}

enum ScheduleMemberStatusCode {
  NoContributionsDue = "MCS9",
  ProcessingPayment = "MCS12",
  AwaitingPayment = "MCS16",
  PaymentFailed = "MCS15",
  Paid = "MCS13",
  Submitted = "MCS10",
}

@Route("/contribution")
export default class ContributionSubmissionController {
  async getContributionHeaderSubmission(submissionHeaderId: any): Promise<any> {
    try {
      const doc = await ContributionHeaderSubmission.findAll({
        where: {
          submissionHeaderId: submissionHeaderId,
        },
      });

      if (doc !== null && doc.length > 0) return doc[0];
      else return null;
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  async getContributionDetails(contribHeaderId: any): Promise<any> {
    try {
      const doc = await ContributionDetails.findAll({
        where: {
          contribHeaderId: contribHeaderId,
        },
      });

      if (doc !== null && doc.length > 0) return doc;
      else return null;
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  async getContributionDetail(contribDetailId: any): Promise<any> {
    try {
      const doc = await ContributionDetails.findOne({
        where: {
          membContribDetlId: contribDetailId,
        },
      });

      if (doc !== null) return doc;
      else return null;
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  getStatusCode(event) {
    switch (event) {
      case "submitted":
        return ScheduleMemberStatusCode.NoContributionsDue;
      case "processing payment":
        return ScheduleMemberStatusCode.ProcessingPayment;
      case "awaiting payment":
        return ScheduleMemberStatusCode.AwaitingPayment;
      case "payment failed":
        return ScheduleMemberStatusCode.PaymentFailed;
      case "Paid":
        return ScheduleMemberStatusCode.Paid;
      default:
        return ScheduleMemberStatusCode.NoContributionsDue;
    }
  }

  async updateSubmissionMember(detail: any, event) {
    try {
      let record: any = {};

      switch (detail.membNonPayReason) {
        case NonPayReason.PayForPreviousAndNewGroup:
          break;
        case NonPayReason.InsufficientEarnings:
        case NonPayReason.MemberOptOut:
          record.schdlMembStatusCd = this.getStatusCode(event);
          await ContributionDetails.update(record, {
            where: { membContribDetlId: detail.membContribDetlId },
          });
          break;
        case NonPayReason.MemberFamilyLeave:
        case NonPayReason.ChangePaymentSourceAndGroup:
        case NonPayReason.ChangeMemberGroupAndPay:
        case NonPayReason.TransferPaymentSource:
        case NonPayReason.NoContributionsPayable:
          if (detail.membContriAmt === "0.00") {
            record.schdlMembStatusCd = this.getStatusCode("Submitted");
          } else {
            record.schdlMembStatusCd = this.getStatusCode(event);
          }
          await ContributionDetails.update(record, {
            where: { membContribDetlId: detail.membContribDetlId },
          });
          break;
      }
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  /**
   * 5405 API Catalogue Number
   * Update submission members
   * @param submissionHeaderId is the Contribution Submission Header id
   * @return Returns count of submitted, members in schedule and unsubmitted.
   */
  @Security("api_key")
  @Put("submission/update-submission/{submissionHeaderId}")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async updateSubmissionMembers(
    submissionHeaderId: any,
    event: any
  ): Promise<ContributionSubmissionUpdateResponse> {
    try {
      // get the submission
      const submission = await this.getContributionHeaderSubmission(
        submissionHeaderId
      );
      const contribHeaderId = submission.contribHeaderId;

      // get the submitted details
      const memberContributionSubmissionsController =
        new MemberContributionDetailsController();
      const memberContributionSubmissions =
        await memberContributionSubmissionsController.getMemberContributionSubmission(
          submission.submissionHeaderId
        );

      for (const membercontributionsubmission of memberContributionSubmissions.results) {
        // get the member details
        const detail = await this.getContributionDetail(
          membercontributionsubmission.membContribDetlId
        );
        this.updateSubmissionMember(detail, event);
      }

      // get total members
      const contributionDetails = await this.getContributionDetails(
        contribHeaderId
      );

      const result: ContributionSubmissionUpdateResponse = {
        countSubmitted: memberContributionSubmissions.results.length,
        countMembersInSchedule: contributionDetails.length,
        countUnsubmitted:
          contributionDetails.length -
          memberContributionSubmissions.results.length,
      };

      return result;
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  //api 5406
  static async updateSubmissionStatus(params) {
    try {
      const result = await sequelize.query(`update public."File" 
      set file_status= 'and' 
      where file_id = (select file_id from 
                          public."File_Header_Map" 
                          where submission_header_id ='${params.submissionHeaderId}')`);

      return result;
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  /**
   * 5912 API Catalogue Number
   * Retrieves the Group Name list based on contribHeaderId passed.
   * @param contribHeaderId of the Contribution Header record to be fetched
   * @return Member Details list with Array<GroupName> based on contribHeaderId
   */
  @Security("api_key")
  @Get("Submission/PreCorrectionSummary/{contribHeaderId}")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async getPreCorrectionSummary(contribHeaderId: string): Promise<any> {
    try {
      let whereCdtn = {
        contrib_header_id: contribHeaderId,
        schedule_type: "CC",
      };
      return await sequelize.transaction(async (t) => {
        const headerData = await ContributionHeader.findOne({
          where: whereCdtn,
          attributes: [
            "contribHeaderId",
            "origContribHeaderId",
            "nestScheduleRef",
            "earningPeriodStartDate",
            "earningPeriodEndDate",
            "scheduleStatusCd",
            "paymentFrequency",
            "paymentFrequencyDesc",
            "paymentSourceName",
            "paymentMethod",
            "paymentMethodDesc",
            "paymentDueDate",
            "paymentPlanNo",
          ],
          transaction: t,
        });
        if (headerData) {
          const responseData = await this.mapCompleteObj(headerData);
          return {
            totalRecordCount: responseData.length,
            results: responseData,
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
   * This method used to get complete result object for pre summary correction
   * @param item
   * @returns
   */
  async mapCompleteObj(item): Promise<any> {
    try {
      let contrDetailAttr = [];
      let finalObj = {};
      let totalCurrAmt = 0;
      let totalAmt = 0;

      const membData = await this.getMemberSummary(
        item?.dataValues?.contribHeaderId
      );

      for (let membItem of membData) {
        const statusCount = await this.getMembCount(
          item?.dataValues?.contribHeaderId,
          membItem?.dataValues?.schdlMembStatusCd
        );
        let memberSummaryObj = {
          schdlMembStatusCd: membItem?.dataValues?.schdlMembStatusCd,
          statusCount: statusCount[0].count,
        };
        totalCurrAmt +=
          parseFloat(membItem.dataValues.currEmplContriAmt) +
          parseFloat(membItem.dataValues.currMembContriAmt);
        totalAmt +=
          parseFloat(membItem.dataValues.emplContriAmt) +
          parseFloat(membItem.dataValues.membContriAmt);
        contrDetailAttr.push(memberSummaryObj);
      }

      contrDetailAttr = Object.values(
        contrDetailAttr.reduce(
          (acc, cur) => Object.assign(acc, { [cur.schdlMembStatusCd]: cur }),
          {}
        )
      );
      let origNestScheduleRef = await ContributionHeader.findOne({
        where: {
          contrib_header_id: item?.dataValues?.origContribHeaderId,
        },
        attributes: ["nestScheduleRef"],
      });
      origNestScheduleRef = origNestScheduleRef
        ? origNestScheduleRef["dataValues"]["nestScheduleRef"]
        : null;
      finalObj = {
        contribHeaderId: item?.dataValues?.contribHeaderId,
        origContribHeaderId: item?.dataValues?.origContribHeaderId,
        nestScheduleRef: item?.dataValues?.nestScheduleRef,
        origNestScheduleRef: origNestScheduleRef,
        origPaymentDueDate: item?.dataValues?.paymentDueDate,
        earningsPeriodStartDate: item?.dataValues?.earningPeriodStartDate,
        earningsPeriodEndDate: item?.dataValues?.earningPeriodEndDate,
        paymentFrequency: item?.dataValues?.paymentFrequency,
        paymentFrequencyDesc: item?.dataValues?.paymentFrequencyDesc,
        paymentSourceName: item?.dataValues?.paymentSourceName,
        paymentMethod: item?.dataValues?.paymentMethod,
        paymentMethodDesc: item?.dataValues?.paymentMethodDesc,
        paymentPlanId: item?.dataValues?.paymentPlanNo,
        totContrSubmissionAmt: Number(totalCurrAmt).toFixed(2),
        ccTotContrSubmissionAmt: Number(totalAmt).toFixed(2),
        memberSummary: contrDetailAttr,
      };

      return finalObj;
    } catch (e) {
      return false;
    }
  }

  /*
   * This method should return member summary
   */
  async getMemberSummary(contribHeaderId: string): Promise<any> {
    try {
      return ContributionDetails.findAll({
        where: {
          contrib_header_id: contribHeaderId,
          member_excluded_flag: "N",
        },
        attributes: [
          "schdlMembStatusCd",
          "currEmplContriAmt",
          "currMembContriAmt",
          "emplContriAmt",
          "membContriAmt",
        ],
        group: [
          "schdlMembStatusCd",
          "currEmplContriAmt",
          "currMembContriAmt",
          "emplContriAmt",
          "membContriAmt",
        ],
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getMembCount(contribHeaderId: string, schdlMembStatusCd: string) {
    return ContributionDetails.count({
      where: {
        schdl_memb_status_cd: schdlMembStatusCd,
        contrib_header_id: contribHeaderId,
        member_excluded_flag: "N",
      },
      attributes: ["schdlMembStatusCd"],
      group: "schdlMembStatusCd",
    });
  }
}
