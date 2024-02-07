const router = require("express").Router();

const transactionController = require("../controllers/transactionController");
const {
  superAdminAuth,
  adminAuth,
  userAuth,
} = require("../pkg/middlewares/auth");

router.get("/transactions-by-admin", adminAuth, transactionController.getTransactionsByAdmin);
router.get("/transactions-by-user", userAuth, transactionController.getTransactionsByUser);
router.get("/transaction/:id", userAuth, transactionController.getTransaction);
router.post("/topup", userAuth, transactionController.topupTransaction );
router.post("/transfer", userAuth, transactionController.transferTransaction );
router.delete("/transaction/:id", superAdminAuth, transactionController.deleteTransaction);

module.exports = router;
