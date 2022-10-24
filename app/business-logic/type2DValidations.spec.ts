import { Context } from "@azure/functions";
import { Type2DValidations } from "./";
const { Readable } = require("stream");

import CommonContributionDetails from "./commonContributionDetails";
jest.mock("sequelize");

describe("Test: Business logic common Contribution details functions", () => {
  let context: Context;
  const executeRulesOneByOne = Type2DValidations.executeRulesOneByOne;

  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("Should pass all validation for PensEarnings", async () => {
    // Arrage
    const input1 = { pensEarnings: "" };
    const input2 = { pensEarnings: "£123.00" };
    const input3 = { pensEarnings: "123.000" };
    const input4 = { pensEarnings: "123.00" };

    // Act
    const output1 = await Type2DValidations.rules.PensEarnings(input1);
    const output2 = await Type2DValidations.rules.PensEarnings(input2);
    const output3 = await Type2DValidations.rules.PensEarnings(input3);
    const output4 = await Type2DValidations.rules.PensEarnings(input4);
    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID25.0");
    expect(output3.code).toBe("ID30.0");
    expect(output4).toBe(null);
  });

  test("Should pass all validation for EmplContriAmt", async () => {
    // Arrage
    const input1 = { emplContriAmt: "" };
    const input2 = { emplContriAmt: "£123.00" };
    const input3 = { emplContriAmt: "123.000" };
    const input4 = { emplContriAmt: "123.00" };

    // Act
    const output1 = await Type2DValidations.rules.EmplContriAmt(input1);
    const output2 = await Type2DValidations.rules.EmplContriAmt(input2);
    const output3 = await Type2DValidations.rules.EmplContriAmt(input3);
    const output4 = await Type2DValidations.rules.EmplContriAmt(input4);
    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID25.1");
    expect(output3.code).toBe("ID30.1");
    expect(output4).toBe(null);
  });

  test("Should pass all validation for MembContriAmt", async () => {
    // Arrage
    const input1 = { membContriAmt: "" };
    const input2 = { membContriAmt: "£123.00" };
    const input3 = { membContriAmt: "123.000" };
    const input4 = { membContriAmt: "123.00" };

    // Act
    const output1 = await Type2DValidations.rules.MembContriAmt(input1);
    const output2 = await Type2DValidations.rules.MembContriAmt(input2);
    const output3 = await Type2DValidations.rules.MembContriAmt(input3);
    const output4 = await Type2DValidations.rules.MembContriAmt(input4);
    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID25.2");
    expect(output3.code).toBe("ID30.2");
    expect(output4).toBe(null);
  });

  test("Should pass all validation for MembLeaveEarnings", async () => {
    // Arrage
    const input1 = { membLeaveEarnings: "" };
    const input2 = { membLeaveEarnings: "£123.00" };
    const input3 = { membLeaveEarnings: "123.000" };
    const input4 = { membLeaveEarnings: "123.00" };

    // Act
    const output1 = await Type2DValidations.rules.MembLeaveEarnings(input1);
    const output2 = await Type2DValidations.rules.MembLeaveEarnings(input2);
    const output3 = await Type2DValidations.rules.MembLeaveEarnings(input3);
    const output4 = await Type2DValidations.rules.MembLeaveEarnings(input4);
    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID31.24");
    expect(output3.code).toBe("ID31.12");
    expect(output4).toBe(null);
  });

  test("Should pass all validation for NewGroupEmplContriAmt", async () => {
    // Arrage
    const input1 = { newGroupEmplContriAmt: "" };
    const input2 = { newGroupEmplContriAmt: "£123.00" };
    const input3 = { newGroupEmplContriAmt: "123.000" };
    const input4 = { newGroupEmplContriAmt: "123.00" };

    // Act
    const output1 = await Type2DValidations.rules.NewGroupEmplContriAmt(input1);
    const output2 = await Type2DValidations.rules.NewGroupEmplContriAmt(input2);
    const output3 = await Type2DValidations.rules.NewGroupEmplContriAmt(input3);
    const output4 = await Type2DValidations.rules.NewGroupEmplContriAmt(input4);
    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID31.30");
    expect(output3.code).toBe("ID31.18");
    expect(output4).toBe(null);
  });

  test("Should pass all validation for NewGroupMembContriAmt", async () => {
    // Arrage
    const input1 = { newGroupMembContriAmt: "" };
    const input2 = { newGroupMembContriAmt: "£123.00" };
    const input3 = { newGroupMembContriAmt: "123.000" };
    const input4 = { newGroupMembContriAmt: "123.00" };

    // Act
    const output1 = await Type2DValidations.rules.NewGroupMembContriAmt(input1);
    const output2 = await Type2DValidations.rules.NewGroupMembContriAmt(input2);
    const output3 = await Type2DValidations.rules.NewGroupMembContriAmt(input3);
    const output4 = await Type2DValidations.rules.NewGroupMembContriAmt(input4);
    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID31.31");
    expect(output3.code).toBe("ID31.19");
    expect(output4).toBe(null);
  });

  test("Should pass all validation for SecEnrolPensEarnings", async () => {
    // Arrage
    const input1 = { secEnrolPensEarnings: "" };
    const input2 = { secEnrolPensEarnings: "£123.00" };
    const input3 = { secEnrolPensEarnings: "123.000" };
    const input4 = { secEnrolPensEarnings: "123.00" };

    // Act
    const output1 = await Type2DValidations.rules.SecEnrolPensEarnings(input1);
    const output2 = await Type2DValidations.rules.SecEnrolPensEarnings(input2);
    const output3 = await Type2DValidations.rules.SecEnrolPensEarnings(input3);
    const output4 = await Type2DValidations.rules.SecEnrolPensEarnings(input4);

    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID31.34");
    expect(output3.code).toBe("ID31.21");
    expect(output4).toBe(null);
  });

  test("Should pass all validation for SecEnrolEmplContriAmt", async () => {
    // Arrage
    const input1 = { secEnrolEmplContriAmt: "" };
    const input2 = { secEnrolEmplContriAmt: "£123.00" };
    const input3 = { secEnrolEmplContriAmt: "123.000" };
    const input4 = { secEnrolEmplContriAmt: "123.00" };

    // Act
    const output1 = await Type2DValidations.rules.SecEnrolEmplContriAmt(input1);
    const output2 = await Type2DValidations.rules.SecEnrolEmplContriAmt(input2);
    const output3 = await Type2DValidations.rules.SecEnrolEmplContriAmt(input3);
    const output4 = await Type2DValidations.rules.SecEnrolEmplContriAmt(input4);

    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID31.35");
    expect(output3.code).toBe("ID31.22");
    expect(output4).toBe(null);
  });

  test("Should pass all validation for SecEnrolMembContriAmt", async () => {
    // Arrage
    const input1 = { secEnrolMembContriAmt: "" };
    const input2 = { secEnrolMembContriAmt: "£123.00" };
    const input3 = { secEnrolMembContriAmt: "123.000" };
    const input4 = { secEnrolMembContriAmt: "123.00" };

    // Act
    const output1 = await Type2DValidations.rules.SecEnrolMembContriAmt(input1);
    const output2 = await Type2DValidations.rules.SecEnrolMembContriAmt(input2);
    const output3 = await Type2DValidations.rules.SecEnrolMembContriAmt(input3);
    const output4 = await Type2DValidations.rules.SecEnrolMembContriAmt(input4);

    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID31.36");
    expect(output3.code).toBe("ID31.23");
    expect(output4).toBe(null);
  });

  test("Should pass all validation for OptoutDeclarationFlag", async () => {
    // Arrage
    const input1 = { optoutDeclarationFlag: "" };
    const input2 = { optoutDeclarationFlag: "a" };
    const input3 = { optoutDeclarationFlag: "Y" };

    // Act
    const output1 = await Type2DValidations.rules.OptoutDeclarationFlag(input1);
    const output2 = await Type2DValidations.rules.OptoutDeclarationFlag(input2);
    const output3 = await Type2DValidations.rules.OptoutDeclarationFlag(input3);
    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID31.20");
    expect(output3).toBe(null);
  });

  test("Should pass all validation for OptoutRefNum", async () => {
    // Arrage
    const input1 = { optoutRefNum: "" };
    const input2 = { optoutRefNum: "123ABC" };
    const input3 = { optoutRefNum: "£$df" };

    // Act
    const output1 = await Type2DValidations.rules.OptoutRefNum(input1);
    const output2 = await Type2DValidations.rules.OptoutRefNum(input2);
    const output3 = await Type2DValidations.rules.OptoutRefNum(input3);
    // Assert
    expect(output1).toBe(null);
    expect(output2).toBe(null);
    expect(output3.code).toBe("ID31.32");
  });

  test("Should pass all validation for EffectiveDatePartialNonPayment", async () => {
    // Arrage
    const input1 = { membNonPayEffDate: "" };
    const input2 = { membNonPayEffDate: "2022-02-30" };
    const input3 = { membNonPayEffDate: "Y2022-02-30" };

    // Act
    const output1 =
      await Type2DValidations.rules.EffectiveDatePartialNonPayment(input1);
    const output2 =
      await Type2DValidations.rules.EffectiveDatePartialNonPayment(input2);
    const output3 =
      await Type2DValidations.rules.EffectiveDatePartialNonPayment(input3);
    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID31.13");
    expect(output3.code).toBe("ID31.13");
  });

  test("Should pass all validation for EffectiveDateChangeGroup", async () => {
    // Arrage
    const input1 = { membChangeOfGroupDate: "" };
    const input2 = { membChangeOfGroupDate: "2022-02-30" };
    const input3 = { membChangeOfGroupDate: "Y2022-02-30" };

    // Act
    const output1 = await Type2DValidations.rules.EffectiveDateChangeGroup(
      input1
    );
    const output2 = await Type2DValidations.rules.EffectiveDateChangeGroup(
      input2
    );
    const output3 = await Type2DValidations.rules.EffectiveDateChangeGroup(
      input3
    );
    // Assert
    expect(output1).toBe(null);
    expect(output2.code).toBe("ID31.15");
    expect(output3.code).toBe("ID31.15");
  });

  test("Should pass all validation for NewPaymentSourceName", async () => {
    // Arrage
    const input1 = { newPaymentSourceName: "" };
    const input2 = { newPaymentSourceName: "123ABC" };
    const input3 = { newPaymentSourceName: "£$df" };

    // Act
    const output1 = await Type2DValidations.rules.NewPaymentSourceName(input1);
    const output2 = await Type2DValidations.rules.NewPaymentSourceName(input2);
    const output3 = await Type2DValidations.rules.NewPaymentSourceName(input3);
    // Assert
    expect(output1).toBe(null);
    expect(output2).toBe(null);
    expect(output3.code).toBe("ID31.14");
  });

  test("Should pass all validation for NewGroupName", async () => {
    // Arrage
    const input1 = { newGroupName: "" };
    const input2 = { newGroupName: "123ABC" };
    const input3 = { newGroupName: "£$df" };

    // Act
    const output1 = await Type2DValidations.rules.NewGroupName(input1);
    const output2 = await Type2DValidations.rules.NewGroupName(input2);
    const output3 = await Type2DValidations.rules.NewGroupName(input3);
    // Assert
    expect(output1).toBe(null);
    expect(output2).toBe(null);
    expect(output3.code).toBe("ID31.16");
  });

  test("Should throw error, when you call start", async () => {
    // Arrage
    const stream = Readable.from(
      `H,column1\nD,column_row1\nD,column_row2\nT,2,3`
    );
    Type2DValidations.executeRulesOneByOne = jest
      .fn()
      .mockImplementation(() => {
        throw new Error("Something went wrong!");
      });
    //Act

    //Assert
    await expect(
      Type2DValidations.start(
        stream,
        context,
        "fbb13972-1527-47de-8c36-7d1a2a469ee8",
        "84c91266-026d-4041-902f-01f4c3fbda93"
      )
    ).rejects.toThrow(Error);
  });

  test("Should return dummy errors, when you call start", async () => {
    // Arrage
    const mockErrors = [
      {
        code: "ID 1",
        message: "Error 1",
        lineNumber: 1,
      },
      {
        code: "ID 2",
        message: "Error 2",
        lineNumber: 2,
      },
    ];
    const fileId = "fbb13972-1527-47de-8c36-7d1a2a469ee8";
    const contributionHeaderId = "84c91266-026d-4041-902f-01f4c3fbda93";
    const stream = Readable.from(
      `H,column1\nD,column_row1\nD,column_row2\nT,2,3`
    );
    Type2DValidations.executeRulesOneByOne = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockErrors));
    const spySaveFileErrDtl = jest.spyOn(
      CommonContributionDetails,
      "saveFileErrorDetails"
    );
    //Act

    //Assert
    await expect(
      Type2DValidations.start(stream, context, fileId, contributionHeaderId)
    ).rejects.toBe(mockErrors);
    expect(spySaveFileErrDtl).toBeCalledTimes(1);
    expect(spySaveFileErrDtl).toBeCalledWith(mockErrors, fileId, "2C");

    Type2DValidations.executeRulesOneByOne = executeRulesOneByOne;
  });

  test("Should return true, when you call start with no errors of executeRulesOneByOne", async () => {
    // Arrage
    const stream = Readable.from(
      `H,column1\nD,column_row1\nD,column_row2\nT,2,3`
    );
    Type2DValidations.executeRulesOneByOne = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));
    //Act

    //Assert
    await expect(
      Type2DValidations.start(
        stream,
        context,
        "fbb13972-1527-47de-8c36-7d1a2a469ee8",
        "84c91266-026d-4041-902f-01f4c3fbda93"
      )
    ).resolves.toBe(true);

    Type2DValidations.executeRulesOneByOne = executeRulesOneByOne;
  });

  test("Should return one error, when executeRulesOneByOne called", async () => {
    // Arrage
    let rules = Type2DValidations.rules;
    for (const key in Type2DValidations.rules) {
      rules[key] = Type2DValidations.rules[key];
      if (key == "PensEarnings") {
        Type2DValidations.rules[key] = jest.fn().mockImplementation(() =>
          Promise.resolve({
            code: "ID25.0",
            message:
              "Please remove invalid characters. The format must be numerical.",
          })
        );
      } else {
        Type2DValidations.rules[key] = jest
          .fn()
          .mockImplementation(() => Promise.resolve(null));
      }
    }
    // No data needed we are testing only execution of executeRulesOneByOne method
    const customRow = {};

    // Act
    const errors = await Type2DValidations.executeRulesOneByOne(
      customRow,
      context,
      []
    );

    // Assert
    expect(errors.length).toBe(1);

    Type2DValidations["rules"] = rules;
  });
});
