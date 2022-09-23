const getCurrent = async (req, res) => {
  const { email, name } = req.user;
  res.status(200).json({
    message: "success",
    code: 200,
    data: {
      user: { email, name },
    },
  });
};

module.exports = getCurrent;
