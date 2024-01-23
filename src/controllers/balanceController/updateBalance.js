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
// --------------------------------------------------------------------------

module.exports = async (req, res) => {
  try {
    const error = validateUpdateBalanceRequest(req.body);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.BAD_REQUEST;
      throw errors;
    }

    const { data: balance, error: errorFindBalance } = await getBalance(
      req.params.id
    );
    if (errorFindBalance) {
      const errors = new Error(errorFindBalance);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    // update amount
    if (
      req.body.amount !== null &&
      req.body.amount !== undefined &&
      req.body.amount !== balance.amount
    ) {
      balance.amount = req.body.amount;
    }

     // update date
     if (
      req.body.date !== null &&
      req.body.date !== undefined &&
      req.body.date !== balance.date
    ) {
      balance.date = req.body.date;
    }

    const { error: errorOnUpdateteUser } = await updateBalance(user);
    if (errorOnUpdateteUser) {
      const errors = new Error(errorOnUpdateteUser);
      errors.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw errors;
    }

    const { data: userUpdated, errorGetbalance } = await getBalance(user.id);
    if (errorGetbalance) {
      const errors = new Error(errorGetbalance);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      data: singleBalanceResponse(userUpdated),
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
