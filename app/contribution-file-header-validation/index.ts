import { AzureFunction, Context } from "@azure/functions"
import blobHelper from '../utils/blobHelper';
import { LOADING_DATA_ERROR_CODES } from "../utils/constants";
import { Type2AValidations, Type2BValidations } from "../business-logic";

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    context.log("File Upload validation started: " + JSON.stringify(eventGridEvent));
    const fileName = eventGridEvent.data.fileName;
    const correlationId = eventGridEvent.data.correlationId;
    try {
        context.log(`Started vaildation for correlation Id ${correlationId}`)

        // Step 1: get data from blob file
        const _blobServiceClient = blobHelper.getBlobServiceClient();
        const readStream = await blobHelper.getBlobStream(fileName, _blobServiceClient);
        const fileData = await blobHelper.streamToString(readStream);

        // Step 2: vaildation Type 2A
        await Type2AValidations.start(blobHelper.stringToStream(fileData), context);

        // Step 2: vaildation Type 2B
        await Type2BValidations.start(blobHelper.stringToStream(fileData), context);
        
        context.log(`Vaildation done for correlation Id ${correlationId}`)
    } catch (error) {
        const errorPayload = {
            ...LOADING_DATA_ERROR_CODES.FILE_HEADER_VALIDATION,
            File_Name: fileName,
            Time_Of_Processing: (new Date()).toUTCString(),
            Error_Details: `${error.message}`
        }
        context.log('Sending Error data to FQS', errorPayload);
    }
    context.log(`Vaildation done for correlation Id ${correlationId}`)
};


export default eventGridTrigger;
