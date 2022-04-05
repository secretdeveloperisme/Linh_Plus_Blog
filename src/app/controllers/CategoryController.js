const db = require("../models");
class CategoryController{
  async getCategory(req, res){
    try {
        let data = {
          user: null,
          category : null,
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
        data.category = await db.Category.findOne({
          where: {
            name : req.params.name
          }
        })
        if(!data.category)
          return res.json({status:"failed", message:"no such category"})
        data.posts = await db.Post.findAll({
          where:{
            StatusId: 1,
          },
          include: [{
            model: db.Category,
            where: {
              id: data.category.id
            }
          }]
        }).catch(err=>{throw err});
        data.statistics.amountOfPublishedPosts = data.posts.length;
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
        res.render("category/get_category.ejs",data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "Server has an err" })
    }
  }
  // POST : /tag/follow
  // async follow(req, res){
  //   try {
  //     if(req.body.action && req.body.tagId){
  //       if(req.body.action === "follow"){
  //         await db.FollowTag.create({
  //           UserId : req.userId,
  //           TagId : req.body.tagId
  //         })
  //         .catch(err=>{throw err});
  //       }
  //       else if(req.body.action === "unfollow"){
  //         await db.FollowTag.destroy({
  //           where: {
  //             UserId : req.userId,
  //             TagId : req.body.tagId
  //           },
  //           force: true
  //         })
  //           .catch(err=>{throw err});
  //       }
  //     }
  //     else{ 
  //       return res.status(400).json({status:"failed", message:"action or body is empty"})
  //     }
  //     res.json({status:"success", message:`${req.body.action} successfully`});
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({status:"failed", message:"server has an error"})
  //   }
  // }
}
module.exports = new CategoryController();