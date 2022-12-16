import { Context } from "@azure/functions";
import * as csvf from "fast-csv";
import { ContributionHeader } from "../models";
import {
  CommonContributionDetails,
  EnumRowDColumns,
  EnumRowHColumns,
  EnumRowTColumns,
} from ".";

const Type2Validations = {
  
  processType: 'CS',

  /**
   * This is validate H row (first row of the file)
   * @param row
   * @param callback
   * @returns
   */
  rowHValidation: function (row, index) {
    if (index !== 0) {
      return null;
    }
    if (
      CommonContributionDetails.getRowColumn(
        row,
        EnumRowHColumns.RECORD_IDENTIFIER
      ) !== "H"
    ) {
      return "ID5"
    }

    if (
      CommonContributionDetails.getRowColumn(
        row,
        EnumRowHColumns.BULK_UPDATE_TO_NO_CONTRIBUTIONS_DUE
      ).toUpperCase() === "Y"
    ) {
      return "ID8";
    }

    return null;
  },

  /**
   * This will check current row is D row and return count of D rows back
   * @param row
   * @param countDRows
   * @returns return D rows count
   */
  isRowDValidation: function (row, countDRows: number) {
    if (
      CommonContributionDetails.getRowColumn(
        row,
        EnumRowDColumns.RECORD_IDENTIFIER
      ) === "D"
    ) {
      countDRows = countDRows + 1;
    }
    return countDRows;
  },

  /**
   * This will return true or false based on if row is T row
   * @param row
   * @returns true or false
   */

  isRowTValidation: function (row) {
    return (
      CommonContributionDetails.getRowColumn(
        row,
        EnumRowTColumns.RECORD_IDENTIFIER
      ) === "T"
    );
  },
  /**
   * Check value is null, undefined or empty
   * @param value
   * @returns bool if value is null or empty return true
   */
  isNullOrEmpty: function (value) {
    if (value == undefined || value == null || value == "") {
      return true;
    } else {
      return false;
    }
  },
  /**
   * Type 2B rules
   */
  rulesType2B: {
    EmployerReferenceNumber: async (row: any) => {
      const validationError = "ID10.0";
      try {
        const empRefNo = row.employerReferenceNumber;
        if (CommonContributionDetails.isNullOrEmpty(empRefNo)) {
          return validationError;
        }
        const pattern = /^(EMP)(\d{9})$/;
        if (!pattern.test(empRefNo)) {
          return "ID13.0";
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
    ProcessType: async (row) => {
      const validationError = "ID10.1";
      try {
        const processType = row.processType;
        if (CommonContributionDetails.isNullOrEmpty(processType)) {
          return validationError;
        }
        if (!(processType == "CS" || processType=='CC')) {
          return "ID13.1";
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
    EarningsPeriodEndDate: async (row) => {
      const validationError = "ID10.2";
      try {
        const epedDate = row.earningPeriodEndDate;
        if (CommonContributionDetails.isNullOrEmpty(epedDate)) {
          return validationError;
        }
        if (!CommonContributionDetails.isValidateDate(epedDate)) {
          // Only format checking is done. But for example 9999-10-31 is also valid..
          return "ID13.2";
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
    PaymentSource: async (row) => {
      const validationError = "ID10.3";
      try {
        const paymentSource = row.paymentSource;
        if (CommonContributionDetails.isNullOrEmpty(paymentSource)) {
          return validationError;
        }
        const pattern = /^(\d|[a-zA-Z])[A-Za-z\d"'#$%&@=?:\.\+\*\-/\\\(\)\[\]\{\}]+$/;
        if (!pattern.test(paymentSource)) {
          return "ID13.3";
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
    PayPeriodFrequency: async (row) => {
      const validationError = "ID10.4"; 
      try {
        const payPeriod = row.payPeriodFrequency;
        if (CommonContributionDetails.isNullOrEmpty(payPeriod)) {
          return validationError;
        }
        const frequencyTypes = [
          "weekly",
          "tax weekly",
          "fortnightly",
          "tax fortnightly",
          "4 weekly",
          "tax 4 weekly",
          "monthly",
          "tax monthly",
        ];
        if (frequencyTypes.indexOf(payPeriod.toLowerCase()) === -1) {
          return "ID13.4";
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
    PaymentDueDate: async (row) => {
      const validationError = "ID14.3"; 
      try {
        const pddDate = row.paymentDueDate;
        if (pddDate === "") {
          return null;
        }
        if (!CommonContributionDetails.isValidateDate(pddDate)) {
          // Only format checking is done. But for example 9999-10-31 is also valid..
          return validationError;
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
    EarningsPeriodStartDate: async (row) => {
      const validationError = "ID14.4";
      try {
        const epedDate = row.earningPeriodEndDate;
        const epsdDate = row.earningPeriodStartDate;
        if (epsdDate === "") {
          return null;
        }
        if (!CommonContributionDetails.isValidateDate(epsdDate)) {
          // Only format checking is done. But for example 9999-10-31 is also valid..
          return validationError;
        }
        // End date most be greater than start date, else error
        if (new Date(epedDate) < new Date(epsdDate)) {
          return "ID12.4";
        }

        return null;
      } catch (err) {
        return validationError;
      }
    },
    BulkUpdateToNoContributionsDue: async (row) => {
      const validationError = "ID14.2"; 
      try {
        const bulkUpdateToContriDueFlag = row.bulkUpdateToNoContributionsDue;
        if (
          bulkUpdateToContriDueFlag === null ||
          bulkUpdateToContriDueFlag === undefined ||
          bulkUpdateToContriDueFlag === ""
        ) {
          return null;
        }
        const pattern = /^[YNyn]$/;
        if (!pattern.test(bulkUpdateToContriDueFlag)) {
          // Only format checking is done. But for example 9999-10-31 is also valid..
          return validationError;
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
  },

  /**
   * Type 2B DB checks - verification
   */
  actualDataChecks: {
    // Checking for Emp refrence number
    EmployerRefrenceNumber: async (
      _row,
      context: Context,
      actualRows: ContributionHeader[]
    ) => {
      const validationError = "ID12.0";
      if (actualRows.length == 0) {
        context.log(
          "Actual data check  failed for Employer Refrence Number, No records found"
        );
        return validationError;
      }
      return null;
    },
    // Checking earning period end date
    EarningsPeriodEndDate: async (
      row,
      context: Context,
      actualRows: ContributionHeader[]
    ) => {
      const validationError = "ID12.1"; 
      const filterRow = actualRows.filter(
        (data: any) => data.earningPeriodEndDate == row.earningPeriodEndDate
      );
      if (filterRow.length == 0) {
        context.log(
          "Actual data check  failed for Earnings Period End Date, No records found"
        );
        return validationError;
      }
      return null;
    },
    // Checking payment source and earning period end date
    PaymentSource: async (
      row,
      context: Context,
      actualRows: ContributionHeader[]
    ) => {
      const validationError = "ID12.2";
      const filterRow = actualRows.filter(
        (data: any) =>
          data.earningPeriodEndDate == row.earningPeriodEndDate &&
          data.paymentSourceName == row.paymentSource
      );
      if (filterRow.length == 0) {
        context.log(
          "Actual data check  failed for Earnings Period End Date & Payment Source, No records found"
        );
        return validationError;
      }
      return null;
    },
    // Checking Period Frequency, payment source and earning period end date
    PayPeriodFrequency: async (
      row,
      context: Context,
      actualRows: ContributionHeader[]
    ) => {
      const pddDate = row.paymentDueDate;
      const epsdDate = row.earningPeriodStartDate;
      const validationError = "ID12.3";
      const filterRow = actualRows.filter(
        (data: any) =>
          data.earningPeriodEndDate == row.earningPeriodEndDate &&
          data.paymentSourceName == row.paymentSource &&
          data.paymentFrequencyDesc.toLowerCase() ==
            row.payPeriodFrequency.toLowerCase()
      );
      if (filterRow.length == 0) {
        context.log(
          "Actul data check  failed for Earnings Period End Date, payment source & pay period frequency, No records found"
        );
        return validationError;
      } else if (filterRow.length > 1 && (pddDate === "" || epsdDate === "")) {
        return "ID16.0";
      }
      return null;
    },
    // Checking PDD, Period Frequency, payment source and earning period end date
    PaymentDueDate: async (
      row,
      context: Context,
      actualRows: ContributionHeader[]
    ) => {
      const validationError = "ID15.0";
      const pddDate = row.paymentDueDate;
      const epsdDate = row.earningPeriodStartDate;
      if (pddDate === "") {
        return null;
      }
      const filterRow = actualRows.filter(
        (data: any) =>
          data.earningPeriodEndDate == row.earningPeriodEndDate &&
          data.paymentSourceName == row.paymentSource &&
          data.paymentFrequencyDesc.toLowerCase() ==
            row.payPeriodFrequency.toLowerCase() &&
          data.paymentDueDate == pddDate
      );
      if (filterRow.length == 0) {
        context.log(
          "Actul data check  failed for Payment Due Date, Earnings Period End Date, payment source & pay period frequency, No records found"
        );
        return validationError;
      } else if (filterRow.length > 1 && epsdDate === "") {
        return "ID16.1";
      }
      return null;
    },
    // Checking EPSD, Period Frequency, payment source and earning period end date
    EarningsPeriodStartDate: async (
      row,
      context: Context,
      actualRows: ContributionHeader[]
    ) => {
      const validationError = "ID15.1"; 
      const epsdDate = row.earningPeriodStartDate;
      if (epsdDate === "") {
        return null;
      }
      const filterRow = actualRows.filter(
        (data: any) =>
          data.earningPeriodEndDate == row.earningPeriodEndDate &&
          data.paymentSourceName == row.paymentSource &&
          data.paymentFrequencyDesc.toLowerCase() ==
            row.payPeriodFrequency.toLowerCase() &&
          data.earningPeriodStartDate == epsdDate
      );
      if (filterRow.length == 0) {
        context.log(
          "Actul data check  failed for Earning Period Start Date, Earnings Period End Date, payment source & pay period frequency, No records found"
        );
        return validationError;
      } else if (filterRow.length > 1 && epsdDate === "") {
        return "ID16.2";
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
    if (
      CommonContributionDetails.getRowColumn(
        row,
        EnumRowTColumns.RECORD_IDENTIFIER
      ) === "T"
    ) {
      return Number(
        CommonContributionDetails.getRowColumn(
          row,
          EnumRowTColumns.TOTAL_RECORDS
        )
      );
    }
    
    return -1;
  },

  /**
   * Validate row's columns one by one with rules defined
   * @param row
   * @param context
   * @param callback
   * @returns
   */
  executeRulesOneByOne: async function (
    rules: any,
    row,
    rowNumber: any,
    errors: Array<any>, 
    rdErrorTypes,
    contributionHeaderId,
    context, 
  ) {
    try {
      for (const key in rules) {
        const validationFunc = rules[key];
        const errorCode = await validationFunc(row, context, contributionHeaderId);
        if (errorCode) {
          let validationErrors = CommonContributionDetails.getRdErrorType(
            rdErrorTypes,
            errorCode, 
          );
          validationErrors.lineNumber = rowNumber;
          errors.push(validationErrors);
        }
      }
      return;
    } catch (error) {
      throw error;
    }
  },

  getHeaderRecords: async function (row) {
    try {
      const whereCondition = {
        employerNestId: row.employerReferenceNumber,
        earningPeriodEndDate: new Date(row.earningPeriodEndDate),
        paymentSourceName: row.paymentSource,
        paymentFrequencyDesc: row.payPeriodFrequency,
      };
      if (row.paymentDueDate) {
        whereCondition["paymentDueDate"] = new Date(row.paymentDueDate);
      }
      if (row.earningPeriodStartDate) {
        whereCondition["earningPeriodStartDate"] = new Date(
          row.earningPeriodStartDate
        );
      }

      // Get Actual data based employer refer
      const actualRows: ContributionHeader[] = await ContributionHeader.findAll(
        {
          where: whereCondition,
        }
      );
      return actualRows;
    } catch (error) {
      throw new Error("Getting records failed");
    }
  },

  /**
   * Actual data verifications
   * @param row
   * @param context
   * @param callback
   * @returns
   */

  actualDataVerifications: async function (
    row,
    actualRows,
    context: Context,
    errors: Array<any>, 
    rdErrorTypes
  ) {
    // errors present already, no need DB verification
    if (errors.length > 0) {
      return errors;
    }

    // Run Data verification checks
    for (const key in Type2Validations.actualDataChecks) {
      const validationFunc = Type2Validations.actualDataChecks[key];
      const errorCode = await validationFunc(row, context, actualRows);
      if (errorCode) {
        let validationError = CommonContributionDetails.getRdErrorType(
          rdErrorTypes,
          errorCode, 
        );
        validationError.lineNumber = 0;
        errors.push(validationError);
      }
    }
    return errors;
  },

  start: async function (
    readStream: NodeJS.ReadableStream,
    context: Context, 
    rdErrorTypes, 
    reqProcessType
  ): Promise<any> {
    let trailerFound = false;
    let headers;
    let invalidResults = [];
    let results = [];
    let countDRows = 0;
    let currentRowIndex = -1; // when process start it will increament
    // let errorMessage = { code: "", message: "" };
    let errorMessages = [];
    let totalRecordsInTRow = 0;
    let header_id;
    let headerObject;
    let contributionHeaderId;

    return new Promise(function (resolve, reject) {
      try {
        readStream
          .pipe(
            csvf.parse<any, any>({
              ignoreEmpty: true,
            })
          )
          .validate((row: any, cb) => {
            try {
              currentRowIndex++;
              if (trailerFound) {
                let errorCode = "ID6";
                let validationErrors = CommonContributionDetails.getRdErrorType(
                  rdErrorTypes,
                  errorCode
                );
                validationErrors.lineNumber = currentRowIndex;
                errorMessages.push(validationErrors);
                return cb(null, true, null);
              }

              if (currentRowIndex === 0) {
                const headerRowError = Type2Validations.rowHValidation(
                  row,
                  currentRowIndex
                );
                if (headerRowError !== null) {
                  let validationErrors = CommonContributionDetails.getRdErrorType(
                    rdErrorTypes,
                    headerRowError
                  );
                  validationErrors.lineNumber = currentRowIndex;
                  errorMessages.push(validationErrors);
                  return cb(null, true, null);
                }
                headerObject = CommonContributionDetails.getHeaderObject(row);
                if(headerObject.processType!= reqProcessType){
                  const errorMessage ="Process type in file doesn't match the request process type";
                  return cb(new Error(errorMessage), false, errorMessage)
                }
                // Type 2B
                Type2Validations.executeRulesOneByOne(
                  Type2Validations.rulesType2B,
                  headerObject,
                  currentRowIndex,
                  errorMessages, 
                  rdErrorTypes,
                  contributionHeaderId, 
                  context,
                );
                return  cb(null, true, null);
              }
              trailerFound = Type2Validations.isRowTValidation(row);
              if (!trailerFound) {
                // Checking from T Row
                const previousCount = countDRows;
                countDRows = Type2Validations.isRowDValidation(row, countDRows);
                if (previousCount === countDRows) {
                  
                  let validationErrors = CommonContributionDetails.getRdErrorType(
                    rdErrorTypes,
                    "ID7"
                  );
                  validationErrors.lineNumber = currentRowIndex;
                  errorMessages.push(validationErrors);
                  return cb(null, true, null);
                }
              }

              if (trailerFound) {
                if (countDRows === 0) {
                  let validationErrors = CommonContributionDetails.getRdErrorType(
                    rdErrorTypes,
                    "ID8"
                  );
                  validationErrors.lineNumber = currentRowIndex;
                  errorMessages.push(validationErrors);
                  return cb(null, true, null);
                }

                // Type 2B
                totalRecordsInTRow =
                  Type2Validations.getRowTTotalRecordCount(row);
                if (totalRecordsInTRow != -1) {
                  const pattern = /^((-)?[\d]+)$/;
                  if (!pattern.test(totalRecordsInTRow.toString())) {
                    let validationErrors = CommonContributionDetails.getRdErrorType(
                      rdErrorTypes,
                      "ID9.0"
                    );
                    validationErrors.lineNumber = currentRowIndex;
                    errorMessages.push(validationErrors);
                    return cb(null, true, null);
                  }
                }
                if (totalRecordsInTRow !== countDRows) {
                  let validationErrors = CommonContributionDetails.getRdErrorType(
                    rdErrorTypes,
                    "ID9.1"
                  );
                  validationErrors.lineNumber = currentRowIndex;
                  errorMessages.push(validationErrors);
                  return cb(null, true, null);
                }
              }

              return cb(null, true, null);
            } catch (error) {
              return cb(error, false, error.message);
            }
          })
          .on("headers", (row) => {
            headers = row;
          })
          .on("data", (row) => {
            results.push(row);
          })
          .on("data-invalid", (row, rowNumber) => {
            invalidResults.push(row);
            context.log(
              `Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}]`
            );
          })
          .on("error", (e) => {
            reject(e);
            // context.log("error", e);
          })
          .on("end", async (_e) => {
            if (!trailerFound) {
              
              let validationErrors = CommonContributionDetails.getRdErrorType(
                rdErrorTypes,
                "ID6"
              );
              validationErrors.lineNumber = currentRowIndex;
              errorMessages.push(validationErrors);
            }
            if (headerObject) {
              let records = await Type2Validations.getHeaderRecords(
                headerObject
              );
              if (!records.length) {
                let errorMessage = CommonContributionDetails.getRdErrorType(
                  rdErrorTypes,
                  "ID16.0"
                );
                errorMessages.push(errorMessage);
              }
              if(records.length){ 
               header_id = records[0]["contribHeaderId"];               
               await Type2Validations.actualDataVerifications(
                headerObject,
                records,
                context,
                errorMessages, 
                rdErrorTypes
              );
              }
            }

            if (errorMessages.length) {
              reject(errorMessages);
            }

            let data = {
              invalidResults: invalidResults,
              results: results,
              headers: headers,
              header_id: header_id,
            };
            resolve(data);
          });
      } catch (e) {
        reject(e);
      }
    });
  },
};

export default Type2Validations;
