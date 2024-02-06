const router = require("express").Router();

const balanceController = require("../controllers/balanceController");
const {
  superAdminAuth,
  adminAuth,
  userAuth,
} = require("../pkg/middlewares/auth");

router.get("/balances", adminAuth, balanceController.getBalances);
router.get("/balance/:id", userAuth, balanceController.getBalance);
router.patch("/balance/:id", userAuth, balanceController.updateBalance );
router.delete("/balance/:id", superAdminAuth, balanceController.deleteBalance);

module.exports = router;
