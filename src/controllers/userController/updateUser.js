const status = require("http-status");

const { Users } = require("../../../db/models");
// --------------------------------------------

module.exports = async (req, res) => {
  try {
    let user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      throw new Error("user not found");
    }

    if (req.body.user_name) {
      user.userName = req.body.user_name;
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (
      req.body.phone !== undefined &&
      req.body.phone !== null &&
      req.body.phone !== ""
    ) {
      user.phone = req.body.phone;
    }

    if (req.file) {
      user.photo = req.file.filename;
    }

    user = await user.save();

    user = await Users.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
      },
    });

    res.status(status.OK).json({
      status: status.OK,
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
