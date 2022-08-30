import sequelize from "./database";
import { CustomError } from "../Errors";
import { ContributionDetails, ContributionHeader, StgContrSchedule } from "../models";
import * as moment from "moment";
import app from "./app";

const normalisation = {

  createContributionHeader: async function (context, fileId): Promise<any> {
    try {
      return await sequelize.transaction(async (t) => {
        const { rows, count } = await StgContrSchedule.findAndCountAll();
        const finalData = this.mappingContributionHeader(rows, fileId);
        if (finalData) {
          const item = await ContributionHeader.bulkCreate(finalData, {
            validate: true,
            transaction: t
          });
          if (item && item.length) {
            return { count: count };
          }
        }
      })
    } catch (error) {
      context.log("normalisation::moveDataToContributionHeader::", error)
      throw new CustomError("BULK_INSERT_CONTRIBUTION_HEADER_FAILED", `${error?.name - error?.message - error?.moreDetails}`);
    }
  },

  createContributionDetails: async function (context) {
    try {
      return await sequelize.transaction(async (t) => {
        const rows = await ContributionHeader.findAll({
          attributes: ["nestScheduleRef", "earningPeriodEndDate", "employerNestId"],
          include: [
            { association: "stgcontrmember", attributes: ["membershipId", "planReference", "category", "crmPartyId", "cmPartyId", "nino", "schemePayrollReference", "pensionableSalary", "reasonCode"] },
          ],
        });
        const finalData = this.mappingContributionDetails(rows);
        if (finalData) {
          await ContributionDetails.bulkCreate(finalData, {
            validate: true,
            transaction: t
          });
        }
      })
    } catch (error) {
      context.log("normalisation::moveDataToMemberContributionDetails::", error)
      throw new CustomError("BULK_INSERT_MEMBER_CONTRIBUTION_DETAILS_FAILED", `${error?.name - error?.message - error?.moreDetails}`);
    }
  },

  mappingContributionHeader(request, fileId): any {
    try {
      let results = [];
      let currentCount = 0;
      let nestScheduleRef;
      let mopType;
      Object.entries(request).forEach(([key, value]: any) => {
        let count = app.checkEmployerNestId(request, (value._previousDataValues.groupSchemeID).trim());
        if (value._previousDataValues?.mopType == "DD") {
          mopType = app.getLastThreeChars((value._previousDataValues?.payReference).trim());
        } else {
          mopType = value._previousDataValues?.mopType;
        }

        if (count <= 1) {
          nestScheduleRef = 'CS' + (value._previousDataValues.premFrequency).trim() + moment(value._previousDataValues.endDate).format("DDMMYY") + app.addLeadingZeros(count + 1, 2) + mopType;
        }
        else {
          currentCount++;
          nestScheduleRef = 'CS' + (value._previousDataValues.premFrequency).trim() + moment(value._previousDataValues.endDate).format("DDMMYY") + app.addLeadingZeros(currentCount, 2) + mopType;
        }
        let params = {};
        params = {
          fileId: fileId,
          nestScheduleRef: nestScheduleRef,
          externalScheduleRef: value._previousDataValues.scheduleReference,
          scheduleType: value._previousDataValues.scheduleType,
          scheduleStatusCd: 'CS1',
          scheduleGenerationDate: value._previousDataValues.effectiveDate,
          employerNestId: value._previousDataValues.groupSchemeID,
          subSchemeId: value._previousDataValues.subSchemeId,
          earningPeriodStartDate: value._previousDataValues.startDate,
          earningPeriodEndDate: value._previousDataValues.endDate,
          paymentPlanNo: value._previousDataValues.paymentPlanNo,
          paymentRef: value._previousDataValues.payReference,
          paymentSourceName: value._previousDataValues.paymentSourceName || 'paymentSourceName',
          paymentMethod: value._previousDataValues.mopType,
          paymentMethodDesc: value._previousDataValues.mopTypeDesc,
          paymentFrequency: value._previousDataValues.premFrequency,
          paymentFrequencyDesc: value._previousDataValues.premFrequencyDesc,
          taxPayFrequencyInd: value._previousDataValues.taxPeriodFreqInd,
          paymentDueDate: value._previousDataValues.paymentDueDate,
          pegaCaseRef: 'pegaCase',
          noOfMembs: value._previousDataValues.numberOfMembers,
          totScheduleAmt: 0,
          recordStartDate: value._previousDataValues.recordStartDate,
          recordEndDate: value._previousDataValues.recordEndDate,
          createdBy: value._previousDataValues.createdBy,
          updatedBy: ''
        }
        results.push(params);

      });
      return results;
    } catch (e) {
      throw new CustomError("MAPPING_CONTRIBUTION_HEADER_FAILED", e)
    }
  },

  mappingContributionDetails(request): any {
    try {
      let results = [];
      Object.entries(request).forEach(([key, value]: any) => {
        if (value._previousDataValues?.stgcontrmember) {
          let params = {};
          params = {
            nestScheduleRef: value._previousDataValues.nestScheduleRef, //this.addLeadingZeros(parseInt(key) + 1, 2), //
            membEnrolmentRef: value._previousDataValues?.stgcontrmember?._previousDataValues?.membershipId,
            membContriDueDate: value._previousDataValues?.earningPeriodEndDate,
            membPlanRef: value._previousDataValues?.stgcontrmember?._previousDataValues?.planReference,
            empGroupId: value._previousDataValues?.stgcontrmember?._previousDataValues?.category,
            groupName: 'groupName',
            schdlMembStatusCd: 'MS1',
            membPartyId: 'membPartyId',//value._previousDataValues.crmPartyId,
            scmPartyId: value._previousDataValues?.stgcontrmember?._previousDataValues?.cmPartyId,
            nino: value._previousDataValues?.stgcontrmember?._previousDataValues?.nino,
            alternativeId: value._previousDataValues?.stgcontrmember?._previousDataValues?.schemePayrollReference,
            employerNestId: value._previousDataValues.employerNestId,
            autoCalcFlag: 'Y',
            membNonPayReason: 'CON01',
            channelType: 'WEB',
            createdBy: 'SYSTEM',
            updatedBy: ''
          }
          results.push(params);
        }
      });
      return results;
    } catch (e) {
      throw new CustomError("MAPPING_MEMBER_CONTRIBUTION_DETAILS_FAILED", e)
    }
  },
};

export default normalisation;