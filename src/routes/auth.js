const express = require("express");
const router = express.Router();
const {isExistentEmailOrUserNameOrPhone} = require("../app/middlewares/VerifySignup");
const authController = require("../app/controllers/AuthController"); 

router.post("/login",authController.login);
router.post("/signup", isExistentEmailOrUserNameOrPhone, authController.signUp);

module.exports = router;
