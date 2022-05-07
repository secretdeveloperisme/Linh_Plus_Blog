const db = require("../models");
const bcryptjs = require("bcryptjs");
class UserController{
  async getUser(req, res){
    try {
        let data = {
          user: null,
          targetUser: null,
          isFollowed: false,
          statistics: {
            amountOfPublishedPosts: 0,
            amountOfWrittenComments: 0,
            amountOfFollowedTags: 0
          },
          posts : []
        };  
        data.user = await db.User.findOne({
          where: {
            id : req.userId
          }
        }).catch(err=>{throw err});
        data.targetUser = await db.User.findOne({
          where: {
            username : req.params.username
          }
        }).catch(err=>{throw err});
        data.isFollowed = await db.FollowUser.findOne({
          where:{
            FollowerId : data.user.id,
            UserId : data.targetUser.id
          }
        }).catch(err=>{throw err})
        data.isFollowed = data.isFollowed?true:false;
        data.statistics.amountOfPublishedPosts = await db.Post.count({
          where:{
            UserId : data.targetUser.id,
            StatusId: 1 
          }
        }).catch(err=>{throw err});
        data.statistics.amountOfWrittenComments = await db.Comment.count({
          where:{
            UserId : data.targetUser.id,
          }
        }).catch(err=>{throw err});
        data.statistics.amountOfFollowedTags = await db.FollowTag.count({
          where:{
            UserId : data.targetUser.id
          }
        })
        data.posts = await db.Post.findAll({
          where: {
            UserId : data.targetUser.id,
            StatusId: 1 
          }
        })
        for(let post of data.posts){
          post["user"] = await db.User.findOne({
            where: {
              id : post.UserId
            }
          }).catch(err=>{throw err});
          post["tags"] = await post.getTags();
          post["numberOfReactions"] = await db.Like.count({
            where: {
              PostId : post.id
            }
          }).catch(err=>{throw err});
          post["numberOfComments"]= await db.Comment.count({
            where: {
              PostId : post.id
            }
          }).catch(err=>{throw err});
        }
        console.log(data.posts);
        res.render("user/get_user.ejs",data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "Server has an err" })
    }
  }
  async editUser(req, res){
    try {
      let data = {
        user: null
      }
      data.user = await db.User.findOne({
        where:{
          id : req.userId
        }
      }).catch(err=>{throw err});
      res.render("user/edit_user", data)
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "Server has an err" })
    }
  }
  async updateUser(req, res){
    try {
      if(req.body.username){
        let user = await db.User.findOne({
          where: {
            id : req.userId
          }
        }).catch(err=>{throw err});
        user.username = req.body.username;
        user.gender = req.body.gender || user.gender;
        user.avatar = req.body.avatarPath || user.avatar;
        user.email = req.body.email || user.email;
        user.dob = req.body.dob || user.dob;
        user.biography = req.body.biography || user.biography;
        user.address = req.body.address || user.address;
        await user.save().catch(err=>{throw err})
        res.json({status:"success", message:"update user successfully"})
      }
      else{
        res.status(400).json({status:"failed", message:"username is empty "} )
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "Server has an err" })
    }
  }
  async changePassword(req, res){
    try {
      if(!req.body.oldPassword){
        return res.status(400).json({status:"failed", message:"old password is empty"})
      }
      if(!req.body.newPassword){
        return res.status(400).json({status:"failed", message:"new password is empty"})
      }
      let user = await db.User.findOne({
        where: {
          id : req.userId
        }
      }).catch(err=>{throw err});
      if(!bcryptjs.compareSync(req.body.oldPassword, user.passwordHash)){
        return res.status(400).json({status:"failed", message:"your old password is not the same"})
      }
      user.passwordHash = req.body.newPassword;
      await user.save().catch(err=>{throw err});
      res.json({status: "success", "message": "update password successfully"})
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "Server has an err" })
    }
  }
  async destroy(req, res){
    try {
      let isAdminOrModerator = req.roles.length > 0;
      if(isAdminOrModerator){
        let user = await db.User.findOne({
          where: {
            id : req.body.id
          }
        }).catch(err=>{throw err});
        if(user){
          await user.destroy()
          res.json({status:"success", message:"destroy user successfully"})
        }
        else{
          res.status(400).json({status:"failed", message:"not found user"})
        }
      }
      else{
        res.status(403).json({status: "failed", message: "you don't have privilege"})
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({status:"failed", message:"server has an error"} )
    }
  }
}
module.exports = new UserController();