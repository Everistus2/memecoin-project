const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel.js");

// Protected Route Token Base

const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// Admin Access
const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (user.role !== 1) {
      res.status(401).send({
        success: false,
        message: "UnAuthroized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};

module.exports = {
  requireSignIn,
  isAdmin
}
