const joi = require("joi");

const { Chats } = require("../../database/models");

exports.singleChatResponse = (chatData) => {
  const chat =
    chatData instanceof Chats ? chatData.get({ plain: true }) : chatData;

  return {
    id: chat.id,
    message: chat.message,
    files: chat.files,
    senderId: chat.senderId,
    sender: chat.sender,
    recipientId: chat.recipientId,
    recipient: chat.recipient,
  };
};

exports.multipleChatResponse = (chatsData) => {
  return chatsData.map((el) => {
    return this.singleChatResponse(el);
  });
};

exports.validateCreateChatRequest = (chatData) => {
  const schema = joi.object({
    message: joi.string().allow(""),
    file: joi.string(),
    senderId: joi.string().required(),
    recipientId: joi.string().required(),
  });

  try {
    const { error } = schema.validate(chatData, { allowUnknown: true });
    if (error) {
      throw new Error(`request data invalid: ${error}`);
    }
    return null;
  } catch (error) {
    return error.message;
  }
};
