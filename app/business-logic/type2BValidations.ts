import { Context } from "@azure/functions"
import * as csvf from 'fast-csv';

const Type2BValidations = {
    /**
     * Check value is null, undefined or empty
     * @param value
     * @returns bool if value is null or empty return true
     */
    isNullOrEmpty: function(value){
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
     * is date valid
     * @param value
     */
    isValidateDate: function(value){
        const values = value.split("-");
        const date = new Date(value);
        if(date.getDate() === parseInt(values[2])){
            return true
        }
        return false
    },
    /**
     * Type 2B rules
     */
    rules: {
        "EmployerReferenceNumber": (row, context: Context) => {
            let errorMessage = "Please ensure your file contains the Employer Reference Number in the header record.";
            try {
                const empRefNo = row[1];
                if(Type2BValidations.isNullOrEmpty(empRefNo)){
                    return errorMessage
                }
                errorMessage = "Please check the Employer Reference Number in the header record is in a valid format. Note, the prefix (before numerical digits) should be EMP.";
                const pattern = /^(EMP)(\d{9})$/;
                if (!pattern.test(empRefNo)) {
                    return errorMessage
                }
                return "";
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return errorMessage
            }
        },
        "ProcessType": (row, context: Context) => {
            let errorMessage = "Please ensure your file contains the Process type in the header record.";
            try {
                const processType = row[2];
                if(Type2BValidations.isNullOrEmpty(processType)){
                    return errorMessage
                }
                errorMessage = "Please check the details in the header record field Process type is in a valid format and the text is exactly as shown here: CS - Contribution Schedule."
                if (processType !== "CS") {
                    return errorMessage
                }
                return "";
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return errorMessage
            }
        },
        "EPED": (row, context: Context) => {
            let errorMessage = "Please ensure your file contains the EPED in the header record.";
            try {
                const epedDate = row[3];
                if(Type2BValidations.isNullOrEmpty(epedDate)){
                    return errorMessage;
                }
                const pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
                errorMessage = "Please check the details in the header record field as they appear to be in the wrong format: EPED. Please format dates in this field as YYYY-MM-DD.";
                if (!pattern.test(epedDate) || !Type2BValidations.isValidateDate(epedDate)) { // Only format checking is done. But for example 9999-10-31 is also valid..
                    return errorMessage
                }
                return "";
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return errorMessage
            }
        },
        "PaymentSource": (row, context: Context) => {
            let errorMessage = "Please ensure your file contains the Payment Source in the header record.";
            try {
                const paymentSource = row[4];
                if(Type2BValidations.isNullOrEmpty(paymentSource)){
                    return errorMessage;
                }
                const pattern = /^(\d|[a-zA-Z])[A-Za-z\d"'#$%&@=?:\.\+\*\-/\\\(\)\[\]\{\}]+$/;
                errorMessage = "Please check the details in these header record field as it appears to be in the wrong format: Payment Source. Note, the Payment Source must begin with an alphanumerical character.";
                if (!pattern.test(paymentSource)) {
                    return errorMessage
                }
                return "";
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return errorMessage
            }
        },
        "PayPeriodFrequency": (row, context: Context) => {
            let errorMessage = "Please ensure your file contains the Pay Period Frequency in the header record.";
            try {
                const payPeriod = row[6];
                if(Type2BValidations.isNullOrEmpty(payPeriod)){
                    return errorMessage
                }
                errorMessage = "Please check the details in these header record fields as they appear to be in the wrong format: Pay Period Frequency. Note, the Pay Period Frequency has to exactly match one of the following: weekly, tax weekly, fortnightly, tax fortnightly, 4 weekly, tax 4 weekly, monthly, tax monthly.";
                const frequencyTypes = ['weekly', 'tax weekly', 'fortnightly', 'tax fortnightly', '4 weekly', 'tax 4 weekly', 'monthly', 'tax monthly'];
                if (frequencyTypes.indexOf(payPeriod.toLowerCase()) === -1) {
                    return errorMessage
                }
                return "";
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return errorMessage
            }
        },
        "PDD": (row, context: Context) => {
            const errorMessage = "Please check the details in the header record field as they appear to be in the wrong format: PDD. Please format dates in this field as YYYY-MM-DD.";
            try {
                const pddDate = row[8];
                if (pddDate === "") {
                    return ""
                }
                const pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
                if (!pattern.test(pddDate) || !Type2BValidations.isValidateDate(pddDate)) { // Only format checking is done. But for example 9999-10-31 is also valid..
                    return errorMessage
                }
                return "";
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return errorMessage
            }
        },
        "EPSD": (row, context: Context) => {
            const errorMessage = "Please check the details in the header record field as they appear to be in the wrong format: EPSD. Please format dates in this field as YYYY-MM-DD.";
            try {
                const epsdDate = row[9];
                if (epsdDate === "") {
                    return ""
                }
                const pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
                if (!pattern.test(epsdDate) || !Type2BValidations.isValidateDate(epsdDate)) { // Only format checking is done. But for example 9999-10-31 is also valid..
                    return errorMessage
                }
                return "";
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return errorMessage
            }
        },
        "BulkUpdateToNoContributionsDue": (row, context: Context) => {
            const errorMessage = "Please check the details in the header record field as they appear to be in the wrong format: EPSD. Please format dates in this field as YYYY-MM-DD.";
            try {
                const bulkUpdateToContriDueFlag = row[10];
                if (bulkUpdateToContriDueFlag === null || bulkUpdateToContriDueFlag === undefined || bulkUpdateToContriDueFlag === '') {
                    return ""
                }
                const pattern = /^[YNyn]$/;
                if (!pattern.test(bulkUpdateToContriDueFlag)) { // Only format checking is done. But for example 9999-10-31 is also valid..
                    return errorMessage
                }
                return "";
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return errorMessage
            }
        }
    },
    /**
     * it will check is it T row first and returns column 2. If not T row returns 0
     * @param row
     * @returns number or zero for not T rows
     */
    getRowTTotalRecordCount: function (row) {
        if (row[0] === "T") {
            return Number(row[1]);
        }
        return 0;
    },
    /**
     * This will check current row is D row and return count of D rows back
     * @param row
     * @param countDRows
     * @returns return D rows count
     */
    isRowDValidation: function (row, countDRows: number): number {
        if (row[0] === "D") {
            countDRows = countDRows + 1;
        }
        return countDRows;
    },
    /**
     * Validate row's columns one by one with rules defined
     * @param row
     * @param context
     * @param callback
     * @returns 
     */
    executeRulesOneByOne: function (row, context: Context, callback: Function) {
        for (const key in Type2BValidations.rules) {
            const validationFunc = Type2BValidations.rules[key];
            const errMsg = validationFunc(row, context);
            if (errMsg.length > 0) {
                return callback(new Error(errMsg), false, errMsg);
            }
        }
        return callback(null, true, null);
    },
    /**
     * This will invoke type 2B rules one by one
     * @param readStream
     * @param context
     * @returns
     */
    start: async function (readStream: NodeJS.ReadableStream, context: Context): Promise<any> {
        let headers;
        let invalidResults = [];
        let results = []
        let currentRowIndex = -1; // when process start it will increament
        let countDRows = 0;
        let totalRecordsInTRow = 0;
        let trailerFound = false;
        let errorMessage = { name: '', message: '' };
        return new Promise(async function (resolve, reject) {
            try {
                readStream
                    .pipe(csvf.parse<any, any>({
                        ignoreEmpty: true,
                    }))
                    .validate(async (row: any, cb) => {
                        currentRowIndex++
                        if (currentRowIndex === 0) { // Header Row
                            return Type2BValidations.executeRulesOneByOne(row, context, cb);
                        } else { // D & T Row checks
                            countDRows = Type2BValidations.isRowDValidation(row, countDRows)
                            totalRecordsInTRow = Type2BValidations.getRowTTotalRecordCount(row)
                            const pattern = /^[\d+]$/;
                            if (!pattern.test(totalRecordsInTRow.toString())) { // Only format checking is done. But for example 9999-10-31 is also valid..
                                let errMsg = "The number of detail records in your file has not been specified. Please ensure the number of records in your file is specified in the trailer record."
                                return cb(new Error(errMsg), false, errMsg);
                            }
                        }
                        return cb(null, true, null);
                    })
                    .on('headers', (row) => {
                        headers = row;
                    })
                    .on('data', (row) => {
                        results.push(row);
                    })
                    .on('data-invalid', (row, rowNumber) => {
                        invalidResults.push(row);
                        context.log(`Invalid [rowNumber=${rowNumber}]`);
                    })
                    .on('error', (e) => {
                        errorMessage.name = "Invalid File";
                        errorMessage.message = e.message;
                        context.log(`Error Type 2B : ${e.message}`);
                        reject(errorMessage);
                    })
                    .on('end', (_e) => {
                        // Total D rows in file and T row total records checking
                        if (totalRecordsInTRow !== countDRows) {
                            errorMessage.name = "Invalid File";
                            errorMessage.message = "The number of detail records in your file is different to the number specified in the trailer record. Please check the trailer record matches the number of detail records contained in your file.";
                            reject(errorMessage);
                            return;
                        }
                        let data = {
                            invalidResults: invalidResults,
                            results: results,
                            headers: headers
                        }
                        resolve(data);
                    })
            } catch (e) {
                reject(e);
            }
        })
    }

}


export default Type2BValidations;
