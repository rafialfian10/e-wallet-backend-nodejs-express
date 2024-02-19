const httpStatus = require("http-status");

const { getChat } = require("../../repositories/chatRepository");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
const { singleChatResponse } = require("../../serializers/chatSerializer");

module.exports = async (req, res) => {
  try {
    const { data: chat, error } = await getChat(req.params.id);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      data: singleChatResponse(chat),
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
