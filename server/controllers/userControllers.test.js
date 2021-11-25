require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");
const { userLogin, userSignUp, getUserById } = require("./userControllers");

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const usersArray = [
  {
    id: "6185993022dd92661d3cfca6",
    username: "user1",
    password: "user1",
  },
  {
    id: "6185993022dd92661d3cf5yd",
    username: "user2",
    password: "user2",
  },
];

describe("Given a userLogin function", () => {
  describe("When it receives a request with an incorrect username", () => {
    test("Then it should invoke a next function with an error", async () => {
      const usernameTest = "Mario";
      const req = {
        body: {
          username: usernameTest,
        },
      };
      const res = {};

      User.findOne = jest.fn().mockResolvedValue(false);
      const error = new Error("Wrong credentials");
      error.code = 401;
      const next = jest.fn();

      await userLogin(req, res, next);

      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
  describe("When it receives a request with a correct username and an incorrect password", () => {
    test("Then it should invoke a next function with an error", async () => {
      const req = {
        body: {
          username: "Buleano",
          password: "Wrong password",
        },
      };
      const res = {};
      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue({
        username: "Buleano",
        password: "Buleano",
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const error = new Error("Wrong password");
      error.code = 401;

      await userLogin(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
  describe("When it receives a request with a correct username and password", () => {
    test("Then it should respond with the method json and an object containing a token", async () => {
      const req = {
        body: {
          username: "Buleano",
          password: "Wrong password",
        },
      };
      const res = {
        json: jest.fn(),
      };
      User.findOne = jest.fn().mockResolvedValue({
        username: "Buleano",
        password: "Buleano",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      const expectedToken = "mano";
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      const expectedResponse = {
        token: expectedToken,
      };

      await userLogin(req, res);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});

describe("Given a userSignUp function", () => {
  describe("When it receives a request with an existing username", () => {
    test("Then it should invoke a next function with an error message 'Username already taken' and a status code 400", async () => {
      const usernameTest = "Mario";
      const req = {
        body: {
          username: usernameTest,
        },
      };
      const res = {};
      User.findOne = jest.fn().mockResolvedValue(true);
      const error = new Error("Username already taken");
      error.code = 400;
      const next = jest.fn();

      await userSignUp(req, res, next);

      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
  describe("When it receives a request with a new username", () => {
    test("Then it should respond with a 200 status", async () => {
      const userTest = {
        username: "Mario",
        password: "Ahí e'tá er tío",
      };
      const req = {
        body: userTest,
      };
      const res = mockResponse();
      User.findOne = jest.fn().mockResolvedValue(false);

      await userSignUp(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

describe("Given a getUserById function", () => {
  describe("When it receives a request with an id, a response and the database contains a user", () => {
    test("Then it should return a user with the method json", async () => {
      const res = mockResponse();
      const users = usersArray;
      const idSearched = "6185993022dd92661d3cfca6";
      const userSearched = users.find((user) => user.id === idSearched);
      const req = { params: { id: idSearched } };
      User.findById = jest.fn().mockResolvedValue(userSearched);

      await getUserById(req, res, null);

      expect(User.findById).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(userSearched);
    });
  });
  describe("When it receives a request with an id that doesn't match any user in the database", () => {
    test("Then it should call next with an error message 'User not found' and a status code 404", async () => {
      const res = mockResponse();
      const idSearched = "6185993022dd92661d3cfg";
      const req = { params: { id: idSearched } };
      const error = new Error("User not found");
      error.code = 404;
      const next = jest.fn();
      User.findById = jest.fn().mockResolvedValue();

      await getUserById(req, res, next);

      expect(User.findById).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe("When it receives a request with an id but the db connection is not working", () => {
    test("Then it should call next with an error message 'Bad request' and a status code 400", async () => {
      const idSearched = "6185993022dd92661d3cfg";
      const req = { params: { id: idSearched } };
      const error = new Error("Bad request");
      error.code = 400;
      const next = jest.fn();
      User.findById = jest.fn().mockRejectedValue(new Error());

      await getUserById(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
