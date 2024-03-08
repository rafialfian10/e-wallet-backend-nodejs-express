"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chats.belongsTo(models.Users, {
        as: "sender",
        foreignKey: {
          name: "senderId",
        },
      });
      Chats.belongsTo(models.Users, {
        as: "recipient",
        foreignKey: {
          name: "recipientId",
        },
      });
      Chats.hasMany(models.Files, {
        as: "files",
        foreignKey: {
          name: "chatId",
        },
      });
    }
  }
  Chats.init(
    {
      message: DataTypes.TEXT,
      notification: DataTypes.STRING,
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Chats",
      underscored: true,
      paranoid: true,
    }
  );
  return Chats;
};
