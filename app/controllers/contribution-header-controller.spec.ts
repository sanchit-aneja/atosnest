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
    const externalScheduleRef = "2022-23-02-05.35.45.302656.6621";
    const ctrl = new ContributionHeaderController();
    const ctrlSpy = jest.spyOn(ctrl, "getContributionHeader");
    const response = await ctrl.getContributionHeader(externalScheduleRef);
    //Check Interactions
    expect(seqTransactions).toHaveBeenCalledTimes(1);
    expect(typeof ctrl.getContributionHeader).toBe("function");
    expect(ctrlSpy).toHaveBeenCalledWith(externalScheduleRef);
    //Check Response
    expect(response).toEqual(headerGetSuccessResponse);
  });
});
