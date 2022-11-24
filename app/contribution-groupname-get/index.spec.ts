import httpTrigger from "./index";
import { Context } from "@azure/functions";

import {
  groupNameGetSuccessResponse,
  groupNameGetInvalid404Response,
  groupNameGetInvalid500response,
} from "../__test__/mock/groupNameResponse";
import sequelize from "../utils/database";

const responseGroupNameGetSuccessMock: any = Promise.resolve(
  groupNameGetSuccessResponse
);
const responseGroupNameGetInvalid404Mock: any = Promise.resolve(
  groupNameGetInvalid404Response
);
const responseGroupNameGetInvalid500Mock: any = Promise.resolve(
  groupNameGetInvalid500response
);

jest.mock("sequelize");

let context: Context;
const goodRequest = {
  query: {},
  params: { contribHeaderId: "4a2f768b-c0b0-41f7-a741-04b4f4b9b0bc" },
};

const invalidRequest = {
  query: {},
  params: { contribHeaderId: "4a2f768b--invalid" },
};

describe("Group Name get Success", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });

  it("should return a 200 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseGroupNameGetSuccessMock);
    // Action
    await httpTrigger(context, goodRequest);
    expect(context.res.status).toBe(200);
    expect(context.res.body).toEqual(groupNameGetSuccessResponse);
  });
});
describe("Group Name get Fail", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });
  it("should return a 404 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseGroupNameGetInvalid404Mock);
    // Action
    await httpTrigger(context, invalidRequest);
    // Check class instance method is called
    expect(context.res.status).toBe(404);
    expect(context.res.body).toEqual(groupNameGetInvalid404Response);
  });

  it("should return a 500 response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseGroupNameGetInvalid500Mock);
    // Action
    await httpTrigger(context, invalidRequest);
    expect(context.res.status).toBe(500);
  });
});
