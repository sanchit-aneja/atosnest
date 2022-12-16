import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { MemberContributionDetailsController } from "../controllers/member-contribution-details-controller";
import app from "../utils/app";
import Status from "../utils/config";
import { errorDetails } from "../utils/constants";

/**
 * 5207 API Catalogue Number
 * update member status
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const queryReq = await req.body;
    const ctrl = new MemberContributionDetailsController();
    if (
      app.isNullEmpty(queryReq) ||
      !(queryReq.contributionDetail instanceof Array) ||
      queryReq.contributionDetail.length === 0
    ) {
      const data = await app.mapErrorResponse(
        "",
        "",
        400,
        errorDetails.CIA0600[1],
        ""
      );
      const resp = await app.errorResponse(400, data);
      context.res = resp;
    } else {
      const item = await ctrl.updateMemberStatus(queryReq);
      if (item == 200) {
        const resp = await app.successResponse(item);
        context.res = resp;
      } else if (
        item.name == "SequelizeConnectionError" ||
        item.name == "SequelizeDatabaseError"
      ) {
        const data = await app.mapErrorResponse("", "", 500, item.message, "");
        const resp = await app.errorResponse(500, data);
        context.res = resp;
      } else {
        const data = await app.mapErrorResponse(
          "",
          "",
          errorDetails.CIA0503[0],
          ` Member_Contribution_Detail row is not found `,
          "get"
        );
        const resp = await app.errorResponse(404, data);
        context.res = resp;
      }
    }
  } catch (err) {
    const data = await app.mapErrorResponse(
      "",
      "",
      500,
      Status.FAILURE_MSG,
      "get"
    );
    const resp = await app.errorResponse(500, data);
    context.res = resp;
  }
};

export default httpTrigger;
