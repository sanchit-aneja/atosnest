import httpTrigger from "../member-contribution-details-update";
import { Context } from "@azure/functions";
import {
  memberUpdateSuccessResponse,
  memberUpdateInvalid404Response,
  memberUpdateInvalid500response,
} from "../__test__/mock/memberUpdateResponse";
import sequelize from "../utils/database";

const responseMemberUpdateSuccessMock: any = Promise.resolve(
  memberUpdateSuccessResponse
);
const responseMemberUpdateInvalid404Mock: any = Promise.resolve(
  memberUpdateInvalid404Response
);
const responseMemberUpdateInvalid500Mock: any = Promise.resolve(
  memberUpdateInvalid500response
);

jest.mock("sequelize");

let contxt: Context;

const goodReq = {
  body: {
    contributionDetail: [
      {
        membContribDetlId: "3da36cd3-a15a-418a-a7f7-3c1335b85339",
        autoCalcFlag: "Y",
      },
    ],
  },
};

const invalidReq = {
  body: {
    contributionDetail: [
      {
        autoCalcFlag: "Y",
      },
    ],
  },
};
describe("member submission get Success", () => {
  beforeEach(() => {
    contxt = {
      log: jest.fn(),
    } as unknown as Context;
  });

  it("should return a 200", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseMemberUpdateSuccessMock);
    // Action
    await httpTrigger(contxt, goodReq);

    expect(contxt.res.status).toBe(200);

    expect(contxt.res.body).toEqual(memberUpdateSuccessResponse);
  });
});
describe("It should return 404", () => {
  beforeEach(() => {
    contxt = {
      log: jest.fn(),
    } as unknown as Context;
  });

  it("It should return 500", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseMemberUpdateInvalid500Mock);
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
