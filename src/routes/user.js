const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    deleteUserPhoto,
  } = require("../controllers/user");
  const { userAuth } = require("../middleware/userAuth");
  const { uploadFile } = require("../middleware/uploadFile")
  
  const user = (router) => {
    router.get("/users", userAuth, getUsers);
    router.get("/user/:id", userAuth, getUser);
    router.patch("/user/:id", userAuth, uploadFile("photo"), updateUser);
    router.delete("/user/:id", userAuth, deleteUser);
    router.delete("/user/:id/photo", userAuth, deleteUserPhoto);
  };
  
  module.exports = user;
  