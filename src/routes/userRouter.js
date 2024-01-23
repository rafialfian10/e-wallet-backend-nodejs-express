const router = require("express").Router();

const userController = require("../controllers/userController");
const { uploadPhoto } = require("../pkg/middlewares/uploadFile");
const {
  superAdminAuth,
  adminAuth,
  userAuth,
} = require("../pkg/middlewares/auth");
// ------------------------------------------------------------------

router.get("/users", adminAuth, userController.getUsers);
router.get("/user/:id", userAuth, userController.getUser);
router.patch("/user/:id", userAuth, uploadPhoto, userController.updateUser );
router.delete("/user/:id", superAdminAuth, userController.deleteUser);
router.delete("/user/:id/photo", userAuth, userController.deleteUserPhoto);

module.exports = router;
