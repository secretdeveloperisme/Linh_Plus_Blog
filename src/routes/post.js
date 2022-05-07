const express = require("express");
const router = express.Router();
const postController = require("../app/controllers/PostController");
const {verifyToken, checkHavePrivilege} = require("../app/middlewares/AuthJWT");
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    let targetDir = "src/public/images/posts/"+req.userId;
    if(!fs.existsSync(targetDir))
      fs.mkdirSync(targetDir,(err)=>{
        if(err)
          res.status(500).json({status:"failed", message:"can not create user folder"});
        else
          cb(null,targetDir);
      })
    else
      cb(null,targetDir);
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
router.delete("/", verifyToken, postController.deletePost);
router.patch("/restore", verifyToken, postController.restorePost);
router.delete("/destroy", verifyToken,checkHavePrivilege, postController.destroyPost);
router.post("/handle_action",verifyToken,checkHavePrivilege, postController.handleAction);
router.get("/write",verifyToken,postController.writePost);
router.post("/write",verifyToken, postController.uploadPost);
router.get("/edit/:slug",verifyToken, postController.editPostUI);
router.patch("/", verifyToken, postController.updatePost);
router.post("/image", [verifyToken, upload.single("image")],postController.uploadImage);
router.get("/get_all_posts", postController.getAllPostsPerPage);
router.get("/get_followed_posts", verifyToken,postController.getFollowedPostByPage);
router.get("/:slug",verifyToken ,postController.getPost);

module.exports = router;