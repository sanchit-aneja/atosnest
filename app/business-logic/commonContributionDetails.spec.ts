import { Context } from "@azure/functions";
import { CommonContributionDetails } from "./";
const { Readable } = require("stream")

describe("Test: Business logic common Contribution details functions", () => {
    let context: Context;

    beforeEach(() => {
        context = { log: jest.fn() } as unknown as Context;
    });

    afterAll(async () => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test("Should return DB value, when you call getNonNullValue with new vaule null", async () => {
        //Arrage
        const newVaule = null;
        const dbValue = "SOMETHING";
        //Act
        const value = CommonContributionDetails.getNonNullValue(newVaule, dbValue);

        //Assert
        expect(value).toBe(dbValue);
    });

    test("Should return New value, when you call getNonNullValue with new vaule", async () => {
        //Arrage
        const newVaule = "New Value";
        const dbValue = "SOMETHING";
        //Act
        const value = CommonContributionDetails.getNonNullValue(newVaule, dbValue);

        //Assert
        expect(value).toBe(newVaule);
    });

    test("Should return true, when empty is allow for checking isOnlyAlphanumerical", async () => {
        //Arrage
        const newVaule = "";
        //Act
        const isValid = CommonContributionDetails.isOnlyAlphanumerical(newVaule);

        //Assert
        expect(isValid).toBe(true);
    });
    test("Should return false, when special chars present for checking isOnlyAlphanumerical", async () => {
        //Arrage
        const newVaule = "$d";
        //Act
        const isValid = CommonContributionDetails.isOnlyAlphanumerical(newVaule, false);

        //Assert
        expect(isValid).toBe(false);
    });

    test("Should return false, when empty is not allow for checking isOnlyAlphanumerical", async () => {
        //Arrage
        const newVaule = "";
        //Act
        const isValid = CommonContributionDetails.isOnlyAlphanumerical(newVaule, false);

        //Assert
        expect(isValid).toBe(false);
    });

    test("Should return false, when empty is not allow for checking isOnlyAllowedChars", async () => {
        //Arrage
        const newVaule = "";
        //Act
        const isValid = CommonContributionDetails.isOnlyAllowedChars(newVaule, false);

        //Assert
        expect(isValid).toBe(false);
    });

    test("Should return true, when empty is allow for checking isOnlyAllowedChars", async () => {
        //Arrage
        const newVaule = "";
        //Act
        const isValid = CommonContributionDetails.isOnlyAllowedChars(newVaule, true);

        //Assert
        expect(isValid).toBe(true);
    });

    test("Should return true, when vaild str pass for checking isOnlyAllowedChars", async () => {
        //Arrage
        const newVaule = "ABC$03)(#$%&@=?:";
        //Act
        const isValid = CommonContributionDetails.isOnlyAllowedChars(newVaule, true);

        //Assert
        expect(isValid).toBe(true);
    });

    test("Should return false, when invaild str pass for checking isOnlyAllowedChars", async () => {
        //Arrage
        const newVaule = "ABC!";
        //Act
        const isValid = CommonContributionDetails.isOnlyAllowedChars(newVaule, true);

        //Assert
        expect(isValid).toBe(false);
    });

    test("Should return true, when vaild date and formate on calling isValidateDate", async () => {
        //Arrage
        const newVaule = "2022-10-03";
        //Act
        const isValid = CommonContributionDetails.isValidateDate(newVaule);

        //Assert
        expect(isValid).toBe(true);
    });

    test("Should return false, when invaild date and formate on calling isValidateDate", async () => {
        //Arrage
        const newVaule = "2022-13-03";
        //Act
        const isValid = CommonContributionDetails.isValidateDate(newVaule);

        //Assert
        expect(isValid).toBe(false);
    });

    test("Should return false, when invaild date and vaild formate on calling isValidateDate", async () => {
        //Arrage
        const newVaule = "2022-02-29";
        //Act
        const isValid = CommonContributionDetails.isValidateDate(newVaule);

        //Assert
        expect(isValid).toBe(false);
    });

    test("Should return true, when allow null or empty on calling isValidateDate", async () => {
        //Arrage
        const newVaule = "";
        //Act
        const isValid = CommonContributionDetails.isValidateDate(newVaule);

        //Assert
        expect(isValid).toBe(true);
    });

    test("Should return true, when value is null on calling isNullOrEmpty", async () => {
        //Arrage
        const newVaule = null;
        //Act
        const isValid = CommonContributionDetails.isNullOrEmpty(newVaule);

        //Assert
        expect(isValid).toBe(true);
    });

    test("Should return true, when value is empty on calling isNullOrEmpty", async () => {
        //Arrage
        const newVaule = "";
        //Act
        const isValid = CommonContributionDetails.isNullOrEmpty(newVaule);

        //Assert
        expect(isValid).toBe(true);
    });

    test("Should return true, when value is undefined on calling isNullOrEmpty", async () => {
        //Arrage
        const newVaule = undefined;
        //Act
        const isValid = CommonContributionDetails.isNullOrEmpty(newVaule);

        //Assert
        expect(isValid).toBe(true);
    });

    test("Should return false, when some value present on calling isNullOrEmpty", async () => {
        //Arrage
        const newVaule = "Something here";
        //Act
        const isValid = CommonContributionDetails.isNullOrEmpty(newVaule);

        //Assert
        expect(isValid).toBe(false);
    });

    test("Should return false, when invaild number string passed on calling isVaildNumber", async () => {
        //Arrage
        const newVaule = "NAN";
        //Act
        const isValid = CommonContributionDetails.isVaildNumber(newVaule, true);

        //Assert
        expect(isValid).toBe(false);
    });

    test("Should return true, when vaild number string passed on calling isVaildNumber", async () => {
        //Arrage
        const newVaule = "100.000";
        //Act
        const isValid = CommonContributionDetails.isVaildNumber(newVaule, true);

        //Assert
        expect(isValid).toBe(true);
    });

    test("Should return true, when empty string passed and allowed on calling isVaildNumber", async () => {
        //Arrage
        const newVaule = "";
        //Act
        const isValid = CommonContributionDetails.isVaildNumber(newVaule, true);

        //Assert
        expect(isValid).toBe(true);
    });

    test("Should return true, when empty string passed and allowed on calling isValidDecimals", async () => {
        //Arrage
        const newVaule = "";
        //Act
        const isValid = CommonContributionDetails.isValidDecimals(newVaule,2, true);

        //Assert
        expect(isValid).toBe(true);
    });

    test("Should return false, when empty string passed and not allowed on calling isValidDecimals", async () => {
        //Arrage
        const newVaule = "";
        //Act
        const isValid = CommonContributionDetails.isValidDecimals(newVaule,2, false);

        //Assert
        expect(isValid).toBe(false);
    });

    test("Should return false, when more decimals and not allowed on calling isValidDecimals", async () => {
        //Arrage
        const newVaule = "333.333";
        //Act
        const isValid = CommonContributionDetails.isValidDecimals(newVaule,2, false);

        //Assert
        expect(isValid).toBe(false);
    });


    test("Should return true, when D row", async () => {
        //Arrage
        const newVaule = ['D','Others'];
        //Act
        const isValid = CommonContributionDetails.isRowDValidation(newVaule);

        //Assert
        expect(isValid).toBe(true);
    });

    test("Should return false, when D row", async () => {
        //Arrage
        const newVaule = ['T','2', '3'];
        //Act
        const isValid = CommonContributionDetails.isRowDValidation(newVaule);

        //Assert
        expect(isValid).toBe(false);
    });

    test("Should return membChangeOfGroupDate prop, when addExtraParams is true on calling convertToContributionDetails", async () => {
        //Arrage -- Dummy data
        const mockRow = ['D','1', '2', '3', '4', '5', '6', '7', '8', '2022-09-09', '10', '2022-11-11', '12',
                    '13', '14', '15', '16', 'y', '18', '19', '20'];
        //Act
        const membDetails = CommonContributionDetails.convertToContributionDetails(mockRow, {}, true);

        //Assert
        expect(membDetails.optoutDeclarationFlag).toBe('Y');
        expect(membDetails["membChangeOfGroupDate"]).toBe('2022-11-11')
        expect(membDetails.membNonPayEffDate).toBe('2022-09-09')
    });

    test("Should not return membChangeOfGroupDate prop, when addExtraParams is false on calling convertToContributionDetails", async () => {
        //Arrage -- Dummy data
        const mockRow = ['D','1', '2', '3', '4', '5', '6', '7', '8', '', '10', '2022-11-11', '12',
                    '13', '14', '15', '16', '', '18', '19', '20'];
        //Act
        const membDetails = CommonContributionDetails.convertToContributionDetails(mockRow, {}, false);

        //Assert
        expect(membDetails.optoutDeclarationFlag).toBe(undefined);
        expect(membDetails["membChangeOfGroupDate"]).toBe(undefined);
        expect(membDetails.membNonPayEffDate).toBe('2022-11-11')
    });


    test("Should throw error when calling get only D rows", async ()=> {
        // Arrage
        const stream = null //Readable.from('')
        // Act

        // Assert
        await expect(CommonContributionDetails.getOnlyDRows(stream, context)).rejects.toThrow(TypeError);
    });


    test("Should return 2 D rows when calling get only D rows", async ()=> {
        // Arrage
        const stream = Readable.from(`H,column1\nD,column_row1\nD,column_row2\nT,2,3`);
        // Act
        const rows = await CommonContributionDetails.getOnlyDRows(stream, context);
        // Assert
        expect(rows.length).toBe(2);
        expect(rows[1][1]).toBe('column_row2');
    });


});