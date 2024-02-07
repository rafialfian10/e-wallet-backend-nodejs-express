const httpStatus = require("http-status");

exports.verifyPIN = async (req, res, next) => {
  try {
    const userPIN = req.userData.pin;
    const enteredPIN = req.body.pin;

    if (userPIN !== enteredPIN) {
      throw new Error("PIN is incorrect");
    }
    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: error.message,
    });
  }
  return null;
};
