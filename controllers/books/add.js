const { BadRequest } = require("http-errors");
const { Book } = require("../../models");

const add = async (req, res) => {
  const { id } = req.user;
  const { title, author } = req.body;
  const bookAdded = await Book.findOne({ title, author, id_user: id });
  if (bookAdded) {
    throw BadRequest(
      `Book with title=${title}, author=${author} has already been added!`
    );
  }
  const book = await Book.create({ ...req.body, user: id });
  if (!book) {
    throw BadRequest(`Check the entered data!`);
  }

  res.json({
    message: "Success",
    code: 200,
    data: {
      book,
    },
  });
};

module.exports = add;
