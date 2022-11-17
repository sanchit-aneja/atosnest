import { AzureFunction, Context } from "@azure/functions";
import { KafkaHelper } from "../utils";
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
  const kafkaMsg = {
    containerName: triggerParts[0],
    fileName: triggerParts[1],
    fileSize: myBlob.length,
    userJourneyName: "Contribution Schedule Files Delivery",
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
