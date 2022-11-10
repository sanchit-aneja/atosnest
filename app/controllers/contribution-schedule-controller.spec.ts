import { ContributionScheduleController } from "./contribution-schedule-controller";
import sequelize from "../utils/database";
import { clearScheduleSuccessResponse } from "../__test__/mock/clearScheduleResponse";
const responseClearScheduleSuccessMock: any = Promise.resolve(
  clearScheduleSuccessResponse
);
jest.mock("sequelize");

beforeEach(() => {
  jest.clearAllMocks();
});
describe("Success", () => {
  const seqTransactions = jest
    .spyOn(sequelize, "transaction")
    .mockResolvedValue(responseClearScheduleSuccessMock);

  it("test response", async () => {
    const contribHeaderId = "24d924e2-2692-40d6-9400-34134aaa4038";
    const ctrl = new ContributionScheduleController();
    const ctrlSpy = jest.spyOn(ctrl, "clearContributionSchedule");
    const response = await ctrl.clearContributionSchedule(contribHeaderId);
    //Check Interactions
    expect(seqTransactions).toHaveBeenCalledTimes(1);
    expect(typeof ctrl.clearContributionSchedule).toBe("function");
    expect(ctrlSpy).toHaveBeenCalledWith(contribHeaderId);
    //Check Response
    expect(response).toEqual(clearScheduleSuccessResponse);
  });
});
