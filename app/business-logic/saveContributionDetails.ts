import { Context } from "@azure/functions";
import { ContributionDetails, StgFileMemberDetails } from "../models";
import sequelize from "../utils/database";
import {
  default as CommonContributionDetails,
  EnumRowDColumns,
  EnumScheduleMemberStatusCD,
  Type2SaveResult,
} from "./commonContributionDetails";

const saveContributionDetails = {
  /**
   * Update single row or Insert
   * @param row
   * @param transaction
   */
  InsertOrUpdateRow: async function (
    row,
    transaction,
    context: Context,
    contributionHeaderId,
    currentDRowIndex,
    updateResult: Type2SaveResult
  ): Promise<Type2SaveResult> {
    const nino = CommonContributionDetails.getRowColumn(
      row,
      EnumRowDColumns.NINO
    );
    const alternativeId = CommonContributionDetails.getRowColumn(
      row,
      EnumRowDColumns.ALT_ID
    );

    // Default condition
    let whereCondition: any = {
      nino: nino,
      contribHeaderId: contributionHeaderId,
    };
    if (!nino && alternativeId) {
      // When nino is empty
      whereCondition = {
        alternativeId: alternativeId,
        contribHeaderId: contributionHeaderId,
      };
    } else if (nino && alternativeId) {
      // Adding alternativeId also
      whereCondition.alternativeId = alternativeId;
    }
    const memDetailsRow = (await ContributionDetails.findOne({
      where: whereCondition,
    })) as any;

    const awaitingForSubmitStatuses = [
      EnumScheduleMemberStatusCD.READY_TO_SUBMIT,
      EnumScheduleMemberStatusCD.ATTENTION_NEEDED,
      EnumScheduleMemberStatusCD.TO_BE_REVIEWED,
    ];

    if (memDetailsRow) {
      // Checking is already processing or not. If yes, write type error ID24
      if (
        awaitingForSubmitStatuses.indexOf(memDetailsRow.schdlMembStatusCd) == -1
      ) {
        context.log(
          `Current D row index ${currentDRowIndex} : This member is already submitted or paid and will show on the submitted or paid tabs`
        );
        updateResult.paidMembers = updateResult.paidMembers + 1;
        return updateResult;
      }

      const currentMemberDetails =
        CommonContributionDetails.convertToContributionDetails(
          row,
          memDetailsRow
        );

      // Update recordChangedFlag to Y
      const effectRows = (await ContributionDetails.update(
        {
          ...currentMemberDetails,
          recordChangedFlag: "Y",
        },
        {
          where: whereCondition,
          transaction,
          individualHooks: true,
        }
      )) as any;
      context.log(
        `Rows updated, number of row effected : ${effectRows[1]?.length}`
      );
    } else {
      const fileMemberDetails =
        CommonContributionDetails.convertToSTGMemberDetails(row);
      await StgFileMemberDetails.create({
        ...fileMemberDetails,
      });
      updateResult.newMembers = updateResult.newMembers + 1;
    }
    return updateResult;
  },

  /**
   * Update member details
   * @param readStream
   * @param context
   * @returns true or reject with errorMessages[]
   */
  updateMemberDetails: async function (
    readStream: NodeJS.ReadableStream,
    context: Context,
    contributionHeaderId
  ): Promise<Type2SaveResult> {
    const transaction = await sequelize.transaction();
    let currentDRowIndex = 0;
    let updateResult: Type2SaveResult = {
      paidMembers: 0,
      newMembers: 0,
      isFailed: false,
    };
    try {
      // Get D rows first from CSV parse
      const dRows = await CommonContributionDetails.getOnlyDRows(
        readStream,
        context
      );
      // Start updating one by one with transcation
      for (const row of dRows) {
        context.log(`Rows updating for current D row ${currentDRowIndex}`);
        updateResult = await saveContributionDetails.InsertOrUpdateRow(
          row,
          transaction,
          context,
          contributionHeaderId,
          currentDRowIndex,
          updateResult
        );
        currentDRowIndex++;
      }
      await transaction.commit();
      return updateResult;
    } catch (e) {
      context.log(`Something went wrong : ${e.message}`);
      await transaction.rollback();
      updateResult.isFailed = true;
      return updateResult;
    }
  },
};

export default saveContributionDetails;
