import * as Joi from "joi";
import { DataTypes, Model } from "sequelize";
import { joiOption } from "../utils/constants";
import sequelize from "../utils/database";
import * as moment from "moment";
import app from "../utils/app";

class StgContrPolicy extends Model { }

StgContrPolicy.init(
  {
    contrPolicyId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "contr_policy_id",
      validate: {
        notEmpty: {
          msg: "contrPolicyId field cannot be empty",
        },
        notNull: {
          msg: "contrPolicyId field cannot be null",
        },
      },
    },
    recordId: {
      type: DataTypes.STRING(2),
      field: "record_id"
    },
    scheduleReference: {
      type: DataTypes.STRING(32),
      field: "schedule_reference"
    },
    membershipId: {
      type: DataTypes.STRING(16),
      field: "membership_id"
    },
    planReference: {
      type: DataTypes.STRING(16),
      field: "plan_reference"
    },
    policyId: {
      type: DataTypes.STRING(16),
      field: "policy_id"
    },
    taxReliefStatus: {
      type: DataTypes.STRING(3),
      field: "tax_relief_status"
    },
    taxReliefStatusDesc: {
      type: DataTypes.STRING(40),
      field: "tax_relief_status_desc"
    },
    salaryBasis: {
      type: DataTypes.STRING(1),
      field: "salary_basis"
    },
    salaryBasisDesc: {
      type: DataTypes.STRING(30),
      field: "salary_basis_desc"
    },
    regularContributionType: {
      type: DataTypes.STRING(3),
      field: "regular_contribution_type"
    },
    regularContributionTypeDesc: {
      type: DataTypes.STRING(30),
      field: "regular_contribution_type_desc"
    },
    contributionPercentage: {
      type: DataTypes.DECIMAL,
      field: "contribution_percentage"
    },
    lastPaidAmount: {
      type: DataTypes.DECIMAL,
      field: "last_paid_amount"
    },
    recordStartDate: {
      type: DataTypes.DATEONLY,
      field: "record_start_date",
      defaultValue: Joi.date().iso().default(() => moment().format(app.DEFAULT_DATE_FORMAT))
    },
    recordEndDate: {
      type: DataTypes.DATE,
      field: "record_end_date",
    },
    createdBy: {
      type: DataTypes.STRING(50),
      field: "created_by",
    }
  },
  {
    sequelize,
    tableName: "Stg_Contr_Policy",
    timestamps: false
  }
);

StgContrPolicy.beforeCreate(async (stgcontrpolicy, _options) => {
  const schema = Joi.object({
    contrPolicyId: Joi.number().required()
  });
  const { error } = schema.validate(stgcontrpolicy, joiOption);
  if (error) throw error;
});

export default StgContrPolicy;