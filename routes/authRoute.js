import express from "express";
import {
  registerController,
  loginController,
  updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// Router Object
const router = express.Router();

// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || METHOD POST
router.post("/login", loginController);

// update profile
router.put("/profile", requireSignIn, updateProfileController);

export default router;
