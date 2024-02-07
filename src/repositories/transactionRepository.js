const { Users, Transactions } = require("../../db/models");

exports.getTransactionsByAdmin = async (offset = 0, limit = 10, filter = {}) => {
  const response = { data: null, error: null, count: 0 };

  try {
    response.data = await Transactions.findAll({
      offset: offset,
      limit: limit,
      where: filter,
      include: [
        {
          model: Users,
          as: "user",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      order: [["transaction_date", "DESC"]]
    });
    if (!response.data) {
      throw new Error("transactions data not found");
    }

    response.count = await Transactions.count({
      where: filter,
    });
  } catch (error) {
    response.error = `error on get datas : ${error.message}`;
  }

  return response;
};

exports.getTransactionsByUser = async (userId, offset = 0, limit = 10, filter = {}) => {
  const response = { data: null, error: null, count: 0 };

  try {
    response.data = await Transactions.findAll({
      offset: offset,
      limit: limit,
      where: { ...filter, userId: userId },
      include: [
        {
          model: Users,
          as: "user",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      order: [["transaction_date", "DESC"]]
    });
    if (!response.data) {
      throw new Error("transactions data not found");
    }

    response.count = await Transactions.count({
      where: { ...filter, userId: userId },
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
      include: [
        {
          model: Users,
          as: "user",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });

    if (!response.data) {
      throw new Error(`transaction with id ${transactionId} not found`);
    }
  } catch (error) {
    response.error = `error on get data : ${error.message}`;
  }

  return response;
};

exports.topupTransaction = async (transaction) => {
  const response = { data: null, error: null };

  try {
    response.data = await Transactions.create({
      userId: transaction.userId,
      amount: transaction.amount,
      transactionType: transaction.transactionType,
      transactionDate: transaction.transactionDate,
    });
  } catch (error) {
    response.error = `error on create data : ${error.message}`;
  }


  return response;
};

exports.transferTransaction = async (transaction) => {
  const response = { data: null, error: null };

  try {
    response.data = await Transactions.create({
      userId: transaction.userId,
      amount: transaction.amount,
      transactionType: transaction.transactionType,
      transactionDate: transaction.transactionDate,
    });
  } catch (error) {
    response.error = `error on create data : ${error.message}`;
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
