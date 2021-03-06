const jwt = require("jsonwebtoken");
const auth = require("./auth");

jest.mock("jsonwebtoken");

describe("Given an auth middleware", () => {
  describe("When it receives a request with an incorrect Authorization header", () => {
    test("Then it should send an error with message 'You are not authorized' and status 401", () => {
      const req = {
        header: jest.fn(),
      };
      const res = {};
      const next = jest.fn();
      const expectedError = new Error("You are not authorized");

      auth(req, res, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });
  describe("When it gets a request with a Authorization header but without a token", () => {
    test("Then it should send an error with a message 'Token is missing' and status 401", () => {
      const authHeader = "dada";

      const req = {
        header: jest.fn().mockReturnValue(authHeader),
      };

      const res = {};
      const next = jest.fn();
      const expectedError = new Error("Token is missing");

      auth(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
  describe("When it gets a request with aN Authorization header and an incorrect token", () => {
    test("Then it should send an error with a message 'Token no valid' and status 401", async () => {
      const req = {
        json: jest.fn(),
        header: jest.fn().mockReturnValue("Bearer token"),
      };

      const next = jest.fn();
      const errorSent = new Error("Token no valid");
      errorSent.code = 401;

      const error = new Error();

      const res = {};

      jwt.verify = jest.fn().mockReturnValue(error);
      await auth(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
