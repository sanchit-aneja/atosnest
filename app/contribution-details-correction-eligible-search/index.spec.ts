import httpTrigger from "../contribution-details-search";
import { Context } from "@azure/functions";

import {
  eligibleContributionDetailsSearchSuccessResponse,
  eligibleContributionDetailsSearchInvalid404Response,
  eligibleContributionDetailsSearchInvalid500response,
} from "../__test__/mock/eligibleContributionDetailsSearchResponse";
import sequelize from "../utils/database";

const responseContributionDetailsSearchSuccessMock: any = Promise.resolve(
  eligibleContributionDetailsSearchSuccessResponse
);
const responseContributionDetailsInvalid404Mock: any = Promise.resolve(
  eligibleContributionDetailsSearchInvalid404Response
);
const responseContributionDetailsInvalid500Mock: any = Promise.resolve(
  eligibleContributionDetailsSearchInvalid500response
);

jest.mock("sequelize");

let context: Context;
const goodRequest = {
  body: {
    options: {
      limit: 50,
      offset: 0,
      sort: [],
    },
    params: {
      contribHeaderId: "80727fdf-0dda-49b1-a3db-4a2072711bc0",
    },
  },
};

const invalidRequest = {
  body: {
    options: {
      limit: 1,
      offset: 0,
      sort: ["firstName.asc"],
    },
    params: {
      nestScheduleRef: "CSM010222011000",
    },
  },
};

describe("Eligible Contribution Member Details Search Success", () => {
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

    expect(context.res.body).toEqual(
      eligibleContributionDetailsSearchSuccessResponse
    );
  });
});
describe("Eligible Contribution Member Details Search Fail", () => {
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
    expect(context.res.body).toEqual(
      eligibleContributionDetailsSearchInvalid404Response
    );
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
