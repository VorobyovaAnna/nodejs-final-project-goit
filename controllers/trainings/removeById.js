const { Training } = require("../../models");
const { NotFound } = require("http-errors");

const removeById = async (req, res) => {
  const { id } = req.user;
  const { trainingId } = req.params;
  const training = await Training.findOneAndRemove({
    _id: trainingId,
    user: id,
  });
  if (!training) {
    throw NotFound(`Book with id=${trainingId} not found!`);
  }
  res.json({
    message: "Success",
    code: 200,
    data: {
      training,
    },
  });
};

module.exports = removeById;
