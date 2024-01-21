const status = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../../db/models");
// ----------------------------------------------

exports.register = async (req, res) => {
  try {
    const { user_name, email, password, phone } = req.body;

    // check is user already registered
    const isUserRegistered = await User.findOne({
      where: { email },
    });

    if (isUserRegistered) {
      res.status(status.BAD_REQUEST).json({
        message: "Email already registered",
        status: status.BAD_REQUEST,
      });
    } else {
      // hashing password on controller
      // let hashedPassword = await bcrypt.hash(password, 10);
      // if (typeof hashedPassword !== "string") {
      //   throw new Error("Error while hashing password");
      // }

      const user = await User.create({
        userName: user_name,
        email: email,
        password: password,
        phone: phone,
      });

      res.status(status.CREATED).json({
        message: "register successfully",
        status: status.OK,
        data: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          phone: user.phone,
        },
      });
    }
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
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
        userName: user.user_name,
        email: user.email,
      },
      process.env.SECRET_KEY
    );

    res.status(status.OK).json({
      message: "login successfully",
      status: status.OK,
      data: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        photo: user.photo,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.userData.id;

    const userCheckAuth = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
      },
    });

    if (!userCheckAuth) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.status(status.OK).json({
      status: status.OK,
      data: {
        id: userCheckAuth.id,
        userName: userCheckAuth.userName,
        email: userCheckAuth.email,
        phone: userCheckAuth.phone,
        photo: process.env.PATH_FILE_PHOTO + userCheckAuth.photo,
      },
    });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
