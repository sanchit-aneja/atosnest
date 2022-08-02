import * as Joi from "joi";
import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import * as moment from "moment";
import app from "../utils/app";

class ContributionDetails extends Model { }

ContributionDetails.init(
  {
    membContribDetlId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      autoIncrementIdentity: true,
      primaryKey: true,
      field: "memb_contrib_detl_id",
      validate: {
        notEmpty: {
          msg: "membContribDetlId field cannot be empty",
        },
        notNull: {
          msg: "membContribDetlId field cannot be null",
        },
      },
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
    membEnrolmentRef: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "memb_enrolment_ref",
      validate: {
        notEmpty: {
          msg: "membEnrolmentRef field cannot be empty",
        },
        notNull: {
          msg: "membEnrolmentRef field cannot be null",
        },
      },
    },
    membContriDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "memb_contri_due_date",
      validate: {
        notEmpty: {
          msg: "membContriDueDate field cannot be empty",
        },
        notNull: {
          msg: "membContriDueDate field cannot be null",
        },
      },
    },
    membPlanRef: {
      type: DataTypes.STRING(16),
      field: "memb_plan_ref"
    },
    empGroupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "emp_group_id",
      validate: {
        notEmpty: {
          msg: "empGroupId field cannot be empty",
        },
        notNull: {
          msg: "empGroupId field cannot be null",
        },
      },
    },
    groupName: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: "group_name",
      validate: {
        notEmpty: {
          msg: "groupName field cannot be empty",
        },
        notNull: {
          msg: "groupName field cannot be null",
        },
      },
    },
    schdlMembStatusCd: {
      type: DataTypes.STRING(5),
      allowNull: false,
      field: "schdl_memb_status_cd",
      validate: {
        notEmpty: {
          msg: "schdlMembStatusCd field cannot be empty",
        },
        notNull: {
          msg: "schdlMembStatusCd field cannot be null",
        },
      },
    },
    membPartyId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: "memb_party_id",
      validate: {
        notEmpty: {
          msg: "membPartyId field cannot be empty",
        },
        notNull: {
          msg: "membPartyId field cannot be null",
        },
      },
    },
    scmPartyId: {
      type: DataTypes.STRING(16),
      field: "scm_party_id"
    },
    nino: {
      type: DataTypes.STRING(9),
      field: "nino"
    },
    alternativeID: {
      type: DataTypes.STRING(16),
      field: "alternative_id"
    },
    lastPaidPensEarnings: {
      type: DataTypes.DECIMAL,
      field: "last_paid_pens_earnings"
    },
    lastPaidReasonCode: {
      type: DataTypes.STRING(5),
      field: "last_paid_reason_code"
    },
    lastPaidEmplContriAmt: {
      type: DataTypes.DECIMAL,
      field: "last_paid_empl_contri_amt"
    },
    lastPaidMembContriAmt: {
      type: DataTypes.DECIMAL,
      field: "last_paid_memb_contri_amt"
    },
    autoCalcFlag: {
      type: DataTypes.STRING(1),
      field: "auto_calc_flag"
    },
    pensEarnings: {
      type: DataTypes.DECIMAL,
      field: "pens_earnings"
    },
    emplContriAmt: {
      type: DataTypes.DECIMAL,
      field: "empl_contri_amt"
    },
    membContriAmt: {
      type: DataTypes.DECIMAL,
      field: "memb_contri_amt"
    },
    membNonPayReason: {
      type: DataTypes.STRING(5),
      allowNull: false,
      field: "memb_non_pay_reason",
      validate: {
        notEmpty: {
          msg: "membNonPayReason field cannot be empty",
        },
        notNull: {
          msg: "membNonPayReason field cannot be null",
        },
      },
    },
    membLeaveEarnings: {
      type: DataTypes.DECIMAL,
      field: "memb_leave_earnings"
    },
    newEmpGroupId: {
      type: DataTypes.BIGINT,
      field: "new_emp_group_id"
    },
    NewGroupName: {
      type: DataTypes.STRING(40),
      field: "new_group_name"
    },
    newGroupPensEarnings: {
      type: DataTypes.DECIMAL,
      field: "new_group_pens_earnings"
    },
    newGroupEmplContriAmt: {
      type: DataTypes.DECIMAL,
      field: "new_group_empl_contri_amt"
    },
    newGroupMembContriAmt: {
      type: DataTypes.DECIMAL,
      field: "new_group_memb_contri_amt"
    },
    optoutRefNum: {
      type: DataTypes.STRING(20),
      field: "optout_ref_num"
    },
    optoutDeclarationFlag: {
      type: DataTypes.STRING(1),
      field: "optout_declaration_flag"
    },
    newPaymentPlanNo: {
      type: DataTypes.STRING(11),
      field: "new_payment_plan_no"
    },
    newPaymentSourceName: {
      type: DataTypes.STRING(40),
      field: "new_payment_source_name"
    },
    membNonPayEffDate: {
      type: DataTypes.DATE,
      field: "memb_non_pay_eff_date"
    },
    secEnrolPensEarnings: {
      type: DataTypes.DECIMAL,
      field: "sec_enrol_pens_earnings"
    },
    secEnrolEmplContriAmt: {
      type: DataTypes.DECIMAL,
      field: "sec_enrol_empl_contri_amt"
    },
    secEnrolMembContriAmt: {
      type: DataTypes.DECIMAL,
      field: "sec_enrol_memb_contri_amt"
    },
    channelType: {
      type: DataTypes.STRING(3),
      field: "channel_type"
    },
    memberExcludedFlag: {
      type: DataTypes.STRING(1),
      field: "member_excluded_flag"
    },
    membPaymentDueDate: {
      type: DataTypes.DATE,
      field: "memb_payment_due_date"
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
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      field: "updated_by",
    },
    lastUpdatedTimestamp: {
      type: DataTypes.NOW,
      field: "last_updated_timestamp"
    }
  },
  {
    sequelize,
    tableName: "Member_Contribution_Details",
    timestamps: false
  }
);

export default ContributionDetails;
