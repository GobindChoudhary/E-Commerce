import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: [true, "UserName is required"],
      minlength: [3, "username should atleast contain 3 character"],
      maxlength: [20, "username should be of atmost 20 character"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowerCase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [6, "Password should have atleast 6 character"],
      select: false,
      trim: true,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be strong (8+ chars, upper, lower, number, symbol)",
      ],
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
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // obj is orignal object(not modify) ret returned obj (modyfy)
        delete ret.password; // remove password
        delete ret.__v; // remove mongoose version key
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
