import * as csvf from "fast-csv";
import { Context } from "@azure/functions";
import ErrorDetails from "../models/errorDetails";
import { File, FileHeaderMap, RDErrorType } from "../models";
import { v4 as uuidv4 } from "uuid";
import {
  FQSError,
  FQSErrorSummary,
  FQSRequestPayload,
} from "./fqsRequestPayload";
import { blobHelper } from "../utils";
import DocumentIndexHelper from "../utils/documentIndexHelper";

interface FileError {
  membContribDetlId?: string;
  errorFileId: string;
  errorTypeId: number;
  errorSequenceNum: number;
  sourceRecordId: number;
  errorCode: string;
  errorMessage: string;
  createdBy: string;
}

enum EnumRowHColumns {
  RECORD_IDENTIFIER = 0,
  EMPLOYER_REFERENCE_NUMBER = 1,
  PROCESS_TYPE = 2,
  EARNING_PERIOD_END_DATE = 3,
  PAYMENT_SOURCE = 4,
  PAYMENT_DUE_DATE = 5,
  PAY_PERIOD_FREQUENCY = 6,
  EARNING_PERIOD_START_DATE = 7,
  BULK_UPDATE_TO_NO_CONTRIBUTIONS_DUE = 8,
}

enum EnumRowDColumns {
  RECORD_IDENTIFIER = 0,
  FORE_NAME = 1,
  SURE_NAME = 2,
  NINO = 3,
  ALT_ID = 4,
  PENS_EARNINGS = 5,
  MEMB_LEAVE_EARNINGS = 6,
  EMPL_CONTRIAMT = 7,
  MEMB_CONTRIAMT = 8,
  MEMB_NON_PAY_REASON = 9,
  MEMB_NON_PAY_EFF_DATE = 10,
  NEW_GROUP_NAME = 11,
  NEW_GROUP_EFF_DATE = 12,
  NEW_PAYMENT_SOURCE_NAME = 13,
  NEW_GROUP_PENS_EARNINGS = 14,
  NEW_GROUP_EMPL_CONTRIAMT = 15,
  NEW_GROUP_MEMB_CONTRIAMT = 16,
  OPT_OUT_REF_NUM = 17,
  OPT_OUT_DECLARATION_FLAG = 18,
  SEC_ENROL_PENS_EARNINGS = 19,
  SEC_ENROL_EMPL_CONTRIAMT = 20,
  SEC_ENROL_MEMB_CONTRIAMT = 21,
}

enum EnumRowTColumns {
  RECORD_IDENTIFIER = 0,
  TOTAL_RECORDS = 1,
  VERSION_NUMBER = 2,
}

enum EnumScheduleMemberStatusCD {
  TO_BE_REVIEWED = "MCS1",
  ATTENTION_NEEDED = "CS2",
  READY_TO_SUBMIT = "MCS2",
}

interface Type2SaveResult {
  paidMembers: number;
  newMembers: number;
  isFailed: boolean;
}

const commonContributionDetails = {
  /**
   * It will return empty string or the value if column present
   * @param row - row data
   * @param columnIndex - columns index
   */
  getRowColumn(row, columnIndex) {
    if (row.length > columnIndex) {
      return row[columnIndex];
    }
    return "";
  },
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
  convertToContributionDetails: function (
    row,
    memDetailsRow,
    addExtraParams: boolean = false
  ) {
    // Currently this row index may change, this was done bcased on Contribution template - specification v1.9
    let customRow = {
      pensEarnings: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.PENS_EARNINGS
        ),
        memDetailsRow.EmployerReferenceNumber
      ),
      membLeaveEarnings: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.MEMB_LEAVE_EARNINGS
        ),
        memDetailsRow.membLeaveEarnings
      ),
      emplContriAmt: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.EMPL_CONTRIAMT
        ),
        memDetailsRow.emplContriAmt
      ),
      membContriAmt: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.MEMB_CONTRIAMT
        ),
        memDetailsRow.membContriAmt
      ),
      membNonPayReason: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.MEMB_NON_PAY_REASON
        ),
        memDetailsRow.membNonPayReason
      ),
      membNonPayEffDate: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.MEMB_NON_PAY_EFF_DATE
        )
          ? commonContributionDetails.getRowColumn(
              row,
              EnumRowDColumns.MEMB_NON_PAY_EFF_DATE
            )
          : commonContributionDetails.getRowColumn(
              row,
              EnumRowDColumns.NEW_GROUP_EFF_DATE
            ),
        memDetailsRow.membNonPayEffDate
      ),
      newGroupName: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.NEW_GROUP_NAME
        ),
        memDetailsRow.newGroupName
      ),
      newGroupEffDate: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.NEW_GROUP_EFF_DATE
        ),
        memDetailsRow.newGroupEffDate
      ),
      newPaymentSourceName: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.NEW_PAYMENT_SOURCE_NAME
        ),
        memDetailsRow.newPaymentSourceName
      ),
      newGroupPensEarnings: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.NEW_GROUP_PENS_EARNINGS
        ),
        memDetailsRow.newGroupPensEarnings
      ),
      newGroupEmplContriAmt: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.NEW_GROUP_EMPL_CONTRIAMT
        ),
        memDetailsRow.newGroupEmplContriAmt
      ),
      newGroupMembContriAmt: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.NEW_GROUP_MEMB_CONTRIAMT
        ),
        memDetailsRow.newGroupMembContriAmt
      ),
      optoutRefNum: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.OPT_OUT_REF_NUM
        ),
        memDetailsRow.optoutRefNum
      ),
      // in spec it was saying  bool and validation we need to check for Y.. not sure what will be true.. considering as Y only
      optoutDeclarationFlag: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.OPT_OUT_DECLARATION_FLAG
        ),
        memDetailsRow.optoutDeclarationFlag
      ),
      secEnrolPensEarnings: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.SEC_ENROL_PENS_EARNINGS
        ),
        memDetailsRow.secEnrolPensEarnings
      ),
      secEnrolEmplContriAmt: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.SEC_ENROL_EMPL_CONTRIAMT
        ),
        memDetailsRow.secEnrolEmplContriAmt
      ),
      secEnrolMembContriAmt: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.SEC_ENROL_MEMB_CONTRIAMT
        ),
        memDetailsRow.secEnrolMembContriAmt
      ),
    };

    // Force to upper case when not null
    if (
      !commonContributionDetails.isNullOrEmpty(customRow.optoutDeclarationFlag)
    ) {
      customRow.optoutDeclarationFlag =
        customRow.optoutDeclarationFlag.toUpperCase();
    }

    //Overwrite existing and add new for Type 2D validations only
    if (addExtraParams) {
      customRow["membChangeOfGroupDate"] =
        commonContributionDetails.getRowColumn(
          row,
          EnumRowDColumns.NEW_GROUP_EFF_DATE
        );
      customRow.membNonPayEffDate = commonContributionDetails.getRowColumn(
        row,
        EnumRowDColumns.MEMB_NON_PAY_EFF_DATE
      );
    }
    return customRow;
  },

  getHeaderObject: function (row: any) {
    return {
      employerReferenceNumber: commonContributionDetails.getRowColumn(
        row,
        EnumRowHColumns.EMPLOYER_REFERENCE_NUMBER
      ),
      processType: commonContributionDetails.getRowColumn(
        row,
        EnumRowHColumns.PROCESS_TYPE
      ),
      earningPeriodEndDate: commonContributionDetails.getRowColumn(
        row,
        EnumRowHColumns.EARNING_PERIOD_END_DATE
      ),
      paymentSource: commonContributionDetails.getRowColumn(
        row,
        EnumRowHColumns.PAYMENT_SOURCE
      ),
      payPeriodFrequency: commonContributionDetails.getRowColumn(
        row,
        EnumRowHColumns.PAY_PERIOD_FREQUENCY
      ),
      paymentDueDate: commonContributionDetails.getRowColumn(
        row,
        EnumRowHColumns.PAYMENT_DUE_DATE
      ),
      earningPeriodStartDate: commonContributionDetails.getRowColumn(
        row,
        EnumRowHColumns.EARNING_PERIOD_START_DATE
      ),
      bulkUpdateToNoContributionsDue: commonContributionDetails.getRowColumn(
        row,
        EnumRowHColumns.BULK_UPDATE_TO_NO_CONTRIBUTIONS_DUE
      ),
    };
  },

  getDetailObject: function (row: any) {
    let detailObj = commonContributionDetails.convertToContributionDetails(
      row,
      {},
      true
    );
    Object.assign(detailObj, {
      firstName: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(row, EnumRowDColumns.FORE_NAME),
        null
      ),
      lastName: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(row, EnumRowDColumns.SURE_NAME),
        null
      ),
      nino: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(row, EnumRowDColumns.NINO),
        null
      ),
      alternativeId: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(row, EnumRowDColumns.ALT_ID),
        null
      ),
    });
    return detailObj;
  },

  convertToContributionHeader: function (
    row,
    headerRow,
    addExtraParams: boolean = false
  ) {
    // Currently this row index may change, this was done bcased on Contribution template - specification v1.9
    let customRow = {
      employerReferenceNumber: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowHColumns.EMPLOYER_REFERENCE_NUMBER
        ),
        headerRow.employerReferenceNumber
      ),
      processType: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowHColumns.PROCESS_TYPE
        ),
        headerRow.processType
      ),
      earningPeriodEndDate: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowHColumns.EARNING_PERIOD_END_DATE
        ),
        headerRow.earningPeriodEndDate
      ),
      paymentSource: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowHColumns.PAYMENT_SOURCE
        ),
        headerRow.paymentSource
      ),
      payPeriodFrequency: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowHColumns.PAY_PERIOD_FREQUENCY
        ),
        headerRow.payPeriodFrequency
      ),
      paymentDueDate: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowHColumns.PAYMENT_DUE_DATE
        ),
        headerRow.paymentDueDate
      ),
      earningPeriodStartDate: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowHColumns.EARNING_PERIOD_START_DATE
        ),
        headerRow.earningPeriodStartDate
      ),
      bulkUpdateToNoContributionsDue: commonContributionDetails.getNonNullValue(
        commonContributionDetails.getRowColumn(
          row,
          EnumRowHColumns.BULK_UPDATE_TO_NO_CONTRIBUTIONS_DUE
        ),
        headerRow.bulkUpdateToNoContributionsDue
      ),
    };

    return customRow;
  },

  /**
   * is only Allowed Chars
   * @param value
   * @param isEmptyAllowed
   * @returns true/false
   */
  isOnlyAllowedChars(value: string, isEmptyAllowed: boolean = true) {
    if (commonContributionDetails.isNullOrEmpty(value) && isEmptyAllowed) {
      return true;
    }

    const pattern =
      /^(\d|[a-zA-Z])[A-Za-z\d"'#$%&@=?:\.\+\*\-/\\\(\)\[\]\{\}]+$/;
    return pattern.test(value);
  },

  /**
   * is only Alphanumerical
   * @param value
   * @param isEmptyAllowed
   * @returns true/false
   */
  isOnlyAlphanumerical(value: string, isEmptyAllowed: boolean = true) {
    if (commonContributionDetails.isNullOrEmpty(value) && isEmptyAllowed) {
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
    if (commonContributionDetails.isNullOrEmpty(value)) {
      return true;
    }
    const pattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (pattern.test(value)) {
      const values = value.split("-");
      const date = new Date(value);
      if (date.getDate() === parseInt(values[2])) {
        return true;
      }
    }

    return false;
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
  isVaildNumber(value: string, isEmptyAllowed: boolean) {
    // When value is empty re
    if (commonContributionDetails.isNullOrEmpty(value) && isEmptyAllowed) {
      return true;
    }
    const pattern = /^\d+(\.\d+)?$/;
    // Just make in case value is not string, make it string and test regex
    return pattern.test(value + "");
  },
  /**
   * Check vaild decimals in number
   * @param value
   * @param maxDecimals
   * @param isEmptyAllowed
   * @returns
   */
  isValidDecimals(value: string, maxDecimals: number, isEmptyAllowed: boolean) {
    // When value is empty re
    if (commonContributionDetails.isNullOrEmpty(value) && isEmptyAllowed) {
      return true;
    }
    const regexString = `^\\d+(\\.\\d{1,${maxDecimals}})?$`;
    const pattern = new RegExp(regexString, "g");
    // Just make in case value is not string, make it string and test regex
    return pattern.test(value + "");
  },
  /**
   * This will check current row is D row and return true or false
   * @param row
   * @returns return true or false, if it is D row
   */
  isRowDValidation: function (row): boolean {
    if (
      commonContributionDetails.getRowColumn(
        row,
        EnumRowDColumns.RECORD_IDENTIFIER
      ) === "D"
    ) {
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
  getOnlyDRows: async function (
    readStream: NodeJS.ReadableStream,
    context: Context,
    processType
  ): Promise<Array<any>> {
    let errorMessages = [];
    let dRows = [];
    let currentDRowIndex = 0;
    return new Promise(async function (resolve, reject) {
      try {
        readStream
          .pipe(
            csvf.parse<any, any>({
              ignoreEmpty: true,
            })
          )
          .on("error", async (e) => {
            // This will not happen, safer side added this
            context.log(`commonContributionDeails: Error Type : ${e.message}`);
            const error = commonContributionDetails.getSomethingWentWrongError(
              "2C",
              processType
            );
            errorMessages.push(error);
            reject(errorMessages);
          })
          .on("data", async (row) => {
            if (commonContributionDetails.isRowDValidation(row)) {
              dRows.push(row);
              context.log(
                `commonContributionDetails: Added D row, current index : ${currentDRowIndex}`
              );
              currentDRowIndex++;
            }
          })
          .on("end", async (_e) => {
            resolve(dRows);
          });
      } catch (e) {
        context.log(`Something went wrong : ${e.message}`);
        reject(e);
      }
    });
  },
  /**
   * Create File Entry
   * @param fileId
   * @param blobName
   * @param fileProperties
   * @param contributionHeaderId
   * @param fileType
   */
  createFileEntry: async function name(
    fileId,
    blobName,
    fileProperties,
    contributionHeaderId,
    fileType
  ) {
    try {
      const fileHeaderMappingId = uuidv4();
      const currentTime = new Date().toISOString();
      await File.create({
        fileId: fileId,
        fileName: blobName,
        fileType: fileType,
        fileSize: fileProperties.contentLength,
        fileSizeType: "B",
        fileStatus: "V",
        fileFormat: "CSV",
        fileReceivedDate: currentTime,
        fileProcessedDate: currentTime,
        fileUploadedOn: currentTime,
        fileSentDate: currentTime,
      });

      await FileHeaderMap.create({
        contribHeaderId: contributionHeaderId,
        fileId: fileId,
        fileHeaderMappingId,
        createdBy: "SYSTEM",
        createdDate: currentTime,
      });

      return fileId;
    } catch (ex) {
      console.log(ex.message);
      throw new Error("Create new File Header Map & File entry failed");
    }
  },
  /**
   * Save file error details
   * @param errors
   * @param fileId
   */
  saveFileErrorDetails: async function (
    errors: Array<any>,
    fileId,
    membContribDetlId = null
  ) {
    let fileErrors: any = [];
    let errorSequenceNum = 1;
    for (const error of errors) {
      const fileError = {} as FileError;

      fileError.errorTypeId = error.errorTypeId;
      fileError.errorCode = error.errorNumber;
      fileError.errorMessage = error.onlineErrorMessageTxt;
      fileError.errorFileId = fileId;
      fileError.errorSequenceNum = errorSequenceNum;
      fileError.sourceRecordId = error.lineNumber || 0;
      fileError.createdBy = "SYSTEM"; // Currently it is hard coded
      fileError.membContribDetlId = membContribDetlId;
      fileErrors.push(fileError);
      errorSequenceNum++;
    }

    await ErrorDetails.bulkCreate(fileErrors, {
      validate: true,
      returning: true,
    });
  },
  /**
   * Returns All errors from RDErrorType as error code as key
   */
  getAllErrors: async function () {
    const rdErrorTypes = (await RDErrorType.findAll({
      raw: true,
      nest: true,
    })) as any;
    let errors = {};
    for (const rdError of rdErrorTypes) {
      errors[rdError.errorNumber] = rdError;
    }
    return errors;
  },

  getRdErrorType: function (rderrorTypes, byErrorCode) {
    if (rderrorTypes[byErrorCode]) {
      return rderrorTypes[byErrorCode];
    }
    return {
      errorNumber: byErrorCode,
      errorType: "UK", //UNKNOWN
      processType: rderrorTypes.processType,
      onlineErrorMessageTxt: "Something went wrong",
      detailedErrorMessageTxt: null,
      errorTypeId: -1,
      errorSeverity: 2,
    };
  },
  /**
   * This will convert row into STGMemberDetails object
   * @param row
   * @returns STGMemberDetails object
   */
  convertToSTGMemberDetails: function (row, fileId) {
    // Currently this row index may change, this was done bcased on Contribution template - specification v1.9
    let customRow = {
      uploadFileId: fileId,
      forename: row[EnumRowDColumns.FORE_NAME],
      surname: row[EnumRowDColumns.SURE_NAME],
      nino: row[EnumRowDColumns.NINO],
      alternateUniqueId: row[EnumRowDColumns.ALT_ID],
      pensionableEarnings: row[EnumRowDColumns.PENS_EARNINGS]
        ? parseFloat(row[EnumRowDColumns.PENS_EARNINGS])
        : 0,
      memberEarnings: row[EnumRowDColumns.MEMB_LEAVE_EARNINGS]
        ? parseFloat(row[EnumRowDColumns.MEMB_LEAVE_EARNINGS])
        : 0,
      employerContribution: row[EnumRowDColumns.EMPL_CONTRIAMT]
        ? parseFloat(row[EnumRowDColumns.EMPL_CONTRIAMT])
        : 0,
      memberContribution: row[EnumRowDColumns.MEMB_CONTRIAMT]
        ? parseFloat(row[EnumRowDColumns.MEMB_CONTRIAMT])
        : 0,
      reasonPartNonPayment: row[EnumRowDColumns.MEMB_NON_PAY_REASON],
      effectivePartNonPaymentDate: row[EnumRowDColumns.MEMB_NON_PAY_EFF_DATE]
        ? commonContributionDetails.getDateValue(
            row[EnumRowDColumns.MEMB_NON_PAY_EFF_DATE]
          )
        : commonContributionDetails.getDateValue(
            row[EnumRowDColumns.NEW_GROUP_EFF_DATE]
          ),

      newGroupName: row[EnumRowDColumns.NEW_GROUP_NAME],
      effectiveGroupChangeDate: commonContributionDetails.getDateValue(
        row[EnumRowDColumns.NEW_GROUP_EFF_DATE]
      ),
      newPaymentSourceName: row[EnumRowDColumns.NEW_PAYMENT_SOURCE_NAME],
      newGroupPensionableEarnings: row[EnumRowDColumns.NEW_GROUP_PENS_EARNINGS]
        ? parseFloat(row[EnumRowDColumns.NEW_GROUP_PENS_EARNINGS])
        : 0,
      newGroupEmployerContribution: row[
        EnumRowDColumns.NEW_GROUP_EMPL_CONTRIAMT
      ]
        ? parseFloat(row[EnumRowDColumns.NEW_GROUP_EMPL_CONTRIAMT])
        : 0,
      newGroupMemberContribution: row[EnumRowDColumns.NEW_GROUP_MEMB_CONTRIAMT]
        ? parseFloat(row[EnumRowDColumns.NEW_GROUP_MEMB_CONTRIAMT])
        : 0,
      optoutReferenceNumber: row[EnumRowDColumns.OPT_OUT_REF_NUM],
      // in spec it was saying  bool and validation we need to check for Y.. not sure what will be true.. considering as Y only
      optoutDeclarationFlag: row[EnumRowDColumns.OPT_OUT_DECLARATION_FLAG],
      secEnrolPensEarnings: row[EnumRowDColumns.SEC_ENROL_PENS_EARNINGS]
        ? parseFloat(row[EnumRowDColumns.SEC_ENROL_PENS_EARNINGS])
        : 0,
      secEnrolEmplContriAmt: row[EnumRowDColumns.SEC_ENROL_EMPL_CONTRIAMT]
        ? parseFloat(row[EnumRowDColumns.SEC_ENROL_EMPL_CONTRIAMT])
        : 0,
      secEnrolMembContriAmt: row[EnumRowDColumns.SEC_ENROL_MEMB_CONTRIAMT]
        ? parseFloat(row[EnumRowDColumns.SEC_ENROL_MEMB_CONTRIAMT])
        : 0,
    };

    return customRow;
  },
  getDateValue: function (input) {
    if (input && input != "") return input;
    else return null;
  },
  /**
   * Get something went wrong wrong in case technical error happens
   * @param errorType
   * @param processType
   * @returns
   */
  getSomethingWentWrongError: function (
    errorType: string,
    processType: string
  ) {
    return {
      errorNumber: "ID9999",
      errorType: errorType,
      processType: processType,
      onlineErrorMessageTxt: "Something went wrong.",
      detailedErrorMessageTxt: null,
      errorTypeId: "9999999",
      errorSeverity: 2,
      recordStartDate: "0001-01-01",
      recordEndDate: "9999-12-31",
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      last_updated_timestamp: "0001-01-01T00:00:00.0Z",
      lineNumber: 0,
    };
  },
  /**
   *
   * @param type - e.g. contrib-index-sched-file-upload
   * @param fileErrors - errors array
   * @param errorType - e.g. Type 2
   * @param errorFileDownloadLink - Document index URL
   * @param instance - e.g. contribution-fum-file-type2c-d-validation
   * @param newMembersIncluded - e.g. Yes or No
   * @param paidMembersIncluded - e.g. Yes or No
   */
  getFQSPayloadForErrors: function (
    type: string,
    fileErrors: Array<any>,
    errorType: string,
    errorFileDownloadLink: string = "",
    instance: string = "",
    newMembersIncluded: string = "No",
    paidMembersIncluded: string = "No"
  ) {
    const fqsReqPayload = {} as FQSRequestPayload;
    const fQSErrorSummary = {
      errorsIncluded: fileErrors.length > 0 ? "Yes" : "No",
      errorType: errorType,
      errorCount: fileErrors.length + "",
      errorFileDownloadLink: errorFileDownloadLink,
      newMembersIncluded,
      paidMembersIncluded,
    } as FQSErrorSummary;

    let fqsErrors = [];
    for (const fileError of fileErrors) {
      let error = {} as FQSError;
      error.errorCode = fileError.errorNumber;
      error.errorDetail = `Line ${fileError.lineNumber}. ${fileError.onlineErrorMessageTxt}`;
      fqsErrors.push(error);
    }

    fqsReqPayload.type = type;
    fqsReqPayload.errorSummary = fQSErrorSummary;
    fqsReqPayload.instance = instance;
    fqsReqPayload.errors = fqsErrors;
    return fqsReqPayload;
  },

  /**
   * Save error log file to blob storage and calling Document Index APIs move
   * @param errors
   * @param fileName
   * @param fileId
   * @param content
   * @returns on success return Error file Download Link else empty
   */
  saveErrorLogFile: async function (
    fileErrors: Array<any>,
    fileName,
    fileId,
    context: Context
  ): Promise<string> {
    try {
      // Upload loading to blob storage first
      const _blobServiceClient = blobHelper.getBlobServiceClient(
        process.env.contribution_DocumentIndexBlobConnectString
      );
      let fileContent = `File name: ${fileName}\nError count: ${fileErrors.length}\n`;
      for (const error of fileErrors) {
        fileContent = `${fileContent}Line ${error.lineNumber}. ${error.onlineErrorMessageTxt}\n`;
      }
      const isUploadToBlob = await blobHelper.uploadBlobFileContent(
        `${fileId}.txt`,
        _blobServiceClient,
        fileContent,
        process.env.contribution_DocumentIndexBlobContainerName
      );

      if (isUploadToBlob) {
        const documentDownloadLink = await new DocumentIndexHelper(
          context
        ).moveFile(`${fileId}.txt`, "move");
        context.log(`documentDownloadLink: ${documentDownloadLink}`);
        return documentDownloadLink;
      }
    } catch (error) {
      context.log(
        `Something went wrong at: saveErrorLogFile - Reason ${error.message}`
      );
    }
    return "";
  },
};

export default commonContributionDetails;

export {
  EnumRowDColumns,
  EnumRowHColumns,
  EnumRowTColumns,
  EnumScheduleMemberStatusCD,
  Type2SaveResult,
};
