import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { updateHeaderStatus } from "../business-logic/updateHeaderStatus";

import app from "../utils/app";
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const contribHeaderId = req.query.contribHeaderId;
  try {
    context.log(`Started Create corrections for  ${contribHeaderId} `);
    let resp;

    const headerRow: any = await updateHeaderStatus.ValidateAndGetHeaderId(
      contribHeaderId
    );
    if (!headerRow) {
      context.res = {
        status: 404,
        body: {
          errors: [
            {
              errorCode: "CIA-0503",
              errorDetail: "Unique reference does not exists",
            },
          ],
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
    }
    if (headerRow.scheduleStatusCd === "CS10") {
      resp = await app.successResponse(headerRow);
      context.res = resp;
    } else {
      const status = await updateHeaderStatus.GetStatusCD(contribHeaderId);

      const result = await updateHeaderStatus.UpdateandGetResult(
        contribHeaderId,

        status
      );
      resp = await app.successResponse(result[0].dataValues);
      context.res = resp;
    }
  } catch (error) {
    context.log(error);
    context.res = {
      status: 400,
      body: {
        errors: [
          {
            errorCode: "CIA-0602",
            errorDetail: "Something went wrong, update fails",
          },
        ],
      },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};

export default httpTrigger;
