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
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      filePath: DataTypes.STRING,
      fileName: DataTypes.STRING,
      fileType: DataTypes.STRING,
      fileSize: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
      type: DataTypes.STRING,
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
