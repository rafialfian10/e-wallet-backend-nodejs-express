const joi = require("joi");

const { Transactions } = require("../../database/models");

exports.singleTransactionResponse = (transactionData) => {
  const transaction =
    transactionData instanceof Transactions
      ? transactionData.get({ plain: true })
      : transactionData;

  return {
    id: transaction.id,
    userId: transaction.userId,
    amount: transaction.amount,
    transactionType: transaction.transactionType,
    transactionDate: transaction.transactionDate,
    user: transaction.user,
  };
};

exports.multipleTransctionResponse = (transactionsData) => {
  return transactionsData.map((el) => {
    return this.singleTransactionResponse(el);
  });
};

exports.validateTopupTransactionRequest = (transactionData) => {
  const schema = joi.object({
    userId: joi.string().required(),
    amount: joi.number().required(),
    transactionType: joi.string().required(),
    transactionDate: joi.date().iso().required(),
  });

  try {
    const { error } = schema.validate(transactionData, { allowUnknown: true });
    if (error) {
      throw new Error(`request data invalid: ${error}`);
    }
    return null;
  } catch (error) {
    return error.message;
  }
};

exports.validateTransferTransactionRequest = (transactionData) => {
  const schema = joi.object({
    userId: joi.string().required(),
    amount: joi.number().required(),
    transactionType: joi.string().required(),
    transactionDate: joi.date().iso().required(),
    otherUserId: joi.string().required(),
  });

  try {
    const { error } = schema.validate(transactionData, { allowUnknown: true });
    if (error) {
      throw new Error(`request data invalid: ${error}`);
    }
    return null;
  } catch (error) {
    return error.message;
  }
};

