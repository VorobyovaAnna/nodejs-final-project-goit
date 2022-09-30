const express = require("express");
const { trainings: ctrl } = require("../../controllers");
const { auth, validation, ctrlWrapper } = require("../../middlewares");

const { joiSchemaAddTraining } = require("../../models/training");

const router = express.Router();

router.get("/", auth, ctrlWrapper(ctrl.getAll));
router.post("/", auth, validation(joiSchemaAddTraining), ctrlWrapper(ctrl.add));

module.exports = router;
