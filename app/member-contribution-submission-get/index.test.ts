import httpTrigger from "../member-contribution-submission-get";
import { Context } from "@azure/functions";

import {
  memberSubmissionGetSuccessResponse,
  memberSubmissionGetInvalid404Response,
  memberSubmissionGetInvalid500response,
} from "../__test__/mock/memberSubmissionResponse";
import sequelize from "../utils/database";

const responsememberSubmissionGetSuccessMock: any = Promise.resolve(
  memberSubmissionGetSuccessResponse
);
const responsememberSubmissionGetInvalid404Mock: any = Promise.resolve(
  memberSubmissionGetInvalid404Response
);
const responsememberSubmissionGetInvalid500Mock: any = Promise.resolve(
  memberSubmissionGetInvalid500response
);

jest.mock("sequelize");

let context: Context;
const goodRequest = {
  query: {},
  params: { contribSubmissionRef: "b8b0a5bc-bfec-478f-8fb0-97f0d1dac717" },
};

const invalidRequest = {
  query: {},
  params: { contribSubmissionRef: "b8b0a5bc-bfec-478f-8fb0-97f0d1dac718" },
};

describe("member submission get Success", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });

  it("should return a 200 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responsememberSubmissionGetSuccessMock);
    // Action

    await httpTrigger(context, goodRequest);

    expect(context.res.status).toBe(200);

    expect(context.res.body).toEqual(memberSubmissionGetSuccessResponse);
  });
});
describe("Header get Fail", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });
  it("should return a 404 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responsememberSubmissionGetInvalid404Mock);
    // Action
    await httpTrigger(context, invalidRequest);

    // Check class instance method  is called

    expect(context.res.status).toBe(404);
    expect(context.res.body).toEqual(memberSubmissionGetInvalid404Response);
  });

  it("should return a 500 response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responsememberSubmissionGetInvalid500Mock);

    // Action
    await httpTrigger(context, invalidRequest);

    expect(context.res.status).toBe(500);
  });
  it("should return a 400 error status if contribSubmissionRef is abscent", async () => {
    const request = {
      query: {},
      params: {},
    };

    // Action
    await httpTrigger(context, request);

    expect(context.res.status).toBe(400);
  });
});
