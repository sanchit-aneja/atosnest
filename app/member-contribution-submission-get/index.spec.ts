import httpTrigger from "../member-contribution-submission-get";
import { Context } from "@azure/functions";

import {
  memberSubmissionGetSuccessResponse,
  memberSubmissionGetInvalid404Response,
  memberSubmissionGetInvalid500response,
} from "../__test__/mock/memberSubmissionResponse";
import sequelize from "../utils/database";

const responsememberSubmissionGetSuccessMock: any =
  Promise.resolve(
    memberSubmissionGetSuccessResponse
  );
const responsememberSubmissionGetInvalid404Mock: any =
  Promise.resolve(
    memberSubmissionGetInvalid404Response
  );
const responsememberSubmissionGetInvalid500Mock: any =
  Promise.resolve(
    memberSubmissionGetInvalid500response
  );

jest.mock("sequelize");

let contxt: Context;

const goodReq = {
  query: {},
  params: { contribSubmissionRef: "2de64d14-d384-48d5-a903-3981306fd765" },
};

const invalidReq = {
  query: {},
  params: { contribSubmissionRef: "b8b0a5bc-bfec-478f-8fb0-97f0d1dac718" },
};

describe("member submission get Success", () => {

  beforeEach(() => {

    contxt =
      {
        log: jest.fn()
      } as unknown as Context;
  });

  it("should return a 200", async () => {

    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responsememberSubmissionGetSuccessMock);
    // Action
    await httpTrigger(contxt, goodReq);

    expect(contxt.res.status).toBe(200);

    expect(contxt.res.body).toEqual(memberSubmissionGetSuccessResponse);
  });
});
describe("It should return 404", () => {
  beforeEach(() => {
    contxt = {
      log: jest.fn()
    } as unknown as Context;
  });
  it("should return a 404 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responsememberSubmissionGetInvalid404Mock);
    // Action
    await httpTrigger(contxt, invalidReq);
    expect(contxt.res.status).toBe(404);
    expect(contxt.res.body).toEqual(memberSubmissionGetInvalid404Response);
  });

  it("It should return 500", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responsememberSubmissionGetInvalid500Mock);
    // Action
    await httpTrigger(contxt, invalidReq);
    expect(contxt.res.status).toBe(500);
  });
  it("It should return 400", async () => {
    const request = {
      query: {},
      params: {},
    };

    // Action
    await httpTrigger(contxt, request);
    expect(contxt.res.status).toBe(400);
  });
});
