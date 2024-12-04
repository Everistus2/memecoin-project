const express = require("express");

const { requireSignIn } = require("../middlewares/authMiddleware");
const { createWallet, deposit, withdraw, trade, test} = require("../controllers/userController");

const router = express.Router();

router.post('/createWallet', requireSignIn, createWallet);
router.post('/deposit', requireSignIn, deposit);
router.post('/withdraw', requireSignIn, withdraw);
router.post('/trade', trade);
router.post('/test', requireSignIn, test);

module.exports = router;