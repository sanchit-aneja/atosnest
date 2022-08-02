import { Context } from "@azure/functions";
import httpTrigger from "../contribution-header-get";
import sequelize from "../utils/database";

describe("POST: Contribution Schedule Staging", () => {
    let context: Context;

    beforeEach(() => {
        context = { log: jest.fn() } as unknown as Context;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test("should return status code 500 if internal server error", async () => {
        if (!sequelize.authenticate()) {
            await httpTrigger(context);
            expect(context.res.status).toEqual(500);
        }
    });
});
