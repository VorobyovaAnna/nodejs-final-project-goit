const { Schema, model } = require("mongoose");
const Joi = require("joi");

const trainingBookSchema = Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: "book",
    require: true,
  },
  readPages: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const trainingSchema = Schema({
  user: {
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
  statistics: {
    type: Schema.Types.ObjectId,
    ref: "statistics",
    require: true,
  },
});

const joiSchema = Joi.object({
  user: Joi.string(),
  start: Joi.date().required(),
  finish: Joi.date().required(),
  books: Joi.array().items({
    book: Joi.string(),
    readPages: Joi.number().integer(),
    status: Joi.boolean(),
  }),
  statistics: Joi.string(),
});
const joiSchemaAddTraining = Joi.object({
  user: Joi.string(),
  start: Joi.date().required(),
  finish: Joi.date().required(),
  books: Joi.array().items(Joi.string()),
  statistics: Joi.string(),
});

const Training = model("training", trainingSchema);

module.exports = { Training, joiSchema, joiSchemaAddTraining };
