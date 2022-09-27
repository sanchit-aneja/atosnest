import { Context } from "@azure/functions"
import * as csvf from 'fast-csv';
import { Op } from "sequelize";
import { ContributionDetails } from "../models";
import sequelize from "../utils/database";

const saveContributionDetails = {
    getOriginalValue: function (newvalue, dbValue) {
        return newvalue ? newvalue : dbValue;
    },
    /**
     * This will convert row into ContributionDetails object
     * @param row
     * @returns ContributionDetails object
     */
    convertToContributionDetails: function (row, memDetailsRows) {
        // Currently this row index may change, this was done bcased on Contribution template - specification v1.9
        return {
            pensEarnings: saveContributionDetails.getOriginalValue(row[4], memDetailsRows.pensEarnings),
            membLeaveEarnings: saveContributionDetails.getOriginalValue(row[5], memDetailsRows.membLeaveEarnings),
            emplContriAmt: saveContributionDetails.getOriginalValue(row[6], memDetailsRows.emplContriAmt),
            membContriAmt: saveContributionDetails.getOriginalValue(row[7], memDetailsRows.membContriAmt),
            membNonPayReason: saveContributionDetails.getOriginalValue(row[8], memDetailsRows.membNonPayReason),
            membNonPayEffDate: saveContributionDetails.getOriginalValue((row[9]) ? row[9] : row[11], memDetailsRows.membNonPayEffDate),
            newGroupName: saveContributionDetails.getOriginalValue(row[10], memDetailsRows.newGroupName),
            newPaymentSourceName: saveContributionDetails.getOriginalValue(row[12], memDetailsRows.newPaymentSourceName),
            newGroupPensEarnings: saveContributionDetails.getOriginalValue(row[13], memDetailsRows.newGroupPensEarnings),
            newGroupEmplContriAmt: saveContributionDetails.getOriginalValue(row[14], memDetailsRows.newGroupEmplContriAmt),
            newGroupMembContriAmt: saveContributionDetails.getOriginalValue(row[15], memDetailsRows.newGroupMembContriAmt),
            optoutRefNum: saveContributionDetails.getOriginalValue(row[16], memDetailsRows.optoutRefNum),
            optoutDeclarationFlag: saveContributionDetails.getOriginalValue((row[17] === 'true') ? 'Y' : '', memDetailsRows.optoutDeclarationFlag),
            secEnrolPensEarnings: saveContributionDetails.getOriginalValue(row[18], memDetailsRows.secEnrolPensEarnings),
            secEnrolEmplContriAmt: saveContributionDetails.getOriginalValue(row[19], memDetailsRows.secEnrolEmplContriAmt),
            secEnrolMembContriAmt: saveContributionDetails.getOriginalValue(row[20], memDetailsRows.secEnrolMembContriAmt)
        }
    },

    /**
     * This will check current row is D row and return true or false
     * @param row
     * @returns return true or false, if it is D row
     */
    isRowDValidation: function (row): boolean {
        if (row[0] === "D") {
            return true;
        }
        return false;
    },

    getOnlyDRows: async function (readStream: NodeJS.ReadableStream, context: Context): Promise<Array<any>> {
        let errorMessages = [];
        let dRows = [];
        let currentDRowIndex = 0;
        return new Promise(async function (resolve, reject) {
            try {
                readStream
                    .pipe(csvf.parse<any, any>({
                        ignoreEmpty: true,
                    }))
                    .on('error', async (e) => {
                        context.log(`saveContributionDetails: Error Type 2B : ${e.message}`);
                        const error = {
                            code: "ID9999",
                            message: "Someting went wrong with update Contribution Details"
                        }
                        errorMessages.push(error);
                        reject(errorMessages);
                    })
                    .on('data', async (row) => {
                        if (saveContributionDetails.isRowDValidation(row)) {
                            dRows.push(row);
                            currentDRowIndex++;
                        }
                    })
                    .on('end', async (_e) => {
                        resolve(dRows);
                    });
            } catch (e) {
                context.log(`Something went wrong : ${e.message}`);
                reject(e);
            }
        })
    },

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
            const currentMemberDetails = saveContributionDetails.convertToContributionDetails(row, memDetailsRows);
            const effectRows = await ContributionDetails.update({
                ...currentMemberDetails
            }, {
                where: whereCondition,
                transaction,
                individualHooks: true
            }) as any;
            context.log(`Rows updated for current D row : ${effectRows[1]?.length}`);
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
            const dRows = await saveContributionDetails.getOnlyDRows(readStream, context);
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
