import { Context } from "@azure/functions";
import { default as CommonContributionDetails } from "./commonContributionDetails";

const Type2DValidations = {
  /**
   * Type 2D rules - Validation
   */
  rules: {
    PensEarnings: async function (row) {
      const pensEarnings = row.pensEarnings;
      if (!CommonContributionDetails.isVaildNumber(pensEarnings, true)) {
        return "ID25.0";
      } else if (
        !CommonContributionDetails.isValidDecimals(pensEarnings, 2, true)
      ) {
        return "ID30.0";
      }
      return null;
    },
    EmplContriAmt: async function (row) {
      const emplContriAmt = row.emplContriAmt;
      if (!CommonContributionDetails.isVaildNumber(emplContriAmt, true)) {
        return "ID25.1";
      } else if (
        !CommonContributionDetails.isValidDecimals(emplContriAmt, 2, true)
      ) {
        return "ID30.1";
      }
      return null;
    },
    MembContriAmt: async function (row) {
      const membContriAmt = row.membContriAmt;
      if (!CommonContributionDetails.isVaildNumber(membContriAmt, true)) {
        return "ID25.2";
      } else if (
        !CommonContributionDetails.isValidDecimals(membContriAmt, 2, true)
      ) {
        return "ID30.2";
      }
      return null;
    },
    MembLeaveEarnings: async function (row) {
      const membLeaveEarningsAmt = row.membLeaveEarnings;
      if (
        !CommonContributionDetails.isVaildNumber(membLeaveEarningsAmt, true)
      ) {
        return "ID31.24";
      } else if (
        !CommonContributionDetails.isValidDecimals(
          membLeaveEarningsAmt,
          2,
          true
        )
      ) {
        return "ID31.12";
      }
      return null;
    },
    EffectiveDatePartialNonPayment: async function (row) {
      const effectiveDate = row.membNonPayEffDate;
      if (!CommonContributionDetails.isValidateDate(effectiveDate)) {
        return "ID31.13";
      }
      return null;
    },
    EffectiveDateChangeGroup: async function (row) {
      const effectiveDate = row.membChangeOfGroupDate;
      if (!CommonContributionDetails.isValidateDate(effectiveDate)) {
        return "ID31.15";
      }
      return null;
    },
    NewPaymentSourceName: async function (row) {
      if (
        !CommonContributionDetails.isOnlyAllowedChars(
          row.newPaymentSourceName,
          true
        )
      ) {
        return "ID31.14";
      }
      return null;
    },
    NewGroupName: async function (row) {
      if (
        !CommonContributionDetails.isOnlyAllowedChars(row.newGroupName, true)
      ) {
        return "ID31.16";
      }
      return null;
    },
    OptoutDeclarationFlag: async function (row) {
      if (
        !CommonContributionDetails.isNullOrEmpty(row.optoutDeclarationFlag) &&
        row.optoutDeclarationFlag.toUpperCase() != "Y"
      ) {
        return "ID31.20";
      }
      return null;
    },
    NewGroupPensEarnings: async function (row) {
      const newGroupPensEarnings = row.newGroupPensEarnings;
      if (
        !CommonContributionDetails.isVaildNumber(newGroupPensEarnings, true)
      ) {
        return "ID31.29";
      } else if (
        !CommonContributionDetails.isValidDecimals(
          newGroupPensEarnings,
          2,
          true
        )
      ) {
        return "ID31.17";
      }
      return null;
    },
    NewGroupEmplContriAmt: async function (row) {
      const newGroupEmplContriAmt = row.newGroupEmplContriAmt;
      if (
        !CommonContributionDetails.isVaildNumber(newGroupEmplContriAmt, true)
      ) {
        return "ID31.30";
      } else if (
        !CommonContributionDetails.isValidDecimals(
          newGroupEmplContriAmt,
          2,
          true
        )
      ) {
        return "ID31.18";
      }
      return null;
    },
    NewGroupMembContriAmt: async function (row) {
      const newGroupMembContriAmt = row.newGroupMembContriAmt;
      if (
        !CommonContributionDetails.isVaildNumber(newGroupMembContriAmt, true)
      ) {
        return "ID31.31";
      } else if (
        !CommonContributionDetails.isValidDecimals(
          newGroupMembContriAmt,
          2,
          true
        )
      ) {
        return "ID31.19";
      }
      return null;
    },
    OptoutRefNum: async function (row) {
      if (
        !CommonContributionDetails.isOnlyAlphanumerical(row.optoutRefNum, true)
      ) {
        return "ID31.32";
      }
      return null;
    },
    SecEnrolPensEarnings: async function (row) {
      const secEnrolPensEarnings = row.secEnrolPensEarnings;
      if (
        !CommonContributionDetails.isVaildNumber(secEnrolPensEarnings, true)
      ) {
        return "ID31.34";
      } else if (
        !CommonContributionDetails.isValidDecimals(
          secEnrolPensEarnings,
          2,
          true
        )
      ) {
        return "ID31.21";
      }
      return null;
    },
    SecEnrolEmplContriAmt: async function (row) {
      const secEnrolEmplContriAmt = row.secEnrolEmplContriAmt;
      if (
        !CommonContributionDetails.isVaildNumber(secEnrolEmplContriAmt, true)
      ) {
        return "ID31.35";
      } else if (
        !CommonContributionDetails.isValidDecimals(
          secEnrolEmplContriAmt,
          2,
          true
        )
      ) {
        return "ID31.22";
      }
      return null;
    },
    SecEnrolMembContriAmt: async function (row) {
      const secEnrolMembContriAmt = row.secEnrolMembContriAmt;
      if (
        !CommonContributionDetails.isVaildNumber(secEnrolMembContriAmt, true)
      ) {
        return "ID31.36";
      } else if (
        !CommonContributionDetails.isValidDecimals(
          secEnrolMembContriAmt,
          2,
          true
        )
      ) {
        return "ID31.23";
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
  executeRulesOneByOne: async function (
    row,
    context: Context,
    errors: Array<any>,
    currentDRowIndex,
    rderrorTypes
  ) {
    for (const key in Type2DValidations.rules) {
      const validationFunc = Type2DValidations.rules[key];
      context.log(
        `executeRulesOneByOne :: Run rule ${key} current D row index ${currentDRowIndex}`
      );
      const errorCode = await validationFunc(row);
      if (errorCode) {
        let validationErrors = CommonContributionDetails.getRdErrorType(
          rderrorTypes,
          errorCode
        );
        // Added Current D row index + H row first line in the file
        validationErrors.lineNumber = currentDRowIndex + 1;
        errors.push(validationErrors);
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
  start: async function (
    readStream: NodeJS.ReadableStream,
    context: Context,
    fileId,
    contributionHeaderId,
    rderrorTypes
  ): Promise<any> {
    let currentDRowIndex = 0;
    let errorMessages = [];
    return new Promise(async function (resolve, reject) {
      try {
        // Get D rows first from CSV parse - Reusing from saveContribution
        const dRows = await CommonContributionDetails.getOnlyDRows(
          readStream,
          context
        );
        // Start updating one by one with transcation
        for (const row of dRows) {
          context.log(
            `Rows updating for current D row ${currentDRowIndex} contributionHeaderId: ${contributionHeaderId}`
          );
          // Pass empty value for actual values here we no need that
          const customRow =
            CommonContributionDetails.convertToContributionDetails(
              row,
              {},
              true
            );
          errorMessages = await Type2DValidations.executeRulesOneByOne(
            customRow,
            context,
            errorMessages,
            currentDRowIndex,
            rderrorTypes
          );
          currentDRowIndex++;
        }
        if (errorMessages.length > 0) {
          reject(errorMessages);
        } else {
          resolve(true);
        }
      } catch (e) {
        context.log(`****Something went wrong***** : ${e.message}`);
        reject(e);
      }
    });
  },
};

export default Type2DValidations;
