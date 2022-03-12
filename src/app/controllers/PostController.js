const db = require("../models");
const { Op, where } = require("sequelize");
const fs = require('fs');
const slugify = require("slugify");
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
        like : null
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
  // GET: /post/edit/:slug
  editPost(req, res) {
    require("./../models").User.create({
      username: "hoanglinh",
      passwordHash : "HoangLinh@123",
      gender:"m",
      avatar: "none",
      email: "hoanglinh@gmail.com",
      dob: new Date(),
    }).catch(err=>{console.log(err);})

    // res.render("post/edit_post")
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