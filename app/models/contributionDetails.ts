import * as Joi from "joi";
import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../utils/database";
import * as moment from "moment";
import app from "../utils/app";
import { errorDetails } from "../utils/constants";
import { ContributionMemberDetails } from "../schemas";
import { Context } from "@azure/functions";
import Status from "../utils/config";
import { CustomError } from "../Errors";
import RDScheduleMemberStatus from "./rdschedulememberstatus";
import RDPartContribReason from "./rdpartcontribreason";
import ErrorDetails from "./errorDetails";
class ContributionDetails extends Model {}

ContributionDetails.init(
  {
    membContribDetlId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
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
      field: "memb_plan_ref",
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
      field: "scm_party_id",
    },
    nino: {
      type: DataTypes.STRING(9),
      field: "nino",
    },
    alternativeId: {
      type: DataTypes.STRING(16),
      field: "alternative_id",
    },
    autoCalcFlag: {
      type: DataTypes.STRING(1),
      field: "auto_calc_flag",
    },
    pensEarnings: {
      type: DataTypes.DECIMAL,
      field: "pens_earnings",
    },
    emplContriAmt: {
      type: DataTypes.DECIMAL,
      field: "empl_contri_amt",
    },
    membContriAmt: {
      type: DataTypes.DECIMAL,
      field: "memb_contri_amt",
    },
    membNonPayReason: {
      type: DataTypes.STRING(5),
      field: "memb_non_pay_reason",
    },
    membLeaveEarnings: {
      type: DataTypes.DECIMAL,
      field: "memb_leave_earnings",
    },
    newGroupName: {
      type: DataTypes.STRING(40),
      field: "new_group_name",
    },
    newGroupPensEarnings: {
      type: DataTypes.DECIMAL,
      field: "new_group_pens_earnings",
    },
    newGroupEmplContriAmt: {
      type: DataTypes.DECIMAL,
      field: "new_group_empl_contri_amt",
    },
    newGroupMembContriAmt: {
      type: DataTypes.DECIMAL,
      field: "new_group_memb_contri_amt",
    },
    optoutRefNum: {
      type: DataTypes.STRING(20),
      field: "optout_ref_num",
    },
    optoutDeclarationFlag: {
      type: DataTypes.STRING(1),
      field: "optout_declaration_flag",
    },
    newPaymentPlanNo: {
      type: DataTypes.STRING(11),
      field: "new_payment_plan_no",
    },
    newPaymentSourceName: {
      type: DataTypes.STRING(40),
      field: "new_payment_source_name",
    },
    membNonPayEffDate: {
      type: DataTypes.DATE,
      field: "memb_non_pay_eff_date",
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
    channelType: {
      type: DataTypes.STRING(3),
      field: "channel_type",
    },
    memberExcludedFlag: {
      type: DataTypes.STRING(1),
      field: "member_excluded_flag",
    },
    membPaymentDueDate: {
      type: DataTypes.DATE,
      field: "memb_payment_due_date",
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
    updatedBy: {
      type: DataTypes.STRING(50),
      field: "updated_by",
    },
    lastUpdatedTimestamp: {
      type: DataTypes.DATE,
      field: "last_updated_timestamp",
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
    newEmpGroupId: {
      type: DataTypes.BIGINT,
      field: "new_emp_group_id",
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
    origScheduleRef: {
      type: DataTypes.STRING(14),
      field: "orig_schedule_ref",
    },
    contribHeaderId: {
      type: DataTypes.UUID,
      field: "contrib_header_id",
    },
    firstName: {
      type: DataTypes.STRING(50),
      field: "first_name",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "firstName field cannot be empty",
        },
        notNull: {
          msg: "firstName field cannot be null",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      field: "last_name",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "lastName field cannot be empty",
        },
        notNull: {
          msg: "lastName field cannot be null",
        },
      },
    },
    enrolmentType: {
      type: DataTypes.STRING(1),
      field: "enrolment_type",
    },
    secEnrolmentType: {
      type: DataTypes.STRING(1),
      field: "sec_enrolment_type",
    },
    emplContriPct: {
      type: DataTypes.DECIMAL,
      field: "empl_contri_pct",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "emplContriPct field cannot be empty",
        },
        notNull: {
          msg: "emplContriPct field cannot be null",
        },
      },
    },
    membContriPct: {
      type: DataTypes.DECIMAL,
      field: "memb_contri_pct",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "membContriPct field cannot be empty",
        },
        notNull: {
          msg: "membContriPct field cannot be null",
        },
      },
    },
    newGroupEmplContriPct: {
      type: DataTypes.DECIMAL,
      field: "new_group_empl_contri_pct",
    },
    newGroupMembContriPct: {
      type: DataTypes.DECIMAL,
      field: "new_group_memb_contri_pct",
    },
    recordChangedFlag: {
      type: DataTypes.STRING(1),
      field: "record_changed_flag",
      get() {
        return app.getValue(this, "recordChangedFlag");
      },
      set(value) {
        app.setValue(this, "recordChangedFlag", value);
      },
    },
    memTaxReliefEligibility: {
      type: DataTypes.STRING(1),
      field: "mem_tax_relief_eligibility",
    },
    origMembNonPayReason: {
      type: DataTypes.STRING(5),
      field: "orig_memb_non_pay_reason",
    },
    currMembPlanStatusCd: {
      type: DataTypes.STRING(2),
      field: "curr_memb_plan_status_cd",
    },
    currPensEarnings: {
      type: DataTypes.DECIMAL,
      field: "curr_pens_earnings",
    },
    currEmplContriAmt: {
      type: DataTypes.DECIMAL,
      field: "curr_empl_contri_amt",
    },
    currMembContriAmt: {
      type: DataTypes.DECIMAL,
      field: "curr_memb_contri_amt",
    },
  },
  {
    sequelize,
    tableName: "Member_Contribution_Details",
    updatedAt: "last_updated_timestamp",
    timestamps: true,
    createdAt: false,
  }
);
ContributionDetails.hasOne(RDScheduleMemberStatus, {
  sourceKey: "schdlMembStatusCd",
  foreignKey: "schdlMembStatusCode",
  as: "rdschedulememberstatus",
});
RDScheduleMemberStatus.belongsTo(ContributionDetails, {
  as: "contributiondetails",
  targetKey: "schdlMembStatusCd",
  foreignKey: { name: "schdlMembStatusCode", allowNull: false },
  constraints: true,
  onDelete: "CASCADE",
});

ContributionDetails.hasOne(RDPartContribReason, {
  sourceKey: "membNonPayReason",
  foreignKey: "reasonCode",
  as: "rdpartcontribreason",
});
RDPartContribReason.belongsTo(ContributionDetails, {
  as: "contributiondetails",
  targetKey: "membNonPayReason",
  foreignKey: { name: "reasonCode", allowNull: false },
  constraints: true,
  onDelete: "CASCADE",
});

ContributionDetails.hasMany(ErrorDetails, {
  sourceKey: "membContribDetlId",
  foreignKey: "membContribDetlId",
  as: "errorDetails",
});
ErrorDetails.belongsTo(ContributionDetails, {
  as: "contributiondetails",
  targetKey: "membContribDetlId",
  foreignKey: { name: "membContribDetlId", allowNull: false },
  constraints: true,
  onDelete: "CASCADE",
});

/**
 * Before update hook
 */
ContributionDetails.beforeUpdate((contributionDetails, _options) => {
  try {
    const schema = Joi.object({
      membPlanRef: Joi.string().max(16).optional().allow(null, ""),
      schdlMembStatusCd: Joi.string().max(5).optional().allow(null, ""),
      membPartyId: Joi.string().max(36).optional().allow(null, ""),
      scmPartyId: Joi.string().max(16).optional().allow(null, ""),
      nino: Joi.string().max(9).optional().allow(null, ""),
      alternativeId: Joi.string().max(16).optional().allow(null, ""),
      autoCalcFlag: Joi.string().max(1).min(1).optional().allow(null, ""),
      membNonPayReason: Joi.string().max(5).optional().allow(null, ""),
      newGroupName: Joi.string().max(40).optional().allow(null, ""),

      optoutRefNum: Joi.string().max(20).optional().allow(null, ""),
      optoutDeclarationFlag: Joi.string()
        .max(1)
        .min(1)
        .optional()
        .allow(null, ""),
      newPaymentPlanNo: Joi.string().max(11).optional().allow(null, ""),
      newPaymentSourceName: Joi.string().max(40).optional().allow(null, ""),

      channelType: Joi.string().max(3).optional().allow(null, ""),
      memberExcludedFlag: Joi.string().max(1).min(1).optional().allow(null, ""),

      membPaymentDueDate: Joi.date().iso().optional().allow(null, ""),
      recordStartDate: Joi.date().iso().optional().allow(null, ""),
      recordEndDate: Joi.date().iso().optional().allow(null, ""),
      membNonPayEffDate: Joi.date().iso().optional().allow(null, ""),

      secEnrolPensEarnings: Joi.number().optional().allow(null, ""),
      secEnrolEmplContriAmt: Joi.number().optional().allow(null, ""),
      secEnrolMembContriAmt: Joi.number().optional().allow(null, ""),
      newGroupPensEarnings: Joi.number().optional().allow(null, ""),
      newGroupEmplContriAmt: Joi.number().optional().allow(null, ""),
      newGroupMembContriAmt: Joi.number().optional().allow(null, ""),
      membLeaveEarnings: Joi.number().optional().allow(null, ""),
      pensEarnings: Joi.number().optional().allow(null, ""),
      emplContriAmt: Joi.number().optional().allow(null, ""),
      membContriAmt: Joi.number().optional().allow(null, ""),
      newEmpGroupId: Joi.number().integer().optional().allow(null, ""),
    });

    Joi.assert(contributionDetails, schema, {
      allowUnknown: true,
    });
  } catch (error) {
    throw new CustomError(
      "CONTRIBUTION_DETAILS_VALIDATION_FAILED",
      error.message
    );
  }
});

// Model helper methods

/**
 * This is helper method to update one by one member details
 * @param membContribDetlId
 * @param currentMemberDetails
 * @param currentIndex
 * @param allErrors
 * @param transaction
 * @param context
 * @returns
 */
export const contributionDetailsUpdateHelper = async function (
  membContribDetlId: string,
  currentMemberDetails: ContributionMemberDetails,
  currentIndex: number,
  allErrors: Array<UpdateError>,
  transaction,
  context: Context
) {
  if (app.isNullEmpty(currentMemberDetails)) {
    context.log(`currentMemberDetails is empty object`);
    allErrors.push({
      statusCode: Status.BAD_REQUEST,
      errorCode: errorDetails.CIA0600[0],
      errorDetail: errorDetails.CIA0600[1],
    });
  } else if (!membContribDetlId) {
    context.log(
      `membContribDetlId is not present or undefined! value is ${membContribDetlId}`
    );
    allErrors.push({
      statusCode: Status.NOT_FOUND,
      errorCode: errorDetails.CIA0601[0],
      errorDetail: errorDetails.CIA0601[1],
    });
  } else {
    const schdlMembStatusCd: any = await ContributionDetails.findOne({
      attributes: ["schdlMembStatusCd"],
      where: {
        membContribDetlId: membContribDetlId,
      },
    });

    if (schdlMembStatusCd) {
      if (
        schdlMembStatusCd["dataValues"]["schdlMembStatusCd"] != "MCS0" &&
        schdlMembStatusCd["dataValues"]["schdlMembStatusCd"] != "MCS1" &&
        schdlMembStatusCd["dataValues"]["schdlMembStatusCd"] != "MCS2" &&
        schdlMembStatusCd["dataValues"]["schdlMembStatusCd"] != "MCS3"
      ) {
        context.log(
          `schdlMembStatusCd is not draft or To be reviewed or Ready to submit or Attention needed`
        );
        allErrors.push({
          statusCode: Status.NOT_FOUND,
          errorCode: errorDetails.CIA0604[0],
          errorDetail: errorDetails.CIA0604[1],
        });
        return allErrors;
      }
    }

    currentMemberDetails["updatedBy"] = "SYSTEM"; // This need be changed once we confirm
    currentMemberDetails["recordChangedFlag"] = "Y";

    if (schdlMembStatusCd) {
      if (schdlMembStatusCd["dataValues"]["schdlMembStatusCd"] === "MCS0") {
        currentMemberDetails["schdlMembStatusCd"] = "MCS1";
      }
    }

    const effectRows = (await ContributionDetails.update(
      {
        ...currentMemberDetails,
      },
      {
        where: { membContribDetlId: membContribDetlId },
        transaction,
        individualHooks: true,
      }
    )) as any;

    // Expecting effect rows may be zero when same value passed, but find row will present
    // If zero rows effected the not found
    if (effectRows && effectRows[1]?.length === 0) {
      context.log(
        `Update of membContribDetlId:${membContribDetlId} is failed..! ${effectRows}`
      );
      allErrors.push({
        statusCode: Status.NOT_FOUND,
        errorCode: errorDetails.CIA0601[0],
        errorDetail: errorDetails.CIA0601[1],
      });
    }
  }
  return allErrors;
};

export default ContributionDetails;

export interface UpdateError {
  statusCode: Status;
  errorDetail: string;
  errorCode: string;
  membContribDetlId?: string;
}
