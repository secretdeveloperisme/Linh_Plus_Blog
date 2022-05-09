const db = require("../models")
class AuthService{
  async isOwnerOfPost(userId, postId){
    try{
      let post = await db.Post.findOne({
        where:{
          id: postId
        }
      }).catch(err=>{throw err});
      if(post.UserId === userId){
        return true;
      }
      else{
        return false;
      }
    }
    catch(err){
      console.log(err);
      return null;
    }
  }
}
module.exports = new AuthService();