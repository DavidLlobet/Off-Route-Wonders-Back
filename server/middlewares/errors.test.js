const { ValidationError } = require("express-validation");
const { notFoundErrorHandler, generalErrorHandler } = require("./errors");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Given a notFoundErrorHandler middleware", () => {
  describe("When it is called", () => {
    test("Then it should send a response with the method json ", () => {
      const res = mockResponse();

      notFoundErrorHandler(null, res);

      expect(res.json).toHaveBeenCalled();
    });
    test("Then it should send a response with a message error 'Endpoint not found' and a status code of 404", () => {
      const res = mockResponse();
      const expectedError = { error: "Endpoint not found" };

      notFoundErrorHandler(null, res);

      expect(res.json).toHaveBeenCalledWith(expectedError);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});

describe("Given a generalErrorHandler middleware", () => {
  describe("When it receives a request and a ValidationError", () => {
    test("Then it should respond with a 'Bad request' message and a status code of 400", () => {
      const res = mockResponse();

      const error = new ValidationError("details", {
        error: new Error(),
        statusCode: 400,
      });

      generalErrorHandler(error, null, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Bad request" });
    });
  });
  describe("When it receives a request and an error with no error code", () => {
    test("Then it should respond with a 'Fatal error' message error and a status code of 500", () => {
      const res = mockResponse();
      const error = { error: "Fatal error" };

      generalErrorHandler(error, null, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});
