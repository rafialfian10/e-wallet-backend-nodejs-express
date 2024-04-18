const router = require("express").Router();

const authController = require("../controllers/authController");
const { userAuth, adminAuth } = require("../pkg/middlewares/auth");

router.post("/register", authController.register);
router.post("/register-admin", adminAuth, authController.register);
router.post("/login", authController.login);
router.get("/checkauth", userAuth, authController.checkAuth);
router.post("/resend-otp", authController.resendOtp);
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
