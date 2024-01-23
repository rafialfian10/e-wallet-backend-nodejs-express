const httpStatus = require("http-status");

const { getBalance } = require("../../repositories/balanceRepository");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
const { singleBalanceResponse } = require("../../serializers/balanceSerializer");
// --------------------------------------------------------------------------

module.exports = async (req, res) => {
  try {
    const { data: balance, error } = await getBalance(req.params.id);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      data: singleBalanceResponse(balance),
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
