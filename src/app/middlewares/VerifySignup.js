const db = require("../models");
const User = db.User;
const isExistentEmailOrUserNameOrPhone = (req, res,next)=>{
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then((user)=>{
    if(user){
      return res.status(400).json({status: "failed", message: "Username is duplicate"});
    }
    User.findOne({
      where:{
        email : req.body.email
      }
    })
    .then(user=>{
      if(user){
        return res.status(400).json({status: "failed", message: "Email is duplicate"});
      }
      User.findOne({
        where:{
          phoneNumber : req.body.phoneNumber
        }
      })
      .then(user=>{
        if(user){
          return res.status(400).json({status: "failed", message: "Phone is duplicate"});
        }
        next();
      })
      .catch(err=>{
        res.status(500);
      })

    })
    .catch(err=>{
      res.status(500);
    })
  })
  .catch(err=>{
    res.status(500);
  })
}
module.exports = {
  isExistentEmailOrUserNameOrPhone
}