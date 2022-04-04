const db = require("../models");
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
}
module.exports = new UserController();