const {
    register,
    login,
    checkAuth,
  } = require("../controllers/auth");
  const { userAuth } = require("../middleware/userAuth")
  
  const auth = (router) => {
    router.post("/register", register);
    router.post("/login", login);
    router.get("/check_auth", userAuth, checkAuth);
  };
  
  module.exports = auth;
  