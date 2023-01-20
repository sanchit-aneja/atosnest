import httpTrigger from "./index";
import { Context } from "@azure/functions";

import {
  preCorrectionSummarySuccessResponse,
  preCorrectionSummaryInvalid404Response,
} from "../__test__/mock/preCorrectionSummaryResponse";
import sequelize from "../utils/database";

const responseSuccessMock: any = Promise.resolve(
  preCorrectionSummarySuccessResponse
);
const responseInvalid404Mock: any = Promise.resolve(
  preCorrectionSummaryInvalid404Response
);

jest.mock("sequelize");

let context: Context;
const goodRequest = {
  query: {},
  params: { contribHeaderId: "7995478a-00b0-4e2e-92ad-7cd81a3f8f4d" },
};

const invalidRequest = {
  query: {},
  params: { contribHeaderId: "a47fc34a-e840-493d-b4db-9a48eeeaf13d" },
};

describe("Pre correction summary get Success", () => {
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
    expect(context.res.body).toEqual(preCorrectionSummarySuccessResponse);
  });
});
describe("Pre correction summary get Fail", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });
  it("should return a 404 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseInvalid404Mock);
    // Action
    await httpTrigger(context, invalidRequest);
    // Check class instance method is called
    expect(context.res.status).toBe(404);
    expect(context.res.body).toEqual(preCorrectionSummaryInvalid404Response);
  });
});
