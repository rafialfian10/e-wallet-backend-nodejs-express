const status = require("http-status");

const { Users } = require("../../../db/models");
// --------------------------------------------

module.exports = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
      },
    });

    let dataUsers = JSON.parse(JSON.stringify(users));

    dataUsers = dataUsers.map((dataUser) => {
      return {
        ...dataUser,
        photo: process.env.PATH_FILE_PHOTO + dataUser.photo,
      };
    });

    res.status(status.OK).json({
      status: status.OK,
      data: dataUsers,
    });
  } catch (err) {
    res.status(status.BAD_REQUEST).json({ message: err.message });
  }
};
