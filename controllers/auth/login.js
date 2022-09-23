const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const { Unauthorized } = require("http-errors");
const bcrypt = require("bcryptjs");
const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized(`Email or password is wrong or email isn't verify`);
  }

  const passCompare = bcrypt.compareSync(password, user.password);
  if (!passCompare) {
    throw new Unauthorized(`Password is wrong`);
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });
  const { name } = user;
  res.status(200).json({
    message: "success",
    code: 200,
    data: {
      token,
      user: {
        name,
        email,
      },
    },
  });
};

module.exports = login;
