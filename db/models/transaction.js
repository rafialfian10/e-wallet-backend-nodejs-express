"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
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
  Transactions.init(
    {
      userId: {
        type: DataTypes.INTEGER,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      transaction_type: {
        type: DataTypes.STRING,
      },
      transaction_date: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Transactions",
      underscored: true,
      paranoid: true,
    }
  );
  return Transactions;
};
