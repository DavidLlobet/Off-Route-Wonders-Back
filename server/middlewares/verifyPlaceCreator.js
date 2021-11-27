const Place = require("../../database/models/place");

const verifyPlaceCreator = async (req, res, next) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id);
    if (`${place.author}` === req.userId) {
      return next();
    }
    const error = new Error("User not allowed");
    error.code = 401;
    next(error);
  } catch (error) {
    error.message = "Cannot search the place";
    error.code = 400;
    next(error);
  }
};

module.exports = verifyPlaceCreator;
