const Place = require("../../database/models/place");
// eslint-disable-next-line no-unused-vars
const Country = require("../../database/models/country");
// eslint-disable-next-line no-unused-vars
const Comment = require("../../database/models/comment");
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
      "author country comment",
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
    const placeCreated = await Place.create(req.body);
    const user = User.findById(req.userId);
    user.places.push(placeCreated.id);
    user.save();
    res.json(placeCreated);
  } catch (error) {
    error.code = 400;
    error.message = "Cannot create the place";
    next(error);
  }
};

const updatePlaceById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const placeUpdated = await Place.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("author country", "-password -__v")
      .populate({
        path: "comments",
        populate: [{ path: "author", select: "username" }],
      });

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
