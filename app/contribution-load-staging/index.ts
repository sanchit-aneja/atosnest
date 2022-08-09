import { AzureFunction, Context } from "@azure/functions"
import logger from "../utils/logger";
import DataImportHelper from "../utils/dataImportHelper";
import { v4 as uuidv4 } from 'uuid';
import { LOADING_DATA_ERROR_CODES, CSV_FILES } from "../utils/constants"
import { KafkaHelper } from "../utils";

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    try {
        logger.generateLogger.info(
            "contribution-load-staging",
            { url: (typeof eventGridEvent) },
            { data: eventGridEvent },
            { method: "eventGridTrigger-contribution-load-staging" }
        );
        context.log("contribution-load-staging:: STARTED" + eventGridEvent)
        const importHelper = new DataImportHelper();
        await importHelper.LoadDataFromCSVs(eventGridEvent?.data?.fileTimeStamp, context);

        const timeStamp = new Date().toUTCString();
        context.bindings.outputEvent = {
            id: uuidv4(),
            subject: (process.env.contribution_LoadNormalisationSubject || 'load-normalisation'),
            dataVersion: '1.0',
            eventType: 'normalisation',
            data: {
                message: "start normalisation",
                fileTimeStamp: eventGridEvent?.data?.fileTimeStamp
            },
            eventTime: timeStamp
        };
        context.log("Drop message to load-normalisation :  load-normalisation ", JSON.stringify(context.bindings.outputEvent));

    } catch (error) {
        console.log("Failed :  load-normalisation ", error?.name, error.moreDetails)
        const errorPayload = {
            ...LOADING_DATA_ERROR_CODES.LOADING_TO_STAGING_TABLES,
            File_Name: `${CSV_FILES[0].namePrefix}${eventGridEvent?.data?.fileTimeStamp}`,
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
