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
  async create(req, res){
    try {
      let isAdminOrModerator = req.roles.length > 0;
      if(isAdminOrModerator){
        let category = await db.Category.create({
          name : req.body.name
        }).catch(err=>{throw err});
        let id = category.id;
        res.json({status:"success", category: {id, name:category.name}, message:"add category successfully"})
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
        let category = await db.Category.findOne({
          where: {
            id: req.body.id
          }
        }).catch(err=>{throw err});
        if(category != null){
          category.name = req.body.name
          await category.save();
          res.json({status:"success", message:"update category successfully"})
        }
        else{
          res.status(400).json({status:"failed", message:"not found category"})
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
        let category = await db.Category.findOne({
          where: {
            id : req.body.id
          }
        }).catch(err=>{throw err});
        if(category){
          await category.destroy()
          res.json({status:"success", message:"destroy category successfully"})
        }
        else{
          res.status(400).json({status:"failed", message:"not found category"})
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
module.exports = new CategoryController();