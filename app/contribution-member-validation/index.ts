import { AzureFunction, Context } from "@azure/functions"
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from "../Errors";
import app from "../utils/app";
import blobHelper from "../utils/blobHelper";
import { memberColumnFormats, memberColumns, LOADING_DATA_ERROR_CODES } from "../utils/constants";
import { KafkaHelper } from "../utils";

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    context.log("Member validation started: " + JSON.stringify(eventGridEvent));
    let fileTimeStamp = eventGridEvent.data.fileTimeStamp;
    let newItem: any;
    const fileName = `Contribution_Member_File_${fileTimeStamp}`;
    try {

        const _blobServiceClient = blobHelper.getBlobServiceClient();
        const readStream = await blobHelper.getBlobStream(fileName, _blobServiceClient);

        await app.getCSVDataFromReadStream(readStream, memberColumns, memberColumnFormats)
            .then(
                (onResolved) => {
                    newItem = onResolved;
                },
                (onRejected) => {
                    throw new CustomError("CONTRIBUTION_MEMBER_VALIDATION_FAILED", onRejected);
                });
        if (newItem) {
            context.log('SUCCESS', "MEMBER FILE VALIDATED SUCCSSFULLY");
            const timeStamp = new Date().toUTCString();
            context.bindings.outputEvent = {
                id: uuidv4(),
                subject: (process.env.contribution_ValidationPolicySubject || 'validate-policy'),
                dataVersion: '1.0',
                eventType: 'csv-validated',
                data: {
                    message: 'Member file Validated',
                    fileTimeStamp: fileTimeStamp
                },
                eventTime: timeStamp
            }
            context.log("Member validation Done : " + JSON.stringify(context.bindings.outputEvent));
        }
    } catch (error) {
        context.log('FAILURE', error.message);

        const errorPayload = {
            ...LOADING_DATA_ERROR_CODES.MEMBER_VALIDATION,
            File_Name: fileName,
            Time_Of_Processing: (new Date()).toUTCString(),
            Error_Details: `${error?.message} - ${error?.name} - ${error?.moreDetails}`
        }
        
        //KafkaSend: Send error payload message
        const kafkaHelper = new KafkaHelper(context);
        await kafkaHelper.sendMessageToTopic( process.env.contribution_KafkaFailureTopic, errorPayload);
        
        context.log('errorPayload', errorPayload);
    }
};


export default eventGridTrigger;
