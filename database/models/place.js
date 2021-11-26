const { Schema, model, Types } = require("mongoose");

const placeSchema = new Schema({
  author: {
    type: Types.ObjectId,
    ref: "user",
    required: true,
  },
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
  images: [
    {
      type: String,
      required: true,
    },
  ],
  text: {
    type: String,
    required: true,
  },
  coordinates: {
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
  },
  comments: {
    type: [Object],
    required: false,
  },
});

const Place = model("place", placeSchema, "places");

module.exports = Place;
