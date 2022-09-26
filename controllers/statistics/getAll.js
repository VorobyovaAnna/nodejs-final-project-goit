const { Statistic } = require("../../models");
const { NotFound } = require("http-errors");

const getAll = async (req, res) => {
  const { statistics: statisticId } = req.body;
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

module.exports = getAll;
