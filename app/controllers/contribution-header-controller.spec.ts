import { ContributionHeaderController } from "./contribution-header-controller";
import sequelize from "../utils/database";
import { headerGetSuccessResponse } from "../__test__/mock/headerSearchResponse";
const responseheaderGetSuccessMock: any = Promise.resolve(
  headerGetSuccessResponse
);
jest.mock("sequelize");

beforeEach(() => {
  jest.clearAllMocks();
});
describe("Success", () => {
  const seqTransactions = jest
    .spyOn(sequelize, "transaction")
    .mockResolvedValue(responseheaderGetSuccessMock);

  it("test response", async () => {
    const requestObj = {
      options: {
        limit: 50,
        offset: 0,
        sort: ["earningPeriodEndDate.desc"],
      },
      params: {
        employerNestId: "SCHEMEDATA",
        startDate: "",
        endDate: "",
      },
    };
    const rangeParams = {
      startDate: requestObj.params.startDate,
      endDate: requestObj.params.endDate,
    };

    const ctrl = new ContributionHeaderController();
    const ctrlSpy = jest.spyOn(ctrl, "getHeaderByFilter");
    const response = await ctrl.getHeaderByFilter(requestObj, rangeParams);
    //Check Interactions
    expect(seqTransactions).toHaveBeenCalledTimes(1);
    expect(typeof ctrl.getHeaderByFilter).toBe("function");
    expect(ctrlSpy).toHaveBeenCalledWith(requestObj, rangeParams);
    //Check Response
    expect(response).toEqual(headerGetSuccessResponse);
  });
});
