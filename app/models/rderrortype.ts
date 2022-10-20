import * as Joi from "joi";
import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";
import * as moment from "moment";
import app from "../utils/app";

class RDErrorType extends Model { }

RDErrorType.init(
    {
        errorNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: "error_number",
            validate: {
                notEmpty: {
                    msg: "errorNumber field cannot be empty",
                },
                notNull: {
                    msg: "errorNumber field cannot be null",
                },
            },
        },
        errorType: {
            type: DataTypes.STRING(2),
            field: "error_type"
        },
        processType: {
            type: DataTypes.STRING(10),
            allowNull: false,
            field: "process_type",
            validate: {
                notEmpty: {
                    msg: "processType field cannot be empty",
                },
                notNull: {
                    msg: "processType field cannot be null",
                },
            },
        },
        onlineErrorMessageTxt: {
            type: DataTypes.STRING(2500),
            field: "online_error_message_txt"
        },
        detailedErrorMessageTxt: {
            type: DataTypes.STRING(2500),
            field: "detailed_error_message_txt"
        },
        errorTypeId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            field: "error_type_id",
            validate: {
                notEmpty: {
                    msg: "errorTypeId field cannot be empty",
                },
                notNull: {
                    msg: "errorTypeId field cannot be null",
                },
            },
        },
        errorSeverity: {
            type: DataTypes.INTEGER,
            field: "error_severity"
        },
        recordStartDate: {
            type: DataTypes.DATEONLY,
            field: "record_start_date",
            defaultValue: Joi.date().iso().default(() => moment().format(app.DEFAULT_DATE_FORMAT))
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
        updatedBy: {
            type: DataTypes.STRING(50),
            field: "updated_by",
        }
    },
    {
        sequelize,
        tableName: "RD_Error_Type",
        createdAt: false,
        updatedAt: "last_updated_timestamp",
        timestamps: true,
    }
);

export default RDErrorType;