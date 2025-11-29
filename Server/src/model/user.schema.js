import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "UserName is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Emial is required"],
      unique: true,
      lowerCase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [6, "Password should have atleast 6 character"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    //extra info

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
    },
    // For Forgot Password Functionality
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    lastLoin: {
      type: Date,
    },
  },
  { timestamps: true }
);
