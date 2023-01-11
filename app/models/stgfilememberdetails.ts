import * as Joi from "joi";
import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../utils/database";
import * as moment from "moment";
import app from "../utils/app";
import {File as ContributionFile} from "../models";

class StgFileMemberDetails extends Model {}

StgFileMemberDetails.init(
  {
    uploadFileId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
      field: "upload_file_id",
      validate: {
        notEmpty: {
          msg: "uploadFileId field cannot be empty",
        },
        notNull: {
          msg: "uploadFileId field cannot be null",
        },
      },
    },
    fileScheduleMemberId: {
      type: DataTypes.BIGINT,
      // allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity: true,
      field: "file_schedule_member_id",
    },
    forename: {
      type: DataTypes.STRING(30),
      field: "forename",
    },
    surname: {
      type: DataTypes.STRING(30),
      field: "surname",
    },
    nino: {
      type: DataTypes.STRING(9),
      field: "nino",
    },
    alternateUniqueId: {
      type: DataTypes.STRING(30),
      field: "alternate_unique_id",
    },
    pensionableEarnings: {
      type: DataTypes.DECIMAL,
      field: "pensionable_earnings",
    },
    memberEarnings: {
      type: DataTypes.DECIMAL,
      field: "member_earnings",
    },
    employerContribution: {
      type: DataTypes.DECIMAL,
      field: "employer_contribution",
    },
    memberContribution: {
      type: DataTypes.DECIMAL,
      field: "member_contribution",
    },
    reasonPartNonPayment: {
      type: DataTypes.STRING(50),
      field: "reason_part_non_payment",
    },
    effectivePartNonPaymentDate: {
      type: DataTypes.DATEONLY,
      field: "effective_part_non_payment_date",
    },
    newGroupName: {
      type: DataTypes.STRING(40),
      field: "new_group_name",
    },
    effectiveGroupChangeDate: {
      type: DataTypes.DATEONLY,
      field: "effective_group_change_date",
    },
    newPaymentSourceName: {
      type: DataTypes.STRING(40),
      field: "new_payment_source_name",
    },
    newGroupPensionableEarnings: {
      type: DataTypes.DECIMAL,
      field: "new_group_pensionable_earnings",
    },
    newGroupEmployerContribution: {
      type: DataTypes.DECIMAL,
      field: "new_group_employer_contribution",
    },
    newGroupMemberContribution: {
      type: DataTypes.DECIMAL,
      field: "new_group_member_contribution",
    },
    optoutReferenceNumber: {
      type: DataTypes.STRING(50),
      field: "optout_reference_number",
    },
    optoutDeclarationFlag: {
      type: DataTypes.STRING(1),
      field: "optout_declaration_flag",
    },
    secEnrolPensEarnings: {
      type: DataTypes.DECIMAL,
      field: "sec_enrol_pens_earnings",
    },
    secEnrolEmplContriAmt: {
      type: DataTypes.DECIMAL,
      field: "sec_enrol_empl_contri_amt",
    },
    secEnrolMembContriAmt: {
      type: DataTypes.DECIMAL,
      field: "sec_enrol_memb_contri_amt",
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
    scheduleExclusionType: {
      type: DataTypes.STRING(2),
      field: "schedule_exclusion_type",
    },
  },
  {
    sequelize,
    tableName: "Stg_File_Member_Details",
    timestamps: false,
  }
);

StgFileMemberDetails.belongsTo(ContributionFile, {
  targetKey: 'fileId', 
  foreignKey: 'uploadFileId',
  as: 'file'
})

export default StgFileMemberDetails;
