const httpStatus = require("http-status");

const { getChat, createChat } = require("../../repositories/chatRepository");
const {
  validateCreateChatRequest,
  singleChatResponse,
} = require("../../serializers/chatSerializer");
const {
  successResponse,
  errorResponse,
} = require("../../serializers/responseSerializer");
const { fileUrlGenerator } = require("../../pkg/helpers/imgUrlGenerator");

module.exports = async (req, res) => {
  try {
    const newChat = {
      message: req.body.message || "",
      senderId: req.userData.id,
      recipientId: req.body.recipientId,
    };

    // if (req.file) {
    //   newChat.file = fileUrlGenerator(req, req.file.filename);
    // }

    let files = [];

    if (req.files && req.files.length > 0) {
      files = req.files.map((file) => ({
        file: fileUrlGenerator(req, file.filename),
      }));
    }

    const error = validateCreateChatRequest(newChat);
    if (error) {
      const errors = new Error(error);
      errors.status = httpStatus.BAD_REQUEST;
      throw errors;
    }

    const { data: dataChat, error: errorCreateChat } = await createChat(
      newChat,
      files,
    );
    if (errorCreateChat) {
      const error = new Error(errorCreateChat);
      error.status = httpStatus.INTERNAL_SERVER_ERROR;
      throw error;
    }

    const { data: chat, errorGetChat } = await getChat(dataChat.id);
    if (errorGetChat) {
      const errors = new Error(errorGetChat);
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
