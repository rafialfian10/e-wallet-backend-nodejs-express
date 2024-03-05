const httpStatus = require("http-status");

const {
  getUser,
  updateUser,
  getUserByEmailAndPhone,
} = require("../../repositories/userRepository");
const {
  validateUpdateUserRequest,
  singleUserResponse,
} = require("../../serializers/userSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
const { photoUrlGenerator }  = require("../../pkg/helpers/fileUrlGenerator");

module.exports = async (req, res) => {
  try {
    const error = validateUpdateUserRequest(req.body);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.BAD_REQUEST;
      throw errors;
    }

    const { data: user, error: errorFindUser } = await getUser(
      req.params.id
    );
    if (errorFindUser) {
      const errors = new Error(errorFindUser);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    // update username
    if (
      req.body.username !== null &&
      req.body.username !== undefined &&
      req.body.username !== user.username
    ) {
      user.username = req.body.username;
    }

    // update email
    if (
      req.body.email !== null &&
      req.body.email !== undefined &&
      req.body.email !== user.email
    ) {
      const { data } = await getUserByEmailAndPhone(req.body.email, null);
      if (data) {
        const errors = new Error("email already used");
        errors.status = httpStatus.BAD_REQUEST;
        throw errors;
      }
      user.email = req.body.email;
      user.isEmailVerified = false;
    }

    // update phone
    if (
      req.body.phone !== null &&
      req.body.phone !== undefined &&
      req.body.phone !== user.phone
    ) {
      const { data } = await getUserByEmailAndPhone(null, req.body.phone);
      if (data) {
        const errors = new Error("phone already used");
        errors.status = httpStatus.BAD_REQUEST;
        throw errors;
      }
      user.phone = req.body.phone;
      user.isPhoneVerified = false;
    }

    // update gender
    if (
      req.body.gender !== null &&
      req.body.gender !== undefined &&
      req.body.gender !== user.gender
    ) {
      user.gender = req.body.gender;
    }

    // update address
    if (
      req.body.address !== null &&
      req.body.address !== undefined &&
      req.body.address !== user.address
    ) {
      user.address = req.body.address;
    }

    // update pin
    if (
      req.body.pin !== null &&
      req.body.pin !== undefined &&
      req.body.pin !== user.pin
    ) {
      user.pin = req.body.pin;
    }

    // update role
    if (
      req.body.roleId !== null &&
      req.body.roleId !== undefined &&
      parseInt(req.body.roleId) !== user.roleId
    ) {
      user.roleId =
        req.userData.roleId == 1 ? parseInt(req.body.roleId) : user.roleId; // only superadmin can update role
    }

    // update photo
    if (req.file) {
      user.photo = photoUrlGenerator(req, req.file.filename);
    }

    const { error: errorOnUpdateteUser } = await updateUser(user);
    if (errorOnUpdateteUser) {
      const errors = new Error(errorOnUpdateteUser);
      errors.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw errors;
    }

    const { data: userUpdated, errorGetUser } = await getUser(user.id);
    if (errorGetUser) {
      const errors = new Error(errorGetUser);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      data: singleUserResponse(userUpdated),
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
