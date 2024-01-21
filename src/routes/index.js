const express = require("express");
const router = express.Router();

const auth = require("./auth");
const user = require("./user");

auth(router);
user(router);

module.exports = router;
