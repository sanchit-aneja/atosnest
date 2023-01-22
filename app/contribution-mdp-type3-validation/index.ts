import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Type3Validations } from "../business-logic/type3Validations";
import app from "../utils/app";
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("Type 3 validation started: ");

  const contribHeaderId = req.params.ContributionHeaderId;
  try {
    context.log(
      `Started Type 3 vaildation for contribHeaderId  ${contribHeaderId}`
    );

    const dataHeaderRow = await Type3Validations.getHeaderRows(contribHeaderId);

    if (dataHeaderRow == null) {
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
    } else {
      // Step 2: vaildation Type 3
      const {
        totalReadytoSubmit,
        totalRequireAttention,
        totalTobeReviewed,
        totalRowsinSchedule,
      } = await Type3Validations.start(contribHeaderId, dataHeaderRow, context);

      const data = {
        CountRequiresAttention: totalRequireAttention,
        CountReadyToSubmit: totalReadytoSubmit,
        CountToBeReviewed: totalTobeReviewed,
        CountMemberInSchedule: totalRowsinSchedule,
      };
      const resp = await app.successResponse(data);
      context.res = resp;
    }
  } catch (error) {
    context.log("Error found ", context.invocationId, error.message);
  }
};

export default httpTrigger;
