const db = require("../models");

class CommentController{
  async create(req, res){
    try {
      console.log(req.body);
      if(req.body.postId && req.body.content){
        let parentId = req.body.parentId || null;
        let comment = await db.Comment.create({
          PostId: req.body.postId, 
          UserId : req.userId,
          CommentId: parentId, 
          content : req.body.content
        })
          .catch(err=>{throw err});
        let commentOwner = await db.User.findOne({
          where: {
            id: comment.UserId
          }
        })
          .catch(err=>{throw err})
        let post = await db.Post.findOne({
          where: {
            id : comment.PostId
          }
        })
          .catch(err=>{throw err});
        res.json({
          status:"success",
          message:"create comment successfully",
          comment: {
            id: comment.id,
            parentId : comment.CommentId,
            createdAt: comment.createdAt,
            content : comment.content
          },
          commentOwner,
          post
        })
      } 
      else{ 
        res.status(400).json({status:"failed", message:"postId or content is empty!"})
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({status:"failed", message: "server has an error"})
    }
  } 
  async like(req, res){
    try {
      if(req.body.commentId){
        if(req.body.type === "like"){
          await db.CommentLike.create({
            CommentId : req.body.commentId, 
            UserId : req.userId,
            TypeLike : "like"
          })
            .catch(err=>{throw err});
        }else if(req.body.type === "unlike"){
          await db.CommentLike.destroy({
            where: {
              CommentId : req.body.commentId,
            },
            force: true
          })
            .catch(err=>{throw err});
        }
        let amountOfCommentLikes = await db.CommentLike.count({
          where: {
            CommentId: req.body.commentId
          }
        })
          .catch(err=>{throw err})
        res.status(200).json({status:"success", message:`${req.body.type} comment ${req.body.commentId} successfully`, amountOfCommentLikes});
      }
      else{
        res.status(400).json({status:"failed", message:"comment id is empty"});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({status:"failed", message:"server has an error"});
    }
  }
  // [PATCH] /comment
  async edit(req, res){
    try {
      if(req.body.commentId){
        let comment = await db.Comment.findOne({
          where: {
            id : req.body.commentId
          }
        })
          .catch(err=>{throw err});
        comment.content = req.body.content;
        console.log(comment);
        await comment.save()
          .catch(err=>{throw err})
        res.json({status:"success", message:`update comment ${req.body.commentId} successfully`});
      }
      else{
        res.status(400).json({status:"failed", message:" comment id is empty"})
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({status:"failed", message:"server has an error"})
    }
  }
  async delete(req, res){
    try {
      if(req.body.commentId){
        let comment = await db.Comment.findOne({
          where: {
            id : req.body.commentId
          }
        })
          .catch(err=>{throw err});
        if(comment.UserId === req.userId){
          await comment.destroy({force: true})
            .catch(err=>{throw err});
          res.json({status: "success", message: "remove comment successfully"});
        }
        else{
          res.status(400).json({status: "failed", message: "You do not comment owner"})
        }
      }
      else{
        res.status(400).json({status:"failed", message:"comment id is empty"})
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({status:"failed", message:"server has an error"})
    }
  }
}

module.exports = new CommentController();