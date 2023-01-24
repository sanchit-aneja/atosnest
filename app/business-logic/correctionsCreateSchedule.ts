import { ContributionDetails, ContributionHeader } from "../models";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import app from "../utils/app";
import { errorDetails } from "../utils/constants";
export const correctionsCreateSchedule = {  
  /**
   * Validate Header Id
   * @param contribHeaderId The contribution header id to validate and check
   * This function will attempt to find a contribution header given via the parameter and 
   * validate that it,
   *    1.  Is of the schedule type to correct.
   *    2.  Has contribution details to correct.
   * If there is an error then the object will contain an errorCode property with the error
   * to log. If successful then the headerRow will be populated.
   */
  ValidateAndGetHeaderId: async function (contribHeaderId) {
    const dataHeaderRow: ContributionHeader = await ContributionHeader.findOne({
      where: { contrib_header_id: contribHeaderId, schedule_type: { [Op.in]: ["CS", "EC"]} },
    });

    if (dataHeaderRow) {
      const detailCount = await ContributionDetails.count({
        where: {
          contrib_header_id: contribHeaderId,
          schdl_memb_status_cd: "MCS13",
        },
      });

      if (detailCount > 0) {
        return { headerRow: dataHeaderRow };
      } else {
        return { errorDetailsObject: {errorMessage: errorDetails.CIA0601, errorCode: 404 }};
      }
    } else {
      // No rows returned from query
      return { errorDetailsObject: {errorMessage: errorDetails.CIA0606, errorCode: 400 }};
    }
  },
  CreateSchedule: async function (dataHeaderRow: any, scheduleType) {
    return new Promise(async (resolve, reject) => {
      let nextscheduleReference =
        "CC" + dataHeaderRow.dataValues.paymentFrequency;
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      const yyyy = today.getFullYear();

      const nestScheduleRefCount = await ContributionHeader.count({
        where: {
          nestScheduleRef: {
            [Op.like]: `${nextscheduleReference}${dd}${mm}${yyyy}%`,
          },
          employerNestId: dataHeaderRow.dataValues.employerNestId,
        },
      });

      const nestScheduleRefNextCount = app.addLeadingZeros(
        nestScheduleRefCount + 1,
        3
      );
      nextscheduleReference = `${nextscheduleReference}${dd}${mm}${yyyy}${nestScheduleRefNextCount}`;
      const contribHeaderId = uuidv4();
      const headerEntry = {
        contribHeaderId: contribHeaderId,
        origContribHeaderId: dataHeaderRow.dataValues.contribHeaderId,
        nestScheduleRef: nextscheduleReference,
        externalScheduleRef: dataHeaderRow.dataValues.externalScheduleRef,
        scheduleType: scheduleType,
        scheduleStatusCd: "CS13",
        scheduleGenerationDate: `${yyyy}-${mm}-${dd}`,
        employerNestId: dataHeaderRow.dataValues.employerNestId,
        subSchemeId: dataHeaderRow.dataValues.subSchemeId,
        earningPeriodStartDate: dataHeaderRow.dataValues.earningPeriodStartDate,
        earningPeriodEndDate: dataHeaderRow.dataValues.earningPeriodEndDate,
        paymentPlanNo: dataHeaderRow.dataValues.paymentPlanNo,
        paymentRef: dataHeaderRow.dataValues.paymentRef,
        nestPaymentRef: dataHeaderRow.dataValues.nestPaymentRef,
        paymentSourceName: dataHeaderRow.dataValues.paymentSourceName,
        paymentMethod: dataHeaderRow.dataValues.paymentMethod,
        paymentMethodDesc: dataHeaderRow.dataValues.paymentMethodDesc,
        paymentFrequency: dataHeaderRow.dataValues.paymentFrequency,
        paymentFrequencyDesc: dataHeaderRow.dataValues.paymentFrequencyDesc,
        taxPayFrequencyInd: dataHeaderRow.dataValues.taxPayFrequencyInd,
        paymentDueDate: dataHeaderRow.dataValues.paymentDueDate,
        pegaCaseRef: dataHeaderRow.dataValues.pegaCaseRef,
        noOfMembs: 0,
        totScheduleAmt: 0,
        recordStartDate: dataHeaderRow.dataValues.recordStartDate,
        recordEndDate: dataHeaderRow.dataValues.recordEndDate,
        createdBy: "System",
        updatedBy: "",
      };

      await ContributionHeader.create({
        ...headerEntry,
      })
        .then(function (result) {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
