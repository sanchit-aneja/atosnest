import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
const xml2js = require("xml2js");

import { ContributionSubmissionsXmlController } from "../controllers/contribution-submissions-xml-controller";

enum ResponseType {
  Body = "Body",
  File = "File",
}

const connectionString =
  "DefaultEndpointsProtocol=https;AccountName=sagscdevs01;AccountKey=L/FWrjIe2BDpxC9bViRhDokBuQot8Mb3d3ANDORpd6HTv+PHhRQL8p6xPsu+XGN6L5H7QCoFLus0+AStmPfApw==;EndpointSuffix=core.windows.net";
const container = "contrib-submissions-xml";

async function uploadBlob(filename: string, buffer: any) {
  const blobServiceClient = await BlobServiceClient.fromConnectionString(
    connectionString
  );
  const containerClient = await blobServiceClient.getContainerClient(container);

  const blobName = filename;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const uploadBlobResponse = await blockBlobClient.upload(
    buffer,
    buffer.length
  );
  console.log(uploadBlobResponse);
  return containerClient.url + `/${blobName}`;
}

/**
* 5401 API Catalogue Number
* Get XML of contribution in either return body or file 
*/
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const contribHeaderId = req.params.contribHeaderId;
    const controller = new ContributionSubmissionsXmlController();
    const result = await controller.generateXml(contribHeaderId);
    if (result.docs.length === 0) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            status: 404,
            body: { error: 'No record found' },
            headers: {
                "Content-Type": "application/json",
            },
        };
        return;
    }

    let builder = new xml2js.Builder();
    const headerXml = builder.buildObject(result.docs[0]);
    // const headerXml = doc;

    let body = {};
    if (result.isStreaming) {
        body = {
            totalRecordCount: result.totalRecordCount,
            responseType: ResponseType.Body,
            results: headerXml
        };
    } else {
        const url = await uploadBlob(contribHeaderId + '.xml', headerXml);
        body = {
            totalRecordCount: result.totalRecordCount,
            responseType: ResponseType.File,
            results: url
        };
    }
    context.res = {
      // status: 200, /* Defaults to 200 */
      status: 404,
      body: { error: "No record found" },
      headers: {
        "Content-Type": "application/json",
      },
    };
    return;
  }

  let builder = new xml2js.Builder();
  const headerXml = builder.buildObject(doc.doc);

  let body = {};
  if (doc.isStreaming) {
    body = {
      totalRecordCount: doc.totalRecordCount,
      responseType: ResponseType.Body,
      results: headerXml,
    };
  } else {
    const url = await uploadBlob(contribHeaderId + ".xml", headerXml);
    body = {
      totalRecordCount: doc.totalRecordCount,
      responseType: ResponseType.File,
      results: url,
    };
  }
  context.res = {
    // status: 200, /* Defaults to 200 */
    status: 200,
    body: body,
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export default httpTrigger;