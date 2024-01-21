"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   User.hasMany(models.Todo, {
    //     foreignKey: "userId",
    //     as: {
    //       // untuk object key ketika mempreload todo di data user
    //       singular: "todo",
    //       plural: "todos",
    //     },
    //   });
    //   User.hasMany(models.Category, {
    //     foreignKey: "userId",
    //     as: {
    //       // untuk object key ketika mempreload category di data user
    //       singular: "category",
    //       plural: "categories",
    //     },
    //   });
    }
  }
  User.init(
    {
      userName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue("password", bcrypt.hashSync(value, 10));
        },
      },
      phone: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      photo: {
        type: DataTypes.STRING,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "User",
      underscored: true,
      paranoid: true,
    }
  );
  return User;
};
