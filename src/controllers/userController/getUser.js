const status = require("http-status");

const { Users } = require("../../../db/models");
// --------------------------------------------

module.exports = async (req, res) => {
  try {
    const id = req.params.id;

    const userId = await Users.findByPk(id);
    if (!userId) {
      return res.status(status.NOT_FOUND).json({ message: "user not found" });
    }

    const user = await Users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
      },
    });

    let dataUser = JSON.parse(JSON.stringify(user));

    dataUser = {
      ...dataUser,
      photo: process.env.PATH_FILE_PHOTO + dataUser.photo,
    };

    res.status(status.OK).json({
      status: status.OK,
      data: dataUser,
    });
  } catch (err) {
    res.status(status.BAD_REQUEST).json({ message: err.message });
  }
};
