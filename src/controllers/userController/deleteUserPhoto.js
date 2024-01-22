const status = require("http-status");

const { Users } = require("../../../db/models");
// --------------------------------------------

module.exports = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await Users.findByPk(userId);
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
