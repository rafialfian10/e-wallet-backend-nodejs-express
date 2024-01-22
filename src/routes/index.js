const express = require("express");
const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
// ----------------------------------------------

const router = express.Router();

// Set up your routes
router.use(authRouter);
router.use(userRouter);

module.exports = router;