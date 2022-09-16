import { Context } from "@azure/functions"
import * as csvf from 'fast-csv';
import { ContributionHeader } from '../models';

const Type2BValidations = {
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
     * is date valid
     * @param value
     */
    isValidateDate: function (value) {
        const values = value.split("-");
        const date = new Date(value);
        if (date.getDate() === parseInt(values[2])) {
            return true
        }
        return false
    },
    /**
     * Type 2B rules - Validation
     */
    rules: {
        "EmployerReferenceNumber": async (row, context: Context) => {
            const validationError = {
                code: "ID10.0",
                message: "Please ensure your file contains the Employer Reference Number in the header record."
            }
            try {
                const empRefNo = row[1];
                if (Type2BValidations.isNullOrEmpty(empRefNo)) {
                    return validationError
                }
                const pattern = /^(EMP)(\d{9})$/;
                if (!pattern.test(empRefNo)) {
                    return {
                        code: "ID13.0",
                        message: "Please check the Employer Reference Number in the header record is in a valid format. Note, the prefix (before numerical digits) should be EMP."
                    }
                }
                return null;
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return validationError
            }
        },
        "ProcessType": async (row, context: Context) => {
            const validationError = {
                code: "ID10.1",
                message: "Please ensure your file contains the Process type in the header record."
            }
            try {
                const processType = row[2];
                if (Type2BValidations.isNullOrEmpty(processType)) {
                    return validationError
                }
                if (processType !== "CS") {
                    return {
                        code: "ID13.1",
                        message: "Please check the details in the header record field Process type is in a valid format and the text is exactly as shown here: CS - Contribution Schedule."
                    }
                }
                return null;
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return validationError
            }
        },
        "EPED": async (row, context: Context) => {
            const validationError = {
                code: "ID10.2",
                message: "Please ensure your file contains the EPED in the header record."
            }
            try {
                const epedDate = row[3];
                if (Type2BValidations.isNullOrEmpty(epedDate)) {
                    return validationError;
                }
                const pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
                if (!pattern.test(epedDate) || !Type2BValidations.isValidateDate(epedDate)) { // Only format checking is done. But for example 9999-10-31 is also valid..
                    return {
                        code: "ID13.2",
                        message: "Please check the details in the header record field as they appear to be in the wrong format: EPED. Please format dates in this field as YYYY-MM-DD."
                    }
                }
                return null;
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return validationError
            }
        },
        "PaymentSource": async (row, context: Context) => {
            const validationError = {
                code: "ID10.3",
                message: "Please ensure your file contains the Payment Source in the header record."
            }
            try {
                const paymentSource = row[4];
                if (Type2BValidations.isNullOrEmpty(paymentSource)) {
                    return validationError;
                }
                const pattern = /^(\d|[a-zA-Z])[A-Za-z\d"'#$%&@=?:\.\+\*\-/\\\(\)\[\]\{\}]+$/;
                if (!pattern.test(paymentSource)) {
                    return {
                        code: "ID13.3",
                        message: "Please check the details in these header record field as it appears to be in the wrong format: Payment Source. Note, the Payment Source must begin with an alphanumerical character."
                    }
                }
                return null;
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return validationError
            }
        },
        "PayPeriodFrequency": async (row, context: Context) => {
            const validationError = {
                code: "ID10.4",
                message: "Please ensure your file contains the Pay Period Frequency in the header record."
            }
            try {
                const payPeriod = row[6];
                if (Type2BValidations.isNullOrEmpty(payPeriod)) {
                    return validationError
                }
                const frequencyTypes = ['weekly', 'tax weekly', 'fortnightly', 'tax fortnightly', '4 weekly', 'tax 4 weekly', 'monthly', 'tax monthly'];
                if (frequencyTypes.indexOf(payPeriod.toLowerCase()) === -1) {
                    return {
                        code: "ID13.4",
                        message: "Please check the details in these header record fields as they appear to be in the wrong format: Pay Period Frequency. Note, the Pay Period Frequency has to exactly match one of the following: weekly, tax weekly, fortnightly, tax fortnightly, 4 weekly, tax 4 weekly, monthly, tax monthly."
                    }
                }
                return null;
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return validationError
            }
        },
        "PDD": async (row, context: Context) => {
            const validationError = {
                code: "ID14.3",
                message: "Please check the details in the header record field as they appear to be in the wrong format: PDD. Please format dates in this field as YYYY-MM-DD."
            }
            try {
                const pddDate = row[8];
                if (pddDate === "") {
                    return null
                }
                const pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
                if (!pattern.test(pddDate) || !Type2BValidations.isValidateDate(pddDate)) { // Only format checking is done. But for example 9999-10-31 is also valid..
                    return validationError
                }
                return null;
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return validationError
            }
        },
        "EPSD": async (row, context: Context) => {
            const validationError = {
                code: "ID14.4",
                message: "Please check the details in the header record field as they appear to be in the wrong format: EPSD. Please format dates in this field as YYYY-MM-DD."
            }
            try {
                const epedDate = row[3];
                const epsdDate = row[9];
                if (epsdDate === "") {
                    return null
                }
                const pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
                if (!pattern.test(epsdDate) || !Type2BValidations.isValidateDate(epsdDate)) { // Only format checking is done. But for example 9999-10-31 is also valid..
                    return validationError
                }
                // End date most be greater than start date, else error
                if (new Date(epedDate) < new Date(epsdDate)) {
                    return {
                        code: "ID12.4",
                        message: "You cannot provide contributions for this schedule as the Earning Period Start Date is after the date you chose to stop using Nest."
                    }
                }

                return null;
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return validationError
            }
        },
        "BulkUpdateToNoContributionsDue": async (row, context: Context) => {
            const validationError = {
                code: "ID14.2",
                message: "Please check the details in these header record fields as they appear to be in the wrong format: Bulk Update to no Contributions Due. Please use either Y, N or blank."
            }
            try {
                const bulkUpdateToContriDueFlag = row[10];
                if (bulkUpdateToContriDueFlag === null || bulkUpdateToContriDueFlag === undefined || bulkUpdateToContriDueFlag === '') {
                    return null
                }
                const pattern = /^[YNyn]$/;
                if (!pattern.test(bulkUpdateToContriDueFlag)) { // Only format checking is done. But for example 9999-10-31 is also valid..
                    return validationError
                }
                return null;
            } catch (err) {
                context.log(`EmployerReferenceNumber failed :  error message ${err.message}`);
                return validationError
            }
        },
    },
    /**
     * Type 2B DB checks - verification
     */
    actualDataChecks: {
        // Checking for Emp refrence number
        "EmployerRefrenceNumber": async (_row, context: Context, actualRows: ContributionHeader[]) => {
            const validationError = {
                code: "ID12.0",
                message: "Please check the Employer Reference Number in the header record as it doesn't match what we're expecting for this schedule."
            }
            if (actualRows.length == 0) {
                context.log("Actul data check  failed for Employer Refrence Number, No records found")
                return validationError;
            }
            return null;
        },
        // Checking earning period end date
        "EPED": async (row, context: Context, actualRows: ContributionHeader[]) => {
            const validationError = {
                code: "ID12.1",
                message: "Please check the Earnings Period End Date as it doesn't match what we're expecting for this schedule."
            }
            const filterRow = actualRows.filter((data: any) => (data.earningPeriodEndDate == row[3]))
            if (filterRow.length == 0) {
                context.log("Actul data check  failed for Earnings Period End Date, No records found")
                return validationError;
            }
            return null;
        },
        // Checking payment source and earning period end date
        "PaymentSource": async (row, context: Context, actualRows: ContributionHeader[]) => {
            const validationError = {
                code: "ID12.2",
                message: "Please check the Payment Source name in the header record as it doesn't match what we're expecting for this schedule. Note, this field is case sensitive."
            }
            const filterRow = actualRows.filter((data: any) => (data.earningPeriodEndDate == row[3] && data.paymentSourceName == row[4]))
            if (filterRow.length == 0) {
                context.log("Actul data check  failed for Earnings Period End Date & Payment Source, No records found")
                return validationError;
            }
            return null;
        },
        // Checking Period Frequency, payment source and earning period end date
        "PayPeriodFrequency": async (row, context: Context, actualRows: ContributionHeader[]) => {
            const pddDate = row[8];
            const epsdDate = row[9];
            const validationError = {
                code: "ID12.3",
                message: "Please check the Pay Period Frequency in the header record as it doesn't match what we're expecting for this schedule."
            }
            const filterRow = actualRows.filter((data: any) => (data.earningPeriodEndDate == row[3] && data.paymentSourceName == row[4] && data.paymentFrequencyDesc.toLowerCase() == row[6].toLowerCase()))
            if (filterRow.length == 0) {
                context.log("Actul data check  failed for Earnings Period End Date, payment source & pay period frequency, No records found")
                return validationError;
            } else if(filterRow.length > 1 && (pddDate === "" || epsdDate === "")){
                return {
                    code: "ID16.0",
                    message: "We are unable to identify the Contribution Schedule this file is being uploaded for. Please provide the Payment Due Date and the Earnings Period Start Date to help us identify the Contribution Schedule you wish to upload the file for."
                }
            }
            return null;
        },
        // Checking PDD, Period Frequency, payment source and earning period end date
        "PDD": async (row, context: Context, actualRows: ContributionHeader[]) => {
            const validationError = {
                code: "ID15.0",
                message: "Please check the Payment Due Date in this file as it doesn't match what we're expecting for this schedule. The date values must match those in the Contribution Schedule held online."
            }
            const pddDate = row[8];
            const epsdDate = row[9];
            if (pddDate === "") {
                return null
            }
            const filterRow = actualRows.filter((data: any) => (data.earningPeriodEndDate == row[3] &&
                data.paymentSourceName == row[4] &&
                data.paymentFrequencyDesc.toLowerCase()  == row[6].toLowerCase()  &&
                data.paymentDueDate == pddDate))
            if (filterRow.length == 0) {
                context.log("Actul data check  failed for Payment Due Date, Earnings Period End Date, payment source & pay period frequency, No records found")
                return validationError;
            } else if(filterRow.length > 1 && epsdDate === ""){
                return {
                    code: "ID16.1",
                    message: "We are unable to identify the Contribution Schedule this file is being uploaded for. Please provide the Earning Period Start Date to help us identify the Contribution Schedule you wish to upload the file for"
                }
            }
            return null;
        },
        // Checking EPSD, Period Frequency, payment source and earning period end date
        "EPSD": async (row, context: Context, actualRows: ContributionHeader[]) => {
            const validationError = {
                code: "ID15.1",
                message: "Please check the Earning Period Start Date in this file as it doesn't match what we're expecting for this schedule."
            }
            const epsdDate = row[9];
            if (epsdDate === "") {
                return null
            }
            const filterRow = actualRows.filter((data: any) => (data.earningPeriodEndDate == row[3] &&
                data.paymentSourceName == row[4] &&
                data.paymentFrequencyDesc.toLowerCase() == row[6].toLowerCase() &&
                data.earningPeriodStartDate == epsdDate))
            if (filterRow.length == 0) {
                context.log("Actul data check  failed for Earning Period Start Date, Earnings Period End Date, payment source & pay period frequency, No records found")
                return validationError;
            } else if(filterRow.length > 1 && epsdDate === ""){
                return {
                    code: "ID16.2",
                    message: "We are unable to identify the Contribution Schedule this file is being uploaded for. Please provide the Payment Due Date to help us identify the Contribution Schedule you wish to upload the file for"
                }
            }
            return null;
        },

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
    executeRulesOneByOne: async function (row, context: Context, callback: Function, errors: Array<any>) {
        for (const key in Type2BValidations.rules) {
            const validationFunc = Type2BValidations.rules[key];
            const validationErrors = await validationFunc(row, context);
            if (validationErrors) {
                errors.push(validationErrors)
            }
        }
        return errors;
    },

    /**
     * Actual data verifications
     * @param row
     * @param context
     * @param callback
     * @returns 
     */
    actualDataVerifications: async function (row, context: Context, callback: Function, errors: Array<any>) {
        // errors present already, no need DB verification
        if(errors.length > 0){
            return errors
        }
        
        // Get Actual data based employer refer
        const actualRows: ContributionHeader[] = await ContributionHeader.findAll({
            where: { employerNestId: row[1] }
        });

        // Run Data verification checks
        for (const key in Type2BValidations.actualDataChecks) {
            const validationFunc = Type2BValidations.actualDataChecks[key];
            const validationErrors = await validationFunc(row, context, actualRows);
            if (validationErrors) {
                errors.push(validationErrors)
            }
        }
        return errors;
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
        let errorMessages = [];

        return new Promise(async function (resolve, reject) {
            try {
                readStream
                    .pipe(csvf.parse<any, any>({
                        ignoreEmpty: true,
                    }))
                    .validate(async (row: any, cb) => {
                        currentRowIndex++
                        if (currentRowIndex === 0) { // Header Row
                            errorMessages = await Type2BValidations.executeRulesOneByOne(row, context, cb, errorMessages);
                            errorMessages = await Type2BValidations.actualDataVerifications(row, context, cb, errorMessages);
                        } else { // D & T Row checks
                            countDRows = Type2BValidations.isRowDValidation(row, countDRows)
                            totalRecordsInTRow = Type2BValidations.getRowTTotalRecordCount(row)
                            const pattern = /^[\d+]$/;
                            if (!pattern.test(totalRecordsInTRow.toString())) {
                                const error = {
                                    code: "ID9.0",
                                    message: "The number of detail records in your file has not been specified. Please ensure the number of records in your file is specified in the trailer record."
                                }
                                errorMessages.push(error);
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
                        context.log(`Error Type 2B : ${e.message}`);
                        const error = {
                            code: "ID9999",
                            message: "Someting went wrong"
                        }
                        errorMessages.push(error);
                        reject(errorMessages);
                    })
                    .on('end', (_e) => {
                        // Total D rows in file and T row total records checking
                        if (totalRecordsInTRow !== countDRows) {
                            const error = {
                                code: "ID9.1",
                                message: "The number of detail records in your file is different to the number specified in the trailer record. Please check the trailer record matches the number of detail records contained in your file."
                            }
                            errorMessages.push(error);
                            reject(errorMessages);
                            return;
                        } else if (errorMessages.length > 0){
                            reject(errorMessages);
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
