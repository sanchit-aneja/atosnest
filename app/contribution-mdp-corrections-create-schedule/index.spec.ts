import httpTrigger from "./index";
import { Context } from "@azure/functions";
import { ContributionDetails, ContributionHeader } from "../models";
import {
  validateHeaderResponse,
  successResponse,
} from "../__test__/mock/correctionsCreateSceduleResponse";
import { dummyContributionId, noDetailsFoundError, noHeaderFoundError } from "./testConstants";

const responseheaderValidatesMock: any = Promise.resolve(
  validateHeaderResponse
);
const responseheaderSuccessMock: any = Promise.resolve(successResponse);
const responseDetailValidateMock: any = Promise.resolve(1);
const responseHeaderCountMock: any = Promise.resolve(1);
jest.mock("sequelize");

let context: Context;
const goodRequest = {
  query: { ContributionHeaderId: dummyContributionId },
  params: {},
};

const invalidRequest = {
  query: {},
  params: { externalScheduleRef: "2022-23-02-invalid" },
};

describe("Schedule Correction Success", () => {
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

describe("Schedule Correction Failure", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });

  it('should return the correct error if headerId does not exist in the header table', async () => {
    // When
    jest
      .spyOn(ContributionHeader, "findOne")
      .mockResolvedValueOnce(Promise.resolve(null));

    // Then
    await httpTrigger(context, goodRequest);

    // Expect
    expect(context.res.status).toBe(400);
    expect(context.res.body).toEqual(noHeaderFoundError);
  });

  it('should return the correct error if there are no details for the contributionId in the details table', async () => {
    // When
    jest
    .spyOn(ContributionHeader, "findOne")
    .mockResolvedValueOnce(responseheaderValidatesMock);
    jest
      .spyOn(ContributionDetails, "count")
      .mockResolvedValueOnce(Promise.resolve(0));
  
    // Then
    await httpTrigger(context, goodRequest);
    
    // Expect
    expect(context.res.status).toBe(404);
    expect(context.res.body).toEqual(noDetailsFoundError);
  });
});