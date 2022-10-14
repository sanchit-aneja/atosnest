import httpTrigger from "../contribution-details-search";
import { Context } from "@azure/functions";

import {
  contributionDetailsSearchSuccessResponse,
  contributionDetailsSearchInvalid404Response,
  contributionDetailsSearchInvalid500response,
} from "../__test__/mock/contributionDetailsSearchResponse";
import sequelize from "../utils/database";

const responseContributionDetailsSearchSuccessMock: any = Promise.resolve(
  contributionDetailsSearchSuccessResponse
);
const responseContributionDetailsInvalid404Mock: any = Promise.resolve(
  contributionDetailsSearchInvalid404Response
);
const responseContributionDetailsInvalid500Mock: any = Promise.resolve(
  contributionDetailsSearchInvalid500response
);

jest.mock("sequelize");

let context: Context;
const goodRequest = {
  body: {
    options: {
      limit: 1,
      offset: 0,
      sort: ["firstName.asc"]
    },
    params: {
      nestScheduleRef: "CSM01022201100"
    }
  }
};

const invalidRequest = {
  body: {
    options: {
      limit: 1,
      offset: 0,
      sort: ["firstName.asc"]
    },
    params: {
      nestScheduleRef: "CSM010222011000"
    }
  }
};

describe("Contribution Member Details Search Success", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });

  it("should return a 200 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseContributionDetailsSearchSuccessMock);
    // Action

    await httpTrigger(context, goodRequest);

    expect(context.res.status).toBe(200);

    expect(context.res.body).toEqual(contributionDetailsSearchSuccessResponse);
  });
});
describe("Contribution Member Details Search Fail", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });
  it("should return a 404 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseContributionDetailsInvalid404Mock);
    // Action
    await httpTrigger(context, invalidRequest);

    // Check class instance method  is called

    expect(context.res.status).toBe(404);
    expect(context.res.body).toEqual(contributionDetailsSearchInvalid404Response);
  });

  it("should return a 400 response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseContributionDetailsInvalid500Mock);

    // Action
    await httpTrigger(context, invalidRequest);

    expect(context.res.status).toBe(400);

  });

  
});