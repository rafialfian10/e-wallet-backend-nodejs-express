const httpStatus = require("http-status");

const { getBalances } = require("../../repositories/balanceRepository");
const { multipleBalanceResponse } = require("../../serializers/balanceSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
// -------------------------------------------------------

module.exports = async (req, res) => {
  try {
    let offset, limit;

    if (req.query.page) {
      // default limit = 10
      limit = req.query.limit ? parseInt(req.query.limit) : 10;
      offset = req.query.page == 1 ? 0 : (parseInt(req.query.page) - 1) * limit;
    }

    const {
      data: balances,
      count: totalBalance,
      error,
    } = await getBalances(offset, limit);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      data: multipleBalanceResponse(balances),
      totalData: totalBalance,
      page: req.query.page,
      limit: limit,
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};

