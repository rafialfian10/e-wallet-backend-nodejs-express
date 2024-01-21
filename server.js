require("dotenv").config(); // read environment variable from .env file

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { json } = require("sequelize");
// -----------------------------------------

// create instance of express
const app = express();

// create logger instance
const logger = morgan("dev");
app.use(logger);

// incoming request parser
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

const router = require("./src/routes");

app.use("/api/v1/", router);
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


/* migration database

1. npm install sequelize
2. npm install sequelize-cli
3. npm install mysql2
4. npx sequelize init -> create config.json in folder config & index.js in folder models 
5. npx sequelize-cli migration:generate --name apa_saja -> edit new file in migrations
6. npx sequelize db:migrate

*/