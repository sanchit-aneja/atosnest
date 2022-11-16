import { ContributionDetails, ContributionHeader } from "../models";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import app from "../utils/app";
export const correctionsCreateSchedule = {
  /**
   * Validate Header Id
   * @param contribHeaderId
   */
  ValidateAndGetHeaderId: async function (contribHeaderId) {
    const dataHeaderRow: ContributionHeader = await ContributionHeader.findOne({
      where: { contrib_header_id: contribHeaderId, schedule_type: "CS" },
    });

    if (dataHeaderRow) {
      const dertailCount = await ContributionDetails.count({
        where: {
          contrib_header_id: contribHeaderId,
          schdl_memb_status_cd: "MS6",
        },
      });

      if (dertailCount > 0) {
        return dataHeaderRow;
      }

      return null;
    }
  },
  CreateSchedule: async function (
    dataHeaderRow: ContributionHeader,
    scheduleType
  ) {
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
