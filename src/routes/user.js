const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/UserController");
const {verifyToken, checkHavePrivilege} = require("../app/middlewares/AuthJWT");

router.patch("/update/password", verifyToken, userController.changePassword);
router.patch("/update",verifyToken,userController.updateUser);
router.get("/edit", verifyToken, userController.editUser);
router.delete("/destroy", verifyToken, checkHavePrivilege, userController.destroy);
router.get("/:username",verifyToken, userController.getUser);

module.exports = router;