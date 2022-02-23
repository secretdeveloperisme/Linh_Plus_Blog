const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
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
module.exports = {
  verifyToken
}