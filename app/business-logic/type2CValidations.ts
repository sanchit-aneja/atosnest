import { Context } from "@azure/functions";
import { FileUploadHelper } from "../utils";
import { default as CommonContributionDetails } from "./commonContributionDetails";

const Type2CValidations = {
  ninos: [],
  alts: [],
  isNinoFormatted: function (value: string) {
    // http://en.wikipedia.org/wiki/National_Insurance_number#Format
    // https://stackoverflow.com/a/17779536
    if (
      /^(?!BG)(?!GB)(?!NK)(?!KN)(?!TN)(?!NT)(?!ZZ)(?:[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z])(?:\d){6}([A-D])$/.test(
        value
      )
    ) {
      return true;
    }
    return false;
  },

  rules: {
    isNinoAltValid: async (
      row: any,
      context: Context,
      _contributionHeaderId
    ) => {
      const validationError = "ID17";
      try {
        let nino = row.nino;
        let alt = row.alternativeId;
        const ninoRegex = /[(A-Za-z0-9)]\w+/;
        const altRegex = /[A-Za-z0-9"'#$%&\(\)\[\]{}\-\*\+.:\\/=?@!_\s]+/;
        let isNinoEmpty = CommonContributionDetails.isNullOrEmpty(nino);
        let isAltEmpty = CommonContributionDetails.isNullOrEmpty(alt);
        let ninoValid = false;
        let altValid = false;

        if (isNinoEmpty && isAltEmpty) {
          return "ID17";
        }

        if (!isNinoEmpty) {
          ninoValid = ninoRegex.test(nino);
        }
        if (!isAltEmpty) {
          altValid = altRegex.test(alt);
        }
        if (!ninoValid && !altValid) {
          return "ID18";
        }

        if (ninoValid && !Type2CValidations.isNinoFormatted(nino)) {
          return "ID19";
        }

        if (nino === alt) {
          return "ID20.0";
        }

        if (!isNinoEmpty) {
          Type2CValidations.ninos.push(nino);
        }
        if (!isAltEmpty) {
          Type2CValidations.alts.push(alt);
        }
        return null;
      } catch (error) {
        context.log(`Nino and Alt id failed :  error message ${error.message}`);
        return validationError;
      }
    },

    checkNinoAltUniqueness: async (
      row: any,
      context: Context,
      contributionHeaderId
    ) => {
      const validationError = "ID17";
      try {
        let nino = row.nino;
        let alt = row.alternativeId;
        let isNinoEmpty = CommonContributionDetails.isNullOrEmpty(nino);
        let isAltEmpty = CommonContributionDetails.isNullOrEmpty(alt);

        let isNinoExist =
          !isNinoEmpty && Type2CValidations.ninos.indexOf(nino) > -1;
        let isAltExist =
          !isAltEmpty && Type2CValidations.alts.indexOf(alt) > -1;
        if (isNinoExist || isAltExist) {
          return "ID20.1";
        }

        const members = await FileUploadHelper.checkRecordValid({
          nino: nino,
          alt: alt,
          contribHeaderId: contributionHeaderId,
        });

        if (members.length > 1) {
          return "ID20.1";
        }
        if (members[0]["nino"] != nino || members[0]["alternativeId"] != alt) {
          return "ID20.1";
        }
        return null;
      } catch (error) {
        context.log(`Nino and Alt id failed :  error message ${error.message}`);
        return validationError;
      }
    },

    isFirstNameValid: async (
      row: any,
      _context: Context,
      _contributionHeaderId
    ) => {
      const firstName = row.firstName;
      const regex = /([A-Za-z])\w+/;

      if (
        !CommonContributionDetails.isNullOrEmpty(firstName) &&
        !regex.test(firstName)
      ) {
        return "ID18.1";
      }
      return null;
    },

    isLastNameValid: async (
      row: any,
      _context: Context,
      _contributionHeaderId
    ) => {
      const lastName = row.lastName;
      const regex = /([A-Za-z])\w+/;

      if (
        !CommonContributionDetails.isNullOrEmpty(lastName) &&
        !regex.test(lastName)
      ) {
        return "ID18.2";
      }
      return null;
    },
  },

  executeRulesOneByOne: async (
    row: any,
    context: Context,
    errors: Array<Object>,
    rowIndex: number,
    rdErrorTypes,
    contributionHeaderId
  ) => {
    for (const key in Type2CValidations.rules) {
      const validationFunc = Type2CValidations.rules[key];
      const errorCode = await validationFunc(
        row,
        context,
        contributionHeaderId
      );
      if (errorCode) {
        let validationErrors = CommonContributionDetails.getRdErrorType(
          rdErrorTypes,
          errorCode
        );
        validationErrors.lineNumber = rowIndex;
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
          errorMessages = await Type2CValidations.executeRulesOneByOne(
            customRow,
            context,
            errorMessages,
            currentDRowIndex,
            rderrorTypes,
            contributionHeaderId
          );
          currentDRowIndex++;
        }
        if (errorMessages.length > 0) {
          await CommonContributionDetails.saveFileErrorDetails(
            errorMessages,
            fileId
          );
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

export default Type2CValidations;
