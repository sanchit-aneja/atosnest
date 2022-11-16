import { Type3Validations } from "./type3Validations";
import { ContributionDetails, ContributionHeader } from "../models";
import { Context } from "@azure/functions";
import { id31_0Response } from "../__test__/mock/validations/type3Responses/id31_0Response";
import { id31_1Response } from "../__test__/mock/validations/type3Responses/id31_1Response";
import { id31_3Response } from "../__test__/mock/validations/type3Responses/id31_3Response";
import { id31_4Response } from "../__test__/mock/validations/type3Responses/id31_4Response";
import { id31_5Response } from "../__test__/mock/validations/type3Responses/id31_5Response";
import { id31_6Response } from "../__test__/mock/validations/type3Responses/id31_6Response";
import { id31_7Response } from "../__test__/mock/validations/type3Responses/id31_7Response";
import { id31_8Response } from "../__test__/mock/validations/type3Responses/id31_8Response";
import { id31_9Response } from "../__test__/mock/validations/type3Responses/id31_9Response";
import { id31_10Response } from "../__test__/mock/validations/type3Responses/id31_10Response";
import { id31_11Response } from "../__test__/mock/validations/type3Responses/id31_11Response";
import { id31_43Response } from "../__test__/mock/validations/type3Responses/id31_43Response";
import { id31_44Response } from "../__test__/mock/validations/type3Responses/id31_44Response";
import { id31_45Response } from "../__test__/mock/validations/type3Responses/id31_45Response";
import { id31_48Response } from "../__test__/mock/validations/type3Responses/id31_48Response";
import { id31_54Response } from "../__test__/mock/validations/type3Responses/id31_54Response";
import { id31_55Response } from "../__test__/mock/validations/type3Responses/id31_55Response";
import { id31_56Response } from "../__test__/mock/validations/type3Responses/id31_56Response";
import { id31_58Response } from "../__test__/mock/validations/type3Responses/id31_58Response";
import { id31_60Response } from "../__test__/mock/validations/type3Responses/id31_60Response";
import { id31_62Response } from "../__test__/mock/validations/type3Responses/id31_62Response";
import { id31_75Response } from "../__test__/mock/validations/type3Responses/id31_75Response";
import { id32_00Response } from "../__test__/mock/validations/type3Responses/id32_00Response";
import { id32_01Response } from "../__test__/mock/validations/type3Responses/id32_01Response";
import { id32_02Response } from "../__test__/mock/validations/type3Responses/id32_02Response";
import { id33_00Response } from "../__test__/mock/validations/type3Responses/id33_00Response";
import { id33_02Response } from "../__test__/mock/validations/type3Responses/id33_02Response";
import { id34_00Response } from "../__test__/mock/validations/type3Responses/id34_00Response";
import { id34_01Response } from "../__test__/mock/validations/type3Responses/id34_01Response";
import { id34_02Response1 } from "../__test__/mock/validations/type3Responses/id34_02Response1";
import { id34_02Response2 } from "../__test__/mock/validations/type3Responses/id34_02Response2";
import {
  ContributionDetailsResponse,
  ContributionHeaderResponse,
  customerIndexResponse,
} from "../__test__/mock/validations/type3Responses/type3DataResponse";
import sequelize from "../utils/database";
import * as http from "../utils/httpRequestGenerator";

jest.mock("sequelize");

const customerIndexResponseMock: any = Promise.resolve(customerIndexResponse);
const contributionDetailsResponseMock: any = Promise.resolve(
  ContributionDetailsResponse
);
const contributionHeaderResponseMock: any = Promise.resolve(
  ContributionHeaderResponse
);
let context: Context;
beforeEach(() => {
  jest.clearAllMocks();
  context = { log: jest.fn() } as unknown as Context;
});

describe("Type 3 Validation Interactions", () => {
  jest
    .spyOn(ContributionHeader, "findOne")
    .mockResolvedValue(contributionHeaderResponseMock);

  jest
    .spyOn(ContributionDetails, "findAll")
    .mockResolvedValue(contributionDetailsResponseMock);
  jest
    .spyOn(http, "httpRequestGenerator")
    .mockReturnValueOnce(customerIndexResponseMock);

  const updateDBSpy: any = jest.spyOn(Type3Validations, "updateDB");

  it("test end to end", async () => {
    const MockedTransaction = sequelize.transaction as any as jest.Mock<any>;

    MockedTransaction.mockImplementation(() => {
      return {
        commit: () => {
          return Promise.resolve(true);
        },
      };
    });

    await Type3Validations.start(
      "9dc2eea5-4a04-481d-bb44-ebad33393719",
      context
    );

    expect(updateDBSpy).toHaveBeenCalledTimes(1);
  });
});

describe("Type 3 Validations rules", () => {
  it("test ID31.0", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_0Response,
      context
    );
    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.0"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID31.1", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_1Response,
      context
    );
    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.1"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID31.3", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_3Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.3"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID31.4", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_4Response,
      context
    );
    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.4"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID31.5", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_5Response,
      context
    );
    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.5"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID31.6", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_6Response,
      context
    );
    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.6"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID31.7", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_7Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.7"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID31.8", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_8Response,
      context
    );
    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.8"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID31.9", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_9Response,
      context
    );
    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.9"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID31.10", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_10Response,
      context
    );
    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.10"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID31.11", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_11Response,
      context
    );
    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.11"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID31.43", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_43Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.43"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID31.44", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_44Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.44"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID31.45", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_45Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.45"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID31.48", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_48Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.48"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID31.54", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_54Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.54"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID31.55", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_55Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.55"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID31.56", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_56Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.56"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID31.58", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_58Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.58"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID31.60", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_60Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.60"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID31.63", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_62Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.62"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID31.75", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id31_75Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID31.75"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID32.00", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id32_00Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID32.00"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID32.01", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id32_01Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID32.1"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID32.02", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id32_02Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID32.2"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID33.00", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id33_00Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID33.00"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID33.02", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id33_02Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID33.2"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID34.00", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id34_00Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID34.00"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID34.01", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id34_01Response,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID34.01"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });

  it("test ID34.02-1", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id34_02Response1,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID34.02"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
  it("test ID34.02-2", async () => {
    const { Type3Errors } = await Type3Validations.validateDataRows(
      id34_02Response2,
      context
    );

    const errorCheck = Type3Errors.filter(
      (error) => error.Error_Code == "ID34.02"
    );

    expect(errorCheck.length).toBeGreaterThan(0);
  });
});
