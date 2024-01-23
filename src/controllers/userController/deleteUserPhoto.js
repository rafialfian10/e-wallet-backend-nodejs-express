const httpStatus = require("http-status");

const { getUser } = require("../../repositories/userRepository");
const { singleUserResponse } = require("../../serializers/userSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
// -----------------------------------------------------------------

module.exports = async (req, res) => {
  try {
    const { data: user, error } = await getUser(req.params.id);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    if (user.photo) {
      user.photo = null;
      await user.save();
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      data: singleUserResponse(user),
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};