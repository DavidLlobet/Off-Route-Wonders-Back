const Place = require("../../database/models/place");

const getAllPlaces = async (req, res, next) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    error.code = 400;
    error.message = "Cannot find the wonders";
    next(error);
  }
};

const getPlacesByCountry = async (req, res, next) => {
  const { country } = req.params;
  try {
    const searchedCountry = await Place.findOne(country);
    if (searchedCountry) {
      res.json(searchedCountry);
    } else {
      const error = new Error("Country not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

const getPlaceById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id);
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
    });
    res.json(placeUpdated);
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
      const error = new Error("Wonder to delete not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.message = "Cannot delete Wonder";
    error.code = 400;
    next(error);
  }
};

module.exports = {
  getAllPlaces,
  getPlacesByCountry,
  getPlaceById,
  createPlace,
  updatePlaceById,
  deletePlaceById,
};
