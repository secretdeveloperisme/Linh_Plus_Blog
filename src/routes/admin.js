const express = require('express');
const router = express.Router();
const adminController = require("../app/controllers/AdminController");
const {isAdminOrModerator,verifyToken} = require("../app/middlewares/AuthJWT")

router.get("/dashboard", verifyToken, isAdminOrModerator, adminController.dashboard);

module.exports = router;