const express = require('express');
const router = express.Router();
const meController = require("../app/controllers/MeController");
const {verifyToken} = require("../app/middlewares/AuthJWT");
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,"src/public/images/avatars");
  },
  filename: function(req, file, cb){
    console.log(file);
    let now = new Date();
    let originalName = file.originalname.substring(0, file.originalname.lastIndexOf("."))
    let ext =  file.originalname.substring(file.originalname.lastIndexOf(".")+1, file.originalname.length);
    console.log(originalName, ext,file.originalname);
    const uniqueSuffix = originalName+"_"+now.getMonth()+now.getDate()+now.getFullYear()+"T"+now.getHours()+now.getMinutes()+now.getSeconds();
    cb(null,uniqueSuffix+"."+ext);
  }
})
const upload = multer({storage: storage})

router.post("/upload/avatar", upload.single("avatar"),meController.uploadAvatar);
router.get("/posts",verifyToken, meController.getPost);
router.get("/trash/posts", verifyToken, meController.getTrash);
router.get("/following_users", verifyToken, meController.getFollowUser);
router.get("/tags",verifyToken, meController.getTag);

module.exports = router;