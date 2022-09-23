const { User } = require("../../models");
const { Conflict } = require("http-errors");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { email, password, name } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`User with ${email} already exist`);
  }
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  await User.create({
    name,
    email,
    password: hashPassword,
  });
  res.status(201).json({
    message: "success",
    code: 201,
    data: {
      user: {
        email,
        name,
      },
    },
  });
};

module.exports = register;
