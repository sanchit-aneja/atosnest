import httpTrigger from "./index";
import { Context } from "@azure/functions";
import {
  updateIneligibilitySuccessResponse,
  updateIneligibilityInvalid404Response,
  updateIneligibilityInvalid500response,
} from "../__test__/mock/updateIneligibilityResponse";
import sequelize from "../utils/database";

const responseUpdateIneligibilitySuccessMock: any = Promise.resolve(
  updateIneligibilitySuccessResponse
);

const responseUpdateInvalid404ResponseMock: any = Promise.resolve(
  updateIneligibilityInvalid404Response
);
const responseUpdateInvalid500responseMock: any = Promise.resolve(
  updateIneligibilityInvalid500response
);

jest.mock("sequelize");

let context: Context;
const goodRequest = {
  query: {},
  params: {
    membEnrolmentRef: "709",
    ineligibilityReason: "opt out",
    effectiveDate: "2021-02-01",
  },
};

const badRequest = {
  query: {},
  params: {
    membEnrolmentRef: "7099999",
    ineligibilityReason: "opt out",
    effectiveDate: "2021-02-01",
  },
};

describe("Header get Success", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });

  it("should return a 200 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseUpdateIneligibilitySuccessMock);

    // Action
    await httpTrigger(context, goodRequest);
    expect(context.res.status).toBe(200);
  });
});

describe("It should return 404", () => {
  beforeEach(() => {
    context = {
      log: jest.fn(),
    } as unknown as Context;
  });
  it("should return a 404 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseUpdateInvalid404ResponseMock);
    // Action
    await httpTrigger(context, badRequest);
    expect(context.res.status).toBe(404);
    expect(context.res.body).toEqual(updateIneligibilityInvalid404Response);
  });

  it("It should return 500", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseUpdateInvalid500responseMock);
    // Action
    await httpTrigger(context, badRequest);
    expect(context.res.status).toBe(500);
  });
  it("It should return 400", async () => {
    const request = {
      query: {},
      params: {},
    };

    // Action
    await httpTrigger(context, request);
    expect(context.res.status).toBe(400);
  });
});
