const express = require('express');
const router = express.Router();
const categoryController = require("../app/controllers/CategoryController");
const {verifyToken, checkHavePrivilege} = require("../app/middlewares/AuthJWT");

router.post("/create",verifyToken, checkHavePrivilege, categoryController.create);
router.patch("/update",verifyToken, checkHavePrivilege, categoryController.update);
router.delete("/destroy",verifyToken, checkHavePrivilege, categoryController.destroy);
router.get("/:name", verifyToken, categoryController.getCategory);

module.exports = router;