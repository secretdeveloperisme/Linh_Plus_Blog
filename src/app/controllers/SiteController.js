class SiteController{
  index(req, res){
    res.render("site/home",{
      posts: ["hoang", "linh", "plus"]
    });
  }
}
module.exports = new SiteController();