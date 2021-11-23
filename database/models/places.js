const { Schema, model } = require("mongoose");

const placeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  country: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  map: {
    type: [Number],
    required: true,
  },
  comments: {
    type: [Object],
    required: false,
  },
});

const Place = model("place", placeSchema, "places");

module.exports = Place;
