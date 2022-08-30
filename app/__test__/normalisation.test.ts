import sequelize from "../utils/database";
import { Context } from "@azure/functions";
import app from "../utils/app";
import { CustomError } from "../Errors";
import normalisation from "../utils/normalisation";

jest.mock('sequelize', () => {
    const mSequelize = {
        authenticate: jest.fn(),
        define: jest.fn(),
        transaction: jest.fn(),
    };
    // Static methods
    class Model { }
    Object.assign(Model, {
        init: jest.fn(),
        beforeCreate: jest.fn(),
        findAndCountAll: jest.fn(),
        addHook: jest.fn()
    });
    // Instance methods
    Object.assign(Model.prototype, {});
    const actualSequelize = jest.requireActual('sequelize');
    return {
        Sequelize: jest.fn(() => mSequelize),
        DataTypes: actualSequelize.DataTypes,
        Model: Model
    };
});

import ContributionHeader from "../models/contributionheader";
import StgContrSchedule from "../models/stgcontrschedule";

describe("Test: Normalisation functions", () => {
    let context: Context;
    const fileId = 1;

    beforeEach(() => {
        context = { log: jest.fn() } as unknown as Context;
    });

    afterAll(async () => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test("Should bluk insert ContributionHeader : Success", async () => {
        //Arrage
        const dummyRows = [{ column: "test", column1: "value1" }];

        Object.assign(StgContrSchedule, {
            findAndCountAll: jest.fn().mockImplementation(() => Promise.resolve({
                rows: dummyRows,
                count: 1
            }))
        });

        normalisation.mappingContributionHeader = jest.fn().mockImplementation((rows) => rows);

        ContributionHeader.bulkCreate = jest.fn().mockImplementation((rows) => Promise.resolve(rows));
        //Act
        const transaction = await sequelize.transaction();
        await normalisation.createContributionHeader(context, fileId);

        //Assert
        expect(StgContrSchedule.findAndCountAll).toBeCalled();
        expect(normalisation.mappingContributionHeader).toBeCalledWith(dummyRows);
        expect(ContributionHeader.bulkCreate).toBeCalledWith(dummyRows, {
            validate: true,
            transaction
        });
        expect(context.log).toBeCalledWith("ContributionHeader-> Number Rows going insert : ", dummyRows.length)

    });

    test("Should throw error when ContributionHeader mappingContributionHeader exception", async () => {
        //Arrage
        const dummyRows = [{ column: "test", column1: "value1" }];

        Object.assign(StgContrSchedule, {
            findAndCountAll: jest.fn().mockImplementation(() => Promise.resolve({
                rows: dummyRows,
                count: 1
            }))
        });

        normalisation.mappingContributionHeader = jest.fn().mockImplementation((_rows) => { throw new CustomError("MAPPING_CONTRIBUTION_HEADER_FAILED", { message: "Something" }) });

        ContributionHeader.bulkCreate = jest.fn().mockImplementation((rows) => Promise.resolve(rows));
        //Act
        const transaction = await sequelize.transaction();

        //Assert
        await expect(normalisation.createContributionHeader(context, fileId)).rejects.toThrow(CustomError);
        expect(StgContrSchedule.findAndCountAll).toBeCalled();
    });

    test("Should throw error when ContributionHeader mappingContributionHeader return mismatch rows/empty rows", async () => {
        //Arrage
        const dummyRows = [{ column: "test", column1: "value1" }];

        Object.assign(StgContrSchedule, {
            findAndCountAll: jest.fn().mockImplementation(() => Promise.resolve({
                rows: dummyRows,
                count: 1
            }))
        });

        normalisation.mappingContributionHeader = jest.fn().mockImplementation((_rows) => []);

        ContributionHeader.bulkCreate = jest.fn().mockImplementation((rows, _options) => Promise.resolve(rows));
        //Act
        const transaction = await sequelize.transaction();

        //Assert
        await expect(normalisation.createContributionHeader(context, fileId)).rejects.toThrow(CustomError);
        expect(StgContrSchedule.findAndCountAll).toBeCalled();
        expect(normalisation.mappingContributionHeader).toBeCalledWith(dummyRows);
        expect(ContributionHeader.bulkCreate).toBeCalledTimes(0)
    });

    test("Should throw error when ContributionHeader bulkCreate exception", async () => {
        //Arrage
        const dummyRows = [{ column: "test", column1: "value1" }];

        Object.assign(StgContrSchedule, {
            findAndCountAll: jest.fn().mockImplementation(() => Promise.resolve({
                rows: dummyRows,
                count: 1
            }))
        });

        normalisation.mappingContributionHeader = jest.fn().mockImplementation((rows) => rows);

        ContributionHeader.bulkCreate = jest.fn().mockImplementation((_rows, _options) => Promise.reject("Something went wrong..!"));
        //Act
        const transaction = await sequelize.transaction();

        //Assert
        await expect(normalisation.createContributionHeader(context, fileId)).rejects.toThrow(CustomError);
        expect(StgContrSchedule.findAndCountAll).toBeCalled();
        expect(normalisation.mappingContributionHeader).toBeCalledWith(dummyRows);
        expect(ContributionHeader.bulkCreate).toBeCalled();
    });
});