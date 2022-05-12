const express = require('express');
const router = express.Router();
const adminController = require("../app/controllers/AdminController");
const {isAdminOrModerator,verifyToken, checkHavePrivilege} = require("../app/middlewares/AuthJWT")

router.get("/", verifyToken, isAdminOrModerator, adminController.dashboard);
router.get("/posts", verifyToken, isAdminOrModerator, adminController.posts);
router.get("/tags", verifyToken, isAdminOrModerator, adminController.tags);
router.get("/users", verifyToken, isAdminOrModerator, adminController.users);
router.get("/categories", verifyToken, isAdminOrModerator, adminController.categories);

module.exports = router;