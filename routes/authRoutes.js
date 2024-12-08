const express = require("express");
const {registerValidator, loginValidator, updateValidator} = require("../middlewares/validationMiddleware.js")

const {
  register,
  login,
  update,
} = require("../controllers/authController.js");
const { requireSignIn } = require("../middlewares/authMiddleware.js");

// Router Object
const router = express.Router();

// REGISTER || METHOD POST
router.post("/register", registerValidator, register); 

// LOGIN || METHOD POST
router.post("/login", loginValidator, login);

// update profile
router.put("/profile", updateValidator, requireSignIn, update);

module.exports = router;
