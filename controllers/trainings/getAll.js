const { Training } = require("../../models");

const getAll = async (req, res) => {
  const { id } = req.user;
  const training = await Training.find({ user: id }).populate(
    "user",
    "_id name email"
  );

  res.status(200).json({
    message: "Success",
    code: 200,
    data: {
      training,
    },
  });
};

module.exports = getAll;
