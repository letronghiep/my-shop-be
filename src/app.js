require("dotenv").config();
const express = require("express");
const { default: helmet } = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();
const credentials = require("./middlewares/credentials");

// cors
const corsOptions = {
  origin: true,
};
app.use(credentials)
app.use(cors(corsOptions));
// init middlewares

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// init db
require("./db/init.mongodb");
// redis
const initRedis = require('./db/init.redis');
initRedis.initRedis()
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

// init router
app.use("/", require("./routes"));

// handling error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});
module.exports = app;
