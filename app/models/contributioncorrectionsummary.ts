import * as Joi from "joi";
import { DataTypes, Model, Sequelize } from "sequelize";
import { joiOption } from "../utils/constants";
import sequelize from "../utils/database";

class ContributionCorrectionSummary extends Model {}

ContributionCorrectionSummary.init(
  {
    contributionCorrectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
      field: "contribution_correction_id",
      validate: {
        notEmpty: {
          msg: "contributionCorrectionId field cannot be empty",
        },
        notNull: {
          msg: "contributionCorrectionId field cannot be null",
        },
      },
    },
    correctionType: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: "correction_type",
      validate: {
        notEmpty: {
          msg: "correctionType field cannot be empty",
        },
        notNull: {
          msg: "correctionType field cannot be null",
        },
        isIn: {
          args: [["R", "C"]],
          msg: "Value of taxPayFrequencyInd field must be R or C",
        },
      },
    },
    totalMemberRefundAmt: {
      type: DataTypes.DECIMAL,
      field: "total_member_refund_amt",
    },
    offsetGainsLossAmt: {
      type: DataTypes.DECIMAL,
      field: "offset_gains_loss_amt",
    },
    netTotContribAmt: {
      type: DataTypes.DECIMAL,
      field: "net_tot_contrib_amt",
    },
    netTotRefundAmt: {
      type: DataTypes.DECIMAL,
      field: "net_tot_refund_amt",
    },
    contribSubmissionRef: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "contrib_submission_ref",
      validate: {
        notEmpty: {
          msg: "contribSubmissionRef field cannot be empty",
        },
        notNull: {
          msg: "contribSubmissionRef field cannot be null",
        },
      },
    },
    createdDate: {
      type: DataTypes.DATE,
      field: "created_date",
    },
    createdBy: {
      type: DataTypes.STRING(50),
      field: "created_by",
    },
  },
  {
    sequelize,
    tableName: "Contribution_Correction_Summary",
    createdAt: false,
    timestamps: false,
  }
);

ContributionCorrectionSummary.addHook(
  "beforeValidate",
  (contributioncorrectionsummary, _options) => {
    const schema = Joi.object({
      contributionCorrectionId: Joi.string().optional().allow(null, ""),
      correctionType: Joi.string()
        .max(1)
        .valid("R", "C")
        .insensitive()
        .optional()
        .allow(null, ""),
      totalMemberRefundAmt: Joi.number().optional().allow(null, ""),
      offsetGainsLossAmt: Joi.number().optional().allow(null, ""),
      netTotContribAmt: Joi.number().optional().allow(null, ""),
      netTotRefundAmt: Joi.number().optional().allow(null, ""),
      contribSubmissionRef: Joi.string().optional().allow(null, ""),
      createdDate: Joi.date().iso().optional().allow(null),
      createdBy: Joi.string()
        .alphanum()
        .max(50)
        .trim(true)
        .optional()
        .allow(null, ""),
    });
    const { error } = schema.validate(contributioncorrectionsummary, joiOption);
    if (error) throw error;
  }
);

ContributionCorrectionSummary.beforeCreate(
  async (contributioncorrectionsummary, _options) => {
    const schema = Joi.object({
      contributionCorrectionId: Joi.string().required(),
      correctionType: Joi.string().max(1).required(),
      contribSubmissionRef: Joi.string().required(),
    });
    const { error } = schema.validate(contributioncorrectionsummary, joiOption);
    if (error) throw error;
  }
);

export default ContributionCorrectionSummary;
