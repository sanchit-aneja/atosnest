import httpTrigger from "./index";
import { Context } from "@azure/functions";
import { ContributionDetails, ContributionHeader } from "../models";
import {
  validateHeaderResponse,
  successResponse,
} from "../__test__/mock/correctionsCreateSceduleResponse";

const responseheaderValidatesMock: any = Promise.resolve(
  validateHeaderResponse
);
const responseheaderSuccessMock: any = Promise.resolve(successResponse);
const responseDetailValidateMock: any = Promise.resolve(1);
const responseHeaderCountMock: any = Promise.resolve(1);
jest.mock("sequelize");

let context: Context;
const goodRequest = {
  query: {},
  params: {
    contribHeaderId: "9dc2eea5-4a04-481d-bb44-ebad33393719",
    scheduleType: "CC",
  },
};

const invalidRequest = {
  query: {},
  params: { externalScheduleRef: "2022-23-02-invalid" },
};

describe("Header get Success", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });

  it("should return a 200 and expected response", async () => {
    jest
      .spyOn(ContributionHeader, "findOne")
      .mockResolvedValueOnce(responseheaderValidatesMock);
    jest
      .spyOn(ContributionDetails, "count")
      .mockResolvedValueOnce(responseDetailValidateMock);
    jest
      .spyOn(ContributionHeader, "count")
      .mockResolvedValueOnce(responseHeaderCountMock);

    jest
      .spyOn(ContributionHeader, "create")
      .mockResolvedValueOnce(responseheaderSuccessMock);
    // Action

    await httpTrigger(context, goodRequest);

    expect(context.res.status).toBe(200);

    expect(context.res.body).toBe(successResponse);
  });
});
