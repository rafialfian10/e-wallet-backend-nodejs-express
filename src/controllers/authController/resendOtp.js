const httpStatus = require("http-status");

const { getUserByEmailAndPhone } = require("../../repositories/userRepository");
const {
  validateResendOTPRequest,
} = require("../../serializers/userSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
const { otpCodeGenerator } = require("../../pkg/helpers/otpCodeGenerator");
const { sendVerificationEmail } = require("../../pkg/helpers/sendMail");
const { hashPassword } = require("../../pkg/helpers/bcrypt");
const { setRedisValue, getRedisValue } = require("../../pkg/helpers/redis");

module.exports = async (req, res) => {
  try {
    const error = validateResendOTPRequest(req.body);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.BAD_REQUEST;
      throw errors;
    }

    const { data: user } = await getUserByEmailAndPhone(req.body.email, null);
    if (!user) {
      const error = new Error("user not found");
      error.status = httpStatus.NOT_FOUND;
      throw error;
    }

    if (user.isEmailVerified === true) {
      const error = new Error("Your email is already verified");
      error.status = httpStatus.BAD_REQUEST;
      throw error;
    }

    // generate OTP
    const otp = otpCodeGenerator(6);
    const hashedOtp = await hashPassword(otp, 11);

    // set hashed otp in redis
    const redisSetValErr = await setRedisValue(
      req.body.email,
      hashedOtp,
      5 * 60
    );
    if (redisSetValErr) {
      throw new Error(redisSetValErr);
    }

    // get data user in redis
    const { data: redisGetVal, error: errRedisGetVal } = await getRedisValue(
      req.body.email
    );
    if (errRedisGetVal) {
      throw new Error(errRedisGetVal);
    }

    // send otp to user's mail
    const { error: errSendEmail } = await sendVerificationEmail(user, otp);
    if (errSendEmail) {
      throw new Error(errSendEmail);
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      message: "OTP successfully sent to user's email",
      data: redisGetVal,
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
