const router = require("express").Router();

const chatController = require("../controllers/chatController");
const { uploadMultipleFile } = require("../pkg/middlewares/uploadFile");
const { userAuth } = require("../pkg/middlewares/auth");

router.get("/chats", userAuth, chatController.getChats);
router.get("/chat/:id", userAuth, chatController.getChat);
router.post("/chat", userAuth, uploadMultipleFile, chatController.createChat);
router.delete("/chat/:id", userAuth, chatController.deleteChat);

module.exports = router;
