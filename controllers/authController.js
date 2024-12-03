import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

const saltRounds = 10;

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name) {
      return res.send({ message: "Name Is Required!" });
    }
    if (!email) {
      return res.send({ message: "Email Is Required!" });
    }
    if (!password) {
      return res.send({ message: "Password Is Required!" });
    }
    if (!phone) {
      return res.send({ message: "Phone Number Is Required!" });
    }

    // Check User
    const existingUser = await userModel.findOne({ email });

    // Existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered, please login",
      });
    }

    // Register User
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save
    const user = await new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

// POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check User
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    // password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 character long" });
    }

    const hashedPassword = password ? await bcrypt.hash(password, saltRounds) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile update successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

