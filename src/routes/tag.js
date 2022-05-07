const express = require("express");
const router = express.Router();
const tagController = require("../app/controllers/TagController");
const {verifyToken, checkHavePrivilege} = require("../app/middlewares/AuthJWT");

router.post("/create",verifyToken, checkHavePrivilege, tagController.create);
router.patch("/update",verifyToken, checkHavePrivilege, tagController.update);
router.delete("/destroy",verifyToken, checkHavePrivilege, tagController.destroy);
router.post("/follow",verifyToken, tagController.follow);
router.get("/:name",verifyToken, tagController.getTag);

module.exports = router;