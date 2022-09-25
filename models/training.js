const { Schema, model } = require("mongoose");
const Joi = require("joi");

const trainingBookSchema = Schema({
  id_book: {
    type: Schema.Types.ObjectId,
    ref: "book",
    require: true,
  },
  read_pages: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const trainingSchema = Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  start: {
    type: Date,
    require: true,
  },
  finish: {
    type: Date,
    require: true,
  },
  books: {
    type: [trainingBookSchema],
  },
  id_statistics: {
    type: Schema.Types.ObjectId,
    ref: "statistics",
    require: true,
  },
});

const joiSchema = Joi.object({
  id_user: Joi.string(),
  start: Joi.date().required(),
  finish: Joi.date().required(),
  books: Joi.array().items({
    id_book: Joi.string(),
    read_pages: Joi.number().integer(),
    status: Joi.boolean(),
  }),
  id_statistics: Joi.string(),
});

const Training = model("training", trainingSchema);

module.exports = { Training, joiSchema };
