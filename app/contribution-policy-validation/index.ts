import { AzureFunction, Context } from "@azure/functions";
import { v4 as uuidv4 } from 'uuid';
import blobHelper from "../utils/blobHelper";
import { policyColumns, policyFormats, LOADING_DATA_ERROR_CODES } from "../utils/constants";
import app from "../utils/app";
import { KafkaHelper } from "../utils";

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    context.log(" Policy Validation started: " + JSON.stringify(eventGridEvent));
    let fileTimeStamp = eventGridEvent.data.fileTimeStamp;
    const fileName = `Contribution_Policy_File_${fileTimeStamp}`;
    try {

        let newItem;

        const _blobServiceClient = blobHelper.getBlobServiceClient();
        const readStream = await blobHelper.getBlobStream(fileName, _blobServiceClient);

        await app.getCSVDataFromReadStream(readStream, policyColumns, policyFormats)
            .then(
                (onResolved) => {
                    newItem = onResolved;
                },
                (onRejected) => {
                    const errorPayload = {
                        ...LOADING_DATA_ERROR_CODES.POLICY_VALIDATION,
                        File_Name: fileName,
                        Time_Of_Processing: (new Date()).toUTCString(),
                        Error_Details: `${JSON.stringify(onRejected)}`
                    }
                    context.log(errorPayload);
                });
        if (newItem) {
            const timeStamp = new Date().toUTCString();
            context.bindings.outputEvent = {
                id: uuidv4(),
                subject: (process.env.contribution_LoadStagingSubject || 'load-staging'),
                dataVersion: '1.0',
                eventType: 'csv-validated',
                data: {
                    message: "policy validated",
                    fileTimeStamp: eventGridEvent.data.fileTimeStamp
                },
                eventTime: timeStamp
            };
            context.log("Drop message to load-staging :  load-staging ", JSON.stringify(context.bindings.outputEvent));
        }
    } catch (error) {
        context.log('FAILURE', error.message);

        const errorPayload = {
            ...LOADING_DATA_ERROR_CODES.POLICY_VALIDATION,
            File_Name: fileName,
            Time_Of_Processing: (new Date()).toUTCString(),
            Error_Details: `${error?.message} - ${error?.name} - ${error?.moreDetails}`
        }
        //KafkaSend: Send error payload message
        const kafkaHelper = new KafkaHelper(context);
        await kafkaHelper.sendMessageToTopic( process.env.contribution_KafkaFailureTopic, errorPayload);
        
        console.log(errorPayload);
    }

};

export default eventGridTrigger;
