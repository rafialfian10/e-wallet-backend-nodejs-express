const joi = require("joi");

const { Balances } = require("../../db/models");

exports.singleBalanceResponse = (balanceData) => {
  const balance =
    balanceData instanceof Balances
      ? balanceData.get({ plain: true })
      : balanceData;

  return {
    id: balance.id,
    balance: balance.balance,
    userId: balance.userId,
    user: balance.user,
  };
};

exports.multipleBalanceResponse = (balancesData) => {
  return balancesData.map((el) => {
    return this.singleBalanceResponse(el);
  });
};

exports.validateUpdateBalanceRequest = (balanceData) => {
  const schema = joi.object({
    userId: joi.string(),
    balance: joi.number(),
  });

  try {
    const { error } = schema.validate(balanceData, { allowUnknown: true });
    if (error) {
      throw new Error(`request data invalid: ${error}`);
    }
    return null;
  } catch (error) {
    return error.message;
  }
};
