const Place = require("../../database/models/place");
const {
  getAllPlaces,
  getPlaceById,
  createPlace,
} = require("./placesControllers");

jest.mock("../../database/models/place");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const placesArray = [
  {
    id: "6185993022dd92661d3cfca6",
    title: "place1",
    date: "23-11-2021",
    country: "Vietnam",
    images: ["image1", "image2"],
    text: "Vietnam está to flama",
    map: 2154805,
    comments: "",
  },
  {
    id: "6185993022dd92661d3cf5yd",
    title: "place2",
    date: "23-11-2021",
    country: "Eslovaquia",
    images: ["image1", "image2"],
    text: "Eslovaquia mola cantidubi",
    map: 2154865,
    comments: "",
  },
];

describe("Given a getAllPlaces function", () => {
  describe("When it is called", () => {
    test("Then it should respond with the method json", async () => {
      const res = mockResponse();
      const places = placesArray;
      Place.find = jest.fn().mockResolvedValue(places);

      await getAllPlaces(null, res);

      expect(res.json).toHaveBeenCalled();
    });
    test("Then it should respond with a list of places", async () => {
      const res = mockResponse();
      const places = placesArray;
      Place.find = jest.fn().mockResolvedValue(places);

      await getAllPlaces(null, res);

      expect(Place.find).toHaveBeenCalled();
    });
  });
  describe("When it is called and the database connection is not working", () => {
    test("Then it should invoke next with an error message 'Cannot find the places' and a status code 400", async () => {
      const res = mockResponse();
      const next = jest.fn();
      const error = new Error();
      error.code = 400;
      error.message = "Cannot find the places";

      Place.find = jest.fn().mockRejectedValue(new Error());

      await getAllPlaces(null, res, next);

      expect(Place.find).toHaveBeenCalled();
    });
  });
});

describe("Given a getPlaceById function", () => {
  describe("When it receives a request with an id, a response and the database contains places", () => {
    test("Then it should return a place with the method json", async () => {
      const res = mockResponse();
      const places = placesArray;
      const idSearched = "6185993022dd92661d3cfca6";
      const placeSearched = places.find((place) => place.id === idSearched);
      const req = { params: { id: idSearched } };
      Place.findById = jest.fn().mockResolvedValue(placeSearched);

      await getPlaceById(req, res, null);

      expect(Place.findById).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(placeSearched);
    });
  });
  describe("When it receives a request with an id that doesn't match any place in the database", () => {
    test("Then it should call next with an error message 'Place not found' and a status code 404", async () => {
      const res = mockResponse();
      const idSearched = "6185993022dd92661d3cfg";
      const req = { params: { id: idSearched } };
      const error = new Error("Place not found");
      error.code = 404;
      const next = jest.fn();
      Place.findById = jest.fn().mockResolvedValue();

      await getPlaceById(req, res, next);

      expect(Place.findById).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a createPlace function", () => {
  describe("When it receives a request with a body that contains a new place", () => {
    test("Then it should return the new place with the method json", async () => {
      const res = mockResponse();
      const place = {
        id: "6185993022dd92661d3cf5yl",
        title: "place3",
        date: "24-11-2021",
        country: "Kirguistan",
        images: ["image1", "image2"],
        text: "Kirguistan es la repera",
        map: 2154410,
        comments: "",
      };
      const req = { body: place };
      Place.create = jest.fn().mockResolvedValue(place);

      await createPlace(req, res, null);

      expect(Place.create).toHaveBeenCalledWith(place);
      expect(res.json).toHaveBeenCalledWith(place);
    });
  });
  describe("When it receives a request with a body containing anything but the db connection is not working", () => {
    test("Then it should call next with an error message 'Cannot create the place' and a status code 400", async () => {
      const req = { body: "anything" };
      const error = new Error();
      error.code = 400;
      error.message = "Cannot create the place";

      const next = jest.fn();
      Place.create = jest.fn().mockRejectedValue(new Error());

      await createPlace(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
