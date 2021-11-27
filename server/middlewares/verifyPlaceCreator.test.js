const verifyPlaceCreator = require("./verifyPlaceCreator");
const Place = require("../../database/models/place");

describe("Given a verifyPlaceCreator middleware function", () => {
  describe("When it receives a request and the logged user id is the same as the place id", () => {
    test("Then it should call a next function", async () => {
      const req = jest.fn();
      const res = {};
      req.params = { id: 123456789 };
      req.userId = "1111";
      const next = jest.fn();
      Place.findById = jest.fn().mockResolvedValue({ author: "1111" });

      await verifyPlaceCreator(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
  describe("When it receives a request and the logged user id is not the same as the place id", () => {
    test("Then it should call a next function with an error", async () => {
      const req = jest.fn();
      const res = {};
      req.params = { id: 123456789 };
      req.userId = "1111";
      const next = jest.fn();
      Place.findById = jest.fn().mockResolvedValue({ author: "2222" });
      const error = new Error("User not allowed");

      await verifyPlaceCreator(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", 401);
    });
  });
  describe("When it receives a request and the id of the place doesn't exits", () => {
    test("Then it should call a next function with an error", async () => {
      const req = jest.fn();
      req.params = { id: 123456789 };
      req.userId = "1111";
      const next = jest.fn();
      const error = new Error("Cannot search the place");
      error.code = 400;
      Place.findById = jest.fn().mockRejectedValue(error);

      await verifyPlaceCreator(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
    });
  });
});
