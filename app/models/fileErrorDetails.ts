import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";

class FileErrorDetails extends Model { }

FileErrorDetails.init(
  {
    errorLogId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      autoIncrementIdentity: true,
      primaryKey: true,
      field: "error_log_id",
      validate: {
        notEmpty: {
          msg: "Error_Log_Id field cannot be empty",
        },
        notNull: {
          msg: "Error_Log_id field cannot be null",
        },
      },
    },
    membContribDetlId: {
      type: DataTypes.UUID,
      field: "memb_contrib_detl_id"
    },
    errorFileId: {
      type: DataTypes.UUID,
      field: "error_file_id",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Error_File_Id field cannot be empty",
        },
        notNull: {
          msg: "Error_File_id field cannot be null",
        },
      },
    },
    origFileId: {
      type: DataTypes.UUID,
      field: "orig_file_id"
    },
    errorType: {
      type: DataTypes.STRING(2),
      field: "error_type"
    },
    errorSequenceNum: {
      type: DataTypes.DECIMAL,
      field: "error_sequence_num",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Error_Sequence_Num field cannot be empty",
        },
        notNull: {
          msg: "Error_Sequence_Num field cannot be null",
        },
      },
    },
    sourceRecordId: {
      type: DataTypes.STRING(30),
      field: "source_record_id"
    },
    errorCode: {
      type: DataTypes.STRING(20),
      field: "error_code"
    },
    errorMessage: {
      type: DataTypes.STRING(2500),
      field: "error_message",
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Error_Message field cannot be empty",
        },
        notNull: {
          msg: "Error_Message field cannot be null",
        },
      },
    },
    createdOn: {
      type: DataTypes.DATE,
      field: "created_on"
    },
    createdBy: {
      type: DataTypes.STRING(50),
      field: "created_by"
    }
  },
  {
    sequelize,
    tableName: "File_Error_Details",
    timestamps: false
  })


export default FileErrorDetails;
