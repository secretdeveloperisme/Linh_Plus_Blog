const db = require("../models");

class FollowController {
  async follow(req, res){
    try {
      if(req.body.action && req.body.userId){
        if(req.body.action === "follow"){
         await db.FollowUser.create({
           UserId : req.body.userId,
           FollowerId : req.userId
         })
          .catch(err=>{throw err});
        }
        else if(req.body.action === "unfollow"){
          await db.FollowUser.destroy({
            where: {
              UserId : req.body.userId,
              FollowerId : req.userId
            },
            force: true
          })
            .catch(err=>{throw err});
        }
      }
      else{ 
        return res.status(400).json({status:"failed", message:"action or body is empty"})
      }
      res.json({status:"success", message:`${req.body.action} successfully`});
    } catch (err) {
      console.log(err);
      res.status(500).json({status:"failed", message:"server has an error"})
    }
  }
}
module.exports = new FollowController();