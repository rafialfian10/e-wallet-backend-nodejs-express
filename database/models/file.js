"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Chats, {
        foreignKey: "chatId",
        as: "chat",
      });
    }
  }
  Files.init(
    {
      file: DataTypes.STRING,
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Files",
      underscored: true,
      paranoid: true,
    }
  );
  return Files;
};
