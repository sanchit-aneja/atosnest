import { Dialect, Sequelize } from "sequelize";
import db_config from "../config/db.config";
import { Context } from "@azure/functions";
const dbConfig = db_config.testing;
console.log("dbConfig");
console.log(dbConfig);
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    dialect: dbConfig.dialect as Dialect,
    host: dbConfig.host,
    port: parseInt(dbConfig.port),
    pool: dbConfig.pool,
    logging: dbConfig.logging,
    dialectOptions: {
      ssl: dbConfig.ssl == "true",
    },
    ssl: dbConfig.ssl == "true",
    schema: dbConfig.schema,
  }
);

try {
  sequelize.authenticate();
} catch (err: any) {
  console.log(err);
  throw err;
}

export default sequelize;
