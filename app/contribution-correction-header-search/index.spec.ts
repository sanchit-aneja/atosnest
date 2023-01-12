import httpTrigger from "../contribution-correction-header-search";
import { Context } from "@azure/functions";

import {
  contributionCorrectionSearchSuccessResponse,
  contributionCorrectionSearchInvalid400Response,
  contributionCorrectionSearchInvalid404Response,
  contributionCorrectionSearchInvalid500response,
} from "../__test__/mock/contributionCorrectionSearchResponse";
import sequelize from "../utils/database";

const responseSuccessMock: any = Promise.resolve(
  contributionCorrectionSearchSuccessResponse
);
const responseInvalid400Mock: any = Promise.resolve(
  contributionCorrectionSearchInvalid400Response
);
const responseInvalid404Mock: any = Promise.resolve(
  contributionCorrectionSearchInvalid404Response
);
const responseInvalid500Mock: any = Promise.resolve(
  contributionCorrectionSearchInvalid500response
);

jest.mock("sequelize");

let context: Context;
const goodRequest = {
  body: {
    options: {
      limit: 400,
      offset: 0,
      sort: ["earningPeriodEndDate.desc"],
    },
    params: {
      employerNestId: "SCHEMEDATA",
    },
  },
};

const invalidRequest = {
  body: {
    options: {
      limit: 400,
      offset: 0,
      sort: ["earningPeriodEndDate.desc"],
    },
    params: {
      employerNestId: "SCHEMEDATA1",
    },
  },
};

const invalid400Request = {
  body: {
    options: {
      limit: 400,
      offset: 0,
      sort: ["earningPeriodEndDate.desc"],
    },
    params: {},
  },
};

describe("Contribution Correction Header Search Success", () => {
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
      contributionCorrectionSearchSuccessResponse
    );
  });
});
describe("Contribution Correction Header Search Fail", () => {
  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });
  it("should return a 500 and expected response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseInvalid500Mock);
    // Action
    await httpTrigger(context, invalidRequest);

    // Check class instance method  is called
    expect(context.res.status).toBe(500);
  });

  it("should return a 400 response", async () => {
    jest
      .spyOn(sequelize, "transaction")
      .mockResolvedValueOnce(responseInvalid400Mock);

    // Action
    await httpTrigger(context, invalid400Request);
    expect(context.res.status).toBe(400);
    expect(context.res.body).toEqual(
      contributionCorrectionSearchInvalid400Response
    );
  });
});
