import { Body, Post, Response, Route, Security, SuccessResponse } from "tsoa";
import Status from "../utils/config";
import app from "../utils/app";
import blobHelper from "../utils/blobHelper";
import { FQSHelper } from "../utils";
import { KafkaHelper } from "../utils";
import { FileUploadRequest } from "../schemas/request-schema";
import {
  ContributionHeader,
  StgFileMemberDetails,
  File as ContributionFile,
  FileHeaderMap,
} from "../models";
import { Context } from "@azure/functions";
import { v4 as uuidv4 } from "uuid";

const enum ScanResult {
  NO_ISSUES_FOUND = "no issues found",
  MALICIOUS = "malicious",
}

@Route("/contribution")
export class ContributionFileUploadController {
  /**
   * 5802 API Catalogue Number
   * File upload monitor with virus check
   * @param params contain the file upload details
   * @return Returns OK status.
   */
  @Security("api_key")
  @Post("fileUpload/")
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async fileUpload(
    context: Context,
    @Body() params: FileUploadRequest
  ): Promise<any> {
    const isMock: boolean =
      process.env.contribution_IsMock !== undefined
        ? JSON.parse(process.env.contribution_IsMock)
        : false;
    const mockScanResult =
      process.env.contribution_mockScanResult !== undefined
        ? process.env.contribution_mockScanResult
        : "";

    let scanResult = "";
    try {
      // check if mock
      if (!isMock) {
        // get blob
        const container = process.env.contribution_BlobContainerName;
        const blobServiceClient = blobHelper.getBlobServiceClient();
        const containerClient = blobServiceClient.getContainerClient(container);

        // get scan results
        const blobName = params.documentName;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const tags = await blockBlobClient.getTags();

        scanResult = tags.tags["fss-scan-result"];
      } else {
        scanResult = mockScanResult;
      }
      console.log(scanResult);

      // process failure and success topic
      const kafkaHelper = new KafkaHelper(context);
      const fqsHelper = new FQSHelper(context);

      // If FQS Id is blank, create new FQS ID, else if FQS Id is present, then use it
      let FQSId = uuidv4();
      if (params.FQSId.trim() !== "") {
        FQSId = params.FQSId;
      }

      const kafkaPayload = {
        payload: {
          key: params.key,
          documentName: params.documentName,
          path: params.path,
          FQSId: FQSId,
          correlationId: params.correlationId,
          callerId: params.callerId,
          virusResult: scanResult,
        },
      };

      // If malicious?
      if (scanResult !== "" && scanResult !== ScanResult.NO_ISSUES_FOUND) {
        // If failure topic provided,
        if (params.kafkaTopicFailure !== "") {
          // call Failure topic
          // await kafkaHelper.sendMessageToTopic(params.kafkaTopicFailure, JSON.stringify(kafkaPayload));

          // FQS in processing state
          await fqsHelper.updateFQSProcessingStatus(FQSId, params.correlationId, kafkaPayload.payload);
        } else {
          // If no failure topic
          // Finish FQS with payload of "malicious"
          await fqsHelper.updateFQSFinishedStatus(FQSId, params.correlationId, kafkaPayload.payload);
        }
      } else {
        // If clean
        // If success topic provided call Kafka success topic
        if (params.kafkaTopicSuccess !== "") {
          // call success topic
          // await kafkaHelper.sendMessageToTopic(params.kafkaTopicFailure, JSON.stringify(kafkaPayload));

          // Set FQS to processing
          await fqsHelper.updateFQSProcessingStatus(FQSId, params.correlationId, kafkaPayload.payload);
        } else {
          // If no success topic finish FQS with payload of "no issues found"
          await fqsHelper.updateFQSFinishedStatus(FQSId, params.correlationId, kafkaPayload.payload);
        }

      }

      // Return FQS Id
      return {
        FQSId: {
          FQSId: FQSId,
        },
        status: 202,
      };
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  static async retrieveNotUploadedMembers(params) {
    try {
      const contribHeaderId = params.contribHeaderId;
      const rejectType = params.Type;

      const contributionHeader = await ContributionHeader.findAll({
        where: {
          contribHeaderId: contribHeaderId,
        },
      });

      if (!contributionHeader.length) {
        throw new Error("Header does not exist");
      }

      const stageFileMembersNotUploaded =
        await StgFileMemberDetails.findAndCountAll({
          where: {
            // contribHeaderId: contribHeaderId
            scheduleExclusionType: rejectType,
          },
          include: [
            {
              model: ContributionFile,
              attributes: [],
              required: true,
              as: "file",
              include: [
                {
                  model: FileHeaderMap,
                  attributes: [],
                  required: true,
                  as: "fileheadermap",
                  where: {
                    contribHeaderId: contribHeaderId,
                  },
                  include: [
                    {
                      model: ContributionHeader,
                      attributes: [],
                      required: true,
                      as: "contributionheader",
                    },
                  ],
                },
              ],
            },
          ],
        });

      return stageFileMembersNotUploaded;
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }
}
