import { Context } from "@azure/functions";
import { ContributionDetails, StgFileMemberDetails } from "../models";
import sequelize from "../utils/database";
import {
  default as CommonContributionDetails,
  EnumRowDColumns,
} from "./commonContributionDetails";

const saveContributionDetails = {
  /**
   * Update single row or Insert
   * @param row
   * @param transaction
   */
  InsertOrUpdateRow: async function (row, transaction, context: Context) {
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
    };
    if (!nino && alternativeId) {
      // When nino is empty
      whereCondition = {
        alternativeId: alternativeId,
      };
    } else if (nino && alternativeId) {
      // Adding alternativeId also
      whereCondition.alternativeId = alternativeId;
    }
    const memDetailsRows = await ContributionDetails.findOne({
      where: whereCondition,
    });

    if (memDetailsRows) {
      const currentMemberDetails =
        CommonContributionDetails.convertToContributionDetails(
          row,
          memDetailsRows
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

      try {
        await StgFileMemberDetails.create({
          ...fileMemberDetails,
        });
      } catch (error) {
        context.log(error);
      }
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
    context: Context
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
          context
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
