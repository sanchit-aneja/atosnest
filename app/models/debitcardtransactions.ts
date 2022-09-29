import * as Joi from "joi";
import { DataTypes, Model } from "sequelize";
import { joiOption } from "../utils/constants";
import sequelize from "../utils/database";

class DebitCardTxns extends Model { }

DebitCardTxns.init(
  {
    debitCardTxnId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      autoIncrementIdentity: true,
      primaryKey: true,
      field: "debit_card_txn_id",
      validate: {
        notEmpty: {
          msg: "debitCardTxnId field cannot be empty",
        },
        notNull: {
          msg: "debitCardTxnId field cannot be null",
        },
      },
    },
    cardTransactionRef: {
      type: DataTypes.STRING(35),
      allowNull: false,
      field: "card_transaction_ref",
      validate: {
        notEmpty: {
          msg: "cardTransactionRef field cannot be empty",
        },
        notNull: {
          msg: "cardTransactionRef field cannot be null",
        },
      },
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "transaction_date",
      validate: {
        notEmpty: {
          msg: "transactionDate field cannot be empty",
        },
        notNull: {
          msg: "transactionDate field cannot be null",
        }
      },
    },
    cardTxnStatus: {
      type: DataTypes.STRING(50),
      field: "card_txn_status"
    },
    txnAmount: {
      type: DataTypes.DECIMAL,
      field: "txn_amount"
    },
    transactionPartyType: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "transaction_party_type",
      validate: {
        notEmpty: {
          msg: "transactionPartyType field cannot be empty",
        },
        notNull: {
          msg: "transactionPartyType field cannot be null",
        },
      },
    },
    contribSubmissionRef: {
      type: DataTypes.UUID,
      field: "contrib_submission_ref"
    },
    transactionPartyId: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "transaction_party_id",
      validate: {
        notEmpty: {
          msg: "transactionPartyId field cannot be empty",
        },
        notNull: {
          msg: "transactionPartyId field cannot be null",
        },
      },
    },
    recordStartDate: {
      type: DataTypes.DATE,
      field: "record_start_date"
    },
    createdBy: {
      type: DataTypes.STRING(50),
      field: "created_by"
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      field: "updated_by"
    }
  },
  {
    sequelize,
    tableName: "Debit_Card_Txns",
    createdAt: false,
    updatedAt: "last_updated_timestamp",
    timestamps: true
  }
);


DebitCardTxns.addHook("beforeValidate", (debitcardtxns, _options) => {
  const schema = Joi.object({
    contribHeaderId: Joi.number().optional().allow(null, ""),
    fileId: Joi.number().optional().allow(null, ""),
    nestScheduleRef: Joi.string().alphanum().max(14).trim(true).optional().allow(null, ""),
    externalScheduleRef: Joi.string().alphanum().max(32).trim(true).optional().allow(null, ""),
    scheduleType: Joi.string().alphanum().max(50).trim(true).optional().allow(null, ""),
    scheduleStatusCd: Joi.string().alphanum().max(5).trim(true).optional().allow(null, ""),
    scheduleGenerationDate: Joi.date().iso().optional().allow(null),
    employerNestId: Joi.string().alphanum().max(30).trim(true).optional().allow(null, ""),
    subSchemeId: Joi.string().alphanum().max(16).trim(true).optional().allow(null, ""),
    earningPeriodStartDate: Joi.date().iso().optional().allow(null),
    earningPeriodEndDate: Joi.date().iso().optional().allow(null),
    paymentPlanNo: Joi.string().alphanum().max(11).trim(true).optional().allow(null, ""),
    paymentRef: Joi.string().alphanum().max(35).trim(true).optional().allow(null, ""),
    paymentSourceName: Joi.string().alphanum().max(40).trim(true).optional().allow(null, ""),
    paymentMethod: Joi.string().alphanum().max(2).trim(true).optional(),
    paymentMethodDesc: Joi.string().alphanum().max(30).trim(true).optional().allow(null, ""),
    paymentFrequency: Joi.string().alphanum().max(2).trim(true).optional().allow(null, ""),
    paymentFrequencyDesc: Joi.string().alphanum().max(30).trim(true).optional().allow(null, ""),
    taxPayFrequencyInd: Joi.string().alphanum().max(1).trim(true).optional().allow(null, ""),
    paymentDueDate: Joi.date().iso().optional().allow(null),
    pegaCaseRef: Joi.string().alphanum().max(30).trim(true).optional().allow(null, ""),
    noOfMembs: Joi.number().max(8).optional().allow(null, ""),
    totScheduleAmt: Joi.number().optional().allow(null, ""),
    recordStartDate: Joi.date().iso().optional().allow(null),
    recordEndDate: Joi.date().iso().optional().allow(null),
    createdBy: Joi.string().alphanum().max(50).trim(true).optional().allow(null, ""),
    updatedBy: Joi.string().alphanum().max(50).trim(true).optional().allow(null, "")
  });
  const { error } = schema.validate(debitcardtxns, joiOption);
  if (error) throw error;
});

DebitCardTxns.beforeCreate(async (debitcardtxns, _options) => {
  const schema = Joi.object({
    contribHeaderId: Joi.number().required(),
    nestScheduleRef: Joi.string().alphanum().max(32).trim(true).required(),
    scheduleType: Joi.string().alphanum().max(50).trim(true).required(),
    scheduleStatusCd: Joi.string().alphanum().max(5).trim(true).required(),
    scheduleGenerationDate: Joi.date().iso().required(),
    employerNestId: Joi.string().alphanum().max(30).trim(true).required(),
    earningPeriodStartDate: Joi.date().iso().required(),
    earningPeriodEndDate: Joi.date().iso().required(),
    paymentSourceName: Joi.string().alphanum().max(40).trim(true).required(),
    paymentFrequency: Joi.string().alphanum().max(2).trim(true).required(),
    paymentFrequencyDesc: Joi.string().alphanum().max(30).trim(true).required(),
    paymentMethod: Joi.string().alphanum().max(2).trim(true).required(),
    paymentMethodDesc: Joi.string().alphanum().max(30).trim(true).required(),
    paymentDueDate: Joi.date().iso().required()
  });
  const { error } = schema.validate(debitcardtxns, joiOption);
  if (error) throw error;
});

export default DebitCardTxns;
