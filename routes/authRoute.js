const express = require("express");

const {
  registerController,
  loginController,
  updateProfileController,
} = require("../controllers/authController.js");
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware.js");

// Router Object
const router = express.Router();

// REGISTER || METHOD POST
router.post("/register", registerController); 

// LOGIN || METHOD POST
router.post("/login", loginController);

// update profile
router.put("/profile", requireSignIn, updateProfileController);

module.exports = router;
