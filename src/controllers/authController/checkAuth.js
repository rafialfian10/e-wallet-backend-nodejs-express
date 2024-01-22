const status = require("http-status");

const { Users } = require("../../../db/models");
// ----------------------------------------------

module.exports = async (req, res) => {
  try {
    const id = req.userData.id;

    const userCheckAuth = await Users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
      },
    });

    if (!userCheckAuth) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.status(status.OK).json({
      status: status.OK,
      data: {
        id: userCheckAuth.id,
        username: userCheckAuth.username,
        email: userCheckAuth.email,
        phone: userCheckAuth.phone,
        gender: userCheckAuth.gender,
        address: userCheckAuth.address,
        photo: process.env.PATH_FILE_PHOTO + userCheckAuth.photo,
      },
    });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
