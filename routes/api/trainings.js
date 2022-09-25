const express = require("express");
const { trainings: ctrl } = require("../../controllers");
const { auth, validation, ctrlWrapper } = require("../../middlewares");
const { joiSchema } = require("../../models/training");

const router = express.Router();

router.post("/", auth, validation(joiSchema), ctrlWrapper(ctrl.add));

module.exports = router;
