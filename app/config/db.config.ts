const db_config = {
  development: {
    database: process.env.contribution_DBName as string,
    username: process.env.contribution_DBUser as string,
    password: process.env.contribution_DBPass as string,
    dialect: "postgres",
    host: process.env.contribution_DBHost,
    port: process.env.contribution_DBPort,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: true,
    ssl: process.env.contribution_DBSSL,
    schema: process.env.contribution_DBSchema
  },
  testing: {
    database: process.env.contribution_DBName as string,
    username: process.env.contribution_DBUser as string,
    password: process.env.contribution_DBPass as string,
    dialect: "postgres",
    host: process.env.contribution_DBHost,
    port: process.env.contribution_DBPort,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: true,
    ssl: process.env.contribution_DBSSL,
    schema: process.env.contribution_DBSchema
  },
};

export default db_config;
