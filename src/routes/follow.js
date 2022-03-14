const express = require("express");
const router = express.Router();
const {verifyToken} = require("../app/middlewares/AuthJWT");
const followController = require("../app/controllers/FollowController");

router.post("/", verifyToken, followController.follow);

module.exports = router;