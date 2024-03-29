const { Users, Balances } = require("../../database/models");

exports.getBalances = async (offset = 0, limit = 10, filter = {}) => {
  const response = { data: null, error: null, count: 0 };

  try {
    response.data = await Balances.findAll({
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
      balance: balance.balance,
    });
  } catch (error) {
    response.error = `error on create data : ${error.message}`;
  }

  return response;
};

exports.updateBalance = async (newBalance, otherUserId) => {
  const response = { data: null, error: null };

  try {
    const balance = await Balances.findOne({
      where: {
        userId: newBalance.userId,
      },
    });

    if (!balance) {
      throw new Error(`Balance for user with id ${balance.userId} not found`);
    }

    if (newBalance.transactionType === "topup") {
      balance.balance += newBalance.amount;
    } else if (newBalance.transactionType === "transfer") {
      if (balance.balance < newBalance.amount) {
        throw new Error(
          `balance is not sufficient, your remaining balance is ${balance.balance}`
        );
      } else {
        const otherUser = await Balances.findOne({
          where: {
            userId: otherUserId,
          },
        });

        if (!otherUser) {
          throw new Error(`User with id ${balance.userId} not found`);
        }

        // reduce balance
        balance.balance = balance.balance - newBalance.amount;

        // add balance to other user
        otherUser.balance += newBalance.amount;
        await otherUser.save();
      }
    }

    response.data = await balance.save();
  } catch (error) {
    response.error = `Error updating balance: ${error.message}`;
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
