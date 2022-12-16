import httpTrigger from "./index";
import { Context } from "@azure/functions";
import {
  updateMemberStatusSuccessResponse,
  updateMemberStatusInvalid404Response,
  updateMemberStatusInvalid500response,
} from "../__test__/mock/updateMemberStatusResponse";
import sequelize from "../utils/database";

const responseSuccessMock: any = Promise.resolve(
  updateMemberStatusSuccessResponse
);

const responseInvalid404ResponseMock: any = Promise.resolve(
  updateMemberStatusInvalid404Response
);
const responseInvalid500responseMock: any = Promise.resolve(
  updateMemberStatusInvalid500response
);

jest.mock("sequelize");

let context: Context;
const goodRequest = {
  body: {
    contributionDetail: [
      {
        membContribDetlId: "604a83d6-16ca-4eea-a5b7-82d7d9305bc9",
        schdlMembStatusCd: "MCS1",
      },
      {
        membContribDetlId: "b3e5cb62-3d0a-47fb-b213-8c8865352970",
        schdlMembStatusCd: "MCS10",
      },
    ],
  },
};

const badRequest = {
  body: {
    contributionDetail: [
      {
        membContribDetlId: "604a83d6-16ca-4eea-a5b7-82d7d9305bc9",
        schdlMembStatusCd: "MCS1",
      },
      {
        membContribDetlId: "b3e5cb62-3d0a-47fb-b213-8c8865352970",
        schdlMembStatusCd: "MCS10",
      },
    ],
  },
};

describe("Header get Success", () => {
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

describe("It should return 404", () => {
  beforeEach(() => {
    context = {
      log: jest.fn(),
    } as unknown as Context;
  });
  it("should return a 404 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseInvalid404ResponseMock);
    // Action
    await httpTrigger(context, badRequest);
    expect(context.res.status).toBe(404);
    expect(context.res.body).toEqual(updateMemberStatusInvalid404Response);
  });

  it("It should return 500", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseInvalid500responseMock);
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
