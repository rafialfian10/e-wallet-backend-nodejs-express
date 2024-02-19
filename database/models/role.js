"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Users, {
        foreignKey: "roleId",
        as: {
          singular: "user",
          plural: "users",
        },
      });
    }
  }
  Roles.init(
    {
      role: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Roles",
      paranoid: true,
      underscored: true,
    }
  );
  return Roles;
};
