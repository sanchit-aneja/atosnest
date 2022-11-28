import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ContributionIneligibilityController } from "../controllers/contribution-ineligibility-controller";
import { errorDetails } from "../utils/constants";
import app from "../utils/app";

/**
 * 5803 API Catalogue Number
 * Update Ineligibility
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const membEnrolmentRef = req.params.membEnrolmentRef;
  const ineligibilityReason = req.params.ineligibilityReason;
  const effectiveDate = req.params.effectiveDate;

  if (
    !app.isEmptyString(membEnrolmentRef) &&
    !app.isEmptyString(ineligibilityReason) &&
    !app.isValidDate(effectiveDate)
  ) {
    const ctrl = new ContributionIneligibilityController();
    const item = await ctrl.updateIneligibility(
      membEnrolmentRef,
      ineligibilityReason,
      effectiveDate
    );
    if ((item && item?.length) || item?.IneligibleSchedules) {
      const resultData = await ctrl.getUpdatedMemberData(membEnrolmentRef);
      const resp = await app.successResponse(resultData);
      context.res = resp;
    } else if (item.name == "SequelizeConnectionError") {
      const data = await app.mapErrorResponse("", "", 500, item.message, "");
      const resp = await app.errorResponse(500, data);
      context.res = resp;
    } else {
      const data = await app.mapErrorResponse(
        "",
        "",
        errorDetails.CIA0503[0],
        errorDetails.CIA0503[1] + ` Member Enrolment Ref `,
        "get"
      );
      const resp = await app.errorResponse(404, data);
      context.res = resp;
    }
  } else {
    const data = await app.mapErrorResponse(
      "",
      "",
      errorDetails.CIA0500[0],
      `Member Enrolment Ref, IneligibilityReason Effective Date is not valid`,
      "get"
    );
    const resp = await app.errorResponse(400, data);
    context.res = resp;
  }
};

export default httpTrigger;
