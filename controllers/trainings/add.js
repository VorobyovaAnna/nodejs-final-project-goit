const { BadRequest } = require("http-errors");
const { Training, Book } = require("../../models");

const getDaysArray = function (start, end) {
  const arr = [];
  const dt = new Date(start);
  for (arr, dt; dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt).toLocaleString().split(",")[0]);
  }
  return arr;
};
const bookAmount = (books) => books.length;
const dayAmount = (start, finish) => {
  const differenceDates = Math.abs(finish - start);
  return Math.round(differenceDates / (1000 * 3600 * 24));
};
const leftBooks = (books) =>
  books.reduce((sum, { status }) => {
    if (!status) {
      sum += 1;
    }
    return sum;
  }, 0);

const countSumPages = (arr) => arr.reduce((sum, pages) => sum + pages, 0);

const add = async (req, res) => {
  const { id } = req.user;
  const { start, finish, books } = req.body;
  const startDate = new Date(start);
  const finishDate = new Date(finish);
  //   console.log(new Date(start).toLocaleString());
  if (startDate > finishDate) {
    throw BadRequest(`The final date must be later than the start date! `);
  }
  const book_amount = bookAmount(books);
  const day_amount = dayAmount(startDate, finishDate);
  const left_books = leftBooks(books);
  const planDays = getDaysArray(startDate, finishDate);
  const bookPagesPlan = await Promise.all(
    books.map(async ({ id_book }) => {
      const [book] = await Book.find({ id_user: id, _id: id_book });
      if (!book) {
        throw BadRequest(`Not valid book's ID - ${id_book}!`);
      }
      return book.pages;
    })
  );
  const sumPages = countSumPages(bookPagesPlan);
  const plan = [];
  const pagesInDay = sumPages / planDays.length;
  if (sumPages % planDays.length === 0) {
    planDays.map((day) => plan.push({ day, pages: pagesInDay }));
  } else {
    const pages = parseInt(pagesInDay);
    const pageslastDay = sumPages - planDays.length * pages;
    planDays.map((day, index, arr) => {
      if (index !== arr.length - 1) {
        return plan.push({ day, pages });
      } else {
        return plan.push({ day, pages: pageslastDay });
      }
    });
  }
  console.log(plan);
};
module.exports = add;
