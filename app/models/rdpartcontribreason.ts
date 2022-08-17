import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";

class RDPartContribReason extends Model { }

RDPartContribReason.init(
  {
    reasonCode: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true,
      field: "reason_code",
      validate: {
        notEmpty: {
          msg: "reasonCode field cannot be empty",
        },
        notNull: {
          msg: "reasonCode field cannot be null",
        },
      },
    },
    reasonDescription: {
      type: DataTypes.STRING(100),
      field: "reason_description"
    },
    recordStartDate: {
      type: DataTypes.DATE,
      field: "record_start_date"
    },
    recordEndDate: {
      type: DataTypes.DATE,
      field: "record_end_date"
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
    tableName: "RD_Part_Contrib_Reason",
    updatedAt: "last_updated_timestamp",
    timestamps: true,
    createdAt: false
  }
);

export default RDPartContribReason;