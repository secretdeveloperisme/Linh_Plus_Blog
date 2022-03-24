const db = require("../models");
const fs = require('fs');
const slugify = require("slugify");
const {convertHierarchyComments} = require("../utils/comments.util");
// const jwt = require("jsonwebtoken");
// const authConfig = require("../config/auth.config");
class PostController {
  // GET: /post/:slug
  async getPost(req, res) {
    try {
      let data = {
        post: null,
        user: null,
        categories : null,
        tags: null,
        like : null,
        isFollow : null
      };
      data.user = await db.User.findOne({
        where: {
          id:req.userId
        }
      }).catch(err=>{console.log(err)})
      data.post = await db.Post.findOne({
        where: {
          slug: req.params.slug
        },
        include: [{
          model: db.User,
        }, {
          model: db.Category,
          attributes: ["id", "name"]
        }, {
          model: db.Tag,
          attributes: ["id", "name"]
        }],
      }).catch(err=>{console.log(err);});
      console.log(data.post);
      if(data.post != null){
        data.like = await db.Like.findOne({
          where: {
            PostId : data.post.id,
            UserId : req.userId
          }
        }).catch(err=>{throw err});
        data.amountOfLikes = await db.Like.count({
          where: {
            PostId : data.post.id,
            TypeLike : "like" 
          }
        });
        data.amountOfDisLikes = await db.Like.count({
          where: {
            PostId : data.post.id,
            TypeLike : "dislike" 
          }
        });
        data.isBookmark = await db.Bookmark.findOne({
          where: {
            PostId : data.post.id
          }
        }).catch(err=>{throw err});
        data.amountOfBookmarks = await db.Bookmark.count({
          where: {
            PostId : data.post.id
          }
        });
        data.isFollow = await db.FollowUser.findOne({
          where : {
            FollowerId : req.userId,
            UserId : data.post.User.id
          }
        })
        data.comments = await db.sequelize.query(`
          select comments.id, comments.parent_id,
            is_comment_like_by_user(comments.id,${req.userId}) as is_comment_like_by_user,
            comments.post_id, comments.content, comments.createdAt,
            users.id as user_id,users.username, users.avatar,
            count(comment_likes.comment_id) as amount_of_likes
          from
          (comments left join comment_likes on comment_likes.comment_id = comments.id) 
          inner join users on users.id = comments.user_id
          where comments.post_id = ${data.post.id}
          group by comments.id
          order by comments.id ;
        `, {type : db.Sequelize.QueryTypes.SELECT})
          .catch(err=>{throw err});
        data.comments = convertHierarchyComments(data.comments);
        data.numberOfComments = await db.Comment.count({
          where:{
            PostId : data.post.id
          }
        })
      }
      res.render("post/get_post", data)
    } catch (error) {
      console.log(error);
      res.status(404).json({status:"failed", message:"you have an err"});
    }
  }
  // GET: /post/write/
  writePost(req, res) {
    db.User.findOne({
      where: {
        id: req.userId
      }
    })
      .then(user => {
        db.Category.findAll()
          .then(categories => {
            res.render("post/write_post", { user, categories });
          })
          .catch(err => {
            res.render("post/write_post", { user: null });
          })
      })
      .catch(err => {
        res.render("site/home", { user: null })
      })
  }
  // POST: /post/write
  async uploadPost(req, res) {
    console.log(req.body);
    if (req.body.title && req.body.description && req.body.content && req.body.status && req.userId) {
      try {
        console.log(req.body);
        db.sequelize.transaction(async t => {
          let status = await db.Status.findOne({
            where: {
              name: req.body.status
            }
          })
          let post = db.Post.build({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            slug: slugify(req.body.title, "_"),
            image: req.body.imagePath,
            UserId: req.userId,
            StatusId: status.id
          });
          post = await post.save({ transaction: t }).catch(err=>{
            console.log(err);
          })
          let categories = db.Category.bulkBuild([...req.body.categories].map((value, index) => {
            return { id: value };
          }));
          // console.log(categories);
          await post.setCategories(categories, { transaction: t }).catch(err => {
            console.log(err);
          })

          // insert tags 
          for (let value of req.body.tags) {
            try {
              let [tag, isFound] = await db.Tag.findOrCreate({
                where: {
                  name: value
                }
              });
              let tagDB = await post.addTags(tag, { transaction: t });
            }
            catch (err) {
              throw err;
            }
          }
        })
        res.status(200).json({ status: "success", message: "upload post successfully" })
      }
      catch (err) {
        console.log(err);
        res.status(500).json({ status: "failed", message: "upload post failed" })
      }
    }

  }
  // get: /post/edit/:slug
  editPost(req, res) {
   // res.render("post/edit_post")
  }
  // DELETE /post
  async deletePost(req, res){
    try{
      if(req.body.id){
        let post = await db.Post.findOne({
          where: {
            id : req.body.id
          }
        }).catch(err=>{ throw err });
        if(post.UserId == req.userId){
          await post.destroy().catch(err=>{throw err});
          res.json({status:"success", message:"delete post successfully"});
        }
        else
          res.json({status:"failed", message:"you are not post's owner"});
      }
      else
        res.status(400).json({status:"failed", message:"post id is empty"})
    }
    catch(err){
      console.log(err);
      res.status(500).json({status:"failed", message:"Server has an err"})
    }
  }
  // POST : /post/handle_action
  async handleAction(req, res){
    try{
      if(req.body.action === "delete"){
        if(req.body.postIds){
          let posts = await db.Post.findAll({
            where : {
              id : {
                [db.Sequelize.Op.in] : req.body.postIds 
              }
            }
          }).catch(err=>{ throw err });
          let isValidOwner = posts.every(post=>post.UserId == req.userId);
          if(isValidOwner){
            posts.forEach(async post=>{
              await post.destroy().catch(err=>{ throw err });
            })
            res.json({status:"success", message:"delete posts successfully"});
          }
          else
            res.status(400).json({status:"failed", message:"some posts's owner are invalid owner"});
        }
      }
      else{
        res.status(400).json({status:"failed", message:"action is invalid"});
      }
    }
    catch(err){
      console.log(err);
      res.status(500).json({status:"failed", message:"Server has an err"})
    }
  } 
  // POST : /post/image/
  uploadImage(req, res) {
    if (req.file) {
      let targetDir = "/images/posts/" + req.userId;
      res.status(200).json({ status: "success", message: "upload post image successfully", "imagePath": `${targetDir}/${req.file.filename}` });
    }
    else {
      res.status(500).json({ status: "failed", message: "upload post image failed" });
    }
  }


}
module.exports = new PostController();