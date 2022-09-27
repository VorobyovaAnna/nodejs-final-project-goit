const { Schema, model } = require("mongoose");
const Joi = require("joi");
// const bcrypt = require("bcryptjs");

const regEmail = /^[\w0-9._%+-]+@[\w0-9.-]+\.[a-z]{2,4}$/;

const userSchema = Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: regEmail,
    },
    password: {
      type: String,
      // required: [true, "Set password for user"],
    },
    token: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const joiRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(regEmail),
  password: Joi.string().min(6).required(),
  repeatPassword: Joi.string().required().valid(Joi.ref("password")),
  // token: Joi.string(),
});

const joiLoginSchema = Joi.object({
  email: Joi.string().pattern(regEmail),
  password: Joi.string().min(6).required(),
  token: Joi.string(),
});

const User = model("user", userSchema);

module.exports = {
  User,
  joiRegisterSchema,
  joiLoginSchema,
};
