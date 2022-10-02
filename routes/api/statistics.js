const express = require("express");
const { statistics: ctrl } = require("../../controllers");
const { auth, validation, ctrlWrapper } = require("../../middlewares");
const { joiResult } = require("../../models/statistic");

const router = express.Router();

router.get("/:statisticId", auth, ctrlWrapper(ctrl.getById));
router.patch(
  "/:statisticId",
  auth,
  validation(joiResult),
  ctrlWrapper(ctrl.updateStatistic)
);

module.exports = router;
