const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
// const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const authRouter = require("./routes/api/auth");
const bookRouter = require("./routes/api/books");
const trainingRouter = require("./routes/api/trainings");
const statisticRouter = require("./routes/api/statistics");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/trainings", trainingRouter);
app.use("/api/statistics", statisticRouter);

// app.use("/link", (_, res) => {
//   res.sendFile(path.join(__dirname, "./public/link.html"));
// });

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res, __) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
