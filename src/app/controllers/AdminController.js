const db = require("../models");
class AdminController {
  async dashboard(req, res){
    try {
      const data = {
        user : null,
        amountOfPosts: 0,
        amountOfTags: 0, 
        amountOfUsers: 0,
        popularPosts : [],
        popularUsers: [],
        postsPerMonthStatistics: []
      }
      data.user = await db.User.findOne({
        where: {
          id : req.userId
        },
        include: [db.Role]
      }).catch(err=>{throw err});
      data.amountOfPosts = await db.Post.count().catch(err=>{throw err})
      data.amountOfTags = await db.Tag.count().catch(err=>{throw err})
      data.amountOfUsers = await db.User.count({
        include :[{
          model: db.Role,
          where: {
            name : "user"
          }
        }]
      }).catch(err=>{throw err});
      data.popularPosts = await db.sequelize.query(`
        SELECT id,title,slug,createdAt,number_of_likes
        FROM 
          popular_posts
      `, {
          type: db.Sequelize.QueryTypes.SELECT
      }).catch(err => { throw err })
      data.popularUsers = await db.sequelize.query(`
        SELECT id, username, avatar, amount_of_followers
        FROM 
          popular_users
      `, {
          type: db.Sequelize.QueryTypes.SELECT
      }).catch(err => { throw err })
      data.postsPerMonthStatistics = await db.sequelize.query(`
        SELECT month, amount_of_posts
        FROM 
          amount_posts_per_month_in_current_year
      `, {
          type: db.Sequelize.QueryTypes.SELECT
      }).catch(err => { throw err })
      data.postsPerMonthStatistics = data.postsPerMonthStatistics.map(value=>{
        return {
          x : value.month+'',
          y : value.amount_of_posts
        }
      })
      res.render("admin/dashboard",data);
    } catch (err) {
      console.log(err)
      res.status(500).json({status:"failed", message:"server has an error"})
    }
  }
}
module.exports = new AdminController();