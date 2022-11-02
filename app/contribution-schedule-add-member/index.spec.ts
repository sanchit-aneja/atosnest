import httpTrigger from "../contribution-schedule-add-member";
import { Context } from "@azure/functions";

import {
  addMemberScheduleSuccessResponse,
  addMemberScheduleInvalid404Response,
  addMemberScheduleInvalid500response,
} from "../__test__/mock/addMemberScheduleResponse";
import sequelize from "../utils/database";

const addMemberScheduleSuccessResponseMock: any = Promise.resolve(
  addMemberScheduleSuccessResponse
);
const addMemberScheduleInvalid404ResponseMock: any = Promise.resolve(
  addMemberScheduleInvalid404Response
);
const addMemberScheduleInvalid500responseMock: any = Promise.resolve(
  addMemberScheduleInvalid500response
);

jest.mock("sequelize");

let contxt: Context;

const goodReq = {
  body: {
    contribHeaderId: "15648687-ca68-4684-b62e-cc1ce64f705d",
    contributionDetail: [
      {
        membContribDetlId: "ddba35eb-c962-4fe5-9c45-b78a4d563568",
      },
    ],
  },
};

const invalidReq = {
  body: {
    contribHeaderId: "15648687-ca68-4684-b62e-cc1ce64f705",
    contributionDetail: [
      {
        membContribDetlId: "ddba35eb-c962-4fe5-9c45-b78a4d563568",
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
      .mockResolvedValueOnce(addMemberScheduleSuccessResponseMock);
    // Action
    await httpTrigger(contxt, goodReq);

    expect(contxt.res.status).toBe(200);

    expect(contxt.res.body).toEqual(addMemberScheduleSuccessResponse);
  });
});
describe("It should return 404", () => {
  beforeEach(() => {
    contxt = {
      log: jest.fn(),
    } as unknown as Context;
  });
  it("should return a 404 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(addMemberScheduleInvalid404ResponseMock);
    // Action
    await httpTrigger(contxt, invalidReq);
    expect(contxt.res.status).toBe(404);
    expect(contxt.res.body).toEqual(addMemberScheduleInvalid404Response);
  });

  it("It should return 500", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(addMemberScheduleInvalid500responseMock);
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
