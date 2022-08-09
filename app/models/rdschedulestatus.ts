import * as Joi from "joi";
import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import * as moment from "moment";
import app from "../utils/app";

class RDScheduleStatus extends Model { }

RDScheduleStatus.init(
  {
    scheduleStatusCode: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true,
      field: "schedule_status_code",
      validate: {
        notEmpty: {
          msg: "scheduleStatusCode field cannot be empty",
        },
        notNull: {
          msg: "scheduleStatusCode field cannot be null",
        },
      },
    },
    scheduleStatusDesc: {
      type: DataTypes.STRING(100),
      field: "schedule_status_desc"
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
    }
  },
  {
    sequelize,
    tableName: "RD_Schedule_Status",
    updatedAt: "last_updated_timestamp",
    timestamps: true,
    createdAt: false
  }
);

export default RDScheduleStatus;