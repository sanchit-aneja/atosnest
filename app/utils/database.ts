import { Dialect, Sequelize } from "sequelize";
import db_config from "../config/db.config";

const dbConfig = db_config.testing;
console.log("dbConfig");
console.log(dbConfig);

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    dialect: dbConfig.dialect as Dialect,
    host: "d",
    port: parseInt(dbConfig.port),
    pool: dbConfig.pool,
    logging: dbConfig.logging,
    dialectOptions: {
      ssl: dbConfig.ssl == "false",
    },
    ssl: dbConfig.ssl == "false",
    schema: dbConfig.schema,
  }
);

try {
  sequelize.authenticate();
} catch (err: any) {
  throw err;
}

export default sequelize;
