const db = require("../models");
const fs = require('fs');
class PostController{
  // GET: /post/write/
  writePost(req, res){
    db.User.findOne({
      where: {
        id : req.userId
      }
    })
    .then(user=>{
      db.Category.findAll()
      .then(categories=>{
        res.render("post/write_post", {user, categories});
      })
      .catch(err=>{
        res.render("post/write_post", {user:null});
      })
    })
    .catch(err=>{
      res.render("site/home", {user:null})
    })
  }
  // GET: /post/edit/:slug
  editPost(req, res){
    res.render("post/edit_post")
  }
  // POST : /post/image/
  uploadImage(req, res){
    if(req.file){
      let targetDir = "/images/posts/"+req.userId;
      res.status(200).json({status:"success", message:"upload post image successfully","imagePath":`${targetDir}/${req.file.filename}`});
    }
    else{
      res.status(500).json({status:"failed", message:"upload post image failed"});
    }
  }
}
module.exports = new PostController();