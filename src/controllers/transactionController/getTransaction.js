const httpStatus = require("http-status");

const { getTransaction } = require("../../repositories/transactionRepository");
const {
  singleTransactionResponse,
} = require("../../serializers/transactionSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");

module.exports = async (req, res) => {
  try {
    const { data: transaction, error } = await getTransaction(req.params.id);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      data: singleTransactionResponse(transaction),
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
