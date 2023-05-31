const { NotFoundError } = require("../errors");
const ApplicationController = require("./ApplicationController");

// Create instance of ApplicationController
const appController = new ApplicationController();

// Mock request and response objects
const reqMock = { method: "GET", url: "/test" };
const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

// Mock error and next function
const errorMock = new Error("Test error");
const nextMock = jest.fn();

describe("ApplicationController", () => {
    describe("handleGetRoot", () => {
        test("should respond with status 200 and message", () => {
            // Call the handler
            appController.handleGetRoot(reqMock, resMock);

            // Check the response
            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                status: "OK",
                message: "BCR API is up and running!",
            });
        });
    });

    describe("handleNotFound", () => {
        test("should respond with status 404 and error message", () => {
            const reqMock = {};
            const resMock = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const controller = new ApplicationController();

            controller.handleNotFound(reqMock, resMock);

            expect(resMock.status).toHaveBeenCalledWith(404);
            expect(resMock.json).toHaveBeenCalledWith({
                error: {
                    name: "Error",
                    message: "Not found!",
                    details: {
                        method: undefined,
                        url: undefined,
                    },
                },
            });
        });
    });

    describe("handleError", () => {
        test("should respond with status 500 and error message", () => {
            // Call the handler
            appController.handleError(errorMock, reqMock, resMock, nextMock);

            // Check the response
            expect(resMock.status).toHaveBeenCalledWith(500);
            expect(resMock.json).toHaveBeenCalledWith({
                error: {
                    name: errorMock.name,
                    message: errorMock.message,
                    details: null,
                },
            });
        });
    });

    describe("getOffsetFromRequest", () => {
        test("should return the offset value from request query", () => {
            const req = { query: { page: 2, pageSize: 10 } };
            const offset = appController.getOffsetFromRequest(req);
            expect(offset).toBe(10);
        });

        test("should default to page 1 and pageSize 10 if not provided", () => {
            const req = { query: {} };
            const offset = appController.getOffsetFromRequest(req);
            expect(offset).toBe(0);
        });
    });

    describe("buildPaginationObject", () => {
        test("should build pagination object from request query and count", () => {
            const req = { query: { page: 2, pageSize: 10 } };
            const count = 25;
            const pagination = appController.buildPaginationObject(req, count);
            expect(pagination).toEqual({
                page: 2,
                pageCount: 3,
                pageSize: 10,
                count: 25,
            });
        });
    });
});
