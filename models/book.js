const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const bookSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  title: {
    type: String,
    default: "none",
  },
  author: {
    type: String,
    default: "none",
  },
  publication: {
    type: String,
    required: [true, "Please, write publication year!"],
  },
  pages: {
    type: Number,
    required: [true, "Please, write pages in a book!"],
  },
  status: {
    type: String,
    enum: ["plan", "already", "now"],
    default: "plan",
  },
  rating: {
    type: Number,
  },
  resume: {
    type: String,
  },
});

const joiSchema = Joi.object({
  user: Joi.string(),
  title: Joi.string(),
  author: Joi.string(),
  publication: Joi.string().length(4).pattern(/^\d+$/).required(),
  pages: Joi.number().integer().required(),
  status: Joi.string().valid("plan", "already", "now"),
  rating: Joi.number(),
  resume: Joi.string(),
});

const joiSchemaReviews = Joi.object({
  rating: Joi.number(),
  resume: Joi.string(),
});

const Book = model("book", bookSchema);

module.exports = { Book, joiSchema, joiSchemaReviews };
