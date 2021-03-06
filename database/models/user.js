const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  places: {
    type: [Types.ObjectId],
    ref: "place",
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = model("user", userSchema, "users");

module.exports = User;
