import { AzureFunction, Context } from "@azure/functions";
import { KafkaHelper } from "../utils";
import { v4 as uuidv4 } from "uuid";
const blobTrigger: AzureFunction = async function (
  context: Context,
  myBlob: any
): Promise<void> {
  context.log(
    "Blob trigger function processed blob \n Name:",
    context.bindingData.name
  );
  context.log("Blob trigger Meta Data");
  context.log(context.bindingData);
  const triggerParts = context.bindingData.blobTrigger.split("/");
  const correlationId = uuidv4();

  const kafkaMsg = {
    initatorApp: "contriIndex",
    contriActionTrigger: "blobTrigger",
    nextContriActionTrigger: "headerValidation",
    correlationId: correlationId,
    blobName: triggerParts[1],
  };
  const kafkaMessage = {
    key: "blobTriggerMessage",
    value: JSON.stringify(kafkaMsg),
  };
  const kafkaHelper = new KafkaHelper(context);
  await kafkaHelper.sendMessageToTopic(
    process.env.contribution_KafkaBlobTestTopic,
    kafkaMessage
  );
};

export default blobTrigger;
