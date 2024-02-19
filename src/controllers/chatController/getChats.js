const httpStatus = require("http-status");

const { getChats } = require("../../repositories/chatRepository");
const { multipleChatResponse } = require("../../serializers/chatSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");

module.exports = async (req, res) => {
  try {
    let offset, limit;

    if (req.query.page) {
      limit = req.query.limit ? parseInt(req.query.limit) : 30;
      offset = req.query.page == 1 ? 0 : (parseInt(req.query.page) - 1) * limit;
    }

    const {
      data: chats,
      count: totalChat,
      error,
    } = await getChats(offset, limit);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      data: multipleChatResponse(chats),
      totalData: totalChat,
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

