const { Schema, model } = require("mongoose");

const countrySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Country = model("country", countrySchema, "countries");

module.exports = Country;
