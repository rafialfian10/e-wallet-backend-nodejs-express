const { Op } = require("sequelize");
const { Users, Roles } = require("../../db/models");

exports.getUsers = async (offset = 0, limit = 10, filter = {}) => {
  const response = { data: null, error: null, count: 0 };

  try {
    response.data = await Users.findAll({
      offset: offset,
      limit: limit,
      where: filter,
      include: [{ model: Roles, as: "role" }],
    });
    if (!response.data) {
      throw new Error("users data not found");
    }

    response.count = await Users.count({
      where: filter,
    });
  } catch (error) {
    response.error = `error on get datas : ${error.message}`;
  }

  return response;
};

exports.getUser = async (userId) => {
  const response = { data: null, error: null };

  try {
    response.data = await Users.findOne({
      where: {
        id: userId,
      },
      include: [{ model: Roles, as: "role" }],
    });

    if (!response.data) {
      throw new Error(`user not found`);
    }
  } catch (error) {
    response.error = `error on get data : ${error.message}`;
  }

  return response;
};

exports.createUser = async (user) => {
  console.log("params", user);
  const response = { data: null, error: null };

  try {
    response.data = await Users.create({
      username: user.username,
      email: user.email,
      isEmailVerified: false,
      password: user.password,
      phone: user.phone,
      isPhoneVerified: false,
      gender: user.gender,
      address: user.address,
      photo: user.photo,
      roleId: user.roleId,
    });
  } catch (error) {
    response.error = `error on create data : ${error.message}`;
  }

  console.log("response", response);

  return response;
};

exports.updateUser = async (user) => {
  const response = { data: null, error: null };

  try {
    response.data = await user.save();
  } catch (error) {
    response.error = `error on update data : ${error.message}`;
  }

  return response;
};

exports.deleteUser = async (user) => {
  const response = { data: null, error: null };

  try {
    response.data = await user.destroy();
  } catch (error) {
    response.error = `error on delete data : ${error.message}`;
  }

  return response;
};

exports.getUserByEmailAndPhone = async (email, phone) => {
  const response = { data: null, error: null };

  try {
    response.data = await Users.findOne({
      where: {
        [Op.or]: [email && { email: email }, phone && { phone: phone }],
      },
      include: [{ model: Roles, as: "role" }],
    });

    if (!response.data) {
      throw new Error(`user not found`);
    }
  } catch (error) {
    response.error = `error on get data : ${error.message}`;
  }

  return response;
};
