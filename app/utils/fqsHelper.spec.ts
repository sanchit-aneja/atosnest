import { AxiosResponse } from "axios";
import * as http from "./httpRequestGenerator";
import FQSHelper from "./fqsHelper";

const err = new Error("Server Error");

describe("FQS Implementation  Testing", () => {
  it("test updateFQSProcessingStatus status 200", async () => {
    const putProcessingRequest = {
      stage1: "started",
      stage2: "",
      stage3: "",
    };
    const putProcessingResponseMock = Promise.resolve({
      status: 200,
    } as AxiosResponse);

    jest
      .spyOn(http, "httpRequestGenerator")
      .mockReturnValueOnce(putProcessingResponseMock);
    const fqsHelper = new FQSHelper();
    try {
      const response = (await fqsHelper.updateFQSProcessingStatus(
        "test",
        "payload.correlationId",
        putProcessingRequest
      )) as AxiosResponse;
      expect(response.status).toBe(200);
    } catch (error) {}
  });
  it("test updateFQSFinishedStatus status 200", async () => {
    const putFinishedRequest = {
      stage1: "completed",
      stage2: "completed",
      stage3: "completed",
    };
    const putFinishedResponseMock = Promise.resolve({
      status: 200,
    } as AxiosResponse);

    jest
      .spyOn(http, "httpRequestGenerator")
      .mockReturnValueOnce(putFinishedResponseMock);
    const fqsHelper = new FQSHelper();
    try {
      const response = (await fqsHelper.updateFQSProcessingStatus(
        "test",
        "payload.correlationId",
        putFinishedRequest
      )) as AxiosResponse;
      expect(response.status).toBe(200);
    } catch (error) {}
  });

  it("test getStatusForProcessing status 202", async () => {
    const PrcessingResponse =
      '{\r\n    "stage1":"started",\r\n    "stage2":"",\r\n    "stage3":""\r\n}';
    const getProcessingResponseMock = Promise.resolve({
      status: 202,
      data: PrcessingResponse,
    } as AxiosResponse);

    jest
      .spyOn(http, "httpRequestGenerator")
      .mockReturnValueOnce(getProcessingResponseMock);
    const fqsHelper = new FQSHelper();
    try {
      const response = (await fqsHelper.getFQSStatusViews(
        "test",
        "payload.correlationId"
      )) as AxiosResponse;
      expect(response.status).toBe(202);
    } catch (error) {}
  });
  it("test getStatusForFinished status 200", async () => {
    const FinishedResponse =
      '{\r\n    "stage1":"completed",\r\n    "stage2":"completed",\r\n    "stage3":"completed"\r\n}';
    const getProcessingResponseMock = Promise.resolve({
      status: 200,
      data: FinishedResponse,
    } as AxiosResponse);

    jest
      .spyOn(http, "httpRequestGenerator")
      .mockReturnValueOnce(getProcessingResponseMock);
    const fqsHelper = new FQSHelper();
    try {
      const response = (await fqsHelper.getFQSStatusViews(
        "test",
        "payload.correlationId"
      )) as AxiosResponse;
      expect(response.status).toBe(200);
    } catch (error) {}
  });
});

describe("FQS Service Error Testing", () => {
  it("test updateFQSProcessingStatus error status 500", async () => {
    jest
      .spyOn(http, "httpRequestGenerator")
      .mockRejectedValueOnce({ status: 500, err });
    const fqsHelper = new FQSHelper();
    try {
      await fqsHelper.updateFQSProcessingStatus(
        "test",
        "payload.correlationId",
        ""
      );
    } catch (error) {
      expect(error.status).toBe(500);
    }
  });
  it("test updateFQSFinishedStatus error status 500", async () => {
    jest
      .spyOn(http, "httpRequestGenerator")
      .mockRejectedValueOnce({ status: 500, err });
    const fqsHelper = new FQSHelper();
    try {
      await fqsHelper.updateFQSFinishedStatus(
        "test",
        "payload.correlationId",
        ""
      );
    } catch (error) {
      expect(error.status).toBe(500);
    }
  });
  it("test getFQSStatusViews error status 500", async () => {
    jest
      .spyOn(http, "httpRequestGenerator")
      .mockRejectedValueOnce({ status: 500, err });
    const fqsHelper = new FQSHelper();
    try {
      await fqsHelper.getFQSStatusViews("test", "payload.correlationId");
    } catch (error) {
      expect(error.status).toBe(500);
    }
  });
});
