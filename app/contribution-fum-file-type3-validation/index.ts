import { AzureFunction, Context } from "@azure/functions";
import { Type3Validations } from "../business-logic/type3Validations";

const eventGridTrigger: AzureFunction = async function (
  context: Context,
  eventGridEvent: any
): Promise<void> {
  context.log(typeof eventGridEvent);
  context.log("Type 3 validation started: " + JSON.stringify(eventGridEvent));
  const contribHeaderId = eventGridEvent.data.contribHeaderId;

  try {
    context.log(
      `Started Type 3 vaildation for contribHeaderId  ${contribHeaderId}`
    );

    // Step 2: vaildation Type 3
    await Type3Validations.start(contribHeaderId, context);

    context.log(
      `Type 3 Validation done for contribHeaderId ${contribHeaderId}`
    );
  } catch (error) {
    context.log("Error found ", context.invocationId, error.message);
  }
};

export default eventGridTrigger;
