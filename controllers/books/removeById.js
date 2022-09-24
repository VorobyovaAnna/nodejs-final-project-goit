const { Book } = require("../../models");
const { NotFound } = require("http-errors");

const removeById = async (req, res) => {
  const { id } = req.user;
  const { bookId } = req.params;
  const book = await Book.findOneAndRemove({ _id: bookId, user: id });
  if (!book) {
    throw NotFound(`Contact with id=${bookId} not found!`);
  }
  res.json({
    message: "Success",
    code: 200,
    data: {
      book,
    },
  });
};

module.exports = removeById;
