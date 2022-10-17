import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../utils/database";

class FileHeaderMap extends Model { }

FileHeaderMap.init(
    {
        contribHeaderId: {
            type: DataTypes.UUID,
            field: "contrib_header_id"
        },
        submissionHeaderId: {
            type: DataTypes.UUID,
            field: "submission_header_id"
        },
        fileId: {
            type: DataTypes.UUID,
            field: "file_id"
        },
        fileHeaderMappingId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal("uuid_generate_v4()"),
            field: "file_header_mapping_id",
            validate: {
                notEmpty: {
                    msg: "fileHeaderMappingId field cannot be empty",
                },
                notNull: {
                    msg: "fileHeaderMappingId field cannot be null",
                },
            },
        },
        createdDate: {
            type: DataTypes.DATE,
            field: "created_date"
        },
        createdBy: {
            type: DataTypes.STRING(50),
            field: "created_by"
        },
    },
    {
        sequelize,
        tableName: "File_Header_Map",
        createdAt: false,
        updatedAt:false,
        timestamps: true,
    }
);

export default FileHeaderMap;
