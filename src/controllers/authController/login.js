const status = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Users } = require("../../../db/models");
// ----------------------------------------------

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({
      where: { email },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!user) {
      return res.status(status.BAD_REQUEST).json({
        message: "email not registered",
        status: status.BAD_REQUEST,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(status.BAD_REQUEST).json({
        message: "password you entered is incorrect",
        status: status.BAD_REQUEST,
        errorType: "incorrect_password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    res.status(status.OK).json({
      message: "login successfully",
      status: status.OK,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone,
        isPhoneVerified: user.isPhoneVerified,
        gender: user.gender,
        address: user.address,
        photo: user.photo,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
