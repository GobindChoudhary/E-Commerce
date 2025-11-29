import express from "express";
const userRouter = express.Router();

userRouter.get("/register", (req, res) => {
  res.json({ message: "hello" });
  console.log("hello");
});

export default userRouter;
