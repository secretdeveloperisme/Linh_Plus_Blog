const db = require("../models");
class ReactionController{
  // POST /reactions
  async index(req,res){
    try {
      if(req.body.type === "like"){
        let isLike =  true;
        let [like, initialized] = await db.Like.findOrBuild({
          where:{
            PostId : req.body.postId,
            UserId : req.userId,
          }
        }).catch(err=>{ console.log(err);throw new Error();});
        console.log(like, initialized);
        if(initialized == false){
          if(like.TypeLike == "like"){
            await like.destroy({force:true});
            isLike = false;
          }else{
            like.TypeLike = "like";
            await like.save().catch(err=>{throw err})
          }
        }
        else{
          like.TypeLike = "like";
          await like.save().catch(err => {throw err})
        }
        let amountOfLikes = await db.Like.count({
          where: {
            PostId : req.body.postId,
            TypeLike : "like" 
          }
        });
        let amountOfDisLikes = await db.Like.count({
          where: {
            PostId : req.body.postId,
            TypeLike : "dislike" 
          }
        });
        return res.json({status:"success", message:"like successfully", isLike, amountOfLikes,amountOfDisLikes})
      }
      if(req.body.type === "dislike"){
        let isDisLike =  true;
        let [like, initialized] = await db.Like.findOrBuild({
          where:{
            PostId : req.body.postId,
            UserId : req.userId,
          }
        }).catch(err=>{ console.log(err);throw new Error();});
        if(initialized == false){
          if(like.TypeLike == "dislike"){
            await like.destroy({force:true});
            isDisLike = false;
          }else{
            like.TypeLike = "dislike";
            await like.save().catch(err=>{throw err});
          }
        }
        else{
          like.TypeLike = "dislike";
          await like.save().catch(err => {throw err})
        }
        let amountOfLikes = await db.Like.count({
          where: {
            PostId : req.body.postId,
            TypeLike : "like" 
          }
        });
        let amountOfDisLikes = await db.Like.count({
          where: {
            PostId : req.body.postId,
            TypeLike : "dislike" 
          }
        });
        return res.json({status:"success", message:"like successfully", isDisLike, amountOfLikes,amountOfDisLikes})
      }
      if(req.body.type === "bookmark"){
        let isBookmark =  true;
        let [like, initialized] = await db.Bookmark.findOrBuild({
          where:{
            PostId : req.body.postId,
            UserId : req.userId,
          }
        }).catch(err=>{throw err});
        if(initialized){
          await like.save().catch(err=>{throw err});
        }
        else{
          await like.destroy().catch(err=>{throw err})
          isBookmark = false;
        }
        let amountOfBookmarks = await db.Bookmark.count({
          where: {
            PostId : req.body.postId,
          }
        });
        return res.json({status:"success", message:"bookmark successfully", isBookmark, amountOfBookmarks})
      }
      res.json({status:"success", message:"created"});
    } catch (err) {
      console.log(err);
      res.status(500).json({status:"failed", message:"Server has an error"})
    }
  }
}
module.exports = new ReactionController();