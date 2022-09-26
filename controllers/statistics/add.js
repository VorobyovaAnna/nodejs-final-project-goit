const e = require("express");
const { BadRequest, NotFound } = require("http-errors");
const { books } = require("..");
const { Training, Book, Statistic } = require("../../models");

const add = async (req, res) => {
  const { id } = req.user;
  const { statisticId, newStatistic } = req.body;
  const statistic = await Statistic.findOne({ _id: statisticId });
  if (!statistic) {
    throw NotFound(`Statistic with id=${statisticId} not found!`);
  }
  const isDateAdded = statistic.result.find(
    (res) => res.date === new Date(newStatistic.date)
  );
  let result;
  if (!isDateAdded) {
    result = [...statistic.result, { ...newStatistic }];
  } else {
    result = statistic.result.map(({ date, pages }) => {
      if (date === new Date(newStatistic.date)) {
        return { date, pages: pages + newStatistic.pages };
      }
      return { date, pages };
    });
  }
  console.log(result);
  const pagesAmount = result.reduce((sum, { pages }) => sum + pages, 0);

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
  const changeTraining = books;
  changeTraining.reduce((pages, infBook, index, arr) => {
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

  const statusUpdate = changeTraining.map((books) => {
    if (books.status) {
      return books.book;
    }
    return false;
  });

  const updateStatistic = await Statistic.findByIdAndUpdate(
    { _id: statisticId },
    { result },
    { new: true }
  );
  const updateTraining = await Training.findByIdAndUpdate(
    { _id: training._id.toString() },
    { books: changeTraining },
    { new: true }
  );

  statusUpdate.map(async (status) => {
    if (!status) {
      return status;
    }
    const book = await Book.findByIdAndUpdate(
      { _id: status, user: id },
      { status: "already" },
      { new: true }
    );
    if (!book) {
      throw new Error(`Book's status has not been updated!`);
    }
    return book;
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
