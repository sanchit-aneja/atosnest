import { AzureFunction, Context } from "@azure/functions"
import blobHelper from '../utils/blobHelper';
import { LOADING_DATA_ERROR_CODES } from "../utils/constants";
import { Type2AValidations, Type2BValidations } from "../business-logic";
import * as csvf from 'fast-csv';

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    context.log("File Upload validation started: " + JSON.stringify(eventGridEvent));

    const fileName = eventGridEvent.data.fileName;

    try {
        const _blobServiceClient = blobHelper.getBlobServiceClient();
        const readStream = await blobHelper.getBlobStream(fileName, _blobServiceClient);
        const fileData = await blobHelper.streamToString(readStream);

        await Type2AValidations.start(blobHelper.stringToStream(fileData), context);

        await Type2BValidations.start(blobHelper.stringToStream(fileData), context);
        
        context.log('File is valid');
    } catch (error) {
        const errorPayload = {
            ...LOADING_DATA_ERROR_CODES.FILE_HEADER_VALIDATION,
            File_Name: fileName,
            Time_Of_Processing: (new Date()).toUTCString(),
            Error_Details: `${error.message}`
        }
        context.log('errorPayload', errorPayload);

    }
};


export default eventGridTrigger;
