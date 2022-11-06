const express = require("express");
const { sign_user_up, login_user } = require("../controller/user");
const userRouter = express.Router();
userRouter.post("/signup", sign_user_up);
userRouter.post("/login", login_user);

module.exports = userRouter;
