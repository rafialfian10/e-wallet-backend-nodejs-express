const { Balances } = require("../../db/models");

exports.getBalances = async (offset = 0, limit = 10, filter = {}) => {
  const response = { data: null, error: null, count: 0 };

  try {
    response.data = await Balances.findAll({
      offset: offset,
      limit: limit,
      where: filter,
    });
    if (!response.data) {
      throw new Error("balances data not found");
    }

    response.count = await Balances.count({
      where: filter,
    });
  } catch (error) {
    response.error = `error on get datas : ${error.message}`;
  }

  return response;
};

exports.getBalance = async (balanceId) => {
  const response = { data: null, error: null };

  try {
    response.data = await Balances.findOne({
      where: {
        id: balanceId,
      },
    });

    if (!response.data) {
      throw new Error(`balance with id ${balanceId} not found`);
    }
  } catch (error) {
    response.error = `error on get data : ${error.message}`;
  }

  return response;
};

exports.createBalance = async (balance) => {
  const response = { data: null, error: null };

  try {
    response.data = await Balances.create({
      userId: balance.userId,
      amount: balance.amount,
      date: balance.date,
    });
  } catch (error) {
    response.error = `error on create data : ${error.message}`;
  }

  return response;
};

exports.updateBalance = async (balance) => {
  const response = { data: null, error: null };

  try {
    response.data = await balance.save();
  } catch (error) {
    response.error = `error on update data : ${error.message}`;
  }

  return response;
};

exports.deleteBalance = async (balance) => {
  const response = { data: null, error: null };

  try {
    response.data = await balance.destroy();
  } catch (error) {
    response.error = `error on delete data : ${error.message}`;
  }

  return response;
};
