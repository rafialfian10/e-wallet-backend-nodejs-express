const httpStatus = require("http-status");

const {
  getUserByEmailAndPhone,
  updateUser,
} = require("../../repositories/userRepository");
const {
  singleUserResponse,
  validateVerifyOtpRequest,
} = require("../../serializers/userSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
const { comparePassword } = require("../../pkg/helpers/bcrypt");
const { getRedisValue } = require("../../pkg/helpers/redis");

module.exports = async (req, res) => {
  try {
    // validate request data
    const error = validateVerifyOtpRequest(req.body);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.BAD_REQUEST;
      throw errors;
    }

    // get user by email
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

    // get hashed otp from redis
    const { data: hashedOtp, error: errGetOtp } = await getRedisValue(
      req.body.email
    );
    if (errGetOtp) {
      throw new Error(errGetOtp);
    }

    // validate otp token
    if (!hashedOtp) {
      const error = new Error("OTP is not found or expired");
      error.status = httpStatus.BAD_REQUEST;
      throw error;
    } else {
      const isOtpValid = await comparePassword(hashedOtp, req.body.otp);

      if (!isOtpValid) {
        const error = new Error("OTP token is not valid");
        error.status = httpStatus.BAD_REQUEST;
        throw error;
      }
    }

    // update isEmailVerified to true
    user.isEmailVerified = true;
    const { data: updatedUser } = await updateUser(user);

    // send response
    successResponse({
      response: res,
      status: httpStatus.OK,
      data: singleUserResponse(updatedUser),
    });
  } catch (error) {
    errorResponse({ response: res, error: error });
  }
};
