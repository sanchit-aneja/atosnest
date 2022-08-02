import * as Joi from "joi";
import { DataTypes, Model } from "sequelize";
import { joiOption } from "../utils/constants";
import sequelize from "../utils/database";

class ContributionHeader extends Model { }

ContributionHeader.init(
  {
    contribHeaderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
    fileId: {
      type: DataTypes.BIGINT,
      field: "file_id"
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
      field: "external_schedule_ref"
    },
    scheduleType: {
      type: DataTypes.STRING(50),
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
        }
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
    groupSchemeId: {
      type: DataTypes.STRING(16),
      field: "group_scheme_id"
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
      field: "payment_plan_no"
    },
    paymentRef: {
      type: DataTypes.STRING(35),
      field: "payment_ref"
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
      field: "tax_pay_frequency_ind"
    },
    futurePaymentDate: {
      type: DataTypes.DATE,
      field: "future_payment_date"
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
      field: "no_of_membs"
    },
    totScheduleAmt: {
      type: DataTypes.DECIMAL,
      field: "tot_schedule_amt"
    },
    origScheduleRef: {
      type: DataTypes.STRING(14),
      field: "orig_schedule_ref"
    },
    recordStartDate: {
      type: DataTypes.DATE,
      field: "record_start_date"
    },
    recordEndDate: {
      type: DataTypes.DATE,
      field: "record_end_date"
    },
    createdBy: {
      type: DataTypes.STRING(50),
      field: "created_by"
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      field: "updated_by"
    }
  },
  {
    sequelize,
    tableName: "Contribution_Header",
    createdAt: false,
    updatedAt: "last_updated_timestamp",
    timestamps: true
  }
);

ContributionHeader.addHook("beforeValidate", (contributionheader, _options) => {
  const schema = Joi.object({
    contribHeaderId: Joi.number().optional().allow(null, ""),
    fileId: Joi.number().optional().allow(null, ""),
    nestScheduleRef: Joi.string().alphanum().max(14).trim(true).optional().allow(null, ""),
    externalScheduleRef: Joi.string().alphanum().max(32).trim(true).optional().allow(null, ""),
    scheduleType: Joi.string().alphanum().max(50).trim(true).optional().allow(null, ""),
    scheduleStatusCd: Joi.string().alphanum().max(5).trim(true).optional().allow(null, ""),
    scheduleGenerationDate: Joi.date().iso().optional().allow(null),
    employerNestId: Joi.string().alphanum().max(30).trim(true).optional().allow(null, ""),
    groupSchemeId: Joi.string().alphanum().max(16).trim(true).optional().allow(null, ""),
    subSchemeId: Joi.string().alphanum().max(16).trim(true).optional().allow(null, ""),
    earningPeriodStartDate: Joi.date().iso().optional().allow(null),
    earningPeriodEndDate: Joi.date().iso().optional().allow(null),
    paymentPlanNo: Joi.string().alphanum().max(11).trim(true).optional().allow(null, ""),
    paymentRef: Joi.string().alphanum().max(35).trim(true).optional().allow(null, ""),
    paymentSourceName: Joi.string().alphanum().max(40).trim(true).optional().allow(null, ""),
    paymentMethod: Joi.string().alphanum().max(2).trim(true).optional(),
    paymentMethodDesc: Joi.string().alphanum().max(30).trim(true).optional().allow(null, ""),
    paymentFrequency: Joi.string().alphanum().max(2).trim(true).optional().allow(null, ""),
    paymentFrequencyDesc: Joi.string().alphanum().max(30).trim(true).optional().allow(null, ""),
    taxPayFrequencyInd: Joi.string().alphanum().max(1).trim(true).optional().allow(null, ""),
    futurePaymentDate: Joi.date().iso().optional().allow(null),
    paymentDueDate: Joi.date().iso().optional().allow(null),
    pegaCaseRef: Joi.string().alphanum().max(30).trim(true).optional().allow(null, ""),
    noOfMembs: Joi.number().max(8).optional().allow(null, ""),
    totScheduleAmt: Joi.number().optional().allow(null, ""),
    origScheduleRef: Joi.string().alphanum().max(14).trim(true).optional().allow(null, ""),
    recordStartDate: Joi.date().iso().optional().allow(null),
    recordEndDate: Joi.date().iso().optional().allow(null),
    createdBy: Joi.string().alphanum().max(50).trim(true).optional().allow(null, ""),
    updatedBy: Joi.string().alphanum().max(50).trim(true).optional().allow(null, "")
  });
  const { error } = schema.validate(contributionheader, joiOption);
  if (error) throw error;
});

ContributionHeader.beforeCreate(async (contributionheader, _options) => {
  const schema = Joi.object({
    contribHeaderId: Joi.number().required(),
    nestScheduleRef: Joi.string().alphanum().max(32).trim(true).required(),
    scheduleType: Joi.string().alphanum().max(50).trim(true).required(),
    scheduleStatusCd: Joi.string().alphanum().max(5).trim(true).required(),
    scheduleGenerationDate: Joi.date().iso().required(),
    employerNestId: Joi.string().alphanum().max(30).trim(true).required(),
    earningPeriodStartDate: Joi.date().iso().required(),
    earningPeriodEndDate: Joi.date().iso().required(),
    paymentSourceName: Joi.string().alphanum().max(40).trim(true).required(),
    paymentFrequency: Joi.string().alphanum().max(2).trim(true).required(),
    paymentFrequencyDesc: Joi.string().alphanum().max(30).trim(true).required(),
    paymentMethod: Joi.string().alphanum().max(2).trim(true).required(),
    paymentMethodDesc: Joi.string().alphanum().max(30).trim(true).required(),
    paymentDueDate: Joi.date().iso().required()
  });
  const { error } = schema.validate(contributionheader, joiOption);
  if (error) throw error;
});

export default ContributionHeader;
