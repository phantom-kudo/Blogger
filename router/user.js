const express = require("express");
const userRouter = express.Router();
const { signUp, signIn } = require("../controller/user");

userRouter.post("/sign-up", signUp);
userRouter.post("/sign-in", signIn);

module.exports = userRouter;
