import { Context } from "@azure/functions";
import { ContributionDetails, StgFileMemberDetails } from "../models";
import sequelize from "../utils/database";
import {
  default as CommonContributionDetails,
  EnumRowDColumns,
  EnumScheduleMemberStatusCD,
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
    rderrorTypes
  ) {
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

    // Checking is already processing or not. If yes, write type error ID24
    if (
      awaitingForSubmitStatuses.indexOf(memDetailsRow.schdlMembStatusCd) == -1
    ) {
      context.log(
        `Current D row index ${currentDRowIndex} : This member is already submitted or paid and will show on the submitted or paid tabs`
      );
      const id24Error = CommonContributionDetails.getRdErrorType(
        rderrorTypes,
        "ID24"
      );
      id24Error.lineNumber = currentDRowIndex + 1;
      await CommonContributionDetails.saveFileErrorDetails(
        [id24Error],
        null,
        memDetailsRow.membContribDetlId
      );
      return;
    }

    if (memDetailsRow) {
      const currentMemberDetails =
        CommonContributionDetails.convertToContributionDetails(
          row,
          memDetailsRow
        );
      const effectRows = (await ContributionDetails.update(
        {
          ...currentMemberDetails,
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
    }
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
    contributionHeaderId,
    rderrorTypes
  ): Promise<boolean> {
    const transaction = await sequelize.transaction();
    let currentDRowIndex = 0;
    try {
      // Get D rows first from CSV parse
      const dRows = await CommonContributionDetails.getOnlyDRows(
        readStream,
        context
      );
      // Start updating one by one with transcation
      for (const row of dRows) {
        context.log(`Rows updating for current D row ${currentDRowIndex}`);
        await saveContributionDetails.InsertOrUpdateRow(
          row,
          transaction,
          context,
          contributionHeaderId,
          currentDRowIndex,
          rderrorTypes
        );
        currentDRowIndex++;
      }
      await transaction.commit();
      return true;
    } catch (e) {
      context.log(`Something went wrong : ${e.message}`);
      await transaction.rollback();
      return false;
    }
  },
};

export default saveContributionDetails;
