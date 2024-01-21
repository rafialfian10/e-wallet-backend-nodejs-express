const status = require("http-status");

const { User } = require("../../db/models");
// --------------------------------------------

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
      },
      include: [
        {
          model: Todo,
          as: "todos",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "deletedAt",
              "userId",
              "categoryId",
            ],
          },
          include: [
            {
              model: Category,
              as: "category",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt", "userId"],
              },
            },
          ],
        },
      ],
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

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const userId = await User.findByPk(id);
    if (!userId) {
      return res.status(status.NOT_FOUND).json({ message: "user not found" });
    }

    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
      },
      include: [
        {
          model: Todo,
          as: "todos",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "deletedAt",
              "userId",
              "categoryId",
            ],
          },
          include: [
            {
              model: Category,
              as: "category",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt", "userId"],
              },
            },
          ],
        },
      ],
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

exports.updateUser = async (req, res) => {
  try {
    let user = await User.findOne({
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

    user = await User.findOne({
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

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: "user not found" });
    }

    await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    res
      .status(status.OK)
      .json({ message: `user with id ${req.params.id} has been deleted` });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

exports.deleteUserPhoto = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: "user not found" });
    }

    if (user.photo) {
      user.photo = null;
      await user.save();
    }

    res.status(status.OK).json({
      status: status.OK,
      message: `photo for user with id ${userId} has been deleted`,
    });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};
