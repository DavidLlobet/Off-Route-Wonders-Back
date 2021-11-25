const mongoose = require("mongoose");
const supertest = require("supertest");
const { initializeServer, app } = require("..");
const connectDB = require("../../database");
const Place = require("../../database/models/place");

const request = supertest(app);
let server;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOWY1ZTAxNmNiNTI3NTNkYjBhNGQ4MCIsInVzZXJuYW1lIjoiQnVsZWFubyIsImlhdCI6MTYzNzg0NDMxNywiZXhwIjoxNjM4MTAzNTE3fQ.3w-m1EE4n4vRBUyZtWrWhVnduK3r3ANGwfIKyeui4Pc";
let newPlace1;
let newPlace2;

beforeAll(async () => {
  await connectDB(process.env.MONGODB_STRING_TESTING);
  server = await initializeServer(6000);
  await Place.deleteMany();
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.connection.close();
    done();
  });
});

beforeEach(async () => {
  newPlace1 = await Place.create({
    id: "6185993022dd92661d3cfca6",
    title: "place1",
    date: 23 - 11 - 2021,
    country: "Vietnam",
    images: ["image1", "image2"],
    text: "Vietnam está to flama",
    map: [2154805],
    comments: "",
  });
  newPlace2 = await Place.create({
    id: "6185993022dd92661d3cf5yd",
    title: "place2",
    date: 23 - 11 - 2021,
    country: "Eslovaquia",
    images: ["image1", "image2"],
    text: "Eslovaquia mola cantidubi",
    map: 2154865,
    comments: "",
  });
});

afterEach(async () => {
  await Place.deleteMany();
});

describe("Given a /places route", () => {
  describe("When it receives a get request", () => {
    test("Then it should respond with a list of places", async () => {
      const response = await request.get("/places").expect(200);

      expect(response.body[0]).toHaveProperty("title", newPlace1.title);
      expect(response.body[1]).toHaveProperty("title", newPlace2.title);
    });
  });
});

describe("Given a /places/country/:country route", () => {
  describe("When it receives a get request", () => {
    test("Then it should respond with a list of places by country", async () => {
      const response = await request.get("/places/country/Vietnam").expect(200);

      expect(response.body[0]).toHaveProperty("title", newPlace1.title);
    });
  });
});

describe("Given a /places/:id route", () => {
  describe("When it receives a get request", () => {
    test("Then it should respond with a place", async () => {
      const response = await request.get(`/places/${newPlace2.id}`).expect(200);

      expect(response.body).toHaveProperty("title", newPlace2.title);
    });
  });
});

describe("Given a /places/create route", () => {
  describe("When it receives a post request with a new place", () => {
    test("Then it should respond with the created place", async () => {
      const newPlace = {
        id: "6185993022dd92661d3cf5yj",
        title: "place3",
        date: 23 - 11 - 2021,
        country: "Canadá",
        images: ["image1", "image2"],
        text: "En Canadá hace frío",
        map: 2155565,
        comments: "",
      };
      const response = await request
        .post("/places/create")
        .set("Authorization", `Bearer ${token}`)
        .send(newPlace)
        .expect(200);

      expect(response.body).toHaveProperty("title", newPlace.title);
    });
  });
});

describe("Given a /places/update/:id route", () => {
  describe("When it receives a put request", () => {
    test("Then it should respond with a modified place", async () => {
      const modifiedPlace = {
        id: "6185993022dd92661d3cf5yd",
        title: "place2",
        date: 24 - 11 - 2021,
        country: "Eslovaquia",
        images: ["image1", "image2", "image3"],
        text: "Eslovaquia mola bastante",
        map: 2154865,
        comments: "",
      };
      const response = await request
        .put(`/places/update/${newPlace2.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(modifiedPlace)
        .expect(200);

      expect(response.body.title).toBe(modifiedPlace.title);
    });
  });
  describe("When it receives a put request with a place without id", () => {
    test("Then it should respond with an error", async () => {
      const response = await request
        .put("/places/update/618d661e12068ghgkjhg7524fd0a")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(response.body).toHaveProperty("error", "Cannot update the place");
    });
  });
  describe("When it receives a put request with a wrong place id", () => {
    test("Then it should respond with an error", async () => {
      const modifiedPlace = {
        id: "6185993022dd92661d3cf5yd",
        title: "place2",
        date: 24 - 11 - 2021,
        country: "Eslovaquia",
        images: ["image1", "image2", "image3"],
        text: "Eslovaquia mola bastante",
        map: 2154865,
        comments: "",
      };
      const response = await request
        .put("/places/update/618d661e120687524fd0ab11")
        .set("Authorization", `Bearer ${token}`)
        .send(modifiedPlace)
        .expect(404);

      expect(response.body).toHaveProperty(
        "error",
        "Place to modify not found"
      );
    });
  });
});

describe("Given a /places/delete/:id", () => {
  describe("When it receives a delete request with a place id", () => {
    test("Then it should respond with the deleted place", async () => {
      const response = await request
        .delete(`/places/delete/${newPlace1.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(response.body).toHaveProperty("title", newPlace1.title);
    });
  });
  describe("When it receives a delete request with a place without id", () => {
    test("Then it should respond with an error", async () => {
      const response = await request
        .delete("/places/delete/cielo")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(response.body).toHaveProperty("error", "Cannot delete the place");
    });
  });
  describe("When it receives a delete request with a wrong place id", () => {
    test("Then it should respond with an error", async () => {
      const response = await request
        .delete("/places/delete/618d661e120687524fd0ab11")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty(
        "error",
        "Place to delete not found"
      );
    });
  });
});
