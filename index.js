const express = require("express");
const { connection } = require("./utils/db");
const cors = require("cors");
const session = require("express-session");
const routes = require("./routes");
const response = require("./utils/apiResponse");
const customExpressRateLimit = require("./utils/middlewares/ratelimit");
const config = require("./utils/config");
const env = require("dotenv");

require("dotenv").config();

const app = express();
connection();
// Middlewares for service request

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "uwotm8",
  })
);

// Routes
process.env.NODE_ENV != "test" && app.use(customExpressRateLimit);
app.use(routes);

// middleware for handling file not found error
app.use((req, res, next) => {
  const err = new Error("Request not found");
  res.status(404).json(response.error(err, 404));
});

// middleware for handling all errors
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;
  res.status(500).json(response.error(error, status));
});

module.exports = app;
