import userModel from "../model/user.schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SALTVALUE = 10;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerController = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // basic guard (optional)
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "userName, email and password are required",
      });
    }

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be strong (8+ chars, upper, lower, number, symbol)",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALTVALUE);

    const user = await userModel.create({
      userName,
      email,
      password: hashedPassword,
    });
    // const protectedUser = user.toObject();
    // delete protectedUser.password;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({
      status: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    // Validation error
    if (error.name === "ValidationError") {
      let errors = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    // Duplicate error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      const value = error.keyValue ? error.keyValue[field] : "";
      return res.status(400).json({
        success: false,
        message: `The ${field} "${value}" is already registered. Please use another ${field}.`,
      });
    }

    // Default
    return res.status(500).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      status: true,
      message: "Login successfull",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

export const logoutController = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS in production
    sameSite: "lax",
    path: "/", // VERY IMPORTANT for correct cookie deletion
  });

  res.status(200).json({
    status: false,
    message: "Logged out successfully",
  });
};
