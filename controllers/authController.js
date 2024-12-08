const userModel = require("../models/userModel.js");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Check User
    const existingUser = await userModel.findOne({ email });

    // Existing user
    if (existingUser) {
      return res.status(424).send({
        message: "Already registered, please login",
      });
    }

    // Register User
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save
    const user = await new userModel({
      username,
      email,
      phone,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in registration",
      error,
    });
  }
};

// POST LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check User
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send({
        message: "Email is not registered",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).send({
        message: "Invalid Password",
      });
    }

    // Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      message: "Login successfully",
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in login",
      error,
    });
  }
};

// update profile
const update = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    // password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 character long" });
    }

    const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        username: username || user.username,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
      },
      { new: true }
    );

    res.status(200).send({
      message: "Profile update successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error while updating profile",
      error,
    });
  }
};

module.exports = {
  register,
  login,
  update,
};
