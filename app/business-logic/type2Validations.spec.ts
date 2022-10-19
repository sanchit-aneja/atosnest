import { Context } from "@azure/functions";
import _ from "lodash";
import { Type2Validations } from ".";
const { Readable } = require("stream");
import { headerGetSuccessResponse } from "../__test__/mock/headerSearchResponse";

describe("Test: Business logic for validation of type 2A and 2b", () => {
    let context: Context;
    const executeRulesOneByOne = Type2Validations.executeRulesOneByOne;

    beforeEach(() => {
        context = { log: jest.fn() } as unknown as Context;
    });

    afterAll(async () => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });


    test("Should pass all validation for Employer Reference Number",async () => {
        // Arrage
        const input1 = {employerReferenceNumber: ""}
        const input2 = {employerReferenceNumber: "000073100"}
        const input3 = {employerReferenceNumber: "EMPsakfjgns"}
        const input4 = {employerReferenceNumber: "EMP000073100"}

        // Act
        const output1 = await Type2Validations.rulesType2B.EmployerReferenceNumber(input1)
        const output2 = await Type2Validations.rulesType2B.EmployerReferenceNumber(input2)
        const output3 = await Type2Validations.rulesType2B.EmployerReferenceNumber(input3)
        const output4 = await Type2Validations.rulesType2B.EmployerReferenceNumber(input4)
        // Assert
        
        expect(output1.code).toBe("ID10.0")
        expect(output2.code).toBe("ID13.0")
        expect(output3.code).toBe("ID13.0")
        expect(output4).toBe(null)
    })


    test("Should pass all validation for processType",async () => {
        // Arrage
        const input1 = {processType: ""}
        const input2 = {processType: "AB"}
        const input3 = {processType: "124"}
        const input4 = {processType: "CS"}

        // Act
        const output1 = await Type2Validations.rulesType2B.ProcessType(input1)
        const output2 = await Type2Validations.rulesType2B.ProcessType(input2)
        const output3 = await Type2Validations.rulesType2B.ProcessType(input3)
        const output4 = await Type2Validations.rulesType2B.ProcessType(input4)
        // Assert
        expect(output1.code).toBe("ID10.1")
        expect(output2.code).toBe("ID13.1")
        expect(output3.code).toBe("ID13.1")
        expect(output4).toBe(null)
    })

    test("Should pass all validation for Earnings Period End Date ",async () => {
        // Arrage
        const input1 = {earningPeriodEndDate: ""}
        const input2 = {earningPeriodEndDate: "144"}
        const input3 = {earningPeriodEndDate: "21-05-2022"}
        const input4 = {earningPeriodEndDate: "2022-05-21"}

        // Act
        const output1 = await Type2Validations.rulesType2B.EarningsPeriodEndDate(input1)
        const output2 = await Type2Validations.rulesType2B.EarningsPeriodEndDate(input2)
        const output3 = await Type2Validations.rulesType2B.EarningsPeriodEndDate(input3)
        const output4 = await Type2Validations.rulesType2B.EarningsPeriodEndDate(input4)
        // Assert
        expect(output1.code).toBe("ID10.2")
        expect(output2.code).toBe("ID13.2")
        expect(output3.code).toBe("ID13.2")
        expect(output4).toBe(null)
    })


    test("Should pass all validation for Payment Source",async () => {
        // Arrage
        const input1 = {paymentSource: ""}
        const input2 = {paymentSource: "23jr"}
        const input3 = {paymentSource: "#123.000"}
        const input4 = {paymentSource: "Test"}

        // Act
        const output1 = await Type2Validations.rulesType2B.PaymentSource(input1)
        const output2 = await Type2Validations.rulesType2B.PaymentSource(input2)
        const output3 = await Type2Validations.rulesType2B.PaymentSource(input3)
        const output4 = await Type2Validations.rulesType2B.PaymentSource(input4)
        // Assert
        expect(output1.code).toBe("ID10.3")
        expect(output2).toBe(null)
        expect(output3.code).toBe("ID13.3")
        expect(output4).toBe(null)
    })

    test("Should pass all validation for Pay Period Frequency",async () => {
        // Arrage
        const input1 = {payPeriodFrequency: ""}
        const input2 = {payPeriodFrequency: "134"}
        const input3 = {payPeriodFrequency: "yearly"}
        const input4 = {payPeriodFrequency: "weekly"}

        // Act
        const output1 = await Type2Validations.rulesType2B.PayPeriodFrequency(input1)
        const output2 = await Type2Validations.rulesType2B.PayPeriodFrequency(input2)
        const output3 = await Type2Validations.rulesType2B.PayPeriodFrequency(input3)
        const output4 = await Type2Validations.rulesType2B.PayPeriodFrequency(input4)
        // Assert
        expect(output1.code).toBe("ID10.4")
        expect(output2.code).toBe("ID13.4")
        expect(output3.code).toBe("ID13.4")
        expect(output4).toBe(null)
    })

    test("Should pass all validation for Payment Due date ",async () => {
        // Arrage
        const input1 = {paymentDueDate: ""}
        const input2 = {paymentDueDate: "£123.00"}
        const input3 = {paymentDueDate: "25-09-2022"}
        const input4 = {paymentDueDate: "2022-09-25"}

        // Act
        const output1 = await Type2Validations.rulesType2B.PaymentDueDate(input1)
        const output2 = await Type2Validations.rulesType2B.PaymentDueDate(input2)
        const output3 = await Type2Validations.rulesType2B.PaymentDueDate(input3)
        const output4 = await Type2Validations.rulesType2B.PaymentDueDate(input4)
        // Assert
        expect(output1).toBe(null)
        expect(output2.code).toBe("ID14.3")
        expect(output3.code).toBe("ID14.3")
        expect(output4).toBe(null)
    })

    test("Should pass all validation for EPSD",async () => {
        // Arrage
        const input1 = {earningPeriodEndDate: "", earningPeriodStartDate: ""}
        const input2 = {earningPeriodEndDate: "2022-05-09", earningPeriodStartDate: "2022-06-05"}
        const input3 = {earningPeriodEndDate: "09-05-2022", earningPeriodStartDate: "09-04-2022"}
        const input4 = {earningPeriodEndDate: "2022-05-05", earningPeriodStartDate: "2022-04-08"}

        // Act
        const output1 = await Type2Validations.rulesType2B.EarningsPeriodStartDate(input1)
        const output2 = await Type2Validations.rulesType2B.EarningsPeriodStartDate(input2)
        const output3 = await Type2Validations.rulesType2B.EarningsPeriodStartDate(input3)
        const output4 = await Type2Validations.rulesType2B.EarningsPeriodStartDate(input4)

        // Assert
        expect(output1).toBe(null)
        expect(output2.code).toBe("ID12.4")
        expect(output3.code).toBe("ID14.4")
        expect(output4).toBe(null)
    })

    test("Should pass all validation for BulkUpdateToNoContributionsDue",async () => {
        // Arrage
        const input1 = {bulkUpdateToNoContributionsDue: ""}
        const input2 = {bulkUpdateToNoContributionsDue: "N"}
        const input3 = {bulkUpdateToNoContributionsDue: "asf"}
        const input4 = {bulkUpdateToNoContributionsDue: "Y"}

        // Act
        const output1 = await Type2Validations.rulesType2B.BulkUpdateToNoContributionsDue(input1)
        const output2 = await Type2Validations.rulesType2B.BulkUpdateToNoContributionsDue(input2)
        const output3 = await Type2Validations.rulesType2B.BulkUpdateToNoContributionsDue(input3)
        const output4 = await Type2Validations.rulesType2B.BulkUpdateToNoContributionsDue(input4)

        // Assert
        expect(output1).toBe(null)
        expect(output2).toBe(null)
        expect(output3.code).toBe("ID14.2")
        expect(output4).toBe(null)
    })

    test("Should pass all the validation for get Header records", async()=>{
        const input1 = {
            employerReferenceNumber: "A123",
            processType: "CS",
            earningPeriodEndDate: "2022-02-19",
            paymentSource: "paymentSourceName",
            payPeriodFrequency: "Monthly",
            paymentDueDate: "2022-02-28",
            earningPeriodStartDate: "2022-01-20",
            bulkUpdateToNoContributionsDue: "N",
          };
          const input2 = {
            employerReferenceNumber: "A1234",
            processType: "CS",
            earningPeriodEndDate: "2022-02-19",
            paymentSource: "paymentSourceName",
            payPeriodFrequency: "Monthly",
            paymentDueDate: "2022-02-28",
            earningPeriodStartDate: "2022-01-20",
            bulkUpdateToNoContributionsDue: "N",
          };

        
        const output1 = await Type2Validations.getHeaderRecords(input1);
        const isEquals1 = _.isEqual(output1[0]['dataValues'], headerGetSuccessResponse )
        const output2 = await Type2Validations.getHeaderRecords(input2);
        
        expect(isEquals1).toBe(true)
        expect(output2.length).toBe(0)
    })


    test("Should throw error, when you call start", async () => {
        // Arrage
        const stream = Readable.from(`H,column1\nD,column_row1\nD,column_row2\nT,2,3`);
        Type2Validations.executeRulesOneByOne = jest.fn().mockImplementation(()=> {throw new Error("Something went wrong!");})
        //Act

        //Assert
        await expect(Type2Validations.start(stream, context)).rejects.toThrow(Error);
    })

    test("Should return dummy errors, when you call start", async () => {
        // Arrage
        const mockErrors = [{
            code: "ID 1",
            message: "Error 1"
        },
        {
            code: "ID 2",
            message: "Error 2"
        }]
        const stream = Readable.from(`H,column1\nD,column_row1\nD,column_row2\nT,2,3`);
        Type2Validations.executeRulesOneByOne = jest.fn().mockImplementation(()=> Promise.resolve(mockErrors))
        //Act

        //Assert
        await expect(Type2Validations.start(stream, context)).rejects.toBe(mockErrors);
        
        Type2Validations.executeRulesOneByOne = executeRulesOneByOne;
    })

    test("Should return true, when you call start with no errors of executerulesType2BOneByOne", async () => {
        // Arrage
        const stream = Readable.from(`H,column1\nD,column_row1\nD,column_row2\nT,2,3`);
        Type2Validations.executeRulesOneByOne = jest.fn().mockImplementation(()=> Promise.resolve([]))
        //Act

        //Assert
        await expect(Type2Validations.start(stream, context)).resolves.toBe(true);

        
        Type2Validations.executeRulesOneByOne = executeRulesOneByOne;
    })

});