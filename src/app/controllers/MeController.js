const db = require("../models");
class MeController {
  uploadAvatar(req, res) {
    if (req.file) {
      res.status(200).json({ status: "success", filename: `/images/avatars/${req.file.filename}` });
    }
    else {
      res.status(500).json({ status: "failed", "message": "upload image unsuccessfully" });
    }
  }
  async getPost(req, res) {
    try {
      let data = {
        user: null,
        posts : null,
        amounts:{
          posts: 0,
          tags: 0,
          following_users: 0,
          trash_posts: 0
        }
      }
      data.user = await db.User.findOne({
        where: {
          id: req.userId
        }
      }).catch(err => { throw err })
      data.amounts.posts = await db.Post.count({
        where: {
          UserId : req.userId
        }
      }).catch(err=>{throw err});
      data.amounts.tags = await db.Tag.count({
        
      }).catch(err=>{throw err});
      data.amounts.following_users = await db.FollowUser.count({
        where: {
          FollowerId : req.userId
        }
      }).catch(err=>{throw err});
      
      data.amounts.trash_posts = await db.Post.count({
        paranoid: false,
        where:{
          UserId: req.userId,
          DeletedAt : {
            [db.Sequelize.Op.ne]: null
          }
        }
      }).catch(err=>{throw err});
      data.posts = await db.Post.findAll({
        where: {
          UserId : req.userId,
        }
      })
        .catch(err => { throw err });
      res.render("me/posts", data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "server has an err" })
    }
  }
  async getTrash(req, res) {
    try {
      let data = {
        user: null,
        posts : null,
        amounts:{
          posts: 0,
          tags: 0,
          following_users: 0,
          trash_posts: 0
        }
      }
      data.user = await db.User.findOne({
        where: {
          id: req.userId
        }
      }).catch(err => { throw err })
      data.amounts.posts = await db.Post.count({
        where: {
          UserId : req.userId
        }
      }).catch(err=>{throw err});
      data.amounts.tags = await db.Tag.count({
        
      }).catch(err=>{throw err});
      data.amounts.following_users = await db.FollowUser.count({
        where: {
          FollowerId : req.userId
        }
      }).catch(err=>{throw err});
      
      data.amounts.trash_posts = await db.Post.count({
        paranoid: false,
        where:{
          UserId: req.userId,
          DeletedAt : {
            [db.Sequelize.Op.ne]: null
          }
        }, 
      }).catch(err=>{throw err});
      data.posts = await db.Post.findAll({
        paranoid: false,
        where: {
          UserId : req.userId,
          DeletedAt : {
            [db.Sequelize.Op.ne]: null
          }
        }
      })
        .catch(err => { throw err });
      res.render("me/trash_posts", data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "server has an err" })
    }
  }
  async getFollowUser(req, res){
    try {
      let data = {
        user: null,
        following_users: null,
        amounts:{
          posts: 0,
          tags: 0,
          following_users: 0,
          trash_posts: 0
        }
      }
      data.user = await db.User.findOne({
        where: {
          id: req.userId
        }
      }).catch(err => { throw err })
      data.amounts.posts = await db.Post.count({
        where: {
          UserId : req.userId
        }
      }).catch(err=>{throw err});
      data.amounts.tags = await db.Tag.count({
        
      }).catch(err=>{throw err});
      data.amounts.following_users = await db.FollowUser.count({
        where: {
          FollowerId : req.userId
        }
      }).catch(err=>{throw err});
      data.following_users = await db.sequelize.query(`
        SELECT * FROM follow_users 
        INNER JOIN users
        ON follow_users.user_id = users.id
        WHERE follow_users.follower_id = ${req.userId};
      `,{type: db.Sequelize.QueryTypes.SELECT});
      console.log(data.following_users) 
      res.render("me/follow_users", data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "server has an err" })
    }
  }
  async getTag(req, res){
    try {
      let data = {
        user: null,
        tags: null,
        amounts:{
          posts: 0,
          tags: 0,
          following_users: 0,
          trash_posts: 0
        }
      }
      data.user = await db.User.findOne({
        where: {
          id: req.userId
        }
      }).catch(err => { throw err })
      data.amounts.posts = await db.Post.count({
        where: {
          UserId : req.userId
        }
      }).catch(err=>{throw err});
      data.amounts.tags = await db.Tag.count({
        
      }).catch(err=>{throw err});
      data.amounts.following_users = await db.FollowUser.count({
        where: {
          FollowerId : req.userId
        }
      }).catch(err=>{throw err});
      data.tags = await db.Tag.findAll()
        .catch(err=>{throw err});
      res.render("me/tags", data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "server has an err" })
    }
  }
}
module.exports = new MeController();