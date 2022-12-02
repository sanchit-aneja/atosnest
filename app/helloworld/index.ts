import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import db_config from "../config/db.config";
import sequelize from "../utils/database";
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const result = {
    appconfig: db_config,
    sequelizeConfig: sequelize.config,
  };
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: result,
  };
};

export default httpTrigger;
