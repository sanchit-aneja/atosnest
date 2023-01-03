import httpTrigger from "../contribution-overdue-schedule-search";
import { Context } from "@azure/functions";

import {
  contributionOverdueDetailsSearchSuccessResponse,
  contributionOverdueDetailsSearchInvalid400Response,
  contributionOverdueDetailsSearchInvalid500response,
} from "../__test__/mock/contributionOverdueDetailsSearchResponse";
import sequelize from "../utils/database";

const responseSuccessMock: any = Promise.resolve(
  contributionOverdueDetailsSearchSuccessResponse
);
const responseInvalid400Mock: any = Promise.resolve(
  contributionOverdueDetailsSearchInvalid400Response
);
const responseInvalid500Mock: any = Promise.resolve(
  contributionOverdueDetailsSearchInvalid500response
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
    searchOptions: {
      filter: "PAID",
      fromDate: "2020-12-07",
    },
    params: [
      {
        employerNestId: "SCHEMEDATA",
        employerName: "Tesco",
      },
    ],
  },
};

const invalidRequest = {
  body: {},
};

describe("Contribution Overdue Schedule Search Success", () => {
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

    expect(context.res.body).toEqual(
      contributionOverdueDetailsSearchSuccessResponse
    );
  });
});
describe("Contribution Overdue Schedule Search Fail", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });
  it("should return a 400 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseInvalid400Mock);
    // Action
    await httpTrigger(context, invalidRequest);

    // Check class instance method  is called

    expect(context.res.status).toBe(400);
    expect(context.res.body).toEqual(
      contributionOverdueDetailsSearchInvalid400Response
    );
  });
});
