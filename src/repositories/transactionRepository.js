const { Transactions } = require("../../db/models");

exports.getTransactions = async (offset = 0, limit = 10, filter = {}) => {
  const response = { data: null, error: null, count: 0 };

  try {
    response.data = await Transactions.findAll({
      offset: offset,
      limit: limit,
      where: filter,
    });
    if (!response.data) {
      throw new Error("transactions data not found");
    }

    response.count = await Balances.count({
      where: filter,
    });
  } catch (error) {
    response.error = `error on get datas : ${error.message}`;
  }

  return response;
};

exports.getTransaction = async (transactionId) => {
  const response = { data: null, error: null };

  try {
    response.data = await Transactions.findOne({
      where: {
        id: transactionId,
      },
    });

    if (!response.data) {
      throw new Error(`transaction with id ${transactionId} not found`);
    }
  } catch (error) {
    response.error = `error on get data : ${error.message}`;
  }

  return response;
};

exports.createTransaction = async (transaction) => {
  const response = { data: null, error: null };

  try {
    response.data = await Transactions.create({
      userId: transaction.userId,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      transaction_date: transaction.transaction_date,
    });
  } catch (error) {
    response.error = `error on create data : ${error.message}`;
  }

  return response;
};

exports.updateTransaction = async (transaction) => {
  const response = { data: null, error: null };

  try {
    response.data = await transaction.save();
  } catch (error) {
    response.error = `error on update data : ${error.message}`;
  }

  return response;
};

exports.deleteTransaction = async (transaction) => {
  const response = { data: null, error: null };

  try {
    response.data = await transaction.destroy();
  } catch (error) {
    response.error = `error on delete data : ${error.message}`;
  }

  return response;
};
