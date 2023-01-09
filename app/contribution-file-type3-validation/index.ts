import { AzureFunction, Context } from "@azure/functions";
import { Type3Validations } from "../business-logic/type3Validations";

const eventGridTrigger: AzureFunction = async function (
  context: Context,
  eventGridEvent: any
): Promise<void> {
  context.log(typeof eventGridEvent);
  context.log("Type 3 validation started: " + JSON.stringify(eventGridEvent));
  const externalScheduleRef = eventGridEvent.data.externalScheduleRef;

  try {
    context.log(
      `Started Type 3 vaildation for externalScheduleRef  ${externalScheduleRef}`
    );

    // Step 2: vaildation Type 3
    const dataHeaderRow = await Type3Validations.getHeaderRows(
      externalScheduleRef
    );
    await Type3Validations.start(externalScheduleRef, dataHeaderRow, context);

    context.log(
      `Type 3 Validation done for externalScheduleRef ${externalScheduleRef}`
    );
  } catch (error) {}
};

export default eventGridTrigger;
