const db = require("../models");
class TagController{
  async create(req, res){
    try {
      let isAdminOrModerator = req.roles.length > 0;
      if(isAdminOrModerator){
        let tag = await db.Tag.create({
          name : req.body.name
        }).catch(err=>{throw err});
        let id = tag.id;
        res.json({status:"success", tag: {id, name:tag.name}, message:"add tag successfully"})
      }
      else{
        res.status(403).json({status: "failed", message: "you don't have privilege"})
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({status:"failed", message:"server has an error"} )
    }
  }
  async update(req, res){
    try {
      let isAdminOrModerator = req.roles.length > 0;
      if(isAdminOrModerator){
        let tag = await db.Tag.findOne({
          where: {
            id: req.body.id
          }
        }).catch(err=>{throw err});
        if(tag != null){
          tag.name = req.body.name
          await tag.save();
          res.json({status:"success", message:"update tag successfully"})
        }
        else{
          res.status(400).json({status:"failed", message:"not found tag"})
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
  async destroy(req, res){
    try {
      let isAdminOrModerator = req.roles.length > 0;
      if(isAdminOrModerator){
        let tag = await db.Tag.findOne({
          where: {
            id : req.body.id
          }
        }).catch(err=>{throw err});
        if(tag){
          await tag.destroy()
          res.json({status:"success", message:"destroy tag successfully"})
        }
        else{
          res.status(400).json({status:"failed", message:"not found tag"})
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
  async getTag(req, res){
    try {
        let data = {
          user: null,
          tag : null,
          isFollowed: false,
          statistics: {
            amountOfPublishedPosts: 0,
            amountOfFollower: 0
          },
          posts : []
        };  
        data.user = await db.User.findOne({
          where: {
            id : req.userId
          }
        }).catch(err=>{throw err});
        data.tag = await db.Tag.findOne({
          where: {
            name : req.params.name
          }
        })
        data.isFollowed = await db.FollowTag.findOne({
          where:{
            UserId : data.user.id,
            TagId : data.tag.id
          }
        }).catch(err=>{throw err})
        data.isFollowed = data.isFollowed?true:false;
        data.posts = await db.Post.findAll({
          where:{
            StatusId: 1,
          },
          include: [{
            model: db.Tag,
            where: {
              id: data.tag.id
            }
          }]
        }).catch(err=>{throw err});
        data.statistics.amountOfPublishedPosts = data.posts.length;
        data.statistics.amountOfFollower = await db.FollowTag.count({
          where: {
            TagId : data.tag.id
          }
        });
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
        res.render("tag/get_tags.ejs",data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "Server has an err" })
    }
  }
  // POST : /tag/follow
  async follow(req, res){
    try {
      if(req.body.action && req.body.tagId){
        if(req.body.action === "follow"){
          await db.FollowTag.create({
            UserId : req.userId,
            TagId : req.body.tagId
          })
          .catch(err=>{throw err});
        }
        else if(req.body.action === "unfollow"){
          await db.FollowTag.destroy({
            where: {
              UserId : req.userId,
              TagId : req.body.tagId
            },
            force: true
          })
            .catch(err=>{throw err});
        }
      }
      else{ 
        return res.status(400).json({status:"failed", message:"action or body is empty"})
      }
      res.json({status:"success", message:`${req.body.action} successfully`});
    } catch (err) {
      console.log(err);
      res.status(500).json({status:"failed", message:"server has an error"})
    }
  }
}
module.exports = new TagController();