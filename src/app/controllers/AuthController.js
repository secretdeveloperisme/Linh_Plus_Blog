const db = require("../models");
const {Op} = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const User = db.User;
const Role = db.Role;
class AuthController {
  async login(req, res){
    try{
      let user = await User.findOne({
        where: {
          username : req.body.username
        }
      })
      if(!user){
        return res.status(400).json({status: "failed", message: "Invalid username"});
      }
      let isValidPassword = bcrypt.compareSync(req.body.password, user.passwordHash);
      if(isValidPassword){
        let token = jwt.sign({userId: user.id},authConfig.secretKey);
        res.cookie("accessToken",token,{
          httpOnly: true,
          maxAge: 24*60*60*1000
        });
        res.redirect("/");
      }
      else{
        res.status(400).json({status:"failed", message:"Invalid password"})
      }
    }
    catch(err){
      console.log(err);
      res.status(500).json({status:"failed", message:"server has an error"})
    }
  }
  async signUp(req, res){
    try{
      let user = await User.create({
        username : req.body.username,
        passwordHash : req.body.password,
        email : req.body.email,
        gender: req.body.gender,
        address : req.body.address,
        biography: req.body.biography,
        dob : new Date(req.body.dob),
        avatar : req.body.avatarPath
      });
      let role = await Role.findOne({
        where: {
          name : "user"
        }
      });
      try{
      await user.setRoles(role);
      }
      catch(err){
        return res.status(500).json(err);
      }
     res.status(200).json({status: "success", message: "Register Account successfully"})
    }
    catch(err){
      console.log(err);
      res.status(500).json({status: "failed", message: "Server has an error"});
    }
    
  }
  async logout(req, res){
    res.clearCookie("accessToken");
    res.json({status:"success", message:"logout successfully"});
  }
}
module.exports = new AuthController()