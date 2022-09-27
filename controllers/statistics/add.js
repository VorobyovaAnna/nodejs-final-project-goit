const e = require("express");
const { BadRequest, NotFound, Locked } = require("http-errors");
const { books } = require("..");
const { Training, Book, Statistic } = require("../../models");

const presentDate = (result, newDate) =>
  result.find(
    (res) =>
      res.date.getDate() === new Date(newDate).getDate() &&
      res.date.getMonth() === new Date(newDate).getMonth() &&
      res.date
  );
const updateResult = (oldResult, newStatistic, dateAdded) => {
  let result;
  if (!dateAdded) {
    result = [...oldResult, { ...newStatistic }];
  } else {
    result = oldResult.map(({ date, pages }) => {
      if (
        date.getDate() === new Date(newStatistic.date).getDate() &&
        date.getMonth() === new Date(newStatistic.date).getMonth()
      ) {
        return { date, pages: pages + newStatistic.pages };
      }
      return { date, pages };
    });
  }
  return result;
};
const sumPagesToRead = (result) =>
  result.reduce((sum, { pages }) => sum + pages, 0);

const changeTrainingBooksList = (books, pagesAmount) => {
  const leftPages = books.reduce((pages, infBook, index, arr) => {
    if (pages === 0) {
      return pages;
    } else if (infBook.leftPages === 0) {
      return pages;
    } else if (pages - infBook.leftPages === 0) {
      arr[index].leftPages = 0;
      arr[index].status = true;
      pages = 0;
      return pages;
    } else if (pages - infBook.leftPages < 0) {
      arr[index].leftPages -= pages;
      arr[index].status = false;
      pages = 0;
      return pages;
    } else if (pages - infBook.leftPages > 0) {
      arr[index].leftPages = 0;
      arr[index].status = true;
      pages = pages - infBook.leftPages;
      return pages;
    }
    return pages;
  }, pagesAmount);

  return { leftPages, books };
};

const add = async (req, res) => {
  const { id } = req.user;
  const { statisticId, newStatistic } = req.body;
  const statistic = await Statistic.findOne({ _id: statisticId });
  if (!statistic) {
    throw NotFound(`Statistic with id=${statisticId} not found!`);
  }
  const dateAdded = presentDate(statistic.result, newStatistic.date);
  const newResult = updateResult(statistic.result, newStatistic, dateAdded);
  console.log(newResult);

  const training = await Training.findOne({
    user: id,
    statistics: statisticId,
  });
  // .populate({ path: "books.book", model: "book" })
  // .populate({ path: "statistics", model: "statistic" });
  if (!training) {
    throw BadRequest(`Check the entered data(id-${statisticId}!`);
  }
  const { books } = training;

  const { leftPages, books: trainingListBook } = changeTrainingBooksList(
    books,
    newStatistic.pages
  );
  if (leftPages > 0) {
    throw Locked("All books have been already read");
  }
  const booksStatusUpdate = trainingListBook.filter(
    (books) => books.status && books.book
  );
  const leftBooks = statistic.leftBooks - booksStatusUpdate.length;

  const updateStatistic = await Statistic.findByIdAndUpdate(
    { _id: statisticId },
    { result: newResult, leftBooks },
    { new: true }
  );
  const updateTraining = await Training.findByIdAndUpdate(
    { _id: training._id.toString() },
    { books: trainingListBook },
    { new: true }
  );

  booksStatusUpdate.map(async ({ book }) => {
    const bookUpdate = await Book.findByIdAndUpdate(
      { _id: book, user: id },
      { status: "already" },
      { new: true }
    );
    if (!bookUpdate) {
      throw new Error(`Book's status has not been updated!`);
    }
    return bookUpdate;
  });
  res.status(200).json({
    message: "Success",
    code: 200,
    data: {
      training: updateTraining,
      statistics: updateStatistic,
    },
  });
};

module.exports = add;
