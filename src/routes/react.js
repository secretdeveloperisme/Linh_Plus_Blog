const express = require('express');
const router = express.Router();
const reactionController = require("../app/controllers/ReactionController");
let {verifyToken} = require("../app/middlewares/AuthJWT");

router.post("/",verifyToken, reactionController.index);

module.exports = router;