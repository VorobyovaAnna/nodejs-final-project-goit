const { Statistic } = require("../../models");
const { NotFound } = require("http-errors");

const removeById = async (req, res) => {
  const { statisticId } = req.params;
  const statistic = await Statistic.findOneAndRemove({ _id: statisticId });
  if (!statistic) {
    throw NotFound(`Book with id=${statisticId} not found!`);
  }
  res.json({
    message: "Success",
    code: 200,
    data: {
      statistic,
    },
  });
};

module.exports = removeById;
