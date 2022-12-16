import * as Joi from "joi";
import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import { joiOption } from "../utils/constants";
import ContributionDetails from "./contributionDetails";

class MemberContributionSubmission extends Model { }

MemberContributionSubmission.init(
  {
    membSubmId: {
      type: DataTypes.BIGINT,
      field: "memb_subm_id",
      allowNull: false,
      autoIncrement: true,
      autoIncrementIdentity: true,
      primaryKey: true,
      validate: {
        notEmpty: {
          msg: "Member Submission Id field cannot be empty",
        },
        notNull: {
          msg: "Member Submission Id field cannot be null",
        },
      }
    },
    submissionHeaderId: {
      type: DataTypes.UUID,
      field: "submission_header_id",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Contribution Submission Reference field cannot be empty",
        },
        notNull: {
          msg: "Contribution Submission Reference field cannot be null",
        },
      }
    },
    membContribDetlId: {
      type: DataTypes.UUID,
      field: "memb_contrib_detl_id",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Member Contribution Detail Id field cannot be empty",
        },
        notNull: {
          msg: "Member Contribution Detail Id field cannot be null",
        },
      }
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
  tableName: "Member_Contribution_Submission",
  timestamps: false
})

MemberContributionSubmission.hasOne(ContributionDetails, {
  sourceKey: "membContribDetlId",
  foreignKey: "membContribDetlId",
  as: "contributiondetails",
});
ContributionDetails.belongsTo(MemberContributionSubmission, {
  as: "membercontributionsubmission",
  targetKey: "membContribDetlId",
  foreignKey: { name: "membContribDetlId", allowNull: false },
  constraints: true,
  onDelete: "CASCADE",
});

MemberContributionSubmission.addHook("beforeValidate", (membercontributionsubmission, _options) => {
  const schema = Joi.object({
    submissionHeaderId: Joi.string().optional().allow(null, ""),
    createdDate: Joi.date().iso().optional().allow(null),
    createdBy: Joi.string().alphanum().max(50).trim(true).optional().allow(null, "")
  });

  const { error } = schema.validate(membercontributionsubmission, joiOption);
  if (error) throw error;
});

export default MemberContributionSubmission;
