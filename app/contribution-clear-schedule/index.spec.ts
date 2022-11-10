import httpTrigger from "./index";
import { Context } from "@azure/functions";

import {
  clearScheduleSuccessResponse,
  clearScheduleInvalid404Response,
  clearScheduleInvalid500response,
} from "../__test__/mock/clearScheduleResponse";
import sequelize from "../utils/database";

const responseSuccessMock: any = Promise.resolve(clearScheduleSuccessResponse);
const responseInvalid404Mock: any = Promise.resolve(
  clearScheduleInvalid404Response
);
const responseInvalid500Mock: any = Promise.resolve(
  clearScheduleInvalid500response
);

jest.mock("sequelize");

let context: Context;
const goodRequest = {
  query: {},
  params: { contribHeaderId: "24d924e2-2692-40d6-9400-34134aaa4038" },
};

const invalidRequest = {
  query: {},
  params: { contribHeaderId: "24d924e2-2692-40d6-9400-34134aaa4039" },
};

describe("Clear Schedule Put Success", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });

  it("should return a 200 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseSuccessMock);
    // Action

    await httpTrigger(context, goodRequest);
    expect(context.res.status).toBe(200);
  });
});
describe("Clear Schedule Put Fail", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });
  it("should return a 404 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseInvalid404Mock);
    // Action
    await httpTrigger(context, invalidRequest);

    // Check class instance method  is called

    expect(context.res.status).toBe(404);
    expect(context.res.body).toEqual(clearScheduleInvalid404Response);
  });

  it("should return a 500 response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseInvalid500Mock);

    // Action
    await httpTrigger(context, invalidRequest);

    expect(context.res.status).toBe(500);
  });
  it("should return a 400 error status if contribHeaderId is abscent", async () => {
    const request = {
      query: {},
      params: {},
    };

    // Action
    await httpTrigger(context, request);

    expect(context.res.status).toBe(400);
  });
});
