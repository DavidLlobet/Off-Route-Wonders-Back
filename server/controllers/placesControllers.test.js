const Place = require("../../database/models/place");
const { getAllPlaces } = require("./placesControllers");

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

describe("Given a getAllPlaces controller", () => {
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
});
