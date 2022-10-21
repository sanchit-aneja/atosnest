import httpTrigger from "./index";
import { Context } from "@azure/functions";

import {
  headerGetSuccessResponse,
  headerGetInvalid404Response,
  headerGetInvalid500response,
} from "../__test__/mock/headerSearchResponse";
import sequelize from "../utils/database";

const responseheaderGetSuccessMock: any = Promise.resolve(
  headerGetSuccessResponse
);
const responseheaderGetInvalid404Mock: any = Promise.resolve(
  headerGetInvalid404Response
);
const responseheaderGetInvalid500Mock: any = Promise.resolve(
  headerGetInvalid500response
);

jest.mock("sequelize");

let context: Context;
const goodRequest = {
  query: {},
  params: { externalScheduleRef: "2022-23-02-05.35.45.302656.6621" },
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
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseheaderGetSuccessMock);
    // Action

    await httpTrigger(context, goodRequest);

    expect(context.res.status).toBe(200);

    expect(context.res.body).toEqual(headerGetSuccessResponse);
  });
});
describe("Header get Fail", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });
  it("should return a 404 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseheaderGetInvalid404Mock);
    // Action
    await httpTrigger(context, invalidRequest);

    // Check class instance method  is called

    expect(context.res.status).toBe(404);
    expect(context.res.body).toEqual(headerGetInvalid404Response);
  });

  it("should return a 500 response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseheaderGetInvalid500Mock);

    // Action
    await httpTrigger(context, invalidRequest);

    expect(context.res.status).toBe(500);
  });
  it("should return a 400 error status if externalScheduleRef is abscent", async () => {
    const request = {
      query: {},
      params: {},
    };

    // Action
    await httpTrigger(context, request);

    expect(context.res.status).toBe(400);
  });
});
