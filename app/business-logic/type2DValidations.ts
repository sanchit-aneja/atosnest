import { Context } from "@azure/functions";
import {default as CommonContributionDetails} from "./commonContributionDetails";

const Type2DValidations = {
    /**
     * Type 2D rules - Validation
     */
    rules: {
        "PensEarnings": async function(row){
            const pensEarnings = row.pensEarnings;
            if (!CommonContributionDetails.isVaildNumber(pensEarnings, true)) {
                return {
                    code: "ID25.0",
                    message: "Please remove invalid characters. The format must be numerical."
                }
            } else if(!CommonContributionDetails.isValidDecimals(pensEarnings, 2, true)){
                return {
                    code: "ID30.0",
                    message: "Please ensure the value does not exceed 2 decimal places."
                }
            }
            return null;
        },
        "EmplContriAmt": async function(row){
            const emplContriAmt = row.emplContriAmt;
            if (!CommonContributionDetails.isVaildNumber(emplContriAmt, true)) {
                return {
                    code: "ID25.1",
                    message: "Please remove invalid characters. The format must be numerical."
                }
            } else if(!CommonContributionDetails.isValidDecimals(emplContriAmt, 2, true)){
                return {
                    code: "ID30.1",
                    message: "Please ensure the value does not exceed 2 decimal places."
                }
            }
            return null;
        },
        "MembContriAmt": async function(row){
            const membContriAmt = row.membContriAmt;
            if (!CommonContributionDetails.isVaildNumber(membContriAmt, true)) {
                return {
                    code: "ID25.2",
                    message: "Please remove invalid characters. The format must be numerical."
                }
            } else if(!CommonContributionDetails.isValidDecimals(membContriAmt, 2, true)){
                return {
                    code: "ID30.2",
                    message: "Please ensure the value does not exceed 2 decimal places."
                }
            }
            return null;
        },
        "MembLeaveEarnings": async function(row){
            const membLeaveEarningsAmt = row.membLeaveEarnings;
            if (!CommonContributionDetails.isVaildNumber(membLeaveEarningsAmt, true)) {
                return {
                    code: "ID31.24",
                    message: "Please remove invalid characters. The format must be numerical."
                }
            } else if(!CommonContributionDetails.isValidDecimals(membLeaveEarningsAmt, 2, true)){
                return {
                    code: "ID31.12",
                    message: "Please ensure the value does not exceed 2 decimal places."
                }
            }
            return null;
        },
        "EffectiveDatePartialNonPayment": async function(row){
            const effectiveDate = row.membNonPayEffDate;
            if(!CommonContributionDetails.isValidateDate(effectiveDate)){
                return {
                    code: "ID31.13",
                    message: "Your file contains an incorrect date format in this field. Please select a date above, or, format this field as YYYY-MM-DD in the file you upload."
                }
            }
            return null;
        },
        "EffectiveDateChangeGroup": async function(row){
            const effectiveDate = row.membChangeOfGroupDate;
            if(!CommonContributionDetails.isValidateDate(effectiveDate)){
                return {
                    code: "ID31.15",
                    message: "Your file contains an incorrect date format in this field. Please select a date above, or, format this field as YYYY-MM-DD in the file you upload."
                }
            }
            return null;
        },
        "NewPaymentSourceName": async function(row){
            if(!CommonContributionDetails.isOnlyAllowedChars(row.newPaymentSourceName,true)){
                return {
                    code: "ID31.14",
                    message:"This field must begin with an alphanumerical character."
                }
            }
            return null;
        },
        "NewGroupName": async function(row){
            if(!CommonContributionDetails.isOnlyAllowedChars(row.newGroupName, true)){
                return {
                    code: "ID31.16",
                    message:"This field must begin with an alphanumerical character."
                }
            }
            return null;
        },
        "OptoutDeclarationFlag": async function(row){
            if(!CommonContributionDetails.isNullOrEmpty(row.optoutDeclarationFlag) && row.optoutDeclarationFlag.toUpperCase() != 'Y'){
                return {
                    code:"ID31.20",
                    message: "Your file contains an incorrect format in this field. Please check the tickbox above, or, format this field as Y in the file you upload."
                }
            }
            return null
        },
        "NewGroupPensEarnings":async function(row){
            const newGroupPensEarnings = row.newGroupPensEarnings;
            if (!CommonContributionDetails.isVaildNumber(newGroupPensEarnings, true)) {
                return {
                    code: "ID31.29",
                    message: "Please remove invalid characters. The format must be numerical."
                }
            } else if(!CommonContributionDetails.isValidDecimals(newGroupPensEarnings, 2, true)){
                return {
                    code: "ID31.17",
                    message: "Please ensure the value does not exceed 2 decimal places."
                }
            }
            return null;
        },
        "NewGroupEmplContriAmt":async function(row){
            const newGroupEmplContriAmt = row.newGroupEmplContriAmt;
            if (!CommonContributionDetails.isVaildNumber(newGroupEmplContriAmt, true)) {
                return {
                    code: "ID31.30",
                    message: "Please remove invalid characters. The format must be numerical."
                }
            } else if(!CommonContributionDetails.isValidDecimals(newGroupEmplContriAmt, 2, true)){
                return {
                    code: "ID31.18",
                    message: "Please ensure the value does not exceed 2 decimal places."
                }
            }
            return null;
        },
        "NewGroupMembContriAmt":async function(row){
            const newGroupMembContriAmt = row.newGroupMembContriAmt;
            if (!CommonContributionDetails.isVaildNumber(newGroupMembContriAmt, true)) {
                return {
                    code: "ID31.31",
                    message: "Please remove invalid characters. The format must be numerical."
                }
            } else if(!CommonContributionDetails.isValidDecimals(newGroupMembContriAmt, 2, true)){
                return {
                    code: "ID31.19",
                    message: "Please ensure the value does not exceed 2 decimal places."
                }
            }
            return null;
        },
        "OptoutRefNum": async function(row){
            if(!CommonContributionDetails.isOnlyAlphanumerical(row.optoutRefNum, true)){
                return {
                    code: "ID31.32",
                    message:"This field must begin with an alphanumerical character."
                }
            }
            return null;
        },
        "SecEnrolPensEarnings":async function(row){
            const secEnrolPensEarnings = row.secEnrolPensEarnings;
            if (!CommonContributionDetails.isVaildNumber(secEnrolPensEarnings, true)) {
                return {
                    code: "ID31.34",
                    message: "Please remove invalid characters. The format must be numerical."
                }
            } else if(!CommonContributionDetails.isValidDecimals(secEnrolPensEarnings, 2, true)){
                return {
                    code: "ID31.21",
                    message: "Please ensure the value does not exceed 2 decimal places."
                }
            }
            return null;
        },
        "SecEnrolEmplContriAmt":async function(row){
            const secEnrolEmplContriAmt = row.secEnrolEmplContriAmt;
            if (!CommonContributionDetails.isVaildNumber(secEnrolEmplContriAmt, true)) {
                return {
                    code: "ID31.35",
                    message: "Please remove invalid characters. The format must be numerical."
                }
            } else if(!CommonContributionDetails.isValidDecimals(secEnrolEmplContriAmt, 2, true)){
                return {
                    code: "ID31.22",
                    message: "Please ensure the value does not exceed 2 decimal places."
                }
            }
            return null;
        },
        "SecEnrolMembContriAmt":async function(row){
            const secEnrolMembContriAmt = row.secEnrolMembContriAmt;
            if (!CommonContributionDetails.isVaildNumber(secEnrolMembContriAmt, true)) {
                return {
                    code: "ID31.36",
                    message: "Please remove invalid characters. The format must be numerical."
                }
            } else if(!CommonContributionDetails.isValidDecimals(secEnrolMembContriAmt, 2, true)){
                return {
                    code: "ID31.23",
                    message: "Please ensure the value does not exceed 2 decimal places."
                }
            }
            return null;
        },
    },
    /**
     * Validate row's columns one by one with rules defined
     * @param row
     * @param context
     * @param errors
     * @returns 
     */
    executeRulesOneByOne: async function (row, context: Context, errors: Array<any>, currentDRowIndex:number=0) {
        for (const key in Type2DValidations.rules) {
            const validationFunc = Type2DValidations.rules[key];
            context.log(`executeRulesOneByOne :: Run rule ${key} current D row index ${currentDRowIndex}`)
            const validationErrors = await validationFunc(row);
            if (validationErrors) {
                validationErrors.lineNumber = (currentDRowIndex+1)
                errors.push(validationErrors)
            }
        }
        return errors;
    },
    /**
     * This will invoke type 2D rules one by one
     * @param readStream
     * @param context
     * @param fileId
     * @param contributionHeaderId
     * @returns
     */
    start: async function (readStream: NodeJS.ReadableStream, context: Context, fileId, contributionHeaderId): Promise<any> {
        let currentDRowIndex = 0;
        let errorMessages = [];
        return new Promise(async function (resolve, reject) {
        try {
            // Get D rows first from CSV parse - Reusing from saveContribution
            const dRows = await CommonContributionDetails.getOnlyDRows(readStream, context);
            // Start updating one by one with transcation
            for (const row of dRows) {
                context.log(`Rows updating for current D row ${currentDRowIndex} contributionHeaderId: ${contributionHeaderId}`);
                // Pass empty value for actual values here we no need that
                const customRow = CommonContributionDetails.convertToContributionDetails(row, {}, true);
                errorMessages= await Type2DValidations.executeRulesOneByOne(customRow, context, errorMessages, currentDRowIndex);
                currentDRowIndex++;
            }
            if(errorMessages.length > 0){
                await CommonContributionDetails.saveFileErrorDetails(errorMessages, fileId, '2C');
                reject(errorMessages);  
            } else{
                resolve(true);
            }
        } catch (e) {
            context.log(`****Something went wrong***** : ${e.message}`);
            reject(e);  
        }
    });
    }

}


export default Type2DValidations;
