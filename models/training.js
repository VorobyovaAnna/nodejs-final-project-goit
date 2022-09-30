const { Schema, model } = require("mongoose");
const Joi = require("joi");

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
  books: [
    {
      book: {
        type: Schema.Types.ObjectId,
        ref: "book",
        require: true,
      },
      leftPages: {
        type: Number,
        default: 0,
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
  ],
  statistics: {
    type: Schema.Types.ObjectId,
    ref: "statistics",
    require: true,
  },
});

const joiSchema = Joi.object({
  start: Joi.date().required(),
  finish: Joi.date().required(),
  books: Joi.array().items({
    book: Joi.string(),
    leftPages: Joi.number().integer(),
    status: Joi.boolean(),
  }),
  statistics: Joi.string(),
});
const joiSchemaAddTraining = Joi.object({
  start: Joi.date().required(),
  finish: Joi.date().required(),
  books: Joi.array().items(Joi.string()),
  statistics: Joi.string(),
});

const Training = model("training", trainingSchema);

module.exports = { Training, joiSchema, joiSchemaAddTraining };
