const httpStatus = require("http-status");

const { getChat, deleteChat, } = require("../../repositories/chatRepository");
const { singleChatResponse } = require("../../serializers/chatSerializer");
const { successResponse, errorResponse, } = require("../../serializers/responseSerializer");

module.exports = async (req, res) => {
  try {
    const { data: chat, error } = await getChat(req.params.id);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.NOT_FOUND;
      throw errors;
    }

    const { data: chatDeleted, error: errorOnDeleteChat } = await deleteChat(
      chat
    );
    if (errorOnDeleteChat) {
      const errors = new Error(errorOnDeleteChat);
      errors.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw errors;
    }

    successResponse({
      response: res,
      status: httpStatus.OK,
      message: "Chat successfully deleted",
      data: singleChatResponse(chatDeleted),
    });
  } catch (error) {
    errorResponse({
      response: res,
      error: error,
    });
  }
};
