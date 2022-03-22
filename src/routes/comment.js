const express = require("express");
const router = express.Router();
const {verifyToken} = require("../app/middlewares/AuthJWT");
const commentController = require("../app/controllers/CommentController"); 

router.post("/create", verifyToken, commentController.create);
router.post("/like", verifyToken, commentController.like);
router.patch("/", verifyToken, commentController.edit);
router.delete("/", verifyToken, commentController.delete);
module.exports = router;
