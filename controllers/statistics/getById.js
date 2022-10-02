const { Statistic } = require("../../models");
const { NotFound } = require("http-errors");

const getById = async (req, res) => {
  const { statisticId } = req.params;
  const statistic = await Statistic.findOne({ id: statisticId });
  if (!statistic) {
    throw NotFound(`Statistic with id=${statisticId} not found!`);
  }
  res.status(200).json({
    message: "Success",
    code: 200,
    data: {
      statistic,
    },
  });
};

module.exports = getById;
