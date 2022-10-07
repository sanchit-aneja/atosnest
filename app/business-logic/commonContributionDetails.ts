import * as csvf from 'fast-csv';
import { Context } from "@azure/functions";


const commonContributionDetails = {
    /**
     * 
     * @param newvalue 
     * @param dbValue 
     * @returns 
     */
     getNonNullValue: function (newvalue, dbValue) {
        return newvalue ? newvalue : dbValue;
    },
    /**
     * This will convert row into ContributionDetails object
     * @param row
     * @returns ContributionDetails object
     */
     convertToContributionDetails: function (row, memDetailsRows, addExtraParams:boolean=false) {
        // Currently this row index may change, this was done bcased on Contribution template - specification v1.9
        let customRow = {
            pensEarnings: commonContributionDetails.getNonNullValue(row[4], memDetailsRows.pensEarnings),
            membLeaveEarnings: commonContributionDetails.getNonNullValue(row[5], memDetailsRows.membLeaveEarnings),
            emplContriAmt: commonContributionDetails.getNonNullValue(row[6], memDetailsRows.emplContriAmt),
            membContriAmt: commonContributionDetails.getNonNullValue(row[7], memDetailsRows.membContriAmt),
            membNonPayReason: commonContributionDetails.getNonNullValue(row[8], memDetailsRows.membNonPayReason),
            membNonPayEffDate: commonContributionDetails.getNonNullValue((row[9]) ? row[9] : row[11], memDetailsRows.membNonPayEffDate),
            newGroupName: commonContributionDetails.getNonNullValue(row[10], memDetailsRows.newGroupName),
            newPaymentSourceName: commonContributionDetails.getNonNullValue(row[12], memDetailsRows.newPaymentSourceName),
            newGroupPensEarnings: commonContributionDetails.getNonNullValue(row[13], memDetailsRows.newGroupPensEarnings),
            newGroupEmplContriAmt: commonContributionDetails.getNonNullValue(row[14], memDetailsRows.newGroupEmplContriAmt),
            newGroupMembContriAmt: commonContributionDetails.getNonNullValue(row[15], memDetailsRows.newGroupMembContriAmt),
            optoutRefNum: commonContributionDetails.getNonNullValue(row[16], memDetailsRows.optoutRefNum),
            // in spec it was saying  bool and validation we need to check for Y.. not sure what will be true.. considering as Y only
            optoutDeclarationFlag: commonContributionDetails.getNonNullValue(row[17], memDetailsRows.optoutDeclarationFlag),
            secEnrolPensEarnings: commonContributionDetails.getNonNullValue(row[18], memDetailsRows.secEnrolPensEarnings),
            secEnrolEmplContriAmt: commonContributionDetails.getNonNullValue(row[19], memDetailsRows.secEnrolEmplContriAmt),
            secEnrolMembContriAmt: commonContributionDetails.getNonNullValue(row[20], memDetailsRows.secEnrolMembContriAmt)
        }
        // Force to upper case when not null
        if(!commonContributionDetails.isNullOrEmpty(customRow.optoutDeclarationFlag)){
            customRow.optoutDeclarationFlag = customRow.optoutDeclarationFlag.toUpperCase();
        }

        //Overwrite existing and add new for Type 2D validations only
        if(addExtraParams){
            customRow["membChangeOfGroupDate"]=row[11];
            customRow.membNonPayEffDate = row[9];
        }
        return customRow;
    },
    /**
     * is only Allowed Chars
     * @param value
     * @param isEmptyAllowed
     * @returns true/false
     */
     isOnlyAllowedChars(value:string, isEmptyAllowed:boolean=true){
        if(commonContributionDetails.isNullOrEmpty(value) && isEmptyAllowed){
            return true;
        }

        const pattern = /^(\d|[a-zA-Z])[A-Za-z\d"'#$%&@=?:\.\+\*\-/\\\(\)\[\]\{\}]+$/;
        return pattern.test(value);
    },

    /**
     * is only Alphanumerical
     * @param value
     * @param isEmptyAllowed
     * @returns true/false
     */
     isOnlyAlphanumerical(value:string, isEmptyAllowed:boolean=true){
        if(commonContributionDetails.isNullOrEmpty(value) && isEmptyAllowed){
            return true;
        }

        const pattern = /^[a-zA-Z0-9]+$/;
        return pattern.test(value);
    },
     /**
     * is date valid
     * @param value
     */
      isValidateDate: function (value) {
        if(commonContributionDetails.isNullOrEmpty(value)){
            return true;
        }
        const pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if(pattern.test(value)){
            const values = value.split("-");
            const date = new Date(value);
            if (date.getDate() === parseInt(values[2])) {
                return true
            }
        }
        
        return false
    },
    /**
     * Check value is null, undefined or empty
     * @param value
     * @returns bool if value is null or empty return true
     */
     isNullOrEmpty: function (value) {
        if (
            value == undefined ||
            value == null ||
            value == ""
        ) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * Check given string valid number format or not
     * 
     * > pattern.test('123')       - true
     * 
     * > pattern.test('123.00')    - true
     * 
     * > pattern.test('123.')      - false
     * 
     * > pattern.test('12.34.5')   - false
     * 
     * > pattern.test('123.000')   - false
     * 
     * *Note:- As per rule validation rule we are not supporting comma number system*
     * @param value 
     * @returns true or false
     */
    isVaildNumber(value:string, isEmptyAllowed:boolean){
        // When value is empty re
        if(commonContributionDetails.isNullOrEmpty(value)){
            return true;
        }
        const pattern = /^\d+(\.\d+)?$/
        // Just make in case value is not string, make it string and test regex
        return pattern.test(value+'');
    },
    /**
     * Check vaild decimals in number
     * @param value 
     * @param maxDecimals 
     * @param isEmptyAllowed 
     * @returns 
     */
    isValidDecimals(value:string, maxDecimals:number, isEmptyAllowed:boolean){
        // When value is empty re
        if(commonContributionDetails.isNullOrEmpty(value) && isEmptyAllowed){
            return true;
        }
        const regexString = `^\\d+(\\.\\d{1,${maxDecimals}})?$`
        const pattern = new RegExp(regexString,"g");
        // Just make in case value is not string, make it string and test regex
        return pattern.test(value+'');
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
    /**
     * Get D rows only
     * @param readStream
     * @param context
     * @returns
     */
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
                        context.log(`commonContributionDetails: Error Type : ${e.message}`);
                        const error = {
                            code: "ID9999",
                            message: "Someting went wrong with update Contribution Details"
                        }
                        errorMessages.push(error);
                        reject(errorMessages);
                    })
                    .on('data', async (row) => {
                        if (commonContributionDetails.isRowDValidation(row)) {
                            dRows.push(row);
                            context.log(`commonContributionDetails: Added D row, current index : ${currentDRowIndex}`);
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
    }
}

export default commonContributionDetails;
