const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const {
  Users,
  Roles,
  Balances,
  Chats,
  Files,
} = require("../../database/models");

// import sequelize operator => https://sequelize.org/master/manual/model-querying-basics.html#operators
const { Op } = require("sequelize");

const connectedUser = {};

const socketIo = (io) => {
  // create middlewares before connection event
  // to prevent client access socket server without token
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", async (socket) => {
    // get user connected id
    const userId = socket.handshake.query.id;

    // save to connectedUser
    connectedUser[userId] = socket.id;

    try {
      const user = await Users.findByPk(userId);
      if (user) {
        if (user.roleId === 1) {
          io.emit("super admin online", userId);
        } else if (user.roleId === 2) {
          io.emit("admin online", userId);
        } else if (user.roleId === 3) {
          io.emit("user online", userId);
        }
      }
    } catch (error) {
      console.log(error);
    }

    // define listener on event load super admin contact
    socket.on("load super admin contact", async () => {
      try {
        const superAdminContact = await Users.findOne({
          include: [
            {
              model: Roles,
              as: "role",
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            },
            {
              model: Balances,
              as: "balance",
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            },
          ],
          where: {
            role_id: 1,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
          },
        });

        socket.emit("super admin contact", superAdminContact);
      } catch (err) {
        console.log(err);
      }
    });

    // define listener on event load admin contact
    socket.on("load admin contact", async () => {
      try {
        const adminContact = await Users.findOne({
          include: [
            {
              model: Roles,
              as: "role",
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            },
            {
              model: Balances,
              as: "balance",
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            },
          ],
          where: {
            role_id: 2,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
          },
        });

        socket.emit("admin contact", adminContact);
      } catch (err) {
        console.log(err);
      }
    });

    // define listener on event load user contact
    socket.on("load users contact", async () => {
      try {
        let userContacts = await Users.findAll({
          include: [
            {
              model: Roles,
              as: "role",
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            },
            {
              model: Balances,
              as: "balance",
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            },
            {
              model: Chats,
              as: "recipientMessage",
              attributes: {
                exclude: ["updatedAt", "deletedAt", "recipientId", "senderId"],
              },
            },
            {
              model: Chats,
              as: "senderMessage",
              attributes: {
                exclude: ["updatedAt", "deletedAt", "recipientId", "senderId"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
          },
        });

        userContacts = JSON.parse(JSON.stringify(userContacts));
        // userContacts = userContacts.map((item) => ({
        //   ...item,
        //   photo: item.photo ? process.env.PATH_FILE + item.photo : null,
        // }));

        socket.emit("users contact", userContacts);
      } catch (err) {
        console.log(err);
      }
    });

    // define listener on event load messages
    socket.on("load messages", async (payload) => {
      try {
        const token = socket.handshake.auth.token;

        const tokenKey = process.env.JWT_SECRET;
        const verified = jwt.verify(token._j, tokenKey);

        const recipientId = payload; // catch recipient id sent from client
        const senderId = verified.id; //id user

        const data = await Chats.findAll({
          where: {
            senderId: {
              [Op.or]: [recipientId, senderId],
            },
            recipientId: {
              [Op.or]: [recipientId, senderId],
            },
          },
          include: [
            {
              model: Files,
              as: "files",
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            },
            {
              model: Users,
              as: "recipient",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
              },
            },
            {
              model: Users,
              as: "sender",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
              },
            },
          ],
          order: [["createdAt", "ASC"]],
          attributes: {
            exclude: ["updatedAt", "deletedAt", "recipientId", "senderId"],
          },
        });

        socket.emit("messages", data);
      } catch (error) {
        console.log(error);
      }
    });

    // define listener on event send message
    socket.on("send message", async (payload) => {
      try {
        const token = socket.handshake.auth.token;

        const tokenKey = process.env.JWT_SECRET;
        const verified = jwt.verify(token._j, tokenKey);

        const senderId = verified.id; //id user
        const { message, files, recipientId } = payload; // catch recipient id, message, file sent from client

        if (files.length === 0) {
          await Chats.create({
            message,
            senderId,
            recipientId,
          });

          io.to(connectedUser[recipientId]).emit("notification", {
            senderId,
            message,
          });

          io.to(socket.id)
            .to(connectedUser[recipientId])
            .emit("new message", recipientId);
        } else {
          // let fileExtensions = []; // return [.jpg, .pdf]

          // files.map((file) => {
          //   let fileExtension = path.extname(file.name);
          //   fileExtensions.push(fileExtension);
          // });

          // const filename = `${Date.now()}_${Math.floor(
          //   Math.random() * 1000
          // )}${fileExtensions}`;

          // if (files.length > 0) {
          //   await Files.bulkCreate(
          //     files.map((file) => ({ file: file.name, chatId: createdChat.id }))
          //   );
          // }

          await Chats.create({
            message,
            senderId,
            recipientId,
          });

          io.to(socket.id)
            .to(connectedUser[recipientId])
            .emit("new message", senderId, recipientId);
        }
      } catch (error) {
        console.log(error);
      }
    });

    // define listener on event send message
    socket.on("delete messages", async (ids) => {
      try {
        await Chats.destroy({
          where: {
            id: {
              [Op.in]: ids,
            },
          },
        });

        await Files.destroy({
          where: {
            chatId: {
              [Op.in]: ids,
            },
          },
        });

        io.emit("messages deleted", ids);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", async () => {
      delete connectedUser[userId];
      console.log(`User with id ${userId} disconnected`);

      try {
        const user = await Users.findByPk(userId);
        if (user.roleId === 1) {
          io.emit("super admin offline", userId);
        } else if (user.roleId === 2) {
          io.emit("admin offline", userId);
        } else if (user.roleId === 3) {
          io.emit("user offline", userId);
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
};

module.exports = socketIo;
