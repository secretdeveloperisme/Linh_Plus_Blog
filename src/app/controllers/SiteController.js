const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth.config");
const db = require("../models");
class SiteController{
  index(req, res){
    let token = req.cookies["accessToken"];
    if(token)
      jwt.verify(token, authConfig.secretKey, (err, decode)=>{
        console.log(decode);
        let userId = decode.userId;
        if(err){
          res.render("site/home",{user: null});
        }
        db.User.findOne({
          where: {
            id : userId
          }
        })
        .then(user=>{
          if(user)
            res.render("site/home", {user})
          else{
            res.render("site/home",{user: null});
          }
        })
        .catch(err=>{
          res.render("site/home",{user: null});
        })
      })
    else{
      res.render("site/home",{user: null});
    }
  }
}
module.exports = new SiteController();