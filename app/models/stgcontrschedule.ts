import * as Joi from "joi";
import { DataTypes, Model } from "sequelize";
import { joiOption } from "../utils/constants";
import sequelize from "../utils/database";
import * as moment from "moment";
import app from "../utils/app";

class StgContrSchedule extends Model {}

StgContrSchedule.init(
  {
    scheduleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      field: "schedule_id",
      validate: {
        notEmpty: {
          msg: "scheduleId field cannot be empty",
        },
        notNull: {
          msg: "scheduleId field cannot be null",
        },
      },
    },
    scheduleReference: {
      type: DataTypes.STRING(32),
      allowNull: false,
      field: "schedule_reference",
      validate: {
        notEmpty: {
          msg: "scheduleReference field cannot be empty",
        },
        notNull: {
          msg: "scheduleReference field cannot be null",
        },
      },
    },
    groupSchemeID: {
      type: DataTypes.STRING(16),
      field: "group_scheme_id",
    },
    subSchemeId: {
      type: DataTypes.STRING(16),
      field: "sub_scheme_id",
    },
    subSchemeName: {
      type: DataTypes.STRING(75),
      field: "sub_scheme_name",
    },
    effectiveDate: {
      type: DataTypes.DATEONLY,
      field: "effective_date",
    },
    scheduleType: {
      type: DataTypes.STRING(2),
      field: "schedule_type",
    },
    paymentPlanNo: {
      type: DataTypes.STRING(11),
      field: "payment_plan_no",
    },
    payReference: {
      type: DataTypes.STRING(35),
      field: "pay_reference",
    },
    paymentSourceName: {
      type: DataTypes.STRING(40),
      field: "payment_source_name",
    },
    paymentDueDate: {
      type: DataTypes.DATEONLY,
      field: "payment_due_date",
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      field: "start_date",
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      field: "end_date",
      allowNull: true,
    },
    mopType: {
      type: DataTypes.STRING(2),
      field: "mop_type",
    },
    mopTypeDesc: {
      type: DataTypes.STRING(20),
      field: "mop_type_desc",
    },
    premFrequency: {
      type: DataTypes.STRING(2),
      field: "prem_frequency",
    },
    premFrequencyDesc: {
      type: DataTypes.STRING(15),
      field: "prem_frequency_desc",
    },
    taxPeriodFreqInd: {
      type: DataTypes.STRING(1),
      field: "tax_period_freq_ind",
    },
    numberOfMembers: {
      type: DataTypes.NUMBER,
      field: "number_of_members",
    },
    recordStartDate: {
      type: DataTypes.DATEONLY,
      field: "record_start_date",
      defaultValue: Joi.date()
        .iso()
        .default(() => moment().format(app.DEFAULT_DATE_FORMAT)),
    },
    recordEndDate: {
      type: DataTypes.DATE,
      field: "record_end_date",
      get() {
        return app.getDate(this, "recordEndDate", "endDate");
      },
    },
    createdBy: {
      type: DataTypes.STRING(50),
      field: "created_by",
    },
  },
  {
    sequelize,
    tableName: "Stg_Contr_Sch",
    timestamps: false,
  }
);

StgContrSchedule.beforeCreate(async (stgcontrschedule, _options) => {
  const schema = Joi.object({
    scheduleId: Joi.number().required(),
    scheduleReference: Joi.string().alphanum().max(32).trim(true).required(),
  });
  const { error } = schema.validate(stgcontrschedule, joiOption);
  if (error) throw error;
});

export default StgContrSchedule;
