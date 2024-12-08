const express = require("express");

const { requireSignIn } = require("../middlewares/authMiddleware");
const { createWallet, deposit, withdraw, tradeIn, test} = require("../controllers/userController");

const router = express.Router();

router.post('/createWallet', requireSignIn, createWallet);
router.post('/deposit', requireSignIn, deposit);
router.post('/withdraw', requireSignIn, withdraw);
router.post('/trade-in', tradeIn);
router.post('/test', requireSignIn, test);

module.exports = router;