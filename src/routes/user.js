const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/UserController");
const {verifyToken} = require("../app/middlewares/AuthJWT");

router.get("/:username",verifyToken, userController.getUser);

module.exports = router;