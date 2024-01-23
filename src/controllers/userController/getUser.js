const httpStatus = require("http-status");
const { getUser } = require("../../repositories/userRepository");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
const { singleUserResponse } = require("../../serializers/userSerializer");
// --------------------------------------------------------------------------

module.exports = async (req, res) => {
  try {
    const { data: user, error } = await getUser(req.params.id);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
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
