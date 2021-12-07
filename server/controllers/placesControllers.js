const Place = require("../../database/models/place");
// eslint-disable-next-line no-unused-vars
const Country = require("../../database/models/country");
// eslint-disable-next-line no-unused-vars
const User = require("../../database/models/user");

const getAllPlaces = async (req, res, next) => {
  try {
    const places = await Place.find().populate(
      "author country",
      "-password -__v"
    );
    res.json(places);
  } catch (error) {
    error.code = 400;
    error.message = "Cannot find the places";
    next(error);
  }
};

const getPlacesByCountry = async (req, res, next) => {
  const { idCountry } = req.params;
  try {
    const places = await Place.find({ country: idCountry }).populate(
      "author country",
      "-password -__v"
    );
    if (places) {
      res.json(places);
    } else {
      const error = new Error("Country not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Cannot find the country";
    next(error);
  }
};

const getPlacesByAuthor = async (req, res, next) => {
  try {
    const searchedPlaces = await Place.find({ author: req.userId }).populate(
      "author country",
      "-password -__v"
    );
    res.json(searchedPlaces);
  } catch (error) {
    error.code = 400;
    error.message = "Cannot find the places";
    next(error);
  }
};

const getPlaceById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id).populate(
      "author country comments",
      "-password -__v"
    );
    if (place) {
      res.json(place);
    } else {
      const error = new Error("Place not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Cannot find the place";
    next(error);
  }
};

const createPlace = async (req, res, next) => {
  try {
    const country = await Country.findOne({ name: req.body.country });

    const user = await User.findById(req.userId);

    const placeCreated = await Place.create({
      ...req.body,
      country: country.id,
      author: user.id,
    });
    user.places.push(placeCreated.id);

    user.save();
    res.json(placeCreated);
  } catch (error) {
    error.code = 400;
    error.message = "Cannot create the place";
    next(error);
  }
};

const updatePlaceById = async ({ body, params }, res, next) => {
  const { id } = params;
  const { country } = body;

  try {
    const getCountry = await Country.findOne({ name: country });
    const placeUpdated = await Place.findByIdAndUpdate(
      id,
      {
        ...body,
        country: getCountry,
      },
      {
        new: true,
        useFindAndModify: false,
      }
    ).populate("author country", "-password -__v");

    if (placeUpdated) {
      res.json(placeUpdated);
    } else {
      const error = new Error("Place to modify not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Cannot update the place";
    next(error);
  }
};

const deletePlaceById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedPlace = await Place.findByIdAndDelete(id);
    if (deletedPlace) {
      res.json(deletedPlace);
    } else {
      const error = new Error("Place to delete not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.message = "Cannot delete the place";
    error.code = 400;
    next(error);
  }
};

module.exports = {
  getAllPlaces,
  getPlacesByCountry,
  getPlacesByAuthor,
  getPlaceById,
  createPlace,
  updatePlaceById,
  deletePlaceById,
};
