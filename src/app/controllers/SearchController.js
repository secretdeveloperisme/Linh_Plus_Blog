const db = require("../models");
const numberOfPostsPerPage = 3
class SearchController{
  static async searchPostViaPage(query, page){
    let posts = [];
    let start = (page*numberOfPostsPerPage) - numberOfPostsPerPage;
    let searchSql = `
        select posts.id, title, slug,
          image, posts.createdAt,
          users.username as user_username, users.avatar as user_avatar, amount_likes(posts.id) as amount_likes,
          amount_comments(posts.id) as amount_comments
          from posts 
          inner join users on posts.user_id = users.id
          where match(title)
          against ("${query}")
        union distinct
        select posts.id, title, slug,
          image, posts.createdAt,
          users.username as user_username, users.avatar as user_avatar, amount_likes(posts.id) as amount_likes,
          amount_comments(posts.id) as amount_comments
          from tags 
          inner join post_tags on tags.id = post_tags.tag_id
          inner join posts on post_tags.post_id = posts.id
          inner join users on posts.user_id = users.id
          where match(tags.name)
          against ("${query}")
        limit ${start},${numberOfPostsPerPage+1}
      `;
      posts = await db.sequelize.query(
        searchSql, {
          type: db.Sequelize.QueryTypes.SELECT,
          model: db.Post
        }
      );
      let myPosts = [];
      for(let i = 0; i< posts.length; i++){
        posts[i]["dataValues"].tags = await posts[i].getTags().catch(err=>{throw err})
        myPosts.push({...posts[i].dataValues})
      }
      return myPosts;
  }
  async searchPosts(req, res){
    try{
      let posts = []
      if(req.query.page == undefined || req.query.page < 1)
        req.query.page = 1
      posts = await SearchController.searchPostViaPage(req.query.query, req.query.page)
      res.json({status:"success", message:"search posts successfully!", posts})
    }
    catch(err){
      console.log(err);
      res.status(500).json({status: "failed", message: "server has an err"}) 
    }
  }
  async getSearchPosts(req, res){
    try{
      let data = {
        user : {},
        posts : []
      }
      if(req.query.page == undefined || req.query.page < 1)
        req.query.page = 1
      data.posts = await SearchController.searchPostViaPage(req.query.query, req.query.page);
      // console.log(data.posts)
      res.render("search/posts", data)
    }
    catch(err){
      console.log(err);
      res.status(500).json({status: "failed", message: "server has an err"}) 
    }
  }
}
module.exports = new SearchController();