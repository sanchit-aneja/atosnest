import * as Joi from "joi";
import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import * as moment from "moment";
import app from "../utils/app";
import { joiOption } from "../utils/constants";

class ContributionHeaderSubmission extends Model { }

ContributionHeaderSubmission.init(
  {
    contribSubmissionRef: { 
        type: DataTypes.BIGINT,
        field:"contrib_submission_ref", 
        allowNull: false, 
        autoIncrement:true,
        autoIncrementIdentity:true,
        primaryKey:true,
        validate: {
            notEmpty: {
              msg: "Contrib_Submission_Ref field cannot be empty",
            },
            notNull: {
              msg: "Contrib_Submission_Ref field cannot be null",
            },
          }
    }, 
    contribFileId: { 
        type: DataTypes.BIGINT,
        field:"contrib_file_id",
        allowNull: false,
        validate: {
            notEmpty: {
              msg: "Contrib_File_Id field cannot be empty",
            },
            notNull: {
              msg: "Contrib_File_Id field cannot be null",
            },
          }

    }, 
    NESTScheduleRef: { 
        type: DataTypes.STRING(14),
        field:"nest_schedule_ref",
        allowNull:false,
        validate: {
            notEmpty: {
              msg: "NEST_Schedule_Ref field cannot be empty",
            },
            notNull: {
              msg: "NEST_Schedule_Ref field cannot be null",
            },
          },
    },
    ScheduleSubmissionSeq: { 
        type: DataTypes.DECIMAL(4,0),
        field:"schedule_submission_seq",
        allowNull:false,
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
      type: DataTypes.STRING(14),
      field:"submission_type",
      allowNull:false,
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
        type: DataTypes.DATE,
        field:"submission_date"
    },
    futurePaymentDate: { 
        type: DataTypes.DATE,
        field:"future_payment_date"
    },
    noOfMembsSubmitted: { 
        type: DataTypes.DECIMAL(8,0),
        field:"no_of_membs_submitted"
    }, 
    totContrSubmissionAmt: { 
        type: DataTypes.DECIMAL(8,0),
        field:"tot_contr_submission_amt"
    }, 
    createdDate: { 
        type: DataTypes.DATE,
        field:"created_date"
    },
    createdBy: { 
        type: DataTypes.STRING(50),
        field:"created_by"
    } 
  }, {
    sequelize,
    tableName: "Contribution_Header_Submission",
    timestamps: false
  })

  

ContributionHeaderSubmission.addHook("beforeValidate", (contributionheader, _options) => {
  const schema = Joi.object({
    contribSubmissionRef: Joi.number().optional().allow('null', ""),
    contribFileId: Joi.number().optional().allow('null', ""),
    NESTScheduleRef: Joi.string().alphanum().max(14).trim(true).optional().allow(null, ""),
    scheduleSubmissionSeq: Joi.number().max(4).precision(0).optional().allow(null, ""),
    submissionType: Joi.string().alphanum().max(50).trim(true).optional().allow(null, ""),
    submissionDate: Joi.date().iso().optional().allow(null),
    futurePaymentDate: Joi.date().iso().optional().allow(null),
    noOfMembsSubmitted: Joi.number().max(8).optional().allow(null, ""),
    totContrSubmissionAmt: Joi.number().max(15).precision(2).optional().allow(null, ""),
    createdDate: Joi.date().iso().optional().allow(null),
    createdBy: Joi.string().alphanum().max(50).trim(true).optional().allow(null, ""),
  });

    const { error } = schema.validate(contributionheader, joiOption);
    if (error) throw error;
  });
  
  ContributionHeaderSubmission.beforeCreate(async (contributionheader, _options) => {
    const schema = Joi.object({

      contribSubmissionRef: Joi.number().required(),
      contribFileId: Joi.number().required(),
      NESTScheduleRef: Joi.string().alphanum().max(14).trim(true).required(),
      scheduleSubmissionSeq: Joi.number().required(),
      submissionType: Joi.string().alphanum().max(50).trim(true).required(),
      submissionDate: Joi.date().iso().required(),
      futurePaymentDate: Joi.date().iso().required(),
      noOfMembsSubmitted: Joi.number().max(8).required()
    });
    const { error } = schema.validate(contributionheader, joiOption);
    if (error) throw error;
  });

  export default ContributionHeaderSubmission;
