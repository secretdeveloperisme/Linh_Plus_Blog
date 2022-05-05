const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const db = require("../models");
const ROLES = {
  ADMIN : "admin",
  MODERATOR: "moderator",
  USER : "user"
}
const verifyToken = (req, res, next)=>{
  let token = req.cookies.accessToken;
  if(!token){
    return res.status(400).json({"status": "failed", "message": "No token provided"});
  }
  jwt.verify(token,authConfig.secretKey,(err, decoded)=>{
    if(err){
      res.status(400).json({"status": "failed", "message": "The token is not valid"});
    }
    req.userId = decoded.userId;
    next();
  });
} 
const isAdminOrModerator = async (req, res, next)=>{
  try{
    let userId = req.userId || null;
    let user = await db.User.findOne({
      where: {
        id : userId
      }
    }).catch(err=>{throw err})
    let roles = await user.getRoles();
    let valid = false;
    console.log(roles)
    roles.forEach(role=>{
      console.log(role.name)
      if(role.name == ROLES.ADMIN || role.name == ROLES.MODERATOR){
        console.log(role.name)
        valid = true;
      }
    })
    console.log(valid)
    if(valid){
      next();
    }
    else
      res.status(403).json({status:"failed", message:"you do not have privilege"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({status:"success", message:"server has an err"})
  }
}
module.exports = {
  verifyToken,
  isAdminOrModerator
}