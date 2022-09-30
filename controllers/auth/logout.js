const { User } = require("../../models");

const logout = async (req, res) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: null });
  res.status(204).json({ message: "Logout is successful" });
};

module.exports = logout;
