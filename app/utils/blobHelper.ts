import {
    BlobServiceClient,
    BlobGetPropertiesResponse
} from '@azure/storage-blob';
import { CustomError } from '../Errors';

const blobHelper = {
    /**
     * This helper method returns Blob service client
     * @returns BlobServiceClient based on default connection string
     */
    getBlobServiceClient(): BlobServiceClient {
        return BlobServiceClient.fromConnectionString(process.env.contribution_BlobConnectString);
    },
    /**
     * get blob data in stream format
     * @param blobName 
     * @param blobServiceClient 
     * @returns 
     */
    async getBlobStream(blobName: string, blobServiceClient: BlobServiceClient): Promise<NodeJS.ReadableStream | null> {
        try {
            // Get container name and blob client ready
            const containerName = process.env.contribution_BlobContainerName;
            const client = blobServiceClient.getContainerClient(containerName);
            const blobClient = client.getBlobClient(blobName);

            // Get blob content from position 0 to the end
            // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
            // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
            const downloadBlockBlobResponse = await blobClient.download(0);
            return downloadBlockBlobResponse.readableStreamBody;
        } catch (error) {
            return null;
        }
        
    },
    /**
     * get Blob properties
     * @param blobName
     * @param blobServiceClient
     * @returns
     */
    async getBlobProperties(blobName: string, blobServiceClient: BlobServiceClient):Promise<BlobGetPropertiesResponse>{
        try {
            // Get container name and blob client ready
            const containerName = process.env.contribution_BlobContainerName as string;
            const client = blobServiceClient.getContainerClient(containerName);
            const blobClient = client.getBlobClient(blobName);
            if(await blobClient.exists()){
                const properties:BlobGetPropertiesResponse = await blobClient.getProperties();
                return properties
            }
            throw new CustomError("GET_BLOB_PROPERTIES_FAILED", `File (${blobName}) is not exists`);
        } catch (error) {
            throw new CustomError("GET_BLOB_PROPERTIES_FAILED", `${error?.name - error?.message - error?.moreDetails}`); 
        }
    }
}

export default blobHelper;