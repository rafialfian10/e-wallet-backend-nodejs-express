"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Roles, {
        foreignKey: "roleId",
        as: "role",
      });
      Users.hasOne(models.Balances, {
        foreignKey: "userId",
        as: "balance",
      });
      Users.hasMany(models.Chats, {
        as: "senderMessage",
        foreignKey: {
          name: "senderId",
        },
      });
      Users.hasMany(models.Chats, {
        as: "recipientMessage",
        foreignKey: {
          name: "recipientId",
        },
      });
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      isEmailVerified: DataTypes.BOOLEAN,
      password: DataTypes.STRING,
      phone: {
        type: DataTypes.STRING,
        unique: true,
      },
      isPhoneVerified: DataTypes.BOOLEAN,
      gender: DataTypes.STRING,
      address: DataTypes.TEXT,
      photo: DataTypes.STRING,
      pin: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Users",
      underscored: true,
      paranoid: true,
    }
  );
  return Users;
};
