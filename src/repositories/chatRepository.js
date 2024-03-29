const { Users, Chats, Files } = require("../../database/models");

exports.getChats = async (offset = 0, limit = 30, filter = {}) => {
  const response = { data: null, error: null, count: 0 };

  try {
    response.data = await Chats.findAll({
      offset: offset,
      limit: limit,
      where: filter,
      include: [
        {
          model: Files,
          as: "files",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
        {
          model: Users,
          as: "sender",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
        {
          model: Users,
          as: "recipient",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (!response.data) {
      throw new Error("chats data not found");
    }

    response.count = await Chats.count({
      where: filter,
    });
  } catch (error) {
    response.error = `error on get datas : ${error.message}`;
  }

  return response;
};

exports.getChat = async (chatId) => {
  const response = { data: null, error: null };

  try {
    response.data = await Chats.findOne({
      where: {
        id: chatId,
      },
      include: [
        {
          model: Files,
          as: "files",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
        {
          model: Users,
          as: "sender",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
        {
          model: Users,
          as: "recipient",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });

    if (!response.data) {
      throw new Error(`chat with id ${chatId} not found`);
    }
  } catch (error) {
    response.error = `error on get data : ${error.message}`;
  }

  return response;
};

exports.createChat = async (chat, files) => {
  const response = { data: null, error: null };

  try {
    const createdChat = await Chats.create({
      message: chat.message,
      senderId: chat.senderId,
      recipientId: chat.recipientId,
    });

    if (files.length > 0) {
      await Files.bulkCreate(
        files.map((file) => ({ file: file.file, chatId: createdChat.id }))
      );
    }

    response.data = createdChat;
  } catch (error) {
    response.error = `error on create data : ${error.message}`;
  }

  return response;
};

exports.deleteChat = async (chat) => {
  const response = { data: null, error: null };

  try {
    await Files.destroy({
      where: {
        chatId: chat.id,
      },
    });

    response.data = await chat.destroy();
  } catch (error) {
    response.error = `error on delete data : ${error.message}`;
  }

  return response;
};
