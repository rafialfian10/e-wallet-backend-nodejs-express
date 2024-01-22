const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const path = require("path");
const router = require("./routes");
const { redisInit } = require("../config/redis");
const customLogger = require("./pkg/middlewares/logger");

require("dotenv").config(); // read environment variable from .env file
// -----------------------------------------

// create instance of express
const app = express();

// configuration cors
app.use(
  cors({
    origin: process.env.ORIGIN_ALLOWED,
    methods: ["HEAD", "OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  })
);

// connect to redis server
// redisInit();

// create logger instance
const logger = morgan("dev");
app.use(logger);

// custom logger middleware
app.use(customLogger);

// incoming request parser
app.use(express.json());

// create router group
app.use("/api/v1/", router);

// serving static files
app.use("/static", express.static(path.join(__dirname, "../uploads")));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});