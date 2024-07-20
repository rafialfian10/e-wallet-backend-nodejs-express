const httpStatus = require("http-status");

const {
  getUser,
  deleteUser,
} = require("../../repositories/userRepository");
const { singleUserResponse } = require("../../serializers/userSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");

module.exports = async (req, res) => {
  try {
    const { data: user, error } = await getUser(req.params.id);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    const { data: userDeleted, error: errorOnDeleteUser } = await deleteUser(
      user
    );
    if (errorOnDeleteUser) {
      const errors = new Error(errorOnDeleteUser);
      errors.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      message: "User successfully deleted",
      data: singleUserResponse(userDeleted),
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
