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
    }
  }
  Chats.init(
    {
      message: DataTypes.TEXT,
      file: DataTypes.STRING,
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