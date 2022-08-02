import { AzureFunction, Context } from "@azure/functions"
import app from "../utils/app";
import blobHelper from '../utils/blobHelper';
import { headerColumns, headerColumnFormats, LOADING_DATA_ERROR_CODES } from "../utils/constants";
import { v4 as uuidv4 } from 'uuid';

const serviceBusQueueTrigger: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {
    const fileName = app.getFileName(mySbMsg.subject);
    let fileTime = app.getFileTimeStamp(fileName);
    try {
        let newItem;
        const _blobServiceClient = blobHelper.getBlobServiceClient();
        const readStream = await blobHelper.getBlobStream(fileName, _blobServiceClient);

        await app.getCSVDataFromReadStream(readStream, headerColumns, headerColumnFormats).then(
            (onResolved) => {
                newItem = onResolved;
            },
            (onRejected) => {
                const errorPayload = {
                    ...LOADING_DATA_ERROR_CODES.HEADER_VALIDATION,
                    File_Name: fileName,
                    Time_Of_Processing: (new Date()).toUTCString(),
                    Error_Details: `${onRejected?.message}`
                }
                context.log('errorPayload', errorPayload);
            });

        if (newItem) {
            context.log('SUCCESS', "HEADER FILE VALIDATED SUCCSSFULLY");
            const timeStamp = new Date().toUTCString();


            context.bindings.outputEvent = {
                id: uuidv4(),
                subject: (process.env.contribution_ValidationMemberSubject || 'validate-members'),
                dataVersion: '1.0',
                eventType: 'csv-validated',
                data: {
                    message: 'Header file validated',
                    fileTimeStamp: fileTime
                },
                eventTime: timeStamp
            };

            context.log('SUCCESS', "Message Dropped to validate-members", JSON.stringify(context.bindings.outputEvent));
        }
    } catch (error) {
        context.log('FAILURE', error.message);

        const errorPayload = {
            ...LOADING_DATA_ERROR_CODES.HEADER_VALIDATION,
            File_Name: fileName,
            Time_Of_Processing: (new Date()).toUTCString(),
            Error_Details: `${error?.message} - ${error?.name} - ${error?.moreDetails}`
        }

        context.log('errorPayload', errorPayload);
    }
};



export default serviceBusQueueTrigger;
