import userModel from "../model/user.schema.js";

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

    const user = await userModel.create({ userName, email, password });
    // const protectedUser = user.toObject();
    // delete protectedUser.password;

    res.status(201).json({
      status: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error.name);
    // Validation error
    if (error.name === "ValidationError") {
      let errors = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    // Duplicate error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      const value = error.keyValue ? error.keyValue[field] : "";
      return res.status(400).json({
        success: false,
        message: `${field} ${value} already exists, try another email `,
      });
    }

    // Default
    return res.status(500).json({ message: error.message });
  }
};
