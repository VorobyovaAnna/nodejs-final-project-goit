const { Schema, model } = require("mongoose");
const Joi = require("joi");

const planSchema = Schema({
  date: {
    type: Date,
    require: [true, "Please, enter date!"],
  },
  pages: {
    type: Number,
    require: [true, "Please, write pages you have read!"],
  },
});

const statisticsSchema = Schema({
  booksAmount: {
    type: Number,
    default: 0,
  },
  dayAmount: {
    type: Number,
    default: 0,
  },
  leftBooks: {
    type: Number,
    default: 0,
  },
  plan: {
    type: [planSchema],
  },
  result: {
    type: [planSchema],
  },
});

const joiSchema = Joi.object({
  bookAmount: Joi.number().integer(),
  dayAmount: Joi.number().integer(),
  leftBooks: Joi.number().integer(),
  plan: Joi.array().items({
    date: Joi.date().required(),
    pages: Joi.number().required(),
  }),
  result: Joi.array().items({
    date: Joi.date().required(),
    pages: Joi.number().required(),
  }),
});

const joiResult = Joi.object({
  date: Joi.date().required(),
  pages: Joi.number().required(),
});

const Statistic = model("statistic", statisticsSchema);

module.exports = { Statistic, joiSchema, joiResult };
