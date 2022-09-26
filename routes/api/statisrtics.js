const express = require("express");
const { statistics: ctrl } = require("../../controllers");
const { auth, validation, ctrlWrapper } = require("../../middlewares");
const { joiResult } = require("../../models/statistic");

const router = express.Router();

router.get("/", auth, ctrlWrapper(ctrl.getAll));
router.post("/", auth, validation(joiResult), ctrlWrapper(ctrl.add));

module.exports = router;
