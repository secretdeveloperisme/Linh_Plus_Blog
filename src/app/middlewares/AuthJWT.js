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
const checkUserExist = (req, res, next)=>{
  let token = req.cookies.accessToken;
  req.userId = null;
  if(token)
    jwt.verify(token,authConfig.secretKey,(err, decoded)=>{
      if(err){
        res.status(400).json({"status": "failed", "message": "The token is not valid"});
      }
      req.userId = decoded.userId;
    });
  next();
}
const checkHavePrivilege = async (req, res, next)=>{
  req.roles = [];
  let userId = req.userId || null;
  let user = await db.User.findOne({
    where: {
      id : userId
    }
  }).catch(err=>{throw err})
  let roles = await user.getRoles();  
  roles.forEach(role=>{
    if(role.name == ROLES.ADMIN || role.name == ROLES.MODERATOR){
      req.roles.push(role.name);
    }
  })
  next()
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
    
    roles.forEach(role=>{
      if(role.name == ROLES.ADMIN || role.name == ROLES.MODERATOR){
        valid = true;
      }
      role = role.name;
    })
    if(valid){
      next();
    }
    else
      res.render("error/401")
  }
  catch(err){
    console.log(err);
    res.status(500).json({status:"success", message:"server has an err"})
  }
}
module.exports = {
  verifyToken,
  checkUserExist,
  isAdminOrModerator,
  checkHavePrivilege
}