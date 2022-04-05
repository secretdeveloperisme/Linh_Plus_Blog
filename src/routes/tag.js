const express = require("express");
const router = express.Router();
const tagController = require("../app/controllers/TagController");
const {verifyToken} = require("../app/middlewares/AuthJWT");

router.post("/follow",verifyToken, tagController.follow);
router.get("/:name",verifyToken, tagController.getTag);

module.exports = router;