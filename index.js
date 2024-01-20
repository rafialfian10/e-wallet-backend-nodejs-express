require("dotenv").config(); // read environment variable from .env file

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
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

how to view username & password mysql: xampp -> phpmyadmin -> config.inc.php
how to view port in mysql: SQL -> create SHOW VARIABLES WHERE Variable_name = 'port';
how to create .gitigonre -> curl -o .gitignore https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore
git pull origin main --allow-unrelated-histories

*/