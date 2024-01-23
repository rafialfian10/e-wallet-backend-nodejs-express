const httpStatus = require("http-status");

const { getUser } = require("../../repositories/userRepository");
const { singleUserResponse } = require("../../serializers/userSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
// -------------------------------------------------------------------------------

module.exports = async (req, res) => {
  try {
    const { data: user } = await getUser(req.userData.id);
    if (!user) {
      const error = new Error("User not found");
      error.status = httpStatus.NOT_FOUND;
      throw error;
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
