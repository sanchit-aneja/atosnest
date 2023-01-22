import { Context } from "@azure/functions";
import { Op } from "sequelize";
import sequelize from "../utils/database";
import { ContributionDetails, ContributionHeader } from "../models";
import errorDetails from "../models/errorDetails";
import { httpRequestGenerator } from "../utils/httpRequestGenerator";
import { AxiosResponse } from "axios";
import commonContributionDetails from "./commonContributionDetails";

interface Type3Error {
  membContribDetlId: string;
  errorSequenceNum: number;
  errorCode: string;
  errorMessage: string;
  createdBy: string;
}
enum EnumREASONMAPPING {
  REASON5 = "CON12",
  REASON6 = "CON13",
  REASON7 = "CON14",
  REASON8 = "CON15",
  REASON9 = "CON16",
  REASON10 = "CON17",
  REASON12 = "CON18",
}

export const Type3Validations = {
  rules: {
    id31_0: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON6 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON12) &&
          item.membNonPayEffDate === null
      );

      if (errors) {
        return {
          code: "ID31.0",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_1: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON6 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON12) &&
          item.newPaymentSourceName === null
      );

      if (errors) {
        return {
          code: "ID31.1",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_2: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          item.membNonPayReason === EnumREASONMAPPING.REASON7 &&
          item.membNonPayEffDate === null
      );

      if (errors) {
        return {
          code: "ID31.2",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_3: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON7 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON12) &&
          item.newGroupName == null
      );

      if (errors) {
        return {
          code: "ID31.3",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_4: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON7 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON8) &&
          item.newGroupPensEarnings == null
      );

      if (errors) {
        return {
          code: "ID31.4",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_5: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON7 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON8) &&
          item.newGroupEmplContriAmt == null
      );

      if (errors) {
        return {
          code: "ID31.5",
          dataRows: errors,
        };
      }

      return null;
    },

    id31_6: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON7 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON8) &&
          item.newGroupMembContriAmt == null
      );

      if (errors) {
        return {
          code: "ID31.6",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_7: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          item.membNonPayReason === EnumREASONMAPPING.REASON9 &&
          item.optoutRefNum == null
      );

      if (errors) {
        return {
          code: "ID31.7",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_8: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          item.membNonPayReason === EnumREASONMAPPING.REASON9 &&
          item.optoutDeclarationFlag == null
      );

      if (errors) {
        return {
          code: "ID31.8",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_9: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          item.membNonPayReason === EnumREASONMAPPING.REASON10 &&
          item.secEnrolPensEarnings == null
      );

      if (errors) {
        return {
          code: "ID31.9",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_10: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          item.membNonPayReason === EnumREASONMAPPING.REASON10 &&
          item.secEnrolEmplContriAmt == null
      );

      if (errors) {
        return {
          code: "ID31.10",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_11: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          item.membNonPayReason === EnumREASONMAPPING.REASON10 &&
          item.secEnrolMembContriAmt == null
      );

      if (errors) {
        return {
          code: "ID31.11",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_43: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON6 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON12) &&
          item.membNonPayEffDate &&
          new Date(item.membNonPayEffDate) <
            new Date(dataRows.dataHeaderRow.earningPeriodStartDate)
      );

      if (errors) {
        return {
          code: "ID31.43",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_44: async (dataRows: any, context: Context) => {
      const oneday = 60 * 60 * 24 * 1000;
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON6 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON12) &&
          item.membNonPayEffDate &&
          new Date(item.membNonPayEffDate).getTime() -
            new Date(dataRows.dataHeaderRow.earningPeriodEndDate).getTime() >
            oneday
      );

      if (errors) {
        return {
          code: "ID31.44",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_45: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON6 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON12) &&
          item.membNonPayEffDate &&
          new Date(item.membNonPayEffDate).getTime() ===
            new Date(dataRows.dataHeaderRow.earningPeriodStartDate).getTime() &&
          Number(item.emplContriAmt ? item.emplContriAmt : 0) +
            Number(item.membContriAmt ? item.membContriAmt : 0) >
            0
      );

      if (errors) {
        return {
          code: "ID31.45",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_48: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON6 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON12) &&
          item.newPaymentSourceName &&
          new Date(item.newPaymentSourceName) !==
            new Date(dataRows.dataHeaderRow.paymentSourceName)
      );

      if (errors) {
        return {
          code: "ID31.48",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_54: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          item.membNonPayReason === EnumREASONMAPPING.REASON7 &&
          item.membNonPayEffDate &&
          new Date(item.membNonPayEffDate) <
            new Date(dataRows.dataHeaderRow.earningPeriodStartDate)
      );

      if (errors) {
        return {
          code: "ID31.54",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_55: async (dataRows: any, context: Context) => {
      const oneday = 60 * 60 * 24 * 1000;
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          item.membNonPayReason === EnumREASONMAPPING.REASON7 &&
          item.membNonPayEffDate &&
          new Date(item.membNonPayEffDate).getTime() -
            new Date(dataRows.dataHeaderRow.earningPeriodEndDate).getTime() >
            oneday
      );

      if (errors) {
        return {
          code: "ID31.55",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_56: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          item.membNonPayReason === EnumREASONMAPPING.REASON7 &&
          item.membNonPayEffDate &&
          new Date(item.membNonPayEffDate).getTime() ===
            new Date(dataRows.dataHeaderRow.earningPeriodStartDate).getTime() &&
          Number(item.emplContriAmt ? item.emplContriAmt : 0) +
            Number(item.membContriAmt ? item.membContriAmt : 0) >
            0
      );

      if (errors) {
        return {
          code: "ID31.56",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_58: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON7 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON12) &&
          item.newGroupName !== dataRows.paymentGroupSource?.groupName
      );

      if (errors) {
        return {
          code: "ID31.58",
          dataRows: errors,
        };
      }

      return null;
    },

    id31_60: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON7 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON12) &&
          item.newGroupName &&
          item.newGroupName === item.groupName
      );

      if (errors) {
        return {
          code: "ID31.60",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_62: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON7 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON8) &&
          Number(item.newGroupPensEarnings) <
            Number(item.newGroupEmplContriAmt) +
              Number(item.newGroupMembContriAmt)
      );

      if (errors) {
        return {
          code: "ID31.62",
          dataRows: errors,
        };
      }

      return null;
    },
    id31_75: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          item.membNonPayReason === EnumREASONMAPPING.REASON10 &&
          Number(item.newGroupPensEarnings) <
            Number(item.newGroupEmplContriAmt) +
              Number(item.newGroupMembContriAmt)
      );

      if (errors) {
        return {
          code: "ID31.75",
          dataRows: errors,
        };
      }

      return null;
    },
    id32_00: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON5 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON9) &&
          item.pensEarnings &&
          Number(item.pensEarnings) > 0
      );

      if (errors) {
        return {
          code: "ID32.00",
          dataRows: errors,
        };
      }

      return null;
    },
    id32_1: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON5 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON9) &&
          item.emplContriAmt &&
          Number(item.emplContriAmt) > 0
      );

      if (errors) {
        return {
          code: "ID32.1",

          dataRows: errors,
        };
      }

      return null;
    },
    id32_2: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (item.membNonPayReason === EnumREASONMAPPING.REASON5 ||
            item.membNonPayReason === EnumREASONMAPPING.REASON9) &&
          item.membContriAmt &&
          Number(item.membContriAmt) > 0
      );

      if (errors) {
        return {
          code: "ID32.2",

          dataRows: errors,
        };
      }

      return null;
    },
    id33_00: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (!item.membNonPayReason || item.membNonPayReason === "") &&
          item.optoutRefNum &&
          item.newPaymentSourceName
      );

      if (errors) {
        return {
          code: "ID33.00",

          dataRows: errors,
        };
      }

      return null;
    },
    id33_02: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          (!item.membNonPayReason || item.membNonPayReason === "") &&
          item.optoutRefNum &&
          item.newGroupName
      );

      if (errors) {
        return {
          code: "ID33.2",

          dataRows: errors,
        };
      }

      return null;
    },
    id34_00: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          item.pensEarnings &&
          Number(item.pensEarnings) <
            Number(item.emplContriAmt) + Number(item.membContriAmt)
      );

      if (errors) {
        return {
          code: "ID34.0",
          dataRows: errors,
        };
      }

      return null;
    },
    id34_1: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) => item.pensEarnings === null
      );

      if (errors) {
        return {
          code: "ID34.1",
          dataRows: errors,
        };
      }

      return null;
    },
    id34_2: async (dataRows: any, context: Context) => {
      const errors = dataRows.dataDetailRows.filter(
        (item) =>
          ((!item.membNonPayReason || item.membNonPayReason === "") &&
            Number(item.emplContriAmt) === 0) ||
          Number(item.membContriAmt) === 0 ||
          (!item.emplContriAmt && !item.membContriAmt)
      );

      if (errors) {
        return {
          code: "ID34.2",

          dataRows: errors,
        };
      }

      return null;
    },
  },
  getDatarows: async (contribHeaderId, dataHeaderRow, context) => {
    return new Promise(async function (resolve) {
      const alldataDetailRows: ContributionDetails[] =
        await ContributionDetails.findAll({
          where: { contrib_header_id: contribHeaderId },
        });

      const dataDetailRows = alldataDetailRows.filter(
        (item: any) => item.recordChangedFlag === "Y"
      );

      let paymentGroupSource = {};
      try {
        paymentGroupSource =
          await Type3Validations.getCustomerIndexPaymentGroupSource(
            contribHeaderId,
            context
          );
      } catch (error) {}

      resolve({
        dataHeaderRow: dataHeaderRow,
        dataDetailRows: dataDetailRows,
        paymentGroupSource: paymentGroupSource,
        totalRows: alldataDetailRows.length,
      });
    });
  },
  validateDataRows: async (dataRows: any, context: Context) => {
    let Type3Errors: any = [];
    const errorIds = [];

    for (const key in Type3Validations.rules) {
      const validationFunc = Type3Validations.rules[key];

      const error = await validationFunc(dataRows, context);

      error.dataRows.forEach((dataRow) => {
        const existsingItem = Type3Errors.find(
          (type3Error) =>
            type3Error.membContribDetlId === dataRow.membContribDetlId
        );

        if (existsingItem === undefined) {
          const type3Error = {} as Type3Error;

          type3Error.errorCode = error.code;
          type3Error.errorMessage = error.message;

          type3Error.errorSequenceNum = 1;

          type3Error.createdBy = "System";
          type3Error.membContribDetlId = dataRow.membContribDetlId;

          Type3Errors.push(type3Error);
          errorIds.push(dataRow.membContribDetlId);
        }
      });
    }
    return { Type3Errors, errorIds };
  },
  getHeaderRows: async (contribHeaderId: string): Promise<any> => {
    return new Promise(async function (resolve) {
      try {
        const dataHeaderRow: ContributionHeader =
          await ContributionHeader.findOne({
            where: { contrib_header_id: contribHeaderId },
          });
        resolve(dataHeaderRow);
      } catch (error) {
        console.log(error);
        resolve(null);
      }
    });
  },
  start: async function (
    contribHeaderId: string,
    dataHeaderRow: any,
    context: Context
  ): Promise<any> {
    return new Promise(async function (resolve, reject) {
      try {
        const dataRows: any = await Type3Validations.getDatarows(
          contribHeaderId,
          dataHeaderRow,
          context
        );

        const allIds = [];
        dataRows.dataDetailRows.map((dataRow: any) => {
          allIds.push(dataRow.membContribDetlId);
        });

        const { Type3Errors, errorIds } =
          await Type3Validations.validateDataRows(dataRows, context);
        const sucessIds = allIds.filter(function (item) {
          return errorIds.indexOf(item) === -1;
        });
        const errorLookup: any = await commonContributionDetails.getAllErrors();
        Type3Errors.map((type3Error: Type3Error) => {
          const rdErrorType = commonContributionDetails.getRdErrorType(
            errorLookup,
            type3Error.errorCode
          );

          type3Error.errorMessage = rdErrorType.onlineErrorMessageTxt;
        });

        await Type3Validations.updateDB(
          errorIds,
          sucessIds,
          allIds,
          Type3Errors
        );
        const totalReadytoSubmit = sucessIds.length;
        const totalRequireAttention = dataRows.dataDetailRows.length;
        const totalTobeReviewed = errorIds.length;
        const totalRowsinSchedule = dataRows.totalRows;
        resolve({
          totalReadytoSubmit,
          totalRequireAttention,
          totalTobeReviewed,
          totalRowsinSchedule,
        });
      } catch (error) {
        context.log(`Something went wrong : ${error.message}`);
        reject(error);
      }
    });
  },
  updateDB: async function (errorIds, sucessIds, allIds, Type3Errors) {
    let transaction;
    try {
      transaction = await sequelize.transaction();

      await ContributionDetails.update(
        { recordChangedFlag: null },
        {
          where: {
            membContribDetlId: {
              [Op.in]: allIds,
            },
          },
        }
      );
      await ContributionDetails.update(
        { schdlMembStatusCd: "MCS3" },
        {
          where: {
            membContribDetlId: {
              [Op.in]: errorIds,
            },
          },
        }
      );
      await ContributionDetails.update(
        { schdlMembStatusCd: "MCS2" },
        {
          where: {
            membContribDetlId: {
              [Op.in]: sucessIds,
            },
          },
        }
      );
      await errorDetails.destroy({
        where: {
          membContribDetlId: {
            [Op.in]: sucessIds,
          },
        },
      });

      await errorDetails.bulkCreate(Type3Errors, {
        validate: true,
        returning: true,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  },
  getCustomerIndexPaymentGroupSource: async function (groupSchemeId, context) {
    return new Promise((resolve, reject) => {
      const ciHost = process.env.customer_index_Host;
      const payload = {
        params: {
          groupSchemeId: groupSchemeId,
        },
      };
      httpRequestGenerator(
        "POST",
        `${ciHost}/paymentGroupSource/search`,
        payload
      )
        .then((response: AxiosResponse) => {
          resolve(response);
        })
        .catch((e) => {
          context.log("error making customer index paymentGroupSource request");
          reject(e);
        });
    });
  },
};
