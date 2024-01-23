const httpStatus = require("http-status");

const {
  getBalance,
  createBalance,
} = require("../../repositories/balanceRepository");
const {
  validateCreateBalanceRequest,
} = require("../../serializers/balanceSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
// -------------------------------------------------------------------

module.exports = async (req, res) => {
  try {
    const balance = {
      balance: req.body.balance,
      userId: req.userData.id,
    };

    const error = validateCreateBalanceRequest(balance);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.BAD_REQUEST;
      throw errors;
    }

    const { data: user, error: errorCreateBalance } = await createBalance(balance);
    if (errorCreateBalance) {
      const error = new Error(errorCreateBalance);
      error.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw error;
    }

    const { data: balanceCreate, error: errorGetBalance } = await getBalance(
      user.id
    );

    if (errorGetBalance) {
      const errors = new Error(errorGetBalance);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.CREATED,
      data: balanceCreate,
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
