"use-strict";
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");

const { getUserByEmailAndPhone } = require("../../repositories/userRepository");
const { validateLoginRequest } = require("../../serializers/userSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
const { comparePassword } = require("../../pkg/helpers/bcrypt");

module.exports = async (req, res) => {
  try {
    const loginRequest = {
      email: req.body.email,
      password: req.body.password,
    };

    const error = validateLoginRequest(loginRequest);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.BAD_REQUEST;
      throw errors;
    }

    const { data: user, error: errorFindUser } = await getUserByEmailAndPhone(
      loginRequest.email,
      null
    );

    if (!user) {
      const error = new Error(errorFindUser);
      error.status = httpStatus.NOT_FOUND;
      throw error;
    }

    const isMatch = await comparePassword(user.password, loginRequest.password);
    if (!isMatch) {
      const error = new Error("Wrong password");
      error.status = httpStatus.BAD_REQUEST;
      throw error;
    }

    // if (user.isEmailVerified === false) {
    //   const error = new Error("Email has not been verified");
    //   error.status = httpStatus.BAD_REQUEST;
    //   throw error;
    // }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        pin: user.pin,
        roleId: user.roleId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24 hours",
        issuer: "Rafi Alfian",
      }
    );

    successResponse({
      response: res,
      status: httpStatus.OK,
      data: { id: user.id, token: token },
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
