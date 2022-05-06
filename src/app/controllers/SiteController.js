const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth.config");
const db = require("../models");
const postController = require("./PostController");
class SiteController {
  // GET: /
  async index(req, res) {
    try {
      let data = {
        posts: [],
        user: null,
        categories: [],
        tags: [],
        popularPosts: [],
      };
      const numberOfPostsPerPage = 3;
      // check token 
      data.posts = await db.Post.findAll({
        attributes: ["id", "title", "slug", "image", "createdAt"],
        include: [{
          model: db.User,
          attributes: ["username"]
        }, {
          model: db.Category,
          attributes: ["id", "name"]
        }, {
          model: db.Tag,
          attributes: ["id", "name"]
        }],
        order: [["createdAt", "DESC"]],
        limit: [0, numberOfPostsPerPage]
      })
      data.categories = await db.Category.findAll()
        .catch(err => { throw err })
      data.tags = await db.Tag.findAll()
        .catch(err => { throw err })
      let popularPosts = await db.sequelize.query(`
        SELECT id,title,slug, createdAt
        FROM 
          popular_posts
      `, {
          type: db.Sequelize.QueryTypes.SELECT,
          model: db.Post
        })
        .catch(err => { throw err })
      console.log(popularPosts)
      for (let popularPost of popularPosts) {
        popularPost = await db.Post.findOne({
          where: {
            id: popularPost.id
          }
        }).catch(err => { throw err })
        popularPost.tags = await popularPost.getTags()
          .catch(err => { throw err })
        popularPost.author = await popularPost.getUser()
          .catch(err => { throw err })
        data.popularPosts.push(popularPost);
      }
      let token = req.cookies["accessToken"];
      if (token)
        jwt.verify(token, authConfig.secretKey, async (err, decode) => {
          let userId = decode.userId;
          if (err) {
            data.user = null;
          }
          data.user = await db.User.findOne({
            where: {
              id: userId
            }
          }).catch(err => { throw err })
          // get posts without token
          console.log(data.user);
          if (data.user) {
            data.posts = await postController.getFollowedPosts(data.user.id, 0, numberOfPostsPerPage);
          }

          res.render("site/home", data)
        })
      else {
        res.render("site/home", data)
      }
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ status: "failed", message: "server has an err" })
    }
  }
  async syncDB(req, res) {
    try {
      require("../models").sequelize.sync({ force: true })
        .catch(err => console.log(err))
      res.json({ status: "success", message: "sync database successfully" });
    }
    catch (err) {
      res.status(500).json({ status: "failed", message: "syce database failed" });
    }
  }
}
module.exports = new SiteController();