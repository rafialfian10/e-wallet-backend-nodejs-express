const joi = require("joi");

const { Transactions } = require("../../db/models");
const { singleUserResponse } = require("./userSerializer");

exports.singleTransactionResponse = (transactionData) => {
  const transaction =
    transactionData instanceof Transactions
      ? transactionData.get({ plain: true })
      : transactionData;

  return {
    id: transaction.id,
    amount: transaction.amount,
    transaction_type: transaction.transaction_type,
    transaction_date: transaction.transaction_date,
    user: singleUserResponse(transaction.user),
  };
};

exports.multipleTransctionResponse = (transactionsData) => {
  return transactionsData.map((el) => {
    return this.singleTransactionResponse(el);
  });
};

exports.validateCreateTransactionRequest = (transactionData) => {
  const schema = joi.object({
    amount: joi.number().required(),
    transaction_type: joi.string().required(),
    transaction_date: joi.string().required(),
    userId: joi.string().required(),
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

exports.validateUpdateTransactionRequest = (transactionData) => {
  const schema = joi.object({
    amount: joi.number(),
    transaction_type: joi.string(),
    transaction_date: joi.string(),
    userId: joi.string(),
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
