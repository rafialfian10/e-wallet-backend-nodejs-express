const httpStatus = require("http-status");

const { hashPassword } = require("../../pkg/helpers/bcrypt");
const { otpCodeGenerator } = require("../../pkg/helpers/otpCodeGenerator");
const { sendVerificationEmail } = require("../../pkg/helpers/sendMail");
const { setRedisValue } = require("../../pkg/helpers/redis");

const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
const {
  singleUserResponse,
  validateCreateUserRequest,
} = require("../../serializers/userSerializer");
const {
  getUser,
  createUser,
  getUserByEmailAndPhone,
} = require("../../repositories/userRepository");
const { createBalance } = require("../../repositories/balanceRepository");

module.exports = async (req, res) => {
  try {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: await hashPassword(req.body.password, 11),
      phone: req.body.phone,
    };

    /**
     * user not logged in only can register as user
     * admin only can register new user as user or admin
     * superadmin can register new user with any role
     */
    if (!req.userData?.roleId) {
      newUser.roleId = 3;
    } else if (req.userData?.roleId == 2 && req.body.roleId != 1) {
      newUser.roleId = req.body.roleId;
    } else if (req.userData?.roleId == 1) {
      newUser.roleId = req.body.roleId;
    }

    const error = validateCreateUserRequest(newUser);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.BAD_REQUEST;
      throw errors;
    }

    // check is email/phone already used by another user
    const { error: errorGetUserByEmailAndPhone } = await getUserByEmailAndPhone(
      newUser.email,
      newUser.phone
    );
    if (!errorGetUserByEmailAndPhone) {
      const error = new Error("Email or Phone already used by another user");
      error.status = httpStatus.BAD_REQUEST;
      throw error;
    }

    // create user
    const { data: user, error: errorCreateNewUser } = await createUser(newUser);
    if (errorCreateNewUser) {
      const error = new Error(errorCreateNewUser);
      error.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw error;
    }

    // create balance
    const { data: balance, error: errorCreateBalance } = await createBalance({
      userId: user.id,
      balance: 0,
    });
    if (errorCreateBalance) {
      const error = new Error(errorCreateBalance);
      error.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw error;
    }

    // generate otp code
    const otp = otpCodeGenerator(6);
    const hashedOtp = await hashPassword(otp, 11);

    // store hashed otp in redis for 5 minutes
    setRedisValue(user.email, hashedOtp, 5 * 60);

    // send otp code to email
    sendVerificationEmail(user, otp);

    const { data: userRegistered, error: errorGetUser } = await getUser(
      user.id
    );

    if (errorGetUser) {
      const errors = new Error(errorGetUser);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.CREATED,
      message: "User successfully registered",
      data: userRegistered,
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
