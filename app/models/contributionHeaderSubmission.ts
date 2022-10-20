import * as Joi from "joi";
import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../utils/database";
import { joiOption } from "../utils/constants";
import ContributionHeader from "./contributionheader";
import MemberContributionSubmission from "./memberContributionSubmission";
import File from "./file";
import FileHeaderMap from "./fileheadermap";

class ContributionHeaderSubmission extends Model { }

ContributionHeaderSubmission.init(
  {
    submissionHeaderId: {
      type: DataTypes.UUID,
      field: "submission_header_id",
      allowNull: false,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
      primaryKey: true,
      validate: {
        notEmpty: {
          msg: "submissionHeaderId field cannot be empty",
        },
        notNull: {
          msg: "submissionHeaderId field cannot be null",
        },
      }
    },
    contribHeaderId: {
      type: DataTypes.UUID,
      field: "contrib_header_id",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "contribHeaderId field cannot be empty",
        },
        notNull: {
          msg: "contribHeaderId field cannot be null",
        },
      }
    },
    scheduleSubmissionSeq: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      autoIncrementIdentity: true,
      field: "schedule_submission_seq",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "schedule_submission_seq field cannot be empty",
        },
        notNull: {
          msg: "schedule_submission_seq field cannot be null",
        },
      },
    },
    submissionType: {
      type: DataTypes.STRING(1),
      field: "submission_type",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Submission_Type field cannot be empty",
        },
        notNull: {
          msg: "Submission_Type field cannot be null",
        },
      },
    },
    submissionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "submission_date"
    },
    futurePaymentDate: {
      type: DataTypes.DATEONLY,
      field: "future_payment_date"
    },
    noOfMembsSubmitted: {
      type: DataTypes.DECIMAL(8, 0),
      field: "no_of_membs_submitted"
    },
    totContrSubmissionAmt: {
      type: DataTypes.DECIMAL(15, 2),
      field: "tot_contr_submission_amt"
    },
    interimPaymentMethod: {
      type: DataTypes.STRING(2),
      field: "interim_payment_method"
    },
    createdDate: {
      type: DataTypes.DATE,
      field: "created_date"
    },
    createdBy: {
      type: DataTypes.STRING(50),
      field: "created_by"
    }
  }, {
  sequelize,
  tableName: "Contribution_Header_Submission",
  timestamps: false
})
ContributionHeaderSubmission.hasOne(ContributionHeader, {
  sourceKey: "contribHeaderId",
  foreignKey: "contribHeaderId",
  as: "contributionheader",
});
ContributionHeader.belongsTo(ContributionHeaderSubmission, {
  as: "contributionheadersubmission",
  targetKey: "contribHeaderId",
  foreignKey: { name: "contribHeaderId", allowNull: false },
  constraints: true,
  onDelete: "CASCADE",
});

ContributionHeaderSubmission.hasMany(MemberContributionSubmission, {
  sourceKey: "submissionHeaderId",
  foreignKey: "contribSubmissionRef",
  as: "membercontributionsubmission",
});
MemberContributionSubmission.belongsTo(ContributionHeaderSubmission, {
  as: "contributionheadersubmission",
  targetKey: "submissionHeaderId",
  foreignKey: { name: "contribSubmissionRef", allowNull: false },
  constraints: true,
  onDelete: "CASCADE",
});
ContributionHeaderSubmission.hasOne(FileHeaderMap, {
  sourceKey: "submissionHeaderId",
  foreignKey: "submissionHeaderId",
  as: "fileheadermap",
});
FileHeaderMap.belongsTo(ContributionHeaderSubmission, {
  as: "contributionheadersubmission",
  targetKey: "submissionHeaderId",
  foreignKey: { name: "submissionHeaderId", allowNull: false },
  constraints: true,
  onDelete: "CASCADE",
});
ContributionHeaderSubmission.addHook("beforeValidate", (contributionheadersubmission, _options) => {
  const schema = Joi.object({
    contribHeaderId: Joi.string().trim(true).optional().allow(null, ""),
    scheduleSubmissionSeq: Joi.number().optional().allow(null, ""),
    submissionType: Joi.string().alphanum().max(50).trim(true).optional().allow(null, ""),
    submissionDate: Joi.date().iso().optional().allow(null),
    futurePaymentDate: Joi.date().iso().optional().allow(null),
    noOfMembsSubmitted: Joi.number().max(8).optional().allow(null, ""),
    totContrSubmissionAmt: Joi.number().optional().allow(null, ""),
    createdDate: Joi.date().iso().optional().allow(null),
    createdBy: Joi.string().alphanum().max(50).trim(true).optional().allow(null, ""),
  });

  const { error } = schema.validate(contributionheadersubmission, joiOption);
  if (error) throw error;
});

ContributionHeaderSubmission.beforeCreate(async (contributionheadersubmission, _options) => {
  const schema = Joi.object({
    contribHeaderId: Joi.string().trim(true).required(),
    submissionType: Joi.string().alphanum().max(1).trim(true).required(),
    submissionDate: Joi.date().iso().required(),
  });
  const { error } = schema.validate(contributionheadersubmission, joiOption);
  if (error) throw error;
});

export default ContributionHeaderSubmission;
