import { Context } from "@azure/functions"
import { ContributionDetails } from "../models";
import sequelize from "../utils/database";
import commonContributionDetails from './commonContributionDetails';

const saveContributionDetails = {

    /**
     * Update single row or Insert
     * @param row
     * @param transaction
     */
    InsertOrUpdateRow: async function (row, transaction, context: Context) {
        const nino = row[2];
        const alternativeId = row[3];

        // Default condition
        let whereCondition: any = {
            'nino': nino
        }
        if (!nino && alternativeId) {
            // When nino is empty
            whereCondition = {
                'alternativeId': alternativeId
            }
        } else if (nino && alternativeId) {
            // Adding alternativeId also
            whereCondition.alternativeId = alternativeId;
        }
        const memDetailsRows = await ContributionDetails.findOne({
            where: whereCondition
        })

        if (memDetailsRows) {
            const currentMemberDetails = commonContributionDetails.convertToContributionDetails(row, memDetailsRows);
            const effectRows = await ContributionDetails.update({
                ...currentMemberDetails
            }, {
                where: whereCondition,
                transaction,
                individualHooks: true
            }) as any;
            context.log(`Rows updated, number of row effected : ${effectRows[1]?.length}`);
        } else {
            context.log(`Record not found, Insert is pending.. TODO`);
        }
    },

    /**
     * Update member details
     * @param readStream
     * @param context
     * @returns true or reject with errorMessages[]
     */
    updateMemberDetails: async function (readStream: NodeJS.ReadableStream, context: Context): Promise<boolean> {
        const transaction = await sequelize.transaction();
        let currentDRowIndex = 0;
        try {
            // Get D rows first from CSV parse
            const dRows = await commonContributionDetails.getOnlyDRows(readStream, context);
            // Start updating one by one with transcation
            for (const row of dRows) {
                context.log(`Rows updating for current D row ${currentDRowIndex}`);
                await saveContributionDetails.InsertOrUpdateRow(row, transaction, context);
                currentDRowIndex++;
            }
            await transaction.commit();
            return true;
        } catch (e) {
            context.log(`Something went wrong : ${e.message}`);
            await transaction.rollback();
            return false;
        }
    }
}

export default saveContributionDetails;
