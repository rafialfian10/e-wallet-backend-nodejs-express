const httpStatus = require("http-status");

const {
  getBalance,
  updateBalance,
} = require("../../repositories/balanceRepository");
const {
  validateUpdateBalanceRequest,
  singleBalanceResponse,
} = require("../../serializers/balanceSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");

module.exports = async (req, res) => {
  try {
    const error = validateUpdateBalanceRequest(req.body);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.BAD_REQUEST;
      throw errors;
    }

    const { data: balance, error: errorGetBalance } = await getBalance(
      req.params.id
    );
    if (errorGetBalance) {
      const errors = new Error(errorGetBalance);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    // update balance
    if (
      req.body.balance !== null &&
      req.body.balance !== undefined &&
      req.body.balance !== balance.balance
    ) {
      balance.balance = req.body.balance;
    }

    const { error: errorOnUpdateteBalance } = await updateBalance(balance);
    if (errorOnUpdateteBalance) {
      const errors = new Error(errorOnUpdateteBalance);
      errors.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw errors;
    }

    const { data: balanceUpdated, errorGetbalance } = await getBalance(balance.id);
    if (errorGetbalance) {
      const errors = new Error(errorGetbalance);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      data: singleBalanceResponse(balanceUpdated),
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
