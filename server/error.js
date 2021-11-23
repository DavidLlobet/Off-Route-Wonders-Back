const debug = require("debug")("robots:errors");
const { ValidationError } = require("express-validation");

const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
};

const generalErrorHandler = (error, req, res) => {
  if (error instanceof ValidationError) {
    debug("Ha ocurrido un error: ", error.message);
    error.code = 400;
    error.message = "Evil request";
  }
  const message = error.code ? error.message : "Fatal error";
  res.status(error.code || 500).json({ error: message });
};

module.exports = {
  notFoundErrorHandler,
  generalErrorHandler,
};
