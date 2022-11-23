import { BlobServiceClient } from "@azure/storage-blob";
import { CSV_FILES } from "./constants";
import blobHelper from "./blobHelper";
import { StgContrMember, StgContrPolicy, StgContrSchedule } from "../models";

import { CustomError } from "../Errors";
import { Pool } from "pg";
const copyFrom = require("pg-copy-streams").from;

/**
 * This is Data import helper (csv files from blob to DB using copy command)
 */
class DataImportHelper {
  /** blob service client */
  private _blobServiceClient: BlobServiceClient;
  private context: any;

  /** DataImportHelper */
  constructor() {}
  /**
   *
   * @param data - CSV Files with namePrefix, columns and table name to import
   * @param fileTimestamp - Timestamp to find files in Blob container
   * @param context - for log
   * @param data - csv files and columns details optional
   * @returns
   *
   * e.g. - Sample csn file names
   * Contribution_Header_File_20220623085743.csv
   * Contribution_Member_File_20220623085743.csv
   * Contribution_Policy_File_20220623085743.csv
   */
  async LoadDataFromCSVs(
    fileTimestamp: string,
    context,
    data: {
      namePrefix: string;
      columns: string[];
      tableName: string;
    }[] = CSV_FILES
  ): Promise<boolean> {
    this.context = context;
    //No timestamp means no use to proceed
    if (!fileTimestamp) {
      throw new CustomError(
        "NO_TIMESTAMP",
        "Timestamp is missing in the payload"
      );
    }
    try {
      await this.cleanAllTables();
      this._blobServiceClient = blobHelper.getBlobServiceClient();
      for (let file of data) {
        const blobName = `${file.namePrefix}${fileTimestamp}.csv`;
        await this.importCSV(blobName, file.tableName, file.columns.join(","));
        this.context.log("LoadDataFromCSVs :: next after" + blobName);
      }
    } catch (error) {
      this.context.log("LoadDataFromCSVs :: Failed" + error.message);
      throw new CustomError(
        "LOAD_CSV_FILES_FAILED",
        "Unknown error " + error.message
      );
    }
    return true;
  }

  /**
   *
   * @param url - CSV url to import
   * @param tableName - table where to import
   * @param columns - columns of csv
   */
  private async importCSV(
    blobName: string,
    tableName: string,
    columns: string
  ) {
    const schema = process.env.contribution_DBSchema;
    try {
      this.context.log(
        `COPY ${schema}."${tableName}" (${columns}) FROM STDIN WITH CSV HEADER -- For file ${blobName}`
      );
      await this.copyFromSTDIN(
        `SET datestyle = euro;COPY ${schema}."${tableName}" (${columns}) FROM STDIN WITH CSV HEADER`,
        blobName
      );
    } catch (error) {
      const message = `importCSV :: COPY ${schema}."${tableName}" (${columns}) FROM STDIN WITH CSV HEADER :: Failed -- For file ${blobName}: ${error}`;
      this.context.log(message);
      throw new CustomError(
        "IMPORT_CSV_FAILED",
        `${message} - ${error} -- For file ${blobName}`
      );
    }
  }
  /**
   * Clean All Stage tables
   * StgContrMember, StgContrPolicy, StgContrSchedule
   */
  private async cleanAllTables() {
    try {
      await StgContrMember.truncate({
        restartIdentity: true,
        where: {},
      });
      await StgContrPolicy.truncate({
        restartIdentity: true,
        where: {},
      });
      await StgContrSchedule.truncate({
        restartIdentity: true,
        where: {},
      });
    } catch (error) {
      this.context.log("cleanAllTables :: Failed" + error.message);
      throw new CustomError(
        "STAGING_TABLES_CLEANUP_FAILED",
        "Stage Table clean failed, more details" + `${error.message}`
      );
    }
  }

  private async copyFromSTDIN(copyCommand: string, blobName: string) {
    const selfBlobServiceClient = this._blobServiceClient;
    const selfContext = this.context;
    return new Promise(function (resolve, reject) {
      try {
        // Create pg pool
        const pool = new Pool({
          user: process.env.contribution_DBUser,
          database: process.env.contribution_DBName,
          password: process.env.contribution_DBPass,
          port: process.env.contribution_DBPort,
          host: process.env.contribution_DBHost,
          max: 10,
          idleTimeoutMillis: 30000,
          ssl: process.env.contribution_DBSSL == "true",
        });
        pool.connect(async function (err, client, done) {
          if (err) {
            selfContext.log(err);
            done();
            reject(
              `Error ::  Failed at pool connect in copyFromSTDIN :: ${copyCommand} - ${err}`
            );
            pool.end();
            return;
          }
          selfContext.log("Started..!");
          const copyQuery = client.query(copyFrom(copyCommand));
          const blobStream = await blobHelper.getBlobStream(
            blobName,
            selfBlobServiceClient
          );

          //Check blo stream
          if (blobStream == null) {
            done();
            reject(
              `Error ::  Failed at blobStream null in copyFromSTDIN :: ${copyCommand} - ${err}`
            );
            pool.end();
            return;
          }

          // Add error callbacks for blobStream and copyQuery
          blobStream.on("error", async (_err) => {
            done();
            reject(
              `Error ::  Failed at blobStream in copyFromSTDIN :: ${copyCommand} - ${_err}`
            );
            pool.end();
          });
          copyQuery.on("error", async (_err) => {
            done();
            reject(
              `Error ::  Failed at copyQuery in copyFromSTDIN :: ${copyCommand} - ${_err}`
            );
            pool.end();
          });

          // add finish on copyQuery call resolve and END Pool
          copyQuery.on("finish", async (_data) => {
            done();
            resolve(true);
            pool.end();
          });

          blobStream.pipe(copyQuery);
        });
      } catch (err) {
        selfContext.log(err);
        reject(
          `Error ::  Failed at in copyFromSTDIN :: ${copyCommand} - ${err}`
        );
      }
    });
  }
}

export default DataImportHelper;
