import * as Joi from "joi";
import { DataTypes, Model } from "sequelize";
import { joiOption } from "../utils/constants";
import sequelize from "../utils/database";
import * as moment from "moment";
import app from "../utils/app";

class StgContrMember extends Model {}

StgContrMember.init(
  {
    contrMemberId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      autoIncrementIdentity: true,
      primaryKey: true,
      field: "contr_member_id",
      validate: {
        notEmpty: {
          msg: "contrMemberId field cannot be empty",
        },
        notNull: {
          msg: "contrMemberId field cannot be null",
        },
      },
    },
    recordId: {
      type: DataTypes.STRING(2),
      field: "record_id",
    },
    scheduleReference: {
      type: DataTypes.STRING(32),
      field: "schedule_reference",
    },
    cmPartyId: {
      type: DataTypes.NUMBER,
      field: "cm_party_id",
    },
    crmPartyId: {
      type: DataTypes.STRING(36),
      field: "crm_party_id",
    },
    planReference: {
      type: DataTypes.STRING(16),
      field: "plan_reference",
    },
    membershipId: {
      type: DataTypes.STRING(16),
      field: "membership_id",
    },
    schemePayrollReference: {
      type: DataTypes.STRING(16),
      field: "scheme_payroll_reference",
    },
    nino: {
      type: DataTypes.STRING(12),
      field: "nino",
    },
    forename: {
      type: DataTypes.STRING(30),
      field: "forename",
    },
    surname: {
      type: DataTypes.STRING(40),
      field: "surname",
    },
    membershipEffectiveDate: {
      type: DataTypes.DATEONLY,
      field: "membership_effective_date",
    },
    membershipStatus: {
      type: DataTypes.STRING(1),
      field: "membership_status",
    },
    membershipStatusDesc: {
      type: DataTypes.STRING(20),
      field: "membership_status_desc",
    },
    category: {
      type: DataTypes.NUMBER,
      field: "category",
    },
    categoryName: {
      type: DataTypes.STRING(75),
      field: "category_name",
    },
    newCategory: {
      type: DataTypes.NUMBER,
      field: "new_category",
    },
    newCategoryName: {
      type: DataTypes.STRING(75),
      field: "new_category_name",
    },
    pensionableSalary: {
      type: DataTypes.DECIMAL,
      field: "pensionable_salary",
    },
    reasonCode: {
      type: DataTypes.STRING(5),
      field: "reason_code",
    },
    currentEmployerContribution: {
      type: DataTypes.DECIMAL,
      field: "current_employer_contribution",
    },
    currentMemberContribution: {
      type: DataTypes.DECIMAL,
      field: "current_member_contribution",
    },
    newEmployerContribution: {
      type: DataTypes.DECIMAL,
      field: "new_employer_contribution",
    },
    newMemberContribution: {
      type: DataTypes.DECIMAL,
      field: "new_member_contribution",
    },
    newSalary: {
      type: DataTypes.DECIMAL,
      field: "new_salary",
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
    },
    createdBy: {
      type: DataTypes.STRING(50),
      field: "created_by",
    },
  },
  {
    sequelize,
    tableName: "Stg_Contr_Mem",
    timestamps: false,
  }
);

StgContrMember.beforeCreate(async (stgcontrmember, _options) => {
  const schema = Joi.object({
    contrMemberId: Joi.number().required(),
  });
  const { error } = schema.validate(stgcontrmember, joiOption);
  if (error) throw error;
});

export default StgContrMember;
