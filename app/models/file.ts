import * as Joi from "joi";
import { DataTypes, Model, Sequelize } from "sequelize";
import { joiOption } from "../utils/constants";
import sequelize from "../utils/database";
import FileHeaderMap from "./fileheadermap";

class File extends Model { }

File.init(
    {
        fileId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            field: "file_id",
            defaultValue: Sequelize.literal("uuid_generate_v4()"),
            validate: {
                notEmpty: {
                    msg: "file_id field cannot be empty",
                },
                notNull: {
                    msg: "file_id field cannot be null",
                },
            },
        },
        contribHeaderId: {
            type: DataTypes.UUID,
            field: "contrib_header_id"
        },
        fileName: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: "file_name",
            validate: {
                notEmpty: {
                    msg: "fileName field cannot be empty",
                },
                notNull: {
                    msg: "fileName field cannot be null",
                },
            },
        },
        fileType: {
            type: DataTypes.STRING(3),
            allowNull: false,
            field: "file_type",
            validate: {
                notEmpty: {
                    msg: "fileType field cannot be empty",
                },
                notNull: {
                    msg: "fileType field cannot be null",
                },
            },
        },
        fileSize: {
            type: DataTypes.DECIMAL,
            field: "file_size"
        },
        fileSizeType: {
            type: DataTypes.STRING(2),
            allowNull: false,
            field: "file_size_type",
            validate: {
                notEmpty: {
                    msg: "fileSizeType field cannot be empty",
                },
                notNull: {
                    msg: "fileSizeType field cannot be null",
                },
            },
        },
        fileStatus: {
            type: DataTypes.STRING(5),
            field: "file_status"
        },
        fileFormat: {
            type: DataTypes.STRING(3),
            allowNull: false,
            field: "file_format",
            validate: {
                notEmpty: {
                    msg: "fileFormat field cannot be empty",
                },
                notNull: {
                    msg: "fileFormat field cannot be null",
                },
            },
        },
        fileReceivedDate: {
            type: DataTypes.DATE,
            field: "file_received_date"
        },
        fileProcessedDate: {
            type: DataTypes.DATE,
            field: "file_processed_date"
        },
        fileUploadedOn: {
            type: DataTypes.DATE,
            field: "file_uploaded_on"
        },
        fileSentDate: {
            type: DataTypes.DATE,
            field: "file_sent_date"
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
        tableName: "File",
        createdAt: false,
        updatedAt: "last_updated_timestamp",
        timestamps: true,
    }
)
File.hasOne(FileHeaderMap, {
    sourceKey: "fileId",
    foreignKey: "fileId",
    as: "fileheadermap",
});
FileHeaderMap.belongsTo(File, {
    as: "file",
    targetKey: "fileId",
    foreignKey: { name: "fileId", allowNull: false },
    constraints: true,
    onDelete: "CASCADE",
});

// validation hocks
File.addHook("beforeValidate", (file, _options) => {
    const schema = Joi.object({});
    const { error } = schema.validate(file, joiOption);
    if (error) throw error;
})
File.beforeCreate(async (file, _options) => {
    const schema = Joi.object({
        contribHeaderId: Joi.string().guid({ version: 'uuidv4' }).optional(),
        fileName: Joi.string().max(150).trim(true).required(),
        fileType: Joi.string().max(3).trim(true).required(),
        fileSize: Joi.number().required(),
        fileSizeType: Joi.string().max(2).trim(true).required(),
        fileStatus: Joi.string().max(5).trim(true),
        fileFormat: Joi.string().max(3).trim(true).required(),
        fileReceivedDate: Joi.date().iso().required(),
        fileProcessedDate: Joi.date().iso().required(),
        fileUploadedOn: Joi.date().iso().required(),
        fileSentDate: Joi.date().iso().required()
    });
    const { error } = schema.validate(file, joiOption);
    if (error) throw error;
})

export default File;
