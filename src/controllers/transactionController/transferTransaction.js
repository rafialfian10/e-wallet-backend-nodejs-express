const httpStatus = require("http-status");
const moment = require("moment-timezone");

const {
  getTransaction,
  transferTransaction,
} = require("../../repositories/transactionRepository");
const { updateBalance } = require("../../repositories/balanceRepository");
const {
  validateTransferTransactionRequest,
  singleTransactionResponse,
} = require("../../serializers/transactionSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");

module.exports = async (req, res) => {
  try {
    const newTransaction = {
      userId: req.userData.id,
      amount: req.body.amount,
      transactionType: "transfer",
      transactionDate: moment()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      otherUserId: req.body.otherUserId,
    };

    const error = validateTransferTransactionRequest(newTransaction);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.BAD_REQUEST;
      throw errors;
    }

    const { data: transfer, error: errorTransferTransaction } =
      await transferTransaction(newTransaction);
    if (errorTransferTransaction) {
      const error = new Error(errorTransferTransaction);
      error.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw error;
    }

    const { error: errorOnUpdateteBalance } = await updateBalance(
      transfer,
      newTransaction.otherUserId
    );
    if (errorOnUpdateteBalance) {
      const errors = new Error(errorOnUpdateteBalance);
      errors.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw errors;
    }

    const { data: transaction, errorGetTransaction } = await getTransaction(
      transfer.id
    );
    if (errorGetTransaction) {
      const errors = new Error(errorGetTransaction);
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
