const express = require("express");
const { books: ctrl } = require("../../controllers");
const { joiSchema } = require("../../models/book");
const { auth, validation, ctrlWrapper } = require("../../middlewares");

const router = express.Router();

router.post("/", auth, ctrlWrapper(ctrl.add));

module.exports = router;
