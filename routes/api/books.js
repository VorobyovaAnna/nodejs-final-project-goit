const express = require("express");
const { books: ctrl } = require("../../controllers");
const { joiSchema, joiSchemaReviews } = require("../../models/book");
const { auth, validation, ctrlWrapper } = require("../../middlewares");

const router = express.Router();

router.post("/", auth, validation(joiSchema), ctrlWrapper(ctrl.add));
router.get("/", auth, ctrlWrapper(ctrl.getAll));
router.get("/:bookId", auth, ctrlWrapper(ctrl.getById));
router.delete("/:bookId", auth, ctrlWrapper(ctrl.removeById));
router.patch(
  "/:bookId/reviews",
  auth,
  validation(joiSchemaReviews),
  ctrlWrapper(ctrl.updateReviews)
);
module.exports = router;
