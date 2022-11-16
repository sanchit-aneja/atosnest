import * as Joi from "joi";
import { DataTypes, Model, Sequelize } from "sequelize";
import StgContrMember from "./stgcontrmember";
import { joiOption, errorDetails } from "../utils/constants";
import sequelize from "../utils/database";
import ContributionDetails from "./contributionDetails";
import RDScheduleStatus from "./rdschedulestatus";
import Status from "../utils/config";
import { ContributionHeaderDetails } from "../schemas";
import { Context } from "@azure/functions";
import app from "../utils/app";
import FileHeaderMap from "./fileheadermap";

class ContributionHeader extends Model {}

ContributionHeader.init(
  {
    contribHeaderId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
      field: "contrib_header_id",
      validate: {
        notEmpty: {
          msg: "contribHeaderId field cannot be empty",
        },
        notNull: {
          msg: "contribHeaderId field cannot be null",
        },
      },
    },
    origContribHeaderId: {
      type: DataTypes.UUID,
      field: "orig_contrib_header_id",
    },
    nestScheduleRef: {
      type: DataTypes.STRING(14),
      allowNull: false,
      field: "nest_schedule_ref",
      validate: {
        notEmpty: {
          msg: "nestScheduleRef field cannot be empty",
        },
        notNull: {
          msg: "nestScheduleRef field cannot be null",
        },
      },
    },
    externalScheduleRef: {
      type: DataTypes.STRING(32),
      field: "external_schedule_ref",
    },
    scheduleType: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: "schedule_type",
      validate: {
        notEmpty: {
          msg: "scheduleType field cannot be empty",
        },
        notNull: {
          msg: "scheduleType field cannot be null",
        },
      },
    },
    scheduleStatusCd: {
      type: DataTypes.STRING(5),
      allowNull: false,
      field: "schedule_status_cd",
      validate: {
        notEmpty: {
          msg: "scheduleStatusCd field cannot be empty",
        },
        notNull: {
          msg: "scheduleStatusCd field cannot be null",
        },
      },
    },
    scheduleGenerationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "schedule_generation_date",
      validate: {
        notEmpty: {
          msg: "scheduleGenerationDate field cannot be empty",
        },
        notNull: {
          msg: "scheduleGenerationDate field cannot be null",
        },
      },
    },
    employerNestId: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "employer_nest_id",
      validate: {
        notEmpty: {
          msg: "employerNestId field cannot be empty",
        },
        notNull: {
          msg: "employerNestId field cannot be null",
        },
      },
    },
    subSchemeId: {
      type: DataTypes.STRING(16),
      field: "sub_scheme_id",
    },
    earningPeriodStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "earning_period_start_date",
      validate: {
        notEmpty: {
          msg: "earningPeriodStartDate field cannot be empty",
        },
        notNull: {
          msg: "earningPeriodStartDate field cannot be null",
        },
      },
    },
    earningPeriodEndDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "earning_period_end_date",
      validate: {
        notEmpty: {
          msg: "earningPeriodEndDate field cannot be empty",
        },
        notNull: {
          msg: "earningPeriodEndDate field cannot be null",
        },
      },
    },
    paymentPlanNo: {
      type: DataTypes.STRING(11),
      field: "payment_plan_no",
    },
    paymentRef: {
      type: DataTypes.STRING(35),
      field: "payment_ref",
    },
    nestPaymentRef: {
      type: DataTypes.STRING(12),
      allowNull: false,
      field: "nest_payment_ref",
      validate: {
        notEmpty: {
          msg: "nestPaymentRef field cannot be empty",
        },
        notNull: {
          msg: "nestPaymentRef field cannot be null",
        },
      },
    },
    paymentSourceName: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: "payment_source_name",
      validate: {
        notEmpty: {
          msg: "paymentSourceName field cannot be empty",
        },
        notNull: {
          msg: "paymentSourceName field cannot be null",
        },
      },
    },
    paymentMethod: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: "payment_method",
      validate: {
        notEmpty: {
          msg: "paymentMethod field cannot be empty",
        },
        notNull: {
          msg: "paymentMethod field cannot be null",
        },
      },
    },
    paymentMethodDesc: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "payment_method_desc",
      validate: {
        notEmpty: {
          msg: "paymentMethodDesc field cannot be empty",
        },
        notNull: {
          msg: "paymentMethodDesc field cannot be null",
        },
      },
    },
    paymentFrequency: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: "payment_frequency",
      validate: {
        notEmpty: {
          msg: "paymentFrequency field cannot be empty",
        },
        notNull: {
          msg: "paymentFrequency field cannot be null",
        },
      },
    },
    paymentFrequencyDesc: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "payment_frequency_desc",
      validate: {
        notEmpty: {
          msg: "paymentFrequencyDesc field cannot be empty",
        },
        notNull: {
          msg: "paymentFrequencyDesc field cannot be null",
        },
      },
    },
    taxPayFrequencyInd: {
      type: DataTypes.STRING(1),
      field: "tax_pay_frequency_ind",
    },
    paymentDueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "payment_due_date",
      validate: {
        notEmpty: {
          msg: "paymentDueDate field cannot be empty",
        },
        notNull: {
          msg: "paymentDueDate field cannot be null",
        },
      },
    },
    pegaCaseRef: {
      type: DataTypes.STRING(30),
      field: "pega_case_ref",
    },
    noOfMembs: {
      type: DataTypes.NUMBER,
      field: "no_of_membs",
    },
    totScheduleAmt: {
      type: DataTypes.DECIMAL,
      field: "tot_schedule_amt",
    },
    recordStartDate: {
      type: DataTypes.DATE,
      field: "record_start_date",
    },
    recordEndDate: {
      type: DataTypes.DATE,
      field: "record_end_date",
    },
    createdBy: {
      type: DataTypes.STRING(50),
      field: "created_by",
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      field: "updated_by",
    },
  },
  {
    sequelize,
    tableName: "Contribution_Header",
    createdAt: false,
    updatedAt: "last_updated_timestamp",
    timestamps: true,
  }
);

ContributionHeader.hasOne(RDScheduleStatus, {
  sourceKey: "scheduleStatusCd",
  foreignKey: "scheduleStatusCode",
  as: "rdschedulestatus",
});
RDScheduleStatus.belongsTo(ContributionHeader, {
  as: "contributionheader",
  targetKey: "scheduleStatusCd",
  foreignKey: { name: "scheduleStatusCode", allowNull: false },
  constraints: true,
  onDelete: "CASCADE",
});

ContributionHeader.hasOne(StgContrMember, {
  sourceKey: "externalScheduleRef",
  foreignKey: "scheduleReference",
  as: "stgcontrmember",
});
StgContrMember.belongsTo(ContributionHeader, {
  as: "contributionheader",
  targetKey: "externalScheduleRef",
  foreignKey: { name: "scheduleReference", allowNull: false },
  constraints: true,
  onDelete: "CASCADE",
});
ContributionHeader.hasOne(ContributionDetails, {
  sourceKey: "nestScheduleRef",
  foreignKey: "nestScheduleRef",
  as: "contributiondetails",
});
ContributionDetails.belongsTo(ContributionHeader, {
  as: "contributionheader",
  targetKey: "nestScheduleRef",
  foreignKey: { name: "nestScheduleRef", allowNull: false },
  constraints: true,
  onDelete: "CASCADE",
});

ContributionHeader.hasOne(FileHeaderMap, {
  sourceKey: "contribHeaderId",
  foreignKey: "contribHeaderId",
  as: "fileheadermap",
});
FileHeaderMap.belongsTo(ContributionHeader, {
  as: "contributionheader",
  targetKey: "contribHeaderId",
  foreignKey: { name: "contribHeaderId", allowNull: false },
  constraints: true,
  onDelete: "CASCADE",
});

ContributionHeader.addHook("beforeValidate", (contributionheader, _options) => {
  const schema = Joi.object({
    contribHeaderId: Joi.string().optional().allow(null, ""),
    nestScheduleRef: Joi.string()
      .alphanum()
      .max(14)
      .trim(true)
      .optional()
      .allow(null, ""),
    externalScheduleRef: Joi.string()
      .max(32)
      .trim(true)
      .optional()

      .allow(null, ""),
    scheduleType: Joi.string()
      .alphanum()
      .max(2)
      .trim(true)
      .optional()
      .allow(null, ""),
    scheduleStatusCd: Joi.string()
      .alphanum()
      .max(5)
      .trim(true)
      .optional()
      .allow(null, ""),
    scheduleGenerationDate: Joi.date().iso().optional().allow(null),
    employerNestId: Joi.string()
      .alphanum()
      .max(30)
      .trim(true)
      .optional()
      .allow(null, ""),
    subSchemeId: Joi.string()
      .alphanum()
      .max(16)
      .trim(true)
      .optional()
      .allow(null, ""),
    earningPeriodStartDate: Joi.date().iso().optional().allow(null),
    earningPeriodEndDate: Joi.date().iso().optional().allow(null),
    paymentPlanNo: Joi.string()
      .alphanum()
      .max(11)
      .trim(true)
      .optional()
      .allow(null, ""),
    paymentRef: Joi.string()
      .alphanum()
      .max(35)
      .trim(true)
      .optional()
      .allow(null, ""),
    paymentSourceName: Joi.string()
      .alphanum()
      .max(40)
      .trim(true)
      .optional()
      .allow(null, ""),
    paymentMethod: Joi.string().alphanum().max(2).trim(true).optional(),
    paymentMethodDesc: Joi.string()
      .max(30)
      .trim(true)
      .optional()
      .allow(null, ""),
    paymentFrequency: Joi.string()
      .alphanum()
      .max(2)
      .trim(true)
      .optional()
      .allow(null, ""),
    paymentFrequencyDesc: Joi.string()
      .alphanum()
      .max(30)
      .trim(true)
      .optional()
      .allow(null, ""),
    taxPayFrequencyInd: Joi.string()
      .alphanum()
      .max(1)
      .trim(true)
      .optional()
      .allow(null, ""),
    paymentDueDate: Joi.date().iso().optional().allow(null),
    pegaCaseRef: Joi.string()
      .alphanum()
      .max(30)
      .trim(true)
      .optional()
      .allow(null, ""),
    noOfMembs: Joi.number().max(8).optional().allow(null, ""),
    totScheduleAmt: Joi.number().optional().allow(null, ""),
    recordStartDate: Joi.date().iso().optional().allow(null),
    recordEndDate: Joi.date().iso().optional().allow(null),
    createdBy: Joi.string()
      .alphanum()
      .max(50)
      .trim(true)
      .optional()
      .allow(null, ""),
    updatedBy: Joi.string()
      .alphanum()
      .max(50)
      .trim(true)
      .optional()
      .allow(null, ""),
  });
  const { error } = schema.validate(contributionheader, joiOption);
  if (error) throw error;
});

ContributionHeader.beforeCreate(async (contributionheader, _options) => {
  const schema = Joi.object({
    nestScheduleRef: Joi.string().alphanum().max(32).trim(true).required(),
    scheduleType: Joi.string().alphanum().max(2).trim(true).required(),
    scheduleStatusCd: Joi.string().alphanum().max(5).trim(true).required(),
    scheduleGenerationDate: Joi.date().iso().required(),
    employerNestId: Joi.string().alphanum().max(30).trim(true).required(),
    earningPeriodStartDate: Joi.date().iso().required(),
    earningPeriodEndDate: Joi.date().iso().required(),
    paymentSourceName: Joi.string().alphanum().max(40).trim(true).required(),
    paymentFrequency: Joi.string().alphanum().max(2).trim(true).required(),
    paymentFrequencyDesc: Joi.string().alphanum().max(30).trim(true).required(),
    paymentMethod: Joi.string().alphanum().max(2).trim(true).required(),

    paymentMethodDesc: Joi.string().max(30).trim(true).required(),
    paymentDueDate: Joi.date().iso().required(),
  });
  const { error } = schema.validate(contributionheader, joiOption);
  if (error) throw error;
});

/**
 * This is helper method to update one by one member details
 * @param contribHeaderId
 * @param currentMemberDetails
 * @param currentIndex
 * @param allErrors
 * @param transaction
 * @param context
 * @returns
 */
export const contributionHeaderUpdateHelper = async function (
  contribHeaderId: string,
  currentContributionHeaderDetails: ContributionHeaderDetails,
  currentIndex: number,
  allErrors: Array<UpdateError>,
  transaction,
  context: Context
) {
  if (app.isNullEmpty(currentContributionHeaderDetails)) {
    context.log(`currentContributionHeaderDetails is empty object`);
    allErrors.push({
      statusCode: Status.BAD_REQUEST,
      errorCode: errorDetails.CIA0600[0],
      errorDetail: errorDetails.CIA0600[1],
    });
  } else if (!contribHeaderId) {
    context.log(
      `contribHeaderId is not present or undefined! value is ${contribHeaderId}`
    );
    allErrors.push({
      statusCode: Status.NOT_FOUND,
      errorCode: errorDetails.CIA0603[0],
      errorDetail: errorDetails.CIA0603[1],
    });
  } else {
    currentContributionHeaderDetails["updatedBy"] = "SYSTEM"; // This need be changed once we confirm
    const effectRows = (await ContributionHeader.update(
      {
        ...currentContributionHeaderDetails,
      },
      {
        where: { contribHeaderId: contribHeaderId },
        transaction,
        individualHooks: true,
      }
    )) as any;

    // Expecting effect rows may be zero when same value passed, but find row will present
    // If zero rows effected the not found
    if (effectRows[1]?.length === 0) {
      context.log(
        `Update of contribHeaderId:${contribHeaderId} is failed..! ${effectRows}`
      );
      allErrors.push({
        statusCode: Status.NOT_FOUND,
        errorCode: errorDetails.CIA0603[0],
        errorDetail: errorDetails.CIA0603[1],
      });
    }
  }
  return allErrors;
};

export default ContributionHeader;
export interface UpdateError {
  statusCode: Status;
  errorDetail: string;
  errorCode: string;
  contribHeaderId?: string;
}
