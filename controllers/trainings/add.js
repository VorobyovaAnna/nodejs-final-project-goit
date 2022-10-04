const { BadRequest } = require("http-errors");
const { Training, Book, Statistic } = require("../../models");

const getDaysArray = function (start, end) {
  const arr = [];
  const dt = new Date(start);
  for (arr, dt; dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt).toLocaleString().split(",")[0]);
  }
  return arr;
};
const countBookTraining = (books) => books.length;
const countDayTraining = (start, finish) => {
  const differenceDates = Math.abs(finish - start);
  return Math.round(differenceDates / (1000 * 3600 * 24));
};

const countSumPages = (arr) => arr.reduce((sum, pages) => sum + pages, 0);
const pagesPlan = (books) => books.map((book) => book.pages);
const planTraining = (sumPages, planDays) => {
  const plan = [];
  const pagesInDay = sumPages / planDays.length;
  if (sumPages % planDays.length === 0) {
    planDays.map((date) => plan.push({ date, pages: pagesInDay }));
  } else {
    const pages = parseInt(pagesInDay);
    const pagesLastDay = sumPages - planDays.length * pages;
    planDays.map((date, index, arr) => {
      if (index !== arr.length - 1) {
        return plan.push({ date, pages });
      } else {
        return plan.push({ date, pages: pagesLastDay });
      }
    });
  }
  return plan;
};

const add = async (req, res) => {
  const { id } = req.user;
  const { start, finish, books } = req.body;
  const activeTraining = await Training.findOne({ user: id });
  if (activeTraining) {
    throw BadRequest(`You already have active training!`);
  }
  const booksFullInformation = await Promise.all(
    books.map(async (bookId) => {
      const [book] = await Book.find({ user: id, _id: bookId });
      if (!book) {
        throw new Error(`Not valid book's ID - ${bookId}!`);
      }
      return book;
    })
  );
  booksFullInformation.forEach(({ _id, status }) => {
    if (status === "already") {
      throw BadRequest(`You have already read book with ID- ${_id}!`);
    }
    if (status === "now") {
      throw BadRequest(`You are reading book with ID- ${_id}!`);
    }
  });

  const startDate = new Date(start);
  const finishDate = new Date(finish);

  if (startDate > finishDate) {
    throw BadRequest(`The final date must be later than the start date! `);
  }
  const bookAmount = countBookTraining(books);
  const dayAmount = countDayTraining(startDate, finishDate);
  const leftBooks = bookAmount;
  const planDays = getDaysArray(startDate, finishDate);
  const bookPagesPlan = pagesPlan(booksFullInformation);
  const sumPages = countSumPages(bookPagesPlan);
  const plan = planTraining(sumPages, planDays);
  const booksTraining = books.map((book, index) => ({
    book,
    leftPages: bookPagesPlan[index],
    status: false,
  }));

  const statistic = await Statistic.create({
    bookAmount,
    dayAmount,
    leftBooks,
    plan,
    result: [],
  });
  const statisticId = statistic._id.toString();
  if (!statistic) {
    throw BadRequest(`Check the entered data!`);
  }

  const training = await Training.create({
    user: id,
    start: startDate,
    finish: finishDate,
    books: booksTraining,
    statistics: statisticId,
  });
  if (!training) {
    throw BadRequest(`Check the entered data!`);
  }

  const bookStatusUpdate = await Promise.all(
    booksFullInformation.map(async ({ _id }) => {
      const book = await Book.findByIdAndUpdate(
        { _id, user: id },
        { status: "now" },
        { new: true }
      );
      if (!book) {
        throw new Error(`Book's status has not been updated!`);
      }
      return book;
    })
  );
  bookStatusUpdate.forEach((item) => {
    if (item instanceof Error) {
      throw BadRequest(item.message);
    }
  });

  res.status(200).json({
    message: "Success",
    code: 200,
    data: {
      training,
    },
  });
};
module.exports = add;
