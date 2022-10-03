import { AzureFunction, Context } from "@azure/functions"
import normalisation from "../utils/normalisation";
import sequelize from "../utils/database";
import { LOADING_DATA_ERROR_CODES, CSV_FILES } from "../utils/constants"
import { File } from "../models"
import { v4 as uuidv4 } from 'uuid';
import blobHelper from '../utils/blobHelper';
import { KafkaHelper } from "../utils";

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    const startedTime = new Date();
    context.log(`normalisation started on : ${startedTime.toUTCString()}`);
    context.log(typeof eventGridEvent);
    context.log(eventGridEvent);
    let transaction;
    try {
        context.log(`normalisation started : ${eventGridEvent?.data?.fileTimeStamp}`);
        //Step1: Start transaction
        transaction = await sequelize.transaction();

        // Step2: Save File Log
        const fileId = uuidv4();
        const blobServiceClient = blobHelper.getBlobServiceClient();
        const blobName = `Contribution_Header_File_${eventGridEvent?.data?.fileTimeStamp}`;
        const properties = await blobHelper.getBlobProperties(blobName, blobServiceClient);
        await File.create({
            fileId: fileId,
            fileName: blobName,
            fileType: "CSE",
            fileSize: properties.contentLength,
            fileSizeType: "B",
            fileStatus: "V",
            fileFormat: "CSV",
            fileReceivedDate: new Date().toISOString(),
            fileProcessedDate: new Date().toISOString(),
            fileUploadedOn: new Date().toISOString(),
            fileSentDate: new Date().toISOString()
        })

        //Step 3: move data to contribution header, using sequelize bluk insert.
        const contribHeaderId = await normalisation.createContributionHeader(context, fileId);
        //Step 4: move data member contribution details
        await normalisation.createContributionDetails(context);
        //Step 5 : update the file table with no of records
        // await File.update({ contribHeaderId: contribHeaderId }, {
        //     where: { 'fileId': fileId },
        // });
        // Ster 6: All success commit
        await transaction.commit();
    } catch (error) {
        context.log("normalisation failed : ", error);
        //FailedStep: Rollback changes
        if (transaction) {
            await transaction.rollback();
        }
        const errorPayload = {
            ...LOADING_DATA_ERROR_CODES.LOADING_NORMALISATION_TABLES,
            File_Name: `${CSV_FILES[0].namePrefix}${eventGridEvent?.data?.fileTimeStamp}`,
            Time_Of_Processing: (new Date()).toUTCString(),
            Error_Details: `${error?.message} - ${error?.name} - ${error?.moreDetails}`
        }

        //KafkaSend: Send error payload message
        const kafkaHelper = new KafkaHelper(context);
        await kafkaHelper.sendMessageToTopic(process.env.contribution_KafkaFailureTopic, errorPayload);
        context.log('errorPayload', errorPayload);
    }
    const endTime = new Date();
    context.log(`normalisation ended on : ${endTime.toUTCString()}`);
    context.log(`Total time taken for normalisation: ${(endTime.getTime() - startedTime.getTime()) / 1000} sec`)
};

export default eventGridTrigger;
