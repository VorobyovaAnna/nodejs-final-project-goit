const { BadRequest, NotFound, Locked } = require("http-errors");
const { Training, Book, Statistic } = require("../../models");

const presentDate = (result, newDate) =>
  result.find(
    (res) =>
      res.date.getDate() === new Date(newDate).getDate() &&
      res.date.getMonth() === new Date(newDate).getMonth() &&
      res.date
  );
const updateResult = (oldResult, newDate, newPages, dateAdded) => {
  let result;
  const newDateParse = new Date(newDate);
  if (dateAdded === undefined) {
    result = [...oldResult, { date: newDate, pages: newPages }];
  } else {
    result = oldResult.map(({ date, pages }) => {
      if (
        date.getUTCDate() === newDateParse.getUTCDate() &&
        date.getUTCMonth() === newDateParse.getUTCMonth()
      ) {
        return { date: newDateParse, pages: Number(pages) + Number(newPages) };
      }
      return { date, pages };
    });
  }
  return result;
};

const changeTrainingBooksList = (books, pagesAmount) => {
  const leftPages = books.reduce((pages, infBook, index, arr) => {
    if (Number(pages) === 0) {
      return pages;
    } else if (Number(infBook.leftPages) === 0) {
      return pages;
    } else if (Number(pages) - Number(infBook.leftPages) === 0) {
      arr[index].leftPages = 0;
      arr[index].status = true;
      pages = 0;
      return pages;
    } else if (Number(pages) - Number(infBook.leftPages) < 0) {
      arr[index].leftPages -= pages;
      arr[index].status = false;
      pages = 0;
      return pages;
    } else if (Number(pages) - Number(infBook.leftPages) > 0) {
      arr[index].leftPages = 0;
      arr[index].status = true;
      pages = pages - infBook.leftPages;
      return pages;
    }
    return pages;
  }, pagesAmount);

  return { books };
};

const updateStatistic = async (req, res) => {
  const { id } = req.user;
  const { date, pages } = req.body;
  const { statisticId } = req.params;
  const statistic = await Statistic.findOne({ _id: statisticId });
  if (!statistic) {
    throw NotFound(`Statistic with id=${statisticId} not found!`);
  }
  const dateAdded = presentDate(statistic.result, date);

  const newResult = updateResult(
    statistic.result,
    date,
    Number(pages),
    dateAdded
  );

  const training = await Training.findOne({
    user: id,
    statistics: statisticId,
  });
  if (!training) {
    throw BadRequest(`Check the entered data(id-${statisticId}!`);
  }
  const dateParse = new Date(date);
  if (
    (training.finish.getUTCDate() < dateParse.getUTCDate() &&
      training.finish.getUTCMonth() === dateParse.getUTCMonth()) ||
    training.start.getUTCMonth() > dateParse.getUTCMonth() ||
    training.finish.getUTCMonth() < dateParse.getUTCMonth() ||
    training.start.getUTCFullYear() > dateParse.getUTCFullYear() ||
    training.finish.getUTCFullYear() < dateParse.getUTCFullYear()
  ) {
    throw BadRequest(
      `The date entered must be in a range start-${training.start} and finish-${training.finish}`
    );
  }
  const { books } = training;

  const { books: trainingListBook } = changeTrainingBooksList(
    books,
    Number(pages)
  );

  // if (leftPages > 0) {
  //   throw Locked("Read pages exceed remaining pages");
  // }
  const booksStatusUpdate = trainingListBook.filter(
    (books) => books.status && books.book
  );
  const leftBooks = trainingListBook.length - booksStatusUpdate.length;

  const updateStatistic = await Statistic.findByIdAndUpdate(
    { _id: statisticId },
    { result: newResult, leftBooks },
    { new: true }
  );
  await Training.findByIdAndUpdate(
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
      statistics: updateStatistic,
    },
  });
};

module.exports = updateStatistic;
