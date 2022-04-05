const express = require('express');
const router = express.Router();
const categoryController = require("../app/controllers/CategoryController");
const {verifyToken} = require("../app/middlewares/AuthJWT");
router.get("/:name", verifyToken, categoryController.getCategory);

module.exports = router;