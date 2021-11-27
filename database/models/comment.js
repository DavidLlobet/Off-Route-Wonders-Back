const { Schema, model, Types } = require("mongoose");

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Comment = model("comment", commentSchema, "comments");

module.exports = Comment;
