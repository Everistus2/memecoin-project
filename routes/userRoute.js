import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware";
import { createWallet, deposit, withdraw, trade} from "../controllers/userController";

const router = express.Router();

router.post('/createWallet', requireSignIn, createWallet);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/trade', trade);

export default router;