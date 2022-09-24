const express = require("express");
const { books: ctrl } = require("../../controllers");
const { joiSchema } = require("../../models/book");
const { auth, validation, ctrlWrapper } = require("../../middlewares");

const router = express.Router();

router.post("/", auth, validation(joiSchema), ctrlWrapper(ctrl.add));
router.get("/", auth, ctrlWrapper(ctrl.getAll));
router.get("/:bookId", auth, ctrlWrapper(ctrl.getById));

module.exports = router;
