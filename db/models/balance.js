"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Balances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Balances.init(
    {
      userId: {
        type: DataTypes.INTEGER,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      date: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Balances",
      underscored: true,
      paranoid: true,
    }
  );
  return Balances;
};
