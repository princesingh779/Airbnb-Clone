const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");

// for login
authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
// for logout
authRouter.post("/logout", authController.postLogout);
// for signup
authRouter.get("/signup", authController.getSignup);
authRouter.post("/signup", authController.postSignup);

module.exports = authRouter;
