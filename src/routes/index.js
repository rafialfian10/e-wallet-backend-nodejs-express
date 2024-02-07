const express = require("express");
const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const balanceRouter = require("./balanceRouter");
const transactionRouter = require("./transactionRouter");

const router = express.Router();

// Set up your routes
router.use(authRouter);
router.use(userRouter);
router.use(balanceRouter);
router.use(transactionRouter);

module.exports = router;