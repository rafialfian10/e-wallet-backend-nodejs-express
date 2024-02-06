const httpStatus = require("http-status");

const { getBalance, deleteBalance, } = require("../../repositories/balanceRepository");
const { singleBalanceResponse } = require("../../serializers/balanceSerializer");
const { successResponse, errorResponse, } = require("../../serializers/responseSerializer");

module.exports = async (req, res) => {
  try {
    const { data: balance, error } = await getBalance(req.params.id);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    const { data: balanceDeleted, error: errorOnDeleteBalance } = await deleteBalance(
      balance
    );
    if (errorOnDeleteBalance) {
      const errors = new Error(errorOnDeleteBalance);
      errors.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      data: singleBalanceResponse(balanceDeleted),
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
