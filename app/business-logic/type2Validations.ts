import { Context } from "@azure/functions";
import * as csvf from "fast-csv";
import { ContributionHeader } from "../models";
import { CommonContributionDetails } from ".";

const Type2Validations = {
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
    if (row[0] !== "H") {
      return {
        code: "ID5",
        message:
          "Please ensure that the first record in your file is marked 'H', to show that it's the header.",
      };
    }

    if (row[row.length - 1].toUpperCase() === "Y") {
      return {
        code: "ID8",
        message:
          "There are no detail records in your file. Please ensure there is at least one detail record identified with a 'D', between the header and trailer",
      };
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
    if (row[0] === "D") {
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
    return row[0] === "T";
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
      const validationError = {
        code: "ID10.0",
        message:
          "Please ensure your file contains the Employer Reference Number in the header record.",
      };
      try {
        const empRefNo = row.employerReferenceNumber;
        if (CommonContributionDetails.isNullOrEmpty(empRefNo)) {
          return validationError;
        }
        const pattern = /^(EMP)(\d{9})$/;
        if (!pattern.test(empRefNo)) {
          return {
            code: "ID13.0",
            message:
              "Please check the Employer Reference Number in the header record is in a valid format. Note, the prefix (before numerical digits) should be EMP.",
          };
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
    ProcessType: async (row) => {
      const validationError = {
        code: "ID10.1",
        message:
          "Please ensure your file contains the Process type in the header record.",
      };
      try {
        const processType = row.processType;
        if (CommonContributionDetails.isNullOrEmpty(processType)) {
          return validationError;
        }
        if (processType !== "CS") {
          return {
            code: "ID13.1",
            message:
              "Please check the details in the header record field Process type is in a valid format and the text is exactly as shown here: CS - Contribution Schedule.",
          };
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
    EarningsPeriodEndDate: async (row) => {
      const validationError = {
        code: "ID10.2",
        message:
          "Please ensure your file contains the EPED in the header record.",
      };
      try {
        const epedDate = row.earningPeriodEndDate;
        if (CommonContributionDetails.isNullOrEmpty(epedDate)) {
          return validationError;
        }
        if (!CommonContributionDetails.isValidateDate(epedDate)) {
          // Only format checking is done. But for example 9999-10-31 is also valid..
          return {
            code: "ID13.2",
            message:
              "Please check the details in the header record field as they appear to be in the wrong format: EPED. Please format dates in this field as YYYY-MM-DD.",
          };
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
    PaymentSource: async (row) => {
      const validationError = {
        code: "ID10.3",
        message:
          "Please ensure your file contains the Payment Source in the header record.",
      };
      try {
        const paymentSource = row.paymentSource;
        if (CommonContributionDetails.isNullOrEmpty(paymentSource)) {
          return validationError;
        }
        const pattern =
          /^(\d|[a-zA-Z])[A-Za-z\d"'#$%&@=?:\.\+\*\-/\\\(\)\[\]\{\}]+$/;
        if (!pattern.test(paymentSource)) {
          return {
            code: "ID13.3",
            message:
              "Please check the details in these header record field as it appears to be in the wrong format: Payment Source. Note, the Payment Source must begin with an alphanumerical character.",
          };
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
    PayPeriodFrequency: async (row) => {
      const validationError = {
        code: "ID10.4",
        message:
          "Please ensure your file contains the Pay Period Frequency in the header record.",
      };
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
          return {
            code: "ID13.4",
            message:
              "Please check the details in these header record fields as they appear to be in the wrong format: Pay Period Frequency. Note, the Pay Period Frequency has to exactly match one of the following: weekly, tax weekly, fortnightly, tax fortnightly, 4 weekly, tax 4 weekly, monthly, tax monthly.",
          };
        }
        return null;
      } catch (err) {
        return validationError;
      }
    },
    PaymentDueDate: async (row) => {
      const validationError = {
        code: "ID14.3",
        message:
          "Please check the details in the header record field as they appear to be in the wrong format: PDD. Please format dates in this field as YYYY-MM-DD.",
      };
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
      const validationError = {
        code: "ID14.4",
        message:
          "Please check the details in the header record field as they appear to be in the wrong format: EPSD. Please format dates in this field as YYYY-MM-DD.",
      };
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
          return {
            code: "ID12.4",
            message:
              "You cannot provide contributions for this schedule as the Earning Period Start Date is after the date you chose to stop using Nest.",
          };
        }

        return null;
      } catch (err) {
        return validationError;
      }
    },
    BulkUpdateToNoContributionsDue: async (row) => {
      const validationError = {
        code: "ID14.2",
        message:
          "Please check the details in these header record fields as they appear to be in the wrong format: Bulk Update to no Contributions Due. Please use either Y, N or blank.",
      };
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
      const validationError = {
        code: "ID12.0",
        message:
          "Please check the Employer Reference Number in the header record as it doesn't match what we're expecting for this schedule.",
      };
      if (actualRows.length == 0) {
        context.log(
          "Actul data check  failed for Employer Refrence Number, No records found"
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
      const validationError = {
        code: "ID12.1",
        message:
          "Please check the Earnings Period End Date as it doesn't match what we're expecting for this schedule.",
      };
      const filterRow = actualRows.filter(
        (data: any) => data.earningPeriodEndDate == row.earningPeriodEndDate
      );
      if (filterRow.length == 0) {
        context.log(
          "Actul data check  failed for Earnings Period End Date, No records found"
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
      const validationError = {
        code: "ID12.2",
        message:
          "Please check the Payment Source name in the header record as it doesn't match what we're expecting for this schedule. Note, this field is case sensitive.",
      };
      const filterRow = actualRows.filter(
        (data: any) =>
          data.earningPeriodEndDate == row.EPED &&
          data.paymentSourceName == row.paymentSource
      );
      if (filterRow.length == 0) {
        context.log(
          "Actul data check  failed for Earnings Period End Date & Payment Source, No records found"
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
      const validationError = {
        code: "ID12.3",
        message:
          "Please check the Pay Period Frequency in the header record as it doesn't match what we're expecting for this schedule.",
      };
      const filterRow = actualRows.filter(
        (data: any) =>
          data.earningPeriodEndDate == row.EPED &&
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
        return {
          code: "ID16.0",
          message:
            "We are unable to identify the Contribution Schedule this file is being uploaded for. Please provide the Payment Due Date and the Earnings Period Start Date to help us identify the Contribution Schedule you wish to upload the file for.",
        };
      }
      return null;
    },
    // Checking PDD, Period Frequency, payment source and earning period end date
    PaymentDueDate: async (
      row,
      context: Context,
      actualRows: ContributionHeader[]
    ) => {
      const validationError = {
        code: "ID15.0",
        message:
          "Please check the Payment Due Date in this file as it doesn't match what we're expecting for this schedule. The date values must match those in the Contribution Schedule held online.",
      };
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
        return {
          code: "ID16.1",
          message:
            "We are unable to identify the Contribution Schedule this file is being uploaded for. Please provide the Earning Period Start Date to help us identify the Contribution Schedule you wish to upload the file for",
        };
      }
      return null;
    },
    // Checking EPSD, Period Frequency, payment source and earning period end date
    EarningsPeriodStartDate: async (
      row,
      context: Context,
      actualRows: ContributionHeader[]
    ) => {
      const validationError = {
        code: "ID15.1",
        message:
          "Please check the Earning Period Start Date in this file as it doesn't match what we're expecting for this schedule.",
      };
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
        return {
          code: "ID16.2",
          message:
            "We are unable to identify the Contribution Schedule this file is being uploaded for. Please provide the Payment Due Date to help us identify the Contribution Schedule you wish to upload the file for",
        };
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
    callback: Function,
    errors: Array<any>
  ) {
    try {
      for (const key in rules) {
        const validationFunc = rules[key];
        const errMsg = await validationFunc(row);
        if (errMsg) {
          errors.push(errMsg);
        }
      }
      return callback(null, true, null);
    } catch (error) {
      throw new Error(
        JSON.stringify({
          code: "ID9999",
          message: "Something went wrong",
        })
      );
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
    errors: Array<any>
  ) {
    // errors present already, no need DB verification
    if (errors.length > 0) {
      return errors;
    }

    // Run Data verification checks
    for (const key in Type2Validations.actualDataChecks) {
      const validationFunc = Type2Validations.actualDataChecks[key];
      const validationErrors = await validationFunc(row, context, actualRows);
      if (validationErrors) {
        errors.push(validationErrors);
      }
    }
    return errors;
  },

  start: async function (
    readStream: NodeJS.ReadableStream,
    context: Context
  ): Promise<any> {
    let trailerFound = false;
    let headers;
    let invalidResults = [];
    let results = [];
    let countDRows = 0;
    let currentRowIndex = -1; // when process start it will increament
    let errorMessage = { code: "", message: "" };
    let errorMessages = [];
    let totalRecordsInTRow = 0;
    let header_id;
    let headerObject;

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
              let errMsg;
              currentRowIndex++;
              if (trailerFound) {
                errMsg = `Please ensure that the last record in your file is marked 'T', to show that it's the trailer.`;
                errorMessage = {
                  code: "ID6",
                  message: errMsg,
                };
                errorMessages.push(errorMessage);
                return cb(null, true, null);
              }

              if (currentRowIndex === 0) {
                const headerRowError = Type2Validations.rowHValidation(
                  row,
                  currentRowIndex
                );
                if (headerRowError !== null) {
                  errorMessage = headerRowError;
                  errorMessages.push(errorMessage);
                  return cb(null, true, null);
                }
                headerObject = CommonContributionDetails.getHeaderObject(row);
                // Type 2B
                Type2Validations.executeRulesOneByOne(
                  Type2Validations.rulesType2B,
                  headerObject,
                  cb,
                  errorMessages
                );
                return;
              }
              trailerFound = Type2Validations.isRowTValidation(row);
              if (!trailerFound) {
                // Checking from T Row
                const previousCount = countDRows;
                countDRows = Type2Validations.isRowDValidation(row, countDRows);
                if (previousCount === countDRows) {
                  errMsg =
                    "Unknown record types found. Please ensure that all records, between the header and trailer, are marked with the letter 'D'. This tells us they contain member details.";
                  errorMessage = {
                    code: "ID7",
                    message: errMsg,
                  };
                  errorMessages.push(errorMessage);
                  return cb(null, true, null);
                }
              }

              if (trailerFound) {
                if (countDRows === 0) {
                  errMsg =
                    "There are no detail records in your file. Please ensure there is at least one detail record identified with a 'D', between the header and trailer, if you're unsure. ";
                  errorMessage = {
                    code: "ID8",
                    message: errMsg,
                  };
                  errorMessages.push(errorMessage);
                  return cb(null, true, null);
                }

                // Type 2B
                totalRecordsInTRow =
                  Type2Validations.getRowTTotalRecordCount(row);
                if (totalRecordsInTRow != -1) {
                  const pattern = /^((-)?[\d]+)$/;
                  if (!pattern.test(totalRecordsInTRow.toString())) {
                    let errMsg =
                      "The number of detail records in your file has not been specified. Please ensure the number of records in your file is specified in the trailer record.";
                    const error = {
                      code: "ID9.0",
                      message: errMsg,
                    };
                    errorMessages.push(error);
                    return cb(null, true, null);
                  }
                }
                if (totalRecordsInTRow !== countDRows) {
                  const error = {
                    code: "ID9.1",
                    message:
                      "The number of detail records in your file is different to the number specified in the trailer record. Please check the trailer record matches the number of detail records contained in your file.",
                  };
                  errorMessages.push(error);
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
            context.log("error", e);
          })
          .on("end", async (_e) => {
            if (!trailerFound) {
              let errMsg =
                "Please ensure that the last record in your file is marked 'T', to show that it's the trailer.";
              const errorMessage = {
                code: "ID6",
                message: errMsg,
              };
              errorMessages.push(errorMessage);
            }
            if (headerObject) {
              let records = await Type2Validations.getHeaderRecords(
                headerObject
              );
              if (records.length) {
                header_id = records[0]["contribHeaderId"];
              }
              await Type2Validations.actualDataVerifications(
                headerObject,
                records,
                context,
                errorMessages
              );
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
