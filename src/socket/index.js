const { Users, Roles, Balances, Chats } = require("../../database/models");
const jwt = require("jsonwebtoken");

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

  io.on("connection", (socket) => {
    // console.log(socket.id);

    // get user connected id
    const userId = socket.handshake.query.id;

    // save to connectedUser
    connectedUser[userId] = socket.id;

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
    socket.on("load user contact", async () => {
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
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "deletedAt",
                  "recipientId",
                  "senderId",
                ],
              },
            },
            {
              model: Chats,
              as: "senderMessage",
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "deletedAt",
                  "recipientId",
                  "senderId",
                ],
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

        socket.emit("user contact", userContacts);
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
            exclude: [
              "createdAt",
              "updatedAt",
              "deletedAt",
              "recipientId",
              "senderId",
            ],
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
        const { message, file, recipientId } = payload; // catch recipient id and message sent from client

        await Chats.create({
          message,
          file,
          senderId,
          recipientId,
        });

        // emit to just sender and recipient default rooms by their socket id
        io.to(socket.id)
          .to(connectedUser[recipientId])
          .emit("new message", recipientId);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnect");
    });
  });
};

module.exports = socketIo;
