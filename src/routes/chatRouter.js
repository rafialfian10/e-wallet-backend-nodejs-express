const router = require("express").Router();

const chatController = require("../controllers/chatController");
const { uploadSingleFile } = require("../pkg/middlewares/uploadFile");
const { userAuth } = require("../pkg/middlewares/auth");

router.get("/chats", userAuth, chatController.getChats);
router.get("/chat/:id", userAuth, chatController.getChat);
router.post("/chat", userAuth, uploadSingleFile, chatController.createChat);
router.delete("/chat/:id", userAuth, chatController.deleteChat);

module.exports = router;
